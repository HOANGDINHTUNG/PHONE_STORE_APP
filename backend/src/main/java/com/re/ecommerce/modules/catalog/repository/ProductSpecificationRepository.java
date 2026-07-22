package com.re.ecommerce.modules.catalog.repository;

import com.re.ecommerce.modules.catalog.entity.ProductSpecification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductSpecificationRepository extends JpaRepository<ProductSpecification, UUID> {

    List<ProductSpecification> findByProductIdOrderBySortOrderAsc(UUID productId);

    void deleteAllByProductId(UUID productId);
}
