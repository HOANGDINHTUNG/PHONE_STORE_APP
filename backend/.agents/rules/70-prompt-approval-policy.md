# Phone Store Backend — Prompt Approval Policy

## 1. Mục đích

Rule này bắt buộc AI Agent biến mọi **yêu cầu mới có nội dung** thành một prompt hoàn chỉnh để người dùng duyệt trước khi thực thi.

Mục tiêu:

- làm rõ đúng ý người dùng trước khi sửa code hoặc tạo deliverable;
- tận dụng prompt mẫu, rules, skills và workflows đã có;
- tránh Agent hiểu thiếu, tự mở rộng phạm vi hoặc bắt đầu quá sớm;
- cho phép người dùng sửa prompt trước khi Agent hành động;
- không làm gián đoạn hội thoại bởi các câu xác nhận hoặc giao tiếp đơn giản.

Rule này kiểm soát thời điểm được bắt đầu. Sau khi được duyệt, mọi hành động vẫn phải tuân `00-project-constitution.md` đến `60-safe-change-policy.md`.

## 2. Phạm vi

Áp dụng cho mọi yêu cầu mới có thể dẫn đến:

- phân tích kỹ thuật hoặc nghiệp vụ;
- tạo, sửa, xóa hoặc refactor file/code;
- thiết kế API, database, security, testing hoặc architecture;
- debug và sửa lỗi;
- tạo tài liệu, báo cáo, kế hoạch hoặc artifact;
- chạy test/build/validator có mục đích thực thi task;
- Docker, CI/CD, release hoặc deployment planning.

Không áp dụng lại cho câu xác nhận, câu điều khiển hội thoại hoặc câu giao tiếp không chứa yêu cầu mới.

## 3. Phân loại tin nhắn

### 3.1. Yêu cầu mới có nội dung

Một tin nhắn là yêu cầu mới khi chứa ít nhất một trong các thành phần:

- mục tiêu mới;
- lỗi, stack trace, log hoặc behavior cần xử lý;
- chức năng cần tạo/sửa;
- input, constraint, acceptance criteria hoặc deliverable mới;
- thay đổi phạm vi, nghiệp vụ, kiến trúc, API, database, security hoặc test;
- yêu cầu phân tích/review/tối ưu/tài liệu hóa cụ thể.

Yêu cầu mới phải đi qua Prompt Approval Gate.

### 3.2. Câu xác nhận hoặc điều khiển ngắn

Các câu sau không phải yêu cầu mới nếu không chứa thêm điều kiện:

- `ok`, `oke`, `được`, `đồng ý`, `chuẩn`;
- `làm đi`, `triển khai đi`, `bắt đầu đi`;
- `tiếp tục`, `làm tiếp`, `qua bước tiếp theo`;
- `giữ nguyên`, `theo prompt trên`;
- câu cảm ơn, chào hỏi hoặc phản hồi giao tiếp thông thường.

Nếu đang có prompt chờ duyệt, các câu xác nhận trên có nghĩa là **phê duyệt prompt gần nhất** và Agent được thực thi prompt đó.

Nếu không có prompt chờ duyệt, xử lý chúng như hội thoại bình thường; không tự tạo nhiệm vụ hoặc prompt mới.

### 3.3. Xác nhận có kèm thay đổi

Các câu như sau không phải phê duyệt thuần túy:

- `ok nhưng thêm phân trang`;
- `làm đi, đổi MySQL thành PostgreSQL`;
- `đồng ý nhưng không sửa database`;
- `tiếp tục và bổ sung refresh token`.

Phần sau từ nối tạo ra constraint/scope mới. Agent phải cập nhật prompt, hiển thị bản mới và chờ duyệt lại.

## 4. Prompt Approval Gate bắt buộc

Với yêu cầu mới có nội dung, thực hiện đúng thứ tự:

1. Phân tích yêu cầu gốc.
2. Xác định task mode, mục tiêu, input, output, phạm vi, non-goal, constraint và acceptance criteria.
3. Chọn prompt/profile có sẵn trong `.agents/prompts/`.
4. Chọn rules, skills và workflow liên quan.
5. Có thể đọc file/project bằng thao tác read-only để điền context chính xác; không chỉnh sửa hoặc bắt đầu thực thi task.
6. Điền placeholder bằng dữ liệu đã xác minh. Giá trị chưa biết phải ghi `UNKNOWN` hoặc `OPEN QUESTION`, không được bịa.
7. Hiển thị toàn bộ prompt hoàn chỉnh dưới tiêu đề `PROMPT ĐỀ XUẤT`.
8. Hiển thị lựa chọn xác nhận.
9. Dừng và chờ phản hồi. Không triển khai, sửa file hoặc chạy hành động thuộc task trước khi được duyệt.

Mẫu kết thúc bắt buộc:

```text
XÁC NHẬN
- ĐỒNG Ý / OK / LÀM ĐI: thực thi prompt trên.
- SỬA: <nội dung>: cập nhật prompt và gửi lại để duyệt.
- HỦY: không thực hiện.
```

## 5. Chọn prompt mẫu

- Lỗi/debug: dùng `BASE-ERROR-PROMPT.md` và profile `P00–P12` hoặc `C01–C99`.
- Yêu cầu không phải lỗi: dùng `REQUEST-PROMPT.template.md`, rồi điền domain instructions từ rules/skills/workflow tương ứng.
- Nếu có mã prompt thủ công, ưu tiên mã đó nhưng vẫn phải render và xin duyệt.
- Nếu không có mã, Agent tự chọn mẫu phù hợp.
- Nếu chưa có profile chuyên biệt, dùng mẫu chung; không được dừng chỉ vì thiếu mã.

## 6. Trạng thái prompt chờ duyệt

Agent phải duy trì một prompt gần nhất ở trạng thái `PENDING_APPROVAL` trong mạch hội thoại hiện tại.

| Phản hồi người dùng | Chuyển trạng thái |
| --- | --- |
| `OK`, `đồng ý`, `làm đi`, `tiếp tục` | `APPROVED` → thực thi prompt gần nhất |
| `SỬA: ...` hoặc xác nhận kèm yêu cầu mới | cập nhật → `PENDING_APPROVAL` |
| `HỦY`, `không làm nữa` | `CANCELLED` → không thực thi |
| câu giao tiếp không liên quan | giữ nguyên trạng thái, trả lời bình thường |

Không hỏi lại “bạn có chắc không?” sau một phê duyệt rõ, trừ khi trong lúc thực thi xuất hiện stop condition mới theo rule 60.

## 7. Thực thi sau phê duyệt

Sau khi người dùng phê duyệt:

1. Thực thi đúng prompt đã duyệt; không tự đổi mục tiêu hoặc mở rộng scope.
2. Không render lại prompt chỉ vì người dùng dùng câu ngắn như `làm đi`.
3. Nếu phát hiện thông tin mới làm thay đổi đáng kể scope, contract, data, security hoặc architecture, dừng và gửi prompt cập nhật để duyệt lại.
4. Nếu chỉ là chi tiết triển khai nằm trong quyền và phạm vi đã duyệt, tiếp tục theo rules/skills/workflows.
5. Báo kết quả độc lập, gồm thay đổi, kiểm thử và rủi ro còn lại.

## 8. Hành vi bị cấm

- Vừa hiển thị prompt vừa tự thực thi trong cùng lượt đối với yêu cầu chưa được duyệt.
- Xem việc người dùng gửi lỗi hoặc chọn `Pxx` là phê duyệt thực thi.
- Tạo vòng lặp prompt cho chính câu `OK`, `làm đi` hoặc `tiếp tục`.
- Bỏ qua constraint mới nằm trong câu xác nhận.
- Bịa context để prompt trông đầy đủ.
- Dùng bước duyệt prompt để vượt qua stop condition, destructive action hoặc production authority.

## 9. Ví dụ

### Yêu cầu mới

```text
Người dùng: P06: API trả 403 dù token còn hạn.
Agent: Phân tích → render P06 → hiển thị PROMPT ĐỀ XUẤT → chờ duyệt.
```

### Phê duyệt

```text
Người dùng: ok làm đi
Agent: Thực thi prompt P06 đang chờ; không tạo prompt mới.
```

### Thay đổi prompt

```text
Người dùng: ok nhưng chỉ phân tích, không sửa code
Agent: Đổi mode thành DIAGNOSE → gửi prompt mới → chờ duyệt lại.
```

### Không có prompt chờ duyệt

```text
Người dùng: cảm ơn bạn
Agent: Trả lời giao tiếp bình thường; không khởi tạo prompt.
```
