---
code: P09
name: Testing Quality Gate
mode: FIX
triggers: JUnit, Mockito, Testcontainers, jqwik, PITest, Jazzer, flaky test, assertion failed, mutation survived, quality gate
skills: test-backend-quality, run-quality-gate
---

Phân loại production bug, test bug, fixture bug, environment bug hoặc flaky behavior bằng bằng chứng. Chạy test fail độc lập, lặp có kiểm soát và giữ seed khi phù hợp. Không sửa assertion theo output sai, xóa/disable test, retry mù hoặc hạ threshold. Sửa đúng tầng gây lỗi, giữ test deterministic và test behavior. Chạy lại test hẹp, suite liên quan và quality gate; báo riêng mutation/fuzz nếu chưa chạy.
