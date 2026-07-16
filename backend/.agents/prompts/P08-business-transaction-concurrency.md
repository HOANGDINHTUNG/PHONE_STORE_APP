---
code: P08
name: Business Transaction State Concurrency
mode: FIX
triggers: sai nghiệp vụ, duplicate order, duplicate payment, stock âm, state transition, race condition, optimistic lock, lost update, idempotency
skills: phone-store-project-context, enforce-backend-architecture, build-cart-checkout, build-order-payment-shipping, build-catalog-inventory
---

Đọc domain context, actor permission và state machine. Viết rõ invariant cùng interleaving gây lỗi trước khi sửa. Kiểm tra transaction boundary, isolation, optimistic/pessimistic lock, idempotency, retry và compensation. Không giữ DB lock trong network call và không dùng check-then-act thiếu nguyên tử. Viết concurrency/integration test bằng transaction độc lập và xác minh invariant cuối cùng như stock không âm, không duplicate side effect và transition hợp lệ.
