# Package architecture

Ưu tiên package theo feature/module, sau đó phân lớp bên trong:

```text
com.company.phonestore
  identity
    api
    application
    domain
    infrastructure
  catalog
  inventory
  cart
  checkout
  order
  payment
  shipping
  shared
```

## Vai trò

- `api`: controller, request/response DTO, API mapper.
- `application`: use case, command/query, transaction boundary, port.
- `domain`: aggregate, value object, domain service/event, invariant.
- `infrastructure`: JPA, messaging, external client, configuration adapter.
- `shared`: kiểu nền tảng thật sự ổn định; không chứa nghiệp vụ module.

## OpenAPI/Swagger placement

- Contract-first: source nằm tại `docs/api/openapi.yaml`; runtime copy là generated resource.
- Code-first có ADR: đặt `*Api` interface trong package API/controller của chính module, cạnh request/response DTO và Controller implementation.
- Giữ naming/package hiện tại của repository; không tạo `presentation/`, `swagger/` hoặc `common/api` toàn cục chỉ để gom annotation.
- OpenAPI config hạ tầng có thể nằm trong root `config` hoặc infrastructure config theo convention hiện có.

Tên package thể hiện năng lực nghiệp vụ, không dùng `utils` hoặc `helpers` mơ hồ.
