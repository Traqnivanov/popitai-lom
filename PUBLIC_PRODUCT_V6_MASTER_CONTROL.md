# Попитай.Лом — V6 MASTER CONTROL / ROADMAP / HANDOFF

Статус: **КАНОНИЧЕН КОНТРОЛЕН ДОКУМЕНТ ЗА V6 DRAFT / NO PRODUCTION CODE**  
Branch: `v6-product-foundation-draft`  
Актуализирано: 31.08.2026

Това е **единната контролна точка** за V6. Всеки V6 чат започва оттук след LOCKED правилата и `PROJECT_PROGRESS.md`, работи само по записания stage и преди clean handoff актуализира този документ.

Целта е да няма работа „по чатове“, повторни одити, преотваряне на вече затворени решения или нов код върху непроверена архитектура.

---

## 1. ТЕКУЩА ИСТИНА

### Production

Production остава на текущите approved правила и Marketplace V3. V6 е **design/research/prototype track**.

Този track не е променял production UI, schema, RLS, роли, quotas, moderation, protected owners, Admin/Ivanov priority, Health/Info ownership или production URLs.

### V6 цел

V6 е надграждане върху съществуващата система, не нов сайт:

**локална търсачка + marketplace + фирми/местни обекти + Инфо Лом + статии + contextual Q&A + структурирана памет на Лом + SEO/share/distribution layer.**

Growth loop:

`Google / Facebook / direct → Попитай search → verified Info / entity / listing / article / canonical Q&A → ако няма достатъчен отговор, Попитай → moderation → share → нови хора → знанието остава → по-силен search/SEO/direct habit.`

---

## 2. ЗАДЪЛЖИТЕЛЕН READ ORDER

1. `PROJECT_RULES_00_READ_FIRST.md`
2. `PROJECT_RULES_PROTECTED_CORE.md`
3. `PROJECT_RULES_ADMIN_MODERATOR.md`
4. `PROJECT_RULES.md`
5. `PROJECT_RULES_RENDER_OWNERSHIP.md`
6. `PROJECT_PROGRESS.md`
7. `PUBLIC_PRODUCT_V6_MASTER_CONTROL.md`
8. task-specific V6 supporting docs.

При конфликт:

**LOCKED rules > approved production specs > V6 master control > V6 supporting drafts > prototypes/chat notes.**

---

## 3. V6 DOCUMENT REGISTRY

### Product / strategy foundations

- `PUBLIC_PRODUCT_V6_WORKING_MODEL.md` — product architecture, Q&A memory, relationships, Facebook Bridge, search/ranking/SEO concepts.
- `PUBLIC_PRODUCT_V6_GUARDRAILS.md` — Admin/Moderator, permission parity, lightweight-by-default, performance hard gate, SUPER IDEA exception.
- `PUBLIC_PRODUCT_V6_CONTENT_SEO_STRATEGY.md` — evergreen/local content, SEO, internal linking, quality gate.
- `PUBLIC_PRODUCT_V6_CONTENT_INVENTORY_RULE.md` — readiness statuses; `има файл` ≠ `проверено готово`.
- `PUBLIC_PRODUCT_V6_INFO_LOM_CORE_STRATEGY.md` — Info Lom positioning, SEO/trust/share/freshness/topic-cluster strategy.
- `PUBLIC_PRODUCT_V6_ADOPTION_LAUNCH.md` — habit-change, positioning `Лом на едно място`, Facebook distribution, business/user value.
- `PUBLIC_PRODUCT_V6_INTERACTION_FORM_LINK_CONTRACT.md` — button/link/form/state/end-to-end flow contract.

### Current-system evidence

- **`PUBLIC_PRODUCT_V6_CURRENT_TARGET_OWNER_MAP.md`** — V6-A1 current→target owner/relationship map with code/rules evidence, interaction findings and protected boundaries.

### Production truth until final V6 approval

- `PUBLIC_MARKETPLACE_V3_APPROVED_SPEC.md`
- `PUBLIC_SITE_INFORMATION_ARCHITECTURE_APPROVED_SPEC.md`
- `ADMIN_PANEL_V2_APPROVED_SPEC.md`
- `PROJECT_PROGRESS.md`
- LOCKED rules.

---

## 4. STAGE STATUS

### `STAGE V6-0 — CONTROL / CONTINUITY`

**DONE.**

Established:
- one master control;
- canonical read order;
- decision hierarchy;
- clean handoff protocol;
- interruption/no-side-mission rules;
- Definition of Done.

### `STAGE V6-A1 — CURRENT → TARGET OWNER / RELATIONSHIP MAP`

**DONE FOR STATIC PLANNING EVIDENCE.**

Artifact:
`PUBLIC_PRODUCT_V6_CURRENT_TARGET_OWNER_MAP.md`

A1 mapped:
- shell/navigation/home;
- taxonomy;
- public search implementations;
- Info Lom + subowner model;
- Articles;
- Q&A;
- Firms/basic+expanded/edit ownership;
- Listings/Marketplace;
- Masters/Construction;
- Cars;
- Services vs Jobs;
- Property;
- Health;
- Shops;
- Restaurants;
- Events;
- Profile;
- Admin/Moderator;
- SEO/detail rendering;
- sharing;
- PWA current evidence;
- Analytics current evidence;
- buttons/forms/links/states/render-ownership concerns.

A1 exit gate is satisfied at owner level: no major public domain is left as an unexplained new owner. Remaining uncertainties require runtime/content evidence, so they are moved to A2 instead of reopening A1.

---

## 5. IMPORTANT A1 DISCOVERIES

These findings are now part of the V6 working truth until disproved by A2 runtime evidence.

### A. Preserve the owner architecture

Firms, Listings, Health/Info, Shops and Events already have meaningful separate ownership/moderation. V6 should connect them; it should not collapse them into a universal table.

### B. Info Lom is already structurally capable of being the authoritative core

Current Info data/model includes publication/reliability/confirmation concepts and controlled correction/submission flows. Articles/Q&A should reference it rather than duplicate mutable verified facts.

### C. Health stays specialized

Health catalog uses verified/published Info data and specialized submissions. Generic marketplace write must not replace this.

### D. Shops stay specialized

`shops` has its own catalog/tags/groups/submission/moderation flow. Global discovery/search may expose it, but generic Firms/Listings must not bypass the owner.

### E. Restaurants currently use Firms owner

`Заведения` is currently a category/read composition over approved `businesses` + Q&A. No separate restaurant write owner was proven. V6 should improve discovery before inventing another database.

### F. Jobs vs Services must be separated in public IA

Current `rabota.html` actually represents **Услуги**. Real `Работа` already exists as a protected Listing category with job-specific types. V6 target must distinguish:

**Работа = jobs intent / Listings owner.**  
**Услуги = offer/seek service intent / existing service listing + firm owners.**

### G. Property already has Listing semantics

`Имоти` exists in the protected listing taxonomy with sell/rent/seek types; no dedicated property write owner is needed. A V6 `Имоти` page should be a read/presentation layer.

### H. Home still carries old parallel category presentation

`index.html` still contains the older equal-category hub and compatibility links through `kategorii.html`. V6 needs one approved landing presentation rather than more incremental patches.

### I. Search activation is not yet proven

Two implementations exist:
- legacy search in `script.js`, which `tarsene.html` currently loads;
- newer DB-backed `public-search-v1.js`.

Static source audit did **not** find an activation reference for `public-search-v1.js` in `tarsene.html`, `index.html` or `public-shell-v1.js`. A2 must establish the real runtime owner before Search V6 is designed. Previous assumptions that the newer file is automatically active are not accepted without proof.

### J. Global Info search is not yet granular

The newer search implementation knows whole Info pages statically, while `info.html` has granular `info_entries` search. V6 should make verified Info records first-class global results with a controlled query budget.

### K. Dynamic detail SEO/share needs a server-readable layer

`vapros.html`, `obqva.html` and `firma.html` start with generic static title/description. Client rendering is not enough to guarantee correct per-record social previews/canonical metadata. The existing V6 edge/share-render idea is therefore technically justified, subject to performance design.

### L. Render layering must not grow

Concrete consolidation candidates include:
- home business cards rendered then decorated through MutationObserver/delayed lookup;
- known Info Banks multi-render chain;
- legacy/new search ambiguity;
- shell source + runtime patches.

Do not add more patch layers in V6.

### M. Interaction flow remains a first-class gate

A screen is not ready because it looks right. Every target flow must be traced:

`ENTRY → CTA → destination/prefill → auth → owner → fields → validation → submit → status → success/error → back/cancel → mobile → accessibility → analytics → performance`.

---

## 6. CURRENT OPEN GAPS BEFORE PRODUCTION CODE

### A2 evidence/inventory gaps

- [ ] prove active global Search runtime owner;
- [ ] Info Lom coverage/freshness/SEO inventory;
- [ ] Article/Guide inventory by readiness status;
- [ ] verify dynamic detail share/SEO behavior;
- [ ] verify Q&A Moderator self-content backend/UI behavior read-only;
- [ ] verify Moderator own-business edit behavior read-only;
- [ ] verify Q/Firm/Info share handlers;
- [ ] confirm current PWA/service-worker/manifest absence/presence;
- [ ] identify Popitai first-party analytics source and baseline, if one exists.

### V6-B product contracts still missing

- [ ] final IA/taxonomy/shortcuts/`Открий в Лом` contract;
- [ ] exact Search V6 contract;
- [ ] Info Lom SEO/search/content contract from A2 evidence;
- [ ] Q&A canonical/duplicate/alias/moderation contract;
- [ ] structured recommendation relation contract;
- [ ] Facebook Bridge technical/product contract;
- [ ] local relevance ranking preserving protected Admin/Ivanov/boost semantics;
- [ ] freshness/recheck contract;
- [ ] exact interaction/form/link/state contracts for target screens.

### Later gates

- [ ] V6-C real desktop/mobile visual/interaction prototype + real mobile viewport QA;
- [ ] V6-D schema/RLS/index/migration/rollback/performance/SEO render design;
- [ ] V6-E one final canonical approved spec;
- [ ] V6-F incremental implementation + CI/protected regression/live QA.

No V6 production code before these gates.

---

## 7. EXACT NEXT TASK

# `STAGE V6-A2 — EVIDENCE / COVERAGE / RUNTIME BASELINE`

A new chat must continue in this exact order unless the user explicitly changes priority:

1. **Search runtime proof** — identify which search implementation actually owns current behavior; no writes.
2. **Info Lom inventory** — topic/subowner/current coverage/source/freshness/status/SEO intent/share potential.
3. **Article/Guide inventory** — existing, developed, Info-backed, missing; apply readiness rule.
4. **SEO/share runtime current-state** — question/listing/firm/Info metadata and share handlers.
5. **Protected interaction verification** — Q&A Moderator self-content and Moderator own-business edit, read-only evidence only.
6. **PWA current state** — manifest/service worker/share target presence/absence.
7. **Analytics source/baseline** — identify real Popitai first-party source; if unavailable, record it as unavailable rather than inventing metrics.
8. Write `PUBLIC_PRODUCT_V6_A2_EVIDENCE_BASELINE.md`, update this Master Control and `PROJECT_PROGRESS.md`.

A2 exit gate:

**we know what content/evidence currently exists, which runtime paths are active, what is only planned, and which measurements are actually available.**

Then move to V6-B product contracts.

---

## 8. NEW CHAT PROTOCOL

At start:
- read canonical rules/order;
- read `PROJECT_PROGRESS.md`;
- read this Master Control;
- inspect current branch/code only where the exact task requires it;
- execute `EXACT NEXT TASK` autonomously.

Do not ask “какво правехме?”, “коя версия е последна?” or restart old audits when the answer is recorded here.

At end of a meaningful stage:
- update status ledger;
- record confirmed vs inferred;
- record new risks/decisions;
- set exact next task;
- record production untouched/changed;
- link new supporting documents.

No clean handoff without this update.

---

## 9. DECISION DISCIPLINE

LOCKED/approved decisions reopen only for:
- proven defect;
- strong evidence-based new solution;
- explicit protected/business approval when required.

Working V6 ideas remain `WORKING` until inventory + contract + prototype + technical impact + approval.

Rejected/replaced important ideas are documented with reason; they are not silently forgotten so another chat does not rediscover them.

---

## 10. INTERRUPTION / NO SIDE-MISSION RULE

A real production bug is a separate incident scope. Fixing it does not reset V6. After the incident, return to the recorded exact next task unless the bug disproves a V6 premise.

A good new idea is recorded in the correct document/gap. It does not interrupt the current stage unless it is a blocker or architectural dependency.

---

## 11. DEFINITION OF DONE

### Planning stage

Done only when key unknowns for that scope are closed, owner/rules contradictions are resolved or explicitly deferred, and the next dependency is exact.

### User flow

Done only when CTA/link/form/prefill/auth/validation/status/success/error/back/mobile/accessibility/performance behavior is defined and, at implementation stage, tested.

### Content

Follows `PUBLIC_PRODUCT_V6_CONTENT_INVENTORY_RULE.md`. A file or prior chat discussion does not equal verified-ready content.

### Production feature

Not done until approved contract → implementation → tests/CI → protected regression → desktop/mobile QA → live production verification → rollback path.

---

## 12. HANDOFF LINE

**Completed:** V6-0 control/continuity + V6-A1 owner/relationship static audit.  
**Primary A1 artifact:** `PUBLIC_PRODUCT_V6_CURRENT_TARGET_OWNER_MAP.md`.  
**Production impact:** NONE.  
**Current exact next task:** `STAGE V6-A2 — EVIDENCE / COVERAGE / RUNTIME BASELINE`.  
**Forbidden next action:** direct V6 production implementation before V6-B/C/D/E gates.