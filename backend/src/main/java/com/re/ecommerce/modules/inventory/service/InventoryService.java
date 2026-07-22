package com.re.ecommerce.modules.inventory.service;

import com.re.ecommerce.modules.inventory.dto.request.StockImportRequest;
import com.re.ecommerce.modules.inventory.entity.WarehouseInventory;

import java.util.UUID;

public interface InventoryService {

    // Nghiệp vụ Nhập Lô Hàng từ một PO
    void receivePurchaseOrder(UUID purchaseOrderId, StockImportRequest request);
    
    // API Tra cứu tồn kho chính theo sản phẩm
    Integer getAvailableStockCount(UUID warehouseId, UUID productVariantId);
    
    // API Tra cứu chi tiết Warehouse Inventory record
    WarehouseInventory getWarehouseInventory(UUID warehouseId, UUID productVariantId);
    
}
