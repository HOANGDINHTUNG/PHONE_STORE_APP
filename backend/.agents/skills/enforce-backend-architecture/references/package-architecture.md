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

Tên package thể hiện năng lực nghiệp vụ, không dùng `utils` hoặc `helpers` mơ hồ.

