package com.re.ecommerce.modules.inventory.controller;

import com.re.ecommerce.modules.catalog.repository.ProductVariantRepository;
import com.re.ecommerce.modules.auth.repository.UserRepository;
import com.re.ecommerce.modules.inventory.dto.request.PurchaseOrderItemRequest;
import com.re.ecommerce.modules.inventory.dto.request.PurchaseOrderRequest;
import com.re.ecommerce.modules.inventory.dto.request.StockImportRequest;
import com.re.ecommerce.modules.inventory.dto.response.PurchaseOrderResponse;
import com.re.ecommerce.modules.inventory.repository.SupplierRepository;
import com.re.ecommerce.modules.inventory.repository.WarehouseRepository;
import com.re.ecommerce.modules.inventory.service.PurchaseOrderService;
import com.re.ecommerce.modules.inventory.service.InventoryService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/procurement")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminProcurementController {
    private final PurchaseOrderService purchaseOrderService;
    private final SupplierRepository supplierRepository;
    private final WarehouseRepository warehouseRepository;
    private final ProductVariantRepository productVariantRepository;
    private final InventoryService inventoryService;
    private final UserRepository userRepository;

    public record Item(@NotBlank String sku, @NotNull Integer qtyOrd, @NotNull BigDecimal unitCost) {}
    public record CreateRequest(@NotBlank String supplierName, @NotBlank String destWarehouse,
                                String expectedDelivery, String note, @NotEmpty List<@Valid Item> items) {}
    public record ReceiveItem(@NotNull Long purchaseOrderItemId, @NotNull @jakarta.validation.constraints.Positive Integer quantity) {}
    public record ReceiveRequest(@NotEmpty List<@Valid ReceiveItem> items) {}

    @PostMapping
    public ResponseEntity<PurchaseOrderResponse> create(@Valid @RequestBody CreateRequest request) {
        var supplier = supplierRepository.findByName(request.supplierName()).orElseThrow();
        var warehouse = warehouseRepository.findByName(request.destWarehouse()).orElseThrow();
        var items = request.items().stream().map(item -> new PurchaseOrderItemRequest(
                productVariantRepository.findBySku(item.sku()).orElseThrow().getId(), item.qtyOrd(), item.unitCost())).toList();
        LocalDateTime expectedAt = request.expectedDelivery() == null || request.expectedDelivery().isBlank()
                ? null : LocalDate.parse(request.expectedDelivery(), DateTimeFormatter.ofPattern("dd/MM/yyyy")).atStartOfDay();
        String code = "PO-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        var created = purchaseOrderService.createPurchaseOrder(new PurchaseOrderRequest(code, supplier.getId(), warehouse.getId(), expectedAt, request.note(), items));
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<PurchaseOrderResponse> submit(@PathVariable UUID id, Authentication authentication) {
        return ResponseEntity.ok(purchaseOrderService.submitPurchaseOrder(id, currentUserId(authentication)));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<PurchaseOrderResponse> approve(@PathVariable UUID id, Authentication authentication) {
        return ResponseEntity.ok(purchaseOrderService.approvePurchaseOrder(id, currentUserId(authentication)));
    }

    @PostMapping("/{id}/receive")
    public ResponseEntity<PurchaseOrderResponse> receive(
            @PathVariable UUID id,
            @Valid @RequestBody ReceiveRequest request,
            Authentication authentication
    ) {
        UUID receivedBy = currentUserId(authentication);
        var items = request.items().stream()
                .map(item -> new StockImportRequest.StockImportItem(item.purchaseOrderItemId(), item.quantity(), null))
                .toList();
        inventoryService.receivePurchaseOrder(id, new StockImportRequest(receivedBy, items));
        return ResponseEntity.ok(purchaseOrderService.getPurchaseOrder(id));
    }

    private UUID currentUserId(Authentication authentication) {
        return userRepository.findByUsername(authentication.getName())
                .orElseThrow()
                .getId();
    }
}
