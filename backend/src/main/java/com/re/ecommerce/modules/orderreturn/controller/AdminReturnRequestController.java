package com.re.ecommerce.modules.orderreturn.controller;

import com.re.ecommerce.modules.orderreturn.dto.request.InspectReturnRequest;
import com.re.ecommerce.modules.orderreturn.service.ReturnRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.re.ecommerce.modules.auth.entity.User;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/return-requests")
@RequiredArgsConstructor
@Slf4j
public class AdminReturnRequestController {

    private final ReturnRequestService returnRequestService;

    @PostMapping("/{returnId}/approve")
    public ResponseEntity<Void> approveReturnRequest(
            @PathVariable Long returnId,
            @AuthenticationPrincipal User currentUser) {
        UUID staffId = currentUser.getId();
        returnRequestService.approveReturnRequest(returnId, staffId);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/{returnId}/reject")
    public ResponseEntity<Void> rejectReturnRequest(
            @PathVariable Long returnId,
            @RequestParam String reason,
            @AuthenticationPrincipal User currentUser) {
        UUID staffId = currentUser.getId();
        returnRequestService.rejectReturnRequest(returnId, reason, staffId);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/{returnId}/receive")
    public ResponseEntity<Void> receiveReturnItems(
            @PathVariable Long returnId,
            @AuthenticationPrincipal User currentUser) {
        UUID staffId = currentUser.getId();
        returnRequestService.receiveReturnItems(returnId, staffId);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/{returnId}/inspect")
    public ResponseEntity<Void> inspectReturnRequest(
            @PathVariable Long returnId,
            @Valid @RequestBody InspectReturnRequest request,
            @AuthenticationPrincipal User currentUser) {
        UUID staffId = currentUser.getId();
        returnRequestService.inspectReturnRequest(returnId, request, staffId);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/{returnId}/complete")
    public ResponseEntity<Void> completeReturn(
            @PathVariable Long returnId,
            @AuthenticationPrincipal User currentUser) {
        UUID staffId = currentUser.getId();
        returnRequestService.completeReturn(returnId, staffId);
        return ResponseEntity.ok().build();
    }
}
