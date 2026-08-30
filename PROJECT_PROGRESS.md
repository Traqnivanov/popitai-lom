# Попитай.Лом — ТЕКУЩ CHECKPOINT

Актуализирано: 31.08.2026

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

Marketplace V3 е каноничният public marketplace presentation source за production. LOCKED backend/roles/ownership/moderation/quota/status правила остават с по-висок приоритет.

**За V6 design track след горния ред задължително се чете `PUBLIC_PRODUCT_V6_MASTER_CONTROL.md`.** Той е единната контролна точка за текущия V6 roadmap, gaps, handoff и exact next task. Supporting V6 документи се четат според задачата.

## 2. ЗАЩИТЕНО ЯДРО — НЕПРОМЕНЕНО

Marketplace V3 и V6 design track не заменят и не променят firm owner, protected listings write/edit/media owner, RLS/schema/ownership/approval/status/quota semantics, Admin/Moderator boundaries, protected construction search / `Иванов Ремонти` priority, boost/admin priority ordering или специализираните Shops/Health/Info owners без отделно изрично approval.

## 3. MARKETPLACE V3

Статус: **PRODUCTION PASS**.

Основната реализация е merge-ната в `main` чрез **PR #106 — Unify public marketplace as Обяви и услуги**, merge commit `57997443b0539596425a5f8e375c56153d079f6d`.

Production visual QA откри един presentation-only дефект: accessibility `.sr-only` labels в marketplace search участваха като видими grid елементи и размествaха търсачката. Поправката е merge-ната чрез **PR #107 — Fix Marketplace V3 search form layout**, final production commit `6155921d6c76caaab3639bac6b2fb62c79d8bd4e`.

След final commit GitHub Pages build/deployment е **SUCCESS**, а `Marketplace V3 contract` на `main` е **SUCCESS**.

Canonical shell е synchronized за 41 public pages. Desktop е:

`Начало | Обяви и услуги | Фирми | Инфо Лом | Статии | Още ▼ | Профил | + Добави`

Mobile canonical markup е точно:

`Начало | Обяви | + | Инфо | Профил`

Няма top-level `Категории`, няма duplicate desktop `Вход`, няма unresolved shell placeholders.

`kategorii.html` е backward-compatible redirect към `obyavi.html`, а не втори marketplace hub. Production проверката потвърди, че query string и hash се запазват при redirect.

Четири public main groups: `Майстори и ремонти`, `Автомобили`, `Други услуги`, `Други обяви`. Точната taxonomy и public↔stored mapping са в `PUBLIC_MARKETPLACE_V3_APPROVED_SPEC.md`.

## 4. IMPLEMENTATION

`marketplace-v3.js` е presentation/orchestration + compatibility mapping; `marketplace-v3.css` е responsive V3 visual layer; `public-shell-v1.js` пази runtime shell/accessibility; `public-shell-template-v1.json` + `.github/scripts/sync_public_shell.py` са canonical shell за 41 public pages; `category-listings-v1.js` е read-only thematic owner; `supabase-listings.js` остава protected write owner.

Landing `obyavi.html` е единният marketplace. `maistori.html`, `avtomobili.html`, `rabota.html` са deep/category views с един основен Add CTA, subcategory navigation, `Всички | Предлагат | Търсят | Фирми`, реални listings/firms и secondary questions.

Add flow: `Предлагам / Търся → главна група → подкатегория → protected details form`. `edit=<id>` има приоритет над create prefill.

## 5. PRODUCTION QA / REGRESSION

Проверено live без създаване на тестови записи и без production form submit:

- `obyavi.html` — единен `Обяви и услуги` landing, точна desktop навигация, search layout след hotfix, четири public groups и реални active listings;
- `maistori.html` — 8 approved repair subcategories, един `Добави обява`, search, `Всички | Предлагат | Търсят | Фирми`, real firm results и коректен empty state за липсващи active listings;
- `avtomobili.html` — `Автомобили за продажба или търсене` + 6 auto-service subcategories, един CTA и същите result filters;
- `rabota.html` — 8 approved general-service subcategories, един CTA и същите result filters;
- `dobavi-obqva.html` — production prefill `intent=seek + main=maistori + subcategory=Боядисване` се зарежда като `Търся → Майстори и ремонти → Боядисване`; не е изпращана форма;
- `kategorii.html` — production redirect към `obyavi.html` със запазени query/hash;
- shell — exact desktop entry и canonical five-item mobile markup са в synchronized 41-page source; responsive CSS/contract guard остава активен.

Protected regression е scope-safe: няма schema/RLS/roles/ownership/moderation/quota/Admin/Moderator промени; presentation owners са write-free; protected listing write/edit/media owner и Ivanov/Admin + boost ordering остават непроменени.

## 6. ЛИМИТИ — НЕПРОМЕНЕНИ

До 5 нови лични и до 5 нови фирмени обяви на одобрена фирма за календарен месец; квотите са отделни; edit не използва нова квота; подадена нова обява използва квота независимо от последващо отхвърляне/изтриване; неизползвана квота не се прехвърля; admin профилите нямат тези лимити.

## 7. ADMIN / MODERATOR

Admin/Moderator Panel V2 остава **ЗАВЪРШЕН / REAL INTERACTION QA PASS** за текущия production scope. Role boundaries, self-moderation protection, Admin-only permanent delete и Admin-only role/access management не са променяни.

V6 нови states/relations по-късно трябва да се приобщят към този role model; това е design requirement, не текуща production промяна.

## 8. MARKETPLACE V3 — ЗАТВОРЕН PRODUCTION ЕТАП

Marketplace V3 не се започва отначало и старите равнопоставени `Категории` / `Обяви` решения не се връщат като production fix. V6 може да предложи нова approved product architecture, но докато няма final V6 approved spec, production остава на V3.

Production commits:
- Marketplace V3: `57997443b0539596425a5f8e375c56153d079f6d`;
- search-layout hotfix: `6155921d6c76caaab3639bac6b2fb62c79d8bd4e`.

## 9. РАБОТЕН РЕЖИМ

Безопасните следващи стъпки се изпълняват автономно. При protected/risky/new business decision се спира преди рискова промяна. Не се казва „готово“, преди съответният stage да е проверен по собствените му критерии; production feature не е „готов“ преди live verification.

## 10. V6 DESIGN TRACK — ТЕКУЩ CHECKPOINT

Branch: `v6-product-foundation-draft`  
Production impact от този planning track: **NONE**.

Създадени planning foundations:
- `PUBLIC_PRODUCT_V6_WORKING_MODEL.md`;
- `PUBLIC_PRODUCT_V6_GUARDRAILS.md`;
- `PUBLIC_PRODUCT_V6_CONTENT_SEO_STRATEGY.md`;
- `PUBLIC_PRODUCT_V6_CONTENT_INVENTORY_RULE.md`;
- `PUBLIC_PRODUCT_V6_INFO_LOM_CORE_STRATEGY.md`;
- `PUBLIC_PRODUCT_V6_ADOPTION_LAUNCH.md`;
- **`PUBLIC_PRODUCT_V6_MASTER_CONTROL.md` — текущият master roadmap/handoff/gap source.**

Вече очертаната V6 посока е: съществуващите protected owner-и се запазват, а над тях се проектират по-добри search/relationship/content/distribution връзки. `Инфо Лом` е един от основните authoritative knowledge/SEO/trust стълбове; Q&A се развива като contextual community memory; Facebook е distribution, не source-of-truth; Content/Articles и SEO не дублират authoritative owner data; performance е lightweight-by-default.

### V6 текуща фаза

`STAGE V6-0 — CONTROL / CONTINUITY`: **DONE**.

### V6 exact next task

`STAGE V6-A1 — CURRENT → TARGET OWNER / RELATIONSHIP MAP`.

Нов чат не започва V6 code и не преотваря случайно старите решения. Чете `PUBLIC_PRODUCT_V6_MASTER_CONTROL.md` и продължава от записания `EXACT NEXT TASK`. При реален production incident се прави отделен fix scope и след това се връща към същия V6 checkpoint.
