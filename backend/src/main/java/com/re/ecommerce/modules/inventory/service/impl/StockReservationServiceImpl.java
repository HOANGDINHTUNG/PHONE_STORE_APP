package com.re.ecommerce.modules.inventory.service.impl;

import com.re.ecommerce.common.exception.UnprocessableEntityException;
import com.re.ecommerce.modules.inventory.entity.StockReservation;
import com.re.ecommerce.modules.inventory.entity.StockTransaction;
import com.re.ecommerce.modules.inventory.entity.Warehouse;
import com.re.ecommerce.modules.inventory.entity.WarehouseInventory;
import com.re.ecommerce.modules.inventory.entity.WarehouseInventoryId;
import com.re.ecommerce.modules.inventory.entity.enums.ReservationStatus;
import com.re.ecommerce.modules.inventory.entity.enums.StockReferenceType;
import com.re.ecommerce.modules.inventory.entity.enums.StockTransactionType;
import com.re.ecommerce.modules.inventory.entity.enums.WarehouseStatus;
import com.re.ecommerce.modules.inventory.repository.StockReservationRepository;
import com.re.ecommerce.modules.inventory.repository.StockTransactionRepository;
import com.re.ecommerce.modules.inventory.repository.WarehouseInventoryRepository;
import com.re.ecommerce.modules.inventory.repository.WarehouseRepository;
import com.re.ecommerce.modules.inventory.service.StockReservationService;
import com.re.ecommerce.modules.order.entity.Order;
import com.re.ecommerce.modules.order.entity.OrderItem;
import com.re.ecommerce.modules.order.entity.Order;
import com.re.ecommerce.modules.order.enums.OrderStatus;
import com.re.ecommerce.modules.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StockReservationServiceImpl implements StockReservationService {
    private static final int RESERVATION_MINUTES = 30;

    private final WarehouseRepository warehouseRepository;
    private final WarehouseInventoryRepository warehouseInventoryRepository;
    private final StockReservationRepository stockReservationRepository;
    private final StockTransactionRepository stockTransactionRepository;
    private final OrderRepository orderRepository;

    @Override
    @Transactional
    public void reserveForOrder(Order order, List<OrderItem> items) {
        Warehouse warehouse = warehouseRepository.findAll().stream()
                .filter(candidate -> candidate.getStatus() == WarehouseStatus.ACTIVE)
                .sorted(Comparator.comparingInt((Warehouse candidate) -> locationScore(candidate, order)).reversed())
                .filter(candidate -> canReserve(candidate, items))
                .findFirst()
                .orElseThrow(() -> new UnprocessableEntityException("INSUFFICIENT_STOCK",
                        "Không có kho đang hoạt động đủ hàng cho toàn bộ đơn."));

        for (OrderItem item : items) {
            WarehouseInventory inventory = warehouseInventoryRepository.findByIdWithLock(
                    new WarehouseInventoryId(warehouse.getId(), item.getProductVariant().getId())).orElseThrow();
            if (availableQuantity(inventory) < item.getQuantity()) {
                throw new UnprocessableEntityException("INSUFFICIENT_STOCK",
                        "Tồn kho vừa thay đổi, không còn đủ hàng cho SKU " + item.getSku() + ".");
            }
            int before = inventory.getReservedQuantity();
            inventory.setReservedQuantity(before + item.getQuantity());
            warehouseInventoryRepository.save(inventory);

            StockReservation reservation = new StockReservation();
            reservation.setOrderId(order.getId());
            reservation.setOrderItemId(item.getId());
            reservation.setWarehouse(warehouse);
            reservation.setProductVariant(item.getProductVariant());
            reservation.setQuantity(item.getQuantity());
            reservation.setStatus(ReservationStatus.ACTIVE);
            reservation.setExpiresAt(LocalDateTime.now().plusMinutes(RESERVATION_MINUTES));
            stockReservationRepository.save(reservation);
            recordTransaction(warehouse, item, StockTransactionType.RESERVE, before, before + item.getQuantity(), order.getId(), "Giữ hàng cho đơn " + order.getOrderCode());
        }
    }

    @Override
    @Transactional
    public void releaseForOrder(UUID orderId, String reason) {
        for (StockReservation reservation : stockReservationRepository.findByOrderId(orderId)) {
            if (reservation.getStatus() != ReservationStatus.ACTIVE) continue;
            release(reservation, ReservationStatus.RELEASED, reason);
        }
    }

    @Override
    @Scheduled(fixedDelayString = "${inventory.reservation.cleanup-ms:60000}")
    @Transactional
    public void releaseExpiredReservations() {
        var expiredReservations = stockReservationRepository
                .findByStatusAndExpiresAtBefore(ReservationStatus.ACTIVE, LocalDateTime.now());
        for (StockReservation reservation : expiredReservations) {
            release(reservation, ReservationStatus.EXPIRED, "Hết thời gian giữ hàng");
        }
        expiredReservations.stream().map(StockReservation::getOrderId).distinct().forEach(this::cancelExpiredPendingOrder);
    }

    private void cancelExpiredPendingOrder(UUID orderId) {
        orderRepository.findById(orderId).ifPresent(order -> {
            if (order.getStatus() != OrderStatus.PENDING) return;
            order.setStatus(OrderStatus.CANCELLED);
            order.setCancelledAt(LocalDateTime.now());
            order.setCancelReason("Quá thời gian thanh toán/xác nhận đơn hàng");
            order.setNote((order.getNote() == null ? "" : order.getNote() + " | ")
                    + "Tự động hủy do quá thời gian giữ hàng");
            orderRepository.save(order);
        });
    }

    @Override
    @Transactional
    public void confirmForFulfillment(UUID orderId) {
        for (StockReservation reservation : stockReservationRepository.findByOrderId(orderId)) {
            if (reservation.getStatus() == ReservationStatus.ACTIVE) {
                reservation.setExpiresAt(LocalDateTime.now().plusDays(14));
                stockReservationRepository.save(reservation);
            }
        }
    }

    private void release(StockReservation reservation, ReservationStatus newStatus, String reason) {
        WarehouseInventory inventory = warehouseInventoryRepository.findByIdWithLock(
                new WarehouseInventoryId(reservation.getWarehouse().getId(), reservation.getProductVariant().getId())).orElseThrow();
        int before = inventory.getReservedQuantity();
        int after = Math.max(0, before - reservation.getQuantity());
        inventory.setReservedQuantity(after);
        warehouseInventoryRepository.save(inventory);
        reservation.setStatus(newStatus);
        reservation.setReleasedAt(LocalDateTime.now());
        reservation.setReleaseReason(reason);
        stockReservationRepository.save(reservation);
        recordTransaction(reservation.getWarehouse(), reservation.getProductVariant(), StockTransactionType.RELEASE,
                before, after, reservation.getOrderId(), "Giải phóng giữ hàng: " + reason);
    }

    private boolean canReserve(Warehouse warehouse, List<OrderItem> items) {
        return items.stream().allMatch(item -> warehouseInventoryRepository
                .findById(new WarehouseInventoryId(warehouse.getId(), item.getProductVariant().getId()))
                .map(this::availableQuantity).orElse(0) >= item.getQuantity());
    }

    private int locationScore(Warehouse warehouse, Order order) {
        String address = (warehouse.getName() + " " + warehouse.getAddress()).toLowerCase();
        String province = order.getShippingProvinceName() == null ? "" : order.getShippingProvinceName().toLowerCase();
        return !province.isBlank() && address.contains(province) ? 1 : 0;
    }

    private int availableQuantity(WarehouseInventory inventory) {
        return inventory.getAvailableQuantity() == null
                ? inventory.getOnHandQuantity() - inventory.getReservedQuantity()
                : inventory.getAvailableQuantity();
    }

    private void recordTransaction(Warehouse warehouse, OrderItem item, StockTransactionType type,
                                   int reservedBefore, int reservedAfter, UUID referenceId, String reason) {
        recordTransaction(warehouse, item.getProductVariant(), type, reservedBefore, reservedAfter, referenceId, reason);
    }

    private void recordTransaction(Warehouse warehouse, com.re.ecommerce.modules.catalog.entity.ProductVariant variant,
                                   StockTransactionType type, int reservedBefore, int reservedAfter, UUID referenceId, String reason) {
        StockTransaction transaction = new StockTransaction();
        transaction.setWarehouse(warehouse);
        transaction.setProductVariant(variant);
        transaction.setTransactionType(type);
        transaction.setQuantity(Math.abs(reservedAfter - reservedBefore));
        transaction.setOnHandBefore(warehouseInventoryRepository.findById(new WarehouseInventoryId(warehouse.getId(), variant.getId())).map(WarehouseInventory::getOnHandQuantity).orElse(0));
        transaction.setOnHandAfter(transaction.getOnHandBefore());
        transaction.setReservedBefore(reservedBefore);
        transaction.setReservedAfter(reservedAfter);
        transaction.setReferenceType(StockReferenceType.SALES_ORDER);
        transaction.setReferenceId(referenceId);
        transaction.setReason(reason);
        transaction.setCreatedBy("system");
        stockTransactionRepository.save(transaction);
    }
}
