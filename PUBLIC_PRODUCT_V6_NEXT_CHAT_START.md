# Попитай.Лом — V6 NEXT CHAT START

Статус: **START HERE / ZERO-EXPLANATION HANDOFF**  
Branch: `v6-product-foundation-draft`  
Актуализирано: 01.09.2026

Работим по `Traqnivanov/popitai-lom`.

Не прави нов repo/clone и не започвай проекта отначало.

## 1. ПРОЧЕТИ ПЪРВО

1. `PROJECT_RULES_00_READ_FIRST.md`
2. `PROJECT_RULES_PROTECTED_CORE.md`
3. `PROJECT_RULES_ADMIN_MODERATOR.md`
4. `PROJECT_RULES.md`
5. `PROJECT_RULES_RENDER_OWNERSHIP.md`
6. `PROJECT_PROGRESS.md`
7. `PUBLIC_PRODUCT_V6_MASTER_CONTROL.md`
8. completed B1–B9 contracts, особено B3/B4/B7/B8/B9
9. `PUBLIC_PRODUCT_V6_C_FULL_SITE_INTERFACE_BLUEPRINT.md`
10. `PUBLIC_PRODUCT_V6_C_PROTECTED_ADMIN_IVANOV_REGRESSION_GATE.md`
11. `PUBLIC_PRODUCT_V6_C_FORMS_ROLES_VISIBILITY_LOCK.md`
12. `PUBLIC_PRODUCT_V6_C_FORM_GUIDANCE_VALIDATION_LOCK.md`
13. `PUBLIC_PRODUCT_V6_C_FORM_LIFECYCLE_COMPLETENESS_LOCK.md`
14. `PUBLIC_PRODUCT_V6_C_FORM_LIFECYCLE_AUDIT_MATRIX.md`
15. `PUBLIC_PRODUCT_V6_C_PRODUCTION_PARITY_AUDIT.md`
16. older C/Home documents only when they do not conflict with the contracts above

При конфликт:

**LOCKED rules > approved production specs > V6 Master Control > completed B1–B9 > current V6-C contracts/audits > older C/Home drafts > prototype implementation.**

---

## 2. CURRENT TRUTH

Completed/locked:
- V6-0;
- A1/A2;
- B1–B9;
- Full-site C Blueprint;
- protected Admin/Ivanov regression gate;
- forms/roles/publication/visibility lock;
- contextual form guidance/validation lock;
- full form lifecycle lock;
- form-by-form lifecycle matrix;
- source-level V6 prototype + production parity audit.

**V6-C is NOT yet accepted.**

Current C is blocked on the P0/P1 gaps in `PUBLIC_PRODUCT_V6_C_PRODUCTION_PARITY_AUDIT.md`.

Production/main is unchanged by V6-C.

Canonical navigation:
- Desktop: `Начало | Обяви и услуги | Фирми | Инфо Лом | Статии | Още | Профил | + Добави`
- Mobile: `Начало | Обяви | + | Инфо | Профил`

Stable V6 public taxonomy = 16 categories.

Info Lom top level = exactly 6 families:
1. Здраве;
2. Институции;
3. Транспорт;
4. Образование и култура;
5. Банки и банкомати;
6. Комунални и ежедневни услуги.

No fake public `Добави събитие`.

---

## 3. LOCKED / PROTECTED CHECKPOINT

Admin Firms/Listings and Ivanov/Construction are not generic records.

V6 must preserve unless user explicitly approves a protected change:
- Normal/Moderator approval flow;
- Moderator own-content = normal non-Admin owner flow;
- Admin direct publication;
- quotas;
- expanded firm access;
- Admin protected options;
- last-approved-public-version behavior during normal edits;
- protected Admin/Ivanov priority only after relevance;
- Firm ↔ Listing ↔ Construction/Ivanov relationships;
- Health/Info/Shops specialized owners.

Admin media canonical truth:
- normal listing: up to 6 images;
- normal firm: 1 logo + up to 6 gallery images;
- Admin-owned firm/listing: no backend/Supabase image limit;
- old frontend `20` is a technical mismatch, not a business rule.

Known separate protected defect:
- Moderator-own-business edit mismatch remains a separate protected fix candidate. Do not silently fix during V6.

If a proposed change affects role/right/quota/status/direct publication/moderation/owner/RLS/schema/protected ranking/Ivanov relation: **STOP → report exact impact → wait for explicit approval.**

---

## 4. CURRENT PROTOTYPE — WHAT REALLY LOADS

Primary prototype: `v6-prototype/full-site.html`.

Currently loaded prototype layers:
- `full-site-functional-parity-v4.js`
- `full-site-runtime-v2.js`
- `full-site-functional-parity-v3.js`
- `full-site-form-guidance-validation-v5.js`
- `full-site-form-lifecycle-v6.js`
- `full-site-action-guard-v1.js`
- `full-site-form-lifecycle-v6.css`

`full-site-form-lifecycle-audit-v7.js` **exists but is NOT loaded by `full-site.html`.**

Therefore do NOT claim the current preview already provides the v7 QA failure toggle / enhanced dirty tracking / dirty role-switch guard.

Do NOT simply load v7 on top of v6: both own dirty/close/beforeunload behavior. Consolidate the missing behavior into one prototype lifecycle owner instead.

Prototype layering is C-only. Production target must follow `PROJECT_RULES_RENDER_OWNERSHIP.md` with one renderer/lifecycle owner per relevant root.

---

## 5. PRODUCTION PARITY AUDIT — MAIN OPEN GAPS

Authoritative list: `PUBLIC_PRODUCT_V6_C_PRODUCTION_PARITY_AUDIT.md`.

### P0 — blocks C acceptance

1. Prototype lifecycle docs/runtime mismatch; one lifecycle owner required.
2. Real system-error state must be testable while preserving entered data.
3. Search required B2 states/recovery are not actually represented in active prototype.
4. Profile is too simplified — missing important status/correction/resubmit ecosystem.
5. Health is too simplified — missing verified richness, source/freshness, official links, hospital admission and important actions.
6. Listing/Firm media workflow is too simplified — production already has preview/remove/count/errors/caption/drag-drop/optimization/current-media behavior.

### P1 — must complete before C acceptance

7. Listing duplicate-warning state.
8. Shops dynamic tabs/context/subcategories/tags/classification.
9. Rich Info family templates/subnavigation/actions/source/freshness/correction.
10. Events browse/search/Q&A/Info recovery without public Add Event.
11. Auth show/hide password parity.
12. Bounded context prefill: edit > category/subcategory/type prefill > blank create.
13. Global Add focus trap/Escape/backdrop/focus return review.
14. Firm contextual report action.
15. Q&A author/date/gallery representation.

### P2 — only after functional completeness

- decide whether Home needs secondary live Listing/Firm previews;
- typography/spacing/card polish;
- fine desktop/mobile visual tuning.

---

## 6. IMPORTANT CURRENT PRODUCTION CAPABILITIES — DO NOT LOSE

### Listings
- personal vs own approved firm publisher;
- quota display;
- duplicate warning;
- dependent category/subcategory/type;
- Work/Property special types;
- EUR/BGN price presentation;
- negotiable/free;
- city/street;
- current media workflow;
- Admin-only protected controls;
- filters/sort/active eligibility/protected ordering.

### Firms
- base fields + logo/gallery;
- expanded profile fields/visibility controls;
- current media edit/replace/remove;
- cover/gallery/contact actions;
- contextual report;
- pending draft while approved public version remains.

### Profile
- My questions/firms/listings;
- pending/approved/rejected/needs changes;
- moderation notes;
- Q&A corrections/resubmit;
- Info proposals/reports/statuses;
- needs more information + resubmit;
- expanded firm edit/preview.

### Health / Info
- seven Health groups;
- last confirmed/source;
- official references;
- call/official page actions;
- hospital admission/emergency/department information;
- six Info families;
- task shortcuts;
- subnavigation;
- correction/report flows.

### Shops
- six tabs;
- category-specific title/Add/context;
- search/count/subcategories;
- tags/classification/custom classification;
- dirty/success lifecycle.

### Auth
- show/hide password;
- forgot/reset;
- password confirmation;
- terms/privacy.

### Public shell
- exact mobile nav;
- Add focus trap;
- Escape/backdrop close;
- focus return;
- specialized Shop/Health owner actions.

---

## 7. DO NOT COPY 1:1 FROM PRODUCTION

- old public taxonomy/dictionary as V6 IA;
- frontend Admin image cap `20`;
- Moderator-own-business edit bug;
- technical English labels;
- one-article limitation;
- old inline/style/layout decisions;
- fake ratings/verification;
- public Add Event;
- prototype multi-renderer layering as production architecture.

Current Home contains live Listing/Firm previews. V6 Home has an already approved cleaner order. Do not restore those sections automatically; preserve the capability through Marketplace/Firms/Search and decide later whether a secondary preview is useful.

---

## 8. EXACT CURRENT TASK

# `V6-C PRODUCTION PARITY REMEDIATION + FULL-SITE COMPLETENESS`

Do NOT start V6-D and do NOT begin pixel-level visual polish.

Required order:
1. fix prototype/documentation runtime mismatch without adding a second lifecycle owner;
2. implement P0 parity representation;
3. implement P1 parity representation;
4. source/integration audit again;
5. representative rendered mobile/desktop review;
6. user full-site review;
7. systematic visual polish only after functional completeness;
8. V6-D only after explicit C acceptance.

C acceptance requires:
- P0 = 0 open;
- P1 = 0 unexplained;
- important current production capabilities represented or explicitly superseded/relocated;
- protected regression gate intact;
- docs/runtime agree;
- representative rendered review completed.

---

## 9. WORK MODE

- safe prototype/docs remediation autonomous;
- no production deployment in C;
- no Supabase schema/RLS writes;
- no protected business-rule changes without approval;
- visible product copy in clear Bulgarian;
- do not call something browser-tested when browser rendering was not actually available;
- do not call C complete until parity audit is closed.

Минимално продължение:

`@GitHub Продължи Попитай.Лом по PUBLIC_PRODUCT_V6_NEXT_CHAT_START.md. Работи автономно.`
