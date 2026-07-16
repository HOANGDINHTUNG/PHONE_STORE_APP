#!/usr/bin/env python3
"""Scan Spring configuration for unsafe production defaults without changing files."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


CONFIG_GLOBS = ("application*.yml", "application*.yaml", "application*.properties")
SECRET_KEY = re.compile(r"(password|secret|api[-_.]?key|private[-_.]?key|jwt[-_.]?(?:key|secret))", re.I)
ASSIGNMENT = re.compile(r"^\s*[^#][^:=]*[:=]\s*(.*?)\s*$")


def inspect(root: Path) -> dict[str, object]:
    resource_roots = [root / "src/main/resources", root / "src/test/resources"]
    files = sorted({path for base in resource_roots for pattern in CONFIG_GLOBS for path in base.glob(pattern)})
    findings: list[dict[str, object]] = []

    def add(level: str, code: str, path: Path, line: int, message: str) -> None:
        findings.append({"level": level, "code": code, "file": str(path.relative_to(root)), "line": line, "message": message})

    if not files:
        findings.append({"level": "ERROR", "code": "CONFIG_MISSING", "file": "", "line": 0, "message": "Không tìm thấy application config."})

    for path in files:
        is_test = "src/test/" in path.as_posix() or any(tag in path.name.lower() for tag in ("test", "integration"))
        for number, line in enumerate(path.read_text(encoding="utf-8", errors="replace").splitlines(), 1):
            stripped = line.strip()
            if not stripped or stripped.startswith("#"):
                continue
            match = ASSIGNMENT.match(line)
            value = match.group(1).strip(" '\"") if match else ""
            if SECRET_KEY.search(line) and value and not any(token in value for token in ("${", "@", "<", "changeme")):
                if value.lower() not in ("null", "none", "false", ""):
                    add("ERROR", "HARDCODED_SECRET", path, number, "Giá trị có vẻ là secret được ghi trực tiếp.")
            if re.search(r"ddl-auto\s*[:=]\s*(create|create-drop|update)\b", line, re.I) and not is_test:
                add("ERROR", "DDL_AUTO", path, number, "Không dùng Hibernate tự sửa schema ngoài test.")
            if re.search(r"exposure\.include\s*[:=]\s*['\"]?\*", line, re.I):
                add("ERROR", "ACTUATOR_WILDCARD", path, number, "Không expose toàn bộ Actuator endpoint.")
            if re.search(r"allowed[-_.]?origins?\s*[:=]\s*['\"]?\*", line, re.I):
                add("ERROR", "CORS_WILDCARD", path, number, "Không dùng wildcard CORS.")
            if re.search(r"show-sql\s*[:=]\s*true", line, re.I) and not is_test:
                add("WARN", "SHOW_SQL", path, number, "show-sql có thể làm lộ dữ liệu và tăng log.")

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
