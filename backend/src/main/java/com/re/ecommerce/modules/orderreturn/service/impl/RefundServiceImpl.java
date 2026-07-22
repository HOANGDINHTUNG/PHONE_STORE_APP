package com.re.ecommerce.modules.orderreturn.service.impl;

import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.modules.orderreturn.dto.request.CreateRefundRequest;
import com.re.ecommerce.modules.orderreturn.entity.Refund;
import com.re.ecommerce.modules.orderreturn.enumeration.RefundStatus;
import com.re.ecommerce.modules.orderreturn.repository.RefundRepository;
import com.re.ecommerce.modules.orderreturn.service.RefundService;
import com.re.ecommerce.modules.payment.repository.PaymentRepository;
import com.re.ecommerce.modules.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RefundServiceImpl implements RefundService {

    private final RefundRepository refundRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void createRefund(CreateRefundRequest request, UUID requesterId) {
        log.info("Creating new refund request for payment {}", request.getPaymentId());
        // Basic placeholder logic
        Refund refund = new Refund();
        refund.setRefundCode(UUID.randomUUID().toString());
        refund.setIdempotencyKey(UUID.randomUUID().toString());
        refund.setPayment(paymentRepository.getReferenceById(request.getPaymentId()));
        refund.setAmount(request.getAmount());
        refund.setMethod(request.getMethod());
        refund.setReason(request.getReason());
        refund.setRequester(userRepository.getReferenceById(requesterId));
        refund.setStatus(RefundStatus.PENDING);
        
        refundRepository.save(refund);
    }

    @Override
    @Transactional
    public void approveRefund(Long refundId, UUID approverId) {
        Refund refund = refundRepository.findById(refundId)
                .orElseThrow(() -> new ResourceNotFoundException("REFUND_NOT_FOUND", "Refund not found"));
                
        refund.setStatus(RefundStatus.PROCESSING);
        refund.setApprover(userRepository.getReferenceById(approverId));
        refundRepository.save(refund);
        
        // Emit logic for async provider refund queue
    }

    @Override
    @Transactional
    public void confirmManualRefund(Long refundId, UUID staffId) {
        Refund refund = refundRepository.findById(refundId)
                .orElseThrow(() -> new ResourceNotFoundException("REFUND_NOT_FOUND", "Refund not found"));
                
        refund.setStatus(RefundStatus.SUCCESS);
        refund.setApprover(userRepository.getReferenceById(staffId));
        refundRepository.save(refund);
    }

    @Override
    @Transactional
    public void processRefundWebhook(String providerCode, String idempotencyKey, String refundCode) {
        log.info("Processing refund webhook from {} for code {}", providerCode, refundCode);
    }
}
