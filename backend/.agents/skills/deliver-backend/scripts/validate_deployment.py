#!/usr/bin/env python3
"""Read-only Docker and deployment configuration validator."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


def inspect(root: Path) -> dict[str, object]:
    findings: list[dict[str, object]] = []
    dockerfile = next((path for path in (root / "Dockerfile", root / "docker/Dockerfile") if path.is_file()), None)
    compose_files = [path for name in ("compose.yaml", "compose.yml", "docker-compose.yml", "docker-compose.yaml") if (path := root / name).is_file()]

    def add(level: str, code: str, path: Path | None, line: int, message: str) -> None:
        findings.append({"level": level, "code": code, "file": str(path.relative_to(root)) if path else "", "line": line, "message": message})

    if dockerfile is None:
        add("ERROR", "DOCKERFILE_MISSING", None, 0, "Không tìm thấy Dockerfile.")
    else:
        text = dockerfile.read_text(encoding="utf-8", errors="replace")
        lines = text.splitlines()
        from_lines = [(i, line) for i, line in enumerate(lines, 1) if re.match(r"\s*FROM\s+", line, re.I)]
        if len(from_lines) < 2:
            add("WARN", "SINGLE_STAGE", dockerfile, from_lines[0][0] if from_lines else 0, "Nên dùng multi-stage build.")
        for number, line in from_lines:
            image = line.split()[1] if len(line.split()) > 1 else ""
            if ":" not in image or image.endswith(":latest"):
                add("ERROR", "UNPINNED_IMAGE", dockerfile, number, f"Base image chưa pin: {image}.")
        if not re.search(r"^\s*USER\s+(?!root\b)\S+", text, re.M | re.I):
            add("ERROR", "ROOT_CONTAINER", dockerfile, 0, "Runtime container chưa có USER non-root.")
        for number, line in enumerate(lines, 1):
            if re.search(r"^\s*(ENV|ARG)\s+\w*(PASSWORD|SECRET|TOKEN|API_KEY)\w*\s*=\s*\S+", line, re.I):
                add("ERROR", "SECRET_IN_IMAGE", dockerfile, number, "Không đặt secret value trong Dockerfile.")
            if re.search(r"^\s*COPY\s+\.\s+", line):
                add("WARN", "BROAD_COPY", dockerfile, number, "COPY . cần .dockerignore chặt.")
        if not (root / ".dockerignore").is_file():
            add("WARN", "DOCKERIGNORE_MISSING", dockerfile, 0, "Thiếu .dockerignore.")

    for path in compose_files:
        text = path.read_text(encoding="utf-8", errors="replace")
        for number, line in enumerate(text.splitlines(), 1):
            if re.search(r"image:\s*\S+:latest\b", line, re.I):
                add("ERROR", "COMPOSE_LATEST", path, number, "Không dùng image tag latest.")
            if re.search(r"(PASSWORD|SECRET|TOKEN|API_KEY)\s*:\s*['\"]?[^\s\x24{<][^\s]*", line, re.I):
                add("ERROR", "COMPOSE_SECRET", path, number, "Có thể có secret hard-code trong Compose.")
            if re.search(r"^\s*-\s*[\"']?3306:3306", line):
                add("WARN", "DB_PUBLIC_PORT", path, number, "Database đang bind mọi interface; local nên dùng 127.0.0.1.")
        if "healthcheck:" not in text:
            add("WARN", "HEALTHCHECK_MISSING", path, 0, "Compose chưa có healthcheck.")

    errors = sum(item["level"] == "ERROR" for item in findings)
    warnings = sum(item["level"] == "WARN" for item in findings)
    return {"root": str(root), "dockerfile": str(dockerfile) if dockerfile else None, "compose_files": len(compose_files), "errors": errors, "warnings": warnings, "findings": findings}


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

