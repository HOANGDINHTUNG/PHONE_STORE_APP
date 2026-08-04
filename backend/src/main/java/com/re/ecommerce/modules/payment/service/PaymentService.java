package com.re.ecommerce.modules.payment.service;

import com.re.ecommerce.modules.payment.dto.request.ManualPaymentRequest;
import com.re.ecommerce.modules.payment.dto.request.PaymentAttemptRequest;
import com.re.ecommerce.modules.payment.dto.response.PaymentAttemptResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import java.util.Map;

public interface PaymentService {
    PaymentAttemptResponse createPaymentAttempt(String orderCode, String idempotencyKey, PaymentAttemptRequest request, String clientIp);
    void confirmManualPayment(Long paymentId, String idempotencyKey, ManualPaymentRequest request, java.util.UUID staffId);
    void processWebhook(String providerCode, String providerEventId, String rawPayload);
    ResponseEntity<Map<String, String>> processVNPayIpn(HttpServletRequest request);
}
