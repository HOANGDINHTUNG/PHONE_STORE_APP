package com.re.ecommerce.modules.catalog.repository;

import com.re.ecommerce.modules.catalog.entity.Category;
import com.re.ecommerce.modules.catalog.entity.CategoryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {
    
    boolean existsBySlug(String slug);
    
    boolean existsBySlugAndIdNot(String slug, UUID id);
    
    List<Category> findByParentIsNull();
    
    @Query("SELECT c FROM Category c WHERE c.parent IS NULL AND c.status = :status")
    List<Category> findRootCategoriesByStatus(@Param("status") CategoryStatus status);
    
    boolean existsByParentIdAndStatus(UUID parentId, CategoryStatus status);
    
    List<Category> findByStatus(CategoryStatus status);
}
