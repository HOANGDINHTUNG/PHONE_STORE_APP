package com.re.ecommerce.modules.cart.dto.response;

import com.re.ecommerce.modules.cart.entity.CouponStatus;
import com.re.ecommerce.modules.cart.entity.CouponType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CouponResponse {
    private UUID id;
    private String code;
    private String name;
    private String badgeText;
    private String description;
    private CouponType type;
    private BigDecimal discountValue;
    private Boolean appliesToAll;
    private BigDecimal minimumOrderValue;
    private BigDecimal maximumDiscountAmount;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer perCustomerLimit;
    private Integer totalUsageLimit;
    private String minMembershipTier;
    private Boolean isStackable;
    private Boolean isFeatured;
    private CouponStatus status;
    private Integer usedCount;

    // Scope Target IDs
    private List<UUID> brandIds;
    private List<UUID> categoryIds;
    private List<UUID> productIds;

    // Computed / Dynamic Contextual Properties
    private Boolean isClaimed;
    private Boolean isEligible;
    private String ineligibilityReason;
    private BigDecimal estimatedSavings;
    private Boolean isBestVoucher;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
