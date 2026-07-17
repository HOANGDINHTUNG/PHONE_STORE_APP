package com.re.ecommerce.modules.auth.service;

import com.re.ecommerce.modules.auth.dto.request.*;
import com.re.ecommerce.modules.auth.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request, String ipAddress, String userAgent);
    AuthResponse refreshToken(TokenRefreshRequest request, String ipAddress, String userAgent);
    void logout(LogoutRequest request);
    void confirmEmail(EmailVerificationConfirmRequest request);
    void resendVerificationEmail(EmailVerificationRequest request);
    void requestPasswordReset(PasswordResetRequest request, String ipAddress);
    void confirmPasswordReset(PasswordResetConfirmRequest request);
}
