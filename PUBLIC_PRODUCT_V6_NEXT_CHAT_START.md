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
8. completed B1–B9 contracts, особено B3/B4/B7/B8/B9;
9. `PUBLIC_PRODUCT_V6_C_FULL_SITE_INTERFACE_BLUEPRINT.md`;
10. `PUBLIC_PRODUCT_V6_C_PROTECTED_ADMIN_IVANOV_REGRESSION_GATE.md` — mandatory C→D→E protected checkpoint;
11. `PUBLIC_PRODUCT_V6_C_FORMS_ROLES_VISIBILITY_LOCK.md` — mandatory forms/roles/publication/visibility/ranking contract;
12. `PUBLIC_PRODUCT_V6_C_FORM_GUIDANCE_VALIDATION_LOCK.md` — mandatory contextual hints/examples/errors contract;
13. `PUBLIC_PRODUCT_V6_C_FORM_LIFECYCLE_COMPLETENESS_LOCK.md` — mandatory open/dirty/close/submit/error/success/completed contract;
14. older C/Home documents only where they do not conflict with the current C contracts above.

---

## 2. CURRENT TRUTH

Completed/locked for C:
- V6-0;
- A1/A2;
- B1–B9;
- Full-site C interface blueprint;
- protected Admin/Ivanov regression gate;
- forms/roles/publication/visibility contract;
- contextual form guidance/validation contract;
- full form lifecycle/completeness contract;
- isolated full-site prototype with role-aware Firm/Listing review, contextual hints/errors and unified mutation-form lifecycle review.

Живият сайт е **непроменен от V6-C**.

Canonical navigation:
- Desktop: `Начало | Обяви и услуги | Фирми | Инфо Лом | Статии | Още | Профил | + Добави`
- Mobile: `Начало | Обяви | + | Инфо | Профил`

Stable B1 public taxonomy = 16 categories.

Canonical Info Lom top level = exactly 6 families:
1. Здраве;
2. Институции;
3. Транспорт;
4. Образование и култура;
5. Банки и банкомати;
6. Комунални и ежедневни услуги.

Health remains specialized verified owner even when visually using the common V6 shell.

No fake Event Add.
Pending/private/rejected content has no public Share.
Articles/Guides are a required product/SEO/share layer, but official production feature/search/share requires B4 `ПРОВЕРЕНО ГОТОВО`.

### LOCKED protected checkpoint

Admin Firms/Listings and Ivanov/Construction special semantics are not generic records. V6 must preserve their direct-publication/access/quota/expanded-profile/owner/ranking relationships exactly unless the user explicitly re-approves a change.

For forms/roles specifically, `PUBLIC_PRODUCT_V6_C_FORMS_ROLES_VISIBILITY_LOCK.md` is mandatory. Later visual work may improve layout/accessibility/copy but must not silently remove or change fields, buttons, quotas, role differences, approval states, direct publication or protected ordering.

For field UX, `PUBLIC_PRODUCT_V6_C_FORM_GUIDANCE_VALIDATION_LOCK.md` is mandatory: important forms keep inline field errors, blur-after-first-entry validation, live clearing after correction, first-invalid focus, preserved entered data and context-aware examples where the category changes what useful content looks like.

For complete form behavior, `PUBLIC_PRODUCT_V6_C_FORM_LIFECYCLE_COMPLETENESS_LOCK.md` is mandatory: every mutation form must have a defined opening context, pristine/dirty state, leave warning where appropriate, visible form-level error, submit lock, correct pending/published result and a completed success receipt that replaces the editable form.

### Admin images — canonical truth clarified

The backend/Supabase migration `20260825012500_enforce_non_admin_media_limits.sql` is the current source of truth:
- ordinary firm: 1 logo + up to 6 gallery images;
- ordinary/firm listing: up to 6 images;
- Admin-owned firm/listing media: **no image limit in backend**.

Therefore the LOCKED rule and Supabase already agree.

The existing `supabase-listings.js` frontend value of 20 Admin listing images is a legacy frontend mismatch, **not a business rule**. Do not change Supabase to 20 and do not redefine the rule as 20. When production V6 integration reaches this owner, remove/replace the contradictory frontend cap so it matches the canonical backend rule.

---

## 3. WHY THE C PROCESS CHANGED

Rendered mobile review exposed that Home-only patching had:
- dropped Education/Culture and Banks/ATMs from Info Lom;
- produced a broken narrow/right-side `Открий в Лом` layout;
- previously allowed unrelated prototype destinations;
- simplified existing Firm/Listing forms and role behavior too aggressively.

A second audit exposed a full-site form UX gap: a form cannot be considered complete only because it has fields and validation. The user explicitly requires the complete lifecycle to be consistent everywhere.

Current required process:

**First establish the whole site end-to-end with all approved functions/content/forms/buttons/links and complete form lifecycles. Only after the complete product can be reviewed as one system do visual polishing and local improvements.**

For protected Firm/Listing/Admin/Moderator/Ivanov logic:

**Read rules + inspect current code → adapt to V6 presentation without changing protected semantics → if a protected change appears necessary, report it first and wait for explicit approval.**

Do not revert to piecemeal Home polishing, simplified generic forms or success/error behavior that differs randomly between screens.

---

## 4. CURRENT PROTOTYPE

Primary review prototype:
- `v6-prototype/full-site.html`
- `v6-prototype/full-site.css`
- `v6-prototype/full-site-runtime-v2.js`
- `v6-prototype/full-site-functional-parity-v3.js`
- `v6-prototype/full-site-functional-parity-v4.js` — protected Firm/Listing/role-aware review layer;
- `v6-prototype/full-site-functional-parity-v4.css`;
- `v6-prototype/full-site-form-guidance-validation-v5.js` — contextual examples/hints + V6 inline validation review layer;
- `v6-prototype/full-site-form-lifecycle-v6.js` — prototype-only unified dirty/leave/validation-summary/submit/success lifecycle layer;
- `v6-prototype/full-site-form-lifecycle-v6.css` — visible error/progress/success receipt + unsaved-dialog visual system;
- `v6-prototype/full-site-action-guard-v1.js` — named safe demo behavior for static buttons.

Older `v6-prototype/index.html` + Home-v2 files are reference/history, not current completeness authority.

The top prototype strip includes a QA-only role switch:
- Обикновен;
- Модератор;
- Администратор.

This switch is **prototype-only** and never becomes production user UI.

Full-site prototype represents:
- Home Search-first flow;
- main categories + all 16 categories;
- full-width Discover Lom;
- all six Info Lom families;
- Marketplace/Listings + listing detail;
- Firms + protected expanded firm detail;
- role-aware Listing form;
- role-aware Firm form;
- normal/Moderator pending behavior;
- Admin direct-publication behavior;
- normal edit draft semantics;
- Admin edit publication semantics;
- protected Admin/Ivanov ordering example after relevance;
- Health;
- Shops;
- Restaurants;
- Events;
- Search success/partial/empty/offline/error;
- Articles/Guide detail including pension candidate;
- Q&A index/detail/unanswered;
- Profile/Auth;
- global Add;
- Q&A/Health/Shop forms;
- Info correction and generic report;
- Contact form review state;
- Forgot/New-password review states;
- share/contact semantics.

Static representative data only; no live writes.

### Prototype-only form lifecycle behavior now represented

For tracked mutation forms:
- a pristine form does not warn unnecessarily;
- after a real edit the form becomes dirty;
- `Отказ`, route navigation and supported close actions are intercepted when unsent content exists;
- an in-app warning offers `Остани във формата` / `Напусни и изтрий`;
- browser `beforeunload` is also armed for dirty content forms;
- invalid submit shows a visible red summary at the top plus field-level errors;
- entered values remain;
- valid submit enters visible `Изпращане…` and locks duplicate submission;
- success hides the editable form;
- a large green ✓ receipt stays exactly where the form was;
- receipt text distinguishes `изпратено за преглед` from `публикувано` according to represented role semantics;
- success clears dirty state;
- Login/Forgot/New password intentionally do not use aggressive content dirty warnings.

This is a C prototype behavior layer. Production D/E must implement the same contract through a proper single lifecycle owner rather than copying prototype layering.

---

## 5. LOCKED FORM / ROLE BASELINE NOW REPRESENTED

### Listing — normal user
- personal or own approved firm where real owner flow permits;
- separate personal/firm monthly quota;
- 5 personal + 5 per approved firm per calendar month;
- edit does not consume new quota;
- new submission consumes quota even if later rejected/deleted;
- no carryover;
- normal image limit 6;
- pending approval;
- published edit keeps current public version until approval;
- Work/Property special types;
- price / negotiable / free / phone / city / optional street / photos / rules.

### Listing — Moderator own content
Same non-Admin owner flow as normal user. No self-approval, no direct publication, no Admin quota/image/options exception.

### Listing — Admin
- direct publication;
- no normal monthly quota;
- no backend image limit;
- protected Admin options represented: urgent, reduced, top positioning, highlighted presentation in Bulgarian, statistics, floating contact buttons;
- Admin edit = save/publish;
- protected public ordering only after relevance.

### Firm — normal user
- name/category/phone/city/address/hours/description;
- optional logo;
- base gallery up to 6;
- pending approval;
- starts without expanded access;
- edit preserves last approved public version while draft waits.

### Firm — normal owner with Admin-granted expanded access
- short intro;
- website;
- services;
- service area;
- expanded work hours;
- individual public visibility controls;
- access is granted/removed only by Admin; owner cannot self-enable it.

### Firm — Moderator own content
Normal firm flow; no automatic expanded access, no direct publication, no self-approval.

### Firm — Admin
- direct publication;
- automatic expanded access;
- approved expanded sections represented;
- Admin-owned media uses the backend Admin exception rather than the ordinary 6-image limit;
- V6 must not downgrade protected expanded profile or lose its contact/gallery/Construction/Listings relationships.

---

## 6. CONTEXTUAL FORM GUIDANCE / ERROR / LIFECYCLE BASELINE

The current production code already contains several good pieces that must be preserved rather than rewritten blindly:
- Listings: `listing-form-validation-v2.js` + success replacement in `supabase-listings.js`;
- Firms: `business-form-validation.js` + `business-form-live-validation.js`;
- Health: `health-form-validation-v1.js` + dirty/success lifecycle in `health-submissions-v1.js`;
- Shops: `shops-form-validation-v1.js` + dirty/success lifecycle in `shops-catalog-v3.js`;
- Questions/Answers: `question-answer-validation.js` + owner submit flow;
- Info correction: `info-lom-form-ux-v1.js`;
- Signal/Contact: page-specific validation + form-hide success;
- Auth: `auth-form-validation.js`.

Audit conclusion:
- Health, Shops and Info correction are the strongest existing dirty-close/success reference patterns;
- Listings already replace the form after success but need leave protection;
- Firm add/edit need the largest lifecycle correction because success does not fully close the editable state;
- Questions/Answers need leave protection;
- Signal/Contact hide on success but need dirty leave protection;
- all important forms need the same visible red summary / green ✓ receipt language without losing their specialized context.

Q&A already provides the preferred category-aware example pattern. V6 extends that principle to Listing/Firm presentation.

In the current prototype:
- Listing examples change by Offer/Seek + main group + subcategory;
- Work, Property, Construction, Cars, Other Services and Other Listings receive different examples/help;
- Firm examples change for Construction, Restaurants/Food, Beauty and other services;
- examples remain placeholders/help only and are never user data;
- fields show specific inline errors after the user leaves/has touched them;
- after an error, correction is checked live and the error disappears when valid;
- character counters are shown where useful;
- form submission focuses the first invalid field;
- entered data remains present;
- dirty content forms warn before in-app navigation/close;
- success removes the editable state and leaves a visible receipt.

Do not regress this to generic browser-only validation or tiny off-screen success messages.

---

## 7. EXACT CURRENT TASK

# `V6-C FULL-SITE FORM LIFECYCLE COMPLETENESS + VISUAL REVIEW GATE`

Do NOT start V6-D.

Before asking the user to judge visual polish, verify the form lifecycle matrix from `PUBLIC_PRODUCT_V6_C_FORM_LIFECYCLE_COMPLETENESS_LOCK.md` across the full-site prototype.

Required order:
1. no approved screen/category/action/form is missing;
2. every visible button/link goes to its correct destination or named non-live prototype action;
3. protected Admin Firm/Admin Listing/Ivanov Construction states are represented and do not behave as generic semantics;
4. Firm/Listing forms preserve `PUBLIC_PRODUCT_V6_C_FORMS_ROLES_VISIBILITY_LOCK.md`;
5. form hints/errors preserve `PUBLIC_PRODUCT_V6_C_FORM_GUIDANCE_VALIDATION_LOCK.md`;
6. every mutation form has correct open context, dirty state, leave behavior, visible error summary, submit lock and success receipt per `PUBLIC_PRODUCT_V6_C_FORM_LIFECYCLE_COMPLETENESS_LOCK.md`;
7. check normal / Moderator / Admin result wording where role changes publication state;
8. check Contact, Report, Answer, Health, Shops and Info correction — not only Listing/Firm;
9. check Login/Registration/Forgot/New-password without adding inappropriate password dirty persistence;
10. then review Home hierarchy and first viewport;
11. 16 categories + Marketplace relationship;
12. six-family Info Lom + Health parity/trust;
13. Firms/Listings/Specialized details;
14. Search/Articles/Q&A/Profile connections;
15. responsive desktop/mobile system;
16. only after completeness passes, polish spacing/cards/typography/buttons per screen.

Do not treat one polished Home block or one working form as C completion.

### Minimum lifecycle acceptance matrix
- Listing add: invalid, dirty cancel, normal pending success, Admin published success;
- Listing edit: dirty discard + role-specific receipt;
- Firm add: success must hide editable form;
- Firm edit/expanded edit: dirty guard + completed receipt;
- Question: contextual example + dirty guard + completed receipt;
- Answer: dirty guard + completed receipt;
- Health add/correction/signal: dirty close + errors + success;
- Shop: dirty close + errors + success;
- Info correction: dirty close + errors + success;
- Report: dirty guard + success;
- Contact: dirty guard + success;
- Login: visible invalid/auth error model;
- Registration: password/confirm/consent model;
- Forgot password: privacy-safe success copy;
- New password: password-match validation.

---

## 8. CHANGE CONTROL FOR PROTECTED FORMS

After the current Firm/Listing form/role baseline is accepted:
- visual polishing is allowed;
- clearer Bulgarian copy is allowed;
- accessibility/performance fixes are allowed;
- technical fixes are allowed when they restore the canonical protected behavior;
- lifecycle unification is allowed only when specialized owner/business semantics remain unchanged;
- additive improvement is allowed only if it does not silently alter business semantics.

If a proposed change affects a protected field, right, limit, approval rule, public state, Admin/Moderator difference, ranking or protected relationship:

**STOP → document exact reason/impact → ask user for explicit approval → only then implement.**

---

## 9. NEXT MAJOR STAGE

Only after full-site C completeness + lifecycle completeness + visual direction is accepted/refined:

# `V6-D — TECHNICAL DESIGN / SCHEMA / RLS / INDEX / MIGRATION / SEO RENDERING / PERFORMANCE`

V6-D must map every protected behavior in:
- `PUBLIC_PRODUCT_V6_C_PROTECTED_ADMIN_IVANOV_REGRESSION_GATE.md`;
- `PUBLIC_PRODUCT_V6_C_FORMS_ROLES_VISIBILITY_LOCK.md`;
- `PUBLIC_PRODUCT_V6_C_FORM_GUIDANCE_VALIDATION_LOCK.md`;
- `PUBLIC_PRODUCT_V6_C_FORM_LIFECYCLE_COMPLETENESS_LOCK.md`

to its real implementation owner before any V6-E code migration/merge.

Permanent production target for forms:

**one common conceptual lifecycle owner (`PopitaiFormLifecycle`) + specialized data/business owners.**

Do not copy prototype MutationObserver/layering as production architecture; obey `PROJECT_RULES_RENDER_OWNERSHIP.md`.

---

## 10. WORK MODE

- safe review/refinement autonomous where objective;
- no production deployment during C;
- no schema/RLS changes;
- no protected owner/ranking/role changes;
- preserve existing approved form capabilities;
- preserve Admin/Ivanov/Construction protected semantics and regression matrix;
- visible product copy in clear Bulgarian;
- form success/error must be visible and understandable on mobile;
- do not invent current analytics/statistics or article verification.

Минимално продължение:

`@GitHub Продължи Попитай.Лом по PUBLIC_PRODUCT_V6_NEXT_CHAT_START.md. Работи автономно.`
