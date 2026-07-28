package com.re.ecommerce.modules.customer.dto.response;

import com.re.ecommerce.modules.customer.entity.ReviewStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record ReviewResponse(
        UUID id,
        UUID productId,
        UUID orderItemId,
        String customerName,
        Integer rating,
        String title,
        String comment,
        ReviewStatus status,
        String rejectionReason,
        LocalDateTime createdAt
) {}
