package com.re.ecommerce.modules.inventory.entity;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class StockTransactionUnitId implements Serializable {
    @Column(name = "stock_transaction_id")
    private Long stockTransactionId;

    @Column(name = "inventory_unit_id")
    private Long inventoryUnitId;
}
