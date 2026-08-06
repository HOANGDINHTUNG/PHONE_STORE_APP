package com.re.ecommerce.modules.customer.dto.response;

import com.re.ecommerce.modules.customer.entity.ReviewStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record ReviewEligibilityResponse(
        UUID orderItemId,
        UUID productId,
        String productName,
        String imageUrl,
        UUID orderId,
        LocalDateTime orderCompletedAt,
        boolean hasReview,
        UUID reviewId,
        ReviewStatus reviewStatus
) {}
