package com.re.ecommerce.modules.catalog.dto.request;

import com.re.ecommerce.modules.catalog.entity.VariantStatus;
import jakarta.validation.constraints.NotNull;

public record VariantStatusRequest(
        @NotNull(message = "Status is required")
        VariantStatus status
) {}
