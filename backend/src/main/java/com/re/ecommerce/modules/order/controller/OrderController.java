package com.re.ecommerce.modules.order.controller;

import io.swagger.v3.oas.annotations.tags.Tag;

import com.re.ecommerce.common.dto.PagedResponse;
import com.re.ecommerce.modules.auth.entity.User;
import com.re.ecommerce.modules.auth.repository.UserRepository;
import com.re.ecommerce.modules.order.dto.request.CheckoutRequest;
import com.re.ecommerce.modules.order.dto.response.OrderResponse;
import com.re.ecommerce.modules.cart.dto.response.CartResponse;
import com.re.ecommerce.modules.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import org.springframework.validation.annotation.Validated;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

@Slf4j
@Tag(name = "11. Sales Order Management")
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Validated
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    @PostMapping("/orders/checkout")
    public ResponseEntity<OrderResponse> checkout(
            Authentication auth,
            @RequestHeader(value = "X-Guest-Cart-Token", required = false) String guestToken,
            @Valid @RequestBody CheckoutRequest request) {
        
        if (hasAdminRole(auth)) {
            throw new AccessDeniedException("Administrator accounts cannot place customer orders");
        }

        User currentUser = null;
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            currentUser = userRepository.findByUsername(auth.getName()).orElse(null);
        }
        
        OrderResponse response = orderService.checkout(currentUser, guestToken, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/me/orders")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PagedResponse<OrderResponse>> getMyOrders(
            Authentication auth,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size) {
        User currentUser = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new org.springframework.security.authentication.CredentialsExpiredException("User account no longer exists"));
        return ResponseEntity.ok(orderService.getMyOrders(currentUser, page, size));
    }

    @GetMapping("/me/orders/{orderCode}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<OrderResponse> getMyOrder(
            Authentication auth,
            @PathVariable String orderCode) {
        User currentUser = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new org.springframework.security.authentication.CredentialsExpiredException("User account no longer exists"));
        return ResponseEntity.ok(orderService.getMyOrder(currentUser, orderCode));
    }

    @PostMapping("/me/orders/{orderCode}/reorder")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CartResponse> reorder(
            Authentication auth,
            @PathVariable String orderCode) {
        User currentUser = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new org.springframework.security.authentication.CredentialsExpiredException("User account no longer exists"));
        return ResponseEntity.ok(orderService.reorder(currentUser, orderCode));
    }

    @GetMapping("/admin/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PagedResponse<OrderResponse>> getAdminOrders(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size) {
        return ResponseEntity.ok(orderService.getAdminOrders(page, size));
    }

    @PostMapping("/admin/orders/{orderId}/confirm")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> confirmOrder(
            Authentication auth,
            @PathVariable UUID orderId) {
        User admin = userRepository.findByUsername(auth.getName()).orElseThrow();
        orderService.confirmOrder(admin, orderId);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/admin/orders/{orderId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderResponse> getAdminOrder(@PathVariable UUID orderId) {
        return ResponseEntity.ok(orderService.getAdminOrder(orderId));
    }

    @PostMapping("/admin/orders/{orderId}/cancel")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderResponse> cancelAdminOrder(
            @PathVariable UUID orderId,
            @RequestParam String reason) {
        return ResponseEntity.ok(orderService.cancelOrder(null, orderId, reason));
    }

    @PostMapping("/admin/orders/{orderId}/start-processing")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderResponse> startProcessing(@PathVariable UUID orderId) {
        return ResponseEntity.ok(orderService.startProcessing(orderId));
    }

    @PostMapping("/internal/orders/{orderId}/complete")
    @PreAuthorize("hasRole('SYSTEM') or hasRole('ADMIN')")
    public ResponseEntity<OrderResponse> completeOrder(@PathVariable UUID orderId) {
        return ResponseEntity.ok(orderService.completeOrder(orderId));
    }

    @PostMapping("/orders/{orderId}/cancel")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<OrderResponse> cancelMyOrder(
            Authentication auth,
            @PathVariable UUID orderId,
            @RequestParam String reason) {
        User currentUser = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new org.springframework.security.authentication.CredentialsExpiredException("User account no longer exists"));
        return ResponseEntity.ok(orderService.cancelOrder(currentUser, orderId, reason));
    }

    @GetMapping("/orders/{orderId}/payment")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> getOrderPayment(
            Authentication auth,
            @PathVariable UUID orderId) {
        return ResponseEntity.ok("https://payment.local/mock/" + orderId);
    }

    @GetMapping("/guest-orders/{accessLink}")
    public ResponseEntity<OrderResponse> getGuestOrder(@PathVariable String accessLink) {
        return ResponseEntity.ok(orderService.getGuestOrder(accessLink));
    }

    @PostMapping("/guest-orders/access-links")
    public ResponseEntity<String> generateGuestAccessLink(
            @RequestParam String orderCode,
            @RequestParam String email) {
        return ResponseEntity.ok(orderService.generateGuestAccessLink(orderCode, email));
    }

    private boolean hasAdminRole(Authentication auth) {
        return auth != null && auth.getAuthorities().stream()
                .anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority()));
    }
}
