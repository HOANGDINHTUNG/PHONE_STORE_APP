package com.re.ecommerce.modules.orderreturn.controller;

import io.swagger.v3.oas.annotations.tags.Tag;

import com.re.ecommerce.modules.orderreturn.dto.request.CreateRefundRequest;
import com.re.ecommerce.modules.orderreturn.service.RefundService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.re.ecommerce.modules.auth.entity.User;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Tag(name = "15. Admin Return")
@RestController
@RequestMapping("/api/v1/admin/refunds")
@RequiredArgsConstructor
@Slf4j
public class AdminRefundController {

    private final RefundService refundService;

    @PostMapping
    public ResponseEntity<Void> createRefund(
            @Valid @RequestBody CreateRefundRequest request,
            @AuthenticationPrincipal User currentUser) {
        UUID staffId = currentUser.getId();
        refundService.createRefund(request, staffId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/{refundId}/approve")
    public ResponseEntity<Void> approveRefund(
            @PathVariable Long refundId,
            @AuthenticationPrincipal User currentUser) {
        UUID staffId = currentUser.getId();
        refundService.approveRefund(refundId, staffId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{refundId}/confirm-manual")
    public ResponseEntity<Void> confirmManualRefund(
            @PathVariable Long refundId,
            @AuthenticationPrincipal User currentUser) {
        UUID staffId = currentUser.getId();
        refundService.confirmManualRefund(refundId, staffId);
        return ResponseEntity.ok().build();
    }
}
