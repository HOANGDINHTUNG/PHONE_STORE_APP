# CI/CD

## Pull request

1. Checkout sạch, verify wrapper/dependency.
2. Compile, formatting/static analysis.
3. Unit/slice/architecture test.
4. Integration test với Testcontainers.
5. Migration/config/security validator.
6. Dependency/secret scan.
7. OpenAPI lint/ref/example/security, duplicate operationId, breaking diff, implementation conformance và docs profile exposure check.

## Release

1. Build artifact một lần.
2. Sinh checksum/SBOM, scan artifact/image.
3. Tag immutable theo version + revision.
4. Deploy staging, migration rehearsal và smoke test.
5. Phê duyệt theo policy.
6. Progressive rollout nếu hạ tầng hỗ trợ.
7. Theo dõi SLO/domain metric và rollback condition.

Không build lại artifact khác cho production.
