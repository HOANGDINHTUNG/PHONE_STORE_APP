# OpenAPI source of truth

## Quyết định bắt buộc

| Tình trạng dự án | Chiến lược | Artifact được sửa |
| --- | --- | --- |
| Có `docs/api/openapi.yaml`, không có ADR code-first | Contract-first | `docs/api/openapi.yaml` |
| Có ADR code-first và CI export spec | Code-first | API interface/DTO annotation và config sinh spec |
| Spec và annotation cùng được sửa tay | Conflict | Dừng, lập inventory và xin chọn một nguồn |
| Chưa có spec/ADR | Contract-first theo rule 40 | Tạo `docs/api/openapi.yaml` từ behavior đã xác minh |

## Contract-first

- `docs/api/openapi.yaml` quyết định path, method, parameter, request, response, header, security và example công khai.
- Swagger UI phải đọc chính contract này hoặc bản runtime copy được tạo tự động từ nó.
- Bản copy trong `build/`, classpath hoặc static resource là generated artifact; không sửa tay.
- Controller/DTO được viết tay hoặc generate đều phải được contract test đối chiếu với spec.
- Nếu dùng OpenAPI Generator, pin plugin/generator version, không sửa file generated và review diff sau regeneration.

## Code-first có ADR

- Annotation chỉ nằm tại HTTP boundary: `*Api` interface và request/response DTO.
- Đặt interface trong module sở hữu endpoint, cạnh API/controller hiện có; không tạo một kiến trúc package mới toàn dự án.
- `@RequestMapping`, method mapping, binding/validation và OpenAPI annotation nằm tại interface nếu Spring version hỗ trợ đầy đủ.
- Controller implementation giữ `@RestController`, dependency injection, `@Override`, gọi application service và trả response.
- Không khai báo lại mapping hoặc documentation annotation trên implementation.
- Export spec từ runtime/build, validate và diff với baseline trong CI.

## Phát hiện drift

Lập ba inventory độc lập:

1. Path/method/status từ OpenAPI.
2. Mapping/request/response từ Spring Controller hoặc API interface.
3. Behavior từ controller/integration tests.

Phân loại mỗi khác biệt là:

- spec sai với behavior đã phê duyệt;
- implementation chưa theo contract;
- test thiếu hoặc cũ;
- breaking change chưa có kế hoạch.

Không đồng bộ tự động trước khi xác định nguồn mô tả hiện trạng và nguồn mô tả mong muốn.
