---
title: Platform Engineering, Internal Developer Platform và Golden Paths
tags: [platform-engineering, idp, developer-experience, golden-path, backstage]
status: verified
verified_on: 2026-07-23
requires: [11-Docker-CICD-va-Van-hanh, 33-Kubernetes-Production-cho-Spring-Boot]
constrains: [42-Threat-Modeling-va-Software-Supply-Chain-Security, 43-Release-Engineering-GitOps-Feature-Flags-va-Canary]
verified_by: [13-Checklist-Definition-of-Done, 54-FinOps-Cost-Engineering-va-Unit-Economics]
---

# Platform Engineering, Internal Developer Platform và Golden Paths

> [!summary]
> Platform là product phục vụ developer, không phải tập YAML hoặc ticket queue. Golden path cung cấp mặc định tự phục vụ có security/reliability evidence, đồng thời giữ escape hatch có governance.

## 1. Vấn đề platform giải

Nếu mỗi team tự dựng:

- repo/build/dependency policy;
- CI/CD;
- container/Kubernetes;
- secret/identity;
- telemetry/SLO;
- database/migration;
- on-call/runbook;

thì variation và cognitive load tăng. Platform đóng gói các capability lặp lại.

## 2. Product model

| Yếu tố | Câu hỏi |
|---|---|
| Users | developer, security, ops, data? |
| Problem | time-to-first-prod, compliance, reliability? |
| Capability | tạo service, deploy, observe, restore? |
| Interface | portal, CLI, API, templates? |
| SLO | platform availability/latency/support? |
| Adoption | usage, success, abandonment? |
| Feedback | research/support/roadmap? |

Không đo thành công bằng số tool cài.

## 3. Golden path Spring Boot

Một service template có thể cung cấp:

```text
Java 21 + pinned Spring Boot BOM
Gradle wrapper
package-by-feature skeleton
RFC 9457 errors
security baseline
Actuator/Micrometer/OTel
Testcontainers
Dockerfile non-root
SBOM/signing
Kubernetes probes/resources
CI quality/security gates
GitOps deployment
SLO dashboard + alerts + runbook
owner/catalog metadata
```

Template là điểm bắt đầu; cần update path cho services đã tạo, không chỉ scaffold một lần.

## 4. Self-service contract

Input:

```yaml
apiVersion: platform.example/v1
kind: SpringBootService
metadata:
  name: catalog-api
  owner: commerce-catalog
spec:
  exposure: internal
  dataClass: confidential
  database: mysql
  availabilityTier: tier-2
```

Output:

- repository/pipeline;
- runtime identity;
- environments;
- DNS/certificate;
- DB binding;
- telemetry;
- catalog ownership;
- policy evidence.

Không cho developer nhập cloud IAM raw nếu higher-level intent đủ.

## 5. Paved road vs prison

| Cơ chế | Mục tiêu |
|---|---|
| Defaults | 80% case nhanh |
| Guardrails | chặn unsafe/noncompliant |
| Escape hatch | case đặc biệt có ADR/owner |
| Extension points | plugin/module rõ |
| Deprecation | migration path |
| Support | docs/SLO/escalation |

Guardrail nên cho feedback cụ thể: policy nào fail, evidence và cách sửa.

## 6. Capability maturity

### Level 0 — tickets

Manual, knowledge trong đầu người.

### Level 1 — standardized docs/templates

Giảm variation nhưng drift cao.

### Level 2 — self-service APIs

Developer tạo capability theo intent.

### Level 3 — product + feedback

Đo adoption/outcome, version/migrate, reliability và ecosystem.

Không nhảy thẳng portal đẹp khi provisioning vẫn bằng ticket.

## 7. Service catalog

Catalog record tối thiểu:

- owner/on-call;
- source/repository;
- lifecycle/tier;
- APIs/events/dependencies;
- data classification;
- environments/deployments;
- SLO/dashboard/runbook;
- security/release evidence;
- cost center.

Catalog metadata stale là nguy hiểm; sync từ source và kiểm tra completeness.

## 8. Platform API versioning

Platform contract cũng là API:

- versioned schema;
- additive change;
- deprecation window;
- migration automation;
- compatibility tests;
- changelog;
- usage telemetry.

Không đổi base image/template phá hàng trăm services trong một ngày.

## 9. Build once, adopt continuously

Renovation mechanisms:

- dependency update PR;
- base image rebuild;
- reusable workflow version;
- policy conformance scan;
- automated codemod;
- migration campaign;
- exception expiry.

Mỗi service template cần provenance để biết đang ở version nào.

## 10. Security supply chain

Platform nên cung cấp:

- short-lived workload identity;
- central secret integration;
- pinned dependencies/plugins;
- SBOM/provenance;
- signing/verification;
- least-privilege deploy;
- isolated untrusted build;
- audit.

Xem [[42-Threat-Modeling-va-Software-Supply-Chain-Security]].

## 11. Reliability of platform

Platform failure có blast radius lớn:

- control plane không được nằm trên chính dependency duy nhất nó sửa;
- artifact/deploy path có rollback;
- templates test end-to-end;
- regional/control-plane DR;
- rate limits/quotas;
- tenant isolation;
- degraded/manual path documented.

## 12. Metrics

| Metric | Tránh hiểu sai |
|---|---|
| time to first production | không hy sinh safety |
| lead time/change failure | segment theo service/tier |
| golden path adoption | adoption ép buộc không là satisfaction |
| self-service success rate | bao gồm partial rollback |
| platform support load | phân loại usability vs outage |
| policy exception age | owner/expiry |
| upgrade coverage | version và risk |

Developer satisfaction là signal, không thay outcome.

## 13. Team interaction

- platform team xây capability;
- stream-aligned team sở hữu product/service;
- security/ops cung cấp policy/evidence contract;
- enabling team giúp adoption;
- exception có owner, reason và expiry.

Platform không nhận ownership mọi production incident của application.

## 14. AI Agent integration

Cho Agent:

- catalog metadata/project ADR;
- golden-path templates;
- allowed dependencies;
- exact platform API schema;
- tests/policy checks;
- migration guide.

Agent không tự bịa resource/IAM/Kubernetes nếu platform đã có higher-level API.

## 15. Verification

- tạo service từ zero đến production sandbox;
- rollback/delete resource không orphan;
- upgrade template version cũ;
- conformance/security scan;
- failure injection provisioning;
- least-privilege test;
- measure new-developer task completion;
- restore platform state/catalog;
- escape-hatch audit.

## 16. Anti-patterns

- “platform” là Kubernetes cluster;
- portal chỉ link dashboard;
- template fork rồi bỏ;
- mandatory abstraction không escape hatch;
- platform team là ticket helpdesk;
- success = số resources provisioned;
- hidden policy/opaque errors;
- catalog không owner;
- xây theo vendor feature thay user problem.

## 17. Kết nối graph

- CI/CD/runtime: [[11-Docker-CICD-va-Van-hanh]], [[33-Kubernetes-Production-cho-Spring-Boot]]
- Supply chain: [[42-Threat-Modeling-va-Software-Supply-Chain-Security]]
- GitOps/release: [[43-Release-Engineering-GitOps-Feature-Flags-va-Canary]]
- AI rules: [[12-Bo-quy-tac-cho-AI-Agent]]
- Cost: [[54-FinOps-Cost-Engineering-va-Unit-Economics]]

## Nguồn chính thức

1. [CNCF TAG App Delivery — Platforms White Paper](https://tag-app-delivery.cncf.io/whitepapers/platforms/) — truy cập 2026-07-23.
2. [Backstage Documentation — What is Backstage?](https://backstage.io/docs/overview/what-is-backstage/) — truy cập 2026-07-23.
3. [Kubernetes Documentation](https://kubernetes.io/docs/home/) — truy cập 2026-07-23.
4. [OpenGitOps Principles](https://opengitops.dev/) — truy cập 2026-07-23.

