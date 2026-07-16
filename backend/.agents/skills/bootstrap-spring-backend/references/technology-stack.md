# Technology stack

## Baseline

- Java 21 qua Gradle toolchain.
- Spring Boot phiên bản được pin trong build.
- Gradle Wrapper; ưu tiên Kotlin DSL nếu dự án đã chọn, không đổi DSL tùy tiện.
- MySQL cho production; Testcontainers MySQL cho integration test.
- Flyway cho schema migration.
- Spring Security với JWT access token và refresh session.
- Bean Validation, Actuator, Micrometer và OpenAPI theo nhu cầu.
- JUnit 5, AssertJ, Mockito, Spring Boot Test và Testcontainers.

## Quy tắc version

- Không dùng version động như `+`, `latest.release` hoặc tag image `latest`.
- Dùng Spring dependency management/BOM cho thư viện được quản lý.
- Kiểm tra release note và compatibility matrix trước nâng cấp.
- Lưu Java, Gradle và image version trong một nơi có chủ đích.
- Mọi nâng cấp major phải có ADR, test hồi quy và kế hoạch rollback.

## Không mặc định thêm

- Lombok, MapStruct, Redis, Kafka, Elasticsearch hoặc framework mapping chỉ khi có lợi ích đo được.
- Không thêm nhiều thư viện giải quyết cùng một vấn đề.

