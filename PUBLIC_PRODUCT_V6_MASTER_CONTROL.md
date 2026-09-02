# Попитай.Лом — V6 MASTER CONTROL

Статус: **RECOVERY PACKAGE READY FOR USER REVIEW — NO IMPLEMENTATION**
Branch: `v6-product-foundation-draft`
Prototype baseline: `9add22055dfa663f585a48f094585d5bedced766`
Актуализирано: 02.09.2026

## 1. CURRENT TRUTH

- Production `main` не е променен от V6.
- V6-C не е приет.
- Head `9add220` няма доказан browser/rendered PASS.
- V18, нов visual layer и production implementation са замразени.
- Documentation/product reconciliation е завършено на ниво Recovery package; текущата задача е user review без code.

Управляващи V6 recovery документи:

1. `PUBLIC_PRODUCT_V6_CANONICAL_RECOVERY.md`;
2. `PUBLIC_PRODUCT_V6_IMPLEMENTATION_MATRIX.md`;
3. `PUBLIC_PRODUCT_V6_DOCUMENT_INDEX.md`;
4. `PROJECT_PROGRESS.md`;
5. `PUBLIC_PRODUCT_V6_NEXT_CHAT_START.md`.

## 2. PRODUCT TRUTH

Водещият продукт е `Обяви и услуги`.

Има един marketplace landing и четири главни групи:

1. Майстори и ремонти;
2. Автомобили;
3. Други услуги;
4. Други обяви.

Category/subcategory cards са browse/filter navigation. Един отделен `Добави обява` отваря protected form с visible bounded prefill.

Q&A е secondary. Firms са permanent profiles. Info/Health и Shops са specialized owners. Events няма public Add.

16-те B1 thematic concepts не са второ дърво. Те са mapping/cross-links към четирите marketplace groups или specialized owners.

## 3. NAVIGATION

Desktop:

`Начало | Обяви и услуги | Фирми | Инфо Лом | Статии | Още | Профил | + Добави`

Mobile:

`Начало | Обяви | + | Инфо | Профил`

`kategorii.html` е compatibility entry към `obyavi.html`.

## 4. PROTECTED CORE

Не се променят като presentation side effect:

- Listings/Firms/Masters owners;
- Admin/Moderator boundary;
- ownership, RLS, status, approval/direct publish;
- quotas/media rules;
- last-approved-public-version edit behavior;
- expanded firm access;
- Search/Ivanov/Admin/boost priority after relevance;
- Health/Info/Shops specialized owners;
- Work/Property specialized listing types.

## 5. CURRENT PROTOTYPE FINDINGS

Current V17 must not be polished further before consolidation:

- duplicate `categories` and `marketplace` screens;
- subcategory cards incorrectly open Add form;
- incomplete 16-category→form mapping;
- six form groups instead of four;
- possible wrong default to Construction;
- stale handoff/runtime documentation;
- layered V8–V17 CSS/JS and unused broken legacy JS;
- no CI coverage for `v6-prototype/`;
- no browser acceptance evidence.

## 6. STAGE STATUS

| Stage | Status |
|---|---|
| V6-A evidence | Complete as reference |
| V6-B contracts | Complete as design sources; B1/B9 IA wording reconciled by Marketplace V3/Recovery |
| V6-C prototype | **Not accepted** |
| R0 documentation recovery | **Ready for user review** |
| R1 prototype consolidation | Blocked until Recovery user approval |
| R2 rendered review | Not started |
| V6-D technical design | Not started |
| Production implementation | Not authorized |

## 7. EXACT CURRENT TASK

`USER REVIEW OF V6 RECOVERY PACKAGE — NO IMPLEMENTATION`

Review set:

1. `PUBLIC_PRODUCT_V6_CANONICAL_RECOVERY.md`;
2. `PUBLIC_PRODUCT_V6_IMPLEMENTATION_MATRIX.md`;
3. only after explicit whole-package approval — one bounded prototype consolidation task, without V18 or production changes.

## 8. STOP RULE

Stop for the owner only on a genuinely new decision involving roles, rights, RLS, schema, ownership, status, moderation, direct publish, quota/media limits, protected priority or a new write owner/form.

Do not ask for repeated `OK` for evidence collection, reconciliation or checks already authorized by this task.
