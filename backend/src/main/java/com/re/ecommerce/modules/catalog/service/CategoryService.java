package com.re.ecommerce.modules.catalog.service;

import com.re.ecommerce.modules.catalog.dto.request.CategoryRequest;
import com.re.ecommerce.modules.catalog.dto.response.CategoryResponse;
import com.re.ecommerce.modules.catalog.entity.CategoryStatus;

import java.util.List;
import java.util.UUID;

public interface CategoryService {
    CategoryResponse createCategory(CategoryRequest request);
    CategoryResponse updateCategory(UUID id, CategoryRequest request);
    CategoryResponse getCategoryById(UUID id);
    List<CategoryResponse> getActiveCategoryTree();
    List<CategoryResponse> adminListCategories(CategoryStatus status, String keyword);
    CategoryResponse changeCategoryStatus(UUID id, CategoryStatus status);
}
