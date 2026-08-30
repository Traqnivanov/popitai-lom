#!/usr/bin/env python3
from __future__ import annotations

import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OWNER = ROOT / "category-hub-v1.js"

version = subprocess.check_output(
    ["git", "hash-object", str(OWNER.relative_to(ROOT))],
    cwd=ROOT,
    text=True,
).strip()[:12]
expected = f"category-hub-v1.js?v={version}"
pattern = re.compile(r"category-hub-v1\.js\?v=([^\"']+)")

seen: list[str] = []
bad: list[str] = []
for path in sorted(ROOT.glob("*.html")):
    text = path.read_text(encoding="utf-8-sig")
    matches = pattern.findall(text)
    if not matches:
        continue
    seen.append(path.name)
    if any(value != version for value in matches):
        bad.append(path.name)

if not seen:
    raise SystemExit("Category hub cache guard FAIL: no HTML owner references found")
if bad:
    raise SystemExit(
        "Category hub cache guard FAIL: stale key in "
        + ", ".join(bad)
        + f"; expected {expected}"
    )

print(f"Category hub cache guard PASS: {expected} on {len(seen)} page(s): {', '.join(seen)}")
