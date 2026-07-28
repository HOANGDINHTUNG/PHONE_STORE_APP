package com.re.ecommerce.modules.catalog.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "related_products")
@Getter
@Setter
@NoArgsConstructor
public class RelatedProduct {

    @EmbeddedId
    private RelatedProductId id = new RelatedProductId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("sourceProductId")
    @JoinColumn(name = "source_product_id", nullable = false)
    private Product sourceProduct;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("targetProductId")
    @JoinColumn(name = "target_product_id", nullable = false)
    private Product targetProduct;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public RelatedProduct(Product sourceProduct, Product targetProduct, Integer sortOrder) {
        this.sourceProduct = sourceProduct;
        this.targetProduct = targetProduct;
        this.sortOrder = sortOrder;
        this.id = new RelatedProductId(sourceProduct.getId(), targetProduct.getId());
    }
}
