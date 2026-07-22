package com.re.ecommerce.modules.catalog.controller;

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

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Slf4j
public class ProductVariantController {

    private final ProductVariantService variantService;

    @PostMapping("/products/{productId}/variants")
    @PreAuthorize("hasAuthority('PRODUCT_CREATE') or hasRole('ADMIN')")
    public ResponseEntity<VariantResponse> createVariant(
            @PathVariable UUID productId,
            @Valid @RequestBody VariantCreateRequest request) {
        log.info("Mounting new Variant node with SKU {} into product UUID: {}", request.sku(), productId);
        VariantResponse response = variantService.createVariant(productId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/variants/{variantId}")
    @PreAuthorize("hasAuthority('PRODUCT_UPDATE') or hasRole('ADMIN')")
    public ResponseEntity<VariantResponse> updateVariant(
            @PathVariable UUID variantId,
            @Valid @RequestBody VariantUpdateRequest request,
            @RequestHeader(value = "If-Match", defaultValue = "0") long ifMatchVersion) {
        log.info("Optimistic locking request to Update Variant ID: {} based on base version: {}", variantId, ifMatchVersion);
        return ResponseEntity.ok(variantService.updateVariant(variantId, request, ifMatchVersion));
    }

    @PatchMapping("/variants/{variantId}/status")
    @PreAuthorize("hasAuthority('PRODUCT_ARCHIVE') or hasRole('ADMIN')")
    public ResponseEntity<VariantResponse> changeVariantStatus(
            @PathVariable UUID variantId,
            @RequestParam VariantStatus status) {
        log.info("Altering active variant mapping {} to state {}", variantId, status);
        return ResponseEntity.ok(variantService.changeVariantStatus(variantId, status));
    }

    @PostMapping("/variants/{variantId}/price-changes")
    @PreAuthorize("hasAuthority('PRODUCT_UPDATE') or hasRole('ADMIN')")
    public ResponseEntity<VariantResponse> changePrice(
            @PathVariable UUID variantId,
            @Valid @RequestBody PriceChangeRequest request) {
        log.info("Overwriting monetary parameters for Variant ID: {}", variantId);
        return ResponseEntity.ok(variantService.changePrice(variantId, request));
    }

    @PostMapping("/variants/{variantId}/images")
    @PreAuthorize("hasAuthority('PRODUCT_UPDATE') or hasRole('ADMIN')")
    public ResponseEntity<ImageResponse> addImage(
            @PathVariable UUID variantId,
            @Valid @RequestBody ImageCreateRequest request) {
        log.info("Injecting media URL to given Variant {}", variantId);
        ImageResponse response = variantService.addImage(variantId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/variants/{variantId}/images/{imageId}/set-primary")
    @PreAuthorize("hasAuthority('PRODUCT_UPDATE') or hasRole('ADMIN')")
    public ResponseEntity<ImageResponse> setPrimaryImage(
            @PathVariable UUID variantId,
            @PathVariable UUID imageId) {
        log.info("Swapping primary thumbnail for Variant {} targeting imageId {}", variantId, imageId);
        return ResponseEntity.ok(variantService.setPrimaryImage(variantId, imageId));
    }

    @DeleteMapping("/variants/{variantId}/images/{imageId}")
    @PreAuthorize("hasAuthority('PRODUCT_UPDATE') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteImage(
            @PathVariable UUID variantId,
            @PathVariable UUID imageId) {
        log.info("Flushing specific linked photo ID {} referenced by Variant ID {}", imageId, variantId);
        variantService.deleteImage(variantId, imageId);
        return ResponseEntity.noContent().build();
    }
}
