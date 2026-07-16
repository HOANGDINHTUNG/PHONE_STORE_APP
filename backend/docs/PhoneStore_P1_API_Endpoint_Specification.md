# PHONE STORE P1 API ENDPOINT SPECIFICATION

**Project:** Phone Store E-Commerce & Management Platform  
**API style:** REST-oriented HTTP API  
**Base path:** /api/v1  
**Database source:** PhoneStore_Enterprise_Schema.sql  
**P0 baseline:** PhoneStore_P0_API_Endpoint_Specification.md  
**Document version:** 1.0  
**Scope:** P1 — chức năng quan trọng sau khi luồng bán hàng P0 đã vận hành ổn định

---

## Document Map

1. Mục đích, định nghĩa và ranh giới P1.
2. Quy ước HTTP, bảo mật và nguyên tắc không trùng P0.
3. Account security và quản lý phiên đăng nhập.
4. Catalog discovery, related products và price history.
5. Wishlist và product comparison.
6. Verified review và moderation.
7. Reorder từ đơn hàng cũ.
8. Notification center và delivery operations.
9. Banner CMS.
10. Audit log query.
11. Sales, inventory, procurement và after-sales reporting.
12. Cross-cutting requirements, schema gaps, traceability và Definition of Done.

---

## 1. Mục đích tài liệu

Tài liệu này bổ sung các endpoint P1 sau tài liệu P0. Nó không thay thế P0 và không định nghĩa lại các endpoint đã có.

P1 phục vụ bốn mục tiêu:

- Tăng trải nghiệm mua sắm: wishlist, so sánh, review, gợi ý và mua lại.
- Tăng khả năng tự bảo vệ tài khoản: đổi mật khẩu và kiểm soát phiên đăng nhập.
- Tăng khả năng vận hành: notification center, banner, audit query và retry delivery.
- Tăng khả năng ra quyết định: báo cáo sales, payment, inventory, procurement và after-sales.

Tài liệu chỉ mô tả API contract và nghiệp vụ. Không chứa code Controller, Service, Repository hoặc câu SQL triển khai.

---

## 2. Định nghĩa và ranh giới P1

P1 là chức năng có giá trị kinh doanh cao nhưng không chặn luồng cốt lõi:

1. Không có wishlist/compare thì khách vẫn mua được bằng catalog và cart P0.
2. Không có review thì sản phẩm vẫn được tạo, bán và giao.
3. Không có notification center thì các notification P0 vẫn có thể được tạo/gửi.
4. Không có banner thì catalog vẫn truy cập được.
5. Không có báo cáo tổng hợp thì nhân viên vẫn vận hành bằng các danh sách P0.
6. Không có session management UI thì login/refresh/logout P0 vẫn hoạt động.

### 2.1 P2 hoặc chưa đủ schema

Các chức năng sau không được giả vờ là P1 khi database chưa đủ:

- Recommendation bằng machine learning và cá nhân hóa theo hành vi.
- Recently viewed, saved search và search history.
- Nhiều wishlist, chia sẻ wishlist hoặc guest wishlist bền vững.
- Review có ảnh/video, phản hồi của shop, helpful vote hoặc report abuse.
- Notification preference, quiet hours, push-device registration và marketing campaign.
- Public promotion discovery vì coupons chưa có cờ public/visibility.
- Invoice/VAT, loyalty point, gift card và membership.
- Stock transfer và vendor return vì chưa có aggregate/status/history tương ứng.
- Export report bất đồng bộ vì chưa có report job/file artifact table.
- Báo cáo lợi nhuận, tồn kho theo giá vốn và margin chính xác vì order chưa snapshot cost và inventory chưa có cost layer.

---

## 3. Quy ước dùng chung

### 3.1 Kế thừa từ P0

P1 dùng lại toàn bộ chuẩn của P0:

- Authentication, ownership và RBAC default-deny.
- Error envelope gồm error_code, message, field_errors và correlation_id.
- Pagination mặc định page=1, page_size=20; page_size có giới hạn.
- Allowlist cho sort/filter/patch fields.
- UTC trong database; timezone chỉ dùng để bucket báo cáo hoặc hiển thị.
- Không gọi email, SMS, push hoặc provider bên ngoài khi transaction còn mở.
- Audit các command nhạy cảm và không log secret/PII thô.

### 3.2 HTTP method

| Method | Cách dùng trong P1 |
|---|---|
| GET | Đọc resource, preview hoặc aggregate report |
| POST | Tạo resource hoặc thực hiện command |
| PATCH | Cập nhật một phần/trạng thái có allowlist |
| PUT | Thay toàn bộ ordered set hoặc relationship set |
| DELETE | Xóa relationship hoặc revoke session; phải idempotent theo contract |

### 3.3 Status code chính

| Status | Ý nghĩa |
|---|---|
| 200 OK | Đọc/cập nhật/command thành công có body |
| 201 Created | Tạo relationship/resource mới |
| 202 Accepted | Đã queue xử lý bất đồng bộ |
| 204 No Content | Thành công không có body |
| 400 Bad Request | Sai cú pháp, filter, sort hoặc định dạng |
| 401 Unauthorized | Thiếu/invalid credential |
| 403 Forbidden | Không có ownership/permission |
| 404 Not Found | Resource không tồn tại hoặc được che khỏi actor |
| 409 Conflict | Trùng relationship, state conflict hoặc limit conflict |
| 412 Precondition Failed | Version/If-Match cũ |
| 422 Unprocessable Entity | Vi phạm business rule |
| 429 Too Many Requests | Vượt rate limit |

### 3.4 Quy tắc ownership

- User ID/customer ID luôn lấy từ access token, không nhận từ request body.
- Resource của người khác nên trả 404 khi cần chống enumeration.
- Admin permission không tự động bỏ qua organizational scope hoặc PII masking.
- Public review/banner/catalog chỉ trả dữ liệu đã được publish/approve và còn hiệu lực.

---

## 4. Boundary Check — Không trùng P0

| Nghiệp vụ đã có trong P0 | P1 chỉ bổ sung |
|---|---|
| Login, refresh, logout, reset password | Đổi mật khẩu khi đang đăng nhập; xem/revoke session |
| Public product list/detail | Trending, search suggestion, related products, comparison |
| Tạo/sửa product, variant, price | Đọc price history; quản lý related-product set |
| Cart CRUD và merge | Reorder đơn cũ vào cart bằng lại rule P0 |
| Order/payment/shipment | Không tạo lại checkout/status/payment/shipment route |
| Audit và notification là side effect | P1 mở API đọc audit/notification và retry delivery |
| Review table chưa có P0 endpoint | P1 triển khai toàn bộ review customer/public/moderation |
| Banner chưa có P0 endpoint | P1 triển khai public banner và CMS |
| Danh sách vận hành P0 | P1 bổ sung aggregate report, không sao chép list endpoint |

Kiểm tra trùng phải dựa trên cặp HTTP method + normalized path. Hai route dùng cùng bảng nhưng khác use case không được xem là trùng nếu contract và output khác nhau rõ ràng.

### 4.1 Coverage các bảng chưa có API trực tiếp trong P0

| Database table | P1 endpoint sở hữu | Ghi chú |
|---|---|---|
| wishlists | WISH-001..004 | Customer-only, product-level |
| compare_items | COMPARE-002..005 | Public preview không ghi DB |
| related_products | RELATED-001/ADM-001/ADM-002 | Relationship có hướng |
| reviews | REVIEW-PUB/REVIEW/REVIEW-ADM | Verified purchase + moderation |
| notifications | NOTIF-001..005 | P0 tạo side effect; P1 cho user đọc |
| notification_deliveries | NOTIF-ADM-001..003 | P0 job gửi; P1 quan sát/retry |
| banners | BANNER-PUB/BANNER-ADM | Schedule + position CMS |
| audit_logs | AUDIT-001/002 | P0/P1 ghi nội bộ; P1 chỉ query |

Các report P1 đọc aggregate từ bảng P0 nhưng không thay thế các list/command P0.

---

## 5. P1 Coverage Summary

Tổng phạm vi gồm **60 endpoint P1**:

- GET: 38.
- POST: 11.
- PATCH: 4.
- PUT: 2.
- DELETE: 5.

| Domain | Endpoint group | Số endpoint |
|---|---|---:|
| Account security | SEC | 4 |
| Catalog discovery | DISC | 2 |
| Related products | RELATED | 3 |
| Price history | PRICE-P1 | 1 |
| Wishlist | WISH | 4 |
| Product comparison | COMPARE | 5 |
| Review/moderation | REVIEW | 11 |
| Order convenience | ORDER-P1 | 1 |
| Notifications | NOTIF | 8 |
| Banner CMS | BANNER | 7 |
| Audit query | AUDIT | 2 |
| Reporting | REPORT | 12 |

---

## 6. Account Security and Session P1 APIs

### 6.1 Endpoint inventory

| ID | Method | Endpoint | Actor | Success | Chức năng |
|---|---|---|---|---|---|
| SEC-001 | POST | /me/password-changes | Authenticated | 204 | Đổi mật khẩu bằng mật khẩu hiện tại |
| SEC-002 | GET | /me/sessions | Authenticated | 200 | Liệt kê các phiên đăng nhập |
| SEC-003 | DELETE | /me/sessions/{sessionId} | Session owner | 204 | Revoke một phiên |
| SEC-004 | POST | /me/sessions/revoke-others | Authenticated | 204 | Revoke mọi phiên khác |

### SEC-001 — Change Current Password

**Tables:** users, refresh_tokens, audit_logs.  
**Input:** current_password, new_password.

**Business rules:**

1. Yêu cầu recent authentication hoặc step-up nếu session quá cũ.
2. Verify current password bằng password encoder; lỗi trả 401 CURRENT_PASSWORD_INVALID.
3. New password đạt policy và không được giống current password.
4. Update password hash và revoke mọi refresh token trong cùng transaction.
5. Có thể giữ current session chỉ khi dùng cơ chế token generation/version riêng; schema hiện không có nên P1 an toàn nhất là revoke toàn bộ.
6. Ghi audit đã redact; không ghi mật khẩu hoặc hash.
7. Gửi security notification sau commit.

**Errors:** 401 CURRENT_PASSWORD_INVALID, 422 WEAK_PASSWORD, 422 PASSWORD_REUSED, 429 PASSWORD_CHANGE_RATE_LIMITED.

### SEC-002 — List My Sessions

**Tables:** refresh_tokens.

Refresh-token rotation tạo nhiều row trong cùng token_family_id, vì vậy API phải trả một session logic cho mỗi family, không trả từng token đã rotate.

**Response fields đề xuất:** opaque session_id, device_name, first_seen_at, last_used_at, last_ip đã mask, current_session, active, expires_at.

**Rules:**

- Chỉ lấy family thuộc user hiện tại.
- Không trả token_hash, raw family ID hoặc user_agent thô nếu có nguy cơ lộ fingerprint.
- Session active khi family còn ít nhất một token chưa revoke/chưa hết hạn.
- Opaque session_id phải được ký hoặc ánh xạ an toàn, không cho client đoán token_family_id.

### SEC-003 — Revoke One Session

**Tables:** refresh_tokens, audit_logs.

- Resolve session ID về đúng token family thuộc user hiện tại.
- Set revoked_at/revoked_reason cho toàn bộ token chưa revoke trong family.
- Không ảnh hưởng family khác.
- Idempotent: family đã revoke vẫn trả 204.
- Nếu revoke current family, access token hiện tại chỉ hết hiệu lực ngay nếu có denylist/token-version; nếu không phải chờ access-token expiry.

**Errors:** 404 SESSION_NOT_FOUND, 403 SESSION_NOT_OWNED.

### SEC-004 — Revoke Other Sessions

**Tables:** refresh_tokens, audit_logs.

- Xác định current token family từ refresh credential/session context tin cậy.
- Revoke mọi family khác của cùng user, không dựa trên session ID client tự khai.
- Idempotent và ghi số family bị revoke trong audit metadata.
- Security notification gửi sau commit.

---

## 7. Catalog Discovery, Related Products and Price History

### 7.1 Endpoint inventory

| ID | Method | Endpoint | Actor/Permission | Success | Chức năng |
|---|---|---|---|---|---|
| DISC-001 | GET | /catalog/trending-products | Public | 200 | Danh sách sản phẩm thịnh hành |
| DISC-002 | GET | /catalog/search-suggestions | Public | 200 | Gợi ý từ khóa/sản phẩm |
| RELATED-001 | GET | /products/{slug}/related-products | Public | 200 | Sản phẩm liên quan đã publish |
| RELATED-ADM-001 | GET | /admin/products/{productId}/related-products | PRODUCT_VIEW | 200 | Xem relationship quản trị |
| RELATED-ADM-002 | PUT | /admin/products/{productId}/related-products | PRODUCT_UPDATE | 200 | Thay toàn bộ related-product set |
| PRICE-P1-001 | GET | /admin/variants/{variantId}/price-history | PRODUCT_VIEW | 200 | Lịch sử thay đổi giá |

### DISC-001 — List Trending Products

**Tables:** products, product_variants, product_images, warehouse_inventories, warehouses.

**Query:** optional category, brand, limit; limit có max nhỏ, đề xuất 20.

**Rules:**

- Chỉ product publication_status=ACTIVE, chưa deleted và có ít nhất một variant saleable.
- Score P1 chỉ được dùng dữ liệu có thật: sold_count, view_count, freshness và availability.
- Công thức score phải versioned/configurable, không viết cứng rải rác.
- Không để view spam thao túng ranking; view_count P0 cần async dedupe/rate control.
- Response dùng product-card projection giống product list P0 để frontend tái sử dụng.
- Cache ngắn hạn và invalidate theo publication/price/availability policy.

### DISC-002 — Search Suggestions

**Tables:** products, brands, categories.

**Query:** q bắt buộc sau trim; min/max length; optional limit.

**Rules:**

- Chỉ gợi ý product/brand/category ACTIVE và không deleted.
- Không trả nội dung từ search history vì DB chưa có query-log table.
- Escape output, normalize Unicode và rate-limit public endpoint.
- Không dùng chuỗi q trực tiếp để ghép SQL; dùng parameter binding/full-text strategy.
- Với q quá ngắn trả danh sách rỗng hoặc 422 theo contract thống nhất.

**Errors:** 400 INVALID_QUERY, 422 QUERY_TOO_SHORT, 429 SEARCH_SUGGESTION_RATE_LIMITED.

### RELATED-001 — Get Published Related Products

**Tables:** related_products, products, product_variants, product_images, warehouse_inventories.

- Product nguồn lookup bằng slug và phải ACTIVE.
- Chỉ trả related product ACTIVE, chưa deleted, có variant saleable.
- Sort theo related_products.sort_order rồi product ID ổn định.
- Relationship là có hướng: A liên quan B không tự suy ra B liên quan A.
- Product bị inactive không được public trả dù relationship row còn tồn tại.

### RELATED-ADM-001 — Get Related Product Configuration

**Permission:** PRODUCT_VIEW.

Trả cả relationship trỏ đến DRAFT/INACTIVE để quản trị viên phát hiện cấu hình hỏng. Response gồm source product, related product status, sort order và warning nếu target không public được.

### RELATED-ADM-002 — Replace Related Product Set

**Permission:** PRODUCT_UPDATE.  
**Input:** ordered list related_product_id và sort_order.

**Business rules:**

1. Product nguồn và mọi target phải tồn tại, chưa deleted.
2. Không cho self-reference.
3. Không trùng target ID hoặc sort order không hợp lệ.
4. P1 cho phép target DRAFT/INACTIVE để chuẩn bị nội dung nhưng public endpoint sẽ lọc.
5. Replace toàn bộ set trong một transaction.
6. Không tự tạo relationship ngược chiều.
7. Ghi before/after diff vào audit_logs và invalidate catalog cache sau commit.

**Errors:** 404 PRODUCT_NOT_FOUND, 404 RELATED_PRODUCT_NOT_FOUND, 409 DUPLICATE_RELATED_PRODUCT, 422 SELF_RELATION_NOT_ALLOWED.

### PRICE-P1-001 — Get Variant Price History

**Tables:** product_variants, product_price_histories, users.  
**Permission:** PRODUCT_VIEW.

- Verify variant tồn tại; trả newest first, phân trang.
- Filters: effective range, changed_by.
- Trả old/new list price, old/new sale price, reason, actor summary và effective_at.
- Mask actor contact; không trả data khác của user.
- Không cho sửa/xóa history qua P1.
- Nếu initial history không tồn tại do dữ liệu legacy, trả list rỗng kèm warning nội bộ thay vì tự dựng lịch sử giả.

---

## 8. Wishlist P1 APIs

### 8.1 Endpoint inventory

| ID | Method | Endpoint | Actor | Success | Chức năng |
|---|---|---|---|---|---|
| WISH-001 | GET | /me/wishlist-items | Customer | 200 | Danh sách sản phẩm yêu thích |
| WISH-002 | POST | /me/wishlist-items | Customer | 201/200 | Thêm sản phẩm |
| WISH-003 | DELETE | /me/wishlist-items/{productId} | Owner | 204 | Bỏ một sản phẩm |
| WISH-004 | DELETE | /me/wishlist-items | Customer | 204 | Xóa toàn bộ wishlist |

### 8.2 Shared wishlist rules

**Tables:** wishlists, customer_profiles, products, product_variants, product_images, warehouse_inventories.

- Schema chỉ hỗ trợ một wishlist phẳng cho customer, không hỗ trợ guest hoặc nhiều danh sách.
- Wishlist lưu product_id, không lưu variant; UI phải bắt khách chọn variant khi thêm vào cart.
- Product inactive/deleted không bị mất khỏi wishlist history một cách im lặng; response trả unavailable state để khách có thể xóa.
- Không dùng wishlist như stock reservation hoặc price guarantee.

### WISH-001 — List My Wishlist

Filters đề xuất: available status, brand, category; sort newest/price/name theo allowlist.

Response trả product-card projection, date_added, effective price hiện tại, price/availability state và saleable variant count. Không trả exact internal inventory.

### WISH-002 — Add Wishlist Item

**Input:** product_id.

- Customer profile phải ACTIVE.
- Product phải tồn tại, chưa deleted; P1 đề xuất chỉ cho thêm product ACTIVE.
- Primary key customer_id + product_id chống duplicate.
- Idempotent behavior: insert mới trả 201; đã tồn tại trả 200 cùng resource thay vì 409 để double-click an toàn.
- Không tin customer_id từ request.

**Errors:** 404 PRODUCT_NOT_FOUND, 409 PRODUCT_NOT_AVAILABLE, 403 CUSTOMER_PROFILE_INACTIVE.

### WISH-003 — Remove Wishlist Item

Delete đúng relationship của owner. Idempotent 204 kể cả item không còn tồn tại; không tiết lộ wishlist của user khác.

### WISH-004 — Clear Wishlist

Delete mọi relationship của customer hiện tại trong một transaction. Command idempotent và có thể trả số item đã xóa trong audit, response vẫn 204.

---

## 9. Product Comparison P1 APIs

### 9.1 Endpoint inventory

| ID | Method | Endpoint | Actor | Success | Chức năng |
|---|---|---|---|---|---|
| COMPARE-001 | GET | /product-comparisons | Public | 200 | So sánh danh sách product tạm thời |
| COMPARE-002 | GET | /me/compare-items | Customer | 200 | Lấy compare list đã lưu |
| COMPARE-003 | POST | /me/compare-items | Customer | 201/200 | Thêm product vào compare list |
| COMPARE-004 | DELETE | /me/compare-items/{productId} | Owner | 204 | Xóa một product |
| COMPARE-005 | DELETE | /me/compare-items | Customer | 204 | Clear compare list |

### 9.2 Shared comparison rules

**Tables:** compare_items, products, categories, brands, product_variants, product_specifications, product_attributes, product_images, warehouse_inventories.

- Compare ở cấp product; mỗi cột có thể chứa nhiều variants.
- Giới hạn P1 đề xuất từ 2 đến 4 product khi render matrix; persisted list tối đa 4.
- Product public phải ACTIVE, chưa deleted và có variant saleable.
- P1 mặc định chỉ so sánh product cùng top-level category. Nếu business cho phép khác category, response phải tách nhóm specification và không tạo kết luận sai.
- Giá/availability là dữ liệu hiện tại, không phải cam kết.
- Không expose serial/IMEI, cost hoặc tồn chi tiết theo kho.

### COMPARE-001 — Build Public Comparison

**Query:** product_ids là danh sách unique ID, tối đa 4.

**Response:**

- Product identity, brand, image và short description.
- Variant options và effective price range.
- Availability summary.
- Specification matrix được group theo group_name/spec_name.
- Attribute matrix dùng vocabulary đã normalize.
- Flags khác biệt để frontend highlight nhưng server không tự tuyên bố sản phẩm nào tốt nhất.

**Rules:**

- Preserve thứ tự product_ids do client gửi.
- Reject duplicate ID sau normalize.
- Nếu một product không public, trả 404 hoặc loại toàn bộ request theo contract; P1 đề xuất fail toàn bộ để matrix không âm thầm thiếu cột.
- Cache key phải phụ thuộc tập ID có thứ tự và catalog version.

**Errors:** 400 INVALID_PRODUCT_IDS, 404 PRODUCT_NOT_FOUND, 422 COMPARISON_LIMIT_EXCEEDED, 422 PRODUCTS_NOT_COMPARABLE.

### COMPARE-002 — Get My Saved Compare Items

Trả persisted items theo created_at cùng comparison projection. Schema không có sort_order nên không cam kết drag-and-drop ordering. Item unavailable vẫn được trả với trạng thái để customer xóa.

### COMPARE-003 — Add Saved Compare Item

**Input:** product_id.

1. Lock customer profile row để serialize thao tác count + insert.
2. Kiểm tra product ACTIVE/chưa deleted.
3. Đếm compare items hiện tại và enforce max=4 trong cùng transaction.
4. Kiểm tra top-level category tương thích với các item đang có.
5. Insert relationship; item đã tồn tại trả 200 để idempotent.

Chỉ dựa vào COUNT trước INSERT mà không lock sẽ cho hai request đồng thời vượt limit.

**Errors:** 404 PRODUCT_NOT_FOUND, 409 COMPARE_LIST_FULL, 422 PRODUCTS_NOT_COMPARABLE.

### COMPARE-004 — Remove Saved Compare Item

Delete relationship thuộc customer hiện tại; idempotent 204.

### COMPARE-005 — Clear Saved Compare List

Delete toàn bộ compare_items của customer trong một transaction; idempotent 204.

---

## 10. Verified Review and Moderation P1 APIs

### 10.1 Endpoint inventory

| ID | Method | Endpoint | Actor/Permission | Success | Chức năng |
|---|---|---|---|---|---|
| REVIEW-PUB-001 | GET | /products/{slug}/reviews | Public | 200 | Danh sách review đã duyệt |
| REVIEW-PUB-002 | GET | /products/{slug}/review-summary | Public | 200 | Rating aggregate |
| REVIEW-001 | GET | /me/review-eligibilities | Customer | 200 | Các order item được phép review |
| REVIEW-002 | POST | /products/{productId}/reviews | Customer | 201 | Tạo verified-purchase review |
| REVIEW-003 | GET | /me/reviews | Customer | 200 | Danh sách review của tôi |
| REVIEW-004 | GET | /me/reviews/{reviewId} | Owner | 200 | Chi tiết review của tôi |
| REVIEW-005 | PATCH | /me/reviews/{reviewId} | Owner | 200 | Chỉnh sửa và gửi duyệt lại |
| REVIEW-ADM-001 | GET | /admin/reviews | REVIEW_MODERATE | 200 | Moderation queue |
| REVIEW-ADM-002 | GET | /admin/reviews/{reviewId} | REVIEW_MODERATE | 200 | Chi tiết moderation |
| REVIEW-ADM-003 | POST | /admin/reviews/{reviewId}/approve | REVIEW_MODERATE | 200 | Duyệt review |
| REVIEW-ADM-004 | POST | /admin/reviews/{reviewId}/reject | REVIEW_MODERATE | 200 | Từ chối review |

### 10.2 Review invariants

**Tables:** reviews, customer_profiles, orders, order_items, products, users, audit_logs.

- Chỉ registered customer có order từng hoàn tất mới review được; bằng chứng là completed_at đã được set và current status thuộc COMPLETED/PARTIALLY_RETURNED/RETURNED.
- order_item phải thuộc order của customer và order_item.product_id phải đúng product đang review.
- Unique customer_id + order_item_id nghĩa là một review cho mỗi dòng đơn, kể cả quantity lớn hơn 1.
- Review mới luôn PENDING; client không được gửi status/moderator fields.
- Public chỉ thấy APPROVED.
- APPROVED/REJECTED không được hard-delete trong P1 vì schema thiếu deleted_at/withdrawn state.
- Moderation không được sửa rating/comment thay customer.

### REVIEW-PUB-001 — List Approved Product Reviews

**Query:** page, page_size, rating, sort newest/oldest/highest/lowest.

**Rules:**

- Product lookup bằng slug và phải public.
- Chỉ status APPROVED.
- Trả display name đã mask theo privacy policy, rating, title, comment, verified_purchase=true và created_at.
- Không trả order ID/order item ID, contact, moderator hoặc rejection reason.
- Sort/filter allowlist; paginate ổn định bằng created_at + ID.
- Content phải được output-encode; moderation không thay thế chống XSS.

### REVIEW-PUB-002 — Get Review Summary

**Output:** approved_review_count, average_rating, distribution 1..5.

- Chỉ aggregate APPROVED.
- average phải dùng cùng rounding policy trên mọi màn hình.
- Review PENDING/REJECTED không làm thay đổi public summary.
- Với zero review, count=0, average=null và distribution=0; không giả rating 0 sao.
- Có thể cache/read-model; invalidate sau approve/reject hoặc approved review được gửi duyệt lại.

### REVIEW-001 — List Review Eligibilities

**Tables:** orders, order_items, reviews, products.

Trả order items thuộc customer từ đơn đã từng hoàn tất chưa có review, hoặc đã có review kèm trạng thái để UI không tạo trùng.

**Filters:** reviewable_only, product, completed date; newest completed first.

Không coi PENDING payment hoặc shipment delivered một phần là eligible nếu order chưa từng đạt COMPLETED theo P0 policy. Việc đơn sau đó chuyển PARTIALLY_RETURNED/RETURNED không xóa bằng chứng verified purchase; nếu business muốn cấm review riêng item đã hoàn trả thì phải tính cumulative returned quantity theo order item.

### REVIEW-002 — Create Verified Purchase Review

**Input:** order_item_id, rating, optional title/comment.

**Transaction flow:**

1. Lock order item và join order.
2. Verify order.customer_id là customer hiện tại, completed_at đã có và current status thuộc COMPLETED/PARTIALLY_RETURNED/RETURNED.
3. Verify order_item.product_id khớp path productId.
4. Validate rating 1..5, length và content policy.
5. Kiểm tra unique review; duplicate trả 409.
6. Insert PENDING, không nhận moderated fields.
7. Commit rồi gửi notification cho moderation nếu cần.

**Errors:** 404 ORDER_ITEM_NOT_FOUND, 403 ORDER_ITEM_NOT_OWNED, 409 REVIEW_ALREADY_EXISTS, 422 ORDER_NOT_REVIEWABLE, 422 INVALID_REVIEW_CONTENT.

### REVIEW-003 — List My Reviews

Trả mọi trạng thái PENDING/APPROVED/REJECTED, product/order summary, rejection reason và moderation time. Không trả moderator PII.

### REVIEW-004 — Get My Review Detail

Owner only. Trả nội dung hiện tại, status, product snapshot hiện tại, order reference phù hợp và rejection reason. Resource người khác trả 404.

### REVIEW-005 — Edit My Review

**Input allowlist:** rating, title, comment.

- Owner only; order vẫn phải thuộc customer.
- PENDING có thể update và giữ PENDING.
- REJECTED có thể sửa rồi reset PENDING, clear moderated_by/moderated_at/rejection_reason.
- APPROVED nếu sửa phải reset PENDING và tạm biến mất khỏi public list cho đến khi duyệt lại.
- Ghi before/after audit đã redact.
- Không cho patch status, product, order_item hoặc customer.

**Errors:** 404 REVIEW_NOT_FOUND, 409 REVIEW_NOT_EDITABLE, 422 INVALID_REVIEW_CONTENT.

### REVIEW-ADM-001 — List Moderation Queue

**Permission:** REVIEW_MODERATE.

Filters status, rating, product, customer, created range, moderator. Default PENDING oldest first để tránh starvation. Mask customer contact; trả verified-order evidence tối thiểu.

### REVIEW-ADM-002 — Get Review Moderation Detail

Trả review, product, verified order evidence, prior moderation fields và audit timeline nếu được phép. Không trả payment/PII không liên quan.

### REVIEW-ADM-003 — Approve Review

- PENDING only; lock review.
- Set APPROVED, moderated_by, moderated_at; rejection_reason=NULL.
- State guard ngăn hai moderator approve/reject đồng thời.
- Ghi audit và invalidate review summary/list cache sau commit.
- Idempotent replay cùng final state có thể trả 200; opposite final state trả 409.

### REVIEW-ADM-004 — Reject Review

**Input:** rejection_reason bắt buộc và thuộc controlled reason policy khi có.

- PENDING only; lock review.
- Set REJECTED, moderator/time/reason.
- Không sửa/xóa content của customer.
- Gửi notification sau commit để customer biết có thể chỉnh sửa.

**Errors:** 409 REVIEW_ALREADY_MODERATED, 422 REJECTION_REASON_REQUIRED.

---

## 11. Order Convenience P1 API

### 11.1 Endpoint inventory

| ID | Method | Endpoint | Actor | Success | Chức năng |
|---|---|---|---|---|---|
| ORDER-P1-001 | POST | /me/orders/{orderCode}/reorder | Order owner | 200 | Đưa sản phẩm từ đơn cũ vào cart |

### ORDER-P1-001 — Reorder Into Current Cart

**Tables:** orders, order_items, carts, cart_items, products, product_variants.

**Business rules:**

1. Order phải thuộc customer hiện tại; trạng thái cũ không quyết định giá mới.
2. Reload product/variant hiện tại; không dùng unit_price, discount hoặc coupon snapshot để định giá cart.
3. Bỏ qua variant deleted/inactive hoặc product không public và trả warning theo từng item.
4. Không copy serial/IMEI, shipment, coupon, address hoặc payment method.
5. Với item hợp lệ, P1 dùng desired merge: quantity sau reorder = max(quantity hiện có, quantity trong order cũ), sau đó clamp theo cart limit. Cách này làm retry tự nhiên idempotent.
6. Upsert các item hợp lệ trong một transaction; nếu không còn item nào hợp lệ, không đổi cart và trả 422.
7. Không reserve stock; checkout P0 vẫn là nơi tính giá và giữ tồn.

**Response:** cart hiện tại cùng added/updated/skipped warnings.

**Errors:** 404 ORDER_NOT_FOUND, 422 NO_REORDERABLE_ITEMS, 422 CART_LIMIT_EXCEEDED.

---

## 12. Notification Center and Delivery Operations P1 APIs

### 12.1 Endpoint inventory

| ID | Method | Endpoint | Actor/Permission | Success | Chức năng |
|---|---|---|---|---|---|
| NOTIF-001 | GET | /me/notifications | Authenticated | 200 | Danh sách notification |
| NOTIF-002 | GET | /me/notifications/unread-count | Authenticated | 200 | Đếm chưa đọc |
| NOTIF-003 | GET | /me/notifications/{notificationId} | Owner | 200 | Chi tiết notification |
| NOTIF-004 | PATCH | /me/notifications/{notificationId}/read-status | Owner | 200 | Đánh dấu read/unread |
| NOTIF-005 | POST | /me/notifications/read-all | Authenticated | 204 | Đánh dấu đã đọc hàng loạt |
| NOTIF-ADM-001 | GET | /admin/notification-deliveries | Cần NOTIFICATION_VIEW | 200 | Delivery queue/failure list |
| NOTIF-ADM-002 | GET | /admin/notification-deliveries/{deliveryId} | Cần NOTIFICATION_VIEW | 200 | Chi tiết delivery |
| NOTIF-ADM-003 | POST | /admin/notification-deliveries/{deliveryId}/retry | Cần NOTIFICATION_RETRY | 202/200 | Queue retry delivery |

### 12.2 Notification ownership rules

**Tables:** notifications, notification_deliveries, users.

- Notification thuộc đúng một user.
- API self-service luôn scope bằng user_id từ token.
- action_url là dữ liệu server-generated nhưng frontend vẫn phải allowlist internal route; không redirect tùy ý.
- Không trả destination/email/phone delivery cho user nếu không cần.
- Không có DELETE P1 vì notification là lịch sử giao tiếp; retention xử lý bằng job/policy riêng.

### NOTIF-001 — List My Notifications

**Filters:** read_status, notification_type, entity_type, created range; sort newest mặc định.

Response trả title, safe content, entity reference, validated action URL, read state và created time. Phân trang ổn định; unread trước chỉ dùng khi client yêu cầu.

### NOTIF-002 — Get Unread Count

Đếm user_id=current và read_at IS NULL bằng index. Response nhỏ, có thể cache ngắn nhưng phải invalidate khi insert/read/read-all.

### NOTIF-003 — Get My Notification

Owner only. Không cho query notification theo ID rồi kiểm tra lỏng ở application; ownership phải nằm trong query. Resource người khác trả 404.

### NOTIF-004 — Change Read Status

**Input:** read boolean.

- read=true: set read_at bằng server time nếu đang NULL.
- read=false: set read_at=NULL nếu policy cho đánh dấu chưa đọc.
- Command idempotent; response trả trạng thái cuối.
- Không thay title/content/entity/action URL.

### NOTIF-005 — Mark Notifications Read

**Input optional:** notification_type và before_created_at.

- Server chốt cutoff time khi bắt đầu request để notification mới đến đồng thời không bị đánh dấu nhầm.
- Update notification của current user, read_at IS NULL và created_at <= cutoff.
- Không nhận user_id từ body.
- Idempotent 204.

### NOTIF-ADM-001 — List Notification Deliveries

**Permission mới:** NOTIFICATION_VIEW.

Filters channel, status, notification type, attempt range, last-attempt range. Default ưu tiên FAILED/PENDING cũ. Mask destination; không trả full notification content nếu không cần.

### NOTIF-ADM-002 — Get Delivery Detail

Trả delivery status, channel, masked destination, attempt_count, timestamps, safe last_error và notification/entity summary. Redact provider secret/raw payload/PII.

### NOTIF-ADM-003 — Retry Failed Delivery

**Permission mới:** NOTIFICATION_RETRY.

1. Lock delivery.
2. Chỉ FAILED được retry thủ công; SENT không retry.
3. Kiểm tra max attempts/cooldown và notification còn hợp lệ.
4. Transition FAILED → PENDING bằng state guard; không tự tăng attempt_count trước khi worker thực sự gọi provider.
5. Commit rồi enqueue delivery job.
6. Nếu đã PENDING do retry trước, trả 200 idempotent; nếu worker đang xử lý nhưng schema không biểu diễn được, phải dùng distributed job lock.

**Errors:** 409 DELIVERY_NOT_RETRYABLE, 409 MAX_ATTEMPTS_REACHED, 429 RETRY_RATE_LIMITED.

---

## 13. Banner Content Management P1 APIs

### 13.1 Endpoint inventory

| ID | Method | Endpoint | Actor/Permission | Success | Chức năng |
|---|---|---|---|---|---|
| BANNER-PUB-001 | GET | /banners | Public | 200 | Banner đang hiệu lực theo vị trí |
| BANNER-ADM-001 | GET | /admin/banners | BANNER_MANAGE | 200 | Danh sách banner quản trị |
| BANNER-ADM-002 | POST | /admin/banners | BANNER_MANAGE | 201 | Tạo banner inactive |
| BANNER-ADM-003 | GET | /admin/banners/{bannerId} | BANNER_MANAGE | 200 | Chi tiết banner |
| BANNER-ADM-004 | PATCH | /admin/banners/{bannerId} | BANNER_MANAGE | 200 | Sửa nội dung/lịch |
| BANNER-ADM-005 | PATCH | /admin/banners/{bannerId}/status | BANNER_MANAGE | 200 | Active/inactive banner |
| BANNER-ADM-006 | PUT | /admin/banner-positions/{position}/ordering | BANNER_MANAGE | 200 | Thay thứ tự banner trong vị trí |

### 13.2 Banner publication rules

**Tables:** banners, users, audit_logs.

Banner được public khi đồng thời:

- status=ACTIVE.
- starts_at IS NULL hoặc starts_at <= current UTC time.
- ends_at IS NULL hoặc current UTC time < ends_at.
- image URL hợp lệ.
- position khớp vị trí frontend yêu cầu.

Start inclusive, end exclusive để hai lịch liên tiếp không overlap tại cùng timestamp.

### BANNER-PUB-001 — List Active Banners

**Query:** position bắt buộc; optional limit trong allowlist.

- Chỉ trả title, image URL, validated link URL, position và sort order.
- Sort sort_order rồi ID để ổn định.
- Không trả created_by hoặc lịch quản trị không cần thiết.
- position phải thuộc controlled vocabulary như HOME_HERO, HOME_MIDDLE, CATEGORY_TOP; không chấp nhận tùy ý nếu frontend không render.
- Cache theo position và time window; TTL không được vượt mốc starts_at/ends_at gần nhất.

**Errors:** 400 INVALID_BANNER_POSITION.

### BANNER-ADM-001 — List Banners

**Permission:** BANNER_MANAGE.

Filters title, position, status, scheduled state và date range. Trả trạng thái dẫn xuất: SCHEDULED, LIVE, EXPIRED, INACTIVE để UI hiểu mà không thay enum DB.

### BANNER-ADM-002 — Create Banner

**Input:** title, image_url, optional link_url, position, sort_order, optional starts_at/ends_at.

- Service luôn tạo status=INACTIVE dù DB default ACTIVE để tránh publish nhầm.
- Validate ends_at > starts_at khi cả hai có.
- sort_order không âm.
- Image URL phải HTTPS/trusted media domain theo policy.
- link_url chỉ cho internal path hoặc HTTPS domain allowlist; chặn javascript/data/open redirect.
- created_by lấy từ token.
- Ghi audit sau transaction.

**Errors:** 422 INVALID_BANNER_SCHEDULE, 422 INVALID_IMAGE_URL, 422 UNSAFE_LINK_URL, 422 INVALID_POSITION.

### BANNER-ADM-003 — Get Banner Detail

Trả toàn bộ cấu hình, creator summary, effective publication state và warning nếu media/link không còn hợp lệ.

### BANNER-ADM-004 — Patch Banner

**Allowlist:** title, image_url, link_url, position, sort_order, starts_at, ends_at.

- Không đổi status tại endpoint này.
- Revalidate toàn bộ schedule sau merge patch, không chỉ field vừa gửi.
- Nếu banner đang LIVE, thay image/link có hiệu lực ngay; cần audit và cache invalidation sau commit.
- Không nhận created_by/created_at/updated_at từ client.

### BANNER-ADM-005 — Change Banner Status

**Input:** ACTIVE hoặc INACTIVE.

- ACTIVE yêu cầu title/image/position/schedule hợp lệ.
- Banner có ends_at trong quá khứ không được activate; trả 422 BANNER_ALREADY_EXPIRED.
- INACTIVE không xóa lịch sử.
- Command idempotent; ghi actor và reason trong audit_logs.

### BANNER-ADM-006 — Replace Position Ordering

**Input:** ordered list toàn bộ banner IDs thuộc position.

1. Lock banner rows của position theo ID.
2. Verify mọi ID tồn tại và thuộc đúng position.
3. Reject duplicate/missing ID theo contract; P1 đề xuất list phải chứa toàn bộ banner thuộc position vì schema chưa có archive.
4. Gán sort_order tuần tự trong một transaction.
5. Invalidate public cache sau commit.

**Errors:** 409 ORDERING_SET_MISMATCH, 422 BANNER_POSITION_MISMATCH.

Không có DELETE P1 vì schema thiếu deleted_at và banner có thể cần audit/history. Dùng INACTIVE; nếu muốn xóa lâu dài phải thêm archive/retention policy.

---

## 14. Audit Log Query P1 APIs

### 14.1 Endpoint inventory

| ID | Method | Endpoint | Permission | Success | Chức năng |
|---|---|---|---|---|---|
| AUDIT-001 | GET | /admin/audit-logs | AUDIT_LOG_VIEW | 200 | Tìm kiếm audit log |
| AUDIT-002 | GET | /admin/audit-logs/{auditLogId} | AUDIT_LOG_VIEW | 200 | Chi tiết audit event |

### 14.2 Audit safety rules

**Tables:** audit_logs, users.

- P1 chỉ có API đọc; không có API tạo/sửa/xóa audit log.
- Audit event được tạo nội bộ bởi P0/P1 commands.
- actor_user_id NULL có thể là system hoặc guest theo schema hiện tại; API không tự đoán actor.
- old_data/new_data phải được redact khi ghi và kiểm tra lại khi đọc.
- Không trả password/token hash, payment secret, full provider payload hoặc PII không cần thiết.
- Audit query là permission nhạy cảm; cần MFA/step-up theo policy.

### AUDIT-001 — Search Audit Logs

**Permission:** AUDIT_LOG_VIEW.

**Filters:** actor ID, action_code, entity_type, entity_id, result, correlation_id, IP đã exact/masked policy, created range.

**Rules:**

- Bắt buộc time range với max window, đề xuất 31 hoặc 90 ngày trên primary database.
- Sort newest mặc định; allow created_at + ID.
- Pagination ưu tiên cursor cho bảng lớn.
- List projection không trả toàn bộ old_data/new_data; chỉ summary và cờ có diff.
- Organizational/data scope vẫn áp dụng nếu audit chứa entity nhạy cảm.
- Query correlation_id exact để điều tra một request end-to-end.

**Errors:** 400 INVALID_AUDIT_FILTER, 422 DATE_RANGE_TOO_LARGE.

### AUDIT-002 — Get Audit Log Detail

**Permission:** AUDIT_LOG_VIEW.

Trả action/entity/result, actor summary, correlation/IP/user-agent đã mask, created_at và sanitized diff.

Nếu JSON có field thuộc denylist thì field phải bị redact dù dữ liệu legacy đã ghi sai. API không trả SQL, stack trace hoặc secret.

---

## 15. Reporting P1 APIs

### 15.1 Endpoint inventory

| ID | Method | Endpoint | Permission | Success | Chức năng |
|---|---|---|---|---|---|
| REPORT-SALES-001 | GET | /admin/reports/sales/summary | REPORT_VIEW_SALES | 200 | KPI sales/cash/refund |
| REPORT-SALES-002 | GET | /admin/reports/sales/timeseries | REPORT_VIEW_SALES | 200 | Chuỗi thời gian sales |
| REPORT-SALES-003 | GET | /admin/reports/sales/products | REPORT_VIEW_SALES | 200 | Hiệu suất product/variant |
| REPORT-ORDER-001 | GET | /admin/reports/orders/statuses | REPORT_VIEW_SALES | 200 | Phân bố và transition đơn |
| REPORT-PAY-001 | GET | /admin/reports/payments/reconciliation | REPORT_VIEW_SALES + PAYMENT_VIEW | 200 | Đối soát payment aggregate |
| REPORT-INV-001 | GET | /admin/reports/inventory/summary | REPORT_VIEW_INVENTORY | 200 | Tổng quan số lượng tồn |
| REPORT-INV-002 | GET | /admin/reports/inventory/low-stock | REPORT_VIEW_INVENTORY | 200 | SKU chạm reorder level |
| REPORT-INV-003 | GET | /admin/reports/inventory/movements | REPORT_VIEW_INVENTORY | 200 | Tổng hợp biến động kho |
| REPORT-INV-004 | GET | /admin/reports/inventory/serialized-status | REPORT_VIEW_INVENTORY | 200 | Trạng thái serialized units |
| REPORT-PROC-001 | GET | /admin/reports/procurement/suppliers | REPORT_VIEW_INVENTORY | 200 | Hiệu suất nhà cung cấp |
| REPORT-AFTER-001 | GET | /admin/reports/after-sales/returns | REPORT_VIEW_SALES | 200 | Return/refund aggregate |
| REPORT-AFTER-002 | GET | /admin/reports/after-sales/warranties | WARRANTY_MANAGE | 200 | Warranty/claim aggregate |

### 15.2 Common report contract

**Shared query fields:** from, to, timezone, optional bucket, currency, warehouse/category/brand/product filters tùy report.

**Rules:**

1. from/to bắt buộc cho time-series và bounded live queries.
2. Validate IANA timezone; convert boundary về UTC trước query.
3. Bucket day/week/month phải thống nhất locale, week-start và DST policy.
4. Không cộng nhiều currency thành một số nếu chưa có exchange-rate snapshot. Trả group theo currency hoặc bắt currency filter.
5. Report list/aggregate dùng read replica hoặc analytics store khi tải lớn; không làm chậm checkout/payment.
6. Không dùng float cho money.
7. Response luôn trả metric_definition để BA/QA hiểu số đang đo theo created_at, completed_at hay paid_at.
8. Không hỗ trợ unbounded export trong P1.

### 15.3 Sales metric definitions

Không dùng một field revenue mơ hồ. P1 tách:

- booked_order_value: tổng orders.grand_total_amount của đơn tạo trong kỳ, loại CANCELLED theo rule đã công bố.
- completed_order_value: tổng giá trị đơn đạt COMPLETED trong kỳ theo completed_at.
- collected_cash: tổng payment_attempts SUCCESS theo completed_at; zero-value order được xử lý riêng.
- refunded_cash: tổng refunds SUCCESS theo completed_at.
- net_cash: collected_cash trừ refunded_cash trong cùng currency.
- outstanding_amount: max(payments.expected_amount - payments.paid_amount, 0) tại thời điểm report.

Các chỉ số dùng thời điểm khác nhau không được ghép thành cùng funnel mà không ghi rõ cohort.

### REPORT-SALES-001 — Sales Summary

**Tables:** orders, payments, payment_attempts, refunds, return_requests.

**Output:** order counts by lifecycle, booked/completed value, collected/refunded/net cash, average order value, cancellation rate, refund rate; group theo currency.

**Rules:**

- Average order value phải chỉ rõ mẫu số là non-cancelled hay completed orders.
- Return/refund không được suy ra chỉ từ order status; đọc return/refund aggregates.
- Payment FAILED/PENDING không tính collected cash.
- Refund PENDING/PROCESSING không tính refunded cash.

### REPORT-SALES-002 — Sales Time Series

**Query:** metric trong allowlist, bucket day/week/month, from/to/timezone, optional channel/currency.

Trả mọi bucket kể cả zero để frontend không tự lấp sai. Metric time source:

- booked value dùng orders.created_at.
- completed value dùng orders.completed_at.
- collected cash dùng payment_attempts.completed_at.
- refunded cash dùng refunds.completed_at.

Giới hạn số bucket, ví dụ tối đa 400.

### REPORT-SALES-003 — Product and Variant Performance

**Tables:** order_items, orders, products, product_variants, return_request_items, return_requests.

**Output:** sold quantity, gross line value, order count, returned quantity, approved/completed return amount, net quantity; group product/variant/category/brand.

**Rules:**

- Dùng immutable order item snapshots cho name/SKU/price tại thời điểm bán; join catalog hiện tại chỉ để filter/metadata.
- Không dùng products.sold_count làm source duy nhất cho report theo kỳ vì đây là counter tổng.
- Không gọi net margin/profit vì thiếu cost snapshot.
- Return amount chỉ trừ khi đạt state được policy công nhận, đề xuất COMPLETED.

### REPORT-ORDER-001 — Order Status and Transition Report

**Tables:** orders, order_status_histories.

Trả hai nhóm riêng:

- Current snapshot: số đơn hiện đang ở từng status.
- Transition events trong kỳ: số lần vào từng status, cancellation reason code và thời gian từ PENDING đến CONFIRMED/COMPLETED khi đủ dữ liệu.

Không cộng current snapshot và transition count thành cùng metric. Với order chưa complete, cycle time được đánh dấu censored/in-progress.

### REPORT-PAY-001 — Payment Reconciliation

**Tables:** payments, payment_attempts, refunds, orders.  
**Permissions:** phải có cả REPORT_VIEW_SALES và PAYMENT_VIEW.

Đối chiếu theo payment:

- payments.paid_amount với tổng SUCCESS attempts hợp lệ.
- payments.refunded_amount với tổng SUCCESS refunds.
- payments.status với amounts dẫn xuất.
- expected_amount với order grand total.

**Output:** match/mismatch counts, amount variance và danh sách mismatch phân trang. Không trả raw provider response/secrets.

Đây là report phát hiện sai lệch, không có quyền tự sửa aggregate. Sửa dữ liệu cần controlled reconciliation command riêng ngoài P1.

### REPORT-INV-001 — Inventory Quantity Summary

**Tables:** warehouse_inventories, warehouses, product_variants, products, categories, brands.

**Output:** on-hand, reserved, available, SKU count và warehouse/product grouping.

- Verify invariant reserved <= on_hand.
- Chỉ số sellable có thể lọc warehouse/product/variant ACTIVE nhưng phải trả rõ filter.
- Không gọi đây là inventory valuation; schema chưa hỗ trợ giá vốn/layer.
- Không cộng serialized unit count thay thế balance; dùng reconciliation riêng để so.

### REPORT-INV-002 — Low Stock Report

**Tables:** warehouse_inventories, warehouses, product_variants, products.

Một row low-stock khi available_quantity <= reorder_level cho warehouse/variant nằm trong scope.

**Output:** available, reserved, reorder level, shortage gap, recent movement summary và open PO quantity nếu join procurement.

P1 không tự tạo PO. SKU reorder_level=0 phải được business quyết định có coi zero stock là cảnh báo hay không.

### REPORT-INV-003 — Inventory Movement Report

**Tables:** stock_transactions, warehouses, product_variants, products.

Group theo transaction type, warehouse, product/variant và time bucket.

Ledger quantity là unsigned nên report phải áp direction mapping:

- Inbound: IMPORT, RETURN_IN, ADJUST_IN, TRANSFER_IN, WARRANTY_IN.
- Outbound: SALE, RETURN_OUT, ADJUST_OUT, TRANSFER_OUT, WARRANTY_OUT.
- RESERVE/RELEASE/CANCEL_ORDER thay đổi reserved theo before/after; không tự coi là on-hand sale.

Luôn đối chiếu signed net movement với before/after semantics; không chỉ SUM quantity mù quáng.

### REPORT-INV-004 — Serialized Unit Status Report

**Tables:** inventory_units, inventory_unit_identifiers, product_variants, warehouses.

**Output:** count theo AVAILABLE/RESERVED/SOLD/RETURNED/DEFECTIVE/IN_WARRANTY/VOID, warehouse và variant.

**Anomaly flags:**

- Serialized unit thiếu SERIAL/IMEI identifier theo policy.
- Unit RESERVED nhưng current_reservation_id NULL.
- Unit SOLD nhưng sold_order_item_id NULL.
- AVAILABLE unit thuộc warehouse inactive.

Report chỉ phát hiện; không tự sửa unit.

### REPORT-PROC-001 — Supplier Procurement Performance

**Tables:** suppliers, purchase_orders, purchase_order_items.

**Output:** PO count/value, ordered/received quantity, completion rate, cancellation rate, average lead time và on-time completion theo supplier.

- On-time chỉ tính PO COMPLETED có expected_at và received_at.
- received_at hiện là timestamp cấp PO, không có từng receipt; report không giả độ chính xác theo lô nhận.
- Cost/value là dữ liệu nhạy cảm; REPORT_VIEW_INVENTORY phải được organizational scope kiểm soát.
- Supplier inactive vẫn xuất hiện trong lịch sử.

### REPORT-AFTER-001 — Return and Refund Report

**Tables:** return_requests, return_request_items, return_item_units, refunds, payments, orders.

**Output:** request count theo type/status, returned quantity, condition/resolution distribution, requested/approved return amount, successful refund amount và cycle time.

- Không group reason text tự do thành category giả; schema cần reason_code nếu business muốn Pareto reason.
- Return COMPLETED không đồng nghĩa refund SUCCESS nếu workflow/policy khác; hiển thị hai trạng thái riêng.
- Refund amount group theo currency của payment/order.

### REPORT-AFTER-002 — Warranty and Claim Report

**Tables:** warranties, warranty_claims, products, product_variants, inventory_units.

**Output:** active/expired/void warranty count, claim count theo status/product/variant, open claims, completion cycle time và rejection rate.

- resolution là free text nên không aggregate thành loại resolution đáng tin cậy.
- Claim đang mở không có completed_at; không đưa vào average completion time.
- Không expose owner contact hoặc IMEI đầy đủ trong aggregate report.

---

## 16. Cross-Cutting P1 Requirements

### 16.1 Audit matrix

| Command | Audit bắt buộc |
|---|---|
| Đổi mật khẩu/revoke session | Actor, session family opaque reference, result; không ghi credential |
| Replace related products | Product nguồn, before/after target set |
| Edit/moderate review | Content diff đã redact, old/new status, moderator |
| Retry delivery | Delivery ID, old/new status, attempt policy |
| Banner create/update/status/order | Before/after schedule/content/order |
| Wishlist/compare | Có thể audit ở mức security/analytics policy; không bắt buộc full diff |

Public GET và report GET không tạo audit row cho mỗi request nếu gây tải lớn, nhưng access vào AUDIT_LOG_VIEW/PAYMENT_VIEW có thể cần security access log riêng.

### 16.2 Cache invalidation

- Related-product replace: invalidate source product detail/related cache.
- Review approve/reject/edit approved: invalidate review list/summary.
- Banner update/status/order: invalidate theo position.
- Product/variant publication/price từ P0: invalidate wishlist, compare, trending và report read model liên quan.
- Notification read state: invalidate unread-count của đúng user.

Cache không được trở thành source of truth. Invalidation chỉ chạy sau transaction commit.

### 16.3 Concurrency

- Compare limit: lock customer row trước count + insert.
- Review moderation: update có expected status PENDING.
- Notification retry: update có expected status FAILED.
- Banner ordering: lock set theo position và update toàn bộ atomically.
- Session revoke: update mọi token trong family bằng user ownership condition.
- Report chạy snapshot/read-consistent policy phù hợp; không lock bảng giao dịch lâu.

### 16.4 Privacy and security

- Rate-limit search suggestions, comparison preview và review creation.
- Output-encode review/banner content.
- Validate banner action URL chống open redirect.
- Mask notification destination, actor contacts, IP, user-agent và serial/IMEI.
- AUDIT_LOG_VIEW, PAYMENT_VIEW và report dữ liệu nhạy cảm có thể yêu cầu step-up/MFA.
- Không cho mass assignment vào moderation, banner creator, notification owner hoặc audit fields.
- Không đưa raw SQL/filter expression từ client vào report engine.

### 16.5 Observability

Mọi endpoint phải có:

- Correlation ID xuyên suốt controller/service/job.
- Latency, error rate và query count metrics.
- Cache hit/miss cho discovery/banner/review summary.
- Queue lag/retry metrics cho notification delivery.
- Report duration, scanned rows và timeout metrics.
- Security event cho failed ownership/permission checks nhưng không log secret.

---

## 17. Schema Gaps Before P1 Production

Các mục dưới đây phải được chốt bằng migration hoặc policy rõ ràng. Không âm thầm giả định database đã hỗ trợ.

| # | Gap | Endpoint bị ảnh hưởng | Đề xuất |
|---:|---|---|---|
| 1 | Token family chưa có session metadata riêng | SEC-002/003/004 | Thêm sessions/token_families table hoặc quy ước aggregate family ổn định |
| 2 | Không có password history, password_changed_at hoặc credential version | SEC-001 | Thêm credential metadata nếu cần chống reuse/revoke access token tức thời |
| 3 | Không có MFA/step-up challenge | SEC, AUDIT, report nhạy cảm | Bổ sung MFA challenge/device model trước khi yêu cầu assurance cao |
| 4 | Wishlist/compare chỉ hỗ trợ customer | WISH, COMPARE | Muốn guest persistence phải thêm guest token owner an toàn hoặc lưu client-side |
| 5 | Compare không có max constraint và sort_order | COMPARE-002/003 | Enforce max bằng lock; thêm sort_order/version nếu cần reorder |
| 6 | Related products không có created_by/version | RELATED-ADM-002 | Dùng audit_logs; thêm version nếu có concurrent editors |
| 7 | Review không có WITHDRAWN/deleted_at | REVIEW customer lifecycle | P1 không có delete; thêm state/soft-delete trước khi cho customer rút review |
| 8 | Không có review moderation history | REVIEW-ADM | Dùng audit tạm thời hoặc thêm review_status_histories |
| 9 | Không có rating aggregate/read model | REVIEW-PUB-002 | Query APPROVED có index khi nhỏ; thêm product_rating_summaries khi tải lớn |
| 10 | Thiếu NOTIFICATION_VIEW và NOTIFICATION_RETRY | NOTIF-ADM | Seed permission mới và map role tối thiểu |
| 11 | Delivery không có PROCESSING, next_attempt_at, provider_message_id | NOTIF-ADM-003/job | Bổ sung delivery lifecycle để chống worker/retry race và đối soát |
| 12 | Không có notification preferences/push devices | Notification P2 | Chưa mở API preference/device |
| 13 | Banner không có version, deleted_at/archive | BANNER-ADM | Dùng status + audit; thêm optimistic version/archive nếu nhiều editor/retention |
| 14 | Audit không phân biệt SYSTEM/GUEST rõ và không có DB immutability guard | AUDIT | Thêm actor_type/guest hash; giới hạn quyền ghi và retention/partition policy |
| 15 | Không có analytics warehouse/materialized aggregate | REPORT | Bắt đầu bounded query; chuyển read replica/warehouse khi volume tăng |
| 16 | Không có exchange-rate snapshot | REPORT-SALES/PAY/AFTER | Group theo currency; không quy đổi tùy tiện |
| 17 | Thiếu cost snapshot/cost layer | Product performance/inventory | Không phát hành profit/margin/valuation report |
| 18 | Return reason và warranty resolution là free text | REPORT-AFTER | Thêm controlled reason/resolution code để phân tích Pareto |
| 19 | Coupon không có public visibility | Promotion discovery | Không mở public coupon-list endpoint |
| 20 | Search không có query log/alias/synonym model | DISC-002 | P1 chỉ gợi ý catalog master data; hành vi tìm kiếm để P2 |
| 21 | Không có report export job/artifact | Reporting export | P1 chỉ synchronous bounded response; thêm job/file retention trước export |
| 22 | Reorder không có idempotency record | ORDER-P1-001 | Giữ merge=max để retry không cộng lặp; nếu đổi sang increment phải thêm durable key |

---

## 18. P1 Requirement-to-Endpoint Traceability

| Business requirement | Endpoint | Data source |
|---|---|---|
| Customer tự bảo vệ tài khoản | SEC-001..004 | users, refresh_tokens |
| Xem sản phẩm thịnh hành/gợi ý | DISC-001/002 | products, brands, categories, variants |
| Cấu hình sản phẩm liên quan | RELATED endpoints | related_products, products |
| Tra lịch sử giá | PRICE-P1-001 | product_price_histories |
| Lưu sản phẩm yêu thích | WISH-001..004 | wishlists |
| So sánh tối đa bốn sản phẩm | COMPARE-001..005 | compare_items, catalog/specs |
| Chỉ người đã mua được review | REVIEW-001/002 | orders, order_items, reviews |
| Public chỉ thấy review đã duyệt | REVIEW-PUB-001/002 | reviews APPROVED |
| Moderation có state guard | REVIEW-ADM-001..004 | reviews, audit_logs |
| Mua lại từ đơn cũ | ORDER-P1-001 | orders/items, carts/items |
| Notification center | NOTIF-001..005 | notifications |
| Theo dõi/retry delivery lỗi | NOTIF-ADM-001..003 | notification_deliveries |
| Banner có lịch và vị trí | BANNER endpoints | banners |
| Điều tra thao tác nhạy cảm | AUDIT-001/002 | audit_logs |
| Báo cáo không nhập nhằng doanh thu | REPORT-SALES/PAY | orders, attempts, refunds, payments |
| Cảnh báo tồn và kiểm tra unit | REPORT-INV | balances, ledger, units |
| Đánh giá supplier | REPORT-PROC-001 | suppliers, purchase orders/items |
| Theo dõi return/warranty | REPORT-AFTER | returns, refunds, warranties, claims |

---

## 19. Recommended P1 Implementation Order

1. **Schema/permission decisions:** NOTIFICATION permissions, review lifecycle, session representation và report definitions.
2. **Account security:** password change, session list/revoke.
3. **Customer collections:** wishlist và compare với concurrency tests.
4. **Verified review:** eligibility, customer CRUD giới hạn và moderation.
5. **Catalog enrichment:** related products, price history, trending và search suggestions.
6. **Order convenience:** reorder dùng lại cart domain service P0.
7. **Notification center:** user read state trước, delivery operations sau.
8. **Banner CMS:** schedule, safe URL và cache invalidation.
9. **Audit query:** redaction, access scope và bounded filters.
10. **Reporting:** metric dictionary trước endpoint; sales/payment reconciliation trước dashboard mở rộng.
11. **Hardening:** load test, cache, read replica, race tests, security review và observability.

Không bắt đầu dashboard UI trước khi BA, Backend và QA ký cùng metric definitions.

---

## 20. Definition of Done for Every P1 Endpoint

Một endpoint P1 chỉ được coi là Done khi:

- Không trùng cặp method + path với P0 hoặc P1 endpoint khác.
- Actor, ownership, permission và organizational scope đã chốt.
- Request fields, query filters, sort và patch allowlist được ghi trong OpenAPI.
- Business validation có unit test và negative test.
- State conflict/concurrency có integration test khi áp dụng.
- Response không lộ PII, secret, raw provider payload hoặc internal inventory identifiers.
- Status/error code ổn định và frontend/QA sử dụng được.
- Audit/cache/notification side effects xảy ra đúng sau commit.
- Query có index/EXPLAIN trên dữ liệu gần production.
- Report có metric definition, time source, timezone và currency semantics.
- Endpoint public có rate limit và cache policy phù hợp.
- Không dùng P1 để sửa trực tiếp immutable history/financial/inventory data.

### 20.1 Test cases bắt buộc theo domain

| Domain | Test trọng yếu |
|---|---|
| Session | Revoke family khác/current, token reuse và ownership |
| Compare | Hai request đồng thời không vượt max=4 |
| Review | Order item giả, product mismatch, duplicate, approve/reject race |
| Reorder | Retry không cộng quantity hai lần; inactive item trả warning |
| Notification | Read ownership; retry worker race; max attempts |
| Banner | Boundary starts/ends; unsafe URL; ordering rollback |
| Audit | Redaction legacy JSON; permission negative test |
| Report | Timezone boundary, multi-currency, refund/payment reconciliation |

---

## 21. Final Architectural Position

P1 không phải danh sách CRUD còn sót lại. Mỗi nhóm có ranh giới nghiệp vụ riêng:

- Wishlist/compare là relationship, không giữ giá hoặc tồn.
- Review bắt buộc chứng minh mua hàng và qua moderation.
- Related products là cấu hình có hướng.
- Reorder chỉ tái tạo cart, không tái sử dụng giá/coupon/payment cũ.
- Notification read state tách khỏi delivery state.
- Banner publication được dẫn xuất từ status + time window.
- Audit chỉ đọc, không có CRUD mutation.
- Reporting định nghĩa rõ source/time/currency và không tự nhận là profit khi thiếu cost.

Đây là lớp P1 hợp lý sau P0: tăng trải nghiệm và khả năng quản trị nhưng không phá transaction boundary, source of truth hoặc state machine đã được chốt ở P0.
