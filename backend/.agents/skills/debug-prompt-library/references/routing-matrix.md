# Routing Matrix

## Mục lục

- Quy tắc chung
- Ma trận mã prompt
- Dấu hiệu phân loại tự động
- Trường hợp giao nhau

## Quy tắc chung

Mọi mã đều đọc `00-project-constitution.md` và `60-safe-change-policy.md`. Mọi mã FIX đọc `50-testing-requirements.md`. Nạp `phone-store-project-context` khi lỗi có thể ảnh hưởng hành vi nghiệp vụ.

Chỉ đọc reference cần cho lỗi hiện tại; không nạp toàn bộ thư viện vào ngữ cảnh nếu không cần.

## Ma trận mã prompt

| Mã | Rules chính | Skills/workflows chính |
| --- | --- | --- |
| `P00` | Theo mã được phân loại | `debug-backend`, sau đó nhánh phù hợp |
| `P01` | Theo phạm vi lỗi | `debug-backend`, `optimize-observability` |
| `P02` | 10, 50, 60 | `enforce-backend-architecture`, `test-backend-quality` |
| `P03` | 10, 50, 60 | `bootstrap-spring-backend`, `test-backend-quality` |
| `P04` | 10, 20, 50, 60 | `bootstrap-spring-backend`, `enforce-backend-architecture` |
| `P05` | 20, 40, 50, 60 | `design-rest-api`, `implement-auth-security` khi có auth |
| `P06` | 20, 40, 50, 60 | `implement-auth-security`, `review-security` |
| `P07` | 10, 30, 50, 60 | `design-database-migrations`, domain skill |
| `P08` | 20, 30, 40, 50, 60 | context, architecture và domain skill |
| `P09` | 50, 60 và rule của code bị test | `test-backend-quality`, `run-quality-gate` |
| `P10` | 20, 30, 50, 60 | `optimize-observability`, domain skill |
| `P11` | 20, 30, 50, 60 | `deliver-backend`, `release-backend` chỉ để tham chiếu gate |
| `P12` | Theo failure boundary | `debug-backend`, observability và mọi nhánh đã cô lập |

## Dấu hiệu phân loại tự động

| Dấu hiệu nổi bật | Mã ưu tiên |
| --- | --- |
| `Could not resolve`, `Could not find`, compile error, plugin/toolchain/version conflict | `P03` |
| `APPLICATION FAILED TO START`, `BeanCreationException`, `UnsatisfiedDependencyException`, property binding | `P04` |
| `MethodArgumentTypeMismatchException`, `HttpMessageNotReadableException`, 400/404/405/409/415/422, JSON/DTO | `P05` |
| 401/403, JWT signature/expiry, filter chain, role/ownership, CORS/CSRF | `P06` |
| `SQLException`, SQLState, constraint, Hibernate mapping/query, Flyway validation/checksum | `P07` |
| duplicate order/payment, stock âm, transition sai, lost update, optimistic lock, race condition | `P08` |
| assertion/mock/context/container fail, flaky, mutation survived, fuzz/PBT counterexample | `P09` |
| N+1, slow query, timeout, OOM, CPU cao, pool exhausted, cache inconsistency | `P10` |
| Docker build/run, healthcheck, Compose, env mismatch, CI stage/image fail | `P11` |
| intermittent, multi-service, không có stack trace, nhiều fix trước đều thất bại | `P12` |

## Trường hợp giao nhau

- HTTP 500 chỉ là lớp ngoài: dùng exception gốc để quyết định `P05`, `P06`, `P07` hoặc `P08`.
- Spring context fail do missing dependency: `P03` là chính, `P04` hỗ trợ.
- Security test fail: `P06` là chính nếu behavior bảo mật sai; `P09` là chính nếu test/fixture/tooling sai.
- Query chậm do thiếu index: `P10` là chính và `P07` xử lý migration/index.
- Checkout race gây constraint error: `P08` là chính, `P07` hỗ trợ tính nguyên tử ở database.
- Pipeline fail vì test production thực sự sai: chọn mã theo root cause, không mặc định `P11`.
