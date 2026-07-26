package com.re.ecommerce.modules.auth.controller;

import io.swagger.v3.oas.annotations.tags.Tag;

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

@Tag(name = "1. Authentication")
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {

        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        String ipAddress = getClientIp(httpRequest);
        String userAgent = httpRequest.getHeader("User-Agent");

        AuthResponse response = authService.login(request, ipAddress, userAgent);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/token/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@Valid @RequestBody TokenRefreshRequest request, HttpServletRequest httpRequest) {
        String ipAddress = getClientIp(httpRequest);
        String userAgent = httpRequest.getHeader("User-Agent");

        AuthResponse response = authService.refreshToken(request, ipAddress, userAgent);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody LogoutRequest request) {

        authService.logout(request);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/email-verifications/confirm")
    public ResponseEntity<Void> confirmEmail(@Valid @RequestBody EmailVerificationConfirmRequest request) {

        authService.confirmEmail(request);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/email-verifications")
    public ResponseEntity<Void> resendVerificationEmail(@Valid @RequestBody EmailVerificationRequest request) {

        authService.resendVerificationEmail(request);
        return ResponseEntity.accepted().build();
    }

    @PostMapping("/password-reset-requests")
    public ResponseEntity<Void> requestPasswordReset(@Valid @RequestBody PasswordResetRequest request, HttpServletRequest httpRequest) {
        String ipAddress = getClientIp(httpRequest);

        authService.requestPasswordReset(request, ipAddress);
        return ResponseEntity.accepted().build();
    }

    @PostMapping("/password-resets/confirm")
    public ResponseEntity<Void> confirmPasswordReset(@Valid @RequestBody PasswordResetConfirmRequest request) {

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
