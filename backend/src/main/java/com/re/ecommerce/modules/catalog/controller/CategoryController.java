package com.re.ecommerce.modules.catalog.controller;

import com.re.ecommerce.modules.catalog.dto.request.CategoryRequest;
import com.re.ecommerce.modules.catalog.dto.response.CategoryResponse;
import com.re.ecommerce.modules.catalog.entity.CategoryStatus;
import com.re.ecommerce.modules.catalog.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // --- PUBLIC ENDPOINTS ---

    @GetMapping("/categories/tree")
    public ResponseEntity<List<CategoryResponse>> getActiveCategoryTree() {
        return ResponseEntity.ok(categoryService.getActiveCategoryTree());
    }

    // --- ADMIN ENDPOINTS ---

    @GetMapping("/admin/categories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CategoryResponse>> adminListCategories(
            @RequestParam(required = false) CategoryStatus status,
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(categoryService.adminListCategories(status, keyword));
    }

    @PostMapping("/admin/categories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponse> createCategory(@Valid @RequestBody CategoryRequest request) {
        CategoryResponse response = categoryService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/admin/categories/{categoryId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponse> getCategoryById(@PathVariable UUID categoryId) {
        return ResponseEntity.ok(categoryService.getCategoryById(categoryId));
    }

    @PatchMapping("/admin/categories/{categoryId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponse> updateCategory(
            @PathVariable UUID categoryId,
            @Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(categoryService.updateCategory(categoryId, request));
    }

    @PatchMapping("/admin/categories/{categoryId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponse> changeCategoryStatus(
            @PathVariable UUID categoryId,
            @RequestParam CategoryStatus status) {
        return ResponseEntity.ok(categoryService.changeCategoryStatus(categoryId, status));
    }
}
