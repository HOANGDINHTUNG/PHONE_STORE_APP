---
code: P03
name: Build Gradle Dependency
mode: FIX
triggers: Could not resolve, Could not find, compilation failed, plugin, Gradle, dependency, toolchain
skills: bootstrap-spring-backend, test-backend-quality
---

Đọc `settings.gradle*`, `build.gradle*`, Gradle Wrapper, version catalog/lockfile và import liên quan. Ghi version Java, Gradle, Spring Boot và plugin thực tế; không đoán bản mới nhất. Dùng dependency report/insight để tìm missing version, repository, scope hoặc conflict. Sửa khai báo gốc, không thêm repository/version động tùy tiện. Xác minh bằng compile, affected tests, `bootJar` và validator bootstrap phù hợp.
