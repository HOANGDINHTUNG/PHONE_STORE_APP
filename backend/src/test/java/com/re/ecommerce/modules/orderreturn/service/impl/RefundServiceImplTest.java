package com.re.ecommerce.modules.orderreturn.service.impl;

import com.re.ecommerce.modules.orderreturn.dto.request.CreateRefundRequest;
import com.re.ecommerce.modules.orderreturn.entity.Refund;
import com.re.ecommerce.modules.orderreturn.enumeration.RefundMethod;
import com.re.ecommerce.modules.orderreturn.enumeration.RefundStatus;
import com.re.ecommerce.modules.orderreturn.repository.RefundRepository;
import com.re.ecommerce.modules.payment.repository.PaymentRepository;
import com.re.ecommerce.modules.payment.entity.Payment;
import com.re.ecommerce.modules.auth.repository.UserRepository;
import com.re.ecommerce.modules.auth.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RefundServiceImplTest {

    @Mock
    private RefundRepository refundRepository;
    @Mock
    private PaymentRepository paymentRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private RefundServiceImpl refundService;

    private UUID mockUserId;
    private User mockUser;
    private Payment mockPayment;

    @BeforeEach
    void setUp() {
        mockUserId = UUID.randomUUID();
        mockUser = new User("testuser", "test@example.com", "hash", "USER");
        mockUser.setId(mockUserId);
        
        mockPayment = new Payment();
        mockPayment.setId(10L);
    }

    @Test
    void createRefund_Success() {
        CreateRefundRequest req = new CreateRefundRequest();
        req.setPaymentId(10L);
        req.setAmount(new BigDecimal("10000"));
        req.setMethod(RefundMethod.CASH);
        req.setReason("Return damaged");

        when(paymentRepository.getReferenceById(10L)).thenReturn(mockPayment);
        when(userRepository.getReferenceById(mockUserId)).thenReturn(mockUser);

        refundService.createRefund(req, mockUserId);

        verify(refundRepository, times(1)).save(any(Refund.class));
    }

    @Test
    void approveRefund_Success() {
        Refund refund = new Refund();
        refund.setId(5L);
        
        when(refundRepository.findById(5L)).thenReturn(Optional.of(refund));
        when(userRepository.getReferenceById(mockUserId)).thenReturn(mockUser);

        refundService.approveRefund(5L, mockUserId);

        verify(refundRepository, times(1)).save(refund);
        assertThat(refund.getStatus()).isEqualTo(RefundStatus.PROCESSING);
    }
}
