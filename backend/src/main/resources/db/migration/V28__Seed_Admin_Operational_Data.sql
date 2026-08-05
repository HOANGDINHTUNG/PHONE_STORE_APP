-- ============================================================================
-- V28: Operational data for the admin console
-- Covers suppliers, warehouses, procurement, stock, orders, payments,
-- shipments, refunds and coupons. All records use ADM/SEED identifiers so
-- they can be recognised and safely updated in development databases.
-- ============================================================================

-- 1. Suppliers and warehouses: include both active and inactive examples.
INSERT INTO suppliers (id, supplier_code, name, tax_code, contact_name, phone, email, address, status)
VALUES
  (UNHEX(REPLACE('e1000000-0000-4000-8000-000000000001', '-', '')), 'SUP-ADM-001', 'FPT Trading Distribution', '0312345671', 'Nguyễn Minh Quân', '02873001201', 'procurement@fpttrading.example', 'Quận 1, TP. Hồ Chí Minh', 'ACTIVE'),
  (UNHEX(REPLACE('e1000000-0000-4000-8000-000000000002', '-', '')), 'SUP-ADM-002', 'Digiworld Supply Chain', '0312345672', 'Trần Hồng Anh', '02873001202', 'supply@dgworld.example', 'Thủ Đức, TP. Hồ Chí Minh', 'ACTIVE'),
  (UNHEX(REPLACE('e1000000-0000-4000-8000-000000000003', '-', '')), 'SUP-ADM-003', 'Viettel Distribution', '0312345673', 'Lê Quốc Bảo', '02473001203', 'partner@viettel.example', 'Cầu Giấy, Hà Nội', 'ACTIVE'),
  (UNHEX(REPLACE('e1000000-0000-4000-8000-000000000004', '-', '')), 'SUP-ADM-004', 'Mobile Parts Việt Nam', '0312345674', 'Phạm Thu Hà', '02873001204', 'sales@mobileparts.example', 'Quận 12, TP. Hồ Chí Minh', 'INACTIVE')
ON DUPLICATE KEY UPDATE name = VALUES(name), contact_name = VALUES(contact_name), phone = VALUES(phone), email = VALUES(email), address = VALUES(address), status = VALUES(status);

INSERT INTO warehouses (id, code, name, phone, address, status)
VALUES
  (UNHEX(REPLACE('e2000000-0000-4000-8000-000000000001', '-', '')), 'WH-THU-DUC', 'Kho Thủ Đức', '02873002001', 'Khu Công nghệ cao, Thủ Đức, TP. Hồ Chí Minh', 'ACTIVE'),
  (UNHEX(REPLACE('e2000000-0000-4000-8000-000000000002', '-', '')), 'WH-DA-NANG', 'Kho Đà Nẵng', '02367300202', 'Hải Châu, Đà Nẵng', 'ACTIVE'),
  (UNHEX(REPLACE('e2000000-0000-4000-8000-000000000003', '-', '')), 'WH-CAN-THO', 'Kho Cần Thơ', '02927300203', 'Ninh Kiều, Cần Thơ', 'ACTIVE'),
  (UNHEX(REPLACE('e2000000-0000-4000-8000-000000000004', '-', '')), 'WH-ARCHIVE', 'Kho Lưu trữ', '02873002004', 'Bình Chánh, TP. Hồ Chí Minh', 'INACTIVE')
ON DUPLICATE KEY UPDATE name = VALUES(name), phone = VALUES(phone), address = VALUES(address), status = VALUES(status);

-- 2. Coupons used by promotion and order administration.
INSERT INTO coupons (id, code, type, discount_value, applies_to_all, minimum_order_value, maximum_discount_amount, start_time, end_time, per_customer_limit, status, used_count, created_by)
VALUES
  (UNHEX(REPLACE('e3000000-0000-4000-8000-000000000001', '-', '')), 'ADMINWELCOME10', 'PERCENT', 10, TRUE, 1000000, 500000, DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 90 DAY), 1, 'ACTIVE', 1, 'seed-admin'),
  (UNHEX(REPLACE('e3000000-0000-4000-8000-000000000002', '-', '')), 'PHONE500K', 'AMOUNT', 500000, FALSE, 10000000, NULL, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_ADD(NOW(), INTERVAL 45 DAY), 2, 'ACTIVE', 1, 'seed-admin'),
  (UNHEX(REPLACE('e3000000-0000-4000-8000-000000000003', '-', '')), 'ADMINEXPIRED', 'PERCENT', 15, TRUE, 2000000, 700000, DATE_SUB(NOW(), INTERVAL 60 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), 1, 'EXPIRED', 18, 'seed-admin')
ON DUPLICATE KEY UPDATE discount_value = VALUES(discount_value), start_time = VALUES(start_time), end_time = VALUES(end_time), status = VALUES(status), used_count = VALUES(used_count);

INSERT INTO coupon_product_targets (coupon_id, product_id)
SELECT UNHEX(REPLACE('e3000000-0000-4000-8000-000000000002', '-', '')), pv.product_id FROM product_variants pv WHERE pv.sku = 'PHONE-041-256GB'
ON DUPLICATE KEY UPDATE product_id = VALUES(product_id);

-- 3. Additional purchase orders across the full procurement lifecycle.
INSERT INTO purchase_orders (id, purchase_order_code, supplier_id, warehouse_id, status, total_amount, expected_at, created_by, note, received_at, cancelled_at, cancel_reason)
SELECT seed.id, seed.po_code, supplier.id, warehouse.id, seed.status, seed.total_amount, seed.expected_at, 'seed-admin', seed.note, seed.received_at, seed.cancelled_at, seed.cancel_reason
FROM (
  SELECT UNHEX(REPLACE('e4000000-0000-4000-8000-000000000001', '-', '')) id, 'PO-ADM-1001' po_code, 'SUP-ADM-001' supplier_code, 'WH-THU-DUC' warehouse_code, 'COMPLETED' status, 718800000 total_amount, DATE_SUB(NOW(), INTERVAL 9 DAY) expected_at, 'Đã nhận đủ hàng phục vụ kho Thủ Đức.' note, DATE_SUB(NOW(), INTERVAL 8 DAY) received_at, NULL cancelled_at, NULL cancel_reason UNION ALL
  SELECT UNHEX(REPLACE('e4000000-0000-4000-8000-000000000002', '-', '')), 'PO-ADM-1002', 'SUP-ADM-002', 'WH-DA-NANG', 'PARTIALLY_RECEIVED', 332700000, DATE_ADD(NOW(), INTERVAL 3 DAY), 'Nhận một phần, chờ lô hàng còn lại.', DATE_SUB(NOW(), INTERVAL 1 DAY), NULL, NULL UNION ALL
  SELECT UNHEX(REPLACE('e4000000-0000-4000-8000-000000000003', '-', '')), 'PO-ADM-1003', 'SUP-ADM-003', 'WH-CAN-THO', 'PENDING_APPROVAL', 219600000, DATE_ADD(NOW(), INTERVAL 7 DAY), NULL, NULL, NULL, NULL UNION ALL
  SELECT UNHEX(REPLACE('e4000000-0000-4000-8000-000000000004', '-', '')), 'PO-ADM-1004', 'SUP-ADM-004', 'WH-ARCHIVE', 'CANCELLED', 88450000, DATE_SUB(NOW(), INTERVAL 1 DAY), NULL, NULL, DATE_SUB(NOW(), INTERVAL 4 DAY), 'Nhà cung cấp tạm ngừng giao hàng'
) seed
JOIN suppliers supplier ON supplier.supplier_code = seed.supplier_code
JOIN warehouses warehouse ON warehouse.code = seed.warehouse_code
ON DUPLICATE KEY UPDATE status = VALUES(status), total_amount = VALUES(total_amount), expected_at = VALUES(expected_at), note = VALUES(note), received_at = VALUES(received_at), cancelled_at = VALUES(cancelled_at), cancel_reason = VALUES(cancel_reason);

INSERT INTO purchase_order_items (purchase_order_id, product_variant_id, ordered_quantity, received_quantity, unit_cost)
SELECT po.id, pv.id, 24, 24, 29950000 FROM purchase_orders po JOIN product_variants pv ON pv.sku = 'PHONE-041-256GB' WHERE po.purchase_order_code = 'PO-ADM-1001'
ON DUPLICATE KEY UPDATE ordered_quantity = VALUES(ordered_quantity), received_quantity = VALUES(received_quantity), unit_cost = VALUES(unit_cost);
INSERT INTO purchase_order_items (purchase_order_id, product_variant_id, ordered_quantity, received_quantity, unit_cost)
SELECT po.id, pv.id, 18, 9, 18490000 FROM purchase_orders po JOIN product_variants pv ON pv.sku = 'PHONE-023-256GB' WHERE po.purchase_order_code = 'PO-ADM-1002'
ON DUPLICATE KEY UPDATE ordered_quantity = VALUES(ordered_quantity), received_quantity = VALUES(received_quantity), unit_cost = VALUES(unit_cost);
INSERT INTO purchase_order_items (purchase_order_id, product_variant_id, ordered_quantity, received_quantity, unit_cost)
SELECT po.id, pv.id, 40, 0, 5490000 FROM purchase_orders po JOIN product_variants pv ON pv.sku = 'PHONE-076-128GB' WHERE po.purchase_order_code = 'PO-ADM-1003'
ON DUPLICATE KEY UPDATE ordered_quantity = VALUES(ordered_quantity), received_quantity = VALUES(received_quantity), unit_cost = VALUES(unit_cost);
INSERT INTO purchase_order_items (purchase_order_id, product_variant_id, ordered_quantity, received_quantity, unit_cost)
SELECT po.id, pv.id, 5, 0, 17690000 FROM purchase_orders po JOIN product_variants pv ON pv.sku = 'PHONE-041-256GB' WHERE po.purchase_order_code = 'PO-ADM-1004'
ON DUPLICATE KEY UPDATE ordered_quantity = VALUES(ordered_quantity), received_quantity = VALUES(received_quantity), unit_cost = VALUES(unit_cost);

-- 4. Stock balances, transaction history and a few serialized units.
INSERT INTO warehouse_inventories (warehouse_id, product_variant_id, on_hand_quantity, reserved_quantity, reorder_level)
SELECT w.id, pv.id, seed.on_hand, seed.reserved_qty, seed.reorder_level
FROM (
  SELECT 'WH-THU-DUC' warehouse_code, 'PHONE-041-256GB' sku, 24 on_hand, 2 reserved_qty, 8 reorder_level UNION ALL
  SELECT 'WH-THU-DUC', 'PHONE-023-256GB', 9, 1, 12 UNION ALL
  SELECT 'WH-DA-NANG', 'PHONE-076-128GB', 5, 0, 10 UNION ALL
  SELECT 'WH-DA-NANG', 'PHONE-029-256GB', 38, 4, 12 UNION ALL
  SELECT 'WH-CAN-THO', 'PHONE-052-512GB', 2, 0, 8 UNION ALL
  SELECT 'WH-CAN-THO', 'PHONE-041-256GB', 17, 0, 6
) seed
JOIN warehouses w ON w.code = seed.warehouse_code
JOIN product_variants pv ON pv.sku = seed.sku
ON DUPLICATE KEY UPDATE on_hand_quantity = VALUES(on_hand_quantity), reserved_quantity = VALUES(reserved_quantity), reorder_level = VALUES(reorder_level), version = warehouse_inventories.version + 1;

INSERT INTO inventory_units (id, product_variant_id, warehouse_id, unit_status, received_at)
SELECT 980001, pv.id, w.id, 'AVAILABLE', DATE_SUB(NOW(), INTERVAL 8 DAY) FROM product_variants pv JOIN warehouses w ON w.code = 'WH-THU-DUC' WHERE pv.sku = 'PHONE-041-256GB'
UNION ALL SELECT 980002, pv.id, w.id, 'AVAILABLE', DATE_SUB(NOW(), INTERVAL 8 DAY) FROM product_variants pv JOIN warehouses w ON w.code = 'WH-THU-DUC' WHERE pv.sku = 'PHONE-041-256GB'
UNION ALL SELECT 980003, pv.id, w.id, 'AVAILABLE', DATE_SUB(NOW(), INTERVAL 1 DAY) FROM product_variants pv JOIN warehouses w ON w.code = 'WH-DA-NANG' WHERE pv.sku = 'PHONE-023-256GB'
ON DUPLICATE KEY UPDATE unit_status = VALUES(unit_status), warehouse_id = VALUES(warehouse_id), received_at = VALUES(received_at);

INSERT INTO stock_transactions (warehouse_id, product_variant_id, transaction_type, quantity, on_hand_before, on_hand_after, reserved_before, reserved_after, reference_type, reference_id, reason, created_by)
SELECT w.id, pv.id, 'IMPORT', 24, 0, 24, 0, 2, 'PURCHASE_ORDER', po.id, 'Nhập kho từ PO-ADM-1001', 'seed-admin'
FROM warehouses w JOIN product_variants pv ON pv.sku = 'PHONE-041-256GB' JOIN purchase_orders po ON po.purchase_order_code = 'PO-ADM-1001' WHERE w.code = 'WH-THU-DUC';
INSERT INTO stock_transactions (warehouse_id, product_variant_id, transaction_type, quantity, on_hand_before, on_hand_after, reserved_before, reserved_after, reference_type, reference_id, reason, created_by)
SELECT w.id, pv.id, 'IMPORT', 9, 0, 9, 0, 1, 'PURCHASE_ORDER', po.id, 'Nhập một phần từ PO-ADM-1002', 'seed-admin'
FROM warehouses w JOIN product_variants pv ON pv.sku = 'PHONE-023-256GB' JOIN purchase_orders po ON po.purchase_order_code = 'PO-ADM-1002' WHERE w.code = 'WH-DA-NANG';

-- 5. Orders with different statuses feed payment, shipment and refund screens.
INSERT INTO orders (id, order_code, idempotency_key_hash, customer_id, source_channel, coupon_id, contact_name, contact_email, contact_phone, receiver_name, receiver_phone, shipping_province_name, shipping_district_name, shipping_ward_name, shipping_detail_address, subtotal_amount, discount_amount, shipping_fee, grand_total_amount, status, note, created_at)
VALUES
  (UNHEX(REPLACE('e5000000-0000-4000-8000-000000000001', '-', '')), 'ORD-ADM-1001', UNHEX(SHA2('seed-order-adm-1001', 256)), NULL, 'WEB', NULL, 'Nguyễn Văn A', 'nguyenvana@example.com', '0901234567', 'Nguyễn Văn A', '0901234567', 'TP. Hồ Chí Minh', 'Quận 7', 'Tân Phong', '123 Nguyễn Văn Linh', 12490000, 0, 30000, 12520000, 'PENDING', 'Chờ xác nhận đơn hàng', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
  (UNHEX(REPLACE('e5000000-0000-4000-8000-000000000002', '-', '')), 'ORD-ADM-1002', UNHEX(SHA2('seed-order-adm-1002', 256)), NULL, 'WEB', UNHEX(REPLACE('e3000000-0000-4000-8000-000000000001', '-', '')), 'Trần Thị B', 'tranb@example.com', '0987654321', 'Trần Thị B', '0987654321', 'Đà Nẵng', 'Hải Châu', 'Hải Châu 1', '45 Trần Phú', 24900000, 1000000, 0, 23900000, 'PROCESSING', 'Đang đóng gói tại kho', DATE_SUB(NOW(), INTERVAL 1 DAY)),
  (UNHEX(REPLACE('e5000000-0000-4000-8000-000000000003', '-', '')), 'ORD-ADM-1003', UNHEX(SHA2('seed-order-adm-1003', 256)), NULL, 'MOBILE', NULL, 'Lê Văn C', 'levanc@example.com', '0912345678', 'Lê Văn C', '0912345678', 'Hà Nội', 'Cầu Giấy', 'Dịch Vọng', '89 Trần Thái Tông', 29990000, 0, 45000, 30035000, 'SHIPPING', 'Đang giao cho khách hàng', DATE_SUB(NOW(), INTERVAL 3 DAY)),
  (UNHEX(REPLACE('e5000000-0000-4000-8000-000000000004', '-', '')), 'ORD-ADM-1004', UNHEX(SHA2('seed-order-adm-1004', 256)), NULL, 'WEB', NULL, 'Phạm Thu D', 'phamthud@example.com', '0933445566', 'Phạm Thu D', '0933445566', 'Cần Thơ', 'Ninh Kiều', 'An Khánh', '12 Mậu Thân', 5490000, 0, 0, 5490000, 'RETURNED', 'Đơn đã hoàn trả và hoàn tiền', DATE_SUB(NOW(), INTERVAL 10 DAY))
ON DUPLICATE KEY UPDATE status = VALUES(status), subtotal_amount = VALUES(subtotal_amount), discount_amount = VALUES(discount_amount), shipping_fee = VALUES(shipping_fee), grand_total_amount = VALUES(grand_total_amount), coupon_id = VALUES(coupon_id), note = VALUES(note);

INSERT INTO order_items (id, order_id, product_id, product_variant_id, product_name, variant_name, sku, color, ram, storage, warranty_months, unit_price, quantity, discount_amount)
SELECT UNHEX(REPLACE('e5100000-0000-4000-8000-000000000001', '-', '')), o.id, p.id, pv.id, p.name, pv.name, pv.sku, pv.color, CONCAT(pv.ram_gb, 'GB'), CONCAT(pv.storage_gb, 'GB'), 12, 12490000, 1, 0 FROM orders o JOIN product_variants pv ON pv.sku = 'PHONE-070-256GB' JOIN products p ON p.id = pv.product_id WHERE o.order_code = 'ORD-ADM-1001'
ON DUPLICATE KEY UPDATE unit_price = VALUES(unit_price), quantity = VALUES(quantity);
INSERT INTO order_items (id, order_id, product_id, product_variant_id, product_name, variant_name, sku, color, ram, storage, warranty_months, unit_price, quantity, discount_amount)
SELECT UNHEX(REPLACE('e5100000-0000-4000-8000-000000000002', '-', '')), o.id, p.id, pv.id, p.name, pv.name, pv.sku, pv.color, CONCAT(pv.ram_gb, 'GB'), CONCAT(pv.storage_gb, 'GB'), 12, 24900000, 1, 1000000 FROM orders o JOIN product_variants pv ON pv.sku = 'PHONE-019-128GB' JOIN products p ON p.id = pv.product_id WHERE o.order_code = 'ORD-ADM-1002'
ON DUPLICATE KEY UPDATE unit_price = VALUES(unit_price), quantity = VALUES(quantity), discount_amount = VALUES(discount_amount);
INSERT INTO order_items (id, order_id, product_id, product_variant_id, product_name, variant_name, sku, color, ram, storage, warranty_months, unit_price, quantity, discount_amount)
SELECT UNHEX(REPLACE('e5100000-0000-4000-8000-000000000003', '-', '')), o.id, p.id, pv.id, p.name, pv.name, pv.sku, pv.color, CONCAT(pv.ram_gb, 'GB'), CONCAT(pv.storage_gb, 'GB'), 12, 29990000, 1, 0 FROM orders o JOIN product_variants pv ON pv.sku = 'PHONE-031-256GB' JOIN products p ON p.id = pv.product_id WHERE o.order_code = 'ORD-ADM-1003'
ON DUPLICATE KEY UPDATE unit_price = VALUES(unit_price), quantity = VALUES(quantity);
INSERT INTO order_items (id, order_id, product_id, product_variant_id, product_name, variant_name, sku, color, ram, storage, warranty_months, unit_price, quantity, discount_amount)
SELECT UNHEX(REPLACE('e5100000-0000-4000-8000-000000000004', '-', '')), o.id, p.id, pv.id, p.name, pv.name, pv.sku, pv.color, CONCAT(pv.ram_gb, 'GB'), CONCAT(pv.storage_gb, 'GB'), 12, 5490000, 1, 0 FROM orders o JOIN product_variants pv ON pv.sku = 'PHONE-076-128GB' JOIN products p ON p.id = pv.product_id WHERE o.order_code = 'ORD-ADM-1004'
ON DUPLICATE KEY UPDATE unit_price = VALUES(unit_price), quantity = VALUES(quantity);

-- 6. Payment history and a processed refund.
INSERT INTO payments (order_id, expected_amount, paid_amount, refunded_amount, currency, status, paid_at)
SELECT o.id, seed.expected_amount, seed.paid_amount, seed.refunded_amount, 'VND', seed.status, seed.paid_at
FROM (
  SELECT 'ORD-ADM-1001' order_code, 12520000 expected_amount, 0 paid_amount, 0 refunded_amount, 'UNPAID' status, NULL paid_at UNION ALL
  SELECT 'ORD-ADM-1002', 23900000, 10000000, 0, 'PARTIALLY_PAID', DATE_SUB(NOW(), INTERVAL 1 DAY) UNION ALL
  SELECT 'ORD-ADM-1003', 30035000, 30035000, 0, 'PAID', DATE_SUB(NOW(), INTERVAL 2 DAY) UNION ALL
  SELECT 'ORD-ADM-1004', 5490000, 5490000, 5490000, 'REFUNDED', DATE_SUB(NOW(), INTERVAL 9 DAY)
) seed JOIN orders o ON o.order_code = seed.order_code
ON DUPLICATE KEY UPDATE expected_amount = VALUES(expected_amount), paid_amount = VALUES(paid_amount), refunded_amount = VALUES(refunded_amount), status = VALUES(status), paid_at = VALUES(paid_at);

INSERT INTO payment_attempts (payment_id, merchant_request_id, attempt_number, method, provider_code, status, amount, provider_transaction_id, provider_response_code, provider_message, created_by)
SELECT p.id, seed.request_id, seed.attempt_number, seed.method, seed.provider, seed.status, seed.amount, seed.transaction_id, seed.response_code, seed.message, NULL
FROM (
  SELECT 'ORD-ADM-1001' order_code, 'seed-pay-1001-1' request_id, 1 attempt_number, 'COD' method, 'COD' provider, 'PENDING' status, 12520000 amount, NULL transaction_id, NULL response_code, 'Chờ thu hộ' message UNION ALL
  SELECT 'ORD-ADM-1002', 'seed-pay-1002-1', 1, 'MOMO', 'MOMO', 'FAILED', 23900000, NULL, '51', 'Số dư không đủ' UNION ALL
  SELECT 'ORD-ADM-1002', 'seed-pay-1002-2', 2, 'VNPAY', 'VNPAY', 'SUCCESS', 10000000, 'VNP-ADM-1002', '00', 'Thanh toán một phần' UNION ALL
  SELECT 'ORD-ADM-1003', 'seed-pay-1003-1', 1, 'VNPAY', 'VNPAY', 'SUCCESS', 30035000, 'VNP-ADM-1003', '00', 'Thanh toán thành công' UNION ALL
  SELECT 'ORD-ADM-1004', 'seed-pay-1004-1', 1, 'BANK_TRANSFER', 'BANK', 'SUCCESS', 5490000, 'BANK-ADM-1004', '00', 'Đã nhận tiền'
) seed JOIN orders o ON o.order_code = seed.order_code JOIN payments p ON p.order_id = o.id
ON DUPLICATE KEY UPDATE status = VALUES(status), amount = VALUES(amount), provider_transaction_id = VALUES(provider_transaction_id), provider_response_code = VALUES(provider_response_code), provider_message = VALUES(provider_message);

INSERT INTO payment_webhook_events (provider_code, provider_event_id, payload_hash, status, payment_attempt_id)
SELECT 'VNPAY', 'evt-seed-adm-1003', UNHEX(SHA2('seed-webhook-adm-1003', 256)), 'PROCESSED', pa.id
FROM payment_attempts pa WHERE pa.merchant_request_id = 'seed-pay-1003-1'
ON DUPLICATE KEY UPDATE status = VALUES(status), payment_attempt_id = VALUES(payment_attempt_id);

INSERT INTO return_requests (id, return_code, order_id, customer_id, type, status, total_refund_amount, reviewer_id, created_at)
VALUES (3801, 'RET-ADM-1004', UNHEX(REPLACE('e5000000-0000-4000-8000-000000000004', '-', '')), NULL, 'REFUND', 'COMPLETED', 5490000, NULL, DATE_SUB(NOW(), INTERVAL 6 DAY))
ON DUPLICATE KEY UPDATE status = VALUES(status), total_refund_amount = VALUES(total_refund_amount), reviewer_id = VALUES(reviewer_id);
INSERT INTO return_items (id, return_request_id, order_item_id, quantity, reason, refund_amount, condition_note, resolution)
VALUES (4801, 3801, UNHEX(REPLACE('e5100000-0000-4000-8000-000000000004', '-', '')), 1, 'Thiết bị không khởi động được', 5490000, 'Đủ phụ kiện, ngoại quan tốt', 'RESTOCK')
ON DUPLICATE KEY UPDATE reason = VALUES(reason), refund_amount = VALUES(refund_amount), resolution = VALUES(resolution);
INSERT INTO refunds (refund_code, idempotency_key, payment_id, payment_attempt_id, return_request_id, amount, method, status, reason, provider_refund_code, requester_id, approver_id)
SELECT 'RF-ADM-1004', 'seed-refund-adm-1004', p.id, pa.id, 3801, 5490000, 'ORIGINAL_PAYMENT', 'SUCCESS', 'Hoàn tiền đơn trả lại', 'VNP-RF-ADM-1004', requester.id, NULL
FROM payments p JOIN orders o ON o.id = p.order_id JOIN payment_attempts pa ON pa.payment_id = p.id AND pa.merchant_request_id = 'seed-pay-1004-1' JOIN (SELECT id FROM users ORDER BY created_at LIMIT 1) requester
WHERE o.order_code = 'ORD-ADM-1004'
ON DUPLICATE KEY UPDATE status = VALUES(status), amount = VALUES(amount), provider_refund_code = VALUES(provider_refund_code), approver_id = VALUES(approver_id);

-- 7. Shipment records representing packing, in-transit and delivered states.
INSERT INTO shipments (shipment_code, order_id, warehouse_id, shipping_provider, tracking_code, status, shipping_fee, estimated_delivery_at, shipped_at, delivered_at, created_by)
SELECT seed.shipment_code, o.id, w.id, seed.provider, seed.tracking_code, seed.status, seed.fee, seed.eta, seed.shipped_at, seed.delivered_at, NULL
FROM (
  SELECT 'SHP-ADM-1002' shipment_code, 'ORD-ADM-1002' order_code, 'WH-DA-NANG' warehouse_code, 'Giao Hàng Tiết Kiệm' provider, 'GHTK-ADM-1002' tracking_code, 'PACKING' status, 0 fee, DATE_ADD(NOW(), INTERVAL 2 DAY) eta, NULL shipped_at, NULL delivered_at UNION ALL
  SELECT 'SHP-ADM-1003', 'ORD-ADM-1003', 'WH-THU-DUC', 'Giao Hàng Nhanh', 'GHN-ADM-1003', 'IN_TRANSIT', 45000, DATE_ADD(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), NULL UNION ALL
  SELECT 'SHP-ADM-1004', 'ORD-ADM-1004', 'WH-CAN-THO', 'Viettel Post', 'VTP-ADM-1004', 'DELIVERED', 0, DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY)
) seed JOIN orders o ON o.order_code = seed.order_code JOIN warehouses w ON w.code = seed.warehouse_code
ON DUPLICATE KEY UPDATE status = VALUES(status), shipping_fee = VALUES(shipping_fee), estimated_delivery_at = VALUES(estimated_delivery_at), shipped_at = VALUES(shipped_at), delivered_at = VALUES(delivered_at);

INSERT INTO shipment_items (shipment_id, order_item_id, quantity)
SELECT s.id, oi.id, oi.quantity FROM shipments s JOIN orders o ON o.id = s.order_id JOIN order_items oi ON oi.order_id = o.id WHERE s.shipment_code IN ('SHP-ADM-1002', 'SHP-ADM-1003', 'SHP-ADM-1004')
ON DUPLICATE KEY UPDATE quantity = VALUES(quantity);
