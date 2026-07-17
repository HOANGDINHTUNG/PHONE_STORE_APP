#!/usr/bin/env python3
"""Extract Spring MVC endpoints and flag obvious contract inconsistencies."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


CLASS_MAPPING = re.compile(r"@RequestMapping\s*\(\s*(?:value\s*=\s*)?[{\[]?\s*\"([^\"]*)\"")
METHOD_MAPPING = re.compile(
    r"@(Get|Post|Put|Patch|Delete)Mapping(?:\s*\(\s*(?:value\s*=\s*)?[{\[]?\s*\"([^\"]*)\"[^)]*\))?",
    re.M,
)
REQUEST_METHOD = re.compile(
    r"@RequestMapping\s*\([^)]*method\s*=\s*RequestMethod\.(GET|POST|PUT|PATCH|DELETE)[^)]*(?:value|path)\s*=\s*\"([^\"]*)\"",
    re.S,
)


def normalize(base: str, child: str) -> str:
    path = "/" + "/".join(part.strip("/") for part in (base, child) if part.strip("/"))
    return re.sub(r"/+", "/", path) or "/"


def inspect(root: Path) -> dict[str, object]:
    source = root / "src/main/java"
    controller_files = sorted(source.rglob("*Controller.java")) if source.is_dir() else []
    api_contract_files = sorted(source.rglob("*Api.java")) if source.is_dir() else []
    files = sorted(set(controller_files + api_contract_files))
    endpoints: list[dict[str, object]] = []
    findings: list[dict[str, object]] = []

    for path in files:
        text = path.read_text(encoding="utf-8", errors="replace")
        class_match = CLASS_MAPPING.search(text)
        base = class_match.group(1) if class_match else ""
        for match in METHOD_MAPPING.finditer(text):
            method = match.group(1).upper()
            child = match.group(2) or ""
            endpoint = {
                "method": method,
                "path": normalize(base, child),
                "file": str(path.relative_to(root)),
                "source_type": "api-interface" if path.name.endswith("Api.java") else "controller",
            }
            endpoints.append(endpoint)
        for method, child in REQUEST_METHOD.findall(text):
            endpoints.append(
                {
                    "method": method,
                    "path": normalize(base, child),
                    "file": str(path.relative_to(root)),
                    "source_type": "api-interface" if path.name.endswith("Api.java") else "controller",
                }
            )

        if path.name.endswith("Controller.java") and re.search(
            r"@(Operation|ApiResponse|ApiResponses|Tag|SecurityRequirement)\b", text
        ):
            findings.append(
                {
                    "level": "WARN",
                    "code": "OPENAPI_ANNOTATION_ON_CONTROLLER",
                    "file": str(path.relative_to(root)),
                    "message": (
                        "OpenAPI annotation đang nằm trên Controller; contract-first nên dùng YAML, "
                        "code-first có ADR nên đặt trên *Api interface trong cùng module."
                    ),
                }
            )

    seen: dict[tuple[str, str], str] = {}
    for endpoint in endpoints:
        key = (str(endpoint["method"]), str(endpoint["path"]))
        if key in seen:
            findings.append({"level": "ERROR", "code": "DUPLICATE_ENDPOINT", "file": endpoint["file"], "message": f"Trùng {key[0]} {key[1]} với {seen[key]}."})
        seen[key] = str(endpoint["file"])
        path = str(endpoint["path"])
        if not path.startswith("/api/v1/") and not path.startswith(("/actuator", "/error")):
            findings.append({"level": "WARN", "code": "UNVERSIONED_PATH", "file": endpoint["file"], "message": f"{key[0]} {path} chưa nằm dưới /api/v1."})
        if re.search(r"/(get|create|update|delete|list)[A-Z/_-]", path, re.I):
            findings.append({"level": "WARN", "code": "VERB_IN_PATH", "file": endpoint["file"], "message": f"Đường dẫn có thể chứa động từ CRUD: {path}."})

    endpoints.sort(key=lambda item: (str(item["path"]), str(item["method"])))
    errors = sum(item["level"] == "ERROR" for item in findings)
    warnings = sum(item["level"] == "WARN" for item in findings)
    return {
        "root": str(root),
        "controllers_scanned": len(controller_files),
        "api_contracts_scanned": len(api_contract_files),
        "files_scanned": len(files),
        "endpoints": endpoints,
        "errors": errors,
        "warnings": warnings,
        "findings": findings,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("project_root", nargs="?", default=".")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    report = inspect(Path(args.project_root).resolve())
    if args.json:
        print(json.dumps(report, ensure_ascii=False, indent=2))
    else:
        for endpoint in report["endpoints"]:
            print(f"{endpoint['method']:6} {endpoint['path']}  [{endpoint['file']}]")
        for item in report["findings"]:
            print(f"[{item['level']}] {item['code']}: {item['message']}")
        print(
            "Summary: "
            f"{len(report['endpoints'])} endpoint(s), "
            f"{report['controllers_scanned']} controller(s), "
            f"{report['api_contracts_scanned']} API interface(s), "
            f"{report['errors']} error(s), {report['warnings']} warning(s)"
        )
    return 1 if report["errors"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
