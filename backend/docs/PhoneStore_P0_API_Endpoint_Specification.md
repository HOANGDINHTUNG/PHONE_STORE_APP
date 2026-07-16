# PHONE STORE P0 API ENDPOINT SPECIFICATION

**Project:** Phone Store E-Commerce & Management Platform  
**API style:** REST-oriented HTTP API  
**Base path:** `/api/v1`  
**Database source:** `PhoneStore_Enterprise_Schema.sql`  
**Document version:** 1.0  
**Scope:** P0 — các API bắt buộc để hệ thống vận hành end-to-end

---

## Document Map

1. Mục đích và định nghĩa P0.
2. Chuẩn HTTP, authentication, error, pagination và transaction.
3. Identity, account, customer address.
4. Organization, staff và RBAC động.
5. Public/admin product catalog.
6. Cart và coupon.
7. Warehouse, supplier, procurement và inventory.
8. Checkout và order lifecycle.
9. Payment, webhook, shipment và fulfillment.
10. Warranty, return, exchange và refund.
11. Cross-cutting audit, notification, jobs và security.
12. Schema gaps cần sửa trước production.
13. Traceability, thứ tự triển khai và Definition of Done.

---

## 1. Mục đích tài liệu

Tài liệu này chuyển mô hình dữ liệu 60 bảng thành danh sách endpoint P0 có thể dùng để:

- Viết Product Backlog và chia Epic/Story/Task trên Agile/Scrum.
- Xác định rõ actor, quyền, dữ liệu đầu vào, bảng bị tác động và HTTP status.
- Làm hợp đồng giữa Frontend, Backend, QA và BA trước khi code.
- Xác định transaction boundary, idempotency và concurrency cho nghiệp vụ quan trọng.
- Tránh tạo endpoint CRUD máy móc không phản ánh đúng nghiệp vụ.

Tài liệu **không chứa code triển khai**. Request/response chỉ được mô tả dưới dạng trường dữ liệu và quy tắc nghiệp vụ.

---

## 2. Định nghĩa P0

P0 là chức năng nếu thiếu thì ít nhất một luồng vận hành cốt lõi không thể hoàn thành hoặc không an toàn:

1. Khách đăng ký, xác minh, đăng nhập và quản lý thông tin cơ bản.
2. Admin tạo nhân viên, chức danh, role và phân quyền.
3. Nhân viên tạo catalog và SKU có thể bán.
4. Bộ phận mua hàng nhập hàng từ nhà cung cấp vào kho.
5. Khách thêm sản phẩm vào giỏ và checkout.
6. Hệ thống chống tạo đơn trùng, chống bán vượt tồn và giữ coupon đúng quota.
7. Khách thanh toán hoặc chọn COD.
8. Kho đóng gói, gắn đúng serial/IMEI và giao hàng.
9. Khách sử dụng bảo hành, đổi trả và được hoàn tiền đúng số tiền.
10. Mọi thao tác nhạy cảm được kiểm tra quyền và ghi audit.

### 2.1 Chưa thuộc phạm vi P0

Các bảng/chức năng sau vẫn tồn tại trong database nhưng endpoint UI tương ứng được xếp P1/P2:

- Wishlist.
- Compare products.
- Review và moderation review.
- Related-product recommendation.
- Banner CMS.
- Dashboard/reporting.
- Màn hình tra cứu audit log.
- Màn hình trung tâm notification và đánh dấu đã đọc.
- Marketing automation.

Lưu ý: `audit_logs`, `notifications` và `notification_deliveries` vẫn có thể là **side effect bắt buộc** của endpoint P0 dù API quản trị/tra cứu chúng chưa nằm trong P0.

---

## 3. Quy ước HTTP chung

### 3.1 HTTP Method

| Method | Ý nghĩa sử dụng |
|---|---|
| `GET` | Đọc dữ liệu, không tạo side effect nghiệp vụ |
| `POST` | Tạo resource hoặc thực hiện command nghiệp vụ |
| `PATCH` | Cập nhật một phần hoặc thực hiện transition có kiểm soát |
| `PUT` | Thay thế toàn bộ một tập dữ liệu con, ví dụ danh sách specifications |
| `DELETE` | Xóa dữ liệu phụ hoặc soft-delete/vô hiệu hóa theo policy |

### 3.2 HTTP Status Code

| Status | Ý nghĩa chuẩn |
|---|---|
| `200 OK` | Đọc/cập nhật/command thành công và có response body |
| `201 Created` | Tạo resource thành công |
| `202 Accepted` | Đã nhận yêu cầu và xử lý bất đồng bộ |
| `204 No Content` | Thành công, không cần response body |
| `400 Bad Request` | Request sai cú pháp, sai kiểu hoặc thiếu trường |
| `401 Unauthorized` | Thiếu/invalid/expired authentication credential |
| `403 Forbidden` | Đã xác thực nhưng không có permission hoặc không sở hữu resource |
| `404 Not Found` | Resource không tồn tại hoặc cố tình được che giấu khỏi actor |
| `409 Conflict` | Trùng unique key, version conflict, state conflict, hết tồn do cạnh tranh |
| `410 Gone` | Token/resource tạm đã hết hạn hoặc không còn dùng được |
| `412 Precondition Failed` | `If-Match`/version không còn đúng |
| `422 Unprocessable Entity` | Dữ liệu đúng cú pháp nhưng vi phạm business rule |
| `423 Locked` | Tài khoản đang bị khóa |
| `429 Too Many Requests` | Vượt rate limit |
| `500 Internal Server Error` | Lỗi nội bộ không dự kiến |
| `502 Bad Gateway` | Provider thanh toán/giao vận trả lỗi |
| `503 Service Unavailable` | Dịch vụ phụ thuộc tạm thời không khả dụng |

### 3.3 Authentication và actor

| Nhãn | Ý nghĩa |
|---|---|
| `Public` | Không cần đăng nhập nhưng phải rate-limit |
| `Customer` | Access token hợp lệ và có customer profile |
| `Staff` | Có staff profile đang hoạt động và role hiệu lực |
| `Permission: X` | Effective permission set phải chứa mã `X` |
| `Owner` | Resource phải thuộc user/customer hiện tại |
| `Internal` | Chỉ service/job tin cậy, không expose Internet |
| `Webhook` | Public network nhưng bắt buộc xác minh chữ ký provider |

Effective permission được tính từ:

`users → user_roles → roles → role_permissions → permissions`

Chỉ chấp nhận assignment/role/permission còn hiệu lực. UI ẩn nút không thay thế kiểm tra quyền ở backend.

### 3.4 Header chuẩn

| Header | Khi sử dụng |
|---|---|
| `Authorization: Bearer ...` | API cần đăng nhập |
| `Idempotency-Key` | Checkout, payment attempt, nhận hàng, shipment command và refund |
| `If-Match` | Cập nhật resource có cột `version` |
| `X-Correlation-Id` | Nối log, audit, webhook và background job |
| `X-Guest-Cart-Token` | Xác định giỏ khách vãng lai; server chỉ lưu hash |
| `X-Guest-Order-Token` | Truy cập đơn guest bằng token ký an toàn, không chỉ bằng order code |

### 3.5 Response và error envelope

Mọi response lỗi phải có tối thiểu:

- `error_code`: mã ổn định để frontend/QA sử dụng.
- `message`: thông báo an toàn cho người dùng.
- `field_errors`: lỗi theo trường nếu có.
- `correlation_id`: dùng để tra log.

Không trả stack trace, SQL, token hash, password hash, raw provider payload hoặc dữ liệu nhạy cảm.

### 3.6 Phân trang và sắp xếp

- Query mặc định: `page=1`, `page_size=20`.
- `page_size` tối đa do server quy định, đề xuất 100.
- Sort field phải nằm trong allowlist, không truyền trực tiếp vào SQL.
- Danh sách lớn nên trả `total_items`, `total_pages`, `page`, `page_size`.

### 3.7 Quy tắc transaction và gọi hệ thống ngoài

- Không gọi payment gateway, carrier, email hoặc SMS khi DB transaction còn mở.
- Command thay đổi nhiều bảng phải commit hoặc rollback toàn bộ.
- Lock nhiều hàng tồn theo thứ tự `(warehouse_id, product_variant_id)` tăng dần.
- Deadlock có thể retry với backoff giới hạn nếu command có idempotency.
- Notification chỉ được publish sau commit.

---

## 4. P0 Coverage Summary

Tổng phạm vi gồm **164 endpoint P0**: `GET` 57, `POST` 64, `PATCH` 32, `PUT` 6 và `DELETE` 5. Mỗi ID trong inventory đều có phần mô tả nghiệp vụ tương ứng ở tài liệu này.

| Domain | Endpoint group | Mục tiêu |
|---|---|---|
| Identity | AUTH, USER | Đăng ký, đăng nhập, token, profile và quản trị tài khoản |
| Organization/RBAC | DEPT, POS, STAFF, PERM, ROLE, ASSIGN | Nhân sự, chức danh và phân quyền động |
| Catalog | CAT, BRAND, PRODUCT, VARIANT, PRICE, IMAGE, SPEC, ATTR | Sản phẩm/SKU có thể tìm kiếm và bán |
| Customer | ADDRESS, CART | Địa chỉ, giỏ customer và guest |
| Promotion | COUPON | Tạo, cấu hình và giữ quota coupon |
| Procurement | WH, SUP, PO | Kho, nhà cung cấp, mua và nhận hàng |
| Inventory | INV | Tồn theo kho, serial/IMEI và ledger |
| Sales | ORDER | Checkout và vòng đời đơn hàng |
| Payment | PAY | Attempt, COD/manual confirmation và webhook |
| Fulfillment | SHIP | Tách kiện, gắn unit và tracking |
| Warranty | WARRANTY, CLAIM | Phát hành bảo hành và xử lý claim |
| Return/Refund | RETURN, REFUND | Đổi trả, inspection và hoàn tiền |

---

## 5. Identity, Authentication and Account P0 APIs

### 5.1 Endpoint inventory

| ID | Method | Endpoint | Actor | Success | Chức năng |
|---|---|---|---|---|---|
| AUTH-001 | `POST` | `/auth/register` | Public | `201` | Đăng ký customer |
| AUTH-002 | `POST` | `/auth/email-verifications/confirm` | Public | `204` | Xác minh email |
| AUTH-003 | `POST` | `/auth/email-verifications` | Public | `202` | Gửi lại email xác minh |
| AUTH-004 | `POST` | `/auth/login` | Public | `200` | Đăng nhập |
| AUTH-005 | `POST` | `/auth/token/refresh` | Refresh credential | `200` | Rotation refresh token |
| AUTH-006 | `POST` | `/auth/logout` | Authenticated | `204` | Thu hồi phiên hiện tại |
| AUTH-007 | `POST` | `/auth/password-reset-requests` | Public | `202` | Yêu cầu quên mật khẩu |
| AUTH-008 | `POST` | `/auth/password-resets/confirm` | Public | `204` | Đặt lại mật khẩu |
| AUTH-009 | `GET` | `/me` | Authenticated | `200` | Lấy tài khoản/profile hiện tại |
| AUTH-010 | `PATCH` | `/me` | Authenticated | `200` | Sửa thông tin cá nhân cho phép |
| USER-001 | `GET` | `/admin/users` | `USER_VIEW` | `200` | Danh sách tài khoản |
| USER-002 | `GET` | `/admin/users/{userId}` | `USER_VIEW` | `200` | Chi tiết tài khoản |
| USER-003 | `PATCH` | `/admin/users/{userId}` | `USER_UPDATE` | `200` | Sửa thông tin tài khoản |
| USER-004 | `PATCH` | `/admin/users/{userId}/status` | `USER_DISABLE` | `200` | Khóa, mở khóa hoặc vô hiệu hóa |

### AUTH-001 — Register Customer Account

**Endpoint:** `POST /api/v1/auth/register`  
**Tables:** `users`, `customer_profiles`, `roles`, `user_roles`, `email_verification_tokens`; optional `audit_logs`  
**Input:** `full_name`, `email`, optional `phone`, `password`, optional `marketing_opt_in`.

**Business rules:**

1. Trim và chuẩn hóa email/phone trước khi kiểm tra unique.
2. Password phải đạt policy nhưng chỉ `password_hash` được lưu.
3. Tạo `users.account_status=PENDING_VERIFICATION`.
4. Tạo `customer_profiles.customer_code` duy nhất.
5. Gán system role `CUSTOMER`; không chấp nhận role từ request.
6. Tạo verification token entropy cao, DB chỉ giữ SHA-256 hash.
7. Năm thao tác tạo user/profile/role assignment/token phải cùng transaction.
8. Email được gửi sau commit; lỗi gửi email không rollback tài khoản.

**Errors:** `409 EMAIL_ALREADY_EXISTS`, `409 PHONE_ALREADY_EXISTS`, `422 WEAK_PASSWORD`, `422 INVALID_CONTACT`, `429 REGISTER_RATE_LIMITED`.

### AUTH-002 — Confirm Email Verification

**Endpoint:** `POST /api/v1/auth/email-verifications/confirm`  
**Tables:** `email_verification_tokens`, `users`  
**Input:** raw verification token.

**Business rules:**

- Hash token và tìm bản ghi chưa `used_at`, chưa hết `expires_at`.
- Lock token để hai request đồng thời không thể dùng hai lần.
- Set `used_at`, `users.email_verified_at` và chuyển account sang `ACTIVE` nếu trạng thái hiện tại cho phép.
- Không dùng token cũ để kích hoạt tài khoản đã `DISABLED`.
- Schema token hiện không giữ email snapshot; nếu hệ thống cho đổi email trước khi xác minh thì phải revoke token cũ hoặc bổ sung pending-email design.

**Errors:** `400 INVALID_TOKEN`, `410 TOKEN_EXPIRED`, `409 TOKEN_ALREADY_USED`, `403 ACCOUNT_DISABLED`.

### AUTH-003 — Resend Verification Email

**Endpoint:** `POST /api/v1/auth/email-verifications`  
**Tables:** `users`, `email_verification_tokens`  
**Input:** email.

**Business rules:**

- Luôn trả `202` để hạn chế account enumeration.
- Nếu account hợp lệ nhưng chưa verify: vô hiệu toàn bộ token cũ rồi tạo token mới trong cùng transaction. Schema hiện không có `revoked_at`; P0 phải chọn rõ việc xóa token cũ hoặc bổ sung trạng thái thu hồi, không để nhiều token cùng có hiệu lực.
- Rate-limit theo IP, normalized email và account.
- Nếu account đã verify/disabled thì không gửi nhưng response bên ngoài vẫn giống nhau.

**Errors công khai:** chỉ `400 INVALID_REQUEST`, `429 VERIFICATION_RATE_LIMITED`.

### AUTH-004 — Login

**Endpoint:** `POST /api/v1/auth/login`  
**Tables:** `users`, `refresh_tokens`, `user_roles`, `roles`, `role_permissions`, `permissions`  
**Input:** email hoặc phone, password, optional device name.

**Business rules:**

1. Tìm bằng normalized email/phone.
2. Sai credential trả cùng một lỗi `401 INVALID_CREDENTIALS`.
3. Tăng `failed_login_count`; đến ngưỡng thì set `LOCKED` và `locked_until`.
4. Chặn `PENDING_VERIFICATION`, `DISABLED` và bản ghi soft-deleted. Với `LOCKED`: nếu `locked_until` còn hạn hoặc NULL thì chặn; nếu đã hết hạn, tự mở khóa theo policy và reset counter bằng update có state guard.
5. Thành công: reset failed count, cập nhật `last_login_at`, tạo access token và refresh token family.
6. DB chỉ lưu `refresh_tokens.token_hash`; raw token chỉ trả một lần qua secure cookie/response.
7. Effective roles phải ACTIVE, assignment chưa revoke/chưa hết hạn; permission phải ACTIVE.

**Success:** `200`; trả identity tối thiểu, access token expiry và permission/role summary cần cho UI.  
**Errors:** `401 INVALID_CREDENTIALS`, `403 EMAIL_NOT_VERIFIED`, `403 ACCOUNT_DISABLED`, `423 ACCOUNT_LOCKED`, `429 LOGIN_RATE_LIMITED`.

### AUTH-005 — Rotate Refresh Token

**Endpoint:** `POST /api/v1/auth/token/refresh`  
**Tables:** `refresh_tokens`, `users`.

**Business rules:**

- Hash raw token và lock bản ghi.
- Token phải chưa hết hạn, chưa revoke, user còn ACTIVE.
- Tạo token mới cùng `token_family_id`, set token cũ `revoked_at` và `replaced_by_token_id` trong một transaction.
- Nếu token đã revoke bị dùng lại: xem là token reuse, revoke toàn bộ family và yêu cầu đăng nhập lại.
- Không kéo dài vô hạn nếu chính sách có absolute session lifetime.

**Errors:** `401 REFRESH_TOKEN_INVALID`, `401 REFRESH_TOKEN_EXPIRED`, `401 TOKEN_REUSE_DETECTED`, `403 ACCOUNT_DISABLED`.

### AUTH-006 — Logout Current Session

**Endpoint:** `POST /api/v1/auth/logout`  
**Tables:** `refresh_tokens`.

- Revoke refresh token hiện tại và ghi reason `USER_LOGOUT`.
- Command idempotent: token đã revoke vẫn trả `204`.
- Access token ngắn hạn hết hiệu lực theo expiry hoặc denylist policy.

### AUTH-007 — Request Password Reset

**Endpoint:** `POST /api/v1/auth/password-reset-requests`  
**Tables:** `users`, `password_reset_tokens`.

- Luôn trả `202` cho email tồn tại hoặc không tồn tại.
- Với account hợp lệ: tạo token hash có expiry ngắn và giới hạn số yêu cầu.
- Không gửi raw token vào log/audit.
- Account disabled cần policy riêng; mặc định không gửi reset nhưng response không khác.

### AUTH-008 — Confirm Password Reset

**Endpoint:** `POST /api/v1/auth/password-resets/confirm`  
**Tables:** `password_reset_tokens`, `users`, `refresh_tokens`  
**Input:** raw reset token, new password.

- Lock token, kiểm tra expiry/used state và password policy.
- Update password hash, set token hiện tại `used_at` và vô hiệu toàn bộ reset token chưa dùng khác của cùng user trong một transaction; nếu không, token cũ vẫn có thể đổi lại mật khẩu lần nữa.
- Revoke toàn bộ refresh token của user để buộc đăng nhập lại.
- Có thể reset failed count/lock nếu security policy cho phép; không tự mở account `DISABLED`.

**Errors:** `400 INVALID_TOKEN`, `410 TOKEN_EXPIRED`, `409 TOKEN_ALREADY_USED`, `422 WEAK_PASSWORD`.

### AUTH-009 — Get Current Account

**Endpoint:** `GET /api/v1/me`  
**Tables:** `users`, optional `customer_profiles`, `staff_profiles`, `positions`, `departments`, `user_roles`, `roles`.

- Trả dữ liệu phù hợp loại profile; không trả password/token hash.
- Trả role hiệu lực và permission summary nếu client quản trị cần.
- Customer không được thấy dữ liệu nhân sự của user khác.

**Errors:** `401 UNAUTHENTICATED`, `403 ACCOUNT_NOT_ACTIVE`.

### AUTH-010 — Patch Current Account

**Endpoint:** `PATCH /api/v1/me`  
**Tables:** `users`, `customer_profiles` hoặc `staff_profiles` tùy actor.

**Cho phép P0:** `full_name`, `avatar_url`, phone, customer demographic và marketing consent phù hợp.  
**Không cho phép:** role, status, employee code, position, manager, password hash, verified timestamps.

- Thay phone phải normalize, kiểm tra unique và reset `phone_verified_at`.
- Không hỗ trợ thay email trực tiếp ở P0 vì schema chưa có `pending_email` gắn với verification token.
- Dữ liệu staff-only phải đi qua admin staff endpoint.

**Errors:** `409 PHONE_ALREADY_EXISTS`, `422 INVALID_PROFILE_DATA`, `403 FIELD_NOT_EDITABLE`.

### USER-001 — List User Accounts

**Endpoint:** `GET /api/v1/admin/users`  
**Permission:** `USER_VIEW`  
**Tables:** `users`, optional customer/staff profile.

**Filters:** keyword, account status, profile type, created range, page, sort.  
**Rules:** mask contact theo permission/policy; không trả password/token data.  
**Success:** `200`.

### USER-002 — Get User Account Detail

**Endpoint:** `GET /api/v1/admin/users/{userId}`  
**Permission:** `USER_VIEW`.

- Trả user, customer/staff profile, effective role assignments và trạng thái xác minh.
- Không trả raw token, token hash hoặc password hash.
- `404 USER_NOT_FOUND` nếu không tồn tại.

### USER-003 — Patch User Account

**Endpoint:** `PATCH /api/v1/admin/users/{userId}`  
**Permission:** `USER_UPDATE`  
**Tables:** `users`; profile endpoint chuyên biệt chịu trách nhiệm dữ liệu staff.

- Cho sửa tên/contact/avatar và dữ liệu hành chính được policy cho phép.
- Role và status không được sửa bằng endpoint này.
- Normalize và kiểm tra unique contact.
- Không cho đổi email trực tiếp trong P0 vì verification token chưa bind pending email; đổi phone phải reset `phone_verified_at`.
- Ghi `audit_logs` old/new data đã redact.

### USER-004 — Change Account Status

**Endpoint:** `PATCH /api/v1/admin/users/{userId}/status`  
**Permission:** `USER_DISABLE`  
**Input:** target status, reason.

**Rules:**

- Transition cho phép: ACTIVE ↔ LOCKED, ACTIVE/LOCKED → DISABLED; khôi phục DISABLED cần policy cao hơn.
- Không cho actor tự disable chính mình nếu làm hệ thống mất quản trị.
- Không làm mất SUPER_ADMIN hiệu lực cuối cùng.
- Khi LOCKED/DISABLED: revoke refresh tokens và ghi audit.

**Errors:** `409 INVALID_STATUS_TRANSITION`, `409 LAST_SUPER_ADMIN_PROTECTED`, `403 SELF_PROTECTION_RULE`.

---

## 6. Customer Shipping Address P0 APIs

| ID | Method | Endpoint | Actor | Success | Chức năng |
|---|---|---|---|---|---|
| ADDRESS-001 | `GET` | `/me/shipping-addresses` | Customer | `200` | Danh sách địa chỉ |
| ADDRESS-002 | `POST` | `/me/shipping-addresses` | Customer | `201` | Tạo địa chỉ |
| ADDRESS-003 | `GET` | `/me/shipping-addresses/{addressId}` | Owner | `200` | Chi tiết địa chỉ |
| ADDRESS-004 | `PATCH` | `/me/shipping-addresses/{addressId}` | Owner | `200` | Sửa địa chỉ |
| ADDRESS-005 | `POST` | `/me/shipping-addresses/{addressId}/set-default` | Owner | `204` | Đặt mặc định |
| ADDRESS-006 | `DELETE` | `/me/shipping-addresses/{addressId}` | Owner | `204` | Soft-delete địa chỉ |

### Shared address rules

**Tables:** `shipping_addresses`, `customer_profiles`.

- `customer_id` luôn lấy từ access token, không lấy từ request.
- Validate country/province/district/ward theo source dữ liệu địa giới của ứng dụng.
- Chuẩn hóa receiver phone trước khi lưu.
- Chỉ trả bản ghi `deleted_at IS NULL` cho customer.
- Đơn hàng đã checkout dùng shipping snapshot; sửa/xóa address không thay đổi đơn cũ.
- Generated unique `default_customer_id` bảo đảm tối đa một default address.

### ADDRESS-001 — List My Addresses

Hỗ trợ sort default trước, sau đó `updated_at` mới nhất. Không cho truy cập address của customer khác.  
**Errors:** `401`, `403 CUSTOMER_PROFILE_REQUIRED`.

### ADDRESS-002 — Create Address

**Input:** receiver name/phone, country, province, district, ward, detail address, postal code, optional `is_default`.

- Nếu đây là địa chỉ đầu tiên, service tự đặt default.
- Nếu request đặt default, clear default cũ và insert mới trong cùng transaction.
- `201 Created`; `422 INVALID_ADMINISTRATIVE_AREA`, `422 INVALID_PHONE`.

### ADDRESS-003 — Get Address

Chỉ owner được đọc. Resource của người khác trả `404` thay vì tiết lộ tồn tại.

### ADDRESS-004 — Patch Address

Chỉ cập nhật trường gửi hàng; không đổi owner. Nếu thay `is_default`, dùng cùng logic transaction như endpoint set-default.  
**Errors:** `404 ADDRESS_NOT_FOUND`, `422 INVALID_ADDRESS`, `409 DEFAULT_ADDRESS_CONFLICT`.

### ADDRESS-005 — Set Default Address

Lock toàn bộ active addresses của customer, set default cũ false rồi set address đích true trong một transaction. Command idempotent.  
**Errors:** `404 ADDRESS_NOT_FOUND`.

### ADDRESS-006 — Delete Address

- Set `deleted_at`, không hard delete; đồng thời luôn set `is_default=FALSE` cho bản ghi bị xóa.
- Nếu xóa default và còn địa chỉ khác, chọn default mới theo policy trong cùng transaction. Nếu không còn địa chỉ khác, việc clear `is_default` vẫn bắt buộc vì generated unique `default_customer_id` không tự loại bản ghi soft-deleted.
- Không xóa snapshot nằm trong `orders`.

---

## 7. Organization, Staff and RBAC P0 APIs

### 7.1 Endpoint inventory

| ID | Method | Endpoint | Permission | Success | Chức năng |
|---|---|---|---|---|---|
| DEPT-001 | `GET` | `/admin/departments` | Staff authenticated | `200` | Danh sách phòng ban |
| DEPT-002 | `POST` | `/admin/departments` | `DEPARTMENT_MANAGE` | `201` | Tạo phòng ban |
| DEPT-003 | `PATCH` | `/admin/departments/{departmentId}` | `DEPARTMENT_MANAGE` | `200` | Sửa phòng ban |
| DEPT-004 | `PATCH` | `/admin/departments/{departmentId}/status` | `DEPARTMENT_MANAGE` | `200` | Active/inactive phòng ban |
| POS-001 | `GET` | `/admin/positions` | Staff authenticated | `200` | Danh sách chức danh |
| POS-002 | `POST` | `/admin/positions` | `POSITION_MANAGE` | `201` | Tạo chức danh |
| POS-003 | `PATCH` | `/admin/positions/{positionId}` | `POSITION_MANAGE` | `200` | Sửa chức danh |
| POS-004 | `PATCH` | `/admin/positions/{positionId}/status` | `POSITION_MANAGE` | `200` | Active/inactive chức danh |
| STAFF-001 | `GET` | `/admin/staff` | `USER_VIEW` | `200` | Danh sách nhân viên |
| STAFF-002 | `POST` | `/admin/staff` | `STAFF_CREATE` | `201` | Tạo/invite nhân viên |
| STAFF-003 | `GET` | `/admin/staff/{userId}` | `USER_VIEW` | `200` | Chi tiết nhân viên |
| STAFF-004 | `PATCH` | `/admin/staff/{userId}` | `STAFF_UPDATE` | `200` | Sửa hồ sơ nhân viên |
| STAFF-005 | `PATCH` | `/admin/staff/{userId}/employment-status` | `STAFF_UPDATE` | `200` | Đổi trạng thái lao động |
| PERM-001 | `GET` | `/admin/permissions` | `ROLE_VIEW` | `200` | Danh mục permission |
| ROLE-001 | `GET` | `/admin/roles` | `ROLE_VIEW` | `200` | Danh sách role |
| ROLE-002 | `POST` | `/admin/roles` | `ROLE_CREATE` | `201` | Tạo custom role |
| ROLE-003 | `GET` | `/admin/roles/{roleId}` | `ROLE_VIEW` | `200` | Chi tiết role và permission |
| ROLE-004 | `PATCH` | `/admin/roles/{roleId}` | `ROLE_UPDATE` | `200` | Sửa custom role |
| ROLE-005 | `PATCH` | `/admin/roles/{roleId}/status` | `ROLE_DISABLE` | `200` | Active/inactive custom role |
| ROLE-006 | `PUT` | `/admin/roles/{roleId}/permissions` | `ROLE_UPDATE` | `200` | Thay permission set |
| ASSIGN-001 | `GET` | `/admin/users/{userId}/role-assignments` | `ROLE_VIEW` | `200` | Xem lịch sử/effective role |
| ASSIGN-002 | `POST` | `/admin/users/{userId}/role-assignments` | `ROLE_ASSIGN` | `201` | Gán role |
| ASSIGN-003 | `POST` | `/admin/users/{userId}/role-assignments/{assignmentId}/revoke` | `ROLE_ASSIGN` | `200` | Thu hồi role |

### 7.2 Department rules

**Tables:** `departments`, `positions`.

#### DEPT-001 — List Departments

Hỗ trợ keyword, status, page. Staff dùng dữ liệu này để chọn position và lọc nhân sự. `200`.

#### DEPT-002 — Create Department

- `code` và `name` duy nhất; normalize code uppercase.
- Không cho client tự set timestamps.
- Ghi audit old/new context.
- Errors: `409 DEPARTMENT_CODE_EXISTS`, `409 DEPARTMENT_NAME_EXISTS`, `422 INVALID_DEPARTMENT`.

#### DEPT-003 — Patch Department

- Code nên bất biến sau khi được dùng hoặc chỉ đổi với policy rõ ràng.
- Không được sửa trực tiếp status ở endpoint này.
- `404 DEPARTMENT_NOT_FOUND`, `409 DUPLICATE_DEPARTMENT`.

#### DEPT-004 — Change Department Status

- Chuyển `INACTIVE` không xóa positions/staff history.
- Không cho tạo/điều chuyển staff vào department inactive.
- Nếu còn active positions/staff, yêu cầu xác nhận nghiệp vụ hoặc trả `409 DEPARTMENT_IN_USE`.

### 7.3 Position rules

**Tables:** `positions`, `departments`, `staff_profiles`.

#### POS-001 — List Positions

Filter theo department/status/keyword; có thể trả department summary. `200`.

#### POS-002 — Create Position

- Department phải tồn tại và ACTIVE.
- `code` duy nhất trong department.
- Position chỉ mô tả chức danh, không tự cấp permission.
- `201`; errors `404 DEPARTMENT_NOT_FOUND`, `409 POSITION_CODE_EXISTS`, `422 DEPARTMENT_INACTIVE`.

#### POS-003 — Patch Position

Không đổi department tùy tiện khi đã có staff; nếu cần phải dùng quy trình migration nhân sự. Ghi audit.

#### POS-004 — Change Position Status

Không cho gán mới position INACTIVE. Staff hiện hữu vẫn giữ lịch sử; cần điều chuyển trước khi chính sách chặn hoàn toàn.

### 7.4 Staff rules

**Tables:** `users`, `staff_profiles`, `positions`, `departments`, `roles`, `user_roles`, auth token tables.

#### STAFF-001 — List Staff

Filters: employee code, keyword, department, position, manager, employment status, account status. Mask contact nếu actor không có scope phù hợp.

#### STAFF-002 — Create/Invite Staff

**Input:** identity/contact, employee code, position, optional manager, hire date.

1. Position và department liên quan phải ACTIVE.
2. Manager phải là active staff và không phải chính user mới.
3. Employee code unique.
4. Tạo `users`, `staff_profiles`, gán base role `STAFF` cùng transaction.
5. Không đặt mật khẩu mặc định dễ đoán. Dùng unusable random hash và gửi password-setup/reset token qua kênh an toàn.
6. Staff hoàn tất xác minh email và thiết lập password trước khi ACTIVE theo policy.
7. Ghi actor `created_by` và audit.

**Errors:** `409 EMPLOYEE_CODE_EXISTS`, `409 EMAIL_ALREADY_EXISTS`, `422 POSITION_INACTIVE`, `422 INVALID_MANAGER`.

#### STAFF-003 — Get Staff Detail

Trả identity, employment profile, position/department, manager và role assignments. Không trả password/token data.

#### STAFF-004 — Patch Staff Profile

- Sửa employee code, position, manager, hire date trong phạm vi policy.
- Position mới phải ACTIVE.
- Manager chain không được tạo vòng lặp; cần duyệt ancestor chain trước update.
- Role không sửa tại endpoint này.
- Ghi before/after vào audit.

#### STAFF-005 — Change Employment Status

- Transition: ACTIVE ↔ ON_LEAVE; ACTIVE/ON_LEAVE → SUSPENDED/TERMINATED theo policy.
- `TERMINATED` thường là terminal; khôi phục cần quy trình riêng.
- SUSPENDED/TERMINATED phải revoke session và có thể disable user account.
- Không làm mất SUPER_ADMIN cuối cùng.

### 7.5 RBAC rules

#### PERM-001 — List Permissions

Đọc `permissions`, filter module/status/sensitive. Permission do phần mềm/migration sở hữu; không có P0 endpoint cho Admin tự tạo permission.

#### ROLE-001 — List Roles

Filter `role_type`, status, keyword; trả số permission và số assignment hiệu lực.

#### ROLE-002 — Create Custom Role

- Chỉ tạo `role_type=CUSTOM`.
- Normalize và unique code.
- Không cho tạo code giả mạo `SUPER_ADMIN`, `ADMIN`, `STAFF`, `CUSTOMER`.
- Có thể nhận permission IDs, nhưng insert role + role_permissions phải cùng transaction.

#### ROLE-003 — Get Role Detail

Trả role metadata, permission set, status và cờ protected nếu role type SYSTEM.

#### ROLE-004 — Patch Custom Role

- Không sửa role SYSTEM qua API thường.
- Code nên immutable sau create; chỉ cho sửa name/description.
- Ghi audit và invalidate authorization cache.

#### ROLE-005 — Change Role Status

- Chỉ custom role.
- INACTIVE làm assignment hiện hữu không còn cấp quyền nhưng vẫn giữ lịch sử.
- Không disable protected system role.

#### ROLE-006 — Replace Role Permissions

- Input là toàn bộ permission ID set mong muốn.
- Mọi permission phải tồn tại và ACTIVE.
- Replace trong một transaction; không để role ở trạng thái nửa cũ/nửa mới.
- Không cho Admin thông thường sửa system role hoặc tạo đường cấp SUPER_ADMIN trái policy.
- Ghi permission diff vào audit và invalidate session/cache.

#### ASSIGN-001 — List User Role Assignments

Trả assignment history và đánh dấu effective dựa trên `assignment_status`, role status và `expires_at`.

#### ASSIGN-002 — Assign Role

**Input:** role ID, optional expiry, reason.

- User/role phải tồn tại, role ACTIVE.
- Không tạo active assignment trùng do `active_assignment_key` unique.
- Bản ghi ACTIVE đã hết hạn vẫn chặn gán lại; service phải revoke/cleanup bản ghi cũ trước khi insert.
- Chỉ actor đặc quyền được gán protected ADMIN/SUPER_ADMIN.
- `assigned_by` lấy từ access token; ghi audit.

#### ASSIGN-003 — Revoke Role Assignment

- Lock assignment, chuyển `REVOKED`, set actor/time/reason.
- Idempotent nếu đã revoke.
- Không cho user tự revoke role làm mất SUPER_ADMIN cuối cùng.
- Invalidate permission cache/session theo security policy.

---

## 8. Product Catalog P0 APIs

### 8.1 Endpoint inventory

| ID | Method | Endpoint | Actor/Permission | Success | Chức năng |
|---|---|---|---|---|---|
| CAT-PUB-001 | `GET` | `/categories/tree` | Public | `200` | Cây danh mục active |
| BRAND-PUB-001 | `GET` | `/brands` | Public | `200` | Thương hiệu active |
| PRODUCT-PUB-001 | `GET` | `/products` | Public | `200` | Tìm kiếm/lọc sản phẩm |
| PRODUCT-PUB-002 | `GET` | `/products/{slug}` | Public | `200` | Product detail |
| CAT-ADM-001 | `GET` | `/admin/categories` | `PRODUCT_VIEW` | `200` | Danh mục gồm inactive |
| CAT-ADM-002 | `POST` | `/admin/categories` | `PRODUCT_CREATE` | `201` | Tạo danh mục |
| CAT-ADM-003 | `PATCH` | `/admin/categories/{categoryId}` | `PRODUCT_UPDATE` | `200` | Sửa danh mục |
| CAT-ADM-004 | `PATCH` | `/admin/categories/{categoryId}/status` | `PRODUCT_ARCHIVE` | `200` | Active/inactive danh mục |
| BRAND-ADM-001 | `GET` | `/admin/brands` | `PRODUCT_VIEW` | `200` | Danh sách brand quản trị |
| BRAND-ADM-002 | `POST` | `/admin/brands` | `PRODUCT_CREATE` | `201` | Tạo brand |
| BRAND-ADM-003 | `PATCH` | `/admin/brands/{brandId}` | `PRODUCT_UPDATE` | `200` | Sửa brand |
| BRAND-ADM-004 | `PATCH` | `/admin/brands/{brandId}/status` | `PRODUCT_ARCHIVE` | `200` | Active/inactive brand |
| PRODUCT-ADM-001 | `GET` | `/admin/products` | `PRODUCT_VIEW` | `200` | Danh sách mọi trạng thái |
| PRODUCT-ADM-002 | `POST` | `/admin/products` | `PRODUCT_CREATE` | `201` | Tạo product DRAFT |
| PRODUCT-ADM-003 | `GET` | `/admin/products/{productId}` | `PRODUCT_VIEW` | `200` | Chi tiết quản trị |
| PRODUCT-ADM-004 | `PATCH` | `/admin/products/{productId}` | `PRODUCT_UPDATE` | `200` | Sửa nội dung product |
| PRODUCT-ADM-005 | `PATCH` | `/admin/products/{productId}/status` | `PRODUCT_ARCHIVE` | `200` | Publish/inactive product |
| VARIANT-001 | `POST` | `/admin/products/{productId}/variants` | `PRODUCT_CREATE` | `201` | Tạo SKU |
| VARIANT-002 | `PATCH` | `/admin/variants/{variantId}` | `PRODUCT_UPDATE` | `200` | Sửa variant không gồm giá |
| VARIANT-003 | `PATCH` | `/admin/variants/{variantId}/status` | `PRODUCT_ARCHIVE` | `200` | Active/inactive SKU |
| PRICE-001 | `POST` | `/admin/variants/{variantId}/price-changes` | `PRODUCT_UPDATE` | `200` | Đổi giá có history |
| IMAGE-001 | `POST` | `/admin/variants/{variantId}/images` | `PRODUCT_UPDATE` | `201` | Thêm ảnh variant |
| IMAGE-002 | `POST` | `/admin/variants/{variantId}/images/{imageId}/set-primary` | `PRODUCT_UPDATE` | `204` | Đặt ảnh chính |
| IMAGE-003 | `DELETE` | `/admin/variants/{variantId}/images/{imageId}` | `PRODUCT_UPDATE` | `204` | Xóa ảnh |
| SPEC-001 | `PUT` | `/admin/products/{productId}/specifications` | `PRODUCT_UPDATE` | `200` | Thay bộ thông số |
| ATTR-001 | `PUT` | `/admin/products/{productId}/attributes` | `PRODUCT_UPDATE` | `200` | Thay bộ thuộc tính lọc |

### 8.2 Public catalog rules

#### CAT-PUB-001 — Get Active Category Tree

**Tables:** `categories`.

- Chỉ `status=ACTIVE`.
- Tạo cây từ `parent_id`; sort theo `sort_order`, sau đó name.
- DB chỉ ngăn self-parent; nếu gặp cycle do dữ liệu lỗi, API phải fail-safe và ghi cảnh báo thay vì loop vô hạn.
- Có thể cache; invalidate khi category được cập nhật.

#### BRAND-PUB-001 — List Active Brands

**Tables:** `brands`. Chỉ trả ACTIVE; hỗ trợ keyword và sort name. Không trả brand inactive dù còn product lịch sử.

#### PRODUCT-PUB-001 — Search/List Products

**Tables:** `products`, `product_variants`, `product_images`, `categories`, `brands`, `product_attributes`, `warehouse_inventories`, `warehouses`.

**Filters:** keyword, category, brand, RAM, storage, color, min/max effective price, in-stock, page, sort.

**Rules:**

- Product phải `publication_status=ACTIVE`, `deleted_at IS NULL`.
- Có ít nhất một variant ACTIVE và chưa deleted.
- Effective price = `sale_price` nếu có, ngược lại `list_price`.
- In-stock dựa trên tổng `available_quantity` của kho ACTIVE.
- Search/sort field dùng allowlist; full-text index phục vụ name/description.
- Không tin `sold_count`/`view_count` do client gửi.

**Errors:** `400 INVALID_FILTER`, `400 INVALID_SORT`, `422 PRICE_RANGE_INVALID`.

#### PRODUCT-PUB-002 — Get Product Detail

**Tables:** toàn bộ catalog liên quan và availability read model.

- Lookup bằng unique slug.
- Chỉ product/variants được publish.
- Trả images theo variant, specs nhóm, attributes, effective price, warranty months và availability summary.
- Không trả unit cost, supplier, exact serial/IMEI hoặc số tồn nội bộ nếu policy không cho phép.
- Tăng view count nên qua async counter để tránh contention trên product row.

**Errors:** `404 PRODUCT_NOT_FOUND`.

### 8.3 Category administration

#### CAT-ADM-001 — Admin List Categories

Trả cả ACTIVE/INACTIVE; filters parent/status/keyword; có child count và product count để đánh giá trước khi inactive.

#### CAT-ADM-002 — Create Category

**Input:** optional parent, name, slug, description, sort order.

- Slug unique và chuẩn hóa.
- Parent phải tồn tại; theo policy nên ACTIVE.
- Sort order không âm.
- Ghi audit.
- Errors: `409 CATEGORY_SLUG_EXISTS`, `404 PARENT_CATEGORY_NOT_FOUND`, `422 INVALID_SORT_ORDER`.

#### CAT-ADM-003 — Patch Category

- Không cho category làm parent của chính nó hoặc descendant của nó.
- Khi đổi parent, service duyệt ancestor chain để chặn cycle nhiều cấp.
- Không đổi status tại endpoint này.
- Invalidate category/product listing cache sau commit.

#### CAT-ADM-004 — Change Category Status

- Inactive không xóa products/order history.
- Policy phải xác định xử lý descendants; P0 đề xuất chặn nếu còn active descendants/products và trả `409 CATEGORY_IN_USE`.
- Active lại chỉ khi parent ACTIVE.

### 8.4 Brand administration

#### BRAND-ADM-001 — Admin List Brands

Filters keyword/status; trả product count. `200`.

#### BRAND-ADM-002 — Create Brand

Name và slug unique; validate logo URL; `201`. Errors `409 BRAND_EXISTS`, `422 INVALID_LOGO_URL`.

#### BRAND-ADM-003 — Patch Brand

Cho sửa name/slug/logo/description theo policy; unique conflict trả `409`. Ghi audit và invalidate cache.

#### BRAND-ADM-004 — Change Brand Status

Không xóa product lịch sử. P0 đề xuất chặn inactive nếu còn active products, trừ khi command có kế hoạch xử lý chúng.

### 8.5 Product and variant administration

#### PRODUCT-ADM-001 — Admin List Products

Filters category, brand, publication status, deleted state, keyword. Trả variant count, price range và availability summary.

#### PRODUCT-ADM-002 — Create Product Draft

**Tables:** `products`, `categories`, `brands`.

- Category và brand phải tồn tại/ACTIVE.
- Slug unique.
- Luôn tạo `publication_status=DRAFT`; client không được publish ngay trong create.
- `created_by` lấy từ actor.
- `201`; errors `409 PRODUCT_SLUG_EXISTS`, `422 CATEGORY_INACTIVE`, `422 BRAND_INACTIVE`.

#### PRODUCT-ADM-003 — Get Product Admin Detail

Trả DRAFT/INACTIVE, variants kể cả inactive, images, specs, attrs và price history summary. Không trả dữ liệu secret.

#### PRODUCT-ADM-004 — Patch Product

- Cho sửa category/brand/name/slug/content.
- Category/brand đích phải hợp lệ.
- Không sửa sold/view count từ client.
- Không sửa publication status tại đây.
- Ghi audit old/new content metadata.

#### PRODUCT-ADM-005 — Change Product Publication Status

**Allowed:** DRAFT → ACTIVE; ACTIVE → INACTIVE; INACTIVE → ACTIVE nếu điều kiện đạt.

**Publish guards:**

- Brand/category ACTIVE.
- Có ít nhất một ACTIVE variant chưa deleted.
- Variant có SKU, list price hợp lệ và ảnh chính theo policy.
- Không publish product chỉ có SKU SERIALIZED nhưng chưa có quy trình tồn phù hợp.

**Errors:** `409 PRODUCT_NOT_READY`, `409 NO_ACTIVE_VARIANT`, `422 PARENT_MASTER_INACTIVE`.

#### VARIANT-001 — Create Product Variant

**Input:** SKU, variant name, color, RAM, storage, tracking type, list/sale price, warranty months.

- Product phải tồn tại và chưa deleted.
- SKU unique toàn hệ thống, normalize uppercase.
- `sale_price <= list_price`.
- `tracking_type` không được đổi tùy tiện sau khi đã có inventory/order.
- Tạo variant và initial `product_price_histories` theo policy hoặc ghi audit.

#### VARIANT-002 — Patch Variant Metadata

Cho sửa tên/color/RAM/storage/warranty; không sửa price ở đây. Không đổi SKU/tracking type khi đã có PO, inventory hoặc order. Dùng `If-Match` với `version`; stale version trả `412`.

#### VARIANT-003 — Change Variant Status

- INACTIVE ngăn thêm mới vào cart/checkout nhưng không phá order/history.
- Không inactive nếu đang có active reservations mà chưa có kế hoạch release/fulfill.
- Ghi audit.

#### PRICE-001 — Change Variant Price

**Tables:** `product_variants`, `product_price_histories`.

- Input new list price, optional sale price, reason.
- Lock/check `version`; validate giá.
- Insert history old/new và update variant trong cùng transaction.
- Không sửa history cũ.
- Cart không snapshot giá; checkout tự tính lại và có thể báo price changed.

**Errors:** `412 VERSION_CONFLICT`, `422 INVALID_PRICE`, `404 VARIANT_NOT_FOUND`.

### 8.6 Media, specifications and attributes

#### IMAGE-001 — Add Variant Image

- Variant phải thuộc product hợp lệ.
- Validate URL/file metadata và alt text.
- Nếu là ảnh đầu tiên hoặc request primary, clear primary cũ rồi insert/set primary cùng transaction.
- Generated unique key chỉ cho một primary trên variant.

#### IMAGE-002 — Set Primary Image

Lock image set của variant, xác minh image thuộc đúng variant, clear primary cũ và set ảnh mới. Idempotent.

#### IMAGE-003 — Delete Variant Image

Không cho xóa primary cuối cùng của variant đang public nếu policy yêu cầu ảnh. Nếu xóa primary, phải chọn ảnh thay thế hoặc trả `409 PRIMARY_IMAGE_REQUIRED`.

#### SPEC-001 — Replace Product Specifications

- Input toàn bộ danh sách group/name/value/sort.
- Unique `(product_id, group_name, spec_name)`.
- Validate không trùng sau normalize.
- Replace trong một transaction; không để product mất nửa bộ specs khi request lỗi.

#### ATTR-001 — Replace Product Attributes

- Input toàn bộ attribute name/value dùng cho filter.
- Normalize controlled vocabulary để tránh `RAM`/`Ram` hoặc `Yes`/`YES`.
- Unique theo product/name/value.
- Replace transactionally và rebuild search/filter index sau commit.

---

## 9. Cart P0 APIs

| ID | Method | Endpoint | Actor | Success | Chức năng |
|---|---|---|---|---|---|
| CART-001 | `GET` | `/cart` | Customer hoặc guest token | `200` | Lấy giỏ hiện tại |
| CART-002 | `POST` | `/cart/items` | Customer hoặc guest token | `200/201` | Thêm/upsert SKU |
| CART-003 | `PATCH` | `/cart/items/{cartItemId}` | Cart owner | `200` | Đổi số lượng |
| CART-004 | `DELETE` | `/cart/items/{cartItemId}` | Cart owner | `204` | Xóa dòng |
| CART-005 | `DELETE` | `/cart/items` | Cart owner | `204` | Clear cart |
| CART-006 | `POST` | `/cart/merge` | Customer + guest token | `200` | Merge guest cart sau login |

### Shared cart rules

**Tables:** `carts`, `cart_items`, `customer_profiles`, `product_variants`, `products`.

- Cart có đúng một owner: `customer_id` XOR `guest_token_hash`.
- Một customer/guest token chỉ có một cart do unique constraints.
- Token guest phải đủ entropy; DB chỉ lưu hash.
- Cart không giữ tồn và không đảm bảo giá.
- Một variant chỉ có một dòng trong cart; add thực hiện upsert quantity.
- Variant phải ACTIVE, chưa deleted và product phải ACTIVE khi thêm/cập nhật.
- Giới hạn quantity/item/cart để chống abuse.

### CART-001 — Get Current Cart

- Customer lấy cart bằng identity; guest lấy bằng token.
- Nếu chưa có cart, có thể trả cart rỗng mà chưa insert hoặc tạo cart ACTIVE theo policy.
- Trả effective price hiện tại, cảnh báo price/availability; không ghi snapshot vào `cart_items`.
- `404` không dùng cho cart chưa tồn tại nếu UX muốn cart rỗng.

### CART-002 — Add/Upsert Cart Item

**Input:** product variant ID, quantity delta hoặc desired quantity theo contract đã chốt.

- P0 đề xuất desired quantity để retry client không vô tình cộng hai lần.
- Tạo cart nếu chưa có.
- Nếu dòng đã có, update quantity; nếu chưa có, insert.
- Không reserve stock; chỉ cảnh báo nếu desired quantity vượt availability hiện tại.
- Errors: `404 VARIANT_NOT_FOUND`, `409 VARIANT_NOT_SALEABLE`, `422 QUANTITY_INVALID`, `422 CART_LIMIT_EXCEEDED`.

### CART-003 — Update Cart Quantity

Chỉ owner; quantity phải > 0. Nếu muốn 0, client dùng DELETE. Kiểm tra saleable/limit; `404 CART_ITEM_NOT_FOUND`.

### CART-004 — Remove Cart Item

Chỉ xóa dòng thuộc cart hiện tại. Idempotent theo policy: có thể trả `204` nếu đã không tồn tại nhưng không tiết lộ cart người khác.

### CART-005 — Clear Cart

Xóa toàn bộ `cart_items` của owner; giữ cart row để tái sử dụng. Idempotent `204`.

### CART-006 — Merge Guest Cart Into Customer Cart

1. Xác thực customer và guest token.
2. Lock cả hai carts theo ID tăng dần.
3. Với variant trùng, cộng/merge theo giới hạn đã chốt; P0 đề xuất lấy tổng nhưng clamp tại max quantity.
4. Bỏ dòng variant không còn saleable và trả warning.
5. Chuyển items vào customer cart, clear guest cart và set guest cart `ABANDONED` hoặc xóa an toàn.
6. Transaction toàn bộ để không mất item nếu lỗi.

**Errors:** `401`, `400 GUEST_TOKEN_INVALID`, `409 CART_MERGE_CONFLICT`.

---

## 10. Coupon and Promotion P0 APIs

| ID | Method | Endpoint | Actor/Permission | Success | Chức năng |
|---|---|---|---|---|---|
| COUPON-001 | `POST` | `/cart/coupon-quote` | Customer/guest | `200` | Kiểm tra và tính thử coupon |
| COUPON-ADM-001 | `GET` | `/admin/coupons` | `COUPON_MANAGE` | `200` | Danh sách coupon |
| COUPON-ADM-002 | `POST` | `/admin/coupons` | `COUPON_MANAGE` | `201` | Tạo coupon inactive |
| COUPON-ADM-003 | `GET` | `/admin/coupons/{couponId}` | `COUPON_MANAGE` | `200` | Chi tiết cấu hình/quota |
| COUPON-ADM-004 | `PATCH` | `/admin/coupons/{couponId}` | `COUPON_MANAGE` | `200` | Sửa coupon |
| COUPON-ADM-005 | `PUT` | `/admin/coupons/{couponId}/targets` | `COUPON_MANAGE` | `200` | Thay product/category/brand targets |
| COUPON-ADM-006 | `PATCH` | `/admin/coupons/{couponId}/status` | `COUPON_MANAGE` | `200` | Active/inactive coupon |

### P0 coupon semantics

- Mỗi order chỉ dùng tối đa một coupon vì `orders.coupon_id` và `coupon_usages.order_id` unique.
- `applies_to_all=true`: áp dụng trên toàn eligible subtotal.
- `applies_to_all=false`: phải có ít nhất một target.
- P0 chọn logic **OR** giữa product/category/brand targets: item khớp bất kỳ target nào là eligible.
- Category target chỉ khớp category trực tiếp; schema chưa có `include_descendants` hoặc closure table.
- Coupon product target ở cấp `product_id`, áp dụng cho mọi variant saleable của product.
- Quote không giữ quota. Chỉ checkout mới tạo `coupon_usages=RESERVED`.

### COUPON-001 — Quote Coupon For Current Cart

**Input:** coupon code.  
**Tables:** coupons + targets + cart/catalog.

- Tính lại price và eligible subtotal từ DB.
- Kiểm tra ACTIVE, start/end, minimum order, target, usage limit và per-owner limit.
- `maximum_discount` áp dụng cho PERCENT nếu có.
- Không update `used_count`, không tạo coupon usage, không đảm bảo coupon còn quota đến checkout.
- Response trả eligible subtotal, discount dự kiến, rejected item reasons và grand-total preview.

**Errors:** `404 COUPON_NOT_FOUND`, `410 COUPON_EXPIRED`, `422 MINIMUM_NOT_REACHED`, `422 COUPON_NOT_APPLICABLE`, `422 COUPON_LIMIT_REACHED`.

### COUPON-ADM-001 — List Coupons

Filters code, status, type, active period; trả `used_count`, active reserved count và remaining quota được tính đúng semantics.

### COUPON-ADM-002 — Create Coupon

- Tạo `status=INACTIVE`; không cho active trước khi target/rule hợp lệ.
- Code uppercase unique.
- PERCENT: `0 < value <= 100`; AMOUNT: `value > 0`.
- End > start; minimum/maximum không âm; per-customer limit > 0 nếu có.
- Nếu `applies_to_all=false`, targets được thêm trong cùng request/transaction hoặc coupon vẫn INACTIVE.

### COUPON-ADM-003 — Get Coupon Detail

Trả rule, targets, used count, reserved count, consumed/released usage summary; không trả guest raw identity vì DB chỉ lưu hash.

### COUPON-ADM-004 — Patch Coupon

- Coupon đã có CONSUMED usages không được đổi code/type/value làm sai lịch sử; P0 chỉ cho sửa mô tả hoặc future schedule theo policy.
- Các thay đổi rule quan trọng yêu cầu coupon INACTIVE và chưa bắt đầu/được dùng.
- Không sửa `used_count` trực tiếp.
- Ghi audit diff.

### COUPON-ADM-005 — Replace Coupon Targets

- Chỉ khi coupon INACTIVE.
- Validate tất cả product/category/brand tồn tại.
- Replace ba junction sets trong một transaction.
- Nếu `applies_to_all=true`, target sets phải rỗng hoặc bị ignore theo policy thống nhất.

### COUPON-ADM-006 — Change Coupon Status

**Activate guards:** lịch hợp lệ, rule hợp lệ, target không rỗng khi applies-to-all false.  
**Inactive:** không ảnh hưởng usage CONSUMED; reservation đang ACTIVE cần policy—P0 cho phép checkout đã reserve tiếp tục trong TTL ngắn hoặc release có kiểm soát, không âm thầm xóa.

---

## 11. Warehouse, Supplier and Procurement P0 APIs

### 11.1 Endpoint inventory

| ID | Method | Endpoint | Permission | Success | Chức năng |
|---|---|---|---|---|---|
| WH-001 | `GET` | `/admin/warehouses` | `STOCK_VIEW` | `200` | Danh sách kho |
| WH-002 | `POST` | `/admin/warehouses` | **Cần `WAREHOUSE_MANAGE`** | `201` | Tạo kho |
| WH-003 | `GET` | `/admin/warehouses/{warehouseId}` | `STOCK_VIEW` | `200` | Chi tiết kho |
| WH-004 | `PATCH` | `/admin/warehouses/{warehouseId}` | **Cần `WAREHOUSE_MANAGE`** | `200` | Sửa kho |
| WH-005 | `PATCH` | `/admin/warehouses/{warehouseId}/status` | **Cần `WAREHOUSE_MANAGE`** | `200` | Active/inactive kho |
| SUP-001 | `GET` | `/admin/suppliers` | `PURCHASE_ORDER_CREATE` | `200` | Danh sách supplier |
| SUP-002 | `POST` | `/admin/suppliers` | **Cần `SUPPLIER_MANAGE`** | `201` | Tạo supplier |
| SUP-003 | `GET` | `/admin/suppliers/{supplierId}` | `PURCHASE_ORDER_CREATE` | `200` | Chi tiết supplier |
| SUP-004 | `PATCH` | `/admin/suppliers/{supplierId}` | **Cần `SUPPLIER_MANAGE`** | `200` | Sửa supplier |
| SUP-005 | `PATCH` | `/admin/suppliers/{supplierId}/status` | **Cần `SUPPLIER_MANAGE`** | `200` | Active/inactive supplier |
| PO-001 | `GET` | `/admin/purchase-orders` | `PURCHASE_ORDER_CREATE` hoặc `PURCHASE_ORDER_APPROVE` | `200` | Danh sách PO |
| PO-002 | `POST` | `/admin/purchase-orders` | `PURCHASE_ORDER_CREATE` | `201` | Tạo PO draft |
| PO-003 | `GET` | `/admin/purchase-orders/{purchaseOrderId}` | `PURCHASE_ORDER_CREATE` hoặc `PURCHASE_ORDER_APPROVE` | `200` | Chi tiết PO |
| PO-004 | `PATCH` | `/admin/purchase-orders/{purchaseOrderId}` | `PURCHASE_ORDER_CREATE` | `200` | Sửa header draft |
| PO-005 | `POST` | `/admin/purchase-orders/{purchaseOrderId}/items` | `PURCHASE_ORDER_CREATE` | `201` | Thêm SKU vào PO |
| PO-006 | `PATCH` | `/admin/purchase-orders/{purchaseOrderId}/items/{itemId}` | `PURCHASE_ORDER_CREATE` | `200` | Sửa dòng PO |
| PO-007 | `DELETE` | `/admin/purchase-orders/{purchaseOrderId}/items/{itemId}` | `PURCHASE_ORDER_CREATE` | `204` | Xóa dòng PO |
| PO-008 | `POST` | `/admin/purchase-orders/{purchaseOrderId}/submit` | `PURCHASE_ORDER_CREATE` | `200` | Gửi duyệt |
| PO-009 | `POST` | `/admin/purchase-orders/{purchaseOrderId}/approve` | `PURCHASE_ORDER_APPROVE` | `200` | Duyệt PO |
| PO-010 | `POST` | `/admin/purchase-orders/{purchaseOrderId}/receipts` | `STOCK_IMPORT` | `201` | Nhận hàng vào kho |
| PO-011 | `POST` | `/admin/purchase-orders/{purchaseOrderId}/cancel` | `PURCHASE_ORDER_CREATE` hoặc `PURCHASE_ORDER_APPROVE` | `200` | Hủy PO theo trạng thái |

### 11.2 Warehouse rules

#### WH-001 — List Warehouses

Filters code/name/status; có thể trả tổng SKU/on-hand/reserved summary nhưng không thực hiện SUM ledger cho mỗi row nếu quá nặng.

#### WH-002 — Create Warehouse

- Code/name unique, normalize code.
- Tạo ACTIVE theo policy hoặc INACTIVE cho đến khi cấu hình xong.
- Permission `WAREHOUSE_MANAGE` chưa có trong seed SQL và phải bổ sung trước khi code.

#### WH-003 — Get Warehouse Detail

Trả địa chỉ/contact/status và inventory summary. Không trả danh sách IMEI toàn kho nếu không có yêu cầu/permission cụ thể.

#### WH-004 — Patch Warehouse

Không sửa code tùy tiện khi đã được dùng trong tích hợp. Ghi audit; không đổi status ở endpoint này.

#### WH-005 — Change Warehouse Status

- INACTIVE chặn PO mới, reservation mới và shipment mới.
- Không xóa inventory/history.
- Nếu còn active reservation hoặc shipment PENDING/PACKING, trả `409 WAREHOUSE_HAS_ACTIVE_OPERATIONS`.

### 11.3 Supplier rules

#### SUP-001 — List Suppliers

Filters code/name/tax code/status; mask contact nếu actor không có phạm vi mua hàng.

#### SUP-002 — Create Supplier

Supplier code unique; tax code unique khi có; validate email/phone. Cần permission `SUPPLIER_MANAGE` mới vì seed hiện chưa có quyền riêng.

#### SUP-003 — Get Supplier Detail

Trả supplier master data và PO summary; không đưa toàn bộ lịch sử PO nếu không phân trang.

#### SUP-004 — Patch Supplier

Không cho sửa mã supplier/tax code trái policy khi đã có PO; ghi audit.

#### SUP-005 — Change Supplier Status

INACTIVE chặn PO mới nhưng không ảnh hưởng PO/history đã tồn tại. Không hard delete.

### 11.4 Purchase order rules

**Tables:** `purchase_orders`, `purchase_order_items`, suppliers, warehouses, variants; khi nhận hàng thêm inventory/balance/ledger/unit tables.

#### PO-001 — List Purchase Orders

Filters code, supplier, warehouse, status, expected range, creator, page. Actor chỉ thấy phạm vi tổ chức theo policy.

#### PO-002 — Create Purchase Order Draft

**Input:** supplier, destination warehouse, expected date, note, optional item list.

- Supplier/warehouse ACTIVE.
- Generate unique `purchase_order_code` server-side.
- Status luôn DRAFT; `created_by` từ actor.
- Nếu nhận item list, create header/items và total trong một transaction.
- `total_amount = SUM(purchase_order_items.line_total)`; không tin total do client gửi.

#### PO-003 — Get Purchase Order Detail

Trả header, item ordered/received quantities, approval/receipt/cancel audit fields và remaining quantities.

#### PO-004 — Patch Purchase Order Header

Chỉ DRAFT; sửa supplier/warehouse/expected/note. Nếu đã có items, đổi supplier/warehouse cần policy rõ và audit. Dùng status guard trong UPDATE để tránh submit đồng thời.

#### PO-005 — Add Purchase Order Item

- PO phải DRAFT.
- Variant tồn tại; không trùng variant trong PO.
- Quantity > 0; unit cost >= 0.
- Recompute `total_amount` trong cùng transaction.

#### PO-006 — Patch Purchase Order Item

Chỉ DRAFT; đổi quantity/unit cost; generated `line_total` tự tính; recompute header total. `404 PO_ITEM_NOT_FOUND`, `409 PO_NOT_EDITABLE`.

#### PO-007 — Delete Purchase Order Item

Chỉ DRAFT; delete item và recompute total. Không cho submit PO rỗng.

#### PO-008 — Submit Purchase Order

Transition DRAFT → PENDING_APPROVAL.

**Guards:** có ít nhất một item; total khớp sum items; supplier/warehouse/variants ACTIVE; ordered quantity hợp lệ. Insert audit/status event bằng `audit_logs` vì schema chưa có PO status history table.

#### PO-009 — Approve Purchase Order

Transition PENDING_APPROVAL → APPROVED.

- Lock PO và revalidate totals/master data.
- `approved_by/approved_at` từ actor/time.
- Separation of duties: người tạo không tự duyệt nếu policy doanh nghiệp yêu cầu.
- Không cho approve lại hoặc approve PO cancelled.

#### PO-010 — Receive Purchase Order Stock

**Endpoint:** `POST /api/v1/admin/purchase-orders/{id}/receipts`  
**Header:** `Idempotency-Key` bắt buộc  
**Tables:** PO/items, variants, `warehouse_inventories`, `inventory_units`, `inventory_unit_identifiers`, `stock_transactions`.

**Input per item:** PO item, received quantity; với SERIALIZED SKU là danh sách unit cùng serial/IMEI identifiers.

**Transaction flow:**

1. Lock PO và PO items; chỉ APPROVED/PARTIALLY_RECEIVED.
2. Lock warehouse inventory rows theo variant ID.
3. Kiểm tra received cumulative không vượt ordered.
4. QUANTITY SKU: tăng on-hand.
5. SERIALIZED SKU: số unit phải bằng received quantity; tạo inventory unit AVAILABLE và identifiers normalized unique.
6. Tăng `received_quantity`.
7. Append stock transaction type IMPORT với before/after chính xác và reference PO.
8. PO chuyển PARTIALLY_RECEIVED hoặc COMPLETED.
9. Set receiver/time và audit.
10. Commit toàn bộ; trùng serial/IMEI rollback receipt batch.

**Important gap:** schema hiện chưa có receipt entity/idempotency hash. Trước production phải bổ sung receipt table/key hoặc durable idempotency store; không thể chỉ dựa vào client retry discipline.

**Errors:** `409 PO_NOT_RECEIVABLE`, `409 OVER_RECEIPT`, `409 IDENTIFIER_ALREADY_EXISTS`, `422 SERIALIZED_UNIT_COUNT_MISMATCH`, `412 INVENTORY_VERSION_CONFLICT`.

#### PO-011 — Cancel Purchase Order

- DRAFT/PENDING_APPROVAL: yêu cầu `PURCHASE_ORDER_CREATE` và actor phải là creator hoặc có scope quản lý mua hàng được policy cho phép.
- APPROVED: yêu cầu `PURCHASE_ORDER_APPROVE` và chỉ cancel nếu chưa nhận hàng.
- Lock PO, dùng state guard, set `cancelled_by/cancelled_at/cancel_reason` và ghi audit trong cùng transaction.
- Không cho cancel PARTIALLY_RECEIVED/COMPLETED; hàng đã nhận phải xử lý bằng quy trình trả nhà cung cấp/điều chỉnh riêng.
- P0 không cho cancel PO PARTIALLY_RECEIVED; cần close-remaining design riêng ở P1 hoặc schema bổ sung.
- Set actor/time/reason; không xóa PO/items.

---

## 12. Inventory and Serialized Unit P0 APIs

| ID | Method | Endpoint | Permission | Success | Chức năng |
|---|---|---|---|---|---|
| INV-001 | `GET` | `/admin/inventory` | `STOCK_VIEW` | `200` | Số dư theo kho/SKU |
| INV-002 | `GET` | `/admin/inventory/warehouses/{warehouseId}/variants/{variantId}` | `STOCK_VIEW` | `200` | Chi tiết balance |
| INV-003 | `GET` | `/admin/inventory/units` | `STOCK_VIEW` | `200` | Danh sách serialized units |
| INV-004 | `GET` | `/admin/inventory/identifiers/{identifier}` | `STOCK_VIEW` | `200` | Tra serial/IMEI |
| INV-005 | `GET` | `/admin/inventory/transactions` | `STOCK_VIEW` | `200` | Inventory ledger |
| INV-006 | `GET` | `/admin/stock-reservations` | `STOCK_VIEW` | `200` | Theo dõi reservation |
| INV-007 | `POST` | `/admin/inventory/adjustments` | `STOCK_ADJUST` | `201` | Điều chỉnh tồn có audit |

### Inventory source-of-truth rules

- `warehouse_inventories` là số dư đọc nhanh hiện tại.
- `stock_transactions` là ledger bất biến để audit/reconcile.
- `available_quantity = on_hand_quantity - reserved_quantity` là generated column.
- `inventory_units` giữ từng thiết bị vật lý; serial/IMEI nằm ở `inventory_unit_identifiers`.
- Một normalized identifier là unique trên toàn hệ thống, tránh trùng chéo IMEI 1/IMEI 2.
- Balance, unit state, reservation và ledger phải cập nhật trong cùng transaction.
- Không expose endpoint sửa trực tiếp `on_hand_quantity`, `reserved_quantity` hoặc unit status.

### INV-001 — List Inventory Balances

Filters warehouse, category, brand, variant/SKU, below-reorder, available state. Trả on-hand/reserved/available/reorder/version. Không tính số dư bằng SUM ledger ở mỗi request.

### INV-002 — Get Warehouse Variant Balance

Trả balance, variant metadata, active reservations summary, serialized unit counts theo status và recent transactions. `404 INVENTORY_BALANCE_NOT_FOUND`.

### INV-003 — List Serialized Units

Filters warehouse, variant/SKU, unit status, PO item, reservation, sold order item. Pagination bắt buộc. Chỉ trả identifiers cho actor có scope kho phù hợp.

### INV-004 — Lookup Unit By Serial/IMEI

- Normalize identifier theo type/policy rồi lookup unique `normalized_identifier`.
- Trả unit, variant, warehouse, state, source PO và sold order reference phù hợp permission.
- Không trả customer PII nếu chỉ có `STOCK_VIEW`; cần order permission để mở order detail.
- `404 UNIT_NOT_FOUND`.

### INV-005 — List Inventory Ledger

Filters warehouse, variant, unit, transaction type, reference type/id, actor, time range. Ledger chỉ đọc; không có API update/delete.

### INV-006 — List Stock Reservations

Filters order, warehouse, variant, ACTIVE/CONSUMED/RELEASED/EXPIRED, expiry range. Trả quantity và attached unit count. Dùng cho kho/support phát hiện reservation mắc kẹt.

### INV-007 — Create Manual Inventory Adjustment

**Input:** warehouse, variant, direction ADJUST_IN/ADJUST_OUT, quantity, mandatory reason; serialized adjustment phải nêu unit identifiers.

**Flow:**

1. `Idempotency-Key` bắt buộc.
2. Lock balance và units liên quan.
3. Validate không làm on-hand < reserved hoặc số lượng âm.
4. Với serialized: mỗi unit phải chuyển state hợp lệ; quantity bằng unit count.
5. Update balance/version và append stock transaction before/after.
6. Ghi audit actor/reason/correlation.

**Gap:** schema chưa có `inventory_adjustments` master/idempotency key. P0 production nên bổ sung bảng command/adjustment; dùng `audit_logs.id` làm polymorphic reference chỉ là phương án tạm và không thay thế idempotency bền vững.

**Errors:** `409 INSUFFICIENT_ADJUSTABLE_STOCK`, `409 UNIT_STATE_CONFLICT`, `412 INVENTORY_VERSION_CONFLICT`, `422 REASON_REQUIRED`.

**Không thuộc P0 endpoint:** stock transfer. Dù ledger có `TRANSFER_IN/TRANSFER_OUT`, schema chưa có stock-transfer aggregate để quản lý hai vế, trạng thái và idempotency nên không được dựng API transfer giả tạo.

---

## 13. Sales Order and Checkout P0 APIs

### 13.1 Endpoint inventory

| ID | Method | Endpoint | Actor/Permission | Success | Chức năng |
|---|---|---|---|---|---|
| ORDER-001 | `POST` | `/orders/checkout` | Customer/guest | `201/200` | Tạo đơn từ cart |
| ORDER-002 | `GET` | `/me/orders` | Customer | `200` | Lịch sử đơn của tôi |
| ORDER-003 | `GET` | `/me/orders/{orderCode}` | Owner | `200` | Chi tiết đơn customer |
| ORDER-004 | `POST` | `/guest-orders/access-links` | Public rate-limited | `202` | Gửi link truy cập đơn guest |
| ORDER-005 | `GET` | `/guest-orders/{orderCode}` | Signed guest token | `200` | Xem đơn guest |
| ORDER-ADM-001 | `GET` | `/admin/orders` | `ORDER_VIEW` | `200` | Danh sách đơn vận hành |
| ORDER-ADM-002 | `GET` | `/admin/orders/{orderId}` | `ORDER_VIEW` | `200` | Chi tiết đơn vận hành |
| ORDER-ADM-003 | `POST` | `/admin/orders/{orderId}/confirm` | `ORDER_CONFIRM` | `200` | Xác nhận đơn |
| ORDER-ADM-004 | `POST` | `/admin/orders/{orderId}/start-processing` | `ORDER_STATUS_UPDATE` | `200` | Bắt đầu xử lý kho |
| ORDER-006 | `POST` | `/orders/{orderCode}/cancel` | Owner/guest token | `200` | Customer hoặc guest hủy đơn đủ điều kiện |
| ORDER-ADM-005 | `POST` | `/admin/orders/{orderId}/cancel` | `ORDER_CANCEL` | `200` | Staff hủy đơn |
| ORDER-INT-001 | `POST` | `/internal/orders/{orderId}/complete` | Internal | `200` | Hoàn thành khi fulfillment đủ |

### 13.2 Order status policy

| Current | Allowed next | Command |
|---|---|---|
| PENDING | CONFIRMED, CANCELLED | Confirm/cancel |
| CONFIRMED | PROCESSING, CANCELLED | Start processing/cancel |
| PROCESSING | SHIPPING, CANCELLED có điều kiện | Shipment/cancel |
| SHIPPING | COMPLETED | Fulfillment aggregate |
| COMPLETED | PARTIALLY_RETURNED, RETURNED | Return workflow |
| PARTIALLY_RETURNED | RETURNED | Return workflow |
| CANCELLED | Terminal | Không transition tiếp |

Mọi transition phải update `orders` và insert `order_status_histories` trong cùng transaction.

### ORDER-001 — Checkout Cart

**Header:** `Idempotency-Key` bắt buộc.  
**Tables:** cart/catalog/address, orders/items, coupon usages, inventory/reservations/units, payments.

#### Input ownership

- Customer: owner từ access token.
- Guest: owner từ `X-Guest-Cart-Token`; contact và shipping snapshots bắt buộc.
- Không tin `customer_id`, price, discount, total hoặc stock từ client.

#### Transaction flow

1. Tạo scoped idempotency hash và kiểm tra `orders.idempotency_key_hash`.
2. Nếu cùng key đã thành công, trả order cũ `200`; nếu payload khác phải conflict.
3. Lock cart và cart items.
4. Kiểm tra cart không rỗng; reload products/variants saleable.
5. Tính subtotal từ DB price; phân bổ discount ở order item; tính shipping fee server-side.
6. Validate `grand_total=subtotal-discount+shipping_fee`.
7. Nếu có coupon: lock coupon, kiểm tra lịch/rule/target/quota; tạo `coupon_usages=RESERVED` với đúng một customer hoặc guest identity hash.
8. Chọn kho; lock warehouse inventory rows theo thứ tự ổn định.
9. Kiểm tra available và tạo `stock_reservations=ACTIVE`; tăng reserved quantity.
10. SERIALIZED SKU: chọn đủ AVAILABLE units, chuyển RESERVED và gắn reservation.
11. Tạo `orders=PENDING` cùng contact/shipping snapshots và idempotency hash.
12. Tạo immutable `order_items` snapshots: product, variant, SKU, màu/RAM/storage/image, warranty months, unit price, quantity, discount.
13. Tạo `payments=UNPAID` với expected amount.
14. Clear cart items; giữ cart để tái sử dụng.
15. Commit; sau commit mới tạo/call payment attempt và gửi notification.

#### Coupon quota concurrency

- Tổng quota khả dụng phải tính `coupons.used_count + coupon_usages RESERVED` theo policy.
- Per-owner limit đếm RESERVED + CONSUMED của customer/guest.
- Lock coupon khi check và insert reservation để hai checkout cuối không cùng thắng.

#### Stock concurrency

- Check và reserve phải trong cùng transaction.
- Không check available trước rồi update sau mà không lock/version guard.
- Nếu thiếu một SKU, rollback toàn bộ order P0; split backorder chưa hỗ trợ.

#### Success/error

- `201 Created`: order mới.
- `200 OK`: idempotent replay đúng payload.
- Errors: `409 CART_EMPTY`, `409 PRICE_CHANGED`, `409 INSUFFICIENT_STOCK`, `409 IDEMPOTENCY_KEY_CONFLICT`, `410 COUPON_EXPIRED`, `422 COUPON_NOT_APPLICABLE`, `422 INVALID_SHIPPING_ADDRESS`.

#### Schema gap

`orders` có key hash nhưng chưa có request fingerprint/owner scope column. Production phải hash key cùng owner/scope và lưu/đối chiếu request fingerprint trong durable idempotency design để chặn cùng key với payload khác.

### ORDER-002 — List My Orders

Customer owner filter bắt buộc; filters status/date; trả order summary, payment aggregate và shipment summary. Không N+1 query items.

### ORDER-003 — Get My Order Detail

Trả snapshots, items, status timeline, payment summary, shipments, coupon và after-sales links. Chỉ owner; resource người khác trả `404`.

### ORDER-004 — Request Guest Order Access Link

**Input:** order code + contact email/phone proof.

- Luôn trả `202` để hạn chế enumeration.
- Nếu khớp snapshot, gửi link chứa short-lived signed guest token sau rate limit.
- Không cho truy cập chỉ bằng order code + phone dễ đoán.
- Schema chưa có guest access-token table; P0 dùng signed short-lived token. Nếu cần revoke/recovery lâu dài phải bổ sung token persistence.

### ORDER-005 — Get Guest Order

Verify signature, expiry, audience và order binding của guest token. Trả cùng dữ liệu customer order nhưng mask PII phù hợp. `401 GUEST_TOKEN_INVALID`, `410 GUEST_TOKEN_EXPIRED`.

### ORDER-ADM-001 — List Orders

Filters code/contact/customer/status/payment derived state/shipment state/date/channel. Permission và organizational scope áp dụng server-side.

### ORDER-ADM-002 — Get Order Operational Detail

Trả order snapshots/items, reservations/units theo permission, payment attempts, shipments, return/warranty summary và full status timeline.

### ORDER-ADM-003 — Confirm Order

- Lock order; PENDING only.
- Online order phải có payment policy đạt yêu cầu; COD có thể confirm khi UNPAID.
- Reservation còn ACTIVE/chưa hết hạn.
- Transition CONFIRMED + history atomically.
- Consume coupon tại thời điểm policy chốt đơn: set usage CONSUMED, increment `used_count` đúng một lần.

### ORDER-ADM-004 — Start Processing

- CONFIRMED only; active reservation đủ số lượng.
- Transition PROCESSING; không giảm on-hand tại đây nếu policy giảm lúc ship.
- Phát warehouse task sau commit.

### ORDER-006 — Cancel Customer/Guest Order

Customer phải sở hữu order; guest phải cung cấp signed token còn hạn và bind đúng order. Chỉ cho trạng thái PENDING/CONFIRMED theo cancellation window. Command dùng cùng transaction release reservation/coupon như staff cancel, nhưng `cancelled_by` có thể NULL cho guest và nguồn thực hiện vẫn phải được truy vết trong status history/audit. Nếu đã PROCESSING/SHIPPING, trả conflict hoặc chuyển support workflow.

### ORDER-ADM-005 — Staff Cancel Order

**Transaction side effects:**

- Transition CANCELLED + history/reason.
- Release ACTIVE reservations, giảm reserved quantity và trả units AVAILABLE.
- Append stock transaction CANCEL_ORDER/RELEASE với before/after.
- Coupon RESERVED → RELEASED; coupon CONSUMED cần policy decrement chính xác nếu chưa thực sự sử dụng.
- Nếu đã thu tiền, tạo refund workflow; không giả định cancel đồng nghĩa tiền đã hoàn.
- Không cancel nếu shipment đã SHIPPED/DELIVERED; dùng return workflow.

### ORDER-INT-001 — Complete Order

Internal command được gọi khi tất cả shipment quantities cần thiết đã DELIVERED.

- Lock order và aggregate shipments/items.
- SHIPPING → COMPLETED; insert history.
- Tạo/phát hành warranties idempotently sau commit hoặc cùng transaction tùy service boundary.
- Không complete nếu còn item chưa fulfill hoặc shipment failed chưa giải quyết.

### Mandatory reservation expiry job

Không nhất thiết là HTTP endpoint nhưng là P0 runtime component:

- Quét reservation ACTIVE đã quá `expires_at`.
- Lock reservation/balance/units.
- Set EXPIRED, giảm reserved, trả unit AVAILABLE, append ledger.
- Release coupon reservation nếu order chưa được confirm.
- Idempotent theo state guard `ACTIVE`.

---

## 14. Payment P0 APIs

| ID | Method | Endpoint | Actor/Permission | Success | Chức năng |
|---|---|---|---|---|---|
| PAY-001 | `GET` | `/orders/{orderCode}/payment` | Order owner/guest token | `200` | Payment aggregate |
| PAY-002 | `POST` | `/orders/{orderCode}/payment-attempts` | Order owner/guest token | `201/200` | Tạo/replay lần thanh toán |
| PAY-003 | `GET` | `/payment-attempts/{attemptId}` | Attempt owner | `200` | Kiểm tra attempt |
| PAY-004 | `POST` | `/webhooks/payments/{providerCode}` | Signed webhook | `200` | Nhận callback provider |
| PAY-ADM-001 | `POST` | `/admin/payments/{paymentId}/confirm-manual` | **Cần `PAYMENT_CONFIRM`** | `200` | Xác nhận COD/chuyển khoản |

### Payment source-of-truth rules

- `payments` là aggregate cấp order: expected, paid, refunded, status.
- `payment_attempts` là từng lần COD/VNPay/MoMo/bank transfer.
- Browser redirect không phải bằng chứng tiền; webhook hoặc manual reconciliation có thẩm quyền mới xác nhận.
- Một order có một payments row; có nhiều attempts.
- Không lưu card PAN/CVV hoặc raw secret provider.
- `payments.status` phải được tính từ amount thành công/refund, không do frontend gửi.

### PAY-001 — Get Order Payment Summary

Trả expected/paid/refunded/currency/status/paid time và các attempts đã redacted. Owner/guest token bắt buộc; staff dùng order admin detail với `PAYMENT_VIEW`.

### PAY-002 — Create Payment Attempt

**Header:** `Idempotency-Key` bắt buộc.  
**Input:** payment method; provider được server map từ cấu hình.

**Flow:**

1. Xác minh order owner và trạng thái cho phép thanh toán.
2. Lock payment aggregate.
3. Nếu PAID/REFUNDED hoặc amount remaining = 0, không tạo charge mới.
4. Generate unique `merchant_request_id`; `attempt_number` tăng tuần tự.
5. Insert attempt PENDING với amount còn phải thu, commit.
6. Sau commit mới gọi provider.
7. Lưu provider response code/message đã redact và redirect/payment action.
8. Retry tạo attempt mới; không ghi đè attempt cũ.

**Idempotency:** map request key vào `merchant_request_id` hoặc durable command store. Replay trả attempt cũ `200`.  
**Errors:** `409 ORDER_NOT_PAYABLE`, `409 PAYMENT_ALREADY_SETTLED`, `422 PAYMENT_METHOD_NOT_ALLOWED`, `502 PROVIDER_REQUEST_FAILED`.

### PAY-003 — Get Payment Attempt Status

Trả attempt number/method/provider/status/amount/timestamps/redacted response. Không tin client polling để chuyển payment aggregate; chỉ đọc trạng thái đã được backend xác nhận.

### PAY-004 — Payment Provider Webhook

**Tables:** `payment_webhook_events`, `payment_attempts`, `payments`, `orders`, optional status history/notification.

**Flow:**

1. Đọc raw body đúng cách để verify signature.
2. Insert event theo unique `(provider_code, provider_event_id)` trước khi business processing.
3. Duplicate event trả `200` và không cộng tiền lần hai.
4. Signature invalid: mark REJECTED, không update payment.
5. Tìm attempt bằng merchant/provider transaction reference.
6. Lock event → attempt → payment → order theo thứ tự thống nhất.
7. Validate amount/currency/order binding.
8. Update attempt SUCCESS/FAILED/CANCELLED/EXPIRED.
9. Nếu SUCCESS lần đầu: tăng paid amount đúng một lần và derive UNPAID/PARTIALLY_PAID/PAID.
10. Set paid time khi đạt expected; phát event xác nhận order sau commit.
11. Mark webhook PROCESSED; lỗi tạm giữ RECEIVED/error để worker retry idempotently.

**Responses:** `200` processed/duplicate; `400` malformed; `401` invalid signature theo provider contract.  
**Security:** payload raw không lưu; DB chỉ giữ hash và thông tin xử lý.

### PAY-ADM-001 — Confirm Manual Payment

**Use cases:** COD đã thu, bank transfer đã đối soát.

- Cần permission mới `PAYMENT_CONFIRM`; `PAYMENT_VIEW` không đủ để thay đổi tiền.
- `Idempotency-Key`, amount, method, external/reference note bắt buộc theo policy.
- Tạo/update một payment attempt INTERNAL/manual có actor audit; không update aggregate trần.
- Lock payment; amount success không làm paid vượt expected.
- Ghi audit nhạy cảm và phát event sau commit.

### Zero-value order

Nếu `grand_total_amount=0`, checkout không tạo attempt amount 0 vì DB yêu cầu attempt amount > 0. Payment aggregate có thể được service đánh dấu PAID với paid amount 0 theo explicit free-order policy và audit.

---

## 15. Shipment and Fulfillment P0 APIs

| ID | Method | Endpoint | Actor/Permission | Success | Chức năng |
|---|---|---|---|---|---|
| SHIP-001 | `GET` | `/admin/shipments` | `SHIPMENT_MANAGE` | `200` | Queue shipment |
| SHIP-002 | `POST` | `/admin/orders/{orderId}/shipments` | `SHIPMENT_MANAGE` | `201` | Tạo kiện từ một kho |
| SHIP-003 | `GET` | `/admin/shipments/{shipmentId}` | `SHIPMENT_MANAGE` | `200` | Chi tiết kiện |
| SHIP-004 | `PUT` | `/admin/shipments/{shipmentId}/items` | `SHIPMENT_MANAGE` | `200` | Thay item quantities khi chưa ship |
| SHIP-005 | `PUT` | `/admin/shipments/{shipmentId}/units` | `SHIPMENT_MANAGE` | `200` | Gắn serialized units |
| SHIP-006 | `PATCH` | `/admin/shipments/{shipmentId}/tracking` | `SHIPMENT_MANAGE` | `200` | Provider/tracking/ETA |
| SHIP-007 | `PATCH` | `/admin/shipments/{shipmentId}/status` | `SHIPMENT_MANAGE` | `200` | Transition shipment |
| SHIP-008 | `GET` | `/orders/{orderCode}/shipments` | Order owner/guest token | `200` | Theo dõi giao hàng |
| SHIP-009 | `POST` | `/webhooks/shipments/{providerCode}` | Signed webhook | `200` | Carrier callback |

### Shipment quantity invariants

- Shipment thuộc một order và một warehouse.
- `shipment_items.order_item_id` phải thuộc cùng order.
- Tổng quantity của các shipment chưa cancelled/returned không vượt `order_items.quantity`.
- Serialized item phải có số `shipment_item_units` đúng quantity.
- Unit phải đúng variant, warehouse, order item/reservation và chưa nằm trong shipment khác.
- Địa chỉ giao đọc từ immutable order snapshot; shipment không có address columns riêng.

### SHIP-001 — List Shipment Queue

Filters warehouse, status, provider, tracking, order, created range. Warehouse scope bắt buộc. Trả item/unit readiness để kho biết kiện nào chưa scan đủ.

### SHIP-002 — Create Shipment

**Input:** warehouse, item quantities, optional provider/tracking/fee/ETA.

- Order phải CONFIRMED/PROCESSING; P0 đề xuất PROCESSING.
- Warehouse ACTIVE và phải là nguồn của reservations được chọn.
- Lock order items và existing shipment items để tính remaining quantity.
- Tạo unique shipment code.
- Không cho quantity vượt remaining.
- Shipping fee ở shipment là chi phí/ghi nhận kiện theo policy, không tự thay `orders.shipping_fee` đã chốt.

### SHIP-003 — Get Shipment Detail

Trả items, assigned units/identifiers, provider/tracking, status/timestamps và order summary trong phạm vi permission.

### SHIP-004 — Replace Shipment Items

- Chỉ PENDING/PACKING trước khi bàn giao carrier.
- Lock shipment/order items; validate totals across all shipments.
- Nếu giảm serialized quantity, bỏ unit mappings tương ứng trước commit.
- Replace atomically.

### SHIP-005 — Assign Serialized Units

**Input:** mapping shipment item → unit IDs hoặc scanned serial/IMEI.

- Normalize identifier và resolve unit.
- Unit phải RESERVED cho đúng order item/warehouse.
- Unique inventory unit chặn giao cùng máy hai lần.
- Unit count phải bằng shipment item quantity cho SERIALIZED variants.
- QUANTITY variants không tạo unit mapping.

### SHIP-006 — Update Tracking

- Chỉ trước hoặc trong giao hàng theo policy.
- `(shipping_provider, tracking_code)` unique khi có.
- Validate URL/code format nếu tích hợp provider.
- Không sửa delivered shipment.

### SHIP-007 — Change Shipment Status

**Allowed transitions:**

- PENDING → PACKING/CANCELLED.
- PACKING → SHIPPED/CANCELLED.
- SHIPPED → IN_TRANSIT/DELIVERED/FAILED.
- IN_TRANSIT → DELIVERED/FAILED/RETURNED.
- FAILED → IN_TRANSIT/RETURNED theo provider policy.
- DELIVERED/RETURNED/CANCELLED là terminal trong P0.

**On SHIPPED transaction:**

1. Verify item/unit completeness.
2. Consume matching reservations.
3. Giảm reserved và on-hand balance.
4. Serialized units RESERVED → SOLD; set sold order item/time.
5. Append SALE stock transactions with before/after.
6. Set shipment shipped time.
7. Order PROCESSING → SHIPPING khi shipment đầu tiên rời kho.

**On DELIVERED:** set delivered time; nếu toàn bộ ordered quantities delivered thì trigger internal order completion.  
**On CANCELLED before ship:** không consume reservation; items có thể được đưa sang shipment khác.  
**Errors:** `409 SHIPMENT_NOT_READY`, `409 UNIT_ASSIGNMENT_INCOMPLETE`, `409 INVALID_SHIPMENT_TRANSITION`.

### SHIP-008 — Get Order Shipments

Owner hoặc guest token; trả provider/tracking, item summary, status và ETA. Mask warehouse/internal unit data; có thể hiển thị serial/IMEI theo chính sách sau delivery nhưng không nên expose không cần thiết.

### SHIP-009 — Carrier Webhook

- Verify signature/provider source.
- Resolve shipment bằng provider + tracking.
- Validate monotonic transition; event cũ không kéo trạng thái lùi.
- Apply cùng logic SHIP-007 idempotently.
- **Schema gap:** chưa có shipment webhook event table, nên cần bổ sung event dedupe store trước production; tracking code unique không đủ chống xử lý lặp side effect.

---

## 16. Warranty P0 APIs

| ID | Method | Endpoint | Actor/Permission | Success | Chức năng |
|---|---|---|---|---|---|
| WARRANTY-INT-001 | `POST` | `/internal/orders/{orderId}/warranties/generate` | Internal | `200/201` | Phát hành warranty |
| WARRANTY-001 | `GET` | `/me/warranties` | Customer | `200` | Warranty của tôi |
| WARRANTY-002 | `GET` | `/warranties/{warrantyCode}` | Owner/guest token | `200` | Chi tiết warranty |
| WARRANTY-003 | `POST` | `/warranties/access-links` | Public rate-limited | `202` | Gửi link guest access |
| CLAIM-001 | `POST` | `/warranties/{warrantyCode}/claims` | Owner/guest token | `201` | Gửi claim |
| CLAIM-002 | `GET` | `/me/warranty-claims` | Customer | `200` | Claim của tôi |
| CLAIM-ADM-001 | `GET` | `/admin/warranty-claims` | `WARRANTY_MANAGE` | `200` | Queue claim |
| CLAIM-ADM-002 | `GET` | `/admin/warranty-claims/{claimId}` | `WARRANTY_MANAGE` | `200` | Chi tiết claim |
| CLAIM-ADM-003 | `POST` | `/admin/warranty-claims/{claimId}/receive` | `WARRANTY_MANAGE` | `200` | Tiếp nhận thiết bị |
| CLAIM-ADM-004 | `PATCH` | `/admin/warranty-claims/{claimId}/status` | `WARRANTY_MANAGE` | `200` | Xử lý state/resolution |

### WARRANTY-INT-001 — Generate Warranties For Completed Order

**Tables:** orders/items, inventory units, variants, warranties.  
**Trigger:** order COMPLETED sau delivery.

**Rules:**

- Verify order COMPLETED và chưa phát hành trùng.
- Start date theo delivered/completed policy; end date dựa `order_items.warranty_months` snapshot.
- SERIALIZED SKU: một warranty cho từng sold unit, `covered_quantity=1`; unique unit chặn trùng.
- QUANTITY SKU: tạo certificate theo line/covered quantity theo policy.
- Copy owner name/phone/email snapshot; customer ID nullable cho guest.
- Status ACTIVE khi period hợp lệ.
- Command phải idempotent.

**Schema gap:** non-serialized warranty chưa có unique issuance key theo order item; cần unique constraint/issuance record để hai worker không tạo trùng.

### WARRANTY-001 — List My Warranties

Filter ACTIVE/EXPIRED/VOID, product, expiry. Chỉ customer owner; trả product/variant, coverage, period và claim summary.

### WARRANTY-002 — Get Warranty Detail

Owner hoặc signed guest token. Trả certificate, covered unit identifier đã mask phù hợp và claim history. Không cho lookup public chỉ bằng IMEI.

### WARRANTY-003 — Request Guest Warranty Access Link

Nhận warranty code/IMEI cùng contact proof; luôn `202`. Nếu khớp owner snapshot thì gửi short-lived signed link. Rate-limit mạnh để chống dò IMEI/contact.

### CLAIM-001 — Submit Warranty Claim

**Input:** issue description và contact/handling information theo channel.

- Warranty ACTIVE và trong period theo policy.
- Claimant phải owner hoặc guest token hợp lệ.
- Không tạo claim trùng đang mở cho cùng warranty nếu policy không cho phép.
- Tạo claim `SUBMITTED`, unique claim code.
- Không tự chuyển unit sang IN_WARRANTY cho đến khi hàng được nhận.

**Errors:** `409 WARRANTY_NOT_ACTIVE`, `410 WARRANTY_EXPIRED`, `409 OPEN_CLAIM_EXISTS`, `422 ISSUE_DESCRIPTION_REQUIRED`.

### CLAIM-002 — List My Claims

Trả claim code, warranty/product, status, resolution/rejection và timestamps cho customer owner.

### CLAIM-ADM-001 — List Warranty Claim Queue

Filters status, received state, warranty/product/unit, date. Không lộ owner PII ngoài phạm vi cần thiết.

### CLAIM-ADM-002 — Get Claim Operational Detail

Trả warranty, order/unit provenance, issue, current state và timeline từ audit nếu cần.

### CLAIM-ADM-003 — Receive Warranty Item

- SUBMITTED → RECEIVED.
- Verify physical unit bằng normalized serial/IMEI nếu serialized.
- Unit phải thuộc warranty.
- Set `received_by/received_at`; unit SOLD/RETURNED phù hợp → IN_WARRANTY và append WARRANTY_IN stock transaction nếu có movement kho.
- Update unit/balance/ledger/claim atomically.

### CLAIM-ADM-004 — Change Claim Status

**Allowed P0 transitions:**

- RECEIVED → INSPECTING.
- INSPECTING → REPAIRING, WAITING_PARTS, REJECTED.
- REPAIRING/WAITING_PARTS → COMPLETED hoặc quay state được policy cho phép.
- SUBMITTED → CANCELLED bởi support trước receive. Nếu cần owner tự hủy claim, bổ sung endpoint self-service ở P1 thay vì cho phép qua API admin.

**Rules:** rejection reason bắt buộc khi REJECTED; resolution bắt buộc khi COMPLETED; set completed time. Nếu trả/thay unit, stock movement và unit state phải được ghi trong cùng business transaction hoặc workflow replacement riêng.

---

## 17. Return, Exchange and Refund P0 APIs

### 17.1 Endpoint inventory

| ID | Method | Endpoint | Actor/Permission | Success | Chức năng |
|---|---|---|---|---|---|
| RETURN-001 | `POST` | `/orders/{orderCode}/return-requests` | Owner/guest token | `201` | Yêu cầu refund/exchange |
| RETURN-002 | `GET` | `/me/return-requests` | Customer | `200` | Danh sách yêu cầu của tôi |
| RETURN-003 | `GET` | `/return-requests/{returnCode}` | Owner/guest token | `200` | Chi tiết yêu cầu |
| RETURN-004 | `POST` | `/return-requests/{returnCode}/cancel` | Owner/guest token | `200` | Customer hoặc guest hủy request |
| RETURN-ADM-001 | `GET` | `/admin/return-requests` | `RETURN_VIEW` | `200` | Queue đổi trả |
| RETURN-ADM-002 | `GET` | `/admin/return-requests/{returnId}` | `RETURN_VIEW` | `200` | Chi tiết vận hành |
| RETURN-ADM-003 | `POST` | `/admin/return-requests/{returnId}/approve` | `RETURN_APPROVE` | `200` | Duyệt request |
| RETURN-ADM-004 | `POST` | `/admin/return-requests/{returnId}/reject` | `RETURN_APPROVE` | `200` | Từ chối request |
| RETURN-ADM-005 | `POST` | `/admin/return-requests/{returnId}/receive` | `RETURN_APPROVE` | `200` | Nhận hàng trả |
| RETURN-ADM-006 | `POST` | `/admin/return-requests/{returnId}/inspect` | `RETURN_APPROVE` | `200` | Ghi kết quả inspection |
| RETURN-ADM-007 | `POST` | `/admin/return-requests/{returnId}/complete` | `RETURN_APPROVE` | `200` | Hoàn tất return/exchange |
| REFUND-001 | `GET` | `/admin/refunds` | `PAYMENT_VIEW` | `200` | Danh sách refund |
| REFUND-002 | `GET` | `/admin/refunds/{refundId}` | `PAYMENT_VIEW` | `200` | Chi tiết refund |
| REFUND-003 | `POST` | `/admin/refunds` | `REFUND_CREATE` | `201/200` | Tạo refund request |
| REFUND-004 | `POST` | `/admin/refunds/{refundId}/approve` | `REFUND_APPROVE` | `200` | Duyệt và queue refund |
| REFUND-INT-001 | `POST` | `/internal/refunds/{refundId}/execute` | Internal | `202/200` | Gọi provider |
| REFUND-005 | `POST` | `/admin/refunds/{refundId}/confirm-manual` | `REFUND_APPROVE` | `200` | Xác nhận cash/bank refund |
| REFUND-006 | `POST` | `/webhooks/refunds/{providerCode}` | Signed webhook | `200` | Provider refund callback |

### 17.2 Return quantity rules

- Return item phải thuộc order của return request.
- Remaining returnable quantity = ordered quantity − quantity trong các request đã APPROVED/RECEIVED/INSPECTING/COMPLETED theo policy.
- Không chỉ kiểm tra từng request riêng; phải cộng dồn dưới lock để hai request đồng thời không vượt số mua.
- Serialized item phải map đúng unit đã bán cho order item.
- `return_item_units.inventory_unit_id` unique ngăn cùng máy được trả hai lần.
- Return window, condition và product exclusions là policy ứng dụng cần cấu hình rõ.

### RETURN-001 — Create Return/Exchange Request

**Input:** return type REFUND/EXCHANGE, item quantities/reasons, optional expected unit identifiers.

**Flow:**

1. Verify owner/guest access và order đủ trạng thái/time window.
2. Lock order items và active prior return items.
3. Tính remaining returnable quantity.
4. Với serialized, resolve unit và kiểm tra unit đã bán trong order item; có thể chỉ ghi mapping chính thức khi nhận hàng.
5. Tạo return request PENDING, requester snapshots và items.
6. `refund_amount`/`total_refund_amount` ban đầu là 0 hoặc estimate không được coi là approved.

**Errors:** `409 RETURN_WINDOW_CLOSED`, `409 RETURN_QUANTITY_EXCEEDED`, `409 UNIT_ALREADY_RETURNED`, `422 ITEM_NOT_RETURNABLE`.

### RETURN-002 — List My Return Requests

Customer owner filter; trả return type/status/items/refund summary/replacement order link.

### RETURN-003 — Get Return Request

Owner/guest token; trả timeline, items, inspection result phù hợp và refund status. Mask internal notes nếu có.

### RETURN-004 — Customer/Guest Cancel Request

Customer phải là owner; guest token phải còn hạn và bind đúng order/return. Chỉ PENDING trước review/receipt. Transition CANCELLED; giữ record lịch sử. Idempotent nếu đã cancelled.

### RETURN-ADM-001 — List Return Queue

Filters status/type/order/customer/date/reason. Permission scope và PII masking áp dụng.

### RETURN-ADM-002 — Get Return Operational Detail

Trả order/payment provenance, items, units, prior returns, returnable remaining, inspection và refund/replacement summary.

### RETURN-ADM-003 — Approve Return

- PENDING only; lock/revalidate return window và remaining quantity.
- Set APPROVED, reviewer/time.
- Không đồng nghĩa đã hoàn tiền.
- Cung cấp return instructions sau commit; APPROVED → IN_TRANSIT có thể do carrier/customer signal.

### RETURN-ADM-004 — Reject Return

PENDING hoặc INSPECTING theo policy; rejection reason bắt buộc; reviewer/time; không xóa request.

### RETURN-ADM-005 — Receive Returned Items

**Input:** scanned units, received quantities, preliminary condition.

- APPROVED/IN_TRANSIT → RECEIVED.
- Serialized: scan identifier, verify exact sold unit/order item và unique return.
- Tạo `return_item_units`; set received time.
- Chưa tự restock trước inspection trừ khi policy cho unopened item.
- Unit có thể chuyển RETURNED/quarantine state; append RETURN_IN ledger nếu on-hand movement được ghi tại receive.

### RETURN-ADM-006 — Inspect Return

**Input per item/unit:** condition, resolution RESTOCK/DEFECTIVE/REPAIR/SCRAP/EXCHANGE, approved refund amount, note.

- RECEIVED → INSPECTING.
- Sum item refund amount = request total refund amount.
- Amount không vượt net paid allocation của returned quantity.
- RESTOCK tăng sellable inventory và unit AVAILABLE; DEFECTIVE/REPAIR/SCRAP dùng đúng unit state và ledger.
- Balance/unit/ledger/inspection update phải atomic theo batch hoặc từng unit idempotent.

### RETURN-ADM-007 — Complete Return/Exchange

- REFUND: chỉ COMPLETED khi refund thành công hoặc policy ghi rõ không có tiền hoàn.
- EXCHANGE: tạo/link `replacement_order_id` idempotently trước complete.
- Update original order PARTIALLY_RETURNED/RETURNED dựa trên cumulative returned quantities.
- Set completed time; không thay đổi order item snapshots.

### 17.3 Refund money rules

- Refund là movement tiền, tách khỏi quyết định return.
- Tổng refunds SUCCESS của payment không vượt `payments.paid_amount`.
- Với return, tổng refund không vượt approved `return_requests.total_refund_amount` trừ policy rõ ràng.
- `ORIGINAL_PAYMENT` bắt buộc `payment_attempt_id`; attempt phải thuộc cùng payment và SUCCESS.
- Update refund, payment aggregate và return/order derived state dưới lock.
- Requester và approver nên khác nhau theo separation-of-duties policy.

### REFUND-001 — List Refunds

Filters code/payment/order/return/status/method/provider/time/requester/approver. PII/payment metadata được mask.

### REFUND-002 — Get Refund Detail

Trả money source, return/cancel reason, method, approval, provider reference và timeline; không trả raw provider secrets.

### REFUND-003 — Create Refund

**Header:** `Idempotency-Key` bắt buộc.  
**Input:** payment, optional successful attempt, optional return request, amount, method, reason.

**Flow:**

1. Lock payment và return nếu có.
2. Validate amount > 0, remaining paid balance và approved return amount.
3. Validate attempt belongs payment cho ORIGINAL_PAYMENT.
4. Hash idempotency key; existing key trả refund cũ `200`.
5. Generate unique refund code; create PENDING with requester.
6. Không update refunded amount lúc chỉ mới request.

**Errors:** `409 REFUND_AMOUNT_EXCEEDED`, `409 IDEMPOTENCY_KEY_CONFLICT`, `422 PAYMENT_ATTEMPT_MISMATCH`, `422 RETURN_NOT_APPROVED`.

### REFUND-004 — Approve Refund

- PENDING only; approver permission và separation policy.
- Revalidate remaining refundable amount dưới lock.
- Set approved actor/time và PROCESSING.
- Commit trước khi gọi provider; queue execute event sau commit.

### REFUND-INT-001 — Execute Provider Refund

- PROCESSING only; idempotent provider request dùng refund code/idempotency.
- Gọi provider ngoài DB transaction.
- Lưu provider refund code unique.
- Nếu response definitive có thể update SUCCESS/FAILED; nếu async chờ webhook.
- Network timeout không được tự tạo refund record khác; retry cùng provider idempotency key.

### REFUND-005 — Confirm Manual Refund

Cho CASH/BANK_TRANSFER sau khi có bằng chứng đối soát; PROCESSING → SUCCESS hoặc FAILED. Ghi approver/operator, reference và audit. Không dùng cho ORIGINAL_PAYMENT gateway.

### REFUND-006 — Refund Provider Webhook

1. Verify signature và provider event/reference.
2. Resolve refund bằng provider refund code/internal reference.
3. Lock refund → payment → optional return.
4. Duplicate success không cộng tiền lại.
5. SUCCESS: tăng `payments.refunded_amount`, derive PARTIALLY_REFUNDED/REFUNDED.
6. FAILED: giữ amount aggregate không đổi; cho phép controlled retry.
7. Trigger return/order completion checks sau commit.

**Schema gap:** chưa có refund webhook event table. Cần durable provider-event dedupe giống payment webhooks; `provider_refund_code` unique chưa đủ nếu cùng event gây nhiều side effects.

---

## 18. Cross-Cutting P0 Requirements

### 18.1 Audit bắt buộc

Các command sau phải ghi `audit_logs` sau khi redact secret/PII:

| Domain | Hành động bắt buộc audit |
|---|---|
| Identity | Disable/lock/unlock user, admin update user |
| Staff | Tạo staff, đổi position/manager/employment status |
| RBAC | Tạo/sửa/disable role, đổi permission set, assign/revoke role |
| Catalog | Publish/inactive product/variant, đổi giá |
| Coupon | Đổi rule/target/status |
| Procurement | Submit/approve/cancel/receive PO |
| Inventory | Manual adjustment và sai lệch reconciliation |
| Order | Confirm, status transition, cancel |
| Payment | Manual confirmation, webhook rejection, mismatch |
| Shipment | Ship/deliver/fail/return/cancel |
| Warranty | Receive/reject/complete claim |
| Return/Refund | Approve/reject/inspect/complete và mọi movement tiền |

Audit phải có actor hoặc system context, action code, entity type/id, result, correlation ID, old/new data đã redact, IP/user agent khi thích hợp. Không cho API update/delete audit.

### 18.2 Notification side effects

Sau transaction commit, endpoint P0 nên tạo notification/delivery cho các event:

- Register/verify/reset password.
- Order created/confirmed/cancelled/completed.
- Payment success/failure cần hành động.
- Shipment shipped/delivered/failed.
- Warranty claim received/completed/rejected.
- Return approved/rejected/received/completed.
- Refund processing/success/failed.

Không gửi email/SMS trước commit. Để bảo đảm không mất event giữa DB commit và message publish, production nên có transactional outbox; schema hiện chưa có outbox table.

### 18.3 Mandatory background jobs

| Job | Trách nhiệm |
|---|---|
| Refresh-token cleanup | Xóa/archive token hết hạn theo retention |
| Role-expiry cleanup | Revoke assignment đã hết hạn để không chặn unique active assignment |
| Reservation expiry | Release stock/unit/coupon reservation đúng một lần |
| Coupon reconciliation | Đối soát `used_count` với CONSUMED usages |
| Payment webhook retry | Xử lý event RECEIVED lỗi tạm idempotently |
| Notification delivery | Retry có backoff và cập nhật attempt count |
| Inventory reconciliation | So balance với ledger và serialized unit counts |
| Payment reconciliation | So aggregate với successful attempts/refunds |
| Warranty expiry | Chuyển ACTIVE → EXPIRED theo policy/time |

### 18.4 Security controls

- Rate-limit auth, guest lookup, coupon quote, payment attempt và webhook.
- Validate ownership tại query gốc, không fetch rồi mới check lỏng lẻo.
- Default deny permission.
- Không mass-assign request body vào entity.
- Allowlist sort/filter/patch fields.
- Token/idempotency raw values không lưu DB/log.
- Mask PII trong admin lists và notification delivery.
- Verify webhook signature trên raw body và kiểm soát replay window.
- Giao dịch tiền/tồn/role nhạy cảm có thể yêu cầu MFA hoặc step-up authentication.

### 18.5 Money and time

- Money dùng `DECIMAL(15,2)` và một rounding policy duy nhất.
- Không dùng float ở API/service.
- Datetime được ghi UTC; client hiển thị theo timezone.
- Server quyết định timestamps, không tin client cho created/approved/paid times.

---

## 19. Schema Gaps Must Be Resolved Before P0 Production

Đây không phải lỗi “trang trí”; mỗi mục ảnh hưởng trực tiếp độ an toàn của endpoint.

| # | Gap | Endpoint bị ảnh hưởng | Quyết định/bổ sung đề xuất |
|---:|---|---|---|
| 1 | Verification token không bind email/purpose và không có trạng thái revoke | AUTH-002/003, đổi email | Thêm pending-email/change-email token design + revoke lifecycle, hoặc cấm đổi email như P0 |
| 2 | Không có staff invitation token riêng | STAFF-002 | Dùng reset + verification tạm thời hoặc thêm staff invitations |
| 3 | Thiếu `WAREHOUSE_MANAGE` | WH-002/004/005 | Seed permission mới và map role phù hợp |
| 4 | Thiếu `SUPPLIER_MANAGE` | SUP-002/004/005 | Seed permission mới |
| 5 | Thiếu `PAYMENT_CONFIRM` | PAY-ADM-001 | Tách quyền xem tiền và xác nhận tiền |
| 6 | Không có receipt aggregate/idempotency | PO-010 | Thêm `purchase_order_receipts` + receipt items + request key |
| 7 | Không có inventory adjustment aggregate | INV-007 | Thêm adjustment header/items + idempotency/review fields |
| 8 | Ledger có transfer type nhưng không có stock-transfer aggregate | Chưa tạo API transfer | Thêm transfer header/items/status rồi mới mở endpoint |
| 9 | Checkout thiếu request fingerprint/owner scope | ORDER-001 | Thêm durable idempotency record hoặc request hash/scope |
| 10 | Guest order/warranty access token không persist | ORDER-004/005, WARRANTY-003 | Chấp nhận signed short-lived token hoặc thêm hashed token tables |
| 11 | Shipment webhook không có event inbox | SHIP-009 | Thêm unique provider event table |
| 12 | Refund webhook không có event inbox | REFUND-006 | Thêm refund webhook event table |
| 13 | Non-serialized warranty thiếu unique issuance key | WARRANTY-INT-001 | Unique order-item issuance key hoặc warranty issuance table |
| 14 | PO không có status history | PO transitions | Thêm history table hoặc bảo đảm audit action đầy đủ |
| 15 | Không có transactional outbox | Mọi notification/integration | Thêm outbox để publish sau commit đáng tin cậy |
| 16 | Category target không định nghĩa descendants | COUPON | P0 exact-category; nếu cần cây, thêm include flag/closure/path |
| 17 | Order chưa snapshot cost | Profit reporting | Chốt cost allocation và thêm cost snapshot nếu P0 cần lợi nhuận |
| 18 | Order chưa có tax/invoice model | VAT/invoice nghiệp vụ | Chốt giá đã gồm thuế hoặc bổ sung tax/invoice trước triển khai pháp lý |
| 19 | Active role unique key không tự bỏ expired assignment | ASSIGN-002 | Job revoke expired trước khi reassign hoặc redesign active-key lifecycle |
| 20 | Status history/audit không biểu diễn rõ guest actor | ORDER-001/006 và guest after-sales commands | Thêm actor type `GUEST` cùng guest identity hash/source metadata, hoặc quy ước service actor có bằng chứng truy vết riêng |
| 21 | Password-reset token không có trạng thái revoke/family | AUTH-007/008 | Khi reset thành công phải vô hiệu tất cả token cũ; production nên thêm revoke reason/generation để truy vết đúng |

Không nên âm thầm “xử lý trong code” các gap về idempotency, webhook hoặc accounting mà không có bằng chứng dữ liệu bền vững.

---

## 20. P0 Requirement-to-Endpoint Traceability

| Business requirement | Endpoint chính | Data source |
|---|---|---|
| Customer đăng ký và xác minh | AUTH-001/002/003 | users, customer profiles, verification tokens, roles |
| Đăng nhập và rotation token | AUTH-004/005/006 | users, refresh tokens, RBAC |
| Admin tạo Operation role | ROLE-002/006, ASSIGN-002 | roles, permissions, role permissions, user roles |
| Tạo staff/chức danh | DEPT/POS/STAFF endpoints | departments, positions, staff profiles |
| Đăng sản phẩm nhiều cấu hình | PRODUCT/VARIANT/PRICE/IMAGE/SPEC/ATTR endpoints | products, variants, images, specs, attrs |
| Khách/guest dùng giỏ | CART-001..006 | carts, cart items |
| Coupon đúng target/quota | COUPON endpoints + ORDER-001 | coupons, targets, usages |
| Nhập hàng theo PO | PO-002..010 | PO, items, balances, units, identifiers, ledger |
| Tra đúng IMEI | INV-003/004 | units, identifiers |
| Không bán vượt tồn | ORDER-001 + expiry job | balances, reservations, units, ledger |
| Không tạo đơn trùng | ORDER-001 | order idempotency hash + gap resolution |
| Retry thanh toán không thu hai lần | PAY-002/004 | attempts, webhook events, payment aggregate |
| Một đơn nhiều kiện/kho | SHIP-002..007 | shipments, shipment items/units |
| Bảo hành theo máy | WARRANTY/CLAIM endpoints | warranties, claims, units |
| Trả đúng máy, không vượt số mua | RETURN endpoints | return requests/items/units, order items |
| Hoàn tiền một phần an toàn | REFUND endpoints | refunds, payments, attempts, returns |

---

## 21. Recommended P0 Implementation Order

1. **Foundation:** error contract, authentication middleware, authorization, audit/correlation.
2. **Identity/RBAC:** AUTH, users, departments, positions, staff, roles.
3. **Catalog:** categories, brands, products, variants, price and media.
4. **Procurement/Inventory:** warehouses, suppliers, PO receive, units/identifiers/ledger.
5. **Customer Commerce:** address, cart, coupon quote.
6. **Checkout:** order snapshots, coupon reservation, stock reservation, payment aggregate.
7. **Payment:** attempts, webhook inbox, manual payment.
8. **Fulfillment:** shipment allocation, unit scan, ship/deliver aggregation.
9. **After-sales:** warranty, return, inspection and refund.
10. **Hardening:** concurrency tests, reconciliation jobs, outbox, observability and migration tests.

Không bắt đầu payment/shipment/return UI trước khi state machines và transaction boundaries tương ứng được thống nhất.

---

## 22. Definition of Done For Every P0 Endpoint

Một endpoint chỉ được coi là Done khi:

- Method/path/auth/permission đã đúng tài liệu.
- Request fields và patch allowlist đã được chốt.
- Business validations có unit test.
- Ownership/permission có negative tests.
- HTTP success/error codes ổn định.
- Transaction rollback được integration test.
- Idempotency replay và payload conflict được test nếu áp dụng.
- Concurrency test tồn tại cho coupon, stock, payment và refund.
- State transition illegal bị chặn.
- Audit/notification side effects xảy ra sau commit đúng policy.
- Không log secret/PII thô.
- Query có index/EXPLAIN phù hợp với dữ liệu gần production.
- API contract/OpenAPI và QA acceptance criteria được cập nhật.

---

## 23. Final Architectural Position

Danh sách P0 này không coi mọi bảng là CRUD. Các endpoint được thiết kế quanh command nghiệp vụ và aggregate:

- Giá đổi qua price-change command để có history.
- Order đổi trạng thái qua command để có status history.
- Tồn kho chỉ đổi cùng ledger.
- Payment chỉ đổi qua attempt/webhook/manual reconciliation.
- Refund tách khỏi return approval.
- Role assignment tách khỏi staff position.
- Serial/IMEI được scan và truy vết qua unit identifier, không nhập tùy ý ở order.

Đó là ranh giới tối thiểu để API phản ánh đúng hệ thống bán điện thoại thực tế thay vì chỉ là một bộ CRUD demo.
