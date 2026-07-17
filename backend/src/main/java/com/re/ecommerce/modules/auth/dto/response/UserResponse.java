package com.re.ecommerce.modules.auth.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String username,
        String email,
        String phone,
        String avatarUrl,
        String role,
        String accountStatus,
        LocalDateTime emailVerifiedAt,
        LocalDateTime phoneVerifiedAt,
        LocalDateTime lastLoginAt,
        LocalDateTime createdAt
) {}
