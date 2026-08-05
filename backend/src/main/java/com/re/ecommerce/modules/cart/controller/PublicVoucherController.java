package com.re.ecommerce.modules.cart.controller;

import io.swagger.v3.oas.annotations.tags.Tag;

import com.re.ecommerce.modules.cart.dto.response.CouponResponse;
import com.re.ecommerce.modules.cart.service.CouponService;
import com.re.ecommerce.modules.auth.entity.User;
import com.re.ecommerce.modules.auth.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Tag(name = "8. Public Vouchers")
@RestController
@RequestMapping("/api/v1/vouchers/public")
@RequiredArgsConstructor
@Slf4j
public class PublicVoucherController {

    private final CouponService couponService;
    private final UserRepository userRepository;

    @GetMapping("/featured")
    public ResponseEntity<List<CouponResponse>> getFeaturedVouchers() {
        UUID currentUserId = extractUserId();
        return ResponseEntity.ok(couponService.getFeaturedVouchers(currentUserId));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<CouponResponse>> getProductVouchers(@PathVariable UUID productId) {
        UUID currentUserId = extractUserId();
        return ResponseEntity.ok(couponService.getProductVouchers(productId, currentUserId));
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
}
