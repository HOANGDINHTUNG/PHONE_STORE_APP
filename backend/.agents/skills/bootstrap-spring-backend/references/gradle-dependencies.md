# Gradle và dependency

## Nhóm dependency tối thiểu

- `spring-boot-starter-web`
- `spring-boot-starter-validation`
- `spring-boot-starter-security`
- `spring-boot-starter-data-jpa`
- `spring-boot-starter-actuator`
- `mysql-connector-j` ở runtime
- `flyway-core` và module MySQL tương thích khi phiên bản Flyway yêu cầu
- `spring-boot-starter-test`
- `spring-security-test`
- Testcontainers JUnit/MySQL cho integration test

## OpenAPI/Swagger

- Chọn `springdoc-openapi-starter-webmvc-ui` cho Spring MVC hoặc `springdoc-openapi-starter-webflux-ui` cho WebFlux, không thêm cả hai.
- Tra `https://springdoc.org/` và pin version tương thích Spring Boot; Boot 3.5.x dùng dòng 2.8.x, Boot 4.x dùng dòng 3.x theo matrix hiện hành.
- Không dùng Springfox, version động hoặc thêm Swagger UI/Scalar trùng lặp.
- Contract-first không cần runtime-generated `/v3/api-docs` làm source; Swagger UI có thể đọc runtime copy của `docs/api/openapi.yaml`.
- Code-first chỉ dùng khi ADR đã chọn và CI export/lint/diff spec đã sinh.

## Chính sách

- Không khai báo version riêng cho dependency đã do BOM quản lý.
- Giới hạn repository ở Maven Central và repository nội bộ được duyệt.
- Bật dependency verification/locking khi CI và quy trình cập nhật hỗ trợ.
- Không dùng `mavenLocal()` trong build CI.
- Tách unit test và integration test nếu thời gian chạy cần quản trị.
- Cấu hình compiler encoding UTF-8 và Java toolchain 21.
- Chạy `dependencies` và quét CVE trước khi duyệt dependency mới.

## Advanced testing dependencies

JUnit 5, Mockito và AssertJ thường đã được cung cấp bởi:

```gradle
testImplementation 'org.springframework.boot:spring-boot-starter-test'
```

Khi dự án sử dụng advanced testing, thêm version đã được pin:

```gradle
plugins {
    id 'info.solidsoft.pitest' version '<PINNED_PITEST_GRADLE_PLUGIN_VERSION>'
}

dependencies {
    testImplementation 'net.jqwik:jqwik:<PINNED_JQWIK_VERSION>'
    testImplementation 'com.code-intelligence:jazzer-junit:<PINNED_JAZZER_VERSION>'
}

pitest {
    junit5PluginVersion = '<PINNED_PITEST_JUNIT5_PLUGIN_VERSION>'

    targetClasses = [
        'com.company.phonestore.*.domain.*',
        'com.company.phonestore.*.application.*'
    ]

    targetTests = [
        'com.company.phonestore.*Test',
        'com.company.phonestore.*Tests'
    ]

    outputFormats = ['HTML', 'XML']
    timestampedReports = false

    mutationThreshold = <PROJECT_MUTATION_THRESHOLD>
    coverageThreshold = <PROJECT_COVERAGE_THRESHOLD>
}
```

Không dùng version động. Kiểm tra compatibility giữa Spring Boot BOM, JUnit Platform, jqwik và PITest JUnit 5 plugin trước khi pin version.

PITest hỗ trợ Gradle qua plugin `info.solidsoft.pitest`; jqwik chạy như một test engine trên JUnit Platform; Jazzer tích hợp JUnit 5 bằng `jazzer-junit` và dùng `JAZZER_FUZZ=1` để bật fuzzing mode. [PITest Gradle plugin](https://gradle-pitest-plugin.solidsoft.info/), [jqwik User Guide](https://jqwik.net/docs/current/user-guide.html), [Jazzer](https://github.com/CodeIntelligenceTesting/jazzer)
