package com.re.ecommerce.modules.orderreturn.controller;

import io.swagger.v3.oas.annotations.tags.Tag;

import com.re.ecommerce.modules.orderreturn.dto.request.InspectReturnRequest;
import com.re.ecommerce.modules.orderreturn.service.ReturnRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.re.ecommerce.modules.auth.entity.User;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.Collections;

import java.util.UUID;

@Tag(name = "15. Admin Return")
@RestController
@RequestMapping("/api/v1/admin/return-requests")
@PreAuthorize("hasRole('ADMIN')")
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

    @GetMapping
    public ResponseEntity<?> getAdminReturnRequests() {
        return ResponseEntity.ok(Collections.emptyMap());
    }

    @GetMapping("/{requestId}")
    public ResponseEntity<?> getAdminReturnRequestDetail(@PathVariable UUID requestId) {
        return ResponseEntity.ok(Collections.emptyMap());
    }
}
