-- V15: Seed Demo Data for Testing

-- 1. Create a dummy test user (password: 123456)
SET @demo_user_id = UNHEX(REPLACE('00000000-0000-0000-0000-000000000001', '-', ''));
INSERT INTO users (id, username, email, phone, password_hash, role, active, account_status)
VALUES (@demo_user_id, 'tester', 'test@pinkphone.com', '0909999999', '$2a$10$1NOAnWWfXs12Tn7IQdEQwuHU1Iw/8jysW8p.OjDFvOPK2/z3EqlZq', 'USER', TRUE, 'ACTIVE');

-- Customer Profile for this user
INSERT INTO customer_profiles (user_id, customer_code, full_name, customer_status)
VALUES (@demo_user_id, 'CUST-00001', 'Demo User', 'ACTIVE');

-- 2. Categories
SET @cat_phone = UNHEX(REPLACE('11111111-1111-1111-1111-111111111111', '-', ''));
SET @cat_tablet = UNHEX(REPLACE('11111111-1111-1111-1111-111111111112', '-', ''));
SET @cat_acc = UNHEX(REPLACE('11111111-1111-1111-1111-111111111113', '-', ''));

INSERT INTO categories (id, name, slug, description, status) VALUES
(@cat_phone, 'Điện thoại', 'dien-thoai', 'Smartphones chính hãng', 'ACTIVE'),
(@cat_tablet, 'Tablet', 'tablet', 'Máy tính bảng', 'ACTIVE'),
(@cat_acc, 'Phụ kiện', 'phu-kien', 'Phụ kiện công nghệ', 'ACTIVE');

-- 3. Brands
SET @b_apple = UNHEX(REPLACE('22222222-2222-2222-2222-222222222221', '-', ''));
SET @b_samsung = UNHEX(REPLACE('22222222-2222-2222-2222-222222222222', '-', ''));
SET @b_xiaomi = UNHEX(REPLACE('22222222-2222-2222-2222-222222222223', '-', ''));
SET @b_oppo = UNHEX(REPLACE('22222222-2222-2222-2222-222222222224', '-', ''));

INSERT INTO brands (id, name, slug, logo_url, status) VALUES
(@b_apple, 'Apple', 'apple', 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', 'ACTIVE'),
(@b_samsung, 'Samsung', 'samsung', 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg', 'ACTIVE'),
(@b_xiaomi, 'Xiaomi', 'xiaomi', 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg', 'ACTIVE'),
(@b_oppo, 'Oppo', 'oppo', 'https://upload.wikimedia.org/wikipedia/commons/b/b3/OPPO_logo_2019.svg', 'ACTIVE');

-- 4. Products
SET @p_iphone15 = UNHEX(REPLACE('33333333-3333-3333-3333-333333333331', '-', ''));
SET @p_s24u = UNHEX(REPLACE('33333333-3333-3333-3333-333333333332', '-', ''));
SET @p_x14 = UNHEX(REPLACE('33333333-3333-3333-3333-333333333333', '-', ''));

INSERT INTO products (id, category_id, brand_id, name, slug, description, publication_status) VALUES
(@p_iphone15, @cat_phone, @b_apple, 'iPhone 15 Pro Max', 'iphone-15-pro-max', 'Apple iPhone 15 Pro Max', 'PUBLISHED'),
(@p_s24u, @cat_phone, @b_samsung, 'Samsung Galaxy S24 Ultra', 'samsung-galaxy-s24-ultra', 'Samsung AI Phone', 'PUBLISHED'),
(@p_x14, @cat_phone, @b_xiaomi, 'Xiaomi 14 Ultra', 'xiaomi-14-ultra', 'Siêu phẩm camera Leica', 'PUBLISHED');

-- 5. Product Variants
SET @v_ip15_1 = UNHEX(REPLACE('44444444-4444-4444-4444-444444444441', '-', ''));
SET @v_ip15_2 = UNHEX(REPLACE('44444444-4444-4444-4444-444444444442', '-', ''));
SET @v_s24u_1 = UNHEX(REPLACE('44444444-4444-4444-4444-444444444443', '-', ''));
SET @v_x14_1 = UNHEX(REPLACE('44444444-4444-4444-4444-444444444444', '-', ''));

INSERT INTO product_variants (id, product_id, sku, name, color, ram_gb, storage_gb, list_price, sale_price, status) VALUES
(@v_ip15_1, @p_iphone15, 'IP15PM-256-NATURAL', 'iPhone 15 Pro Max 256GB Titan Tự Nhiên', 'Titan Tự Nhiên', 8, 256, 34990000, 29890000, 'ACTIVE'),
(@v_ip15_2, @p_iphone15, 'IP15PM-512-BLACK', 'iPhone 15 Pro Max 512GB Titan Đen', 'Titan Đen', 8, 512, 40990000, 36890000, 'ACTIVE'),
(@v_s24u_1, @p_s24u, 'S24U-256-GREY', 'Samsung Galaxy S24 Ultra 256GB Xám Titan', 'Xám Titan', 12, 256, 33990000, 26990000, 'ACTIVE'),
(@v_x14_1, @p_x14, 'X14U-512-WHITE', 'Xiaomi 14 Ultra 512GB Trắng', 'Trắng', 16, 512, 32990000, 29990000, 'ACTIVE');

-- 6. Product Images
SET @img1 = UNHEX(REPLACE('55555555-5555-5555-5555-555555555551', '-', ''));
SET @img2 = UNHEX(REPLACE('55555555-5555-5555-5555-555555555552', '-', ''));
SET @img3 = UNHEX(REPLACE('55555555-5555-5555-5555-555555555553', '-', ''));
SET @img4 = UNHEX(REPLACE('55555555-5555-5555-5555-555555555554', '-', ''));

INSERT INTO product_images (id, variant_id, image_url, is_primary) VALUES
(@img1, @v_ip15_1, 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png', TRUE),
(@img2, @v_ip15_2, 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png', TRUE),
(@img3, @v_s24u_1, 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/s/ss-s24-ultra-xam-222.png', TRUE),
(@img4, @v_x14_1, 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-14-ultra-1.png', TRUE);
