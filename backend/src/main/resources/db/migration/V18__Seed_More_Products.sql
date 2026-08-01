-- ============================================================================
-- V18: SEED 10 MORE POPULAR SMARTPHONE PRODUCTS
-- ============================================================================

SET @cat_phone = UNHEX(REPLACE('11111111-1111-1111-1111-111111111111', '-', ''));

SET @b_apple   = UNHEX(REPLACE('22222222-2222-2222-2222-222222222221', '-', ''));
SET @b_samsung = UNHEX(REPLACE('22222222-2222-2222-2222-222222222222', '-', ''));
SET @b_xiaomi  = UNHEX(REPLACE('22222222-2222-2222-2222-222222222223', '-', ''));
SET @b_oppo    = UNHEX(REPLACE('22222222-2222-2222-2222-222222222224', '-', ''));

-- Product UUIDs
SET @p_ip15p   = UNHEX(REPLACE('33333333-3333-3333-3333-333333333301', '-', ''));
SET @p_ip14pm  = UNHEX(REPLACE('33333333-3333-3333-3333-333333333302', '-', ''));
SET @p_ip13    = UNHEX(REPLACE('33333333-3333-3333-3333-333333333303', '-', ''));
SET @p_zfold5  = UNHEX(REPLACE('33333333-3333-3333-3333-333333333304', '-', ''));
SET @p_zflip5  = UNHEX(REPLACE('33333333-3333-3333-3333-333333333305', '-', ''));
SET @p_a55     = UNHEX(REPLACE('33333333-3333-3333-3333-333333333306', '-', ''));
SET @p_x13tp   = UNHEX(REPLACE('33333333-3333-3333-3333-333333333307', '-', ''));
SET @p_rn13p   = UNHEX(REPLACE('33333333-3333-3333-3333-333333333308', '-', ''));
SET @p_n3flip  = UNHEX(REPLACE('33333333-3333-3333-3333-333333333309', '-', ''));
SET @p_reno11p = UNHEX(REPLACE('33333333-3333-3333-3333-333333333310', '-', ''));

-- 1. Products
INSERT IGNORE INTO products (id, category_id, brand_id, name, slug, description, publication_status) VALUES
(@p_ip15p,   @cat_phone, @b_apple,   'iPhone 15 Pro 128GB', 'iphone-15-pro', 'Khung Titan cao cấp, Chip A17 Pro siêu mạnh', 'ACTIVE'),
(@p_ip14pm,  @cat_phone, @b_apple,   'iPhone 14 Pro Max 128GB', 'iphone-14-pro-max', 'Màn hình Dynamic Island, Camera 48MP', 'ACTIVE'),
(@p_ip13,    @cat_phone, @b_apple,   'iPhone 13 128GB', 'iphone-13', 'Camera chéo độc đáo, Chip A15 Bionic tiết kiệm pin', 'ACTIVE'),
(@p_zfold5,  @cat_phone, @b_samsung, 'Samsung Galaxy Z Fold5 256GB', 'samsung-galaxy-z-fold-5', 'Màn hình gập mở rộng lớn, Snapdragon 8 Gen 2 for Galaxy', 'ACTIVE'),
(@p_zflip5,  @cat_phone, @b_samsung, 'Samsung Galaxy Z Flip5 256GB', 'samsung-galaxy-z-flip-5', 'Màn hình ngoài Flex Window 3.4 inch thời thượng', 'ACTIVE'),
(@p_a55,     @cat_phone, @b_samsung, 'Samsung Galaxy A55 5G 128GB', 'samsung-galaxy-a55-5g', 'Thiết kế viền kim loại sang trọng, Kháng nước IP67', 'ACTIVE'),
(@p_x13tp,   @cat_phone, @b_xiaomi,  'Xiaomi 13T Pro 5G 512GB', 'xiaomi-13t-pro', 'Ống kính Leica chuyên nghiệp, Sạc nhanh 120W HyperCharge', 'ACTIVE'),
(@p_rn13p,   @cat_phone, @b_xiaomi,  'Xiaomi Redmi Note 13 Pro 5G', 'xiaomi-redmi-note-13-pro-5g', 'Camera 200MP chống rung OIS, Màn hình 1.5K 120Hz', 'ACTIVE'),
(@p_n3flip,  @cat_phone, @b_oppo,    'OPPO Find N3 Flip 256GB', 'oppo-find-n3-flip', 'Bộ 3 camera Hasselblad gập mở đẳng cấp', 'ACTIVE'),
(@p_reno11p, @cat_phone, @b_oppo,    'OPPO Reno11 Pro 5G 512GB', 'oppo-reno11-pro-5g', 'Chuyên gia chân dung AI, Thiết kế mặt lưng sóng biển', 'ACTIVE');

-- Variant UUIDs
SET @v_ip15p   = UNHEX(REPLACE('44444444-4444-4444-4444-444444444401', '-', ''));
SET @v_ip14pm  = UNHEX(REPLACE('44444444-4444-4444-4444-444444444402', '-', ''));
SET @v_ip13    = UNHEX(REPLACE('44444444-4444-4444-4444-444444444403', '-', ''));
SET @v_zfold5  = UNHEX(REPLACE('44444444-4444-4444-4444-444444444404', '-', ''));
SET @v_zflip5  = UNHEX(REPLACE('44444444-4444-4444-4444-444444444405', '-', ''));
SET @v_a55     = UNHEX(REPLACE('44444444-4444-4444-4444-444444444406', '-', ''));
SET @v_x13tp   = UNHEX(REPLACE('44444444-4444-4444-4444-444444444407', '-', ''));
SET @v_rn13p   = UNHEX(REPLACE('44444444-4444-4444-4444-444444444408', '-', ''));
SET @v_n3flip  = UNHEX(REPLACE('44444444-4444-4444-4444-444444444409', '-', ''));
SET @v_reno11p = UNHEX(REPLACE('44444444-4444-4444-4444-444444444410', '-', ''));

-- 2. Variants
INSERT IGNORE INTO product_variants (id, product_id, sku, name, color, ram_gb, storage_gb, list_price, sale_price, status) VALUES
(@v_ip15p,   @p_ip15p,   'IP15P-128-TITAN',   'iPhone 15 Pro 128GB Titan Tự Nhiên', 'Titan Tự Nhiên', 8,  128, 28990000, 26990000, 'ACTIVE'),
(@v_ip14pm,  @p_ip14pm,  'IP14PM-128-PURPLE', 'iPhone 14 Pro Max 128GB Tím',        'Tím Deep Purple', 6, 128, 27990000, 24590000, 'ACTIVE'),
(@v_ip13,    @p_ip13,    'IP13-128-PINK',     'iPhone 13 128GB Hồng',               'Hồng Quý Phái',  4,  128, 15990000, 13490000, 'ACTIVE'),
(@v_zfold5,  @p_zfold5,  'ZFOLD5-256-CREAM',  'Galaxy Z Fold5 256GB Kem',           'Kem Icy',        12, 256, 40990000, 31990000, 'ACTIVE'),
(@v_zflip5,  @p_zflip5,  'ZFLIP5-256-MINT',   'Galaxy Z Flip5 256GB Xanh Mint',     'Xanh Mint',      8,  256, 25990000, 16990000, 'ACTIVE'),
(@v_a55,     @p_a55,     'A55-128-BLUE',      'Galaxy A55 5G 128GB Xanh',           'Xanh Iceblue',   8,  128, 11990000, 9690000,  'ACTIVE'),
(@v_x13tp,   @p_x13tp,   'X13TP-512-BLACK',   'Xiaomi 13T Pro 512GB Đen',           'Đen Titan',      12, 512, 16990000, 13990000, 'ACTIVE'),
(@v_rn13p,   @p_rn13p,   'RN13P-256-PURPLE',  'Redmi Note 13 Pro 5G Tím',           'Tím Aurora',     8,  256, 9490000,  7490000,  'ACTIVE'),
(@v_n3flip,  @p_n3flip,  'N3FLIP-256-BLACK',  'OPPO Find N3 Flip 256GB Đen',        'Đen Hổ Phách',   12, 256, 22990000, 19990000, 'ACTIVE'),
(@v_reno11p, @p_reno11p, 'RENO11P-512-WHITE', 'OPPO Reno11 Pro 5G Trắng',           'Trắng Ngọc Trai',12, 512, 13990000, 11490000, 'ACTIVE');

-- Image UUIDs
SET @img_ip15p   = UNHEX(REPLACE('55555555-5555-5555-5555-555555555501', '-', ''));
SET @img_ip14pm  = UNHEX(REPLACE('55555555-5555-5555-5555-555555555502', '-', ''));
SET @img_ip13    = UNHEX(REPLACE('55555555-5555-5555-5555-555555555503', '-', ''));
SET @img_zfold5  = UNHEX(REPLACE('55555555-5555-5555-5555-555555555504', '-', ''));
SET @img_zflip5  = UNHEX(REPLACE('55555555-5555-5555-5555-555555555505', '-', ''));
SET @img_a55     = UNHEX(REPLACE('55555555-5555-5555-5555-555555555506', '-', ''));
SET @img_x13tp   = UNHEX(REPLACE('55555555-5555-5555-5555-555555555507', '-', ''));
SET @img_rn13p   = UNHEX(REPLACE('55555555-5555-5555-5555-555555555508', '-', ''));
SET @img_n3flip  = UNHEX(REPLACE('55555555-5555-5555-5555-555555555509', '-', ''));
SET @img_reno11p = UNHEX(REPLACE('55555555-5555-5555-5555-555555555510', '-', ''));

-- 3. Primary Product Images
INSERT IGNORE INTO product_images (id, variant_id, image_url, is_primary) VALUES
(@img_ip15p,   @v_ip15p,   'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro_1.png', TRUE),
(@img_ip14pm,  @v_ip14pm,  'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-pro-max.png', TRUE),
(@img_ip13,    @v_ip13,    'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-13_2_.png', TRUE),
(@img_zfold5,  @v_zfold5,  'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-z-fold-5-kem-1.png', TRUE),
(@img_zflip5,  @v_zflip5,  'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-z-flip-5-xanh-mint-1.png', TRUE),
(@img_a55,     @v_a55,     'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-a55.png', TRUE),
(@img_x13tp,   @v_x13tp,   'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-13t-pro_1.png', TRUE),
(@img_rn13p,   @v_rn13p,   'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/r/e/redmi-note-13-pro.png', TRUE),
(@img_n3flip,  @v_n3flip,  'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/o/p/oppo-find-n3-flip-den.png', TRUE),
(@img_reno11p, @v_reno11p, 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/o/p/oppo-reno11-pro_1.png', TRUE);
