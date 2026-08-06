-- V44__Seed_Two_More_Users_With_Orders_And_Reviews.sql
-- Clean seed data using REAL products, product_variants, images, and SKUs existing in the database.

-- Set Variables for Users
SET @user1_id = UNHEX(REPLACE('00000000-0000-0000-0000-000000000901', '-', ''));
SET @user2_id = UNHEX(REPLACE('00000000-0000-0000-0000-000000000902', '-', ''));

-- 1. Insert Users (Password: 123456)
INSERT INTO users (id, username, email, phone, password_hash, role, active, account_status, created_at)
VALUES
(@user1_id, 'lan.nguyen', 'lan.nguyen@gmail.com', '0918234567', '$2a$10$1NOAnWWfXs12Tn7IQdEQwuHU1Iw/8jysW8p.OjDFvOPK2/z3EqlZq', 'USER', 1, 'ACTIVE', NOW() - INTERVAL 30 DAY),
(@user2_id, 'tuan.le', 'tuan.le@gmail.com', '0938765432', '$2a$10$1NOAnWWfXs12Tn7IQdEQwuHU1Iw/8jysW8p.OjDFvOPK2/z3EqlZq', 'USER', 1, 'ACTIVE', NOW() - INTERVAL 60 DAY)
ON DUPLICATE KEY UPDATE account_status = VALUES(account_status);

-- 2. Insert Customer Profiles
INSERT INTO customer_profiles (user_id, customer_code, full_name, date_of_birth, gender, marketing_opt_in, customer_status)
VALUES
(@user1_id, 'CUST-LAN-001', 'Nguyễn Thị Lan', '1996-05-12', 'Nữ', 1, 'ACTIVE'),
(@user2_id, 'CUST-TUAN-002', 'Lê Anh Tuấn', '1990-09-28', 'Nam', 1, 'ACTIVE')
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);

-- Product & Variant References from Real Store Catalog
-- Product 1: iPhone 16 (33333333333333333333333333330014) / Variant: 128GB Xanh Mòng Két (66666666666646668666000000000034)
SET @prod_ip16_id = UNHEX('33333333333333333333333333330014');
SET @var_ip16_34_id = UNHEX('66666666666646668666000000000034');

-- Product 2: iPhone 15 Plus (33333333333333333333333333330015) / Variant: 128GB Đen (66666666666646668666000000000025)
SET @prod_ip15p_id = UNHEX('33333333333333333333333333330015');
SET @var_ip15p_25_id = UNHEX('66666666666646668666000000000025');

-- Product 3: iPhone 16 Pro Max (33333333333333333333333333330011) / Variant: 256GB Titan Đen (66666666666646668666000000000043)
SET @prod_ip16pm_id = UNHEX('33333333333333333333333333330011');
SET @var_ip16pm_43_id = UNHEX('66666666666646668666000000000043');

-- Product 4: iPhone 16 Pro (33333333333333333333333333330012) / Variant: 128GB Titan Tự Nhiên (66666666666646668666000000000040)
SET @prod_ip16pro_id = UNHEX('33333333333333333333333333330012');
SET @var_ip16pro_40_id = UNHEX('66666666666646668666000000000040');

-- Product 5: iPhone 16 Plus (33333333333333333333333333330013) / Variant: 256GB Hồng (66666666666646668666000000000038)
SET @prod_ip16plus_id = UNHEX('33333333333333333333333333330013');
SET @var_ip16plus_38_id = UNHEX('66666666666646668666000000000038');

-- 3. Seed Orders for User 1 (Nguyễn Thị Lan - Hạng Bạc ~ 21.49M chi tiêu)
SET @u1_ord1_id = UNHEX(REPLACE('88888888-8888-8888-8888-888888888801', '-', ''));
SET @u1_ord2_id = UNHEX(REPLACE('88888888-8888-8888-8888-888888888802', '-', ''));

INSERT INTO orders (
    id, order_code, idempotency_key_hash, customer_id, source_channel, contact_name, contact_phone, contact_email,
    receiver_name, receiver_phone, shipping_province_name, shipping_district_name, shipping_ward_name, shipping_detail_address,
    currency, subtotal_amount, discount_amount, shipping_fee, grand_total_amount, status, created_at
)
SELECT
    @u1_ord1_id, 'ORD-8812-LAN', UNHEX(REPLACE('88888888-8888-8888-8888-888888888801', '-', '')),
    @user1_id, 'WEB', 'Nguyễn Thị Lan', '0918234567', 'lan.nguyen@gmail.com',
    'Nguyễn Thị Lan', '0918234567', 'TP. Hồ Chí Minh', 'Quận 3', 'Phường Võ Thị Sáu', '45 Nguyễn Thị Minh Khai',
    'VND', 21490000.00, 0.00, 0.00, 21490000.00, 'COMPLETED', NOW() - INTERVAL 15 DAY
WHERE NOT EXISTS (SELECT 1 FROM orders WHERE id = @u1_ord1_id);

INSERT INTO orders (
    id, order_code, idempotency_key_hash, customer_id, source_channel, contact_name, contact_phone, contact_email,
    receiver_name, receiver_phone, shipping_province_name, shipping_district_name, shipping_ward_name, shipping_detail_address,
    currency, subtotal_amount, discount_amount, shipping_fee, grand_total_amount, status, created_at
)
SELECT
    @u1_ord2_id, 'ORD-8813-LAN', UNHEX(REPLACE('88888888-8888-8888-8888-888888888802', '-', '')),
    @user1_id, 'WEB', 'Nguyễn Thị Lan', '0918234567', 'lan.nguyen@gmail.com',
    'Nguyễn Thị Lan', '0918234567', 'TP. Hồ Chí Minh', 'Quận 3', 'Phường Võ Thị Sáu', '45 Nguyễn Thị Minh Khai',
    'VND', 21290000.00, 0.00, 0.00, 21290000.00, 'PROCESSING', NOW() - INTERVAL 1 DAY
WHERE NOT EXISTS (SELECT 1 FROM orders WHERE id = @u1_ord2_id);

-- Order Items for User 1
SET @u1_item1_id = UNHEX(REPLACE('88888888-8888-8888-8888-888888888811', '-', ''));
SET @u1_item2_id = UNHEX(REPLACE('88888888-8888-8888-8888-888888888812', '-', ''));

INSERT INTO order_items (id, order_id, product_id, product_variant_id, product_name, variant_name, sku, color, ram, storage, image_url, warranty_months, unit_price, quantity)
SELECT
    @u1_item1_id, @u1_ord1_id, @prod_ip16_id, @var_ip16_34_id,
    'iPhone 16', 'iPhone 16 128GB Xanh Mòng Két', 'PHONE-034-128GB', 'Xanh Mòng Két', '8GB', '128GB',
    'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-xanh-mong-ket.png',
    12, 21490000.00, 1
WHERE EXISTS (SELECT 1 FROM orders WHERE id = @u1_ord1_id)
  AND NOT EXISTS (SELECT 1 FROM order_items WHERE id = @u1_item1_id);

INSERT INTO order_items (id, order_id, product_id, product_variant_id, product_name, variant_name, sku, color, ram, storage, image_url, warranty_months, unit_price, quantity)
SELECT
    @u1_item2_id, @u1_ord2_id, @prod_ip15p_id, @var_ip15p_25_id,
    'iPhone 15 Plus', 'iPhone 15 Plus 128GB Đen', 'PHONE-025-128GB', 'Đen', '6GB', '128GB',
    'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-plus-update-01_7.png',
    12, 21290000.00, 1
WHERE EXISTS (SELECT 1 FROM orders WHERE id = @u1_ord2_id)
  AND NOT EXISTS (SELECT 1 FROM order_items WHERE id = @u1_item2_id);

-- 4. Seed Orders for User 2 (Lê Anh Tuấn - Hạng Bạch Kim ~ 60.98M chi tiêu)
SET @u2_ord1_id = UNHEX(REPLACE('99999999-9999-9999-9999-999999999911', '-', ''));
SET @u2_ord2_id = UNHEX(REPLACE('99999999-9999-9999-9999-999999999912', '-', ''));
SET @u2_ord3_id = UNHEX(REPLACE('99999999-9999-9999-9999-999999999913', '-', ''));

INSERT INTO orders (
    id, order_code, idempotency_key_hash, customer_id, source_channel, contact_name, contact_phone, contact_email,
    receiver_name, receiver_phone, shipping_province_name, shipping_district_name, shipping_ward_name, shipping_detail_address,
    currency, subtotal_amount, discount_amount, shipping_fee, grand_total_amount, status, created_at
)
SELECT
    @u2_ord1_id, 'ORD-9901-TUAN', UNHEX(REPLACE('99999999-9999-9999-9999-999999999911', '-', '')),
    @user2_id, 'WEB', 'Lê Anh Tuấn', '0938765432', 'tuan.le@gmail.com',
    'Lê Anh Tuấn', '0938765432', 'TP. Hà Nội', 'Quận Cầu Giấy', 'Phường Dịch Vọng', '88 Cầu Giấy',
    'VND', 33490000.00, 0.00, 0.00, 33490000.00, 'COMPLETED', NOW() - INTERVAL 45 DAY
WHERE NOT EXISTS (SELECT 1 FROM orders WHERE id = @u2_ord1_id);

INSERT INTO orders (
    id, order_code, idempotency_key_hash, customer_id, source_channel, contact_name, contact_phone, contact_email,
    receiver_name, receiver_phone, shipping_province_name, shipping_district_name, shipping_ward_name, shipping_detail_address,
    currency, subtotal_amount, discount_amount, shipping_fee, grand_total_amount, status, created_at
)
SELECT
    @u2_ord2_id, 'ORD-9902-TUAN', UNHEX(REPLACE('99999999-9999-9999-9999-999999999912', '-', '')),
    @user2_id, 'WEB', 'Lê Anh Tuấn', '0938765432', 'tuan.le@gmail.com',
    'Lê Anh Tuấn', '0938765432', 'TP. Hà Nội', 'Quận Cầu Giấy', 'Phường Dịch Vọng', '88 Cầu Giấy',
    'VND', 27490000.00, 0.00, 0.00, 27490000.00, 'COMPLETED', NOW() - INTERVAL 20 DAY
WHERE NOT EXISTS (SELECT 1 FROM orders WHERE id = @u2_ord2_id);

INSERT INTO orders (
    id, order_code, idempotency_key_hash, customer_id, source_channel, contact_name, contact_phone, contact_email,
    receiver_name, receiver_phone, shipping_province_name, shipping_district_name, shipping_ward_name, shipping_detail_address,
    currency, subtotal_amount, discount_amount, shipping_fee, grand_total_amount, status, created_at
)
SELECT
    @u2_ord3_id, 'ORD-9903-TUAN', UNHEX(REPLACE('99999999-9999-9999-9999-999999999913', '-', '')),
    @user2_id, 'WEB', 'Lê Anh Tuấn', '0938765432', 'tuan.le@gmail.com',
    'Lê Anh Tuấn', '0938765432', 'TP. Hà Nội', 'Quận Cầu Giấy', 'Phường Dịch Vọng', '88 Cầu Giấy',
    'VND', 27490000.00, 0.00, 0.00, 27490000.00, 'SHIPPING', NOW() - INTERVAL 2 DAY
WHERE NOT EXISTS (SELECT 1 FROM orders WHERE id = @u2_ord3_id);

-- Order Items for User 2
SET @u2_item1_id = UNHEX(REPLACE('99999999-9999-9999-9999-999999999921', '-', ''));
SET @u2_item2_id = UNHEX(REPLACE('99999999-9999-9999-9999-999999999922', '-', ''));
SET @u2_item3_id = UNHEX(REPLACE('99999999-9999-9999-9999-999999999923', '-', ''));

INSERT INTO order_items (id, order_id, product_id, product_variant_id, product_name, variant_name, sku, color, ram, storage, image_url, warranty_months, unit_price, quantity)
SELECT
    @u2_item1_id, @u2_ord1_id, @prod_ip16pm_id, @var_ip16pm_43_id,
    'iPhone 16 Pro Max', 'iPhone 16 Pro Max 256GB Titan Đen', 'PHONE-043-256GB', 'Titan Đen', '8GB', '256GB',
    'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max-titan-den.png',
    12, 33490000.00, 1
WHERE EXISTS (SELECT 1 FROM orders WHERE id = @u2_ord1_id)
  AND NOT EXISTS (SELECT 1 FROM order_items WHERE id = @u2_item1_id);

INSERT INTO order_items (id, order_id, product_id, product_variant_id, product_name, variant_name, sku, color, ram, storage, image_url, warranty_months, unit_price, quantity)
SELECT
    @u2_item2_id, @u2_ord2_id, @prod_ip16pro_id, @var_ip16pro_40_id,
    'iPhone 16 Pro', 'iPhone 16 Pro 128GB Titan Tự Nhiên', 'PHONE-040-128GB', 'Titan Tự Nhiên', '8GB', '128GB',
    'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-titan-tu-nhien.png',
    12, 27490000.00, 1
WHERE EXISTS (SELECT 1 FROM orders WHERE id = @u2_ord2_id)
  AND NOT EXISTS (SELECT 1 FROM order_items WHERE id = @u2_item2_id);

INSERT INTO order_items (id, order_id, product_id, product_variant_id, product_name, variant_name, sku, color, ram, storage, image_url, warranty_months, unit_price, quantity)
SELECT
    @u2_item3_id, @u2_ord3_id, @prod_ip16plus_id, @var_ip16plus_38_id,
    'iPhone 16 Plus', 'iPhone 16 Plus 256GB Hồng', 'PHONE-038-256GB', 'Hồng', '8GB', '256GB',
    'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-plus-hong_2.png',
    12, 27490000.00, 1
WHERE EXISTS (SELECT 1 FROM orders WHERE id = @u2_ord3_id)
  AND NOT EXISTS (SELECT 1 FROM order_items WHERE id = @u2_item3_id);

-- 5. Seed Reviews for Users
INSERT INTO reviews (id, customer_id, order_item_id, rating, title, comment, status, created_at)
SELECT
    UNHEX(REPLACE('99999999-9999-9999-9999-999999999931', '-', '')),
    @user1_id, @u1_item1_id, 5,
    'Sản phẩm tuyệt vời',
    'Máy màu xanh mòng két siêu đẹp, nhỏ gọn cầm vừa tay, chụp ảnh cực kỳ sắc nét. Đóng gói giao hàng nhanh!',
    'APPROVED', NOW() - INTERVAL 10 DAY
WHERE EXISTS (SELECT 1 FROM order_items WHERE id = @u1_item1_id)
  AND NOT EXISTS (SELECT 1 FROM reviews WHERE id = UNHEX(REPLACE('99999999-9999-9999-9999-999999999931', '-', '')));

INSERT INTO reviews (id, customer_id, order_item_id, rating, title, comment, status, created_at)
SELECT
    UNHEX(REPLACE('99999999-9999-9999-9999-999999999932', '-', '')),
    @user2_id, @u2_item1_id, 5,
    'Hàng nguyên seal chất lượng',
    'Hàng chính hãng VN/A nguyên seal, titan đen siêu sang. Giao hàng hỏa tốc trong 2 giờ. Phục vụ chuyên nghiệp!',
    'APPROVED', NOW() - INTERVAL 40 DAY
WHERE EXISTS (SELECT 1 FROM order_items WHERE id = @u2_item1_id)
  AND NOT EXISTS (SELECT 1 FROM reviews WHERE id = UNHEX(REPLACE('99999999-9999-9999-9999-999999999932', '-', '')));

-- 6. Seed Wishlist Items
INSERT INTO wishlist_items (id, customer_id, product_id, created_at)
SELECT
    UNHEX(REPLACE('77777777-7777-7777-7777-777777777781', '-', '')),
    @user1_id, @prod_ip16plus_id, NOW()
WHERE NOT EXISTS (SELECT 1 FROM wishlist_items WHERE customer_id = @user1_id AND product_id = @prod_ip16plus_id);

INSERT INTO wishlist_items (id, customer_id, product_id, created_at)
SELECT
    UNHEX(REPLACE('77777777-7777-7777-7777-777777777782', '-', '')),
    @user2_id, @prod_ip16pro_id, NOW()
WHERE NOT EXISTS (SELECT 1 FROM wishlist_items WHERE customer_id = @user2_id AND product_id = @prod_ip16pro_id);

INSERT INTO wishlist_items (id, customer_id, product_id, created_at)
SELECT
    UNHEX(REPLACE('77777777-7777-7777-7777-777777777783', '-', '')),
    @user2_id, @prod_ip16_id, NOW()
WHERE NOT EXISTS (SELECT 1 FROM wishlist_items WHERE customer_id = @user2_id AND product_id = @prod_ip16_id);
