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
- B6 `PUBLIC_PRODUCT_V6_B6_STRUCTURED_RECOMMENDATION_RELATION_CONTRACT.md`.

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

One real question intent → one canonical knowledge center; bounded duplicate suggestions; non-destructive aliases/merge; approval ≠ verification; unanswered thin SEO prevention; canonical share/Facebook destination.

### B6 — Structured Recommendation Relation
**DONE**

Artifact:
`PUBLIC_PRODUCT_V6_B6_STRUCTURED_RECOMMENDATION_RELATION_CONTRACT.md`

Locked:
- initial source = approved Q&A answer;
- stable targets = approved Businesses/Firms (Restaurants included), provider-like published Health Info, approved Shops;
- Listings/Events excluded from durable recommendation counts initially;
- explicit positive polarity required; mere mention/negative/ambiguous text does not count;
- target must resolve to stable owner ID;
- free-text extraction alone cannot change reputation;
- source and target must both be public;
- self-recommendation is excluded from community count/ranking;
- one source author contributes max one active positive unit per target;
- same answer/target cannot multiply relations;
- counts derive from valid unique positive non-self relations, not manual protected counters;
- cache/materialized aggregate is allowed only if rebuildable from relations;
- Health community recommendation remains separate from verified Health trust;
- recommendation does not create new Search result owner;
- protected Admin/Ivanov/boost ranking remains untouched until B8;
- Facebook reactions/comments do not automatically become Popitai recommendations;
- privacy/abuse/performance boundaries locked;
- no schema/RLS/production implementation.

Production impact: **NONE**.

### V6-B7 — FACEBOOK BRIDGE TECHNICAL / PRODUCT CONTRACT
**CURRENT STAGE**

---

## 6. EXACT NEXT TASK

# `STAGE V6-B7 — FACEBOOK BRIDGE TECHNICAL / PRODUCT CONTRACT`

B7 must lock:
- Popitai → Facebook share flow for approved public Q&A/entities/listings/jobs/property/events/guides/Health where appropriate;
- when share actions become available relative to moderation/publication;
- canonical URL and server-readable Open Graph/share preview requirements;
- safe share text generation and mutable-fact boundaries;
- Facebook → Popitai user-assisted import/prefill for the user’s own content without scraping;
- current platform/group/API limitations and privacy boundaries;
- no automatic posting to arbitrary groups;
- no automatic external comments/reactions import as Q&A/recommendations;
- mobile Web Share API / clipboard / Facebook fallback hierarchy;
- PWA/share-target only as optional later experiment;
- update/hide/delete behavior after content was already shared externally;
- attribution/UTM without sensitive query/body leakage;
- Health/sensitive content rules;
- performance: no Facebook SDK dependency by default;
- no schema/RLS/production implementation.

Required artifact:

`PUBLIC_PRODUCT_V6_B7_FACEBOOK_BRIDGE_TECHNICAL_PRODUCT_CONTRACT.md`

B7 exit gate:

**Facebook is a controlled distribution bridge around canonical Popitai content—not a second data owner, scraper, moderation system or trust source; every share has safe canonical destination/preview/status behavior and works without requiring a heavy Facebook SDK or unsupported group automation.**

---

## 7. WORKING MODE

- safe read/design/research autonomous;
- current external platform rules may be verified from authoritative sources;
- no broad re-audit;
- no production code before B/C/D/E gates;
- at stage completion update Master/Progress/Next and set one exact next task.

---

## 8. CURRENT HANDOFF

**Completed:** V6-0, A1, A2, B1–B6.  
**Current:** V6-B7.  
**Next artifact:** `PUBLIC_PRODUCT_V6_B7_FACEBOOK_BRIDGE_TECHNICAL_PRODUCT_CONTRACT.md`.  
**Production:** unchanged by V6 planning.