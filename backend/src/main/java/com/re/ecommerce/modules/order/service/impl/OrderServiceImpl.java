package com.re.ecommerce.modules.order.service.impl;

import com.re.ecommerce.common.dto.PagedResponse;
import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.common.exception.BusinessConflictException;
import com.re.ecommerce.common.exception.UnprocessableEntityException;
import com.re.ecommerce.modules.auth.entity.User;
import com.re.ecommerce.modules.cart.entity.Cart;
import com.re.ecommerce.modules.cart.entity.CartItem;
import com.re.ecommerce.modules.cart.entity.Coupon;
import com.re.ecommerce.modules.cart.repository.CartRepository;
import com.re.ecommerce.modules.cart.repository.CouponRepository;
import com.re.ecommerce.modules.catalog.entity.ProductVariant;
import com.re.ecommerce.modules.catalog.repository.ProductVariantRepository;
import com.re.ecommerce.modules.customer.entity.ShippingAddress;
import com.re.ecommerce.modules.customer.repository.ShippingAddressRepository;
import com.re.ecommerce.modules.auth.repository.CustomerProfileRepository;
import com.re.ecommerce.modules.auth.entity.CustomerProfile;

import com.re.ecommerce.modules.order.dto.request.CheckoutRequest;
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
    
    private final ShippingAddressRepository shippingAddressRepository;
    

    @Override
    @Transactional
    public OrderResponse checkout(User currentUser, byte[] guestTokenHash, CheckoutRequest request) {
        log.info("Starting checkout process with idempotency: {}", request.idempotencyKey());
        
        byte[] idempotencyHash = hashIdempotency(request.idempotencyKey());
        Optional<Order> existingOrder = orderRepository.findByIdempotencyKeyHash(idempotencyHash);
        if (existingOrder.isPresent()) {
            log.info("Order already exists for idempotency key, ignoring and returning 200 (idempotent replay)");
            return toResponse(existingOrder.get(), orderItemRepository.findByOrderId(existingOrder.get().getId()));
        }
        
        Cart cart = getCart(currentUser, guestTokenHash);
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new BusinessConflictException("CART_EMPTY", "Cart is empty");
        }
        
        Order order = buildOrderSnapshot(currentUser, request);
        order.setIdempotencyKeyHash(idempotencyHash);
        
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;
        
        // Prepare items array
        for (CartItem cartItem : cart.getItems()) {
            ProductVariant variant = productVariantRepository.findById(cartItem.getProductVariant().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("RESOURCE_NOT_FOUND", "Variant not found"));
            
            if (variant.getProduct().getPublicationStatus() != com.re.ecommerce.modules.catalog.entity.PublicationStatus.ACTIVE || 
                variant.getStatus() != com.re.ecommerce.modules.catalog.entity.VariantStatus.ACTIVE || 
                variant.getProduct().getDeletedAt() != null) {
                throw new UnprocessableEntityException("VALIDATION_ERROR", "Product variant is not saleable: " + variant.getSku());
            }

            BigDecimal price = variant.getSalePrice() != null ? variant.getSalePrice() : variant.getListPrice();
            int demand = cartItem.getQuantity();
            
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
                    .imageUrl(null) // simplified
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
            Coupon coupon = couponRepository.findByCode(request.couponCode().toUpperCase())
                    .orElseThrow(() -> new ResourceNotFoundException("RESOURCE_NOT_FOUND", "Coupon not found"));
            // Reserve logic simplified. 
            // Calculate discount...
            if (coupon.getMinimumOrderValue().compareTo(subtotal) > 0) {
                throw new UnprocessableEntityException("VALIDATION_ERROR", "Minimum order not reached for coupon");
            }
            if ("PERCENT".equals(coupon.getType())) {
                discount = subtotal.multiply(coupon.getDiscountValue().divide(BigDecimal.valueOf(100)));
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
            coupon.setUsedCount(coupon.getUsedCount() + 1);
            couponRepository.save(coupon);
        }
        
        order.setDiscountAmount(discount);
        order.setGrandTotalAmount(subtotal.subtract(discount).add(order.getShippingFee()));
        
        String generatedOrderCode = "ORD" + System.currentTimeMillis();
        order.setOrderCode(generatedOrderCode);
        order.setStatus(OrderStatus.PENDING);
        
        // Save Order hierarchy
        orderRepository.save(order);
        orderItemRepository.saveAll(orderItems);
        
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
        
        // Clear cart
        cart.getItems().clear();
        cartRepository.save(cart);
        
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
        
        List<OrderResponse> dtos = ordersPage.getContent().stream()
                .map(o -> toResponse(o, orderItemRepository.findByOrderId(o.getId())))
                .collect(Collectors.toList());
                
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
    @Transactional(readOnly = true)
    public PagedResponse<OrderResponse> getAdminOrders(int page, int size) {
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page - 1, size, org.springframework.data.domain.Sort.by("createdAt").descending());
        org.springframework.data.domain.Page<Order> ordersPage = orderRepository.findAll(pageable);
        
        List<OrderResponse> dtos = ordersPage.getContent().stream()
                .map(o -> toResponse(o, orderItemRepository.findByOrderId(o.getId())))
                .collect(Collectors.toList());
                
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
                .imageUrl(i.getImageUrl())
                .warrantyMonths(i.getWarrantyMonths())
                .unitPrice(i.getUnitPrice())
                .quantity(i.getQuantity())
                .discountAmount(i.getDiscountAmount())
                .lineTotal(i.getLineTotal())
                .build()).collect(Collectors.toList());
                
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

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getAdminOrder(UUID orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("ORDER_NOT_FOUND", "Order not found"));
        return toResponse(order, orderItemRepository.findByOrderId(order.getId()));
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
}
