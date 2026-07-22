package com.re.ecommerce.modules.order.entity;

import com.re.ecommerce.common.entity.BaseEntity;
import com.re.ecommerce.modules.auth.entity.User;
import com.re.ecommerce.modules.cart.entity.Coupon;
import com.re.ecommerce.modules.order.enums.CouponUsageStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupon_usages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CouponUsage extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "coupon_id", nullable = false)
    private Coupon coupon;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private User customer;

    @Column(name = "guest_identity_hash", columnDefinition = "BINARY(32)")
    private byte[] guestIdentityHash;

    @Column(name = "discount_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal discountAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "usage_status", nullable = false)
    private CouponUsageStatus usageStatus;

    @Column(name = "reserved_at")
    private LocalDateTime reservedAt;

    @Column(name = "consumed_at")
    private LocalDateTime consumedAt;

    @Column(name = "released_at")
    private LocalDateTime releasedAt;
}
