# Попитай.Лом — V6 MASTER CONTROL / ROADMAP / HANDOFF

Статус: **КАНОНИЧЕН КОНТРОЛЕН ДОКУМЕНТ ЗА V6 DRAFT / NO PRODUCTION CODE**  
Branch: `v6-product-foundation-draft`  
Актуализирано: 31.08.2026

Нов чат започва от LOCKED rules → `PROJECT_PROGRESS.md` → този документ → completed B-contracts → task-specific evidence.

При конфликт:

**LOCKED rules > approved production specs > V6 Master Control > completed V6 contracts > supporting drafts.**

---

## 1. CURRENT PRODUCT TRUTH

Production остава на approved Marketplace V3 и protected backend/Admin/Moderator rules.

V6 е design/research/prototype track и до този checkpoint **не е променял production UI, schema/RLS, roles, quotas, moderation, protected owners/ranking или URLs**.

V6 target:

**local search + marketplace + Firms/entities + Info Lom + Articles/Guides + canonical Q&A + structured recommendations + Facebook distribution + deterministic local relevance + SEO/share + structured local memory.**

---

## 2. REQUIRED READ ORDER

1. `PROJECT_RULES_00_READ_FIRST.md`
2. `PROJECT_RULES_PROTECTED_CORE.md`
3. `PROJECT_RULES_ADMIN_MODERATOR.md`
4. `PROJECT_RULES.md`
5. `PROJECT_RULES_RENDER_OWNERSHIP.md`
6. `PROJECT_PROGRESS.md`
7. `PUBLIC_PRODUCT_V6_MASTER_CONTROL.md`
8. `PUBLIC_PRODUCT_V6_B1_FINAL_IA_TAXONOMY_CONTRACT.md`
9. `PUBLIC_PRODUCT_V6_B1_HEALTH_PRESENTATION_PARITY_CLARIFICATION.md`
10. `PUBLIC_PRODUCT_V6_B2_SEARCH_INTENT_RESULT_CONTRACT.md`
11. `PUBLIC_PRODUCT_V6_B3_INFO_SOURCE_FRESHNESS_SEO_SEARCH_CONTRACT.md`
12. `PUBLIC_PRODUCT_V6_B4_ARTICLE_GUIDE_CONTENT_ARCHITECTURE_CONTRACT.md`
13. `PUBLIC_PRODUCT_V6_B5_QA_CANONICAL_DUPLICATE_ALIAS_MODERATION_CONTRACT.md`
14. `PUBLIC_PRODUCT_V6_B6_STRUCTURED_RECOMMENDATION_RELATION_CONTRACT.md`
15. `PUBLIC_PRODUCT_V6_B7_FACEBOOK_BRIDGE_TECHNICAL_PRODUCT_CONTRACT.md`
16. task-specific evidence.

---

## 3. COMPLETED CONTRACT REGISTRY

- A1 — `PUBLIC_PRODUCT_V6_CURRENT_TARGET_OWNER_MAP.md`
- A2 — `PUBLIC_PRODUCT_V6_A2_EVIDENCE_BASELINE.md`
- B1 — `PUBLIC_PRODUCT_V6_B1_FINAL_IA_TAXONOMY_CONTRACT.md`
- B1 companion — `PUBLIC_PRODUCT_V6_B1_HEALTH_PRESENTATION_PARITY_CLARIFICATION.md`
- B2 — `PUBLIC_PRODUCT_V6_B2_SEARCH_INTENT_RESULT_CONTRACT.md`
- B3 — `PUBLIC_PRODUCT_V6_B3_INFO_SOURCE_FRESHNESS_SEO_SEARCH_CONTRACT.md`
- B4 — `PUBLIC_PRODUCT_V6_B4_ARTICLE_GUIDE_CONTENT_ARCHITECTURE_CONTRACT.md`
- B5 — `PUBLIC_PRODUCT_V6_B5_QA_CANONICAL_DUPLICATE_ALIAS_MODERATION_CONTRACT.md`
- B6 — `PUBLIC_PRODUCT_V6_B6_STRUCTURED_RECOMMENDATION_RELATION_CONTRACT.md`
- B7 — `PUBLIC_PRODUCT_V6_B7_FACEBOOK_BRIDGE_TECHNICAL_PRODUCT_CONTRACT.md`

Supporting strategy:
- `PUBLIC_PRODUCT_V6_WORKING_MODEL.md`
- `PUBLIC_PRODUCT_V6_GUARDRAILS.md`
- `PUBLIC_PRODUCT_V6_CONTENT_SEO_STRATEGY.md`
- `PUBLIC_PRODUCT_V6_CONTENT_INVENTORY_RULE.md`
- `PUBLIC_PRODUCT_V6_INFO_LOM_CORE_STRATEGY.md`
- `PUBLIC_PRODUCT_V6_ADOPTION_LAUNCH.md`
- `PUBLIC_PRODUCT_V6_INTERACTION_FORM_LINK_CONTRACT.md`

---

## 4. STAGE STATUS

- V6-0 — DONE
- A1 — DONE
- A2 — DONE
- B1 — DONE
- B2 — DONE
- B3 — DONE
- B4 — DONE
- B5 — DONE
- B6 — DONE
- B7 — DONE
- **B8 Local Relevance / Ranking / Protected Priority — CURRENT**
- B9 Exact interaction/forms/buttons/links/states — OPEN

Later:
- V6-C visual/interaction prototype;
- V6-D schema/RLS/index/migration/SEO rendering/performance design;
- V6-E final canonical approved V6 spec;
- V6-F implementation + CI/regression/live QA.

No V6 production code before required gates.

---

## 5. LOCKED WORKING TRUTH

### A. Owner architecture

Firms, Listings, Health/Info, Shops, Events, Q&A and other specialized owners remain authoritative. V6 adds search/relations/presentation, not a universal write owner.

### B. Stable 16-category taxonomy

1. Строителство и ремонти
2. Здраве и лекари
3. Работа
4. Автомобили
5. Имоти
6. Красота
7. Дом и градина
8. Магазини
9. Заведения и храна
10. Електроника
11. Деца и бебета
12. Животни
13. Мода
14. Спорт и хоби
15. Други услуги
16. Други обяви

### C. Health common shell / specialized truth

Health joins the common V6 visual/category/mobile/search/share/Facebook system. Current Health UI is not frozen. Verified Health/Info owner/moderation/reliability/freshness remain specialized.

### D. Search V6 intent/composition

One Search owner. Result families: route, verified_info, business, listing, shop, event, question, article. Bounded relevant-owner queries only.

Search group ordering is intent-first; owner-local ranking stays owner-aware.

### E. Verified Info truth

Mutable local facts stay Info-owned. B3 publication/reliability/freshness/stale/provenance rules remain hard boundaries.

### F. Articles

Only `ПРОВЕРЕНО ГОТОВО` is normal Search/SEO/feature eligible. Article explains process/context; it does not duplicate Info facts.

### G. Canonical Q&A

One question intent → one canonical knowledge center. Aliases resolve canonical. Approved/community content does not become verified fact.

### H. Structured recommendation

Initial relation source = approved Q&A answer. Durable targets = approved Business/Firms/Restaurants, provider-like Health Info, approved Shops.

Positive valid non-self relation only; same author contributes max one unit per target; counts derived from valid relations.

### I. Facebook Bridge

Facebook is controlled distribution only.

Only public approved canonical content is share-eligible. One canonical Popitai URL, server-readable OG target later, Web Share enhancement + Clipboard/manual fallback, no Facebook SDK dependency by default, no arbitrary group automation/scraping/import.

### J. External Facebook data is not trust signal

Facebook likes/comments/reactions do not become Popitai answers/recommendations automatically.

### K. Protected ranking survives all relation/share layers

Admin/Ivanov/boost protected priority is not changed by Search orchestration, recommendations or Facebook distribution. B8 must now define exact adapter/order boundaries.

### L. No invented popularity analytics

A2 proved no reliable Popitai first-party popularity/search baseline. B8 cannot invent `popular`, `most searched`, `top` weighting.

### M. Performance remains hard gate

No all-owner mega-query, no heavy AI/vector dependency by default, bounded result/candidate sets, deterministic client/server composition.

---

## 6. B7 EXTERNAL EVIDENCE SNAPSHOT

As of 31.08.2026:
- Web Share API remains non-universal/limited and requires secure context + user activation;
- Clipboard write is broadly available but needs permission/error fallback;
- current external platform evidence remains consistent that the old Facebook Groups API/direct third-party arbitrary-group posting capability removed in 2024 is not a safe dependency for V6 MVP.

Exact Meta endpoints/policies are reverified immediately before production implementation.

---

## 7. PROTECTED DEFECT — SEPARATE

A2 confirmed Moderator own-business edit mismatch. It remains a separate protected production defect scope and is not silently fixed during B8.

---

## 8. CURRENT EXACT TASK

# `STAGE V6-B8 — LOCAL RELEVANCE / RANKING / PROTECTED PRIORITY CONTRACT`

B8 must define:
1. intent relevance before popularity;
2. cross-owner group composition vs owner-local ordering;
3. exact protected Admin/Ivanov/boost adapter semantics;
4. Lom/location relevance;
5. public status/availability/freshness signals;
6. B6 recommendation signal use without trust inflation;
7. Q&A answered/recency/usefulness boundaries;
8. Article readiness/freshness influence;
9. Health verified/reliability/freshness ordering;
10. Firms/Listings/Shops/Events owner-local ordering boundaries;
11. deterministic tie-breaking;
12. no pay-to-rank implication unless separately approved/disclosed;
13. no invented analytics popularity baseline;
14. performance/query limits;
15. explainability and regression test matrix;
16. no schema/RLS/production implementation.

Required artifact:

`PUBLIC_PRODUCT_V6_B8_LOCAL_RELEVANCE_RANKING_PROTECTED_PRIORITY_CONTRACT.md`

B8 exit gate:

**for every major intent/result family ordering is deterministic/explainable; authoritative/relevant/current beats unrelated popularity; protected Admin/Ivanov/boost semantics remain exact where applicable; community/social signals cannot silently override trust/owner/safety rules.**

---

## 9. B8 EVIDENCE SCOPE

Use:
- `category-listings-v1.js` current listing priority order;
- `supabase-businesses.js` current owner-first business ordering;
- B2 search intent/group composition;
- B3 Info reliability/freshness;
- B4 article readiness/freshness;
- B5 Q&A canonical/answered/unanswered;
- B6 recommendation relation;
- protected rules/Construction owner evidence.

Do not broad-audit unrelated modules.

---

## 10. EXECUTION PROTOCOL

Safe read/design autonomous. No production writes. At stage completion update B8 artifact, Master, Progress, Next; set exactly one next task; state production impact.

---

## 11. HANDOFF

**Completed:** V6-0 + A1 + A2 + B1–B7.  
**Current:** V6-B8 Local Relevance / Ranking / Protected Priority.  
**Required artifact:** `PUBLIC_PRODUCT_V6_B8_LOCAL_RELEVANCE_RANKING_PROTECTED_PRIORITY_CONTRACT.md`.  
**Production impact:** NONE.