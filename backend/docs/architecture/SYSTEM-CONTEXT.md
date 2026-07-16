# System context

## Mục tiêu hệ thống

<Backend phục vụ web, mobile và admin cho cửa hàng điện thoại.>

## Actor/client

| Client/actor | Giao thức | Authentication | Năng lực |
| --- | --- | --- | --- |
| ReactJS web | HTTPS/JSON | JWT/cookie theo thiết kế | Catalog, cart, order |
| React Native | HTTPS/JSON | JWT + secure storage | Catalog, cart, order |
| Admin | HTTPS/JSON | JWT + role | Vận hành |
| Provider | HTTPS webhook/API | Signature/service credential | Payment/shipping |

## Boundary

- Identity/access:
- Catalog/pricing:
- Inventory:
- Cart/checkout:
- Order/payment/shipping:
- Observability:

## Trust boundary và dữ liệu nhạy cảm

- Internet -> API edge:
- Backend -> database:
- Backend -> provider:
- Secret/PII/payment data:

## Quyết định liên quan

- ADR:
- Open questions:

