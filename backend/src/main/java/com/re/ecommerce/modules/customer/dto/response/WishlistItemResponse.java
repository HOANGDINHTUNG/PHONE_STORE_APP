package com.re.ecommerce.modules.customer.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record WishlistItemResponse(
        UUID id,
        UUID productId,
        LocalDateTime addedAt
) {}
