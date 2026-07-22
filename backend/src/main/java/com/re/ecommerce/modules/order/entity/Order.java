package com.re.ecommerce.modules.order.entity;

import com.re.ecommerce.common.entity.BaseEntity;
import com.re.ecommerce.modules.auth.entity.User;
import com.re.ecommerce.modules.cart.entity.Coupon;
import com.re.ecommerce.modules.customer.entity.ShippingAddress;
import com.re.ecommerce.modules.order.enums.OrderSourceChannel;
import com.re.ecommerce.modules.order.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order extends BaseEntity {

    @Column(name = "order_code", length = 50, nullable = false, unique = true)
    private String orderCode;

    @Column(name = "idempotency_key_hash", columnDefinition = "BINARY(32)", nullable = false, unique = true)
    private byte[] idempotencyKeyHash;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private User customer;

    @Enumerated(EnumType.STRING)
    @Column(name = "source_channel", nullable = false)
    private OrderSourceChannel sourceChannel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coupon_id")
    private Coupon coupon;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shipping_address_id")
    private ShippingAddress shippingAddress;

    @Column(name = "contact_name", length = 150, nullable = false)
    private String contactName;

    @Column(name = "contact_email", length = 254)
    private String contactEmail;

    @Column(name = "contact_phone", length = 20, nullable = false)
    private String contactPhone;

    @Column(name = "receiver_name", length = 150, nullable = false)
    private String receiverName;

    @Column(name = "receiver_phone", length = 20, nullable = false)
    private String receiverPhone;

    @Column(name = "shipping_country_code", length = 2, nullable = false)
    private String shippingCountryCode;

    @Column(name = "shipping_province_code", length = 20)
    private String shippingProvinceCode;

    @Column(name = "shipping_province_name", length = 100, nullable = false)
    private String shippingProvinceName;

    @Column(name = "shipping_district_code", length = 20)
    private String shippingDistrictCode;

    @Column(name = "shipping_district_name", length = 100, nullable = false)
    private String shippingDistrictName;

    @Column(name = "shipping_ward_code", length = 20)
    private String shippingWardCode;

    @Column(name = "shipping_ward_name", length = 100, nullable = false)
    private String shippingWardName;

    @Column(name = "shipping_detail_address", length = 255, nullable = false)
    private String shippingDetailAddress;

    @Column(name = "shipping_postal_code", length = 20)
    private String shippingPostalCode;

    @Column(nullable = false, length = 3)
    private String currency;

    @Column(name = "subtotal_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal subtotalAmount;

    @Column(name = "discount_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal discountAmount;

    @Column(name = "shipping_fee", nullable = false, precision = 15, scale = 2)
    private BigDecimal shippingFee;

    @Column(name = "grand_total_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal grandTotalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(name = "confirmed_at")
    private LocalDateTime confirmedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cancelled_by")
    private User cancelledBy;

    @Column(name = "cancel_reason", length = 500)
    private String cancelReason;

    @Version
    @Column(nullable = false)
    private Long version;
}
