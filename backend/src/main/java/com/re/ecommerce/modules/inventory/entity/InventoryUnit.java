package com.re.ecommerce.modules.inventory.entity;

import com.re.ecommerce.modules.catalog.entity.ProductVariant;
import com.re.ecommerce.modules.inventory.entity.enums.InventoryUnitStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "inventory_units")
@Getter
@Setter
@NoArgsConstructor
public class InventoryUnit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_variant_id", nullable = false)
    private ProductVariant productVariant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_order_item_id")
    private PurchaseOrderItem purchaseOrderItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_reservation_id")
    private StockReservation currentReservation;

    // Cross-module reference
    @Column(name = "sold_order_item_id", columnDefinition = "BINARY(16)")
    private UUID soldOrderItemId;

    @Enumerated(EnumType.STRING)
    @Column(name = "unit_status", nullable = false, length = 20)
    private InventoryUnitStatus unitStatus = InventoryUnitStatus.AVAILABLE;

    @Column(name = "received_at")
    private LocalDateTime receivedAt;

    @Column(name = "sold_at")
    private LocalDateTime soldAt;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "inventoryUnit", cascade = CascadeType.ALL, orphanRemoval = true)
    @Setter(AccessLevel.NONE)
    private List<InventoryUnitIdentifier> identifiers = new ArrayList<>();

    public void addIdentifier(InventoryUnitIdentifier identifier) {
        identifiers.add(identifier);
        identifier.setInventoryUnit(this);
    }
}
