package com.re.ecommerce.modules.orderreturn.controller;

import io.swagger.v3.oas.annotations.tags.Tag;

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
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.Collections;

import java.util.UUID;

@Tag(name = "14. Return & Exchange")
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

        returnRequestService.createReturnRequest(orderCode, request, customerId);
        MDC.clear();
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getOrderReturns(@PathVariable String orderCode) {
        return ResponseEntity.ok(Collections.emptyList());
    }

    @GetMapping("/{requestId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getOrderReturnDetail(@PathVariable String orderCode, @PathVariable UUID requestId) {
        return ResponseEntity.ok(Collections.emptyMap());
    }

}
