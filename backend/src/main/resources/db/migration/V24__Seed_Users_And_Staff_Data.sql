-- V24__Seed_Users_And_Staff_Data.sql
-- Seed Departments, Positions, Users, Staff Profiles, and Customer Profiles

-- 1. Departments
INSERT INTO departments (id, code, name, status)
VALUES
(UNHEX(REPLACE('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '-', '')), 'DEPT-SOFT', 'Phát triển Phần mềm', 'ACTIVE'),
(UNHEX(REPLACE('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', '-', '')), 'DEPT-MKT', 'Marketing', 'ACTIVE'),
(UNHEX(REPLACE('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', '-', '')), 'DEPT-WH', 'Kho hàng', 'ACTIVE'),
(UNHEX(REPLACE('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', '-', '')), 'DEPT-HR', 'Nhân sự', 'ACTIVE')
ON DUPLICATE KEY UPDATE status = 'ACTIVE';

-- 2. Positions
INSERT INTO positions (id, department_id, code, name, status)
VALUES
(UNHEX(REPLACE('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', '-', '')), UNHEX(REPLACE('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '-', '')), 'POS-FE', 'Senior Frontend Developer', 'ACTIVE'),
(UNHEX(REPLACE('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', '-', '')), UNHEX(REPLACE('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '-', '')), 'POS-EM', 'Engineering Manager', 'ACTIVE'),
(UNHEX(REPLACE('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', '-', '')), UNHEX(REPLACE('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', '-', '')), 'POS-MKT', 'Content Specialist', 'ACTIVE'),
(UNHEX(REPLACE('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4', '-', '')), UNHEX(REPLACE('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', '-', '')), 'POS-WH', 'Nhân viên kho', 'ACTIVE')
ON DUPLICATE KEY UPDATE status = 'ACTIVE';

-- 3. Seed Users
INSERT INTO users (id, username, email, phone, password_hash, account_status, role, active, created_at)
VALUES
(UNHEX(REPLACE('00000000-0000-0000-0000-000000000124', '-', '')), 'nva_cust', 'nva@example.com', '0901234567', '$2a$10$abcdefghijklmnopqrstuu', 'ACTIVE', 'USER', 1, '2023-01-01 10:00:00'),
(UNHEX(REPLACE('00000000-0000-0000-0000-000000000892', '-', '')), 'tranb_staff', 'tranb@pinkphone.vn', '0987654321', '$2a$10$abcdefghijklmnopqrstuu', 'ACTIVE', 'STAFF', 1, '2022-06-15 09:00:00'),
(UNHEX(REPLACE('00000000-0000-0000-0000-000000001005', '-', '')), 'levanc_cust', 'levanc@mail.com', '0912345678', '$2a$10$abcdefghijklmnopqrstuu', 'PENDING_VERIFICATION', 'USER', 1, '2023-10-12 14:00:00'),
(UNHEX(REPLACE('00000000-0000-0000-0000-000000000442', '-', '')), 'phamvd_cust', 'phamvd@spam.com', '0933445566', '$2a$10$abcdefghijklmnopqrstuu', 'LOCKED', 'USER', 0, '2023-01-10 11:00:00')
ON DUPLICATE KEY UPDATE account_status = VALUES(account_status);

-- 4. Seed Staff Profiles
INSERT INTO staff_profiles (user_id, employee_code, full_name, position_id, manager_id, employment_status, hire_date)
VALUES
(UNHEX(REPLACE('00000000-0000-0000-0000-000000000892', '-', '')), 'EMP-0005', 'Trần Thị Bích', UNHEX(REPLACE('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', '-', '')), NULL, 'ACTIVE', '2019-02-01')
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);

-- 5. Seed Customer Profiles
INSERT INTO customer_profiles (user_id, customer_code, full_name, date_of_birth, gender, marketing_opt_in, customer_status)
VALUES
(UNHEX(REPLACE('00000000-0000-0000-0000-000000000124', '-', '')), 'CUST-84920', 'Nguyễn Trần Vân Anh', '1992-08-15', 'Nữ', 1, 'ACTIVE'),
(UNHEX(REPLACE('00000000-0000-0000-0000-000000001005', '-', '')), 'CUST-84919', 'Trần Hoàng Minh', '1988-11-22', 'Nam', 0, 'ACTIVE'),
(UNHEX(REPLACE('00000000-0000-0000-0000-000000000442', '-', '')), 'CUST-84918', 'Lê Thị Thanh', '1995-02-05', 'Nữ', 1, 'LOCKED')
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);
