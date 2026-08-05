package com.re.ecommerce.modules.shipment.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record AdminShipmentDetailResponse(
        Long id, String shipmentCode, UUID orderId, String orderCode,
        String warehouseName, String warehouseAddress, String shippingProvider,
        String trackingCode, BigDecimal shippingFee, String status,
        LocalDateTime createdAt, LocalDateTime estimatedDeliveryAt,
        LocalDateTime shippedAt, LocalDateTime deliveredAt,
        String receiverName, String receiverPhone, String destinationAddress,
        List<AdminShipmentItemResponse> items
) {
}
