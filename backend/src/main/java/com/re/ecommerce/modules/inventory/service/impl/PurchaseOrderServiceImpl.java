package com.re.ecommerce.modules.inventory.service.impl;

import com.re.ecommerce.common.exception.BusinessConflictException;
import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.modules.catalog.entity.ProductVariant;
import com.re.ecommerce.modules.catalog.repository.ProductVariantRepository;
import com.re.ecommerce.modules.inventory.dto.request.PurchaseOrderItemRequest;
import com.re.ecommerce.modules.inventory.dto.request.PurchaseOrderRequest;
import com.re.ecommerce.modules.inventory.dto.response.PurchaseOrderItemResponse;
import com.re.ecommerce.modules.inventory.dto.response.PurchaseOrderResponse;
import com.re.ecommerce.modules.inventory.entity.PurchaseOrder;
import com.re.ecommerce.modules.inventory.entity.PurchaseOrderItem;
import com.re.ecommerce.modules.inventory.entity.Supplier;
import com.re.ecommerce.modules.inventory.entity.Warehouse;
import com.re.ecommerce.modules.inventory.entity.enums.PurchaseOrderStatus;
import com.re.ecommerce.modules.inventory.repository.PurchaseOrderRepository;
import com.re.ecommerce.modules.inventory.repository.SupplierRepository;
import com.re.ecommerce.modules.inventory.repository.WarehouseRepository;
import com.re.ecommerce.modules.inventory.service.PurchaseOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class PurchaseOrderServiceImpl implements PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final SupplierRepository supplierRepository;
    private final WarehouseRepository warehouseRepository;
    private final ProductVariantRepository productVariantRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<PurchaseOrderResponse> getAllPurchaseOrders(PurchaseOrderStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<PurchaseOrder> pageResult = (status != null)
                ? purchaseOrderRepository.findByStatus(status, pageable)
                : purchaseOrderRepository.findAll(pageable);
        return pageResult.map(this::mapToResponse);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<PurchaseOrderResponse> getBySupplier(UUID supplierId, int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return purchaseOrderRepository.findBySupplierId(supplierId, pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PurchaseOrderResponse> getByWarehouse(UUID warehouseId, int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return purchaseOrderRepository.findByWarehouseId(warehouseId, pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public PurchaseOrderResponse getPurchaseOrder(UUID id) {
        return mapToResponse(findById(id));
    }

    @Override
    @Transactional
    public PurchaseOrderResponse createPurchaseOrder(PurchaseOrderRequest request) {
        if (purchaseOrderRepository.findByPurchaseOrderCode(request.purchaseOrderCode()).isPresent()) {
            throw new BusinessConflictException("PO_CODE_EXISTS", "Mã đơn mua hàng đã tồn tại");
        }

        Supplier supplier = supplierRepository.findById(request.supplierId())
                .orElseThrow(() -> new ResourceNotFoundException("SUPPLIER_NOT_FOUND", "Không tìm thấy nhà cung cấp"));
        
        Warehouse warehouse = warehouseRepository.findById(request.warehouseId())
                .orElseThrow(() -> new ResourceNotFoundException("WAREHOUSE_NOT_FOUND", "Không tìm thấy kho"));

        PurchaseOrder po = new PurchaseOrder();
        po.setPurchaseOrderCode(request.purchaseOrderCode());
        po.setSupplier(supplier);
        po.setWarehouse(warehouse);
        po.setExpectedAt(request.expectedAt());
        po.setNote(request.note());
        po.setStatus(PurchaseOrderStatus.DRAFT);
        
        BigDecimal totalAmount = BigDecimal.ZERO;
        
        for (PurchaseOrderItemRequest itemReq : request.items()) {
            ProductVariant variant = productVariantRepository.findById(itemReq.productVariantId())
                    .orElseThrow(() -> new ResourceNotFoundException("VARIANT_NOT_FOUND", "Sản phẩm không tồn tại: " + itemReq.productVariantId()));
            
            PurchaseOrderItem item = new PurchaseOrderItem();
            item.setProductVariant(variant);
            item.setOrderedQuantity(itemReq.orderedQuantity());
            item.setReceivedQuantity(0);
            item.setUnitCost(itemReq.unitCost());
            
            po.addItem(item);
            
            BigDecimal lineTotal = itemReq.unitCost().multiply(BigDecimal.valueOf(itemReq.orderedQuantity()));
            totalAmount = totalAmount.add(lineTotal);
        }
        
        po.setTotalAmount(totalAmount);
        return mapToResponse(purchaseOrderRepository.save(po));
    }

    @Override
    @Transactional
    public PurchaseOrderResponse updatePurchaseOrder(UUID id, PurchaseOrderRequest request) {
        PurchaseOrder po = purchaseOrderRepository.findByIdWithLock(id)
                .orElseThrow(() -> new ResourceNotFoundException("PO_NOT_FOUND", "Không tìm thấy PO"));
        
        if (po.getStatus() != PurchaseOrderStatus.DRAFT) {
            throw new BusinessConflictException("PO_NOT_DRAFT", "Chỉ được sửa PO ở trạng thái DRAFT");
        }
        
        if (!po.getPurchaseOrderCode().equals(request.purchaseOrderCode()) && 
            purchaseOrderRepository.findByPurchaseOrderCode(request.purchaseOrderCode()).isPresent()) {
            throw new BusinessConflictException("PO_CODE_EXISTS", "Mã PO đã tồn tại");
        }
        
        Supplier supplier = supplierRepository.findById(request.supplierId())
                .orElseThrow(() -> new ResourceNotFoundException("SUPPLIER_NOT_FOUND", "Không tìm thấy Supplier"));
        Warehouse warehouse = warehouseRepository.findById(request.warehouseId())
                .orElseThrow(() -> new ResourceNotFoundException("WAREHOUSE_NOT_FOUND", "Không tìm thấy Warehouse"));
                
        po.setPurchaseOrderCode(request.purchaseOrderCode());
        po.setSupplier(supplier);
        po.setWarehouse(warehouse);
        po.setExpectedAt(request.expectedAt());
        po.setNote(request.note());
        
        po.getItems().clear(); // Reset 
        purchaseOrderRepository.flush();
        
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (PurchaseOrderItemRequest itemReq : request.items()) {
            ProductVariant variant = productVariantRepository.findById(itemReq.productVariantId())
                    .orElseThrow(() -> new ResourceNotFoundException("VARIANT_NOT_FOUND", "Variant không tồn tại: " + itemReq.productVariantId()));
            
            PurchaseOrderItem item = new PurchaseOrderItem();
            item.setProductVariant(variant);
            item.setOrderedQuantity(itemReq.orderedQuantity());
            item.setReceivedQuantity(0);
            item.setUnitCost(itemReq.unitCost());
            po.addItem(item);
            
            totalAmount = totalAmount.add(itemReq.unitCost().multiply(BigDecimal.valueOf(itemReq.orderedQuantity())));
        }
        po.setTotalAmount(totalAmount);
        
        return mapToResponse(purchaseOrderRepository.save(po));
    }

    @Override
    @Transactional
    public PurchaseOrderResponse addItem(UUID poId, PurchaseOrderItemRequest request) {
        PurchaseOrder po = purchaseOrderRepository.findByIdWithLock(poId)
                .orElseThrow(() -> new ResourceNotFoundException("PO_NOT_FOUND", "Không tìm thấy PO"));

        if (po.getStatus() != PurchaseOrderStatus.DRAFT) {
            throw new BusinessConflictException("PO_NOT_DRAFT", "Chỉ được sửa hàng trong PO ở trạng thái DRAFT");
        }
        
        ProductVariant variant = productVariantRepository.findById(request.productVariantId())
                .orElseThrow(() -> new ResourceNotFoundException("VARIANT_NOT_FOUND", "Variant không tồn tại"));
                
        // Check if item already exists
        if (po.getItems().stream().anyMatch(i -> i.getProductVariant().getId().equals(variant.getId()))) {
            throw new BusinessConflictException("DUPLICATE_ITEM", "Sản phẩm đã tồn tại trong PO");
        }
        
        PurchaseOrderItem item = new PurchaseOrderItem();
        item.setProductVariant(variant);
        item.setOrderedQuantity(request.orderedQuantity());
        item.setReceivedQuantity(0);
        item.setUnitCost(request.unitCost());
        
        po.addItem(item);
        
        // Recompute total
        po.setTotalAmount(po.getTotalAmount().add(request.unitCost().multiply(BigDecimal.valueOf(request.orderedQuantity()))));
        return mapToResponse(purchaseOrderRepository.save(po));
    }

    @Override
    @Transactional
    public PurchaseOrderResponse updateItem(UUID poId, Long itemId, PurchaseOrderItemRequest request) {
        PurchaseOrder po = purchaseOrderRepository.findByIdWithLock(poId)
                .orElseThrow(() -> new ResourceNotFoundException("PO_NOT_FOUND", "Không tìm thấy PO"));

        if (po.getStatus() != PurchaseOrderStatus.DRAFT) {
            throw new BusinessConflictException("PO_NOT_DRAFT", "Chỉ được sửa hàng trong PO ở trạng thái DRAFT");
        }
        
        PurchaseOrderItem item = po.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("ITEM_NOT_FOUND", "Không tìm thấy item trong PO"));
                
        // subtract old line total
        BigDecimal oldLineTotal = item.getUnitCost().multiply(BigDecimal.valueOf(item.getOrderedQuantity()));
        po.setTotalAmount(po.getTotalAmount().subtract(oldLineTotal));
        
        item.setOrderedQuantity(request.orderedQuantity());
        item.setUnitCost(request.unitCost());
        
        // add new line total
        BigDecimal newLineTotal = request.unitCost().multiply(BigDecimal.valueOf(request.orderedQuantity()));
        po.setTotalAmount(po.getTotalAmount().add(newLineTotal));
        
        return mapToResponse(purchaseOrderRepository.save(po));
    }

    @Override
    @Transactional
    public PurchaseOrderResponse removeItem(UUID poId, Long itemId) {
        PurchaseOrder po = purchaseOrderRepository.findByIdWithLock(poId)
                .orElseThrow(() -> new ResourceNotFoundException("PO_NOT_FOUND", "Không tìm thấy PO"));

        if (po.getStatus() != PurchaseOrderStatus.DRAFT) {
            throw new BusinessConflictException("PO_NOT_DRAFT", "Chỉ được xóa hàng trong PO ở trạng thái DRAFT");
        }
        
        PurchaseOrderItem item = po.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("ITEM_NOT_FOUND", "Không tìm thấy item trong PO"));
                
        BigDecimal lineTotal = item.getUnitCost().multiply(BigDecimal.valueOf(item.getOrderedQuantity()));
        po.setTotalAmount(po.getTotalAmount().subtract(lineTotal));
        po.removeItem(item);
        
        return mapToResponse(purchaseOrderRepository.save(po));
    }

    @Override
    @Transactional
    public PurchaseOrderResponse submitPurchaseOrder(UUID id, UUID submittedBy) {
        PurchaseOrder po = purchaseOrderRepository.findByIdWithLock(id)
                .orElseThrow(() -> new ResourceNotFoundException("PO_NOT_FOUND", "Không tìm thấy PO"));

        if (po.getStatus() != PurchaseOrderStatus.DRAFT) {
            throw new BusinessConflictException("INVALID_STATUS", "Chỉ có thể submit PO từ DRAFT");
        }
        if (po.getItems().isEmpty()) {
            throw new BusinessConflictException("PO_EMPTY", "Không thể submit PO rỗng");
        }
        
        po.setStatus(PurchaseOrderStatus.PENDING_APPROVAL); 
        po.setUpdatedAt(LocalDateTime.now());
        
        return mapToResponse(purchaseOrderRepository.save(po));
    }

    @Override
    @Transactional
    public PurchaseOrderResponse approvePurchaseOrder(UUID id, UUID approvedBy) {
        PurchaseOrder po = purchaseOrderRepository.findByIdWithLock(id)
                .orElseThrow(() -> new ResourceNotFoundException("PO_NOT_FOUND", "Không tìm thấy PO"));
                
        if (po.getStatus() != PurchaseOrderStatus.PENDING_APPROVAL) {
            throw new BusinessConflictException("INVALID_STATUS", "Chỉ có thể duyệt PO từ trạng thái PENDING_APPROVAL");
        }
        
        po.setStatus(PurchaseOrderStatus.APPROVED);
        po.setApprovedBy(approvedBy);
        po.setApprovedAt(LocalDateTime.now());
        
        return mapToResponse(purchaseOrderRepository.save(po));
    }

    @Override
    @Transactional
    public PurchaseOrderResponse cancelPurchaseOrder(UUID id, UUID cancelledBy, String cancelReason) {
        PurchaseOrder po = purchaseOrderRepository.findByIdWithLock(id)
                .orElseThrow(() -> new ResourceNotFoundException("PO_NOT_FOUND", "Không tìm thấy PO"));
                
        if (po.getStatus() == PurchaseOrderStatus.COMPLETED || po.getStatus() == PurchaseOrderStatus.CANCELLED) {
            throw new BusinessConflictException("INVALID_STATUS", "Không thể hủy PO đã đóng");
        }
        
        po.setStatus(PurchaseOrderStatus.CANCELLED);
        po.setCancelledBy(cancelledBy);
        po.setCancelledAt(LocalDateTime.now());
        po.setCancelReason(cancelReason);
        
        return mapToResponse(purchaseOrderRepository.save(po));
    }

    private PurchaseOrder findById(UUID id) {
        return purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PO_NOT_FOUND", "Không tìm thấy Purchase Order"));
    }

    private PurchaseOrderResponse mapToResponse(PurchaseOrder po) {
        List<PurchaseOrderItemResponse> itemResponses = po.getItems().stream().map(i -> new PurchaseOrderItemResponse(
                i.getId(),
                i.getPurchaseOrder().getId(),
                i.getProductVariant().getId(),
                i.getProductVariant().getName(),
                i.getProductVariant().getSku(),
                primaryImage(i.getProductVariant()),
                i.getOrderedQuantity(),
                i.getReceivedQuantity(),
                i.getUnitCost(),
                i.getUnitCost().multiply(BigDecimal.valueOf(i.getOrderedQuantity()))
        )).toList();

        return new PurchaseOrderResponse(
                po.getId(),
                po.getPurchaseOrderCode(),
                po.getSupplier().getId(),
                po.getSupplier().getName(),
                po.getWarehouse().getId(),
                po.getWarehouse().getName(),
                po.getStatus(),
                po.getTotalAmount(),
                po.getExpectedAt(),
                po.getApprovedBy(),
                po.getApprovedAt(),
                po.getReceivedBy(),
                po.getReceivedAt(),
                po.getCancelledBy(),
                po.getCancelledAt(),
                po.getCancelReason(),
                po.getNote(),
                po.getCreatedAt(),
                po.getUpdatedAt(),
                itemResponses
        );
    }

    private String primaryImage(ProductVariant variant) {
        return variant.getImages().stream()
                .filter(image -> image.isPrimary())
                .findFirst()
                .or(() -> variant.getImages().stream().findFirst())
                .map(image -> image.getImageUrl())
                .orElse(null);
    }
}
