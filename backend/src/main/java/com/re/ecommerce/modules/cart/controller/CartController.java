package com.re.ecommerce.modules.cart.controller;

import com.re.ecommerce.modules.cart.dto.request.CartItemRequest;
import com.re.ecommerce.modules.cart.dto.request.CartItemUpdateQuantityRequest;
import com.re.ecommerce.modules.cart.dto.response.CartResponse;
import com.re.ecommerce.modules.cart.service.CartService;
import com.re.ecommerce.common.exception.UnprocessableEntityException;
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

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
@Slf4j
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartResponse> getCart(
            @RequestHeader(value = "X-Guest-Token", required = false) String guestToken) {
        
        UUID customerId = extractCustomerId();
        byte[] guestTokenHash = hashToken(guestToken);
        log.debug("Fetching cart for Customer: {}, GuestToken: {}", customerId, guestTokenHash != null);
        
        validateIdentifiers(customerId, guestTokenHash);
        
        return ResponseEntity.ok(cartService.getCart(customerId, guestTokenHash));
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItem(
            @RequestHeader(value = "X-Guest-Token", required = false) String guestToken,
            @Valid @RequestBody CartItemRequest request) {
        
        UUID customerId = extractCustomerId();
        byte[] guestTokenHash = hashToken(guestToken);
        log.info("Adding variant ID {} to cart. Customer: {}, Guest: {}", request.getProductVariantId(), customerId, guestTokenHash != null);
        
        validateIdentifiers(customerId, guestTokenHash);
        
        CartResponse response = cartService.addItem(customerId, guestTokenHash, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/items/{cartItemId}")
    public ResponseEntity<CartResponse> updateItemQuantity(
            @RequestHeader(value = "X-Guest-Token", required = false) String guestToken,
            @PathVariable UUID cartItemId,
            @Valid @RequestBody CartItemUpdateQuantityRequest request) {
        
        UUID customerId = extractCustomerId();
        byte[] guestTokenHash = hashToken(guestToken);
        log.info("Updating quantity for cartItem ID {} to {}", cartItemId, request.getQuantity());
        
        validateIdentifiers(customerId, guestTokenHash);
        
        CartResponse response = cartService.updateItemQuantity(customerId, guestTokenHash, cartItemId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<Void> removeItem(
            @RequestHeader(value = "X-Guest-Token", required = false) String guestToken,
            @PathVariable UUID cartItemId) {
        
        UUID customerId = extractCustomerId();
        byte[] guestTokenHash = hashToken(guestToken);
        log.info("Removing cartItem ID {} from cart", cartItemId);
        
        validateIdentifiers(customerId, guestTokenHash);
        
        cartService.removeItem(customerId, guestTokenHash, cartItemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/items")
    public ResponseEntity<Void> clearCart(
            @RequestHeader(value = "X-Guest-Token", required = false) String guestToken) {
        
        UUID customerId = extractCustomerId();
        byte[] guestTokenHash = hashToken(guestToken);
        log.info("Clearing active cart items for Customer: {}, Guest: {}", customerId, guestTokenHash != null);
        
        validateIdentifiers(customerId, guestTokenHash);
        
        cartService.clearCart(customerId, guestTokenHash);
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
        
        byte[] guestTokenHash = hashToken(guestToken);
        log.info("Merging guest token cart into customer {} cart", customerId);
        
        CartResponse response = cartService.mergeCart(customerId, guestTokenHash);
        return ResponseEntity.ok(response);
    }

    private UUID extractCustomerId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            try {
                return UUID.fromString(auth.getName());
            } catch (IllegalArgumentException e) {
                return null;
            }
        }
        return null;
    }

    private byte[] hashToken(String token) {
        if (token == null || token.trim().isEmpty()) {
            return null;
        }
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return digest.digest(token.getBytes(StandardCharsets.UTF_8));
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
