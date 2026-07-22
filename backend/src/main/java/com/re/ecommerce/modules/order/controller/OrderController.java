package com.re.ecommerce.modules.order.controller;

import com.re.ecommerce.common.dto.PagedResponse;
import com.re.ecommerce.modules.auth.entity.User;
import com.re.ecommerce.modules.order.dto.request.CheckoutRequest;
import com.re.ecommerce.modules.order.dto.response.OrderResponse;
import com.re.ecommerce.modules.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/orders/checkout")
    public ResponseEntity<OrderResponse> checkout(
            @AuthenticationPrincipal User currentUser,
            @RequestHeader(value = "X-Guest-Cart-Token", required = false) String guestToken,
            @Valid @RequestBody CheckoutRequest request) {
        
        byte[] guestTokenHash = null;
        if (currentUser == null && guestToken != null && !guestToken.isBlank()) {
            try {
                java.security.MessageDigest digest = java.security.MessageDigest.getInstance("SHA-256");
                guestTokenHash = digest.digest(guestToken.getBytes());
            } catch (Exception e) {
                log.error("Failed to hash guest token for checkout", e);
            }
        }
        
        OrderResponse response = orderService.checkout(currentUser, guestTokenHash, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/me/orders")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<PagedResponse<OrderResponse>> getMyOrders(
            @AuthenticationPrincipal User currentUser,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(orderService.getMyOrders(currentUser, page, size));
    }

    @GetMapping("/me/orders/{orderCode}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<OrderResponse> getMyOrder(
            @AuthenticationPrincipal User currentUser,
            @PathVariable String orderCode) {
        return ResponseEntity.ok(orderService.getMyOrder(currentUser, orderCode));
    }

    @GetMapping("/admin/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PagedResponse<OrderResponse>> getAdminOrders(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(orderService.getAdminOrders(page, size));
    }

    @PostMapping("/admin/orders/{orderId}/confirm")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> confirmOrder(
            @AuthenticationPrincipal User admin,
            @PathVariable UUID orderId) {
        orderService.confirmOrder(admin, orderId);
        return ResponseEntity.noContent().build();
    }
}
