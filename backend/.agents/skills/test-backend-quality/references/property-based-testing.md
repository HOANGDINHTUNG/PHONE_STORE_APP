# Property-Based Testing với jqwik

Dùng jqwik khi không thể bao phủ đầy đủ bằng một vài test case cố định.

## Trường hợp nên dùng

- Tính tổng tiền, giảm giá, thuế và làm tròn.
- Quantity, giá, thời gian và khoảng giá trị vùng biên.
- Cart merge và checkout calculation.
- State transition có nhiều tổ hợp đầu vào.
- Chuẩn hóa SKU, slug, email, phone hoặc search filter.
- Idempotency và tính chất lặp lại.
- Serialization/deserialization.

## Quy trình

1. Xác định invariant trước khi viết generator.
2. Giới hạn generator theo domain hợp lệ.
3. Tách valid input và invalid input.
4. Bao phủ giá trị 0, 1, min, max, rỗng, Unicode và giá trị rất dài.
5. Giữ lại seed khi test thất bại.
6. Chuyển counterexample quan trọng thành regression test cố định.

## Invariant gợi ý

- Tổng tiền không âm.
- Cùng input luôn tạo cùng kết quả.
- Giảm giá không làm tổng tiền nhỏ hơn 0.
- Tổng refund không vượt captured amount.
- Merge cart không tạo SKU trùng.
- Reserve rồi release phải trả available stock về trạng thái ban đầu.
- Serialize rồi deserialize phải bảo toàn dữ liệu hợp lệ.

## Ví dụ

```java
class PriceCalculatorProperties {

    @Property
    void totalMustNeverBeNegative(
            @ForAll @IntRange(min = 1, max = 100) int quantity,
            @ForAll @LongRange(min = 0, max = 100_000_000) long unitPrice,
            @ForAll @LongRange(min = 0, max = 100_000_000) long discount
    ) {
        Money total = calculator.calculate(quantity, unitPrice, discount);

        assertThat(total.amount()).isGreaterThanOrEqualTo(BigDecimal.ZERO);
    }
}
```

## Quy tắc

- Không tạo generator lớn vô hạn.
- Không dùng random trực tiếp ngoài jqwik.
- Không bỏ seed/counterexample khi test thất bại.
- Property phải mô tả invariant nghiệp vụ, không chỉ kiểm tra “không throw exception”.
