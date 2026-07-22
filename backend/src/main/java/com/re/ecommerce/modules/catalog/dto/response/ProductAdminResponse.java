package com.re.ecommerce.modules.catalog.dto.response;

import com.re.ecommerce.modules.catalog.entity.PublicationStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record ProductAdminResponse(
        UUID id,
        UUID categoryId,
        String categoryName,
        UUID brandId,
        String brandName,
        String name,
        String slug,
        String description,
        PublicationStatus publicationStatus,
        long variantCount,
        LocalDateTime deletedAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
