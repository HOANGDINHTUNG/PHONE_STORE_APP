# Prompt Template Schema

## Cách Agent dùng thư viện

1. Nhận lỗi thô từ người dùng.
2. Chuẩn hóa và redaction dữ liệu nhạy cảm.
3. Nếu có mã rõ, chọn profile đó; nếu là `AUTO/P00` hoặc không có mã, so khớp `triggers`, root exception và failure boundary để chọn profile.
4. Thu thập context còn thiếu từ project.
5. Ghép `BASE-ERROR-PROMPT.md` với body của profile được chọn.
6. Điền toàn bộ placeholder; giá trị chưa biết phải là `UNKNOWN`, không được bịa.
7. Hiển thị toàn bộ prompt đã render dưới tiêu đề `PROMPT ĐỀ XUẤT` và dừng chờ phê duyệt theo rule 70.
8. Chỉ thực thi prompt gần nhất sau khi người dùng trả lời `OK`, `đồng ý`, `làm đi`, `triển khai đi` hoặc `tiếp tục` mà không kèm yêu cầu mới.
9. Nếu câu xác nhận có constraint/scope mới, cập nhật prompt và xin duyệt lại.

## Placeholder trong base prompt

| Placeholder | Nguồn |
| --- | --- |
| `{{SELECTED_PROMPT_CODE}}` | Metadata `code` của profile |
| `{{PROMPT_NAME}}` | Metadata `name` của profile |
| `{{TASK_MODE}}` | Metadata `mode` hoặc chỉ dẫn hạn chế hơn của người dùng |
| `{{ERROR_INPUT}}` | Lỗi gốc đã redaction, giữ nguyên đủ để điều tra |
| `{{ROOT_EXCEPTION}}` | Exception/signature gốc đã tìm được, nếu có |
| `{{OBSERVED_BEHAVIOR}}` | Hành vi thực tế từ lỗi/reproduction |
| `{{EXPECTED_BEHAVIOR}}` | Yêu cầu/contract/test; `UNKNOWN` nếu chưa xác nhận |
| `{{REPRO_STEPS}}` | Bước/lệnh tái hiện đã biết hoặc Agent tìm được |
| `{{PROJECT_CONTEXT}}` | Stack, version, module, profile, môi trường thực tế |
| `{{RELEVANT_FILES}}` | File/class/config/migration/test đã xác minh liên quan |
| `{{RECENT_CHANGES}}` | Diff/history liên quan; không đoán |
| `{{CONSTRAINTS}}` | Rules, compatibility, security/data và phạm vi quyền |
| `{{AVAILABLE_COMMANDS}}` | Lệnh/test an toàn có thể chạy |
| `{{DOMAIN_PLAYBOOK}}` | Body profile được chọn |

## Thêm prompt riêng

Sao chép `CUSTOM-PROMPT-PROFILE.template.md`, đổi `active: true`, đổi mã thành `C01`–`C99`, cập nhật `name`, `mode`, `triggers`, `skills` và body. Mỗi mã phải duy nhất. Profile càng có trigger phân biệt và verification cụ thể thì AUTO routing càng chính xác.

Không đặt secret, dữ liệu production hoặc prompt chứa lệnh destructive vào profile.
