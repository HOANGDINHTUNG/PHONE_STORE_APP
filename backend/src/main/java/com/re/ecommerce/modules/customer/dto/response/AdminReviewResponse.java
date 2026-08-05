package com.re.ecommerce.modules.customer.dto.response;

import com.re.ecommerce.modules.customer.entity.ReviewStatus;

import java.time.LocalDateTime;
import java.util.UUID;

/** Data shown only in the administrator review-moderation workspace. */
public record AdminReviewResponse(
        UUID id,
        UUID productId,
        UUID orderItemId,
        String productName,
        String variantName,
        String sku,
        String imageUrl,
        String customerName,
        String customerEmail,
        Integer rating,
        String title,
        String comment,
        ReviewStatus status,
        String rejectionReason,
        String moderatedBy,
        LocalDateTime moderatedAt,
        LocalDateTime createdAt
) {}
