package com.re.ecommerce.modules.catalog.service.impl;

import com.re.ecommerce.common.exception.UnprocessableEntityException;
import com.re.ecommerce.modules.catalog.dto.response.ProductCardResponse;
import com.re.ecommerce.modules.catalog.dto.response.SearchSuggestionResponse;
import com.re.ecommerce.modules.catalog.entity.Product;
import com.re.ecommerce.modules.catalog.entity.ProductVariant;
import com.re.ecommerce.modules.catalog.entity.PublicationStatus;
import com.re.ecommerce.modules.catalog.entity.VariantStatus;
import com.re.ecommerce.modules.catalog.repository.BrandRepository;
import com.re.ecommerce.modules.catalog.repository.CategoryRepository;
import com.re.ecommerce.modules.catalog.repository.ProductRepository;
import com.re.ecommerce.modules.catalog.service.CatalogService;
import com.re.ecommerce.modules.inventory.repository.WarehouseInventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CatalogServiceImpl implements CatalogService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final WarehouseInventoryRepository warehouseInventoryRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ProductCardResponse> getTrendingProducts(UUID categoryId, UUID brandId, Integer limit) {
        int maxLimit = limit != null ? Math.min(limit, 20) : 10;
        
        List<Product> allActive = productRepository.findAllByFilters(PublicationStatus.ACTIVE, null);
        
        return allActive.stream()
                .filter(p -> categoryId == null || p.getCategory().getId().equals(categoryId))
                .filter(p -> brandId == null || p.getBrand().getId().equals(brandId))
                .filter(p -> p.getDeletedAt() == null)
                .map(this::mapToCardResponse)
                .filter(c -> c != null)
                .sorted((a, b) -> b.id().compareTo(a.id())) 
                .limit(maxLimit)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SearchSuggestionResponse> getSearchSuggestions(String query, Integer limit) {
        if (query == null || query.trim().length() < 2) {
            throw new UnprocessableEntityException("QUERY_TOO_SHORT", "Search query is too short");
        }
        
        int maxLimit = limit != null ? Math.min(limit, 10) : 5;
        String term = query.trim().toLowerCase();
        
        List<SearchSuggestionResponse> suggestions = new ArrayList<>();
        
        categoryRepository.findAll().stream()
                .filter(c -> c.getName().toLowerCase().contains(term) || c.getSlug().contains(term))
                .limit(3)
                .forEach(c -> suggestions.add(new SearchSuggestionResponse(c.getId(), "CATEGORY", c.getName(), c.getSlug())));
                
        brandRepository.findAll().stream()
                .filter(b -> b.getName().toLowerCase().contains(term) || b.getSlug().contains(term))
                .limit(3)
                .forEach(b -> suggestions.add(new SearchSuggestionResponse(b.getId(), "BRAND", b.getName(), b.getSlug())));
                
        productRepository.findAllByFilters(PublicationStatus.ACTIVE, term).stream()
                .filter(p -> p.getDeletedAt() == null)
                .limit(maxLimit)
                .forEach(p -> suggestions.add(new SearchSuggestionResponse(p.getId(), "PRODUCT", p.getName(), p.getSlug())));
                
        return suggestions;
    }
    
    private ProductCardResponse mapToCardResponse(Product p) {
        ProductVariant defaultVariant = p.getVariants().stream()
                .filter(v -> v.getStatus() == VariantStatus.ACTIVE)
                .findFirst().orElse(null);
        if (defaultVariant == null) return null;
        List<UUID> variantIds = p.getVariants().stream().map(ProductVariant::getId).toList();
        Map<UUID, Integer> stock = warehouseInventoryRepository.sumAvailableQuantityByVariantIds(variantIds).stream()
                .collect(Collectors.toMap(WarehouseInventoryRepository.VariantAvailableStock::getVariantId,
                        row -> Math.max(0, row.getAvailableQuantity().intValue())));
        return ProductCardResponse.fromProduct(p, stock);
    }
}
