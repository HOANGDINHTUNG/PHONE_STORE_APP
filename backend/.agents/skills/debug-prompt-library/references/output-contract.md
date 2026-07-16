# Output Contract

Kết quả cuối phải độc lập, ngắn gọn nhưng có đủ bằng chứng. Dùng cấu trúc sau và bỏ mục không áp dụng:

## Kết quả

- **Trạng thái:** `FIXED`, `DIAGNOSED`, `PARTIAL`, `BLOCKED` hoặc `NOT_REPRODUCED`.
- **Prompt:** mã `Pxx` đã chạy; với `P00`, ghi thêm nhánh chuyên môn được chọn.
- **Mức tin cậy:** cao, trung bình hoặc thấp kèm lý do ngắn.

## Root cause

- Symptom.
- Trigger.
- Root cause kèm vị trí/bằng chứng.
- Contributing factor nếu có.

Không gọi một giả thuyết là root cause khi chưa được chứng minh.

## Thay đổi

Chỉ dùng cho chế độ FIX:

- file và behavior đã sửa;
- regression test đã thêm/sửa;
- compatibility, database, security hoặc config impact.

## Xác minh

Liệt kê từng command/test cùng kết quả thực tế:

| Kiểm tra | Kết quả |
| --- | --- |
| Regression test | PASS/FAIL/NOT RUN + chi tiết |
| Suite liên quan | PASS/FAIL/NOT RUN + chi tiết |
| Full gate/build | PASS/FAIL/NOT RUN + chi tiết |

## Còn lại

- test chưa chạy và lý do;
- rủi ro hoặc blocker;
- bước tiếp theo chỉ khi thực sự cần.

Không bắt người dùng đọc lại commentary, log dài hoặc diff để hiểu kết luận.
