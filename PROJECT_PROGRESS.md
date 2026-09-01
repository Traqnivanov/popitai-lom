# Попитай.Лом — ТЕКУЩ CHECKPOINT

Актуализирано: 01.09.2026

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

V6 planning до този checkpoint **НЕ е променял production UI, schema/RLS, roles, quotas, moderation, protected owners/ranking или URLs**.

---

## 3. ЗАЩИТЕНО ЯДРО — НЕПРОМЕНЕНО

V6 не bypass-ва Firms, Listings, Masters/Construction, Shops, Health/Info, Events, Admin/Moderator, quotas/status/approval/direct-publish, protected Admin/Ivanov/boost priority или RLS/schema/security.

Moderator own-business edit mismatch от A2 остава отделен protected defect candidate.

---

## 4. V6 DESIGN TRACK

Branch: `v6-product-foundation-draft`  
Production impact: **NONE**.

Completed artifacts:
- A1 `PUBLIC_PRODUCT_V6_CURRENT_TARGET_OWNER_MAP.md`;
- A2 `PUBLIC_PRODUCT_V6_A2_EVIDENCE_BASELINE.md`;
- B1 `PUBLIC_PRODUCT_V6_B1_FINAL_IA_TAXONOMY_CONTRACT.md`;
- B1 companion `PUBLIC_PRODUCT_V6_B1_HEALTH_PRESENTATION_PARITY_CLARIFICATION.md`;
- B2 `PUBLIC_PRODUCT_V6_B2_SEARCH_INTENT_RESULT_CONTRACT.md`;
- B3 `PUBLIC_PRODUCT_V6_B3_INFO_SOURCE_FRESHNESS_SEO_SEARCH_CONTRACT.md`;
- B4 `PUBLIC_PRODUCT_V6_B4_ARTICLE_GUIDE_CONTENT_ARCHITECTURE_CONTRACT.md`;
- B5 `PUBLIC_PRODUCT_V6_B5_QA_CANONICAL_DUPLICATE_ALIAS_MODERATION_CONTRACT.md`;
- B6 `PUBLIC_PRODUCT_V6_B6_STRUCTURED_RECOMMENDATION_RELATION_CONTRACT.md`;
- B7 `PUBLIC_PRODUCT_V6_B7_FACEBOOK_BRIDGE_TECHNICAL_PRODUCT_CONTRACT.md`;
- B8 `PUBLIC_PRODUCT_V6_B8_LOCAL_RELEVANCE_RANKING_PROTECTED_PRIORITY_CONTRACT.md`.

---

## 5. STAGE STATUS

### V6-0 / A1 / A2
**DONE**

### B1 — IA / Taxonomy / Owner
**DONE**

Health clarification remains LOCKED: Health joins the common V6 visual/category/mobile/search/share/Facebook system, current Health UI is not frozen, but verified Health/Info owner/trust/moderation remain specialized.

### B2 — Search V6
**DONE**

One Search owner, bounded intent-aware composition, exact result families, verified-vs-community separation and protected ranking boundary.

### B3 — Info Source/Freshness/SEO/Search
**DONE**

One truth owner for mutable Info facts; publication/reliability/freshness/stale/provenance/SEO/share rules locked.

### B4 — Article/Guide Architecture
**DONE**

Guide explains process/context; Info owns mutable facts; Q&A owns community experience; only `ПРОВЕРЕНО ГОТОВО` is normal Search/SEO/feature eligible.

### B5 — Q&A Canonical/Duplicate/Alias/Moderation
**DONE**

One question intent → one canonical knowledge center; bounded duplicate prevention; aliases/merge non-destructive; moderation ≠ verification; thin unanswered SEO prevention; canonical share destination.

### B6 — Structured Recommendation Relation
**DONE**

Approved Q&A answer → stable approved entity relation; explicit positive polarity; self/duplicate/invalid signals excluded; counts derived from valid unique relations; recommendation cannot rewrite owner data/protected ranking.

### B7 — Facebook Bridge
**DONE**

Facebook is distribution only; public canonical Popitai content is shared outward; no arbitrary group automation/scraping/import; Health uses conservative safe previews; Web Share is enhancement with copy/manual fallback.

### B8 — Local Relevance / Ranking / Protected Priority
**DONE**

Artifact:
`PUBLIC_PRODUCT_V6_B8_LOCAL_RELEVANCE_RANKING_PROTECTED_PRIORITY_CONTRACT.md`

Locked:
- no universal popularity score;
- ranking cascade = public/safety eligibility → intent/owner eligibility → relevance gate → protected/native priority → trust/freshness/locality → bounded secondary signals → deterministic tie-break;
- protected Admin/Ivanov/boost priority applies only inside a valid relevant candidate set;
- exact named entity/navigation cannot be hijacked by protected commercial ordering;
- factual/safety intent can correctly put verified Info before provider promotion;
- current Listing protected order remains Admin/owner-admin → boost → recency after eligibility/filtering;
- `is_urgent`/`is_highlighted` ranking boost is not invented without evidence;
- Firms preserve relevant-set protected owner-first semantics;
- Health/Info ranking respects B3 reliability/freshness and community recommendations never become medical authority;
- B6 recommendation tiers are bounded secondary signals only;
- Q&A aliases return canonical cards and unanswered exact matches may remain visible for duplicate prevention;
- Articles must pass B4 readiness before ranking;
- Shops/Restaurants/Events keep owner-native deterministic order;
- no invented analytics/popularity weighting;
- no pay-to-rank implication unless separately approved and disclosed;
- no schema/RLS/production implementation.

Production impact: **NONE**.

### V6-B9 — EXACT INTERACTION / FORMS / BUTTONS / LINKS / STATES CONTRACT
**CURRENT STAGE**

---

## 6. EXACT NEXT TASK

# `STAGE V6-B9 — EXACT INTERACTION / FORMS / BUTTONS / LINKS / STATES CONTRACT`

B9 must lock end-to-end behavior for every main V6 action:
- Home/search/category/detail CTA hierarchy;
- `Намери`, `Добави`, `Попитай`, `Сподели`, `Докладвай/Предложи корекция`;
- exact owner-aware route for Listings/Firms/Health/Shops/Events/Q&A/Articles;
- exact supported URL/prefill parameters and safe fallback when current forms do not support a parameter;
- auth-required behavior;
- form validation/submission/moderation/success/error/offline states;
- pending vs approved share behavior;
- back/cancel/unsaved-data behavior;
- mobile sheet/modal/focus/accessibility behavior;
- duplicate prevention handoff in Ask;
- contextual no-result Search → Ask prefill;
- Facebook Bridge post-publication share handoff;
- Health common-shell interaction parity without generic owner bypass;
- no fake Event Add flow;
- no protected owner/quota/role change;
- no schema/RLS/production implementation.

Required artifact:

`PUBLIC_PRODUCT_V6_B9_EXACT_INTERACTION_FORMS_BUTTONS_LINKS_STATES_CONTRACT.md`

B9 exit gate:

**every main visible V6 CTA has one real owner-aware destination and deterministic auth/prefill/validation/moderation/success/error/back/share behavior; no dead button, fake flow, owner bypass or ambiguous state remains in the target contract.**

---

## 7. WORKING MODE

- safe read/design autonomous;
- no broad re-audit;
- inspect only current interaction/form owners needed to prove B9;
- no production code before B/C/D/E gates;
- at stage completion update Master/Progress/Next and set exactly one next task.

---

## 8. CURRENT HANDOFF

**Completed:** V6-0, A1, A2, B1–B8.  
**Current:** V6-B9.  
**Next artifact:** `PUBLIC_PRODUCT_V6_B9_EXACT_INTERACTION_FORMS_BUTTONS_LINKS_STATES_CONTRACT.md`.  
**Production:** unchanged by V6 planning.