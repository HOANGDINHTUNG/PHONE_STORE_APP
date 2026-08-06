-- Populate operational stock for every saleable phone variant and spread it
-- across active warehouses. Existing real/seed balances are never overwritten.

UPDATE warehouses
SET name = CASE code
    WHEN 'WH-THU-DUC' THEN 'Kho Trung tâm Thủ Đức'
    WHEN 'WH-HCM-Q9' THEN 'Kho Thủ Đức - Quận 9'
    WHEN 'WH-DA-NANG' THEN 'Kho Đà Nẵng'
    WHEN 'WH-CAN-THO' THEN 'Kho Cần Thơ'
    WHEN 'WH-ARCHIVE' THEN 'Kho Lưu trữ'
    ELSE name
END,
address = CASE code
    WHEN 'WH-THU-DUC' THEN 'Khu Công nghệ cao, Thủ Đức, TP. Hồ Chí Minh'
    WHEN 'WH-HCM-Q9' THEN 'Quận 9, TP. Hồ Chí Minh'
    WHEN 'WH-DA-NANG' THEN 'Hải Châu, Đà Nẵng'
    WHEN 'WH-CAN-THO' THEN 'Ninh Kiều, Cần Thơ'
    WHEN 'WH-ARCHIVE' THEN 'Bình Chánh, TP. Hồ Chí Minh'
    ELSE address
END;

-- Primary stock location: every active variant belongs to exactly one active
-- warehouse by a stable SKU hash, making the distribution deterministic.
INSERT INTO warehouse_inventories (
    warehouse_id, product_variant_id, on_hand_quantity, reserved_quantity, reorder_level
)
SELECT aw.id,
       pv.id,
       12 + MOD(CRC32(pv.sku), 25),
       0,
       4 + MOD(CRC32(CONCAT(pv.sku, '-reorder')), 7)
FROM product_variants pv
JOIN products p ON p.id = pv.product_id
JOIN (
    SELECT id, position_number - 1 AS warehouse_index, total_warehouses
    FROM (
        SELECT id,
               ROW_NUMBER() OVER (ORDER BY code) AS position_number,
               COUNT(*) OVER () AS total_warehouses
        FROM warehouses
        WHERE status = 'ACTIVE'
    ) ranked_warehouses
) aw ON MOD(CRC32(pv.sku), aw.total_warehouses) = aw.warehouse_index
WHERE pv.status = 'ACTIVE'
  AND p.publication_status = 'ACTIVE'
  AND p.deleted_at IS NULL
ON DUPLICATE KEY UPDATE reorder_level = GREATEST(warehouse_inventories.reorder_level, VALUES(reorder_level));

-- A quarter of variants also receive a smaller secondary balance. This gives
-- shipment routing a genuine fallback warehouse when the primary is depleted.
INSERT INTO warehouse_inventories (
    warehouse_id, product_variant_id, on_hand_quantity, reserved_quantity, reorder_level
)
SELECT aw.id,
       pv.id,
       6 + MOD(CRC32(CONCAT(pv.sku, '-backup')), 10),
       0,
       3 + MOD(CRC32(CONCAT(pv.sku, '-backup-reorder')), 5)
FROM product_variants pv
JOIN products p ON p.id = pv.product_id
JOIN (
    SELECT id, position_number - 1 AS warehouse_index, total_warehouses
    FROM (
        SELECT id,
               ROW_NUMBER() OVER (ORDER BY code) AS position_number,
               COUNT(*) OVER () AS total_warehouses
        FROM warehouses
        WHERE status = 'ACTIVE'
    ) ranked_warehouses
) aw ON MOD(CRC32(pv.sku) + 1, aw.total_warehouses) = aw.warehouse_index
WHERE pv.status = 'ACTIVE'
  AND p.publication_status = 'ACTIVE'
  AND p.deleted_at IS NULL
  AND MOD(CRC32(pv.sku), 4) = 0
ON DUPLICATE KEY UPDATE reorder_level = GREATEST(warehouse_inventories.reorder_level, VALUES(reorder_level));
