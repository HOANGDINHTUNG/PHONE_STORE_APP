-- ============================================================================
-- V17: SEED BANNERS AND NEWS DEMO DATA
-- ============================================================================

-- 1. SEED BANNERS
SET @b1 = UNHEX(REPLACE('66666666-6666-6666-6666-666666666661', '-', ''));
SET @b2 = UNHEX(REPLACE('66666666-6666-6666-6666-666666666662', '-', ''));

INSERT IGNORE INTO banners (id, title, label, subtitle, image_url, bg_color, text_color, position, sort_order, status) VALUES
(@b1, 'The Ultra X 2024 - Đỉnh Cao Công Nghệ', 'EXCLUSIVE RELEASE', 'Trải nghiệm sức mạnh xử lý vượt trội và camera 200MP chuyên nghiệp thế hệ mới.', '/images/banner1.png', 'linear-gradient(135deg, #A8868A 0%, #D7B4B9 100%)', '#ffffff', 'HERO', 1, 'ACTIVE'),
(@b2, 'iPhone 15 Pro Max Pink Edition', 'NEW ARRIVAL', 'Đẳng cấp titan bền bỉ kết hợp sắc hồng quý phái đầy lôi cuốn.', '/images/banner2.png', 'linear-gradient(135deg, #FAD0C4 0%, #FFD1FF 100%)', '#333333', 'HERO', 2, 'ACTIVE');

-- 2. SEED NEWS
SET @n1 = UNHEX(REPLACE('77777777-7777-7777-7777-777777777771', '-', ''));
SET @n2 = UNHEX(REPLACE('77777777-7777-7777-7777-777777777772', '-', ''));
SET @n3 = UNHEX(REPLACE('77777777-7777-7777-7777-777777777773', '-', ''));
SET @n4 = UNHEX(REPLACE('77777777-7777-7777-7777-777777777774', '-', ''));

INSERT IGNORE INTO news (id, tag, title, description, image_url, published_at, status) VALUES
(@n1, 'REVIEW', 'Đánh giá chi tiết iPhone 15 Pro Max sau 6 tháng sử dụng: Vẫn là nhà vua?', 'Trải nghiệm thực tế về hiệu năng pin, camera và độ bền của khung viền Titan sau nửa năm ra mắt...', '/images/news1.png', '2026-07-30 00:00:00', 'PUBLISHED'),
(@n2, 'TIN MỚI', 'Chip Snapdragon 8 Gen 4 lộ diện điểm hiệu năng khủng khiếp', 'Sức mạnh xử lý AI vượt xa thế hệ cũ, hứa hẹn thay đổi hoàn toàn trải nghiệm người dùng trên flagship...', '/images/news2.png', '2026-07-29 00:00:00', 'PUBLISHED'),
(@n3, 'THỦ THUẬT', '5 Mẹo chụp ảnh chuyên nghiệp bằng điện thoại Android có thể bạn chưa biết', 'Tận dụng tối đa cảm biến 200MP và các chế độ chụp đêm để có những bức ảnh lung linh nhất...', '/images/news3.png', '2026-07-28 00:00:00', 'PUBLISHED'),
(@n4, 'Mẹo hay', 'Cách tối ưu hóa thời lượng pin trên iOS 18 cực đơn giản', 'Chỉ với vài bước tùy chỉnh nhỏ, bạn có thể tăng thêm 15-20% thời gian sử dụng pin mỗi ngày...', '/images/news4.png', '2026-07-27 00:00:00', 'PUBLISHED');
