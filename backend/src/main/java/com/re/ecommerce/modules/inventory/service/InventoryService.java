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
    
    org.springframework.data.domain.Page<WarehouseInventory> listBalances(int page, int size);
    
    org.springframework.data.domain.Page<com.re.ecommerce.modules.inventory.entity.InventoryUnit> listSerializedUnits(int page, int size);
    
    com.re.ecommerce.modules.inventory.entity.InventoryUnit lookupUnitByIdentifier(String identifier);
    
    org.springframework.data.domain.Page<com.re.ecommerce.modules.inventory.entity.StockTransaction> listLedger(int page, int size);
    
    org.springframework.data.domain.Page<com.re.ecommerce.modules.inventory.entity.StockReservation> listReservations(int page, int size);
    
    void createManualAdjustment(com.re.ecommerce.modules.inventory.dto.request.StockAdjustmentRequest request, String idempotencyKey);

}
