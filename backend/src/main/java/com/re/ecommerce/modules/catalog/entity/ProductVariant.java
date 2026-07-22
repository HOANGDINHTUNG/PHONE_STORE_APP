package com.re.ecommerce.modules.catalog.entity;

import com.re.ecommerce.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "product_variants", indexes = {
    @Index(name = "idx_variant_sku", columnList = "sku"),
    @Index(name = "idx_variant_product", columnList = "product_id"),
    @Index(name = "idx_variant_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProductVariant extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false, unique = true, length = 100)
    private String sku;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(length = 100)
    private String color;

    @Column(name = "ram_gb")
    private Integer ramGb;

    @Column(name = "storage_gb")
    private Integer storageGb;

    @Enumerated(EnumType.STRING)
    @Column(name = "tracking_type", nullable = false, length = 50)
    private TrackingType trackingType = TrackingType.NONE;

    @Column(name = "warranty_months")
    private Integer warrantyMonths;

    @Column(name = "list_price", nullable = false, precision = 18, scale = 2)
    private BigDecimal listPrice;

    @Column(name = "sale_price", precision = 18, scale = 2)
    private BigDecimal salePrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private VariantStatus status = VariantStatus.ACTIVE;

    @Version
    @Column(nullable = false)
    private long version = 0;

    @OneToMany(mappedBy = "variant", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<ProductImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "variant", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductPriceHistory> priceHistories = new ArrayList<>();

    public ProductVariant(Product product, String sku, String name, String color,
                          Integer ramGb, Integer storageGb, TrackingType trackingType,
                          Integer warrantyMonths, BigDecimal listPrice, BigDecimal salePrice) {
        this.product = product;
        this.sku = sku;
        this.name = name;
        this.color = color;
        this.ramGb = ramGb;
        this.storageGb = storageGb;
        this.trackingType = trackingType != null ? trackingType : TrackingType.NONE;
        this.warrantyMonths = warrantyMonths;
        this.listPrice = listPrice;
        this.salePrice = salePrice;
        this.status = VariantStatus.ACTIVE;
    }
}
