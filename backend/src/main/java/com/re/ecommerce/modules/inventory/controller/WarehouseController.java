package com.re.ecommerce.modules.inventory.controller;

import io.swagger.v3.oas.annotations.tags.Tag;

import com.re.ecommerce.modules.inventory.dto.request.WarehouseRequest;
import com.re.ecommerce.modules.inventory.dto.response.WarehouseResponse;
import com.re.ecommerce.modules.inventory.entity.enums.WarehouseStatus;
import com.re.ecommerce.modules.inventory.service.WarehouseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.re.ecommerce.common.dto.PagedResponse;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Tag(name = "7. Procurement and Inventory")
@RestController
@RequestMapping("/api/v1/warehouses")
@RequiredArgsConstructor
@Slf4j
public class WarehouseController {

    private final WarehouseService warehouseService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('SCOPE_WAREHOUSE_VIEW', 'SCOPE_WAREHOUSE_MANAGE')")
    public ResponseEntity<PagedResponse<WarehouseResponse>> getAllWarehouses(
            @RequestParam(required = false) WarehouseStatus status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<WarehouseResponse> result = warehouseService.getAllWarehouses(status, page, size);
        return ResponseEntity.ok(PagedResponse.of(result, result.getContent()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('SCOPE_WAREHOUSE_VIEW', 'SCOPE_WAREHOUSE_MANAGE')")
    public ResponseEntity<WarehouseResponse> getWarehouse(@PathVariable UUID id) {
        return ResponseEntity.ok(warehouseService.getWarehouse(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('SCOPE_WAREHOUSE_MANAGE')")
    public ResponseEntity<WarehouseResponse> createWarehouse(@Valid @RequestBody WarehouseRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED).body(warehouseService.createWarehouse(request));
    }

    @RequestMapping(value = "/{id}", method = {RequestMethod.PATCH, RequestMethod.PUT})
    @PreAuthorize("hasAuthority('SCOPE_WAREHOUSE_MANAGE')")
    public ResponseEntity<WarehouseResponse> updateWarehouse(
            @PathVariable UUID id,
            @Valid @RequestBody WarehouseRequest request) {

        return ResponseEntity.ok(warehouseService.updateWarehouse(id, request));
    }

    @RequestMapping(value = "/{id}/status", method = {RequestMethod.PATCH, RequestMethod.PUT})
    @PreAuthorize("hasAuthority('SCOPE_WAREHOUSE_MANAGE')")
    public ResponseEntity<WarehouseResponse> changeStatus(
            @PathVariable UUID id,
            @RequestParam WarehouseStatus status) {

        return ResponseEntity.ok(warehouseService.changeStatus(id, status));
    }
}
