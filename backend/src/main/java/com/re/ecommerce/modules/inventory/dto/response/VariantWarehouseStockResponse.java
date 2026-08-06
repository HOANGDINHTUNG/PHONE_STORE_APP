package com.re.ecommerce.modules.inventory.dto.response;

import java.util.UUID;

public record VariantWarehouseStockResponse(
        UUID warehouseId,
        String warehouseName,
        int availableQuantity
) {}
