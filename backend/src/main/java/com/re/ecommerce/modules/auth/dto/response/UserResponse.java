package com.re.ecommerce.modules.auth.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
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
        LocalDateTime createdAt,
        
        // Customer Profile specifics
        String customerCode,
        String fullName,
        java.time.LocalDate dateOfBirth,
        String gender,
        Boolean marketingOptIn
) {}
