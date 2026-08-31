# Попитай.Лом — V6 MASTER CONTROL / ROADMAP / HANDOFF

Статус: **КАНОНИЧЕН КОНТРОЛЕН ДОКУМЕНТ ЗА V6 DRAFT / NO PRODUCTION CODE**  
Branch: `v6-product-foundation-draft`  
Актуализирано: 31.08.2026

Това е **единната контролна точка** за V6. Всеки нов V6 чат започва оттук след LOCKED правилата и `PROJECT_PROGRESS.md`, продължава от записания `EXACT NEXT TASK` и не започва проекта отначало.

Цел: да няма повторни одити, противоречиви чат решения, загуба на контекст или V6 production code преди архитектурата да е доказана и одобрена.

---

## 1. ТЕКУЩА ИСТИНА

### Production

Production остава на текущите approved правила и Marketplace V3.

V6 е **design / research / prototype track**.

Този V6 track до момента **НЕ е променял production**:
- UI;
- schema/RLS;
- роли;
- quotas;
- moderation;
- protected owners;
- Admin/Ivanov/boost priority;
- Health/Info ownership;
- production URLs.

### V6 цел

V6 е надграждане върху съществуващата система, не нов сайт и не giant rewrite:

**локална търсачка + marketplace + фирми/местни обекти + Инфо Лом + статии + contextual Q&A + структурирана памет на Лом + SEO/share/distribution layer.**

Growth loop:

`Google / Facebook / direct → Попитай search → verified Info / entity / listing / article / canonical Q&A → ако няма достатъчен отговор, Попитай → moderation → share → нови хора → знанието остава → по-силен search/SEO/direct habit.`

---

## 2. ЗАДЪЛЖИТЕЛЕН READ ORDER В НОВ ЧАТ

1. `PROJECT_RULES_00_READ_FIRST.md`
2. `PROJECT_RULES_PROTECTED_CORE.md`
3. `PROJECT_RULES_ADMIN_MODERATOR.md`
4. `PROJECT_RULES.md`
5. `PROJECT_RULES_RENDER_OWNERSHIP.md`
6. `PROJECT_PROGRESS.md`
7. **`PUBLIC_PRODUCT_V6_MASTER_CONTROL.md` — този документ**
8. `PUBLIC_PRODUCT_V6_B1_FINAL_IA_TAXONOMY_CONTRACT.md`
9. `PUBLIC_PRODUCT_V6_B2_SEARCH_INTENT_RESULT_CONTRACT.md`
10. `PUBLIC_PRODUCT_V6_B3_INFO_SOURCE_FRESHNESS_SEO_SEARCH_CONTRACT.md`
11. task-specific V6 supporting docs.

При конфликт:

**LOCKED rules > approved production specs > V6 Master Control > completed V6 B-contracts > V6 supporting drafts > prototypes/chat notes.**

Нов чат НЕ пита потребителя:
- „Какво правехме?“;
- „Коя версия е последна?“;
- „От къде да започна?“
ако отговорът е записан тук.

---

## 3. V6 DOCUMENT REGISTRY

### Основни product/strategy документи

- `PUBLIC_PRODUCT_V6_WORKING_MODEL.md` — продуктова архитектура, Q&A memory, relations, Facebook Bridge, search/ranking/SEO concepts.
- `PUBLIC_PRODUCT_V6_GUARDRAILS.md` — Admin/Moderator, permission parity, performance hard gate, lightweight-by-default, SUPER IDEA exception.
- `PUBLIC_PRODUCT_V6_CONTENT_SEO_STRATEGY.md` — content/SEO/internal linking/quality strategy.
- `PUBLIC_PRODUCT_V6_CONTENT_INVENTORY_RULE.md` — readiness statuses; `има файл` ≠ `проверено готово`.
- `PUBLIC_PRODUCT_V6_INFO_LOM_CORE_STRATEGY.md` — Info Lom authoritative/trust/SEO/share/freshness strategy.
- `PUBLIC_PRODUCT_V6_ADOPTION_LAUNCH.md` — adoption/Facebook distribution/business-user value.
- `PUBLIC_PRODUCT_V6_INTERACTION_FORM_LINK_CONTRACT.md` — buttons/forms/links/states/end-to-end flow contract.

### Completed evidence/contracts

- `PUBLIC_PRODUCT_V6_CURRENT_TARGET_OWNER_MAP.md` — **V6-A1 COMPLETE** owner/relationship/current→target map.
- `PUBLIC_PRODUCT_V6_A2_EVIDENCE_BASELINE.md` — **V6-A2 COMPLETE** runtime/source/data/content/protected evidence baseline.
- `PUBLIC_PRODUCT_V6_B1_FINAL_IA_TAXONOMY_CONTRACT.md` — **V6-B1 COMPLETE** final public IA/taxonomy/owner/Add/backward-URL contract.
- `PUBLIC_PRODUCT_V6_B2_SEARCH_INTENT_RESULT_CONTRACT.md` — **V6-B2 COMPLETE** one-search-owner/intent/result/query/ranking/no-result/SEO/performance contract.
- `PUBLIC_PRODUCT_V6_B3_INFO_SOURCE_FRESHNESS_SEO_SEARCH_CONTRACT.md` — **V6-B3 COMPLETE** Info authoritative-source/freshness/trust/search/SEO/share contract.

### Production truth until final V6 approval

- `PUBLIC_MARKETPLACE_V3_APPROVED_SPEC.md`
- `PUBLIC_SITE_INFORMATION_ARCHITECTURE_APPROVED_SPEC.md`
- `ADMIN_PANEL_V2_APPROVED_SPEC.md`
- `PROJECT_PROGRESS.md`
- LOCKED rules.

---

## 4. STAGE STATUS

### `V6-0 — CONTROL / CONTINUITY`
**DONE.**

### `V6-A1 — CURRENT → TARGET OWNER / RELATIONSHIP MAP`
**DONE.**

Artifact: `PUBLIC_PRODUCT_V6_CURRENT_TARGET_OWNER_MAP.md`.

A1 mapped current owner/data/moderation/search/admin/interaction/SEO/performance boundaries for the major public/backend domains.

### `V6-A2 — EVIDENCE / COVERAGE / RUNTIME BASELINE`
**DONE.**

Artifact: `PUBLIC_PRODUCT_V6_A2_EVIDENCE_BASELINE.md`.

A2 proved important current-state uncertainties by GitHub source inspection and read-only Supabase evidence. No production writes were performed.

### `V6-B — PRODUCT CONTRACTS`
**CURRENT MAJOR STAGE.**

#### `V6-B1 — FINAL IA / TAXONOMY / OWNER CONTRACT`
**DONE.**

Artifact: `PUBLIC_PRODUCT_V6_B1_FINAL_IA_TAXONOMY_CONTRACT.md`.

B1 locked the 16-category stable taxonomy, shortcuts vs taxonomy, `Открий в Лом`, owner-aware Add routes, Jobs vs Services, specialized Health/Shops/Events boundaries, backward URLs and key Find/Add/Ask semantics.

#### `V6-B2 — SEARCH V6 / RESULT COMPOSITION / INTENT ROUTING CONTRACT`
**DONE.**

Artifact: `PUBLIC_PRODUCT_V6_B2_SEARCH_INTENT_RESULT_CONTRACT.md`.

B2 locked:
- exactly one Search owner/render owner;
- lightweight normalization + curated Bulgarian/local synonyms;
- B1 taxonomy → intent routing;
- exact result families and bounded authoritative owner reads;
- verified Info vs community separation;
- deterministic group composition + owner-local ranking;
- protected Ivanov/Admin/boost-safe boundary;
- two-phase query planner and strict network/result limits;
- no-result → contextual `Попитай Лом` only after complete fallback;
- debounce/cancellation/cache/pagination/partial failure states;
- internal-search noindex/canonical policy;
- future analytics events without invented baseline;
- mobile/performance/render ownership budgets.

Production impact: **NONE**.

#### `V6-B3 — INFO SOURCE / FRESHNESS / SEO / SEARCH CONTRACT`
**DONE.**

Artifact: `PUBLIC_PRODUCT_V6_B3_INFO_SOURCE_FRESHNESS_SEO_SEARCH_CONTRACT.md`.

B3 locked:
- `info_entries` + controlled Info flow as one authoritative owner for mutable local facts;
- `info_actions` for appropriate controlled public actions;
- specialized Info page renderers may remain, but JS/HTML cannot remain a second mutable data owner;
- exact Health/Institutions/Transport/Education/Banks/Utilities source matrix;
- publication visibility vs reliability trust separation;
- `official/strong/secondary/conflict/unverified` semantics;
- default field-risk recheck windows 7/30/90/180/365 days;
- derived fresh/due/stale behavior;
- high-risk health/transport/utility stale behavior;
- `confirmed_at` = evidence reconfirmation, not generic edit time;
- correction/history/provenance contract;
- exact safe Info searchable-field whitelist for Search V6;
- stable canonical/category/detail eligibility + no thin/filter SEO tree;
- safe/fresh share contract;
- no hardcoded stale fallback on owner failure;
- no schema/RLS/production implementation.

Production impact: **NONE**.

#### `V6-B4 — ARTICLE / GUIDE CONTENT ARCHITECTURE CONTRACT`
**CURRENT EXACT STAGE.**

---

## 5. LOCKED WORKING TRUTH AFTER A1 + A2 + B1 + B2 + B3

Тези premises не се преотварят casually.

### A. Preserve the owner architecture

Firms, Listings, Health/Info, Shops, Events and their protected moderation/business rules remain separate authoritative owners. V6 connects them through search, IA and relations; it does not collapse them into a universal table.

### B. Jobs and Services are different intents

Current `rabota.html` represents Services, while real `Работа` already exists in protected Listings with job-specific listing types.

**Работа = jobs intent / Listings owner.**  
**Услуги = service offer/seek intent / Listings + Firms composition.**

### C. Property already has protected listing semantics

`Имоти` already supports selling/renting/seeking through Listings. V6 can create a stronger read/presentation entry but does not need a new property write owner.

### D. Restaurants currently use Firms owner

`Заведения` is discovery/composition over approved businesses; no separate restaurant write owner has been proven necessary.

### E. Health remains specialized

Health uses verified/published Info data and controlled health submissions. Generic marketplace write must not replace it.

### F. Shops remain specialized

`shops` has its own catalog/submission/moderation owner. Global search/discovery may expose shops, but generic Firms/Listings must not bypass that owner.

### G. Home/Marketplace presentation remains V3 in production

Production remains Marketplace V3 until V6-B/C/D/E are complete and one final approved V6 spec explicitly supersedes it.

### H. Search V6 has one explicit owner

Current `tarsene.html` still loads legacy `script.js`; `public-search-v1.js` is a useful DB-backed candidate but not active current owner and incomplete for granular Info/Shops/Events.

Target Search V6:
- maps query → B1 taxonomy + primary intent;
- queries bounded relevant owner families;
- uses result families `route`, `verified_info`, `business`, `listing`, `shop`, `event`, `question`, `article`;
- never becomes a write owner;
- never exposes non-public states;
- never creates a universal search table by implication.

### I. Verified Info and community opinion are different trust classes

For factual/health/official intent, verified Info is shown before community opinion. Q&A never receives a verified badge only because it has answers.

### J. Protected ranking survives Search V6

Search orchestration must not demote current protected Admin/Ivanov/boost semantics.

For provider/Construction intent protected priority remains inside the relevant owner composition. For factual/safety intent, authoritative Info may precede provider promotion because the user task is different.

Exact shared priority adapter/tie mechanics remain B8/V6-D work.

### K. Query/network performance is bounded

B2 locks:
- minimum 2 normalized characters;
- max accepted input 120 characters;
- suggestions 250 ms debounce;
- max 2 remote owner families for strong-intent suggestions;
- full Phase 1 max 4 concurrent remote owner queries;
- initial remote target 12 candidates/owner;
- initial visible group target 4 cards;
- explicit owner-specific `Покажи още`;
- cancellation + stale request guard;
- no all-owner mega-query per keystroke;
- no AI/vector/external search dependency by default.

### L. No-result is not partial failure

`Попитай Лом` empty CTA е позволен само след required bounded search + fallback с no usable result. Owner failure/time-out е partial/error state, не false no-result.

### M. Search parameter pages are not a second SEO tree

`tarsene.html?q=...` и arbitrary filtered states са target `noindex,follow`, не sitemap/canonical category pages.

### N. Info mutable facts have one target truth owner

B3 locks:

**mutable local Info facts → `info_entries` / controlled Info owner.**

Page-specific JavaScript може да остане render owner, но hardcoded phones/addresses/hours/schedules/directors/operational facts са migration debt, не second truth owner.

### O. Current Info source debt is proven

Current source inspection confirms:
- Health catalog is DB-driven and reliability-aware;
- Banks specialized renderer hardcodes offices/ATMs and current contacts/features;
- Transport specialized renderer hardcodes station/bus/taxi contacts and timetable snapshot;
- Education specialized renderer hardcodes schools/kindergartens/community contacts;
- Utilities is hybrid;
- Institutions has historical layered renderer debt.

B3 does not change production; it defines the later migration contract.

### P. Info publication and reliability are separate axes

`publication_status` controls public visibility.

`reliability_status` controls trust/presentation/search eligibility:
- `official`;
- `strong`;
- `secondary`;
- `conflict`;
- `unverified`.

Published does not mean every field is current/high-confidence.

### Q. Freshness is field-risk based

B3 default maximum recheck windows:
- 7 days — live/volatile;
- 30 days — operational;
- 90 days — organizational;
- 180 days — stable directory;
- 365 days — historical/stable context.

Current entry-level `confirmed_at` means the most volatile public field governs derived entry freshness until V6-D decides whether field-level metadata is justified.

### R. Stale/conflict facts do not become verified answers

Freshness state is derived conceptually as fresh/due/stale.

Stale operational health/transport/utility fields may be suppressed from answer snippets and replaced by official-source action. Conflict fields remain discoverable only without pretending the disputed value is certain.

No freshness state silently hard-deletes content.

### S. `confirmed_at` has exact target semantics

It means real evidence reconfirmation.

Current Admin generic entry edit refreshes `confirmed_at` on save; this is recorded as a semantic implementation risk. Cosmetic/structural edit must not silently refresh factual freshness in target V6.

Technical correction is deferred to V6-D.

### T. Info Search V6 field whitelist is locked

Searchable Info data is curated public-safe data such as:
- name/category/subcategory/type;
- aliases;
- specialty/practice/services/activity;
- parent organization;
- safe public address/location;
- exact supporting public phone/e-mail/official URL.

Admin notes, history, source notes, old conflicting values and arbitrary JSON are not general search-index material.

### U. Info SEO/canonical ownership is locked

Stable category/useful detail surfaces are canonical. Anchors are navigation state. Search/filter parameters are not a second SEO tree. Not every DB row automatically earns a thin detail page.

Dedicated detail pages require standalone utility, sufficient verified content, stable identity and share value.

### V. Articles must not duplicate mutable Info facts

B3 locks the boundary that Articles explain process/context, while mutable local phones/addresses/hours/current official facts remain owned by Info. B4 must now define the exact Article/Guide architecture around this boundary.

### W. Article readiness is not proven by file existence

A2 found:
- `Как да избереш майстор...` exists but is `ЗА ПРЕРАБОТКА` under V6 readiness rules;
- `Как се пенсионира човек` is `РАЗРАБОТВАНО` with `Инфо Лом → Институции → НОИ` as authoritative local backbone.

B4 must use the inventory/readiness rule and must not promote a draft into Search/SEO merely because a file exists.

### X. Dynamic detail SEO/share remains later technical work

Question/Listing/Firm static detail heads are generic today. A lightweight server-readable approved-record share/SEO layer remains a justified later V6-D target.

### Y. Current PWA evidence

A2 did not find a current manifest/service-worker/share-target implementation. V6 does not assume installed-PWA share target exists.

### Z. Popitai first-party analytics baseline is not proven

Do not invent traffic/search/category/content popularity metrics. B2/B3 define future event contracts, not a claim that they are already collected.

---

## 6. IMPORTANT PROTECTED DEFECT FOUND IN A2 — DO NOT SILENTLY FIX INSIDE V6-B

### Moderator own-business edit mismatch

Canonical LOCKED rule:
Moderator-owned firm/content follows normal non-Admin owner flow and Moderator does not become Admin for own content.

A2 found a mismatch:
- current `business-edit.js` blocks both `admin` and `moderator` from the user firm edit flow;
- current Supabase business edit RPCs also reject `is_staff()`, therefore Moderator is backend-blocked too.

This is a **real protected production-flow defect candidate**, not a V6 product idea.

Rule:
- do not hide it;
- do not change it casually during B4/content work;
- treat it as separate narrow protected fix scope when implementation approval is appropriate;
- any fix must preserve Admin special behavior and normal owner moderation/draft protections.

Q&A self-moderation, by contrast, was found correctly restricted for Moderator own content in current DB/UI evidence.

---

## 7. OPEN GAPS BEFORE PRODUCTION CODE

### V6-B product contracts

- [x] **B1 final IA/taxonomy/owner contract** — `PUBLIC_PRODUCT_V6_B1_FINAL_IA_TAXONOMY_CONTRACT.md`;
- [x] **B2 exact Search V6 contract** — `PUBLIC_PRODUCT_V6_B2_SEARCH_INTENT_RESULT_CONTRACT.md`;
- [x] **B3 Info Source/Freshness/SEO/Search contract** — `PUBLIC_PRODUCT_V6_B3_INFO_SOURCE_FRESHNESS_SEO_SEARCH_CONTRACT.md`;
- [ ] **B4 Article/Guide content architecture contract**;
- [ ] B5 Q&A canonical/duplicate/alias/moderation contract;
- [ ] B6 structured recommendation relation contract;
- [ ] B7 Facebook Bridge technical/product contract;
- [ ] B8 local relevance ranking preserving protected Admin/Ivanov/boost semantics;
- [ ] B9 exact target interaction/forms/buttons/links/state contracts.

### Later gates

- [ ] V6-C real desktop/mobile visual + interaction prototype;
- [ ] real mobile viewport QA;
- [ ] V6-D exact schema/RLS/index/migration/rollback/performance/SEO rendering design;
- [ ] V6-E one final canonical approved V6 spec;
- [ ] V6-F incremental implementation + CI/protected regression/live QA.

**No V6 production code before these gates.**

---

## 8. EXACT NEXT TASK

# `STAGE V6-B4 — ARTICLE / GUIDE CONTENT ARCHITECTURE CONTRACT`

B4 starts from A2 content evidence and locked B1/B2/B3 contracts. It must not reopen them or start production code.

### B4 must define

1. exact role of Articles vs Info vs Q&A;
2. article readiness/quality gate;
3. evergreen vs mutable local facts;
4. topic/guide architecture;
5. author/source/freshness/update semantics;
6. internal linking to Info/entities/Q&A;
7. Search V6 article eligibility;
8. canonical/SEO/share structure;
9. duplicate/thin-content prevention;
10. initial content inventory priorities without invented analytics baseline;
11. no schema/RLS/production implementation.

### B4 artifact

Create:

**`PUBLIC_PRODUCT_V6_B4_ARTICLE_GUIDE_CONTENT_ARCHITECTURE_CONTRACT.md`**

Then update this Master Control, `PROJECT_PROGRESS.md` and `PUBLIC_PRODUCT_V6_NEXT_CHAT_START.md`.

### B4 exit gate

B4 is complete only when:

**всяка Article/Guide страница има ясна роля, readiness/source/freshness truth, правилна връзка към authoritative Info/Q&A/entity owners, Search eligibility и canonical SEO value без duplicated mutable facts или thin content.**

---

## 9. NEW CHAT EXECUTION PROTOCOL

At start the assistant:

1. reads canonical rules;
2. reads `PROJECT_PROGRESS.md`;
3. reads this Master Control;
4. reads B1/B2/B3;
5. reads A2/content supporting docs only where needed for B4 evidence;
6. executes `EXACT NEXT TASK` autonomously.

It does **not** ask the user to restate project, old decisions, current branch, stage or next step.

During work:
- safe read-only/design actions are autonomous;
- protected/risky production changes are not performed unless appropriate approval exists;
- strong new ideas are recorded but do not derail active stage unless they are blockers.

At the end of a meaningful stage:
- update Master Control;
- update `PROJECT_PROGRESS.md`;
- record confirmed vs inferred;
- record defects/risks separately from product ideas;
- set one exact next task;
- state production impact truthfully.

No clean handoff without these updates.

---

## 10. INTERRUPTION / NO SIDE-MISSION RULE

A real production bug is a separate incident scope. It does not reset V6.

After an incident fix, return to the recorded exact task unless the bug disproves a V6 premise.

A new idea is captured in the correct V6 document but does not interrupt B4 unless it changes a dependency required to define Article/Guide architecture.

---

## 11. DEFINITION OF DONE

### Planning stage

Done only when key unknowns for the scope are closed, owner/rule contradictions are resolved or explicitly deferred, and the next dependency is exact.

### User flow

Done only when CTA/link/form/prefill/auth/validation/status/success/error/back/mobile/accessibility/performance behavior is defined and later tested.

### Content

Follows `PUBLIC_PRODUCT_V6_CONTENT_INVENTORY_RULE.md`. A file does not equal verified-ready content.

### Production feature

Not done until:

approved contract → implementation → tests/CI → protected regression → desktop/mobile QA → live production verification → rollback path.

---

## 12. HANDOFF LINE

**Completed:** V6-0 + V6-A1 + V6-A2 + V6-B1 + V6-B2 + V6-B3.  
**Current stage:** V6-B4 Article/Guide content architecture contract.  
**Primary evidence/contracts:** `PUBLIC_PRODUCT_V6_CURRENT_TARGET_OWNER_MAP.md` + `PUBLIC_PRODUCT_V6_A2_EVIDENCE_BASELINE.md` + `PUBLIC_PRODUCT_V6_B1_FINAL_IA_TAXONOMY_CONTRACT.md` + `PUBLIC_PRODUCT_V6_B2_SEARCH_INTENT_RESULT_CONTRACT.md` + `PUBLIC_PRODUCT_V6_B3_INFO_SOURCE_FRESHNESS_SEO_SEARCH_CONTRACT.md`.  
**Production impact:** NONE.  
**Current exact next task:** `STAGE V6-B4 — ARTICLE / GUIDE CONTENT ARCHITECTURE CONTRACT`.  
**Required new artifact:** `PUBLIC_PRODUCT_V6_B4_ARTICLE_GUIDE_CONTENT_ARCHITECTURE_CONTRACT.md`.  
**Forbidden next action:** direct V6 production implementation before B/C/D/E gates.