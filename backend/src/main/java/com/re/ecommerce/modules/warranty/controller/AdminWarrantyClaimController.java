package com.re.ecommerce.modules.warranty.controller;

import io.swagger.v3.oas.annotations.tags.Tag;

import com.re.ecommerce.modules.warranty.dto.request.ChangeClaimStatusRequest;
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

import java.util.UUID;

@Tag(name = "16. Warranty")
@RestController
@RequestMapping("/api/v1/admin/warranty-claims")
@RequiredArgsConstructor
@Slf4j
public class AdminWarrantyClaimController {

    private final WarrantyService warrantyService;

    @PatchMapping("/{claimId}/status")
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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAdminWarrantyClaims() {
        return ResponseEntity.ok(Collections.emptyMap());
    }

    @GetMapping("/{claimId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAdminWarrantyClaim(@PathVariable Long claimId) {
        return ResponseEntity.ok(Collections.emptyMap());
    }

    @PostMapping("/{claimId}/process")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> processClaim(@PathVariable Long claimId) {
        return ResponseEntity.ok(Collections.emptyMap());
    }

    @PostMapping("/{claimId}/complete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> completeClaim(@PathVariable Long claimId) {
        return ResponseEntity.ok(Collections.emptyMap());
    }
}
