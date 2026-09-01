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
10. completed B1–B9 contracts
11. `PUBLIC_PRODUCT_V6_C_FULL_SITE_INTERFACE_BLUEPRINT.md`
12. `PUBLIC_PRODUCT_V6_C_PROTECTED_ADMIN_IVANOV_REGRESSION_GATE.md`
13. `PUBLIC_PRODUCT_V6_C_FORMS_ROLES_VISIBILITY_LOCK.md`
14. `PUBLIC_PRODUCT_V6_C_FORM_GUIDANCE_VALIDATION_LOCK.md`
15. `PUBLIC_PRODUCT_V6_C_FORM_LIFECYCLE_COMPLETENESS_LOCK.md`
16. `PUBLIC_PRODUCT_V6_C_FORM_LIFECYCLE_AUDIT_MATRIX.md`
17. `PUBLIC_PRODUCT_V6_C_PRODUCTION_PARITY_AUDIT.md`

При конфликт:

**LOCKED rules > approved production specs > V6 Master Control > completed B1–B9 > current V6-C contracts/audits > older C/Home drafts > prototype.**

---

## 2. PRODUCTION — НЕПРОМЕНЕН ОТ V6-C

Marketplace V3 остава current approved production baseline на `main`.

Desktop:
`Начало | Обяви и услуги | Фирми | Инфо Лом | Статии | Още ▼ | Профил | + Добави`

Mobile:
`Начало | Обяви | + | Инфо | Профил`

V6-C НЕ е променял production UI, Supabase schema/RLS, роли, квоти, moderation, protected owners/ranking или production URLs.

---

## 3. ЗАЩИТЕНО ЯДРО

Непроменено:
- Firms;
- Listings;
- Construction/Masters;
- Admin/Moderator boundary;
- quotas/status/approval/direct publication;
- expanded access;
- specialized Health/Info/Shops owners;
- protected Admin/Ivanov priority after relevance;
- Firm ↔ Listing ↔ Construction/Ivanov relations.

Admin media truth:
- normal listing: до 6 снимки;
- normal firm: 1 лого + до 6 gallery снимки;
- Admin-owned firm/listing: backend/Supabase няма image limit;
- frontend `20` = technical mismatch, not business rule.

Known separate protected defect:
- Moderator-own-business edit mismatch remains unresolved and must not be copied into V6 canonical behavior.

---

## 4. COMPLETED V6 CONTRACTS / AUDITS

Completed:
- V6-0;
- A1/A2;
- B1–B9;
- Full-site C Blueprint;
- protected Admin/Ivanov regression gate;
- forms/roles/publication/visibility lock;
- contextual form guidance/validation lock;
- full form lifecycle lock;
- form-by-form lifecycle matrix;
- **production parity audit** comparing the active V6 prototype with current `main` production code.

New authority:
`PUBLIC_PRODUCT_V6_C_PRODUCTION_PARITY_AUDIT.md`.

---

## 5. CURRENT V6-C RESULT

# V6-C IS NOT YET ACCEPTED

The source-level audit found real parity gaps. Do not proceed to pixel polish or V6-D until they are closed.

### P0 blockers

1. Docs/runtime mismatch: `full-site-form-lifecycle-audit-v7.js` exists but is not loaded by `full-site.html`.
2. Do not load v7 blindly; v6/v7 would create competing dirty/close lifecycle owners.
3. Active prototype does not actually represent all required Search states claimed by docs.
4. Profile is much too simplified versus production status/correction/resubmit flows.
5. Health/Info is much too simplified versus current verified/source/freshness/official/admission capabilities.
6. Listing/Firm media workflow is much too simplified versus current `image-upload.js` capabilities.

### P1 gaps

- Listing duplicate warning;
- Shop dynamic tabs/context/tags/classification;
- rich Info family templates/subnavigation/actions/corrections;
- Events browsing/search/Q&A/Info recovery;
- Auth password show/hide;
- bounded category/subcategory/type prefill with edit precedence;
- Add sheet accessibility interaction verification;
- Firm contextual report;
- Q&A author/date/gallery.

Exact matrix and decisions are in `PUBLIC_PRODUCT_V6_C_PRODUCTION_PARITY_AUDIT.md`.

---

## 6. IMPORTANT PRODUCTION CAPABILITIES CONFIRMED BY AUDIT

### Listings
- publisher personal/approved firm;
- quota info;
- duplicate warning;
- dependent categories/types;
- Work/Property special types;
- EUR/BGN price;
- negotiable/free;
- phone/city/street;
- media uploader;
- Admin protected controls;
- filters/sort/protected ordering.

### Media
Current production already has:
- JPG/PNG/WebP validation;
- max file size;
- client resize/optimization;
- processing preview;
- per-image errors;
- count;
- remove;
- caption;
- drag/drop;
- multiple optimized sizes.

V6 must not reduce this capability to a decorative upload button.

### Firms
- base profile + logo/gallery;
- expanded profile fields/visibility controls;
- current media edit;
- cover/gallery/contact actions;
- drafts while approved version remains;
- contextual report.

### Profile
Production has more than V6 currently shows:
- own Questions/Firms/Listings;
- pending/approved/rejected/needs changes;
- moderation notes;
- Q&A corrections/resubmit;
- Info proposals/reports/statuses;
- needs-more-info flows;
- expanded firm edit/preview.

### Health / Info
- seven Health groups;
- last confirmed/source;
- official references;
- calls/official pages;
- hospital admission/emergency/departments;
- six Info families;
- task shortcuts/subnavigation;
- correction/report.

### Shops
- six tabs;
- category-specific copy/Add;
- search/count/subcategories;
- tags/classification/custom classification;
- dirty/success lifecycle.

### Auth / shell
- password show/hide;
- forgot/reset;
- Add focus trap/Escape/backdrop/focus return;
- specialized Shop/Health add bridges.

---

## 7. INTENTIONALLY NOT COPIED 1:1

Do not restore automatically:
- old production public taxonomy as V6 IA;
- Admin frontend image cap 20;
- Moderator own-business edit bug;
- technical English labels;
- old inline/layout patterns;
- one-article limitation;
- fake ratings/verification;
- public Add Event.

Current Home also has live Listing/Firm preview sections. V6 Home has an already approved cleaner order. Those preview sections are NOT an automatic parity requirement as long as Listings/Firms remain easily discoverable through their hubs/Search. Their possible return is a later presentation decision.

---

## 8. CURRENT PROTOTYPE RUNTIME TRUTH

`v6-prototype/full-site.html` currently loads:
- `full-site-functional-parity-v4.js`;
- `full-site-runtime-v2.js`;
- `full-site-functional-parity-v3.js`;
- `full-site-form-guidance-validation-v5.js`;
- `full-site-form-lifecycle-v6.js`;
- `full-site-action-guard-v1.js`;
- lifecycle CSS.

`full-site-form-lifecycle-audit-v7.js` exists but is **not loaded**.

Therefore the current preview must NOT be described as having the v7 failure toggle/enhanced dirty/role-switch behavior.

Permanent production architecture must not copy prototype layering; follow `PROJECT_RULES_RENDER_OWNERSHIP.md`.

---

## 9. CURRENT EXACT TASK

# `V6-C PRODUCTION PARITY REMEDIATION + FULL-SITE COMPLETENESS`

Required order:
1. consolidate prototype form lifecycle behavior into one owner;
2. close P0 gaps;
3. close P1 gaps;
4. rerun source/integration parity audit;
5. rendered mobile/desktop review;
6. user full-site review;
7. systematic visual polish;
8. only after explicit C acceptance → V6-D.

C acceptance requires P0=0 and P1=0 unexplained gaps.

Production impact at this checkpoint: **NONE**.

---

## 10. HANDOFF

**Completed:** V6-0, A1/A2, B1–B9, C blueprint, protected regression gate, forms/roles lock, validation lock, lifecycle lock, lifecycle matrix, production parity audit.  
**Current:** V6-C parity remediation; do not visually finalize yet.  
**Production:** unchanged.
