# Попитай.Лом — V6 NEXT CHAT START

Статус: **START HERE / ZERO-EXPLANATION HANDOFF**  
Branch: `v6-product-foundation-draft`  
Актуализирано: 31.08.2026

Работим по:

`Traqnivanov/popitai-lom`

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

После чети само task-specific supporting docs/evidence.

При конфликт:

**LOCKED rules > approved production specs > V6 Master Control > completed B-contracts > supporting drafts.**

---

## 2. Текущо състояние

Завършени:
- V6-0;
- V6-A1;
- V6-A2;
- V6-B1;
- V6-B2;
- V6-B3;
- V6-B4;
- V6-B5.

Production е **непроменен от V6 planning track**.

### Health clarification — LOCKED

`Здраве и лекари` участва в същия общ V6 category/mobile/search/share/Facebook system като останалите категории. Current Health UI не е frozen target; може да се прегрупира/redesign-не. Verified Health/Info owner/moderation/reliability/freshness остават specialized. Facebook/share не става втори health fact owner.

### B2/B3/B4

- Search V6 има един owner и bounded intent-aware composition;
- Info държи mutable verified local facts + trust/freshness;
- Articles/Guides обясняват process/choice/context и само `ПРОВЕРЕНО ГОТОВО` е normal Search/SEO/feature eligible.

### B5 — locked Q&A model

- one real question intent → one canonical knowledge center;
- moderation state is separate from canonical state;
- pre-submit bounded duplicate suggestions, max 3 visible candidates;
- aliases resolve to canonical, not independent SEO pages;
- merge is non-destructive/auditable;
- Moderator cannot use moderation powers on own Q&A;
- approved/community answer ≠ verified fact;
- `Избран от автора`, `Полезен`, `Проверена информация` are distinct;
- unanswered canonical may stay public/shareable and appear onsite to prevent duplicates, but default `noindex,follow` until useful answer/utility threshold;
- one canonical Q&A SEO/share/Facebook destination;
- sensitive/health share previews are conservative;
- contextual Ask can prefill editable query/category, never auto-submit;
- entity mention in answer is not automatically a structured recommendation.

---

## 3. EXACT NEXT TASK

# `STAGE V6-B6 — STRUCTURED RECOMMENDATION RELATION CONTRACT`

Не прави broad audit. Не преотваряй B1–B5 без доказан blocker. Не започвай production code.

Изработи:

`PUBLIC_PRODUCT_V6_B6_STRUCTURED_RECOMMENDATION_RELATION_CONTRACT.md`

B6 трябва да заключи:
- recommendation relation identity;
- allowed source types/publication states;
- allowed target entity owner types;
- reliable entity resolution;
- positive recommendation vs mention/neutral/negative context;
- moderation/approval;
- self-recommendation/conflict-of-interest;
- dedupe / one-user-one-source signal semantics;
- invalidation when source/target becomes nonpublic;
- derived counts from valid relations only;
- category/entity/Search presentation;
- relation with future B8 ranking while preserving Admin/Ivanov/boost protected rules;
- privacy/abuse/performance;
- no schema/RLS/production implementation.

B6 exit gate:

**всяка recommendation signal има traceable approved source, resolved target owner и clear polarity/validity; duplicate/self/removed content cannot inflate trust; counts are derived only from valid relations; relation layer cannot overwrite protected owner/ranking.**

---

## 4. B6 evidence scope

Използвай само релевантното:
- current target owner identifiers for Firms/Health/Shops/Restaurants/etc.;
- approved Q&A answer/source ownership;
- B5 canonical Q&A model;
- A1 owner map;
- protected Construction/Admin/Ivanov/boost rules;
- user/content ownership evidence where needed.

---

## 5. Работен режим

- safe read/design steps autonomous;
- no repeated context questions;
- no side missions;
- protected production changes require approval;
- no V6 production code before B/C/D/E gates.

В края на B6:
1. create/update B6 artifact;
2. update Master Control;
3. update `PROJECT_PROGRESS.md`;
4. update този file;
5. set exactly one next task;
6. record production impact.

Минимално съобщение в нов чат:

`@GitHub Продължи Попитай.Лом по PUBLIC_PRODUCT_V6_NEXT_CHAT_START.md. Работи автономно.`