# Попитай.Лом — ТЕКУЩ CHECKPOINT

Актуализирано: 30.08.2026

Този файл съдържа само текущото състояние и оставащите acceptance стъпки. Остарели marketplace варианти не са активна задача.

## 1. ЗАДЪЛЖИТЕЛНИ ПРАВИЛА ПРЕДИ ПРОМЯНА

Преди редакция се четат в този ред:
1. `PROJECT_RULES_00_READ_FIRST.md`
2. `PROJECT_RULES_PROTECTED_CORE.md`
3. `PROJECT_RULES_ADMIN_MODERATOR.md`
4. `PROJECT_RULES.md`
5. `PROJECT_RULES_RENDER_OWNERSHIP.md`
6. `PUBLIC_MARKETPLACE_V3_APPROVED_SPEC.md`, когато се работи по marketplace/public navigation
7. `PUBLIC_SITE_INFORMATION_ARCHITECTURE_APPROVED_SPEC.md` за останалата public IA, доколкото не противоречи на Marketplace V3
8. `ADMIN_PANEL_V2_APPROVED_SPEC.md`, когато се работи по Admin/Moderator панела.

Marketplace V3 е по-новият каноничен **presentation** source. LOCKED backend/roles/ownership/moderation/quota/status правила остават с по-висок приоритет.

## 2. ЗАЩИТЕНО ЯДРО — НЕПРОМЕНЕНО

LOCKED:
- Фирми и фирмени профили;
- protected listings write/edit/media flow;
- „Майстори и ремонти“ business semantics;
- Admin/Moderator boundaries и critical admin actions;
- RLS/schema/ownership/approval/direct publish;
- лични/фирмени квоти и status semantics;
- protected construction search priority и `Иванов Ремонти`;
- boost/admin priority ordering.

Marketplace V3 е адаптиран върху тези owners и не ги заменя.

## 3. MARKETPLACE V3 — ТЕКУЩ СТАТУС

Статус: **IMPLEMENTED / PRE-MERGE QA**.

Работен branch: `marketplace-v3-unified-ia`  
PR: **#105 — Unify public marketplace as Обяви и услуги**  
`main` остава непроменен до финалния merge gate.

### Канонична структура

Един top-level marketplace:

`Обяви и услуги`

Desktop:

`Начало | Обяви и услуги | Фирми | Инфо Лом | Статии | Още ▼ | Профил | + Добави`

Mobile:

`Начало | Обяви | + | Инфо | Профил`

`kategorii.html` е backward-compatible redirect, не втори marketplace hub.

### Четири public main groups

1. `Майстори и ремонти`
2. `Автомобили`
3. `Други услуги`
4. `Други обяви`

Точната taxonomy/mapping е в `PUBLIC_MARKETPLACE_V3_APPROVED_SPEC.md`.

### Landing / deep views

- `obyavi.html` е каноничният marketplace landing.
- `maistori.html`, `avtomobili.html`, `rabota.html` са deep/category views.
- Един основен add CTA на deep view.
- Subcategory cards са navigation.
- Filters: `Всички | Предлагат | Търсят | Фирми`.
- Questions са secondary.
- Results използват реалните listings/firms owners.
- старите два contextual CTA под всяка subcategory не са V3 presentation.

### Add flow

Public flow:

`Предлагам / Търся → главна група → подкатегория → protected details form`

Compatibility mapping използва съществуващите stored categories/types; няма mass migration и няма втори write owner.

`edit=<id>` остава с приоритет и create prefill не презаписва loaded listing data.

## 4. MARKETPLACE V3 — IMPLEMENTATION OWNERS

- `marketplace-v3.js` — public orchestration/presentation и compatibility mapping.
- `marketplace-v3.css` — V3 visual/responsive layer.
- `public-shell-v1.js` — runtime shell compatibility + V3 asset loading + existing focus/accessibility behavior.
- `public-shell-template-v1.json` + `.github/scripts/sync_public_shell.py` — canonical static shell за 41 public pages.
- `category-listings-v1.js` — read-only thematic results; approved/active + protected priority ordering.
- `supabase-listings.js` — protected listings owner; не е заменян.
- `public-category-dictionary-v1.js` — stored taxonomy/compatibility source; не се използва като причина за старата public IA.

## 5. QA / REGRESSION GATES

Добавен е `Marketplace V3 contract` CI, който пази:
- един marketplace entry;
- четирите public groups;
- canonical taxonomy/mapping;
- exact mobile labels;
- липса на presentation DB writes;
- approved/active constraints;
- protected Ivanov/Admin + boost priority;
- скриване на old competing contextual CTA;
- липса на schema/policy промени.

Canonical shell generator валидира:
- точно 41 public pages;
- `404.html` и `admin.html` остават excluded;
- един `Обяви и услуги` desktop entry;
- няма competing top-level `Категории`;
- няма unresolved template placeholders;
- exact five-entry mobile navigation;
- deterministic second sync.

Contextual recovery и shell auto-sync workflow-ите вече са сериализирани чрез общ concurrency group, за да не се състезават за branch ref.

Последният contextual push sync след serialization е SUCCESS и е потвърдил `Contextual IA already synchronized`.

## 6. АКТУАЛНИ ЛИМИТИ ЗА ОБЯВИ — НЕПРОМЕНЕНИ

- до 5 нови лични обяви на обикновен потребител за календарен месец;
- до 5 нови фирмени обяви на одобрена фирма за календарен месец;
- личната и фирмената квота са отделни;
- редакция на съществуваща обява не използва нова квота;
- подадена нова обява използва квота дори ако по-късно бъде отхвърлена или изтрита;
- неизползваната квота не се прехвърля;
- администраторските профили нямат тези лимити.

По-старо правило за `1` фирмена обява месечно е остаряло.

## 7. ADMIN / MODERATOR PANEL V2

Статус: **ЗАВЪРШЕН / REAL INTERACTION QA PASS**.

Не се започва отново без конкретен доказан проблем. Moderator self-moderation protection, Admin-only permanent delete и Admin-only role/access management остават backend enforced.

## 8. СПЕЦИАЛИЗИРАНИ OWNERS — НЕПРОМЕНЕНИ

- Shops продължава през специализирания shop owner/add flow.
- Health dataset/renderer и health add flow остават собственици; не се създава medical marketplace.
- Events не получава fake public submission action без реален submission owner.
- Info Lom data/content ownership не се променя от Marketplace V3.
- Public search owner остава Supabase-backed; protected construction/Ivanov priority остава в съществуващия owner.

## 9. ОСТАВАЩИ СТЪПКИ ПРЕДИ `PRODUCTION PASS`

1. изчакване на последния canonical shell auto-sync след премахването на duplicate `Вход`;
2. всички PR CI/check workflows да са SUCCESS върху финалния head;
3. PR #105 да бъде маркиран ready и merge-нат;
4. GitHub Pages production runtime QA с cache-busting на:
   - `obyavi.html`;
   - `maistori.html`;
   - `avtomobili.html`;
   - `rabota.html`;
   - `dobavi-obqva.html`;
   - `kategorii.html` compatibility redirect;
5. проверка на desktop/mobile navigation, search, filters, one-CTA deep views, add-flow mapping, loading/empty/error states и липса на old competing UI;
6. protected regression: auth/edit, listings, firms, quotas/moderation boundaries и Ivanov priority;
7. без fake production records и без изпращане на тестова production форма.

Само след тези стъпки Marketplace V3 може да бъде записан като **PRODUCTION PASS**.

## 10. РАБОТЕН РЕЖИМ

- безопасно и вече решено → изпълнява се без междинно `ОК`;
- следваща независима QA/implementation стъпка → продължава се автономно;
- protected/risky/new business decision → спира се преди рискова промяна;
- след промяна → CI/QA преди merge и production QA след merge;
- не се казва „готово“, ако промяната не е live и проверена.
