package com.re.ecommerce.modules.inventory.dto.request;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import java.util.List;

public record StockAdjustmentRequest(
        @NotNull UUID warehouseId,
        @NotNull UUID productVariantId,
        @NotNull String direction, // ADJUST_IN or ADJUST_OUT
        @NotNull Integer quantity,
        @NotNull String reason,
        List<String> identifiers // Only required for serialized items
) {
}
