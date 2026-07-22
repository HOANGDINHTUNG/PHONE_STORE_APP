package com.re.ecommerce.modules.inventory.entity;

import com.re.ecommerce.modules.catalog.entity.ProductVariant;
import com.re.ecommerce.modules.inventory.entity.enums.StockReferenceType;
import com.re.ecommerce.modules.inventory.entity.enums.StockTransactionType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "stock_transactions")
@Getter
@Setter
@NoArgsConstructor
public class StockTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_variant_id", nullable = false)
    private ProductVariant productVariant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_unit_id")
    private InventoryUnit inventoryUnit;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false, length = 30)
    private StockTransactionType transactionType;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "on_hand_before", nullable = false)
    private Integer onHandBefore;

    @Column(name = "on_hand_after", nullable = false)
    private Integer onHandAfter;

    @Column(name = "reserved_before", nullable = false)
    private Integer reservedBefore;

    @Column(name = "reserved_after", nullable = false)
    private Integer reservedAfter;

    @Enumerated(EnumType.STRING)
    @Column(name = "reference_type", nullable = false, length = 30)
    private StockReferenceType referenceType;

    // Cross-module reference / loose coupling
    @Column(name = "reference_id", columnDefinition = "BINARY(16)", nullable = false)
    private UUID referenceId;

    @Column(length = 500)
    private String reason;

    @Column(name = "created_by", columnDefinition = "VARCHAR(255)")
    private String createdBy;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
