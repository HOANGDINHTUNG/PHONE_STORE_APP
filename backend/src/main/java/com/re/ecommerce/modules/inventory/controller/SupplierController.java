package com.re.ecommerce.modules.inventory.controller;

import com.re.ecommerce.common.dto.PagedResponse;
import com.re.ecommerce.modules.inventory.dto.request.SupplierRequest;
import com.re.ecommerce.modules.inventory.dto.response.SupplierResponse;
import com.re.ecommerce.modules.inventory.entity.enums.SupplierStatus;
import com.re.ecommerce.modules.inventory.service.SupplierService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/suppliers")
@RequiredArgsConstructor
@Slf4j
public class SupplierController {

    private final SupplierService supplierService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('SCOPE_SUPPLIER_VIEW', 'SCOPE_SUPPLIER_MANAGE')")
    public ResponseEntity<PagedResponse<SupplierResponse>> getAllSuppliers(
            @RequestParam(required = false) SupplierStatus status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<SupplierResponse> result = supplierService.getAllSuppliers(status, page, size);
        return ResponseEntity.ok(PagedResponse.of(result, result.getContent()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('SCOPE_SUPPLIER_VIEW', 'SCOPE_SUPPLIER_MANAGE')")
    public ResponseEntity<SupplierResponse> getSupplier(@PathVariable UUID id) {
        return ResponseEntity.ok(supplierService.getSupplier(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('SCOPE_SUPPLIER_MANAGE')")
    public ResponseEntity<SupplierResponse> createSupplier(@Valid @RequestBody SupplierRequest request) {
        log.info("Creating supplier: {}", request.supplierCode());
        return ResponseEntity.status(HttpStatus.CREATED).body(supplierService.createSupplier(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('SCOPE_SUPPLIER_MANAGE')")
    public ResponseEntity<SupplierResponse> updateSupplier(
            @PathVariable UUID id,
            @Valid @RequestBody SupplierRequest request) {
        log.info("Updating supplier {}: {}", id, request.supplierCode());
        return ResponseEntity.ok(supplierService.updateSupplier(id, request));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('SCOPE_SUPPLIER_MANAGE')")
    public ResponseEntity<SupplierResponse> changeStatus(
            @PathVariable UUID id,
            @RequestParam SupplierStatus status) {
        log.info("Changing supplier {} status to {}", id, status);
        return ResponseEntity.ok(supplierService.changeStatus(id, status));
    }
}
