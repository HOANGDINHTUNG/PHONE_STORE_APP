package com.re.ecommerce.modules.inventory.dto.response;
import java.time.LocalDateTime;
import java.util.UUID;
public record InventoryBalanceResponse(UUID warehouseId, String warehouseName, UUID variantId, String productName, String sku, String variantName, String imageUrl, int onHandQuantity, int reservedQuantity, int availableQuantity, int reorderLevel, LocalDateTime updatedAt) {}
