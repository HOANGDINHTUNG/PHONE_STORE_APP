package com.re.ecommerce.modules.catalog.dto.response;

import java.util.UUID;

public record ImageResponse(
        UUID id,
        String imageUrl,
        String altText,
        boolean isPrimary,
        int sortOrder
) {}
