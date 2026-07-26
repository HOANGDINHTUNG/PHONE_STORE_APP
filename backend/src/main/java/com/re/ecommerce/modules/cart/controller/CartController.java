package com.re.ecommerce.modules.cart.controller;

import io.swagger.v3.oas.annotations.tags.Tag;

import com.re.ecommerce.modules.cart.dto.request.CartItemRequest;
import com.re.ecommerce.modules.cart.dto.request.CartItemUpdateQuantityRequest;
import com.re.ecommerce.modules.cart.dto.response.CartResponse;
import com.re.ecommerce.modules.cart.service.CartService;
import com.re.ecommerce.common.exception.UnprocessableEntityException;
import com.re.ecommerce.modules.auth.entity.User;
import com.re.ecommerce.modules.auth.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

@Tag(name = "9. Cart")
@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
@Slf4j
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;

    private record CartIdentity(UUID customerId, byte[] guestTokenHash) {}

    private CartIdentity resolveIdentity(String guestToken) {
        UUID customerId = extractCustomerId();
        byte[] guestTokenHash = hashToken(guestToken);
        validateIdentifiers(customerId, guestTokenHash);
        return new CartIdentity(customerId, guestTokenHash);
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart(
            @RequestHeader(value = "X-Guest-Token", required = false) String guestToken) {
        var identity = resolveIdentity(guestToken);
        return ResponseEntity.ok(cartService.getCart(identity.customerId(), identity.guestTokenHash()));
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItem(
            @RequestHeader(value = "X-Guest-Token", required = false) String guestToken,
            @Valid @RequestBody CartItemRequest request) {
        var identity = resolveIdentity(guestToken);
        return ResponseEntity.ok(cartService.addItem(identity.customerId(), identity.guestTokenHash(), request));
    }

    @PatchMapping("/items/{cartItemId}")
    public ResponseEntity<CartResponse> updateItemQuantity(
            @RequestHeader(value = "X-Guest-Token", required = false) String guestToken,
            @PathVariable UUID cartItemId,
            @Valid @RequestBody CartItemUpdateQuantityRequest request) {
        var identity = resolveIdentity(guestToken);
        return ResponseEntity.ok(cartService.updateItemQuantity(identity.customerId(), identity.guestTokenHash(), cartItemId, request));
    }

    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<Void> removeItem(
            @RequestHeader(value = "X-Guest-Token", required = false) String guestToken,
            @PathVariable UUID cartItemId) {
        var identity = resolveIdentity(guestToken);
        cartService.removeItem(identity.customerId(), identity.guestTokenHash(), cartItemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/items")
    public ResponseEntity<Void> clearCart(
            @RequestHeader(value = "X-Guest-Token", required = false) String guestToken) {
        var identity = resolveIdentity(guestToken);
        cartService.clearCart(identity.customerId(), identity.guestTokenHash());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/merge")
    public ResponseEntity<CartResponse> mergeCart(
            @RequestHeader(value = "X-Guest-Token", required = true) String guestToken) {
        UUID customerId = extractCustomerId();
        if (customerId == null) {
            log.error("Failed to merge cart: Customer is not fully authenticated");
            throw new UnprocessableEntityException("GUEST_MERGE_ERROR", "User must be authenticated to merge a guest cart");
        }
        return ResponseEntity.ok(cartService.mergeCart(customerId, hashToken(guestToken)));
    }

    private UUID extractCustomerId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            return userRepository.findByUsername(auth.getName())
                    .map(User::getId)
                    .orElse(null);
        }
        return null;
    }

    private byte[] hashToken(String token) {
        if (token == null || token.isBlank()) {
            return null;
        }
        try {
            return MessageDigest.getInstance("SHA-256").digest(token.getBytes(StandardCharsets.UTF_8));
        } catch (NoSuchAlgorithmException e) {
            log.error("SHA-256 algorithm missing during token hashing", e);
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }

    private void validateIdentifiers(UUID customerId, byte[] guestTokenHash) {
        if (customerId == null && guestTokenHash == null) {
            log.warn("Cart request rejected: Missing customerId and guestToken");
            throw new UnprocessableEntityException("MISSING_IDENTIFIER", "X-Guest-Token header or authenticated session is required");
        }
    }
}
