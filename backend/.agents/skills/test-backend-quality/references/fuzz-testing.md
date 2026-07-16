# Fuzz Testing với Jazzer

Dùng Jazzer để tạo và biến đổi lượng lớn input nhằm tìm crash, exception bất thường, denial-of-service và lỗi validation.

## Target nên fuzz

- JSON/request parser.
- Payment callback parser.
- JWT/header parser tự viết.
- Search/filter expression.
- File name, MIME type và upload metadata.
- Email, phone, address và Unicode normalization.
- Coupon/promotion input.
- SKU/slug generator.
- Base64, URL, redirect và webhook payload.
- Mapper nhận dữ liệu từ provider ngoài.

Không fuzz framework code hoặc thư viện ngoài nếu dự án không sở hữu logic đó.

## Yêu cầu đối với fuzz target

- Chạy nhanh và deterministic.
- Không gọi internet.
- Không kết nối shared database.
- Không ghi file ngoài thư mục test.
- Không dùng production credential.
- Có giới hạn kích thước input.
- Chấp nhận lỗi validation dự kiến.
- Chỉ coi crash, timeout, invariant violation hoặc exception ngoài allowlist là lỗi.

## Ví dụ

```java
class PaymentCallbackFuzzTest {

    @FuzzTest
    void callbackParserMustNotCrash(byte[] input) {
        try {
            PaymentCallback callback = parser.parse(input);

            if (callback != null) {
                assertThat(callback.amount()).isGreaterThanOrEqualTo(BigDecimal.ZERO);
            }
        } catch (InvalidCallbackException expected) {
            // Input không hợp lệ được phép bị từ chối.
        }
    }
}
```

## Chế độ regression

Chạy cùng test thông thường:

```bash
./gradlew test
```

## Chế độ fuzzing

```bash
JAZZER_FUZZ=1 ./gradlew test \
  --tests "com.company.phonestore.payment.PaymentCallbackFuzzTest"
```

## Khi tìm được lỗi

- Lưu crash input đã loại bỏ dữ liệu nhạy cảm.
- Tái hiện với cùng version và seed/corpus.
- Tạo regression test cố định.
- Sửa root cause.
- Chạy lại unit, property, fuzz và security test.
- Không xóa corpus chỉ để pipeline pass.
