package com.re.ecommerce.modules.cart.entity;

import com.re.ecommerce.common.entity.BaseEntity;
import com.re.ecommerce.modules.catalog.entity.Brand;
import com.re.ecommerce.modules.catalog.entity.Category;
import com.re.ecommerce.modules.catalog.entity.Product;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "coupons")
@Getter
@Setter
@NoArgsConstructor
public class Coupon extends BaseEntity {

    @Column(name = "code", nullable = false, unique = true, length = 50)
    private String code;

    @Column(length = 255)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private CouponType type;

    @Column(name = "discount_value", nullable = false, precision = 19, scale = 4)
    private BigDecimal discountValue;

    @Column(name = "applies_to_all", nullable = false)
    private Boolean appliesToAll = false;

    @Column(name = "minimum_order_value", precision = 19, scale = 4)
    private BigDecimal minimumOrderValue;

    @Column(name = "maximum_discount_amount", precision = 19, scale = 4)
    private BigDecimal maximumDiscountAmount;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(name = "per_customer_limit")
    private Integer perCustomerLimit;

    @Column(name = "total_usage_limit")
    private Integer totalUsageLimit;

    @Column(name = "badge_text", length = 50)
    private String badgeText;

    @Column(name = "min_membership_tier", nullable = false, length = 30)
    private String minMembershipTier = "ALL";

    @Column(name = "is_stackable", nullable = false)
    private Boolean isStackable = false;

    @Column(name = "is_featured", nullable = false)
    private Boolean isFeatured = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private CouponStatus status = CouponStatus.INACTIVE;

    @Column(name = "used_count", nullable = false)
    private Integer usedCount = 0;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "coupon_brand_targets",
        joinColumns = @JoinColumn(name = "coupon_id"),
        inverseJoinColumns = @JoinColumn(name = "brand_id")
    )
    private Set<Brand> brandTargets = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "coupon_category_targets",
        joinColumns = @JoinColumn(name = "coupon_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<Category> categoryTargets = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "coupon_product_targets",
        joinColumns = @JoinColumn(name = "coupon_id"),
        inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private Set<Product> productTargets = new HashSet<>();
}
