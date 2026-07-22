---
title: Danh mục nguồn chuẩn
tags: [sources, bibliography, official-docs]
status: maintained
verified_on: 2026-07-21
---

# Danh mục nguồn chuẩn

> [!note]
> Danh mục này là điểm bắt đầu. Khi trích một hành vi cụ thể, phải liên kết đúng section và đúng version, không chỉ dẫn homepage.

## Java và JVM

- [JDK 21 Documentation](https://docs.oracle.com/en/java/javase/21/)
- [Java Language Specification, Java SE 21](https://docs.oracle.com/javase/specs/jls/se21/html/)
- [Java Virtual Machine Specification, Java SE 21](https://docs.oracle.com/javase/specs/jvms/se21/html/)
- [Virtual Threads](https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html)
- [Java Secure Coding Guidelines](https://www.oracle.com/java/technologies/javase/seccodeguide.html)

## Spring

- [Spring Boot Reference](https://docs.spring.io/spring-boot/reference/)
- [Spring Boot System Requirements](https://docs.spring.io/spring-boot/system-requirements.html)
- [Spring Framework Reference](https://docs.spring.io/spring-framework/reference/)
- [Spring Data JPA Reference](https://docs.spring.io/spring-data/jpa/reference/)
- [Spring Security Reference](https://docs.spring.io/spring-security/reference/)
- [Spring Boot Actuator](https://docs.spring.io/spring-boot/reference/actuator/)
- [Spring Guides](https://spring.io/guides)
- [Spring Boot GitHub Releases](https://github.com/spring-projects/spring-boot/releases)
- [Spring Modulith Reference](https://docs.spring.io/spring-modulith/reference/)

## Persistence và Database

- [Jakarta Persistence Specification](https://jakarta.ee/specifications/persistence/)
- [Hibernate ORM User Guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
- [MySQL 8.4 Reference Manual](https://dev.mysql.com/doc/refman/8.4/en/)
- [MySQL Optimization](https://dev.mysql.com/doc/refman/8.4/en/optimization.html)
- [MySQL EXPLAIN](https://dev.mysql.com/doc/refman/8.4/en/explain.html)
- [MySQL InnoDB Transaction Model](https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-model.html)
- [Flyway Documentation](https://documentation.red-gate.com/flyway)
- [Liquibase Documentation](https://docs.liquibase.com/)

## HTTP và API standards

- [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)
- [RFC 9111 — HTTP Caching](https://www.rfc-editor.org/rfc/rfc9111.html)
- [RFC 9457 — Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html)
- [RFC 7519 — JSON Web Token](https://www.rfc-editor.org/rfc/rfc7519.html)
- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)
- [Semantic Versioning](https://semver.org/)

## Security

- [OWASP API Security Top 10 — 2023](https://owasp.org/API-Security/editions/2023/en/0x11-t10/)
- [OWASP Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [OWASP Dependency-Check](https://owasp.org/www-project-dependency-check/)
- [NIST Digital Identity Guidelines](https://pages.nist.gov/800-63-4/)
- [OAuth 2.0 Security Best Current Practice — RFC 9700](https://www.rfc-editor.org/rfc/rfc9700.html)

## Testing

- [JUnit User Guide](https://docs.junit.org/current/user-guide/)
- [Mockito Documentation](https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html)
- [Testcontainers for Java](https://java.testcontainers.org/)
- [PIT Mutation Testing](https://pitest.org/)
- [jqwik User Guide](https://jqwik.net/docs/current/user-guide.html)
- [Jazzer](https://github.com/CodeIntelligenceTesting/jazzer)
- [ArchUnit User Guide](https://www.archunit.org/userguide/html/000_Index.html)

## Observability và reliability

- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [Micrometer Documentation](https://docs.micrometer.io/)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Google SRE Books](https://sre.google/books/)
- [Resilience4j Documentation](https://resilience4j.readme.io/)
- [JDK Flight Recorder](https://dev.java/learn/jvm/jfr/)
- [OpenJDK JMH](https://openjdk.org/projects/code-tools/jmh/)

## Event streaming và CDC

- [Apache Kafka Documentation](https://kafka.apache.org/documentation/)
- [Debezium Documentation](https://debezium.io/documentation/reference/stable/)
- [Debezium Outbox Event Router](https://debezium.io/documentation/reference/stable/transformations/outbox-event-router.html)

## Build, container và delivery

- [Gradle User Manual](https://docs.gradle.org/current/userguide/userguide.html)
- [Docker Documentation](https://docs.docker.com/)
- [Dockerfile Best Practices](https://docs.docker.com/build/building/best-practices/)
- [OCI Specifications](https://opencontainers.org/)
- [SLSA Supply-chain Levels](https://slsa.dev/)
- [CycloneDX SBOM Standard](https://cyclonedx.org/)

## Chính sách sử dụng nguồn

- Blog/video chỉ dùng để học cách giải thích hoặc tìm keyword.
- Code/config lấy từ blog phải đối chiếu reference đúng version.
- Khi nguồn thay đổi liên tục, ghi ngày kiểm chứng.
- Khi không có nguồn mạnh, tạo test tái hiện và gắn `status: unverified` cho đến khi đủ bằng chứng.
