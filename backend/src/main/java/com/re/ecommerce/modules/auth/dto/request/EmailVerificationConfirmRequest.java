package com.re.ecommerce.modules.auth.dto.request;

import jakarta.validation.constraints.NotBlank;

public record EmailVerificationConfirmRequest(
        @NotBlank(message = "Verification token is required")
        String token
) {}
