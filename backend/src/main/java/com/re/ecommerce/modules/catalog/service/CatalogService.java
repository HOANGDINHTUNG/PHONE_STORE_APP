package com.re.ecommerce.modules.catalog.service;

import com.re.ecommerce.modules.catalog.dto.response.ProductCardResponse;
import com.re.ecommerce.modules.catalog.dto.response.SearchSuggestionResponse;
import java.util.List;
import java.util.UUID;

public interface CatalogService {
    List<ProductCardResponse> getTrendingProducts(UUID categoryId, UUID brandId, Integer limit);
    List<SearchSuggestionResponse> getSearchSuggestions(String query, Integer limit);
}
