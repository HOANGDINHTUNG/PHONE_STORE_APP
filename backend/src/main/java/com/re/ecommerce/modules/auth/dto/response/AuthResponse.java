package com.re.ecommerce.modules.auth.dto.response;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        String username,
        String role
) {
    public AuthResponse(String accessToken, String refreshToken, String username, String role) {
        this(accessToken, refreshToken, "Bearer", username, role);
    }
}
