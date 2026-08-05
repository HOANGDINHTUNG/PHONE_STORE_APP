package com.re.ecommerce.modules.catalog.controller;

import io.swagger.v3.oas.annotations.tags.Tag;

import com.re.ecommerce.modules.catalog.dto.request.*;
import com.re.ecommerce.modules.catalog.dto.response.*;
import com.re.ecommerce.modules.catalog.entity.VariantStatus;
import com.re.ecommerce.modules.catalog.service.ProductVariantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Tag(name = "6. Catalog Management")
@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Slf4j
public class ProductVariantController {

    private final ProductVariantService variantService;

    @GetMapping("/products/{productId}/variants")
    @PreAuthorize("hasAuthority('PRODUCT_VIEW') or hasRole('ADMIN')")
    public ResponseEntity<java.util.List<VariantResponse>> listVariantsByProduct(@PathVariable UUID productId) {
        return ResponseEntity.ok(variantService.listVariantsByProduct(productId));
    }

    @PostMapping("/products/{productId}/variants")
    @PreAuthorize("hasAuthority('PRODUCT_CREATE') or hasRole('ADMIN')")
    public ResponseEntity<VariantResponse> createVariant(
            @PathVariable UUID productId,
            @Valid @RequestBody VariantCreateRequest request) {

        VariantResponse response = variantService.createVariant(productId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/variants/{variantId}")
    @PreAuthorize("hasAuthority('PRODUCT_UPDATE') or hasRole('ADMIN')")
    public ResponseEntity<VariantResponse> updateVariant(
            @PathVariable UUID variantId,
            @Valid @RequestBody VariantUpdateRequest request,
            @RequestHeader(value = "If-Match", defaultValue = "0") long ifMatchVersion) {

        return ResponseEntity.ok(variantService.updateVariant(variantId, request, ifMatchVersion));
    }

    @PatchMapping("/variants/{variantId}/status")
    @PreAuthorize("hasAuthority('PRODUCT_ARCHIVE') or hasRole('ADMIN')")
    public ResponseEntity<VariantResponse> changeVariantStatus(
            @PathVariable UUID variantId,
            @RequestParam VariantStatus status) {

        return ResponseEntity.ok(variantService.changeVariantStatus(variantId, status));
    }

    @PostMapping("/variants/{variantId}/price-changes")
    @PreAuthorize("hasAuthority('PRODUCT_UPDATE') or hasRole('ADMIN')")
    public ResponseEntity<VariantResponse> changePrice(
            @PathVariable UUID variantId,
            @Valid @RequestBody PriceChangeRequest request) {

        return ResponseEntity.ok(variantService.changePrice(variantId, request));
    }

    @PostMapping("/variants/{variantId}/images")
    @PreAuthorize("hasAuthority('PRODUCT_UPDATE') or hasRole('ADMIN')")
    public ResponseEntity<ImageResponse> addImage(
            @PathVariable UUID variantId,
            @Valid @RequestBody ImageCreateRequest request) {

        ImageResponse response = variantService.addImage(variantId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/variants/{variantId}/images/{imageId}/set-primary")
    @PreAuthorize("hasAuthority('PRODUCT_UPDATE') or hasRole('ADMIN')")
    public ResponseEntity<ImageResponse> setPrimaryImage(
            @PathVariable UUID variantId,
            @PathVariable UUID imageId) {

        return ResponseEntity.ok(variantService.setPrimaryImage(variantId, imageId));
    }

    @DeleteMapping("/variants/{variantId}/images/{imageId}")
    @PreAuthorize("hasAuthority('PRODUCT_UPDATE') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteImage(
            @PathVariable UUID variantId,
            @PathVariable UUID imageId) {

        variantService.deleteImage(variantId, imageId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/variants/{variantId}/price-history")
    @PreAuthorize("hasAuthority('PRODUCT_VIEW') or hasRole('ADMIN')")
    public ResponseEntity<org.springframework.data.domain.Page<ProductPriceHistoryResponse>> getPriceHistory(
            @PathVariable UUID variantId,
            @org.springframework.data.web.PageableDefault(size = 20) org.springframework.data.domain.Pageable pageable) {
        return ResponseEntity.ok(variantService.getPriceHistory(variantId, pageable));
    }
}
