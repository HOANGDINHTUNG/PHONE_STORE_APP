package com.re.ecommerce.modules.warranty.service;

import com.re.ecommerce.modules.warranty.dto.request.SubmitClaimRequest;
import com.re.ecommerce.modules.warranty.dto.request.ChangeClaimStatusRequest;
import java.util.UUID;

public interface WarrantyService {
    void processWarrantyGenerationForCompletedOrder(UUID orderId);
    void submitClaim(String warrantyCode, SubmitClaimRequest request, UUID customerId);
    void changeClaimStatus(Long claimId, ChangeClaimStatusRequest request, UUID staffId);
}
