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
12. older C/Home documents only where they do not conflict with the three current C contracts above.

---

## 2. CURRENT TRUTH

Completed:
- V6-0;
- A1/A2;
- B1–B9;
- Full-site C interface blueprint;
- protected Admin/Ivanov regression gate;
- locked forms/roles/publication/visibility contract;
- isolated full-site prototype with role-aware Firm/Listing review layer.

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

For forms/roles specifically, `PUBLIC_PRODUCT_V6_C_FORMS_ROLES_VISIBILITY_LOCK.md` is now the mandatory C presentation contract. Once accepted, later visual work may improve layout/accessibility/copy but must not silently remove or change fields, buttons, quotas, role differences, approval states, direct publication or protected ordering.

### Known protected technical mismatch — DO NOT FIX SILENTLY

LOCKED rules say Admin has no limit for listing images, while current `supabase-listings.js` sets the Admin uploader to 20 and normal users to 6.

C does not change production. D/E must resolve this explicitly as a protected technical mismatch; do not turn 20 into a new business rule by assumption and do not change the LOCKED rule without user approval.

---

## 3. WHY THE C PROCESS CHANGED

Rendered mobile review exposed that Home-only patching had:
- dropped Education/Culture and Banks/ATMs from Info Lom;
- produced a broken narrow/right-side `Открий в Лом` layout;
- previously allowed unrelated prototype destinations;
- simplified existing Firm/Listing forms and role behavior too aggressively.

User explicitly requires a different process:

**First establish the whole site end-to-end with all approved functions/content/forms/buttons/links. Only after the complete product can be reviewed as one system do visual polishing and local improvements.**

For protected Firm/Listing/Admin/Moderator/Ivanov logic:

**Read rules + inspect current code → adapt to V6 presentation without changing protected semantics → if a protected change appears necessary, report it first and wait for explicit approval.**

Do not revert to piecemeal Home polishing or simplified generic forms.

---

## 4. CURRENT PROTOTYPE

Primary review prototype:
- `v6-prototype/full-site.html`
- `v6-prototype/full-site.css`
- `v6-prototype/full-site-runtime-v2.js`
- `v6-prototype/full-site-functional-parity-v3.js`
- `v6-prototype/full-site-functional-parity-v4.js` — protected Firm/Listing/role-aware review layer;
- `v6-prototype/full-site-functional-parity-v4.css`;
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
- share/contact semantics.

Static representative data only; no live writes.

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
- V6 must not downgrade protected expanded profile or lose its contact/gallery/Construction/Listings relationships.

---

## 6. EXACT CURRENT TASK

# `V6-C FULL-SITE INTERFACE COMPLETENESS + VISUAL REVIEW GATE`

Do NOT start production code or V6-D.

Review/continue in order:
1. no approved screen/category/action/form is missing;
2. every visible button/link goes to its correct destination or named non-live prototype action;
3. protected Admin Firm/Admin Listing/Ivanov Construction states are represented and do not behave as generic semantics;
4. Firm/Listing forms preserve `PUBLIC_PRODUCT_V6_C_FORMS_ROLES_VISIBILITY_LOCK.md`;
5. Home hierarchy and first viewport;
6. 16 categories + Marketplace relationship;
7. six-family Info Lom + Health parity/trust;
8. Firms/Listings/Specialized details;
9. forms/auth/pending/error/dirty states;
10. Search/Articles/Q&A/Profile connections;
11. responsive desktop/mobile system;
12. only after completeness passes, polish spacing/cards/typography/buttons per screen.

Do not treat one polished Home block as C completion.

---

## 7. CHANGE CONTROL FOR PROTECTED FORMS

After the current Firm/Listing form/role baseline is accepted:
- visual polishing is allowed;
- clearer Bulgarian copy is allowed;
- accessibility/performance fixes are allowed;
- a technical bug fix is allowed only if behavior remains protected and equivalent;
- additive improvement is allowed only if it does not silently alter business semantics.

If a proposed change affects a protected field, right, limit, approval rule, public state, Admin/Moderator difference, ranking or protected relationship:

**STOP → document exact reason/impact → ask user for explicit approval → only then implement.**

---

## 8. NEXT MAJOR STAGE

Only after full-site C completeness + visual direction is accepted/refined:

# `V6-D — TECHNICAL DESIGN / SCHEMA / RLS / INDEX / MIGRATION / SEO RENDERING / PERFORMANCE`

V6-D must map every protected behavior in both:
- `PUBLIC_PRODUCT_V6_C_PROTECTED_ADMIN_IVANOV_REGRESSION_GATE.md`;
- `PUBLIC_PRODUCT_V6_C_FORMS_ROLES_VISIBILITY_LOCK.md`

to its real implementation owner before any V6-E code migration/merge.

---

## 9. WORK MODE

- safe review/refinement autonomous where objective;
- no production deployment;
- no schema/RLS changes;
- no protected owner/ranking/role changes;
- preserve existing approved form capabilities;
- preserve Admin/Ivanov/Construction protected semantics and regression matrix;
- visible product copy in clear Bulgarian;
- do not invent current analytics/statistics or article verification.

Минимално продължение:

`@GitHub Продължи Попитай.Лом по PUBLIC_PRODUCT_V6_NEXT_CHAT_START.md. Работи автономно.`
