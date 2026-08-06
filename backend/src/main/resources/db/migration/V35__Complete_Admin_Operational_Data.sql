-- Complete the V28 operational seed when a pre-existing warehouse has the
-- same display name as the initial Thu Duc warehouse.  Only ADM records are
-- inserted or updated; existing operational records are left untouched.

INSERT INTO warehouses (id, code, name, phone, address, status)
VALUES (
  UNHEX(REPLACE('e2000000-0000-4000-8000-000000000005', '-', '')),
  'WH-THU-DUC', 'Kho Trung tam Thu Duc', '02873002005',
  'Khu Cong nghe cao, Thu Duc, TP. Ho Chi Minh', 'ACTIVE'
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name), phone = VALUES(phone), address = VALUES(address), status = VALUES(status);

INSERT INTO purchase_orders (
  id, purchase_order_code, supplier_id, warehouse_id, status, total_amount,
  expected_at, created_by, note, received_at, cancelled_at, cancel_reason
)
SELECT
  UNHEX(REPLACE('e4000000-0000-4000-8000-000000000001', '-', '')),
  'PO-ADM-1001', supplier.id, warehouse.id, 'COMPLETED', 718800000,
  DATE_SUB(NOW(), INTERVAL 9 DAY), 'seed-admin',
  'Da nhan du hang phuc vu kho Trung tam Thu Duc.',
  DATE_SUB(NOW(), INTERVAL 8 DAY), NULL, NULL
FROM suppliers supplier
JOIN warehouses warehouse ON warehouse.code = 'WH-THU-DUC'
WHERE supplier.supplier_code = 'SUP-ADM-001'
ON DUPLICATE KEY UPDATE
  status = VALUES(status), total_amount = VALUES(total_amount), expected_at = VALUES(expected_at),
  note = VALUES(note), received_at = VALUES(received_at), cancelled_at = VALUES(cancelled_at),
  cancel_reason = VALUES(cancel_reason);

INSERT INTO purchase_order_items (
  purchase_order_id, product_variant_id, ordered_quantity, received_quantity, unit_cost
)
SELECT po.id, pv.id, 24, 24, 29950000
FROM purchase_orders po
JOIN product_variants pv ON pv.sku = 'PHONE-041-256GB'
WHERE po.purchase_order_code = 'PO-ADM-1001'
ON DUPLICATE KEY UPDATE
  ordered_quantity = VALUES(ordered_quantity), received_quantity = VALUES(received_quantity),
  unit_cost = VALUES(unit_cost);

INSERT INTO warehouse_inventories (
  warehouse_id, product_variant_id, on_hand_quantity, reserved_quantity, reorder_level
)
SELECT warehouse.id, variant.id, seed.on_hand, seed.reserved_quantity, seed.reorder_level
FROM (
  SELECT 'PHONE-041-256GB' AS sku, 24 AS on_hand, 2 AS reserved_quantity, 8 AS reorder_level
  UNION ALL SELECT 'PHONE-023-256GB', 9, 1, 12
  UNION ALL SELECT 'PHONE-019-128GB', 3, 0, 9
) seed
JOIN warehouses warehouse ON warehouse.code = 'WH-THU-DUC'
JOIN product_variants variant ON variant.sku = seed.sku
ON DUPLICATE KEY UPDATE
  on_hand_quantity = VALUES(on_hand_quantity), reserved_quantity = VALUES(reserved_quantity),
  reorder_level = VALUES(reorder_level), version = warehouse_inventories.version + 1;

INSERT INTO inventory_units (id, product_variant_id, warehouse_id, unit_status, received_at)
SELECT seed.id, variant.id, warehouse.id, 'AVAILABLE', DATE_SUB(NOW(), INTERVAL seed.days_old DAY)
FROM (
  SELECT 980010 AS id, 'PHONE-041-256GB' AS sku, 8 AS days_old
  UNION ALL SELECT 980011, 'PHONE-041-256GB', 8
  UNION ALL SELECT 980012, 'PHONE-023-256GB', 2
) seed
JOIN warehouses warehouse ON warehouse.code = 'WH-THU-DUC'
JOIN product_variants variant ON variant.sku = seed.sku
ON DUPLICATE KEY UPDATE
  product_variant_id = VALUES(product_variant_id), warehouse_id = VALUES(warehouse_id),
  unit_status = VALUES(unit_status), received_at = VALUES(received_at);

INSERT INTO stock_transactions (
  warehouse_id, product_variant_id, transaction_type, quantity, on_hand_before,
  on_hand_after, reserved_before, reserved_after, reference_type, reference_id, reason, created_by
)
SELECT warehouse.id, variant.id, 'IMPORT', 24, 0, 24, 0, 2,
  'PURCHASE_ORDER', po.id, 'Nhap kho tu PO-ADM-1001', 'seed-admin'
FROM warehouses warehouse
JOIN product_variants variant ON variant.sku = 'PHONE-041-256GB'
JOIN purchase_orders po ON po.purchase_order_code = 'PO-ADM-1001'
WHERE warehouse.code = 'WH-THU-DUC'
  AND NOT EXISTS (
    SELECT 1 FROM stock_transactions transaction_row
    WHERE transaction_row.reference_type = 'PURCHASE_ORDER'
      AND transaction_row.reference_id = po.id
      AND transaction_row.product_variant_id = variant.id
  );
