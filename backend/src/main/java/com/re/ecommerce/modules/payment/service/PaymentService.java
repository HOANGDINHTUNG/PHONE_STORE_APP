package com.re.ecommerce.modules.payment.service;

import com.re.ecommerce.modules.payment.dto.request.ManualPaymentRequest;
import com.re.ecommerce.modules.payment.dto.request.PaymentAttemptRequest;

public interface PaymentService {
    void createPaymentAttempt(String orderCode, String idempotencyKey, PaymentAttemptRequest request);
    void confirmManualPayment(Long paymentId, String idempotencyKey, ManualPaymentRequest request, java.util.UUID staffId);
    void processWebhook(String providerCode, String providerEventId, String rawPayload);
}
