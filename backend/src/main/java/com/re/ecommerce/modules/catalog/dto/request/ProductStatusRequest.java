package com.re.ecommerce.modules.catalog.dto.request;

import com.re.ecommerce.modules.catalog.entity.PublicationStatus;
import jakarta.validation.constraints.NotNull;

public record ProductStatusRequest(
        @NotNull(message = "Status is required")
        PublicationStatus status
) {}
