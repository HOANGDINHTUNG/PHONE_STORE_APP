package com.re.ecommerce.modules.catalog.controller;

import com.re.ecommerce.modules.catalog.dto.request.*;
import com.re.ecommerce.modules.catalog.dto.response.*;
import com.re.ecommerce.modules.catalog.entity.PublicationStatus;
import com.re.ecommerce.modules.catalog.service.ProductService;
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
public class ProductController {

    private final ProductService productService;

    // --- PUBLIC ENDPOINTS ---

    @GetMapping("/products")
    public ResponseEntity<List<ProductPublicResponse>> searchProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) UUID brandId) {
        log.debug("Public product search - Keyword: {}, Category: {}, Brand: {}", keyword, categoryId, brandId);
        return ResponseEntity.ok(productService.searchProducts(keyword, categoryId, brandId));
    }

    @GetMapping("/products/{slug}")
    public ResponseEntity<ProductPublicResponse> getProductBySlug(
            @PathVariable String slug) {
        log.debug("Resolving public product details for slug: {}", slug);
        return ResponseEntity.ok(productService.getProductBySlug(slug));
    }

    // --- ADMIN ENDPOINTS ---

    @GetMapping("/admin/products")
    @PreAuthorize("hasAuthority('PRODUCT_VIEW') or hasRole('ADMIN')")
    public ResponseEntity<List<ProductAdminResponse>> adminListProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) PublicationStatus status,
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) UUID brandId) {
        log.debug("Admin product search executed with criteria - keyword: {}, status: {}", keyword, status);
        return ResponseEntity.ok(productService.adminListProducts(keyword, status, categoryId, brandId));
    }

    @PostMapping("/admin/products")
    @PreAuthorize("hasAuthority('PRODUCT_CREATE') or hasRole('ADMIN')")
    public ResponseEntity<ProductAdminResponse> createProduct(@Valid @RequestBody ProductCreateRequest request) {
        log.info("Admin initializing new root Product name: {}", request.name());
        ProductAdminResponse response = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/admin/products/{productId}")
    @PreAuthorize("hasAuthority('PRODUCT_VIEW') or hasRole('ADMIN')")
    public ResponseEntity<ProductAdminResponse> getProductAdminDetail(@PathVariable UUID productId) {
        log.debug("Tracing extensive detail for product UUID: {}", productId);
        return ResponseEntity.ok(productService.getProductAdminDetail(productId));
    }

    @PatchMapping("/admin/products/{productId}")
    @PreAuthorize("hasAuthority('PRODUCT_UPDATE') or hasRole('ADMIN')")
    public ResponseEntity<ProductAdminResponse> updateProduct(
            @PathVariable UUID productId,
            @Valid @RequestBody ProductUpdateRequest request) {
        log.info("Applying core updates to root Product UUID: {}", productId);
        return ResponseEntity.ok(productService.updateProduct(productId, request));
    }

    @PatchMapping("/admin/products/{productId}/status")
    @PreAuthorize("hasAuthority('PRODUCT_ARCHIVE') or hasRole('ADMIN')")
    public ResponseEntity<ProductAdminResponse> changeProductStatus(
            @PathVariable UUID productId,
            @RequestParam PublicationStatus status) {
        log.info("Shifting catalog publication status for Product ID: {} to {}", productId, status);
        return ResponseEntity.ok(productService.changeProductStatus(productId, status));
    }

    @PutMapping("/admin/products/{productId}/specifications")
    @PreAuthorize("hasAuthority('PRODUCT_UPDATE') or hasRole('ADMIN')")
    public ResponseEntity<List<SpecificationResponse>> replaceSpecifications(
            @PathVariable UUID productId,
            @Valid @RequestBody SpecificationRequest request) {
        log.info("Overwriting hardware specifications layout for product UUID: {}", productId);
        return ResponseEntity.ok(productService.replaceSpecifications(productId, request));
    }

    @PutMapping("/admin/products/{productId}/attributes")
    @PreAuthorize("hasAuthority('PRODUCT_UPDATE') or hasRole('ADMIN')")
    public ResponseEntity<List<AttributeResponse>> replaceAttributes(
            @PathVariable UUID productId,
            @Valid @RequestBody AttributeRequest request) {
        log.info("Synchronizing universal attributes schema mapping for product: {}", productId);
        return ResponseEntity.ok(productService.replaceAttributes(productId, request));
    }
}
