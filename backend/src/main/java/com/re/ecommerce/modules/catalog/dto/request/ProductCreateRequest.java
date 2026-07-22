package com.re.ecommerce.modules.catalog.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record ProductCreateRequest(
        @NotNull(message = "Category ID is required")
        UUID categoryId,

        @NotNull(message = "Brand ID is required")
        UUID brandId,

        @NotBlank(message = "Product name is required")
        @Size(max = 255, message = "Product name must not exceed 255 characters")
        String name,

        String description
) {}
