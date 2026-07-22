package com.re.ecommerce.modules.auth.controller;

import com.re.ecommerce.modules.auth.dto.request.*;
import com.re.ecommerce.modules.auth.dto.response.AuthResponse;
import com.re.ecommerce.modules.auth.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Received registration request for email: {}", request.email());
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        String ipAddress = getClientIp(httpRequest);
        String userAgent = httpRequest.getHeader("User-Agent");
        log.info("Login attempt for user: {} from IP: {}", request.username(), ipAddress);
        AuthResponse response = authService.login(request, ipAddress, userAgent);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/token/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@Valid @RequestBody TokenRefreshRequest request, HttpServletRequest httpRequest) {
        String ipAddress = getClientIp(httpRequest);
        String userAgent = httpRequest.getHeader("User-Agent");
        log.debug("Refreshing token request from IP: {}", ipAddress);
        AuthResponse response = authService.refreshToken(request, ipAddress, userAgent);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody LogoutRequest request) {
        log.info("User requested logout. Invalidating current refresh token.");
        authService.logout(request);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/email-verifications/confirm")
    public ResponseEntity<Void> confirmEmail(@Valid @RequestBody EmailVerificationConfirmRequest request) {
        log.info("Email verification confirmation triggered with given token");
        authService.confirmEmail(request);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/email-verifications")
    public ResponseEntity<Void> resendVerificationEmail(@Valid @RequestBody EmailVerificationRequest request) {
        log.info("Resend verification email requested for: {}", request.email());
        authService.resendVerificationEmail(request);
        return ResponseEntity.accepted().build();
    }

    @PostMapping("/password-reset-requests")
    public ResponseEntity<Void> requestPasswordReset(@Valid @RequestBody PasswordResetRequest request, HttpServletRequest httpRequest) {
        String ipAddress = getClientIp(httpRequest);
        log.info("Password reset requested for email: {}", request.email());
        authService.requestPasswordReset(request, ipAddress);
        return ResponseEntity.accepted().build();
    }

    @PostMapping("/password-resets/confirm")
    public ResponseEntity<Void> confirmPasswordReset(@Valid @RequestBody PasswordResetConfirmRequest request) {
        log.info("Confirming password reset implementation securely");
        authService.confirmPasswordReset(request);
        return ResponseEntity.noContent().build();
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader != null && !xfHeader.isEmpty()) {
            return xfHeader.split(",")[0];
        }
        return request.getRemoteAddr();
    }
}
