package com.re.ecommerce.modules.cart.dto.response;

import com.re.ecommerce.modules.cart.entity.CouponStatus;
import com.re.ecommerce.modules.cart.entity.CouponType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class CouponResponse {
    private UUID id;
    private String code;
    private CouponType type;
    private BigDecimal discountValue;
    private Boolean appliesToAll;
    private BigDecimal minimumOrderValue;
    private BigDecimal maximumDiscountAmount;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer perCustomerLimit;
    private CouponStatus status;
    private Integer usedCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
