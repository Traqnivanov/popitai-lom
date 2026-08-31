# Попитай.Лом — V6 MASTER CONTROL / ROADMAP / HANDOFF

Статус: **КАНОНИЧЕН КОНТРОЛЕН ДОКУМЕНТ ЗА V6 DRAFT / NO PRODUCTION CODE**  
Branch: `v6-product-foundation-draft`  
Актуализирано: 31.08.2026

Това е единната контролна точка за V6. Нов чат започва от LOCKED rules → `PROJECT_PROGRESS.md` → този документ → completed B-contracts → task-specific evidence.

При конфликт:

**LOCKED rules > approved production specs > V6 Master Control > completed V6 contracts > supporting drafts > prototypes/chat notes.**

---

## 1. CURRENT PRODUCT TRUTH

Production остава на approved Marketplace V3 и current protected backend/Admin/Moderator rules.

V6 е design/research/prototype track и до този checkpoint **не е променял production UI, schema/RLS, roles, quotas, moderation, protected owners/ranking или URLs**.

V6 target:

**локална търсачка + marketplace + фирми/местни обекти + Инфо Лом + статии/ръководства + contextual Q&A + structured recommendations + памет на Лом + SEO/share/Facebook distribution layer.**

Growth loop:

`Google / Facebook / direct → Search V6 → verified Info / entity / listing / guide / canonical Q&A → ако няма достатъчен отговор, Попитай → moderation → share → structured community signals → нови хора → знанието остава → по-силен direct habit.`

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
14. task-specific evidence.

Do not ask the user to restate project/stage/branch when these docs are available.

---

## 3. DOCUMENT REGISTRY

### Supporting strategy

- `PUBLIC_PRODUCT_V6_WORKING_MODEL.md`
- `PUBLIC_PRODUCT_V6_GUARDRAILS.md`
- `PUBLIC_PRODUCT_V6_CONTENT_SEO_STRATEGY.md`
- `PUBLIC_PRODUCT_V6_CONTENT_INVENTORY_RULE.md`
- `PUBLIC_PRODUCT_V6_INFO_LOM_CORE_STRATEGY.md`
- `PUBLIC_PRODUCT_V6_ADOPTION_LAUNCH.md`
- `PUBLIC_PRODUCT_V6_INTERACTION_FORM_LINK_CONTRACT.md`

### Completed evidence/contracts

- `PUBLIC_PRODUCT_V6_CURRENT_TARGET_OWNER_MAP.md` — **A1 DONE**
- `PUBLIC_PRODUCT_V6_A2_EVIDENCE_BASELINE.md` — **A2 DONE**
- `PUBLIC_PRODUCT_V6_B1_FINAL_IA_TAXONOMY_CONTRACT.md` — **B1 DONE**
- `PUBLIC_PRODUCT_V6_B1_HEALTH_PRESENTATION_PARITY_CLARIFICATION.md` — **LOCKED B1 companion**
- `PUBLIC_PRODUCT_V6_B2_SEARCH_INTENT_RESULT_CONTRACT.md` — **B2 DONE**
- `PUBLIC_PRODUCT_V6_B3_INFO_SOURCE_FRESHNESS_SEO_SEARCH_CONTRACT.md` — **B3 DONE**
- `PUBLIC_PRODUCT_V6_B4_ARTICLE_GUIDE_CONTENT_ARCHITECTURE_CONTRACT.md` — **B4 DONE**
- `PUBLIC_PRODUCT_V6_B5_QA_CANONICAL_DUPLICATE_ALIAS_MODERATION_CONTRACT.md` — **B5 DONE**

Production truth until final V6 approval:
- `PUBLIC_MARKETPLACE_V3_APPROVED_SPEC.md`
- `PUBLIC_SITE_INFORMATION_ARCHITECTURE_APPROVED_SPEC.md`
- `ADMIN_PANEL_V2_APPROVED_SPEC.md`
- LOCKED rules.

---

## 4. STAGE STATUS

### V6-0 — CONTROL / CONTINUITY
**DONE**

### V6-A1 — CURRENT → TARGET OWNER / RELATIONSHIP MAP
**DONE**

### V6-A2 — EVIDENCE / COVERAGE / RUNTIME BASELINE
**DONE**

### V6-B — PRODUCT CONTRACTS
**CURRENT MAJOR STAGE**

- B1 Final IA/Taxonomy/Owner — **DONE**
- B2 Search V6/Intent/Results — **DONE**
- B3 Info Source/Freshness/SEO/Search — **DONE**
- B4 Article/Guide Content Architecture — **DONE**
- B5 Q&A Canonical/Duplicate/Alias/Moderation — **DONE**
- B6 Structured Recommendation Relation — **CURRENT**
- B7 Facebook Bridge — OPEN
- B8 Local Relevance Ranking preserving protected priorities — OPEN
- B9 Exact interaction/forms/buttons/links/states — OPEN

Later:
- V6-C visual/interaction prototype;
- V6-D schema/RLS/index/migration/SEO rendering/performance design;
- V6-E one final canonical approved V6 spec;
- V6-F incremental implementation + CI/regression/live QA.

**No V6 production code before required B/C/D/E gates.**

---

## 5. LOCKED WORKING TRUTH

### A. Owner architecture survives V6

Firms, Listings, Health/Info, Shops, Events, Q&A and other specialized owners stay authoritative. V6 connects them; it does not collapse them into a universal write table.

### B. Stable public taxonomy

16 categories:
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

Initial shortcuts are editorial default, not measured popularity.

### C. Jobs ≠ Services

`Работа` = protected Listings jobs intent.  
`Услуги` = service offer/seek + relevant Firms composition.

### D. Health uses common V6 shell but specialized owner

`Здраве и лекари` must participate in the same category/mobile/search/share/Facebook presentation system as other categories.

Current Health UI is not frozen; verified owner/moderation/reliability/freshness is protected. Facebook/share is distribution, not a second health fact owner.

### E. Shops/Events remain specialized; Construction protected semantics survive

No generic bypass, no fake Event Add, no casual protected ranking/URL changes.

### F. Search V6 has one owner

Result families:
- route;
- verified_info;
- business;
- listing;
- shop;
- event;
- question;
- article.

Bounded relevant-owner queries only; no mega-query.

### G. Trust classes remain separate

Verified Info ≠ community opinion.  
Moderation approval ≠ factual verification.  
Article editorial review ≠ Info verification.

### H. Protected ranking is not demoted

Admin/Ivanov/boost semantics survive relevant provider compositions. Exact cross-owner ranking is B8/V6-D.

### I. Info mutable facts have one truth owner

Mutable local phones/addresses/hours/schedules/directors/operational facts belong to controlled Info owner. Hardcoded duplicate facts are migration debt.

Info publication/trust/freshness semantics from B3 remain locked.

### J. Article/Guide role is locked

Guide explains process/choice/context. It does not replace Info, Q&A or entity owners.

Only `ПРОВЕРЕНО ГОТОВО` is normal Search/SEO/feature eligible. One guide intent → one canonical guide. Article social preview cannot become stale second fact owner.

### K. Q&A is canonical community memory

One real community question intent → one canonical knowledge center.

Moderation state is separate from canonical state.

Aliases/alternate wording:
- help search;
- resolve to canonical;
- do not own separate answers;
- do not create independent SEO pages.

### L. Duplicate prevention is bounded and non-destructive

Before final submit:
- reuse B2 normalization;
- same category/topic first;
- max ~20 candidate inspection target;
- max 3 visible suggestions;
- no per-keystroke mega-search;
- user can continue if genuinely different;
- strong duplicate can be flagged for review.

Automated logic may suggest/flag, not hard-delete/merge/rewrite.

### M. Q&A merge/canonical decisions are auditable

Duplicate → canonical linking preserves original record/history and should be reversible where reasonable. Permanent delete is not the duplicate strategy.

Moderator may only perform target reversible canonical moderation on foreign content if V6-D backend explicitly supports it safely; Moderator cannot use powers on own content. Admin/system boundaries remain.

### N. Accepted/helpful/verified are distinct

`Избран от автора` = subjective asker choice.  
`Полезен` = community usefulness signal if abuse-resistant voting is later implemented.  
`Проверена информация` = authoritative Info/Health only.

No fake `best answer` or verified badge from votes/moderation.

### O. Old/unanswered Q&A behavior

Age alone does not delete Q&A.

Time-sensitive factual answers stay dated and can be superseded by current verified Info context.

Approved unanswered canonical questions may remain public/shareable and appear onsite to prevent duplicates, but default SEO target is `noindex,follow` until useful answer/utility threshold.

### P. Q&A Search eligibility

Approved canonical/independent questions are candidates.

Aliases resolve to canonical; pending/rejected/needs_changes are never public Search results.

Answered questions are stronger community results; unanswered exact matches can appear clearly labeled to prevent duplicate asks.

### Q. Q&A canonical SEO/share/Facebook

Exactly one canonical destination per knowledge center.

Current `vapros.html?id=<id>` remains compatibility; V6-D may add lightweight server/edge share/SEO route.

Share previews use minimum necessary public text; sensitive/health descriptions are conservative. Facebook is distribution, not a trust owner.

### R. Contextual `Попитай Лом`

Search/category query can prefill editable question/category context, never auto-submit; duplicate check runs before final submit. Exact URL params/states are B9.

### S. Q&A entity mentions are not yet recommendations

Text mentioning/recommending a firm/doctor/shop/place remains Q&A-owned. Structured recommendation relation is B6. No protected entity counter is manually incremented from free text.

### T. No invented analytics baseline

Do not claim popularity/rank from unavailable first-party metrics.

### U. Performance remains a hard gate

No framework/AI/vector dependency by default; bounded requests; progressive related-owner loading; graceful failure.

---

## 6. IMPORTANT PROTECTED DEFECT — SEPARATE FROM V6-B

A2 found Moderator own-business edit mismatch between LOCKED rule and current UI/RPC behavior.

This remains a separate protected production defect candidate. Do not silently fix it during B6.

---

## 7. CURRENT EXACT TASK

# `STAGE V6-B6 — STRUCTURED RECOMMENDATION RELATION CONTRACT`

B6 must define:
1. recommendation relation identity;
2. permitted source types and source-publication requirements;
3. permitted target entity owner types;
4. entity resolution without free-text counter corruption;
5. positive recommendation vs mention/neutral/negative context;
6. moderation/approval flow;
7. self-recommendation/conflict-of-interest rules;
8. dedupe/one-user/one-source signal semantics;
9. invalidation when source or target becomes nonpublic;
10. counts derived only from valid relations;
11. category/entity/Search presentation;
12. relation with B8 ranking while preserving protected Admin/Ivanov/boost semantics;
13. privacy/abuse/performance;
14. no schema/RLS/production implementation.

Required artifact:

`PUBLIC_PRODUCT_V6_B6_STRUCTURED_RECOMMENDATION_RELATION_CONTRACT.md`

B6 exit gate:

**each recommendation signal is traceable to an approved source and resolved target owner, with explicit polarity/validity; duplicate/self/removed content cannot inflate trust; counts are derived from valid relations only; recommendation layer cannot overwrite protected owners/ranking.**

---

## 8. B6 EVIDENCE SCOPE

Use only relevant evidence:
- current Firms/Health/Shops/Restaurants/other target owner identifiers;
- current Q&A approved answer owner;
- B5 Q&A canonical/moderation rules;
- A1 owner map;
- protected Construction/Admin/Ivanov/boost rules;
- current user/content ownership evidence where needed.

Do not broad-audit unrelated modules.

---

## 9. EXECUTION PROTOCOL

- safe read/design actions autonomous;
- no repeated user context questions;
- no side missions;
- protected/risky production changes require proper approval;
- no V6 production code before gates.

At stage completion:
1. create/update artifact;
2. update Master Control;
3. update `PROJECT_PROGRESS.md`;
4. update `PUBLIC_PRODUCT_V6_NEXT_CHAT_START.md`;
5. set exactly one next task;
6. state production impact.

---

## 10. HANDOFF LINE

**Completed:** V6-0 + A1 + A2 + B1 + B2 + B3 + B4 + B5.  
**Current:** V6-B6 Structured Recommendation Relation.  
**Required artifact:** `PUBLIC_PRODUCT_V6_B6_STRUCTURED_RECOMMENDATION_RELATION_CONTRACT.md`.  
**Production impact:** NONE.