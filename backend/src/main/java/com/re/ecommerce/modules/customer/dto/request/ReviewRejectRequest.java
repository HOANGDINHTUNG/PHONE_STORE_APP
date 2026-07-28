package com.re.ecommerce.modules.customer.dto.request;

import jakarta.validation.constraints.NotBlank;

public record ReviewRejectRequest(
        @NotBlank(message = "Rejection reason is required")
        String rejectionReason
) {}
