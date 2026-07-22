package com.re.ecommerce.modules.catalog.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record PriceChangeRequest(
        @NotNull(message = "New list price is required")
        @DecimalMin(value = "0.0", inclusive = false, message = "List price must be positive")
        BigDecimal newListPrice,

        @DecimalMin(value = "0.0", inclusive = false, message = "Sale price must be positive")
        BigDecimal newSalePrice,

        @Size(max = 500)
        String reason
) {}
