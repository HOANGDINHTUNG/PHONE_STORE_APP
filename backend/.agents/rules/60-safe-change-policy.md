# Phone Store Backend — Safe Change Policy

## 1. Mục đích

Rule này bảo đảm mọi thay đổi:

- đúng phạm vi được yêu cầu;
- không ghi đè công việc hiện có;
- không gây breaking change ngoài dự kiến;
- có phân loại rủi ro và bằng chứng kiểm thử tương xứng;
- không làm mất dữ liệu;
- không làm suy yếu authentication, authorization hoặc audit;
- không tạo trùng đơn hàng, thanh toán, hoàn tiền hoặc tồn kho;
- có kế hoạch rollout, rollback hoặc forward recovery phù hợp;
- có thể review, truy vết và giải thích;
- không được tuyên bố hoàn tất khi chưa xác minh.

Mục tiêu không phải là làm mọi thay đổi trở nên chậm. Mục tiêu là tăng mức kiểm soát theo đúng blast radius và rủi ro thực tế.

---

## 2. Thứ tự ưu tiên

Rule này phải được đọc cùng:

1. `00-project-constitution.md`;
2. `10-java-spring-standards.md`;
3. `20-security-guardrails.md`;
4. `30-database-guardrails.md`;
5. `40-api-standards.md`;
6. `50-testing-requirements.md`;
7. tài liệu kiến trúc, ADR và runbook liên quan.

Khi có xung đột:

- bảo mật, toàn vẹn dữ liệu và invariant nghiệp vụ có ưu tiên cao nhất;
- contract đã phát hành không được phá vỡ âm thầm;
- thay đổi production cần thẩm quyền riêng, không được suy diễn từ quyền sửa code;
- ngoại lệ phải được ghi nhận và phê duyệt.

---

## 3. Từ khóa quy phạm

- **MUST / PHẢI**: bắt buộc.
- **MUST NOT / KHÔNG ĐƯỢC**: bị cấm.
- **SHOULD / NÊN**: mặc định phải làm; bỏ qua cần lý do.
- **MAY / CÓ THỂ**: tùy chọn có kiểm soát.

AI agent không được tự hạ mức **MUST** xuống khuyến nghị.

---

## 4. Phạm vi áp dụng

Rule áp dụng cho:

- code production;
- test code;
- API contract;
- database schema và dữ liệu;
- Flyway migration;
- Gradle build;
- dependency và plugin;
- cấu hình ứng dụng;
- secret reference;
- Docker/container;
- CI/CD;
- feature flag;
- job/scheduler;
- cache;
- event/outbox/inbox;
- payment/shipping/email/SMS/storage integration;
- tài liệu ảnh hưởng hành vi;
- script vận hành;
- hotfix và rollback.

Một thay đổi tài liệu có thể vẫn là rủi ro cao nếu nó điều khiển:

- deployment;
- migration;
- secret rotation;
- production operation;
- security procedure.

Không phân loại rủi ro chỉ dựa trên số dòng thay đổi.

---

## 5. Nguyên tắc nền tảng

### 5.1. Thay đổi nhỏ nhất nhưng hoàn chỉnh

Mỗi change set phải:

- giải quyết đúng mục tiêu;
- bao gồm tất cả phần bắt buộc để mục tiêu hoạt động an toàn;
- tránh refactor hoặc cleanup không liên quan;
- tránh nâng dependency không cần thiết;
- tránh đổi format toàn repository;
- không để hệ thống ở trạng thái nửa cũ nửa mới.

“Thay đổi nhỏ” không có nghĩa là bỏ test, migration, validation hoặc tài liệu.

### 5.2. Bảo toàn trước, cải tiến sau

Trước tiên phải bảo toàn:

- behavior hiện có không thuộc yêu cầu;
- API compatibility;
- database data;
- authorization;
- transaction invariant;
- cấu hình môi trường;
- công việc chưa commit của người dùng.

Tối ưu hoặc mở rộng chỉ thực hiện khi thuộc phạm vi task.

### 5.3. Bằng chứng thay cho phỏng đoán

Mọi kết luận phải dựa trên:

- code đã đọc;
- contract;
- schema;
- test;
- build output;
- log/metric;
- tài liệu chính thức;
- diff thực tế.

Không được:

- đoán tên class/file;
- đoán phiên bản framework;
- đoán migration đã chạy;
- đoán test pass;
- đoán backward compatibility;
- đoán production topology.

### 5.4. Fail closed

Khi thiếu dữ liệu quan trọng:

- security phải fail closed;
- migration nguy hiểm phải dừng;
- destructive action phải dừng;
- external side effect phải dừng;
- AI agent phải báo blocker thay vì tự mở rộng thẩm quyền.

---

## 6. Xác định chế độ của task

Trước khi hành động, AI agent phải phân loại yêu cầu:

| Chế độ | Được phép mặc định |
| --- | --- |
| Explain/answer | Đọc và giải thích, không sửa file |
| Review | Đọc, phân tích, báo lỗi; không tự sửa |
| Diagnose | Chạy kiểm tra read-only, tìm nguyên nhân; không tự triển khai fix |
| Implement/change | Sửa trong phạm vi yêu cầu và kiểm thử |
| Deploy/operate | Chỉ làm khi được yêu cầu và có thẩm quyền rõ |
| Monitor/wait | Quan sát theo phạm vi, không thay đổi state |

Yêu cầu “xem”, “review”, “phân tích” không tự cấp quyền sửa.

Yêu cầu “sửa”, “xây dựng”, “triển khai code” cho phép thay đổi code trong phạm vi, nhưng không tự cho phép:

- merge;
- push;
- deploy production;
- chạy migration production;
- sửa secret;
- gửi email/webhook thật;
- xóa dữ liệu.

---

## 7. Phân loại rủi ro thay đổi

### 7.1. Risk Level 0 — Documentation only

Ví dụ:

- sửa chính tả;
- comment;
- tài liệu không điều khiển runtime.

Yêu cầu:

- review diff;
- kiểm tra link/format nếu phù hợp;
- xác nhận không vô tình thay đổi file generated hoặc config.

### 7.2. Risk Level 1 — Low

Ví dụ:

- refactor nội bộ nhỏ;
- thêm unit test;
- đổi message nội bộ không thuộc contract;
- fix code không ảnh hưởng data/security/API.

Yêu cầu:

- affected tests;
- compile;
- diff review;
- không breaking behavior.

### 7.3. Risk Level 2 — Moderate

Ví dụ:

- endpoint mới không critical;
- query/repository mới;
- cấu hình mới có default an toàn;
- thay đổi behavior trong một module;
- cache hoặc async change có phạm vi giới hạn.

Yêu cầu:

- Change Safety Plan;
- impact map;
- unit + integration/contract test;
- compatibility review;
- observability phù hợp;
- rollback đơn giản.

### 7.4. Risk Level 3 — High

Ví dụ:

- Flyway migration;
- thay đổi schema/event contract;
- thay đổi role/permission;
- external provider integration;
- framework/dependency major upgrade;
- thay đổi checkout/order flow;
- backfill;
- thay đổi transaction/locking;
- config production quan trọng.

Yêu cầu:

- design review;
- security/data review;
- staging hoặc môi trường tương đương;
- migration/rollback/forward recovery plan;
- test cross-layer;
- feature flag khi phù hợp;
- staged rollout;
- owner và success/abort metrics.

### 7.5. Risk Level 4 — Critical

Ví dụ:

- authentication/JWT/refresh-token;
- payment/capture/refund;
- inventory reservation/deduction;
- destructive migration;
- production data repair;
- secret/key rotation;
- breaking public/mobile API;
- thay đổi audit/compliance;
- thao tác production không dễ đảo ngược.

Yêu cầu:

- phê duyệt rõ từ owner có thẩm quyền;
- threat/data-loss analysis;
- two-person review;
- test đặc biệt theo `50-testing-requirements.md`;
- backup/recovery evidence khi có data risk;
- canary/progressive rollout hoặc kế hoạch tương đương;
- kill switch/feature flag khi khả thi;
- on-call/monitoring readiness;
- rollback hoặc forward recovery đã diễn tập;
- post-deploy verification;
- không để AI agent tự phê duyệt hoặc tự phát hành.

### 7.6. Nâng mức rủi ro

Phải chọn mức cao hơn nếu có bất kỳ yếu tố:

- blast radius không rõ;
- thiếu test;
- thiếu owner;
- dữ liệu production không đồng nhất;
- thay đổi cross-module;
- nhiều client version;
- provider không ổn định;
- migration không transaction;
- rollback không chắc chắn;
- incident đang diễn ra.

Không hạ mức rủi ro để giảm yêu cầu kiểm soát.

---

## 8. Kiểm tra trạng thái trước thay đổi

### 8.1. Workspace

Trước khi sửa, phải kiểm tra:

- project root;
- repository hiện tại;
- branch/ref nếu có;
- `git status --short`;
- diff chưa staged;
- diff đã staged;
- untracked file liên quan;
- rule/AGENTS/instruction trong scope;
- build system và version.

Không giả định working tree sạch.

### 8.2. Baseline

Với thay đổi có rủi ro, nên ghi nhận:

- build hiện tại;
- affected tests hiện tại;
- lỗi sẵn có;
- coverage hoặc contract baseline;
- schema/migration latest;
- dependency graph liên quan.

Nếu baseline fail:

- xác định failure có tồn tại trước thay đổi không;
- không tự sửa lỗi không liên quan;
- báo rõ trong kết quả;
- không nhận lỗi cũ là do patch mới;
- không dùng lỗi cũ để bỏ qua verification mới.

### 8.3. Source of truth

Phải xác định nguồn sự thật:

- API: `docs/api/openapi.yaml` hoặc quyết định contract chính thức;
- database: Flyway migrations;
- dependency: Gradle catalog/BOM/lockfile;
- security: rule + SecurityFilterChain + method policy;
- domain: aggregate/use case/state machine;
- config: typed configuration + deployment manifest;
- deployment: pipeline/runbook;
- feature flag: registry/config được quản lý.

Không sửa artifact phái sinh và bỏ qua nguồn sự thật.

---

## 9. Bảo vệ worktree và thay đổi của người dùng

### 9.1. Quyền sở hữu thay đổi hiện có

Mọi thay đổi có sẵn phải được coi là của người dùng hoặc agent khác trừ khi có bằng chứng ngược lại.

AI agent phải:

- giữ nguyên thay đổi không liên quan;
- patch quanh phần người dùng đang sửa;
- không format file rộng hơn phạm vi;
- không xóa untracked file;
- không ghi đè file chỉ vì generated output khác.

### 9.2. Khi cùng sửa một file

Nếu file mục tiêu đã có thay đổi:

1. đọc diff hiện có;
2. xác định phần thuộc người dùng;
3. áp patch tối thiểu;
4. kiểm tra diff tổng;
5. dừng và hỏi nếu không thể phân tách an toàn.

Không được khôi phục file về HEAD rồi áp lại patch.

### 9.3. Lệnh bị cấm mặc định

Không chạy nếu chưa có yêu cầu rõ và đánh giá hậu quả:

~~~text
git reset --hard
git clean -fd
git clean -fdx
git restore .
git checkout -- .
git stash
git rebase
git commit --amend
git push --force
~~~

`git stash` cũng có thể che hoặc làm thất lạc context của người dùng, nên không phải giải pháp mặc định.

### 9.4. Commit và push

AI agent không tự:

- commit;
- amend;
- rebase;
- tag;
- push;
- mở/merge PR;

trừ khi user/task yêu cầu rõ.

Việc được phép sửa file không đồng nghĩa được phép thay đổi lịch sử Git hoặc remote state.

---

## 10. Change Safety Plan

Risk Level 2 trở lên phải có kế hoạch ngắn trước triển khai:

~~~text
CHANGE SAFETY PLAN

- Mục tiêu:
- Task mode:
- Risk level:
- Phạm vi:
- Ngoài phạm vi:
- Acceptance criteria:
- Invariant phải giữ:
- Module/file bị ảnh hưởng:
- API/event impact:
- Database/data impact:
- Security/privacy impact:
- Config/dependency impact:
- External integration impact:
- Compatibility:
- Test plan:
- Rollout:
- Rollback/forward recovery:
- Observability:
- Approval cần thiết:
~~~

Plan phải tỷ lệ thuận với rủi ro. Không cần tài liệu dài cho thay đổi nhỏ, nhưng không được bỏ các câu hỏi critical.

---

## 11. Impact map

Trước thay đổi cross-layer, phải lần theo luồng:

~~~text
Client
→ API contract
→ Controller/validation
→ Authorization
→ Use case/domain
→ Transaction/repository
→ Database
→ Event/outbox
→ External provider
→ Response/observability
~~~

Phải xác định:

- caller;
- owner của dữ liệu;
- trust boundary;
- transaction boundary;
- state transition;
- failure path;
- retry path;
- side effect;
- client/version bị ảnh hưởng;
- dữ liệu cũ;
- cache/index/search bị ảnh hưởng.

Không sửa một lớp nếu contract thực tế nằm ở nhiều lớp.

---

## 12. Kiểm soát phạm vi

### 12.1. Acceptance criteria

Trước code, phải chuyển yêu cầu thành behavior kiểm chứng được:

- input;
- output;
- error;
- quyền;
- state trước/sau;
- side effect;
- compatibility;
- performance constraint nếu có.

### 12.2. Non-goals

Phải ghi rõ phần không làm khi task có nguy cơ phình:

- không đổi framework;
- không redesign module;
- không đổi API ngoài endpoint liên quan;
- không migrate dữ liệu ngoài phạm vi;
- không cleanup toàn repository.

### 12.3. Opportunistic change

Nếu phát hiện vấn đề khác:

- ghi nhận;
- báo người dùng;
- chỉ sửa nếu cần thiết để hoàn thành task hoặc được mở rộng phạm vi.

Không trộn:

- feature + framework upgrade;
- bug fix + broad refactor;
- migration + unrelated schema cleanup;
- security fix + API redesign lớn;
- formatting toàn repo + logic change.

### 12.4. Mechanical change

Rename/bulk replacement chỉ được dùng khi:

- pattern chính xác;
- phạm vi được giới hạn;
- đã preview match;
- review toàn bộ diff;
- compile/test sau thay đổi;
- không sửa generated/vendor file ngoài ý muốn.

---

## 13. Thực hiện thay đổi từng bước

### 13.1. Checkpoint

Với thay đổi lớn:

1. cập nhật contract/model;
2. compile;
3. cập nhật implementation;
4. chạy test gần;
5. cập nhật integration/migration;
6. chạy test rộng;
7. review diff cuối.

Không thay hàng chục file rồi mới compile lần đầu.

### 13.2. Thay đổi coherent

Mỗi checkpoint phải giữ code ở trạng thái hợp lý:

- không để signature đổi nhưng call site chưa sửa;
- không thêm schema mới mà mapping chưa cập nhật;
- không phát event mới mà consumer không hiểu;
- không đổi config name mà manifest chưa hỗ trợ.

### 13.3. Không che lỗi

Không dùng:

- catch rộng rồi trả default;
- null fallback không có contract;
- disable validation;
- mở permission;
- tắt migration;
- bỏ test;
- suppress warning toàn cục;

để làm build xanh.

### 13.4. Review diff thường xuyên

Sau mỗi nhóm thay đổi:

- kiểm tra `git diff --stat`;
- đọc diff;
- tìm file ngoài phạm vi;
- tìm secret;
- tìm TODO/debug;
- tìm accidental generated changes;
- xác nhận line ending/format.

---

## 14. Chính sách tương thích

### 14.1. Các dạng compatibility

Mọi thay đổi phải xem xét:

- source compatibility;
- binary compatibility nếu có library/module public;
- HTTP API compatibility;
- JSON serialization;
- event/message compatibility;
- database schema compatibility;
- configuration compatibility;
- cache/session compatibility;
- mobile client compatibility;
- job/scheduler compatibility.

### 14.2. Additive-first

Ưu tiên:

- thêm field optional;
- thêm endpoint/version;
- thêm column nullable/default an toàn;
- dual-read/dual-write có thời hạn;
- deprecate trước khi remove;
- consumer bỏ qua field chưa biết.

Không rename/remove trực tiếp contract đang được dùng.

### 14.3. Mobile

React Native client cũ có thể tồn tại nhiều tháng.

Thay đổi backend phải:

- biết phiên bản mobile đang support;
- không giả định tất cả client nâng cấp cùng lúc;
- không thêm enum nếu client cũ crash khi unknown;
- giữ endpoint cũ qua migration window;
- đo usage trước sunset;
- có server-side compatibility khi hợp lý.

### 14.4. Semantic versioning

Nếu project phát hành version theo SemVer:

- PATCH: bug fix tương thích;
- MINOR: tính năng tương thích;
- MAJOR: breaking public contract.

Không gắn nhãn patch cho breaking change chỉ vì code diff nhỏ.

---

## 15. Safe API change

Mọi API change phải tuân `40-api-standards.md`.

### 15.1. Trước thay đổi

Phải xác định:

- operationId;
- consumers;
- request/response schema;
- status/header/error code;
- auth/ownership;
- idempotency;
- pagination;
- caching;
- OpenAPI baseline.

### 15.2. Breaking change

Breaking change gồm:

- path/method thay đổi;
- field rename/remove/type change;
- required/nullable change;
- enum change;
- status semantics change;
- auth change;
- pagination/default change;
- sync/async change.

Phải:

- tạo version mới hoặc migration strategy;
- cập nhật contract;
- chạy breaking diff;
- deprecate;
- gửi `Deprecation`/`Sunset` khi phù hợp;
- test client cũ.

### 15.3. Không sửa API bằng database detail

Không expose field/ID mới chỉ vì schema vừa thêm.

API contract chỉ thay đổi khi use case cần.

---

## 16. Safe database schema change

Mọi database change phải tuân `30-database-guardrails.md`.

### 16.1. Forward-only

- Migration đã phát hành không được sửa.
- Tạo migration mới để forward fix.
- Flyway validate bắt buộc.
- Test trên MySQL version phù hợp.
- Hibernate không được tự sửa production schema.

### 16.2. Expand–migrate–contract

Thay đổi rename/remove/type lớn phải theo:

1. **Expand**: thêm schema mới tương thích;
2. **Migrate**: dual-read/write hoặc backfill;
3. **Verify**: metric/reconciliation;
4. **Switch**: chuyển read/write;
5. **Contract**: xóa schema cũ ở release sau.

Không gộp tất cả vào một deployment khi còn app cũ.

### 16.3. DDL risk

Trước DDL phải đánh giá:

- table size;
- lock behavior;
- algorithm/online capability;
- index build time;
- disk;
- replication lag nếu có;
- transaction;
- rollback;
- application compatibility.

Không chạy destructive DDL production từ IDE/AI agent nếu chưa có runbook và thẩm quyền.

### 16.4. Rollback thực tế

Code rollback chỉ an toàn nếu schema mới còn backward-compatible.

Sau destructive migration:

- rollback binary có thể không đủ;
- restore backup có thể làm mất dữ liệu mới;
- forward recovery thường an toàn hơn.

Runbook phải nói rõ điều này.

---

## 17. Safe data migration và backfill

### 17.1. Không backfill trong startup

Không chạy data backfill lớn trong application startup.

Dùng:

- versioned migration cho thay đổi nhỏ, có giới hạn;
- job/script riêng cho dữ liệu lớn;
- checkpoint và resume;
- batch;
- rate limit.

### 17.2. Yêu cầu bắt buộc

Backfill phải:

- idempotent hoặc có checkpoint;
- có dry-run;
- có filter phạm vi;
- có expected row count;
- log progress không chứa PII;
- giới hạn batch/transaction;
- có timeout/retry;
- xử lý partial failure;
- có reconciliation;
- có stop/abort mechanism.

### 17.3. Bảo vệ production

Trước data repair production:

- xác nhận đúng environment;
- backup/snapshot hoặc recovery strategy;
- query preview;
- peer review;
- maintenance/capacity plan;
- audit người chạy;
- verify trước/sau bằng count/checksum/sample.

Không chạy script với default connection trỏ production.

Không nhúng credential production vào script.

### 17.4. Privacy

Export/snapshot dùng cho test phải:

- mask PII;
- giới hạn access;
- mã hóa;
- có retention;
- xóa sau mục đích;
- không đưa vào Git.

---

## 18. Safe security change

Mọi security change phải tuân `20-security-guardrails.md`.

### 18.1. Trigger security review

Phải review chuyên sâu khi thay đổi:

- login/registration;
- JWT/signing key;
- refresh/revocation;
- password/reset/MFA;
- role/permission;
- ownership;
- CORS/CSRF;
- file upload;
- secrets;
- webhook signature;
- payment;
- audit/logging.

### 18.2. Không mở rộng để “fix”

Không chữa lỗi bằng:

- `permitAll()` rộng;
- bỏ `@PreAuthorize`;
- wildcard CORS;
- tắt CSRF không đánh giá;
- chấp nhận mọi JWT algorithm;
- tăng token lifetime tùy tiện;
- log token;
- bỏ ownership check.

### 18.3. Permission change

Permission change phải có:

- actor × operation matrix;
- default deny;
- positive test;
- negative test;
- ownership/IDOR test;
- admin/staff/customer separation;
- audit impact;
- migration role/permission data nếu cần.

### 18.4. Secret/key rotation

Rotation phải có:

- inventory consumer;
- dual-key/overlap strategy khi protocol cho phép;
- rollout order;
- revoke time;
- rollback;
- audit;
- verification;
- không in secret.

AI agent không được tự đọc/ghi secret production ngoài thẩm quyền rõ.

---

## 19. Thay đổi critical domain

### 19.1. Checkout

Thay đổi checkout phải chứng minh:

- server tính lại giá;
- coupon còn hợp lệ;
- tồn kho được bảo vệ;
- Idempotency-Key;
- một request tạo tối đa một order;
- rollback không để state nửa chừng;
- outbox/event đúng một lần về mặt nghiệp vụ.

### 19.2. Inventory

Thay đổi inventory phải giữ:

~~~text
available = onHand - reserved
available >= 0
reserved >= 0
~~~

Tên field có thể khác, nhưng invariant phải rõ.

Phải có concurrency test với transaction độc lập.

### 19.3. Payment/refund

Thay đổi payment/refund phải:

- idempotent;
- không tin callback client;
- verify provider;
- chống duplicate/out-of-order webhook;
- không charge/refund hai lần;
- kiểm tra amount/currency;
- có reconciliation;
- audit đầy đủ.

Không dùng shadow traffic tạo side effect thật cho payment.

### 19.4. Order state

- State transition phải explicit.
- Event cũ không được làm lùi state.
- Generic PATCH không được sửa trạng thái critical.
- Mọi transition mới phải có test allowed/forbidden.

Risk level mặc định của các thay đổi mục này là High hoặc Critical.

---

## 20. Safe dependency change

### 20.1. Chỉ thay khi có lý do

Dependency change phải nêu:

- lý do;
- current/target version;
- direct hay transitive;
- CVE/bug/feature liên quan;
- compatibility;
- license;
- rollback.

Không nâng tất cả dependency trong feature PR.

### 20.2. Version control

- Không dùng `+`, `latest.release` hoặc version động.
- Không dùng SNAPSHOT cho release.
- Ưu tiên Spring Boot BOM/dependency management.
- Dùng version catalog nếu project đã chọn.
- Dùng dependency locking khi phù hợp.
- Commit lockfile/verification metadata theo chính sách dự án.

### 20.3. Dependency graph

Trước/sau update phải kiểm tra:

- `dependencies`;
- `dependencyInsight`;
- transitive additions/removals;
- duplicate logging/JSON/security library;
- CVE;
- artifact checksum/signature;
- repository nguồn.

Không thêm repository tùy ý để lấy artifact.

### 20.4. Dependency verification

Nếu Gradle dependency verification được bật:

- update checksum/signature metadata có review;
- không tắt verification để build pass;
- không chấp nhận artifact đổi checksum mà không điều tra.

### 20.5. Framework upgrade

Spring Boot/Spring Security/Gradle major hoặc feature upgrade phải là change riêng:

- đọc release notes từng version bị nhảy;
- đọc migration guide;
- kiểm tra Java/Gradle compatibility;
- kiểm tra deprecated/removed API;
- full test suite;
- security regression;
- startup/config binding;
- container image;
- rollback.

Không copy version “mới nhất” từ internet rồi thay trực tiếp.

---

## 21. Safe configuration change

### 21.1. Configuration là code

Config change phải được:

- version control nếu không phải secret;
- review;
- test binding/validation;
- audit;
- rollout theo môi trường.

### 21.2. Typed configuration

Ưu tiên `@ConfigurationProperties` có:

- type rõ;
- validation;
- unit rõ;
- default an toàn;
- documentation.

Không đọc environment variable rải rác.

### 21.3. Safe default

Default phải:

- fail closed cho security;
- không trỏ production;
- không bật destructive job;
- không gửi email/payment thật;
- không bật debug/PII log;
- không mở actuator/docs công khai.

### 21.4. Rename config

Rename/remove config key phải theo:

1. hỗ trợ key mới;
2. tạm hỗ trợ key cũ với warning an toàn;
3. cập nhật manifest/runbook;
4. verify mọi environment;
5. remove ở release sau.

Không đổi key và deploy code trước khi production manifest có value mới nếu không có safe default.

### 21.5. Secret

- Secret không nằm trong Git.
- File example chỉ có placeholder.
- Không log resolved secret.
- Secret reference change phải test quyền truy cập và rotation.
- Không đưa production secret vào test.

---

## 22. Safe external integration change

### 22.1. Contract

Trước thay đổi provider:

- đọc tài liệu chính thức;
- pin API/version khi provider hỗ trợ;
- xác định auth/signature;
- timeout;
- retry;
- idempotency;
- rate limit;
- error mapping;
- webhook behavior.

### 22.2. Test

Phải có:

- adapter unit test;
- HTTP stub test;
- contract fixture;
- sandbox smoke theo lịch khi có;
- timeout/5xx/malformed response;
- duplicate/out-of-order event.

### 22.3. Rollout

Provider change High/Critical nên có:

- feature flag/config switch;
- ability to stop new requests;
- metrics theo provider;
- reconciliation;
- fallback chỉ khi business-safe;
- rollback không làm duplicate side effect.

Không gửi cùng một payment request tới hai provider như “shadow test”.

### 22.4. Webhook

- Verify raw body trước xử lý.
- Unique provider event ID.
- Inbox/idempotent consumer.
- Version event.
- Không bỏ endpoint cũ trước migration window.

---

## 23. Safe refactor

### 23.1. Behavior-preserving

Refactor phải:

- có baseline test;
- không thay public contract ngoài mục tiêu;
- không đổi migration/data;
- không thay error semantics;
- không đổi authorization;
- giữ observability quan trọng.

### 23.2. Tách refactor và behavior change

Ưu tiên:

1. refactor behavior-preserving;
2. test pass;
3. feature/fix ở change riêng.

Nếu buộc phải chung:

- diff phải tách logic rõ;
- report phần behavior change;
- tăng review.

### 23.3. Broad rename/package move

Phải:

- preview;
- cập nhật reflection/config/serialization references;
- kiểm tra component scan;
- kiểm tra Flyway/entity scan;
- kiểm tra tests/resources;
- build từ clean checkout.

Không coi compile pass là đủ nếu tên class xuất hiện trong config, JSON hoặc persisted data.

---

## 24. Safe test change

Mọi test change phải tuân `50-testing-requirements.md`.

### 24.1. Không làm yếu gate

Thay đổi bị xem là rủi ro nếu:

- xóa test;
- giảm coverage;
- đổi expected status/error;
- tăng timeout;
- thêm retry;
- thêm exclusion;
- disable/quarantine;
- thay MySQL bằng H2;
- mock thêm security/database boundary.

Phải giải thích vì sao behavior mong đợi thay đổi.

### 24.2. Bug fix

Bug fix phải:

- có regression test;
- test fail trước fix về mặt behavior;
- pass sau fix;
- chạy affected suite.

### 24.3. Không sửa test trước khi hiểu lỗi

Khi test fail:

1. đọc failure;
2. xác định production bug, stale test hay environment;
3. kiểm tra contract;
4. chỉ sửa expectation nếu contract thực sự đổi.

Không đổi expected value để khớp output mới mà không review nghiệp vụ.

---

## 25. Feature flag policy

### 25.1. Khi nên dùng

Feature flag phù hợp cho:

- staged rollout;
- risky feature;
- provider switch;
- kill switch;
- mobile/backend migration;
- progressive exposure.

Feature flag không thay:

- authorization;
- transaction;
- input validation;
- migration compatibility.

### 25.2. Metadata bắt buộc

Mỗi flag phải có:

- tên ổn định;
- owner;
- mục đích;
- default;
- environment;
- target/percentage nếu có;
- creation date;
- expiry/removal date;
- metric;
- rollback behavior.

### 25.3. Default

- Flag rủi ro mặc định off.
- Default khi flag provider lỗi phải an toàn.
- Không cho client tự gửi flag để vượt quyền.
- Server-side evaluation không tin user attribute chưa xác minh.

### 25.4. Test

Phải test:

- flag off;
- flag on;
- provider unavailable;
- targeting;
- cả old/new path;
- migration state;
- cleanup.

### 25.5. Flag debt

Flag tạm phải được xóa sau rollout:

- code path cũ;
- config;
- test;
- metric;
- documentation.

Không để flag vĩnh viễn không owner.

---

## 26. Observability trước thay đổi

### 26.1. Change-specific signals

Risk Level 2 trở lên phải xác định:

- success metric;
- error metric;
- latency;
- saturation;
- business invariant;
- log/error code;
- trace/span;
- alert/abort threshold.

### 26.2. Domain signals

Critical rollout nên quan sát:

- checkout success/failure;
- duplicate idempotency;
- inventory conflict/negative invariant;
- payment provider error;
- webhook lag/duplicate;
- refund failure;
- auth failure/reuse detection;
- DB lock/deadlock;
- migration lag.

### 26.3. Không thêm PII để quan sát

Observability không được:

- log token;
- log password;
- log raw payment credential;
- dùng email/phone làm metric label;
- ghi raw webhook body không kiểm soát;
- tăng high-cardinality label.

### 26.4. Baseline và comparison

Phải có baseline trước rollout khi dùng metric để quyết định.

Không đặt abort threshold mà không biết normal range.

---

## 27. Build và artifact safety

### 27.1. Build một lần

Release nên:

- build từ commit/ref xác định;
- dùng clean CI environment;
- pin dependency;
- tạo immutable artifact;
- promote cùng artifact qua môi trường;
- không rebuild khác nhau cho staging và production.

### 27.2. Traceability

Artifact nên truy vết được:

- source commit;
- build ID;
- version;
- JDK/Gradle;
- dependency lock;
- image digest;
- test report.

### 27.3. Supply chain

- Không dùng `curl | sh` trong pipeline.
- Không tải binary không verify.
- Pin action/plugin/image phù hợp.
- Scan dependency/container.
- Bảo vệ CI credential.
- Build provenance/signing nên được áp dụng theo maturity của dự án.

### 27.4. Reproducibility

- Không dùng dynamic dependency.
- Không phụ thuộc local Maven cache chứa artifact unpublished.
- Build phải chạy từ clean checkout.
- Generated artifact phải được tạo bởi task được version control.

---

## 28. Pre-deployment gate

Trước deploy Risk Level 3/4 phải xác nhận:

- [ ] đúng artifact/version;
- [ ] CI pass;
- [ ] security scan đạt policy;
- [ ] OpenAPI compatibility;
- [ ] Flyway validate;
- [ ] migration order;
- [ ] backup/recovery readiness;
- [ ] config/secret reference tồn tại;
- [ ] feature flag default;
- [ ] dashboard/alert;
- [ ] smoke test;
- [ ] rollback/forward recovery;
- [ ] owner/on-call;
- [ ] maintenance window nếu cần;
- [ ] client/provider coordination.

Không deploy khi chưa biết ai quyết định abort.

---

## 29. Progressive rollout

### 29.1. Staged rollout

Non-emergency High/Critical change nên triển khai theo giai đoạn:

1. internal/test tenant;
2. canary nhỏ;
3. tăng dần traffic/user;
4. full rollout;
5. hold period;
6. cleanup flag/path cũ.

Tỷ lệ và thời gian giữ phải theo traffic/risk, không copy số cố định.

### 29.2. Success và abort

Trước rollout phải định nghĩa:

- success criteria;
- abort criteria;
- observation window;
- người quyết định;
- command/runbook rollback;
- dữ liệu cần reconcile.

### 29.3. Config cũng là rollout

Binary và configuration đều có thể gây incident.

Config change rủi ro cũng phải:

- staged;
- monitor;
- rollback;
- audit.

### 29.4. Không canary side effect thiếu isolation

Canary payment/inventory phải bảo đảm:

- cùng request không đi hai path;
- không duplicate charge/reservation;
- cohort ổn định;
- reconciliation rõ.

---

## 30. Rollback và forward recovery

### 30.1. Rollback plan phải cụ thể

Không ghi “rollback nếu lỗi” chung chung.

Phải ghi:

- artifact/version trước;
- lệnh/quy trình;
- config/flag;
- schema compatibility;
- data đã phát sinh;
- provider side effect;
- cache/event;
- verification sau rollback.

### 30.2. Code rollback

Chỉ rollback binary khi:

- schema mới tương thích app cũ;
- event mới không làm app cũ crash;
- config cũ còn tồn tại;
- data mới app cũ đọc được;
- provider contract chưa đổi không tương thích.

### 30.3. Database

- Không down-migrate destructive tự động.
- Restore backup là biện pháp cuối do có thể mất dữ liệu sau snapshot.
- Ưu tiên forward fix khi production đã nhận ghi mới.
- Nếu cần restore, phải có point-in-time/reconciliation plan.

### 30.4. External side effect

Rollback code không tự hoàn tác:

- payment đã charge;
- refund đã gửi;
- email/SMS đã gửi;
- shipment đã tạo;
- webhook đã phát.

Phải có compensation/reconciliation nghiệp vụ.

### 30.5. Diễn tập

Risk Level 4 nên diễn tập:

- disable flag;
- rollback artifact;
- restore/reconcile;
- verify health/business metric.

Rollback chưa từng thử chỉ là giả định.

---

## 31. Post-deployment verification

Sau rollout phải kiểm tra:

- application health/readiness;
- version đang chạy;
- migration state;
- error/latency;
- logs không có exception mới;
- domain metrics;
- critical smoke flow;
- queue/outbox/webhook lag;
- database connections/locks;
- provider status;
- feature flag cohort.

Không chỉ kiểm tra HTTP 200 của health endpoint rồi kết luận thành công.

Kết quả phải được ghi trong release/change record.

---

## 32. Hotfix và incident change

### 32.1. Hotfix vẫn có kiểm soát

Incident không tự động cho phép bỏ:

- authorization;
- regression test;
- review;
- audit;
- backup;
- rollback.

### 32.2. Nguyên tắc

Hotfix phải:

- nhỏ nhất có thể;
- khôi phục an toàn trước;
- tránh redesign;
- có owner/incident commander;
- ghi timeline;
- test tối thiểu theo rủi ro;
- có post-incident follow-up.

### 32.3. Security incident

Có thể cần:

- revoke token/key;
- rotate secret;
- disable endpoint/feature;
- preserve evidence;
- tăng monitoring;
- thông báo đúng quy trình.

AI agent không tự thực hiện hành động production nhạy cảm nếu chưa có thẩm quyền rõ.

### 32.4. Sau incident

Phải:

- thêm regression test;
- loại bỏ workaround tạm;
- cập nhật runbook;
- review root cause;
- xử lý technical debt;
- xác nhận không còn flag/config emergency.

---

## 33. Generated files và code generation

### 33.1. Nguồn sự thật

Phải biết file nào generated:

- OpenAPI client/server stub;
- query/model;
- migration artifact;
- build output;
- documentation.

Không sửa tay generated file nếu generator/source sẽ ghi đè.

### 33.2. Regeneration

Khi regenerate:

- pin tool version;
- dùng command chính thức;
- review diff;
- không commit build output ngoài policy;
- kiểm tra file xóa/thêm;
- compile/test;
- ghi nhận nếu output thay lớn do tool upgrade.

Không vừa upgrade generator vừa đổi contract trong một change nếu có thể tách.

---

## 34. Documentation và ADR

### 34.1. Tài liệu phải đồng bộ

Cập nhật khi thay đổi:

- API;
- config/env var;
- database/runbook;
- permission;
- integration;
- deployment;
- feature flag;
- operational alert;
- development setup.

### 34.2. Khi cần ADR

ADR cần thiết khi:

- đổi kiến trúc/module boundary;
- thêm infrastructure quan trọng;
- chọn database/cache/queue/provider;
- đổi authentication model;
- đổi consistency/transaction strategy;
- đổi public contract/versioning policy;
- chấp nhận trade-off dài hạn.

ADR phải ghi:

- context;
- decision;
- alternatives;
- consequences;
- migration;
- rollback/revisit trigger.

### 34.3. Không dùng tài liệu để hợp thức hóa sau

Quyết định rủi ro phải được review trước implementation hoặc trước release, không chỉ ghi ADR sau khi đã khóa lựa chọn.

---

## 35. Review và approval

### 35.1. Reviewer độc lập

High/Critical change phải có reviewer ngoài người triển khai.

AI agent không được tự coi review của chính mình là independent approval.

### 35.2. Specialist review

Cần owner phù hợp:

| Change | Review cần thiết |
| --- | --- |
| Auth/permission/secret | Security |
| Migration/data repair | Database/data owner |
| Payment/refund | Payment/domain owner |
| Inventory/checkout | Commerce/domain owner |
| Public API | Backend + client owner |
| Infrastructure/deploy | Platform/operations |
| Privacy/PII | Security/privacy owner |

Một reviewer có thể đảm nhiệm nhiều vai trò nếu thực sự có thẩm quyền.

### 35.3. Review input

PR/change review phải có:

- objective;
- risk level;
- diff có phạm vi;
- test evidence;
- compatibility;
- migration;
- rollout/rollback;
- screenshots/log chỉ khi hữu ích và đã redact;
- known risk.

### 35.4. Không merge với gate đỏ

Không merge khi:

- required CI fail;
- required review thiếu;
- migration chưa verify;
- breaking change chưa duyệt;
- critical test bị disabled;
- unresolved security/data-loss risk.

Emergency override phải được audit và có follow-up.

---

## 36. Verification theo mức rủi ro

| Risk | Verification tối thiểu |
| --- | --- |
| 0 | Format/link/diff |
| 1 | Compile + affected unit tests + diff |
| 2 | Unit + integration/contract + compatibility |
| 3 | Full affected suites + migration/security + staging |
| 4 | Full critical suite + concurrency/E2E + staged rollout/recovery evidence |

Mọi bug fix cần regression test.

Mọi database change cần migration test.

Mọi authorization change cần positive và negative security test.

Mọi financial/inventory change cần idempotency/concurrency test.

Không thay verification thực bằng mô tả “có vẻ đúng”.

---

## 37. CI/CD policy

### 37.1. Pipeline là code

Pipeline change có thể ảnh hưởng toàn bộ release và phải:

- review;
- test/lint;
- least privilege;
- không in secret;
- pin action/plugin/image;
- có rollback.

### 37.2. Gate không được bypass âm thầm

Không:

- bỏ task test;
- đổi failure thành warning;
- thêm `continue-on-error` cho gate critical;
- giảm scan severity;
- xóa coverage verification;
- bỏ migration validation.

### 37.3. Environment separation

- Development/test không dùng credential production.
- CI PR không có quyền deploy production.
- Production deploy cần protected environment/approval theo platform.
- Artifact promotion phải truy vết.

### 37.4. Cache CI

Cache chỉ dùng để tăng tốc, không làm nguồn sự thật:

- cache dependency phải verify;
- không reuse test database state;
- không reuse output làm che compile/test;
- có cơ chế invalidate theo lock/build files.

---

## 38. Chính sách command và external action cho AI agent

### 38.1. Read-only trước

Ưu tiên lệnh đọc:

- `rg`;
- `git status`;
- `git diff`;
- `git log/show`;
- Gradle dependency/report task;
- test/build;
- schema/info read-only.

### 38.2. Không destructive

Không chạy:

- filesystem recursive delete ngoài artifact tạm rõ;
- Git reset/clean/restore diện rộng;
- database DROP/TRUNCATE production;
- Flyway clean production;
- revoke/rotate production credential;
- terminate service;
- force push;

nếu chưa có thẩm quyền rõ, impact review và recovery plan.

### 38.3. Không sudo/global install

- Không dùng sudo.
- Không cài global package để hoàn thành task thông thường.
- Dependency của project phải khai báo trong build.
- Tool tạm phải pin version và không làm thay đổi máy ngoài scope.
- Không thực thi script tải từ internet chưa kiểm tra.

### 38.4. External communication

Không tự:

- gửi email/SMS;
- gọi webhook thật;
- tạo issue/PR/comment;
- nhắn người khác;
- deploy;

trừ khi task yêu cầu rõ và recipient/environment đã xác minh.

---

## 39. Workflow bắt buộc cho AI agent

### Phase A — Understand

1. xác định task mode;
2. đọc rule/instruction;
3. xác định acceptance criteria;
4. xác định source of truth;
5. kiểm tra workspace/diff;
6. phân loại risk;
7. lập impact map;
8. nêu assumption quan trọng.

### Phase B — Plan

1. chọn thay đổi tối thiểu hoàn chỉnh;
2. xác định file/module;
3. compatibility;
4. migration/data;
5. security;
6. test;
7. rollout/rollback nếu cần.

### Phase C — Implement

1. patch theo checkpoint nhỏ;
2. giữ thay đổi người dùng;
3. compile/test sớm;
4. không mở rộng phạm vi;
5. review diff thường xuyên.

### Phase D — Verify

1. chạy format/static check phù hợp;
2. unit test;
3. integration/contract;
4. security/migration/concurrency theo risk;
5. kiểm tra final diff;
6. kiểm tra secret/debug/generated file;
7. xác nhận acceptance criteria.

### Phase E — Report

Phải báo:

- kết quả;
- file thay đổi;
- behavior;
- test command và kết quả;
- test chưa chạy;
- compatibility/migration;
- risk còn lại;
- bước vận hành cần người có thẩm quyền.

Không để người dùng phải đọc commentary cũ để hiểu kết quả cuối.

---

## 40. Stop conditions

AI agent phải dừng và yêu cầu hướng dẫn khi:

- yêu cầu có thể xóa/mất dữ liệu;
- target environment không rõ;
- credential/secret authority không rõ;
- worktree có thay đổi chồng lấn không thể bảo toàn;
- migration destructive chưa có phê duyệt;
- breaking API chưa có migration/version decision;
- payment/refund side effect có thể chạy thật;
- production operation ngoài phạm vi;
- hai source of truth mâu thuẫn;
- test critical không thể chạy và rủi ro không chấp nhận được;
- user choice sẽ làm thay đổi đáng kể kiến trúc/scope.

Không dùng assumption để vượt qua stop condition.

---

## 41. Pre-change checklist

- [ ] Task mode rõ.
- [ ] Acceptance criteria rõ.
- [ ] Risk level đã chọn.
- [ ] Rules liên quan đã đọc.
- [ ] Workspace/status/diff đã kiểm tra.
- [ ] Thay đổi hiện có được bảo vệ.
- [ ] Source of truth đã xác định.
- [ ] Impact map đã xem xét.
- [ ] API compatibility đã đánh giá.
- [ ] Database/data impact đã đánh giá.
- [ ] Security/privacy impact đã đánh giá.
- [ ] Dependency/config impact đã đánh giá.
- [ ] External side effect đã đánh giá.
- [ ] Test plan đã xác định.
- [ ] Rollout/rollback cần thiết đã xác định.
- [ ] Approval cần thiết đã có hoặc được báo.

---

## 42. Final diff checklist

- [ ] Chỉ file cần thiết bị thay đổi.
- [ ] Không ghi đè user change.
- [ ] Không secret/PII.
- [ ] Không debug code.
- [ ] Không TODO critical không owner.
- [ ] Không generated artifact ngoài policy.
- [ ] Không dynamic dependency.
- [ ] Không permission/CORS mở rộng ngoài ý muốn.
- [ ] Không API breaking ngoài kế hoạch.
- [ ] Không migration cũ bị sửa.
- [ ] Không destructive SQL thiếu guard.
- [ ] Error handling không nuốt lỗi.
- [ ] Logs/metrics phù hợp.
- [ ] Tests đủ theo risk.
- [ ] Docs/config/contract đồng bộ.
- [ ] Rollback/forward recovery khả thi.

---

## 43. Definition of Done

Một thay đổi chỉ hoàn tất khi:

- [ ] mục tiêu được thực hiện;
- [ ] non-goal không bị kéo vào;
- [ ] invariant được giữ;
- [ ] worktree/user changes được bảo toàn;
- [ ] contract đồng bộ;
- [ ] migration/data an toàn;
- [ ] security không suy yếu;
- [ ] dependency/config được kiểm soát;
- [ ] tests theo risk pass;
- [ ] final diff đã review;
- [ ] không có secret/debug/unrelated change;
- [ ] compatibility được xác nhận;
- [ ] rollout/rollback hoặc forward recovery rõ;
- [ ] test chưa chạy/risk còn lại được báo trung thực;
- [ ] approval cần thiết không bị bỏ qua.

“Code compile” không đủ để đạt Definition of Done.

---

## 44. Hành vi bị cấm

Developer và AI agent không được:

- sửa ngoài phạm vi mà không báo;
- ghi đè thay đổi người dùng;
- dùng `git reset --hard`;
- dùng `git clean -fdx`;
- restore/checkout toàn worktree;
- stash thay đổi người dùng mặc định;
- force push;
- commit/deploy khi chưa được yêu cầu;
- chạy migration production từ IDE tùy tiện;
- sửa migration đã phát hành;
- dùng destructive SQL không recovery;
- đổi API breaking âm thầm;
- bỏ authorization/validation để test pass;
- mở CORS/permitAll rộng;
- tắt dependency verification;
- dùng version động/latest;
- nâng framework trong feature PR không liên quan;
- commit secret;
- log token/PII;
- gọi provider production từ test;
- shadow payment tạo charge;
- dùng feature flag thay authorization;
- giữ flag tạm không owner/expiry;
- rerun test đến khi xanh rồi bỏ qua flaky;
- giảm coverage/gate không giải thích;
- bỏ qua CI bằng `-x test`;
- tuyên bố test pass khi chưa chạy;
- tuyên bố rollback an toàn khi chưa kiểm tra schema/data compatibility;
- tự phê duyệt change Critical.

---

## 45. Safe change exception

Nếu phải lệch rule:

~~~text
SAFE CHANGE EXCEPTION

- Rule/mục bị ảnh hưởng:
- Change:
- Risk level:
- Lý do:
- Phạm vi:
- Rủi ro:
- Data/security/API impact:
- Biện pháp giảm thiểu:
- Test/bằng chứng thay thế:
- Rollback/forward recovery:
- Owner:
- Deadline:
- Kế hoạch loại bỏ ngoại lệ:
- Người phê duyệt:
~~~

Deadline hoặc incident không tự động là phê duyệt.

---

## 46. Change completion report

Khi bàn giao, AI agent phải dùng mẫu:

~~~text
SAFE CHANGE REPORT

- Mục tiêu:
- Risk level:
- Phạm vi thực hiện:
- File/module thay đổi:
- Behavior thay đổi:
- API/event compatibility:
- Database/data:
- Security/privacy:
- Dependency/config:
- Tests/commands đã chạy:
- Pass/fail/skipped:
- Test chưa chạy:
- Rollout:
- Rollback/forward recovery:
- Rủi ro còn lại:
- Hành động cần người có thẩm quyền:
~~~

Không được giấu limitation trong phần mô tả chung.

---

## 47. Tài liệu tham chiếu chính thức

- Git Status: https://git-scm.com/docs/git-status
- Git Diff: https://git-scm.com/docs/git-diff
- Git Revert: https://git-scm.com/docs/git-revert
- Git Reset/Restore/Revert: https://git-scm.com/docs/git
- Gradle Dependency Locking: https://docs.gradle.org/current/userguide/dependency_locking.html
- Gradle Dependency Verification: https://docs.gradle.org/current/userguide/dependency_verification.html
- Gradle Dependency Insight: https://docs.gradle.org/current/userguide/viewing_debugging_dependencies.html
- Spring Boot Upgrading: https://docs.spring.io/spring-boot/upgrading.html
- Flyway Validate: https://documentation.red-gate.com/fd/validate-277578898.html
- RFC 9745 — Deprecation Header: https://www.rfc-editor.org/rfc/rfc9745
- RFC 8594 — Sunset Header: https://www.rfc-editor.org/rfc/rfc8594
- Semantic Versioning: https://semver.org/
- OpenFeature: https://openfeature.dev/
- Google SRE Release Engineering: https://sre.google/sre-book/release-engineering/
- Google SRE Production Services Best Practices: https://sre.google/sre-book/service-best-practices/
- OWASP Secure Coding Practices: https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/
- OWASP Secure by Design: https://owasp.org/www-project-secure-by-design-framework/
- SLSA Build Provenance: https://slsa.dev/spec/v1.2/build-provenance

---

## 48. Nguyên tắc cuối cùng

Một thay đổi an toàn phải trả lời được:

1. thay đổi cái gì và vì sao;
2. ai và hệ thống nào bị ảnh hưởng;
3. invariant nào phải giữ;
4. dữ liệu và quyền có còn an toàn không;
5. client cũ có còn hoạt động không;
6. bằng chứng nào chứng minh thay đổi đúng;
7. triển khai theo giai đoạn thế nào;
8. dừng hoặc phục hồi ra sao khi có lỗi;
9. ai có thẩm quyền quyết định;
10. còn rủi ro nào chưa xử lý.

Nếu chưa trả lời được các câu hỏi trên ở mức tương xứng với risk level, thay đổi chưa sẵn sàng để merge hoặc phát hành.