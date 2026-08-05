CREATE TABLE IF NOT EXISTS stock_transaction_units (
    stock_transaction_id BIGINT UNSIGNED NOT NULL,
    inventory_unit_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (stock_transaction_id, inventory_unit_id),
    CONSTRAINT fk_stock_transaction_units_transaction FOREIGN KEY (stock_transaction_id) REFERENCES stock_transactions(id),
    CONSTRAINT fk_stock_transaction_units_unit FOREIGN KEY (inventory_unit_id) REFERENCES inventory_units(id)
);

-- Backfill existing receipt history: each received unit is linked to its PO's IMPORT ledger entry.
INSERT IGNORE INTO stock_transaction_units (stock_transaction_id, inventory_unit_id)
SELECT stock_transaction.id, unit.id
FROM stock_transactions stock_transaction
JOIN purchase_order_items purchase_item
  ON purchase_item.purchase_order_id = stock_transaction.reference_id
JOIN inventory_units unit
  ON unit.purchase_order_item_id = purchase_item.id
WHERE stock_transaction.transaction_type = 'IMPORT'
  AND stock_transaction.reference_type = 'PURCHASE_ORDER';
