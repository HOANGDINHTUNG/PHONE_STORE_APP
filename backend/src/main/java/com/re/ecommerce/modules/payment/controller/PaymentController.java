package com.re.ecommerce.modules.payment.controller;

// removed EmptyJsonResponse import
import com.re.ecommerce.modules.payment.dto.request.ManualPaymentRequest;
import com.re.ecommerce.modules.payment.dto.request.PaymentAttemptRequest;
import com.re.ecommerce.modules.payment.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/orders/{orderCode}/payment-attempts")
    public ResponseEntity<Void> createPaymentAttempt(
            @PathVariable String orderCode,
            @RequestHeader(value = "X-Idempotency-Key") String idempotencyKey,
            @Valid @RequestBody PaymentAttemptRequest request) {
        
        paymentService.createPaymentAttempt(orderCode, idempotencyKey, request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/admin/payments/{paymentId}/confirm-manual")
    public ResponseEntity<Void> confirmManualPayment(
            @PathVariable Long paymentId,
            @RequestHeader(value = "X-Idempotency-Key") String idempotencyKey,
            @RequestAttribute("userId") String staffId,
            @Valid @RequestBody ManualPaymentRequest request) {
        
        paymentService.confirmManualPayment(paymentId, idempotencyKey, request, UUID.fromString(staffId));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/webhooks/payments/{providerCode}")
    public ResponseEntity<Void> processWebhook(
            @PathVariable String providerCode,
            @RequestHeader(value = "X-Provider-Event-Id") String providerEventId,
            @RequestBody String rawPayload,
            HttpServletRequest request) {
        
        // In real life, verify X-Signature header here against provider pubkey
        
        paymentService.processWebhook(providerCode, providerEventId, rawPayload);
        return ResponseEntity.ok().build();
    }
}
