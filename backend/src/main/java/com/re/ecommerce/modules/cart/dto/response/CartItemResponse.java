package com.re.ecommerce.modules.cart.dto.response;

import lombok.Builder;
import java.math.BigDecimal;
import java.util.UUID;

@Builder
public record CartItemResponse(
    UUID id,
    UUID productVariantId,
    String productVariantName,
    String sku,
    String imageUrl,
    Integer quantity,
    BigDecimal unitPrice,
    BigDecimal lineTotal,
    String statusWarning
) {}
