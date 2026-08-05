package com.re.ecommerce.modules.orderreturn.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AdminRefundResponse(
        Long id,
        String refundCode,
        Long paymentId,
        String orderCode,
        String returnCode,
        BigDecimal amount,
        String method,
        String requesterName,
        String status,
        String reason,
        LocalDateTime createdAt
) {
}
