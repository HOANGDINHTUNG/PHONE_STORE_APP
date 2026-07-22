package com.re.ecommerce.modules.inventory.entity;

import com.re.ecommerce.modules.catalog.entity.ProductVariant;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "warehouse_inventories")
@Getter
@Setter
@NoArgsConstructor
public class WarehouseInventory {

    @EmbeddedId
    private WarehouseInventoryId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("warehouseId")
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("productVariantId")
    @JoinColumn(name = "product_variant_id", nullable = false)
    private ProductVariant productVariant;

    @Column(name = "on_hand_quantity", nullable = false)
    private Integer onHandQuantity = 0;

    @Column(name = "reserved_quantity", nullable = false)
    private Integer reservedQuantity = 0;

    @Column(name = "available_quantity", insertable = false, updatable = false)
    private Integer availableQuantity;

    @Column(name = "reorder_level", nullable = false)
    private Integer reorderLevel = 0;

    @Version
    @Column(nullable = false)
    private Long version = 0L;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

}
