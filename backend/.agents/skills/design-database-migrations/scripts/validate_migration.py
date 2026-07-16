#!/usr/bin/env python3
"""Validate Flyway filenames and flag destructive SQL; never executes SQL."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


NAME = re.compile(r"^V(?P<version>[0-9][0-9._]*)__(?P<description>[a-z0-9_]+)\.sql$")
DANGEROUS = {
    "DROP_OBJECT": re.compile(r"\bDROP\s+(TABLE|COLUMN|DATABASE|SCHEMA)\b", re.I),
    "TRUNCATE": re.compile(r"\bTRUNCATE\s+(TABLE\s+)?", re.I),
    "RENAME": re.compile(r"\bRENAME\s+(TABLE|COLUMN)\b|\bALTER\s+TABLE\b.*\bRENAME\b", re.I | re.S),
    "TYPE_CHANGE": re.compile(r"\bALTER\s+TABLE\b.*\b(MODIFY|CHANGE)\b", re.I | re.S),
}
UNSCOPED_DML = {
    "DELETE_WITHOUT_WHERE": re.compile(r"\bDELETE\s+FROM\s+[\w\x60]+\s*;", re.I),
    "UPDATE_WITHOUT_WHERE": re.compile(r"\bUPDATE\s+[\w\x60]+\s+SET\b(?:(?!\bWHERE\b).)*;", re.I | re.S),
}


def migration_dir(root: Path) -> Path:
    candidates = (
        root / "src/main/resources/db/migration",
        root / "db/migration",
        root,
    )
    return next((candidate for candidate in candidates if candidate.is_dir() and list(candidate.glob("V*.sql"))), candidates[0])


def inspect(root: Path) -> dict[str, object]:
    directory = migration_dir(root)
    files = sorted(directory.glob("V*.sql")) if directory.is_dir() else []
    findings: list[dict[str, object]] = []
    versions: dict[str, Path] = {}

    def add(level: str, code: str, path: Path | None, message: str) -> None:
        findings.append({
            "level": level,
            "code": code,
            "file": str(path.relative_to(root)) if path else "",
            "message": message,
        })

    if not files:
        add("WARN", "MIGRATION_MISSING", None, "Không tìm thấy Flyway migration.")

    for path in files:
        match = NAME.match(path.name)
        if not match:
            add("ERROR", "INVALID_NAME", path, "Tên phải theo V<version>__<lower_snake_case>.sql.")
        else:
            version = match.group("version")
            if version in versions:
                add("ERROR", "DUPLICATE_VERSION", path, f"Version trùng với {versions[version].name}.")
            versions[version] = path

        sql = re.sub(r"--.*?$|/\*.*?\*/", "", path.read_text(encoding="utf-8", errors="replace"), flags=re.M | re.S)
        for code, pattern in DANGEROUS.items():
            if pattern.search(sql):
                add("ERROR", code, path, "Phát hiện DDL phá hủy hoặc khó tương thích; cần review thủ công và rollout plan.")
        for code, pattern in UNSCOPED_DML.items():
            if pattern.search(sql):
                add("ERROR", code, path, "DML không có WHERE có thể tác động toàn bảng.")
        if re.search(r"\bCREATE\s+TABLE\b", sql, re.I) and "ENGINE=InnoDB" not in sql:
            add("WARN", "ENGINE_UNSPECIFIED", path, "CREATE TABLE chưa ghi rõ ENGINE=InnoDB.")
        if re.search(r"\bADD\s+COLUMN\b[^;]*\bNOT\s+NULL\b", sql, re.I | re.S) and not re.search(r"\bDEFAULT\b", sql, re.I):
            add("WARN", "NOT_NULL_EXPANSION", path, "Thêm NOT NULL không default có thể lỗi trên bảng có dữ liệu.")

    errors = sum(item["level"] == "ERROR" for item in findings)
    warnings = sum(item["level"] == "WARN" for item in findings)
    return {"root": str(root), "migration_dir": str(directory), "files_scanned": len(files), "errors": errors, "warnings": warnings, "findings": findings}


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
            print(f"[{item['level']}] {item['code']} {item['file']}: {item['message']}")
        print(f"Summary: {report['errors']} error(s), {report['warnings']} warning(s)")
    return 1 if report["errors"] else 0


if __name__ == "__main__":
    raise SystemExit(main())

