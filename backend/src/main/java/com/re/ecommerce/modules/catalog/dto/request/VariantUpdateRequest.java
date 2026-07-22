package com.re.ecommerce.modules.catalog.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public record VariantUpdateRequest(
        @Size(max = 255)
        String name,

        @Size(max = 100)
        String color,

        Integer ramGb,
        Integer storageGb,

        @Min(value = 0, message = "Warranty months cannot be negative")
        Integer warrantyMonths
) {}
