package com.re.ecommerce.modules.order.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import java.util.UUID;

@Builder
public record CheckoutItemRequest(
        @NotNull(message = "Product variant ID is required")
        UUID productVariantId,
        
        @Min(value = 1, message = "Quantity must be greater than 0")
        int quantity
) {
}
