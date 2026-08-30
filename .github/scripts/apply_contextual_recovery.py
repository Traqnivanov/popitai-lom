#!/usr/bin/env python3
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[2]
DICT = ROOT / "public-category-dictionary-v1.js"

CSS_REF = '<link rel="stylesheet" href="public-context-actions-v1.css?v=20260830-recovery1">'
PREFILL_REF = '<script src="public-context-prefill-v1.js?v=20260830-recovery1" defer></script>'
SPECIAL_REF = '<script src="public-context-special-actions-v1.js?v=20260830-recovery1" defer></script>'

HERO_START = '<!-- CONTEXTUAL CATEGORY ACTIONS START -->'
HERO_END = '<!-- CONTEXTUAL CATEGORY ACTIONS END -->'
GRID_START = '<!-- CONTEXTUAL SUBCATEGORIES START -->'
GRID_END = '<!-- CONTEXTUAL SUBCATEGORIES END -->'

GRID_OPEN = {
    "maistori.html": '<div class="subcategory-grid" id="category-subcategories" data-mobile-priority="Цялостни ремонти|ВиК|Електро|Покриви|Бани и плочки">',
    "avtomobili.html": '<div class="subcategory-grid" id="category-subcategories" data-mobile-priority="Автосервизи|Диагностика|Гуми|Пътна помощ">',
    "rabota.html": '<div class="subcategory-grid" id="category-subcategories" data-mobile-priority="Домашна помощ|Красота и грижа|Компютърни и технически услуги|Обучение и уроци|Професионални услуги">',
}

OLD_HERO = {
    "maistori.html": '<div class="public-stage4-actions"><a class="primary-link-button" href="#category-subcategories">Намери майстор</a><a class="secondary-link-button" href="nov-vapros.html?category=maistori">Задай въпрос</a></div>',
    "avtomobili.html": '<div class="public-stage4-actions"><a class="primary-link-button" href="#category-subcategories">Намери автосервиз или услуга</a><a class="secondary-link-button" href="nov-vapros.html?category=avtomobili">Задай въпрос</a></div>',
    "rabota.html": '<div class="public-stage4-actions"><a class="primary-link-button" href="#category-subcategories">Намери услуга</a><a class="secondary-link-button" href="nov-vapros.html?category=rabota">Задай въпрос</a></div>',
    "zavedenia.html": '<div class="public-stage4-actions"><a class="primary-link-button" href="#category-subcategories">Намери заведение</a><a class="secondary-link-button" href="nov-vapros.html?category=zavedenia">Задай въпрос</a></div>',
}


def q(value: str) -> str:
    return quote(value, safe="")


def read(path: Path) -> tuple[str, bool]:
    raw = path.read_bytes()
    bom = raw.startswith(b"\xef\xbb\xbf")
    return raw.decode("utf-8-sig"), bom


def write(path: Path, text: str, bom: bool) -> None:
    data = text.encode("utf-8")
    if bom:
        data = b"\xef\xbb\xbf" + data
    path.write_bytes(data)


def service_groups() -> tuple[list[str], list[str], list[str]]:
    text = DICT.read_text(encoding="utf-8")
    match = re.search(r"const SERVICE_SUBCATEGORIES = Object\.freeze\(\[(.*?)\]\);", text, re.S)
    if not match:
        raise ValueError("cannot read canonical SERVICE_SUBCATEGORIES")
    values = re.findall(r'"((?:\\.|[^"\\])*)"', match.group(1))
    if len(values) != 22:
        raise ValueError(f"canonical service taxonomy must contain 22 values, found {len(values)}")
    return values[:8], values[8:14], values[14:]


def listing_url(subcategory: str, seek: bool = False) -> str:
    base = f"dobavi-obqva.html?category={q('Услуги')}&subcategory={q(subcategory)}"
    if seek:
        base += f"&type={q('Търси')}"
    return base


def contextual_item(subcategory: str, seek_label: str) -> str:
    search = f"tarsene.html?q={q(subcategory)}"
    return (
        '<article class="contextual-subcategory-item">'
        f'<a class="subcategory-card" href="{search}"><strong>{subcategory}</strong><span>Фирми, обяви и препоръки</span></a>'
        '<div class="contextual-subcategory-actions">'
        f'<a href="{listing_url(subcategory)}">Предложи услуга</a>'
        f'<a href="{listing_url(subcategory, seek=True)}">{seek_label}</a>'
        '</div></article>'
    )


def grid_block(name: str, values: list[str], seek_label: str) -> str:
    items = "\n        ".join(contextual_item(value, seek_label) for value in values)
    return f"{GRID_START}\n      {GRID_OPEN[name]}\n        {items}\n      </div>\n      {GRID_END}"


def hero_block(name: str) -> str:
    if name == "maistori.html":
        body = (
            '<div class="public-stage4-actions">'
            '<a class="primary-link-button" href="#category-subcategories">Намери майстор</a>'
            '<a class="secondary-link-button" href="#category-subcategories">Предложи или потърси услуга</a>'
            '<a class="secondary-link-button" href="dobavi-firma.html?category=maistori">Добави фирма</a>'
            '<a class="secondary-link-button" href="nov-vapros.html?category=maistori">Задай въпрос</a>'
            '</div>'
        )
    elif name == "avtomobili.html":
        body = (
            '<div class="public-stage4-actions">'
            '<a class="primary-link-button" href="#category-subcategories">Намери автосервиз или услуга</a>'
            f'<a class="secondary-link-button" href="dobavi-obqva.html?category={q("Автомобили и МПС")}">Продай или потърси автомобил</a>'
            '<a class="secondary-link-button" href="dobavi-firma.html?category=avtomobili">Добави фирма</a>'
            '<a class="secondary-link-button" href="nov-vapros.html?category=avtomobili">Задай въпрос</a>'
            '</div>'
        )
    elif name == "rabota.html":
        body = (
            '<div class="public-stage4-actions">'
            '<a class="primary-link-button" href="#category-subcategories">Намери услуга</a>'
            '<a class="secondary-link-button" href="#category-subcategories">Предложи услуга / Търся изпълнител</a>'
            '<a class="secondary-link-button" href="dobavi-firma.html?category=rabota">Добави фирма</a>'
            '<a class="secondary-link-button" href="nov-vapros.html?category=rabota">Задай въпрос</a>'
            '</div>'
        )
    elif name == "zavedenia.html":
        body = (
            '<div class="public-stage4-actions">'
            '<a class="primary-link-button" href="#category-subcategories">Намери заведение</a>'
            '<a class="secondary-link-button" href="dobavi-firma.html?category=zavedenia">Добави заведение</a>'
            '<a class="secondary-link-button" href="nov-vapros.html?category=zavedenia">Задай въпрос</a>'
            '</div>'
        )
    else:
        raise ValueError(f"unknown hero page: {name}")
    return f"{HERO_START}\n      {body}\n      {HERO_END}"


def replace_marked_or_old(text: str, start: str, end: str, old: str, new: str, label: str) -> str:
    marker = re.compile(re.escape(start) + r".*?" + re.escape(end), re.S)
    if marker.search(text):
        return marker.sub(new, text, count=1)
    if old not in text:
        raise ValueError(f"cannot locate {label}")
    return text.replace(old, new, 1)


def replace_grid(text: str, name: str, block: str) -> str:
    marker = re.compile(re.escape(GRID_START) + r".*?" + re.escape(GRID_END), re.S)
    if marker.search(text):
        return marker.sub(block, text, count=1)
    current = re.compile(r'<div class="subcategory-grid" id="category-subcategories"[^>]*>.*?</div>', re.S)
    if not current.search(text):
        raise ValueError(f"{name}: cannot locate existing subcategory grid")
    return current.sub(block, text, count=1)


def ensure_before(text: str, ref: str, anchor: str, label: str) -> str:
    if ref in text:
        return text
    if anchor not in text:
        raise ValueError(f"cannot insert {label}: anchor missing")
    return text.replace(anchor, ref + "\n  " + anchor, 1)


def ensure_after(text: str, ref: str, anchor: str, label: str) -> str:
    if ref in text:
        return text
    if anchor not in text:
        raise ValueError(f"cannot insert {label}: anchor missing")
    return text.replace(anchor, anchor + "\n  " + ref, 1)


def migrate_page(name: str, repair: list[str], auto: list[str], general: list[str]) -> str:
    path = ROOT / name
    text, bom = read(path)

    if name in OLD_HERO:
        text = replace_marked_or_old(text, HERO_START, HERO_END, OLD_HERO[name], hero_block(name), f"{name} hero actions")

    if name == "maistori.html":
        text = replace_grid(text, name, grid_block(name, repair, "Търся изпълнител"))
    elif name == "avtomobili.html":
        text = replace_grid(text, name, grid_block(name, auto, "Търся услуга"))
        old = '<a class="primary-link-button" href="obyavi.html">Към Обяви</a>'
        new = (
            '<div class="public-stage4-actions">'
            '<a class="primary-link-button" href="obyavi.html">Разгледай обяви</a>'
            f'<a class="secondary-link-button" href="dobavi-obqva.html?category={q("Автомобили и МПС")}">Добави автомобилна обява</a>'
            '</div>'
        )
        if "Добави автомобилна обява" not in text:
            if old not in text:
                raise ValueError("avtomobili.html: vehicle contextual action anchor missing")
            text = text.replace(old, new, 1)
    elif name == "rabota.html":
        text = replace_grid(text, name, grid_block(name, general, "Търся изпълнител"))

    if name in {"maistori.html", "avtomobili.html", "rabota.html"}:
        text = ensure_before(
            text,
            CSS_REF,
            '<link rel="stylesheet" href="public-shell-v1.css?v=20260830-stage4">',
            "context action stylesheet",
        )

    if name == "magazini.html":
        old = '<div class="public-stage4-actions"><a class="primary-link-button" href="#shops-panel">Намери магазин</a><a class="secondary-link-button" href="obyavi.html">Всички обяви</a><a class="secondary-link-button" href="nov-vapros.html?category=magazini">Задай въпрос</a></div>'
        new = (
            '<div class="public-stage4-actions">'
            '<a class="primary-link-button" href="#shops-panel">Намери магазин</a>'
            '<button class="secondary-link-button context-shop-add" type="button" data-context-shop-add hidden>Добави магазин</button>'
            '<a class="secondary-link-button" href="obyavi.html">Всички обяви</a>'
            '<a class="secondary-link-button" href="nov-vapros.html?category=magazini">Задай въпрос</a>'
            '</div>'
        )
        if "data-context-shop-add" not in text:
            if old not in text:
                raise ValueError("magazini.html: current hero actions not found")
            text = text.replace(old, new, 1)
        text = ensure_before(
            text,
            CSS_REF,
            '<link rel="stylesheet" href="public-shell-v1.css?v=20260830-stage4">',
            "shop contextual stylesheet",
        )
        text = ensure_after(
            text,
            SPECIAL_REF,
            '<script src="shops-catalog-v3.js?v=20260823-0155" defer></script>',
            "shop contextual delegation",
        )

    if name in {"dobavi-obqva.html", "dobavi-firma.html"}:
        text = ensure_after(
            text,
            PREFILL_REF,
            '<script src="public-category-dictionary-v1.js?v=20260830-stage1" defer></script>',
            "safe contextual prefill",
        )

    write(path, text, bom)
    return text


def validate(repair: list[str], auto: list[str], general: list[str]) -> list[str]:
    problems: list[str] = []

    def content(name: str) -> str:
        return (ROOT / name).read_text(encoding="utf-8-sig")

    def require(name: str, needle: str) -> None:
        if needle not in content(name):
            problems.append(f"{name}: missing {needle!r}")

    for name, values, seek_label in [
        ("maistori.html", repair, "Търся изпълнител"),
        ("avtomobili.html", auto, "Търся услуга"),
        ("rabota.html", general, "Търся изпълнител"),
    ]:
        text = content(name)
        if text.count(GRID_START) != 1 or text.count(GRID_END) != 1:
            problems.append(f"{name}: contextual grid markers must occur exactly once")
        if text.count('class="contextual-subcategory-item"') != len(values):
            problems.append(f"{name}: expected {len(values)} contextual subcategory items")
        for value in values:
            for url in (listing_url(value), listing_url(value, seek=True)):
                if f'href="{url}"' not in text:
                    problems.append(f"{name}: missing contextual URL for {value}: {url}")
            if value not in text:
                problems.append(f"{name}: missing canonical subcategory {value}")
        if seek_label not in text:
            problems.append(f"{name}: missing seek action label {seek_label}")
        if CSS_REF not in text:
            problems.append(f"{name}: contextual CSS not loaded")

    require("maistori.html", 'href="dobavi-firma.html?category=maistori">Добави фирма</a>')
    require("avtomobili.html", 'href="dobavi-firma.html?category=avtomobili">Добави фирма</a>')
    require("rabota.html", 'href="dobavi-firma.html?category=rabota">Добави фирма</a>')
    require("zavedenia.html", 'href="dobavi-firma.html?category=zavedenia">Добави заведение</a>')
    require("avtomobili.html", f'href="dobavi-obqva.html?category={q("Автомобили и МПС")}">Добави автомобилна обява</a>')

    require("magazini.html", "data-context-shop-add")
    require("magazini.html", SPECIAL_REF)
    require("magazini.html", CSS_REF)
    require("zdrave-i-lekari.html", "Добави лекар или здравна услуга")

    if "Добави събитие" in content("sabitiya.html"):
        problems.append("sabitiya.html: public event add action must not be invented before a real submission owner is proven")

    for name in ("dobavi-obqva.html", "dobavi-firma.html"):
        require(name, PREFILL_REF)

    prefill = (ROOT / "public-context-prefill-v1.js").read_text(encoding="utf-8")
    for needle in [
        'if (params.has("edit")) return;',
        "dictionary.listingCategories.includes(requestedCategory)",
        "dictionary.isValidListingSubcategory(requestedCategory, requestedSubcategory)",
        "dictionary.publicCategories.find",
    ]:
        if needle not in prefill:
            problems.append(f"public-context-prefill-v1.js: missing safety guard {needle!r}")

    if "Боядисване и шпакловка" in content("maistori.html"):
        problems.append("maistori.html: non-canonical taxonomy alias introduced")

    return problems


def main() -> int:
    parser = argparse.ArgumentParser()
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--write", action="store_true")
    group.add_argument("--check", action="store_true")
    args = parser.parse_args()

    try:
        repair, auto, general = service_groups()
    except Exception as error:
        print(f"Contextual recovery taxonomy error: {error}", file=sys.stderr)
        return 2

    if args.write:
        try:
            for name in [
                "maistori.html",
                "avtomobili.html",
                "rabota.html",
                "zavedenia.html",
                "magazini.html",
                "dobavi-obqva.html",
                "dobavi-firma.html",
            ]:
                migrate_page(name, repair, auto, general)
        except Exception as error:
            print(f"Contextual recovery sync FAILED: {error}", file=sys.stderr)
            return 1

    problems = validate(repair, auto, general)
    if problems:
        print("Contextual recovery check FAILED:", file=sys.stderr)
        for problem in problems:
            print(f"- {problem}", file=sys.stderr)
        return 1

    print("Contextual recovery check PASS: canonical service context, safe form prefill, specialized owners and protected exclusions verified.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
