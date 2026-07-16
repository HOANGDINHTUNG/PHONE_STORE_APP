# PHONE STORE P2 API ENDPOINT SPECIFICATION

**Project:** Phone Store E-Commerce & Management Platform  
**API style:** REST-oriented HTTP API  
**Base path:** /api/v1  
**Database source:** PhoneStore_Enterprise_Schema.sql  
**P0 baseline:** PhoneStore_P0_API_Endpoint_Specification.md  
**P1 baseline:** PhoneStore_P1_API_Endpoint_Specification.md  
**Document version:** 1.0  
**Scope:** P2 — tính năng nâng cao, tối ưu tăng trưởng và vận hành sau khi P0/P1 ổn định

---

## Document Map

1. Mục đích, định nghĩa và migration gate của P2.
2. Quy tắc kế thừa và chống trùng P0/P1.
3. Email change, MFA và privacy self-service.
4. Multi-wishlist, sharing, product alerts và guest reorder.
5. Recently viewed, saved search và personalization.
6. Review media, helpful vote, report, reply và withdrawal.
7. Public promotion discovery.
8. Notification preferences, push devices và campaigns.
9. Stock transfer và supplier return.
10. Catalog/report asynchronous jobs.
11. Tax và invoice.
12. Schema blueprint, security, testing, rollout và Definition of Done.

---

## 1. Mục đích tài liệu

Tài liệu này định nghĩa lớp P2 sau 164 endpoint P0 và 60 endpoint P1.

P2 tập trung vào:

- Bảo mật tài khoản nâng cao và quyền riêng tư dữ liệu.
- Trải nghiệm giữ chân khách hàng, cá nhân hóa và tương tác cộng đồng.
- Marketing/notification có kiểm soát consent.
- Luân chuyển kho và hoàn trả nhà cung cấp.
- Bulk import/export và report export bất đồng bộ.
- Hóa đơn, thuế và chứng từ.

P2 không được dùng để che lấp lỗi P0/P1. Nếu checkout, payment, inventory, shipment hoặc RBAC chưa ổn định thì không ưu tiên P2.

Tài liệu không chứa code triển khai. Mỗi endpoint được mô tả như contract nghiệp vụ và phải có migration trước khi code nếu current schema chưa đủ.

---

## 2. P2 Definition and Delivery Gates

### 2.1 Định nghĩa P2

P2 là tính năng:

- Không cần để hoàn thành luồng mua hàng cốt lõi.
- Không cần để vận hành P1 tối thiểu.
- Có giá trị khi số user, order, warehouse hoặc marketing operation tăng.
- Thường cần schema mới, job system, object storage hoặc integration ngoài.

### 2.2 Phân loại khả năng triển khai

| Gate | Ý nghĩa | Endpoint tiêu biểu |
|---|---|---|
| CURRENT-SCHEMA | Có thể dùng bảng hiện tại và rule P0/P1 | WISH-P2-001, ORDER-P2-001 |
| MIGRATION-REQUIRED | Phải thêm bảng/cột/index/permission | Phần lớn endpoint P2 |
| INFRA-REQUIRED | Cần object storage, queue, signed URL, scheduler hoặc analytics worker | Media, export, campaign, privacy export |
| LEGAL-REQUIRED | Cần chính sách/pháp lý/kế toán được duyệt | Privacy deletion, tax, invoice |

Endpoint có gate chưa đạt không được expose dưới dạng mock production.

### 2.3 Ngoài phạm vi P2

Các initiative sau để P3/future discovery:

- Marketplace đa nhà bán hàng.
- Subscription commerce, BNPL/credit scoring và recurring billing.
- Fraud engine real-time và chargeback management.
- Omnichannel POS/offline store synchronization.
- International customs và cross-border tax.
- AI chatbot tự quyết định refund/warranty.
- Tách microservice chỉ để “trông enterprise” khi chưa có nhu cầu tải/đội ngũ.

---

## 3. Shared API Rules

### 3.1 Kế thừa P0/P1

P2 kế thừa:

- Base path /api/v1.
- Error envelope, correlation ID, pagination và status-code semantics.
- Authentication, ownership, RBAC default-deny và organizational scope.
- Idempotency cho command có retry.
- Audit, outbox-after-commit và không gọi external provider trong DB transaction.
- UTC storage, money dùng decimal, không dùng float.
- Allowlist filter/sort/patch.
- PII/secret redaction.

### 3.2 Không trùng P0/P1

P2 chỉ được coi là hợp lệ khi không trùng cặp HTTP method + normalized route với:

- 164 endpoint P0.
- 60 endpoint P1.
- Endpoint khác trong P2.

Một endpoint mở rộng cùng domain phải dùng resource/command mới, không đổi nghĩa route cũ.

### 3.3 Tổng phạm vi

Tài liệu gồm **102 endpoint P2**:

- GET: 35.
- POST: 46.
- PATCH: 5.
- PUT: 4.
- DELETE: 12.

| Domain | Group | Endpoint |
|---|---|---:|
| Email/MFA/Privacy | EMAIL, MFA, PRIV | 14 |
| Advanced shopping | COLL, ALERT, WISH-P2, ORDER-P2 | 15 |
| Personalization | RECENT, SEARCH-P2, RECO | 9 |
| Review extensions | REVIEW-P2 | 10 |
| Public promotions | PROMO-P2 | 2 |
| Notification/marketing | PREF, DEVICE, CAMPAIGN | 12 |
| Inventory/procurement | TRANSFER, VRETURN | 19 |
| Async jobs | CIMPORT, CEXPORT, REXPORT | 11 |
| Tax/invoice | TAX, INVOICE | 10 |

---

## 4. Email Change, MFA and Privacy P2 APIs

### 4.1 Endpoint inventory

| ID | Method | Endpoint | Actor | Success | Gate |
|---|---|---|---|---|---|
| EMAIL-001 | POST | /me/email-change-requests | Authenticated + step-up | 202 | MIGRATION |
| EMAIL-002 | POST | /me/email-changes/confirm | Authenticated/token | 204 | MIGRATION |
| MFA-001 | GET | /me/mfa | Authenticated | 200 | MIGRATION |
| MFA-002 | POST | /me/mfa/totp-enrollments | Authenticated + recent auth | 201 | MIGRATION |
| MFA-003 | POST | /me/mfa/totp-enrollments/confirm | Authenticated | 200 | MIGRATION |
| MFA-004 | POST | /auth/mfa/challenges/{challengeId}/verify | Challenge holder | 200 | MIGRATION |
| MFA-005 | POST | /me/mfa/disable | Authenticated + step-up | 204 | MIGRATION |
| PRIV-001 | POST | /me/data-export-requests | Authenticated + step-up | 202 | MIGRATION/INFRA |
| PRIV-002 | GET | /me/data-export-requests | Authenticated | 200 | MIGRATION |
| PRIV-003 | GET | /me/data-export-requests/{requestId} | Owner | 200 | MIGRATION |
| PRIV-004 | GET | /me/data-export-requests/{requestId}/download | Owner + step-up | 200/302 | INFRA |
| PRIV-005 | POST | /me/account-deletion-requests | Authenticated + step-up | 202 | MIGRATION/LEGAL |
| PRIV-006 | DELETE | /me/account-deletion-request | Owner | 204 | MIGRATION/LEGAL |
| PRIV-007 | GET | /me/account-deletion-request | Owner | 200 | MIGRATION/LEGAL |

### 4.2 Required schema

- pending_email_changes hoặc generalized identity_change_tokens.
- mfa_methods, mfa_challenges, mfa_recovery_codes.
- privacy_requests, privacy_artifacts và retention metadata.
- Credential/session version để revoke access token nhanh.

Không dùng email_verification_tokens hiện tại cho email change vì token không bind pending email/purpose.

### EMAIL-001 — Request Email Change

**Input:** new_email, current_password hoặc step-up proof.

1. Normalize email và kiểm tra unique với users.normalized_email.
2. Không update users.email ngay.
3. Tạo pending change chứa old/new email snapshot, token hash, purpose, expires_at và requested actor/IP.
4. Revoke pending request cũ của cùng user trong transaction.
5. Gửi confirm link đến new email; tùy policy gửi security alert đến old email sau commit.
6. Luôn redact email trong logs.

**Errors:** 409 EMAIL_ALREADY_EXISTS, 422 EMAIL_UNCHANGED, 401 STEP_UP_REQUIRED, 429 EMAIL_CHANGE_RATE_LIMITED.

### EMAIL-002 — Confirm Email Change

**Input:** raw confirmation token.

- Hash/lock token, verify purpose, user, pending email, expiry, used/revoked state.
- Lock user và recheck new email unique.
- Update email + normalized_email, set email_verified_at=now, consume token.
- Revoke sessions hoặc increment credential version theo policy.
- Audit old/new email dạng mask và gửi alert đến cả hai địa chỉ sau commit.

Replay token đã dùng trả 409; token hết hạn trả 410.

### MFA-001 — Get MFA Status

Trả enabled methods, verified_at, recovery-code remaining count và required-by-policy flag. Không trả TOTP secret, recovery-code hash hoặc trusted-device secret.

### MFA-002 — Start TOTP Enrollment

**Input:** recent-auth proof.

- Tạo secret entropy cao; mã hóa at rest, không hash vì cần verify TOTP.
- Trả otpauth URI/QR payload một lần.
- Enrollment ở PENDING, expiry ngắn; chưa bật MFA.
- Không cho nhiều pending enrollment active cùng lúc.

### MFA-003 — Confirm TOTP Enrollment

**Input:** enrollment_id, TOTP code.

- Lock enrollment; verify code với clock-window nhỏ và replay protection.
- Chuyển method ACTIVE.
- Generate recovery codes; raw codes chỉ trả một lần, DB lưu hash.
- Revoke/challenge lại các session nhạy cảm theo security policy.
- Ghi audit và security notification.

### MFA-004 — Verify MFA Challenge

**Input:** TOTP hoặc recovery code.

- Challenge bind user, login attempt, audience, IP/device risk và expiry.
- Một challenge chỉ thành công một lần.
- Recovery code dùng xong phải consume atomically.
- Thành công mới cấp/hoàn tất access + refresh token flow P0.
- Rate-limit và lockout độc lập với password.

### MFA-005 — Disable MFA

Yêu cầu recent password + MFA/recovery proof. Không cho disable nếu organization policy bắt buộc. Revoke method/recovery codes, sessions rủi ro và gửi security alert.

### PRIV-001 — Request Personal Data Export

**Input:** requested scope trong allowlist.

- Chỉ một request PENDING/PROCESSING mỗi user.
- Snapshot request identity/time/legal basis.
- Queue job sau commit; không build ZIP trong HTTP transaction.
- Artifact phải mã hóa, có expiry và checksum.
- Export không chứa password/token hashes, internal fraud/security secrets hoặc dữ liệu user khác.

### PRIV-002 — List My Data Export Requests

Trả status PENDING/PROCESSING/COMPLETED/FAILED/EXPIRED, requested time, expiry và safe error. Không trả storage path/raw key.

### PRIV-003 — Get Data Export Request

Owner only. Trả progress, scope, completion/expiry, artifact availability và checksum metadata.

### PRIV-004 — Download Personal Data Export

- Owner + step-up.
- Artifact phải COMPLETED, chưa expired và chưa revoked.
- Trả one-time/short-lived signed URL hoặc stream; không expose permanent bucket URL.
- Audit download; rate-limit.
- 410 khi artifact expired.

### PRIV-005 — Request Account Deletion

**Input:** reason, explicit confirmation, step-up proof.

**Guards:**

- Không xóa ngay khi còn dispute, refund, warranty, legal hold hoặc accounting retention.
- Tạo request với cooling-off period.
- Revoke marketing consent ngay; account vẫn có thể login để cancel trong thời gian cho phép theo policy.
- Sau deadline, job anonymize/delete theo data classification; không phá order/payment/invoice integrity.

### PRIV-006 — Cancel Account Deletion Request

Chỉ request PENDING trong cooling-off period. Transition CANCELLED, giữ audit. Nếu anonymization đã bắt đầu thì trả 409 DELETION_ALREADY_PROCESSING.

### PRIV-007 — Get Account Deletion Request

Trả request hiện hành, status PENDING/PROCESSING/COMPLETED/CANCELLED/REJECTED, cooling-off deadline, legal-hold flag dạng an toàn và hành động còn được phép. Không trả internal legal note hoặc data-classification details có thể làm lộ security controls.

---

## 5. Advanced Wishlist, Alerts and Guest Reorder

### 5.1 Endpoint inventory

| ID | Method | Endpoint | Actor | Success | Gate |
|---|---|---|---|---|---|
| COLL-001 | GET | /me/wishlists | Customer | 200 | MIGRATION |
| COLL-002 | POST | /me/wishlists | Customer | 201 | MIGRATION |
| COLL-003 | GET | /me/wishlists/{wishlistId} | Owner | 200 | MIGRATION |
| COLL-004 | PATCH | /me/wishlists/{wishlistId} | Owner | 200 | MIGRATION |
| COLL-005 | DELETE | /me/wishlists/{wishlistId} | Owner | 204 | MIGRATION |
| COLL-006 | POST | /me/wishlists/{wishlistId}/items | Owner | 201/200 | MIGRATION |
| COLL-007 | DELETE | /me/wishlists/{wishlistId}/items/{productId} | Owner | 204 | MIGRATION |
| COLL-008 | POST | /me/wishlists/{wishlistId}/share-links | Owner | 201 | MIGRATION |
| COLL-009 | DELETE | /me/wishlists/{wishlistId}/share-links/{shareLinkId} | Owner | 204 | MIGRATION |
| COLL-PUB-001 | GET | /shared-wishlists/{shareToken} | Public token | 200 | MIGRATION |
| ALERT-001 | GET | /me/product-alerts | Customer | 200 | MIGRATION |
| ALERT-002 | POST | /me/product-alerts | Customer | 201/200 | MIGRATION |
| ALERT-003 | DELETE | /me/product-alerts/{alertId} | Owner | 204 | MIGRATION |
| WISH-P2-001 | POST | /me/wishlist-items/{productId}/cart-transfer | Customer | 200 | CURRENT-SCHEMA |
| ORDER-P2-001 | POST | /guest-orders/{orderCode}/reorder | Signed guest order + guest cart token | 200 | CURRENT-SCHEMA |

### 5.2 Required schema

- wishlist_collections.
- wishlist_collection_items.
- wishlist_share_links với token hash, expiry, revoked_at.
- product_alerts với alert_type, threshold, last_trigger state.

Current wishlists table là relationship phẳng; migration phải chuyển dữ liệu vào default collection trước khi bỏ/đổi table cũ.

Hai route WISH-001..004 của P1 phải tiếp tục hoạt động bằng cách ánh xạ vào default collection. Không phá frontend P1 ngay khi bật multi-wishlist.

### COLL-001 — List My Wishlist Collections

Trả name, visibility, item_count, updated_at và default flag. Không trả full items để tránh N+1.

### COLL-002 — Create Wishlist Collection

**Input:** name, optional description, visibility PRIVATE/SHARED.

- Normalize name, giới hạn số collection/user.
- PRIVATE mặc định.
- Không nhận owner ID.
- Một default collection được tạo/migrate theo policy.

### COLL-003 — Get Wishlist Collection

Owner only. Trả collection và item cards phân trang. Product unavailable vẫn hiển thị trạng thái nhưng không lộ dữ liệu admin.

### COLL-004 — Patch Wishlist Collection

Allowlist name, description, visibility. Nếu chuyển PRIVATE, revoke mọi share link active trong cùng transaction.

### COLL-005 — Delete Wishlist Collection

- Không hard-delete default collection nếu policy yêu cầu luôn tồn tại.
- Delete/archive collection và items; revoke share links.
- Không ảnh hưởng product/cart/order.
- Idempotency theo contract; resource người khác trả 404.

### COLL-006 — Add Collection Item

Product phải tồn tại; item trùng trả 200. Enforce collection item limit dưới lock. Không lưu giá/tồn snapshot như cam kết.

### COLL-007 — Remove Collection Item

Owner + collection ownership trong cùng query. Idempotent 204.

### COLL-008 — Create Share Link

- Chỉ collection cho phép SHARED.
- Generate random token; DB chỉ lưu hash.
- Optional expiry và permission READ_ONLY.
- Raw token trả một lần; không dùng sequential ID.

### COLL-009 — Revoke Share Link

Set revoked_at, không hard-delete security evidence. Link revoked trả 404/410 khi public dùng.

### COLL-PUB-001 — View Shared Wishlist

- Hash token, verify expiry/revoked state.
- Chỉ trả safe owner display name nếu owner đồng ý.
- Filter product public; unavailable item chỉ trả generic unavailable.
- Rate-limit và chống indexing nếu privacy policy yêu cầu.

### ALERT-001 — List Product Alerts

Trả product, alert_type PRICE_DROP/BACK_IN_STOCK, threshold, active state, last_triggered_at. Không trả internal stock.

### ALERT-002 — Upsert Product Alert

**Input:** product/variant, alert type, optional target price, channel.

- Product/variant phải saleable hoặc từng tồn tại theo policy.
- PRICE_DROP yêu cầu target price hợp lệ và nhỏ hơn current price nếu business chọn.
- BACK_IN_STOCK không nhận threshold tiền.
- Unique active alert theo customer + target + type + channel.
- Upsert trả 201/200; consent/channel preference phải hợp lệ.

### ALERT-003 — Delete Product Alert

Owner only; deactivate/revoke subscription. Idempotent 204. Pending notification event phải kiểm tra alert còn active trước gửi.

Price-change command, PO receipt, transfer receive, return restock và inventory adjustment phải phát domain event/outbox để alert worker đánh giá. Không polling toàn bộ catalog liên tục.

### WISH-P2-001 — Move Flat Wishlist Item to Cart

**Input:** variant_id, desired_quantity, remove_from_wishlist boolean.

- Product ID path phải match variant.product_id.
- Dùng đúng cart upsert rule P0.
- Chỉ remove wishlist sau khi cart update thành công, cùng transaction nếu cùng service/database.
- Không reserve stock hoặc giữ giá.
- Retry dùng desired quantity để không cộng lặp.

### ORDER-P2-001 — Guest Reorder

- Verify signed guest-order token bind đúng order.
- Verify X-Guest-Cart-Token owner.
- Dùng rule ORDER-P1-001: reload saleability/current price và merge=max.
- Không copy contact/address/payment/coupon/serial.
- Không có item hợp lệ trả 422.

---

## 6. Recently Viewed, Saved Search and Recommendations

### 6.1 Endpoint inventory

| ID | Method | Endpoint | Actor | Success | Gate |
|---|---|---|---|---|---|
| RECENT-001 | GET | /me/recently-viewed-products | Customer | 200 | MIGRATION |
| RECENT-002 | DELETE | /me/recently-viewed-products/{productId} | Owner | 204 | MIGRATION |
| RECENT-003 | DELETE | /me/recently-viewed-products | Customer | 204 | MIGRATION |
| SEARCH-P2-001 | GET | /me/saved-searches | Customer | 200 | MIGRATION |
| SEARCH-P2-002 | POST | /me/saved-searches | Customer | 201 | MIGRATION |
| SEARCH-P2-003 | DELETE | /me/saved-searches/{savedSearchId} | Owner | 204 | MIGRATION |
| SEARCH-P2-004 | GET | /me/saved-searches/{savedSearchId}/results | Owner | 200 | MIGRATION |
| RECO-001 | GET | /me/recommendations | Customer | 200 | MIGRATION/INFRA |
| RECO-002 | POST | /me/recommendations/{recommendationId}/feedback | Customer | 204 | MIGRATION |

### 6.2 Required schema

- recently_viewed_products hoặc behavioral_events có retention.
- saved_searches với normalized filter JSON và schema_version.
- recommendation_runs/items/feedback hoặc recommendation read model.
- Consent/purpose/retention fields cho behavioral data.

### RECENT-001 — List Recently Viewed Products

Sort last_viewed_at newest, dedupe mỗi product/user. Chỉ trả catalog public; product unavailable được loại hoặc đánh dấu theo privacy/UX policy. Giới hạn retention và item count.

### RECENT-002 — Remove One Recently Viewed Product

Owner implicit từ token; idempotent 204. Không xóa global product view_count.

### RECENT-003 — Clear Recently Viewed History

Delete/anonymize behavioral rows của user trong một transaction/job. Recommendation cache phải invalidate sau commit.

### SEARCH-P2-001 — List Saved Searches

Trả name, normalized criteria summary, notification flag và timestamps. Không execute từng search trong list.

### SEARCH-P2-002 — Create Saved Search

**Input:** name, catalog filter object, optional alert preference.

- Filter phải qua cùng validator/allowlist của PRODUCT-PUB-001.
- Lưu normalized JSON + schema_version, không lưu raw query DSL/SQL.
- Enforce max saved searches/user và dedupe normalized criteria theo policy.

### SEARCH-P2-003 — Delete Saved Search

Owner only; revoke notification subscription liên quan. Idempotent 204.

### SEARCH-P2-004 — Run Saved Search

Load saved criteria server-side rồi gọi catalog query service hiện tại. Không tin client sửa criteria trong request. Nếu schema_version cũ không migrate được, trả 409 SAVED_SEARCH_VERSION_UNSUPPORTED.

### RECO-001 — Get Personalized Recommendations

**Input/query:** placement, limit, optional context product.

- Chỉ trả product public/saleable.
- Response có recommendation_id/model_version/reason_code đủ audit A/B nhưng không lộ model secret.
- Có fallback deterministic như trending/related khi personalization unavailable.
- Tôn trọng consent và exclude product customer đã block/không phù hợp.
- Không để recommendation service chặn product detail/checkout.

### RECO-002 — Record Recommendation Feedback

**Input:** event IMPRESSION/CLICK/DISMISS, item ID và event timestamp có giới hạn.

- Bind recommendation ID với user/placement/item đã phát.
- Dedupe event_id; rate-limit.
- Không nhận arbitrary profile label.
- Queue analytics sau validation; 204.

---

## 7. Review Community Extensions P2 APIs

### 7.1 Endpoint inventory

| ID | Method | Endpoint | Actor/Permission | Success | Gate |
|---|---|---|---|---|---|
| REVIEW-P2-001 | POST | /me/reviews/{reviewId}/media | Review owner | 201 | MIGRATION/INFRA |
| REVIEW-P2-002 | DELETE | /me/reviews/{reviewId}/media/{mediaId} | Review owner | 204 | MIGRATION/INFRA |
| REVIEW-P2-003 | POST | /reviews/{reviewId}/helpful-votes | Authenticated | 201/200 | MIGRATION |
| REVIEW-P2-004 | DELETE | /reviews/{reviewId}/helpful-votes/me | Voter | 204 | MIGRATION |
| REVIEW-P2-005 | POST | /reviews/{reviewId}/reports | Authenticated | 201/200 | MIGRATION |
| REVIEW-P2-006 | PUT | /admin/reviews/{reviewId}/reply | REVIEW_REPLY | 200/201 | MIGRATION |
| REVIEW-P2-007 | DELETE | /admin/reviews/{reviewId}/reply | REVIEW_REPLY | 204 | MIGRATION |
| REVIEW-P2-008 | POST | /me/reviews/{reviewId}/withdraw | Review owner | 200 | MIGRATION |
| REVIEW-P2-009 | GET | /admin/review-reports | REVIEW_MODERATE | 200 | MIGRATION |
| REVIEW-P2-010 | POST | /admin/review-reports/{reportId}/resolve | REVIEW_MODERATE | 200 | MIGRATION |

### 7.2 Required schema

- review_media với object key, media type, scan/moderation status, sort order.
- review_helpful_votes unique review_id + user_id.
- review_reports với reason code, status, reporter và resolution.
- review_replies một reply hiện hành/review hoặc version history.
- reviews status bổ sung WITHDRAWN và review_status_histories.
- Permission mới REVIEW_REPLY nếu tách customer-service reply khỏi moderation.

### REVIEW-P2-001 — Attach Review Media

**Input:** image/video file hoặc finalized upload reference theo media architecture.

- Review thuộc customer hiện tại.
- Chỉ PENDING/REJECTED được attach trực tiếp; APPROVED attach mới phải reset review PENDING.
- Validate MIME bằng file signature, size, dimensions/duration và count limit.
- Upload vào quarantine ngoài DB transaction; malware/content scan trước public.
- DB chỉ lưu object key, không lưu binary.
- Nếu DB attach thất bại sau upload, enqueue orphan cleanup.

**Errors:** 409 REVIEW_NOT_EDITABLE, 413 MEDIA_TOO_LARGE, 415 UNSUPPORTED_MEDIA_TYPE, 422 MEDIA_LIMIT_EXCEEDED.

### REVIEW-P2-002 — Remove Review Media

Owner only. Soft-delete/revoke media row trước, object cleanup bất đồng bộ sau retention. Nếu review APPROVED thay đổi media thì reset PENDING và invalidate public cache.

### REVIEW-P2-003 — Mark Review Helpful

- Review phải APPROVED và public.
- User không được vote review của chính mình.
- Unique vote ngăn duplicate; replay trả 200.
- Helpful count nên từ aggregate/read model, không tin client.
- Rate-limit chống vote farm.

### REVIEW-P2-004 — Remove Helpful Vote

Delete relationship của current user; idempotent 204. Update aggregate sau commit hoặc atomic counter policy.

### REVIEW-P2-005 — Report Review

**Input:** controlled reason code, optional note.

- Review phải public/APPROVED.
- Một user không spam nhiều report active cho cùng review/reason.
- Tạo PENDING report; không tự ẩn review chỉ vì một report.
- Threshold/risk rule có thể chuyển review sang temporary hidden bằng moderation workflow, không xóa.

### REVIEW-P2-006 — Upsert Official Reply

**Permission:** REVIEW_REPLY.

- Chỉ reply review APPROVED.
- Một official reply hiện hành/review.
- PUT idempotent; content moderation/XSS validation.
- Lưu actor/time/version; không giả danh review author.
- Public response ghi rõ Official Store Response.

### REVIEW-P2-007 — Remove Official Reply

Soft-delete/withdraw reply, giữ history/audit. Không xóa review. Idempotent 204.

### REVIEW-P2-008 — Withdraw My Review

- Owner only.
- Transition PENDING/APPROVED/REJECTED → WITHDRAWN theo policy.
- Withdrawn không public, không còn tính rating aggregate.
- Không hard-delete verified-purchase/audit evidence.
- Helpful votes/reports/reply được giữ lịch sử nhưng không public.

### REVIEW-P2-009 — List Review Reports

Filters report status/reason/review/product/reporter/date; oldest PENDING first. Mask reporter PII. Trả report count/risk summary nhưng không tự kết luận vi phạm.

### REVIEW-P2-010 — Resolve Review Report

**Input:** resolution NO_ACTION/HIDE_REVIEW/REJECT_REVIEW, note.

- Lock report và review.
- Resolve report đúng một lần; actor/time bắt buộc.
- Action làm đổi review state phải qua review state machine + history.
- Nhiều report cùng review được xử lý nhất quán, không để report PENDING vô hạn sau review bị rút.

---

## 8. Public Promotion Discovery P2 APIs

### 8.1 Endpoint inventory

| ID | Method | Endpoint | Actor | Success | Gate |
|---|---|---|---|---|---|
| PROMO-P2-001 | GET | /promotions | Public | 200 | Danh sách promotion công khai |
| PROMO-P2-002 | GET | /promotions/{slug} | Public | 200 | Chi tiết điều kiện promotion |

### 8.2 Required schema

Coupons hiện có code/rule/target nhưng chưa có public visibility. Cần bổ sung:

- public_slug unique.
- visibility INTERNAL/CODE_ONLY/PUBLIC.
- display_title, display_description, terms_url hoặc terms content version.
- optional display image.
- public starts/ends semantics nếu khác redemption period.

### PROMO-P2-001 — List Public Promotions

- Chỉ visibility=PUBLIC, status ACTIVE và trong display window.
- Không coi việc public là đảm bảo customer đủ điều kiện hoặc quota còn đến checkout.
- Trả display title/summary/period/target summary và safe CTA.
- Không trả guest identity, usage records, internal used-count chi tiết hoặc admin notes.
- Filters category/brand; cache theo time boundary.

### PROMO-P2-002 — Get Public Promotion Detail

Trả rule được diễn giải: minimum order, discount type/value/cap, eligible product/category/brand, period và terms version.

Không trả toàn bộ internal quota nếu business không muốn. Actual discount vẫn phải kiểm tra bằng COUPON-001/ORDER-001 P0; public page không phải source of truth cho checkout.

---

## 9. Notification Preferences, Push Devices and Campaigns

### 9.1 Endpoint inventory

| ID | Method | Endpoint | Actor/Permission | Success | Gate |
|---|---|---|---|---|---|
| PREF-001 | GET | /me/notification-preferences | Authenticated | 200 | Lấy channel/type preferences |
| PREF-002 | PUT | /me/notification-preferences | Authenticated | 200 | Thay preference matrix |
| DEVICE-001 | GET | /me/push-devices | Authenticated | 200 | Danh sách thiết bị push |
| DEVICE-002 | POST | /me/push-devices | Authenticated | 201/200 | Register/upsert thiết bị |
| DEVICE-003 | PATCH | /me/push-devices/{deviceId} | Owner | 200 | Đổi tên/trạng thái thiết bị |
| DEVICE-004 | DELETE | /me/push-devices/{deviceId} | Owner | 204 | Revoke thiết bị |
| CAMPAIGN-001 | GET | /admin/notification-campaigns | NOTIFICATION_CAMPAIGN_MANAGE | 200 | Danh sách campaign |
| CAMPAIGN-002 | POST | /admin/notification-campaigns | NOTIFICATION_CAMPAIGN_MANAGE | 201 | Tạo campaign draft |
| CAMPAIGN-003 | GET | /admin/notification-campaigns/{campaignId} | NOTIFICATION_CAMPAIGN_MANAGE | 200 | Chi tiết/metrics |
| CAMPAIGN-004 | PATCH | /admin/notification-campaigns/{campaignId} | NOTIFICATION_CAMPAIGN_MANAGE | 200 | Sửa draft |
| CAMPAIGN-005 | POST | /admin/notification-campaigns/{campaignId}/schedule | NOTIFICATION_CAMPAIGN_MANAGE | 200 | Schedule campaign |
| CAMPAIGN-006 | POST | /admin/notification-campaigns/{campaignId}/cancel | NOTIFICATION_CAMPAIGN_MANAGE | 200 | Cancel campaign |

### 9.2 Required schema

- notification_preferences theo user + notification type + channel.
- push_devices với platform/provider, encrypted token, token hash, last_seen, revoked_at.
- notification_campaigns, campaign_audiences, campaign_runs/recipients.
- Consent version, unsubscribe evidence và suppression list.
- Permission mới NOTIFICATION_CAMPAIGN_MANAGE.

### PREF-001 — Get Notification Preferences

Trả matrix notification_type × channel, editable flag, legal basis và effective state. Security/transactional notification bắt buộc phải hiển thị non-editable nếu không được opt out.

### PREF-002 — Replace Notification Preferences

- Input là full editable preference matrix.
- Không cho disable mandatory security/legal notifications.
- Marketing opt-in phải đồng bộ customer consent/version, không chỉ một boolean mơ hồ.
- Replace atomically; audit consent changes.
- Campaign/delivery worker đọc preference mới nhất trước gửi hoặc dùng consent snapshot đúng policy.

### DEVICE-001 — List Push Devices

Trả opaque device ID, platform, device name, last_seen, active/revoked state. Không trả raw provider token.

### DEVICE-002 — Register Push Device

**Input:** provider token, platform, app version, device name.

- Validate token format/provider.
- Store token encrypted để gửi và token hash để unique lookup.
- Upsert token đã thuộc cùng user; nếu token chuyển user cần security policy rõ.
- Enforce max active devices/user.
- Không log raw token.

### DEVICE-003 — Patch Push Device

Allowlist display name và enabled state. Không cho đổi owner/raw token bằng PATCH.

### DEVICE-004 — Revoke Push Device

Set revoked_at; idempotent. Provider invalid-token callback cũng phải revoke bằng internal flow.

### CAMPAIGN-001 — List Campaigns

Filters status DRAFT/SCHEDULED/RUNNING/COMPLETED/CANCELLED, channel, creator, schedule. Trả recipient/delivery metrics aggregate, không trả toàn bộ PII.

### CAMPAIGN-002 — Create Campaign Draft

**Input:** name, type MARKETING/SERVICE, channel set, content/template version, audience definition, optional schedule.

- Luôn DRAFT.
- Audience filter dùng allowlist DSL/versioned segment, không raw SQL.
- Content/template phải pass validation.
- Marketing campaign bắt buộc consent/suppression semantics.

### CAMPAIGN-003 — Get Campaign Detail

Trả configuration, estimated/snapshotted audience count, run metrics, failures aggregate và audit timeline. Recipient list riêng chỉ mở nếu có permission/PII scope.

### CAMPAIGN-004 — Patch Campaign Draft

Chỉ DRAFT. Revalidate audience, content, channels và schedule. Không sửa RUNNING/COMPLETED.

### CAMPAIGN-005 — Schedule Campaign

- DRAFT → SCHEDULED.
- Require schedule future, content approved, audience valid và suppression policy.
- Snapshot config/version; không để edit silently sau schedule.
- Scheduler tạo run/recipients idempotently bằng campaign + run key.

### CAMPAIGN-006 — Cancel Campaign

- DRAFT/SCHEDULED → CANCELLED.
- RUNNING chỉ stop phần chưa gửi; không thu hồi message đã SENT.
- Ghi cancel actor/reason và publish worker stop signal sau commit.

---

## 10. Stock Transfer and Supplier Return P2 APIs

### 10.1 Endpoint inventory

| ID | Method | Endpoint | Actor/Permission | Success | Gate |
|---|---|---|---|---|---|
| TRANSFER-001 | GET | /admin/stock-transfers | STOCK_VIEW | 200 | Danh sách transfer |
| TRANSFER-002 | POST | /admin/stock-transfers | STOCK_TRANSFER_CREATE | 201 | Tạo transfer draft |
| TRANSFER-003 | GET | /admin/stock-transfers/{transferId} | STOCK_VIEW | 200 | Chi tiết transfer |
| TRANSFER-004 | PATCH | /admin/stock-transfers/{transferId} | STOCK_TRANSFER_CREATE | 200 | Sửa header draft |
| TRANSFER-005 | PUT | /admin/stock-transfers/{transferId}/items | STOCK_TRANSFER_CREATE | 200 | Thay item set |
| TRANSFER-006 | POST | /admin/stock-transfers/{transferId}/submit | STOCK_TRANSFER_CREATE | 200 | Gửi duyệt |
| TRANSFER-007 | POST | /admin/stock-transfers/{transferId}/approve | STOCK_TRANSFER_APPROVE | 200 | Duyệt transfer |
| TRANSFER-008 | POST | /admin/stock-transfers/{transferId}/dispatch | STOCK_TRANSFER_DISPATCH | 200/201 | Xuất khỏi kho nguồn |
| TRANSFER-009 | POST | /admin/stock-transfers/{transferId}/receive | STOCK_TRANSFER_RECEIVE | 200/201 | Nhận tại kho đích |
| TRANSFER-010 | POST | /admin/stock-transfers/{transferId}/cancel | Creator/approver policy | 200 | Hủy transfer |
| VRETURN-001 | GET | /admin/supplier-returns | STOCK_VIEW | 200 | Danh sách trả supplier |
| VRETURN-002 | POST | /admin/supplier-returns | SUPPLIER_RETURN_CREATE | 201 | Tạo draft |
| VRETURN-003 | GET | /admin/supplier-returns/{supplierReturnId} | STOCK_VIEW | 200 | Chi tiết |
| VRETURN-004 | PATCH | /admin/supplier-returns/{supplierReturnId} | SUPPLIER_RETURN_CREATE | 200 | Sửa draft |
| VRETURN-005 | POST | /admin/supplier-returns/{supplierReturnId}/submit | SUPPLIER_RETURN_CREATE | 200 | Gửi duyệt |
| VRETURN-006 | POST | /admin/supplier-returns/{supplierReturnId}/approve | SUPPLIER_RETURN_APPROVE | 200 | Duyệt trả hàng |
| VRETURN-007 | POST | /admin/supplier-returns/{supplierReturnId}/dispatch | SUPPLIER_RETURN_DISPATCH | 200/201 | Xuất trả supplier |
| VRETURN-008 | POST | /admin/supplier-returns/{supplierReturnId}/complete | SUPPLIER_RETURN_SETTLE | 200 | Xác nhận supplier/credit |
| VRETURN-009 | POST | /admin/supplier-returns/{supplierReturnId}/cancel | Creator/approver policy | 200 | Hủy return |

### 10.2 Stock-transfer schema prerequisite

Cần thêm:

- stock_transfers.
- stock_transfer_items.
- stock_transfer_item_units.
- stock_transfer_receipts hoặc receipt events.
- stock_transfer_status_histories.
- idempotency records cho dispatch/receive.
- inventory_units status IN_TRANSFER.
- Permissions STOCK_TRANSFER_CREATE/APPROVE/DISPATCH/RECEIVE.

Existing stock_transactions đã có TRANSFER_OUT, TRANSFER_IN và reference_type STOCK_TRANSFER; đây là ledger output, không thay thế transfer aggregate.

### 10.3 Stock-transfer state machine

| Current | Allowed next |
|---|---|
| DRAFT | PENDING_APPROVAL, CANCELLED |
| PENDING_APPROVAL | APPROVED, DRAFT nếu reject-to-edit, CANCELLED |
| APPROVED | IN_TRANSIT, CANCELLED |
| IN_TRANSIT | PARTIALLY_RECEIVED, COMPLETED |
| PARTIALLY_RECEIVED | PARTIALLY_RECEIVED, COMPLETED |
| COMPLETED | Terminal |
| CANCELLED | Terminal |

Không cancel trực tiếp hàng đã dispatch. Exception sau dispatch phải receive về destination, return-to-source hoặc mở discrepancy workflow có audit.

### TRANSFER-001 — List Stock Transfers

Filters transfer code, source/destination warehouse, status, variant, creator/approver, created/dispatch/receive range. Organizational warehouse scope bắt buộc.

### TRANSFER-002 — Create Stock Transfer Draft

**Input:** source warehouse, destination warehouse, reason, optional item set.

- Source và destination khác nhau, đều tồn tại/ACTIVE.
- Generate transfer code server-side.
- Status DRAFT; created_by từ actor.
- Item quantity > 0; variant tồn tại.
- Header/items trong một transaction.
- Không thay đổi tồn khi chỉ tạo draft.

### TRANSFER-003 — Get Stock Transfer Detail

Trả header, items requested/dispatched/received, unit mappings đã mask theo permission, status history, discrepancy và actor timestamps. Không trả IMEI đầy đủ nếu actor chỉ có STOCK_VIEW tổng quan mà policy yêu cầu scope cao hơn.

### TRANSFER-004 — Patch Stock Transfer Header

Chỉ DRAFT. Allowlist source, destination, reason/note. Nếu đổi warehouse phải revalidate item availability và xóa unit preselection không còn hợp lệ.

### TRANSFER-005 — Replace Stock Transfer Items

**Input:** full item list variant + requested quantity.

- Chỉ DRAFT.
- Không trùng variant.
- Source có đủ current availability để warning, nhưng chưa reserve nếu policy chưa submit/approve.
- Replace atomically.
- Serialized unit chưa bắt buộc chọn ở draft; scan khi dispatch.

### TRANSFER-006 — Submit Stock Transfer

DRAFT → PENDING_APPROVAL.

**Guards:** item set không rỗng, warehouses ACTIVE, quantities hợp lệ, variants không deleted. Insert status history + audit trong transaction.

### TRANSFER-007 — Approve Stock Transfer

PENDING_APPROVAL → APPROVED.

- Lock transfer/items.
- Revalidate source availability.
- Separation of duties: creator không tự approve nếu policy yêu cầu.
- Approval không tự giảm tồn.
- Nếu muốn reserve transfer stock tại approve, phải có reservation type riêng; không tái sử dụng sales stock_reservations vì ownership/reference khác.

### TRANSFER-008 — Dispatch Stock Transfer

**Header:** Idempotency-Key bắt buộc.  
**Input:** item dispatched quantities; serialized SKU gồm scanned unit identifiers.

**Transaction:**

1. Lock transfer/items, source balances và units theo thứ tự ổn định.
2. Chỉ APPROVED; hoặc hỗ trợ partial dispatch bằng schema/status riêng đã chốt.
3. Verify dispatched không vượt approved/requested.
4. QUANTITY: giảm source on_hand.
5. SERIALIZED: unit AVAILABLE đúng source/variant; set IN_TRANSFER và bind transfer item.
6. Append TRANSFER_OUT ledger before/after.
7. Ghi dispatched quantities/actor/time, transition IN_TRANSIT.
8. Commit; notification/outbox sau commit.

In-transit quantity không được tính available ở source/destination.

**Errors:** 409 TRANSFER_NOT_DISPATCHABLE, 409 INSUFFICIENT_SOURCE_STOCK, 409 UNIT_NOT_AVAILABLE, 422 UNIT_COUNT_MISMATCH.

### TRANSFER-009 — Receive Stock Transfer

**Header:** Idempotency-Key bắt buộc.  
**Input:** received quantities, scanned units, discrepancy reason.

1. Lock transfer/items, destination balances và dispatched units.
2. Chỉ IN_TRANSIT/PARTIALLY_RECEIVED.
3. Received cumulative không vượt dispatched.
4. QUANTITY: tăng destination on_hand.
5. SERIALIZED: verify exact IN_TRANSFER unit; update warehouse_id=destination và status AVAILABLE.
6. Append TRANSFER_IN ledger.
7. Ghi receipt event; PARTIALLY_RECEIVED hoặc COMPLETED.
8. Short/damaged unit phải có discrepancy, không tự mất khỏi aggregate.

Không update source ledger lần nữa khi receive.

### TRANSFER-010 — Cancel Stock Transfer

- DRAFT/PENDING_APPROVAL: creator/authorized manager.
- APPROVED: permission approve và chỉ khi chưa dispatch.
- Set actor/time/reason, history/audit.
- IN_TRANSIT/PARTIALLY_RECEIVED không cancel trực tiếp.

### 10.4 Supplier-return schema prerequisite

Cần thêm:

- supplier_returns và supplier_return_items.
- supplier_return_item_units.
- supplier_return_status_histories.
- supplier_return_credit_documents/settlement fields.
- inventory_units status RETURNED_TO_SUPPLIER hoặc lifecycle rõ.
- stock_transactions reference_type SUPPLIER_RETURN.
- Permissions SUPPLIER_RETURN_CREATE/APPROVE/DISPATCH/SETTLE.

Không dùng customer return_requests vì owner, money flow, reason và destination hoàn toàn khác.

### 10.5 Supplier-return state machine

| Current | Allowed next |
|---|---|
| DRAFT | PENDING_APPROVAL, CANCELLED |
| PENDING_APPROVAL | APPROVED, DRAFT nếu trả sửa, CANCELLED |
| APPROVED | DISPATCHED, CANCELLED |
| DISPATCHED | COMPLETED |
| COMPLETED | Terminal |
| CANCELLED | Terminal |

### VRETURN-001 — List Supplier Returns

Filters code, supplier, warehouse, PO, status, reason code, creator/approver và date. Cost/credit fields cần financial scope phù hợp.

### VRETURN-002 — Create Supplier Return Draft

**Input:** supplier, warehouse, reason code/note, optional original PO/item references, item quantities/units.

- Supplier/warehouse tồn tại.
- Item phải có provenance hợp lệ nếu business bắt buộc trả đúng nhà cung cấp.
- Không thay tồn khi draft.
- Generate code, status DRAFT.
- Với serialized, preselect unit optional nhưng unit phải có purchase provenance phù hợp.

### VRETURN-003 — Get Supplier Return Detail

Trả item/unit provenance, requested/approved/dispatched quantities, supplier/PO summary, status history, credit expectation/actual và discrepancies.

### VRETURN-004 — Patch Supplier Return Draft

Chỉ DRAFT. Sửa supplier/warehouse/reason/items theo full validation. Nếu đổi supplier, revalidate mọi PO/item/unit provenance.

### VRETURN-005 — Submit Supplier Return

DRAFT → PENDING_APPROVAL. Guard item không rỗng, quantity hợp lệ, unit chưa dùng trong return khác, supplier/warehouse valid.

### VRETURN-006 — Approve Supplier Return

- PENDING_APPROVAL only.
- Revalidate stock/unit/provenance.
- Separation of duties.
- Approval ghi expected credit/settlement policy nhưng không hạch toán tiền giả.

### VRETURN-007 — Dispatch Supplier Return

**Header:** Idempotency-Key.

1. Lock return/items, balances và units.
2. Chỉ APPROVED.
3. Giảm warehouse on_hand.
4. Serialized unit đúng warehouse/variant, không reserved/sold/in warranty; chuyển RETURNED_TO_SUPPLIER hoặc terminal state đã thiết kế.
5. Append RETURN_OUT hoặc supplier-specific transaction type/reference.
6. Set dispatch actor/time và DISPATCHED.

Không dùng ADJUST_OUT vì sẽ làm mất ý nghĩa nghiệp vụ.

### VRETURN-008 — Complete Supplier Return

**Input:** supplier acknowledgement, credit document/reference, accepted/rejected quantities, actual credit amount.

- DISPATCHED only.
- Không làm inventory movement lần hai.
- Record settlement/credit evidence và discrepancy.
- COMPLETED chỉ khi business đã xác nhận nghĩa của “complete”: supplier nhận hàng hay credit finalized.
- Nếu credit tích hợp kế toán ngoài, commit local evidence trước rồi outbox integration.

### VRETURN-009 — Cancel Supplier Return

DRAFT/PENDING_APPROVAL hoặc APPROVED chưa dispatch. Set actor/time/reason. DISPATCHED không cancel; dùng dispute/settlement flow.

---

## 11. Catalog and Report Asynchronous Job P2 APIs

### 11.1 Endpoint inventory

| ID | Method | Endpoint | Actor/Permission | Success | Gate |
|---|---|---|---|---|---|
| CIMPORT-001 | POST | /admin/catalog-import-jobs | CATALOG_BULK_IMPORT | 202 | MIGRATION/INFRA |
| CIMPORT-002 | GET | /admin/catalog-import-jobs | CATALOG_BULK_IMPORT | 200 | MIGRATION |
| CIMPORT-003 | GET | /admin/catalog-import-jobs/{jobId} | CATALOG_BULK_IMPORT | 200 | MIGRATION |
| CIMPORT-004 | GET | /admin/catalog-import-jobs/{jobId}/errors | CATALOG_BULK_IMPORT | 200 | MIGRATION |
| CIMPORT-005 | POST | /admin/catalog-import-jobs/{jobId}/cancel | CATALOG_BULK_IMPORT | 200 | MIGRATION |
| CEXPORT-001 | POST | /admin/catalog-export-jobs | CATALOG_EXPORT | 202 | MIGRATION/INFRA |
| CEXPORT-002 | GET | /admin/catalog-export-jobs/{jobId} | CATALOG_EXPORT | 200 | MIGRATION/INFRA |
| REXPORT-001 | POST | /admin/report-export-jobs | Report permission tương ứng | 202 | MIGRATION/INFRA |
| REXPORT-002 | GET | /admin/report-export-jobs | Owner/report admin | 200 | MIGRATION |
| REXPORT-003 | GET | /admin/report-export-jobs/{jobId} | Owner/report admin | 200 | MIGRATION/INFRA |
| REXPORT-004 | POST | /admin/report-export-jobs/{jobId}/cancel | Owner/report admin | 200 | MIGRATION |

### 11.2 Required job infrastructure

Cần generalized hoặc domain-specific schema:

- async_jobs: type, status, parameters hash, requester, progress, heartbeat, error, timestamps.
- job_artifacts: object key, MIME, checksum, size, expires_at.
- catalog_import_staging và catalog_import_errors.
- Idempotency key/fingerprint.
- Worker lease/heartbeat/retry count/dead-letter semantics.
- Permissions CATALOG_BULK_IMPORT và CATALOG_EXPORT.

Job status đề xuất:

PENDING → VALIDATING/RUNNING → COMPLETED/PARTIALLY_FAILED/FAILED; PENDING/VALIDATING → CANCELLED. RUNNING cancellation phải cooperative.

### CIMPORT-001 — Create Catalog Import Job

**Input:** uploaded file reference, template_version, mode VALIDATE_ONLY/APPLY, conflict policy.

- File đã scan virus, MIME/size/checksum hợp lệ.
- Không parse/apply toàn file trong HTTP request.
- Hash request + file checksum để idempotent.
- Conflict policy chỉ trong allowlist: REJECT_EXISTING hoặc UPDATE_ALLOWED_FIELDS; không cho arbitrary overwrite.
- Job tạo PENDING, worker dùng staging.
- 202 trả job ID/status URL.

### CIMPORT-002 — List Catalog Import Jobs

Filters status/mode/requester/date/template version. Mask artifact path. Organizational scope và permission áp dụng.

### CIMPORT-003 — Get Catalog Import Job

Trả progress, total/valid/invalid/applied rows, phase, safe error summary, template version, checksum và timestamps.

Nếu COMPLETED/PARTIALLY_FAILED, response có artifact/error-report link ngắn hạn theo permission.

### CIMPORT-004 — List Catalog Import Errors

Trả row number, stable error code, field, sanitized value preview và message. Không trả formula payload hoặc cell content có thể gây CSV/Excel injection khi export lại.

### CIMPORT-005 — Cancel Catalog Import Job

- PENDING/VALIDATING có thể cancel.
- RUNNING chỉ set cancellation_requested; worker dừng tại safe checkpoint.
- COMPLETED/FAILED/CANCELLED là terminal.
- Không rollback mù các row đã apply; import APPLY phải thiết kế staging/publish boundary trước.

### 11.3 Catalog import business policy

- Category/brand/product/variant dependency được validate theo thứ tự.
- SKU/slug unique sau normalize.
- Giá, tracking type và warranty dùng rule P0.
- Không đổi tracking type/SKU của variant đã có inventory/order.
- Media URL phải trusted.
- P2 đề xuất import tạo/update DRAFT; publication là command P0 riêng.
- Không cho CSV import sửa stock balance; stock chỉ đổi qua PO/transfer/adjustment.

### CEXPORT-001 — Create Catalog Export Job

**Input:** entity scope, filters, format CSV/XLSX, column allowlist.

- Validate caller permission và PII-free export scope.
- Snapshot filter definition/time.
- Queue job; 202.
- Không export cost/supplier/inventory identifier nếu permission không đủ.

### CEXPORT-002 — Get Catalog Export Job

Trả status/progress/row count/checksum/expiry. Khi COMPLETED trả short-lived signed download URL; URL không lưu làm permanent public link.

### REXPORT-001 — Create Report Export Job

**Input:** report_type, exact filters, timezone, currency, format.

- Map report_type sang endpoint/metric definition P1.
- Kiểm tra permission tương ứng, ví dụ sales/inventory/payment.
- Lưu filter hash và metric version.
- Enforce date/window/row limits.
- Queue trên analytics worker/read replica.

### REXPORT-002 — List My Report Export Jobs

Mặc định chỉ jobs của actor. Report admin có thể xem organization scope theo policy. Filters type/status/date.

### REXPORT-003 — Get Report Export Job

Owner hoặc authorized report admin. Trả metric version, filter summary, row count, checksum, artifact expiry và signed URL khi complete. Không cho người mất permission tải artifact cũ.

### REXPORT-004 — Cancel Report Export Job

PENDING → CANCELLED; RUNNING cooperative cancellation. Completed artifact có thể được revoked/delete theo retention nhưng không đổi job thành CANCELLED.

---

## 12. Tax and Invoice P2 APIs

### 12.1 Endpoint inventory

| ID | Method | Endpoint | Actor/Permission | Success | Gate |
|---|---|---|---|---|---|
| TAX-001 | GET | /admin/tax-rules | TAX_MANAGE | 200 | MIGRATION/LEGAL |
| TAX-002 | PUT | /admin/tax-rules | TAX_MANAGE | 200 | MIGRATION/LEGAL |
| INVOICE-001 | GET | /me/invoices | Customer | 200 | MIGRATION |
| INVOICE-002 | GET | /me/invoices/{invoiceId} | Owner | 200 | MIGRATION |
| INVOICE-003 | POST | /orders/{orderCode}/invoice-requests | Owner/guest token | 201/200 | MIGRATION/LEGAL |
| INVOICE-004 | GET | /invoices/{invoiceId}/download | Owner/guest token | 200/302 | MIGRATION/INFRA |
| INVOICE-ADM-001 | GET | /admin/invoices | INVOICE_VIEW | 200 | MIGRATION |
| INVOICE-ADM-002 | POST | /admin/invoices/{invoiceId}/issue | INVOICE_ISSUE | 200/202 | MIGRATION/LEGAL |
| INVOICE-ADM-003 | POST | /admin/invoices/{invoiceId}/void | INVOICE_VOID | 200/202 | MIGRATION/LEGAL |
| INVOICE-WEBHOOK-001 | POST | /webhooks/invoices/{providerCode} | Signed provider webhook | 200 | MIGRATION/INFRA |

### 12.2 Required schema and legal decisions

Cần:

- tax_rules với jurisdiction, rate, inclusive/exclusive, validity period, version.
- Tax snapshot trên orders/order_items.
- invoice_requests.
- invoices và invoice_items immutable snapshots.
- invoice_status_histories.
- invoice_artifacts.
- invoice_provider_events unique provider + event ID.
- credit_note/adjustment model nếu luật yêu cầu.
- Permissions TAX_MANAGE, INVOICE_VIEW, INVOICE_ISSUE, INVOICE_VOID.

Trước migration phải chốt:

- Giá catalog đã gồm thuế hay chưa.
- Shipping/discount phân bổ thuế thế nào.
- Thời điểm lập hóa đơn.
- Quy tắc void/adjustment.
- Provider hóa đơn điện tử và chữ ký số.
- Retention theo pháp luật.

Không phát hành hóa đơn pháp lý từ orders hiện tại nếu thiếu tax snapshot chính xác.

### TAX-001 — List Tax Rules

Trả jurisdiction, product category mapping, rate, price mode, valid_from/to và version. Tax configuration là dữ liệu nhạy cảm; không expose public raw rules nếu không cần.

### TAX-002 — Replace Tax Rule Set

**Input:** full versioned future-effective rule set.

- Không sửa rule đã dùng để tính order cũ.
- Rule mới có valid_from future hoặc controlled emergency policy.
- Validate overlap/gap/jurisdiction/rate.
- Replace/publish atomically theo version.
- Audit before/after và require step-up/separation nếu cần.

### INVOICE-001 — List My Invoices

Filters status/date/order; trả invoice number, order code, issue date, total/currency, status và artifact availability. Không trả invoice user khác.

### INVOICE-002 — Get My Invoice

Owner only. Trả seller/buyer snapshots, item/tax totals, references, status history safe view và download availability.

### INVOICE-003 — Request Invoice for Order

**Input:** legal name, tax code, billing address, email và invoice type.

- Verify owner/guest order access.
- Order/payment/status phải đủ điều kiện theo legal policy.
- Snapshot billing data; không chỉ tham chiếu profile mutable.
- Một active request/invoice/order/type; idempotency key.
- Không cho sửa buyer data sau issue; thay đổi dùng adjustment workflow.

**Errors:** 409 INVOICE_ALREADY_REQUESTED, 422 ORDER_NOT_INVOICEABLE, 422 INVALID_TAX_ID.

### INVOICE-004 — Download Invoice Artifact

- Owner/guest token bind invoice/order.
- Invoice ISSUED và artifact ready.
- Short-lived signed URL hoặc stream; audit download.
- 410 nếu temporary link expired nhưng có thể request URL mới khi invoice còn retention.

### INVOICE-ADM-001 — List Invoices

Filters invoice number/order/customer/status/provider/date/tax ID masked. Pagination và legal/organizational scope bắt buộc.

### INVOICE-ADM-002 — Issue Invoice

**Header:** Idempotency-Key.

1. Lock invoice/request/order.
2. Validate tax snapshots/totals and state DRAFT/REQUESTED.
3. Commit local issue intent/outbox.
4. Gọi e-invoice provider ngoài transaction.
5. Persist provider reference, issued number/time, signed artifact checksum.
6. Duplicate callback/retry không issue lần hai.

Synchronous provider có thể trả 200; async trả 202.

### INVOICE-ADM-003 — Void Invoice

**Input:** controlled reason, legal evidence, optional replacement/credit-note reference.

- Chỉ trạng thái/period pháp luật cho phép.
- Không delete invoice/artifact/history.
- Step-up + INVOICE_VOID + separation policy.
- Provider call idempotent; local state/outbox/callback chống lặp.
- Nếu luật yêu cầu adjustment thay vì void, endpoint phải từ chối và hướng sang credit-note workflow tương lai.

### INVOICE-WEBHOOK-001 — Invoice Provider Webhook

1. Verify chữ ký trên raw body và replay window.
2. Insert invoice_provider_events bằng unique provider_code + provider_event_id.
3. Duplicate event trả 200, không issue/void lần hai.
4. Resolve invoice bằng internal request reference/provider reference.
5. Lock event → invoice → optional order.
6. Validate event type, invoice number, tax total/currency và state transition.
7. Persist ISSUED/VOID/FAILED result, provider reference, artifact metadata/checksum.
8. Mark event PROCESSED; lỗi tạm giữ RECEIVED để worker retry.

Không nhận file URL không tin cậy rồi public trực tiếp; artifact phải download/verify/store theo integration policy.

---

## 13. Consolidated P2 Schema Blueprint

Đây là blueprint logic, chưa phải migration SQL. Tên/cột cuối cùng phải được review cùng DB migration.

| Domain | Entity/table cần bổ sung | Constraint quan trọng |
|---|---|---|
| Email change | pending_email_changes | token hash unique, one active/user, purpose/new-email snapshot |
| MFA | mfa_methods, mfa_challenges, mfa_recovery_codes | one active method/type, challenge expiry/use-once, recovery hash unique |
| Privacy | privacy_requests, privacy_artifacts | one active request/type/user, artifact expiry/checksum |
| Multi-wishlist | wishlist_collections, wishlist_collection_items, wishlist_share_links | owner/name policy, item unique, token hash unique |
| Product alerts | product_alerts | unique active owner/target/type/channel |
| Behavior | recently_viewed_products, saved_searches | retention, normalized criteria hash/schema version |
| Recommendation | recommendation_runs/items/feedback | recommendation-item binding, event dedupe |
| Review extension | review_media, review_helpful_votes, review_reports, review_replies, status history | ownership, one vote/user, one reply/review, media state |
| Promotions | coupon visibility/public fields | public slug unique, display window |
| Notification | notification_preferences, push_devices, campaigns, campaign recipients/runs | consent version, device token hash, run idempotency |
| Transfer | stock_transfers/items/units/receipts/histories | source != destination, cumulative receive <= dispatch |
| Supplier return | supplier_returns/items/units/histories/credits | provenance, cumulative quantities, settlement evidence |
| Async jobs | async_jobs, job_artifacts, import staging/errors | request fingerprint, worker lease, artifact checksum/expiry |
| Tax | tax_rules + version | non-overlap validity, immutable used version |
| Invoice | invoice_requests, invoices/items/histories/artifacts | one active invoice/order/type, immutable issue snapshot |

### 13.1 Existing enum/ledger changes

Các thay đổi không thể bỏ qua:

- inventory_units.unit_status thêm IN_TRANSFER và RETURNED_TO_SUPPLIER hoặc state model tương đương.
- stock_transactions.reference_type thêm SUPPLIER_RETURN.
- reviews.status thêm WITHDRAWN.
- notification delivery/campaign lifecycle cần PROCESSING/RUNNING rõ.
- orders/order_items phải có tax snapshots trước invoice.

### 13.2 Migration strategy

1. Viết migration forward-only, không dùng ddl-auto update cho production.
2. Tạo bảng/cột nullable hoặc default an toàn.
3. Backfill dữ liệu hiện có theo batch.
4. Kiểm tra invariant và reconciliation.
5. Thêm constraint/index sau khi data sạch nếu cần.
6. Deploy code đọc tương thích cũ/mới.
7. Bật feature flag theo domain.
8. Sau thời gian ổn định mới xóa schema cũ.

Multi-wishlist phải migrate mỗi row wishlists hiện tại vào default collection mà không mất created_at hoặc tạo duplicate.

---

## 14. New Permission Seed Requirements

Current SQL chưa có các permission sau:

| Module | Permission |
|---|---|
| Review | REVIEW_REPLY |
| Notification | NOTIFICATION_CAMPAIGN_MANAGE |
| Inventory transfer | STOCK_TRANSFER_CREATE |
| Inventory transfer | STOCK_TRANSFER_APPROVE |
| Inventory transfer | STOCK_TRANSFER_DISPATCH |
| Inventory transfer | STOCK_TRANSFER_RECEIVE |
| Supplier return | SUPPLIER_RETURN_CREATE |
| Supplier return | SUPPLIER_RETURN_APPROVE |
| Supplier return | SUPPLIER_RETURN_DISPATCH |
| Supplier return | SUPPLIER_RETURN_SETTLE |
| Catalog jobs | CATALOG_BULK_IMPORT |
| Catalog jobs | CATALOG_EXPORT |
| Tax | TAX_MANAGE |
| Invoice | INVOICE_VIEW |
| Invoice | INVOICE_ISSUE |
| Invoice | INVOICE_VOID |

### 14.1 Separation-of-duties recommendations

- Transfer creator không tự approve.
- Transfer dispatcher khác receiver khi rủi ro cao.
- Supplier-return creator không tự approve/settle.
- Invoice issuer không tự void nếu policy yêu cầu.
- Campaign creator có thể cần content approver trước schedule.
- TAX_MANAGE và INVOICE_VOID cần step-up/MFA.

SUPER_ADMIN nhận permission mới qua controlled migration. Không tự động cấp mọi permission mới cho custom roles.

---

## 15. Cross-Cutting P2 Requirements

### 15.1 Idempotency matrix

| Command | Idempotency scope |
|---|---|
| Email confirm | Token use-once |
| MFA confirm/challenge | Enrollment/challenge use-once |
| Privacy export/deletion | User + request type + payload fingerprint |
| Product alert upsert | Owner + target + type + channel |
| Helpful vote/report | Actor + review + action/reason |
| Campaign schedule | Campaign + config version + scheduled run |
| Transfer dispatch/receive | Transfer + operation + request key + payload hash |
| Supplier return dispatch | Return + operation + request key |
| Import/export jobs | Actor + job type + input checksum/filter hash |
| Invoice request/issue/void | Order/invoice + operation + request key |

Same key + same payload trả resource cũ. Same key + different payload trả 409.

### 15.2 Outbox and external calls

P2 đặc biệt phụ thuộc external systems:

- Email/SMS/push.
- Object storage.
- Recommendation/analytics worker.
- E-invoice provider.
- Campaign scheduler.

DB transaction chỉ ghi business state + outbox. Worker gọi provider sau commit. Không giữ transaction mở trong lúc upload/send/issue.

### 15.3 Object storage rules

- Object key private, không dùng permanent public URL.
- Upload quarantine + malware/content scan.
- Signed URL expiry ngắn.
- Checksum, MIME, size và owner binding.
- Orphan cleanup/reconciliation job.
- Retention riêng cho review media, privacy export, report export và invoice artifact.

### 15.4 Privacy and consent

- Behavioral data cần purpose/consent/retention.
- Marketing preference không áp dụng cho mandatory security/transaction notification.
- Privacy deletion không phá accounting/legal records; dùng anonymization.
- Campaign audience phải áp suppression/consent ngay trước send.
- Shared wishlist không lộ owner identity mặc định.

### 15.5 Concurrency and locking

- MFA challenge/recovery code: lock use-once record.
- Wishlist item limit: lock collection.
- Helpful vote/report: unique constraints.
- Transfer dispatch/receive: lock aggregate → items → warehouse balances → units theo order ổn định.
- Supplier return dispatch: tương tự stock-out.
- Campaign scheduler: unique run key/lease.
- Job worker: lease + heartbeat, không để hai worker apply cùng job.
- Invoice issue: lock invoice/order và provider idempotency.

### 15.6 Retention and partitioning

Data tăng nhanh:

- behavioral/recommendation events.
- campaign recipients/deliveries.
- job errors/artifacts.
- audit/status histories.
- review media/reports.

Phải chốt retention, archive, partition và delete/anonymize job trước khi volume lớn. Không để API list quét vô hạn.

---

## 16. P2 Requirement-to-Endpoint Traceability

| Requirement | Endpoint | Schema/Service |
|---|---|---|
| Đổi email an toàn | EMAIL-001/002 | pending email changes |
| MFA TOTP | MFA-001..005 | MFA methods/challenges/recovery |
| Export/xóa dữ liệu cá nhân | PRIV-001..006 | privacy jobs/artifacts |
| Nhiều wishlist/chia sẻ | COLL endpoints | collections/items/share links |
| Price-drop/back-in-stock alert | ALERT-001..003 | product alerts + notification |
| Guest mua lại | ORDER-P2-001 | existing guest order/cart |
| Recently viewed/saved search | RECENT/SEARCH-P2 | behavioral/search tables |
| Recommendation có feedback | RECO-001/002 | recommendation read model/events |
| Review media/community | REVIEW-P2 | media/votes/reports/replies/history |
| Promotion public | PROMO-P2 | coupon public metadata |
| Notification preferences/devices | PREF/DEVICE | preferences/push devices |
| Marketing campaign | CAMPAIGN | campaign/run/recipient model |
| Chuyển hàng giữa kho | TRANSFER | transfer aggregate + ledger |
| Trả hàng nhà cung cấp | VRETURN | supplier-return aggregate + ledger |
| Import/export catalog | CIMPORT/CEXPORT | staging/jobs/artifacts |
| Export report | REXPORT | report jobs/artifacts |
| Tax/invoice | TAX/INVOICE | tax snapshots/invoice aggregate |

---

## 17. Recommended P2 Implementation Order

1. **Foundation:** outbox, generic job model, artifact storage, feature flags và permission migrations.
2. **Security:** pending email change, MFA, credential/session version.
3. **Privacy:** export trước, deletion/anonymization sau legal review.
4. **Low-risk customer value:** wishlist cart transfer, guest reorder, product alerts.
5. **Collection migration:** multi-wishlist/share links.
6. **Community:** review withdrawal/media/votes/reports/replies.
7. **Consent platform:** preferences, devices và suppression.
8. **Marketing:** public promotions và campaigns.
9. **Inventory:** stock-transfer aggregate; reconciliation/load tests trước rollout nhiều kho.
10. **Procurement:** supplier-return + credit settlement.
11. **Async operations:** catalog import/export và report export.
12. **Legal/accounting:** tax snapshots và invoice provider cuối cùng sau sign-off.
13. **Personalization:** behavioral data/recommendation sau khi consent và data quality ổn định.

Không triển khai tất cả P2 trong một release. Mỗi domain là một Epic, có migration, feature flag và rollback riêng.

---

## 18. Definition of Done for Every P2 Endpoint

Một endpoint P2 chỉ Done khi:

- Không trùng normalized method + route với P0/P1/P2.
- Migration/schema prerequisite đã deploy; không dùng table giả.
- Backfill và rollback/forward-fix plan được test.
- Permission/ownership/step-up được chốt.
- State machine và illegal transitions có test.
- Idempotency replay/payload conflict có test khi áp dụng.
- Transaction/outbox boundary có integration test.
- Race test cho use-once token, vote, job lease, transfer, invoice.
- Object upload/download có scan, checksum, signed URL và retention.
- PII/consent/legal policy được review.
- Audit không chứa secret/raw credential/token.
- Query/index/load test đạt SLO.
- Worker retry/dead-letter/reconciliation được giám sát.
- API/OpenAPI, QA acceptance criteria, runbook và alert được cập nhật.
- Feature flag có rollout/rollback plan.

### 18.1 Mandatory tests by domain

| Domain | Test bắt buộc |
|---|---|
| Email/MFA | Token/challenge replay, race, expiry, recovery-code consume |
| Privacy | Cross-user download, artifact expiry, legal hold |
| Wishlist/share | Token revoke/expiry, item limit race, privacy masking |
| Alerts | Duplicate subscription, consent revoked before send |
| Recommendation | Wrong user/item feedback, fallback availability |
| Reviews | Media scan, self-vote, duplicate report, withdraw aggregate invalidation |
| Campaign | Consent/suppression, duplicate scheduler run, cancel while running |
| Transfer | Double dispatch/receive, partial receive, wrong unit/warehouse |
| Supplier return | Wrong provenance, double stock-out, settlement mismatch |
| Import | Formula injection, invalid SKU, cancel checkpoint, partial failure |
| Export | Permission revoked after job complete, signed URL expiry |
| Invoice | Duplicate issue/void callback, wrong totals, owner download |

---

## 19. Final Architectural Position

P2 không thể là “thêm Controller rồi chạy”. Phần lớn P2 tạo aggregate và lifecycle mới:

- MFA/Privacy cần security state bền vững.
- Multi-wishlist cần migration từ relationship phẳng.
- Personalization cần consent và behavioral retention.
- Review extension cần moderation/history/media safety.
- Campaign cần audience snapshot, suppression và job idempotency.
- Transfer/supplier return cần aggregate riêng trước khi ghi ledger.
- Import/export cần staging, worker lease và artifact lifecycle.
- Invoice cần tax snapshot và provider idempotency.

Chỉ WISH-P2-001 và ORDER-P2-001 gần như có thể triển khai trên current schema. Các endpoint còn lại phải đi sau migration gate tương ứng. Đây là ranh giới giúp P2 có thể trở thành backlog kỹ thuật thực tế thay vì danh sách tính năng không có dữ liệu để vận hành.
