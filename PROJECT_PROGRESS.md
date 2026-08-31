# Попитай.Лом — ТЕКУЩ CHECKPOINT

Актуализирано: 31.08.2026

## 1. ПРАВИЛА ПРЕДИ РАБОТА

Ред на четене:
1. `PROJECT_RULES_00_READ_FIRST.md`
2. `PROJECT_RULES_PROTECTED_CORE.md`
3. `PROJECT_RULES_ADMIN_MODERATOR.md`
4. `PROJECT_RULES.md`
5. `PROJECT_RULES_RENDER_OWNERSHIP.md`
6. `PUBLIC_MARKETPLACE_V3_APPROVED_SPEC.md`
7. `PUBLIC_SITE_INFORMATION_ARCHITECTURE_APPROVED_SPEC.md`
8. `ADMIN_PANEL_V2_APPROVED_SPEC.md`
9. `PUBLIC_PRODUCT_V6_MASTER_CONTROL.md`

При конфликт: **LOCKED rules > approved production specs > V6 Master Control > completed V6 contracts > supporting drafts.**

---

## 2. PRODUCTION — НЕПРОМЕНЕН ОТ V6 TRACK

Marketplace V3 остава current approved production model.

Canonical production navigation:

Desktop:
`Начало | Обяви и услуги | Фирми | Инфо Лом | Статии | Още ▼ | Профил | + Добави`

Mobile:
`Начало | Обяви | + | Инфо | Профил`

`kategorii.html` остава compatibility вход към `obyavi.html`, не втори marketplace.

V6 planning до този checkpoint **НЕ е променял production UI, schema/RLS, roles, quotas, moderation, protected owners/ranking или URLs**.

---

## 3. ЗАЩИТЕНО ЯДРО — НЕПРОМЕНЕНО

V6 не bypass-ва:
- Firms owner;
- Listings write/edit/media owner;
- Masters/Construction protected logic;
- Shops specialized owner;
- Health/Info specialized owner;
- Events specialized owner;
- Admin/Moderator boundaries;
- quotas/status/approval/direct-publish rules;
- protected Admin/Ivanov/boost priority;
- RLS/schema/security rules.

Moderator own-business edit mismatch, намерен в A2, остава отделен protected defect candidate и не се поправя странично в V6-B.

---

## 4. V6 DESIGN TRACK

Branch: `v6-product-foundation-draft`  
Production impact: **NONE**.

Completed artifacts:
- `PUBLIC_PRODUCT_V6_CURRENT_TARGET_OWNER_MAP.md` — A1;
- `PUBLIC_PRODUCT_V6_A2_EVIDENCE_BASELINE.md` — A2;
- `PUBLIC_PRODUCT_V6_B1_FINAL_IA_TAXONOMY_CONTRACT.md` — B1;
- `PUBLIC_PRODUCT_V6_B1_HEALTH_PRESENTATION_PARITY_CLARIFICATION.md` — locked Health presentation/Facebook clarification;
- `PUBLIC_PRODUCT_V6_B2_SEARCH_INTENT_RESULT_CONTRACT.md` — B2;
- `PUBLIC_PRODUCT_V6_B3_INFO_SOURCE_FRESHNESS_SEO_SEARCH_CONTRACT.md` — B3;
- `PUBLIC_PRODUCT_V6_B4_ARTICLE_GUIDE_CONTENT_ARCHITECTURE_CONTRACT.md` — B4;
- `PUBLIC_PRODUCT_V6_MASTER_CONTROL.md` — canonical roadmap/handoff.

---

## 5. STAGE STATUS

### `V6-0 — CONTROL / CONTINUITY`
**DONE**

### `V6-A1 — CURRENT → TARGET OWNER / RELATIONSHIP MAP`
**DONE**

### `V6-A2 — EVIDENCE / COVERAGE / RUNTIME BASELINE`
**DONE**

Key evidence:
- current `tarsene.html` uses legacy `script.js` owner;
- current Info DB audit had 152 published entries, all with `confirmed_at` at audit time;
- Info source-of-truth was mixed: Health mostly DB-driven; Banks/Education/Transport hardcoded mutable facts; Utilities hybrid; Institutions layered;
- current article `Как да избереш майстор...` exists but is `ЗА ПРЕРАБОТКА`;
- `Как се пенсионира човек` is `РАЗРАБОТВАНО` with НОИ/Info backbone;
- no reliable Popitai first-party analytics baseline was proven;
- dynamic detail SEO/share is incomplete;
- no current PWA/share-target implementation was proven.

### `V6-B1 — FINAL IA / TAXONOMY / OWNER CONTRACT`
**DONE**

Locked:
- stable 16-category taxonomy;
- shortcuts vs taxonomy;
- `Открий в Лом`;
- owner-aware Find/Add/Ask;
- Jobs vs Services;
- specialized Health/Shops/Events boundaries;
- protected Construction logic/URLs/ranking preserved.

#### Health clarification — LOCKED

`Здраве и лекари`:
- е една от общите V6 категории;
- трябва визуално/navigation/interaction/share/Facebook да използва същия общ V6 category system;
- current Health structure е input/coverage, **не frozen UI**;
- може да се прегрупира и визуално преработи;
- verified data/moderation/reliability owner остава specialized Health/Info;
- Facebook/share layer не става owner на health facts.

### `V6-B2 — SEARCH V6 / RESULT COMPOSITION / INTENT ROUTING CONTRACT`
**DONE**

Locked:
- one Search owner/render owner;
- lightweight BG normalization/synonyms;
- exact result families: route, verified_info, business, listing, shop, event, question, article;
- bounded two-phase owner query planner;
- deterministic intent composition;
- verified Info vs community separation;
- protected Admin/Ivanov/boost-safe boundary;
- contextual no-result → `Попитай Лом` only after complete fallback;
- debounce/cancellation/cache/pagination/partial-failure states;
- internal search `noindex,follow`;
- no schema/RLS/production implementation.

### `V6-B3 — INFO SOURCE / FRESHNESS / SEO / SEARCH CONTRACT`
**DONE**

Locked:
- mutable local Info facts have one target truth owner: controlled Info/`info_entries` flow;
- specialized renderers may remain, but hardcoded mutable facts are migration debt, not second truth;
- publication visibility vs reliability trust are separate;
- reliability classes: official/strong/secondary/conflict/unverified;
- field-risk freshness default windows: 7/30/90/180/365 days;
- fresh/due/stale semantics;
- stale/conflict high-risk facts do not become verified Search answers;
- `confirmed_at` means real evidence reconfirmation, not cosmetic edit;
- safe Search V6 Info whitelist;
- stable Info canonical/SEO/share contract;
- no schema/RLS/production implementation.

### `V6-B4 — ARTICLE / GUIDE CONTENT ARCHITECTURE CONTRACT`
**DONE**

Artifact:
`PUBLIC_PRODUCT_V6_B4_ARTICLE_GUIDE_CONTENT_ARCHITECTURE_CONTRACT.md`

Locked:
- Article/Guide explains process/choice/context; Info owns mutable verified facts; Q&A owns community experience;
- one primary guide intent → one canonical guide;
- current file existence does not make an article ready;
- only `ПРОВЕРЕНО ГОТОВО` is Search/SEO/Home/category-feature eligible;
- readiness hard gate covers user value, completeness, sources, owner boundary, local value, safety, SEO, links, mobile, performance, freshness and share;
- honest author/editorial ownership; no invented credentials;
- mutable local phone/address/hours are not duplicated into article truth;
- article freshness classes E365/P180/P90/S30/V7 and fresh/due/stale behavior;
- `updated` ≠ `reviewed`;
- task-oriented internal linking to Info/categories/entities/Q&A;
- Search V6 article eligibility is intent-aware;
- canonical/SEO/cannibalization/thin-content prevention;
- Articles are first-class Facebook/share assets, but social previews cannot become stale second truth owners;
- Health guides use the common V6 category/article/share shell while Health data remains specialized;
- initial content priorities have explicit statuses without invented analytics claims;
- storage/CMS/schema decision deferred to V6-D;
- no production implementation.

Production impact: **NONE**.

### `V6-B5 — Q&A CANONICAL / DUPLICATE / ALIAS / MODERATION CONTRACT`
**CURRENT STAGE**

---

## 6. EXACT NEXT TASK

# `STAGE V6-B5 — Q&A CANONICAL / DUPLICATE / ALIAS / MODERATION CONTRACT`

B5 starts from locked B1–B4 + A2 Q&A evidence. Do not reopen earlier stages without a proven blocker and do not start production code.

B5 must lock:
- canonical question identity;
- duplicate detection before publish;
- aliases/alternate phrasings;
- non-destructive merge/redirect/history model;
- category/subcategory/topic relations;
- verified Info vs community answer separation;
- best/accepted/useful-answer semantics without fake authority;
- Moderator/Admin/self-content boundaries;
- old/stale Q&A behavior;
- Search V6 Q&A eligibility/ranking boundaries;
- canonical Q&A SEO/share/Facebook behavior;
- contextual `Попитай Лом` prefill and no-result flow;
- performance/privacy boundaries;
- no schema/RLS/production implementation.

Required artifact:

`PUBLIC_PRODUCT_V6_B5_QA_CANONICAL_DUPLICATE_ALIAS_MODERATION_CONTRACT.md`

B5 exit gate:

**един реален въпрос има един canonical knowledge center, duplicate formulations не създават конкуриращи се thin pages, moderation/trust boundaries са ясни, а Search/SEO/share/Facebook водят към правилния canonical Q&A без да превръщат community opinion във verified fact.**

---

## 7. WORKING MODE

- safe read/design work is autonomous;
- no repeated user explanations;
- no broad re-audit of completed stages;
- new ideas are recorded without derailing current exact task;
- protected/risky production changes require proper approval;
- no V6 production code before B/C/D/E gates.

At end of each B-stage:
1. create/update artifact;
2. update Master Control;
3. update `PROJECT_PROGRESS.md`;
4. update `PUBLIC_PRODUCT_V6_NEXT_CHAT_START.md`;
5. record status/evidence/risks;
6. set exactly one next task;
7. state production impact truthfully.

---

## 8. CURRENT HANDOFF

**Completed:** V6-0, A1, A2, B1, B2, B3, B4.  
**Current:** V6-B5.  
**Next artifact:** `PUBLIC_PRODUCT_V6_B5_QA_CANONICAL_DUPLICATE_ALIAS_MODERATION_CONTRACT.md`.  
**Production:** unchanged by V6 planning.  
**Do not do next:** production implementation before B/C/D/E approval gates.