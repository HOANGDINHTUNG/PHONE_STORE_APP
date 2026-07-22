package com.re.ecommerce.modules.warranty.controller;

import com.re.ecommerce.modules.warranty.service.WarrantyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

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
        log.info("Received request to generate warranty for order");
        warrantyService.processWarrantyGenerationForCompletedOrder(orderId);
        MDC.clear();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/api/v1/me/warranties")
    public ResponseEntity<Void> getMyWarranties() {
        // Query endpoint stub
        return ResponseEntity.ok().build();
    }
}
