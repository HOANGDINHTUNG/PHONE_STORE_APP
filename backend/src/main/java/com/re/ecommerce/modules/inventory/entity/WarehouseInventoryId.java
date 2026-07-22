package com.re.ecommerce.modules.inventory.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WarehouseInventoryId implements Serializable {

    @Column(name = "warehouse_id", columnDefinition = "BINARY(16)", nullable = false)
    private UUID warehouseId;

    @Column(name = "product_variant_id", columnDefinition = "BINARY(16)", nullable = false)
    private UUID productVariantId;
}
