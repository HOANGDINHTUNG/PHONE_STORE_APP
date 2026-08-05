-- V23__Seed_After_Sales_Data.sql
-- Seed Orders, Order Items, Reviews, Warranties, Warranty Claims, and Return Requests for After-Sales Center

SELECT id INTO @customer_id FROM users LIMIT 1 OFFSET 0;

-- 1. Seed Parent Orders & Order Items
INSERT INTO orders (
    id, order_code, idempotency_key_hash, customer_id, source_channel, contact_name, contact_phone, receiver_name, receiver_phone,
    shipping_province_name, shipping_district_name, shipping_ward_name, shipping_detail_address, currency,
    subtotal_amount, discount_amount, shipping_fee, grand_total_amount, status, created_at
)
VALUES
(
    UNHEX(REPLACE('55555555-5555-5555-5555-555555555555', '-', '')),
    'ORD-55219-X',
    UNHEX(REPLACE('55555555-5555-5555-5555-555555555555', '-', '')),
    @customer_id,
    'WEB',
    'Nguyễn Văn A',
    '0901234567',
    'Nguyễn Văn A',
    '0901234567',
    'TP. Hồ Chí Minh',
    'Quận 7',
    'Tân Phong',
    '123 Nguyễn Văn Linh',
    'VND',
    29990000.00,
    0.00,
    0.00,
    29990000.00,
    'COMPLETED',
    '2023-10-15 10:00:00'
)
ON DUPLICATE KEY UPDATE status = VALUES(status);

SELECT id INTO @prod1_id FROM products LIMIT 1 OFFSET 0;
SELECT id INTO @var1_id FROM product_variants WHERE product_id = @prod1_id LIMIT 1 OFFSET 0;

SELECT id INTO @prod2_id FROM products LIMIT 1 OFFSET 1;
SELECT id INTO @var2_id FROM product_variants WHERE product_id = @prod2_id LIMIT 1 OFFSET 0;

SELECT id INTO @prod3_id FROM products LIMIT 1 OFFSET 2;
SELECT id INTO @var3_id FROM product_variants WHERE product_id = @prod3_id LIMIT 1 OFFSET 0;

SELECT id INTO @prod4_id FROM products LIMIT 1 OFFSET 3;
SELECT id INTO @var4_id FROM product_variants WHERE product_id = @prod4_id LIMIT 1 OFFSET 0;

SELECT id INTO @prod5_id FROM products LIMIT 1 OFFSET 4;
SELECT id INTO @var5_id FROM product_variants WHERE product_id = @prod5_id LIMIT 1 OFFSET 0;

INSERT INTO order_items (id, order_id, product_id, product_variant_id, product_name, variant_name, sku, unit_price, quantity)
VALUES
(
    UNHEX(REPLACE('55555555-5555-5555-5555-555555555551', '-', '')),
    UNHEX(REPLACE('55555555-5555-5555-5555-555555555555', '-', '')),
    @prod1_id,
    @var1_id,
    'iPhone 15 Pro Max',
    '256GB Titan Tự Nhiên',
    'IP15-PM-256-NT',
    28500000.00,
    1
),
(
    UNHEX(REPLACE('55555555-5555-5555-5555-555555555552', '-', '')),
    UNHEX(REPLACE('55555555-5555-5555-5555-555555555555', '-', '')),
    @prod2_id,
    @var2_id,
    'Samsung Galaxy S24 Ultra',
    '256GB Xám Titan',
    'S24U-256-GREY',
    24500000.00,
    1
),
(
    UNHEX(REPLACE('55555555-5555-5555-5555-555555555553', '-', '')),
    UNHEX(REPLACE('55555555-5555-5555-5555-555555555555', '-', '')),
    @prod3_id,
    @var3_id,
    'AirPods Pro 2',
    'USB-C',
    'AP-PRO-2-USBC',
    5200000.00,
    1
),
(
    UNHEX(REPLACE('55555555-5555-5555-5555-555555555554', '-', '')),
    UNHEX(REPLACE('55555555-5555-5555-5555-555555555555', '-', '')),
    @prod4_id,
    @var4_id,
    'MacBook Pro 14',
    'M2 512GB',
    'MBP14-M2-512',
    32000000.00,
    1
),
(
    UNHEX(REPLACE('55555555-5555-5555-5555-555555555555', '-', '')),
    UNHEX(REPLACE('55555555-5555-5555-5555-555555555555', '-', '')),
    @prod5_id,
    @var5_id,
    'Oppo Find N3 Flip',
    '256GB Black',
    'OPPO-N3-FLIP',
    21500000.00,
    1
)
ON DUPLICATE KEY UPDATE quantity = VALUES(quantity);

-- 2. Seed Customer Reviews
INSERT INTO reviews (id, customer_id, order_item_id, rating, title, comment, status, rejection_reason, created_at)
VALUES
(
    UNHEX(REPLACE('99999999-9999-9999-9999-999999999901', '-', '')),
    @customer_id,
    UNHEX(REPLACE('55555555-5555-5555-5555-555555555551', '-', '')),
    5,
    'Sản phẩm tuyệt vời',
    'Màu hồng bên ngoài cực kỳ đẹp, giao hàng siêu nhanh. Đóng gói cẩn thận. Rất hài lòng...',
    'PENDING',
    NULL,
    '2023-10-24 14:30:00'
),
(
    UNHEX(REPLACE('99999999-9999-9999-9999-999999999902', '-', '')),
    @customer_id,
    UNHEX(REPLACE('55555555-5555-5555-5555-555555555552', '-', '')),
    1,
    'Hàng kém chất lượng',
    'Hàng lỗi, sạc không vào điện. Shop lừa đảo bán hàng giả!!!',
    'PENDING',
    NULL,
    '2023-10-23 09:15:00'
),
(
    UNHEX(REPLACE('99999999-9999-9999-9999-999999999903', '-', '')),
    @customer_id,
    UNHEX(REPLACE('55555555-5555-5555-5555-555555555553', '-', '')),
    4,
    'Dùng ổn',
    'Dùng tạm ổn, đúng với giá tiền.',
    'APPROVED',
    NULL,
    '2023-10-22 18:00:00'
)
ON DUPLICATE KEY UPDATE status = VALUES(status);

-- 3. Seed Warranties & Claims
INSERT INTO warranties (id, warranty_code, order_id, order_item_id, product_variant_id, customer_name, customer_phone, covered_quantity, status, start_date, end_date)
VALUES
(1001, 'WR-2023-8901', UNHEX(REPLACE('55555555-5555-5555-5555-555555555555', '-', '')), UNHEX(REPLACE('55555555-5555-5555-5555-555555555551', '-', '')), @var1_id, 'Nguyễn Văn A', '0901234567', 1, 'ACTIVE', '2023-10-01 00:00:00', '2024-10-01 00:00:00'),
(1002, 'WR-2023-8895', UNHEX(REPLACE('55555555-5555-5555-5555-555555555555', '-', '')), UNHEX(REPLACE('55555555-5555-5555-5555-555555555552', '-', '')), @var2_id, 'Trần Thị B', '0987654321', 1, 'ACTIVE', '2023-09-15 00:00:00', '2024-09-15 00:00:00'),
(1003, 'WR-2023-8870', UNHEX(REPLACE('55555555-5555-5555-5555-555555555555', '-', '')), UNHEX(REPLACE('55555555-5555-5555-5555-555555555553', '-', '')), @var3_id, 'Lê Văn C', '0912345678', 1, 'ACTIVE', '2023-08-20 00:00:00', '2024-08-20 00:00:00'),
(1004, 'WR-2023-8865', UNHEX(REPLACE('55555555-5555-5555-5555-555555555555', '-', '')), UNHEX(REPLACE('55555555-5555-5555-5555-555555555554', '-', '')), @var4_id, 'Phạm Thị D', '0933445566', 1, 'ACTIVE', '2023-07-10 00:00:00', '2024-07-10 00:00:00'),
(1005, 'WR-2023-8850', UNHEX(REPLACE('55555555-5555-5555-5555-555555555555', '-', '')), UNHEX(REPLACE('55555555-5555-5555-5555-555555555555', '-', '')), @var5_id, 'Hoàng Văn E', '0977889900', 1, 'ACTIVE', '2023-06-01 00:00:00', '2024-06-01 00:00:00')
ON DUPLICATE KEY UPDATE status = VALUES(status);

INSERT INTO warranty_claims (id, warranty_id, claim_code, status, issue_description, created_at)
VALUES
(2001, 1001, 'WR-2023-8901', 'INSPECTING', 'Máy bị rè loa thoại khi thực hiện cuộc gọi.', '2023-10-24 14:30:00'),
(2002, 1002, 'WR-2023-8895', 'WAITING_PARTS', 'Đang chờ linh kiện màn hình thay thế từ hãng.', '2023-10-23 09:15:00'),
(2003, 1003, 'WR-2023-8870', 'COMPLETED', 'Đã thay thế linh kiện tai nghe hoàn tất.', '2023-10-20 16:45:00'),
(2004, 1004, 'WR-2023-8865', 'SUBMITTED', 'Khách hàng gửi yêu cầu kiểm tra pin tụt nhanh.', '2023-10-19 11:20:00'),
(2005, 1005, 'WR-2023-8850', 'REJECTED', 'Thiết bị bị ngấm nước - Từ chối bảo hành theo quy định.', '2023-10-18 15:10:00')
ON DUPLICATE KEY UPDATE status = VALUES(status);

-- 4. Seed Return Requests & Return Items
INSERT INTO return_requests (id, return_code, order_id, type, status, total_refund_amount, created_at)
VALUES
(3001, 'RET-2023-0891', UNHEX(REPLACE('55555555-5555-5555-5555-555555555555', '-', '')), 'REFUND', 'PENDING', 29990000.00, '2023-10-15 14:30:00'),
(3002, 'RET-2023-0890', UNHEX(REPLACE('55555555-5555-5555-5555-555555555555', '-', '')), 'REFUND', 'PENDING', 26500000.00, '2023-10-14 11:00:00'),
(3003, 'RET-2023-0888', UNHEX(REPLACE('55555555-5555-5555-5555-555555555555', '-', '')), 'EXCHANGE', 'APPROVED', 5200000.00, '2023-10-12 09:30:00')
ON DUPLICATE KEY UPDATE status = VALUES(status);

INSERT INTO return_items (id, return_request_id, order_item_id, quantity, reason, refund_amount, condition_note, resolution)
VALUES
(4001, 3001, UNHEX(REPLACE('55555555-5555-5555-5555-555555555551', '-', '')), 1, 'Lỗi kỹ thuật - Màn hình hở sáng viền bên trái khi bật nền đen.', 29990000.00, 'Đã khui seal', 'PENDING'),
(4002, 3002, UNHEX(REPLACE('55555555-5555-5555-5555-555555555552', '-', '')), 1, 'Khách muốn đổi màu sắc.', 26500000.00, 'Còn nguyên seal', 'PENDING'),
(4003, 3003, UNHEX(REPLACE('55555555-5555-5555-5555-555555555553', '-', '')), 1, 'Sạc không vào điện.', 5200000.00, 'Đã khui seal', 'DEFECTIVE')
ON DUPLICATE KEY UPDATE reason = VALUES(reason);
