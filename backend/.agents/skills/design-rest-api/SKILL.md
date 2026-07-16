---
name: design-rest-api
description: Thiết kế, triển khai và review REST API versioned cho backend cửa hàng điện thoại, gồm resource naming, HTTP semantics, response/error contract, pagination, filtering, validation và compatibility. Dùng khi tạo/sửa endpoint, DTO, OpenAPI, controller, API contract hoặc đánh giá breaking change.
---

# Design REST API

Đọc rules 40, 20, 50, 60, project context và module skill liên quan.

## Quy trình

1. Xác định use case/resource bằng [rest-conventions.md](references/rest-conventions.md).
2. Chọn success contract theo [response-contracts.md](references/response-contracts.md).
3. Thiết kế list endpoint theo [pagination-filtering.md](references/pagination-filtering.md).
4. Chuẩn hóa lỗi theo [validation-errors.md](references/validation-errors.md).
5. Đánh giá compatibility bằng [api-versioning.md](references/api-versioning.md).
6. Viết OpenAPI/endpoint doc từ [endpoint-documentation.md](assets/endpoint-documentation.md) trước hoặc cùng code.
7. Chạy `python3 scripts/scan_endpoints.py <project-root>`.
8. Viết controller slice, authorization và integration/contract test.

## Ràng buộc

- API dưới `/api/v1` trừ endpoint hạ tầng đã quy định.
- Không trả entity JPA, stack trace hoặc message nội bộ.
- ID, timestamp, money, enum và nullability phải nhất quán.
- Endpoint ghi quan trọng hỗ trợ idempotency/optimistic concurrency theo use case.
- Sort/filter dùng allowlist; danh sách luôn phân trang.
- Breaking change cần version/deprecation/migration plan.

