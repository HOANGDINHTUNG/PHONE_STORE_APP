#!/usr/bin/env python3
"""Summarize tables, indexes and foreign keys declared by Flyway SQL files."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


CREATE_TABLE = re.compile(r"\bCREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?\x60?([a-zA-Z0-9_]+)\x60?", re.I)
CREATE_INDEX = re.compile(r"\bCREATE\s+(?:UNIQUE\s+)?INDEX\s+\x60?([a-zA-Z0-9_]+)\x60?\s+ON\s+\x60?([a-zA-Z0-9_]+)\x60?", re.I)
FOREIGN_KEY = re.compile(r"\bCONSTRAINT\s+\x60?([a-zA-Z0-9_]+)\x60?\s+FOREIGN\s+KEY.*?\bREFERENCES\s+\x60?([a-zA-Z0-9_]+)\x60?", re.I | re.S)


def inspect(root: Path) -> dict[str, object]:
    directory = root / "src/main/resources/db/migration"
    if not directory.is_dir():
        directory = root / "db/migration" if (root / "db/migration").is_dir() else root
    files = sorted(directory.glob("V*.sql"))
    tables: dict[str, str] = {}
    indexes: list[dict[str, str]] = []
    foreign_keys: list[dict[str, str]] = []

    for path in files:
        sql = path.read_text(encoding="utf-8", errors="replace")
        for table in CREATE_TABLE.findall(sql):
            tables.setdefault(table, path.name)
        for name, table in CREATE_INDEX.findall(sql):
            indexes.append({"name": name, "table": table, "migration": path.name})
        for name, target in FOREIGN_KEY.findall(sql):
            foreign_keys.append({"name": name, "references": target, "migration": path.name})

    return {
        "root": str(root),
        "migration_dir": str(directory),
        "files_scanned": len(files),
        "tables": [{"name": name, "created_in": migration} for name, migration in sorted(tables.items())],
        "indexes": sorted(indexes, key=lambda item: (item["table"], item["name"])),
        "foreign_keys": sorted(foreign_keys, key=lambda item: item["name"]),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("project_root", nargs="?", default=".")
    parser.add_argument("--json", action="store_true", help="Xuất JSON đầy đủ.")
    args = parser.parse_args()
    report = inspect(Path(args.project_root).resolve())
    if args.json:
        print(json.dumps(report, ensure_ascii=False, indent=2))
    else:
        print(f"Migration files: {report['files_scanned']}")
        print("Tables:")
        for item in report["tables"]:
            print(f"  - {item['name']} ({item['created_in']})")
        print("Indexes:")
        for item in report["indexes"]:
            print(f"  - {item['name']} on {item['table']} ({item['migration']})")
        print("Foreign keys:")
        for item in report["foreign_keys"]:
            print(f"  - {item['name']} -> {item['references']} ({item['migration']})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

