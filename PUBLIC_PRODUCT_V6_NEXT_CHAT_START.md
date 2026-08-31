# Попитай.Лом — V6 NEXT CHAT START

Статус: **START HERE / ZERO-EXPLANATION HANDOFF**  
Branch: `v6-product-foundation-draft`  
Актуализирано: 31.08.2026

Работим по `Traqnivanov/popitai-lom`.

Не прави нов repo/clone и не започвай проекта отначало.

## 1. Прочети първо

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

После чети само task-specific evidence.

При конфликт:

**LOCKED rules > approved production specs > V6 Master Control > completed B-contracts > supporting drafts.**

---

## 2. Текущо състояние

Завършени: V6-0, A1, A2, B1, B2, B3, B4, B5, B6, B7.

Production е **непроменен от V6 planning track**.

Ключово LOCKED:
- common 16-category V6 shell;
- Health uses same visual/category/mobile/search/share/Facebook system, but verified Health/Info owner/trust remains specialized;
- Search V6 has one explicit intent-aware owner;
- Info owns mutable verified local facts;
- Articles/Guides are process/context content and only `ПРОВЕРЕНО ГОТОВО` is normal Search/SEO eligible;
- one real Q&A intent → one canonical knowledge center; aliases/merge are non-destructive;
- community approval/usefulness ≠ verified fact;
- structured recommendations come from valid approved Q&A relation to stable approved entity; self/duplicates do not inflate counts;
- recommendation counts are derived, not manual entity truth;
- protected Admin/Ivanov/boost ranking is not changed by recommendations;
- Facebook is distribution only: public approved canonical content → share; no automatic arbitrary-group posting/scraping/import;
- Web Share is optional enhancement; Clipboard/manual fallback exists;
- Facebook comments/reactions are not Popitai answers/recommendations;
- no invented analytics popularity baseline.

---

## 3. EXACT NEXT TASK

# `STAGE V6-B8 — LOCAL RELEVANCE / RANKING / PROTECTED PRIORITY CONTRACT`

Не прави broad audit и не започвай production code.

Изработи:

`PUBLIC_PRODUCT_V6_B8_LOCAL_RELEVANCE_RANKING_PROTECTED_PRIORITY_CONTRACT.md`

B8 трябва да заключи:
- intent relevance before popularity;
- cross-owner composition vs owner-local ordering;
- exact protected Admin/Ivanov/boost adapter semantics;
- Lom/local relevance;
- public status/availability/freshness;
- B6 recommendation usage without trust inflation;
- Q&A answered/recency/usefulness boundaries;
- Article readiness/freshness influence;
- Health verified/reliability/freshness ordering;
- Firms/Listings/Shops/Events owner-local boundaries;
- deterministic tie-breaking;
- no pay-to-rank implication unless separately approved/disclosed;
- no invented popularity baseline;
- performance/query limits;
- explainability/regression test matrix;
- no schema/RLS/production implementation.

B8 exit gate:

**for every major intent/result family ordering is deterministic and explainable; authoritative/relevant/current beats unrelated popularity; protected Admin/Ivanov/boost rules survive exactly where applicable; community/social signals cannot silently override trust/owner/safety rules.**

---

## 4. Evidence scope

Use only:
- current `category-listings-v1.js` listing priority;
- current `supabase-businesses.js` owner-first ordering;
- B2 intent/group composition;
- B3 Info trust/freshness;
- B4 Article readiness/freshness;
- B5 Q&A canonical/answered/unanswered;
- B6 recommendations;
- protected Construction/Admin/Ivanov/boost rules.

---

## 5. Работен режим

Safe read/design autonomous. No production/schema/RLS/protected changes. At B8 completion update Master/Progress/Next and set exactly one next task.

Минимално съобщение в нов чат:

`@GitHub Продължи Попитай.Лом по PUBLIC_PRODUCT_V6_NEXT_CHAT_START.md. Работи автономно.`