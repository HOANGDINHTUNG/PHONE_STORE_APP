# Mutation Testing với PITest

PITest thay đổi mã nguồn có kiểm soát rồi chạy test để kiểm tra test có phát hiện thay đổi sai hay không.

## Mục tiêu

Phát hiện test chỉ chạy qua code nhưng không thực sự kiểm tra hành vi.

## Ưu tiên chạy trên

- Domain service.
- Value object.
- Price calculator.
- Discount và promotion rules.
- Order/payment state transition.
- Inventory reservation.
- Authorization và ownership policy.
- Idempotency logic.

## Không ưu tiên

- DTO chỉ chứa getter/setter.
- Generated code.
- Configuration thuần.
- Mapper không có logic.
- Exception boilerplate.
- Migration hoặc external SDK class.

Mọi exclusion phải có lý do rõ; không loại file chỉ để tăng mutation score.

## Phân loại kết quả

- `KILLED`: test đã phát hiện mutation.
- `SURVIVED`: mutation không bị test phát hiện; cần xem lại assertion hoặc test case.
- `NO_COVERAGE`: đoạn code chưa được test chạy tới.
- `TIMED_OUT`: kiểm tra test treo hoặc quá chậm.
- `NON_VIABLE`: mutation không thể biên dịch/chạy.

## Quy trình xử lý mutation sống sót

1. Xác định mutation có thay đổi hành vi thật hay tương đương.
2. Nếu thay đổi hành vi, bổ sung assertion hoặc test case.
3. Nếu mutation tương đương, ghi nhận rõ.
4. Không viết test phụ thuộc implementation chỉ để giết mutation.
5. Chạy lại PITest trên module bị ảnh hưởng.

## Quality gate

- Mutation score phải dùng cùng coverage và critical-path review.
- Module payment, inventory, pricing, authorization và order state phải có ngưỡng nghiêm hơn.
- Bắt đầu bằng baseline hiện tại rồi tăng dần.
- Không đặt ngưỡng tùy ý khiến team loại trừ code hàng loạt.

## Lệnh

```bash
./gradlew pitest
```

Report mặc định cần được lưu trong CI artifact để review mutation sống sót.
