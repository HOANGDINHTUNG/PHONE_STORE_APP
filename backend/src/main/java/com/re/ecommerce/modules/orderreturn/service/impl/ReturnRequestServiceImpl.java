package com.re.ecommerce.modules.orderreturn.service.impl;

import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.modules.orderreturn.dto.request.CreateReturnRequest;
import com.re.ecommerce.modules.orderreturn.dto.request.InspectReturnRequest;
import com.re.ecommerce.modules.orderreturn.entity.ReturnRequest;
import com.re.ecommerce.modules.orderreturn.enumeration.ReturnRequestStatus;
import com.re.ecommerce.modules.orderreturn.repository.ReturnRequestRepository;
import com.re.ecommerce.modules.orderreturn.service.ReturnRequestService;
import com.re.ecommerce.modules.auth.repository.UserRepository;
import com.re.ecommerce.modules.system.entity.Notification;
import com.re.ecommerce.modules.system.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReturnRequestServiceImpl implements ReturnRequestService {

    private final ReturnRequestRepository returnRequestRepository;

    private final UserRepository userRepository;
    
    private final NotificationRepository notificationRepository;

    @Override
    @Transactional
    public void createReturnRequest(String orderCode, CreateReturnRequest request, UUID customerId) {
        log.info("Creating return request for order {}", orderCode);
        // Implementation: resolve order, check eligibility, sum total refund, save
    }

    @Override
    @Transactional
    public void approveReturnRequest(Long returnId, UUID staffId) {
        ReturnRequest returnRequest = returnRequestRepository.findById(returnId)
                .orElseThrow(() -> new ResourceNotFoundException("RETURN_NOT_FOUND", "Return Request not found"));
                
        returnRequest.setStatus(ReturnRequestStatus.APPROVED);
        returnRequest.setReviewer(userRepository.getReferenceById(staffId));
        returnRequestRepository.save(returnRequest);
        
        notificationRepository.save(new Notification(
                returnRequest.getCustomer(),
                "Yêu cầu đổi trả được duyệt",
                "Yêu cầu đổi trả mã #" + returnRequest.getId() + " của bạn đã được phê duyệt.",
                "RETURN",
                "ReturnRequest",
                returnRequest.getId().toString(),
                "/account/returns/" + returnRequest.getId()
        ));
    }

    @Override
    @Transactional
    public void rejectReturnRequest(Long returnId, String reason, UUID staffId) {
        ReturnRequest returnRequest = returnRequestRepository.findById(returnId)
                .orElseThrow(() -> new ResourceNotFoundException("RETURN_NOT_FOUND", "Return Request not found"));
                
        returnRequest.setStatus(ReturnRequestStatus.REJECTED);
        returnRequest.setReviewer(userRepository.getReferenceById(staffId));
        returnRequestRepository.save(returnRequest);
        
        notificationRepository.save(new Notification(
                returnRequest.getCustomer(),
                "Yêu cầu đổi trả bị từ chối",
                "Yêu cầu đổi trả mã #" + returnRequest.getId() + " đã bị từ chối: " + reason,
                "RETURN",
                "ReturnRequest",
                returnRequest.getId().toString(),
                "/account/returns/" + returnRequest.getId()
        ));
    }

    @Override
    @Transactional
    public void receiveReturnItems(Long returnId, UUID staffId) {
        ReturnRequest returnRequest = returnRequestRepository.findById(returnId)
                .orElseThrow(() -> new ResourceNotFoundException("RETURN_NOT_FOUND", "Return Request not found"));
                
        returnRequest.setStatus(ReturnRequestStatus.RECEIVED);
        returnRequestRepository.save(returnRequest);
        
        notificationRepository.save(new Notification(
                returnRequest.getCustomer(),
                "Đã nhận hàng hoàn trả",
                "Cửa hàng đã nhận được sản phẩm từ yêu cầu đổi trả mã #" + returnRequest.getId() + ".",
                "RETURN",
                "ReturnRequest",
                returnRequest.getId().toString(),
                "/account/returns/" + returnRequest.getId()
        ));
    }

    @Override
    @Transactional
    public void inspectReturnRequest(Long returnId, InspectReturnRequest request, UUID staffId) {
        ReturnRequest returnRequest = returnRequestRepository.findById(returnId)
                .orElseThrow(() -> new ResourceNotFoundException("RETURN_NOT_FOUND", "Return Request not found"));
                
        returnRequest.setStatus(ReturnRequestStatus.INSPECTING);
        // Set item outcomes...
        returnRequestRepository.save(returnRequest);
        
        notificationRepository.save(new Notification(
                returnRequest.getCustomer(),
                "Đang xử lý đổi trả",
                "Yêu cầu đổi trả mã #" + returnRequest.getId() + " đang được kiểm tra kỹ thuật.",
                "RETURN",
                "ReturnRequest",
                returnRequest.getId().toString(),
                "/account/returns/" + returnRequest.getId()
        ));
    }

    @Override
    @Transactional
    public void completeReturn(Long returnId, UUID staffId) {
        ReturnRequest returnRequest = returnRequestRepository.findById(returnId)
                .orElseThrow(() -> new ResourceNotFoundException("RETURN_NOT_FOUND", "Return Request not found"));
                
        returnRequest.setStatus(ReturnRequestStatus.COMPLETED);
        returnRequestRepository.save(returnRequest);
        
        notificationRepository.save(new Notification(
                returnRequest.getCustomer(),
                "Yêu cầu đổi trả hoàn tất",
                "Yêu cầu đổi trả mã #" + returnRequest.getId() + " đã được xử lý xong.",
                "RETURN",
                "ReturnRequest",
                returnRequest.getId().toString(),
                "/account/returns/" + returnRequest.getId()
        ));
    }
}
