package com.re.ecommerce.modules.catalog.repository;

import com.re.ecommerce.modules.catalog.entity.ProductAttribute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductAttributeRepository extends JpaRepository<ProductAttribute, UUID> {

    List<ProductAttribute> findByProductId(UUID productId);

    void deleteAllByProductId(UUID productId);
}
