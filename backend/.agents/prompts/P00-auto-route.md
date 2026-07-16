---
code: P00
name: Auto Route
mode: FIX
triggers: AUTO, không biết chọn prompt, lỗi chưa phân loại
skills: debug-prompt-library
---

Phân tích error signature, root exception, command, HTTP status và failure boundary. Chọn đúng một profile chính từ `P02`–`P12`; `P01` chỉ được chọn khi người dùng yêu cầu chỉ phân tích. Nếu hai profile ngang nhau, chọn profile theo root cause thay vì symptom ngoài cùng. Nếu chưa cô lập được hoặc lỗi đa tầng/intermittent, chọn `P12`. Sau khi chọn, render lại `BASE-ERROR-PROMPT.md` với profile đích, hiển thị toàn bộ prompt và chờ phê duyệt theo rule 70; không dừng ở việc chỉ thông báo mã. Chỉ thực thi profile đích sau khi người dùng đồng ý.
