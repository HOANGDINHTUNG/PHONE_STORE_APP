package com.re.ecommerce.modules.inventory.controller;

import com.re.ecommerce.modules.inventory.dto.request.StockImportRequest;
import com.re.ecommerce.modules.inventory.entity.WarehouseInventory;
import com.re.ecommerce.modules.inventory.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
@Slf4j
public class InventoryController {

    private final InventoryService inventoryService;

    /**
     * Nhận hàng từ một thư đặt hàng (PO Receipt)
     */
    @PostMapping("/receipt/purchase-order/{poId}")
    @PreAuthorize("hasAuthority('SCOPE_INVENTORY_MANAGE')")
    public ResponseEntity<Void> receivePurchaseOrder(
            @PathVariable UUID poId,
            @Valid @RequestBody StockImportRequest request
    ) {
        log.info("Receiving PO goods for PO id {}", poId);
        inventoryService.receivePurchaseOrder(poId, request);
        return ResponseEntity.ok().build();
    }

    /**
     * Lấy số lượng hàng có sẵn để bán (onHand - reserved) tại một kho
     */
    @GetMapping("/warehouses/{warehouseId}/variants/{variantId}/available-count")
    @PreAuthorize("hasAnyAuthority('SCOPE_INVENTORY_VIEW', 'SCOPE_INVENTORY_MANAGE')")
    public ResponseEntity<Integer> getAvailableStockCount(
            @PathVariable UUID warehouseId,
            @PathVariable UUID variantId
    ) {
        return ResponseEntity.ok(inventoryService.getAvailableStockCount(warehouseId, variantId));
    }

    /**
     * Lấy chi tiết thông tin Inventory Aggregate của một mã SP tại một kho
     */
    @GetMapping("/warehouses/{warehouseId}/variants/{variantId}")
    @PreAuthorize("hasAnyAuthority('SCOPE_INVENTORY_VIEW', 'SCOPE_INVENTORY_MANAGE')")
    public ResponseEntity<WarehouseInventory> getWarehouseInventory(
            @PathVariable UUID warehouseId,
            @PathVariable UUID variantId
    ) {
        // In a real prod environment, this should map to a DTO.
        // Returning entity directly here to simplify the example logic, as agreed on rapid P0 development
        return ResponseEntity.ok(inventoryService.getWarehouseInventory(warehouseId, variantId));
    }
}
