#!/usr/bin/env python3
"""Plan or execute the local Gradle quality gate with explicit opt-in."""

from __future__ import annotations

import argparse
import os
import subprocess
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("project_root", nargs="?", default=".")
    parser.add_argument("--execute", action="store_true", help="Thực sự chạy Gradle; mặc định chỉ in kế hoạch.")
    parser.add_argument("--task", action="append", dest="tasks", help="Gradle task; có thể lặp. Mặc định: check.")
    parser.add_argument("--no-daemon", action="store_true", default=True)
    args = parser.parse_args()

    root = Path(args.project_root).resolve()
    wrapper = root / ("gradlew.bat" if os.name == "nt" else "gradlew")
    if not wrapper.is_file():
        print("[ERROR] Không tìm thấy Gradle Wrapper.")
        return 2

    tasks = args.tasks or ["check"]
    command = [str(wrapper)]
    if args.no_daemon:
        command.append("--no-daemon")
    command.extend(tasks)

    print("Quality gate command:")
    print(" ".join(command))
    print("Expected gates: compile, unit/slice/integration configured under Gradle, static analysis and coverage configured by project.")

    if not args.execute:
        print("Dry-run only. Thêm --execute để chạy.")
        return 0

    completed = subprocess.run(command, cwd=root, check=False)
    if completed.returncode:
        print(f"[FAILED] Quality gate trả mã {completed.returncode}.")
    else:
        print("[PASSED] Gradle quality gate hoàn tất.")
    return completed.returncode


if __name__ == "__main__":
    raise SystemExit(main())

