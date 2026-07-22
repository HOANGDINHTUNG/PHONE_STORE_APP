package com.re.ecommerce.modules.order.dto.response;

import lombok.Builder;
import java.math.BigDecimal;
import java.util.UUID;

@Builder
public record OrderItemResponse(
        UUID id,
        UUID productId,
        UUID productVariantId,
        String productName,
        String variantName,
        String sku,
        String color,
        String ram,
        String storage,
        String imageUrl,
        Integer warrantyMonths,
        
        BigDecimal unitPrice,
        Integer quantity,
        BigDecimal discountAmount,
        BigDecimal lineTotal
) {
}
