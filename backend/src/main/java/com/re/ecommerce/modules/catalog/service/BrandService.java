package com.re.ecommerce.modules.catalog.service;

import com.re.ecommerce.modules.catalog.dto.request.BrandRequest;
import com.re.ecommerce.modules.catalog.dto.response.BrandResponse;
import com.re.ecommerce.modules.catalog.entity.BrandStatus;

import java.util.List;
import java.util.UUID;

public interface BrandService {
    List<BrandResponse> listPublicBrands(String keyword);
    List<BrandResponse> adminListBrands(String keyword, BrandStatus status);
    BrandResponse createBrand(BrandRequest request);
    BrandResponse updateBrand(UUID id, BrandRequest request);
    BrandResponse changeBrandStatus(UUID id, BrandStatus status);
}
