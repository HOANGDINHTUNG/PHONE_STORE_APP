package com.re.ecommerce.modules.auth.dto.request;

public record UserUpdateAdminRequest(
        String fullName,
        String phone,
        String avatarUrl
) {}
