package com.re.ecommerce.modules.customer.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import com.re.ecommerce.modules.catalog.dto.response.ProductCardResponse;
import com.re.ecommerce.modules.customer.dto.request.CompareAddRequest;
import com.re.ecommerce.modules.customer.service.CompareService;
import com.re.ecommerce.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

@Tag(name = "12. Product Comparison")
@RestController
@RequiredArgsConstructor
@Slf4j
public class CompareController {

    private final CompareService compareService;

    @GetMapping("/api/v1/product-comparisons")
    public ResponseEntity<List<ProductCardResponse>> buildPublicComparison(
            @RequestParam List<UUID> productIds) {
        // Mocked out for the controller logic requirement; 
        // to fully implement COMPARE-001 we would add it into CompareService.
        // For P1 integration test simplicity, we skip public comparison implementation details 
        // until we reach Catalog extensions later, or just return mock data for now.
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/api/v1/me/compare-items")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<List<ProductCardResponse>> getMyCompareItems(
             @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(compareService.getMyCompareItems(userDetails.getUsername()));
    }

    @PostMapping("/api/v1/me/compare-items")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<Void> addCompareItem(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CompareAddRequest request) {
        compareService.addCompareItem(userDetails.getUsername(), request.productId());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/api/v1/me/compare-items/{productId}")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<Void> removeCompareItem(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable UUID productId) {
        compareService.removeCompareItem(userDetails.getUsername(), productId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/api/v1/me/compare-items")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<Void> clearCompareList(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        compareService.clearCompareList(userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
