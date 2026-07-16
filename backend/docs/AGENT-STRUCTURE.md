# Cấu trúc AI Agent cho dự án backend bán điện thoại

> Cấu trúc dùng cho Antigravity IDE.
>
> Chú thích phía sau mỗi file/folder giải thích ngắn gọn chức năng của nó.

---

## 1. Cấu trúc đề xuất

~~~text
project-root/
│
├── .agents/                                      # Nơi chứa toàn bộ cấu hình AI Agent của dự án
│   │
│   ├── README.md                                 # Trang giới thiệu và chỉ mục cho con người đọc
│   │
│   ├── rules/                                    # Quy tắc Agent phải luôn tuân theo trong workspace
│   │   ├── 00-project-constitution.md            # Luật cao nhất: phạm vi, kiến trúc và nguyên tắc dự án
│   │   ├── 10-java-spring-standards.md           # Chuẩn viết Java 21 và Spring Boot
│   │   ├── 20-security-guardrails.md              # Quy tắc JWT, phân quyền, secret và bảo mật
│   │   ├── 30-database-guardrails.md              # Quy tắc MySQL, JPA, Flyway và transaction
│   │   ├── 40-api-standards.md                    # Chuẩn REST API, DTO, lỗi và OpenAPI
│   │   ├── 50-testing-requirements.md             # Yêu cầu unit, integration, security và E2E test
│   │   └── 60-safe-change-policy.md               # Quy tắc sửa code, migration và rollout an toàn
│   │
│   ├── skills/                                   # Các kỹ năng chuyên môn, chỉ được nạp khi cần
│   │   │
│   │   ├── backend-feature/                      # Kỹ năng xây dựng một tính năng backend hoàn chỉnh
│   │   │   └── SKILL.md                          # Điểm vào bắt buộc, chứa metadata và hướng dẫn thực hiện
│   │   │
│   │   ├── database-migration/                   # Kỹ năng tạo và kiểm tra Flyway migration
│   │   │   ├── SKILL.md                          # Quy trình phân tích schema, viết migration và verify
│   │   │   ├── references/                       # Tài liệu dài, chỉ đọc khi skill cần
│   │   │   │   ├── migration-checklist.md        # Checklist migration an toàn
│   │   │   │   └── mysql-patterns.md             # Các mẫu MySQL được dự án chấp nhận
│   │   │   ├── scripts/                          # Script tự động hóa có kết quả xác định
│   │   │   │   ├── validate_migration.py         # Kiểm tra tên và cấu trúc migration
│   │   │   │   └── run_migration_tests.sh        # Chạy test migration trên MySQL test container
│   │   │   └── assets/                           # Hình ảnh hoặc tài nguyên tĩnh nếu skill cần
│   │   │
│   │   ├── api-contract/                         # Kỹ năng thiết kế endpoint và cập nhật OpenAPI
│   │   │   └── SKILL.md                          # Quy trình thiết kế request, response và error contract
│   │   │
│   │   ├── security-review/                      # Kỹ năng review JWT, quyền, IDOR và dữ liệu nhạy cảm
│   │   │   └── SKILL.md                          # Checklist và quy trình security review
│   │   │
│   │   ├── testing/                              # Kỹ năng chọn và viết đúng loại test
│   │   │   └── SKILL.md                          # Hướng dẫn unit, integration, Testcontainers và E2E
│   │   │
│   │   ├── bug-diagnosis/                        # Kỹ năng tìm nguyên nhân lỗi trước khi sửa
│   │   │   └── SKILL.md                          # Quy trình tái hiện, khoanh vùng và báo nguyên nhân
│   │   │
│   │   ├── dependency-upgrade/                   # Kỹ năng nâng Spring Boot, Gradle hoặc thư viện
│   │   │   └── SKILL.md                          # Quy trình đọc release note, kiểm tra tương thích và rollback
│   │   │
│   │   └── release-readiness/                    # Kỹ năng kiểm tra dự án trước khi phát hành
│   │       └── SKILL.md                          # Kiểm tra test, migration, security và release risk
│   │
│   └── workflows/                                # Các quy trình được gọi thủ công bằng lệnh dấu /
│       ├── create-backend-feature.md             # /create-backend-feature: tạo một tính năng backend
│       ├── fix-backend-bug.md                    # /fix-backend-bug: chẩn đoán và sửa bug có regression test
│       ├── create-database-migration.md           # /create-database-migration: tạo Flyway migration an toàn
│       ├── review-api-contract.md                 # /review-api-contract: kiểm tra REST và OpenAPI contract
│       ├── review-security.md                     # /review-security: chạy quy trình security review
│       ├── run-quality-gates.md                   # /run-quality-gates: chạy build, test và kiểm tra chất lượng
│       └── prepare-release.md                     # /prepare-release: kiểm tra mức sẵn sàng phát hành
│
├── docs/                                         # Tài liệu nguồn sự thật của dự án
│   ├── architecture/                             # Kiến trúc và ranh giới module
│   ├── api/                                      # OpenAPI và tài liệu API
│   ├── database/                                 # ERD, data dictionary và migration notes
│   ├── security/                                 # Threat model và tài liệu bảo mật
│   ├── runbooks/                                 # Hướng dẫn vận hành, rollback và xử lý sự cố
│   └── adr/                                      # Các quyết định kiến trúc quan trọng
│
└── AGENT-STRUCTURE.md                            # File đang đọc: giải thích cấu trúc Agent
~~~

---

## 2. Antigravity sử dụng từng phần như thế nào?

| Thành phần | Khi nào được dùng? | Hiểu đơn giản |
| --- | --- | --- |
| `rules/` | Tự động áp dụng trong workspace | Luật Agent luôn phải nhớ |
| `skills/` | Chỉ nạp khi yêu cầu khớp mô tả skill | Kiến thức chuyên môn theo nhiệm vụ |
| `workflows/` | Người dùng gọi thủ công bằng `/` | Quy trình có sẵn để chạy lại |
| `SKILL.md` | Bắt buộc trong mỗi skill | File chính định nghĩa skill |
| `references/` | Skill đọc khi cần thêm chi tiết | Tài liệu tham khảo dài |
| `scripts/` | Skill gọi khi cần tự động hóa | Python, Bash hoặc JavaScript hỗ trợ |
| `assets/` | Skill dùng khi cần tài nguyên tĩnh | Hình ảnh, logo hoặc file mẫu tĩnh |
| `docs/` | Đọc khi task liên quan | Nguồn sự thật của dự án |

---

## 3. Cấu trúc tối thiểu của một Skill

~~~text
skill-name/
├── SKILL.md             # Bắt buộc
├── references/          # Không bắt buộc
├── scripts/             # Không bắt buộc
└── assets/              # Không bắt buộc
~~~

Nếu skill chỉ có hướng dẫn đơn giản thì chỉ cần:

~~~text
skill-name/
└── SKILL.md
~~~

Không tạo folder rỗng khi chưa dùng.

---

## 4. Mẫu đầu file SKILL.md

~~~markdown
---
name: database-migration
description: Tạo và kiểm tra Flyway migration an toàn cho MySQL. Dùng khi thay đổi bảng, cột, index, constraint hoặc backfill dữ liệu.
---

# Database Migration

Nội dung hướng dẫn của skill được viết từ đây.
~~~

Quy tắc:

- `name` phải ngắn và dùng `kebab-case`.
- `description` phải nói rõ skill làm gì và khi nào nên dùng.
- Tên folder nên giống `name`.
- Tên file phải viết đúng là `SKILL.md`.

---

## 5. File Python trong scripts có tác dụng gì?

Ví dụ:

~~~text
scripts/
└── validate_migration.py
~~~

File `.py` dùng để làm việc có kết quả rõ ràng, ví dụ:

- kiểm tra tên file migration;
- phân tích OpenAPI;
- tạo báo cáo test;
- kiểm tra cấu trúc thư mục;
- validate dữ liệu hoặc cấu hình.

`SKILL.md` hướng dẫn Agent **khi nào** chạy script. File Python thực hiện công việc tự động hóa cụ thể.

Không bắt buộc skill nào cũng phải có file Python.

---

## 6. Khác nhau giữa Rule, Skill và Workflow

### Rule

~~~text
Luôn phải tuân theo
~~~

Ví dụ: không được trả JPA Entity trực tiếp qua API.

### Skill

~~~text
Chỉ được nạp khi gặp đúng nhiệm vụ
~~~

Ví dụ: khi tạo migration, Agent nạp skill `database-migration`.

### Workflow

~~~text
Người dùng chủ động gọi bằng lệnh /
~~~

Ví dụ: gọi `/prepare-release` trước khi phát hành.

---

## 7. Quy tắc đặt tên

- Folder skill: `kebab-case`, ví dụ `security-review`.
- File rule: bắt đầu bằng số để dễ đọc theo nhóm.
- File workflow: `kebab-case.md`.
- File bắt buộc của skill: `SKILL.md`.
- Script Python: `snake_case.py`.
- Mỗi skill chỉ nên phụ trách một nhóm nhiệm vụ rõ ràng.

Số `00`, `10`, `20` giúp sắp xếp và đọc dễ hơn; nó không tự thay thế phần quy định thứ tự ưu tiên bên trong các rule.

---

## 8. Lưu ý cho dự án lớn

- Chỉ đặt các nguyên tắc luôn cần thiết trong `rules/`.
- Tài liệu dài và ví dụ nên chuyển vào `references/` của skill.
- Không nhét mọi kiến thức vào một `SKILL.md` khổng lồ.
- Workflow chỉ gọi các bước; rule mới là hàng rào bắt buộc.
- Script không được tự ý sửa production hoặc chứa secret.
- Không cần `openai.yaml` khi dùng cấu trúc workspace của Antigravity IDE.
- `.agents/README.md` chỉ là mục lục hỗ trợ con người; Antigravity không yêu cầu file này.

---

## 9. Cấu trúc nhỏ nhất để bắt đầu

Nếu chưa muốn tạo toàn bộ ngay, có thể bắt đầu với:

~~~text
.agents/
├── rules/
│   ├── 00-project-constitution.md
│   ├── 10-java-spring-standards.md
│   ├── 20-security-guardrails.md
│   ├── 30-database-guardrails.md
│   ├── 40-api-standards.md
│   ├── 50-testing-requirements.md
│   └── 60-safe-change-policy.md
├── skills/
│   └── backend-feature/
│       └── SKILL.md
└── workflows/
    ├── create-backend-feature.md
    └── run-quality-gates.md
~~~

Sau đó chỉ thêm skill hoặc workflow khi xuất hiện nhu cầu lặp lại thật sự.
