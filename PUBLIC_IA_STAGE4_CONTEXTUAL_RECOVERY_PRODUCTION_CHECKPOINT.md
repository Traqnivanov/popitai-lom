# Public IA Stage 4 — contextual-add recovery production checkpoint

Date: 2026-08-30
Status: **RECOVERED / PRODUCTION CONTEXTUAL-ADD PASS**

This checkpoint supersedes the narrow completion assumption in `PUBLIC_IA_STAGE4_PRODUCTION_CHECKPOINT.md` for contextual-add acceptance. The canonical authority remains `PUBLIC_SITE_INFORMATION_ARCHITECTURE_APPROVED_SPEC.md` and the LOCKED project rules.

## Merge / deployment

- Recovery PR: **#100 — `Recover missing Stage 4 contextual add flows`**
- Merge commit: `b0594a42c937280cdc8ca1585819230a8db27b33`
- Public contextual IA workflow on `main`: SUCCESS.
- GitHub Pages build, report-build-status and deploy for the same merge commit: SUCCESS.
- No DB migration, RLS/schema, ownership, status, quota, media, moderation, Admin/Moderator or protected search write change was made.

## Owner decisions applied

- **1A:** canonical repair taxonomy remains `Боядисване`.
- **2A:** `Предложи услуга` pre-fills only `category=Услуги` + exact canonical `subcategory`; listing type remains user-selected.
- `Търся изпълнител` / `Търся услуга` may pre-fill the existing allowed type `Търси`.
- `Добави събитие` remains absent because no approved public event submission owner is proven.

The detailed owner amendment is in `PUBLIC_IA_STAGE4_CONTEXTUAL_RECOVERY_OWNER_DECISIONS.md`.

## Forensic / traceability result

The root cause was confirmed: the earlier Stage 4 checkpoint narrowed the approved Stage 4 requirement to shell/navigation + find/question CTA checks and did not test the required contextual form bridge.

The recovery matrix in `PUBLIC_IA_STAGE4_CONTEXTUAL_RECOVERY_MATRIX.md` classified the existing Stage 1–4 work as:

- **KEEP:** Stage 1 taxonomy/backend integrity, Stage 2 search, Stage 3 thematic read layer, canonical public shell/mobile nav, Health/Shops specialized owners, Admin/Moderator boundaries, protected Ivanov ranking.
- **FINISH:** category/subcategory → correct existing form → safe canonical prefill; visible task-specific actions.
- **REVERT:** only the false Stage 4 completion assumption/status. No broad code rollback.

## Implemented contextual flows

### Майстори и ремонти

All 8 canonical repair subcategories now expose:

- discovery/search;
- `Предложи услуга` → existing listing form with `Услуги + exact subcategory`;
- `Търся изпълнител` → same context + existing type `Търси`;
- `Добави фирма` → existing business form with `Майстори и ремонти` prefill;
- question remains secondary.

Canonical values remain exactly:
`Цялостни ремонти`, `Бани и плочки`, `ВиК`, `Електро`, `Покриви`, `Боядисване`, `Дограма`, `Климатици`.

### Автомобили

- all 6 canonical automotive-service subcategories have offer/seek contextual service flows through `Обяви → Услуги`;
- vehicle publication uses the existing listing form with `Автомобили и МПС` prefill;
- permanent provider uses the existing business form with `Автомобили` prefill;
- question remains secondary.

### Услуги

All 8 canonical general-service subcategories have:

- `Предложи услуга` → `Услуги + exact subcategory`, no automatic listing type;
- `Търся изпълнител` → same context + `Търси`;
- `Добави фирма` → public `Услуги`, internal compatibility `Работа и услуги`;
- secondary question.

### Магазини / Здраве / Заведения / Събития

- Shops: visible contextual `Добави магазин` delegates to the existing specialized `#addBtn` owner; no second shop flow.
- Health: existing `Добави лекар или здравна услуга` flow remains authoritative; no medical marketplace.
- Заведения: `Добави заведение` uses the existing business form with `Заведения` prefill.
- Events: no fake `Добави събитие` action was added.

## Safe prefill contract — production evidence

Production runtime checks on GitHub Pages after deployment:

1. `Майстори → ВиК → Предложи услуга`:
   - category = `Услуги`;
   - subcategory = `ВиК`;
   - listing type = `Избери тип` (owner decision 2A).
2. `Майстори → ВиК → Търся изпълнител`:
   - category = `Услуги`;
   - subcategory = `ВиК`;
   - type = `Търси`.
3. Automotive representative `Диагностика`:
   - category = `Услуги`;
   - subcategory = `Диагностика`;
   - no automatic type.
4. General-service representative `Домашна помощ`:
   - category = `Услуги`;
   - subcategory = `Домашна помощ`;
   - no automatic type.
5. Vehicle publication:
   - category = `Автомобили и МПС`;
   - no automatic type.
6. Business prefill:
   - `maistori` → `Майстори и ремонти`;
   - `avtomobili` → `Автомобили`;
   - `rabota` → public `Услуги` / internal compatibility `Работа и услуги`;
   - `zavedenia` → `Заведения`.
7. Invalid listing category/subcategory/type are ignored.
8. Valid `Услуги + ВиК` with invalid `type` keeps the valid category/subcategory but leaves type unselected.
9. Generic business prefill rejects Health (`category=zdrave` leaves category unselected), preserving the specialized health flow.
10. Edit priority: existing listing `TELEVIZOR` opened with intentionally conflicting create-prefill URL values still loaded its stored `Електроника / Продава` taxonomy. Create-prefill did not overwrite edit data.

The prefill script runs after the canonical dictionary; the dictionary has already populated the dependent subcategory select before the prefill script executes. `edit` exits create-prefill immediately.

## Automated acceptance

The contextual recovery workflow validates:

- exact canonical 8 + 6 + 8 service grouping;
- exact offer/seek URLs for all 22 service subcategories;
- business contextual links;
- vehicle listing path;
- specialized Shops/Health/Event exclusions;
- no DB/protected-core file changes;
- JavaScript syntax;
- Stage 4 shell sync compatibility;
- idempotence by a second recovery sync/check pass.

The branch and post-merge workflow completed successfully.

## Protected regression after recovery

Production search remained correct:

- `шпакловка` → `Иванов Ремонти Лом` in the Firms result;
- `работа` → marketplace `Работа`, without Ivanov injection;
- `автомивка` → `Автомобили` / `Автомивки`, without construction/Ivanov injection.

Stage 3 read/display roots and existing approved listing/business content continued to render during recovery QA.

## Data/write safety

No fake QA records were created. No production form was submitted.

The recovery does not modify:

- `supabase-listings.js` write semantics;
- business/listing ownership;
- Admin direct publish;
- ordinary-user pending flow;
- quotas;
- media limits;
- statuses/moderation;
- RLS/schema/migrations;
- Admin/Moderator;
- protected construction/Ivanov ranking.

## Stage status after recovery

**Stage 4 is restored to COMPLETE only now, after contextual-add production PASS.**

The earlier `PUBLIC_IA_STAGE4_PRODUCTION_CHECKPOINT.md` remains useful evidence for the shell/navigation portion, but it is not sufficient by itself for canonical Stage 4 acceptance.

**Stage 5 must restart from the recovered production baseline.** `PUBLIC_IA_STAGE5_QA_CHECKPOINT.md` contains useful pre-recovery evidence, but it is not final Stage 5 acceptance after this functional Stage 4 change.
