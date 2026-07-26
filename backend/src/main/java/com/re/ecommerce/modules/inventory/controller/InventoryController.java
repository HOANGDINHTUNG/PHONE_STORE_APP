package com.re.ecommerce.modules.inventory.controller;

import io.swagger.v3.oas.annotations.tags.Tag;

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

@Tag(name = "7. Procurement and Inventory")
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
        return ResponseEntity.ok(inventoryService.getWarehouseInventory(warehouseId, variantId));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('SCOPE_INVENTORY_VIEW')")
    public ResponseEntity<org.springframework.data.domain.Page<WarehouseInventory>> listBalances(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(inventoryService.listBalances(page, size));
    }

    @GetMapping("/units")
    @PreAuthorize("hasAuthority('SCOPE_INVENTORY_VIEW')")
    public ResponseEntity<org.springframework.data.domain.Page<com.re.ecommerce.modules.inventory.entity.InventoryUnit>> listSerializedUnits(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(inventoryService.listSerializedUnits(page, size));
    }

    @GetMapping("/identifiers/{identifier}")
    @PreAuthorize("hasAuthority('SCOPE_INVENTORY_VIEW')")
    public ResponseEntity<com.re.ecommerce.modules.inventory.entity.InventoryUnit> lookupUnitByIdentifier(
            @PathVariable String identifier
    ) {
        return ResponseEntity.ok(inventoryService.lookupUnitByIdentifier(identifier));
    }

    @GetMapping("/transactions")
    @PreAuthorize("hasAuthority('SCOPE_INVENTORY_VIEW')")
    public ResponseEntity<org.springframework.data.domain.Page<com.re.ecommerce.modules.inventory.entity.StockTransaction>> listLedger(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(inventoryService.listLedger(page, size));
    }

    @GetMapping("/stock-reservations")
    @PreAuthorize("hasAuthority('SCOPE_INVENTORY_VIEW')")
    public ResponseEntity<org.springframework.data.domain.Page<com.re.ecommerce.modules.inventory.entity.StockReservation>> listReservations(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(inventoryService.listReservations(page, size));
    }

    @PostMapping("/adjustments")
    @PreAuthorize("hasAuthority('SCOPE_INVENTORY_ADJUST')")
    public ResponseEntity<Void> createManualAdjustment(
            @Valid @RequestBody com.re.ecommerce.modules.inventory.dto.request.StockAdjustmentRequest request,
            @RequestHeader("X-Idempotency-Key") String idempotencyKey
    ) {

        inventoryService.createManualAdjustment(request, idempotencyKey);
        return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED).build();
    }
}
