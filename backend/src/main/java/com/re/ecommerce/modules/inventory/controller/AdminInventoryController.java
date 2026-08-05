package com.re.ecommerce.modules.inventory.controller;

import com.re.ecommerce.common.dto.PagedResponse;
import com.re.ecommerce.modules.catalog.entity.VariantStatus;
import com.re.ecommerce.modules.catalog.repository.ProductVariantRepository;
import com.re.ecommerce.modules.inventory.dto.request.SupplierRequest;
import com.re.ecommerce.modules.inventory.dto.request.WarehouseRequest;
import com.re.ecommerce.modules.inventory.dto.response.InventoryBalanceResponse;
import com.re.ecommerce.modules.inventory.dto.response.InventoryUnitDetailResponse;
import com.re.ecommerce.modules.inventory.dto.response.InventoryUnitSummaryResponse;
import com.re.ecommerce.modules.inventory.dto.response.InventoryEntityResponse;
import com.re.ecommerce.modules.inventory.dto.response.WarehouseOverviewResponse;
import com.re.ecommerce.modules.inventory.dto.response.SupplierResponse;
import com.re.ecommerce.modules.inventory.dto.response.WarehouseResponse;
import com.re.ecommerce.modules.inventory.entity.WarehouseInventory;
import com.re.ecommerce.modules.inventory.entity.InventoryUnit;
import com.re.ecommerce.modules.inventory.entity.enums.SupplierStatus;
import com.re.ecommerce.modules.inventory.entity.enums.WarehouseStatus;
import com.re.ecommerce.modules.inventory.repository.WarehouseInventoryRepository;
import com.re.ecommerce.modules.inventory.repository.StockTransactionRepository;
import com.re.ecommerce.modules.inventory.repository.InventoryUnitRepository;
import com.re.ecommerce.modules.inventory.repository.WarehouseRepository;
import com.re.ecommerce.modules.inventory.repository.StockTransactionUnitRepository;
import com.re.ecommerce.modules.order.repository.OrderItemRepository;
import com.re.ecommerce.modules.inventory.service.SupplierService;
import com.re.ecommerce.modules.inventory.service.WarehouseService;
import com.re.ecommerce.modules.inventory.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

@RestController
@RequestMapping("/api/v1/admin/inventory")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminInventoryController {
    private final WarehouseService warehouseService;
    private final SupplierService supplierService;
    private final WarehouseInventoryRepository warehouseInventoryRepository;
    private final ProductVariantRepository productVariantRepository;
    private final StockTransactionRepository stockTransactionRepository;
    private final InventoryUnitRepository inventoryUnitRepository;
    private final OrderItemRepository orderItemRepository;
    private final WarehouseRepository warehouseRepository;
    private final StockTransactionUnitRepository stockTransactionUnitRepository;
    private final InventoryService inventoryService;

    public record ProcurementVariantResponse(UUID id, String sku, String name, BigDecimal suggestedUnitCost) {}
    public record StockHistoryResponse(Long id, String transactionType, int quantity, int onHandBefore,
                                       int onHandAfter, String warehouseName, String sku, String productName,
                                       String referenceType, UUID referenceId, String reason, String createdBy,
                                       LocalDateTime createdAt) {}

    @GetMapping("/warehouses") public ResponseEntity<PagedResponse<WarehouseResponse>> warehouses(@RequestParam(defaultValue="1") int page, @RequestParam(defaultValue="100") int size) { var data=warehouseService.getAllWarehouses(null, page, Math.min(size,100)); return ResponseEntity.ok(PagedResponse.of(data,data.getContent())); }
    @GetMapping("/warehouses/{id}") public ResponseEntity<WarehouseResponse> warehouse(@PathVariable UUID id) { return ResponseEntity.ok(warehouseService.getWarehouse(id)); }
    @PostMapping("/warehouses") public ResponseEntity<WarehouseResponse> createWarehouse(@Valid @RequestBody WarehouseRequest request) { return ResponseEntity.status(HttpStatus.CREATED).body(warehouseService.createWarehouse(request)); }
    @PatchMapping("/warehouses/{id}/status") public ResponseEntity<WarehouseResponse> warehouseStatus(@PathVariable UUID id,@RequestParam WarehouseStatus status){ return ResponseEntity.ok(warehouseService.changeStatus(id,status)); }

    @GetMapping("/suppliers") public ResponseEntity<PagedResponse<SupplierResponse>> suppliers(@RequestParam(defaultValue="1") int page,@RequestParam(defaultValue="100") int size){ var data=supplierService.getAllSuppliers(null,page,Math.min(size,100)); return ResponseEntity.ok(PagedResponse.of(data,data.getContent())); }
    @GetMapping("/suppliers/{id}") public ResponseEntity<SupplierResponse> supplier(@PathVariable UUID id){ return ResponseEntity.ok(supplierService.getSupplier(id)); }
    @PostMapping("/suppliers") public ResponseEntity<SupplierResponse> createSupplier(@Valid @RequestBody SupplierRequest request){ return ResponseEntity.status(HttpStatus.CREATED).body(supplierService.createSupplier(request)); }
    @PutMapping("/suppliers/{id}") public ResponseEntity<SupplierResponse> updateSupplier(@PathVariable UUID id,@Valid @RequestBody SupplierRequest request){ return ResponseEntity.ok(supplierService.updateSupplier(id,request)); }
    @PatchMapping("/suppliers/{id}/status") public ResponseEntity<SupplierResponse> supplierStatus(@PathVariable UUID id,@RequestParam SupplierStatus status){ return ResponseEntity.ok(supplierService.changeStatus(id,status)); }

    @PostMapping("/adjustments")
    public ResponseEntity<Void> adjustment(@Valid @RequestBody com.re.ecommerce.modules.inventory.dto.request.StockAdjustmentRequest request,
                                           @RequestHeader(value = "X-Idempotency-Key", required = false) String idempotencyKey) {
        inventoryService.createManualAdjustment(request, idempotencyKey == null || idempotencyKey.isBlank() ? UUID.randomUUID().toString() : idempotencyKey);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/product-variants")
    @Transactional(readOnly = true)
    public ResponseEntity<List<ProcurementVariantResponse>> productVariants() {
        var variants = productVariantRepository.findAll().stream()
                .filter(variant -> variant.getStatus() == VariantStatus.ACTIVE)
                .map(variant -> new ProcurementVariantResponse(
                        variant.getId(), variant.getSku(), variant.getName(),
                        variant.getSalePrice() != null ? variant.getSalePrice() : variant.getListPrice()))
                .toList();
        return ResponseEntity.ok(variants);
    }

    @GetMapping("/balances") @Transactional(readOnly=true) public ResponseEntity<List<InventoryBalanceResponse>> balances(){ return ResponseEntity.ok(warehouseInventoryRepository.findAll().stream().map(this::balance).toList()); }
    @GetMapping("/reorder-alerts") @Transactional(readOnly=true) public ResponseEntity<List<InventoryBalanceResponse>> alerts(){ return ResponseEntity.ok(warehouseInventoryRepository.findAll().stream().map(this::balance).filter(b -> b.reorderLevel()>0 && b.availableQuantity()<=b.reorderLevel()).toList()); }
    @GetMapping("/stock-history")
    @Transactional(readOnly = true)
    public ResponseEntity<List<StockHistoryResponse>> stockHistory(@RequestParam(defaultValue = "100") int limit) {
        var page = stockTransactionRepository.findAll(PageRequest.of(0, Math.min(Math.max(limit, 1), 200), Sort.by(Sort.Direction.DESC, "createdAt")));
        var history = page.getContent().stream().map(transaction -> new StockHistoryResponse(
                transaction.getId(), transaction.getTransactionType().name(), transaction.getQuantity(),
                transaction.getOnHandBefore(), transaction.getOnHandAfter(), transaction.getWarehouse().getName(),
                transaction.getProductVariant().getSku(), transaction.getProductVariant().getProduct().getName(),
                transaction.getReferenceType().name(), transaction.getReferenceId(), transaction.getReason(),
                transaction.getCreatedBy(), transaction.getCreatedAt())).toList();
        return ResponseEntity.ok(history);
    }

    @GetMapping("/stock-ledger")
    @Transactional(readOnly = true)
    public ResponseEntity<PagedResponse<StockHistoryResponse>> stockLedger(
            @RequestParam(required = false) UUID warehouseId,
            @RequestParam(required = false) com.re.ecommerce.modules.inventory.entity.enums.StockTransactionType transactionType,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "20") int size) {
        var result = stockTransactionRepository.searchLedger(warehouseId, transactionType,
                keyword == null || keyword.isBlank() ? null : keyword.trim(),
                PageRequest.of(Math.max(page - 1, 0), Math.min(Math.max(size, 1), 100), Sort.by(Sort.Direction.DESC, "createdAt")));
        var items = result.getContent().stream().map(transaction -> new StockHistoryResponse(
                transaction.getId(), transaction.getTransactionType().name(), transaction.getQuantity(), transaction.getOnHandBefore(), transaction.getOnHandAfter(),
                transaction.getWarehouse().getName(), transaction.getProductVariant().getSku(), transaction.getProductVariant().getProduct().getName(),
                transaction.getReferenceType().name(), transaction.getReferenceId(), transaction.getReason(), transaction.getCreatedBy(), transaction.getCreatedAt())).toList();
        return ResponseEntity.ok(PagedResponse.of(result, items));
    }

    @GetMapping("/entities")
    @Transactional(readOnly = true)
    public ResponseEntity<PagedResponse<InventoryEntityResponse>> entities(
            @RequestParam(required = false) UUID warehouseId,
            @RequestParam(required = false) com.re.ecommerce.modules.inventory.entity.enums.InventoryUnitStatus status,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "20") int size) {
        var result = inventoryUnitRepository.searchEntities(warehouseId, status,
                keyword == null || keyword.isBlank() ? null : keyword.trim(),
                PageRequest.of(Math.max(page - 1, 0), Math.min(Math.max(size, 1), 100), Sort.by(Sort.Direction.DESC, "createdAt")));
        return ResponseEntity.ok(PagedResponse.of(result, result.getContent().stream().map(this::entityResponse).toList()));
    }

    @GetMapping("/warehouses/{id}/overview")
    @Transactional(readOnly = true)
    public ResponseEntity<WarehouseOverviewResponse> warehouseOverview(@PathVariable UUID id) {
        var warehouse = warehouseRepository.findById(id).orElseThrow();
        var balances = warehouseInventoryRepository.findByIdWarehouseId(id).stream().map(this::balance).toList();
        int onHand = balances.stream().mapToInt(InventoryBalanceResponse::onHandQuantity).sum();
        int reserved = balances.stream().mapToInt(InventoryBalanceResponse::reservedQuantity).sum();
        var recent = stockTransactionRepository.searchLedger(id, null, null, PageRequest.of(0, 8, Sort.by(Sort.Direction.DESC, "createdAt"))).getContent().stream()
                .map(tx -> new WarehouseOverviewResponse.LedgerItem(tx.getId(), tx.getTransactionType().name(), tx.getQuantity(), tx.getProductVariant().getSku(),
                        tx.getProductVariant().getProduct().getName(), tx.getReferenceType().name(), tx.getReferenceId() == null ? null : tx.getReferenceId().toString(), tx.getCreatedBy(), tx.getCreatedAt())).toList();
        return ResponseEntity.ok(new WarehouseOverviewResponse(warehouseService.getWarehouse(warehouse.getId()), balances.size(), onHand, reserved,
                onHand - reserved, balances, recent));
    }

    @GetMapping("/units")
    @Transactional(readOnly = true)
    public ResponseEntity<List<InventoryUnitSummaryResponse>> units(
            @RequestParam UUID warehouseId, @RequestParam UUID variantId) {
        var units = inventoryUnitRepository.findByWarehouseIdAndProductVariantIdOrderByCreatedAtDesc(warehouseId, variantId)
                .stream().map(this::unitSummary).toList();
        return ResponseEntity.ok(units);
    }

    @GetMapping("/units/{unitId}")
    @Transactional(readOnly = true)
    public ResponseEntity<InventoryUnitDetailResponse> unitDetail(@PathVariable Long unitId) {
        InventoryUnit unit = inventoryUnitRepository.findById(unitId).orElseThrow();
        return ResponseEntity.ok(unitDetailResponse(unit));
    }

    private InventoryUnitSummaryResponse unitSummary(InventoryUnit unit) {
        return new InventoryUnitSummaryResponse(unit.getId(), unit.getUnitStatus().name(),
                unit.getIdentifiers().stream().map(identifier -> identifier.getIdentifierType().name() + ": " + identifier.getIdentifierValue()).toList(),
                unit.getReceivedAt(), unit.getSoldAt());
    }

    private InventoryEntityResponse entityResponse(InventoryUnit unit) {
        var variant = unit.getProductVariant();
        var image = variant.getImages().stream().filter(item -> item.isPrimary()).findFirst().or(() -> variant.getImages().stream().findFirst()).map(item -> item.getImageUrl()).orElse(null);
        var identifiers = unit.getIdentifiers();
        var first = identifiers.isEmpty() ? null : identifiers.getFirst().getIdentifierValue();
        return new InventoryEntityResponse(unit.getId(), unit.getWarehouse().getId(), variant.getId(), variant.getProduct().getName(),
                variant.getProduct().getBrand() == null ? null : variant.getProduct().getBrand().getName(), variant.getName(), variant.getSku(), image,
                unit.getWarehouse().getName(), unit.getUnitStatus().name(), maskIdentifier(first),
                identifiers.stream().map(item -> item.getIdentifierType().name()).toList(), unit.getReceivedAt(), unit.getSoldAt());
    }

    private String maskIdentifier(String identifier) {
        if (identifier == null || identifier.isBlank()) return null;
        return identifier.length() <= 8 ? identifier : identifier.substring(0, 4) + "••••••" + identifier.substring(identifier.length() - 4);
    }

    private InventoryUnitDetailResponse unitDetailResponse(InventoryUnit unit) {
        var variant = unit.getProductVariant();
        var image = variant.getImages().stream().filter(item -> item.isPrimary()).findFirst()
                .or(() -> variant.getImages().stream().findFirst()).map(item -> item.getImageUrl()).orElse(null);
        InventoryUnitDetailResponse.Origin origin = null;
        if (unit.getPurchaseOrderItem() != null && unit.getPurchaseOrderItem().getPurchaseOrder() != null) {
            var purchaseOrder = unit.getPurchaseOrderItem().getPurchaseOrder();
            origin = new InventoryUnitDetailResponse.Origin(purchaseOrder.getPurchaseOrderCode(), purchaseOrder.getId(), unit.getReceivedAt());
        }
        InventoryUnitDetailResponse.Reservation reservation = null;
        if (unit.getCurrentReservation() != null) {
            var current = unit.getCurrentReservation();
            reservation = new InventoryUnitDetailResponse.Reservation(current.getId(), current.getOrderId(), current.getStatus().name(), current.getExpiresAt(), current.getReleasedAt());
        }
        InventoryUnitDetailResponse.Sale sale = null;
        if (unit.getSoldOrderItemId() != null) {
            var orderCode = orderItemRepository.findById(unit.getSoldOrderItemId())
                    .map(item -> item.getOrder().getOrderCode()).orElse(null);
            sale = new InventoryUnitDetailResponse.Sale(orderCode, unit.getSoldOrderItemId(), unit.getSoldAt());
        }
        var history = stockTransactionUnitRepository.findByInventoryUnitIdOrderByTransactionCreatedAtDesc(unit.getId()).stream()
                .map(link -> link.getStockTransaction()).map(transaction -> new InventoryUnitDetailResponse.HistoryItem(transaction.getId(), transaction.getTransactionType().name(),
                        transaction.getReferenceType().name(), transaction.getReferenceId(), transaction.getReason(), transaction.getCreatedBy(), transaction.getCreatedAt())).toList();
        return new InventoryUnitDetailResponse(unit.getId(), variant.getProduct().getName(), variant.getName(), variant.getSku(), image,
                unit.getWarehouse().getName(), unit.getUnitStatus().name(), unit.getReceivedAt(), unit.getSoldAt(),
                unit.getIdentifiers().stream().map(item -> new InventoryUnitDetailResponse.Identifier(item.getIdentifierType().name(), item.getIdentifierValue())).toList(),
                origin, reservation, sale, history);
    }
    private InventoryBalanceResponse balance(WarehouseInventory inventory){ int onHand=inventory.getOnHandQuantity()==null?0:inventory.getOnHandQuantity(); int reserved=inventory.getReservedQuantity()==null?0:inventory.getReservedQuantity(); int available=inventory.getAvailableQuantity()==null?onHand-reserved:inventory.getAvailableQuantity(); var variant=inventory.getProductVariant(); String image=variant.getImages().stream().filter(i->i.isPrimary()).findFirst().or(() -> variant.getImages().stream().findFirst()).map(i->i.getImageUrl()).orElse(null); return new InventoryBalanceResponse(inventory.getWarehouse().getId(),inventory.getWarehouse().getName(),variant.getId(),variant.getProduct().getName(),variant.getSku(),variant.getName(),image,onHand,reserved,available,inventory.getReorderLevel()==null?0:inventory.getReorderLevel(),inventory.getUpdatedAt()); }
}
