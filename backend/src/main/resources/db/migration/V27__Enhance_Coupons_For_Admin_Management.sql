ALTER TABLE coupons ADD COLUMN name VARCHAR(255) NULL AFTER code;
ALTER TABLE coupons ADD COLUMN description TEXT NULL AFTER name;
ALTER TABLE coupons ADD COLUMN total_usage_limit INT NULL AFTER per_customer_limit;
