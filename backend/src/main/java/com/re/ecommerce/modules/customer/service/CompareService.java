package com.re.ecommerce.modules.customer.service;

import com.re.ecommerce.modules.catalog.dto.response.ProductCardResponse;

import java.util.List;
import java.util.UUID;

public interface CompareService {
    List<ProductCardResponse> getMyCompareItems(String username);
    void addCompareItem(String username, UUID productId);
    void removeCompareItem(String username, UUID productId);
    void clearCompareList(String username);
}
