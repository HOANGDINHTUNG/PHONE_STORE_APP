package com.re.ecommerce.modules.payment.service.impl;

import com.re.ecommerce.common.exception.BusinessConflictException;
import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.modules.order.repository.OrderRepository;
import com.re.ecommerce.modules.order.entity.Order;
import com.re.ecommerce.modules.payment.dto.request.ManualPaymentRequest;
import com.re.ecommerce.modules.payment.dto.request.PaymentAttemptRequest;
import com.re.ecommerce.modules.payment.entity.*;
import com.re.ecommerce.modules.payment.repository.PaymentAttemptRepository;
import com.re.ecommerce.modules.payment.repository.PaymentRepository;
import com.re.ecommerce.modules.payment.repository.PaymentWebhookEventRepository;
import com.re.ecommerce.modules.payment.service.PaymentService;
import com.re.ecommerce.modules.auth.repository.UserRepository;
import com.re.ecommerce.modules.auth.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentAttemptRepository paymentAttemptRepository;
    private final PaymentWebhookEventRepository webhookEventRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void createPaymentAttempt(String orderCode, String idempotencyKey, PaymentAttemptRequest request) {
        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new ResourceNotFoundException("ORDER_NOT_FOUND", "Order not found with orderCode: " + orderCode));

        // Note: The actual payment table needs to be created when the order is generated (in OrderService checkout).
        // Since we are mocking Payment service, we just expect the Payment row to exist.
        Payment payment = paymentRepository.findByOrder_Id(order.getId())
                .orElseThrow(() -> new ResourceNotFoundException("PAYMENT_NOT_FOUND", "Payment not found for order code: " + orderCode));

        if (payment.getStatus() == PaymentStatus.PAID || payment.getStatus() == PaymentStatus.REFUNDED) {
            throw new BusinessConflictException("PAYMENT_ALREADY_SETTLED", "This order is already fully paid or refunded.");
        }

        BigDecimal remainingAmount = payment.getExpectedAmount().subtract(payment.getPaidAmount());
        if (remainingAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessConflictException("PAYMENT_AMOUNT_INVALID", "Remaining amount to pay is zero.");
        }

        // Idempotency Check
        if (paymentAttemptRepository.findByMerchantRequestId(idempotencyKey).isPresent()) {
            log.info("Idempotent request. Attempt already exists for key {}", idempotencyKey);
            return;
        }

        PaymentAttempt attempt = PaymentAttempt.builder()
                .payment(payment)
                .merchantRequestId(idempotencyKey)
                .attemptNumber(generateAttemptNumber(payment))
                .method(request.getMethod())
                .providerCode(request.getMethod().name())
                .amount(remainingAmount)
                .status(PaymentAttemptStatus.PENDING)
                .build();

        paymentAttemptRepository.save(attempt);
        log.info("Created payment attempt {} for order {}", attempt.getId(), orderCode);
    }

    @Override
    @Transactional
    public void confirmManualPayment(Long paymentId, String idempotencyKey, ManualPaymentRequest request, java.util.UUID staffId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("PAYMENT_NOT_FOUND", "Payment not found with id: " + paymentId));

        if (paymentAttemptRepository.findByMerchantRequestId(idempotencyKey).isPresent()) {
            return;
        }

        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new ResourceNotFoundException("STAFF_NOT_FOUND", "Staff not found with id: " + staffId));

        PaymentAttempt attempt = PaymentAttempt.builder()
                .payment(payment)
                .merchantRequestId(idempotencyKey)
                .attemptNumber(generateAttemptNumber(payment))
                .method(request.getMethod())
                .providerCode("MANUAL_SYSTEM")
                .amount(request.getAmount())
                .status(PaymentAttemptStatus.SUCCESS)
                .providerMessage(request.getReferenceNote())
                .createdBy(staff)
                .build();

        paymentAttemptRepository.save(attempt);

        updatePaymentAggregate(payment, request.getAmount());
    }

    @Override
    @Transactional
    public void processWebhook(String providerCode, String providerEventId, String rawPayload) {
        // Mock payload processing. Real app would parse JSON and verify Signature!
        if (webhookEventRepository.findByProviderCodeAndProviderEventId(providerCode, providerEventId).isPresent()) {
            log.info("Idempotent webhook. Already processed event {} from {}", providerEventId, providerCode);
            return;
        }
        
        // This is simplified. In a real scenario we parse attemptId/amount from rawPayload
        log.warn("Mock Webhook Processing. Event={}, Provider={}", providerEventId, providerCode);
        
        PaymentWebhookEvent event = PaymentWebhookEvent.builder()
                .providerCode(providerCode)
                .providerEventId(providerEventId)
                .payloadHash(new byte[32]) // Stub Hash
                .status(WebhookEventStatus.PROCESSED)
                .build();
                
        webhookEventRepository.save(event);
    }

    private Integer generateAttemptNumber(Payment payment) {
        // Query max attempt number or use simple logic for demo
        return 1; // Simplified
    }

    private void updatePaymentAggregate(Payment payment, BigDecimal successAmount) {
        payment.setPaidAmount(payment.getPaidAmount().add(successAmount));

        if (payment.getPaidAmount().compareTo(payment.getExpectedAmount()) >= 0) {
            payment.setStatus(PaymentStatus.PAID);
            payment.setPaidAt(LocalDateTime.now());
            // Need to change Order Status here in a real app or emit an Event
        } else if (payment.getPaidAmount().compareTo(BigDecimal.ZERO) > 0) {
            payment.setStatus(PaymentStatus.PARTIALLY_PAID);
        }

        paymentRepository.save(payment);
    }
}
