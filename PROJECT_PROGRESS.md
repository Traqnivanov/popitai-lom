# Попитай.Лом — CURRENT PROJECT CHECKPOINT

Актуализирано: 02.09.2026
Branch: `v6-product-foundation-draft`

## 1. CURRENT STATUS

V6 Recovery пакетът е **готов за user review**.

Не е разрешено:

- V18 или нов visual layer;
- нов prototype implementation преди одобрение на Recovery;
- production UI/backend/schema/RLS промяна;
- merge на V6 към `main`;
- промяна на protected business logic като страничен ефект.

Production `main` не е променен от V6. V6-C не е приет и head `9add22055dfa663f585a48f094585d5bedced766` няма доказан browser/rendered PASS.

## 2. CURRENT AUTHORITY SET

Minimum read order:

1. `PROJECT_RULES_00_READ_FIRST.md`
2. `PROJECT_RULES_PROTECTED_CORE.md`
3. `PROJECT_RULES.md`
4. `PROJECT_RULES_RENDER_OWNERSHIP.md`
5. `PROJECT_RULES_ADMIN_MODERATOR.md` — само при roles/permissions/ownership/moderation/protected flow
6. `PUBLIC_MARKETPLACE_V3_APPROVED_SPEC.md`
7. `PUBLIC_PRODUCT_V6_CANONICAL_RECOVERY.md`
8. `PUBLIC_PRODUCT_V6_IMPLEMENTATION_MATRIX.md`
9. `PUBLIC_PRODUCT_V6_DOCUMENT_INDEX.md`
10. този файл

При конфликт:

`LOCKED rules → Marketplace V3/approved production specs → latest owner decision → Recovery/Matrix → task-specific source → prototype`.

## 3. RECOVERY DELIVERABLES

Готови:

- `PUBLIC_PRODUCT_V6_CANONICAL_RECOVERY.md` — една product truth, screen flow, visual direction, conflict resolution, external patterns и stages;
- `PUBLIC_PRODUCT_V6_IMPLEMENTATION_MATRIX.md` — exact groups/leaves/stored mapping/routes/owners/forms/roles/Facebook/acceptance;
- `PUBLIC_PRODUCT_V6_DOCUMENT_INDEX.md` — classification и minimum read routing за всички root Markdown документи;
- `PUBLIC_PRODUCT_V6_MASTER_CONTROL.md` — concise current roadmap;
- `PUBLIC_PRODUCT_V6_NEXT_CHAT_START.md` — safe zero-explanation handoff.

Static checks completed:

- all root Markdown files са отчетени в Document Index;
- all referenced local Markdown files съществуват;
- 22 protected service leaves + 9 other listing categories + vehicle entry са отчетени;
- четирите production V3 keys `maistori / avtomobili / uslugi / other` са отчетени;
- documentation diff check е clean.

## 4. CANONICAL PRODUCT STRUCTURE

Leading product:

`Обяви и услуги`

Един landing, четири главни групи:

1. Майстори и ремонти;
2. Автомобили;
3. Други услуги;
4. Други обяви.

Rules:

- category/subcategory cards browse/filter results;
- separate `Добави обява` carries bounded context to the protected form;
- form exposes exactly four public groups;
- `Работа` and `Имоти` are leaves under `Други обяви` with protected specialized types;
- Q&A is secondary/supporting;
- one Listing is stored once and can be composed into relevant contexts;
- Firms are permanent profiles;
- Health/Info and Shops retain specialized owners;
- Events has no fake public Add;
- `kategorii.html` remains compatibility only.

Desktop navigation:

`Начало | Обяви и услуги | Фирми | Инфо Лом | Статии | Още | Профил | + Добави`

Mobile navigation:

`Начало | Обяви | + | Инфо | Профил`

## 5. PROTECTED CORE — UNCHANGED

- Listings/Firms/Masters owners;
- Admin/Moderator permissions and self-moderation boundary;
- ownership/RLS/status/approval/direct publish;
- monthly quotas;
- media rules;
- last approved public version during normal edits;
- expanded firm access;
- Work/Property specialized types;
- Health/Info/Shops owner boundaries;
- protected Admin/Ivanov/boost priority after relevance;
- Firm ↔ Listing ↔ Construction/Ivanov relations.

Admin media truth remains:

- normal listing: up to 6 images;
- normal firm: 1 logo + up to 6 gallery images;
- Admin-owned firm/listing: no backend/Supabase image limit;
- old frontend `20` is a technical mismatch, not a new business rule.

Known separate protected defect remains separate:

- Moderator-own-business edit mismatch is not silently fixed during V6.

## 6. CURRENT V17 PROTOTYPE AUDIT

Confirmed:

- branch is ahead of `main`; production app was not changed by V6;
- `full-site.html` loads V8 runtime/controller, V9 utility route and visual layers through V17;
- active JS syntax passes and referenced active assets exist;
- no PR/status/workflow/browser evidence exists for the checked head;
- existing CI does not cover `v6-prototype/`.

Confirmed deviations:

1. separate `categories` screen duplicates the marketplace tree;
2. subcategory cards open `form-listing` instead of browse/filter;
3. public category IDs are incompletely mapped and can default incorrectly;
4. form has six public groups instead of four;
5. fake `Всички/Предлага/Търси` values can reach subcategory context;
6. old status/handoff documents described obsolete runtime layers;
7. CSS/JS layering continued before C acceptance;
8. unused legacy `v6-prototype/full-site.js` has a syntax error.

These are not permission for piecemeal patches. They are inputs to one future bounded consolidation task.

## 7. ADMIN/MODERATOR BASELINE

Admin/Moderator Panel v2 is already completed and production-QA-checked. It is not restarted as part of V6.

Keep:

- Dashboard/menu/sidebar/mobile navigation/content shells;
- role-correct UI and backend enforcement;
- Moderator self-moderation protection;
- Admin-only permanent delete;
- Admin-only roles/expanded-access management;
- Info Lom protected RPC/status boundaries;
- live rollback-only security checks where applicable.

Do not create fake QA records.

## 8. EXACT NEXT TASK

`USER REVIEW OF V6 RECOVERY PACKAGE — NO CODE`

Review together:

1. `PUBLIC_PRODUCT_V6_CANONICAL_RECOVERY.md`;
2. `PUBLIC_PRODUCT_V6_IMPLEMENTATION_MATRIX.md`.

After explicit whole-package approval, the next bounded task is:

`R1 — CONSOLIDATE THE ISOLATED V6 PROTOTYPE TO THE APPROVED FOUR-GROUP STRUCTURE`

R1 constraints:

- no V18/new visual layer;
- no production changes;
- one route/runtime/form lifecycle owner;
- one marketplace landing;
- category cards browse; Add is separate;
- exact four-group mapping;
- Info/Health parity preserved;
- CI/static checks first, then real desktop/mobile rendered review.

## 9. STOP CONDITIONS

Stop the owner only for a genuinely new decision affecting:

- roles/rights/RLS/schema;
- ownership/status/approval/direct publish;
- quotas/media limits;
- protected Firms/Listings/Masters/Admin/Ivanov behavior;
- a new write owner/form;
- removal of an approved capability.

Do not request repeated `OK` for already-authorized reading, reconciliation, documentation checks or behavior-preserving verification.
