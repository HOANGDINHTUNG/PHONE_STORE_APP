package com.re.ecommerce.modules.warranty.service.impl;

import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.modules.warranty.dto.request.SubmitClaimRequest;
import com.re.ecommerce.modules.warranty.dto.request.ChangeClaimStatusRequest;
import com.re.ecommerce.modules.warranty.entity.Warranty;
import com.re.ecommerce.modules.warranty.entity.WarrantyClaim;
import com.re.ecommerce.modules.warranty.enumeration.WarrantyClaimStatus;
import com.re.ecommerce.modules.warranty.repository.WarrantyClaimRepository;
import com.re.ecommerce.modules.warranty.repository.WarrantyRepository;
import com.re.ecommerce.modules.auth.entity.User;
import com.re.ecommerce.modules.auth.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class WarrantyServiceImplTest {

    @Mock
    private WarrantyRepository warrantyRepository;
    @Mock
    private WarrantyClaimRepository warrantyClaimRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private WarrantyServiceImpl warrantyService;

    private UUID mockUserId;
    private Warranty mockWarranty;
    private User mockUser;

    @BeforeEach
    void setUp() {
        mockUserId = UUID.randomUUID();
        mockWarranty = new Warranty();
        mockWarranty.setWarrantyCode("WAR-123");
        mockWarranty.setEndDate(LocalDateTime.now().plusMonths(12));
        
        mockUser = new User("testuser", "test@example.com", "hash", "USER");
        mockUser.setId(mockUserId);
    }

    @Test
    void submitClaim_Success() {
        SubmitClaimRequest request = new SubmitClaimRequest();
        request.setIssueDescription("Screen broken");

        when(warrantyRepository.findByWarrantyCode("WAR-123")).thenReturn(Optional.of(mockWarranty));

        warrantyService.submitClaim("WAR-123", request, mockUserId);

        verify(warrantyClaimRepository, times(1)).save(any(WarrantyClaim.class));
    }

    @Test
    void submitClaim_Expired_ThrowsException() {
        SubmitClaimRequest request = new SubmitClaimRequest();
        request.setIssueDescription("Screen broken");

        mockWarranty.setEndDate(LocalDateTime.now().minusDays(1)); // Expired

        when(warrantyRepository.findByWarrantyCode("WAR-123")).thenReturn(Optional.of(mockWarranty));

        assertThrows(IllegalStateException.class, () -> warrantyService.submitClaim("WAR-123", request, mockUserId));
    }

    @Test
    void changeClaimStatus_Success() {
        WarrantyClaim claim = new WarrantyClaim();
        claim.setId(1L);
        
        ChangeClaimStatusRequest request = new ChangeClaimStatusRequest();
        request.setStatus(WarrantyClaimStatus.RECEIVED);

        when(warrantyClaimRepository.findById(1L)).thenReturn(Optional.of(claim));
        when(userRepository.findById(mockUserId)).thenReturn(Optional.of(mockUser));

        warrantyService.changeClaimStatus(1L, request, mockUserId);

        verify(warrantyClaimRepository, times(1)).save(claim);
        assertThat(claim.getStatus()).isEqualTo(WarrantyClaimStatus.RECEIVED);
        assertThat(claim.getReceivedBy()).isEqualTo(mockUser);
    }
}
