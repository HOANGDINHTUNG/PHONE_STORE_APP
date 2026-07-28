# HIẾN PHÁP & CẤU HÌNH KHÔNG GIAN LÀM VIỆC TÁC NHÂN AI (AGENTS.md)
**Dự án (Project):** Phone Store E-Commerce System  
**Phiên bản chuẩn (Version):** 2.0.0 – Enterprise Agentic Architecture  
**Tư cách pháp lý (Source of Truth):** Tệp tin này là **Nguồn Sự Thật Duy Nhất (Single Source of Truth)** cho toàn bộ hệ thống AI Agent và Developer khi lập trình, kiểm thử và bảo trì dự án Phone Store. Mọi dòng code, quy trình nghiệp vụ và thao tác hệ thống **BẮT BUỘC** phải tuân thủ nghiêm ngặt các chỉ thị dưới đây.

---

## 1. CẤU TRÚC ÁNH XẠ TRI THỨC & NGUYÊN TẮC TIÊU HAO TOKEN (`.agents/`)

Hệ thống "não bộ" của Phone Store được phân rã thành 4 vùng không gian làm việc chuyên biệt bên trong thư mục `.agents/`. AI Agent có trách nhiệm tải ngữ cảnh (context loading) theo nguyên tắc **Tiết lộ Tăng dần (Progressive Disclosure)** để tối ưu chi phí token và tránh quá tải bộ nhớ:

```text
my-phone-store-repo/
├── AGENTS.md                                    # [Tệp này] Lệnh điều hành tối cao (Root Context)
├── docs/api/openapi.yaml                        # Nguồn sự thật duy nhất cho API Contract
├── .agents/
│   ├── rules/                                   # Luật chung - Yêu cầu BẮT BUỘC tuân thủ 100%
│   ├── skills/                                  # Kho kỹ năng nghiệp vụ chuyên sâu (Domain Skills)
│   ├── workflows/                               # SOPs - Quy trình thực hiện tuần tự từng bước
│   └── prompts/                                 # Thư viện Prompt mẫu (P00-P12, C01-C99)
└── ...
```

| Thư mục | Mục đích Kỹ thuật | Cơ chế Nạp vào Ngữ cảnh (Loading Strategy) |
| :--- | :--- | :--- |
| `.agents/rules/` | **Hàng rào bảo vệ (Guardrails):** Chứa các bộ luật cốt lõi, bắt buộc áp dụng cho mọi dòng code. | **Luôn luôn nạp (Always Active):** Nạp tự động vào bộ nhớ ngay từ đầu mỗi phiên làm việc. |
| `.agents/skills/` | **Mảnh ghép kỹ năng:** Chứa kiến thức domain chuyên sâu, mẫu code và script kiểm tra cho từng mô-đun. | **Nạp theo yêu cầu (On-Demand):** Chỉ tải vào ngữ cảnh khi task khớp với mô tả trong `SKILL.md`. |
| `.agents/workflows/` | **Quy trình chuẩn (SOPs):** Các bản hướng dẫn làm việc bước-nối-bước (Step-by-Step). | **Nạp khi kích hoạt lệnh:** Chỉ nạp khi thực thi các tác vụ có quy trình định sẵn. |
| `.agents/prompts/` | **Thư viện chẩn đoán:** Chứa profile chẩn đoán lỗi `P00-P12`, `C01-C99` và prompt nền. | **Nạp khi debug/xử lý lỗi:** Chỉ nạp khi kích hoạt hệ thống tự động chẩn đoán lỗi. |

---

## 2. HỆ THỐNG LUẬT CHUNG BẮT BUỘC (`.agents/rules/`)

Đây là danh sách các bộ quy tắc mang tính **ép buộc tuyệt đối**. AI Agent không được phép viện cớ tối ưu hoặc "sáng tạo" để vi phạm các tiêu chuẩn này:

* **`00-project-constitution.md` (Hiến pháp dự án):** Định hướng cao nhất cho mọi quyết định thiết kế kiến trúc, lựa chọn công nghệ và phân định ranh giới hệ thống trong Phone Store.
* **`10-java-spring-standards.md` (Chuẩn lập trình Java/Spring Boot):** Tiêu chuẩn viết code Java, quản lý Dependency Injection, cấu trúc Layered Architecture (Controller → Service → Repository), xử lý Exception toàn cục và khai báo Bean.
* **`20-security-guardrails.md` (Hàng rào Bảo mật):** Tiêu chuẩn an toàn bảo mật tuyệt đối. Quy định cách xử lý Token (JWT), mã hóa mật khẩu, phân quyền truy cập (RBAC), phòng chống tấn công IDOR, CORS, CSRF, và cấm hardcode bí mật (secrets/keys) trong mã nguồn.
* **`30-database-guardrails.md` (An toàn Cơ sở dữ liệu):** Nguyên tắc thiết kế bảng MySQL, đặt tên khóa chính/khóa ngoại, đánh chỉ mục (indexing), quản lý transaction và tiêu chuẩn viết script di dời dữ liệu (migration).
* **`40-api-standards.md` (Chuẩn giao tiếp REST API):** Quy chuẩn đặt tên endpoint (noun-based, plural), định dạng dữ liệu JSON, quản lý mã trạng thái HTTP (200, 201, 400, 401, 403, 404, 500) và cấu trúc gói lỗi (Error Response Payload).
* **`50-testing-requirements.md` (Tiêu chuẩn Kiểm thử):** Yêu cầu bắt buộc về độ bao phủ mã nguồn (code coverage). Quy định cách viết Unit Test và Integration Test để đảm bảo chất lượng trước khi hợp nhất mã.
* **`60-safe-change-policy.md` (Chính sách Thay đổi An toàn):** Quy định kiểm soát thay đổi có rủi ro cao (breaking changes, sửa schema DB đang có dữ liệu, sửa API contract). Bắt buộc phải có lộ trình tương thích ngược.
* **`70-prompt-approval-policy.md` (Luật Phê duyệt Prompt):** Quy định tối cao về việc tự động tổng hợp prompt hoàn chỉnh và yêu cầu Người dùng duyệt trước khi được thi hành bất kỳ thao tác chỉnh sửa nào.

---

## 3. KHO KỸ NĂNG XỬ LÝ NGHIỆP VỤ (`.agents/skills/`)

Mỗi khi nhận nhiệm vụ mới liên quan đến các mô-đun cụ thể của Phone Store, AI Agent phải tra cứu vào thư mục `.agents/skills/` tương ứng. 

### 3.1. Cấu trúc Tiêu chuẩn của một Skill
Mỗi thư mục kỹ năng phải duy trì nguyên vẹn cấu trúc 4 phần sau:
1. **`SKILL.md`**: Tệp tổng quan mô tả năng lực, phạm vi domain và trigger kích hoạt kỹ năng.
2. **`references/`**: Chứa tài liệu thiết kế chi tiết (lưu đồ sự kiện, sơ đồ trạng thái, chu trình nghiệp vụ).
3. **`scripts/`**: Chứa các đoạn mã thực thi tự động (ví dụ: các script validator, công cụ kiểm tra nhanh).
4. **`assets/`**: Chứa các tệp mẫu (templates), cấu hình mẫu có sẵn để Agent tái sử dụng ngay.

### 3.2. Danh mục Kỹ năng Cốt lõi (Domain Capabilities)
AI Agent phải tự nhận diện yêu cầu và áp dụng đúng kỹ năng:
* **`design-database-migrations`**: Kỹ năng viết DB migration. Xử lý mở rộng cấu trúc cơ sở dữ liệu với **Flyway**, đảm bảo bảo toàn dữ liệu cũ (data preservation) và không gây khóa bảng (table lock) trên production.
* **`implement-auth-security`**: Kỹ năng xây dựng hệ thống Đăng nhập - Xác thực - Bảo mật. Xử lý luồng cấp phát/làm mới JWT, bộ lọc bảo mật Spring Security và quản lý phiên làm việc.
* **`document-openapi-swagger`**: Kỹ năng quản lý tài liệu OpenAPI 3.1, cấu hình Swagger UI / springdoc, thiết lập nút Try it out, tích hợp JWT Authorize, chuẩn bị dữ liệu mẫu và phân tách cấu hình giữa profile demo và production.
* **`build-catalog-inventory`**: Nghiệp vụ quản lý Sản phẩm (Catalog) và Tồn kho (Inventory). Xử lý phân cấp danh mục điện thoại, biến thể sản phẩm (dung lượng, màu sắc), và bài toán trừ tồn kho đồng thời (concurrency control).
* **`build-cart-checkout`**: Nghiệp vụ Quản lý Giỏ hàng và Tính toán Thanh toán (Checkout). Xử lý định giá, áp dụng mã giảm giá, kiểm tra tồn kho trước khi tạo đơn.
* **`build-order-payment-shipping`**: Nghiệp vụ Đặt hàng - Thanh toán - Giao hàng. Quản lý máy trạng thái đơn hàng (Order State Machine), tích hợp cổng thanh toán và theo dõi vận chuyển.

---

## 4. QUY TRÌNH THỰC HIỆN TUẦN TỰ (`.agents/workflows/`)

Để đảm bảo mọi công việc được thực hiện trọn vẹn từ A-Z mà không bỏ sót bước, AI Agent phải tuân thủ hướng dẫn từng bước (Step-by-Step SOPs) trong các tệp quy trình:

* **`implement-endpoint.md`**: Quy trình chuẩn hóa để xây dựng một REST API mới từ đầu đến cuối (Từ viết contract → DTO → Controller → Service → Repository → Viết Test).
* **`manage-openapi-swagger.md`**: Quy trình tích hợp và đồng bộ tài liệu Swagger, đảm bảo giữ vững nguyên tắc Source of Truth.
* **`run-quality-gate.md`**: Quy trình kiểm tra chất lượng tự động trước khi release (Kiểm tra linter, dịch thành công, chạy toàn bộ bộ test, rà soát lỗ hổng bảo mật).
* **`debug-by-prompt.md`**: Quy trình thực thi chẩn đoán và sửa lỗi theo ma trận Prompt Mẫu từ `P00` đến `P12`.

---

## 5. CHIẾN LƯỢC QUẢN LÝ API (OPENAPI & SWAGGER ARCHITECTURE)

Dự án Phone Store áp dụng các tiêu chuẩn quản lý tài liệu API nghiêm ngặt nhất nhằm tránh hiện tượng lệch pha tài liệu (Documentation Drift):

1. **Chính sách Contract-First Tối cao:** Tệp tin **`docs/api/openapi.yaml`** là **Nguồn Sự Thật Duy Nhất (Single Source of Truth)**. Tuyệt đối không viết code Controller trước rồi để framework tự động sinh ngược ra tài liệu.
2. **Độc lập Trình diễn Swagger UI:** Swagger UI chỉ được phép đọc chính contract `openapi.yaml` đó hoặc bản sao runtime được build tự động. **KHÔNG** duy trì spec viết tay và annotation trong code như hai nguồn dữ liệu độc lập.
3. **Quy tắc Khai báo Annotation (`*Api` Interfaces):** Chỉ được phép sử dụng Swagger annotation khi dự án có quyết định kiến trúc (ADR) chọn mô hình Code-First. Khi đó, toàn bộ annotation phải đặt trên các interface `*Api` nằm tại mô-đun sở hữu endpoint. Controller thực thi (implement) interface này và **KHÔNG ĐƯỢC PHÉP** khai báo lại mapping trùng lặp.
4. **Hàng rào Bảo mật Môi trường (Profile Guardrails):**
   * **Môi trường Local / Demo:** Được phép bật tính năng `Try it out`, cung cấp dữ liệu mẫu và bật nút `JWT Authorize` để thuận tiện thử nghiệm.
   * **Môi trường Production:** **BẮT BUỘC TẮT HOÀN TOÀN** hoặc có cơ chế bảo vệ nghiêm ngặt đối với giao diện Swagger UI, runtime docs và đường dẫn truy cập spec API.
5. **Prompt Hỗ trợ Tích hợp:** Khi cần làm việc với OpenAPI/Swagger, Agent tự động gọi prompt chuẩn bị sẵn tại **`prompts/REQUEST-OPENAPI-SWAGGER.md`**.

---

## 6. THƯ VIỆN PROMPT CHẨN ĐOÁN LỖI TỰ ĐỘNG (`P00–P12` & `C01–C99`)

Khi xử lý lỗi hệ thống, AI Agent sử dụng kỹ năng **`debug-prompt-library`** để phân tích nguyên nhân gốc rễ, ghép nối ngữ cảnh và tạo ra giải pháp sửa chữa chính xác theo chuyên môn.

### 6.1. Cơ chế Tự động định tuyến (AUTO Routing)
Người dùng chỉ cần dán chuỗi lỗi vào khung chat theo cú pháp:
```text
AUTO: <dán toàn bộ stack trace, log lỗi hoặc mô tả bug vào đây>
```
**Luồng tự động thực thi của Agent:**
`Lỗi thô → Phân loại chuyên môn → Chọn Profile (P00-P12/C01-C99) → Ghép nối với BASE-ERROR-PROMPT.md → Điền lỗi & Project Context vào placeholder → GỬI PROMPT ĐỀ XUẤT XIN DUYỆT → (Người dùng đồng ý) → Thực thi sửa code/test → Kiểm chứng → Báo cáo`.

### 6.2. Các chế độ Gọi thủ công & Điều khiển
* **Chọn Profile chỉ định:** `P06: <dán lỗi JWT, 401 hoặc 403 vào đây>`
* **Yêu cầu hiển thị rõ Prompt ghép nối:** `P06 SHOW_PROMPT: <dán lỗi vào đây>` (Agent buộc phải hiển thị toàn bộ văn bản prompt sau khi ghép để người dùng kiểm chứng sâu).
* **Tùy biến Profile (`C01-C99`):** Agent có thể đọc các profile tùy biến của Người dùng tạo từ `CUSTOM-PROMPT-PROFILE.template.md` (mã từ `C01` đến `C99`). Hệ thống AUTO routing sẽ ưu tiên chọn profile custom nếu độ khớp ngữ cảnh cao hơn profile chuẩn.

### 6.3. Ma trận Phân loại Danh mục Prompt (`prompts/`)
Agent phải căn cứ vào ma trận dưới đây để chọn mã xử lý phù hợp nhất (Chi tiết catalogue lưu tại `skills/debug-prompt-library/references/prompt-catalog.md` và hợp đồng placeholder tại `prompts/PROMPT-SCHEMA.md`):

| Mã | Tên gọi Profile | Phạm vi Chức năng & Chuyên môn Xử lý |
| :---: | :--- | :--- |
| **`P00`** | **Auto Triage & Full Fix** | Agent tự động phân loại, tạo prompt và sửa trọn gói sau khi được Người dùng phê duyệt. |
| **`P01`** | **Diagnosis Only** | Chỉ chẩn đoán nguyên nhân gốc rễ (root cause), phân tích log; **TUYỆT ĐỐI KHÔNG SỬA FILE**. |
| **`P02`** | **General Bug Fix** | Sửa các lỗi logic chung, bug an toàn tổng quát trên toàn hệ thống. |
| **`P03`** | **Build & Dependency** | Xử lý lỗi hệ thống build, cấu hình Gradle/Maven, xung đột dependency và lỗi compile. |
| **`P04`** | **Spring Startup & DI** | Xử lý lỗi khởi động Spring Boot, lỗi tiêm phụ thuộc (Injection), Bean lifecycle, Configuration. |
| **`P05`** | **REST API & DTO** | Xử lý lỗi REST API, HTTP mapping, lỗi định dạng DTO, validation data và lỗi parse JSON. |
| **`P06`** | **Security & Auth** | Xử lý lỗi Spring Security, JWT token, lỗi phân quyền 401/403, cấu hình CORS và CSRF. |
| **`P07`** | **Database & JPA** | Xử lý lỗi MySQL, JPA/Hibernate mapping, lỗi câu truy vấn SQL và lỗi di dời Flyway. |
| **`P08`** | **Business & Concurrency** | Xử lý lỗi nghiệp vụ phức tạp, quản lý transaction, máy trạng thái đơn hàng và lỗi đồng thời. |
| **`P09`** | **Quality Gate & Testing** | Xử lý lỗi viết test JUnit 5, Mockito, Testcontainers, jqwik, PITest, Jazzer và vượt Quality Gate. |
| **`P10`** | **Performance & Cache** | Xử lý lỗi hiệu năng, truy vấn N+1, timeout kết nối, cạn kiệt tài nguyên và lỗi bộ nhớ đệm. |
| **`P11`** | **DevOps & Docker** | Xử lý lỗi đóng gói Docker, biến môi trường, container hóa và lỗi chuỗi tích hợp CI/CD. |
| **`P12`** | **Deep Debug Suite** | Chẩn đoán chuyên sâu cho các lỗi dai dẳng, lỗi ngẫu nhiên (flaky bugs) hoặc rò rỉ đa tầng. |

---

## 7. CỔNG PHÊ DUYỆT PROMPT BẮT BUỘC (PROMPT APPROVAL GATE - SUPREME LAW)

> 🚨 **CHỈ THỊ TỐI CAO KHÔNG ĐƯỢC VI PHẠM:**
> Khi Người dùng gửi một yêu cầu mới có nội dung kỹ thuật, nghiệp vụ, báo lỗi, tạo chức năng, tài liệu hoặc deliverable cần xử lý, **AI Agent BẮT BUỘC PHẢI DỪNG LẠI SAU BƯỚC PHÂN TÍCH**.  
> Agent phải tự động phân tích yêu cầu, chọn prompt/skill/workflow phù hợp, điền đầy đủ context để tạo thành một **Prompt Đề Xuất Hoàn Chỉnh**, gửi cho Người dùng duyệt và **DỪNG TOÀN BỘ THAO TÁC THỰC THI**. Agent chỉ được bắt đầu sửa file hoặc chạy lệnh hệ thống sau khi Người dùng đã xác nhận đồng ý.

### 7.1. Khi nào phải tạo Prompt và xin duyệt?
Agent buộc phải kích hoạt Cổng Phê Duyệt khi tin nhắn của Người dùng chứa các yêu cầu mới:
1. Dán mã lỗi, stack trace, log hệ thống để yêu cầu phân tích hoặc sửa chữa.
2. Yêu cầu tạo mới, mở rộng hoặc chỉnh sửa tính năng nghiệp vụ.
3. Yêu cầu thiết kế kiến trúc, cấu trúc REST API, cơ sở dữ liệu, bảo mật hoặc kiểm thử.
4. Yêu cầu review code, refactor, tối ưu hóa hiệu năng hoặc viết tài liệu kỹ thuật.
5. Yêu cầu bổ sung mục tiêu, constraint, acceptance criteria (tiêu chí nghiệm thu) hoặc phạm vi mới.
* *Quy tắc áp dụng:* Với lỗi -> dùng `BASE-ERROR-PROMPT.md` kết hợp profile `P00–P12`/`C01–C99`. Với yêu cầu tính năng/tài liệu -> dùng `REQUEST-PROMPT.template.md` kết hợp skill/workflow tương ứng.
* *Ràng buộc trước phê duyệt:* Agent chỉ được đọc các file context cần thiết để tạo prompt đề xuất; **KHÔNG ĐƯỢC PHÉP SỬA BẤT KỲ FILE NÀO HOẶC TỰ THỰC THI TASK**.

### 7.2. Chu trình Trạng thái Phê duyệt (State Machine Workflow)

```text
[Yêu cầu mới từ Người dùng]
           │
           v
[1. Phân tích mục tiêu, phạm vi & đọc ngữ cảnh dự án]
           │
           v
[2. Chọn Prompt Profile / Skill / Workflow phù hợp]
           │
           v
[3. Ghép nối & điền Placeholder -> Tạo Prompt Hoàn chỉnh]
           │
           v
[4. Xuất khối "PROMPT ĐỀ XUẤT" ra màn hình] ───> [DỪNG THỰC THI & CHỜ DUYỆT]
                                                          │
   ┌──────────────────────────────────────────────────────┴──────────────────────────────────────────────────────┐
   │                                                      │                                                      │
   v                                                      v                                                      v
Người dùng gõ lệnh:                                Người dùng gõ lệnh:                                    Người dùng gõ lệnh:
"ĐỒNG Ý" / "OK" / "LÀM ĐI"...                      "SỬA: <yêu cầu điều chỉnh>"                            "HỦY" / "CANCEL"
   │                                                      │                                                      │
   v                                                      v                                                      v
[THỰC THI NHIỆM VỤ]                                [Cập nhật lại Prompt Đề xuất]                          [Hủy toàn bộ tiến trình]
(Sửa code -> Viết Test ->                         (Quay lại bước 4 và tiếp tục                           (Dọn dẹp bộ nhớ tạm,
 Chạy Quality Gate -> Báo cáo)                     chờ Người dùng phê duyệt lại)                           chờ lệnh mới)
```

### 7.3. Định dạng Chuẩn Bắt buộc Xuất màn hình (Mandatory Output Format)
Khi trình diện kế hoạch trước Người dùng, AI Agent **BẮT BUỘC PHẢI TRẢ VỀ** khối văn bản theo đúng định dạng và thứ tự dưới đây (Chi tiết luật lưu tại `rules/70-prompt-approval-policy.md`):

```text
PROMPT ĐỀ XUẤT

[Prompt hoàn chỉnh đã được điền mục tiêu, context, phạm vi,
rules, skills, workflow, đầu ra, kiểm thử và ràng buộc]

XÁC NHẬN
- ĐỒNG Ý / OK / LÀM ĐI: thực thi prompt trên.
- SỬA: <nội dung>: cập nhật prompt và gửi lại để duyệt.
- HỦY: không thực hiện.
```

*(Lưu ý: Agent KHÔNG ĐƯỢC PHÉP vừa gửi khối "PROMPT ĐỀ XUẤT" vừa tự ý triển khai code ngay trong cùng một lượt thoại).*

### 7.4. Quy tắc Nhận diện Lệnh Điều khiển Ngắn (Short Command Recognition)
Sau khi khối `PROMPT ĐỀ XUẤT` được trình diện, hệ thống tiếp nhận các phản hồi ngắn từ Người dùng theo quy tắc sau:

* **Các câu lệnh xác nhận đồng ý:**
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
    * **Xử lý khi CÓ prompt chờ duyệt:** Nếu lượt thoại ngay liền trước là một `PROMPT ĐỀ XUẤT`, các câu ngắn trên chính là **lệnh phê duyệt chính thức**. Agent lập tức bước vào phase thực thi nhiệm vụ, **KHÔNG** tạo lại prompt đề xuất nữa.
    * **Xử lý khi KHÔNG CÓ prompt chờ duyệt:** Nếu không có đề xuất nào đang chờ, các câu giao tiếp ngắn này được phản hồi như hội thoại bình thường; Agent **KHÔNG ĐƯỢC** tự bịa ra hay giả định nhiệm vụ mới.
* **Phê duyệt kèm yêu cầu thay đổi:**
    * Nếu câu xác nhận có chứa thêm điều kiện mới (Ví dụ: *"ok nhưng thêm cho anh chức năng phân trang vào API này"* hoặc *"làm đi nhưng không được sửa bảng order"*), đây **KHÔNG PHẢI** là lệnh thực thi ngay!
    * *Xử lý:* Agent phải ghi nhận điều kiện mới, điều chỉnh lại nội dung trong khối `PROMPT ĐỀ XUẤT` và trình diện lại cho Người dùng duyệt.