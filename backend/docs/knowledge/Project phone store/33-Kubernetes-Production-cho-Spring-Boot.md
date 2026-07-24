---
title: Kubernetes Production cho Spring Boot
tags: [kubernetes, spring-boot, deployment, operations]
status: verified
verified_on: 2026-07-21
sources:
  - https://kubernetes.io/docs/concepts/workloads/controllers/deployment/
  - https://kubernetes.io/docs/concepts/workloads/pods/probes/
  - https://kubernetes.io/docs/concepts/configuration/configmap/
  - https://kubernetes.io/docs/concepts/configuration/secret/
  - https://kubernetes.io/docs/concepts/workloads/controllers/job/
---

# Kubernetes Production cho Spring Boot

## 1. Kubernetes không sửa ứng dụng thiếu reliability

Kubernetes restart/schedule/route workload, nhưng không tự giải quyết:

- transaction/idempotency;
- migration compatibility;
- memory leak;
- retry storm;
- bad readiness;
- data backup;
- secret governance;
- SLO/runbook.

## 2. Workload mapping

- Deployment: stateless long-running API/consumer.
- StatefulSet: stateful identity/storage cần thiết, chỉ khi đội ngũ vận hành được.
- Job: task hữu hạn đến completion.
- CronJob: Job theo lịch với concurrency/history policy.
- DaemonSet: một pod mỗi node cho agent hạ tầng.

Không chạy database production trong cluster chỉ vì manifest dễ viết; quyết định dựa trên ownership/backup/HA/skills.

## 3. Container contract

Application:

- chạy foreground, PID 1 behavior đúng;
- nhận SIGTERM;
- readiness false trước khi drain;
- graceful shutdown trong `terminationGracePeriodSeconds`;
- log stdout/stderr structured;
- filesystem read-only nếu khả thi;
- temp path/size rõ;
- non-root, drop capabilities;
- image immutable theo digest.

## 4. Ba loại probe

- Startup: cho app chậm khởi động; khi có startup probe, liveness/readiness chưa chạy cho đến khi nó thành công.
- Readiness: pod có nhận traffic hay không; fail không restart container.
- Liveness: app có cần restart hay không.

Không để liveness phụ thuộc DB/downstream: dependency outage sẽ restart toàn bộ pod và làm sự cố nặng hơn. Readiness có thể phản ánh dependency bắt buộc nhưng phải tránh toàn fleet unready vì một shared dependency.

## 5. Probe với Spring Boot Actuator

Expose endpoint cần thiết ở management port/path theo security policy. Probe phải:

- nhẹ và bounded;
- không query nặng;
- không lộ detail công khai;
- có initial delay/period/timeout/failure threshold theo startup/GC thực tế;
- test khi cold start, migration, downstream outage và overload.

Property/path cụ thể phải kiểm tra đúng Spring Boot version.

## 6. Requests và limits

- request ảnh hưởng scheduling và HPA utilization.
- CPU limit có thể gây throttling/tail latency.
- memory limit vượt sẽ OOMKill.
- JVM memory gồm heap, metaspace, code cache, direct buffer, thread stack, native agent.

Đặt heap có headroom dưới container limit. Đo `working_set`, OOMKilled, throttling, GC và native memory; không đặt request/limit bằng cảm tính.

## 7. Deployment strategy

Deployment hỗ trợ declarative rollout/rollback state. Cần cấu hình:

- replicas;
- rolling `maxUnavailable`/`maxSurge`;
- readiness;
- progress deadline;
- PodDisruptionBudget;
- topology spread/anti-affinity;
- preStop/grace period;
- rollback signal.

`replicas: 2` không tạo HA nếu cùng node/zone và shared dependency single point.

## 8. Graceful shutdown timeline

```text
SIGTERM -> readiness false/drain -> stop intake -> finish in-flight/checkpoint -> close pools -> exit
```

Load balancer/endpoints propagation có độ trễ. `preStop` sleep chỉ là workaround cần đo, không thay application drain. Grace period phải lớn hơn request/job shutdown budget nhưng bounded.

## 9. ConfigMap và Secret

ConfigMap cho config không mật; Secret cho dữ liệu nhạy cảm. Kubernetes Secret mặc định có thể được lưu chưa mã hóa trong etcd nếu cluster không bật encryption at rest; base64 không phải encryption.

Yêu cầu:

- encryption at rest;
- least-privilege RBAC/service account;
- restrict pod/node access;
- external secret manager khi phù hợp;
- rotation/reload policy;
- không log/env dump secret;
- immutable/versioned config cho rollout có kiểm soát.

## 10. Configuration rollout

Mounted config/env không luôn reload giống nhau. Mỗi config ghi:

- startup-only hay dynamic;
- validation/fail-fast;
- rollout trigger/checksum annotation;
- backward compatibility;
- secret rotation overlap;
- audit/change owner.

Không hot-reload transaction/security policy thiếu atomicity và rollback.

## 11. Autoscaling

HPA metric phải liên hệ load/capacity:

- CPU cho CPU-bound ổn định;
- concurrency/queue age/lag cho worker;
- request rate cần custom metric và capacity model;
- memory thường là signal chậm, không tốt cho mọi app.

Autoscaling có delay và tạo DB connection storm. Đặt min/max, stabilization, scale rate và downstream connection budget.

## 12. Networking

- Service/Ingress/Gateway route và timeout phải khớp application deadline.
- NetworkPolicy deny-by-default theo namespace/workload nếu CNI hỗ trợ.
- Egress allowlist/DNS policy.
- Không tin traffic “internal” mặc định.
- TLS/workload identity theo threat model.
- Preserve trace headers có kiểm soát.

## 13. Database migration

Không để mọi replica app cùng chạy migration cạnh tranh. Phương án:

- pipeline step trước rollout;
- Kubernetes Job có unique release;
- một controlled migration runner.

Migration phải expand-contract, lock/time budget, retry semantics và không làm app cũ hỏng. Job success cần được rollout gate kiểm tra.

## 14. Persistent storage

Hiểu StorageClass, access mode, reclaim policy, snapshot/backup, zone binding và restore. PVC không phải backup. Với local temp/upload processing đặt ephemeral storage request/limit và cleanup.

## 15. Security context

- non-root UID/GID;
- read-only root filesystem;
- no privilege escalation;
- drop Linux capabilities;
- seccomp profile;
- dedicated service account, disable token mount nếu không cần;
- image scan/sign/SBOM/admission policy;
- namespace/RBAC separation.

## 16. Observability

Gắn resource attributes: cluster, namespace, workload, pod, container, version. Dashboard:

- desired/available replicas;
- restart reason/OOMKill;
- readiness/liveness failures;
- CPU throttling/memory;
- request/latency/error;
- HPA decisions;
- rollout state;
- job/consumer lag.

Pod name cardinality phù hợp log/trace và một số infra metrics, không phải mọi application metric label.

## 17. Failure drills

- delete pod trong traffic;
- drain node;
- zone imbalance;
- DB/Redis/broker down;
- secret rotation;
- rollout bad image/config;
- readiness/liveness misconfiguration;
- OOM/throttling;
- migration failure;
- HPA scale-out và connection storm.

Mỗi drill có hypothesis, guardrail, abort và observation.

## 18. Checklist release

- Image immutable/non-root/scanned/SBOM.
- Requests/limits từ profiling, JVM có headroom.
- Probes đúng semantics và đã failure-test.
- Graceful drain nằm trong grace period.
- Rollout/PDB/topology/rollback rõ.
- Config/secret encrypted, least privilege, rotate được.
- Migration một owner, backward-compatible.
- Autoscaling không vượt downstream budget.
- Telemetry/runbook/on-call sẵn sàng.

## 19. Kết nối mở rộng

- DNS/Service/TLS/LB/mesh: [[41-Networking-DNS-TLS-HTTP2-va-Load-Balancing]].
- Resource sizing/HPA evidence: [[40-Performance-Capacity-va-Load-Testing]].
- Image/SBOM/provenance/signing: [[42-Threat-Modeling-va-Software-Supply-Chain-Security]].
- GitOps/canary/flag/rollback: [[43-Release-Engineering-GitOps-Feature-Flags-va-Canary]].
- Case manifest và rollout failure: [[45-Case-Study-Phone-Store-at-Scale]].
