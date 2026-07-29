package com.re.ecommerce.modules.inventory.service;

import com.re.ecommerce.common.exception.BusinessConflictException;
import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.modules.catalog.entity.ProductVariant;
import com.re.ecommerce.modules.inventory.dto.request.StockAdjustmentRequest;
import com.re.ecommerce.modules.inventory.dto.request.StockImportRequest;
import com.re.ecommerce.modules.inventory.entity.*;
import com.re.ecommerce.modules.inventory.entity.enums.PurchaseOrderStatus;
import com.re.ecommerce.modules.inventory.repository.*;
import com.re.ecommerce.modules.inventory.service.impl.InventoryServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class InventoryServiceImplTest {

    @Mock
    private WarehouseInventoryRepository warehouseInventoryRepository;
    @Mock
    private PurchaseOrderRepository purchaseOrderRepository;
    @Mock
    private PurchaseOrderItemRepository purchaseOrderItemRepository;
    @Mock
    private InventoryUnitRepository inventoryUnitRepository;
    @Mock
    private StockTransactionRepository stockTransactionRepository;
    @Mock
    private InventoryUnitIdentifierRepository inventoryUnitIdentifierRepository;
    @Mock
    private StockReservationRepository stockReservationRepository;

    @InjectMocks
    private InventoryServiceImpl inventoryService;

    private PurchaseOrder po;
    private Warehouse warehouse;
    private PurchaseOrderItem poItem;
    private ProductVariant variant;
    
    private final UUID poId = UUID.randomUUID();
    private final UUID warehouseId = UUID.randomUUID();
    private final UUID variantId = UUID.randomUUID();
    private final Long poItemId = 1L;

    @BeforeEach
    void setUp() {
        warehouse = new Warehouse();
        warehouse.setId(warehouseId);

        variant = mock(ProductVariant.class);
        when(variant.getId()).thenReturn(variantId);

        po = new PurchaseOrder();
        po.setId(poId);
        po.setWarehouse(warehouse);
        po.setStatus(PurchaseOrderStatus.APPROVED);

        poItem = new PurchaseOrderItem();
        poItem.setId(poItemId);
        poItem.setOrderedQuantity(10);
        poItem.setReceivedQuantity(0);
        poItem.setProductVariant(variant);

        // Map po and item securely
        po.getItems().clear();
        po.addItem(poItem);

        when(purchaseOrderRepository.findByIdWithLock(poId)).thenReturn(Optional.of(po));
        when(purchaseOrderItemRepository.findById(poItemId)).thenReturn(Optional.of(poItem));
    }

    @Test
    void receivePurchaseOrder_PoNotFound_ThrowsException() {
        when(purchaseOrderRepository.findByIdWithLock(any())).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> inventoryService.receivePurchaseOrder(poId, new StockImportRequest(UUID.randomUUID(), Collections.emptyList())));
    }

    @Test
    void receivePurchaseOrder_InvalidStatus_ThrowsException() {
        po.setStatus(PurchaseOrderStatus.DRAFT);
        assertThrows(BusinessConflictException.class, () -> inventoryService.receivePurchaseOrder(poId, new StockImportRequest(UUID.randomUUID(), Collections.emptyList())));
    }

    @Test
    void receivePurchaseOrder_ItemNotFound_ThrowsException() {
        StockImportRequest.StockImportItem reqItem = new StockImportRequest.StockImportItem(999L, 5, Collections.emptyList());
        StockImportRequest request = new StockImportRequest(UUID.randomUUID(), List.of(reqItem));
        
        when(purchaseOrderItemRepository.findById(999L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> inventoryService.receivePurchaseOrder(poId, request));
    }

    @Test
    void receivePurchaseOrder_ItemPoMismatch_ThrowsException() {
        PurchaseOrder otherPo = new PurchaseOrder();
        otherPo.setId(UUID.randomUUID());
        poItem.setPurchaseOrder(otherPo); // break the mapping securely

        StockImportRequest.StockImportItem reqItem = new StockImportRequest.StockImportItem(poItemId, 5, Collections.emptyList());
        StockImportRequest request = new StockImportRequest(UUID.randomUUID(), List.of(reqItem));
        
        assertThrows(BusinessConflictException.class, () -> inventoryService.receivePurchaseOrder(poId, request));
    }

    @Test
    void receivePurchaseOrder_ExceedQuantity_ThrowsException() {
        StockImportRequest.StockImportItem reqItem = new StockImportRequest.StockImportItem(poItemId, 15, Collections.emptyList()); // ordered is 10
        StockImportRequest request = new StockImportRequest(UUID.randomUUID(), List.of(reqItem));
        
        assertThrows(BusinessConflictException.class, () -> inventoryService.receivePurchaseOrder(poId, request));
    }

    @Test
    void receivePurchaseOrder_PartialReceive_CreatesInventory_UpdatesPoStatus() {
        Map<String, String> idents = new HashMap<>();
        idents.put("IMEI_1", "123456789012345");
        
        StockImportRequest.StockImportItem reqItem = new StockImportRequest.StockImportItem(poItemId, 5, List.of(idents));
        StockImportRequest request = new StockImportRequest(UUID.randomUUID(), List.of(reqItem));

        when(warehouseInventoryRepository.findByIdWithLock(any(WarehouseInventoryId.class))).thenReturn(Optional.empty()); // simulate new creation

        inventoryService.receivePurchaseOrder(poId, request);
        
        assertEquals(5, poItem.getReceivedQuantity());
        assertEquals(PurchaseOrderStatus.PARTIALLY_RECEIVED, po.getStatus());
        
        // 5 unities created (but only 1 has IMEI in the nested loop theoretically if we listOf idents per quantite but loop runs over request ident list size)
        verify(inventoryUnitRepository, times(5)).save(any(InventoryUnit.class));
        verify(warehouseInventoryRepository, times(1)).save(any());
        verify(stockTransactionRepository, times(1)).save(any());
    }

    @Test
    void receivePurchaseOrder_FullReceive_ExistingInventory_UpdatesPoStatus() {
        StockImportRequest.StockImportItem reqItem = new StockImportRequest.StockImportItem(poItemId, 10, null);
        StockImportRequest request = new StockImportRequest(UUID.randomUUID(), List.of(reqItem));

        WarehouseInventory existingInv = new WarehouseInventory();
        existingInv.setOnHandQuantity(2);
        existingInv.setReservedQuantity(0);
        when(warehouseInventoryRepository.findByIdWithLock(any())).thenReturn(Optional.of(existingInv));

        inventoryService.receivePurchaseOrder(poId, request);
        
        assertEquals(10, poItem.getReceivedQuantity());
        assertEquals(PurchaseOrderStatus.COMPLETED, po.getStatus());
        assertEquals(12, existingInv.getOnHandQuantity()); // 2 + 10
        
        verify(inventoryUnitRepository, times(10)).save(any(InventoryUnit.class));
        verify(warehouseInventoryRepository, times(1)).save(existingInv);
        verify(stockTransactionRepository, times(1)).save(any());
    }

    @Test
    void getAvailableStockCount_Found() {
        WarehouseInventory existingInv = new WarehouseInventory();
        existingInv.setOnHandQuantity(10);
        existingInv.setReservedQuantity(3);
        when(warehouseInventoryRepository.findById(any())).thenReturn(Optional.of(existingInv));
        
        Integer count = inventoryService.getAvailableStockCount(warehouseId, variantId);
        assertEquals(7, count);
    }

    @Test
    void getAvailableStockCount_NotFound_ReturnsZero() {
        when(warehouseInventoryRepository.findById(any())).thenReturn(Optional.empty());
        
        Integer count = inventoryService.getAvailableStockCount(warehouseId, variantId);
        assertEquals(0, count);
    }

    @Test
    void getWarehouseInventory_Found() {
        WarehouseInventory existingInv = new WarehouseInventory();
        when(warehouseInventoryRepository.findById(any())).thenReturn(Optional.of(existingInv));
        
        WarehouseInventory inv = inventoryService.getWarehouseInventory(warehouseId, variantId);
        assertNotNull(inv);
    }

    @Test
    void getWarehouseInventory_NotFound_ThrowsException() {
        when(warehouseInventoryRepository.findById(any())).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> inventoryService.getWarehouseInventory(warehouseId, variantId));
    }

    @Test
    void listBalances_ReturnsPage() {
        when(warehouseInventoryRepository.findAll(any(Pageable.class))).thenReturn(new PageImpl<>(Collections.emptyList()));
        Page<WarehouseInventory> res = inventoryService.listBalances(1, 10);
        assertNotNull(res);
    }

    @Test
    void listSerializedUnits_ReturnsPage() {
        when(inventoryUnitRepository.findAll(any(Pageable.class))).thenReturn(new PageImpl<>(Collections.emptyList()));
        Page<InventoryUnit> res = inventoryService.listSerializedUnits(1, 10);
        assertNotNull(res);
    }

    @Test
    void listLedger_ReturnsPage() {
        when(stockTransactionRepository.findAll(any(Pageable.class))).thenReturn(new PageImpl<>(Collections.emptyList()));
        Page<StockTransaction> res = inventoryService.listLedger(1, 10);
        assertNotNull(res);
    }

    @Test
    void listReservations_ReturnsPage() {
        when(stockReservationRepository.findAll(any(Pageable.class))).thenReturn(new PageImpl<>(Collections.emptyList()));
        Page<StockReservation> res = inventoryService.listReservations(1, 10);
        assertNotNull(res);
    }

    @Test
    void lookupUnitByIdentifier_Found() {
        InventoryUnit unit = new InventoryUnit();
        InventoryUnitIdentifier ident = new InventoryUnitIdentifier();
        ident.setInventoryUnit(unit);
        when(inventoryUnitIdentifierRepository.findByNormalizedIdentifier("1234")).thenReturn(Optional.of(ident));
        
        InventoryUnit result = inventoryService.lookupUnitByIdentifier("  1234 ");
        assertEquals(unit, result);
    }

    @Test
    void lookupUnitByIdentifier_NotFound_ThrowsException() {
        when(inventoryUnitIdentifierRepository.findByNormalizedIdentifier(any())).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> inventoryService.lookupUnitByIdentifier("123"));
    }

    @Test
    void createManualAdjustment_AdjustIn_Success() {
        WarehouseInventory inv = new WarehouseInventory();
        inv.setWarehouse(warehouse);
        inv.setProductVariant(variant);
        inv.setOnHandQuantity(5);
        inv.setReservedQuantity(0);

        when(warehouseInventoryRepository.findByIdWithLock(any())).thenReturn(Optional.of(inv));
        
        StockAdjustmentRequest req = new StockAdjustmentRequest(warehouseId, variantId, "ADJUST_IN", 10, "test reason", null);
        inventoryService.createManualAdjustment(req, "test_key");
        
        assertEquals(15, inv.getOnHandQuantity());
        verify(warehouseInventoryRepository).save(inv);
        verify(stockTransactionRepository).save(any());
    }

    @Test
    void createManualAdjustment_AdjustOut_Success() {
        WarehouseInventory inv = new WarehouseInventory();
        inv.setWarehouse(warehouse);
        inv.setProductVariant(variant);
        inv.setOnHandQuantity(10);
        inv.setReservedQuantity(2); // available is 8

        when(warehouseInventoryRepository.findByIdWithLock(any())).thenReturn(Optional.of(inv));
        
        StockAdjustmentRequest req = new StockAdjustmentRequest(warehouseId, variantId, "ADJUST_OUT", 5, "test reason", null);
        inventoryService.createManualAdjustment(req, "test_key");
        
        assertEquals(5, inv.getOnHandQuantity());
        verify(warehouseInventoryRepository).save(inv);
        verify(stockTransactionRepository).save(any());
    }

    @Test
    void createManualAdjustment_AdjustOut_InsufficientStock_ThrowsException() {
        WarehouseInventory inv = new WarehouseInventory();
        inv.setWarehouse(warehouse);
        inv.setProductVariant(variant);
        inv.setOnHandQuantity(10);
        inv.setReservedQuantity(2); // available is 8

        when(warehouseInventoryRepository.findByIdWithLock(any())).thenReturn(Optional.of(inv));
        
        StockAdjustmentRequest req = new StockAdjustmentRequest(warehouseId, variantId, "ADJUST_OUT", 10, "test reason", null);
        assertThrows(BusinessConflictException.class, () -> inventoryService.createManualAdjustment(req, "test_key"));
    }

    @Test
    void createManualAdjustment_InvalidDirection_ThrowsException() {
        WarehouseInventory inv = new WarehouseInventory();
        when(warehouseInventoryRepository.findByIdWithLock(any())).thenReturn(Optional.of(inv));
        
        StockAdjustmentRequest req = new StockAdjustmentRequest(warehouseId, variantId, "INVALID", 10, "test reason", null);
        assertThrows(BusinessConflictException.class, () -> inventoryService.createManualAdjustment(req, "test_key"));
    }

    @Test
    void createManualAdjustment_InventoryNotFound_ThrowsException() {
        when(warehouseInventoryRepository.findByIdWithLock(any())).thenReturn(Optional.empty());
        StockAdjustmentRequest req = new StockAdjustmentRequest(warehouseId, variantId, "ADJUST_IN", 10, "test reason", null);
        assertThrows(ResourceNotFoundException.class, () -> inventoryService.createManualAdjustment(req, "test_key"));
    }
}
