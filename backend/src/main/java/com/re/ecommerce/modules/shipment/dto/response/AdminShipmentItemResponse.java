package com.re.ecommerce.modules.shipment.dto.response;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record AdminShipmentItemResponse(
        Long shipmentItemId, UUID orderItemId, String productName,
        String variantName, String sku, String imageUrl, Integer quantity,
        BigDecimal unitPrice, List<String> identifiers
) {
}
