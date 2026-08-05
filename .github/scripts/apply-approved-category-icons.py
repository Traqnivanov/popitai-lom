from pathlib import Path
import json
import re

APPROVED = {
    "Майстори и ремонти": {
        "slug": "maistori",
        "className": "blue",
        "icon": '<path d="M14.7 6.3a4 4 0 0 0-5.4-5.4L7 3.2l3.8 3.8 2.3-2.3a4 4 0 0 0 1.6 1.6Z"/><path d="M10.8 7 3 14.8a2.1 2.1 0 0 0 3 3L13.8 10"/><path class="icon-accent" d="m4 3 3 3-1.5 1.5-3-3L4 3Zm3 3 14 14"/>'
    },
    "Здраве и лекари": {
        "slug": "zdrave",
        "className": "mint",
        "icon": '<path d="M6 3v5a5 5 0 0 0 10 0V3"/><path d="M4 3h2M16 3h2"/><path d="M11 13v2a5 5 0 0 0 10 0v-1"/><circle class="icon-accent" cx="21" cy="12" r="2"/>'
    },
    "Автомобили": {
        "slug": "avtomobili",
        "className": "slate",
        "icon": '<path d="m5 11 1.4-4A2 2 0 0 1 8.3 5h7.4a2 2 0 0 1 1.9 2l1.4 4"/><rect x="3" y="11" width="18" height="7" rx="2"/><path d="M6 18v2M18 18v2"/><circle class="icon-accent" cx="7.5" cy="14.5" r="1.2"/><circle class="icon-accent" cx="16.5" cy="14.5" r="1.2"/>'
    },
    "Магазини и покупки": {
        "slug": "magazini",
        "className": "sand",
        "icon": '<path d="M6 8h12l1 13H5L6 8Z"/><path class="icon-accent" d="M9 9V6a3 3 0 0 1 6 0v3"/>'
    },
    "Заведения": {
        "slug": "zavedenia",
        "className": "rose",
        "icon": '<path d="M5 3v7M2.5 3v4.5A2.5 2.5 0 0 0 5 10a2.5 2.5 0 0 0 2.5-2.5V3M5 10v11"/><path class="icon-accent" d="M17 3v18M14 3v6a3 3 0 0 0 3 3"/>'
    },
    "Работа и услуги": {
        "slug": "rabota",
        "className": "violet",
        "icon": '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/><path class="icon-accent" d="M10 12v3h4v-3"/>'
    },
    "Обяви": {
        "slug": "obyavi",
        "className": "teal",
        "icon": '<path d="M4 10v4M8 8.5v7M8 9l10-4v14L8 15Z"/><path d="m8 15 2.5 5"/><path class="icon-accent" d="M20 8.5c1 .8 1.5 2 1.5 3.5S21 14.7 20 15.5"/>'
    },
    "Събития и град": {
        "slug": "sabitiya",
        "className": "blue",
        "icon": '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/><circle class="icon-accent" cx="8" cy="14" r=".7"/><circle class="icon-accent" cx="12" cy="14" r=".7"/><circle class="icon-accent" cx="16" cy="14" r=".7"/><circle class="icon-accent" cx="8" cy="18" r=".7"/><circle class="icon-accent" cx="12" cy="18" r=".7"/><circle class="icon-accent" cx="16" cy="18" r=".7"/>'
    }
}

OLD = {
    "Майстори и ремонти": '<path d="M14.5 5.5 18 2l4 4-3.5 3.5"/><path d="m13 7 4 4"/><path d="M5 3l4 4-2 2-4-4V3h2Z"/><path d="m7 9 12 12"/><path class="icon-accent" d="m3 21 6-6"/>',
    "Здраве и лекари": '<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6Z"/><path class="icon-accent icon-heart" d="M8.5 12.3c1.1-1.5 3.2-.9 3.5.4.3-1.3 2.4-1.9 3.5-.4 1.4 2-1 4-3.5 5.7-2.5-1.7-4.9-3.7-3.5-5.7Z"/>',
    "Автомобили": '<path d="M4 14h16l-1.7-5a2 2 0 0 0-1.9-1.4H7.6A2 2 0 0 0 5.7 9L4 14Z"/><path d="M3 14v4a1 1 0 0 0 1 1h2M21 14v4a1 1 0 0 1-1 1h-2M8 19h8"/><circle class="icon-accent" cx="7" cy="15.5" r="1.2"/><circle class="icon-accent" cx="17" cy="15.5" r="1.2"/>',
    "Магазини и покупки": '<path d="M6 8h12l1 13H5L6 8Z"/><path class="icon-accent" d="M9 9V6a3 3 0 0 1 6 0v3"/>',
    "Заведения": '<path d="M5 3v7M2.5 3v4.5A2.5 2.5 0 0 0 5 10a2.5 2.5 0 0 0 2.5-2.5V3M5 10v11"/><path class="icon-accent" d="m17.5 3-7 18M14.8 3l5.7 2-2.3 6.5"/>',
    "Работа и услуги": '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/><path class="icon-accent" d="M10 12v3h4v-3"/>',
    "Обяви": '<path d="M4 10v4M8 8.5v7M8 9l10-4v14L8 15Z"/><path d="m8 15 2.5 5"/><path class="icon-accent" d="M20 8.5c1 .8 1.5 2 1.5 3.5S21 14.7 20 15.5"/>',
    "Събития и град": '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/><path class="icon-accent" d="m12 12.5 1.1 2.2 2.4.4-1.8 1.7.4 2.4-2.1-1.1-2.1 1.1.4-2.4-1.8-1.7 2.4-.4L12 12.5Z"/>'
}

script = Path("script.js")
source = script.read_text(encoding="utf-8")
meta_line = "const CATEGORY_META = " + json.dumps(APPROVED, ensure_ascii=False, separators=(", ", ": ")) + ";"
source, count = re.subn(r"const CATEGORY_META = \{.*?\};", meta_line, source, count=1, flags=re.S)
if count != 1:
    raise SystemExit("CATEGORY_META was not replaced")
if "// APPROVED CATEGORY ICONS — 2026-08-05" not in source:
    source = source.replace(meta_line, meta_line + "\n// APPROVED CATEGORY ICONS — 2026-08-05", 1)
script.write_text(source, encoding="utf-8")

for path in Path(".").glob("*.html"):
    text = path.read_text(encoding="utf-8")
    original = text
    for name, old_icon in OLD.items():
        text = text.replace(old_icon, APPROVED[name]["icon"])
    text = re.sub(r"script\.js\?v=[^\"']+", "script.js?v=20260805-1626", text)
    if text != original:
        path.write_text(text, encoding="utf-8")

workflow = Path(".github/workflows/apply-approved-category-icons.yml")
helper = Path(".github/scripts/apply-approved-category-icons.py")
if workflow.exists():
    workflow.unlink()
if helper.exists():
    helper.unlink()
