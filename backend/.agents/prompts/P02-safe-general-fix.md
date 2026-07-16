---
code: P02
name: Safe General Bug Fix
mode: FIX
triggers: bug cục bộ, NullPointerException, IllegalArgumentException, logic đơn giản, lỗi tổng quát
skills: enforce-backend-architecture, test-backend-quality
---

Chứng minh behavior hiện tại và behavior mong đợi từ yêu cầu, contract hoặc test. Viết regression test bắt đúng lỗi, sửa điểm gây lỗi nhỏ nhất và giữ nguyên API, data, security cùng behavior không liên quan. Không kèm refactor, rename, format diện rộng hoặc dependency change nếu không bắt buộc. Chạy test hẹp, suite module và gate tương xứng rủi ro.
