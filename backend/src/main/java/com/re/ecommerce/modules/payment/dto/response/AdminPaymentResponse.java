package com.re.ecommerce.modules.payment.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record AdminPaymentResponse(
        Long id,
        String orderCode,
        BigDecimal expectedAmount,
        BigDecimal paidAmount,
        BigDecimal refundedAmount,
        String currency,
        String status,
        String latestMethod,
        LocalDateTime paidAt,
        LocalDateTime createdAt,
        List<AdminPaymentAttemptResponse> attempts
) {
}
