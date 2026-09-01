# Попитай.Лом — V6 NEXT CHAT START

Статус: **START HERE / ZERO-EXPLANATION HANDOFF**  
Branch: `v6-product-foundation-draft`  
Актуализирано: 01.09.2026

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
16. `PUBLIC_PRODUCT_V6_B8_LOCAL_RELEVANCE_RANKING_PROTECTED_PRIORITY_CONTRACT.md`

После чети само task-specific evidence.

При конфликт:

**LOCKED rules > approved production specs > V6 Master Control > completed B-contracts > supporting drafts.**

---

## 2. Текущо състояние

Завършени: V6-0, A1, A2, B1–B8.

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
- Facebook is distribution only and points back to canonical Popitai URLs;
- ranking uses relevance/eligibility before protected/native priority;
- Admin/Ivanov/boost applies only inside valid relevant candidate sets;
- factual/safety intent can correctly put verified Info before commercial/provider promotion;
- no invented popularity analytics baseline.

---

## 3. EXACT NEXT TASK

# `STAGE V6-B9 — EXACT INTERACTION / FORMS / BUTTONS / LINKS / STATES CONTRACT`

Не прави broad audit и не започвай production code.

Изработи:

`PUBLIC_PRODUCT_V6_B9_EXACT_INTERACTION_FORMS_BUTTONS_LINKS_STATES_CONTRACT.md`

B9 трябва да заключи:
- exact CTA hierarchy for Home/Search/Category/Detail;
- exact destination for `Намери`, `Добави`, `Попитай`, `Сподели`, `Докладвай/Предложи корекция`;
- owner-aware routing for Listings/Firms/Health/Shops/Events/Q&A/Articles;
- exact supported URL/prefill params and fallback rules;
- auth-required behavior;
- validation, submit, moderation, success, error, offline and retry states;
- pending vs approved share behavior;
- back/cancel/unsaved-data behavior;
- mobile sheet/modal/focus/accessibility behavior;
- Search no-result → Ask context;
- Ask duplicate-prevention handoff;
- Facebook Bridge post-publication handoff;
- Health common-shell interaction parity without generic owner bypass;
- no fake Event Add flow;
- no protected owner/quota/role/schema/RLS changes.

B9 exit gate:

**every main visible V6 CTA has one real owner-aware destination and deterministic auth/prefill/validation/moderation/success/error/back/share behavior; no dead button, fake flow, owner bypass or ambiguous target state remains.**

---

## 4. Evidence scope

Use only current interaction owners needed for B9:
- `PUBLIC_PRODUCT_V6_INTERACTION_FORM_LINK_CONTRACT.md`;
- `public-shell-v1.js` / current Add sheet;
- `dobavi-obqva.html` + listing form owner;
- `dobavi-firma.html` + firm form owner;
- Health submission owner;
- Shops proposal owner;
- `nov-vapros.html` + Q&A form owner;
- Events current public owner;
- current share/report/correction flows where relevant;
- B1–B8 locked routes/owners.

---

## 5. Работен режим

Safe read/design autonomous. No production/schema/RLS/protected changes. At B9 completion update Master/Progress/Next and set exactly one next task.

Минимално съобщение в нов чат:

`@GitHub Продължи Попитай.Лом по PUBLIC_PRODUCT_V6_NEXT_CHAT_START.md. Работи автономно.`