package com.re.ecommerce.modules.orderreturn.dto.response;

import java.math.BigDecimal;

public record AdminRefundSummaryResponse(
        long pendingCount,
        BigDecimal pendingAmount,
        long processingCount,
        BigDecimal processingAmount,
        long completedTodayCount,
        BigDecimal completedTodayAmount,
        long failedCount
) {
}
