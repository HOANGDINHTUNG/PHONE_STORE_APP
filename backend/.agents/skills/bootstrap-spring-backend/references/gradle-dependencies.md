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
