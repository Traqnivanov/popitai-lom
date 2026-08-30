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
dictionary_marker = "public-category-dictionary-v1.js?v="
owner_marker = "category-hub-v1.js?v="

seen: list[str] = []
stale: list[str] = []
missing_dictionary: list[str] = []
wrong_order: list[str] = []

for path in sorted(ROOT.glob("*.html")):
    text = path.read_text(encoding="utf-8-sig")
    matches = pattern.findall(text)
    if not matches:
        continue

    seen.append(path.name)
    if any(value != version for value in matches):
        stale.append(path.name)

    dictionary_pos = text.find(dictionary_marker)
    owner_pos = text.find(owner_marker)
    if dictionary_pos < 0:
        missing_dictionary.append(path.name)
    elif dictionary_pos > owner_pos:
        wrong_order.append(path.name)

if not seen:
    raise SystemExit("Category hub guard FAIL: no HTML owner references found")

problems: list[str] = []
if stale:
    problems.append(
        "stale cache key in " + ", ".join(stale) + f"; expected {expected}"
    )
if missing_dictionary:
    problems.append(
        "missing public category dictionary in " + ", ".join(missing_dictionary)
    )
if wrong_order:
    problems.append(
        "public category dictionary loads after category hub owner in "
        + ", ".join(wrong_order)
    )

if problems:
    raise SystemExit("Category hub guard FAIL: " + " | ".join(problems))

print(
    f"Category hub guard PASS: {expected} with dictionary dependency before owner "
    f"on {len(seen)} page(s): {', '.join(seen)}"
)
