# Debug by prompt code

Nhận lỗi thô, tự chọn hoặc dùng mã `P00`–`P12`, ghép prompt mẫu với context thực tế rồi điều phối rules/skills để xử lý nhất quán.

## Cách gọi

Tối thiểu chỉ cần dán lỗi, Agent sẽ AUTO routing. Có thể ghi rõ:

```text
AUTO: <dán lỗi vào đây>
```

Hoặc chọn thủ công:

```text
P06: <dán lỗi vào đây>
```

Nếu không biết chọn mã:

```text
P00: <dán lỗi vào đây>
```

`P01` chỉ chẩn đoán. `P00` và `P02`–`P12` cho phép sửa trong phạm vi lỗi nhưng không cấp quyền thao tác production hoặc destructive action.

## Bắt buộc đọc

- Rules `00`, `50`, `60` và rule chuyên môn được routing.
- Skill `debug-prompt-library`.
- `phone-store-project-context` khi lỗi chạm nghiệp vụ.
- Skill domain/chuyên môn tương ứng mã prompt.

## Thực hiện

1. Chuẩn hóa mã theo `references/input-contract.md`.
2. Phân tích root exception/failure boundary và chọn profile trong `.agents/prompts/`; mã thủ công hợp lệ được ưu tiên.
3. Thu thập context thực tế từ lỗi/project theo `PROMPT-SCHEMA.md`.
4. Ghép `BASE-ERROR-PROMPT.md` với body profile và điền mọi placeholder; dùng `UNKNOWN` thay vì bịa.
5. Luôn hiển thị bản đã render dưới tiêu đề `PROMPT ĐỀ XUẤT`, đưa lựa chọn xác nhận và dừng.
6. Khi người dùng phê duyệt bằng `OK`, `đồng ý`, `làm đi`, `triển khai đi` hoặc `tiếp tục`, thực thi đúng prompt gần nhất theo `execution-contract.md`; không render lại.
7. Nếu phản hồi phê duyệt chứa yêu cầu mới, cập nhật prompt và quay lại bước 5.
8. Với `P01`, dừng sau khi root cause/hypothesis được báo; không sửa file.
9. Với mã FIX, tạo regression test, patch tối thiểu và chạy verification ladder.
10. Báo kết quả theo `output-contract.md`.

## Dừng an toàn

Dừng nếu cần xóa dữ liệu, migration phá hủy, thay đổi public permission/contract chưa được quyết định, production side effect, secret thật hoặc không thể bảo vệ thay đổi hiện có.

## Ví dụ chọn mã

- `P03`: Gradle/dependency/compile.
- `P05`: API/HTTP/DTO/validation.
- `P06`: JWT/401/403/quyền.
- `P07`: MySQL/JPA/Flyway.
- `P08`: nghiệp vụ/transaction/concurrency.
- `P09`: test/quality gate.
- `P12`: lỗi dai dẳng, ngẫu nhiên hoặc đa tầng.
