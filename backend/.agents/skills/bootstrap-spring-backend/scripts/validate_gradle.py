#!/usr/bin/env python3
"""Read-only Gradle baseline validator for the phone-store backend."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


REQUIRED = {
    "web": "spring-boot-starter-web",
    "validation": "spring-boot-starter-validation",
    "security": "spring-boot-starter-security",
    "jpa": "spring-boot-starter-data-jpa",
    "actuator": "spring-boot-starter-actuator",
    "flyway": "flyway-core",
    "mysql": "mysql-connector-j",
    "tests": "spring-boot-starter-test",
}
DYNAMIC_PATTERNS = (
    re.compile(r"""version\s*['"](?:\+|latest\.[^'"]+)['"]""", re.I),
    re.compile(r""":(?:\+|latest\.[^'"]+)['"]""", re.I),
)


def inspect(root: Path) -> dict[str, object]:
    findings: list[dict[str, str]] = []
    build = next((root / name for name in ("build.gradle.kts", "build.gradle") if (root / name).is_file()), None)
    wrapper = root / "gradle/wrapper/gradle-wrapper.properties"
    wrapper_script = root / "gradlew"

    def add(level: str, code: str, message: str) -> None:
        findings.append({"level": level, "code": code, "message": message})

    if build is None:
        add("ERROR", "GRADLE_BUILD_MISSING", "Không tìm thấy build.gradle hoặc build.gradle.kts.")
        content = ""
    else:
        content = build.read_text(encoding="utf-8", errors="replace")
        if not re.search(r"(JavaLanguageVersion\.of\(\s*21\s*\)|languageVersion\s*=\s*JavaLanguageVersion\.of\(\s*21\s*\)|sourceCompatibility\s*=\s*['\"]?21)", content):
            add("ERROR", "JAVA_TOOLCHAIN", "Chưa xác nhận Java toolchain/sourceCompatibility 21.")
        for label, token in REQUIRED.items():
            if token not in content:
                add("WARN", f"DEPENDENCY_{label.upper()}", f"Chưa thấy dependency {token}.")
        for pattern in DYNAMIC_PATTERNS:
            if pattern.search(content):
                add("ERROR", "DYNAMIC_VERSION", "Phát hiện version động trong Gradle.")
        if "mavenLocal()" in content:
            add("WARN", "MAVEN_LOCAL", "mavenLocal() làm build CI khó tái lập.")
        if "useJUnitPlatform()" not in content:
            add("WARN", "JUNIT_PLATFORM", "Chưa thấy useJUnitPlatform().")

    if not wrapper.is_file() or not wrapper_script.is_file():
        add("ERROR", "GRADLE_WRAPPER", "Thiếu Gradle Wrapper hoặc wrapper properties.")
    else:
        wrapper_text = wrapper.read_text(encoding="utf-8", errors="replace")
        if "distributionUrl=" not in wrapper_text:
            add("ERROR", "WRAPPER_URL", "Wrapper properties thiếu distributionUrl.")

    errors = sum(item["level"] == "ERROR" for item in findings)
    warnings = sum(item["level"] == "WARN" for item in findings)
    return {
        "root": str(root),
        "build_file": str(build) if build else None,
        "errors": errors,
        "warnings": warnings,
        "findings": findings,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("project_root", nargs="?", default=".")
    parser.add_argument("--json", action="store_true", help="Xuất JSON.")
    args = parser.parse_args()

    report = inspect(Path(args.project_root).resolve())
    if args.json:
        print(json.dumps(report, ensure_ascii=False, indent=2))
    else:
        for item in report["findings"]:
            print(f"[{item['level']}] {item['code']}: {item['message']}")
        print(f"Summary: {report['errors']} error(s), {report['warnings']} warning(s)")
    return 1 if report["errors"] else 0


if __name__ == "__main__":
    raise SystemExit(main())

