package com.re.ecommerce.modules.catalog.repository;

import com.re.ecommerce.modules.catalog.entity.Product;
import com.re.ecommerce.modules.catalog.entity.PublicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, UUID id);

    Optional<Product> findBySlugAndPublicationStatusAndDeletedAtIsNull(String slug, PublicationStatus status);

    @Query("SELECT p FROM Product p WHERE p.deletedAt IS NULL AND " +
           "(:status IS NULL OR p.publicationStatus = :status) AND " +
           "(:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    java.util.List<Product> findAllByFilters(
            @Param("status") PublicationStatus status,
            @Param("keyword") String keyword);

    boolean existsByCategoryIdAndPublicationStatus(UUID categoryId, PublicationStatus status);

    boolean existsByBrandIdAndPublicationStatus(UUID brandId, PublicationStatus status);
}
