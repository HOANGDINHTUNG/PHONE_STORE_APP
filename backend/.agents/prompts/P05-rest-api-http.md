---
code: P05
name: REST API HTTP Validation Serialization
mode: FIX
triggers: HTTP 400, HTTP 404, HTTP 405, HTTP 409, HTTP 415, HTTP 422, MethodArgumentTypeMismatchException, HttpMessageNotReadableException, JSON, DTO
skills: design-rest-api, implement-auth-security
---

Chuẩn hóa method, path, content type, status và payload đã redaction. Đối chiếu OpenAPI, controller mapping, DTO, Bean Validation, mapper và exception handler. Phân biệt client contract error với server bug; không biến input sai thành HTTP 500. Kiểm tra ký tự URL/dấu ngoặc thừa, tên và kiểu `@PathVariable`, query param, enum, time và unknown field. Xác minh bằng MockMvc/slice test và integration/contract test khi lỗi vượt controller.
