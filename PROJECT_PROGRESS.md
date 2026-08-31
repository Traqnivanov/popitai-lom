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

Desktop:
`Начало | Обяви и услуги | Фирми | Инфо Лом | Статии | Още ▼ | Профил | + Добави`

Mobile:
`Начало | Обяви | + | Инфо | Профил`

`kategorii.html` остава compatibility вход към `obyavi.html`, не втори marketplace.

V6 planning до този checkpoint **НЕ е променял production UI, schema/RLS, roles, quotas, moderation, protected owners/ranking или URLs**.

---

## 3. ЗАЩИТЕНО ЯДРО — НЕПРОМЕНЕНО

V6 не bypass-ва:
- Firms;
- Listings;
- Masters/Construction;
- Shops;
- Health/Info;
- Events;
- Admin/Moderator boundaries;
- quotas/status/approval/direct-publish;
- protected Admin/Ivanov/boost priority;
- RLS/schema/security.

Moderator own-business edit mismatch от A2 остава отделен protected defect candidate и не се поправя странично във V6-B.

---

## 4. V6 DESIGN TRACK

Branch: `v6-product-foundation-draft`  
Production impact: **NONE**.

Completed artifacts:
- `PUBLIC_PRODUCT_V6_CURRENT_TARGET_OWNER_MAP.md` — A1;
- `PUBLIC_PRODUCT_V6_A2_EVIDENCE_BASELINE.md` — A2;
- `PUBLIC_PRODUCT_V6_B1_FINAL_IA_TAXONOMY_CONTRACT.md` — B1;
- `PUBLIC_PRODUCT_V6_B1_HEALTH_PRESENTATION_PARITY_CLARIFICATION.md` — locked Health clarification;
- `PUBLIC_PRODUCT_V6_B2_SEARCH_INTENT_RESULT_CONTRACT.md` — B2;
- `PUBLIC_PRODUCT_V6_B3_INFO_SOURCE_FRESHNESS_SEO_SEARCH_CONTRACT.md` — B3;
- `PUBLIC_PRODUCT_V6_B4_ARTICLE_GUIDE_CONTENT_ARCHITECTURE_CONTRACT.md` — B4;
- `PUBLIC_PRODUCT_V6_B5_QA_CANONICAL_DUPLICATE_ALIAS_MODERATION_CONTRACT.md` — B5;
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
- current search page uses legacy `script.js` owner;
- current Info DB audit had 152 published entries at audit time;
- Info source-of-truth was mixed across sections;
- current article exists but is not V6-ready;
- dynamic Question/Listing/Firm initial SEO metadata is generic;
- current question share action is incomplete in audited detail owner;
- Q&A Moderator self-moderation is correctly backend-restricted to foreign content;
- no reliable Popitai first-party analytics baseline was proven;
- no current PWA/share-target implementation was proven.

### `V6-B1 — FINAL IA / TAXONOMY / OWNER CONTRACT`
**DONE**

Locked stable 16-category taxonomy, shortcuts, `Открий в Лом`, owner-aware Find/Add/Ask, Jobs vs Services, specialized owner boundaries and protected Construction semantics.

#### Health clarification — LOCKED

`Здраве и лекари`:
- is part of the same common V6 category/mobile/search/share/Facebook system;
- current Health UI/grouping is input, not frozen target;
- may be visually regrouped/redesigned;
- verified Health/Info owner/moderation/reliability/freshness remain specialized;
- Facebook/share does not become a second health fact owner.

### `V6-B2 — SEARCH V6 CONTRACT`
**DONE**

One Search owner, bounded intent-aware queries, exact result families, verified Info vs community separation, protected ranking boundary, contextual no-result, performance/cache/failure/SEO contract.

### `V6-B3 — INFO SOURCE / FRESHNESS / SEO / SEARCH CONTRACT`
**DONE**

One target truth owner for mutable Info facts, trust/freshness semantics, stale behavior, provenance, safe Search fields and canonical Info SEO/share contract.

### `V6-B4 — ARTICLE / GUIDE CONTENT ARCHITECTURE CONTRACT`
**DONE**

Locked:
- Article explains process/choice/context;
- Info owns mutable verified facts;
- Q&A owns community experience;
- one main guide intent → one canonical guide;
- only `ПРОВЕРЕНО ГОТОВО` is Search/SEO/feature eligible;
- honest author/source/review/freshness semantics;
- no duplicate mutable Info truth in article/social preview;
- Health guides use common V6 category/share/Facebook shell;
- no schema/RLS/production implementation.

### `V6-B5 — Q&A CANONICAL / DUPLICATE / ALIAS / MODERATION CONTRACT`
**DONE**

Artifact:
`PUBLIC_PRODUCT_V6_B5_QA_CANONICAL_DUPLICATE_ALIAS_MODERATION_CONTRACT.md`

Locked:
- one real question intent → one canonical knowledge center;
- moderation status is separate from canonical/duplicate state;
- bounded pre-submit duplicate check with max 3 visible candidates and no per-keystroke mega-search;
- aliases/alternate wording point to canonical instead of creating competing SEO pages;
- merge is non-destructive, auditable and reversible where reasonable;
- no destructive automatic merge/delete/rewrite;
- approved answers only participate publicly;
- Moderator self-Q&A moderation remains forbidden; canonical actions must respect same boundary;
- `Избран от автора`, community `Полезен` and `Проверена информация` are separate concepts;
- community approval/votes do not create verified truth;
- old/time-sensitive Q&A stays dated; current verified owner can supersede stale factual snippets;
- unanswered canonical questions may remain public/shareable and appear onsite to prevent duplicates, but are default `noindex,follow` until useful answer/utility threshold;
- only canonical/independent approved questions are normal Search V6 candidates; aliases resolve to canonical;
- one canonical SEO/share/Facebook destination;
- conservative share preview for sensitive/health content;
- contextual `Попитай Лом` can prefill query/category but never auto-submit and duplicate check runs before final submit;
- relation-layer hooks are conceptual only; no schema/RLS/production implementation.

Production impact: **NONE**.

### `V6-B6 — STRUCTURED RECOMMENDATION RELATION CONTRACT`
**CURRENT STAGE**

---

## 6. EXACT NEXT TASK

# `STAGE V6-B6 — STRUCTURED RECOMMENDATION RELATION CONTRACT`

B6 starts from B1–B5 + current entity/Q&A owners. No broad re-audit and no production code.

B6 must lock:
- recommendation relation identity;
- allowed source content/types;
- allowed target entity owner types;
- entity resolution without free-text counter corruption;
- positive recommendation vs mere mention/neutral/negative context;
- moderation/approval boundaries;
- self-recommendation/conflict-of-interest behavior;
- dedupe and one-user/one-source signal semantics;
- invalidation when source or target becomes nonpublic;
- derived counts from valid relations, not manually maintained protected counters;
- category/entity/Search presentation semantics;
- interaction with future B8 ranking while preserving Admin/Ivanov/boost protected rules;
- privacy/abuse/performance;
- no schema/RLS/production implementation.

Required artifact:

`PUBLIC_PRODUCT_V6_B6_STRUCTURED_RECOMMENDATION_RELATION_CONTRACT.md`

B6 exit gate:

**всяка recommendation signal има traceable approved source, resolved target owner и clear polarity/validity; counts are derived only from valid relations; self/duplicate/removed content cannot inflate trust; recommendation layer cannot overwrite protected entity owners or ranking.**

---

## 7. WORKING MODE

- safe read/design work is autonomous;
- no repeated user context questions;
- no broad re-audit of completed stages;
- protected/risky production changes require proper approval;
- no V6 production code before B/C/D/E gates.

At end of each B-stage:
1. create/update artifact;
2. update Master Control;
3. update `PROJECT_PROGRESS.md`;
4. update `PUBLIC_PRODUCT_V6_NEXT_CHAT_START.md`;
5. set exactly one next task;
6. state production impact.

---

## 8. CURRENT HANDOFF

**Completed:** V6-0, A1, A2, B1, B2, B3, B4, B5.  
**Current:** V6-B6.  
**Next artifact:** `PUBLIC_PRODUCT_V6_B6_STRUCTURED_RECOMMENDATION_RELATION_CONTRACT.md`.  
**Production:** unchanged by V6 planning.