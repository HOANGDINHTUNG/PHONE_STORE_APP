# Quality gates

## Bắt buộc trước merge

- Compile và static analysis pass.
- Unit, slice, integration liên quan pass.
- Migration validator và schema test pass.
- Security/dependency scan không có finding vượt policy.
- API/OpenAPI diff được review.
- OpenAPI parse/ref/example/security/duplicate operationId pass; implementation conformance không drift.
- Swagger/docs profile test chứng minh local/demo được bật và production không public ngoài policy.
- Không có test disabled mới không có lý do/issue.
- Coverage của code mới đạt ngưỡng dự án và bao phủ branch rủi ro.
- Docs/ADR/runbook được cập nhật nếu tác động.

## Bắt buộc trước release

- Full regression pass trên artifact định phát hành.
- Smoke test image/container.
- Migration rehearsal và backup/rollback plan.
- Vulnerability/image scan.
- Staging verification, metric/alert và owner theo dõi.
- Không release nếu gate bị bỏ qua không có phê duyệt ghi nhận.

## Advanced test gates

### Pull request

- JUnit 5, Mockito và jqwik test phải pass.
- Jazzer regression corpus phải pass trong `./gradlew test`.
- Không được bỏ seed hoặc counterexample đang tái hiện lỗi.
- Module domain/application thay đổi phải được đánh giá có cần PITest hay không.

### Mutation testing

- Chạy PITest trên module pricing, inventory, checkout, order, payment và authorization bị thay đổi.
- Không có mutation sống sót nghiêm trọng trên invariant hoặc security guard.
- Exclusion phải có lý do và được review.
- Mutation report phải được lưu làm CI artifact.

### Fuzzing

- Fuzz target phải có timeout và giới hạn tài nguyên.
- Crash input phải được lưu thành corpus hoặc regression test.
- Không cho fuzz test truy cập production, internet hoặc shared database.
- Campaign dài chạy nightly hoặc trước release đối với parser/security boundary.
