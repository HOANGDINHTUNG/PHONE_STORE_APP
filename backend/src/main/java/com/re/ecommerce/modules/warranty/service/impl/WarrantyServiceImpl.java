package com.re.ecommerce.modules.warranty.service.impl;

import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.modules.warranty.dto.request.SubmitClaimRequest;
import com.re.ecommerce.modules.warranty.dto.request.ChangeClaimStatusRequest;
import com.re.ecommerce.modules.warranty.entity.Warranty;
import com.re.ecommerce.modules.warranty.entity.WarrantyClaim;
import com.re.ecommerce.modules.warranty.enumeration.WarrantyClaimStatus;
import com.re.ecommerce.modules.warranty.repository.WarrantyClaimRepository;
import com.re.ecommerce.modules.warranty.repository.WarrantyRepository;
import com.re.ecommerce.modules.warranty.service.WarrantyService;
import com.re.ecommerce.modules.auth.entity.User;
import com.re.ecommerce.modules.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class WarrantyServiceImpl implements WarrantyService {

    private final WarrantyRepository warrantyRepository;
    private final WarrantyClaimRepository warrantyClaimRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void processWarrantyGenerationForCompletedOrder(UUID orderId) {
        log.info("Generating warranties for completed order: {}", orderId);
        // Implementation for mapping order items to warranties
        // Typically reads order items and their serials, then creates warranty certificates
    }

    @Override
    @Transactional
    public void submitClaim(String warrantyCode, SubmitClaimRequest request, UUID customerId) {
        Warranty warranty = warrantyRepository.findByWarrantyCode(warrantyCode)
                .orElseThrow(() -> new ResourceNotFoundException("WARRANTY_NOT_FOUND", "Warranty code not found: " + warrantyCode));
                
        // Validation for date and owner
        if (warranty.getEndDate().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Warranty is already expired");
        }
        
        WarrantyClaim claim = new WarrantyClaim();
        claim.setWarranty(warranty);
        claim.setClaimCode(UUID.randomUUID().toString());
        claim.setIssueDescription(request.getIssueDescription());
        claim.setStatus(WarrantyClaimStatus.SUBMITTED);
        
        warrantyClaimRepository.save(claim);
        log.info("Claim created for warranty: {}", warrantyCode);
    }

    @Override
    @Transactional
    public void changeClaimStatus(Long claimId, ChangeClaimStatusRequest request, UUID staffId) {
        WarrantyClaim claim = warrantyClaimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("CLAIM_NOT_FOUND", "Claim not found: " + claimId));
                
        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new ResourceNotFoundException("USER_NOT_FOUND", "Staff not found: " + staffId));

        claim.setStatus(request.getStatus());
        claim.setResolution(request.getResolution());
        claim.setRejectionReason(request.getRejectionReason());

        if (request.getStatus() == WarrantyClaimStatus.RECEIVED && claim.getReceivedBy() == null) {
            claim.setReceivedBy(staff);
            claim.setReceivedAt(LocalDateTime.now());
        } else if (request.getStatus() == WarrantyClaimStatus.COMPLETED) {
            claim.setCompletedAt(LocalDateTime.now());
        }
        
        warrantyClaimRepository.save(claim);
        log.info("Claim {} status updated to {}", claimId, request.getStatus());
    }
}
