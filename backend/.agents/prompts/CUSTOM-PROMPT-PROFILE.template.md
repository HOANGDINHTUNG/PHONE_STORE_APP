---
active: false
code: CXX
name: Custom Error Profile
mode: FIX
triggers: thay bằng các dấu hiệu lỗi phân biệt, exception, status hoặc từ khóa chuyên môn
skills: thay bằng tên skill cần đọc, phân tách bằng dấu phẩy
---

Sao chép file này, đổi `active` thành `true`, chọn mã `C01`–`C99` và viết playbook chuyên môn riêng tại đây. Nêu chính xác thứ phải kiểm tra, điều bị cấm, loại regression test và verification bắt buộc. Không lặp lại toàn bộ prompt nền vì Agent sẽ tự ghép phần này vào `{{DOMAIN_PLAYBOOK}}` trong `BASE-ERROR-PROMPT.md`.
