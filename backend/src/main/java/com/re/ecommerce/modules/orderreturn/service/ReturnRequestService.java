package com.re.ecommerce.modules.orderreturn.service;

import com.re.ecommerce.modules.orderreturn.dto.request.CreateReturnRequest;
import com.re.ecommerce.modules.orderreturn.dto.request.InspectReturnRequest;
import java.util.UUID;

public interface ReturnRequestService {
    void createReturnRequest(String orderCode, CreateReturnRequest request, UUID customerId);
    void approveReturnRequest(Long returnId, UUID staffId);
    void rejectReturnRequest(Long returnId, String reason, UUID staffId);
    void receiveReturnItems(Long returnId, UUID staffId); // simplified
    void inspectReturnRequest(Long returnId, InspectReturnRequest request, UUID staffId);
    void completeReturn(Long returnId, UUID staffId);
}
