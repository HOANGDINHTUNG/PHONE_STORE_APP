#!/usr/bin/env python3
"""Validate the numbered prompt library without external dependencies."""

from __future__ import annotations

import re
import json
import subprocess
import sys
from pathlib import Path


EXPECTED_CODES = [f"P{i:02d}" for i in range(13)]
REQUIRED_REFERENCES = [
    "input-contract.md",
    "prompt-catalog.md",
    "routing-matrix.md",
    "execution-contract.md",
    "output-contract.md",
]
REQUIRED_PLACEHOLDERS = {
    "SELECTED_PROMPT_CODE",
    "PROMPT_NAME",
    "TASK_MODE",
    "ERROR_INPUT",
    "ROOT_EXCEPTION",
    "OBSERVED_BEHAVIOR",
    "EXPECTED_BEHAVIOR",
    "REPRO_STEPS",
    "PROJECT_CONTEXT",
    "RELEVANT_FILES",
    "RECENT_CHANGES",
    "CONSTRAINTS",
    "AVAILABLE_COMMANDS",
    "DOMAIN_PLAYBOOK",
}
REQUEST_PLACEHOLDERS = {
    "ROLE",
    "ORIGINAL_REQUEST",
    "NORMALIZED_GOAL",
    "PROJECT_CONTEXT",
    "CURRENT_STATE",
    "INPUTS",
    "SELECTED_RULES",
    "SELECTED_SKILLS",
    "SELECTED_WORKFLOW",
    "IN_SCOPE",
    "OUT_OF_SCOPE",
    "CONSTRAINTS",
    "OPEN_QUESTIONS",
    "DOMAIN_INSTRUCTIONS",
    "DELIVERABLES",
    "ACCEPTANCE_CRITERIA",
    "VERIFICATION_PLAN",
    "TASK_MODE",
    "RISK_AND_IMPACT",
}


def fail(message: str) -> None:
    print(f"FAIL: {message}", file=sys.stderr)
    raise SystemExit(1)


def read(path: Path) -> str:
    if not path.is_file():
        fail(f"missing file: {path}")
    return path.read_text(encoding="utf-8")


def validate_frontmatter(skill_text: str) -> None:
    match = re.match(r"\A---\n(.*?)\n---\n", skill_text, re.DOTALL)
    if not match:
        fail("SKILL.md must start with YAML frontmatter")

    keys = []
    values = {}
    for line in match.group(1).splitlines():
        if not line.strip():
            continue
        key, separator, value = line.partition(":")
        if not separator:
            fail(f"invalid frontmatter line: {line}")
        keys.append(key.strip())
        values[key.strip()] = value.strip()

    if keys != ["name", "description"]:
        fail("frontmatter must contain only name and description, in that order")
    if values.get("name") != "debug-prompt-library":
        fail("frontmatter name must be debug-prompt-library")
    if not values.get("description"):
        fail("frontmatter description must not be empty")


def parse_profile(path: Path) -> tuple[dict[str, str], str]:
    text = read(path)
    match = re.match(r"\A---\n(.*?)\n---\n(.*)\Z", text, re.DOTALL)
    if not match:
        fail(f"profile has invalid frontmatter: {path}")

    metadata = {}
    for line in match.group(1).splitlines():
        key, separator, value = line.partition(":")
        if not separator:
            fail(f"invalid profile metadata line in {path}: {line}")
        metadata[key.strip()] = value.strip()
    return metadata, match.group(2).strip()


def main() -> None:
    if len(sys.argv) != 2:
        fail("usage: validate_prompt_library.py <.agents-root>")

    agents_root = Path(sys.argv[1]).resolve()
    skill_root = agents_root / "skills" / "debug-prompt-library"
    prompts_root = agents_root / "prompts"
    skill_text = read(skill_root / "SKILL.md")
    validate_frontmatter(skill_text)

    combined = skill_text
    for filename in REQUIRED_REFERENCES:
        combined += "\n" + read(skill_root / "references" / filename)

    catalog = read(skill_root / "references" / "prompt-catalog.md")
    catalog_codes = re.findall(r"^## (P\d{2})\b", catalog, re.MULTILINE)
    if catalog_codes != EXPECTED_CODES:
        fail(
            "prompt-catalog headings must contain exactly P00 through P12 in order; "
            f"found {catalog_codes}"
        )

    routing = read(skill_root / "references" / "routing-matrix.md")
    missing_routing = [code for code in EXPECTED_CODES if f"`{code}`" not in routing]
    if missing_routing:
        fail(f"routing matrix is missing codes: {', '.join(missing_routing)}")

    base_prompt = read(prompts_root / "BASE-ERROR-PROMPT.md")
    actual_placeholders = set(re.findall(r"\{\{([A-Z0-9_]+)\}\}", base_prompt))
    if actual_placeholders != REQUIRED_PLACEHOLDERS:
        fail(
            "base prompt placeholders differ from the required contract; "
            f"missing={sorted(REQUIRED_PLACEHOLDERS - actual_placeholders)}, "
            f"unexpected={sorted(actual_placeholders - REQUIRED_PLACEHOLDERS)}"
        )

    request_prompt = read(prompts_root / "REQUEST-PROMPT.template.md")
    actual_request_placeholders = set(
        re.findall(r"\{\{([A-Z0-9_]+)\}\}", request_prompt)
    )
    if actual_request_placeholders != REQUEST_PLACEHOLDERS:
        fail(
            "general request prompt placeholders differ from the required contract; "
            f"missing={sorted(REQUEST_PLACEHOLDERS - actual_request_placeholders)}, "
            f"unexpected={sorted(actual_request_placeholders - REQUEST_PLACEHOLDERS)}"
        )

    profiles = []
    for path in sorted(prompts_root.glob("P[0-9][0-9]-*.md")):
        metadata, body = parse_profile(path)
        required_metadata = {"code", "name", "mode", "triggers", "skills"}
        missing_metadata = required_metadata - set(metadata)
        if missing_metadata:
            fail(f"profile {path} is missing metadata: {sorted(missing_metadata)}")
        if metadata["mode"] not in {"DIAGNOSE", "FIX"}:
            fail(f"profile {path} has invalid mode: {metadata['mode']}")
        if not body:
            fail(f"profile {path} has an empty playbook")
        profiles.append(metadata["code"])
    if profiles != EXPECTED_CODES:
        fail(f"active profile files must contain exactly P00-P12; found {profiles}")

    read(prompts_root / "PROMPT-SCHEMA.md")
    custom_metadata, _ = parse_profile(
        prompts_root / "CUSTOM-PROMPT-PROFILE.template.md"
    )
    if custom_metadata.get("active") != "false" or custom_metadata.get("code") != "CXX":
        fail("custom profile template must remain inactive with code CXX")

    render_script = skill_root / "scripts" / "render_prompt.py"
    read(render_script)
    sample_context = json.dumps(
        {
            "ERROR_INPUT": "HTTP 403 when a valid test token calls GET /api/v1/orders",
            "ROOT_EXCEPTION": "AccessDeniedException",
            "PROJECT_CONTEXT": "Java 21 Spring Boot test context",
            "TASK_MODE": "DIAGNOSE",
        }
    )
    render_result = subprocess.run(
        [
            sys.executable,
            str(render_script),
            str(agents_root),
            "--profile",
            "P06",
            "--context",
            "-",
        ],
        input=sample_context,
        text=True,
        capture_output=True,
        check=False,
    )
    if render_result.returncode != 0:
        fail(f"sample prompt render failed: {render_result.stderr.strip()}")
    if "{{" in render_result.stdout or "P06" not in render_result.stdout:
        fail("sample prompt render left placeholders or omitted the selected code")
    if "Chế độ: `DIAGNOSE`" not in render_result.stdout:
        fail("a DIAGNOSE override must not be escalated to FIX")

    workflow = read(agents_root / "workflows" / "debug-by-prompt.md")
    readme = read(agents_root / "README.md")
    for label, text in (("workflow", workflow), ("README", readme)):
        if "P00" not in text or "P12" not in text:
            fail(f"{label} must document the complete P00-P12 range")

    approval_rule = read(agents_root / "rules" / "70-prompt-approval-policy.md")
    for required_text in (
        "PENDING_APPROVAL",
        "PROMPT ĐỀ XUẤT",
        "ĐỒNG Ý / OK / LÀM ĐI",
        "Xác nhận có kèm thay đổi",
    ):
        if required_text not in approval_rule:
            fail(f"prompt approval rule is missing required contract: {required_text}")
    if "## 5. Luật duyệt prompt trước khi Agent thực thi" not in readme:
        fail("README must explain the mandatory prompt approval gate")

    combined += "\n" + base_prompt + "\n" + request_prompt + "\n" + approval_rule
    for path in prompts_root.glob("*.md"):
        combined += "\n" + read(path)
    placeholders = re.findall(r"\b(?:TODO|FIXME|TBD)\b", combined)
    if placeholders:
        fail(f"unresolved placeholders found: {', '.join(sorted(set(placeholders)))}")

    print(
        "PASS: debug-prompt-library contains P00-P12, prompt templates, "
        "all required placeholders, and a working renderer"
    )


if __name__ == "__main__":
    main()
