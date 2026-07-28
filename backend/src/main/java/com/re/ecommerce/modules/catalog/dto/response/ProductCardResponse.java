package com.re.ecommerce.modules.catalog.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

public record ProductCardResponse(
        UUID id,
        String name,
        String slug,
        String brandName,
        String categoryName,
        String primaryImageUrl,
        BigDecimal effectiveMinPrice,
        BigDecimal effectiveMaxPrice,
        boolean isAvailable,
        long saleableVariantCount
) {
    public static ProductCardResponse fromProduct(com.re.ecommerce.modules.catalog.entity.Product p) {
        BigDecimal min = null;
        BigDecimal max = null;
        boolean available = false;
        long saleableCount = 0;
        
        for (com.re.ecommerce.modules.catalog.entity.ProductVariant v : p.getVariants()) {
            if (v.getStatus() == com.re.ecommerce.modules.catalog.entity.VariantStatus.ACTIVE) {
                available = true;
                saleableCount++;
            }
            BigDecimal pPrice = v.getSalePrice() != null ? v.getSalePrice() : v.getListPrice();
            if (pPrice != null) {
                if (min == null || pPrice.compareTo(min) < 0) min = pPrice;
                if (max == null || pPrice.compareTo(max) > 0) max = pPrice;
            }
        }
        
        // Use an empty string for primary image as it's not directly in Product entity
        return new ProductCardResponse(
                p.getId(),
                p.getName(),
                p.getSlug(),
                p.getBrand().getName(),
                p.getCategory().getName(),
                "", 
                min,
                max,
                available,
                saleableCount
        );
    }
}
