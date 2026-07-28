package com.re.ecommerce.modules.customer.dto.request;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record WishlistAddRequest(
        @NotNull(message = "Product ID is required")
        UUID productId
) {}
