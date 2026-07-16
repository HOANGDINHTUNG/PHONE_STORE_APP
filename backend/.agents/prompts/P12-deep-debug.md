---
code: P12
name: Deep Multi Layer Debug
mode: FIX
triggers: intermittent, random, đa tầng, không tái hiện, thiếu stack trace, đã sửa nhiều lần, flaky production symptom
skills: debug-backend, optimize-observability, test-backend-quality
---

Lập timeline và failure boundary từ request đến DB/provider; ghi mọi cách đã thử và kết quả. So sánh successful run với failed run bằng correlation data đã redaction. Dùng hypothesis matrix, binary isolation/bisection, deterministic seed và stress/concurrency reproduction khi phù hợp. Không chồng patch lên giả thuyết chưa chứng minh. Khi cô lập được root cause, chuyển về playbook chuyên môn tương ứng, tạo regression test và sửa tối thiểu. Nếu vẫn chưa tái hiện, trả PARTIAL/BLOCKED cùng bằng chứng đã loại trừ và instrumentation an toàn cần thêm; không bịa nguyên nhân.
