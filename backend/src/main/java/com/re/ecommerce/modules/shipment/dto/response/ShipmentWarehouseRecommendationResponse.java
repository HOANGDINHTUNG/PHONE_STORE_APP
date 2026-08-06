package com.re.ecommerce.modules.shipment.dto.response;

import java.util.UUID;

public record ShipmentWarehouseRecommendationResponse(
        UUID warehouseId,
        String warehouseCode,
        String warehouseName,
        String warehouseAddress,
        boolean canFulfill,
        int fulfilledItemCount,
        int requiredItemCount,
        int locationScore,
        String recommendationReason
) {
}
