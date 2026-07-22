package com.re.ecommerce.modules.catalog.dto.request;

import com.re.ecommerce.modules.catalog.entity.BrandStatus;
import jakarta.validation.constraints.NotNull;

public record BrandStatusRequest(
        @NotNull(message = "Status is required")
        BrandStatus status
) {}
