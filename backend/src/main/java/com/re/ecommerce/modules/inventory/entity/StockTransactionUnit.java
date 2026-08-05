package com.re.ecommerce.modules.inventory.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "stock_transaction_units")
@Getter
@Setter
@NoArgsConstructor
public class StockTransactionUnit {
    @EmbeddedId
    private StockTransactionUnitId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("stockTransactionId")
    @JoinColumn(name = "stock_transaction_id", nullable = false)
    private StockTransaction stockTransaction;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("inventoryUnitId")
    @JoinColumn(name = "inventory_unit_id", nullable = false)
    private InventoryUnit inventoryUnit;

    public StockTransactionUnit(StockTransaction stockTransaction, InventoryUnit inventoryUnit) {
        this.id = new StockTransactionUnitId(stockTransaction.getId(), inventoryUnit.getId());
        this.stockTransaction = stockTransaction;
        this.inventoryUnit = inventoryUnit;
    }
}
