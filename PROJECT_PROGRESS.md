# Попитай.Лом — ТЕКУЩ CHECKPOINT

Актуализирано: 31.08.2026

## 1. ПРАВИЛА ПРЕДИ РАБОТА

Ред на четене:
1. `PROJECT_RULES_00_READ_FIRST.md`
2. `PROJECT_RULES_PROTECTED_CORE.md`
3. `PROJECT_RULES_ADMIN_MODERATOR.md`
4. `PROJECT_RULES.md`
5. `PROJECT_RULES_RENDER_OWNERSHIP.md`
6. `PUBLIC_MARKETPLACE_V3_APPROVED_SPEC.md` за текущия production marketplace/public navigation
7. `PUBLIC_SITE_INFORMATION_ARCHITECTURE_APPROVED_SPEC.md` за останалата current public IA, доколкото не противоречи на Marketplace V3
8. `ADMIN_PANEL_V2_APPROVED_SPEC.md` за Admin/Moderator панела
9. за V6: **`PUBLIC_PRODUCT_V6_MASTER_CONTROL.md`**.

`PUBLIC_PRODUCT_V6_MASTER_CONTROL.md` е каноничният roadmap/handoff/exact-task source за V6. Supporting V6 документи се четат според текущия exact task.

При конфликт LOCKED правилата и approved production правилата имат по-висок приоритет от V6 draft.

---

## 2. PRODUCTION — НЕПРОМЕНЕН ОТ V6 TRACK

Marketplace V3 остава текущият approved production model.

Production commits за затворения V3 етап:
- `57997443b0539596425a5f8e375c56153d079f6d` — unified marketplace V3;
- `6155921d6c76caaab3639bac6b2fb62c79d8bd4e` — search-layout hotfix.

Canonical production navigation:

Desktop:
`Начало | Обяви и услуги | Фирми | Инфо Лом | Статии | Още ▼ | Профил | + Добави`

Mobile:
`Начало | Обяви | + | Инфо | Профил`

`kategorii.html` е backward-compatible redirect към `obyavi.html`, не втори marketplace hub.

V6 planning work до този checkpoint не е променял production UI/schema/RLS/roles/quotas/moderation/protected owners/URLs.

---

## 3. ЗАЩИТЕНО ЯДРО — НЕПРОМЕНЕНО

V6 не bypass-ва:
- Firms owner;
- Listings write/edit/media owner;
- Masters/Construction protected rules;
- Shops specialized owner;
- Health/Info specialized owners;
- Admin/Moderator boundaries;
- quotas/status/approval/direct-publish rules;
- protected Admin/Ivanov/boost priority;
- RLS/schema/security rules.

V6 target е orchestration/search/relationship/presentation layer върху правилните owners, не monolithic replacement.

---

## 4. ЛИМИТИ — НЕПРОМЕНЕНИ

До 5 нови лични и до 5 нови фирмени обяви на одобрена фирма за календарен месец; квотите са отделни; edit не използва нова квота; подадена нова обява използва квота независимо от последващо отхвърляне/изтриване; неизползвана квота не се прехвърля; Admin профилите нямат тези лимити.

---

## 5. ADMIN / MODERATOR — CURRENT APPROVED MODEL

Admin/Moderator Panel V2 остава current approved operational model.

LOCKED:
- Moderator не е почти Admin;
- permanent delete е Admin-only;
- role/access management е Admin-only;
- Moderator не self-moderate-ва собствено съдържание;
- Moderator own content следва normal non-Admin flow;
- V6 нови states по-късно се интегрират в съществуващия Admin panel/role model.

A2 намери отделен protected defect candidate при Moderator own-business edit; той е записан в Master Control/A2 и **не се поправя като странична IA промяна**.

---

## 6. V6 DESIGN TRACK

Branch: `v6-product-foundation-draft`  
Production impact: **NONE**.

Основни V6 planning документи:
- `PUBLIC_PRODUCT_V6_WORKING_MODEL.md`;
- `PUBLIC_PRODUCT_V6_GUARDRAILS.md`;
- `PUBLIC_PRODUCT_V6_CONTENT_SEO_STRATEGY.md`;
- `PUBLIC_PRODUCT_V6_CONTENT_INVENTORY_RULE.md`;
- `PUBLIC_PRODUCT_V6_INFO_LOM_CORE_STRATEGY.md`;
- `PUBLIC_PRODUCT_V6_ADOPTION_LAUNCH.md`;
- `PUBLIC_PRODUCT_V6_INTERACTION_FORM_LINK_CONTRACT.md`;
- `PUBLIC_PRODUCT_V6_CURRENT_TARGET_OWNER_MAP.md`;
- `PUBLIC_PRODUCT_V6_A2_EVIDENCE_BASELINE.md`;
- **`PUBLIC_PRODUCT_V6_MASTER_CONTROL.md`**.

---

## 7. V6 STAGE STATUS

### `V6-0 — CONTROL / CONTINUITY`
**DONE.**

### `V6-A1 — CURRENT → TARGET OWNER / RELATIONSHIP MAP`
**DONE.**

Artifact:
`PUBLIC_PRODUCT_V6_CURRENT_TARGET_OWNER_MAP.md`

### `V6-A2 — EVIDENCE / COVERAGE / RUNTIME BASELINE`
**DONE.**

Artifact:
`PUBLIC_PRODUCT_V6_A2_EVIDENCE_BASELINE.md`

Key proven A2 facts:
- current `tarsene.html` uses legacy `script.js` search owner, not `public-search-v1.js`;
- current Info DB has 152 published `info_entries`, all with `confirmed_at`;
- Info public source-of-truth is inconsistent: Health mostly DB-driven; Institutions layered; Banks/Education/Transport hardcode mutable local facts; Utilities is hybrid;
- freshness needs data-type recheck rules;
- current article `Как да избереш майстор...` exists but is `ЗА ПРЕРАБОТКА` under V6 readiness rules;
- `Как се пенсионира човек` is `РАЗРАБОТВАНО` with NОИ/Info authoritative backbone;
- Question/Listing/Firm detail pages begin with generic static metadata;
- question detail has visible share CTA but no proven active share handler in the audited owner;
- no current PWA/manifest/service-worker/share-target implementation was proven;
- no reliable Popitai-specific first-party analytics baseline was proven;
- Q&A Moderator self-content restrictions are consistent in audited DB/UI;
- Moderator own-business edit is inconsistent with the LOCKED rule and is a separate protected defect candidate.

### `V6-B — PRODUCT CONTRACTS`
**CURRENT STAGE.**

---

## 8. EXACT NEXT TASK

# `STAGE V6-B1 — FINAL IA / TAXONOMY / OWNER CONTRACT`

Нов чат продължава директно оттук. Не започва нов одит и не пита потребителя да обяснява проекта.

B1 трябва да заключи в един договор:
- desktop/mobile public IA;
- final main marketplace categories;
- subcategory ownership;
- stable taxonomy vs first-screen shortcuts;
- `Открий в Лом` като discovery layer, не втори taxonomy;
- `Работа` vs `Услуги`;
- `Строителство и ремонти` presentation при запазен protected Masters owner;
- Автомобили;
- Имоти;
- Красота;
- Дом и градина;
- Магазини specialized owner integration;
- Заведения/Firms integration;
- Събития;
- Health specialized owner integration;
- точната роля на `Фирми`;
- точната роля на `Инфо Лом`;
- точната роля на `Статии`;
- Q&A като contextual action/content memory, с `Още → Въпроси` като secondary archive/entry;
- backward URLs/canonical mapping;
- exact Add destination по owner;
- key `Намери / Добави / Попитай` destinations;
- `KEEP / ADAPT / REPLACE PRESENTATION / DEFER`;
- performance consequences;
- без ethnic segmentation.

Required artifact:

`PUBLIC_PRODUCT_V6_B1_FINAL_IA_TAXONOMY_CONTRACT.md`

B1 exit gate:

**всеки major public entry има едно ясно потребителско значение, един authoritative owner/composition rule, един target Add path и няма category/owner ambiguity.**

След B1 Master Control и този checkpoint се актуализират и се задава точният следващ B-stage.

---

## 9. РАБОТЕН РЕЖИМ / NEW CHAT HANDOFF

Нов чат:
- чете rules → `PROJECT_PROGRESS.md` → `PUBLIC_PRODUCT_V6_MASTER_CONTROL.md`;
- после чете A1/A2 само където са нужни за B1;
- продължава по exact next task автономно;
- не иска от потребителя повторно описание на проекта;
- не преотваря V3/A1/A2 без доказана причина;
- не започва V6 production code;
- при нова добра идея я записва, но не разбива текущия stage;
- при protected/risky production change спира преди промяната, ако липсва подходящо approval.

В края на stage задължително:
- update Master Control;
- update `PROJECT_PROGRESS.md`;
- status + evidence + risks;
- exact next task;
- production impact.

---

## 10. CURRENT HANDOFF

**Completed:** V6-0, V6-A1, V6-A2.  
**Current:** V6-B1.  
**Next artifact:** `PUBLIC_PRODUCT_V6_B1_FINAL_IA_TAXONOMY_CONTRACT.md`.  
**Production:** unchanged by V6 planning.  
**Do not do next:** production implementation before B/C/D/E approval gates.
