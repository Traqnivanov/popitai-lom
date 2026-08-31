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
- B6 `PUBLIC_PRODUCT_V6_B6_STRUCTURED_RECOMMENDATION_RELATION_CONTRACT.md`;
- B7 `PUBLIC_PRODUCT_V6_B7_FACEBOOK_BRIDGE_TECHNICAL_PRODUCT_CONTRACT.md`.

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

### B7 — Facebook Bridge Technical/Product Contract
**DONE**

Artifact:
`PUBLIC_PRODUCT_V6_B7_FACEBOOK_BRIDGE_TECHNICAL_PRODUCT_CONTRACT.md`

Locked:
- Facebook is distribution/reach only, never Popitai content/trust/moderation owner;
- adoption loop = `Публикувай първо в Попитай → сподели към Facebook`;
- share action only after owner says content is public/approved/published;
- pending content does not receive fake public share CTA;
- supported public share types include canonical Q&A, Firms/Restaurants, Shops, eligible Health/Info, public Listings/Jobs/Property, Events, B4-ready Articles/Guides;
- every share points to stable canonical Popitai destination;
- dynamic details later require server-readable title/canonical/Open Graph metadata; client-only title update is insufficient;
- social preview is teaser, not duplicate datastore;
- mutable Info/Health contacts/hours are not copied by default into permanent cached Facebook preview;
- native Web Share is preferred enhancement only where supported, HTTPS + user activation required;
- Clipboard `writeText`/manual copy are fallbacks;
- no Facebook SDK dependency by default;
- current Facebook Groups API limitations mean no automatic arbitrary-group posting/scraping/group-member/comment import in MVP;
- group destination stays user-selected/manual/native-share controlled;
- Facebook→Popitai is user-assisted own-content paste/prefill, not scraping;
- no automatic external comments/reactions import as Q&A/answers/B6 recommendations;
- no automatic Facebook media rehosting;
- external share lifecycle handles edit/hide/expiry/Q&A merge safely through canonical Popitai state;
- attribution/UTM cannot leak raw query/body/health/private identifiers;
- Health/sensitive previews use conservative minimum public text;
- PWA/Web Share Target remains optional later experiment, not MVP dependency;
- Facebook Bridge does not change quotas/moderation/owner types;
- exact Meta endpoint/API details must be reverified immediately before production implementation;
- no schema/RLS/production implementation.

External B7 design evidence checked 31.08.2026:
- MDN: Web Share remains limited availability, secure-context/user-activation dependent;
- MDN: Clipboard `writeText` is broadly available but permission/security errors need fallback;
- current 2026 third-party/platform evidence remains consistent that the old Facebook Groups API/publish-to-groups capability removed in 2024 has no general direct replacement for arbitrary group automation.

Production impact: **NONE**.

### V6-B8 — LOCAL RELEVANCE / RANKING / PROTECTED PRIORITY CONTRACT
**CURRENT STAGE**

---

## 6. EXACT NEXT TASK

# `STAGE V6-B8 — LOCAL RELEVANCE / RANKING / PROTECTED PRIORITY CONTRACT`

B8 must lock:
- intent relevance before popularity;
- exact cross-owner composition vs owner-local ordering;
- protected Admin/Ivanov/boost priority adapter;
- Lom/local relevance;
- status/availability/freshness signals;
- B6 recommendation usage without count inflation/medical authority;
- Q&A answer/recency/usefulness rules;
- Article readiness/freshness rules;
- Health verified/reliability/freshness ordering;
- Firms/Listings/Shops/Events owner-local ordering boundaries;
- deterministic tie-breaking;
- no pay-to-rank implication unless separately approved/disclosed;
- no invented first-party popularity baseline;
- performance/query limits;
- explainability/test matrix;
- no schema/RLS/production implementation.

Required artifact:

`PUBLIC_PRODUCT_V6_B8_LOCAL_RELEVANCE_RANKING_PROTECTED_PRIORITY_CONTRACT.md`

B8 exit gate:

**for every major intent/result family, ordering is deterministic and explainable; authoritative/relevant/current results beat unrelated popularity, protected Admin/Ivanov/boost rules are preserved exactly where applicable, and community recommendation cannot silently override owner/trust/safety rules.**

---

## 7. WORKING MODE

- safe read/design autonomous;
- no broad re-audit;
- no production code before B/C/D/E gates;
- at stage completion update Master/Progress/Next and set exactly one next task.

---

## 8. CURRENT HANDOFF

**Completed:** V6-0, A1, A2, B1–B7.  
**Current:** V6-B8.  
**Next artifact:** `PUBLIC_PRODUCT_V6_B8_LOCAL_RELEVANCE_RANKING_PROTECTED_PRIORITY_CONTRACT.md`.  
**Production:** unchanged by V6 planning.