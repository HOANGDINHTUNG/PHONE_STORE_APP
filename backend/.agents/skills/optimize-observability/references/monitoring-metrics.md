# Monitoring metrics

## Hệ thống

- HTTP rate, error, duration theo route template/method/status class.
- JVM heap, GC, thread, CPU.
- Hikari active/idle/pending/timeout.
- Database query latency qua công cụ phù hợp.
- External client rate/error/duration/timeout.
- Queue/outbox lag và retry.

## Domain

- Checkout success/failure.
- Reservation conflict/expiry/release lag.
- Payment success/failure/unknown/reconciliation mismatch.
- Order stuck theo state/age bucket.
- Shipment webhook failure và fulfillment lag.

Label phải bounded: route template, operation, provider, result, state; không dùng ID duy nhất.

