package com.re.ecommerce.modules.cart.dto.request;

import com.re.ecommerce.modules.cart.entity.CouponType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CouponCreateRequest {

    @NotBlank(message = "Code is required")
    @Size(max = 50, message = "Code must be at most 50 characters")
    private String code;

    @NotBlank(message = "Coupon name is required")
    @Size(max = 255, message = "Coupon name must be at most 255 characters")
    private String name;

    private String description;

    @NotNull(message = "Type is required")
    private CouponType type;

    @NotNull(message = "Discount value is required")
    @DecimalMin(value = "0.01", message = "Discount value must be greater than 0")
    private BigDecimal discountValue;

    @NotNull(message = "Applies to all is required")
    private Boolean appliesToAll;

    @DecimalMin(value = "0.00", message = "Minimum order value cannot be negative")
    private BigDecimal minimumOrderValue;

    @DecimalMin(value = "0.00", message = "Maximum discount amount cannot be negative")
    private BigDecimal maximumDiscountAmount;

    @NotNull(message = "Start time is required")
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    @Future(message = "End time must be in the future")
    private LocalDateTime endTime;

    @Min(value = 1, message = "Per customer limit must be at least 1 if provided")
    private Integer perCustomerLimit;

    @Min(value = 1, message = "Total usage limit must be at least 1 if provided")
    private Integer totalUsageLimit;
}
