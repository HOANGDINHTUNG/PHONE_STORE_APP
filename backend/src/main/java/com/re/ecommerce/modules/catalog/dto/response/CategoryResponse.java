package com.re.ecommerce.modules.catalog.dto.response;

import com.re.ecommerce.modules.catalog.entity.CategoryStatus;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record CategoryResponse(
        UUID id,
        UUID parentId,
        String name,
        String slug,
        String description,
        CategoryStatus status,
        int sortOrder,
        List<CategoryResponse> subCategories,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
