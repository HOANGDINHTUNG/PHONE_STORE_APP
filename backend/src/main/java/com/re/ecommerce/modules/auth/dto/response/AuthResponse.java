package com.re.ecommerce.modules.auth.dto.response;

public record AuthResponse(
        String accessToken,
        String tokenType,
        String username,
        String role
) {
    public AuthResponse(String accessToken, String username, String role) {
        this(accessToken, "Bearer", username, role);
    }
}
