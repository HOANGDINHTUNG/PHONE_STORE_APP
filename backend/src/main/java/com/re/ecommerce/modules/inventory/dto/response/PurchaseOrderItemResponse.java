package com.re.ecommerce.modules.inventory.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

public record PurchaseOrderItemResponse(
        Long id,
        UUID purchaseOrderId,
        UUID productVariantId,
        String productVariantName,
        String sku,
        String imageUrl,
        Integer orderedQuantity,
        Integer receivedQuantity,
        BigDecimal unitCost,
        BigDecimal lineTotal
) {
}
