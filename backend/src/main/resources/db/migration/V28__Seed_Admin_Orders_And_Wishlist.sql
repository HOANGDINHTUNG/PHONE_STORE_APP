-- V28__Seed_Admin_Orders_And_Wishlist.sql
-- Seed sample orders and wishlist items for admin / Administrator account

SELECT id INTO @admin_user_id FROM users WHERE username = 'admin' LIMIT 1;

-- 1. Ensure CustomerProfile exists for admin
INSERT INTO customer_profiles (user_id, customer_code, full_name, customer_status)
SELECT @admin_user_id, 'CUST-ADMIN-001', 'Administrator', 'ACTIVE'
WHERE @admin_user_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM customer_profiles WHERE user_id = @admin_user_id
);

-- 2. Seed Orders for admin
SET @order1_id = UNHEX(REPLACE('66666666-6666-6666-6666-666666666661', '-', ''));
SET @order2_id = UNHEX(REPLACE('66666666-6666-6666-6666-666666666662', '-', ''));

SELECT id INTO @prod1_id FROM products LIMIT 1 OFFSET 0;
SELECT id INTO @var1_id FROM product_variants WHERE product_id = @prod1_id LIMIT 1 OFFSET 0;

SELECT id INTO @prod2_id FROM products LIMIT 1 OFFSET 1;
SELECT id INTO @var2_id FROM product_variants WHERE product_id = @prod2_id LIMIT 1 OFFSET 0;

INSERT INTO orders (
    id, order_code, idempotency_key_hash, customer_id, source_channel, contact_name, contact_phone, receiver_name, receiver_phone,
    shipping_province_name, shipping_district_name, shipping_ward_name, shipping_detail_address, currency,
    subtotal_amount, discount_amount, shipping_fee, grand_total_amount, status, created_at
)
SELECT
    @order1_id,
    'ORD-7721-ADMIN',
    UNHEX(REPLACE('66666666-6666-6666-6666-666666666661', '-', '')),
    @admin_user_id,
    'WEB',
    'Administrator',
    '0900000000',
    'Administrator',
    '0900000000',
    'TP. Hồ Chí Minh',
    'Quận 1',
    'Bến Nghé',
    '123 Lê Lợi',
    'VND',
    34990000.00,
    0.00,
    0.00,
    34990000.00,
    'COMPLETED',
    NOW() - INTERVAL 5 DAY
WHERE @admin_user_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM orders WHERE id = @order1_id
);

INSERT INTO orders (
    id, order_code, idempotency_key_hash, customer_id, source_channel, contact_name, contact_phone, receiver_name, receiver_phone,
    shipping_province_name, shipping_district_name, shipping_ward_name, shipping_detail_address, currency,
    subtotal_amount, discount_amount, shipping_fee, grand_total_amount, status, created_at
)
SELECT
    @order2_id,
    'ORD-6612-ADMIN',
    UNHEX(REPLACE('66666666-6666-6666-6666-666666666662', '-', '')),
    @admin_user_id,
    'WEB',
    'Administrator',
    '0900000000',
    'Administrator',
    '0900000000',
    'TP. Hồ Chí Minh',
    'Quận 1',
    'Bến Nghé',
    '123 Lê Lợi',
    'VND',
    28040000.00,
    0.00,
    0.00,
    28040000.00,
    'COMPLETED',
    NOW() - INTERVAL 12 DAY
WHERE @admin_user_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM orders WHERE id = @order2_id
);

INSERT INTO order_items (id, order_id, product_id, product_variant_id, product_name, variant_name, sku, unit_price, quantity)
SELECT
    UNHEX(REPLACE('66666666-6666-6666-6666-666666666671', '-', '')),
    @order1_id,
    @prod1_id,
    @var1_id,
    'iPhone 16 Pro Max 256GB',
    '256GB Titan Sa Mạc',
    'IP16PM-256-DESERT',
    34990000.00,
    1
WHERE @prod1_id IS NOT NULL AND EXISTS (SELECT 1 FROM orders WHERE id = @order1_id)
  AND NOT EXISTS (SELECT 1 FROM order_items WHERE id = UNHEX(REPLACE('66666666-6666-6666-6666-666666666671', '-', '')));

INSERT INTO order_items (id, order_id, product_id, product_variant_id, product_name, variant_name, sku, unit_price, quantity)
SELECT
    UNHEX(REPLACE('66666666-6666-6666-6666-666666666672', '-', '')),
    @order2_id,
    @prod2_id,
    @var2_id,
    'Samsung Galaxy S24 Ultra 512GB',
    '512GB Xám Titan',
    'S24U-512-GRAY',
    28040000.00,
    1
WHERE @prod2_id IS NOT NULL AND EXISTS (SELECT 1 FROM orders WHERE id = @order2_id)
  AND NOT EXISTS (SELECT 1 FROM order_items WHERE id = UNHEX(REPLACE('66666666-6666-6666-6666-666666666672', '-', '')));

-- 3. Seed Wishlist Items for admin
INSERT INTO wishlist_items (id, customer_id, product_id, created_at)
SELECT
    UNHEX(REPLACE('77777777-7777-7777-7777-777777777771', '-', '')),
    @admin_user_id,
    @prod1_id,
    NOW()
WHERE @admin_user_id IS NOT NULL AND @prod1_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM wishlist_items WHERE customer_id = @admin_user_id AND product_id = @prod1_id
);

INSERT INTO wishlist_items (id, customer_id, product_id, created_at)
SELECT
    UNHEX(REPLACE('77777777-7777-7777-7777-777777777772', '-', '')),
    @admin_user_id,
    @prod2_id,
    NOW()
WHERE @admin_user_id IS NOT NULL AND @prod2_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM wishlist_items WHERE customer_id = @admin_user_id AND product_id = @prod2_id
);
