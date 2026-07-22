package com.re.ecommerce.modules.catalog.service;

import com.re.ecommerce.modules.catalog.dto.request.*;
import com.re.ecommerce.modules.catalog.dto.response.*;
import com.re.ecommerce.modules.catalog.entity.VariantStatus;

import java.util.UUID;

public interface ProductVariantService {
    VariantResponse createVariant(UUID productId, VariantCreateRequest request);
    VariantResponse updateVariant(UUID variantId, VariantUpdateRequest request, long ifMatchVersion);
    VariantResponse changeVariantStatus(UUID variantId, VariantStatus status);
    VariantResponse changePrice(UUID variantId, PriceChangeRequest request);
    ImageResponse addImage(UUID variantId, ImageCreateRequest request);
    ImageResponse setPrimaryImage(UUID variantId, UUID imageId);
    void deleteImage(UUID variantId, UUID imageId);
}
