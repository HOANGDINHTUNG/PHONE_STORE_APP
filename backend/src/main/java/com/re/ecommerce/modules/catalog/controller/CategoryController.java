package com.re.ecommerce.modules.catalog.controller;

import com.re.ecommerce.modules.catalog.dto.request.CategoryRequest;
import com.re.ecommerce.modules.catalog.dto.response.CategoryResponse;
import com.re.ecommerce.modules.catalog.entity.CategoryStatus;
import com.re.ecommerce.modules.catalog.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class CategoryController {

    private final CategoryService categoryService;

    // --- PUBLIC ENDPOINTS ---

    @GetMapping("/categories/tree")
    public ResponseEntity<List<CategoryResponse>> getActiveCategoryTree() {
        log.debug("System requested active public category navigation tree");
        return ResponseEntity.ok(categoryService.getActiveCategoryTree());
    }

    // --- ADMIN ENDPOINTS ---

    @GetMapping("/admin/categories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CategoryResponse>> adminListCategories(
            @RequestParam(required = false) CategoryStatus status,
            @RequestParam(required = false) String keyword) {
        log.debug("Admin searching capabilities in categories. Search: {}, Status: {}", keyword, status);
        return ResponseEntity.ok(categoryService.adminListCategories(status, keyword));
    }

    @PostMapping("/admin/categories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponse> createCategory(@Valid @RequestBody CategoryRequest request) {
        log.info("Admin producing a new Category structure constraint: {}", request.name());
        CategoryResponse response = categoryService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/admin/categories/{categoryId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponse> getCategoryById(@PathVariable UUID categoryId) {
        log.debug("Detail lookup on Category UUID: {}", categoryId);
        return ResponseEntity.ok(categoryService.getCategoryById(categoryId));
    }

    @PatchMapping("/admin/categories/{categoryId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponse> updateCategory(
            @PathVariable UUID categoryId,
            @Valid @RequestBody CategoryRequest request) {
        log.info("Updating existing target category UUID: {}", categoryId);
        return ResponseEntity.ok(categoryService.updateCategory(categoryId, request));
    }

    @PatchMapping("/admin/categories/{categoryId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponse> changeCategoryStatus(
            @PathVariable UUID categoryId,
            @RequestParam CategoryStatus status) {
        log.info("Adjusting category runtime status for {} to {}", categoryId, status);
        return ResponseEntity.ok(categoryService.changeCategoryStatus(categoryId, status));
    }
}
