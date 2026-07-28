package com.re.ecommerce.modules.customer.dto.response;

import com.re.ecommerce.modules.catalog.dto.response.ProductCardResponse;
import java.time.LocalDateTime;
import java.util.UUID;

public record WishlistItemResponse(
        UUID id,
        ProductCardResponse product,
        LocalDateTime addedAt
) {}
