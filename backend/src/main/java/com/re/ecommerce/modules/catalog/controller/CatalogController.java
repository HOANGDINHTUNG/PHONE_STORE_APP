package com.re.ecommerce.modules.catalog.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import com.re.ecommerce.modules.catalog.dto.response.ProductCardResponse;
import com.re.ecommerce.modules.catalog.dto.response.SearchSuggestionResponse;
import com.re.ecommerce.modules.catalog.service.CatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Tag(name = "6. Catalog Management")
@RestController
@RequestMapping("/api/v1/catalog")
@RequiredArgsConstructor
public class CatalogController {

    private final CatalogService catalogService;

    @GetMapping("/trending-products")
    public ResponseEntity<List<ProductCardResponse>> getTrendingProducts(
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) UUID brandId,
            @RequestParam(required = false) Integer limit) {
        return ResponseEntity.ok(catalogService.getTrendingProducts(categoryId, brandId, limit));
    }

    @GetMapping("/search-suggestions")
    public ResponseEntity<List<SearchSuggestionResponse>> getSearchSuggestions(
            @RequestParam String q,
            @RequestParam(required = false) Integer limit) {
        return ResponseEntity.ok(catalogService.getSearchSuggestions(q, limit));
    }
}
