package com.re.ecommerce.modules.catalog.repository;

import com.re.ecommerce.modules.catalog.entity.RelatedProduct;
import com.re.ecommerce.modules.catalog.entity.RelatedProductId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RelatedProductRepository extends JpaRepository<RelatedProduct, RelatedProductId> {

    List<RelatedProduct> findBySourceProduct_SlugOrderBySortOrderAsc(String slug);
    List<RelatedProduct> findBySourceProduct_IdOrderBySortOrderAsc(UUID sourceProductId);

    @Modifying
    @Query("DELETE FROM RelatedProduct r WHERE r.sourceProduct.id = :sourceProductId")
    void deleteBySourceProductId(UUID sourceProductId);
}
