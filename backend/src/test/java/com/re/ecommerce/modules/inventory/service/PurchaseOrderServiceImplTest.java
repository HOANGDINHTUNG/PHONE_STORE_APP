package com.re.ecommerce.modules.inventory.service;

import com.re.ecommerce.common.exception.BusinessConflictException;
import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.modules.catalog.entity.ProductVariant;
import com.re.ecommerce.modules.catalog.repository.ProductVariantRepository;
import com.re.ecommerce.modules.inventory.dto.request.PurchaseOrderItemRequest;
import com.re.ecommerce.modules.inventory.dto.request.PurchaseOrderRequest;
import com.re.ecommerce.modules.inventory.dto.response.PurchaseOrderResponse;
import com.re.ecommerce.modules.inventory.entity.PurchaseOrder;
import com.re.ecommerce.modules.inventory.entity.PurchaseOrderItem;
import com.re.ecommerce.modules.inventory.entity.Supplier;
import com.re.ecommerce.modules.inventory.entity.Warehouse;
import com.re.ecommerce.modules.inventory.entity.enums.PurchaseOrderStatus;
import com.re.ecommerce.modules.inventory.repository.PurchaseOrderRepository;
import com.re.ecommerce.modules.inventory.repository.SupplierRepository;
import com.re.ecommerce.modules.inventory.repository.WarehouseRepository;
import com.re.ecommerce.modules.inventory.service.impl.PurchaseOrderServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@org.mockito.junit.jupiter.MockitoSettings(strictness = org.mockito.quality.Strictness.LENIENT)
class PurchaseOrderServiceImplTest {

    @Mock
    private PurchaseOrderRepository purchaseOrderRepository;

    @Mock
    private SupplierRepository supplierRepository;

    @Mock
    private WarehouseRepository warehouseRepository;

    @Mock
    private ProductVariantRepository productVariantRepository;

    @InjectMocks
    private PurchaseOrderServiceImpl purchaseOrderService;

    private PurchaseOrder purchaseOrder;
    private Supplier supplier;
    private Warehouse warehouse;
    private ProductVariant variant;
    private final UUID poId = UUID.randomUUID();
    private final UUID supplierId = UUID.randomUUID();
    private final UUID warehouseId = UUID.randomUUID();
    private final UUID variantId = UUID.randomUUID();
    private final Long itemId = 100L;

    @BeforeEach
    void setUp() {
        supplier = new Supplier();
        supplier.setId(supplierId);
        supplier.setName("Supplier A");

        warehouse = new Warehouse();
        warehouse.setId(warehouseId);
        warehouse.setName("Warehouse A");

        variant = mock(ProductVariant.class);
        when(variant.getId()).thenReturn(variantId);
        when(variant.getName()).thenReturn("iPhone 15");
        when(variant.getSku()).thenReturn("IP15-128");

        purchaseOrder = new PurchaseOrder();
        purchaseOrder.setId(poId);
        purchaseOrder.setPurchaseOrderCode("PO123");
        purchaseOrder.setSupplier(supplier);
        purchaseOrder.setWarehouse(warehouse);
        purchaseOrder.setStatus(PurchaseOrderStatus.DRAFT);
        purchaseOrder.setTotalAmount(BigDecimal.ZERO);
    }

    @Test
    void getAllPurchaseOrders_WithStatus_ReturnsPagedResponse() {
        PurchaseOrderItem dummy = new PurchaseOrderItem();
        dummy.setProductVariant(variant);
        dummy.setOrderedQuantity(1);
        dummy.setUnitCost(BigDecimal.ONE);
        purchaseOrder.addItem(dummy);

        Pageable pageable = PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "createdAt"));
        when(purchaseOrderRepository.findByStatus(eq(PurchaseOrderStatus.DRAFT), eq(pageable)))
                .thenReturn(new PageImpl<>(List.of(purchaseOrder)));

        Page<PurchaseOrderResponse> result = purchaseOrderService.getAllPurchaseOrders(PurchaseOrderStatus.DRAFT, 1, 10);

        assertEquals(1, result.getTotalElements());
        assertEquals(PurchaseOrderStatus.DRAFT, result.getContent().get(0).status());
        verify(purchaseOrderRepository).findByStatus(any(), any());
    }

    @Test
    void getAllPurchaseOrders_WithoutStatus_ReturnsPagedResponse() {
        PurchaseOrderItem dummy = new PurchaseOrderItem();
        dummy.setProductVariant(variant);
        dummy.setOrderedQuantity(1);
        dummy.setUnitCost(BigDecimal.ONE);
        purchaseOrder.addItem(dummy);

        Pageable pageable = PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "createdAt"));
        when(purchaseOrderRepository.findAll(eq(pageable)))
                .thenReturn(new PageImpl<>(List.of(purchaseOrder)));

        Page<PurchaseOrderResponse> result = purchaseOrderService.getAllPurchaseOrders(null, 1, 10);

        assertEquals(1, result.getTotalElements());
        verify(purchaseOrderRepository).findAll((Pageable) any());
    }

    @Test
    void getBySupplier_ReturnsPagedResponse() {
        PurchaseOrderItem dummy = new PurchaseOrderItem();
        dummy.setProductVariant(variant);
        dummy.setOrderedQuantity(1);
        dummy.setUnitCost(BigDecimal.ONE);
        purchaseOrder.addItem(dummy);

        when(purchaseOrderRepository.findBySupplierId(eq(supplierId), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(purchaseOrder)));

        Page<PurchaseOrderResponse> result = purchaseOrderService.getBySupplier(supplierId, 1, 10);

        assertEquals(1, result.getTotalElements());
        assertEquals(supplierId, result.getContent().get(0).supplierId());
    }

    @Test
    void getByWarehouse_ReturnsPagedResponse() {
        PurchaseOrderItem dummy = new PurchaseOrderItem();
        dummy.setProductVariant(variant);
        dummy.setOrderedQuantity(1);
        dummy.setUnitCost(BigDecimal.ONE);
        purchaseOrder.addItem(dummy);

        when(purchaseOrderRepository.findByWarehouseId(eq(warehouseId), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(purchaseOrder)));

        Page<PurchaseOrderResponse> result = purchaseOrderService.getByWarehouse(warehouseId, 1, 10);

        assertEquals(1, result.getTotalElements());
        assertEquals(warehouseId, result.getContent().get(0).warehouseId());
    }

    @Test
    void getPurchaseOrder_Success() {
        PurchaseOrderItem dummy = new PurchaseOrderItem();
        dummy.setProductVariant(variant);
        dummy.setOrderedQuantity(1);
        dummy.setUnitCost(BigDecimal.ONE);
        purchaseOrder.addItem(dummy);

        when(purchaseOrderRepository.findById(poId)).thenReturn(Optional.of(purchaseOrder));
        PurchaseOrderResponse result = purchaseOrderService.getPurchaseOrder(poId);
        assertNotNull(result);
        assertEquals(poId, result.id());
    }

    @Test
    void getPurchaseOrder_NotFound_ThrowsException() {
        when(purchaseOrderRepository.findById(poId)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> purchaseOrderService.getPurchaseOrder(poId));
    }

    @Test
    void createPurchaseOrder_Success() {
        PurchaseOrderItemRequest itemRequest = new PurchaseOrderItemRequest(variantId, 10, new BigDecimal("100.00"));
        PurchaseOrderRequest request = new PurchaseOrderRequest("PO123", supplierId, warehouseId, LocalDateTime.now().plusDays(2), "Note", List.of(itemRequest));

        when(purchaseOrderRepository.findByPurchaseOrderCode("PO123")).thenReturn(Optional.empty());
        when(supplierRepository.findById(supplierId)).thenReturn(Optional.of(supplier));
        when(warehouseRepository.findById(warehouseId)).thenReturn(Optional.of(warehouse));
        when(productVariantRepository.findById(variantId)).thenReturn(Optional.of(variant));
        
        when(purchaseOrderRepository.save(any(PurchaseOrder.class))).thenAnswer(i -> {
            PurchaseOrder saved = i.getArgument(0);
            saved.setId(UUID.randomUUID());
            return saved;
        });

        PurchaseOrderResponse result = purchaseOrderService.createPurchaseOrder(request);

        assertNotNull(result);
        assertEquals("PO123", result.purchaseOrderCode());
        assertEquals(new BigDecimal("1000.00"), result.totalAmount());
        assertEquals(1, result.items().size());
    }

    @Test
    void createPurchaseOrder_CodeExists_ThrowsException() {
        PurchaseOrderRequest request = new PurchaseOrderRequest("PO123", supplierId, warehouseId, null, null, Collections.emptyList());
        when(purchaseOrderRepository.findByPurchaseOrderCode("PO123")).thenReturn(Optional.of(purchaseOrder));
        assertThrows(BusinessConflictException.class, () -> purchaseOrderService.createPurchaseOrder(request));
    }

    @Test
    void createPurchaseOrder_SupplierNotFound_ThrowsException() {
        PurchaseOrderRequest request = new PurchaseOrderRequest("PO123", supplierId, warehouseId, null, null, Collections.emptyList());
        when(purchaseOrderRepository.findByPurchaseOrderCode(anyString())).thenReturn(Optional.empty());
        when(supplierRepository.findById(supplierId)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> purchaseOrderService.createPurchaseOrder(request));
    }

    @Test
    void createPurchaseOrder_WarehouseNotFound_ThrowsException() {
        PurchaseOrderRequest request = new PurchaseOrderRequest("PO123", supplierId, warehouseId, null, null, Collections.emptyList());
        when(purchaseOrderRepository.findByPurchaseOrderCode(anyString())).thenReturn(Optional.empty());
        when(supplierRepository.findById(supplierId)).thenReturn(Optional.of(supplier));
        when(warehouseRepository.findById(warehouseId)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> purchaseOrderService.createPurchaseOrder(request));
    }

    @Test
    void createPurchaseOrder_VariantNotFound_ThrowsException() {
        PurchaseOrderItemRequest itemRequest = new PurchaseOrderItemRequest(variantId, 10, new BigDecimal("100.00"));
        PurchaseOrderRequest request = new PurchaseOrderRequest("PO123", supplierId, warehouseId, null, null, List.of(itemRequest));

        when(purchaseOrderRepository.findByPurchaseOrderCode(anyString())).thenReturn(Optional.empty());
        when(supplierRepository.findById(supplierId)).thenReturn(Optional.of(supplier));
        when(warehouseRepository.findById(warehouseId)).thenReturn(Optional.of(warehouse));
        when(productVariantRepository.findById(variantId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> purchaseOrderService.createPurchaseOrder(request));
    }

    @Test
    void updatePurchaseOrder_Success() {
        PurchaseOrderItemRequest itemRequest = new PurchaseOrderItemRequest(variantId, 5, new BigDecimal("50.00"));
        PurchaseOrderRequest request = new PurchaseOrderRequest("PO123", supplierId, warehouseId, null, null, List.of(itemRequest));

        when(purchaseOrderRepository.findByIdWithLock(poId)).thenReturn(Optional.of(purchaseOrder));
        when(supplierRepository.findById(supplierId)).thenReturn(Optional.of(supplier));
        when(warehouseRepository.findById(warehouseId)).thenReturn(Optional.of(warehouse));
        when(productVariantRepository.findById(variantId)).thenReturn(Optional.of(variant));
        when(purchaseOrderRepository.save(any(PurchaseOrder.class))).thenAnswer(i -> i.getArgument(0));

        PurchaseOrderResponse result = purchaseOrderService.updatePurchaseOrder(poId, request);

        assertEquals(new BigDecimal("250.00"), result.totalAmount());
        assertEquals(1, result.items().size());
        verify(purchaseOrderRepository).flush();
    }

    @Test
    void updatePurchaseOrder_CodeChangedAndExists_ThrowsException() {
        PurchaseOrderRequest request = new PurchaseOrderRequest("PO_NEW", supplierId, warehouseId, null, null, Collections.emptyList());
        when(purchaseOrderRepository.findByIdWithLock(poId)).thenReturn(Optional.of(purchaseOrder));
        when(purchaseOrderRepository.findByPurchaseOrderCode("PO_NEW")).thenReturn(Optional.of(new PurchaseOrder()));

        assertThrows(BusinessConflictException.class, () -> purchaseOrderService.updatePurchaseOrder(poId, request));
    }

    @Test
    void updatePurchaseOrder_NotDraft_ThrowsException() {
        purchaseOrder.setStatus(PurchaseOrderStatus.PENDING_APPROVAL);
        when(purchaseOrderRepository.findByIdWithLock(poId)).thenReturn(Optional.of(purchaseOrder));
        assertThrows(BusinessConflictException.class, () -> purchaseOrderService.updatePurchaseOrder(poId, null));
    }

    @Test
    void addItem_Success() {
        PurchaseOrderItemRequest request = new PurchaseOrderItemRequest(variantId, 2, new BigDecimal("20.00"));
        when(purchaseOrderRepository.findByIdWithLock(poId)).thenReturn(Optional.of(purchaseOrder));
        when(productVariantRepository.findById(variantId)).thenReturn(Optional.of(variant));
        when(purchaseOrderRepository.save(any(PurchaseOrder.class))).thenAnswer(i -> i.getArgument(0));

        PurchaseOrderResponse result = purchaseOrderService.addItem(poId, request);
        assertEquals(new BigDecimal("40.00"), result.totalAmount());
        assertEquals(1, result.items().size());
    }

    @Test
    void addItem_DuplicateVariant_ThrowsException() {
        PurchaseOrderItem existing = new PurchaseOrderItem();
        existing.setProductVariant(variant);
        purchaseOrder.addItem(existing);

        PurchaseOrderItemRequest request = new PurchaseOrderItemRequest(variantId, 2, new BigDecimal("20.00"));
        when(purchaseOrderRepository.findByIdWithLock(poId)).thenReturn(Optional.of(purchaseOrder));
        when(productVariantRepository.findById(variantId)).thenReturn(Optional.of(variant));

        assertThrows(BusinessConflictException.class, () -> purchaseOrderService.addItem(poId, request));
    }

    @Test
    void updateItem_Success() {
        PurchaseOrderItem existing = new PurchaseOrderItem();
        existing.setId(itemId);
        existing.setProductVariant(variant);
        existing.setOrderedQuantity(2);
        existing.setUnitCost(new BigDecimal("20.00"));
        
        // Internal lists setup is required if not using helpers fully
        purchaseOrder.getItems().clear();
        purchaseOrder.addItem(existing);
        purchaseOrder.setTotalAmount(new BigDecimal("40.00"));

        PurchaseOrderItemRequest request = new PurchaseOrderItemRequest(variantId, 5, new BigDecimal("10.00"));
        when(purchaseOrderRepository.findByIdWithLock(poId)).thenReturn(Optional.of(purchaseOrder));
        when(purchaseOrderRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        PurchaseOrderResponse result = purchaseOrderService.updateItem(poId, itemId, request);
        assertEquals(new BigDecimal("50.00"), result.totalAmount());
    }

    @Test
    void updateItem_ItemNotFound_ThrowsException() {
        purchaseOrder.getItems().clear();
        when(purchaseOrderRepository.findByIdWithLock(poId)).thenReturn(Optional.of(purchaseOrder));
        assertThrows(ResourceNotFoundException.class, () -> purchaseOrderService.updateItem(poId, itemId, new PurchaseOrderItemRequest(variantId, 1, BigDecimal.ZERO)));
    }

    @Test
    void removeItem_Success() {
        PurchaseOrderItem existing = new PurchaseOrderItem();
        existing.setId(itemId);
        existing.setOrderedQuantity(3);
        existing.setUnitCost(new BigDecimal("10.00"));
        existing.setProductVariant(variant);
        purchaseOrder.getItems().clear();
        purchaseOrder.addItem(existing);
        purchaseOrder.setTotalAmount(new BigDecimal("30.00"));

        when(purchaseOrderRepository.findByIdWithLock(poId)).thenReturn(Optional.of(purchaseOrder));
        when(purchaseOrderRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        PurchaseOrderResponse result = purchaseOrderService.removeItem(poId, itemId);
        assertEquals(new BigDecimal("0.00"), result.totalAmount());
        assertEquals(0, result.items().size());
    }

    @Test
    void submitPurchaseOrder_Success() {
        PurchaseOrderItem item = new PurchaseOrderItem();
        item.setProductVariant(mock(ProductVariant.class));
        item.setOrderedQuantity(5);
        item.setUnitCost(new BigDecimal("100.00"));
        purchaseOrder.getItems().clear();
        purchaseOrder.addItem(item);

        when(purchaseOrderRepository.findByIdWithLock(poId)).thenReturn(Optional.of(purchaseOrder));
        when(purchaseOrderRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        PurchaseOrderResponse result = purchaseOrderService.submitPurchaseOrder(poId, UUID.randomUUID());
        assertEquals(PurchaseOrderStatus.PENDING_APPROVAL, result.status());
    }

    @Test
    void submitPurchaseOrder_Empty_ThrowsException() {
        purchaseOrder.getItems().clear();
        when(purchaseOrderRepository.findByIdWithLock(poId)).thenReturn(Optional.of(purchaseOrder));
        assertThrows(BusinessConflictException.class, () -> purchaseOrderService.submitPurchaseOrder(poId, UUID.randomUUID()));
    }

    @Test
    void approvePurchaseOrder_Success() {
        purchaseOrder.setStatus(PurchaseOrderStatus.PENDING_APPROVAL);
        PurchaseOrderItem dummy = new PurchaseOrderItem();
        dummy.setProductVariant(variant);
        dummy.setOrderedQuantity(1);
        dummy.setUnitCost(BigDecimal.ONE);
        purchaseOrder.addItem(dummy);
        when(purchaseOrderRepository.findByIdWithLock(poId)).thenReturn(Optional.of(purchaseOrder));
        when(purchaseOrderRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        UUID ap = UUID.randomUUID();
        PurchaseOrderResponse result = purchaseOrderService.approvePurchaseOrder(poId, ap);
        assertEquals(PurchaseOrderStatus.APPROVED, result.status());
        assertEquals(ap, result.approvedBy());
    }

    @Test
    void cancelPurchaseOrder_Success() {
        purchaseOrder.setStatus(PurchaseOrderStatus.PENDING_APPROVAL);
        PurchaseOrderItem dummy = new PurchaseOrderItem();
        dummy.setProductVariant(variant);
        dummy.setOrderedQuantity(1);
        dummy.setUnitCost(BigDecimal.ONE);
        purchaseOrder.addItem(dummy);
        when(purchaseOrderRepository.findByIdWithLock(poId)).thenReturn(Optional.of(purchaseOrder));
        when(purchaseOrderRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        UUID cp = UUID.randomUUID();
        PurchaseOrderResponse result = purchaseOrderService.cancelPurchaseOrder(poId, cp, "Cancel");
        assertEquals(PurchaseOrderStatus.CANCELLED, result.status());
        assertEquals("Cancel", result.cancelReason());
    }
    
    @Test
    void cancelPurchaseOrder_AlreadyCompleted_ThrowsException() {
        purchaseOrder.setStatus(PurchaseOrderStatus.COMPLETED);
        when(purchaseOrderRepository.findByIdWithLock(poId)).thenReturn(Optional.of(purchaseOrder));
        assertThrows(BusinessConflictException.class, () -> purchaseOrderService.cancelPurchaseOrder(poId, UUID.randomUUID(), ""));
    }
}
