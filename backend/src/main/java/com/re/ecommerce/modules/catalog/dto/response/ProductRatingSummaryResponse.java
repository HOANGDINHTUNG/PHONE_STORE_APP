package com.re.ecommerce.modules.catalog.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

public record ProductRatingSummaryResponse(
        UUID productId,
        Integer approvedReviewCount,
        BigDecimal averageRating,
        Integer rating1Count,
        Integer rating2Count,
        Integer rating3Count,
        Integer rating4Count,
        Integer rating5Count
) {}
