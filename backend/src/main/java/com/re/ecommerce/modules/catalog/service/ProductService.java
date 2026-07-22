package com.re.ecommerce.modules.catalog.service;

import com.re.ecommerce.modules.catalog.dto.request.*;
import com.re.ecommerce.modules.catalog.dto.response.*;
import com.re.ecommerce.modules.catalog.entity.PublicationStatus;

import java.util.List;
import java.util.UUID;

public interface ProductService {
    List<ProductPublicResponse> searchProducts(String keyword, UUID categoryId, UUID brandId);
    ProductPublicResponse getProductBySlug(String slug);
    List<ProductAdminResponse> adminListProducts(String keyword, PublicationStatus status, UUID categoryId, UUID brandId);
    ProductAdminResponse createProduct(ProductCreateRequest request);
    ProductAdminResponse getProductAdminDetail(UUID id);
    ProductAdminResponse updateProduct(UUID id, ProductUpdateRequest request);
    ProductAdminResponse changeProductStatus(UUID id, PublicationStatus status);
    List<SpecificationResponse> replaceSpecifications(UUID productId, SpecificationRequest request);
    List<AttributeResponse> replaceAttributes(UUID productId, AttributeRequest request);
}
