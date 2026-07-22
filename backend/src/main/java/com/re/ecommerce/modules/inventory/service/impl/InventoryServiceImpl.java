package com.re.ecommerce.modules.inventory.service.impl;

import com.re.ecommerce.common.exception.BusinessConflictException;
import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.modules.catalog.entity.ProductVariant;
import com.re.ecommerce.modules.catalog.repository.ProductVariantRepository;
import com.re.ecommerce.modules.inventory.dto.request.StockImportRequest;
import com.re.ecommerce.modules.inventory.entity.*;
import com.re.ecommerce.modules.inventory.entity.enums.*;
import com.re.ecommerce.modules.inventory.repository.*;
import com.re.ecommerce.modules.inventory.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {

    private final WarehouseInventoryRepository warehouseInventoryRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final PurchaseOrderItemRepository purchaseOrderItemRepository;
    private final InventoryUnitRepository inventoryUnitRepository;
    private final StockTransactionRepository stockTransactionRepository;

    @Override
    @Transactional
    public void receivePurchaseOrder(UUID purchaseOrderId, StockImportRequest request) {
        PurchaseOrder po = purchaseOrderRepository.findByIdWithLock(purchaseOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("PO_NOT_FOUND", "Không tìm thấy Purchase Order"));

        if (po.getStatus() != PurchaseOrderStatus.APPROVED && po.getStatus() != PurchaseOrderStatus.PARTIALLY_RECEIVED) {
            throw new BusinessConflictException("PO_NOT_APPROVED", "Chỉ có thể nhập kho từ PO đã chuyển sang APPROVED hoặc PARTIALLY_RECEIVED");
        }

        Warehouse warehouse = po.getWarehouse();
        
        for (StockImportRequest.StockImportItem itemReq : request.items()) {
            PurchaseOrderItem poItem = purchaseOrderItemRepository.findById(itemReq.purchaseOrderItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("ITEM_NOT_FOUND", "PO Item không tồn tại"));

            if (!poItem.getPurchaseOrder().getId().equals(purchaseOrderId)) {
                throw new BusinessConflictException("INVALID_PO_ITEM", "PO Item không thuộc về PO này");
            }
            
            if (poItem.getReceivedQuantity() + itemReq.quantity() > poItem.getOrderedQuantity()) {
                throw new BusinessConflictException("EXCEED_QUANTITY", String.format("Nhập quá số lượng: Đã đặt %d, đã nhận %d, nhận thêm %d", 
                        poItem.getOrderedQuantity(), poItem.getReceivedQuantity(), itemReq.quantity()));
            }

            ProductVariant variant = poItem.getProductVariant();
            
            // Generate Inventory Units
            for (int i = 0; i < itemReq.quantity(); i++) {
                InventoryUnit unit = new InventoryUnit();
                unit.setProductVariant(variant);
                unit.setWarehouse(warehouse);
                unit.setPurchaseOrderItem(poItem);
                unit.setUnitStatus(InventoryUnitStatus.AVAILABLE);

                // Add Identifiers (Serial / IMEI) if provided
                if (itemReq.identifiers() != null && i < itemReq.identifiers().size()) {
                    Map<String, String> idents = itemReq.identifiers().get(i);
                    for (Map.Entry<String, String> entry : idents.entrySet()) {
                        InventoryUnitIdentifier ident = new InventoryUnitIdentifier();
                        ident.setIdentifierType(IdentifierType.valueOf(entry.getKey()));
                        ident.setIdentifierValue(entry.getValue());
                        ident.setNormalizedIdentifier(entry.getValue().toUpperCase().trim());
                        unit.addIdentifier(ident);
                    }
                }
                
                inventoryUnitRepository.save(unit);
            }

            poItem.setReceivedQuantity(poItem.getReceivedQuantity() + itemReq.quantity());
            
            // Ledger Transaction & Inventory Aggregate Update
            WarehouseInventoryId invId = new WarehouseInventoryId(warehouse.getId(), variant.getId());
            WarehouseInventory inv = warehouseInventoryRepository.findByIdWithLock(invId)
                    .orElseGet(() -> {
                        WarehouseInventory newInv = new WarehouseInventory();
                        newInv.setId(invId);
                        newInv.setWarehouse(warehouse);
                        newInv.setProductVariant(variant);
                        newInv.setOnHandQuantity(0);
                        newInv.setReservedQuantity(0);
                        newInv.setReorderLevel(0);
                        return newInv;
                    });
            
            int onHandBefore = inv.getOnHandQuantity();
            int reservedBefore = inv.getReservedQuantity();
            
            inv.setOnHandQuantity(inv.getOnHandQuantity() + itemReq.quantity());
            warehouseInventoryRepository.save(inv);
            
            StockTransaction tx = new StockTransaction();
            tx.setWarehouse(warehouse);
            tx.setProductVariant(variant);
            tx.setTransactionType(StockTransactionType.IMPORT);
            tx.setQuantity(itemReq.quantity());
            tx.setOnHandBefore(onHandBefore);
            tx.setOnHandAfter(inv.getOnHandQuantity());
            tx.setReservedBefore(reservedBefore);
            tx.setReservedAfter(inv.getReservedQuantity());
            tx.setReferenceType(StockReferenceType.PURCHASE_ORDER);
            tx.setReferenceId(purchaseOrderId);
            tx.setCreatedBy(request.receivedBy().toString());
            
            stockTransactionRepository.save(tx);
        }

        // Check if fully received
        boolean isFullyReceived = po.getItems().stream()
                .allMatch(item -> item.getReceivedQuantity().equals(item.getOrderedQuantity()));
                
        if (isFullyReceived) {
            po.setStatus(PurchaseOrderStatus.COMPLETED);
        } else {
            po.setStatus(PurchaseOrderStatus.PARTIALLY_RECEIVED);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Integer getAvailableStockCount(UUID warehouseId, UUID productVariantId) {
        return warehouseInventoryRepository.findById(new WarehouseInventoryId(warehouseId, productVariantId))
                .map(i -> i.getOnHandQuantity() - i.getReservedQuantity())
                .orElse(0);
    }

    @Override
    @Transactional(readOnly = true)
    public WarehouseInventory getWarehouseInventory(UUID warehouseId, UUID productVariantId) {
        return warehouseInventoryRepository.findById(new WarehouseInventoryId(warehouseId, productVariantId))
                .orElseThrow(() -> new ResourceNotFoundException("INVENTORY_NOT_FOUND", "Chưa có dữ liệu tồn kho cho sản phẩm này tại kho"));
    }
}
