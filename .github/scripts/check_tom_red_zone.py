#!/usr/bin/env python3
"""Detect TOM RED-ZONE path changes between two Git refs.

This is a detection layer, not proof that a change is forbidden and not a
substitute for GitHub required checks / branch protection.
"""

from __future__ import annotations

import argparse
import fnmatch
import subprocess
import sys


EXACT_FILES = {
    "PROJECT_RULES_00_READ_FIRST.md",
    "POPITAI_LOM_MASTER_CURRENT.md",
    "POPITAI_LOM_DECISION_AND_BACKLOG_REGISTER.md",
    "POPITAI_LOM_TOM_CONTROL.md",
    "POPITAI_LOM_WORK_REVIEW_QUEUE.md",
    "PROJECT_PROGRESS.md",
    "PROJECT_RULES_PROTECTED_CORE.md",
    "PROJECT_RULES_ADMIN_MODERATOR.md",
    "PROJECT_RULES.md",
    "PROJECT_RULES_RENDER_OWNERSHIP.md",
}

PREFIXES = (
    "supabase/",
    "migrations/",
    "database/",
    "sql/",
    ".github/workflows/",
)

GLOBS = (
    "**/migrations/**",
    "**/*migration*.sql",
    "**/*migration*.js",
    "**/*migration*.ts",
    "**/*rls*.sql",
    "**/*policy*.sql",
    "admin-*.js",
    "admin-*.html",
    "supabase-*.js",
    "supabase-*.ts",
    "ADMIN_PANEL_V2_*.md",
)

SELF_GUARD_PATHS = {
    ".github/scripts/check_tom_red_zone.py",
}


def changed_files(base: str, head: str) -> list[str]:
    proc = subprocess.run(
        ["git", "diff", "--name-only", f"{base}...{head}"],
        check=False,
        text=True,
        capture_output=True,
    )
    if proc.returncode != 0:
        sys.stderr.write(proc.stderr)
        raise SystemExit("Unable to compute TOM RED-ZONE diff")
    return [line.strip() for line in proc.stdout.splitlines() if line.strip()]


def is_red_zone(path: str) -> bool:
    if path in EXACT_FILES or path in SELF_GUARD_PATHS:
        return True
    if any(path.startswith(prefix) for prefix in PREFIXES):
        return True
    return any(fnmatch.fnmatch(path, pattern) for pattern in GLOBS)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("base", help="Base Git ref/SHA")
    parser.add_argument("head", help="Head Git ref/SHA")
    args = parser.parse_args()

    changed = changed_files(args.base, args.head)
    red = [path for path in changed if is_red_zone(path)]

    print(f"TOM diff: {len(changed)} changed file(s)")
    if not red:
        print("TOM RED-ZONE guard PASS: no controlled paths changed.")
        return 0

    print("RED-ZONE CHANGE DETECTED:")
    for path in red:
        print(f"  - {path}")
    print(
        "These changes require an explicit control review. "
        "This detector does not decide whether an OWNER-approved RED-ZONE change is valid."
    )
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
