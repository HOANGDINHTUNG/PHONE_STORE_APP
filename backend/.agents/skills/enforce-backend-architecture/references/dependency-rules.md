# Dependency rules

## Hướng cho phép

- `api -> application`
- `application -> domain`
- `infrastructure -> application/domain` để implement port.
- `domain -> Java/JDK và abstraction thuần domain`.

## Cấm

- `controller -> repository`.
- `domain -> api/infrastructure/Spring MVC`.
- Import entity JPA của module khác.
- Circular dependency giữa module.
- Static global mutable state.
- Application service gọi trực tiếp SDK ngoài thay vì port/adapter.

## Kiểm soát

- Dùng ArchUnit hoặc Modulith test cho boundary quan trọng.
- Constructor injection; dependency bắt buộc là `final`.
- Transaction bắt đầu ở application service ghi.
- Tác vụ ngoài transaction dùng outbox/event sau commit khi cần.

