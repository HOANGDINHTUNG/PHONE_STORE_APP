package com.re.ecommerce.modules.cart.dto.response;

import com.re.ecommerce.modules.order.enums.CouponUsageStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record CouponUsageResponse(
        UUID id,
        String orderCode,
        String customerName,
        BigDecimal discountAmount,
        CouponUsageStatus status,
        LocalDateTime usedAt
) {}
