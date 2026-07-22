package com.re.ecommerce.modules.catalog.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record BrandRequest(
        @NotBlank(message = "Brand name is required")
        @Size(max = 150, message = "Brand name must not exceed 150 characters")
        String name,

        @Size(max = 500, message = "Logo URL must not exceed 500 characters")
        String logoUrl,

        @Size(max = 1000, message = "Description must not exceed 1000 characters")
        String description
) {}
