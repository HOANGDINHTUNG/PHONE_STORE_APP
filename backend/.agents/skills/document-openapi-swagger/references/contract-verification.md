# Contract verification

## Gate tối thiểu

1. Parse OpenAPI 3.1 và resolve toàn bộ `$ref`.
2. Lint naming, path, schema và security.
3. Phát hiện duplicate `operationId` và path/method.
4. Validate request/response example với schema.
5. Kiểm tra protected/public operation đúng SecurityFilterChain.
6. So sánh controller/API-interface inventory với contract.
7. Chạy breaking-change diff với baseline đang support.
8. Chạy contract/conformance test cho status, content type, body, header và ProblemDetail.

Pin linter/generator/plugin trong project hoặc CI; không cài global và không phụ thuộc `latest`. Dùng tài liệu chính thức của tool/version đã chọn.

## Spring tests

- Web slice: JSON binding, Bean Validation, unknown field, content type, 401/403, ownership và error handler.
- Integration/full HTTP: filter chain, upload, CORS/header, serialization thật và adapter stub.
- Swagger exposure: local/demo trả docs/UI; production không expose UI/runtime spec theo policy.
- Code-first: gọi `/v3/api-docs`, assert OpenAPI 3.1, `bearerAuth`, operationId duy nhất và schema chính.
- Contract-first: validate `docs/api/openapi.yaml` trực tiếp và xác nhận Swagger UI trỏ đúng runtime copy của chính file đó.

## CI artifact

- Contract-first: lưu validated `docs/api/openapi.yaml` và diff report.
- Code-first: export spec đã sinh, lint/diff rồi lưu artifact; không coi build output là source.
- Không báo PASS nếu test bị skip, spec không parse, UI chỉ mở nhưng operation sai hoặc production vẫn public docs ngoài policy.

## Báo cáo

Nêu source of truth, strategy, dependency/version, docs URLs theo profile, số operation/tag/schema, lint/diff/conformance result, Try it out behavior, production exposure và mọi drift chưa giải quyết.
