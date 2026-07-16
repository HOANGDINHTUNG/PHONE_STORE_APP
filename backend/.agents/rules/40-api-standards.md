# Phone Store Backend — Api Standards

## 1. Mục đích

Rule này bảo đảm API:

- nhất quán giữa các module;
- đúng ngữ nghĩa HTTP;
- an toàn cho dữ liệu, tiền, tồn kho và quyền truy cập;
- dễ sử dụng từ web và mobile;
- có hợp đồng rõ ràng, kiểm thử được và tương thích ngược;
- không để chi tiết Spring, JPA hoặc cơ sở dữ liệu rò rỉ ra bên ngoài;
- đủ ổn định để nhiều nhóm phát triển song song.

Rule này điều chỉnh lớp HTTP contract. Logic nghiệp vụ vẫn phải tuân theo:

1. `00-project-constitution.md`;
2. `20-security-guardrails.md`;
3. `30-database-guardrails.md`;
4. `10-java-spring-standards.md`;
5. rule này;
6. các rule kiểm thử và safe-change liên quan.

Nếu có xung đột:

- bảo mật và tính đúng đắn nghiệp vụ được ưu tiên hơn sự tiện lợi của client;
- hợp đồng chính thức của nhà cung cấp được ưu tiên cho webhook hoặc callback của chính nhà cung cấp đó;
- mọi ngoại lệ phải được ghi lại, có lý do, phạm vi và kế hoạch loại bỏ.

---

## 2. Từ khóa quy phạm

Các từ sau có ý nghĩa bắt buộc:

- **MUST / PHẢI**: không được vi phạm;
- **MUST NOT / KHÔNG ĐƯỢC**: hành vi bị cấm;
- **SHOULD / NÊN**: mặc định phải làm, chỉ bỏ qua khi có lý do kỹ thuật rõ ràng;
- **MAY / CÓ THỂ**: tùy chọn có kiểm soát.

AI agent không được tự hạ mức **MUST** thành khuyến nghị.

---

## 3. Phạm vi

Rule áp dụng cho:

- REST API công khai;
- API yêu cầu đăng nhập;
- API dành cho nhân viên và quản trị viên;
- API nội bộ nếu truyền qua HTTP;
- webhook nhận từ bên thứ ba;
- callback hoặc webhook do hệ thống gửi đi;
- API tải lên và tải xuống tệp;
- OpenAPI contract;
- mã lỗi, phân trang, lọc, sắp xếp, cache và versioning;
- controller, request DTO, response DTO, exception handler và API test.

Rule không tự quyết định:

- quyền nào được truy cập endpoint nào — xem `20-security-guardrails.md`;
- cách khóa tồn kho hoặc transaction — xem `30-database-guardrails.md`;
- quy ước Java và Spring chung — xem `10-java-spring-standards.md`.

---

## 4. Nguồn sự thật của hợp đồng API

### 4.1. Contract-first

Mặc định của dự án là **contract-first**:

- hợp đồng được lưu tại `docs/api/openapi.yaml`;
- OpenAPI là nguồn sự thật cho path, method, parameter, body, schema, status code và header công khai;
- controller và DTO phải triển khai đúng hợp đồng;
- ví dụ trong tài liệu phải chạy được hoặc được kiểm tra tự động;
- thay đổi contract phải được review như thay đổi mã nguồn.

Không được duy trì hai nguồn sự thật độc lập giữa:

- file OpenAPI viết tay;
- annotation trong controller;
- tài liệu wiki;
- collection Postman;
- mã frontend.

Nếu dự án chọn sinh OpenAPI từ code, quyết định đó phải được ghi trong ADR và bản OpenAPI đã sinh phải được kiểm tra trong CI. Không được vừa sửa file contract bằng tay vừa coi annotation là nguồn sự thật.

### 4.2. Phiên bản OpenAPI

- Baseline mặc định: `openapi: 3.1.2`.
- Chỉ nâng lên OpenAPI 3.2.x khi linter, generator, Spring integration, client web/mobile và contract test đều hỗ trợ.
- Phải pin phiên bản cụ thể trong file; không dùng khái niệm “latest” trong CI.
- `info.version` là phiên bản hợp đồng của dự án, không phải phiên bản OpenAPI.

### 4.3. Thay đổi đồng bộ

Một thay đổi API chưa hoàn tất nếu thiếu bất kỳ phần nào sau:

- OpenAPI;
- controller;
- request/response DTO;
- validation;
- authorization;
- service/use case;
- mapping;
- exception mapping;
- test;
- tài liệu migration nếu có tác động client.

---

## 5. Base path và nhóm người dùng

### 5.1. Base path chuẩn

Tất cả API nghiệp vụ phải nằm dưới:

~~~text
/api/v1
~~~

Không được trộn các cơ chế versioning khác nhau như:

- path version và header version cùng lúc;
- query parameter `?version=1`;
- media type version tùy ý;
- endpoint có version và endpoint không version trong cùng một contract.

Endpoint hạ tầng như health check có thể nằm ngoài `/api/v1`, nhưng phải được bảo vệ và quản lý theo rule bảo mật.

### 5.2. Phân vùng API

Mặc định:

| Nhóm | Ví dụ | Ghi chú |
| --- | --- | --- |
| Public catalog | `/api/v1/products` | Không chứa dữ liệu nội bộ |
| Authentication | `/api/v1/auth/login` | Ngoại lệ action-oriented có kiểm soát |
| Current user | `/api/v1/me/orders` | Không nhận user ID từ client |
| Customer resource | `/api/v1/orders/{orderId}` | Phải kiểm tra ownership |
| Back office | `/api/v1/admin/products` | Path không thay thế authorization |
| Provider webhook | `/api/v1/webhooks/payments/{provider}` | Xác minh chữ ký trên raw body |

`/admin` chỉ giúp tách contract và mục đích sử dụng. Nó không phải một cơ chế bảo mật.

---

## 6. Quy tắc thiết kế URI

### 6.1. Quy tắc chung

URI phải:

- dùng danh từ, không dùng tên hàm;
- dùng danh từ số nhiều cho collection;
- dùng chữ thường;
- dùng `kebab-case` khi segment có nhiều từ;
- không có dấu gạch chéo cuối;
- không chứa động từ CRUD như `get`, `create`, `update`, `delete`;
- không chứa tên bảng, tên entity JPA hoặc chi tiết triển khai;
- không đưa token, email, số điện thoại, mật khẩu hoặc dữ liệu nhạy cảm vào URL;
- giữ độ lồng hợp lý, mặc định không quá ba resource segment.

Đúng:

~~~text
GET    /api/v1/products
GET    /api/v1/products/{productId}
POST   /api/v1/carts/{cartId}/items
PATCH  /api/v1/carts/{cartId}/items/{itemId}
POST   /api/v1/orders/{orderId}/cancellations
POST   /api/v1/payments/{paymentId}/refunds
~~~

Sai:

~~~text
GET  /api/v1/getProducts
POST /api/v1/createOrder
POST /api/v1/orders/{id}/changeStatus
GET  /api/v1/tbl_product/{id}
GET  /api/v1/users?token=...
~~~

### 6.2. Identifier trong URI

- Tên path variable phải có nghĩa: `productId`, `orderId`, không dùng `id1`.
- ID công khai phải là identifier ổn định và không chứa thông tin nhạy cảm.
- Không để client suy luận quyền truy cập từ việc đoán ID.
- Mọi lookup theo ID phải kèm authorization hoặc ownership phù hợp.
- Mã đơn hàng hiển thị cho khách có thể khác khóa chính nội bộ.

### 6.3. Resource và hành động nghiệp vụ

Khi hành động có thể biểu diễn thành resource, phải ưu tiên resource:

| Nghiệp vụ | Endpoint nên dùng |
| --- | --- |
| Yêu cầu hủy đơn | `POST /orders/{orderId}/cancellations` |
| Tạo yêu cầu hoàn tiền | `POST /payments/{paymentId}/refunds` |
| Áp mã giảm giá | `POST /carts/{cartId}/coupons` |
| Gỡ mã giảm giá | `DELETE /carts/{cartId}/coupons/{code}` |
| Điều chỉnh tồn kho | `POST /admin/inventory-adjustments` |

Không được cho client sửa trực tiếp các field trạng thái nhạy cảm bằng một endpoint PATCH tổng quát:

- `order.status`;
- `payment.status`;
- `refund.status`;
- `shipment.status`;
- `inventory.reservedQuantity`;
- `user.role`.

Các chuyển trạng thái phải đi qua use case chuyên biệt và kiểm tra state machine.

### 6.4. Ngoại lệ action endpoint

Các action không tạo resource bền vững có thể dùng động từ khi đó là contract rõ ràng, ví dụ:

~~~text
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password
~~~

Không mở rộng ngoại lệ này tùy tiện sang nghiệp vụ khác.

---

## 7. Ngữ nghĩa HTTP method

### 7.1. GET

- Chỉ đọc dữ liệu.
- Không được tạo đơn hàng, trừ tồn kho, gửi email, đổi trạng thái hoặc tạo side effect nghiệp vụ.
- Có thể ghi access log hoặc metric nhưng không thay đổi kết quả nghiệp vụ.
- Phải an toàn và có thể retry.
- Request body trên GET bị cấm.

### 7.2. POST

Dùng để:

- tạo resource;
- bắt đầu command có side effect;
- tạo subordinate resource;
- thực hiện operation không idempotent theo ngữ nghĩa HTTP.

Các POST quan trọng phải có cơ chế idempotency theo mục 18.

### 7.3. PUT

- Chỉ dùng khi client thay thế toàn bộ representation của resource tại URI đã biết.
- PUT phải idempotent.
- Field bị bỏ khỏi body có thể được hiểu là bị xóa hoặc trở về mặc định; vì vậy contract phải cực kỳ rõ.
- Nếu dự án không hỗ trợ full replacement, không được thêm PUT chỉ vì “đủ CRUD”.

### 7.4. PATCH

Mặc định dùng JSON Merge Patch:

~~~http
Content-Type: application/merge-patch+json
~~~

Quy tắc:

- field vắng mặt: không thay đổi;
- field có giá trị `null`: xóa/clear nếu schema cho phép;
- array trong merge patch được thay toàn bộ, không merge từng phần tử;
- phải phân biệt rõ “vắng mặt” và “null” trong request DTO;
- không deserialize PATCH vào entity;
- không dùng `Map<String, Object>` rồi gán tự do;
- field được phép sửa phải được allowlist;
- field bị cấm phải bị từ chối, không được âm thầm bỏ qua.

JSON Patch `application/json-patch+json` chỉ được dùng khi có nhu cầu thật sự về operation theo path và đã có validation, authorization, test đầy đủ.

### 7.5. DELETE

- Phải idempotent về hiệu ứng cuối cùng.
- Trả `204 No Content` khi xóa thành công và không có body.
- Soft delete hay hard delete là quyết định domain/database, không làm thay đổi contract tùy tiện.
- Không được xóa cascade ngoài dự kiến.
- Nếu resource không tồn tại, phản hồi `404` hoặc chính sách che giấu đã được thống nhất; không thay đổi ngẫu nhiên giữa các endpoint.

### 7.6. Method không hỗ trợ

- Trả `405 Method Not Allowed`.
- Phải có header `Allow` khi phù hợp.
- Không dùng `200` kèm message “method not supported”.

---

## 8. HTTP status code chuẩn

### 8.1. Thành công

| Code | Khi sử dụng |
| --- | --- |
| `200 OK` | GET thành công; mutation trả representation |
| `201 Created` | Resource đã được tạo đồng bộ |
| `202 Accepted` | Đã nhận job nhưng chưa hoàn tất |
| `204 No Content` | Thành công và không có response body |
| `304 Not Modified` | Conditional GET và representation chưa đổi |

Quy tắc:

- `201` phải kèm `Location` trỏ tới resource vừa tạo khi có URI.
- `202` phải trả trạng thái operation hoặc `Location` tới operation resource.
- `204` không được có JSON body.
- Không trả `200` cho mọi tình huống.

### 8.2. Lỗi phía client

| Code | Ý nghĩa trong dự án |
| --- | --- |
| `400 Bad Request` | JSON hỏng, parameter sai cú pháp, thiếu header bắt buộc |
| `401 Unauthorized` | Thiếu hoặc token/xác thực không hợp lệ |
| `403 Forbidden` | Đã xác thực nhưng không đủ quyền |
| `404 Not Found` | Resource không tồn tại hoặc cần che giấu sự tồn tại |
| `405 Method Not Allowed` | Method không được hỗ trợ |
| `406 Not Acceptable` | Không thể trả media type client yêu cầu |
| `409 Conflict` | Xung đột trạng thái, duplicate, stock conflict, operation đang xử lý |
| `412 Precondition Failed` | `If-Match` không còn khớp |
| `413 Content Too Large` | Body hoặc tệp vượt giới hạn |
| `415 Unsupported Media Type` | `Content-Type` không được hỗ trợ |
| `422 Unprocessable Content` | Body đúng cú pháp nhưng validation field/semantic thất bại |
| `428 Precondition Required` | Endpoint yêu cầu `If-Match` nhưng client không gửi |
| `429 Too Many Requests` | Bị rate limit |

Phân biệt:

- JSON parse lỗi: `400`;
- Bean Validation trên body: mặc định `422`;
- vi phạm state transition: `409`;
- hết tồn kho khi checkout: `409`;
- version không khớp: `412`;
- thiếu xác thực: `401`;
- có danh tính nhưng thiếu quyền: `403`.

### 8.3. Lỗi phía server hoặc upstream

| Code | Khi sử dụng |
| --- | --- |
| `500 Internal Server Error` | Lỗi không dự kiến trong hệ thống |
| `502 Bad Gateway` | Upstream trả phản hồi hỏng hoặc không hợp lệ |
| `503 Service Unavailable` | Dịch vụ tạm thời không sẵn sàng |
| `504 Gateway Timeout` | Upstream vượt timeout |

Không biến lỗi upstream thành `400` để che giấu lỗi hệ thống. Không trả chi tiết nội bộ cho client.

---

## 9. Media type và content negotiation

### 9.1. JSON thông thường

- Request/response JSON dùng `application/json`.
- Lỗi dùng `application/problem+json`.
- JSON Merge Patch dùng `application/merge-patch+json`.
- File upload dùng `multipart/form-data` khi backend nhận trực tiếp.
- Mã hóa ký tự là UTF-8.

### 9.2. Header bắt buộc

Client có body JSON phải gửi `Content-Type` phù hợp.

Client nên gửi:

~~~http
Accept: application/json
~~~

Server phải:

- trả `415` cho request body có media type không hỗ trợ;
- trả `406` khi không thể đáp ứng `Accept`;
- không cố parse text, XML hoặc form thành JSON;
- không dùng content sniffing;
- không trả HTML error page từ Spring, proxy hoặc container cho API.

### 9.3. Header quan trọng

| Header | Mục đích |
| --- | --- |
| `Authorization` | Bearer access token |
| `Content-Type` | Kiểu request/response body |
| `Accept` | Media type client chấp nhận |
| `Location` | URI resource/operation mới |
| `ETag` | Version của representation |
| `If-Match` | Optimistic concurrency khi ghi |
| `If-None-Match` | Conditional GET |
| `Idempotency-Key` | Chống lặp operation quan trọng |
| `Retry-After` | Thời điểm/thời gian nên retry |
| `X-Request-Id` | Correlation ID bên ngoài |
| `Deprecation` | Thời điểm endpoint bị deprecate |
| `Sunset` | Thời điểm endpoint dự kiến ngừng hoạt động |
| `Link` | Liên kết deprecation, pagination hoặc tài liệu |

Không đưa secret hoặc token vào custom header chỉ để tránh thiết kế request body đúng.

---

## 10. Quy ước JSON

### 10.1. Tên field

- Dùng `lowerCamelCase`.
- Tên phải mang nghĩa nghiệp vụ.
- Không dùng viết tắt khó hiểu.
- Không rò rỉ tên cột như `created_at` hoặc `product_tbl_id`.
- Boolean phải có nghĩa khẳng định: `active`, `available`, `verified`.
- Không dùng cặp field mâu thuẫn như `active` và `disabled` trong cùng schema.

### 10.2. ID

ID trong JSON phải được biểu diễn dưới dạng **string**, kể cả khi database dùng `BIGINT`:

~~~json
{
  "id": "9827349827349827"
}
~~~

Lý do: tránh mất độ chính xác trên JavaScript/ReactJS/React Native và cho phép thay đổi chiến lược ID sau này.

Client không được thực hiện phép toán số học trên ID.

### 10.3. Tiền tệ

Tiền phải dùng object rõ ràng:

~~~json
{
  "price": {
    "amount": "19990000",
    "currency": "VND"
  }
}
~~~

Quy tắc:

- `amount` là decimal string chuẩn, không có dấu phân cách hàng nghìn;
- `currency` là mã ISO 4217 viết hoa;
- không dùng `double`/`float`;
- không gửi chỉ một số không có currency;
- không gửi giá đã format như `"19.990.000 ₫"` trong field nghiệp vụ;
- frontend tự định dạng hiển thị theo locale;
- giá, giảm giá, thuế, phí ship và tổng tiền do server tính;
- client không được quyết định `totalAmount` khi checkout.

### 10.4. Thời gian

- Instant dùng RFC 3339/ISO 8601 ở UTC với hậu tố `Z`.
- Ngày không có thời gian dùng `YYYY-MM-DD`.
- Không gửi timestamp thiếu timezone.
- Không dùng epoch milliseconds trong contract công khai nếu không có lý do tích hợp bắt buộc.
- Tên field phải thể hiện nghĩa: `createdAt`, `paidAt`, `expiresAt`.

Ví dụ:

~~~json
{
  "createdAt": "2026-07-15T09:30:45Z",
  "deliveryDate": "2026-07-18"
}
~~~

### 10.5. Enum

- Giá trị enum công khai dùng `UPPER_SNAKE_CASE`.
- Giá trị đã phát hành là một phần của contract.
- Không serialize trực tiếp `Enum.name()` nếu chưa cam kết tên đó là contract.
- Không đổi tên hoặc xóa enum trong cùng major API.
- Thêm enum mới có thể làm hỏng mobile client; phải được đánh giá như breaking change trừ khi client có chiến lược `UNKNOWN`.

### 10.6. Null, field vắng mặt và collection

- Collection rỗng phải là `[]`, không phải `null`.
- Object rỗng chỉ dùng khi có nghĩa, không dùng thay `null`.
- Response schema phải xác định rõ field required và field nullable.
- Không thay đổi tùy ý giữa “field vắng mặt” và “field bằng null”.
- Trong PATCH, “vắng mặt” và “null” luôn có ý nghĩa khác nhau.
- Không gửi field nội bộ với giá trị null chỉ vì entity đang có field đó.

### 10.7. Chuỗi và nội dung

- String input phải có giới hạn độ dài.
- Server chỉ trim/normalize các field được contract cho phép.
- Không trim hoặc biến đổi password, token, signature và idempotency key.
- Nội dung do người dùng nhập phải được xử lý như dữ liệu, không phải HTML tin cậy.
- Không trả HTML tùy ý trong JSON nếu chưa có sanitization và use case rõ ràng.

---

## 11. DTO và ranh giới API

### 11.1. Không expose entity

Controller không được:

- nhận JPA entity làm request body;
- trả JPA entity;
- trả projection chứa field ngoài contract;
- serialize lazy relation;
- dùng entity làm OpenAPI schema.

Mỗi use case phải có request/response DTO phù hợp.

### 11.2. DTO theo operation

Ưu tiên:

~~~text
CreateProductRequest
UpdateProductRequest
ProductSummaryResponse
ProductDetailResponse
CreateOrderRequest
OrderResponse
CreateRefundRequest
RefundResponse
~~~

Không dùng một `ProductDto` khổng lồ cho create, update, list, detail và admin.

### 11.3. Mass assignment

- Chỉ map field nằm trong allowlist của use case.
- Không nhận `role`, `permissions`, `status`, `paid`, `reservedQuantity`, `createdAt` hoặc `ownerId` từ request thông thường.
- Ownership phải lấy từ authenticated principal hoặc context đáng tin cậy.
- Server-generated field phải do server tạo.

### 11.4. Mapping

- Mapping phải rõ ràng và test được.
- Không dùng reflection mapper nếu khiến field nhạy cảm tự động xuất hiện.
- Field mới trong entity không được tự động xuất hiện trong API.
- Field mới trong request không được tự động ghi xuống entity.

---

## 12. Validation request

### 12.1. Boundary validation

Controller phải validation ngay tại ranh giới:

- `@Valid` cho request body;
- constraint cho path/query/header;
- custom validator cho quan hệ giữa nhiều field;
- service/domain tiếp tục kiểm tra invariant nghiệp vụ.

Validation HTTP không thay thế validation domain.

### 12.2. Phân loại lỗi

| Lỗi | Phản hồi |
| --- | --- |
| JSON sai cú pháp | `400` |
| Sai kiểu path/query | `400` |
| Thiếu header bắt buộc | `400` |
| Body vi phạm constraint | `422` |
| Dữ liệu hợp lệ nhưng state không cho phép | `409` |
| Không đủ quyền | `403` |

### 12.3. Unknown field

Request command nên từ chối JSON field không được khai báo để phát hiện:

- typo từ client;
- contract drift;
- mass assignment;
- client gửi nhầm phiên bản.

Không được âm thầm bỏ qua field nhạy cảm hoặc field không xác định.

Response client phải được thiết kế để bỏ qua field mới không biết nhằm hỗ trợ tương thích ngược.

### 12.4. Giới hạn input

Mọi endpoint phải xác định:

- độ dài string tối đa;
- số phần tử collection tối đa;
- numeric range;
- pattern nếu thực sự cần;
- giới hạn body;
- giới hạn file;
- enum hợp lệ;
- timezone/date range;
- sort/filter allowlist.

Không nhận collection không giới hạn.

### 12.5. Business validation

Ví dụ backend phải tự kiểm tra:

- SKU tồn tại và đang bán;
- variant thuộc đúng product;
- số lượng mua nằm trong giới hạn;
- giá hiện tại được lấy từ server;
- mã giảm giá còn hiệu lực và đúng điều kiện;
- địa chỉ giao hàng thuộc phạm vi phục vụ;
- order thuộc người dùng;
- order đang ở state cho phép hủy;
- payment/refund không vượt số tiền hợp lệ;
- tồn kho được xác nhận lại trong transaction.

---

## 13. Success response

### 13.1. Không dùng envelope thừa

Single-resource response trả trực tiếp representation:

~~~json
{
  "id": "prd_01J...",
  "name": "Điện thoại XYZ",
  "status": "ACTIVE"
}
~~~

Không bọc máy móc:

~~~json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "prd_01J..."
  }
}
~~~

Lý do: HTTP status đã thể hiện thành công; envelope thừa làm phình contract và khác với RFC 9457 ở nhánh lỗi.

### 13.2. Mutation response

- Create: `201` + resource hoặc representation tối thiểu + `Location`.
- Update có representation: `200`.
- Update không cần representation: `204`.
- Không trả entity trước khi transaction thực sự hoàn tất.
- Không trả “thành công” nếu downstream critical operation chưa có trạng thái rõ ràng.

---

## 14. Collection, phân trang, lọc và sắp xếp

### 14.1. Không trả list trần cho collection có thể tăng

Collection response chuẩn:

~~~json
{
  "items": [
    {
      "id": "prd_01J...",
      "name": "Điện thoại XYZ"
    }
  ],
  "page": {
    "number": 1,
    "size": 20,
    "totalElements": 125,
    "totalPages": 7
  },
  "links": {
    "self": "/api/v1/products?page=1&size=20",
    "next": "/api/v1/products?page=2&size=20"
  }
}
~~~

Không expose trực tiếp Spring `Page` hoặc `Pageable` trong contract.

### 14.2. Offset pagination

Mặc định cho catalog và màn hình quản trị:

- `page` bắt đầu từ **1** ở API;
- `size` mặc định 20;
- `size` tối đa 100, trừ endpoint được duyệt riêng;
- server map sang zero-based page nội bộ nếu cần;
- sort phải ổn định và có tie-breaker theo ID;
- request vượt max size phải bị từ chối hoặc giới hạn theo contract, không thay đổi âm thầm.

### 14.3. Cursor pagination

Dùng cursor cho:

- feed thay đổi thường xuyên;
- audit/event log;
- lịch sử đơn hàng rất lớn;
- tập dữ liệu mà offset sâu gây chậm hoặc sai lệch.

Ví dụ:

~~~json
{
  "items": [],
  "page": {
    "size": 20,
    "hasNext": true,
    "nextCursor": "opaque-value"
  }
}
~~~

Cursor phải:

- opaque với client;
- có thời hạn nếu cần;
- không chứa PII hoặc secret ở dạng đọc được;
- gắn với filter/sort liên quan;
- không cho client sửa để vượt quyền;
- dựa trên thứ tự ổn định, thường gồm sort key và ID.

Một endpoint không được trộn offset và cursor pagination.

### 14.4. Sorting

Quy ước:

~~~text
?sort=createdAt,desc&sort=id,desc
~~~

- Chỉ field trong allowlist được sort.
- Direction chỉ nhận `asc` hoặc `desc`.
- Tối đa ba sort criteria trừ khi có lý do.
- Luôn có tie-breaker ổn định.
- Không đưa tên cột SQL cho client.
- Sort không hợp lệ trả `400`, không âm thầm bỏ qua.

### 14.5. Filtering

Filter phải là parameter có tên và được tài liệu hóa:

~~~text
?brandId=br_01J...&status=ACTIVE&minPrice=5000000&maxPrice=20000000
~~~

- Dùng allowlist.
- Validation từng filter.
- Không nối chuỗi filter vào SQL/JPQL.
- Không hỗ trợ ngôn ngữ query tổng quát như RSQL/OData nếu chưa có thiết kế và security review riêng.
- Không cho lọc theo field nội bộ hoặc nhạy cảm.

### 14.6. Search

- Full-text search dùng parameter `q`.
- Phải trim và giới hạn độ dài theo contract.
- Không để chuỗi tìm kiếm trực tiếp điều khiển SQL, regex nguy hiểm hoặc query engine.
- Search result phải có sort ổn định.
- Nếu dùng search engine ngoài, contract không được rò rỉ syntax riêng của engine.

### 14.7. Include/expand

Không hỗ trợ dynamic field projection hoặc expand tùy ý.

Nếu có `include`:

- quan hệ được include phải nằm trong allowlist;
- độ sâu tối đa một cấp theo mặc định;
- có giới hạn payload;
- test N+1;
- schema phải mô tả rõ.

---

## 15. Error response theo RFC 9457

### 15.1. Format bắt buộc

Mọi lỗi API JSON phải dùng:

~~~http
Content-Type: application/problem+json
~~~

Ví dụ:

~~~json
{
  "type": "https://api.example.com/problems/validation-failed",
  "title": "Validation failed",
  "status": 422,
  "detail": "One or more request fields are invalid.",
  "instance": "/api/v1/orders",
  "code": "VALIDATION_FAILED",
  "traceId": "01J2ABCDEF...",
  "timestamp": "2026-07-15T09:30:45Z",
  "errors": [
    {
      "location": "body",
      "pointer": "/items/0/quantity",
      "code": "MIN_VALUE",
      "message": "Quantity must be at least 1."
    }
  ]
}
~~~

### 15.2. Field chuẩn và extension

| Field | Quy tắc |
| --- | --- |
| `type` | URI ổn định định danh loại lỗi |
| `title` | Tiêu đề ngắn, ổn định |
| `status` | Phải khớp HTTP status |
| `detail` | Hướng dẫn an toàn cho occurrence hiện tại |
| `instance` | URI occurrence, không chứa query nhạy cảm |
| `code` | Mã máy đọc ổn định của dự án |
| `traceId` | Correlate với log/trace |
| `timestamp` | Instant UTC |
| `errors` | Danh sách lỗi field khi phù hợp |

Client phải dựa vào `type` hoặc `code`, không parse `title`, `detail` hoặc `message`.

### 15.3. Problem type

- Với domain error, `type` phải là HTTPS URI ổn định và nên resolve tới tài liệu.
- Khi chưa có domain tài liệu, có thể dùng namespace URI được quản lý tập trung; không tạo URI ngẫu nhiên theo controller.
- `about:blank` chỉ dùng cho lỗi HTTP thật sự không có ngữ nghĩa domain bổ sung.
- Mỗi problem type phải ghi rõ title, status mặc định, extension và cách client xử lý.

### 15.4. Validation errors

- `errors` phải có thứ tự ổn định.
- Dùng JSON Pointer cho body khi có thể.
- Query/header/path dùng `location` và tên parameter phù hợp.
- Không trả raw rejected value nếu có thể chứa password, token, PII hoặc dữ liệu lớn.
- Không trả annotation class, Java class hoặc stack trace.

### 15.5. Thông tin bị cấm trong lỗi

Không được trả:

- stack trace;
- exception class;
- package/class/method name;
- SQL, tên bảng hoặc tên cột;
- hostname, internal URL hoặc IP nội bộ;
- secret, token, API key;
- raw payment response;
- thông tin giúp dò user/resource;
- đường dẫn file trên server;
- cấu hình môi trường.

Production fallback cho lỗi không dự kiến:

~~~json
{
  "type": "https://api.example.com/problems/internal-error",
  "title": "Internal server error",
  "status": 500,
  "detail": "An unexpected error occurred.",
  "code": "INTERNAL_ERROR",
  "traceId": "01J2ABCDEF..."
}
~~~

Chi tiết thật chỉ có trong log bảo mật phù hợp.

### 15.6. Spring implementation

- Dùng một `@RestControllerAdvice` tập trung.
- Có thể kế thừa `ResponseEntityExceptionHandler`.
- Dùng Spring `ProblemDetail`/`ErrorResponse` khi phiên bản framework hỗ trợ.
- Map exception domain sang problem type ổn định.
- Không tạo handler trùng nhau ở nhiều module.
- Không catch `Exception` trong từng controller.
- Không để default error HTML hoặc default payload khác lọt ra API.

---

## 16. Authentication và authorization ở lớp API

Rule bảo mật chi tiết nằm trong `20-security-guardrails.md`. API phải bảo đảm tối thiểu:

- access token chỉ đi trong `Authorization: Bearer ...`, không trong query;
- endpoint protected xác thực và phân quyền trước khi trả dữ liệu;
- kiểm tra ownership theo resource;
- không tin `userId`, `customerId` hoặc `role` do client gửi;
- endpoint `/me` lấy user hiện tại từ security context;
- `401` và `403` đúng nghĩa;
- có thể dùng `404` để tránh lộ resource theo chính sách bảo mật;
- CORS không được mở wildcard với credential;
- response nhạy cảm dùng cache policy an toàn;
- mọi method trên cùng path đều được authorize riêng.

API contract phải mô tả security requirement cho từng operation trong OpenAPI.

---

## 17. Idempotency cho operation quan trọng

### 17.1. Endpoint bắt buộc

`Idempotency-Key` bắt buộc tối thiểu cho:

- checkout/tạo đơn từ cart;
- khởi tạo thanh toán;
- capture hoặc confirm payment nếu hệ thống thực hiện;
- tạo refund;
- các command tài chính hoặc tồn kho có nguy cơ lặp do retry;
- operation bất đồng bộ có side effect không thể lặp an toàn.

Không bắt buộc cho GET/PUT/DELETE vốn đã có ngữ nghĩa idempotent, trừ khi contract cụ thể cần thêm bảo vệ.

### 17.2. Đây là contract của dự án

`Idempotency-Key` phải được mô tả là quy ước bắt buộc của dự án. Không được khẳng định sai rằng header này đã là một RFC hoàn tất nếu tại thời điểm triển khai nó vẫn là Internet-Draft.

### 17.3. Quy tắc key

- Client tạo key ngẫu nhiên đủ mạnh, ưu tiên UUID/ULID.
- Độ dài và charset phải được tài liệu hóa; mặc định 16–128 ký tự ASCII an toàn.
- Một key không được dùng cho hai payload khác nhau.
- Scope tối thiểu gồm principal/guest context, method, normalized path và key.
- Server lưu fingerprint của payload canonical cùng metadata cần thiết.
- Không dùng key làm authorization credential.

### 17.4. Hành vi server

| Trường hợp | Hành vi |
| --- | --- |
| Key mới | Đánh dấu processing rồi thực hiện operation |
| Key cũ, cùng fingerprint, đã hoàn tất | Trả lại kết quả đã lưu |
| Key cũ, payload khác | `422` với `IDEMPOTENCY_KEY_REUSED` |
| Cùng key đang xử lý | `409` với `IDEMPOTENCY_REQUEST_IN_PROGRESS` |
| Thiếu key ở endpoint bắt buộc | `400` với `IDEMPOTENCY_KEY_REQUIRED` |

Kết quả replay phải giữ nguyên status, response body và các header contract quan trọng.

### 17.5. Tính nguyên tử

- Idempotency record và state transition phải được phối hợp an toàn.
- Không được tạo order hai lần nếu client timeout rồi retry.
- Không được charge hoặc refund hai lần.
- Với provider ngoài, phải truyền idempotency key/provider reference phù hợp nếu provider hỗ trợ.
- Nếu không thể bảo đảm nguyên tử hoàn toàn với upstream, phải dùng state machine, reconciliation và outbox/inbox phù hợp.

### 17.6. Retention

- Thời gian giữ key phải được tài liệu hóa theo endpoint.
- Checkout/payment/refund mặc định giữ ít nhất 24 giờ hoặc dài hơn theo cửa sổ retry/reconciliation của provider.
- Không xóa record khi operation vẫn có thể được retry.
- Cleanup phải có metric và không phá request đang xử lý.

---

## 18. Concurrency và HTTP precondition

### 18.1. ETag cho cập nhật cạnh tranh

Resource quản trị có nguy cơ lost update nên trả `ETag`, ví dụ:

- product;
- product variant;
- promotion/coupon;
- cấu hình giao hàng;
- nội dung được nhiều nhân viên cùng sửa.

Client update phải gửi:

~~~http
If-Match: "17"
~~~

Server:

- thiếu `If-Match` khi endpoint yêu cầu: `428`;
- version không khớp: `412`;
- update thành công: trả ETag mới;
- không âm thầm ghi đè phiên bản mới hơn.

### 18.2. ETag ghi và ETag cache

- ETag dùng cho optimistic concurrency phải dựa trên version đáng tin cậy.
- Không dùng `ShallowEtagHeaderFilter` làm cơ chế chống lost update.
- Shallow ETag chỉ phù hợp cho conditional GET khi đã đánh giá chi phí buffer response.
- Không dùng weak ETag cho write precondition nếu contract cần so sánh mạnh.

### 18.3. Resource không dùng generic PATCH

Tồn kho, order status, payment và refund phải dùng command/state transition chuyên biệt. ETag không thay thế:

- row locking;
- optimistic version;
- transaction;
- invariant;
- idempotency.

---

## 19. HTTP caching

### 19.1. Phân loại response

| Loại dữ liệu | Chính sách mặc định |
| --- | --- |
| Public product/category/brand | Có thể cache ngắn hạn nếu có invalidation/revalidation |
| Ảnh sản phẩm public | Cache dài hạn với URL versioned/content-addressed |
| Cart | `private, no-store` |
| Order/payment/refund | `private, no-store` |
| Profile/address | `private, no-store` |
| Auth/token/reset | `no-store` |
| Admin data | `private, no-store` mặc định |

Không cache public response chứa dữ liệu theo user.

### 19.2. Conditional GET

Public read endpoint có thể dùng:

- `ETag` + `If-None-Match`;
- `Last-Modified` + `If-Modified-Since` khi phù hợp;
- `304 Not Modified` không có body.

### 19.3. Quy tắc an toàn

- Cache policy phải được set rõ, không phụ thuộc mặc định ngẫu nhiên của proxy.
- Dùng `Vary` khi representation thay đổi theo request header.
- Không đưa `Authorization` response vào shared cache.
- Thay đổi cache key hoặc TTL phải được test qua gateway/CDN nếu có.
- Giá và availability cache chỉ mang tính hiển thị; checkout vẫn phải xác nhận lại từ server.

---

## 20. Operation bất đồng bộ

Operation dài như:

- export báo cáo;
- import sản phẩm lớn;
- xử lý ảnh;
- bulk update;
- đồng bộ provider;
- gửi chiến dịch thông báo;

không được giữ HTTP request vô hạn.

Mẫu chuẩn:

~~~http
HTTP/1.1 202 Accepted
Location: /api/v1/operations/op_01J...
Retry-After: 3
~~~

~~~json
{
  "id": "op_01J...",
  "status": "PENDING",
  "createdAt": "2026-07-15T09:30:45Z",
  "links": {
    "self": "/api/v1/operations/op_01J..."
  }
}
~~~

Operation status tối thiểu:

- `PENDING`;
- `RUNNING`;
- `SUCCEEDED`;
- `FAILED`;
- `CANCELLED` nếu hỗ trợ.

Quy tắc:

- operation resource phải có authorization/ownership;
- kết quả phải có expiry/retention rõ;
- retry job không được lặp side effect;
- failure trả mã lỗi an toàn, không trả stack trace;
- cancellation chỉ được công bố nếu thực sự hỗ trợ.

---

## 21. Rate limit, timeout và retry

### 21.1. Rate limit

Endpoint có nguy cơ abuse phải có rate limit phù hợp, đặc biệt:

- login;
- refresh;
- forgot/reset password;
- OTP/email verification;
- product search;
- coupon validation;
- checkout;
- payment;
- webhook.

Khi vượt giới hạn:

- trả `429 Too Many Requests`;
- gửi `Retry-After` nếu có thể xác định;
- trả ProblemDetail với code ổn định;
- không tiết lộ quota nội bộ nhạy cảm.

Không tự đặt custom rate-limit header rồi gọi đó là chuẩn RFC. Nếu dùng header bổ sung, phải ghi chính xác contract và test client.

### 21.2. Retry

Client chỉ nên retry tự động khi:

- method an toàn/idempotent; hoặc
- POST/PATCH có idempotency key và contract cho phép.

Retry phải:

- có exponential backoff;
- có jitter;
- có giới hạn số lần;
- tôn trọng `Retry-After`;
- không retry vô hạn;
- không retry lỗi validation hoặc authorization.

### 21.3. Timeout

- Mọi call tới upstream phải có connect/read/overall timeout.
- Timeout nội bộ phải nhỏ hơn timeout của gateway/client theo ngân sách thời gian hợp lý.
- Không giữ database transaction mở trong lúc chờ network call dài.
- Timeout upstream phải map `504` hoặc trạng thái domain phù hợp, không giả thành thành công.

---

## 22. File upload và download

### 22.1. Upload

- Dùng `multipart/form-data` hoặc pre-signed upload flow đã thiết kế.
- Không nhận ảnh dạng base64 trong JSON cho luồng thông thường.
- Validation extension không đủ; phải kiểm tra MIME, magic bytes, kích thước và nội dung theo security rule.
- Tên file từ client không được dùng trực tiếp làm storage path.
- Không trả local filesystem path.
- Upload thành công trả metadata và URL/resource ID, không trả secret storage credential.

Ví dụ:

~~~json
{
  "id": "media_01J...",
  "url": "https://cdn.example.com/products/media_01J...",
  "contentType": "image/webp",
  "size": 245183
}
~~~

### 22.2. Download

- File private phải authorize trước khi tải hoặc tạo signed URL thời hạn ngắn.
- Phải set `Content-Type` và `Content-Disposition` đúng.
- Không phản chiếu filename chưa sanitize vào header.
- Range request nên do object storage/CDN xử lý nếu phù hợp.
- Không cache public cho file private.

---

## 23. Webhook và tích hợp bên thứ ba

### 23.1. Inbound webhook

Mỗi webhook handler phải:

1. đọc raw request body;
2. xác minh signature/MAC theo đúng tài liệu provider;
3. kiểm tra timestamp/tolerance nếu provider hỗ trợ;
4. xác định provider event ID;
5. ghi inbox/event bền vững với unique constraint;
6. trả acknowledgment nhanh;
7. xử lý nghiệp vụ bất đồng bộ khi phù hợp;
8. làm consumer idempotent;
9. có reconciliation khi mất hoặc sai thứ tự event.

Không deserialize rồi serialize lại body trước khi verify chữ ký nếu provider ký raw bytes.

### 23.2. Duplicate và ordering

- Giả định delivery là at-least-once trừ khi provider bảo đảm khác.
- Duplicate event hợp lệ phải trả kết quả thành công an toàn sau khi xác minh signature.
- Không giả định event đến đúng thứ tự.
- State transition phải kiểm tra version/time/provider status.
- Không cho event cũ làm lùi payment/order state.

### 23.3. Acknowledgment

- Chỉ trả 2xx sau khi event đã được xác minh và lưu bền vững đủ để xử lý tiếp.
- Không chờ toàn bộ nghiệp vụ dài trước khi ack nếu provider có timeout ngắn.
- Status code và response body phải theo contract provider.
- Không trả chi tiết exception nội bộ cho provider.

### 23.4. Outbound webhook

Nếu hệ thống gửi webhook:

- có `eventId` duy nhất;
- có `eventType` ổn định;
- có `occurredAt` UTC;
- có `schemaVersion`;
- payload không thừa PII;
- có signature và timestamp;
- retry exponential backoff + jitter;
- có maximum attempts và dead-letter/reconciliation;
- ghi delivery attempt;
- tài liệu hóa việc không bảo đảm ordering nếu đúng như vậy.

Ví dụ:

~~~json
{
  "eventId": "evt_01J...",
  "eventType": "ORDER.PAID",
  "schemaVersion": "1",
  "occurredAt": "2026-07-15T09:30:45Z",
  "data": {
    "orderId": "ord_01J..."
  }
}
~~~

---

## 24. Quy tắc riêng cho nghiệp vụ bán điện thoại

### 24.1. Catalog

- Product list trả summary DTO, không trả toàn bộ specification/variant/review.
- Product detail có thể trả variant đã được chuẩn hóa.
- Variant phải phân biệt rõ SKU, màu, dung lượng và trạng thái bán.
- Customer API không trả giá vốn, supplier data, margin hoặc số tồn kho nội bộ.
- Có thể trả `availability` hoặc `availableForSale` thay exact stock count.
- URL ảnh phải là URL public/signed phù hợp, không phải path nội bộ.

### 24.2. Cart

- Cart item tham chiếu variant/SKU, không chỉ product chung.
- Quantity phải có min/max.
- Server luôn lấy giá hiện tại và promotion hợp lệ.
- Response cart phải thể hiện subtotal, discount, shipping estimate và total theo Money schema.
- Cart total chỉ là estimate cho tới checkout.
- Guest cart phải có ownership/session token an toàn; cart ID không đủ để cấp quyền.

### 24.3. Checkout và order

- Checkout bắt buộc `Idempotency-Key`.
- Server xác minh lại giá, promotion, địa chỉ và tồn kho.
- Không tin amount/totals từ client.
- Order phải lưu snapshot cần thiết nhưng response chỉ trả field đúng audience.
- Order status phải qua state machine.
- Hủy đơn dùng use case riêng.
- Customer không được tự đặt `PAID`, `SHIPPED`, `COMPLETED` hoặc `CANCELLED` qua generic PATCH.

### 24.4. Inventory

- Không sửa tồn kho bằng `PATCH /products/{id}`.
- Dùng inventory adjustment/reservation/release command riêng.
- Mỗi command phải có reason/reference.
- API customer không phân biệt chi tiết `onHand`, `reserved` nếu không cần.
- Stock conflict trả `409` với code ổn định như `INSUFFICIENT_STOCK`.

### 24.5. Payment và refund

- Payment amount do server tạo từ order.
- Provider payment ID và internal payment ID phải phân biệt rõ.
- Client redirect/callback không tự chứng minh payment thành công; server phải verify với provider/webhook.
- Refund tạo thành resource riêng và bắt buộc idempotency.
- Tổng refund không được vượt số tiền có thể hoàn.
- Không trả raw provider payload, secret, signature hoặc full payment credential.

### 24.6. Promotion/coupon

- Coupon validation phải xét user, cart, product, thời gian, quota và trạng thái.
- Không công bố dữ liệu quota nội bộ không cần thiết.
- Conflict phải có code domain ổn định.
- Promotion price trên catalog không thay thế revalidation khi checkout.

### 24.7. Review

- Chỉ cho review khi thỏa điều kiện nghiệp vụ đã định.
- Moderation status không được client tự đặt.
- Public response không trả moderation notes nội bộ.
- Pagination và rate limit bắt buộc cho danh sách review.

---

## 25. OpenAPI documentation bắt buộc

Mỗi operation phải có:

- path và method;
- tag;
- summary;
- description khi hành vi không hiển nhiên;
- `operationId` duy nhất và ổn định;
- security requirement;
- path/query/header parameter;
- request body schema;
- response schema cho từng status có thể xảy ra;
- media type;
- example hợp lệ;
- validation constraints;
- pagination/filter/sort;
- ETag/If-Match nếu dùng;
- Idempotency-Key nếu dùng;
- rate-limit/retry behavior nếu dùng;
- deprecation metadata nếu có.

### 25.1. Schema

- Required field phải khai báo rõ.
- Nullable phải khai báo đúng cú pháp OAS 3.1/JSON Schema.
- String phải có `minLength`/`maxLength` khi phù hợp.
- Number phải có range.
- Array phải có `maxItems`.
- Enum phải liệt kê.
- Format phải đúng và tooling hỗ trợ.
- Example phải khớp schema.
- Không dùng schema quá rộng như object tự do nếu contract có thể xác định.

### 25.2. Reuse

Dùng `components` cho:

- Money;
- ProblemDetail;
- ValidationError;
- pagination metadata;
- common headers;
- security schemes;
- ID/date-time schema dùng lặp lại.

Không lạm dụng `allOf` hoặc polymorphism làm codegen khó hiểu.

### 25.3. Public docs

- Swagger UI/API docs trên production phải tắt hoặc bảo vệ theo `20-security-guardrails.md`.
- Không đưa internal server URL, secret, example token thật hoặc PII vào spec.
- Internal/admin API docs phải có access control phù hợp.

### 25.4. CI

CI phải:

- lint OpenAPI;
- validate schema/ref;
- phát hiện duplicate `operationId`;
- kiểm tra example;
- chạy breaking-change diff với contract baseline;
- chạy contract/API test;
- thất bại khi implementation và contract drift vượt chính sách.

---

## 26. Versioning và tương thích ngược

### 26.1. API version

- Major version nằm trong path: `/api/v1`.
- Không đưa minor/patch version vào URL.
- Thay đổi không breaking tiếp tục trong v1.
- Breaking change phải tạo `/api/v2` hoặc có migration plan được duyệt.
- v1 và v2 có thể phải chạy song song để web/mobile nâng cấp an toàn.

### 26.2. Thay đổi thường không breaking

Chỉ được xem là không breaking khi client tuân contract:

- thêm endpoint mới;
- thêm optional request field;
- thêm optional response field mà client được yêu cầu bỏ qua nếu không biết;
- nới validation không làm thay đổi security/business invariant;
- thêm problem type cho tình huống trước đây chưa được công bố, sau khi đánh giá.

### 26.3. Thay đổi breaking

Bao gồm nhưng không giới hạn:

- xóa/đổi tên path, field, query parameter hoặc header;
- đổi HTTP method;
- đổi kiểu dữ liệu hoặc format;
- đổi required/nullable;
- đổi đơn vị tiền/timestamp;
- đổi response envelope;
- đổi status code mà client có thể phụ thuộc;
- đổi ngữ nghĩa field dù tên không đổi;
- thu hẹp validation;
- đổi pagination convention;
- xóa hoặc đổi enum;
- thêm enum khi client không có unknown fallback;
- thay đổi authorization làm client cũ mất quyền;
- đổi default sort/filter;
- biến operation đồng bộ thành bất đồng bộ hoặc ngược lại.

### 26.4. Client tolerance

Web/mobile client phải:

- bỏ qua response field chưa biết;
- không parse human message để điều khiển logic;
- dùng `code`/`type` ổn định;
- xử lý enum unknown theo chiến lược contract;
- không phụ thuộc thứ tự field JSON;
- không giả định tất cả lỗi là một status code;
- không hardcode total pages khi dùng cursor.

### 26.5. Deprecation

Khi deprecate endpoint:

- cập nhật OpenAPI `deprecated: true`;
- gửi header `Deprecation` theo RFC 9745;
- gửi `Sunset` nếu đã có ngày ngừng;
- dùng `Link` tới migration guide;
- đo usage của version cũ;
- thông báo owner của web/mobile/integration;
- giữ thời gian chuyển đổi tối thiểu theo release policy.

Mặc định dự án lớn nên cho ít nhất:

- 90 ngày; và
- tối thiểu hai chu kỳ phát hành mobile;

trừ lỗi bảo mật nghiêm trọng cần xử lý nhanh hơn.

Không xóa endpoint chỉ vì code mới đã deploy.

---

## 27. Observability của API

### 27.1. Request ID và trace

- Chấp nhận `X-Request-Id` hợp lệ từ gateway/client đáng tin cậy hoặc tự sinh.
- Luôn trả correlation ID cho client.
- Gắn request ID/trace ID vào log và ProblemDetail.
- Không dùng request ID làm security credential.
- Giới hạn chiều dài/charset để tránh log injection.

### 27.2. Logging

Log ở ranh giới API nên có:

- method;
- route template, không phải raw URL chứa dữ liệu nhạy cảm;
- status;
- latency;
- authenticated principal ID đã giảm thiểu nếu phù hợp;
- trace/request ID;
- error code;
- upstream outcome;
- payload size khi hữu ích.

Không log:

- password;
- access/refresh token;
- authorization header;
- reset token;
- full card/payment data;
- webhook secret/signature;
- raw PII body;
- idempotency payload nhạy cảm.

### 27.3. Metrics

Tối thiểu theo dõi:

- request rate;
- latency p50/p95/p99;
- 4xx/5xx theo route và error code;
- rate-limit count;
- idempotency replay/conflict;
- checkout failure;
- payment/refund failure;
- webhook verification/duplicate/processing lag;
- response size;
- upstream timeout.

Không dùng raw URI có ID làm metric label gây cardinality cao.

---

## 28. Hiệu năng và giới hạn

- Không có endpoint list không phân trang.
- Không trả graph object không giới hạn.
- Không expose JPA lazy graph.
- Mọi include/expand phải được đo query count.
- Response list dùng summary DTO.
- Body JSON mặc định nên có giới hạn cấu hình; endpoint lớn phải khai báo riêng.
- File upload có giới hạn riêng.
- Không thực hiện export lớn bằng response JSON đồng bộ.
- Không giữ DB transaction trong thời gian serialize/stream file hoặc gọi upstream dài.
- Compression nên cấu hình tại server/gateway sau khi đánh giá BREACH và dữ liệu nhạy cảm.
- Không tối ưu bằng cách bỏ authorization, validation hoặc transaction.
- Endpoint chậm phải được đo và phân tích bằng query plan/trace, không đoán.

---

## 29. Testing bắt buộc

### 29.1. Controller/API tests

Mỗi operation phải test:

- happy path;
- malformed JSON;
- validation field;
- boundary value;
- unknown field;
- unsupported media type;
- unacceptable response media type khi áp dụng;
- authentication;
- authorization;
- ownership/IDOR;
- not found;
- state conflict;
- correct status;
- response schema;
- header bắt buộc;
- ProblemDetail;
- serialization ID/money/time/enum/null;
- không rò rỉ field nội bộ.

### 29.2. Idempotency tests

Endpoint idempotent phải test:

- first request;
- replay cùng key/cùng payload;
- cùng key/khác payload;
- concurrent request cùng key;
- retry sau timeout mô phỏng;
- retention/expiry;
- failure trước và sau side effect;
- không duplicate order/payment/refund.

### 29.3. Concurrency tests

Endpoint dùng ETag phải test:

- GET trả ETag;
- update có If-Match đúng;
- thiếu If-Match;
- ETag cũ;
- hai update cạnh tranh;
- ETag mới sau update.

### 29.4. Pagination tests

Phải test:

- default page/size;
- max size;
- invalid page;
- stable ordering;
- tie-breaker;
- filter + sort;
- empty page;
- cursor tampering/expiry nếu dùng;
- không lặp/mất item trong kịch bản phù hợp.

### 29.5. Webhook tests

Phải test:

- valid signature;
- invalid signature;
- expired timestamp;
- duplicate event;
- out-of-order event;
- unknown event type;
- processing retry;
- provider timeout/ack;
- raw body không bị thay đổi trước verification.

### 29.6. Contract tests

- OpenAPI phải validate.
- Response thực tế phải khớp schema.
- Request example phải được server chấp nhận khi hợp lệ.
- Problem response phải khớp common schema.
- Breaking diff phải chạy trong CI.
- Ít nhất một nhóm end-to-end test phải chạy qua HTTP stack thực cho các luồng critical.

MockMvc test hữu ích nhưng không thay thế hoàn toàn test qua server/gateway thật cho:

- CORS;
- security header;
- proxy path;
- content length;
- compression;
- upload;
- timeout;
- TLS/gateway behavior.

---

## 30. Quy trình thêm hoặc sửa API

AI agent phải thực hiện theo thứ tự:

1. xác định actor và use case;
2. đọc rule 00, 20, 30 và các domain rule liên quan;
3. xác định resource, state transition và ownership;
4. kiểm tra endpoint hiện có để tránh trùng;
5. phân loại thay đổi breaking/non-breaking;
6. cập nhật OpenAPI;
7. xác định method, status, header và idempotency;
8. thiết kế request/response DTO tối thiểu;
9. định nghĩa validation;
10. định nghĩa problem types;
11. triển khai controller/use case/mapping;
12. thêm authorization;
13. thêm transaction/locking theo rule database;
14. thêm test;
15. chạy contract lint/diff/test;
16. báo cáo thay đổi và rủi ro còn lại.

Không được bắt đầu bằng cách sinh controller CRUD từ entity rồi mới “sửa dần”.

---

## 31. Definition of Done cho API

Một API chỉ hoàn tất khi:

- [ ] đúng base path và URI convention;
- [ ] method đúng semantics;
- [ ] status code chính xác;
- [ ] request/response DTO tách entity;
- [ ] validation đầy đủ;
- [ ] authorization và ownership đầy đủ;
- [ ] error theo RFC 9457;
- [ ] JSON ID/money/time/enum đúng chuẩn;
- [ ] pagination/filter/sort có giới hạn;
- [ ] idempotency được xử lý nếu có side effect critical;
- [ ] concurrency/ETag được xử lý nếu có lost-update risk;
- [ ] cache policy rõ;
- [ ] OpenAPI cập nhật;
- [ ] example hợp lệ;
- [ ] không breaking ngoài kế hoạch;
- [ ] test happy/error/security/concurrency;
- [ ] không lộ secret/PII/internal field;
- [ ] metric/log/trace đủ dùng;
- [ ] CI pass.

---

## 32. Hành vi bị cấm

AI agent và developer không được:

- trả `200` cho mọi response;
- dùng `success/message/data` envelope máy móc;
- trả entity JPA;
- nhận entity JPA làm request;
- expose Spring `Page`;
- tạo endpoint `getX`, `createX`, `updateX`;
- dùng GET để thay đổi state;
- cho client sửa order/payment/inventory status trực tiếp;
- tin price/discount/total từ client;
- dùng `double` cho tiền;
- trả numeric ID có thể vượt JavaScript safe integer;
- trả local time không timezone cho instant;
- bỏ qua unknown field nhạy cảm;
- bắt tất cả exception rồi trả cùng một message;
- trả stack trace/SQL/internal path;
- nhận token qua query;
- list không phân trang;
- filter/sort trực tiếp bằng tên cột client gửi;
- retry POST tài chính mà không có idempotency;
- dùng idempotency key như authorization;
- dùng Shallow ETag để thay optimistic locking;
- bỏ qua `If-Match` rồi ghi đè;
- xóa endpoint đang dùng mà không deprecate/migrate;
- mô tả Internet-Draft là RFC đã hoàn tất;
- công khai Swagger/admin docs không kiểm soát;
- dùng example có secret hoặc dữ liệu thật;
- tuyên bố API hoàn tất khi OpenAPI và test chưa đồng bộ.

---

## 33. Xử lý ngoại lệ và báo cáo của AI agent

Nếu yêu cầu của task buộc phải lệch rule, AI agent phải dừng và báo:

~~~text
API RULE EXCEPTION

- Rule bị ảnh hưởng:
- Endpoint/operation:
- Lý do:
- Rủi ro:
- Phạm vi:
- Biện pháp giảm thiểu:
- Tác động tương thích:
- Test bổ sung:
- Kế hoạch loại bỏ ngoại lệ:
- Người cần phê duyệt:
~~~

AI agent không được tự coi yêu cầu mơ hồ là phê duyệt ngoại lệ.

Khi hoàn thành thay đổi API, báo cáo tối thiểu:

~~~text
API CHANGE REPORT

- Contract thay đổi:
- Endpoint thêm/sửa/xóa:
- Breaking change: có/không
- Security/ownership:
- Idempotency/concurrency:
- Error codes:
- OpenAPI:
- Tests đã chạy:
- Migration/deprecation:
- Rủi ro còn lại:
~~~

---

## 34. Tài liệu tham chiếu chính thức

- RFC 9110 — HTTP Semantics: https://www.rfc-editor.org/rfc/rfc9110
- RFC 9111 — HTTP Caching: https://www.rfc-editor.org/rfc/rfc9111
- RFC 9457 — Problem Details for HTTP APIs: https://www.rfc-editor.org/rfc/rfc9457
- RFC 5789 — PATCH Method for HTTP: https://www.rfc-editor.org/rfc/rfc5789
- RFC 7396 — JSON Merge Patch: https://www.rfc-editor.org/rfc/rfc7396
- RFC 8288 — Web Linking: https://www.rfc-editor.org/rfc/rfc8288
- RFC 9745 — Deprecation HTTP Response Header: https://www.rfc-editor.org/rfc/rfc9745
- RFC 8594 — Sunset HTTP Header: https://www.rfc-editor.org/rfc/rfc8594
- OpenAPI Specification: https://spec.openapis.org/oas/
- Spring MVC Error Responses: https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-rest-exceptions.html
- Spring MVC HTTP Caching: https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-caching.html
- Spring MVC API Versioning: https://docs.spring.io/spring-framework/reference/web/webmvc-versioning.html
- Spring MockMvc: https://docs.spring.io/spring-framework/reference/testing/mockmvc.html
- OWASP REST Security Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html

---

## 35. Nguyên tắc cuối cùng

API không chỉ là controller chạy được. API là hợp đồng dài hạn giữa backend, web, mobile, admin và hệ thống bên thứ ba.

Mọi quyết định API phải ưu tiên:

1. đúng nghiệp vụ;
2. an toàn;
3. nhất quán;
4. tương thích;
5. quan sát và kiểm thử được;
6. hiệu năng có giới hạn;
7. dễ dùng nhưng không đánh đổi tính đúng đắn.

Nếu chưa thể chứng minh một endpoint đúng các nguyên tắc trên, endpoint đó chưa sẵn sàng để phát hành.