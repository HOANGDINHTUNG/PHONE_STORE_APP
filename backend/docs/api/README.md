# API

Lưu OpenAPI contract, endpoint notes, compatibility/deprecation và example đã redaction.

## Quy tắc

- OpenAPI phải khớp controller/DTO/error thực tế.
- Ghi authentication, authorization, ownership và idempotency.
- Không dùng example chứa token, secret hoặc PII thật.
- Mọi breaking change có version/deprecation/migration guide.
- Diff OpenAPI là một phần review.

Bắt đầu từ [openapi.template.yaml](openapi.template.yaml).

