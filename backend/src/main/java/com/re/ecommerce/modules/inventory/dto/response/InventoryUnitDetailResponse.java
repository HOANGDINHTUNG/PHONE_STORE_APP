package com.re.ecommerce.modules.inventory.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record InventoryUnitDetailResponse(
        Long id,
        String productName,
        String variantName,
        String sku,
        String imageUrl,
        String warehouseName,
        String unitStatus,
        LocalDateTime receivedAt,
        LocalDateTime soldAt,
        List<Identifier> identifiers,
        Origin origin,
        Reservation reservation,
        Sale sale,
        List<HistoryItem> history
) {
    public record Identifier(String type, String value) {}
    public record Origin(String purchaseOrderCode, UUID purchaseOrderId, LocalDateTime receivedAt) {}
    public record Reservation(Long id, UUID orderId, String status, LocalDateTime expiresAt, LocalDateTime releasedAt) {}
    public record Sale(String orderCode, UUID orderItemId, LocalDateTime soldAt) {}
    public record HistoryItem(Long id, String transactionType, String referenceType, UUID referenceId,
                              String reason, String createdBy, LocalDateTime createdAt) {}
}
