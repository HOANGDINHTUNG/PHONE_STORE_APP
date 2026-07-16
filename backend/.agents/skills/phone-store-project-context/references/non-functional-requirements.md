# Yêu cầu phi chức năng

## Bảo mật

- Tuân thủ OWASP, least privilege, deny-by-default và không ghi log secret/PII nhạy cảm.
- Mật khẩu dùng thuật toán adaptive; JWT ngắn hạn; refresh token xoay vòng và có thể thu hồi.
- Dependency và image phải được quét trong CI.

## Độ tin cậy

- Endpoint ghi quan trọng hỗ trợ idempotency.
- Payment callback, giữ kho và tạo đơn phải chịu được retry, duplicate và out-of-order.
- Migration có kế hoạch rollback/forward-fix và backup tương xứng rủi ro.

## Hiệu năng

- Định nghĩa SLO theo môi trường; không tuyên bố con số chưa đo.
- Catalog đọc nhiều được cache có kiểm soát; dữ liệu tồn kho/giá phải có chiến lược nhất quán.
- Mọi truy vấn danh sách phải phân trang và có index dựa trên query thật.

## Quan sát

- Log có cấu trúc với correlation ID, không chứa token.
- Có metric cho latency, error rate, throughput, pool, cache, payment và reservation.
- Liveness không phụ thuộc downstream; readiness phản ánh khả năng phục vụ.

## Khả năng bảo trì

- Java 21, dependency được pin/BOM quản lý, build tái lập.
- Kiến trúc module rõ, test pyramid, ADR cho quyết định khó đảo ngược.
- Không hoàn thành thay đổi nếu thiếu test và docs tương ứng.

