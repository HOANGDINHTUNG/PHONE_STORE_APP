package com.re.ecommerce.modules.catalog.dto.response;

import com.re.ecommerce.modules.catalog.entity.BrandStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record BrandResponse(
        UUID id,
        String name,
        String slug,
        String logoUrl,
        String description,
        BrandStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
