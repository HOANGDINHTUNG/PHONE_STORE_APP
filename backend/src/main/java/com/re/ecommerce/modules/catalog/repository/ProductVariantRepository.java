package com.re.ecommerce.modules.catalog.repository;

import com.re.ecommerce.modules.catalog.entity.ProductVariant;
import com.re.ecommerce.modules.catalog.entity.VariantStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, UUID> {

    boolean existsBySku(String sku);

    boolean existsBySkuAndIdNot(String sku, UUID id);

    List<ProductVariant> findByProductIdAndStatus(UUID productId, VariantStatus status);

    List<ProductVariant> findByProductId(UUID productId);

    boolean existsByProductIdAndStatus(UUID productId, VariantStatus status);

    long countByProductId(UUID productId);
}
