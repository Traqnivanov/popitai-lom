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

**локална търсачка + marketplace + фирми/местни обекти + Инфо Лом + статии/ръководства + contextual Q&A + структурирана памет на Лом + SEO/share/Facebook distribution layer.**

Growth loop:

`Google / Facebook / direct → Search V6 → verified Info / entity / listing / guide / canonical Q&A → ако няма достатъчен отговор, Попитай → moderation → share → нови хора → знанието остава → по-силен direct habit.`

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
13. task-specific supporting docs/evidence.

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
- B5 Q&A Canonical/Duplicate/Alias/Moderation — **CURRENT**
- B6 Structured Recommendation Relation — OPEN
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

Firms, Listings, Health/Info, Shops, Events, Q&A and other specialized owners stay authoritative for their own content. V6 connects them; it does not collapse them into a universal write table.

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

### D. Health is specialized under a common V6 shell

`Здраве и лекари` is a full V6 category and **must use the same common category/discovery/mobile/share/Facebook presentation system as the other categories**.

Current Health structure is coverage/input, not frozen V6 UI. It may be regrouped/redesigned visually.

What remains protected:
- verified Health/Info owner;
- controlled submissions/moderation;
- reliability/freshness;
- verified fact vs community opinion separation;
- no generic Listings/Firms bypass;
- no unverified medical direct publish.

Facebook/share is distribution, never a second Health fact owner.

### E. Shops and Events stay specialized

Generic Add/search must not bypass their owners. No fake Event Add flow is invented.

### F. Construction protected semantics survive

V6 presentation can change, but protected URLs/owner/Admin-Ivanov/boost rules are not casually altered.

### G. Search V6 has one owner

Current `tarsene.html` still uses legacy `script.js`; newer search code is only candidate evidence.

Target Search V6 uses one explicit owner and result families:
- route;
- verified_info;
- business;
- listing;
- shop;
- event;
- question;
- article.

It uses bounded relevant-owner queries, not all-owner mega-search.

### H. Verified Info and community opinion are different trust classes

For factual/official/health intent, authoritative verified Info precedes opinion. Q&A never becomes verified only because answers exist.

### I. Protected ranking is not demoted

Provider/Construction intent preserves protected Admin/Ivanov/boost semantics inside the proper owner composition. Factual safety intent may correctly show Info first because the user task is different.

Exact cross-owner tie/ranking mechanics are B8/V6-D work.

### J. Info mutable facts have one target truth owner

Mutable local phones/addresses/hours/schedules/directors/operational facts belong to controlled Info owner (`info_entries`/related approved Info flow).

Specialized renderers may remain, but hardcoded duplicate mutable facts are migration debt, not second truth.

### K. Info trust/freshness semantics

`publication_status` = visibility.  
`reliability_status` = trust.

Reliability:
- official;
- strong;
- secondary;
- conflict;
- unverified.

Default field-risk maximum recheck windows:
- 7 days volatile;
- 30 days operational;
- 90 days organizational;
- 180 days stable directory;
- 365 days historical/stable context.

Fresh/due/stale are derived states. Stale/conflict high-risk facts cannot become definitive verified Search answers.

`confirmed_at` means real evidence reconfirmation, not cosmetic edit.

### L. Article/Guide role is now locked

Article explains process/choice/context.

It does not replace:
- Info verified facts;
- Q&A community experience;
- Firms/Listings/Shops/Events owner records.

One main guide intent → one canonical guide.

### M. Article readiness gate

`има файл` ≠ ready.

Only `ПРОВЕРЕНО ГОТОВО` is by default eligible for:
- Search V6 article result;
- Home/category featuring;
- sitemap/SEO discovery;
- official editorial share pack.

Readiness covers value, completeness, sources, owner boundary, local value, high-stakes safety, SEO, internal links, mobile, performance, freshness and share.

Current `Как да избереш майстор...` remains `ЗА ПРЕРАБОТКА` until that gate is passed.

### N. Articles do not duplicate mutable Info truth

A guide may show a live/derived Info card later, but authoritative data remains Info-owned. Social preview also must not cache stale mutable facts as article truth.

### O. Article freshness is separate from Info freshness

Conceptual review classes:
- E365 evergreen editorial;
- P180 stable process;
- P90 administrative/regulatory;
- S30 seasonal/deadline-sensitive;
- V7 volatile/urgent — usually should live in Info/Event/official owner rather than article truth.

`updated` ≠ `reviewed`.

### P. Article Search intent order

- GUIDE_PROCESS → Article can be primary;
- AUTHORITATIVE_FACT → Info first;
- COMMUNITY_OPINION → Q&A first;
- PROVIDER_DISCOVERY → proper entity/listing owner first.

### Q. Articles participate in Facebook/share

Ready guides are first-class share assets with canonical URL/OG/share pack. B7 will lock exact Facebook Bridge mechanics.

Health guides are included in the same model while verified Health data stays specialized.

### R. No invented analytics baseline

Do not claim `most searched`, `popular`, `top` or ranking based on Popitai analytics until real first-party signals exist.

### S. Performance remains a hard gate

No framework/search SDK/AI/vector dependency by default; bounded requests; lightweight pages; graceful secondary-owner failures.

---

## 6. IMPORTANT PROTECTED DEFECT — SEPARATE FROM V6-B

A2 found Moderator own-business edit mismatch:
- LOCKED rule says Moderator own content follows normal non-Admin flow;
- current business edit UI/RPC path blocks staff, including Moderator.

This remains a separate protected production defect candidate.

Do not silently fix it during B5 or other product-contract work.

---

## 7. CURRENT EXACT TASK

# `STAGE V6-B5 — Q&A CANONICAL / DUPLICATE / ALIAS / MODERATION CONTRACT`

B5 must define:
1. canonical question identity;
2. duplicate detection before publish;
3. alternate phrasings / aliases;
4. non-destructive merge/redirect/history behavior;
5. B1 category/subcategory/topic relations;
6. verified Info vs community answer boundary;
7. accepted/best/useful-answer semantics without fake authority;
8. Admin/Moderator/self-content boundaries;
9. old/stale Q&A behavior;
10. Search V6 Q&A eligibility;
11. canonical Q&A SEO/share/Facebook behavior;
12. contextual `Попитай Лом` prefill from Search/no-result/category;
13. privacy/performance constraints;
14. no schema/RLS/production implementation.

Required artifact:

`PUBLIC_PRODUCT_V6_B5_QA_CANONICAL_DUPLICATE_ALIAS_MODERATION_CONTRACT.md`

B5 exit gate:

**one real question/topic has one canonical knowledge center; duplicate formulations do not create competing thin pages; moderation and trust boundaries are explicit; Search/SEO/share/Facebook route to canonical Q&A without treating community opinion as verified fact.**

---

## 8. B5 EVIDENCE TO USE

Use only relevant current evidence, not a broad audit:
- current `questions` / `answers` owner and public detail/list code;
- A2 Q&A moderation/self-content evidence;
- current question share/current generic metadata evidence;
- B2 Search result/intent contract;
- B3 verified Info separation;
- B4 Guide vs Q&A boundary;
- working model canonical question/duplicate protection concepts.

Do not reopen B1–B4 unless evidence proves a real contradiction.

---

## 9. EXECUTION PROTOCOL

During V6-B:
- safe read/design actions are autonomous;
- user does not need to repeat old context;
- new ideas are recorded but do not derail active stage;
- protected/risky production changes are not performed without proper approval;
- no V6 production code before gates.

At stage completion:
1. create/update stage artifact;
2. update Master Control;
3. update `PROJECT_PROGRESS.md`;
4. update `PUBLIC_PRODUCT_V6_NEXT_CHAT_START.md`;
5. record confirmed evidence and remaining risks;
6. set exactly one next task;
7. state production impact.

---

## 10. HANDOFF LINE

**Completed:** V6-0 + A1 + A2 + B1 + B2 + B3 + B4.  
**Current:** V6-B5 Q&A canonical/duplicate/alias/moderation.  
**Required artifact:** `PUBLIC_PRODUCT_V6_B5_QA_CANONICAL_DUPLICATE_ALIAS_MODERATION_CONTRACT.md`.  
**Production impact:** NONE.  
**Forbidden next action:** direct V6 production implementation before B/C/D/E gates.