# Docker rules

- Multi-stage build; runtime image chỉ chứa JRE/artifact cần thiết.
- Pin base image bằng version, ưu tiên digest trong CI production.
- Chạy non-root với UID/GID rõ.
- Dùng `COPY` cụ thể; không copy `.git`, secret, build cache hoặc local config.
- Có `.dockerignore`.
- Không cài package thừa; quét CVE và SBOM.
- Expose port tài liệu, không hard-code credential.
- Healthcheck phù hợp môi trường orchestration; tránh gọi endpoint có auth.
- JVM nhận container memory/cpu; cấu hình graceful shutdown.
- Image metadata gồm version/source/revision nếu pipeline hỗ trợ.

