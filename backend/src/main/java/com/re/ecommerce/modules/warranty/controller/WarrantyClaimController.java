package com.re.ecommerce.modules.warranty.controller;

import com.re.ecommerce.modules.warranty.dto.request.SubmitClaimRequest;
import com.re.ecommerce.modules.warranty.service.WarrantyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.re.ecommerce.modules.auth.entity.User;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/warranties/{warrantyCode}/claims")
@RequiredArgsConstructor
@Slf4j
public class WarrantyClaimController {

    private final WarrantyService warrantyService;

    @PostMapping
    public ResponseEntity<Void> submitClaim(
            @PathVariable String warrantyCode,
            @Valid @RequestBody SubmitClaimRequest request,
            @AuthenticationPrincipal User currentUser) {
        
        UUID customerId = currentUser.getId();
        MDC.put("operation", "submitClaim");
        MDC.put("warrantyCode", warrantyCode);
        MDC.put("userId", customerId.toString());
        log.info("Submitting warranty claim");
        
        warrantyService.submitClaim(warrantyCode, request, customerId);
        MDC.clear();
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
