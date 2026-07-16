---
code: P04
name: Spring Startup Bean Configuration
mode: FIX
triggers: APPLICATION FAILED TO START, BeanCreationException, UnsatisfiedDependencyException, circular dependency, property binding, profile
skills: bootstrap-spring-backend, enforce-backend-architecture
---

Tìm exception gốc cuối chuỗi `Caused by`. Kiểm tra component scan, constructor injection, bean ambiguity, condition, profile, typed properties và config theo môi trường mà không đọc/in secret. Tạo context/slice test nhỏ nhất tái hiện lỗi. Không dùng `@Lazy`, field injection hoặc default không an toàn chỉ để ứng dụng khởi động nếu boundary/config mới là root cause.
