---
code: P11
name: Docker Environment CI CD
mode: FIX
triggers: Docker, Compose, container, image, healthcheck, environment variable, pipeline, CI, CD
skills: deliver-backend, bootstrap-spring-backend
---

Ghi rõ environment, command và stage fail; đối chiếu Dockerfile, Compose, pipeline, artifact và config profile. Kiểm tra build context, layer, Java runtime, user/quyền, port, healthcheck, env name, network và service readiness. Không đưa secret vào image/log, không dùng `latest` và không cài global tùy tiện. Reproduce bằng cùng command/image nếu có thể, build image, chạy smoke test và validator deployment; không tự deploy production.
