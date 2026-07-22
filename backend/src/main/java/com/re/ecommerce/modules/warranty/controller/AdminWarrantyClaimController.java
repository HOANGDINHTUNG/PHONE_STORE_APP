package com.re.ecommerce.modules.warranty.controller;

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

import java.util.UUID;

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
        log.info("Changing claim status");
        
        warrantyService.changeClaimStatus(claimId, request, staffId);
        MDC.clear();
        return ResponseEntity.ok().build();
    }
}
