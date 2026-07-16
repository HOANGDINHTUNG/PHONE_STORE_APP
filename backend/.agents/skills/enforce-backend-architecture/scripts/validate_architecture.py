#!/usr/bin/env python3
"""Heuristic, read-only architecture boundary scanner for Spring Java projects."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


def inspect(root: Path) -> dict[str, object]:
    source = root / "src/main/java"
    files = sorted(source.rglob("*.java")) if source.is_dir() else []
    findings: list[dict[str, object]] = []

    def add(level: str, code: str, path: Path, line: int, message: str) -> None:
        findings.append({"level": level, "code": code, "file": str(path.relative_to(root)), "line": line, "message": message})

    if not files:
        findings.append({"level": "WARN", "code": "JAVA_SOURCE_MISSING", "file": "", "line": 0, "message": "Không có src/main/java để kiểm tra."})

    for path in files:
        text = path.read_text(encoding="utf-8", errors="replace")
        lines = text.splitlines()
        package_match = re.search(r"^\s*package\s+([\w.]+);", text, re.M)
        package = package_match.group(1) if package_match else ""
        is_controller = ".api" in package or path.name.endswith("Controller.java")
        is_domain = ".domain" in package or "/domain/" in path.as_posix()

        for number, line in enumerate(lines, 1):
            if is_controller and re.search(r"import\s+[\w.]*Repository\s*;", line):
                add("ERROR", "CONTROLLER_REPOSITORY", path, number, "Controller không được import repository.")
            if is_domain and re.search(r"import\s+org\.springframework\.(web|data|context|stereotype)", line):
                add("ERROR", "DOMAIN_SPRING", path, number, "Domain đang phụ thuộc Spring web/data/context.")
            if is_domain and re.search(r"import\s+(jakarta|javax)\.persistence\.", line):
                add("WARN", "DOMAIN_JPA", path, number, "Cân nhắc tách persistence entity khỏi domain.")
            if is_domain and re.search(r"import\s+[\w.]+\.(api|infrastructure)\.", line):
                add("ERROR", "DOMAIN_OUTWARD_IMPORT", path, number, "Domain phụ thuộc lớp ngoài.")
            if re.search(r"@Autowired\s*$", line) and number < len(lines) and re.search(r"\b(private|protected)\b", lines[number]):
                add("WARN", "FIELD_INJECTION", path, number, "Ưu tiên constructor injection.")

        if is_controller and re.search(r"\b(ResponseEntity<)?[\w]*Entity[>]?\s+\w+\s*\(", text):
            add("WARN", "ENTITY_RESPONSE", path, 1, "Controller có thể đang trả persistence entity.")

    errors = sum(item["level"] == "ERROR" for item in findings)
    warnings = sum(item["level"] == "WARN" for item in findings)
    return {"root": str(root), "files_scanned": len(files), "errors": errors, "warnings": warnings, "findings": findings}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("project_root", nargs="?", default=".")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    report = inspect(Path(args.project_root).resolve())
    if args.json:
        print(json.dumps(report, ensure_ascii=False, indent=2))
    else:
        for item in report["findings"]:
            location = f"{item['file']}:{item['line']}" if item["file"] else "-"
            print(f"[{item['level']}] {item['code']} {location}: {item['message']}")
        print(f"Summary: {report['errors']} error(s), {report['warnings']} warning(s)")
    return 1 if report["errors"] else 0


if __name__ == "__main__":
    raise SystemExit(main())

