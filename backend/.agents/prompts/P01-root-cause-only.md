---
code: P01
name: Root Cause Only
mode: DIAGNOSE
triggers: chỉ phân tích, chỉ chẩn đoán, không sửa code, root cause
skills: debug-backend, optimize-observability
---

Chỉ điều tra và giải thích. Tái hiện bằng lệnh read-only/test an toàn nếu có thể, xếp giả thuyết theo xác suất, tìm bằng chứng trực tiếp và nêu hướng sửa/test cụ thể. Không tạo patch, không sửa config và không tự chuyển sang FIX dù cách sửa có vẻ rõ ràng. Nếu chưa đủ bằng chứng, kết luận `CHƯA ĐỦ BẰNG CHỨNG` cùng phép kiểm tra tiếp theo.
