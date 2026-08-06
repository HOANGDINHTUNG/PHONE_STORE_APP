CREATE TABLE admin_settings (
    setting_key VARCHAR(100) NOT NULL PRIMARY KEY,
    setting_value TEXT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by VARCHAR(255) NULL
) ENGINE=InnoDB;

INSERT INTO admin_settings (setting_key, setting_value, updated_by) VALUES
 ('system_name', 'PinkPhone Admin', 'seed-admin'),
 ('timezone', 'Asia/Ho_Chi_Minh', 'seed-admin'),
 ('default_language', 'vi', 'seed-admin'),
 ('email_notifications', 'true', 'seed-admin'),
 ('push_notifications', 'true', 'seed-admin'),
 ('alert_email', 'admin@pinkphone.vn', 'seed-admin'),
 ('password_min_length', '12', 'seed-admin'),
 ('session_timeout_minutes', '30', 'seed-admin'),
 ('theme', 'light', 'seed-admin');

CREATE TABLE support_articles (
    id BINARY(16) NOT NULL PRIMARY KEY,
    slug VARCHAR(160) NOT NULL UNIQUE,
    category VARCHAR(80) NOT NULL,
    title VARCHAR(255) NOT NULL,
    summary VARCHAR(500) NULL,
    content LONGTEXT NOT NULL,
    views INT NOT NULL DEFAULT 0,
    published BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO support_articles (id, slug, category, title, summary, content) VALUES
(UUID_TO_BIN(UUID()), 'huong-dan-su-dung', 'Hướng dẫn sử dụng', 'Hướng dẫn sử dụng PinkPhone Admin', 'Các thao tác cơ bản để sử dụng khu vực quản trị.', '# Hướng dẫn sử dụng\n\nĐăng nhập bằng tài khoản quản trị được cấp. Thanh điều hướng bên trái mở các nghiệp vụ: sản phẩm, đơn hàng, kho, nhập hàng và người dùng.\n\n## Tìm kiếm và lọc\n\nNhập từ khóa vào ô tìm kiếm, chọn bộ lọc rồi bấm Tìm kiếm. Các bảng đều hỗ trợ phân trang.\n\n## Lưu thay đổi\n\nSau khi cập nhật biểu mẫu, kiểm tra lại dữ liệu và bấm nút Lưu. Hệ thống sẽ ghi nhật ký kiểm toán cho các thao tác quan trọng.'),
(UUID_TO_BIN(UUID()), 'quy-trinh-nhap-hang', 'Quy trình vận hành', 'Quy trình nhập hàng vào hệ thống', 'Tạo phiếu nhập, kiểm tra số lượng và cập nhật tồn kho đúng quy trình.', '# Quy trình nhập hàng\n\n## 1. Tạo phiếu nhập kho\n\nMở mục Nhập hàng, bấm Tạo phiếu nhập mới, chọn nhà cung cấp và kho nhận. Thêm SKU cùng số lượng và đơn giá nhập rồi lưu bản nháp.\n\n## 2. Kiểm tra và nhận hàng\n\nĐối chiếu số lượng thực tế với phiếu. Với sản phẩm có IMEI/serial, nhập đủ định danh trước khi xác nhận nhận hàng.\n\n## 3. Hoàn tất\n\nBấm Nhận hàng để cập nhật tồn kho. Hệ thống ghi giao dịch vào Nhật ký kho và chuyển trạng thái phiếu sang Hoàn tất.'),
(UUID_TO_BIN(UUID()), 'xu-ly-loi-thuong-gap', 'Xử lý lỗi thường gặp', 'Xử lý lỗi thường gặp', 'Các cách kiểm tra nhanh khi thao tác quản trị không thành công.', '# Xử lý lỗi thường gặp\n\n## Không tải được dữ liệu\n\nKiểm tra backend đang chạy ở cổng 8080, token quản trị còn hạn và tài khoản có quyền ADMIN.\n\n## Không lưu được biểu mẫu\n\nKiểm tra các trường bắt buộc, mã SKU, kho và nhà cung cấp có tồn tại. Nếu lỗi vẫn còn, mở Nhật ký kiểm toán để lấy correlation ID gửi cho đội kỹ thuật.\n\n## Ảnh không hiển thị\n\nKiểm tra URL ảnh có thể truy cập từ trình duyệt và dùng đường dẫn tuyệt đối HTTPS khi triển khai.');

CREATE TABLE support_tickets (
    id BINARY(16) NOT NULL PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    requester VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
