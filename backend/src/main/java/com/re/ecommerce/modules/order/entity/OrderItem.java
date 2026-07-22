package com.re.ecommerce.modules.order.entity;

import com.re.ecommerce.common.entity.BaseEntity;
import com.re.ecommerce.modules.catalog.entity.Product;
import com.re.ecommerce.modules.catalog.entity.ProductVariant;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_variant_id", nullable = false)
    private ProductVariant productVariant;

    @Column(name = "product_name", length = 255, nullable = false)
    private String productName;

    @Column(name = "variant_name", length = 255, nullable = false)
    private String variantName;

    @Column(length = 100, nullable = false)
    private String sku;

    @Column(length = 80)
    private String color;

    @Column(length = 50)
    private String ram;

    @Column(length = 50)
    private String storage;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "warranty_months", nullable = false)
    private Integer warrantyMonths;

    @Column(name = "unit_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "discount_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal discountAmount;

    @Column(name = "line_total", precision = 15, scale = 2, insertable = false, updatable = false)
    private BigDecimal lineTotal;
}
