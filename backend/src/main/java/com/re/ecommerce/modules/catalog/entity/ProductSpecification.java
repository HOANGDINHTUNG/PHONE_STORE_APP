package com.re.ecommerce.modules.catalog.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Entity
@Table(name = "product_specifications",
    uniqueConstraints = @UniqueConstraint(
        name = "uq_spec_product_group_name",
        columnNames = {"product_id", "group_name", "spec_name"}),
    indexes = {
        @Index(name = "idx_spec_product", columnList = "product_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
public class ProductSpecification {

    @Id
    @UuidGenerator
    @Column(columnDefinition = "BINARY(16)", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "group_name", nullable = false, length = 100)
    private String groupName;

    @Column(name = "spec_name", nullable = false, length = 150)
    private String specName;

    @Column(name = "spec_value", nullable = false, length = 500)
    private String specValue;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder = 0;

    public ProductSpecification(Product product, String groupName, String specName, String specValue, int sortOrder) {
        this.product = product;
        this.groupName = groupName;
        this.specName = specName;
        this.specValue = specValue;
        this.sortOrder = sortOrder;
    }
}
