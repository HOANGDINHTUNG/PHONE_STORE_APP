---
name: deliver-backend
description: Containerize, kiểm tra và bàn giao backend Spring qua Docker, cấu hình môi trường, CI/CD, release checklist và rollback plan. Dùng khi tạo Dockerfile/Compose, xây pipeline, chuẩn bị staging/production, release, deploy, smoke test hoặc rollback backend.
---

# Deliver Backend

Đọc rules 20/50/60, project NFR và mọi skill liên quan thay đổi trước release.

## Quy trình

1. Tạo image theo [docker-rules.md](references/docker-rules.md) và template [Dockerfile.template](assets/Dockerfile.template).
2. Dùng [compose.yaml.template](assets/compose.yaml.template) cho local, không coi Compose local là production architecture.
3. Thiết kế biến môi trường/secret theo [environment-deployment.md](references/environment-deployment.md).
4. Xây pipeline theo [ci-cd.md](references/ci-cd.md).
5. Thực hiện [release-checklist.md](references/release-checklist.md).
6. Hoàn thiện [rollback-plan.md](references/rollback-plan.md).
7. Chạy `python3 scripts/validate_deployment.py <project-root>`.
8. Build đúng artifact, scan image, chạy container smoke test và ghi bằng chứng.

## Ràng buộc

- Image version immutable, không dùng `latest`.
- Container chạy non-root, filesystem/quyền tối thiểu và không chứa secret.
- Migration phải tương thích với app cũ/mới trong rollout.
- Không deploy nếu không có owner, quan sát, smoke test và rollback/forward-fix.
- Không tự thao tác production; mọi thay đổi production cần quy trình/phê duyệt của dự án.

