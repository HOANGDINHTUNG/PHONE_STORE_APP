# springdoc và Swagger UI

## Chọn dependency

1. Đọc version Spring Boot và web stack từ build thực tế.
2. Tra compatibility matrix chính thức tại `https://springdoc.org/` ở thời điểm triển khai.
3. Pin một version cụ thể:

```gradle
implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:<PINNED_COMPATIBLE_VERSION>'
```

Dùng `springdoc-openapi-starter-webflux-ui` thay cho WebMVC chỉ khi dự án thật sự dùng WebFlux. Không thêm cả hai, không dùng Springfox và không dùng dynamic version.

Spring Boot 3.5.x dùng dòng springdoc 2.8.x; Spring Boot 4.x dùng dòng springdoc 3.x theo matrix hiện hành. Luôn xác minh lại trước khi pin.

## Contract-first configuration

Giữ `docs/api/openapi.yaml` là nguồn. Swagger UI đọc runtime copy của file này:

```yaml
springdoc:
  api-docs:
    enabled: false
  swagger-ui:
    enabled: true
    path: /swagger-ui.html
    url: /openapi/openapi.yaml
```

- Tạo runtime copy bằng Gradle `processResources` hoặc cơ chế build hiện có; nguồn luôn là `docs/api/openapi.yaml`.
- Không duy trì thủ công một bản thứ hai dưới `src/main/resources`.
- Nếu version springdoc cần bean/config tối thiểu để dùng external spec, làm theo tài liệu chính thức của đúng version.
- Chặn `/openapi/**` trong production nếu artifact vẫn chứa runtime copy.

## Code-first configuration

Chỉ dùng khi ADR đã chọn code-first:

```yaml
springdoc:
  api-docs:
    enabled: true
    path: /v3/api-docs
    version: OPENAPI_3_1
  swagger-ui:
    enabled: true
    path: /swagger-ui.html
    url: /v3/api-docs
```

Export JSON/YAML được sinh, lint và diff trong CI. Không sửa thêm file contract viết tay như nguồn song song.

## UI local/demo hữu ích

```yaml
springdoc:
  swagger-ui:
    try-it-out-enabled: true
    supported-submit-methods: [get, post, put, patch, delete]
    display-request-duration: true
    display-operation-id: true
    filter: true
    deep-linking: true
    operations-sorter: method
    tags-sorter: alpha
    doc-expansion: none
    default-models-expand-depth: 2
    disable-swagger-default-url: true
    persist-authorization: true
```

- `persist-authorization` chỉ bật local/demo vì token được giữ trong browser.
- Không đưa OAuth client secret, JWT mẫu thật hoặc credential provider vào UI config.
- Không bật CORS wildcard; Swagger cùng origin không cần nới CORS.
- Chỉ tạo `GroupedOpenApi` ở code-first khi group không chồng lặp và thật sự giúp catalog lớn. Contract-first dùng tags trong spec và một nguồn YAML.

## Metadata

- Lấy title/version/contact/server từ project config hoặc dữ liệu thật.
- Không bịa production URL, license, email hay tên tổ chức.
- `info.version` là version hợp đồng, không phải version OpenAPI.
- Baseline của dự án là OpenAPI 3.1.2; chỉ nâng khi toàn bộ linter, springdoc, generator và client hỗ trợ.
