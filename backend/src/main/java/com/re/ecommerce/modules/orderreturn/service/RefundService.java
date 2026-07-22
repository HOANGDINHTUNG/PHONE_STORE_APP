package com.re.ecommerce.modules.orderreturn.service;

import com.re.ecommerce.modules.orderreturn.dto.request.CreateRefundRequest;
import java.util.UUID;

public interface RefundService {
    void createRefund(CreateRefundRequest request, UUID requesterId);
    void approveRefund(Long refundId, UUID approverId);
    void confirmManualRefund(Long refundId, UUID staffId);
    void processRefundWebhook(String providerCode, String idempotencyKey, String refundCode);
}
