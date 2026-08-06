package com.re.ecommerce.modules.warranty.controller;

import io.swagger.v3.oas.annotations.tags.Tag;

import com.re.ecommerce.modules.warranty.dto.request.ChangeClaimStatusRequest;
import com.re.ecommerce.modules.warranty.entity.WarrantyClaim;
import com.re.ecommerce.modules.warranty.repository.WarrantyClaimRepository;
import com.re.ecommerce.modules.warranty.service.WarrantyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.re.ecommerce.modules.auth.entity.User;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.Collections;
import java.time.LocalDateTime;
import java.util.List;

import java.util.UUID;

@Tag(name = "16. Warranty")
@RestController
@RequestMapping("/api/v1/admin/warranty-claims")
@RequiredArgsConstructor
@Slf4j
public class AdminWarrantyClaimController {

    private final WarrantyService warrantyService;
    private final WarrantyClaimRepository warrantyClaimRepository;

    private record AdminWarrantyClaimResponse(Long id, String claimCode, String status,
            String customerName, String customerPhone, String customerEmail, String productName,
            String serialImei, String issueDescription, String resolution, LocalDateTime createdAt) {}

    @PatchMapping("/{claimId}/status")
    @PreAuthorize("hasAuthority('AFTER_SALES_MANAGE') or hasRole('ADMIN')")
    public ResponseEntity<Void> changeClaimStatus(
            @PathVariable Long claimId,
            @Valid @RequestBody ChangeClaimStatusRequest request,
            @AuthenticationPrincipal User currentUser) {
        
        UUID staffId = currentUser.getId();
        MDC.put("operation", "changeClaimStatus");
        MDC.put("claimId", claimId.toString());

        warrantyService.changeClaimStatus(claimId, request, staffId);
        MDC.clear();
        return ResponseEntity.ok().build();
    }
    
    @GetMapping
    @PreAuthorize("hasAnyAuthority('AFTER_SALES_VIEW', 'AFTER_SALES_MANAGE') or hasRole('ADMIN')")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<List<AdminWarrantyClaimResponse>> getAdminWarrantyClaims() {
        return ResponseEntity.ok(warrantyClaimRepository.findAll().stream().map(this::toResponse).toList());
    }

    @GetMapping("/{claimId}")
    @PreAuthorize("hasAnyAuthority('AFTER_SALES_VIEW', 'AFTER_SALES_MANAGE') or hasRole('ADMIN')")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<AdminWarrantyClaimResponse> getAdminWarrantyClaim(@PathVariable Long claimId) {
        return ResponseEntity.ok(toResponse(warrantyClaimRepository.findById(claimId).orElseThrow()));
    }

    @PostMapping("/{claimId}/process")
    @PreAuthorize("hasAuthority('AFTER_SALES_MANAGE') or hasRole('ADMIN')")
    public ResponseEntity<?> processClaim(@PathVariable Long claimId) {
        return ResponseEntity.ok(Collections.emptyMap());
    }

    @PostMapping("/{claimId}/complete")
    @PreAuthorize("hasAuthority('AFTER_SALES_MANAGE') or hasRole('ADMIN')")
    public ResponseEntity<?> completeClaim(@PathVariable Long claimId) {
        return ResponseEntity.ok(Collections.emptyMap());
    }

    private AdminWarrantyClaimResponse toResponse(WarrantyClaim claim) {
        var warranty = claim.getWarranty();
        String productName = warranty.getProductVariant() == null ? null : warranty.getProductVariant().getProduct().getName();
        String serialImei = warranty.getInventoryUnit() == null ? null : "UNIT-" + warranty.getInventoryUnit().getId();
        return new AdminWarrantyClaimResponse(claim.getId(), claim.getClaimCode(), claim.getStatus().name(),
                warranty.getCustomerName(), warranty.getCustomerPhone(), warranty.getCustomerEmail(), productName,
                serialImei, claim.getIssueDescription(), claim.getResolution(), claim.getCreatedAt());
    }
}
