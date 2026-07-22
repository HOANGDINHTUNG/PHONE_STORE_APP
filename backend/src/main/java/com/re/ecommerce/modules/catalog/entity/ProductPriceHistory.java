package com.re.ecommerce.modules.catalog.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "product_price_histories", indexes = {
    @Index(name = "idx_price_history_variant", columnList = "variant_id")
})
@Getter
@Setter
@NoArgsConstructor
public class ProductPriceHistory {

    @Id
    @UuidGenerator
    @Column(columnDefinition = "BINARY(16)", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id", nullable = false)
    private ProductVariant variant;

    @Column(name = "old_list_price", precision = 18, scale = 2)
    private BigDecimal oldListPrice;

    @Column(name = "new_list_price", nullable = false, precision = 18, scale = 2)
    private BigDecimal newListPrice;

    @Column(name = "old_sale_price", precision = 18, scale = 2)
    private BigDecimal oldSalePrice;

    @Column(name = "new_sale_price", precision = 18, scale = 2)
    private BigDecimal newSalePrice;

    @Column(length = 500)
    private String reason;

    @Column(name = "created_by", length = 255)
    private String createdBy;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public ProductPriceHistory(ProductVariant variant, BigDecimal oldListPrice, BigDecimal newListPrice,
                               BigDecimal oldSalePrice, BigDecimal newSalePrice, String reason, String createdBy) {
        this.variant = variant;
        this.oldListPrice = oldListPrice;
        this.newListPrice = newListPrice;
        this.oldSalePrice = oldSalePrice;
        this.newSalePrice = newSalePrice;
        this.reason = reason;
        this.createdBy = createdBy;
        this.createdAt = LocalDateTime.now();
    }
}
