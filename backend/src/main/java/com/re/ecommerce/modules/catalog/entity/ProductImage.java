package com.re.ecommerce.modules.catalog.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Entity
@Table(name = "product_images", indexes = {
    @Index(name = "idx_image_variant", columnList = "variant_id"),
    @Index(name = "idx_image_primary", columnList = "variant_id, is_primary")
})
@Getter
@Setter
@NoArgsConstructor
public class ProductImage {

    @Id
    @UuidGenerator
    @Column(columnDefinition = "BINARY(16)", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id", nullable = false)
    private ProductVariant variant;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Column(name = "alt_text", length = 255)
    private String altText;

    @Column(name = "is_primary", nullable = false)
    private boolean isPrimary = false;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder = 0;

    public ProductImage(ProductVariant variant, String imageUrl, String altText, boolean isPrimary, int sortOrder) {
        this.variant = variant;
        this.imageUrl = imageUrl;
        this.altText = altText;
        this.isPrimary = isPrimary;
        this.sortOrder = sortOrder;
    }
}
