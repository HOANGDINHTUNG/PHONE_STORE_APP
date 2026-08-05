package com.re.ecommerce.modules.payment.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AdminPaymentAttemptResponse(
        Long id,
        Integer attemptNumber,
        String method,
        String providerCode,
        BigDecimal amount,
        String status,
        String providerTransactionId,
        String providerMessage,
        LocalDateTime createdAt
) {
}
