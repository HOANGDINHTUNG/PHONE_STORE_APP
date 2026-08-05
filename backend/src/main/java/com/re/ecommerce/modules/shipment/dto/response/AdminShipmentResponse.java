package com.re.ecommerce.modules.shipment.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record AdminShipmentResponse(
        Long id, String shipmentCode, UUID orderId, String orderCode,
        UUID warehouseId, String warehouseName, String shippingProvider,
        String trackingCode, int itemCount, BigDecimal shippingFee,
        String status, LocalDateTime estimatedDeliveryAt, LocalDateTime createdAt
) {
}
