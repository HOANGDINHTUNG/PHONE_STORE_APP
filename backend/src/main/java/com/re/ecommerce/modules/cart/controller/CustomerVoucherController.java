package com.re.ecommerce.modules.cart.controller;

import io.swagger.v3.oas.annotations.tags.Tag;

import com.re.ecommerce.common.exception.UnprocessableEntityException;
import com.re.ecommerce.modules.auth.entity.User;
import com.re.ecommerce.modules.auth.repository.UserRepository;
import com.re.ecommerce.modules.cart.dto.response.CartResponse;
import com.re.ecommerce.modules.cart.dto.response.CouponQuoteResponse;
import com.re.ecommerce.modules.cart.dto.response.CouponResponse;
import com.re.ecommerce.modules.cart.service.CouponService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

@Tag(name = "8. Customer Vouchers & Wallet")
@RestController
@RequestMapping("/api/v1/vouchers")
@RequiredArgsConstructor
@Slf4j
public class CustomerVoucherController {

    private final CouponService couponService;
    private final UserRepository userRepository;

    @PostMapping("/{couponId}/claim")
    public ResponseEntity<CouponResponse> claimVoucher(@PathVariable UUID couponId) {
        UUID userId = requireUserId();
        return ResponseEntity.ok(couponService.claimVoucher(couponId, userId));
    }

    @GetMapping("/me")
    public ResponseEntity<Page<CouponResponse>> getMyWalletVouchers(
            @RequestParam(required = false) String status,
            Pageable pageable) {
        UUID userId = requireUserId();
        return ResponseEntity.ok(couponService.getMyWalletVouchers(userId, status, pageable));
    }

    @PostMapping("/cart/apply")
    public ResponseEntity<CartResponse> applyVoucher(
            @RequestHeader(value = "X-Guest-Token", required = false) String guestToken,
            @RequestParam String code) {
        UUID customerId = extractUserId();
        byte[] guestTokenHash = hashToken(guestToken);
        validateIdentifier(customerId, guestTokenHash);

        return ResponseEntity.ok(couponService.applyVoucherToCart(customerId, guestTokenHash, code));
    }

    @DeleteMapping("/cart/remove")
    public ResponseEntity<CartResponse> removeVoucher(
            @RequestHeader(value = "X-Guest-Token", required = false) String guestToken) {
        UUID customerId = extractUserId();
        byte[] guestTokenHash = hashToken(guestToken);
        validateIdentifier(customerId, guestTokenHash);

        return ResponseEntity.ok(couponService.removeVoucherFromCart(customerId, guestTokenHash));
    }

    @GetMapping("/{couponId}/quote")
    public ResponseEntity<CouponQuoteResponse> getQuote(
            @RequestHeader(value = "X-Guest-Token", required = false) String guestToken,
            @PathVariable UUID couponId) {
        UUID customerId = extractUserId();
        byte[] guestTokenHash = hashToken(guestToken);
        return ResponseEntity.ok(couponService.calculateVoucherQuote(couponId, customerId, guestTokenHash));
    }

    private UUID requireUserId() {
        UUID userId = extractUserId();
        if (userId == null) {
            throw new UnprocessableEntityException("UNAUTHENTICATED", "Vui lòng đăng nhập để thực hiện thao tác này");
        }
        return userId;
    }

    private UUID extractUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            return userRepository.findByUsername(auth.getName())
                    .map(User::getId)
                    .orElse(null);
        }
        return null;
    }

    private byte[] hashToken(String token) {
        if (token == null || token.isBlank()) return null;
        try {
            return MessageDigest.getInstance("SHA-256").digest(token.getBytes(StandardCharsets.UTF_8));
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 missing", e);
        }
    }

    private void validateIdentifier(UUID customerId, byte[] guestTokenHash) {
        if (customerId == null && guestTokenHash == null) {
            throw new UnprocessableEntityException("MISSING_IDENTIFIER", "Yêu cầu phiên đăng nhập hoặc X-Guest-Token");
        }
    }
}
