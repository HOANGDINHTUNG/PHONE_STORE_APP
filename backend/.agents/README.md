# Giới thiệu Cấu trúc thư mục `.agents`

Thư mục `.agents` là nơi chứa "não bộ" hướng dẫn cho hệ thống AI Agent cũng như là tài liệu chuẩn mực cho Developer trong suốt quá trình phát triển dự án Phone Store. Mục đích của thư mục này là đảm bảo mọi đoạn code và luồng nghiệp vụ đều được thực hiện nhất quán, an toàn và chuẩn xác.

Dưới đây là giải thích ngắn gọn, dễ hiểu về các thành phần bên trong:

## 1. `rules/` (Luật chung - Yêu cầu bắt buộc)

Đây là các bộ quy tắc cốt lõi, mang tính ép buộc đối với mọi dòng code liên quan tới dự án.

- **`00-project-constitution.md`**: Hiến pháp dự án. Định hướng mọi quyết định thiết kế.
- **`10-java-spring-standards.md`**: Chuẩn mực lập trình Java và Spring Boot.
- **`20-security-guardrails.md`**: Hàng rào bảo mật (xử lý Token, mã hoá, phân quyền...).
- **`30-database-guardrails.md`**: An toàn với CSDL (thiết kế bảng, khoá, migration...).
- **`40-api-standards.md`**: Chuẩn giao tiếp REST API (Naming, format JSON, status codes...).
- **`50-testing-requirements.md`**: Tiêu chuẩn viết Test để đảm bảo chất lượng.
- **`60-safe-change-policy.md`**: Quy định thay đổi và phê duyệt an toàn.
- **`70-prompt-approval-policy.md`**: Luật tạo prompt hoàn chỉnh và bắt buộc chờ người dùng duyệt trước khi thực thi.

## 2. `skills/` (Tập hợp các kỹ năng xử lý)

Mỗi thư mục con trong này là "một mảnh ghép kỹ năng". Khi Agent được yêu cầu thực hiện sửa/tạo tính năng gì, nó sẽ lấy kỹ năng từ đây. Cấu trúc điển hình của 1 skill gồm:

- **`SKILL.md`**: Khái quát về chức năng/domain này.
- **`references/`**: Các tài liệu thiết kế chi tiết (flow sự kiện, vòng đời trạng thái...).
- **`scripts/`**: Chứa các đoạn code thực thi tự động (vd: validator).
- **`assets/`**: Chứa các file mẫu (template) có sẵn.

_Một số kỹ năng tiêu biểu:_

- `design-database-migrations`: Kỹ năng viết DB migration (mở rộng với Flyway, giữ data).
- `implement-auth-security`: Kỹ năng làm tính năng Đăng nhập - Bảo mật.
- `build-catalog-inventory`: Nghiệp vụ về Sản phẩm (Catalog) và Tồn kho (Inventory).
- `build-cart-checkout` / `build-order-payment-shipping`: Nghiệp vụ Giỏ hàng - Đặt hàng - Thanh toán - Giao hàng.

## 3. `workflows/` (Quy trình thực hiện)

Chứa các bản hướng dẫn làm việc từng bước (step-by-step). Nó định hướng Agent phải trải qua những thao tác/lệnh nào để làm xong 1 việc trọn vẹn, không bỏ sót bước.

- _Ví dụ:_ `implement-endpoint.md` (Cách làm ra 1 API từ đầu đến cuối), `run-quality-gate.md` (Quy trình kiểm tra chất lượng tự động trước khi release).

## 4. Thư viện prompt mẫu tự động `P00–P12`

Skill `debug-prompt-library` không chỉ chọn workflow. Nó tự phân tích lỗi, chọn profile trong `prompts/`, ghép profile với `BASE-ERROR-PROMPT.md`, điền lỗi và context project vào placeholder, gửi prompt hoàn chỉnh cho bạn duyệt, rồi mới thực thi.

Bạn có thể chỉ dán lỗi. Agent sẽ tự chọn prompt phù hợp:

```text
AUTO: <dán toàn bộ lỗi vào đây>
```

Luồng tự động: `Lỗi thô → phân loại → chọn profile → điền placeholder → gửi duyệt → đồng ý → thực thi → sửa/test → báo cáo`.

Cũng có thể chọn profile thủ công:

```text
P06: <dán lỗi JWT, 401 hoặc 403 vào đây>
```

Agent luôn hiển thị prompt sau khi ghép và chờ bạn duyệt. Bạn vẫn có thể ghi rõ `SHOW_PROMPT`:

```text
P06 SHOW_PROMPT: <dán lỗi vào đây>
```

Prompt nền và profile nằm trong `prompts/`. Bạn có thể sao chép `CUSTOM-PROMPT-PROFILE.template.md`, tạo mã `C01–C99` và thêm prompt riêng; AUTO routing sẽ sử dụng profile custom nếu khớp hơn.

Danh mục nhanh:

| Mã | Chức năng |
| --- | --- |
| `P00` | Agent tự phân loại, tạo prompt và sửa trọn gói sau khi được duyệt |
| `P01` | Chỉ chẩn đoán root cause, không sửa file |
| `P02` | Sửa bug an toàn tổng quát |
| `P03` | Build, Gradle, dependency và compile |
| `P04` | Spring startup, bean, DI và configuration |
| `P05` | REST API, HTTP, DTO, validation và JSON |
| `P06` | Security, JWT, 401/403, CORS/CSRF và quyền |
| `P07` | MySQL, JPA/Hibernate, SQL và Flyway |
| `P08` | Nghiệp vụ, transaction, state và concurrency |
| `P09` | JUnit, Mockito, Testcontainers, jqwik, PITest, Jazzer và quality gate |
| `P10` | Performance, N+1, timeout, resource và cache |
| `P11` | Docker, biến môi trường và CI/CD |
| `P12` | Deep debug cho lỗi dai dẳng, ngẫu nhiên hoặc đa tầng |

Chi tiết mã nằm trong `skills/debug-prompt-library/references/prompt-catalog.md`. Hợp đồng placeholder nằm trong `prompts/PROMPT-SCHEMA.md`. Workflow thực thi là `workflows/debug-by-prompt.md`.

## 5. Luật duyệt prompt trước khi Agent thực thi

Đây là luật bắt buộc của dự án:

> Khi người dùng gửi một yêu cầu mới có nội dung kỹ thuật, nghiệp vụ, lỗi, chức năng, tài liệu hoặc deliverable cần xử lý, Agent phải phân tích yêu cầu, chọn prompt mẫu có sẵn, điền đầy đủ context để tạo thành một prompt hoàn chỉnh, gửi prompt đó cho người dùng duyệt và dừng lại. Agent chỉ được bắt đầu thực hiện sau khi người dùng đồng ý.

Luồng bắt buộc:

```text
Yêu cầu mới
→ Phân tích mục tiêu và phạm vi
→ Chọn prompt/profile phù hợp
→ Kết hợp rules + skills + workflow
→ Điền placeholder
→ Gửi PROMPT ĐỀ XUẤT
→ Chờ người dùng ĐỒNG Ý
→ Thực thi
→ Kiểm thử và báo cáo
```

### 5.1. Khi nào phải tạo prompt và xin duyệt?

Phải tạo prompt khi tin nhắn chứa yêu cầu mới như:

- dán lỗi, stack trace hoặc log để phân tích/sửa;
- yêu cầu tạo hoặc sửa chức năng;
- thiết kế API, database, security, architecture hoặc testing;
- review, refactor, tối ưu hoặc tạo tài liệu;
- bổ sung mục tiêu, constraint, acceptance criteria hoặc phạm vi mới.

Với lỗi, Agent dùng `BASE-ERROR-PROMPT.md` cùng profile `P00–P12/C01–C99`. Với yêu cầu khác, Agent dùng `REQUEST-PROMPT.template.md` và kết hợp skill/workflow phù hợp.

Trước khi được duyệt, Agent chỉ được phân tích và đọc context cần thiết để tạo prompt chính xác; không được sửa file hoặc tự thực thi task.

### 5.2. Cách người dùng phê duyệt

Sau mỗi prompt đề xuất, Agent phải đưa ra ba lựa chọn:

```text
XÁC NHẬN
- ĐỒNG Ý / OK / LÀM ĐI: thực thi prompt trên.
- SỬA: <nội dung>: cập nhật prompt và gửi lại để duyệt.
- HỦY: không thực hiện.
```

Các câu ngắn như dưới đây, nếu không chứa yêu cầu mới, được xử lý bình thường và không phải tạo thêm prompt:

```text
ok
đồng ý
làm đi
triển khai đi
tiếp tục
làm tiếp
chuẩn rồi
cảm ơn
```

- Nếu đang có prompt chờ duyệt, `ok`, `đồng ý`, `làm đi`, `tiếp tục`… chính là lệnh phê duyệt prompt gần nhất; Agent thực thi luôn và không tạo lại prompt.
- Nếu không có prompt chờ duyệt, những câu giao tiếp hoặc điều khiển ngắn này được phản hồi bình thường; Agent không tự bịa ra nhiệm vụ mới.
- Nếu câu xác nhận có thêm yêu cầu như `ok nhưng thêm phân trang`, đó là thay đổi nội dung. Agent phải cập nhật prompt và xin duyệt lại.

### 5.3. Định dạng Agent phải trả trước khi làm

```text
PROMPT ĐỀ XUẤT

[Prompt hoàn chỉnh đã được điền mục tiêu, context, phạm vi,
rules, skills, workflow, đầu ra, kiểm thử và ràng buộc]

XÁC NHẬN
- ĐỒNG Ý / OK / LÀM ĐI: thực thi prompt trên.
- SỬA: <nội dung>: cập nhật prompt và gửi lại để duyệt.
- HỦY: không thực hiện.
```

Agent không được vừa gửi prompt đề xuất vừa tự triển khai trong cùng lượt. Chi tiết bắt buộc nằm trong `rules/70-prompt-approval-policy.md`.

---

### Tóm lại

- **`rules/`** = Luật bắt buộc không được làm sai.
- **`skills/`** = Kho tàng kiến thức cách lập trình cho từng module.
- **`prompts/`** = Prompt nền, các profile lỗi và mẫu để tự thêm prompt riêng.
- **`workflows/`** = Quy trình theo thứ tự 1-2-3 để hoàn thành các công việc cụ thể.
- **`P00–P12`** = Cách gọi nhanh workflow xử lý lỗi theo đúng mức quyền và chuyên môn.
- **Prompt Approval Gate** = Mọi yêu cầu mới phải được chuyển thành prompt hoàn chỉnh và được người dùng duyệt trước khi Agent làm.
