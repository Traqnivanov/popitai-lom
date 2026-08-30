# Попитай.Лом — V6 MASTER CONTROL / ROADMAP / HANDOFF

Статус: **КАНОНИЧЕН КОНТРОЛЕН ДОКУМЕНТ ЗА V6 DRAFT / NO PRODUCTION CODE**  
Branch: `v6-product-foundation-draft`  
Актуализирано: 31.08.2026

Този документ е **единната контролна точка** за V6. Той не заменя LOCKED правилата, а казва:

- къде сме;
- какво вече е решено/описано;
- какво още липсва;
- какъв е редът на работа;
- какво е следващото действие;
- как всеки нов чат продължава без да започва отначало;
- как се предотвратяват повторни одити, връщане към стари грешки и паралелни противоречиви решения.

**Всяка V6 работа започва от този документ и завършва с негово актуализиране.**

---

## 1. ТЕКУЩА ИСТИНА

### Production

Production продължава да работи по текущите approved правила и Marketplace V3. V6 все още е **design/research/prototype track**.

Няма разрешение V6 draft идеите автоматично да променят:

- production UI;
- schema/RLS;
- Admin/Moderator роли;
- quotas/status/moderation;
- protected owner-и;
- Ivanov/Admin priority;
- Health/Info verified ownership.

### V6 цел

V6 не е нов сайт и не е giant rewrite.

Целта е съществуващата голяма основа да стане една свързана местна система:

**локална търсачка + marketplace + фирми/обекти + Инфо Лом + статии + Q&A + структурирана памет на Лом + distribution/SEO layer.**

Работен growth модел:

`Google / Facebook / direct → Попитай search → verified Info / entity / listing / article / canonical Q&A → ако липсва отговор, Попитай → moderation → share → нови хора → знанието остава → по-силен search/SEO/direct habit.`

---

## 2. ЗАДЪЛЖИТЕЛЕН РЕД НА ЧЕТЕНЕ В НОВ ЧАТ

Нов чат **не започва от памет, стар handoff или случайна задача**.

Минималният ред е:

1. `PROJECT_RULES_00_READ_FIRST.md`
2. `PROJECT_RULES_PROTECTED_CORE.md`
3. `PROJECT_RULES_ADMIN_MODERATOR.md`
4. `PROJECT_RULES.md`
5. `PROJECT_RULES_RENDER_OWNERSHIP.md`
6. `PROJECT_PROGRESS.md`
7. **`PUBLIC_PRODUCT_V6_MASTER_CONTROL.md` — този документ**
8. само след това supporting V6 spec-овете, които са нужни за конкретната текуща задача.

Ако има конфликт:

**LOCKED rules > approved production specs > V6 master control > V6 supporting draft documents > prototype/ideas/chat notes.**

---

## 3. V6 DOCUMENT REGISTRY — КАКВО ВЕЧЕ ИМАМЕ

### A. `PUBLIC_PRODUCT_V6_WORKING_MODEL.md`

Роля: големият продуктов модел.

Вече съдържа:
- крайна визия;
- V6 като надграждане, не рестарт;
- taxonomy vs shortcuts;
- `Попитай` като действие;
- canonical/duplicate philosophy;
- relationship layer;
- Facebook Bridge;
- structured recommendations;
- search V6;
- local ranking;
- SEO/freshness;
- външни доказани модели;
- high-level път до код.

Статус: **силна продуктова основа, но не implementation spec**.

### B. `PUBLIC_PRODUCT_V6_GUARDRAILS.md`

Роля: ограниченията, които новите идеи не могат да заобикалят.

Вече съдържа:
- Admin/Moderator integration rule;
- permission/RLS consistency;
- performance hard gate;
- lightweight-by-default;
- `SUPER IDEA` exception;
- duplicate/recommendation/Facebook/freshness safety;
- без тежки frameworks/SDKs по подразбиране.

Статус: **задължителен design gate**.

### C. `PUBLIC_PRODUCT_V6_CONTENT_SEO_STRATEGY.md`

Роля: статии, guides, SEO, internal linking и content acquisition.

Вече съдържа:
- evergreen guides;
- local utility content;
- top/comparison ограничения;
- Q&A като content engine;
- seasonal content;
- article → authoritative owner rule;
- SEO architecture;
- content quality gate;
- adoption loop.

Статус: **стратегия, не content inventory**.

### D. `PUBLIC_PRODUCT_V6_CONTENT_INVENTORY_RULE.md`

Роля: как се определя дали дадено съдържание реално е готово.

Статуси:
- `ТРЯБВА ДА ИМА`;
- `РАЗРАБОТВАНО`;
- `ИМА ОСНОВА В INFO/OWNER`;
- `ИМА ФАЙЛ / НЕПРОВЕРЕНО`;
- `ПРОВЕРЕНО ГОТОВО`;
- `ЗА ПРЕРАБОТКА`;
- `НЕ Е НУЖНО`.

Статус: **готово правило; реалният inventory още липсва**.

### E. `PUBLIC_PRODUCT_V6_INFO_LOM_CORE_STRATEGY.md`

Роля: `Инфо Лом` като authoritative local knowledge core.

Вече съдържа:
- positioning;
- роля спрямо Articles/Q&A/entities/listings;
- SEO demand coverage;
- Info → Articles;
- Info → Q&A;
- first-class search source;
- share strategy;
- web growth loop;
- topic clusters;
- freshness/trust;
- Admin/Moderator/owner boundaries;
- performance;
- analytics/content-gap loop.

Статус: **основен V6 стълб**.

### F. `PUBLIC_PRODUCT_V6_ADOPTION_LAUNCH.md`

Роля: как потребителят постепенно да започва първо от Попитай.Лом, а не директно от Facebook.

Вече съдържа:
- habit-change problem;
- `Публикувай при нас → сподели във Facebook`;
- value proposition за фирми и потребители;
- pre-launch supply logic;
- positioning `Лом на едно място`;
- channels;
- trust;
- adoption loop;
- launch metrics.

Статус: **стратегическа основа; launch execution calendar не е нужен още**.

### G. Existing approved/production specs

Те остават източник на текущата реалност, докато V6 не бъде approved и не ги supersede-не изрично:

- `PUBLIC_MARKETPLACE_V3_APPROVED_SPEC.md`;
- `PUBLIC_SITE_INFORMATION_ARCHITECTURE_APPROVED_SPEC.md`;
- `ADMIN_PANEL_V2_APPROVED_SPEC.md`;
- `PROJECT_PROGRESS.md`;
- LOCKED rules.

---

## 4. GAP AUDIT — КАКВО ОЩЕ НЯМАМЕ И Е ЗАДЪЛЖИТЕЛНО ПРЕДИ КОД

Това са реалните липси. Докато не бъдат затворени, **не започваме V6 production implementation**.

### GAP 1 — CURRENT → TARGET OWNER / RELATIONSHIP MATRIX

Липсва пълна доказана карта на текущата система.

Трябва да се опишат минимум:
- global shell/navigation;
- marketplace/listings;
- firms/business profiles;
- masters/construction;
- cars;
- jobs;
- property semantics;
- health;
- shops;
- restaurants;
- events;
- Info Lom subowners;
- articles;
- questions/answers;
- public search;
- profile/user content;
- Admin/Moderator;
- analytics;
- SEO/static rendering;
- sharing/PWA/service worker, ако съществуват.

За всеки owner:
- текущ URL/entry;
- read owner;
- write owner;
- schema/data source;
- moderation;
- protected boundaries;
- current search integration;
- current Admin integration;
- V6 target role;
- `KEEP / ADAPT / REPLACE PRESENTATION / NEW RELATION / DEFER`;
- backend impact: `NONE / READ / NEW RELATION / SCHEMA-RLS`;
- доказателство от код/rules.

**Това е следващата основна работа.**

### GAP 2 — FINAL INFORMATION ARCHITECTURE / TAXONOMY CONTRACT

Имаме работна taxonomy, но не е заключена.

Трябва да се решат:
- всички main categories;
- subcategories;
- кое е category и кое shortcut;
- `Открий в Лом`;
- точната роля на `Фирми` спрямо marketplace;
- Работа/Имоти/Автомобили/Красота/Дом и градина;
- Shops/Restaurants/Events;
- Health специализираният owner;
- backward URLs/SEO canonical mapping.

Резултатът трябва да е **един договор**, не списък от чат решения.

### GAP 3 — SEARCH V6 CONTRACT

Имаме концепция, но нямаме точен algorithm/UX contract.

Трябва да се опише:
- query normalization;
- synonym/local dictionary;
- factual vs entity vs transactional vs community vs how-to intent;
- Info Lom priority;
- category/entity/listing/question/article result types;
- duplicate/canonical matching;
- Lom/local ranking;
- protected Admin/Ivanov/boost ordering;
- fallback/empty states;
- DB query budget;
- mobile autocomplete;
- accessibility;
- analytics events.

### GAP 4 — Q&A CANONICAL / DUPLICATE / MEMORY DATA MODEL

Философията е ясна; точният model липсва.

Трябва да се реши:
- canonical question identity;
- aliases/signposts;
- duplicate vs related;
- moderator/admin decision flow;
- reversible history;
- search indexing;
- SEO canonical/noindex rules;
- how similar questions are suggested before submit;
- protected moderation state;
- unanswered/stale handling.

Никаква schema промяна преди този договор.

### GAP 5 — STRUCTURED RECOMMENDATION RELATION MODEL

Идеята е силна, но е cross-owner backend промяна.

Трябва да се проектира:
- question → answer → recommended entity;
- разрешени target owners/types;
- relational integrity;
- approved/rejected/hidden states;
- duplicate recommendation behavior;
- derived counts;
- provenance;
- self-promotion/abuse/moderation rules;
- Admin/Moderator actions;
- RLS/indexes/performance;
- rollback.

### GAP 6 — FACEBOOK BRIDGE TECHNICAL CONTRACT

Имаме продуктова стратегия, но не точен технически flow.

Трябва да се опише:
- approved-only share timing;
- pending → approved notification/return flow;
- Web Share vs Facebook URL vs copy fallback;
- prepared text;
- dynamic Open Graph preview endpoint;
- inbound paste-own-Facebook-post flow;
- provenance;
- what is explicitly unsupported;
- tracking without private Facebook data;
- performance/no SDK default.

### GAP 7 — INFO LOM CURRENT COVERAGE / SEO MAP

Имаме стратегия, но не знаем системно кое е:
- готово;
- частично;
- непроверено;
- липсващо;
- дублирано;
- stale;
- потенциален high-value Google entry;
- потенциален shareable utility page.

Трябва да има Info Lom inventory по owner/topic + target search intents + source/freshness status.

### GAP 8 — ARTICLE / GUIDE INVENTORY + CONTENT MAP

Имаме правило и стратегия, но не реалния списък.

Трябва да се извадят:
- всички съществуващи article файлове;
- разработвани теми от Info/старо съдържание;
- high-intent evergreen guides;
- local utility pages;
- seasonal content;
- topic clusters;
- source owner;
- target query/intention;
- status по inventory rule;
- duplicate/cannibalization risk.

### GAP 9 — FIRST-PARTY ANALYTICS / EVIDENCE BASELINE

Имаме външни/local signals, но V6 още няма канонично записан baseline от собствената analytics система.

Трябва да се провери read-only:
- най-посещавани pages;
- mobile/desktop;
- entry pages;
- search usage/queries, ако се пазят;
- category engagement;
- Info Lom usage;
- conversion/add flows;
- source/referrer;
- zero-result/unanswered сигнали, ако са налични.

Резултатът не трябва да диктува архитектурата сам, но трябва да валидира shortcuts/content priorities.

### GAP 10 — REAL V6 VISUAL PROTOTYPE / FLOW PROTOTYPE

Има V5 standalone prototype, но той не е финален V6 contract.

Трябва да се визуализират минимум:
- desktop landing;
- mobile landing;
- all categories;
- search/autocomplete/results;
- Info Lom result/entry;
- article → Info → Q&A linking;
- `Не намери? Попитай Лом`;
- ask composer;
- duplicate suggestion;
- canonical question page;
- recommendation-to-entity example;
- pending/approved state;
- Facebook share state;
- Shops/Restaurants/Discover;
- Construction;
- Health;
- Jobs;
- Cars;
- Property;
- empty/loading/error states;
- Admin moderation concept for new V6 states.

Прототипът трябва да бъде проверен реално на desktop и mobile viewport, не само по markup.

### GAP 11 — TECHNICAL DESIGN / MIGRATION / PERFORMANCE BUDGET

Преди implementation трябва да има exact plan:
- schema/relations only where needed;
- indexes;
- RLS/RPC;
- Admin integration;
- migrations;
- rollback;
- backwards compatibility;
- query budgets;
- JS/CSS/asset budget;
- edge/share rendering;
- caching;
- SEO rendering;
- error/fallback behavior.

### GAP 12 — FINAL CANONICAL V6 APPROVED SPEC

Най-важният финален gate.

След като горните части са проверени, се създава **един финален V6 approved spec**, който:
- казва кое старо production решение остава;
- кое се supersede-ва;
- кое е LOCKED;
- exact IA/search/data/moderation/share/content contracts;
- rollout order;
- QA/rollback.

Докато този документ не е одобрен, старите approved production specs остават действащи.

---

## 5. MASTER EXECUTION ORDER

Работата не се води „по каквото се сетим“.

### STAGE V6-0 — CONTROL / CONTINUITY

**Статус: ЗАВЪРШЕН С ТОЗИ ДОКУМЕНТ.**

Резултат:
- един master control;
- един read order;
- един gap list;
- един exact next task;
- една handoff процедура.

### STAGE V6-A — CURRENT SYSTEM INVENTORY

Задача:
- owner map;
- current→target matrix;
- code/rules evidence;
- current content/search/Info/Article inventory skeleton;
- analytics baseline.

Exit gate:
**не остава основен public/backend owner, който „не знаем кой го държи“.**

### STAGE V6-B — PRODUCT CONTRACTS

След inventory се заключват:
- final taxonomy/IA;
- search contract;
- Info Lom role/SEO map;
- content/article architecture;
- Q&A canonical/duplicate;
- relationship/recommendations;
- Facebook Bridge;
- local ranking/freshness.

Exit gate:
**всеки важен user flow има ясен owner, state и moderation/permission behavior.**

### STAGE V6-C — VISUAL / INTERACTION PROTOTYPE

Всички ключови desktop/mobile states се визуализират и проверяват.

Exit gate:
- няма скрити navigation/UX contradictions;
- mobile е реално проверен;
- visual language е единен;
- Info/Articles/Q&A/Marketplace изглеждат като една система.

### STAGE V6-D — TECHNICAL DESIGN

Exact schema/relations/RLS/indexes/migrations/rollback/performance/SEO rendering.

Exit gate:
**можем да кажем точно кои файлове/tables/policies се пипат и защо.**

### STAGE V6-E — FINAL APPROVAL SPEC

Създава се един каноничен V6 approved spec.

Exit gate:
**няма спор коя идея от кой чат е последна.**

### STAGE V6-F — INCREMENTAL IMPLEMENTATION

Само след approval.

Не giant rewrite. Всеки implementation slice има:
- scope;
- tests/CI;
- protected regression;
- desktop/mobile QA;
- production verification;
- rollback.

---

## 6. CURRENT STATUS LEDGER

### Завършено като V6 planning foundation

- [x] high-level product model;
- [x] Admin/Moderator/performance guardrails;
- [x] Facebook/adoption positioning;
- [x] Content/SEO strategy;
- [x] Content readiness rule;
- [x] Info Lom core/SEO/growth strategy;
- [x] external product pattern research captured conceptually;
- [x] master continuity/control system.

### Не е завършено

- [ ] CURRENT → TARGET owner matrix;
- [ ] first-party analytics baseline;
- [ ] Info Lom coverage inventory;
- [ ] Article/content inventory;
- [ ] final taxonomy;
- [ ] exact Search V6 contract;
- [ ] exact Q&A canonical data/moderation model;
- [ ] structured recommendation data model;
- [ ] Facebook Bridge technical contract;
- [ ] final local ranking contract;
- [ ] V6 visual prototype;
- [ ] real mobile prototype QA;
- [ ] exact technical migration/performance design;
- [ ] final V6 approved spec;
- [ ] production code.

---

## 7. EXACT NEXT TASK

Следващият чат **НЕ измисля нова feature посока и НЕ започва код**.

Следващата задача е:

# `STAGE V6-A1 — CURRENT → TARGET OWNER / RELATIONSHIP MAP`

Първи пакет за проверка:

1. global shell/navigation;
2. public search;
3. `Инфо Лом` + subowners;
4. Articles;
5. Questions/Answers;
6. Firms;
7. Listings/Marketplace;
8. Health;
9. Shops;
10. Restaurants;
11. Events;
12. Jobs/Cars/Property/Masters;
13. Admin/Moderator integration;
14. profile/user-content surfaces;
15. SEO/share/static rendering;
16. service worker/PWA/manifest if present;
17. Analytics inputs relevant to V6.

За всяко: `CURRENT → TARGET → OWNER → PROTECTED? → DATA → MODERATION → SEARCH → SEO → ADMIN → PERFORMANCE → ACTION`.

След завършване master control се актуализира и `EXACT NEXT TASK` се премества към V6-A2.

---

## 8. NEW CHAT PROTOCOL — БЕЗ ПОВТОРЕНИЕ НА СТАРИТЕ ГРЕШКИ

### В началото на всеки нов чат

Асистентът трябва:

1. да прочете правилата в canonical order;
2. да прочете `PROJECT_PROGRESS.md`;
3. да прочете този Master Control;
4. да провери branch/текущите файлове, ако задачата зависи от code state;
5. да изпълни само `EXACT NEXT TASK`, освен ако потребителят изрично промени приоритета.

Не пита:
- „Какво правехме?“;
- „От къде да започна?“;
- „Коя версия е последна?“
ако това е записано тук.

### В края на всеки работен чат

Преди приключване се актуализира минимум:

- `CURRENT STATUS LEDGER`;
- `EXACT NEXT TASK`;
- нови решения;
- открити рискове;
- създадени/променени V6 documents;
- какво е проверено и какво е само предположение;
- production untouched/changed status.

Ако това не е актуализирано, чатът **не се счита за чист handoff**.

---

## 9. DECISION DISCIPLINE

### LOCKED / approved решения

Не се отварят повторно само защото нов чат предпочита друго решение.

Промяна само ако:
- има доказан проблем;
- нова силна evidence-based идея;
- protected/business decision е изрично одобрено.

### Working V6 решения

Маркират се като `WORKING`, докато не минат inventory + prototype + technical impact + approval.

### Rejected / replaced идеи

Не се изтриват безследно. При важна архитектурна промяна се записва:
- какво отпада;
- защо;
- какво го заменя.

Това предотвратява следващ чат да „преоткрие“ старо отхвърлено решение.

---

## 10. INTERRUPTION RULE — PRODUCTION BUG НЕ НУЛИРА V6 ПЛАНА

Ако по време на V6 се появи реален production проблем:

1. проблемът се третира като отделен incident/fix scope;
2. не се използва като повод да се преработва V6 отначало;
3. след fix се връщаме към записания `EXACT NEXT TASK`;
4. само ако bug-ът доказва грешна V6 предпоставка, master control се коригира.

Така следващите чатове няма да прекарват времето си в безкрайно поправяне и преотваряне на вече затворени етапи.

---

## 11. NO SIDE-MISSION RULE

Ако по време на работа се открие добра нова идея:

- записва се в правилния V6 документ или в GAP/decision section;
- оценява се спрямо value/performance/protected impact;
- **не прекъсва текущия stage**, освен ако е blocker или критична архитектурна зависимост.

По този начин идеите не се губят, но и проектът не се разпада на 20 паралелни посоки.

---

## 12. DEFINITION OF DONE

### Planning document

Не е „готов“, ако просто има текст. Готов е когато:
- няма ключова неизвестна за scope-а;
- е съгласуван с rules/owners;
- противоречията са разрешени;
- next dependency е ясна.

### Feature / flow

Не е „готов“, ако има prototype или файл. Готов е когато:
- product contract е approved;
- permissions/moderation са ясни;
- desktop/mobile UX е проверен;
- performance impact е приемлив;
- backend/SEO/fallback са проектирани;
- implementation е live и production-verified, ако сме стигнали до code stage.

### Content

Следва `PUBLIC_PRODUCT_V6_CONTENT_INVENTORY_RULE.md`; `има файл` ≠ `проверено готово`.

---

## 13. КРАЙНАТА СИСТЕМА, КЪМ КОЯТО ВЪРВИМ

Когато V6 е завършен, потребителят не трябва да мисли за owner-и, таблици и architecture.

Той трябва просто да усеща:

**„Ако е за Лом — първо проверявам в Попитай.Лом.“**

Търси → намира проверена информация, местен обект, услуга, обява, статия или вече отговорен въпрос → ако няма отговор, пита → може да сподели → отговорът остава → следващият човек намира по-бързо.

Вътрешно системата остава дисциплинирана:

- authoritative facts си остават при правилния owner;
- community opinion е отделено от verified fact;
- Admin/Moderator границите са запазени;
- performance е lightweight-by-default;
- SEO/content не дублират authoritative data;
- Facebook е distribution, не source-of-truth;
- V6 се внедрява incrementally, не като giant rewrite.

---

## 14. HANDOFF LINE

**Текущ checkpoint:** V6 planning foundation + continuity system са оформени.  
**Production:** непроменен от този V6 planning track.  
**Следва:** `STAGE V6-A1 — CURRENT → TARGET OWNER / RELATIONSHIP MAP`.  
**Забранено следващо действие:** директен V6 production code преди inventory/contracts/prototype/technical design/final approval.
