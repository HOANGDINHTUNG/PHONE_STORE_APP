#!/usr/bin/env python3
"""Heuristic security scanner for Java/config source; read-only and dependency-free."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


TEXT_SUFFIXES = {".java", ".kt", ".kts", ".gradle", ".properties", ".yml", ".yaml", ".xml"}
RULES = (
    ("ERROR", "JWT_ALG_NONE", re.compile(r"""algorithm\s*[:=]\s*['"]?none\b|Algorithm\.none""", re.I), "Không chấp nhận JWT alg=none."),
    ("ERROR", "CORS_WILDCARD", re.compile(r"""allowedOrigins?\s*\(\s*['"]\*|allowed[-_.]?origins?\s*[:=]\s*['"]?\*""", re.I), "Không dùng wildcard CORS."),
    ("ERROR", "TOKEN_QUERY", re.compile(r"""[?&](access_token|refresh_token)=|@RequestParam\s*\([^)]*(token)""", re.I), "Không truyền token qua query parameter."),
    ("ERROR", "LOG_AUTH", re.compile(r"""\b(log|logger)\.\w+\([^;]*(Authorization|Bearer|refreshToken|accessToken)""", re.I), "Không ghi token/Authorization vào log."),
    ("WARN", "PERMIT_ALL_WILDCARD", re.compile(r"""requestMatchers\s*\(\s*['"]/\*\*['"]\s*\).*permitAll""", re.I | re.S), "permitAll toàn hệ thống cần loại bỏ."),
    ("WARN", "CSRF_DISABLED", re.compile(r"""csrf\s*\([^;]*disable\s*\(""", re.I | re.S), "Xác nhận lý do tắt CSRF theo cơ chế lưu token."),
    ("WARN", "HARDCODED_SECRET", re.compile(r"""(jwt|secret|password|api.?key)[\w.-]*\s*[:=]\s*['"][^$<{][^'"]{7,}['"]""", re.I), "Có thể có secret hard-code."),
)


def inspect(root: Path) -> dict[str, object]:
    files = sorted(path for path in root.rglob("*") if path.is_file() and path.suffix.lower() in TEXT_SUFFIXES and ".git" not in path.parts and "build" not in path.parts)
    findings: list[dict[str, object]] = []
    for path in files:
        text = path.read_text(encoding="utf-8", errors="replace")
        for level, code, pattern, message in RULES:
            for match in pattern.finditer(text):
                line = text.count("\n", 0, match.start()) + 1
                findings.append({"level": level, "code": code, "file": str(path.relative_to(root)), "line": line, "message": message})

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
            print(f"[{item['level']}] {item['code']} {item['file']}:{item['line']}: {item['message']}")
        print(f"Summary: {report['errors']} error(s), {report['warnings']} warning(s)")
    return 1 if report["errors"] else 0


if __name__ == "__main__":
    raise SystemExit(main())

