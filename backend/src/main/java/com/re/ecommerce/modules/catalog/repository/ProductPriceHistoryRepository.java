package com.re.ecommerce.modules.catalog.repository;

import com.re.ecommerce.modules.catalog.entity.ProductPriceHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductPriceHistoryRepository extends JpaRepository<ProductPriceHistory, UUID> {

    org.springframework.data.domain.Page<ProductPriceHistory> findByVariantIdOrderByCreatedAtDesc(UUID variantId, org.springframework.data.domain.Pageable pageable);
}
