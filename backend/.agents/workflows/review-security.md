# Review security

Rà soát security theo threat/risk cho thay đổi hoặc toàn module backend.

## Đầu vào

Scope code/API/config/dependency, actor, dữ liệu nhạy cảm, trust boundary và môi trường.

## Bắt buộc đọc

Rules 20/40/50/60; `phone-store-project-context`, `implement-auth-security` và skill domain liên quan.

## Thực hiện

1. Lập inventory endpoint, principal, role/scope, ownership và dữ liệu.
2. Vẽ trust boundary ngắn cho client, backend, DB và provider.
3. Kiểm tra authentication, JWT validation, refresh rotation/replay.
4. Kiểm tra deny-by-default, method/service authorization, IDOR và mass assignment.
5. Kiểm tra input/upload, output/error, CORS/CSRF, rate limit và security headers.
6. Kiểm tra secret/config/log/audit/dependency.
7. Kiểm tra webhook signature, idempotency, replay và amount/currency.
8. Chạy security audit script và test negative paths.
9. Xếp finding theo severity + exploitability + impact; đưa bằng chứng vị trí.
10. Nếu chỉ được yêu cầu review, không tự sửa; đề xuất remediation cụ thể.

## Báo cáo

Finding theo Critical/High/Medium/Low, bằng chứng, kịch bản tấn công, ảnh hưởng, cách sửa, test xác minh và false-positive/giả định.

