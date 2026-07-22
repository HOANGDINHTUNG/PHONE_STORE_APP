package com.re.ecommerce.modules.catalog.dto.response;

import com.re.ecommerce.modules.catalog.entity.TrackingType;
import com.re.ecommerce.modules.catalog.entity.VariantStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record VariantResponse(
        UUID id,
        UUID productId,
        String sku,
        String name,
        String color,
        Integer ramGb,
        Integer storageGb,
        TrackingType trackingType,
        Integer warrantyMonths,
        BigDecimal listPrice,
        BigDecimal salePrice,
        VariantStatus status,
        long version,
        List<ImageResponse> images,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
