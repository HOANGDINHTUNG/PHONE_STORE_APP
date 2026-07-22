package com.re.ecommerce.modules.catalog.dto.request;

import jakarta.validation.constraints.Size;

import java.util.UUID;

public record ProductUpdateRequest(
        UUID categoryId,
        UUID brandId,

        @Size(max = 255, message = "Product name must not exceed 255 characters")
        String name,

        String description
) {}
