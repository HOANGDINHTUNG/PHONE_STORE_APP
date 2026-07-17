package com.re.ecommerce.modules.auth.dto.request;

import jakarta.validation.constraints.Size;

public record UserProfileUpdateRequest(
        @Size(max = 20, message = "Phone tracking string length can not exceed 20 characters")
        String phone,

        @Size(max = 500, message = "Avatar URL must not exceed 500 characters")
        String avatarUrl
) {}
