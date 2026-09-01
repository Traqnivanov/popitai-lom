# Попитай.Лом — ТЕКУЩ CHECKPOINT

Актуализирано: 01.09.2026

## 1. ПРАВИЛА ПРЕДИ РАБОТА

Ред на четене:
1. `PROJECT_RULES_00_READ_FIRST.md`
2. `PROJECT_RULES_PROTECTED_CORE.md`
3. `PROJECT_RULES_ADMIN_MODERATOR.md`
4. `PROJECT_RULES.md`
5. `PROJECT_RULES_RENDER_OWNERSHIP.md`
6. `PUBLIC_MARKETPLACE_V3_APPROVED_SPEC.md`
7. `PUBLIC_SITE_INFORMATION_ARCHITECTURE_APPROVED_SPEC.md`
8. `ADMIN_PANEL_V2_APPROVED_SPEC.md`
9. `PUBLIC_PRODUCT_V6_MASTER_CONTROL.md`
10. `PUBLIC_PRODUCT_V6_C_FULL_SITE_INTERFACE_BLUEPRINT.md`
11. `PUBLIC_PRODUCT_V6_C_PROTECTED_ADMIN_IVANOV_REGRESSION_GATE.md`
12. `PUBLIC_PRODUCT_V6_C_FORMS_ROLES_VISIBILITY_LOCK.md`
13. `PUBLIC_PRODUCT_V6_C_FORM_GUIDANCE_VALIDATION_LOCK.md`
14. `PUBLIC_PRODUCT_V6_C_FORM_LIFECYCLE_COMPLETENESS_LOCK.md`
15. `PUBLIC_PRODUCT_V6_C_FORM_LIFECYCLE_AUDIT_MATRIX.md`

При конфликт: **LOCKED rules > approved production specs > V6 Master Control > completed V6 contracts > current V6-C contracts > older C/Home drafts.**

---

## 2. PRODUCTION — НЕПРОМЕНЕН ОТ V6 TRACK

Marketplace V3 остава current approved production model.

Desktop:
`Начало | Обяви и услуги | Фирми | Инфо Лом | Статии | Още ▼ | Профил | + Добави`

Mobile:
`Начало | Обяви | + | Инфо | Профил`

V6-C до този checkpoint **НЕ е променял production UI, Supabase schema/RLS, роли, квоти, moderation, protected owners/ranking или URLs**.

---

## 3. ЗАЩИТЕНО ЯДРО — НЕПРОМЕНЕНО

V6 не bypass-ва Firms, Listings, Masters/Construction, Shops, Health/Info, Events, Admin/Moderator, quotas/status/approval/direct-publish, protected Admin/Ivanov priority или RLS/schema/security.

Moderator own-business edit mismatch от A2 остава отделен protected defect candidate.

Admin/Ivanov protected regression gate е mandatory за C→D→E.

Admin media canonical truth:
- normal listing: до 6 снимки;
- normal firm: 1 лого + до 6 gallery снимки;
- Admin-owned firm/listing: backend/Supabase няма image limit;
- старото frontend `20` за Admin listing е техническо несъответствие, не бизнес правило.

---

## 4. COMPLETED V6 CONTRACTS

Completed:
- V6-0;
- A1/A2;
- B1–B9;
- Full-site C Blueprint;
- protected Admin/Ivanov regression gate;
- forms/roles/publication/visibility contract;
- contextual form guidance/validation contract;
- form lifecycle completeness contract;
- form-by-form lifecycle audit matrix.

B9 remains authority for exact CTA/form/owner/state semantics.

---

## 5. V6-C — PROCESS RULE

Rendered mobile review exposed that Home-only patching had:
- dropped 2 of the 6 Info Lom families;
- broken `Открий в Лом` geometry on mobile;
- simplified already approved functions/forms too aggressively.

User-required process:

**First complete the whole public product end-to-end with all approved functions/forms/buttons/links/states and complete form lifecycles. Only after completeness passes, polish individual screens.**

For protected Firm/Listing/Admin/Moderator/Ivanov logic:

**Read rules + inspect real code → adapt to V6 without changing protected semantics → if a protected change is needed, report first and wait for explicit approval.**

---

## 6. CURRENT FULL-SITE PROTOTYPE

Primary isolated prototype:
- `v6-prototype/full-site.html`;
- `v6-prototype/full-site.css`;
- `v6-prototype/full-site-runtime-v2.js`;
- `v6-prototype/full-site-functional-parity-v3.js`;
- `v6-prototype/full-site-functional-parity-v4.js`;
- `v6-prototype/full-site-functional-parity-v4.css`;
- `v6-prototype/full-site-form-guidance-validation-v5.js`;
- `v6-prototype/full-site-form-lifecycle-v6.js`;
- `v6-prototype/full-site-form-lifecycle-v6.css`;
- `v6-prototype/full-site-form-lifecycle-audit-v7.js`;
- `v6-prototype/full-site-action-guard-v1.js`.

Older `v6-prototype/index.html` / Home-v2 files remain history/reference, not current authority.

Static prototype only; no live writes.

Current prototype represents:
- Home;
- all 16 categories;
- Marketplace/Listings + detail;
- Firms + protected expanded detail;
- all six Info Lom families;
- Health;
- Shops;
- Restaurants;
- Events;
- Search states;
- Articles/Guides;
- Q&A + answer;
- Profile/Auth;
- global Add;
- Listing/Firm/Q&A/Health/Shop/Info correction/Report/Contact/Auth forms;
- role-aware Normal/Moderator/Admin Firm/Listing states;
- protected Admin/Ivanov ordering examples after relevance;
- contextual hints/errors;
- dirty/leave warning;
- visible red form error summary;
- submit lock/progress;
- green success receipt replacing editable form;
- QA-only simulated system failure with preserved entered data.

### Form lifecycle audit findings already fixed in prototype

1. **Firm dirty detection gap** — some prototype fields had no `name/id`; the old detector could miss them. `full-site-form-lifecycle-audit-v7.js` snapshots every form control by stable position plus choice/intent state.
2. **System-error state** — V6 now has a prototype-only `Тест на изпращане: грешка` mode. After valid data it shows progress, a visible red contextual failure, keeps the form/data and re-enables retry.
3. **Dirty role switch** — the audit layer also guards the prototype-only role switch when unsent form data exists.
4. Existing success behavior remains role-aware: Normal/Moderator pending vs Admin direct publication where LOCKED rules require it.

---

## 7. FORM LIFECYCLE CANONICAL STANDARD

Every applicable mutation form must have a defined:

**open context → hints → validation → dirty state → leave behavior → submit → system error → retry → success → completed state.**

Mandatory behavior:
- context must match the selected category/record/task;
- field errors appear next to the relevant field;
- first invalid field receives focus on submit;
- a visible red summary says nothing was sent;
- entered data survives validation/system errors;
- dirty content forms warn before navigation/close;
- submit is locked while processing;
- system failure keeps the editable form and enables retry;
- success hides the editable form;
- a large green `✓` receipt stays visible;
- receipt wording distinguishes `изпратено за преглед` from `публикувано`;
- success has a clear next action;
- Login/Forgot/New password do not use aggressive content dirty warnings.

Exact one-by-one matrix: `PUBLIC_PRODUCT_V6_C_FORM_LIFECYCLE_AUDIT_MATRIX.md`.

---

## 8. CURRENT EXACT TASK

# `V6-C FULL-SITE FORM LIFECYCLE COMPLETENESS + VISUAL REVIEW GATE`

Do NOT begin V6-D.

Required remaining order:
1. source/integration review of every form in the lifecycle matrix;
2. confirm no route/button/form owner is missing;
3. rendered mobile review of representative forms and lifecycle states;
4. user visual review/feedback;
5. only after full-site completeness is accepted → systematic visual polish;
6. only after V6-C acceptance → V6-D.

Minimum rendered lifecycle review:
- Listing normal + Admin;
- Firm normal + Admin;
- Question + Answer;
- Shop;
- Health add/correction;
- Report;
- Contact;
- Registration;
- one dirty-close warning;
- one normal success receipt;
- one Admin published receipt;
- one simulated system error retaining entered data.

Browser note: Opera Browser Connector was unavailable during the latest autonomous pass (`Browser not connected`), therefore this pass does **not** claim an automated rendered-browser verification.

Production impact: **NONE**.

---

## 9. NEXT MAJOR STAGE

Only after C completeness + lifecycle completeness + visual direction is accepted/refined:

# `V6-D — TECHNICAL DESIGN / SCHEMA / RLS / INDEX / MIGRATION / SEO RENDERING / PERFORMANCE`

Production target for forms must be a proper single conceptual lifecycle owner plus specialized business/data owners; do not copy prototype layering as final architecture.

---

## 10. CURRENT HANDOFF

**Completed:** V6-0, A1/A2, B1–B9, Full-site Blueprint, protected regression gate, forms/roles lock, contextual validation lock, lifecycle lock, lifecycle audit matrix, prototype lifecycle layers.  
**Current:** V6-C full-site form lifecycle completeness + rendered/user review.  
**Production:** unchanged.
