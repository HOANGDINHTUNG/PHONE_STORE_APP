package com.re.ecommerce.modules.order.service.impl;

import com.re.ecommerce.common.dto.PagedResponse;
import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.common.exception.BusinessConflictException;
import com.re.ecommerce.common.exception.UnprocessableEntityException;
import com.re.ecommerce.modules.auth.entity.User;
import com.re.ecommerce.modules.cart.entity.Cart;
import com.re.ecommerce.modules.cart.entity.Coupon;
import com.re.ecommerce.modules.cart.dto.request.CartItemRequest;
import com.re.ecommerce.modules.cart.dto.response.CartResponse;
import com.re.ecommerce.modules.cart.repository.CartRepository;
import com.re.ecommerce.modules.cart.repository.CouponRepository;
import com.re.ecommerce.modules.catalog.entity.ProductVariant;
import com.re.ecommerce.modules.catalog.entity.ProductImage;
import com.re.ecommerce.modules.catalog.repository.ProductImageRepository;
import com.re.ecommerce.modules.catalog.repository.ProductVariantRepository;
import com.re.ecommerce.modules.customer.entity.ShippingAddress;
import com.re.ecommerce.modules.customer.repository.ShippingAddressRepository;
import com.re.ecommerce.modules.auth.repository.CustomerProfileRepository;
import com.re.ecommerce.modules.auth.entity.CustomerProfile;

import com.re.ecommerce.modules.order.dto.request.CheckoutRequest;
import com.re.ecommerce.modules.order.dto.request.CheckoutItemRequest;
import com.re.ecommerce.modules.order.dto.response.OrderItemResponse;
import com.re.ecommerce.modules.order.dto.response.OrderResponse;
import com.re.ecommerce.modules.order.entity.CouponUsage;
import com.re.ecommerce.modules.order.entity.Order;
import com.re.ecommerce.modules.order.entity.OrderItem;
import com.re.ecommerce.modules.order.entity.OrderStatusHistory;
import com.re.ecommerce.modules.order.enums.CouponUsageStatus;
import com.re.ecommerce.modules.order.enums.OrderSourceChannel;
import com.re.ecommerce.modules.order.enums.OrderStatus;
import com.re.ecommerce.modules.order.enums.OrderStatusActor;
import com.re.ecommerce.modules.order.repository.CouponUsageRepository;
import com.re.ecommerce.modules.order.repository.OrderItemRepository;
import com.re.ecommerce.modules.order.repository.OrderRepository;
import com.re.ecommerce.modules.order.repository.OrderStatusHistoryRepository;
import com.re.ecommerce.modules.order.service.OrderService;
import com.re.ecommerce.modules.cart.service.CartService;
import com.re.ecommerce.modules.payment.entity.Payment;
import com.re.ecommerce.modules.payment.repository.PaymentRepository;
import com.re.ecommerce.modules.inventory.repository.WarehouseInventoryRepository;
import com.re.ecommerce.modules.inventory.entity.enums.WarehouseStatus;
import com.re.ecommerce.modules.inventory.service.StockReservationService;
import com.re.ecommerce.modules.shipment.entity.Shipment;
import com.re.ecommerce.modules.shipment.entity.ShipmentStatus;
import com.re.ecommerce.modules.shipment.repository.ShipmentRepository;
import com.re.ecommerce.modules.system.entity.Notification;
import com.re.ecommerce.modules.system.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderStatusHistoryRepository orderStatusHistoryRepository;
    private final CouponUsageRepository couponUsageRepository;
    private final CustomerProfileRepository customerProfileRepository;
    
    private final CartRepository cartRepository;
    private final CouponRepository couponRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductImageRepository productImageRepository;
    
    private final ShippingAddressRepository shippingAddressRepository;
    private final CartService cartService;
    private final PaymentRepository paymentRepository;
    private final WarehouseInventoryRepository warehouseInventoryRepository;
    private final StockReservationService stockReservationService;
    private final com.re.ecommerce.modules.cart.repository.UserVoucherRepository userVoucherRepository;
    private final ShipmentRepository shipmentRepository;
    private final NotificationRepository notificationRepository;
    

    @Override
    @Transactional
    public OrderResponse checkout(User currentUser, String guestToken, CheckoutRequest request) {
        log.info("Starting checkout process with idempotency: {}", request.idempotencyKey());
        
        byte[] idempotencyHash = hashIdempotency(request.idempotencyKey());
        Optional<Order> existingOrder = orderRepository.findByIdempotencyKeyHash(idempotencyHash);
        if (existingOrder.isPresent()) {
            log.info("Order already exists for idempotency key, ignoring and returning 200 (idempotent replay)");
            return toResponse(existingOrder.get(), orderItemRepository.findByOrderId(existingOrder.get().getId()));
        }
        
        byte[] guestTokenHash = null;
        if (currentUser == null && guestToken != null && !guestToken.isBlank()) {
            guestTokenHash = hashIdempotency(guestToken);
        }
        
        Cart cart = null;
        boolean hasDirectItems = request.items() != null && !request.items().isEmpty();
        if (!hasDirectItems) {
            cart = getCart(currentUser, guestTokenHash);
            if (cart.getItems() == null || cart.getItems().isEmpty()) {
                throw new BusinessConflictException("CART_EMPTY", "Cart is empty");
            }
        }
        
        Order order = buildOrderSnapshot(currentUser, request);
        order.setIdempotencyKeyHash(idempotencyHash);
        
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;
        
        // Prepare items array
        List<UUID> variantIds = new ArrayList<>();
        if (hasDirectItems) {
            variantIds = request.items().stream().map(CheckoutItemRequest::productVariantId).toList();
        } else {
            variantIds = cart.getItems().stream().map(item -> item.getProductVariant().getId()).toList();
        }
        
        java.util.Map<UUID, ProductVariant> variantMap = productVariantRepository.findAllById(variantIds).stream()
                .collect(Collectors.toMap(ProductVariant::getId, v -> v));
                
        int itemCount = hasDirectItems ? request.items().size() : cart.getItems().size();
        
        for (int i = 0; i < itemCount; i++) {
            UUID variantId = hasDirectItems ? request.items().get(i).productVariantId() : cart.getItems().get(i).getProductVariant().getId();
            int demand = hasDirectItems ? request.items().get(i).quantity() : cart.getItems().get(i).getQuantity();
            
            ProductVariant variant = Optional.ofNullable(variantMap.get(variantId))
                    .orElseThrow(() -> new ResourceNotFoundException("RESOURCE_NOT_FOUND", "Variant not found"));
            
            if (variant.getProduct().getPublicationStatus() != com.re.ecommerce.modules.catalog.entity.PublicationStatus.ACTIVE || 
                variant.getStatus() != com.re.ecommerce.modules.catalog.entity.VariantStatus.ACTIVE || 
                variant.getProduct().getDeletedAt() != null) {
                throw new UnprocessableEntityException("VALIDATION_ERROR", "Product variant is not saleable: " + variant.getSku());
            }

            BigDecimal price = variant.getSalePrice() != null ? variant.getSalePrice() : variant.getListPrice();
            String imageUrl = resolveVariantImageUrl(variant);
            
            BigDecimal lineTotal = price.multiply(BigDecimal.valueOf(demand));
            subtotal = subtotal.add(lineTotal);
            
            // NOTE: In an enterprise schema, you should do reserve logic here:
            // Locate best warehouse, deduct inventory, and insert StockReservation.
            // For P0, we assume the system bypasses this if warehouse routing is not complex
            // Or we just fetch the first available `WarehouseInventory`.
            
            OrderItem item = OrderItem.builder()
                    .order(order)
                    .product(variant.getProduct())
                    .productVariant(variant)
                    .productName(variant.getProduct().getName())
                    .variantName(variant.getName())
                    .sku(variant.getSku())
                    .color(variant.getColor())
                    .ram(variant.getRamGb() != null ? String.valueOf(variant.getRamGb()) : null)
                    .storage(variant.getStorageGb() != null ? String.valueOf(variant.getStorageGb()) : null)
                    .imageUrl(imageUrl)
                    .warrantyMonths(variant.getWarrantyMonths() != null ? variant.getWarrantyMonths() : 0)
                    .unitPrice(price)
                    .quantity(demand)
                    .discountAmount(BigDecimal.ZERO) // Coupon distributed later if requested
                    .build();
            orderItems.add(item);
        }
        
        order.setSubtotalAmount(subtotal);
        order.setShippingFee(BigDecimal.ZERO); // Static shipping for now
        
        BigDecimal discount = BigDecimal.ZERO;
        if (request.couponCode() != null && !request.couponCode().isBlank()) {
             Coupon coupon = couponRepository.findByCodeIgnoreCase(request.couponCode().trim())
                     .orElseThrow(() -> new ResourceNotFoundException("RESOURCE_NOT_FOUND", "Mã giảm giá không tồn tại"));
             if (coupon.getStatus() != com.re.ecommerce.modules.cart.entity.CouponStatus.ACTIVE
                     || coupon.getStartTime().isAfter(LocalDateTime.now()) || coupon.getEndTime().isBefore(LocalDateTime.now())) {
                 throw new UnprocessableEntityException("VALIDATION_ERROR", "Mã giảm giá đã hết hạn hoặc không khả dụng");
             }
             if (coupon.getTotalUsageLimit() != null && coupon.getUsedCount() >= coupon.getTotalUsageLimit()) {
                 throw new UnprocessableEntityException("VALIDATION_ERROR", "Mã giảm giá đã hết số lần sử dụng");
             }
             if (coupon.getMinimumOrderValue() != null && coupon.getMinimumOrderValue().compareTo(subtotal) > 0) {
                 throw new UnprocessableEntityException("VALIDATION_ERROR", "Đơn hàng chưa đạt giá trị tối thiểu để áp dụng mã giảm giá");
             }
             if (coupon.getType() == com.re.ecommerce.modules.cart.entity.CouponType.PERCENT) {
                 discount = subtotal.multiply(coupon.getDiscountValue()).divide(BigDecimal.valueOf(100), 2, java.math.RoundingMode.HALF_UP);
                 if (coupon.getMaximumDiscountAmount() != null && discount.compareTo(coupon.getMaximumDiscountAmount()) > 0) {
                     discount = coupon.getMaximumDiscountAmount();
                 }
             } else {
                 discount = coupon.getDiscountValue();
             }
             if (discount.compareTo(subtotal) > 0) {
                 discount = subtotal; // Cannot discount more than subtotal
             }
             
             order.setCoupon(coupon);
             couponRepository.incrementUsedCountAtomic(coupon.getId());

             if (currentUser != null) {
                 userVoucherRepository.findByUserIdAndCouponId(currentUser.getId(), coupon.getId())
                         .ifPresent(uv -> {
                             uv.setStatus(com.re.ecommerce.modules.cart.entity.UserVoucherStatus.USED);
                             uv.setUsedAt(LocalDateTime.now());
                             userVoucherRepository.save(uv);
                         });
             }
        }
        
        order.setDiscountAmount(discount);
        order.setGrandTotalAmount(subtotal.subtract(discount).add(order.getShippingFee()));
        
        String generatedOrderCode = "ORD" + System.currentTimeMillis();
        order.setOrderCode(generatedOrderCode);
        order.setStatus(OrderStatus.PENDING);
        
        // Save Order hierarchy
        orderRepository.save(order);
        orderItemRepository.saveAll(orderItems);
        stockReservationService.reserveForOrder(order, orderItems);
        paymentRepository.save(Payment.builder()
                .order(order)
                .expectedAmount(order.getGrandTotalAmount())
                .build());
        
        // If Coupon Used
        if (order.getCoupon() != null) {
            CouponUsage usage = CouponUsage.builder()
                    .coupon(order.getCoupon())
                    .order(order)
                    .customer(currentUser)
                    .guestIdentityHash(guestTokenHash)
                    .discountAmount(discount)
                    .usageStatus(CouponUsageStatus.RESERVED)
                    .reservedAt(LocalDateTime.now())
                    .build();
            couponUsageRepository.save(usage);
        }
        
        OrderStatusHistory history = OrderStatusHistory.builder()
                .order(order)
                .newStatus(OrderStatus.PENDING)
                .actorType(currentUser != null ? OrderStatusActor.CUSTOMER : OrderStatusActor.SYSTEM)
                .changedBy(currentUser)
                .note("Order placed via checkout")
                .build();
        orderStatusHistoryRepository.save(history);
        
        // Clear cart if we used it
        if (!hasDirectItems && cart != null) {
            cart.getItems().clear();
            cartRepository.save(cart);
        }
        
        if (currentUser != null) {
            Notification notification = new Notification(
                    currentUser,
                    "Đặt hàng thành công",
                    "Đơn hàng " + order.getOrderCode() + " của bạn đã được đặt thành công.",
                    "ORDER",
                    "Order",
                    order.getId().toString(),
                    "/account/orders/" + order.getOrderCode()
            );
            notificationRepository.save(notification);
        }
        
        log.info("Checkout successful. Order ID: {}", order.getId());
        return toResponse(order, orderItems);
    }

    private Order buildOrderSnapshot(User currentUser, CheckoutRequest r) {
        Order.OrderBuilder builder = Order.builder()
                .customer(currentUser)
                .sourceChannel(OrderSourceChannel.WEB)
                .currency("VND")
                .note(r.note());
                
        if (currentUser != null && r.shippingAddressId() != null) {
            ShippingAddress address = shippingAddressRepository.findById(UUID.fromString(r.shippingAddressId()))
                    .orElseThrow(() -> new ResourceNotFoundException("RESOURCE_NOT_FOUND", "Address not found"));
            builder.shippingAddress(address)
                   .contactName(address.getReceiverName())
                   .contactPhone(address.getReceiverPhone())
                   .receiverName(address.getReceiverName())
                   .receiverPhone(address.getReceiverPhone())
                   .shippingCountryCode(address.getCountryCode())
                   .shippingProvinceCode(address.getProvinceCode())
                   .shippingProvinceName(address.getProvinceName())
                   .shippingDistrictCode(address.getDistrictCode())
                   .shippingDistrictName(address.getDistrictName())
                   .shippingWardCode(address.getWardCode())
                   .shippingWardName(address.getWardName())
                   .shippingDetailAddress(address.getDetailAddress())
                   .shippingPostalCode(address.getPostalCode());
        } else {
            builder.contactName(r.guestName())
                   .contactPhone(r.guestPhone())
                   .contactEmail(r.guestEmail())
                   .receiverName(r.guestName())
                   .receiverPhone(r.guestPhone())
                   .shippingCountryCode("VN")
                   .shippingProvinceCode(r.guestProvinceCode())
                   .shippingProvinceName(r.guestProvinceName())
                   .shippingDistrictCode(r.guestDistrictCode())
                   .shippingDistrictName(r.guestDistrictName())
                   .shippingWardCode(r.guestWardCode())
                   .shippingWardName(r.guestWardName())
                   .shippingDetailAddress(r.guestDetailAddress());
        }
        return builder.build();
    }
    
    private Cart getCart(User currentUser, byte[] guestHash) {
        if (currentUser != null) {
            CustomerProfile profile = customerProfileRepository.findById(currentUser.getId())
                    .orElseThrow(() -> new BusinessConflictException("CUSTOMER_NOT_FOUND", "Customer profile not found"));
            return cartRepository.findByCustomer(profile)
                    .orElseThrow(() -> new BusinessConflictException("CART_EMPTY", "Cart not initialized"));
        }
        return cartRepository.findByGuestTokenHash(guestHash)
                .orElseThrow(() -> new BusinessConflictException("CART_EMPTY", "Guest cart not initialized"));
    }

    private byte[] hashIdempotency(String key) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return digest.digest(key.getBytes());
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 not available", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<OrderResponse> getMyOrders(User currentUser, int page, int size) {
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page - 1, size, org.springframework.data.domain.Sort.by("createdAt").descending());
        org.springframework.data.domain.Page<Order> ordersPage = orderRepository.findByCustomer_Id(currentUser.getId(), pageable);

        List<UUID> orderIds = ordersPage.getContent().stream().map(Order::getId).toList();
        List<OrderItem> allItems = orderIds.isEmpty() ? java.util.Collections.emptyList() : orderItemRepository.findByOrderIdIn(orderIds);
        java.util.Map<UUID, List<OrderItem>> itemsByOrderId = allItems.stream().collect(Collectors.groupingBy(item -> item.getOrder().getId()));
        
        List<OrderResponse> dtos = ordersPage.getContent().stream()
                .map(o -> toResponse(o, itemsByOrderId.getOrDefault(o.getId(), java.util.Collections.emptyList())))
                .toList();
                
        return PagedResponse.of(ordersPage, dtos);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getMyOrder(User currentUser, String orderCode) {
        Order order = orderRepository.findByCustomer_IdAndOrderCode(currentUser.getId(), orderCode)
                .orElseThrow(() -> new ResourceNotFoundException("ORDER_NOT_FOUND", "Order not found"));
        return toResponse(order, orderItemRepository.findByOrderId(order.getId()));
    }

    @Override
    @Transactional
    public PagedResponse<OrderResponse> getAdminOrders(int page, int size) {
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page - 1, size, org.springframework.data.domain.Sort.by("createdAt").descending());
        org.springframework.data.domain.Page<Order> ordersPage = orderRepository.findAll(pageable);
        
        List<UUID> orderIds = ordersPage.getContent().stream().map(Order::getId).toList();
        syncStatusesFromShipments(ordersPage.getContent());
        List<OrderItem> allItems = orderIds.isEmpty() ? java.util.Collections.emptyList() : orderItemRepository.findByOrderIdIn(orderIds);
        java.util.Map<UUID, List<OrderItem>> itemsByOrderId = allItems.stream().collect(Collectors.groupingBy(item -> item.getOrder().getId()));
        
        List<OrderResponse> dtos = ordersPage.getContent().stream()
                .map(o -> toResponse(o, itemsByOrderId.getOrDefault(o.getId(), java.util.Collections.emptyList())))
                .toList();
                
        return PagedResponse.of(ordersPage, dtos);
    }

    @Override
    @Transactional
    public void confirmOrder(User admin, UUID orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("RESOURCE_NOT_FOUND", "Order not found"));
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new UnprocessableEntityException("VALIDATION_ERROR", "Cannot confirm order in status: " + order.getStatus());
        }
        order.setStatus(OrderStatus.CONFIRMED);
        order.setConfirmedAt(LocalDateTime.now());
        stockReservationService.confirmForFulfillment(orderId);
        
        OrderStatusHistory history = OrderStatusHistory.builder()
                .order(order)
                .oldStatus(OrderStatus.PENDING)
                .newStatus(OrderStatus.CONFIRMED)
                .actorType(OrderStatusActor.STAFF)
                .changedBy(admin)
                .note("Order confirmed by admin")
                .build();
        
        orderRepository.save(order);
        orderStatusHistoryRepository.save(history);
        log.info("Order {} confirmed by {}", order.getId(), admin.getId());
    }
    
    private OrderResponse toResponse(Order order, List<OrderItem> items) {
        List<OrderItemResponse> itemDtos = items.stream().map(i -> OrderItemResponse.builder()
                .id(i.getId())
                .productId(i.getProduct().getId())
                .productVariantId(i.getProductVariant().getId())
                .productName(i.getProductName())
                .variantName(i.getVariantName())
                .sku(i.getSku())
                .color(i.getColor())
                .ram(i.getRam())
                .storage(i.getStorage())
                .imageUrl(i.getImageUrl() != null && !i.getImageUrl().isBlank()
                        ? i.getImageUrl()
                        : resolveVariantImageUrl(i.getProductVariant()))
                .warrantyMonths(i.getWarrantyMonths())
                .unitPrice(i.getUnitPrice())
                .quantity(i.getQuantity())
                .discountAmount(i.getDiscountAmount())
                .lineTotal(i.getLineTotal())
                .build()).toList();
                
        return OrderResponse.builder()
                .id(order.getId())
                .orderCode(order.getOrderCode())
                .customerId(order.getCustomer() != null ? order.getCustomer().getId().toString() : null)
                .sourceChannel(order.getSourceChannel().name())
                .couponCode(order.getCoupon() != null ? order.getCoupon().getCode() : null)
                .contactName(order.getContactName())
                .contactEmail(order.getContactEmail())
                .contactPhone(order.getContactPhone())
                .receiverName(order.getReceiverName())
                .receiverPhone(order.getReceiverPhone())
                .shippingDetailAddress(order.getShippingDetailAddress())
                .shippingWardName(order.getShippingWardName())
                .shippingDistrictName(order.getShippingDistrictName())
                .shippingProvinceName(order.getShippingProvinceName())
                .currency(order.getCurrency())
                .subtotalAmount(order.getSubtotalAmount())
                .discountAmount(order.getDiscountAmount())
                .shippingFee(order.getShippingFee())
                .grandTotalAmount(order.getGrandTotalAmount())
                .status(order.getStatus().name())
                .note(order.getNote())
                .createdAt(order.getCreatedAt())
                .confirmedAt(order.getConfirmedAt())
                .completedAt(order.getCompletedAt())
                .cancelledAt(order.getCancelledAt())
                .items(itemDtos)
                .build();
    }

    private String resolveVariantImageUrl(ProductVariant variant) {
        if (variant == null || variant.getId() == null) {
            return null;
        }

        Optional<ProductImage> primaryImage = productImageRepository
                .findByVariantIdAndIsPrimary(variant.getId(), true);
        if (primaryImage.isPresent()) {
            return primaryImage.get().getImageUrl();
        }

        return productImageRepository.findByVariantIdOrderBySortOrderAsc(variant.getId())
                .stream()
                .findFirst()
                .map(ProductImage::getImageUrl)
                .orElse(null);
    }

    @Override
    @Transactional
    public OrderResponse getAdminOrder(UUID orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("ORDER_NOT_FOUND", "Order not found"));
        syncStatusesFromShipments(List.of(order));
        return toResponse(order, orderItemRepository.findByOrderId(order.getId()));
    }

    private void syncStatusesFromShipments(List<Order> orders) {
        if (orders.isEmpty()) return;
        List<UUID> ids = orders.stream().map(Order::getId).toList();
        shipmentRepository.findByOrder_IdIn(ids).stream()
                .filter(shipment -> shipment.getStatus() == ShipmentStatus.DELIVERED
                        || shipment.getStatus() == ShipmentStatus.IN_TRANSIT
                        || shipment.getStatus() == ShipmentStatus.SHIPPED
                        || shipment.getStatus() == ShipmentStatus.PACKING)
                .forEach(shipment -> {
                    Order order = orders.stream().filter(candidate -> candidate.getId().equals(shipment.getOrder().getId())).findFirst().orElse(null);
                    if (order == null || order.getStatus() == OrderStatus.CANCELLED || order.getStatus() == OrderStatus.COMPLETED) return;
                    OrderStatus target = shipment.getStatus() == ShipmentStatus.DELIVERED ? OrderStatus.COMPLETED
                            : shipment.getStatus() == ShipmentStatus.PACKING ? OrderStatus.PROCESSING : OrderStatus.SHIPPING;
                    if (order.getStatus() == target) return;
                    OrderStatus previous = order.getStatus();
                    order.setStatus(target);
                    if (target == OrderStatus.COMPLETED) order.setCompletedAt(LocalDateTime.now());
                    orderRepository.save(order);
                    orderStatusHistoryRepository.save(OrderStatusHistory.builder().order(order).oldStatus(previous).newStatus(target)
                            .actorType(OrderStatusActor.SYSTEM).note("Synced from shipment " + shipment.getShipmentCode()).build());
                });
    }

    @Override
    @Transactional
    public OrderResponse startProcessing(UUID orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("ORDER_NOT_FOUND", "Order not found"));
        order.setStatus(OrderStatus.PROCESSING);
        return toResponse(orderRepository.save(order), orderItemRepository.findByOrderId(order.getId()));
    }

    @Override
    @Transactional
    public OrderResponse completeOrder(UUID orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("ORDER_NOT_FOUND", "Order not found"));
        order.setStatus(OrderStatus.COMPLETED);
        order.setCompletedAt(LocalDateTime.now());
        return toResponse(orderRepository.save(order), orderItemRepository.findByOrderId(order.getId()));
    }

    @Override
    @Transactional
    public OrderResponse cancelOrder(User user, UUID orderId, String reason) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("ORDER_NOT_FOUND", "Order not found"));
        order.setStatus(OrderStatus.CANCELLED);
        order.setCancelledAt(LocalDateTime.now());
        order.setNote((order.getNote() != null ? order.getNote() + " | " : "") + "Cancelled: " + reason);
        stockReservationService.releaseForOrder(orderId, "Đơn hàng bị hủy: " + reason);
        return toResponse(orderRepository.save(order), orderItemRepository.findByOrderId(order.getId()));
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getGuestOrder(String accessLink) {
        // Mock implementation for guest order retrieval via access link
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public String generateGuestAccessLink(String orderCode, String email) {
        // Mock implementation for generating a secure access link for guests
        return "https://shop.local/guest/orders/" + orderCode + "?token=mock-token";
    }

    @Override
    @Transactional
    public CartResponse reorder(User currentUser, String orderCode) {
        Order order = orderRepository.findByCustomer_IdAndOrderCode(currentUser.getId(), orderCode)
                .orElseThrow(() -> new ResourceNotFoundException("ORDER_NOT_FOUND", "Order not found"));
        
        List<OrderItem> orderItems = orderItemRepository.findByOrderId(order.getId());
        List<CartItemRequest> requests = orderItems.stream()
                .map(i -> {
                    CartItemRequest req = new CartItemRequest();
                    req.setProductVariantId(i.getProductVariant().getId());
                    req.setQuantity(i.getQuantity());
                    return req;
                })
                .toList();
                
        return cartService.reorderItems(currentUser.getId(), requests);
    }
}
