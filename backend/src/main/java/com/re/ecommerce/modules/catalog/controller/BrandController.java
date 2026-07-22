package com.re.ecommerce.modules.catalog.controller;

import com.re.ecommerce.modules.catalog.dto.request.BrandRequest;
import com.re.ecommerce.modules.catalog.dto.response.BrandResponse;
import com.re.ecommerce.modules.catalog.entity.BrandStatus;
import com.re.ecommerce.modules.catalog.service.BrandService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class BrandController {

    private final BrandService brandService;

    // --- PUBLIC ENDPOINTS ---

    @GetMapping("/brands")
    public ResponseEntity<List<BrandResponse>> listPublicBrands(
            @RequestParam(required = false) String keyword) {
        log.debug("Public listing brands with keyword: {}", keyword);
        return ResponseEntity.ok(brandService.listPublicBrands(keyword));
    }

    // --- ADMIN ENDPOINTS ---

    @GetMapping("/admin/brands")
    @PreAuthorize("hasAuthority('PRODUCT_VIEW') or hasRole('ADMIN')")
    public ResponseEntity<List<BrandResponse>> adminListBrands(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) BrandStatus status) {
        log.debug("Admin listing brands. Keyword: {}, Status: {}", keyword, status);
        return ResponseEntity.ok(brandService.adminListBrands(keyword, status));
    }

    @PostMapping("/admin/brands")
    @PreAuthorize("hasAuthority('PRODUCT_CREATE') or hasRole('ADMIN')")
    public ResponseEntity<BrandResponse> createBrand(@Valid @RequestBody BrandRequest request) {
        log.info("Admin creating a new Brand with name: {}", request.name()); // Assuming record based request
        BrandResponse response = brandService.createBrand(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/admin/brands/{brandId}")
    @PreAuthorize("hasAuthority('PRODUCT_UPDATE') or hasRole('ADMIN')")
    public ResponseEntity<BrandResponse> updateBrand(
            @PathVariable UUID brandId,
            @Valid @RequestBody BrandRequest request) {
        log.info("Admin updating brand UUID: {}", brandId);
        return ResponseEntity.ok(brandService.updateBrand(brandId, request));
    }

    @PatchMapping("/admin/brands/{brandId}/status")
    @PreAuthorize("hasAuthority('PRODUCT_ARCHIVE') or hasRole('ADMIN')")
    public ResponseEntity<BrandResponse> changeBrandStatus(
            @PathVariable UUID brandId,
            @RequestParam BrandStatus status) {
        log.info("Admin toggling status for Brand UUID: {} to: {}", brandId, status);
        return ResponseEntity.ok(brandService.changeBrandStatus(brandId, status));
    }
}
