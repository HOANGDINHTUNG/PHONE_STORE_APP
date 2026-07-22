package com.re.ecommerce.modules.inventory.dto.response;

import com.re.ecommerce.modules.inventory.entity.enums.PurchaseOrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record PurchaseOrderResponse(
        UUID id,
        String purchaseOrderCode,
        UUID supplierId,
        String supplierName,
        UUID warehouseId,
        String warehouseName,
        PurchaseOrderStatus status,
        BigDecimal totalAmount,
        LocalDateTime expectedAt,
        UUID approvedBy,
        LocalDateTime approvedAt,
        UUID receivedBy,
        LocalDateTime receivedAt,
        UUID cancelledBy,
        LocalDateTime cancelledAt,
        String cancelReason,
        String note,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        List<PurchaseOrderItemResponse> items
) {
}
