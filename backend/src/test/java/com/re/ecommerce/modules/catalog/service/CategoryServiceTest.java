package com.re.ecommerce.modules.catalog.service;

import com.re.ecommerce.common.audit.service.AuditLogger;
import com.re.ecommerce.common.exception.BusinessConflictException;
import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.common.exception.UnprocessableEntityException;
import com.re.ecommerce.modules.catalog.dto.request.CategoryRequest;
import com.re.ecommerce.modules.catalog.dto.response.CategoryResponse;
import com.re.ecommerce.modules.catalog.entity.Category;
import com.re.ecommerce.modules.catalog.entity.CategoryStatus;
import com.re.ecommerce.modules.catalog.repository.CategoryRepository;
import com.re.ecommerce.modules.catalog.service.impl.CategoryServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private AuditLogger auditLogger;

    @InjectMocks
    private CategoryServiceImpl categoryService;

    private UUID cat1Id, cat2Id, cat3Id;
    private Category activeCategory;
    private Category inactiveCategory;
    private Category childCategory;

    @BeforeEach
    void setUp() {
        cat1Id = UUID.randomUUID();
        cat2Id = UUID.randomUUID();
        cat3Id = UUID.randomUUID();

        activeCategory = new Category(null, "Electronics", "electronics", "Desc", CategoryStatus.ACTIVE, 1);
        ReflectionTestUtils.setField(activeCategory, "id", cat1Id);
        ReflectionTestUtils.setField(activeCategory, "createdAt", java.time.LocalDateTime.now());

        inactiveCategory = new Category(null, "Archived", "arch", "Desc", CategoryStatus.INACTIVE, 2);
        ReflectionTestUtils.setField(inactiveCategory, "id", cat2Id);
        ReflectionTestUtils.setField(inactiveCategory, "createdAt", java.time.LocalDateTime.now());

        childCategory = new Category(activeCategory, "Phones", "phones", "Desc", CategoryStatus.ACTIVE, 1);
        ReflectionTestUtils.setField(childCategory, "id", cat3Id);
        ReflectionTestUtils.setField(childCategory, "createdAt", java.time.LocalDateTime.now());
    }

    @Test
    void createCategory_shouldThrow_whenSlugExists() {
        when(categoryRepository.existsBySlug(anyString())).thenReturn(true);
        CategoryRequest req = new CategoryRequest("Electronics", null, "Desc", CategoryStatus.ACTIVE, 1);

        BusinessConflictException ex = assertThrows(BusinessConflictException.class, () -> 
            categoryService.createCategory(req)
        );
        assertThat(ex.getErrorCode()).isEqualTo("CATEGORY_SLUG_EXISTS");
    }

    @Test
    void createCategory_shouldThrow_whenParentIsInactive() {
        when(categoryRepository.existsBySlug(anyString())).thenReturn(false);
        when(categoryRepository.findById(cat2Id)).thenReturn(Optional.of(inactiveCategory));
        CategoryRequest req = new CategoryRequest("New Cat", cat2Id, "Desc", CategoryStatus.ACTIVE, 1);

        UnprocessableEntityException ex = assertThrows(UnprocessableEntityException.class, () -> 
            categoryService.createCategory(req)
        );
        assertThat(ex.getErrorCode()).isEqualTo("PARENT_INACTIVE");
    }

    @Test
    void updateCategory_shouldThrow_whenSelfParenting() {
        when(categoryRepository.findById(cat1Id)).thenReturn(Optional.of(activeCategory));
        CategoryRequest req = new CategoryRequest("Electronics", cat1Id, "Desc", CategoryStatus.ACTIVE, 1);

        UnprocessableEntityException ex = assertThrows(UnprocessableEntityException.class, () -> 
            categoryService.updateCategory(cat1Id, req)
        );
        assertThat(ex.getErrorCode()).isEqualTo("CATEGORY_CYCLE_DETECTED");
    }

    @Test
    void updateCategory_shouldThrow_whenCycleDetected() {
        when(categoryRepository.findById(cat1Id)).thenReturn(Optional.of(activeCategory));
        // Cat1 -> Cat3, meaning Cat3's parent is Cat1.
        // We are updating Cat1 to set its parent to Cat3! Cycle!
        when(categoryRepository.findById(cat3Id)).thenReturn(Optional.of(childCategory));

        CategoryRequest req = new CategoryRequest("Electronics", cat3Id, "Desc", CategoryStatus.ACTIVE, 1);

        UnprocessableEntityException ex = assertThrows(UnprocessableEntityException.class, () -> 
            categoryService.updateCategory(cat1Id, req)
        );
        assertThat(ex.getErrorCode()).isEqualTo("CATEGORY_CYCLE_DETECTED");
    }

    @Test
    void changeCategoryStatus_shouldThrow_whenArchivingWithActiveChildren() {
        when(categoryRepository.findById(cat1Id)).thenReturn(Optional.of(activeCategory));
        when(categoryRepository.existsByParentIdAndStatus(cat1Id, CategoryStatus.ACTIVE)).thenReturn(true);

        BusinessConflictException ex = assertThrows(BusinessConflictException.class, () -> 
            categoryService.changeCategoryStatus(cat1Id, CategoryStatus.INACTIVE)
        );
        assertThat(ex.getErrorCode()).isEqualTo("CATEGORY_IN_USE");
    }

    @Test
    void changeCategoryStatus_shouldThrow_whenActivatingWithInactiveParent() {
        childCategory.setParent(inactiveCategory);
        childCategory.setStatus(CategoryStatus.INACTIVE);
        when(categoryRepository.findById(cat3Id)).thenReturn(Optional.of(childCategory));

        BusinessConflictException ex = assertThrows(BusinessConflictException.class, () -> 
            categoryService.changeCategoryStatus(cat3Id, CategoryStatus.ACTIVE)
        );
        assertThat(ex.getErrorCode()).isEqualTo("PARENT_INACTIVE");
    }

    @Test
    void getActiveCategoryTree_shouldPreventInfiniteLoop() {
        Category root1 = new Category(null, "Root 1", "root-1", null, CategoryStatus.ACTIVE, 1);
        UUID rootId = UUID.randomUUID();
        ReflectionTestUtils.setField(root1, "id", rootId);
        
        Category aliasCat = new Category(root1, "Alias", "alias", null, CategoryStatus.ACTIVE, 1);
        // By giving it the exact SAME id but making it a child of root1,
        // we simulate a cycle where the algorithm revisits the same UUID.
        ReflectionTestUtils.setField(aliasCat, "id", rootId);
        
        when(categoryRepository.findByStatus(CategoryStatus.ACTIVE)).thenReturn(List.of(root1, aliasCat));
        
        List<CategoryResponse> responses = categoryService.getActiveCategoryTree();
        
        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).subCategories()).hasSize(1); // root1 -> aliasCat
        assertThat(responses.get(0).subCategories().get(0).subCategories()).isEmpty(); // aliasCat detects cycle and stops
    }

    @Test
    void createCategory_shouldSucceed() {
        when(categoryRepository.existsBySlug(anyString())).thenReturn(false);
        when(categoryRepository.findById(cat1Id)).thenReturn(Optional.of(activeCategory));
        
        CategoryRequest req = new CategoryRequest("New Phone", cat1Id, "Nice", CategoryStatus.ACTIVE, 3);
        
        when(categoryRepository.save(org.mockito.ArgumentMatchers.any(Category.class))).thenAnswer(i -> {
            Category cat = i.getArgument(0);
            ReflectionTestUtils.setField(cat, "id", UUID.randomUUID());
            return cat;
        });

        CategoryResponse resp = categoryService.createCategory(req);
        assertThat(resp.name()).isEqualTo("New Phone");
        verify(auditLogger).log(org.mockito.ArgumentMatchers.eq("CATEGORY_CREATE"), org.mockito.ArgumentMatchers.anyString(), org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.eq("SUCCESS"));
    }

    @Test
    void createCategory_shouldThrow_whenParentNotFound() {
        when(categoryRepository.existsBySlug(anyString())).thenReturn(false);
        when(categoryRepository.findById(cat1Id)).thenReturn(Optional.empty());
        CategoryRequest req = new CategoryRequest("New Phone", cat1Id, "Nice", CategoryStatus.ACTIVE, 3);

        ResourceNotFoundException ex = assertThrows(ResourceNotFoundException.class, () -> 
            categoryService.createCategory(req)
        );
        assertThat(ex.getErrorCode()).isEqualTo("PARENT_CATEGORY_NOT_FOUND");
    }

    @Test
    void updateCategory_shouldSucceed() {
        when(categoryRepository.findById(cat1Id)).thenReturn(Optional.of(activeCategory));
        when(categoryRepository.existsBySlugAndIdNot(anyString(), org.mockito.ArgumentMatchers.eq(cat1Id))).thenReturn(false);
        
        Category parent = new Category(null, "GoodParent", "good", null, CategoryStatus.ACTIVE, 1);
        ReflectionTestUtils.setField(parent, "id", cat3Id);
        when(categoryRepository.findById(cat3Id)).thenReturn(Optional.of(parent));

        CategoryRequest req = new CategoryRequest("Updated Cat", cat3Id, "Desc", CategoryStatus.ACTIVE, 1);
        when(categoryRepository.save(org.mockito.ArgumentMatchers.any(Category.class))).thenReturn(activeCategory);

        CategoryResponse resp = categoryService.updateCategory(cat1Id, req);
        assertThat(resp).isNotNull();
    }

    @Test
    void updateCategory_shouldThrow_whenCategoryNotFound() {
        when(categoryRepository.findById(cat1Id)).thenReturn(Optional.empty());
        CategoryRequest req = new CategoryRequest("Updated Cat", cat3Id, "Desc", CategoryStatus.ACTIVE, 1);

        ResourceNotFoundException ex = assertThrows(ResourceNotFoundException.class, () -> 
            categoryService.updateCategory(cat1Id, req)
        );
        assertThat(ex.getErrorCode()).isEqualTo("CATEGORY_NOT_FOUND");
    }

    @Test
    void updateCategory_shouldThrow_whenSlugExistsForOther() {
        when(categoryRepository.findById(cat1Id)).thenReturn(Optional.of(activeCategory));
        when(categoryRepository.existsBySlugAndIdNot(anyString(), org.mockito.ArgumentMatchers.eq(cat1Id))).thenReturn(true);
        CategoryRequest req = new CategoryRequest("Exist Slug", cat3Id, "Desc", CategoryStatus.ACTIVE, 1);

        BusinessConflictException ex = assertThrows(BusinessConflictException.class, () -> 
            categoryService.updateCategory(cat1Id, req)
        );
        assertThat(ex.getErrorCode()).isEqualTo("CATEGORY_SLUG_EXISTS");
    }

    @Test
    void getCategoryById_shouldSucceed() {
        when(categoryRepository.findById(cat1Id)).thenReturn(Optional.of(activeCategory));
        CategoryResponse resp = categoryService.getCategoryById(cat1Id);
        assertThat(resp.id()).isEqualTo(cat1Id);
    }
    
    @Test
    void getCategoryById_shouldThrow_whenNotFound() {
        when(categoryRepository.findById(cat1Id)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> categoryService.getCategoryById(cat1Id));
    }

    @Test
    void adminListCategories_shouldReturnFilteredList() {
        when(categoryRepository.findAll()).thenReturn(List.of(activeCategory, inactiveCategory, childCategory));
        
        List<CategoryResponse> activeList = categoryService.adminListCategories(CategoryStatus.ACTIVE, null);
        assertThat(activeList).hasSize(2);
        
        List<CategoryResponse> filteredList = categoryService.adminListCategories(null, "Archived");
        assertThat(filteredList).hasSize(1);
        assertThat(filteredList.get(0).id()).isEqualTo(cat2Id);
    }

    @Test
    void changeCategoryStatus_shouldSucceed() {
        when(categoryRepository.findById(cat1Id)).thenReturn(Optional.of(activeCategory));
        when(categoryRepository.existsByParentIdAndStatus(cat1Id, CategoryStatus.ACTIVE)).thenReturn(false);
        when(categoryRepository.save(org.mockito.ArgumentMatchers.any(Category.class))).thenReturn(activeCategory);

        CategoryResponse resp = categoryService.changeCategoryStatus(cat1Id, CategoryStatus.INACTIVE);
        assertThat(resp.status()).isEqualTo(CategoryStatus.INACTIVE);
    }

    @Test
    void changeCategoryStatus_shouldReturnSameState_whenStatusUnchanged() {
        when(categoryRepository.findById(cat1Id)).thenReturn(Optional.of(activeCategory));
        CategoryResponse resp = categoryService.changeCategoryStatus(cat1Id, CategoryStatus.ACTIVE);
        assertThat(resp.status()).isEqualTo(CategoryStatus.ACTIVE);
        // Save should not be called
        verify(categoryRepository, org.mockito.Mockito.never()).save(org.mockito.ArgumentMatchers.any(Category.class));
    }

    @Test
    void changeCategoryStatus_shouldThrow_whenCategoryNotFound() {
        when(categoryRepository.findById(cat1Id)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> categoryService.changeCategoryStatus(cat1Id, CategoryStatus.INACTIVE));
    }
}
