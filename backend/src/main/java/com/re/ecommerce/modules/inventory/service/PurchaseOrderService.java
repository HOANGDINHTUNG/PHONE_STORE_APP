package com.re.ecommerce.modules.inventory.service;

import com.re.ecommerce.modules.inventory.dto.request.PurchaseOrderRequest;
import com.re.ecommerce.modules.inventory.dto.response.PurchaseOrderResponse;
import com.re.ecommerce.modules.inventory.entity.enums.PurchaseOrderStatus;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface PurchaseOrderService {

    Page<PurchaseOrderResponse> getAllPurchaseOrders(PurchaseOrderStatus status, int page, int size);
    
    Page<PurchaseOrderResponse> getBySupplier(UUID supplierId, int page, int size);
    
    Page<PurchaseOrderResponse> getByWarehouse(UUID warehouseId, int page, int size);

    PurchaseOrderResponse getPurchaseOrder(UUID id);

    PurchaseOrderResponse createPurchaseOrder(PurchaseOrderRequest request);

    PurchaseOrderResponse updatePurchaseOrder(UUID id, PurchaseOrderRequest request);

    PurchaseOrderResponse approvePurchaseOrder(UUID id, UUID approvedBy);
    
    PurchaseOrderResponse cancelPurchaseOrder(UUID id, UUID cancelledBy, String cancelReason);
}
