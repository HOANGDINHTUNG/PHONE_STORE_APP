package com.re.ecommerce.modules.catalog.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ProductPublicResponse(
        UUID id,
        String name,
        String slug,
        String description,
        UUID categoryId,
        String categoryName,
        UUID brandId,
        String brandName,
        List<VariantResponse> variants,
        List<SpecificationResponse> specifications,
        List<AttributeResponse> attributes,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
