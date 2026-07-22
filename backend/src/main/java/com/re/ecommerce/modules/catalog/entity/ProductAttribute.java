package com.re.ecommerce.modules.catalog.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Entity
@Table(name = "product_attributes",
    uniqueConstraints = @UniqueConstraint(
        name = "uq_attr_product_name_value",
        columnNames = {"product_id", "attribute_name", "attribute_value"}),
    indexes = {
        @Index(name = "idx_attr_product", columnList = "product_id"),
        @Index(name = "idx_attr_name_value", columnList = "attribute_name, attribute_value")
    }
)
@Getter
@Setter
@NoArgsConstructor
public class ProductAttribute {

    @Id
    @UuidGenerator
    @Column(columnDefinition = "BINARY(16)", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "attribute_name", nullable = false, length = 100)
    private String attributeName;

    @Column(name = "attribute_value", nullable = false, length = 255)
    private String attributeValue;

    public ProductAttribute(Product product, String attributeName, String attributeValue) {
        this.product = product;
        this.attributeName = attributeName;
        this.attributeValue = attributeValue;
    }
}
