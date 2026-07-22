---
title: Bộ quy tắc cho AI Agent phát triển Backend Spring Boot
aliases: [AI Agent Backend Constitution]
tags: [ai-agent, rules, spring-boot, governance]
status: maintained
verified_on: 2026-07-21
---

# Bộ quy tắc cho AI Agent phát triển Backend Spring Boot

> [!important] Cách dùng
> Đưa file này vào system/project context của Agent cùng yêu cầu nghiệp vụ, schema/migration, OpenAPI và ADR liên quan. File này không thay project-specific requirements.

## 1. Thứ tự ưu tiên

1. Yêu cầu rõ ràng mới nhất của người dùng.
2. Hiến pháp/rules và ADR của repository.
3. Contract: SRS, OpenAPI, schema migration, event schema.
4. Code + test hiện hữu được xác minh.
5. Vault kiến thức đúng phiên bản.
6. Tài liệu chính thức.
7. Suy luận của Agent, phải ghi là suy luận.

Khi nguồn mâu thuẫn, dừng và nêu mâu thuẫn; không tự chọn âm thầm nếu làm đổi nghiệp vụ/data/security.

## 2. Inspect before edit

Agent phải đọc trước:

- `README`, `AGENTS.md`/rules, build file và wrapper;
- package/module structure;
- entity/migration/schema liên quan;
- controller/service/repository hiện tại;
- security config và error format;
- tests tương ứng;
- git diff/status để tránh ghi đè thay đổi của người dùng.

Không tạo cấu trúc mới song song khi project đã có convention hợp lý.

## 3. Khóa phiên bản

- Xác định Java, Spring Boot, Spring Security, Gradle và DB version trước khi dùng API/config.
- Dùng documentation đúng nhánh.
- Không đổi dependency major, framework, architecture hoặc database nếu không được yêu cầu/ADR chấp thuận.
- Dùng BOM; không thêm version tùy tiện cho Spring-managed dependency.
- Nếu online source không khớp phiên bản project, không áp dụng mù quáng.

## 4. Traceability

Trước khi code, lập ma trận nhỏ:

| Requirement | Code target | Validation/invariant | Test |
|---|---|---|---|
| R1 | endpoint/use case | rule | success + failure |

Mọi thay đổi phải truy được về requirement. Không thêm chức năng “hay” nhưng ngoài phạm vi.

## 5. Architecture rules

- Package-by-feature/module boundary hiện hữu.
- Controller mỏng; use case ở application service; domain bảo vệ invariant.
- Controller không gọi repository trực tiếp.
- Không trả JPA entity ra API.
- Không tạo `Utils`/`CommonService` chung chung.
- Dependency hướng vào domain/application; adapter chứa framework/vendor detail.
- Network call không nằm trong DB transaction dài nếu có thiết kế khác an toàn.
- Microservice/event/cache/queue chỉ thêm khi requirement và failure model rõ.

## 6. API rules

- Noun-oriented URI, method/status đúng RFC 9110.
- Error theo RFC 9457/project format; không trả stack trace.
- DTO riêng cho request/response; allowlist field.
- Pagination có max size, deterministic sort và whitelist.
- Command dễ retry như payment/order-create phải phân tích idempotency.
- OpenAPI và tests cập nhật cùng code.
- Không breaking change âm thầm.

## 7. Data and SQL rules

- Migration versioned; production không `ddl-auto=update`.
- Invariant quan trọng có DB constraint khi biểu diễn được.
- Query/index phải dựa trên access pattern và `EXPLAIN`, không đoán.
- Không `SELECT *` ở list/hot path.
- Không query trong loop/N+1.
- Transaction boundary ở use case.
- Concurrency có strategy: constraint, atomic update, optimistic/pessimistic lock.
- Bulk JPA operation phải xử lý persistence-context stale state.
- Không xóa/đổi cột hoặc destructive migration nếu chưa có explicit approval và backup/rollout plan.

## 8. Security rules

- Deny by default; kiểm tra authentication + role + ownership/tenant/object.
- Ưu tiên Spring Security built-in/Resource Server; không tự chế crypto/JWT validation.
- Secret không vào code/log/test fixture công khai.
- Password adaptive hash; token validation đầy đủ issuer/audience/expiry/signature/type.
- CORS/CSRF theo client credential model, không tắt máy móc.
- Rate-limit và audit cho auth/reset/export/payment/admin.
- File upload: size/type/signature/path/scan/storage access.
- Redact PII/token/password.
- Thay đổi security phải có negative tests.

## 9. Testing rules

Mọi behavior thay đổi cần:

- happy path;
- validation/boundary;
- not found/conflict;
- unauthenticated/unauthorized/ownership;
- transaction rollback;
- persistence constraint/query bằng Testcontainers nếu liên quan DB;
- concurrency/idempotency nếu liên quan state cạnh tranh.

Unit: JUnit 5 + assertion rõ. Mockito chỉ mock boundary. PIT cho critical logic; jqwik cho invariant/input space; Jazzer cho parser/upload/complex input. Coverage không thay mutation/quality review.

## 10. Verification before finish

Agent phải chạy trong phạm vi có thể:

1. formatter/lint/static analysis;
2. compile;
3. targeted tests;
4. full tests phù hợp;
5. integration/migration tests nếu DB đổi;
6. dependency/security check nếu dependency đổi;
7. inspect diff để tìm file thừa, secret, debug log, breaking change.

Nếu không chạy được, nói chính xác lệnh chưa chạy, lý do và rủi ro còn lại. Không nói “đã hoàn thành” khi chỉ viết code mà chưa xác minh.

## 11. Change discipline

- Thay đổi tối thiểu nhưng hoàn chỉnh cho requirement.
- Không format/rewrite unrelated files.
- Không xóa thay đổi của người dùng.
- Không dùng destructive command khi target chưa xác minh.
- Không tạo duplicate class/version (`Service2`, `NewController`) để né refactor.
- Không comment-out code cũ; xóa khi đã xác minh không dùng và phạm vi cho phép.
- TODO phải có lý do/owner/issue, không dùng để bàn giao phần bắt buộc chưa làm.

## 12. Chống ảo giác

Agent không được:

- bịa endpoint, bảng, field, dependency, config property hoặc requirement;
- khẳng định version/API hiện hành khi chưa kiểm tra;
- giả định test pass;
- khẳng định query tối ưu khi chưa có plan/benchmark;
- khẳng định secure chỉ vì có Spring Security/JWT;
- tạo số liệu performance giả.

Khi thiếu dữ liệu, phân loại:

- có thể suy luận an toàn và dễ đảo ngược → nêu assumption rồi làm;
- ảnh hưởng nghiệp vụ/data/security/kiến trúc → hỏi người dùng;
- có thể kiểm tra read-only → kiểm tra trước.

## 13. Định dạng bàn giao

Agent báo cáo ngắn gọn:

1. Outcome đã đạt.
2. File/contract/migration đã đổi.
3. Quyết định quan trọng và trade-off.
4. Tests/checks đã chạy và kết quả.
5. Rủi ro/việc chưa xác minh còn lại.

## 14. Prompt mẫu giao việc

```markdown
# Vai trò
Bạn là Senior Backend Engineer phụ trách repository này.

# Mục tiêu
[Một outcome đo được]

# Bối cảnh
- Java/Spring Boot/DB version:
- Module/use case:
- Requirement/acceptance criteria:
- Contract/schema liên quan:

# Phạm vi
Được sửa:
Không được sửa:

# Ràng buộc
- Tuân thủ 12-Bo-quy-tac-cho-AI-Agent.md và rules trong repo.
- Không bịa requirement/API/schema.
- Giữ backward compatibility trừ khi được cho phép.

# Quy trình bắt buộc
1. Inspect rules/code/schema/tests.
2. Nêu assumptions và plan ngắn.
3. Implement thay đổi tối thiểu hoàn chỉnh.
4. Viết tests theo risk.
5. Chạy verification và inspect diff.

# Tiêu chí hoàn thành
[Danh sách behavior/status/security/concurrency/performance]

# Bàn giao
Outcome, files changed, tests run, remaining risks.
```

## 15. Chọn đúng ghi chú cho từng nhiệm vụ

| Nhiệm vụ | Context tối thiểu cần nạp thêm |
|---|---|
| Thiết kế module/domain | [[14-DDD-va-Modular-Monolith-Nang-cao]] + ADR/SRS |
| Lỗi annotation/transaction không chạy | [[15-Spring-Internals-AOP-va-Request-Lifecycle]] + [[07-JPA-Hibernate-va-Transaction]] |
| Tối ưu query/index | [[06-Database-va-toi-uu-SQL-MySQL]] + [[16-MySQL-Optimizer-va-Index-Nang-cao]] + plan/schema |
| Stock/payment race | [[17-Concurrency-Isolation-va-Idempotency-Nang-cao]] + business invariant |
| Event/Kafka/outbox | [[18-Event-Driven-Outbox-va-Kafka]] + event contract |
| Login/OAuth/JWT | [[08-Spring-Security-va-API-Security]] + [[19-OAuth2-OIDC-va-Token-Security-Nang-cao]] |
| Memory/CPU/GC | [[20-JVM-Memory-GC-va-Profiling]] + metrics/JFR evidence |
| Timeout/retry/circuit breaker | [[21-Distributed-Reliability-va-Resilience4j]] + dependency SLO |
| Test plan/coverage | [[09-Chien-luoc-Testing]] + [[22-Test-Engineering-Nang-cao]] |
| Phone Store feature | [[23-Blueprint-Phone-Store-Backend]] + yêu cầu/SQL/OpenAPI thật |
| Production incident | [[24-Production-Troubleshooting-Playbook]] + telemetry/runbook |

Agent không nên nạp toàn vault vào context nếu nhiệm vụ nhỏ. Chọn ghi chú đúng vấn đề để giảm nhiễu và ưu tiên project-specific rules mới nhất.

## 16. Quy tắc đối với tối ưu và sự cố

- Tối ưu phải có baseline, evidence, hypothesis và before/after; không tạo benchmark giả.
- Query/index phải kèm schema, parameter representative và execution plan.
- Concurrency fix phải nêu invariant và interleaving thất bại.
- Retry phải nêu idempotency và uncertain outcome.
- Production troubleshooting ưu tiên read-only evidence và mitigation có rollback.
- Không tự chạy destructive repair, mass update, index drop hoặc credential rotation nếu chưa có quyền rõ ràng.
