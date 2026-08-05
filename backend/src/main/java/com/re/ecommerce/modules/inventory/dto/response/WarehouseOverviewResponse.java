package com.re.ecommerce.modules.inventory.dto.response;

import java.util.List;

public record WarehouseOverviewResponse(WarehouseResponse warehouse, int skuCount, int onHandQuantity,
                                        int reservedQuantity, int availableQuantity,
                                        List<InventoryBalanceResponse> balances,
                                        List<LedgerItem> recentLedger) {
    public record LedgerItem(Long id, String transactionType, int quantity, String sku,
                             String productName, String referenceType, String referenceId,
                             String createdBy, java.time.LocalDateTime createdAt) {}
}
