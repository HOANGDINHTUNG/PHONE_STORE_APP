package com.re.ecommerce.modules.inventory.controller;

import com.re.ecommerce.common.dto.PagedResponse;
import com.re.ecommerce.modules.inventory.dto.request.PurchaseOrderRequest;
import com.re.ecommerce.modules.inventory.dto.response.PurchaseOrderResponse;
import com.re.ecommerce.modules.inventory.entity.enums.PurchaseOrderStatus;
import com.re.ecommerce.modules.inventory.service.PurchaseOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/purchase-orders")
@RequiredArgsConstructor
@Slf4j
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('SCOPE_PO_VIEW', 'SCOPE_PO_MANAGE')")
    public ResponseEntity<PagedResponse<PurchaseOrderResponse>> getAllPurchaseOrders(
            @RequestParam(required = false) PurchaseOrderStatus status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<PurchaseOrderResponse> result = purchaseOrderService.getAllPurchaseOrders(status, page, size);
        return ResponseEntity.ok(PagedResponse.of(result, result.getContent()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('SCOPE_PO_VIEW', 'SCOPE_PO_MANAGE')")
    public ResponseEntity<PurchaseOrderResponse> getPurchaseOrder(@PathVariable UUID id) {
        return ResponseEntity.ok(purchaseOrderService.getPurchaseOrder(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('SCOPE_PO_MANAGE')")
    public ResponseEntity<PurchaseOrderResponse> createPurchaseOrder(@Valid @RequestBody PurchaseOrderRequest request) {
        log.info("Creating Purchase Order: {}", request.purchaseOrderCode());
        return ResponseEntity.status(HttpStatus.CREATED).body(purchaseOrderService.createPurchaseOrder(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('SCOPE_PO_MANAGE')")
    public ResponseEntity<PurchaseOrderResponse> updatePurchaseOrder(
            @PathVariable UUID id,
            @Valid @RequestBody PurchaseOrderRequest request) {
        log.info("Updating Purchase Order: {}", id);
        return ResponseEntity.ok(purchaseOrderService.updatePurchaseOrder(id, request));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAuthority('SCOPE_PO_APPROVE')")
    public ResponseEntity<PurchaseOrderResponse> approvePurchaseOrder(
            @PathVariable UUID id,
            Authentication authentication) {
        UUID approverId = UUID.fromString(authentication.getName());
        log.info("Approving PO {} by user {}", id, approverId);
        return ResponseEntity.ok(purchaseOrderService.approvePurchaseOrder(id, approverId));
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasAuthority('SCOPE_PO_MANAGE')")
    public ResponseEntity<PurchaseOrderResponse> cancelPurchaseOrder(
            @PathVariable UUID id,
            @RequestParam String cancelReason,
            Authentication authentication) {
        UUID cancellerId = UUID.fromString(authentication.getName());
        log.info("Canceling PO {} by user {}, reason: {}", id, cancellerId, cancelReason);
        return ResponseEntity.ok(purchaseOrderService.cancelPurchaseOrder(id, cancellerId, cancelReason));
    }
}
