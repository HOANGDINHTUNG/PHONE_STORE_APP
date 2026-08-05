package com.re.ecommerce.modules.content.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record BannerRequest(
        @NotBlank(message = "Banner title is required")
        @Size(max = 255, message = "Banner title must not exceed 255 characters")
        String title,

        @Size(max = 100, message = "Banner label must not exceed 100 characters")
        String label,

        @Size(max = 500, message = "Banner subtitle must not exceed 500 characters")
        String subtitle,

        @NotBlank(message = "Banner image URL is required")
        @Size(max = 500, message = "Banner image URL must not exceed 500 characters")
        String imageUrl,

        @Size(max = 500, message = "Banner link URL must not exceed 500 characters")
        String linkUrl,

        @Size(max = 50, message = "Banner position must not exceed 50 characters")
        String position,

        @Size(max = 100, message = "Banner background color must not exceed 100 characters")
        String bgColor,

        @Size(max = 50, message = "Banner text color must not exceed 50 characters")
        String textColor,

        @NotNull(message = "Sort order is required")
        Integer sortOrder,

        @Size(max = 50, message = "Banner status must not exceed 50 characters")
        String status
) {}
