package com.re.ecommerce.modules.orderreturn.service.impl;

import com.re.ecommerce.modules.orderreturn.dto.request.CreateReturnRequest;
import com.re.ecommerce.modules.orderreturn.entity.ReturnRequest;
import com.re.ecommerce.modules.orderreturn.enumeration.ReturnRequestStatus;
import com.re.ecommerce.modules.orderreturn.repository.ReturnRequestRepository;
import com.re.ecommerce.modules.auth.repository.UserRepository;
import com.re.ecommerce.modules.order.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import com.re.ecommerce.modules.auth.entity.User;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ReturnRequestServiceImplTest {

    @Mock
    private ReturnRequestRepository returnRequestRepository;
    @Mock
    private OrderRepository orderRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ReturnRequestServiceImpl returnRequestService;

    private UUID mockStaffId;
    private User mockStaff;

    @BeforeEach
    void setUp() {
        mockStaffId = UUID.randomUUID();
        mockStaff = new User("staffuser", "staff@example.com", "hash", "STAFF");
        mockStaff.setId(mockStaffId);
    }

    @Test
    void createReturnRequest_Success() {
        returnRequestService.createReturnRequest("ORD-1", new CreateReturnRequest(), mockStaffId);
        // Add more logic here when implemented fully
    }

    @Test
    void approveReturnRequest_Success() {
        ReturnRequest req = new ReturnRequest();
        req.setId(1L);
        
        when(returnRequestRepository.findById(1L)).thenReturn(Optional.of(req));
        when(userRepository.getReferenceById(mockStaffId)).thenReturn(mockStaff);

        returnRequestService.approveReturnRequest(1L, mockStaffId);

        verify(returnRequestRepository, times(1)).save(req);
        assertThat(req.getStatus()).isEqualTo(ReturnRequestStatus.APPROVED);
    }
}
