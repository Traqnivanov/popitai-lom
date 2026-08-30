#!/usr/bin/env python3
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def text(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8-sig")


problems: list[str] = []
market = text("marketplace-v3.js")
shell = text("public-shell-v1.js")
listings = text("category-listings-v1.js")
css = text("marketplace-v3.css")


def require(name: str, source: str, needle: str) -> None:
    if needle not in source:
        problems.append(f"{name}: missing {needle!r}")


def forbid(name: str, source: str, pattern: str) -> None:
    if re.search(pattern, source, re.I | re.S):
        problems.append(f"{name}: forbidden pattern {pattern!r}")


# Product contract: one marketplace entry, exact four public main groups.
for needle in [
    '"obyavi.html", "Обяви и услуги"',
    '<span>Обяви</span>',
    '<span>Инфо</span>',
    '<span>Профил</span>',
    '>Още</summary>',
    'href="vaprosi.html">Въпроси</a>',
    'href="sabitiya.html">Събития</a>',
]:
    require("public-shell-v1.js", shell, needle)

for old_runtime_link in ['href="kategorii.html">Категории</a>', '<span>Категории</span>']:
    if old_runtime_link in shell:
        problems.append(f"public-shell-v1.js: competing marketplace entry remains: {old_runtime_link}")

for needle in [
    '["maistori", "Майстори и ремонти"]',
    '["avtomobili", "Автомобили"]',
    '["uslugi", "Други услуги"]',
    '["other", "Други обяви"]',
    'window.location.replace(target.href)',
    'Добави обява',
    'Всички категории',
    'Предлагат',
    'Търсят',
    'Фирми',
    'marketplace-form-flow',
    'name="marketplace-intent" value="offer"',
    'name="marketplace-intent" value="seek"',
    'main === "maistori" || main === "uslugi"',
    'storedCategory = "Услуги"',
    'GROUPS.avtomobili.vehicleLabel',
]:
    require("marketplace-v3.js", market, needle)

# Exact public taxonomy required by the handoff.
for label in [
    "Цялостни ремонти", "Бани и плочки", "ВиК", "Електро", "Покриви", "Боядисване", "Дограма", "Климатици",
    "Автомобили за продажба или търсене", "Авточасти", "Автосервизи", "Диагностика", "Гуми", "Автомивки", "Пътна помощ",
    "Домашна помощ", "Красота и грижа", "Компютърни и технически услуги", "Фото и видео", "Професионални услуги", "Обучение и уроци", "Грижа", "Транспорт, преместване и доставки",
    "Електроника", "Дом и градина", "Дрехи и обувки", "Деца и бебета", "Спорт и хоби", "Животни", "Работа", "Имоти", "Друго",
]:
    # Service values can be supplied by the canonical dictionary rather than duplicated in this owner.
    if label not in market and label not in text("public-category-dictionary-v1.js"):
        problems.append(f"canonical marketplace taxonomy missing: {label}")

# Presentation owner must stay write-free. The read-only thematic owner must also stay write-free.
for path, source in [("marketplace-v3.js", market), ("category-listings-v1.js", listings)]:
    for method in [".insert(", ".update(", ".delete(", ".upsert("]:
        if method in source:
            problems.append(f"{path}: presentation/read-only owner contains write method {method}")

# Preserve protected priority ordering and approved/active constraints in the listings owner.
for needle in [
    '.eq("status", "approved")',
    '.or("expires_at.is.null,expires_at.gt." + new Date().toISOString())',
    'if (a.owner_id === ADMIN_ID && b.owner_id !== ADMIN_ID) return -1',
    'if (a.is_boosted && !b.is_boosted) return -1',
    'element.matches(".subcategory-card, .contextual-subcategory-item")',
    'button.textContent = expanded ? "Покажи по-малко" : "Всички услуги"',
]:
    require("category-listings-v1.js", listings, needle)

# The old contextual action markup may remain for compatibility, but V3 must neutralize it visibly.
require("marketplace-v3.css", css, ".marketplace-v3-theme .contextual-subcategory-actions { display: none !important; }")
require("marketplace-v3.css", css, ".marketplace-v3-theme .public-stage4-actions > *:not(.marketplace-category-add) { display: none !important; }")
require("marketplace-v3.css", css, ".marketplace-v3-landing #listing-categories { display: none !important; }")

# Do not introduce protected backend/schema/admin changes through this implementation owner.
for source_name, source in [("marketplace-v3.js", market), ("marketplace-v3.css", css), ("public-shell-v1.js", shell), ("category-listings-v1.js", listings)]:
    forbid(source_name, source, r"\bcreate\s+policy\b|\balter\s+table\b|\bcreate\s+table\b|\bdrop\s+table\b")

if problems:
    print("Marketplace V3 contract check FAILED:", file=sys.stderr)
    for problem in problems:
        print(f"- {problem}", file=sys.stderr)
    raise SystemExit(1)

print("Marketplace V3 contract check PASS: unified entry, canonical mapping, write-free presentation and protected listing priority verified.")
