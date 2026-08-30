# Попитай.Лом — ТЕКУЩ CHECKPOINT

Актуализирано: 30.08.2026

## 1. ПРАВИЛА ПРЕДИ РАБОТА

Ред на четене:
1. `PROJECT_RULES_00_READ_FIRST.md`
2. `PROJECT_RULES_PROTECTED_CORE.md`
3. `PROJECT_RULES_ADMIN_MODERATOR.md`
4. `PROJECT_RULES.md`
5. `PROJECT_RULES_RENDER_OWNERSHIP.md`
6. `PUBLIC_MARKETPLACE_V3_APPROVED_SPEC.md` за marketplace/public navigation
7. `PUBLIC_SITE_INFORMATION_ARCHITECTURE_APPROVED_SPEC.md` за останалата public IA, доколкото не противоречи на Marketplace V3
8. `ADMIN_PANEL_V2_APPROVED_SPEC.md` за Admin/Moderator панела.

Marketplace V3 е каноничният public marketplace presentation source. LOCKED backend/roles/ownership/moderation/quota/status правила остават с по-висок приоритет.

## 2. ЗАЩИТЕНО ЯДРО — НЕПРОМЕНЕНО

Marketplace V3 не заменя и не променя:
- фирмени профили и firm owner;
- protected listings write/edit/media owner;
- RLS/schema/ownership/approval/status/quota semantics;
- Admin/Moderator boundaries;
- protected construction search / `Иванов Ремонти` priority;
- boost/admin priority ordering;
- специализираните Shops/Health owners.

## 3. MARKETPLACE V3

Статус: **PRE-MERGE GATE PASS / PRODUCTION QA PENDING**.

Branch: `marketplace-v3-unified-ia`  
PR: **#105 — Unify public marketplace as Обяви и услуги**.

Последният implementation/shell QA head е `bc8fe600e412a479de7b5e5853aeda948cecabe9`. На него са SUCCESS едновременно:
- `Marketplace V3 contract`;
- `Public shell sync`;
- `Public contextual IA recovery`.

След този QA gate са правени само checkpoint документационни актуализации; implementation файловете от зеления head не са променяни.

Canonical shell е synchronized за 41 public pages и exact-header guard пази:
- един desktop вход `Обяви и услуги`;
- без top-level `Категории`;
- без duplicate desktop `Вход`;
- без unresolved placeholders;
- mobile точно `Начало | Обяви | + | Инфо | Профил`.

Desktop target: `Начало | Обяви и услуги | Фирми | Инфо Лом | Статии | Още ▼ | Профил | + Добави`.

`kategorii.html` е backward-compatible redirect към `obyavi.html`, а не втори marketplace hub.

Четири public main groups:
1. `Майстори и ремонти`
2. `Автомобили`
3. `Други услуги`
4. `Други обяви`

Точната taxonomy и public↔stored mapping са в `PUBLIC_MARKETPLACE_V3_APPROVED_SPEC.md`.

## 4. IMPLEMENTATION

- `marketplace-v3.js` — presentation/orchestration + compatibility mapping.
- `marketplace-v3.css` — responsive V3 visual layer.
- `public-shell-v1.js` — runtime shell compatibility, V3 assets и accessibility behavior.
- `public-shell-template-v1.json` + `.github/scripts/sync_public_shell.py` — canonical shell за 41 public pages.
- `category-listings-v1.js` — read-only thematic results; approved/active + protected priority.
- `supabase-listings.js` — protected write owner; не е заменян.

Landing `obyavi.html` е единният marketplace. `maistori.html`, `avtomobili.html`, `rabota.html` са deep/category views с един основен Add CTA, subcategory navigation, `Всички | Предлагат | Търсят | Фирми`, реални listings/firms и secondary questions.

Add flow: `Предлагам / Търся → главна група → подкатегория → protected details form`. `edit=<id>` има приоритет над create prefill.

## 5. QA / REGRESSION

Marketplace contract пази unified entry, taxonomy/mapping, write-free presentation, approved/active filters и protected Ivanov/Admin + boost ordering.

Shell generator пази exact 41-page canonical nav и deterministic sync. Contextual и shell auto-sync са serialized чрез общ concurrency group; последният contextual sync е SUCCESS и synchronized.

## 6. ЛИМИТИ — НЕПРОМЕНЕНИ

- до 5 нови лични обяви за календарен месец;
- до 5 нови фирмени обяви на одобрена фирма за календарен месец;
- квотите са отделни;
- edit не използва нова квота;
- подадена нова обява използва квота независимо от последващо отхвърляне/изтриване;
- неизползвана квота не се прехвърля;
- admin профилите нямат тези лимити.

## 7. ADMIN / MODERATOR

Admin/Moderator Panel V2 остава **ЗАВЪРШЕН / REAL INTERACTION QA PASS**. Role boundaries, self-moderation protection, Admin-only permanent delete и Admin-only role/access management не са променяни.

## 8. ОСТАВА ДО PRODUCTION PASS

1. PR #105 ready + merge;
2. GitHub Pages deployment;
3. production runtime QA на `obyavi.html`, `maistori.html`, `avtomobili.html`, `rabota.html`, `dobavi-obqva.html`, `kategorii.html` redirect;
4. desktop/mobile nav, search, filters, one-CTA views, add mapping и load/empty/error states;
5. protected regression: auth/edit, listings, firms, quotas/moderation и Ivanov priority;
6. без fake production records и без production form submit.

Само след тези стъпки статусът става **PRODUCTION PASS**.

## 9. РАБОТЕН РЕЖИМ

Безопасните следващи стъпки се изпълняват автономно. При protected/risky/new business decision се спира преди рискова промяна. Не се казва „готово“, преди да е live и проверено.
