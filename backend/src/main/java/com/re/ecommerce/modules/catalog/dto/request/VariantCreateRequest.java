package com.re.ecommerce.modules.catalog.dto.request;

import com.re.ecommerce.modules.catalog.entity.TrackingType;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record VariantCreateRequest(
        @NotBlank(message = "SKU is required")
        @Size(max = 100, message = "SKU must not exceed 100 characters")
        String sku,

        @NotBlank(message = "Variant name is required")
        @Size(max = 255, message = "Variant name must not exceed 255 characters")
        String name,

        @Size(max = 100)
        String color,

        Integer ramGb,

        Integer storageGb,

        TrackingType trackingType,

        @Min(value = 0, message = "Warranty months cannot be negative")
        Integer warrantyMonths,

        @NotNull(message = "List price is required")
        @DecimalMin(value = "0.0", inclusive = false, message = "List price must be positive")
        BigDecimal listPrice,

        @DecimalMin(value = "0.0", inclusive = false, message = "Sale price must be positive")
        BigDecimal salePrice
) {}
