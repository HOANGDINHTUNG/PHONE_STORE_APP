package com.re.ecommerce.modules.content.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record NewsRequest(
        @NotBlank(message = "News title is required")
        @Size(max = 255, message = "News title must not exceed 255 characters")
        String title,

        @NotBlank(message = "News tag is required")
        @Size(max = 100, message = "News tag must not exceed 100 characters")
        String tag,

        @NotBlank(message = "News description is required")
        String description,

        String content,

        @NotBlank(message = "News image URL is required")
        @Size(max = 500, message = "News image URL must not exceed 500 characters")
        String imageUrl,

        LocalDateTime publishedAt,

        @Size(max = 50, message = "News status must not exceed 50 characters")
        String status
) {}
