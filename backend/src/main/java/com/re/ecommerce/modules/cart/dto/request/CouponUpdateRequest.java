package com.re.ecommerce.modules.cart.dto.request;

import com.re.ecommerce.modules.cart.entity.CouponType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
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
    private String description;
    @NotNull private CouponType type;
    @NotNull @DecimalMin("0.01") private BigDecimal discountValue;
    @NotNull private Boolean appliesToAll;
    @DecimalMin("0.00") private BigDecimal minimumOrderValue;
    @DecimalMin("0.00") private BigDecimal maximumDiscountAmount;
    @NotNull private LocalDateTime startTime;
    @NotNull @Future private LocalDateTime endTime;
    @jakarta.validation.constraints.Min(1) private Integer perCustomerLimit;
    @jakarta.validation.constraints.Min(1) private Integer totalUsageLimit;
}
