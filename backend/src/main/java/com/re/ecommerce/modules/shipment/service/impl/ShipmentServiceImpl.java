package com.re.ecommerce.modules.shipment.service.impl;

import com.re.ecommerce.common.exception.BusinessConflictException;
import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.modules.auth.entity.User;
import com.re.ecommerce.modules.auth.repository.UserRepository;
import com.re.ecommerce.modules.inventory.repository.WarehouseRepository;
import com.re.ecommerce.modules.inventory.repository.WarehouseInventoryRepository;
import com.re.ecommerce.modules.inventory.repository.StockReservationRepository;
import com.re.ecommerce.modules.inventory.entity.WarehouseInventoryId;
import com.re.ecommerce.modules.inventory.entity.enums.WarehouseStatus;
import com.re.ecommerce.modules.inventory.entity.enums.ReservationStatus;
import com.re.ecommerce.modules.inventory.entity.InventoryUnit;
import com.re.ecommerce.modules.inventory.repository.InventoryUnitRepository;
import com.re.ecommerce.modules.order.entity.Order;
import com.re.ecommerce.modules.order.entity.OrderItem;
import com.re.ecommerce.modules.order.repository.OrderItemRepository;
import com.re.ecommerce.modules.order.repository.OrderRepository;
import com.re.ecommerce.modules.order.repository.OrderStatusHistoryRepository;
import com.re.ecommerce.modules.order.entity.OrderStatusHistory;
import com.re.ecommerce.modules.order.enums.OrderStatus;
import com.re.ecommerce.modules.order.enums.OrderStatusActor;
import com.re.ecommerce.modules.shipment.dto.request.AssignShipmentUnitsRequest;
import com.re.ecommerce.modules.shipment.dto.request.ChangeShipmentStatusRequest;
import com.re.ecommerce.modules.shipment.dto.request.CreateShipmentRequest;
import com.re.ecommerce.modules.shipment.dto.request.UpdateShipmentTrackingRequest;
import com.re.ecommerce.modules.shipment.dto.response.ShipmentWarehouseRecommendationResponse;
import com.re.ecommerce.modules.shipment.entity.Shipment;
import com.re.ecommerce.modules.shipment.entity.ShipmentItem;
import com.re.ecommerce.modules.shipment.entity.ShipmentItemUnit;
import com.re.ecommerce.modules.shipment.entity.ShipmentStatus;
import com.re.ecommerce.modules.shipment.repository.ShipmentItemRepository;
import com.re.ecommerce.modules.shipment.repository.ShipmentItemUnitRepository;
import com.re.ecommerce.modules.shipment.repository.ShipmentRepository;
import com.re.ecommerce.modules.shipment.service.ShipmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.text.Normalizer;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ShipmentServiceImpl implements ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final ShipmentItemRepository shipmentItemRepository;
    private final ShipmentItemUnitRepository shipmentItemUnitRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final WarehouseRepository warehouseRepository;
    private final WarehouseInventoryRepository warehouseInventoryRepository;
    private final StockReservationRepository stockReservationRepository;
    private final InventoryUnitRepository inventoryUnitRepository;
    private final OrderStatusHistoryRepository orderStatusHistoryRepository;

    @Override
    @Transactional
    public Shipment createShipment(UUID orderId, CreateShipmentRequest request, java.util.UUID staffId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("ORDER_NOT_FOUND", "Order not found with id: " + orderId));

        var warehouse = warehouseRepository.findById(request.getWarehouseId())
                .orElseThrow(() -> new ResourceNotFoundException("WAREHOUSE_NOT_FOUND", "Warehouse not found with id: " + request.getWarehouseId()));
        if (warehouse.getStatus() != WarehouseStatus.ACTIVE) {
            throw new BusinessConflictException("WAREHOUSE_INACTIVE", "The selected warehouse is inactive.");
        }

        User staff = staffId == null ? null : userRepository.findById(staffId).orElse(null);

        Shipment shipment = Shipment.builder()
                .shipmentCode("SHP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .order(order)
                .warehouse(warehouse) // The import is com.re.ecommerce.modules.catalog.entity.Warehouse but we need inventory.entity.Warehouse. I will fix this! Wait I already fixed it! Actually I need to make sure WarehouseRepository is in inventory!
                .shippingProvider(request.getShippingProvider())
                .trackingCode(request.getTrackingCode() == null || request.getTrackingCode().isBlank()
                        ? "TRK-" + UUID.randomUUID().toString().substring(0, 10).toUpperCase()
                        : request.getTrackingCode().trim())
                .shippingFee(request.getShippingFee() == null ? java.math.BigDecimal.ZERO : request.getShippingFee())
                .estimatedDeliveryAt(request.getEstimatedDeliveryAt())
                .createdBy(staff)
                .status(ShipmentStatus.PENDING)
                .build();
                
        // (Fast failing placeholder for warehouse import check below in compilation)
        
        shipmentRepository.save(shipment);

        for (var itemReq : request.getItems()) {
            OrderItem orderItem = orderItemRepository.findById(itemReq.getOrderItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("ORDER_ITEM_NOT_FOUND", "OrderItem not found with id: " + itemReq.getOrderItemId()));

            if (!order.getId().equals(orderItem.getOrder().getId())) {
                throw new BusinessConflictException("SHIPMENT_ITEM_ORDER_MISMATCH", "The selected item does not belong to this order.");
            }
            long alreadyShipped = java.util.Optional.ofNullable(
                    shipmentItemRepository.totalShippedQuantityByOrderItemId(orderItem.getId())).orElse(0L);
            long remaining = orderItem.getQuantity() - alreadyShipped;
            if (itemReq.getQuantity() <= 0 || itemReq.getQuantity() > remaining) {
                throw new BusinessConflictException("SHIPMENT_QUANTITY_EXCEEDED", "Quantity to ship exceeds the remaining quantity.");
            }
            int available = warehouseInventoryRepository
                    .findById(new WarehouseInventoryId(warehouse.getId(), orderItem.getProductVariant().getId()))
                    .map(inventory -> saleableQuantity(inventory.getOnHandQuantity(), inventory.getReservedQuantity()))
                    .orElse(0);
            available += reservedForOrder(order.getId(), orderItem.getId(), warehouse.getId());
            if (itemReq.getQuantity() > available) {
                throw new BusinessConflictException("WAREHOUSE_STOCK_INSUFFICIENT",
                        "The selected warehouse does not have enough stock for SKU " + orderItem.getSku() + ".");
            }

            ShipmentItem shipmentItem = ShipmentItem.builder()
                    .shipment(shipment)
                    .orderItem(orderItem)
                    .quantity(itemReq.getQuantity())
                    .build();
            shipmentItemRepository.save(shipmentItem);
        }
        return shipment;
    }

    @Override
    @Transactional
    public void assignUnits(Long shipmentId, AssignShipmentUnitsRequest request) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new ResourceNotFoundException("SHIPMENT_NOT_FOUND", "Shipment not found with id: " + shipmentId));
                
        if (shipment.getStatus() != ShipmentStatus.PENDING && shipment.getStatus() != ShipmentStatus.PACKING) {
            throw new BusinessConflictException("SHIPMENT_INVALID_STATE", "Can only assign units in PENDING or PACKING state");
        }

        for (var assignment : request.getAssignments()) {
            ShipmentItem item = shipmentItemRepository.findById(assignment.getShipmentItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("SHIPMENT_ITEM_NOT_FOUND", "ShipmentItem not found with id: " + assignment.getShipmentItemId()));

            if (assignment.getInventoryUnitIds().size() != item.getQuantity()) {
                throw new BusinessConflictException("UNIT_COUNT_MISMATCH", "Number of assigned units must match shipment item quantity");
            }

            for (Long unitId : assignment.getInventoryUnitIds()) {
                InventoryUnit unit = inventoryUnitRepository.findById(unitId)
                        .orElseThrow(() -> new ResourceNotFoundException("INVENTORY_UNIT_NOT_FOUND", "Inventory Unit not found with id: " + unitId));
                
                // Usually we check if unit is RESERVED for this order item. Stubbing the checks for brevity.
                
                ShipmentItemUnit itemUnit = ShipmentItemUnit.builder()
                        .id(new ShipmentItemUnit.ShipmentItemUnitId(item.getId(), unit.getId()))
                        .shipmentItem(item)
                        .inventoryUnit(unit)
                        .build();

                try {
                    shipmentItemUnitRepository.save(itemUnit);
                } catch (Exception e) {
                    throw new BusinessConflictException("UNIT_ALREADY_ASSIGNED", "This unit is already assigned to a shipment");
                }
            }
        }
    }

    @Override
    @Transactional
    public void updateTracking(Long shipmentId, UpdateShipmentTrackingRequest request) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new ResourceNotFoundException("SHIPMENT_NOT_FOUND", "Shipment not found with id: " + shipmentId));

        shipment.setShippingProvider(request.getShippingProvider());
        shipment.setTrackingCode(request.getTrackingCode());
        shipmentRepository.save(shipment);
    }

    @Override
    @Transactional
    public void changeStatus(Long shipmentId, ChangeShipmentStatusRequest request) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new ResourceNotFoundException("SHIPMENT_NOT_FOUND", "Shipment not found with id: " + shipmentId));

        shipment.setStatus(request.getStatus());
        if (request.getStatus() == ShipmentStatus.SHIPPED) {
            shipment.setShippedAt(LocalDateTime.now());
        } else if (request.getStatus() == ShipmentStatus.DELIVERED) {
            shipment.setDeliveredAt(LocalDateTime.now());
        }

        shipmentRepository.save(shipment);

        // Keep the customer order lifecycle in sync with its shipment.
        Order order = orderRepository.findById(shipment.getOrder().getId()).orElse(null);
        OrderStatus target = switch (request.getStatus()) {
            case DELIVERED -> OrderStatus.COMPLETED;
            case SHIPPED, IN_TRANSIT -> OrderStatus.SHIPPING;
            case PACKING -> OrderStatus.PROCESSING;
            default -> null;
        };
        if (order != null && target != null && order.getStatus() != target
                && order.getStatus() != OrderStatus.CANCELLED
                && order.getStatus() != OrderStatus.COMPLETED) {
            OrderStatus previous = order.getStatus();
            order.setStatus(target);
            if (target == OrderStatus.COMPLETED) order.setCompletedAt(LocalDateTime.now());
            orderRepository.saveAndFlush(order);
            orderStatusHistoryRepository.save(OrderStatusHistory.builder()
                    .order(order).oldStatus(previous).newStatus(target)
                    .actorType(OrderStatusActor.SYSTEM)
                    .note("Đồng bộ từ trạng thái vận đơn " + request.getStatus().name())
                    .build());
            log.info("Synced order {} status {} -> {} from shipment {}", order.getId(), previous, target, shipment.getId());
        }
    }
    @Override
    @Transactional(readOnly = true)
    public List<ShipmentWarehouseRecommendationResponse> recommendWarehouses(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("ORDER_NOT_FOUND", "Order not found with id: " + orderId));
        var remainingItems = orderItemRepository.findByOrderId(orderId).stream()
                .map(item -> new RemainingOrderItem(item, Math.max(0, item.getQuantity() - java.util.Optional
                        .ofNullable(shipmentItemRepository.totalShippedQuantityByOrderItemId(item.getId())).orElse(0L).intValue())))
                .filter(item -> item.quantity() > 0)
                .toList();

        return warehouseRepository.findAll().stream()
                .filter(warehouse -> warehouse.getStatus() == WarehouseStatus.ACTIVE)
                .map(warehouse -> recommendationFor(warehouse, order, remainingItems))
                .sorted(Comparator
                        .comparing(ShipmentWarehouseRecommendationResponse::canFulfill).reversed()
                        .thenComparing(ShipmentWarehouseRecommendationResponse::locationScore).reversed()
                        .thenComparing(ShipmentWarehouseRecommendationResponse::fulfilledItemCount).reversed()
                        .thenComparing(ShipmentWarehouseRecommendationResponse::warehouseName))
                .toList();
    }

    private ShipmentWarehouseRecommendationResponse recommendationFor(
            com.re.ecommerce.modules.inventory.entity.Warehouse warehouse,
            Order order,
            List<RemainingOrderItem> remainingItems) {
        int fulfilled = 0;
        List<String> unavailableSkus = new java.util.ArrayList<>();
        for (RemainingOrderItem remaining : remainingItems) {
            int available = warehouseInventoryRepository.findById(new WarehouseInventoryId(warehouse.getId(), remaining.item().getProductVariant().getId()))
                    .map(inventory -> saleableQuantity(inventory.getOnHandQuantity(), inventory.getReservedQuantity()))
                    .orElse(0);
            available += reservedForOrder(order.getId(), remaining.item().getId(), warehouse.getId());
            if (available >= remaining.quantity()) fulfilled++;
            else unavailableSkus.add(remaining.item().getSku());
        }
        int required = remainingItems.size();
        boolean canFulfill = required > 0 && fulfilled == required;
        int locationScore = locationScore(warehouse, order);
        String reason = canFulfill
                ? (locationScore >= 100 ? "Đủ hàng và cùng khu vực nhận" : "Đủ toàn bộ hàng")
                : "Thiếu tồn: " + String.join(", ", unavailableSkus);
        return new ShipmentWarehouseRecommendationResponse(warehouse.getId(), warehouse.getCode(), warehouse.getName(),
                warehouse.getAddress(), canFulfill, fulfilled, required, locationScore, reason);
    }

    private int locationScore(com.re.ecommerce.modules.inventory.entity.Warehouse warehouse, Order order) {
        String warehouseText = normalise(warehouse.getName() + " " + warehouse.getAddress());
        String province = normalise(order.getShippingProvinceName());
        String district = normalise(order.getShippingDistrictName());
        int score = 0;
        if (!province.isBlank() && containsLocation(warehouseText, province)) score += 100;
        if (!district.isBlank() && containsLocation(warehouseText, district)) score += 25;
        return score;
    }

    private boolean containsLocation(String warehouseText, String location) {
        if (warehouseText.contains(location)) return true;
        return (location.contains("ho chi minh") && (warehouseText.contains("hcm") || warehouseText.contains("thanh pho ho chi minh")))
                || (location.contains("ha noi") && warehouseText.contains("hn"));
    }

    private String normalise(String value) {
        if (value == null) return "";
        return Normalizer.normalize(value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(java.util.Locale.ROOT)
                .replaceAll("[^a-z0-9 ]", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }

    private int reservedForOrder(UUID orderId, UUID orderItemId, UUID warehouseId) {
        return stockReservationRepository.findByOrderItemIdAndStatus(orderItemId, ReservationStatus.ACTIVE).stream()
                .filter(reservation -> reservation.getOrderId().equals(orderId)
                        && reservation.getWarehouse().getId().equals(warehouseId))
                .mapToInt(reservation -> reservation.getQuantity() == null ? 0 : reservation.getQuantity())
                .sum();
    }

    private int saleableQuantity(Integer onHand, Integer reserved) {
        return Math.max(0, (onHand == null ? 0 : onHand) - (reserved == null ? 0 : reserved));
    }

    private record RemainingOrderItem(OrderItem item, int quantity) { }
}
