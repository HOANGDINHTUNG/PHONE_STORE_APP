package com.re.ecommerce.modules.payment.controller;

import com.re.ecommerce.common.dto.PagedResponse;
import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.modules.payment.dto.response.AdminPaymentAttemptResponse;
import com.re.ecommerce.modules.payment.dto.response.AdminPaymentResponse;
import com.re.ecommerce.modules.payment.entity.Payment;
import com.re.ecommerce.modules.payment.entity.PaymentAttempt;
import com.re.ecommerce.modules.payment.repository.PaymentAttemptRepository;
import com.re.ecommerce.modules.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/payments")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminPaymentQueryController {

    private final PaymentRepository paymentRepository;
    private final PaymentAttemptRepository paymentAttemptRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<PagedResponse<AdminPaymentResponse>> getPayments(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "100") int size) {
        int safePage = Math.max(page, 1);
        int safeSize = Math.min(Math.max(size, 1), 100);
        Page<Payment> payments = paymentRepository.findAll(
                PageRequest.of(safePage - 1, safeSize, Sort.by("createdAt").descending()));
        List<AdminPaymentResponse> items = payments.getContent().stream()
                .map(payment -> toResponse(payment, false))
                .toList();
        return ResponseEntity.ok(PagedResponse.of(payments, items));
    }

    @GetMapping("/{paymentId}")
    @Transactional(readOnly = true)
    public ResponseEntity<AdminPaymentResponse> getPayment(@PathVariable Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("PAYMENT_NOT_FOUND", "Payment not found"));
        return ResponseEntity.ok(toResponse(payment, true));
    }

    private AdminPaymentResponse toResponse(Payment payment, boolean includeAttempts) {
        List<PaymentAttempt> attempts = includeAttempts
                ? paymentAttemptRepository.findByPaymentIdOrderByAttemptNumberAsc(payment.getId())
                : List.of();
        String latestMethod = paymentAttemptRepository.findTopByPaymentIdOrderByAttemptNumberDesc(payment.getId())
                .map(attempt -> attempt.getMethod().name())
                .orElse(null);

        return new AdminPaymentResponse(
                payment.getId(),
                payment.getOrder().getOrderCode(),
                payment.getExpectedAmount(),
                payment.getPaidAmount(),
                payment.getRefundedAmount(),
                payment.getCurrency(),
                payment.getStatus().name(),
                latestMethod,
                payment.getPaidAt(),
                payment.getCreatedAt(),
                attempts.stream().map(this::toAttemptResponse).toList());
    }

    private AdminPaymentAttemptResponse toAttemptResponse(PaymentAttempt attempt) {
        return new AdminPaymentAttemptResponse(
                attempt.getId(),
                attempt.getAttemptNumber(),
                attempt.getMethod().name(),
                attempt.getProviderCode(),
                attempt.getAmount(),
                attempt.getStatus().name(),
                attempt.getProviderTransactionId(),
                attempt.getProviderMessage(),
                attempt.getCreatedAt());
    }
}
