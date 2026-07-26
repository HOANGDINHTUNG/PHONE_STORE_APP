package com.re.ecommerce.modules.warranty.controller;

import io.swagger.v3.oas.annotations.tags.Tag;

import com.re.ecommerce.modules.warranty.service.WarrantyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.Collections;

import java.util.UUID;

@Tag(name = "16. Warranty")
@RestController
@RequestMapping
@RequiredArgsConstructor
@Slf4j
public class WarrantyController {

    private final WarrantyService warrantyService;

    @PostMapping("/api/v1/internal/orders/{orderId}/warranties/generate")
    public ResponseEntity<Void> generateWarranty(@PathVariable UUID orderId) {
        MDC.put("operation", "generateWarranty");
        MDC.put("orderId", orderId.toString());

        warrantyService.processWarrantyGenerationForCompletedOrder(orderId);
        MDC.clear();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/api/v1/me/warranties")
    public ResponseEntity<Void> getMyWarranties() {
        // Query endpoint stub
        return ResponseEntity.ok().build();
    }

    @GetMapping("/api/v1/admin/warranties")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAdminWarranties() {
        return ResponseEntity.ok(Collections.emptyMap());
    }

    @GetMapping("/api/v1/admin/warranties/{warrantyId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAdminWarranty(@PathVariable UUID warrantyId) {
        return ResponseEntity.ok(Collections.emptyMap());
    }

    @GetMapping("/api/v1/warranties/{warrantyId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getWarranty(@PathVariable UUID warrantyId) {
        return ResponseEntity.ok(Collections.emptyMap());
    }

    @PostMapping("/api/v1/warranties/generate/{orderId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SYSTEM')")
    public ResponseEntity<?> generateWarrantyAlias(@PathVariable UUID orderId) {
        return generateWarranty(orderId);
    }
}
