package com.re.ecommerce.modules.cart.dto.request;

import com.re.ecommerce.modules.cart.entity.CouponType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CouponUpdateRequest {
    @NotBlank @Size(max = 50) private String code;
    @NotBlank @Size(max = 255) private String name;
    @Size(max = 50) private String badgeText;
    private String description;
    @NotNull private CouponType type;
    @NotNull @DecimalMin("0.01") private BigDecimal discountValue;
    @NotNull private Boolean appliesToAll;
    @DecimalMin("0.00") private BigDecimal minimumOrderValue;
    @DecimalMin("0.00") private BigDecimal maximumDiscountAmount;
    @NotNull private LocalDateTime startTime;
    @NotNull private LocalDateTime endTime;
    @Min(1) private Integer perCustomerLimit;
    @Min(1) private Integer totalUsageLimit;
    private String minMembershipTier = "ALL";
    private Boolean isStackable = false;
    private Boolean isFeatured = false;
}
