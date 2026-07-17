---
name: enforce-backend-architecture
description: Thiết kế và kiểm soát kiến trúc backend Spring theo module nghiệp vụ, package boundary, dependency direction, DTO mapping và ownership. Dùng khi tạo module, triển khai feature, refactor, review pull request, phát hiện coupling hoặc ngăn controller/service/repository phụ thuộc sai tầng.
---

# Enforce Backend Architecture

Đọc project context và rules 10, 30, 40, 50, 60 trước khi thay đổi cấu trúc.

## Quy trình

1. Xác định module sở hữu use case bằng [module-boundaries.md](references/module-boundaries.md).
2. Chọn package theo [package-architecture.md](references/package-architecture.md).
3. Kiểm tra hướng phụ thuộc trong [dependency-rules.md](references/dependency-rules.md).
4. Thiết kế model biên theo [dto-mapping-rules.md](references/dto-mapping-rules.md).
5. Triển khai lát dọc nhỏ nhất: contract, application, domain, adapter, test.
6. Chạy `python3 scripts/validate_architecture.py <project-root>`.
7. Ghi ADR nếu thay đổi boundary hoặc tạo dependency khó đảo ngược.

## Ràng buộc

- Controller không chứa nghiệp vụ và không gọi repository trực tiếp.
- Domain không phụ thuộc Spring MVC, JPA repository, HTTP client hoặc DTO API.
- Module không ghi bảng của module khác.
- Không trả entity persistence ra API.
- Tránh package `common` thành nơi chứa mọi thứ; chỉ chia sẻ primitive đã ổn định.
- Dùng event/outbox khi cần nhất quán cuối cùng xuyên module.
- OpenAPI/Swagger chỉ nằm ở API boundary. `*Api` interface code-first phải ở module sở hữu Controller; không tạo package toàn cục mới hoặc đưa annotation vào domain/entity.

## Báo cáo

Nêu boundary trước/sau, dependency mới, invariant được bảo vệ, test kiến trúc và rủi ro migration.
