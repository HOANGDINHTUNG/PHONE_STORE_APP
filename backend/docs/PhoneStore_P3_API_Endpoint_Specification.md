# PHONE STORE P3 API ENDPOINT SPECIFICATION

**Project:** Phone Store E-Commerce, Marketplace & Omnichannel Platform  
**API style:** REST-oriented HTTP API  
**Base path:** /api/v1  
**Database source:** PhoneStore_Enterprise_Schema.sql  
**P0 baseline:** PhoneStore_P0_API_Endpoint_Specification.md  
**P1 baseline:** PhoneStore_P1_API_Endpoint_Specification.md  
**P2 baseline:** PhoneStore_P2_API_Endpoint_Specification.md  
**Document version:** 1.0  
**Scope:** P3 — strategic expansion after P0, P1 and P2 are stable

---

## Document Map

1. Mục đích và giới hạn của P3.
2. Điều kiện khởi động và delivery gates.
3. Phân tích khoảng trống giữa DB hiện tại và mô hình P3.
4. Quy tắc API chung và kiểm soát chống trùng P0–P2.
5. Marketplace đa nhà bán hàng.
6. Omnichannel retail store và POS.
7. Trả góp/BNPL và service subscription.
8. Fraud, risk case, dispute và chargeback.
9. International commerce và localization.
10. Customer support và AI-assisted operations.
11. Partner API client và outbound webhook.
12. Schema/service blueprint bắt buộc.
13. Permission blueprint.
14. Workflow liên miền và nguyên tắc sở hữu dữ liệu.
15. Security, legal, accounting và AI governance.
16. Lộ trình triển khai và chiến lược kiểm thử.
17. Traceability, Definition of Done và ranh giới cuối.

---

## 1. Mục đích tài liệu

Tài liệu này định nghĩa lớp P3 sau 164 endpoint P0, 60 endpoint P1 và 102 endpoint P2. P3 không phải danh sách chức năng “càng nhiều càng tốt”; đây là những thay đổi làm hệ thống chuyển sang mô hình kinh doanh lớn hơn:

- Từ retailer một nhà bán sang marketplace đa nhà bán.
- Từ web/mobile sang bán hàng đa kênh có cửa hàng vật lý và POS.
- Từ thanh toán một lần sang tài trợ mua hàng và dịch vụ định kỳ.
- Từ kiểm soát thủ công sang quản trị fraud, dispute và chargeback có bằng chứng.
- Từ một thị trường sang đa ngôn ngữ, đa tiền tệ và cross-border quote.
- Từ notification đơn giản sang support ticket có AI hỗ trợ nhưng con người kiểm soát.
- Từ integration ad-hoc sang API client và outbound webhook được quản trị.

P3 chỉ nên được khởi động khi P0/P1/P2 có số liệu chứng minh nhu cầu. Không tách microservice hoặc mở marketplace chỉ để hồ sơ “trông enterprise”.

---

## 2. P3 Definition and Delivery Gates

### 2.1 Điều kiện khởi động

Một initiative P3 chỉ được đưa vào delivery khi có đủ:

1. Business owner và KPI rõ ràng.
2. Domain owner chịu trách nhiệm dữ liệu và state machine.
3. Migration plan, backfill plan, rollback plan và reconciliation plan.
4. Legal/accounting/security sign-off nếu có tiền, tín dụng, KYC, dữ liệu nhạy cảm hoặc AI.
5. Observability, audit và runbook vận hành.
6. P0–P2 liên quan đã ổn định; không có lỗi nghiêm trọng chưa xử lý trong order/payment/inventory/RBAC.

### 2.2 Gate sử dụng trong tài liệu

| Gate | Ý nghĩa |
|---|---|
| BUSINESS-MODEL | Phải được phê duyệt vì thay đổi mô hình doanh thu, trách nhiệm hoặc SLA |
| SCHEMA | Phải migration DB trước khi expose endpoint |
| INFRA | Cần queue, cache, object storage, device sync, secret manager hoặc service chuyên dụng |
| PARTNER | Phụ thuộc hợp đồng và sandbox/certification của đối tác |
| LEGAL | Cần pháp lý, thuế, KYC/AML, privacy hoặc kế toán phê duyệt |
| AI-GOVERNANCE | Cần policy dữ liệu, đánh giá model, human approval và audit AI |

Không endpoint P3 nào được coi là CURRENT-SCHEMA. DB hiện tại chỉ là nền tham chiếu để thiết kế migration.

### 2.3 Ngoài phạm vi

- Crypto, token hoặc ví tài sản số.
- Cho hệ thống tự cấp tín dụng nếu chưa có giấy phép và năng lực quản trị rủi ro.
- AI tự hoàn tiền, thay đổi quyền, điều chỉnh kho hoặc khóa tài khoản không qua policy/human approval.
- Đồng bộ POS bằng cách cho máy bán hàng kết nối trực tiếp database production.
- Cho seller sửa catalog chuẩn tùy ý làm hỏng dữ liệu dùng chung.
- Tách service theo từng bảng khi chưa có ranh giới nghiệp vụ và nhu cầu scale độc lập.

---

## 3. Database Gap Analysis

### 3.1 Những giả định hiện tại phải thay đổi

| DB hiện tại | Giả định hiện tại | Khoảng trống P3 |
|---|---|---|
| products, product_variants | Catalog và giá thuộc retailer | Marketplace cần global catalog tách khỏi seller offer, price, stock và SLA |
| warehouse_inventories | Tồn kho chỉ theo warehouse + variant | Chưa xác định chủ sở hữu hàng, seller, store hoặc fulfillment model |
| orders, order_items | Một order có một chủ thể fulfillment | Marketplace cần platform order tách thành seller order và settlement |
| source_channel WEB/MOBILE/ADMIN | Không có cửa hàng/POS | Cần POS channel, store, register, shift, cash reconciliation và offline idempotency |
| payment_method COD/BANK_TRANSFER/MOMO/VNPAY | Thanh toán một lần | Chưa có BNPL/installment, recurring mandate hoặc provider application |
| refunds | Hoàn tiền do merchant chủ động | Chargeback/dispute do issuer/provider khởi tạo là nghiệp vụ khác |
| users + staff_profiles | Nhân sự nội bộ | Seller staff/partner identity không nên nhét vào staff_profiles |
| products/categories/brands | Một ngôn ngữ | Chưa có localization, market visibility, currency và FX snapshot |
| notifications | Thông báo một chiều | Chưa có support ticket, message thread, assignment hoặc SLA |
| payment_webhook_events | Chỉ inbound payment webhook | Chưa có outbound subscription/delivery/retry/signature cho đối tác |

### 3.2 Quyết định mô hình bắt buộc

- Catalog chuẩn do platform quản trị; seller chỉ tạo offer gắn vào variant đã duyệt.
- Mỗi order marketplace có platform order và một hoặc nhiều seller_order; order_item phải giữ snapshot seller/offer/commission.
- Inventory phải biết owner và fulfillment node. Không thêm seller_id mơ hồ vào warehouse_inventories rồi coi như xong.
- Store có mapping rõ với warehouse/fulfillment node; register và shift là resource riêng.
- BNPL application, fraud decision và dispute không được ép vào payments.status.
- Currency phải được snapshot tại quote/order/payment/refund/settlement; không quy đổi lại lịch sử bằng tỷ giá hiện tại.
- AI chỉ tạo draft, summary hoặc proposed action; command nghiệp vụ vẫn đi qua endpoint chuẩn và permission chuẩn.

---

## 4. Shared API Rules

### 4.1 Kế thừa P0–P2

P3 kế thừa toàn bộ quy tắc về authentication, RBAC default-deny, ownership, organizational scope, pagination, allowlist filter/sort/patch, error envelope, correlation ID, UTC, decimal money, audit, idempotency và outbox-after-commit.

### 4.2 HTTP method và status semantics

| Method | Dùng cho | Success thường dùng |
|---|---|---|
| GET | Đọc resource, không gây side effect nghiệp vụ | 200 |
| POST | Tạo resource hoặc command có chuyển trạng thái | 201, 202, 200 hoặc 204 |
| PATCH | Cập nhật một phần resource/status theo allowlist | 200 hoặc 204 |
| PUT | Upsert toàn bộ representation có natural key rõ | 200 hoặc 201 |
| DELETE | Revoke/remove association; không xóa ledger/audit | 204 |

Command nhận retry phải hỗ trợ Idempotency-Key. Webhook và offline sync dùng event/operation identifier của nguồn để chống xử lý lặp.

### 4.3 Tổng phạm vi

Tài liệu gồm **114 endpoint P3**:

- GET: 50.
- POST: 48.
- PATCH: 10.
- PUT: 4.
- DELETE: 2.

| Domain | Endpoint |
|---|---:|
| Marketplace & seller ecosystem | 25 |
| Omnichannel POS | 19 |
| Financing & service subscription | 14 |
| Fraud, risk & dispute | 18 |
| International commerce | 12 |
| Support & AI-assisted operations | 12 |
| Partner integrations | 14 |
| **Total** | **114** |

---

## 5. Marketplace and Seller Ecosystem APIs

### 5.1 Endpoint inventory

| ID | Method | Endpoint | Actor | Success | Gate |
|---|---|---|---|---|---|
| SELLER-001 | POST | /seller-applications | Authenticated customer/business representative | 201 | BUSINESS-MODEL/SCHEMA/LEGAL |
| SELLER-002 | GET | /me/seller-application | Application owner | 200 | SCHEMA |
| SELLER-ADM-001 | GET | /admin/seller-applications | Marketplace onboarding staff | 200 | SCHEMA |
| SELLER-ADM-002 | GET | /admin/seller-applications/{applicationId} | Marketplace onboarding staff | 200 | SCHEMA |
| SELLER-ADM-003 | POST | /admin/seller-applications/{applicationId}/approve | Authorized approver | 200 | BUSINESS-MODEL/LEGAL |
| SELLER-ADM-004 | POST | /admin/seller-applications/{applicationId}/reject | Authorized approver | 200 | LEGAL |
| SELLER-PORTAL-001 | GET | /seller/profile | Seller member | 200 | SCHEMA |
| SELLER-PORTAL-002 | PATCH | /seller/profile | Seller admin | 200 | SCHEMA |
| SELLER-PORTAL-003 | GET | /seller/staff | Seller admin | 200 | SCHEMA |
| SELLER-PORTAL-004 | POST | /seller/staff-invitations | Seller admin | 201 | SCHEMA |
| SELLER-PORTAL-005 | DELETE | /seller/staff/{userId} | Seller admin | 204 | SCHEMA |
| OFFER-001 | GET | /seller/offers | Seller catalog staff | 200 | SCHEMA |
| OFFER-002 | POST | /seller/offers | Seller catalog staff | 201 | SCHEMA |
| OFFER-003 | GET | /seller/offers/{offerId} | Seller member | 200 | SCHEMA |
| OFFER-004 | PATCH | /seller/offers/{offerId} | Seller catalog staff | 200 | SCHEMA |
| OFFER-005 | POST | /seller/offers/{offerId}/activate | Seller catalog staff | 200 | SCHEMA |
| OFFER-006 | POST | /seller/offers/{offerId}/deactivate | Seller catalog staff | 200 | SCHEMA |
| OFFER-PUB-001 | GET | /products/{slug}/offers | Public | 200 | BUSINESS-MODEL/SCHEMA |
| MORDER-001 | GET | /seller/orders | Seller order staff | 200 | SCHEMA |
| MORDER-002 | GET | /seller/orders/{sellerOrderId} | Seller order staff | 200 | SCHEMA |
| MORDER-003 | POST | /seller/orders/{sellerOrderId}/accept | Seller order staff | 200 | SCHEMA |
| MORDER-004 | POST | /seller/orders/{sellerOrderId}/reject | Seller order staff | 200 | SCHEMA |
| PAYOUT-001 | GET | /seller/payouts | Seller finance staff | 200 | SCHEMA/LEGAL |
| PAYOUT-002 | GET | /seller/payouts/{payoutId} | Seller finance staff | 200 | SCHEMA/LEGAL |
| COMMISSION-001 | GET | /seller/commission-statements | Seller finance staff | 200 | SCHEMA/LEGAL |

### 5.2 Required domain model

Tối thiểu cần sellers, seller_applications, seller_application_documents, seller_memberships, seller_offers, seller_orders, seller_order_items, commission_rules, settlement_entries, seller_payouts và payout_items. Tài liệu pháp lý chỉ lưu object key + metadata; file đặt trong private object storage.

### SELLER-001 — Submit Seller Application

- Nhận legal entity, tax identity, representative, payout profile token và document references.
- Một legal identity không được có nhiều hồ sơ active; kiểm tra cả mã số thuế đã normalize.
- Trạng thái khởi tạo DRAFT hoặc SUBMITTED; hồ sơ SUBMITTED trở thành snapshot không sửa ngầm.
- Không lưu raw bank credential. KYC/AML chạy async và lưu provider reference/result tối thiểu.

**Errors:** 409 ACTIVE_APPLICATION_EXISTS, 422 DOCUMENT_INCOMPLETE, 451 SELLER_REGION_NOT_SUPPORTED.

### SELLER-002 — Get My Seller Application

Chỉ chủ hồ sơ được xem trạng thái, danh sách yêu cầu bổ sung, timeline và rejection reason có thể công bố. Không trả internal risk note, reviewer identity nhạy cảm hoặc provider raw response.

### SELLER-ADM-001 — List Seller Applications

Cho phép filter allowlist theo status, submitted_at, country và risk band; pagination bắt buộc. Scope reviewer theo organization và không trả tài liệu nhạy cảm trong list response.

### SELLER-ADM-002 — Get Seller Application Detail

Trả hồ sơ, document metadata, verification summary, checklist và audit timeline. Mở/download tài liệu phải dùng signed URL thời hạn ngắn và audit riêng.

### SELLER-ADM-003 — Approve Seller Application

- Lock application; chỉ SUBMITTED/UNDER_REVIEW được approve.
- Bắt buộc checklist KYC, tax và payout đạt policy; high-risk có maker-checker.
- Tạo seller + seller admin membership trong cùng transaction, phát outbox sau commit.
- Approval là command idempotent; không tạo seller trùng khi retry.

### SELLER-ADM-004 — Reject Seller Application

Yêu cầu reason_code chuẩn hóa và public_message đã duyệt. Không ghi bí mật fraud model vào thông báo. Rejection không xóa tài liệu trước retention deadline.

### SELLER-PORTAL-001 — Get Seller Profile

Trả profile, verification state, operational status, fulfillment capabilities và payout readiness. Không trả secret/token ngân hàng.

### SELLER-PORTAL-002 — Update Seller Profile

Chỉ patch field không pháp lý như display name, support contact và SLA preference. Legal name, tax ID, bank beneficiary hoặc country phải đi change-review workflow, không sửa trực tiếp.

### SELLER-PORTAL-003 — List Seller Staff

Trả seller membership, seller-scoped roles, invitation state và last activity an toàn. Không trộn với staff_profiles của nhân viên nội bộ platform.

### SELLER-PORTAL-004 — Invite Seller Staff

- Invite bind seller_id, normalized_email, role set, expiry và inviter.
- Không cấp role vượt quá quyền delegable của người mời.
- Acceptance phải xác minh email và chống replay; cùng email có thể thuộc nhiều seller qua membership khác nhau.

### SELLER-PORTAL-005 — Remove Seller Staff

Revoke membership, seller-scoped sessions và quyền truy cập tài liệu. Không cho tự xóa seller admin cuối cùng; lịch sử action vẫn giữ nguyên.

### OFFER-001 — List My Seller Offers

Filter theo SKU/variant, status, stock state và validation error. Response tách offered_price, seller_stock, fulfillment SLA và catalog publication state.

### OFFER-002 — Create Seller Offer

- Gắn offer vào product_variant đã được platform duyệt; seller không tự nhân bản global catalog.
- Validate currency, price floor/ceiling, warranty, lead time và fulfillment model.
- Unique active identity tối thiểu seller_id + variant_id + fulfillment_model.
- Offer mới ở DRAFT/PENDING_REVIEW; không tự hiện public.

### OFFER-003 — Get Seller Offer

Trả cấu hình offer, validation findings, stock summary, fee preview và lifecycle timeline trong seller scope.

### OFFER-004 — Update Seller Offer

Patch allowlist cho price, lead time, quantity policy và seller warranty. Thay đổi nhạy cảm có thể chuyển về PENDING_REVIEW; dùng version/ETag để tránh lost update.

### OFFER-005 — Activate Seller Offer

Chỉ ACTIVE khi seller active, catalog variant active, price hợp lệ, stock/fulfillment ready và không có compliance hold. Activation phải audit và phát offer.activated.

### OFFER-006 — Deactivate Seller Offer

Ngăn order mới nhưng không làm mất reservation/order đã tạo. Deactivate reason phân biệt seller action, stock outage và compliance suspension.

### OFFER-PUB-001 — List Public Offers for Product

Chỉ trả offer sellable theo market, stock, seller status và customer location. Ranking phải minh bạch theo policy; response nêu seller, price, shipping promise, warranty và total landed estimate, không chỉ giá niêm yết.

### MORDER-001 — List Seller Orders

Chỉ trả seller_order thuộc seller hiện tại. Filter theo status, SLA breach, fulfillment node và created_at; PII khách hàng được data-minimize theo giai đoạn fulfillment.

### MORDER-002 — Get Seller Order Detail

Trả seller-owned items, allocated units, shipping instruction, fee/commission snapshot và timeline. Không lộ item, payment detail hoặc seller khác trong platform order.

### MORDER-003 — Accept Seller Order

- Lock seller_order; chỉ PENDING_ACCEPTANCE được accept.
- Revalidate stock/reservation và acceptance deadline.
- Chuyển ACCEPTED/PREPARING, giữ commission snapshot và phát event sau commit.
- Retry cùng idempotency key không được double allocate inventory.

### MORDER-004 — Reject Seller Order

Chỉ cho reject trước fulfillment với reason code hợp lệ. Release seller reservation atomically; platform orchestration quyết định tìm offer thay thế, partial cancel hoặc cancel toàn order. Seller không tự sửa platform order.

### PAYOUT-001 — List Seller Payouts

Trả payout period, gross sales, refunds, commission, adjustments, reserve và net amount theo currency. Không tính toán lại từ order live; chỉ đọc settlement ledger đã khóa kỳ.

### PAYOUT-002 — Get Seller Payout Detail

Trả payout items, provider transfer reference, status timeline và reconciliation difference. Bank account chỉ mask; mọi điều chỉnh phải trỏ settlement entry nguồn.

### COMMISSION-001 — List Commission Statements

Trả statement bất biến theo kỳ và version commission rule đã áp dụng. Adjustment sau khi chốt kỳ xuất hiện ở statement sau, không sửa lịch sử im lặng.

### 5.3 Marketplace critical workflow

1. Customer đặt platform order từ một hoặc nhiều offer.
2. Checkout snapshot seller, offer, price, commission, tax và fulfillment promise vào order item.
3. Orchestrator tạo seller_order theo seller/fulfillment model và reservation tương ứng.
4. Seller accept/reject trong SLA; platform xử lý thay thế/cancel theo policy.
5. Shipment và return vẫn liên kết platform order nhưng phân bổ đến seller_order/item.
6. Khi điều kiện settlement đạt, hệ thống ghi ledger entry; payout chỉ tổng hợp ledger đã reconcile.
7. Refund, return hoặc chargeback tạo entry đảo/điều chỉnh, không sửa doanh thu kỳ trước.

---

## 6. Omnichannel Retail Store and POS APIs

### 6.1 Endpoint inventory

| ID | Method | Endpoint | Actor | Success | Gate |
|---|---|---|---|---|---|
| STORE-001 | GET | /admin/retail-stores | Retail operations | 200 | BUSINESS-MODEL/SCHEMA |
| STORE-002 | POST | /admin/retail-stores | Retail administrator | 201 | SCHEMA |
| STORE-003 | GET | /admin/retail-stores/{storeId} | Retail operations | 200 | SCHEMA |
| STORE-004 | PATCH | /admin/retail-stores/{storeId} | Retail administrator | 200 | SCHEMA |
| STORE-005 | PATCH | /admin/retail-stores/{storeId}/status | Retail administrator | 200 | SCHEMA |
| REGISTER-001 | GET | /admin/retail-stores/{storeId}/registers | Retail operations | 200 | SCHEMA |
| REGISTER-002 | POST | /admin/retail-stores/{storeId}/registers | Retail administrator | 201 | SCHEMA/INFRA |
| REGISTER-003 | PATCH | /admin/registers/{registerId} | Retail administrator | 200 | SCHEMA/INFRA |
| SHIFT-001 | POST | /pos/registers/{registerId}/shifts/open | Assigned cashier | 201 | SCHEMA |
| SHIFT-002 | GET | /pos/registers/{registerId}/shifts/current | Assigned cashier/manager | 200 | SCHEMA |
| SHIFT-003 | POST | /pos/registers/{registerId}/shifts/current/close | Assigned cashier/manager | 200 | SCHEMA |
| POSSALE-001 | POST | /pos/sales/quotes | POS cashier | 200 | SCHEMA |
| POSSALE-002 | POST | /pos/sales | POS cashier | 201 | SCHEMA |
| POSSALE-003 | GET | /pos/sales/{saleId} | Store-scoped staff | 200 | SCHEMA |
| POSSALE-004 | POST | /pos/sales/{saleId}/payments | POS cashier | 201 | SCHEMA/PARTNER |
| POSSALE-005 | POST | /pos/sales/{saleId}/complete | POS cashier | 200 | SCHEMA |
| POSSALE-006 | POST | /pos/sales/{saleId}/void | Store manager | 200 | SCHEMA |
| SYNC-001 | POST | /pos/offline-sync-batches | Registered POS device | 202 | SCHEMA/INFRA |
| SYNC-002 | GET | /pos/offline-sync-batches/{batchId} | Registered POS device/store manager | 200 | SCHEMA/INFRA |

### 6.2 Required domain model

Cần retail_stores, store_warehouse_mappings, pos_registers, pos_devices, pos_shifts, cash_movements, pos_sales, pos_sale_items, pos_payment_tenders, pos_receipts, offline_sync_batches và offline_operations. orders.source_channel phải hỗ trợ POS; mọi sale hoàn tất cần liên kết order hoặc sales ledger canonical, không duy trì hai sự thật độc lập.

### STORE-001 — List Retail Stores

Filter theo status, region, capability và assigned organization. Response có timezone, fulfillment mapping và operational health; không trả credential thiết bị.

### STORE-002 — Create Retail Store

- Validate store_code unique, legal address, timezone, tax configuration và organization scope.
- Bắt buộc mapping inventory/warehouse rõ; không mặc định chọn warehouse đầu tiên.
- Store khởi tạo DRAFT/INACTIVE cho đến khi register, staff, stock và fiscal setup đạt readiness checklist.

### STORE-003 — Get Retail Store

Trả profile, opening hours, warehouse mapping, enabled tender, register summary và readiness findings. Financial totals chỉ trả nếu actor có permission riêng.

### STORE-004 — Update Retail Store

Patch allowlist cho contact, hours và operational configuration. Đổi timezone, legal entity, tax regime hoặc warehouse mapping cần controlled change vì ảnh hưởng báo cáo và inventory.

### STORE-005 — Change Retail Store Status

State machine DRAFT → ACTIVE ↔ TEMPORARILY_CLOSED → INACTIVE. Không deactivate nếu còn shift mở, offline batch chưa xử lý hoặc cash chưa reconcile; emergency closure phải ghi reason/audit.

### REGISTER-001 — List Store Registers

Trả register code, device binding, status, current shift và last sync. Không trả device secret, certificate hoặc refresh credential.

### REGISTER-002 — Create Register

Tạo register dưới đúng store scope, code unique trong store và tender capability. Device enrollment là bước riêng có one-time credential; response không chứa secret lâu dài.

### REGISTER-003 — Update Register

Cho đổi label, capability, status và device binding theo policy. Không chuyển register sang store khác nếu có sale/shift; revoke device session khi rebind.

### SHIFT-001 — Open POS Shift

- Register và store phải ACTIVE; cashier có assignment tại store.
- Mỗi register chỉ một shift OPEN, mỗi opening request chống lặp bằng Idempotency-Key.
- Ghi opening cash theo currency/tender; manager approval nếu lệch policy.
- Snapshot cashier, register, store, timezone và business date.

### SHIFT-002 — Get Current POS Shift

Trả shift state, opened_at, business date, tender totals kỳ vọng, sync health và warnings. Cashier không được xem dữ liệu store khác hoặc thông tin kiểm soát fraud nội bộ.

### SHIFT-003 — Close POS Shift

- Chặn close khi sale dang dở hoặc offline operation chưa upload theo policy.
- Nhận counted tender totals, tính variance với system totals và yêu cầu reason/manager approval khi vượt ngưỡng.
- Sau close, shift bất biến; correction đi qua adjustment entry, không patch lịch sử.

### POSSALE-001 — Create POS Sale Quote

Nhận scanned SKU/IMEI, quantity, customer optional, coupon và tender context. Server định giá, tax, promotion, availability và serial eligibility; client POS không tự gửi total đáng tin cậy.

### POSSALE-002 — Create POS Sale

- Yêu cầu open shift và quote còn hiệu lực hoặc reprice.
- Tạo POS sale/order DRAFT, reserve store inventory và snapshot price/tax/promotion.
- Serialized item chỉ attach unit hợp lệ tại đúng store; không bán một IMEI hai lần.
- client_sale_id + device_id là unique idempotency boundary cho cả online/offline replay.

### POSSALE-003 — Get POS Sale

Trả item, reservation, tender, receipt và timeline theo store scope. PII khách được mask theo permission; raw card data tuyệt đối không xuất hiện.

### POSSALE-004 — Add POS Payment Tender

Hỗ trợ split tender theo policy; mỗi tender là append-only attempt. Tổng captured không vượt amount due; card/e-wallet qua terminal/provider token, không lưu PAN/CVV. Retry phải dùng external reference và idempotency key.

### POSSALE-005 — Complete POS Sale

Lock sale, recheck đủ payment/approved credit, consume reservation, assign serialized units, finalize order và tạo fiscal receipt/outbox atomically. Nếu external receipt phát hành async, response nêu trạng thái PENDING chứ không giả thành công.

### POSSALE-006 — Void POS Sale

Chỉ void sale chưa hoàn tất theo policy. Sau completion phải dùng return/refund P0/P1, không xóa sale. Void giải phóng reservation, hủy tender phù hợp và yêu cầu manager permission/reason.

### SYNC-001 — Submit Offline POS Sync Batch

- Batch bind device certificate, store, register, sequence range và content hash.
- Mỗi operation có immutable local_operation_id; server xử lý idempotent và theo dependency order.
- Client-provided price/discount chỉ là proposal; server revalidate theo offline policy và signed price book version.
- Conflict không được silently last-write-wins với inventory/payment; trả per-operation disposition.

### SYNC-002 — Get Offline Sync Batch Result

Trả RECEIVED/PROCESSING/PARTIAL/SUCCEEDED/FAILED cùng kết quả từng operation, canonical IDs và remediation code. Không trả stack trace hoặc dữ liệu operation của thiết bị khác.

### 6.3 Offline conflict policy

| Tình huống | Xử lý bắt buộc |
|---|---|
| Batch gửi lại | Trả kết quả cũ theo device_id + batch_id/hash |
| Trùng local sale | Không tạo order/payment lần hai |
| IMEI đã bán nơi khác | Quarantine conflict, không âm thầm thay unit |
| Price book hết hạn | Áp dụng signed offline tolerance hoặc yêu cầu manager review |
| Payment chưa xác minh | Giữ sale PENDING_RECONCILIATION, không coi là settled |
| Sequence bị thiếu | Tạm dừng operation phụ thuộc và yêu cầu resend range |

---

## 7. Financing, BNPL and Service Subscription APIs

### 7.1 Endpoint inventory

| ID | Method | Endpoint | Actor | Success | Gate |
|---|---|---|---|---|---|
| CREDIT-001 | POST | /orders/{orderCode}/financing-quotes | Order owner | 200 | BUSINESS-MODEL/PARTNER/LEGAL |
| CREDIT-002 | POST | /financing-applications | Authenticated applicant | 201/202 | SCHEMA/PARTNER/LEGAL |
| CREDIT-003 | GET | /me/financing-applications | Applicant | 200 | SCHEMA/LEGAL |
| CREDIT-004 | GET | /me/financing-applications/{applicationId} | Applicant | 200 | SCHEMA/LEGAL |
| CREDIT-WEBHOOK-001 | POST | /webhooks/financing/{providerCode} | Verified financing provider | 200 | PARTNER/SCHEMA |
| CREDIT-ADM-001 | GET | /admin/financing-applications | Finance/risk staff | 200 | SCHEMA/LEGAL |
| CREDIT-ADM-002 | GET | /admin/financing-applications/{applicationId} | Finance/risk staff | 200 | SCHEMA/LEGAL |
| PLAN-PUB-001 | GET | /service-plans | Public | 200 | BUSINESS-MODEL/SCHEMA |
| PLAN-PUB-002 | GET | /service-plans/{slug} | Public | 200 | BUSINESS-MODEL/SCHEMA |
| SUB-001 | POST | /orders/{orderCode}/service-plan-subscriptions | Order owner/staff | 201 | SCHEMA/PARTNER/LEGAL |
| SUB-002 | GET | /me/service-plan-subscriptions | Subscription owner | 200 | SCHEMA |
| SUB-003 | GET | /me/service-plan-subscriptions/{subscriptionId} | Subscription owner | 200 | SCHEMA |
| SUB-004 | POST | /me/service-plan-subscriptions/{subscriptionId}/cancel | Subscription owner | 200 | SCHEMA/LEGAL |
| SUB-WEBHOOK-001 | POST | /webhooks/subscriptions/{providerCode} | Verified billing provider | 200 | PARTNER/SCHEMA |

### 7.2 Required domain model

Cần financing_providers, financing_quotes, financing_applications, financing_events, service_plans, service_plan_prices, subscription_contracts, subscription_cycles, billing_mandates và subscription_events. payment_attempts.payment_method cần INSTALLMENT/BNPL hoặc reference rõ sang financing contract; không nhét hồ sơ tín dụng vào payment_attempts.

### CREDIT-001 — Get Financing Quotes for Order

- Order owner và order còn đủ điều kiện; quote dựa trên amount, item, market và provider eligibility.
- Trả down payment, term, installment estimate, APR/fees, expiry và disclosure reference.
- Quote chỉ là ước tính, không phải approval hoặc cam kết tín dụng.
- Không gửi dữ liệu định danh cho provider trước consent hợp lệ.

### CREDIT-002 — Submit Financing Application

- Bind applicant, order snapshot, selected quote, consent version và provider.
- Thu thập tối thiểu; dữ liệu credit nhạy cảm ưu tiên nhập/host tại provider và hệ thống chỉ giữ token/reference.
- Một application không được submit lại nhiều lần do retry.
- Order giữ PENDING_FINANCING với reservation TTL phù hợp, không chuyển PAID khi chưa có approval/funding.

### CREDIT-003 — List My Financing Applications

Trả provider display name, order reference, requested amount, public status và timestamps. Không trả score, internal risk reason hoặc raw provider payload.

### CREDIT-004 — Get My Financing Application

Trả disclosure, required next action, expiry và contract/reference có quyền xem. Adverse-action reason chỉ hiển thị theo nội dung pháp lý cho phép.

### CREDIT-WEBHOOK-001 — Receive Financing Provider Event

- Verify signature, timestamp, provider account và event_id trước khi xử lý.
- Persist inbox event unique provider_code + event_id rồi ACK nhanh.
- Worker áp dụng state transition APPROVED/DECLINED/EXPIRED/FUNDED/CANCELLED theo version/order.
- Event APPROVED không đồng nghĩa FUNDED nếu contract quy định khác; out-of-order phải reconcile.

### CREDIT-ADM-001 — List Financing Applications

Filter theo provider, public/internal status, aging và reconciliation state. PII/credit data field-level permission; export phải audit.

### CREDIT-ADM-002 — Get Financing Application Detail

Trả consent, provider timeline, order/payment linkage và reconciliation findings. Manual action nếu cần phải là command riêng có maker-checker; endpoint GET không side effect.

### PLAN-PUB-001 — List Service Plans

Chỉ trả plan ACTIVE áp dụng cho market/product context, coverage summary, billing cadence, exclusions và price. Service plan không được mô tả lẫn với manufacturer warranty.

### PLAN-PUB-002 — Get Service Plan Detail

Trả terms version, coverage, waiting period, claim limit, cancellation/refund rule và supported product. Terms dùng tại mua phải được snapshot/versioned.

### SUB-001 — Create Service Plan Subscription

- Verify order ownership, eligible item/IMEI, enrollment window và không có active plan trùng.
- Snapshot plan/terms/price/tax; tạo billing mandate token qua provider nếu recurring.
- Activation dựa trên paid/fulfilled policy; không coi subscription active chỉ vì record đã tạo.
- Idempotency theo order_item + plan + request key.

### SUB-002 — List My Service Plan Subscriptions

Trả plan, covered item, status, next billing date, entitlement và cancellation eligibility; payment instrument chỉ mask.

### SUB-003 — Get My Service Plan Subscription

Trả contract/terms version, billing cycles, entitlement usage và event timeline. Không lộ provider secret hoặc internal risk annotation.

### SUB-004 — Cancel My Service Plan Subscription

Áp dụng effective-now hoặc end-of-cycle đúng terms; tính refund/proration bằng versioned rule. Lưu cancellation reason, revoke future billing và không xóa lịch sử entitlement/claim.

### SUB-WEBHOOK-001 — Receive Subscription Billing Event

Verify signature và event uniqueness. Xử lý invoice paid/failed, mandate revoked, charge refunded theo state machine; retry/out-of-order không tạo hai billing cycle.

### 7.3 Financing order state rule

1. Quote không giữ hàng vĩnh viễn.
2. Application submit có reservation TTL riêng.
3. APPROVED chỉ cho phép bước contract/payment tiếp theo.
4. Chỉ FUNDED hoặc payment guarantee hợp lệ mới xác nhận phần thanh toán.
5. DECLINED/EXPIRED giải phóng reservation theo policy và cho khách chọn phương thức khác.
6. Refund/cancel phải thông báo provider và reconcile cả merchant payment lẫn credit contract.

---

## 8. Fraud, Risk Case, Dispute and Chargeback APIs

### 8.1 Endpoint inventory

| ID | Method | Endpoint | Actor | Success | Gate |
|---|---|---|---|---|---|
| RISK-001 | POST | /risk/sessions | Trusted web/mobile/POS client | 201 | BUSINESS-MODEL/SCHEMA/INFRA/LEGAL |
| RISK-002 | POST | /risk/events | Trusted client/server | 202 | SCHEMA/INFRA/LEGAL |
| RISK-INT-001 | POST | /internal/risk/decisions | Authorized internal service | 200 | SCHEMA/INFRA |
| RISK-ADM-001 | GET | /admin/risk-cases | Fraud operations | 200 | SCHEMA/LEGAL |
| RISK-ADM-002 | GET | /admin/risk-cases/{caseId} | Fraud operations | 200 | SCHEMA/LEGAL |
| RISK-ADM-003 | POST | /admin/risk-cases/{caseId}/assign | Fraud lead/analyst | 200 | SCHEMA |
| RISK-ADM-004 | POST | /admin/risk-cases/{caseId}/decision | Authorized fraud analyst | 200 | SCHEMA/LEGAL |
| RULE-001 | GET | /admin/risk-rules | Risk rule administrator | 200 | SCHEMA |
| RULE-002 | POST | /admin/risk-rules | Risk rule administrator | 201 | SCHEMA/LEGAL |
| RULE-003 | PATCH | /admin/risk-rules/{ruleId} | Risk rule administrator | 200 | SCHEMA/LEGAL |
| RULE-004 | PATCH | /admin/risk-rules/{ruleId}/status | Risk approver | 200 | SCHEMA/LEGAL |
| DISPUTE-001 | GET | /me/payment-disputes | Payment owner | 200 | SCHEMA/LEGAL |
| DISPUTE-002 | GET | /me/payment-disputes/{disputeId} | Payment owner | 200 | SCHEMA/LEGAL |
| DISPUTE-ADM-001 | GET | /admin/payment-disputes | Dispute operations | 200 | SCHEMA/LEGAL |
| DISPUTE-ADM-002 | GET | /admin/payment-disputes/{disputeId} | Dispute operations | 200 | SCHEMA/LEGAL |
| DISPUTE-ADM-003 | POST | /admin/payment-disputes/{disputeId}/evidence | Dispute operations | 201 | SCHEMA/INFRA/LEGAL |
| DISPUTE-ADM-004 | POST | /admin/payment-disputes/{disputeId}/submit | Authorized dispute staff | 202 | SCHEMA/PARTNER/LEGAL |
| DISPUTE-WEBHOOK-001 | POST | /webhooks/disputes/{providerCode} | Verified payment provider | 200 | SCHEMA/PARTNER |

### 8.2 Required domain model

Cần risk_sessions, risk_events, risk_assessments, risk_cases, risk_case_assignments, risk_rules, risk_rule_versions, risk_decisions, payment_disputes, dispute_events, dispute_evidence, dispute_submissions và financial_ledger_entries. Raw device signal có retention ngắn và access đặc biệt. refunds hiện tại vẫn giữ nguyên; dispute/chargeback là resource riêng.

### RISK-001 — Create Risk Session

- Tạo opaque risk_session_id bind anonymous/authenticated actor, channel, device và TTL.
- Không nhận kết luận fraud từ client; client chỉ gửi signal trong allowlist.
- Consent, notice và retention phải phù hợp thị trường; không thu fingerprint vượt mục đích.
- Secret/model feature nội bộ không trả cho client.

### RISK-002 — Ingest Risk Event

Nhận event chuẩn hóa như login, checkout, payment attempt hoặc account change. Event có event_id, occurred_at, schema version và risk_session_id; deduplicate, validate clock skew và queue sau khi persist. Endpoint 202 không cam kết đã ra decision.

### RISK-INT-001 — Request Internal Risk Decision

- Chỉ service identity được allowlist; không public cho browser.
- Input là resource reference và feature snapshot/version, không truyền toàn bộ PII tùy ý.
- Trả ALLOW, CHALLENGE, REVIEW hoặc DENY cùng decision_id, expiry và policy-safe reason codes.
- Timeout phải fail theo policy từng flow; payment không tự ALLOW chỉ vì risk service lỗi.

### RISK-ADM-001 — List Risk Cases

Filter theo queue, status, severity, SLA, assignee và resource type. List view chỉ trả signal summary; quyền xem PII và model detail tách riêng.

### RISK-ADM-002 — Get Risk Case Detail

Trả linked account/order/payment, evidence timeline, rule/model versions, prior decisions và allowed actions. Mọi truy cập case nhạy cảm phải audit; không hiển thị feature không giải thích được nếu policy cấm.

### RISK-ADM-003 — Assign Risk Case

Lock case và ghi assignment history; hỗ trợ claim/unassign/reassign có reason. Không cho analyst tự nhận case ngoài organization/region scope.

### RISK-ADM-004 — Record Risk Case Decision

- State machine OPEN/IN_REVIEW → ALLOW/CHALLENGE/DENY/CLOSED theo case type.
- Yêu cầu reason code, note, evidence references và version; high-impact action cần maker-checker.
- Decision không trực tiếp sửa order/account; phát policy command/event cho domain owner xử lý idempotent.
- Override model phải lưu người duyệt và không được xóa lịch sử dự đoán ban đầu.

### RULE-001 — List Risk Rules

Trả metadata, active version, mode, scope, priority và performance summary. Không trả secret feature hoặc raw code cho actor chỉ có quyền vận hành.

### RULE-002 — Create Risk Rule

Tạo rule DRAFT bằng DSL/condition allowlist; cấm raw SQL hoặc arbitrary code. Phải khai báo scope, action, priority, effective window, owner và test cases.

### RULE-003 — Update Risk Rule Draft

Chỉ sửa draft/version mới; active version bất biến. Validate conflict, unreachable condition, missing feature, performance budget và test fixtures trước khi review.

### RULE-004 — Change Risk Rule Status

Lifecycle DRAFT → SHADOW → ACTIVE → INACTIVE. Activation cần approver khác author theo policy, effective time và rollback version. SHADOW chỉ đo lường, không block transaction.

### DISPUTE-001 — List My Payment Disputes

Trả dispute công khai gắn payment/order, amount, currency, public status, deadline và action khách có thể thực hiện. Không hiển thị internal representment strategy.

### DISPUTE-002 — Get My Payment Dispute

Trả timeline và customer-safe explanation. Nếu cần khách cung cấp tài liệu, upload phải theo loại file/size, malware scan và signed URL; ownership kiểm tra ở cả metadata lẫn object access.

### DISPUTE-ADM-001 — List Payment Disputes

Filter theo provider, reason, stage, deadline, amount, currency, seller và assignee. Mặc định ưu tiên deadline gần; tổng tiền dùng currency-aware aggregation.

### DISPUTE-ADM-002 — Get Payment Dispute Detail

Trả provider events, payment/refund/shipment linkage, deadline, evidence checklist, seller allocation và ledger impact. Raw provider payload chỉ dành cho quyền điều tra.

### DISPUTE-ADM-003 — Add Dispute Evidence

- Evidence là append-only, có source, type, captured_at, checksum và document version.
- Validate relevance window, malware và PII; không cho sửa file đã submit.
- Order/shipment data dùng snapshot có provenance, không copy thủ công thiếu dấu vết.

### DISPUTE-ADM-004 — Submit Dispute Response

Lock dispute; kiểm tra stage, deadline, required evidence và maker-checker. Tạo immutable submission package rồi queue gửi provider. Retry không gửi hai representment; endpoint trả 202 khi provider chưa xác nhận.

### DISPUTE-WEBHOOK-001 — Receive Dispute Provider Event

Verify signature/timestamp và persist unique provider event. Áp dụng transition OPEN/WON/LOST/EXPIRED/REVERSED theo provider mapping; tạo ledger adjustment/outbox sau commit, không sửa refunds để giả lập chargeback.

### 8.3 Refund versus dispute versus chargeback

| Nghiệp vụ | Ai khởi tạo | Resource chuẩn | Ảnh hưởng tài chính |
|---|---|---|---|
| Refund | Merchant theo return/cancel | refunds | Merchant chủ động hoàn tiền |
| Dispute | Customer qua issuer/provider | payment_disputes | Tiền có thể bị hold; cần deadline/evidence |
| Chargeback | Provider/issuer quyết định debit | dispute event + ledger | Ghi debit/fee/reversal, có thể phân bổ seller |

Không cho một payment bị hoàn kép: trước refund/chargeback command phải kiểm tra tổng refunded, disputed, reversed và provider settlement.

---

## 9. International Commerce and Localization APIs

### 9.1 Endpoint inventory

| ID | Method | Endpoint | Actor | Success | Gate |
|---|---|---|---|---|---|
| LOCALE-001 | GET | /locales | Public | 200 | BUSINESS-MODEL/SCHEMA |
| CURRENCY-001 | GET | /currencies | Public | 200 | BUSINESS-MODEL/SCHEMA |
| FX-001 | GET | /exchange-rates | Public/authenticated | 200 | SCHEMA/PARTNER/LEGAL |
| COUNTRY-001 | GET | /shipping-countries | Public | 200 | BUSINESS-MODEL/SCHEMA/LEGAL |
| CROSS-001 | POST | /international-checkout-quotes | Customer/guest session | 200 | SCHEMA/PARTNER/LEGAL |
| CONTENT-ADM-001 | GET | /admin/catalog-localizations | Localization staff | 200 | SCHEMA |
| CONTENT-ADM-002 | PUT | /admin/products/{productId}/localizations/{locale} | Localization staff | 200/201 | SCHEMA |
| CONTENT-ADM-003 | PUT | /admin/categories/{categoryId}/localizations/{locale} | Localization staff | 200/201 | SCHEMA |
| CONTENT-ADM-004 | PUT | /admin/brands/{brandId}/localizations/{locale} | Localization staff | 200/201 | SCHEMA |
| FX-ADM-001 | POST | /admin/exchange-rate-imports | Finance administrator | 202 | SCHEMA/PARTNER |
| CUSTOMS-ADM-001 | GET | /admin/customs-classifications | Trade compliance staff | 200 | SCHEMA/LEGAL |
| CUSTOMS-ADM-002 | PUT | /admin/products/{productId}/customs-classification | Trade compliance staff | 200/201 | SCHEMA/LEGAL |

### 9.2 Required domain model

Cần locales, markets, currencies, exchange_rate_sets, exchange_rates, entity_localizations, market_catalog_visibility, customs_classifications, product_customs_profiles, international_quotes và quote_charge_components. Money-bearing tables cần transaction_currency, settlement_currency, decimal amount và exchange_rate_snapshot/ref; không dùng float.

### LOCALE-001 — List Supported Locales

Trả locale code chuẩn, display name, direction, fallback locale và market availability. Locale chỉ điều khiển ngôn ngữ/format; không tự thay đổi legal market hoặc currency.

### CURRENCY-001 — List Supported Currencies

Trả ISO code, minor units, display support và payment support theo market. “Có thể hiển thị” không đồng nghĩa provider có thể thu tiền bằng currency đó.

### FX-001 — Get Display Exchange Rates

Trả rate set/version, source, base/quote currency, effective_at và expiry cho mục đích display/quote. Không dùng endpoint public này để tái định giá order lịch sử hoặc accounting ledger.

### COUNTRY-001 — List Shipping Countries

Trả country/region được hỗ trợ, address requirements, restricted categories, shipping mode và duty model. Kết quả phụ thuộc market/config version và không phải cam kết giao mọi SKU.

### CROSS-001 — Create International Checkout Quote

- Nhận cart/offer references, destination, selected currency và shipping choice.
- Revalidate exportability, seller capability, stock, payment currency, sanctions/restrictions và address.
- Trả item amount, shipping, tax, estimated duty/fee, FX snapshot, Incoterm/duty model và expiry.
- Quote phải có quote_id/version; checkout P0 khi mở rộng phải consume và snapshot quote, không tự tính khác.

### CONTENT-ADM-001 — List Catalog Localization Coverage

Filter theo entity type, locale, publication state, missing/stale status và source version. Dùng để quản trị coverage, không trả toàn bộ content blob trong list.

### CONTENT-ADM-002 — Upsert Product Localization

PUT toàn bộ localized title, description, SEO fields theo product + locale. Validate source-product version, length, prohibited claims và translation status; optimistic concurrency ngăn ghi đè reviewer khác.

### CONTENT-ADM-003 — Upsert Category Localization

Upsert name, description và SEO metadata theo category + locale. Slug uniqueness phải theo locale/market policy; thay slug cần redirect mapping, không làm hỏng URL cũ.

### CONTENT-ADM-004 — Upsert Brand Localization

Upsert localized brand description và SEO metadata. Tên trademark chính chỉ được thay theo brand governance; localization không tạo brand mới.

### FX-ADM-001 — Import Exchange Rate Set

- Nhận provider file/reference, source timestamp, base currency và checksum.
- Worker validate completeness, duplicate pair, stale/outlier rate và decimal precision.
- Rate set mới ở DRAFT; activation theo maker-checker/schedule và bất biến sau sử dụng.
- Retry cùng source + version không tạo bộ tỷ giá trùng.

### CUSTOMS-ADM-001 — List Customs Classifications

Trả HS code/version, descriptions, country scope, duty metadata và effective period. Search/filter phải có version vì mã có thể đổi theo thời gian.

### CUSTOMS-ADM-002 — Upsert Product Customs Classification

Gắn product/variant với HS code, country of origin, material/battery flags và effective period. Yêu cầu evidence/reference và approver; classification lịch sử không bị overwrite khi đơn đã dùng.

### 9.3 Money and FX invariants

1. Mọi amount luôn đi cùng currency.
2. Quote lưu rate set/version và effective time.
3. Order lưu transaction currency + exact component amounts đã chấp nhận.
4. Payment/refund lưu provider currency và amount riêng.
5. Settlement/ledger lưu settlement currency và conversion entry.
6. Báo cáo không cộng trực tiếp nhiều currency; phải group hoặc quy đổi theo accounting rate đã chỉ định.

---

## 10. Customer Support and AI-Assisted Operations APIs

### 10.1 Endpoint inventory

| ID | Method | Endpoint | Actor | Success | Gate |
|---|---|---|---|---|---|
| TICKET-001 | POST | /support/tickets | Customer/guest with verified contact | 201 | BUSINESS-MODEL/SCHEMA |
| TICKET-002 | GET | /me/support-tickets | Authenticated customer | 200 | SCHEMA |
| TICKET-003 | GET | /me/support-tickets/{ticketId} | Ticket owner | 200 | SCHEMA |
| TICKET-004 | POST | /me/support-tickets/{ticketId}/messages | Ticket owner | 201 | SCHEMA |
| TICKET-005 | POST | /me/support-tickets/{ticketId}/close | Ticket owner | 200 | SCHEMA |
| TICKET-ADM-001 | GET | /admin/support-tickets | Support staff | 200 | SCHEMA |
| TICKET-ADM-002 | GET | /admin/support-tickets/{ticketId} | Support staff in scope | 200 | SCHEMA |
| TICKET-ADM-003 | POST | /admin/support-tickets/{ticketId}/assign | Support lead/agent | 200 | SCHEMA |
| TICKET-ADM-004 | PATCH | /admin/support-tickets/{ticketId}/status | Assigned support agent | 200 | SCHEMA |
| AI-001 | POST | /admin/support-tickets/{ticketId}/ai-draft | Authorized support agent | 202 | INFRA/AI-GOVERNANCE/LEGAL |
| AI-002 | POST | /admin/support-tickets/{ticketId}/ai-summary | Authorized support agent | 202 | INFRA/AI-GOVERNANCE/LEGAL |
| AI-003 | POST | /admin/support-tickets/{ticketId}/ai-actions/{actionId}/approve | Authorized human approver | 202 | INFRA/AI-GOVERNANCE |

### 10.2 Required domain model

Cần support_tickets, support_ticket_links, support_messages, support_attachments, support_assignments, support_sla_events, ai_runs, ai_artifacts, ai_proposed_actions và ai_action_approvals. Ticket message là append-only; attachment dùng object storage private. AI artifact phải lưu model/prompt/policy version và input provenance tối thiểu.

### TICKET-001 — Create Support Ticket

- Nhận category, subject, message, verified contact và optional order/payment/shipment/return reference.
- Server kiểm tra ownership của resource được liên kết; không tin order_code để lộ dữ liệu.
- Deduplicate/rate-limit spam nhưng không merge ticket gây mất message.
- Tạo SLA theo priority/category/channel và phát notification sau commit.

### TICKET-002 — List My Support Tickets

Trả ticket code, subject, public status, last message time, linked resource an toàn và unread count. Không trả internal note, assignment/risk metadata hoặc ticket người khác.

### TICKET-003 — Get My Support Ticket

Trả public message thread, attachment metadata, resolution và timeline. Internal message/AI draft bị loại tại query layer, không chỉ ẩn ở giao diện.

### TICKET-004 — Add Customer Ticket Message

Chỉ thêm vào ticket cho phép customer reply; message immutable và hỗ trợ client_message_id chống gửi lặp. Attachment phải scan trước khi agent download; reply có thể chuyển WAITING_CUSTOMER → OPEN theo state machine.

### TICKET-005 — Close My Support Ticket

Khách có thể close ticket đã giải quyết theo policy. Close không xóa thread; ticket có transaction đang xử lý chỉ đóng phần hội thoại, không hủy return/refund/warranty tương ứng.

### TICKET-ADM-001 — List Support Tickets

Filter theo queue, status, priority, SLA breach, assignee, seller/store và linked resource. Organization scope bắt buộc; seller support chỉ xem phần liên quan seller nếu business model cho phép.

### TICKET-ADM-002 — Get Support Ticket Detail

Trả public/internal messages, linked resource snapshot, customer context được phép, SLA và audit timeline. Việc xem PII nhạy cảm phải reason/audit; attachment URL ký ngắn hạn.

### TICKET-ADM-003 — Assign Support Ticket

Hỗ trợ claim, assign, transfer queue và unassign có reason. Lock/version ngăn hai agent cùng nhận; assignment thay đổi SLA/notification theo policy nhưng không làm mất owner history.

### TICKET-ADM-004 — Change Support Ticket Status

State machine OPEN/ASSIGNED/WAITING_CUSTOMER/WAITING_INTERNAL/RESOLVED/CLOSED. Status transition phải phù hợp actor và required resolution code; reopen là transition có lý do, không patch tùy ý.

### AI-001 — Generate AI Reply Draft

- Queue run trên ticket snapshot/version; chỉ lấy source đã allowlist và đã redact PII theo policy.
- Output là DRAFT, không tự gửi cho khách.
- Lưu model, prompt template, retrieval source, safety result và confidence/uncertainty.
- Nếu ticket đổi trong khi chạy, draft bị đánh dấu STALE để agent review lại.

### AI-002 — Generate AI Ticket Summary

Tạo summary có references đến message/resource nguồn, tách fact khỏi suggestion. Không được bịa trạng thái payment/refund; dữ liệu canonical phải lấy từ domain API, không suy luận từ lời khách.

### AI-003 — Approve AI Proposed Action

- Chỉ action type allowlist; approver phải có permission của command nghiệp vụ đích.
- Revalidate ticket/resource version, amount limit, state và segregation-of-duties.
- Approval không sửa DB trực tiếp; orchestration gọi endpoint P0/P1/P2/P3 chuẩn với idempotency key và actor human.
- Refund, role, account lock, inventory và payment có thể luôn yêu cầu bước duyệt bổ sung hoặc bị cấm AI đề xuất.

### 10.3 AI responsibility boundary

| AI được phép | AI không được phép |
|---|---|
| Tóm tắt hội thoại có nguồn | Tự đóng ticket để đạt SLA |
| Soạn câu trả lời nháp | Tự gửi nội dung pháp lý/tài chính |
| Đề xuất bước xử lý allowlist | Gọi thẳng DB hoặc provider |
| Trích dữ liệu canonical qua tool có quyền | Đoán trạng thái đơn/tiền từ ngôn ngữ tự nhiên |
| Gắn confidence và cảnh báo thiếu dữ kiện | Tự hoàn tiền, đổi quyền, chỉnh kho hoặc khóa tài khoản |

---

## 11. Partner API Client and Outbound Webhook APIs

### 11.1 Endpoint inventory

| ID | Method | Endpoint | Actor | Success | Gate |
|---|---|---|---|---|---|
| CLIENT-001 | GET | /admin/api-clients | Integration administrator | 200 | BUSINESS-MODEL/SCHEMA/INFRA |
| CLIENT-002 | POST | /admin/api-clients | Integration administrator | 201 | SCHEMA/INFRA/LEGAL |
| CLIENT-003 | GET | /admin/api-clients/{clientId} | Integration administrator | 200 | SCHEMA |
| CLIENT-004 | PATCH | /admin/api-clients/{clientId} | Integration administrator | 200 | SCHEMA |
| CLIENT-005 | POST | /admin/api-clients/{clientId}/rotate-secret | Integration security admin | 201 | INFRA |
| CLIENT-006 | POST | /admin/api-clients/{clientId}/revoke | Integration security admin | 200 | SCHEMA |
| WEBHOOKSUB-001 | GET | /admin/webhook-subscriptions | Integration administrator | 200 | SCHEMA/INFRA |
| WEBHOOKSUB-002 | POST | /admin/webhook-subscriptions | Integration administrator | 201 | SCHEMA/INFRA |
| WEBHOOKSUB-003 | GET | /admin/webhook-subscriptions/{subscriptionId} | Integration administrator | 200 | SCHEMA |
| WEBHOOKSUB-004 | PATCH | /admin/webhook-subscriptions/{subscriptionId} | Integration administrator | 200 | SCHEMA/INFRA |
| WEBHOOKSUB-005 | DELETE | /admin/webhook-subscriptions/{subscriptionId} | Integration administrator | 204 | SCHEMA |
| WEBHOOKDEL-001 | GET | /admin/webhook-deliveries | Integration operations | 200 | SCHEMA |
| WEBHOOKDEL-002 | GET | /admin/webhook-deliveries/{deliveryId} | Integration operations | 200 | SCHEMA |
| WEBHOOKDEL-003 | POST | /admin/webhook-deliveries/{deliveryId}/retry | Integration operations | 202 | INFRA |

### 11.2 Required domain model

Cần api_clients, api_client_credentials, api_client_scopes, webhook_subscriptions, webhook_subscription_events, webhook_secrets, webhook_deliveries và webhook_delivery_attempts. Secret dùng secret manager hoặc encrypted storage; DB chỉ giữ hash/reference phù hợp. Outbox P0/P1/P2 là nguồn event, delivery worker là consumer.

### CLIENT-001 — List API Clients

Trả client name, owner, scopes, environment, status, last_used_at và credential expiry. Không trả secret hash, encrypted secret hoặc access token.

### CLIENT-002 — Create API Client

- Xác định partner owner, legal purpose, environment, scopes, IP/mTLS policy và expiry.
- Scope phải thuộc allowlist và không vượt permission người tạo; production client có approval.
- Client secret raw chỉ trả một lần; lưu hash/reference, audit người nhận.
- Mặc định least privilege, rate limit và disabled-until-approved nếu policy yêu cầu.

### CLIENT-003 — Get API Client

Trả configuration, granted scopes, credential versions, usage summary và webhook linkage. Secret luôn masked và không bao giờ có endpoint “xem lại”.

### CLIENT-004 — Update API Client

Patch display metadata, redirect/network policy, rate limit hoặc proposed scope. Scope tăng cần reapproval; scope giảm/revoke có hiệu lực rõ và invalidate token theo policy.

### CLIENT-005 — Rotate API Client Secret

- Tạo credential version mới và raw secret hiển thị một lần.
- Có overlap window ngắn nếu business yêu cầu; old version tự expire.
- Retry không phát sinh nhiều secret ngoài ý muốn; thao tác cần recent auth/maker-checker.

### CLIENT-006 — Revoke API Client

Chuyển REVOKED, chặn token mới và invalidate credential/session liên quan. Không xóa audit, delivery history hoặc ownership. Emergency revoke phát security event.

### WEBHOOKSUB-001 — List Webhook Subscriptions

Trả endpoint host an toàn, event types, status, API version, failure streak và last delivery. URL credentials/query secret phải redact.

### WEBHOOKSUB-002 — Create Webhook Subscription

- Validate HTTPS, domain allowlist/ownership, DNS/IP và chặn private/link-local/metadata address để chống SSRF.
- Event type/scope không vượt API client permission; payload tuân data minimization.
- Tạo signing secret raw một lần, gửi challenge verification trước ACTIVE.
- Không delivery production đến endpoint chưa verify.

### WEBHOOKSUB-003 — Get Webhook Subscription

Trả config, event selection, health, verification state và secret version metadata. Không trả raw signing secret hoặc full sensitive payload.

### WEBHOOKSUB-004 — Update Webhook Subscription

Thay URL phải reverify; thay event/scope cần authorization lại. Update dùng version/ETag; không reset failure history một cách che giấu sự cố.

### WEBHOOKSUB-005 — Delete Webhook Subscription

Thực chất revoke/deactivate và ngừng enqueue delivery mới. Delivery/audit cũ giữ theo retention; pending retry xử lý theo cancel policy.

### WEBHOOKDEL-001 — List Webhook Deliveries

Filter theo subscription, event type, status, time và correlation ID. Response có attempt count, next retry và safe error; payload nhạy cảm không nằm trong list.

### WEBHOOKDEL-002 — Get Webhook Delivery Detail

Trả immutable event_id, payload schema version, redacted payload view, signature metadata, attempts và response status/body đã giới hạn/redact. Không lưu response vô hạn hoặc secret header.

### WEBHOOKDEL-003 — Retry Webhook Delivery

Chỉ retry delivery terminal/retryable theo policy; giữ nguyên event_id và payload snapshot nhưng tạo attempt mới. Không cho sửa payload trước retry. Manual retry audit actor/reason và vẫn chịu rate limit/circuit breaker.

### 11.3 Outbound webhook delivery contract

1. Domain transaction commit cùng outbox record.
2. Publisher tạo canonical event_id, occurred_at, type, API version và resource reference.
3. Delivery worker snapshot payload theo subscription scope, ký HMAC trên raw bytes + timestamp.
4. Receiver deduplicate theo event_id; thứ tự không được đảm bảo trừ khi contract nói rõ.
5. Retry exponential backoff có jitter; 2xx là ACK, 4xx/5xx xử lý theo policy.
6. Repeated failure mở circuit/disable subscription và cảnh báo owner.
7. Manual retry dùng lại payload/event identity, không tạo “sự kiện lịch sử mới”.

---

## 12. Consolidated Schema and Service Blueprint

Đây là logical blueprint, không phải câu lệnh migration. Tên bảng cuối cùng phải tuân naming convention của dự án và được review cùng ERD.

### 12.1 Bảng/resource đề xuất

| Bounded context | Bảng/resource chính | Liên kết với schema hiện tại | Invariant quan trọng |
|---|---|---|---|
| Seller identity | sellers, seller_applications, seller_application_documents, seller_memberships | users | Seller member không phải staff_profiles; membership có seller scope |
| Marketplace catalog | seller_offers, offer_price_histories, offer_fulfillment_policies | product_variants, products | Catalog chuẩn tách offer; price/stock của seller không ghi vào product_variants |
| Marketplace order | seller_orders, seller_order_items | orders, order_items, stock_reservations | Mỗi marketplace order item thuộc đúng seller/offer snapshot |
| Settlement | commission_rules, settlement_entries, seller_payouts, payout_items | payments, refunds, return_requests | Ledger append-only; payout không tính từ dữ liệu live |
| Retail/POS | retail_stores, store_warehouse_mappings, pos_registers, pos_devices, pos_shifts | warehouses, users | Store/warehouse mapping rõ; một register chỉ một shift mở |
| POS sale | pos_sales, pos_sale_items, pos_payment_tenders, cash_movements, pos_receipts | orders, order_items, payments, inventory_units | Sale hoàn tất có canonical order/ledger; không hai nguồn sự thật |
| Offline sync | offline_sync_batches, offline_operations | pos_devices, pos_sales | device_id + local_operation_id unique; không last-write-wins với tiền/kho |
| Financing | financing_providers, financing_quotes, financing_applications, financing_events | orders, payments | Approval khác funding; provider event inbox unique |
| Subscription | service_plans, service_plan_prices, subscription_contracts, subscription_cycles, billing_mandates | order_items, warranties, payments | Plan terms/version snapshot; subscription khác warranty |
| Risk | risk_sessions, risk_events, risk_assessments, risk_cases, risk_rule_versions, risk_decisions | users, orders, payment_attempts | Decision versioned; rule active bất biến |
| Dispute | payment_disputes, dispute_events, dispute_evidence, dispute_submissions | payments, refunds, shipments | Chargeback khác refund; deadline/evidence append-only |
| International | locales, markets, currencies, exchange_rate_sets, entity_localizations | products, categories, brands | Locale khác market; amount luôn có currency |
| Customs | customs_classifications, product_customs_profiles, international_quotes | products, product_variants | HS code/origin versioned; quote snapshot landed-cost components |
| Support | support_tickets, support_messages, support_assignments, support_sla_events | users, orders, payments, returns, warranties | Message append-only; internal/public visibility ở data layer |
| AI assistance | ai_runs, ai_artifacts, ai_proposed_actions, ai_action_approvals | support_tickets, audit_logs | Output không tự thực thi; lưu provenance và human approval |
| Partner access | api_clients, api_client_credentials, api_client_scopes | permissions, roles | Secret raw trả một lần; scope least privilege |
| Outbound webhook | webhook_subscriptions, webhook_secrets, webhook_deliveries, webhook_delivery_attempts | outbox/event source của các domain | Event/payload snapshot bất biến; delivery retry idempotent |
| Finance core | financial_ledger_entries, reconciliation_runs | payments, refunds, payouts, disputes | Double-entry hoặc ledger invariant được kế toán duyệt |

### 12.2 Không nên “tái sử dụng cho tiện”

| Không làm | Lý do |
|---|---|
| Dùng staff_profiles cho seller member | Nhân viên platform và nhân sự seller khác employer, scope, lifecycle và quyền |
| Dùng product_variants.sale_price làm giá seller | Không biểu diễn nhiều offer, currency, SLA, commission hoặc lịch sử seller |
| Thêm seller_id trực tiếp vào orders rồi kết thúc | Một order có thể có nhiều seller; return/shipment/settlement cần seller_order/item |
| Dùng warehouses để đại diện cả store và register | Kho, điểm bán và thiết bị thu ngân có lifecycle khác nhau |
| Dùng refunds để lưu chargeback | Khác actor, deadline, evidence, fee và kế toán |
| Dùng notifications làm support messages | Notification một chiều, không có thread/assignment/SLA/visibility |
| Lưu API client như user giả | Machine identity có credential, scope, rotation và audit khác người dùng |
| Lưu AI draft vào message public | Draft có thể sai/chưa duyệt và phải lưu model/provenance riêng |

### 12.3 Status state machines tối thiểu

| Resource | State chính |
|---|---|
| seller_application | DRAFT, SUBMITTED, UNDER_REVIEW, NEEDS_INFORMATION, APPROVED, REJECTED, WITHDRAWN |
| seller | PENDING_ACTIVATION, ACTIVE, SUSPENDED, TERMINATED |
| seller_offer | DRAFT, PENDING_REVIEW, ACTIVE, INACTIVE, SUSPENDED |
| seller_order | PENDING_ACCEPTANCE, ACCEPTED, PREPARING, SHIPPED, COMPLETED, REJECTED, CANCELLED |
| payout | DRAFT, APPROVED, PROCESSING, PAID, FAILED, REVERSED |
| store | DRAFT, ACTIVE, TEMPORARILY_CLOSED, INACTIVE |
| register | ACTIVE, DISABLED, REVOKED |
| pos_shift | OPEN, CLOSING, CLOSED, RECONCILIATION_REQUIRED |
| pos_sale | DRAFT, PAYMENT_PENDING, COMPLETED, VOIDED, RECONCILIATION_REQUIRED |
| financing_application | CREATED, SUBMITTED, UNDER_REVIEW, APPROVED, DECLINED, EXPIRED, FUNDED, CANCELLED |
| subscription | PENDING, ACTIVE, PAST_DUE, SUSPENDED, CANCEL_AT_PERIOD_END, CANCELLED, EXPIRED |
| risk_case | OPEN, ASSIGNED, IN_REVIEW, DECIDED, CLOSED |
| payment_dispute | OPEN, EVIDENCE_REQUIRED, SUBMITTED, WON, LOST, EXPIRED, REVERSED |
| support_ticket | OPEN, ASSIGNED, WAITING_CUSTOMER, WAITING_INTERNAL, RESOLVED, CLOSED |
| api_client | PENDING_APPROVAL, ACTIVE, SUSPENDED, REVOKED |
| webhook_subscription | PENDING_VERIFICATION, ACTIVE, PAUSED, DISABLED, REVOKED |

Mỗi transition phải có: allowed source state, actor/permission, precondition, idempotency boundary, side effect sau commit, audit và compensation/reconciliation rule.

---

## 13. Permission Blueprint

### 13.1 Permission catalog đề xuất

| Domain | Permission codes đề xuất |
|---|---|
| Seller onboarding | marketplace.seller_applications.read, marketplace.seller_applications.review, marketplace.sellers.manage |
| Seller portal | seller.profile.write, seller.memberships.read, seller.memberships.manage |
| Offers | seller.offers.read, seller.offers.manage, marketplace.offers.moderate |
| Seller orders | seller.orders.read, seller.orders.transition |
| Settlement | seller.payouts.read, marketplace.settlement.read, marketplace.settlement.approve |
| Retail setup | retail.stores.read, retail.stores.manage, retail.registers.manage |
| POS | pos.shifts.operate, pos.sales.create, pos.sales.void, pos.cash.reconcile, pos.offline_sync.operate |
| Financing | financing.applications.read, financing.applications.review, service_plans.manage, subscriptions.support |
| Risk | risk.cases.read, risk.cases.assign, risk.cases.decide, risk.rules.read, risk.rules.manage, risk.rules.approve |
| Dispute | disputes.read, disputes.evidence.manage, disputes.submit |
| International | localization.read, localization.manage, fx_rates.import, fx_rates.approve, customs.read, customs.manage |
| Support | support.tickets.read, support.tickets.assign, support.tickets.manage |
| AI | support.ai.generate, support.ai_actions.approve |
| Integrations | integrations.clients.read, integrations.clients.manage, integrations.credentials.rotate, integrations.clients.revoke |
| Webhooks | integrations.webhooks.read, integrations.webhooks.manage, integrations.webhooks.retry |

### 13.2 Scope không thể chỉ giải quyết bằng role name

Permission trả lời “được làm gì”; scope trả lời “được làm trên dữ liệu nào”. P3 cần scope tối thiểu:

- seller_id cho seller portal/order/payout.
- store_id hoặc retail organization cho POS.
- market/country cho localization, customs và seller operation.
- queue/organization cho risk, dispute và support.
- partner/api_client ownership cho integration.

Không tạo role cứng như SELLER_A_MANAGER, SELLER_B_MANAGER. Dùng role/permission tái sử dụng cộng membership/scope assignment. System role không được xóa/sửa tùy ý; custom role không được cấp permission vượt quyền người gán.

### 13.3 Segregation of Duties

- Người tạo risk rule không tự activate rule high-impact.
- Người chuẩn bị payout không tự approve payout vượt hạn mức.
- Người bổ sung dispute evidence có thể khác người submit representment.
- Người tạo production API client không tự cấp scope nhạy cảm nếu policy yêu cầu approval.
- AI không bao giờ là approver; human approval phải mang actor_user_id thật.

---

## 14. Cross-Domain Workflows and Data Ownership

### 14.1 Domain ownership

| Dữ liệu | Owner duy nhất | Domain khác được làm gì |
|---|---|---|
| Global catalog | Catalog domain | Seller tạo offer bằng variant reference |
| Seller offer | Marketplace catalog | Checkout đọc snapshot sellability |
| Platform order | Order domain | Seller/POS/financing gửi command/event, không update trực tiếp |
| Inventory/reservation/unit | Inventory domain | POS/seller order yêu cầu reserve/consume/release |
| Payment/refund | Payment domain | Financing/dispute tham chiếu và tạo command/ledger event |
| Seller settlement | Settlement domain | Order/refund/dispute cung cấp immutable business events |
| Risk decision | Risk domain | Domain đích thực thi policy action của chính nó |
| Ticket | Support domain | Chỉ link reference; không copy trạng thái transaction làm nguồn sự thật |
| Currency/rate set | International/finance config | Checkout/order snapshot version đã dùng |

Trong modular monolith, ownership vẫn áp dụng ở module/service layer; không vì chung database mà module khác được update bảng tùy ý.

### 14.2 Marketplace order with return and chargeback

1. Checkout tạo platform order và seller_order snapshots.
2. Inventory reserve theo owner/fulfillment node; payment capture vào platform payment.
3. Seller fulfillment tạo shipment allocation theo seller_order_item.
4. Return/refund phân bổ amount và unit theo order item.
5. Settlement ledger ghi gross, commission, tax, refund và reserve.
6. Nếu chargeback tới sau payout, dispute domain phát ledger adjustment; không sửa payout PAID.
7. Kỳ payout sau thu hồi/điều chỉnh theo contract, có statement cho seller.

### 14.3 POS sale with offline recovery

1. Device mở shift online và tải signed configuration/price book có version/expiry.
2. Offline sale ghi local operation/event log, không ghi trực tiếp central DB.
3. Khi online, batch upload với sequence và content hash.
4. Server deduplicate từng operation, revalidate price/inventory/payment policy.
5. Operation hợp lệ tạo canonical sale/order; conflict vào reconciliation queue.
6. Chỉ khi tender và inventory reconcile thì sale được settled/shift được close hoàn toàn.

### 14.4 BNPL checkout

1. Order/quote xác định amount đủ điều kiện.
2. Customer consent rồi tạo financing quote/application với provider.
3. Provider webhook được persist trước, xử lý async và idempotent.
4. APPROVED cho bước ký/authorize; FUNDED/guaranteed mới thỏa payment condition.
5. Order domain tự transition dựa trên verified event; financing service không update orders trực tiếp.
6. Cancel/refund/chargeback reconcile với cả provider contract và merchant ledger.

### 14.5 AI-assisted support action

1. Agent yêu cầu AI trên ticket snapshot/version.
2. AI lấy dữ liệu qua tool/read API có scope, lưu citations/provenance.
3. AI trả draft hoặc proposed action, tuyệt đối chưa gây side effect.
4. Human review nội dung, permission, amount và evidence.
5. Approval revalidate state rồi gọi canonical domain command.
6. Ticket lưu result reference; audit phân biệt AI suggestion, human approval và domain executor.

---

## 15. Security, Legal, Accounting and AI Governance

### 15.1 Security controls

- Step-up authentication cho KYC document, payout detail, secret rotation, risk decision và high-value approval.
- Field-level encryption/tokenization cho bank, identity, credit và device credential; key rotation có runbook.
- Object storage private, signed URL ngắn hạn, malware scanning và checksum cho KYC/dispute/support attachment.
- mTLS hoặc signed client assertion cho partner quan trọng; OAuth client credentials không dùng password của user.
- SSRF defense khi đăng ký webhook: parse/canonicalize URL, DNS resolution policy, block private/link-local/metadata IP và re-check redirect.
- Rate limit theo user, seller, store, device, API client và IP; không chỉ global IP.
- Secret không xuất hiện trong log, audit payload, error, analytics hoặc support ticket.
- Mọi command tài chính và state transition nhạy cảm có correlation ID, idempotency record và immutable audit.

### 15.2 Legal and privacy controls

- Seller KYC/AML, payout và tax data có lawful purpose, retention và regional access restriction.
- BNPL disclosure/consent version được snapshot; adverse-action communication theo luật/thỏa thuận provider.
- Risk/device data không thu thập vô hạn; data minimization, retention và access review định kỳ.
- Cross-border phải kiểm tra restricted products, sanctions/export control, customs và consumer disclosure.
- Support/AI không dùng dữ liệu khách để train/evaluate ngoài policy/consent; redact PII và kiểm soát data residency.
- Terms, service plan, fee, FX và duty model dùng tại giao dịch phải versioned và truy xuất được.

### 15.3 Accounting controls

- Ledger entry append-only; correction dùng reversing/adjustment entry.
- Money luôn decimal + currency; quy tắc rounding được định nghĩa theo component và market.
- Payout, refund, chargeback, provider settlement và POS tender có reconciliation job độc lập.
- Business date của store khác timestamp UTC; lưu cả timezone snapshot để báo cáo ca.
- Financial period closed không update lịch sử; adjustment vào kỳ mở tiếp theo.
- Maker-checker và amount threshold cho payout, manual adjustment và dispute submission quan trọng.

### 15.4 AI governance controls

- Use case registry: mục đích, data class, model/provider, owner, risk tier và approved tools.
- Prompt/model/retrieval policy versioned; eval set có tình huống hallucination, PII leakage, unsafe advice và stale state.
- AI output luôn gắn trạng thái GENERATED/DRAFT/STALE/APPROVED/REJECTED/EXECUTED.
- Không dùng confidence số giả để thay human review; low evidence phải hiển thị uncertainty.
- Kill switch, model fallback và manual workflow khi provider lỗi.
- Audit phải trả lời được: AI thấy dữ liệu gì, đề xuất gì, ai duyệt, endpoint nào đã thực thi và kết quả ra sao.

---

## 16. Delivery Plan and Verification Strategy

### 16.1 Không cam kết toàn bộ P3 trong một release

P3 là portfolio. Mỗi initiative phải có business case riêng. Trình tự khuyến nghị theo dependency:

| Wave | Mục tiêu | Điều kiện hoàn thành |
|---|---|---|
| P3-0 | Domain discovery, data ownership, event contract, ledger/secret/object-storage foundations | Architecture, legal, accounting và security sign-off |
| P3-A | Support ticket và partner integration foundation | Ticket SLA ổn định; API client/webhook có rotation/retry/monitoring |
| P3-B | Chọn POS hoặc marketplace theo chiến lược, không mở cả hai mặc định | Inventory ownership, reconciliation và operational runbook đạt |
| P3-C | Risk case và dispute/chargeback | Provider reconciliation, deadline alert và maker-checker đạt |
| P3-D | BNPL/service subscription | Contract, disclosure, billing, refund và failure recovery đạt |
| P3-E | International commerce | Market/currency/customs/legal readiness theo từng quốc gia |
| P3-F | AI-assisted support | Có dữ liệu ticket đủ sạch, eval đạt ngưỡng và human approval bắt buộc |

Nếu business ưu tiên cửa hàng vật lý thì P3-B làm POS trước marketplace. Nếu ưu tiên platform seller thì ngược lại. Không dùng priority kỹ thuật để tự quyết thay chiến lược kinh doanh.

### 16.2 Test matrix bắt buộc

| Loại test | Trọng tâm P3 |
|---|---|
| Contract | Method/route/schema/error/status/pagination và backward compatibility P0–P2 |
| State machine | Mọi valid/invalid transition, terminal state và out-of-order event |
| Authorization | Role + seller/store/market/queue scope; IDOR trên mọi {id} |
| Concurrency | Double accept, double payout, double sale, duplicate IMEI, lost update |
| Idempotency | Client retry, webhook replay, offline batch resend, manual delivery retry |
| Ledger/reconciliation | Refund + chargeback + payout + FX + POS variance |
| Integration | Signature, timestamp, secret rotation, event version, provider timeout |
| Security | SSRF, file malware, secret leakage, token misuse, privilege escalation |
| Resilience | Queue delay, provider outage, partial batch, stale rate, device reconnect |
| Migration | Backfill, dual-read/write nếu có, rollback và invariant query |
| AI evaluation | Groundedness, citation, PII leakage, unsafe action, stale ticket, human rejection |
| Performance | Offer listing, POS latency, case queue, webhook burst và reconciliation batch |

### 16.3 Observability and operational readiness

Mỗi domain phải có:

- Business metric: seller acceptance SLA, POS sync lag, approval/funding conversion, dispute win rate, ticket SLA, webhook success rate.
- Technical metric: latency/error/saturation, queue age, retry rate, dead-letter count và idempotency conflict.
- Reconciliation metric: unmatched payment/payout/tender/event, amount difference theo currency.
- Structured log có correlation nhưng không có PII/secret.
- Alert severity, owner, runbook, escalation và manual recovery command được phê duyệt.
- Dashboard phân biệt processing delay với business rejection; không báo mọi DECLINED là system error.

---

## 17. Traceability, Definition of Done and Final Boundary

### 17.1 Traceability từ schema hiện tại

| Current DB area | P3 extension | Lý do không sửa trực tiếp bảng cũ |
|---|---|---|
| users, staff_profiles, roles | sellers, seller_memberships, scoped permission | Seller không phải nhân viên platform |
| products, variants, prices | seller_offers, localization, customs | Nhiều seller/market/currency/version |
| warehouses, inventories, units | store mapping, inventory owner, POS operation | Cần owner/node/device và offline conflict |
| orders, items | seller_orders, POS source, international snapshot | Split fulfillment và channel/market mới |
| payments, attempts, webhooks | financing, subscription billing, dispute | State machine và provider contract khác |
| refunds | dispute/chargeback ledger | Merchant refund khác issuer debit |
| notifications | support tickets/messages/AI artifacts | Hội thoại, SLA, visibility và human approval |
| audit_logs | immutable domain events/AI provenance | Audit chung không thay thế ledger/event evidence |

### 17.2 Definition of Done cho một endpoint P3

Một endpoint chỉ được đánh dấu DONE khi:

1. Có business owner, actor, permission và organizational scope rõ.
2. Có OpenAPI contract, request/response/error examples và versioning rule.
3. Migration, index, unique/FK/check constraint và rollback đã review.
4. State transition, transaction boundary, idempotency và outbox/inbox rule đã test.
5. Không trùng method + normalized route với P0, P1, P2 hoặc endpoint P3 khác.
6. PII/secret classification, retention, encryption và audit đạt security review.
7. Provider/webhook có signature, replay protection, timeout, retry và reconciliation.
8. Financial impact có ledger/rounding/currency/maker-checker rule được kế toán duyệt.
9. Có unit, integration, authorization, concurrency, contract và failure-path test.
10. Có metric, alert, dashboard, runbook và support ownership.
11. Tài liệu khách hàng/đối tác và changelog hoàn tất.
12. Gate BUSINESS-MODEL/SCHEMA/INFRA/PARTNER/LEGAL/AI-GOVERNANCE liên quan đã đóng.

### 17.3 API quality checks của tài liệu

- 114/114 endpoint có inventory entry và phần giải thích riêng.
- Chỉ sử dụng GET, POST, PATCH, PUT và DELETE đúng semantic đã định nghĩa.
- Không có endpoint generic như /update-status hoặc /do-action.
- Không dùng DELETE cho ledger, payment, payout, dispute, message hoặc audit.
- Command nhạy cảm dùng route action có nghĩa nghiệp vụ và state precondition rõ.
- P3 bổ sung resource mới; không đổi nghĩa endpoint P0/P1/P2.

### 17.4 Kết luận phạm vi

P3 biến hệ thống thành nền tảng đa bên, đa kênh và có integration phức tạp. Giá trị chuyên nghiệp của thiết kế không nằm ở số lượng endpoint, mà ở việc thừa nhận đúng các ranh giới: catalog khác offer, platform order khác seller order, refund khác chargeback, store khác warehouse, quote khác approval, AI suggestion khác human decision và event creation khác webhook delivery.

Chỉ chọn initiative có business case thật, migration thật, owner thật và khả năng vận hành thật. Các endpoint trong tài liệu là contract mục tiêu; chưa đạt gate thì chưa được quảng bá là production-ready.
