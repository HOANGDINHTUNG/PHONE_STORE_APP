package com.re.ecommerce.modules.orderreturn.controller;

import io.swagger.v3.oas.annotations.tags.Tag;

import com.re.ecommerce.modules.orderreturn.dto.request.InspectReturnRequest;
import com.re.ecommerce.modules.orderreturn.entity.ReturnRequest;
import com.re.ecommerce.modules.orderreturn.repository.ReturnRequestRepository;
import com.re.ecommerce.modules.auth.repository.UserRepository;
import com.re.ecommerce.modules.orderreturn.service.ReturnRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.re.ecommerce.modules.auth.entity.User;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import java.util.Collections;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import java.util.UUID;

@Tag(name = "15. Admin Return")
@RestController
@RequestMapping("/api/v1/admin/return-requests")
@PreAuthorize("hasAnyAuthority('AFTER_SALES_VIEW', 'AFTER_SALES_MANAGE') or hasRole('ADMIN')")
@RequiredArgsConstructor
@Slf4j
public class AdminReturnRequestController {

    private final ReturnRequestService returnRequestService;
    private final ReturnRequestRepository returnRequestRepository;
    private final UserRepository userRepository;

    private record AdminReturnRequestResponse(Long id, String returnCode, String orderCode,
            String customerName, String customerPhone, String customerEmail, String status,
            BigDecimal totalRefundAmount, LocalDateTime createdAt) {}

    @PostMapping("/{returnId}/approve")
    @PreAuthorize("hasAuthority('AFTER_SALES_MANAGE') or hasRole('ADMIN')")
    public ResponseEntity<Void> approveReturnRequest(
            @PathVariable Long returnId,
            Authentication authentication) {
        UUID staffId = currentUserId(authentication);
        returnRequestService.approveReturnRequest(returnId, staffId);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/{returnId}/reject")
    @PreAuthorize("hasAuthority('AFTER_SALES_MANAGE') or hasRole('ADMIN')")
    public ResponseEntity<Void> rejectReturnRequest(
            @PathVariable Long returnId,
            @RequestParam String reason,
            Authentication authentication) {
        UUID staffId = currentUserId(authentication);
        returnRequestService.rejectReturnRequest(returnId, reason, staffId);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/{returnId}/receive")
    @PreAuthorize("hasAuthority('AFTER_SALES_MANAGE') or hasRole('ADMIN')")
    public ResponseEntity<Void> receiveReturnItems(
            @PathVariable Long returnId,
            Authentication authentication) {
        UUID staffId = currentUserId(authentication);
        returnRequestService.receiveReturnItems(returnId, staffId);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/{returnId}/inspect")
    @PreAuthorize("hasAuthority('AFTER_SALES_MANAGE') or hasRole('ADMIN')")
    public ResponseEntity<Void> inspectReturnRequest(
            @PathVariable Long returnId,
            @Valid @RequestBody InspectReturnRequest request,
            Authentication authentication) {
        UUID staffId = currentUserId(authentication);
        returnRequestService.inspectReturnRequest(returnId, request, staffId);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/{returnId}/complete")
    @PreAuthorize("hasAuthority('AFTER_SALES_MANAGE') or hasRole('ADMIN')")
    public ResponseEntity<Void> completeReturn(
            @PathVariable Long returnId,
            Authentication authentication) {
        UUID staffId = currentUserId(authentication);
        returnRequestService.completeReturn(returnId, staffId);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<List<AdminReturnRequestResponse>> getAdminReturnRequests() {
        return ResponseEntity.ok(returnRequestRepository.findAll().stream().map(this::toResponse).toList());
    }

    @GetMapping("/{requestId}")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<AdminReturnRequestResponse> getAdminReturnRequestDetail(@PathVariable Long requestId) {
        return ResponseEntity.ok(toResponse(returnRequestRepository.findById(requestId).orElseThrow()));
    }

    private AdminReturnRequestResponse toResponse(ReturnRequest request) {
        return new AdminReturnRequestResponse(request.getId(), request.getReturnCode(), request.getOrder().getOrderCode(),
                request.getOrder().getContactName(), request.getOrder().getContactPhone(), request.getOrder().getContactEmail(),
                request.getStatus().name(), request.getTotalRefundAmount(), request.getCreatedAt());
    }

    private UUID currentUserId(Authentication authentication) {
        return userRepository.findByUsername(authentication.getName()).orElseThrow().getId();
    }
}
