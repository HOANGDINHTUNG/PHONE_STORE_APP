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
        String img = "";
        
        if (p.getVariants() != null) {
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

                if (img.isEmpty() && v.getImages() != null && !v.getImages().isEmpty()) {
                    for (com.re.ecommerce.modules.catalog.entity.ProductImage pi : v.getImages()) {
                        if (pi.isPrimary()) {
                            img = pi.getImageUrl();
                            break;
                        }
                    }
                    if (img.isEmpty()) {
                        img = v.getImages().get(0).getImageUrl();
                    }
                }
            }
        }
        
        return new ProductCardResponse(
                p.getId(),
                p.getName(),
                p.getSlug(),
                p.getBrand() != null ? p.getBrand().getName() : "",
                p.getCategory() != null ? p.getCategory().getName() : "",
                img != null ? img : "", 
                min,
                max,
                available,
                saleableCount
        );
    }
}
