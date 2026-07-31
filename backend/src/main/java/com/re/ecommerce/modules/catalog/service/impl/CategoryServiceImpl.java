package com.re.ecommerce.modules.catalog.service.impl;

import com.re.ecommerce.common.audit.service.AuditLogger;
import com.re.ecommerce.common.exception.BusinessConflictException;
import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.common.exception.UnprocessableEntityException;
import com.re.ecommerce.common.utils.SlugUtils;
import com.re.ecommerce.modules.catalog.dto.request.CategoryRequest;
import com.re.ecommerce.modules.catalog.dto.response.CategoryResponse;
import com.re.ecommerce.modules.catalog.entity.Category;
import com.re.ecommerce.modules.catalog.entity.CategoryStatus;
import com.re.ecommerce.modules.catalog.repository.CategoryRepository;
import com.re.ecommerce.modules.catalog.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final AuditLogger auditLogger;

    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        String slug = SlugUtils.toSlug(request.name());
        if (categoryRepository.existsBySlug(slug)) {
            auditLogger.log("CATEGORY_CREATE", "Category", null, null, request, "FAILURE");
            throw new BusinessConflictException("CATEGORY_SLUG_EXISTS", "Slug danh mục đã tồn tại: " + slug);
        }

        Category parent = null;
        if (request.parentId() != null) {
            parent = categoryRepository.findById(request.parentId())
                    .orElseThrow(() -> new ResourceNotFoundException("PARENT_CATEGORY_NOT_FOUND", "Danh mục cha không tồn tại"));
            
            if (parent.getStatus() == CategoryStatus.INACTIVE) {
                throw new UnprocessableEntityException("PARENT_INACTIVE", "Không thể gán danh mục cha đang ẩn ở trạng thái INACTIVE");
            }
        }

        Category category = new Category(
                parent,
                request.name(),
                slug,
                request.description(),
                request.status(),
                request.sortOrder()
        );

        Category saved = categoryRepository.save(category);
        CategoryResponse response = mapToResponse(saved);
        auditLogger.log("CATEGORY_CREATE", "Category", saved.getId().toString(), null, response, "SUCCESS");
        return response;
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(UUID id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CATEGORY_NOT_FOUND", "Danh mục không tồn tại"));

        String slug = SlugUtils.toSlug(request.name());
        if (categoryRepository.existsBySlugAndIdNot(slug, id)) {
            auditLogger.log("CATEGORY_UPDATE", "Category", id.toString(), mapToResponse(category), request, "FAILURE");
            throw new BusinessConflictException("CATEGORY_SLUG_EXISTS", "Slug danh mục đã tồn tại: " + slug);
        }

        CategoryResponse oldState = mapToResponse(category);

        Category parent = null;
        if (request.parentId() != null) {
            if (request.parentId().equals(id)) {
                throw new UnprocessableEntityException("CATEGORY_CYCLE_DETECTED", "Danh mục không thể làm cha của chính nó");
            }

            // Cycle detection: traverse parent chain up to root
            Category targetParent = categoryRepository.findById(request.parentId())
                    .orElseThrow(() -> new ResourceNotFoundException("PARENT_CATEGORY_NOT_FOUND", "Danh mục cha không tồn tại"));
            
            if (targetParent.getStatus() == CategoryStatus.INACTIVE) {
                throw new UnprocessableEntityException("PARENT_INACTIVE", "Không thể gán danh mục cha đang ẩn ở trạng thái INACTIVE");
            }

            Category currentAncestor = targetParent;
            while (currentAncestor != null) {
                if (currentAncestor.getId().equals(id)) {
                    throw new UnprocessableEntityException("CATEGORY_CYCLE_DETECTED", "Phát hiện vòng lặp phân cấp danh mục (danh mục cha được gán là con cháu của danh mục hiện tại)");
                }
                currentAncestor = currentAncestor.getParent();
            }
            parent = targetParent;
        }

        category.setName(request.name());
        category.setSlug(slug);
        category.setParent(parent);
        category.setDescription(request.description());
        category.setSortOrder(request.sortOrder());
        
        Category saved = categoryRepository.save(category);
        CategoryResponse response = mapToResponse(saved);
        auditLogger.log("CATEGORY_UPDATE", "Category", saved.getId().toString(), oldState, response, "SUCCESS");
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CATEGORY_NOT_FOUND", "Danh mục không tồn tại"));
        return mapToResponse(category);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getActiveCategoryTree() {
        List<Category> allActiveCategories = categoryRepository.findByStatus(CategoryStatus.ACTIVE);
        
        Map<UUID, List<Category>> childrenMap = allActiveCategories.stream()
                .filter(c -> c.getParent() != null)
                .collect(Collectors.groupingBy(c -> c.getParent().getId()));

        return allActiveCategories.stream()
                .filter(c -> c.getParent() == null)
                .map(root -> buildCategoryResponseTree(root, childrenMap, new HashSet<>()))
                .sorted(Comparator.comparingInt(CategoryResponse::sortOrder))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> adminListCategories(CategoryStatus status, String keyword) {
        List<Category> all = categoryRepository.findAll();
        return all.stream()
                .filter(c -> status == null || c.getStatus() == status)
                .filter(c -> keyword == null || keyword.trim().isEmpty() || 
                        c.getName().toLowerCase().contains(keyword.toLowerCase()) || 
                        (c.getDescription() != null && c.getDescription().toLowerCase().contains(keyword.toLowerCase())))
                .map(this::mapToResponse)
                .sorted(Comparator.comparing(CategoryResponse::createdAt).reversed())
                .toList();
    }

    @Override
    @Transactional
    public CategoryResponse changeCategoryStatus(UUID id, CategoryStatus status) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CATEGORY_NOT_FOUND", "Danh mục không tồn tại"));

        if (category.getStatus() == status) {
            return mapToResponse(category);
        }

        CategoryResponse oldState = mapToResponse(category);

        if (status == CategoryStatus.INACTIVE) {
            // Check if there are active subcategories
            boolean hasActiveChildren = categoryRepository.existsByParentIdAndStatus(id, CategoryStatus.ACTIVE);
            if (hasActiveChildren) {
                auditLogger.log("CATEGORY_STATUS_CHANGE", "Category", id.toString(), oldState, status, "FAILURE");
                throw new BusinessConflictException("CATEGORY_IN_USE", "Không thể ẩn danh mục hiện tại do có chứa danh mục con vẫn đang hoạt động");
            }
        } else {
            // If activating, parent (if exists) must be ACTIVE
            if (category.getParent() != null && category.getParent().getStatus() == CategoryStatus.INACTIVE) {
                auditLogger.log("CATEGORY_STATUS_CHANGE", "Category", id.toString(), oldState, status, "FAILURE");
                throw new BusinessConflictException("PARENT_INACTIVE", "Không thể kích hoạt danh mục hiện tại do danh mục cha đang bị ẩn");
            }
        }

        category.setStatus(status);
        Category saved = categoryRepository.save(category);
        CategoryResponse response = mapToResponse(saved);
        auditLogger.log("CATEGORY_STATUS_CHANGE", "Category", saved.getId().toString(), oldState, response, "SUCCESS");
        
        return response;
    }

    private CategoryResponse mapToResponse(Category category) {
        if (category == null) return null;
        UUID parentId = category.getParent() != null ? category.getParent().getId() : null;
        return new CategoryResponse(
                category.getId(),
                parentId,
                category.getName(),
                category.getSlug(),
                category.getDescription(),
                category.getStatus(),
                category.getSortOrder(),
                new ArrayList<>(), // Do not populate subcategories tree in flat mapper
                category.getCreatedAt(),
                category.getUpdatedAt()
        );
    }

    private CategoryResponse buildCategoryResponseTree(Category category, Map<UUID, List<Category>> childrenMap, Set<UUID> visited) {
        if (category == null) return null;
        UUID parentId = category.getParent() != null ? category.getParent().getId() : null;

        if (visited.contains(category.getId())) {
             log.warn("Detect infinite parent loop in Category tree for ID: {}", category.getId());
             return new CategoryResponse(
                    category.getId(), parentId, category.getName(), category.getSlug(), category.getDescription(), 
                    category.getStatus(), category.getSortOrder(), new ArrayList<>(), category.getCreatedAt(), category.getUpdatedAt()
             );
        }
        visited.add(category.getId());
        
        List<Category> childrenNodes = childrenMap.getOrDefault(category.getId(), new ArrayList<>());
        List<CategoryResponse> childrenResp = childrenNodes.stream()
            .map(child -> buildCategoryResponseTree(child, childrenMap, new HashSet<>(visited)))
            .sorted(Comparator.comparingInt(CategoryResponse::sortOrder))
            .toList();

        return new CategoryResponse(
                category.getId(), parentId, category.getName(), category.getSlug(), category.getDescription(), 
                category.getStatus(), category.getSortOrder(), childrenResp, category.getCreatedAt(), category.getUpdatedAt()
        );
    }
}
