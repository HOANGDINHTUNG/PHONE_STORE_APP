package com.re.ecommerce.modules.auth.dto.request;

import jakarta.validation.constraints.Size;

public record UserProfileUpdateRequest(
        @Size(max = 20, message = "Phone tracking string length can not exceed 20 characters")
        String phone,

        @Size(max = 500, message = "Avatar URL must not exceed 500 characters")
        String avatarUrl,

        @Size(min = 2, max = 150, message = "Full name must be between 2 and 150 characters")
        String fullName,

        java.time.LocalDate dateOfBirth,

        @Size(max = 20, message = "Gender must not exceed 20 characters")
        String gender
) {}
