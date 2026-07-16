#!/usr/bin/env python3
"""Render the base error prompt with one selected profile and JSON context."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path


OPTIONAL_DEFAULTS = {
    "ROOT_EXCEPTION": "UNKNOWN — cần tìm exception/signature gốc từ bằng chứng",
    "OBSERVED_BEHAVIOR": "UNKNOWN — cần tái hiện hoặc đọc log/test",
    "EXPECTED_BEHAVIOR": "UNKNOWN — cần đối chiếu yêu cầu, contract hoặc test",
    "REPRO_STEPS": "UNKNOWN — cần tìm lệnh hoặc test tái hiện nhỏ nhất",
    "PROJECT_CONTEXT": "UNKNOWN — cần đọc project, build và cấu hình liên quan",
    "RELEVANT_FILES": "UNKNOWN — cần tìm bằng search và code path",
    "RECENT_CHANGES": "UNKNOWN — cần kiểm tra diff/history nếu có",
    "CONSTRAINTS": "Tuân thủ rules, skills và stop conditions trong .agents",
    "AVAILABLE_COMMANDS": "UNKNOWN — cần xác định từ Gradle Wrapper và project scripts",
}


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(1)


def parse_frontmatter(text: str, path: Path) -> tuple[dict[str, str], str]:
    match = re.match(r"\A---\n(.*?)\n---\n(.*)\Z", text, re.DOTALL)
    if not match:
        fail(f"profile has invalid frontmatter: {path}")

    metadata: dict[str, str] = {}
    for line in match.group(1).splitlines():
        key, separator, value = line.partition(":")
        if not separator:
            fail(f"invalid profile metadata line in {path}: {line}")
        metadata[key.strip()] = value.strip()
    return metadata, match.group(2).strip()


def find_profile(prompts_root: Path, requested_code: str) -> tuple[dict[str, str], str]:
    code = requested_code.upper()
    matches: list[tuple[Path, dict[str, str], str]] = []
    for path in sorted(prompts_root.glob("*.md")):
        text = path.read_text(encoding="utf-8")
        if not text.startswith("---\n"):
            continue
        metadata, body = parse_frontmatter(text, path)
        if metadata.get("active", "true").lower() == "false":
            continue
        if metadata.get("code", "").upper() == code:
            matches.append((path, metadata, body))

    if not matches:
        fail(f"unknown prompt profile: {code}")
    if len(matches) > 1:
        fail(f"duplicate prompt profile code: {code}")
    _, metadata, body = matches[0]
    return metadata, body


def load_context(source: str) -> dict[str, str]:
    if source == "-":
        raw = sys.stdin.read()
    else:
        raw = Path(source).read_text(encoding="utf-8")
    try:
        value = json.loads(raw)
    except json.JSONDecodeError as exc:
        fail(f"invalid context JSON: {exc}")
    if not isinstance(value, dict):
        fail("context JSON must be an object")
    return {str(key).upper(): str(item) for key, item in value.items()}


def render(base: str, metadata: dict[str, str], body: str, context: dict[str, str]) -> str:
    error_input = context.get("ERROR_INPUT", "").strip()
    if not error_input:
        fail("context must contain a non-empty ERROR_INPUT")

    profile_mode = metadata.get("mode", "").upper()
    if profile_mode not in {"DIAGNOSE", "FIX"}:
        fail("profile mode must be DIAGNOSE or FIX")

    requested_mode = context.get("TASK_MODE", "").upper()
    if requested_mode and requested_mode not in {"DIAGNOSE", "FIX"}:
        fail("TASK_MODE override must be DIAGNOSE or FIX")
    task_mode = "DIAGNOSE" if requested_mode == "DIAGNOSE" else profile_mode

    values = dict(OPTIONAL_DEFAULTS)
    values.update(context)
    values.update(
        {
            "SELECTED_PROMPT_CODE": metadata.get("code", "UNKNOWN"),
            "PROMPT_NAME": metadata.get("name", "UNKNOWN"),
            "TASK_MODE": task_mode,
            "DOMAIN_PLAYBOOK": body,
            "ERROR_INPUT": error_input,
        }
    )

    rendered = re.sub(
        r"\{\{([A-Z0-9_]+)\}\}",
        lambda match: values.get(match.group(1), match.group(0)),
        base,
    )
    unresolved = sorted(set(re.findall(r"\{\{([A-Z0-9_]+)\}\}", rendered)))
    if unresolved:
        fail(f"unresolved placeholders: {', '.join(unresolved)}")
    return rendered


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("agents_root", help="Path to the .agents directory")
    parser.add_argument("--profile", required=True, help="Prompt code such as P06 or C01")
    parser.add_argument("--context", required=True, help="JSON file path, or - for stdin")
    args = parser.parse_args()

    agents_root = Path(args.agents_root).resolve()
    prompts_root = agents_root / "prompts"
    base_path = prompts_root / "BASE-ERROR-PROMPT.md"
    if not base_path.is_file():
        fail(f"missing base prompt: {base_path}")

    metadata, body = find_profile(prompts_root, args.profile)
    context = load_context(args.context)
    print(render(base_path.read_text(encoding="utf-8"), metadata, body, context))


if __name__ == "__main__":
    main()
