package com.re.ecommerce.modules.orderreturn.controller;

import com.re.ecommerce.modules.orderreturn.dto.request.CreateReturnRequest;
import com.re.ecommerce.modules.orderreturn.service.ReturnRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.re.ecommerce.modules.auth.entity.User;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orders/{orderCode}/return-requests")
@RequiredArgsConstructor
@Slf4j
public class ReturnRequestController {

    private final ReturnRequestService returnRequestService;

    @PostMapping
    public ResponseEntity<Void> createReturnRequest(
            @PathVariable String orderCode,
            @Valid @RequestBody CreateReturnRequest request,
            @AuthenticationPrincipal User currentUser) {
        
        UUID customerId = currentUser.getId();
        MDC.put("operation", "createReturnRequest");
        MDC.put("orderCode", orderCode);
        log.info("Creating return request");
        
        returnRequestService.createReturnRequest(orderCode, request, customerId);
        MDC.clear();
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
