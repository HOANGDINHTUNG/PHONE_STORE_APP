package com.re.ecommerce.modules.catalog.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ImageCreateRequest(
        @NotBlank(message = "Image URL is required")
        @Size(max = 500)
        String imageUrl,

        @Size(max = 255)
        String altText,

        int sortOrder,

        boolean isPrimary
) {}
