package com.re.ecommerce.modules.catalog.repository;

import com.re.ecommerce.modules.catalog.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, UUID> {

    List<ProductImage> findByVariantIdOrderBySortOrderAsc(UUID variantId);

    Optional<ProductImage> findByVariantIdAndIsPrimary(UUID variantId, boolean isPrimary);

    long countByVariantId(UUID variantId);

    @Modifying
    @Query("UPDATE ProductImage i SET i.isPrimary = false WHERE i.variant.id = :variantId")
    void clearPrimaryForVariant(@Param("variantId") UUID variantId);
}
