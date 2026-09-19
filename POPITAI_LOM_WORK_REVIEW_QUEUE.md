# Попитай.Лом — WORK REVIEW QUEUE

Статус: **OWNER-APPROVED INTERIM CONTROL / WORK REVIEW PENDING / NO PRODUCTION PERMISSION**
Активирано: **17.09.2026**
Контролен договор: `POPITAI_LOM_TOM_CONTROL.md`

Този файл е living operational ledger за съществената работа при недостъпен Work. Той НЕ е продуктов Master и НЕ създава сам продуктови решения.

## CURRENT CONTROL STATE

- `CONTROL MODE`: **INTERIM TOM / WORK UNAVAILABLE**
- `CURRENT TOM`: **UNASSIGNED — няма доказан валиден TOM-2 handoff в текущия review branch**
- `OWNER`: active
- `WORK STATUS`: **UNAVAILABLE / REVIEW PENDING**
- `OFFICIAL REVIEW BRANCH`: `prototype/stage2-icon-system-approval`
- `OFFICIAL BASE SHA`: `998dd878a8ddb5076261f8dd4e2dfcb8d4ddec4a`
- `LOCKED SAFETY HEAD`: `997d97504251f4cbae0693dc0cffa24d1d04da79` — **DO NOT MOVE**
- `CURRENT STAGE`: Stage 2 — content-complete/reality pass
- `CURRENT PRODUCT TASK`: direct-source verification of a very small Shops batch that should be resolvable online without OWNER local travel; one batch only
- `CURRENT CONTROL TASK`: short atomic task → durable checkpoint → Queue update → next task
- `LAST OWNER VERDICT`: **17.09.2026 — short atomic tasks with Git checkpoint after each completed bounded unit; after interruption continue from Git, never restart completed work blindly**
- `LAST COMPLETED PRODUCT WORK`: `INTERIM-T013` Shops OWNER local-check shortlist recorded in `POPITAI_LOM_SHOPS_OWNER_LOCAL_CHECK_LIST_20260919.md` at commit `1c74ac9325c2e5f900ae709f858dd0a48132adc2`; 14 bounded checks only; no data/status write
- `OPEN WR IDs`: `WR-20260917-001` through `WR-20260919-013`
- `OPEN FOUND-ISSUES`: `FI-20260917-001` through `FI-20260919-013`
- `BLOCKERS`: Work review of interim control remains pending; technical TOM guard remains non-canonical/inactive.
- `NEXT ALLOWED ACTION`: execute only `INTERIM-T014` — one small direct-source Shops verification batch for records that can be checked from official operator/site sources without OWNER local travel. No city-wide discovery, no Supabase/data/status write, no prototype/production/Stage 3.

> `CURRENT HEAD` must always be verified directly in Git at session start.

---

## CONTROL DECISIONS

### INTERIM-D001 — Work/TOM continuity
- **OWNER-approved interim / Work review pending**.
- Root control contract + living Queue; no TOM number assumption; technical guard inactive/non-canonical.

### INTERIM-D002 — Strict Execution Chat discipline
- **OWNER-approved**.
- Exact TASK ID, repo/branch/SHA, allowed/forbidden scope, ordered steps, no assumptions, stop conditions, QA and report are mandatory.
- SHA mismatch / scope expansion / RED-ZONE need => **STOP AND REPORT**.

### INTERIM-D003 — Atomic task/checkpoint discipline
- **OWNER-approved**.
- Smallest coherent task only; immediate Git checkpoint; update Queue before a materially different task.
- After interruption resume from first incomplete unit; never redo completed work blindly.

---

## TASK CHRONOLOGY

### T001 — Bootstrap continuity
**COMPLETED / WORK REVIEW PENDING** — docs-only continuity, no production/Supabase/LOCKED safety change.

### T002 — Suspicious-entity workflow
**COMPLETED** — commit `7ec17d20d62edd97aec3e49a01a22120008f2b17`; weak online signals do not auto-set active/closed.

### T003 — Existing suspicious records
**COMPLETED — NO DATA WRITE** — V1 semantics retained; no invented operational-status schema.

### T004 — Dining direct verification
**COMPLETED — BATCH A–E / DIMINISHING RETURNS** — broad dining discovery stopped after bounded verification.

### T005 — Cross-category OWNER local-check list
**QUEUED / FUTURE CONSOLIDATION** — merge category-specific lists only after relevant category audits.

### T006 — Дюнер Lab exact proposal
**COMPLETED** — `2dbc7cb569d472daa4eb7cba13f89735fb79ee47`.

### T007 — Дюнер Lab proposal audit
**COMPLETED — PASS** — `2ec9de6a4af3dd7fe4caa6340a6a87c5ee93c101`.

### T008 — Дюнер Lab research-only record
**COMPLETED — VALIDATED BOUNDED DATA WRITE** — `e6457056ae20d24855089380a4235bcf1092874d`; exact root-date + one-record diff; 14 records / 0 deterministic errors; prototype false; production false.

### T009 — Dining OWNER local-check list
**COMPLETED — NO STATUS/DATA WRITE** — `446169fdf0551ae359d20e355a23f74d37a67eb2`.

### T010 — Accommodation OWNER local-check list
**COMPLETED — NO STATUS/DATA WRITE** — `6351bf87cfb92692b8121352d1253e0ef53cc8ec`; priorities `Ривър` and `Дунав`, not `Москва`.

### T011 — Fuel/Info Lom OWNER local-check list
**COMPLETED — NO STATUS/DATA WRITE** — `15d881379606590d5790947efdfd772a6cc14bce`.
- Priority: `Кристал В` exact location/current branding/activity.
- Low priority: `Petrol 3313` current operator/status.
- LUKOIL B046/B165 are not local-check priorities because official operator evidence already closes identity/address/hours and no conflict is recorded.

### INTERIM-T012 — Existing `Магазини` content audit
- `Date`: 19.09.2026
- **COMPLETED — REPO-ONLY / NO DATA WRITE**.
- Report: `POPITAI_LOM_SHOPS_LEGACY_SEED_AUDIT_20260919.md`.
- Commit: `3c73169ffe94bd0c97c0e378b4a7240228ffaaa1`.
- Result: V2 contained 37 static records (12 food / 8 construction / 4 tech / 3 furniture / 4 clothes / 6 home); migration seeded them into `public.shops` as `approved` with generic public/migration provenance, not record-by-record current verification.
- Current V3 reads only `shops.status='approved'`; therefore legacy migration approval must not be interpreted as proof of current identity/address/phone/hours.
- Concrete internal risks recorded: multi-location brand groups, composite/alias names, vague/generic identities, shared-address candidate, and dynamic-field currentness debt.
- No record was declared active/closed; no Supabase read/write; no taxonomy/UI/prototype change.

### INTERIM-T013 — Shops OWNER local-check shortlist
- `Date`: 19.09.2026
- **COMPLETED — NO DATA/STATUS WRITE**.
- Output: `POPITAI_LOM_SHOPS_OWNER_LOCAL_CHECK_LIST_20260919.md`.
- Commit: `1c74ac9325c2e5f900ae709f858dd0a48132adc2`.
- Result: 14 bounded OWNER checks only, prioritized by identity/location/currentness value; all 37 legacy seed rows were intentionally NOT pushed to OWNER.
- National/easily official-verifiable chains were excluded from local travel unless a concrete local conflict exists.

### INTERIM-T014 — Small official-source Shops verification batch
- `Date`: 19.09.2026
- **NEXT / NOT STARTED**.
- Goal: verify a very small batch of legacy Shops records that should have direct official operator/site evidence, reducing unnecessary OWNER local checks.
- Batch must stay bounded; no city-wide rediscovery.
- Read/research only; no Supabase, record/status, prototype or production write.
- Preserve conflicts rather than selecting a value by guess.

---

## WORK REVIEW ITEMS

- `WR-001` continuity control — **PENDING**.
- `WR-002` suspicious-entity workflow — **PENDING**.
- `WR-003` strict Execution Chat discipline — **PENDING**.
- `WR-004` dining verification — **PENDING**.
- `WR-005` atomic task/checkpoint discipline — **PENDING**.
- `WR-006` Дюнер Lab proposal — **PENDING**.
- `WR-007` Дюнер Lab proposal audit — **PENDING**.
- `WR-008` Дюнер Lab inventory record — **PENDING**.
- `WR-009` dining local-check list — **PENDING**.
- `WR-010` accommodation local-check list — **PENDING**.
- `WR-011` fuel local-check list — **PENDING**.
- `WR-012` Shops legacy seed audit — **PENDING**.
- `WR-013` Shops OWNER local-check shortlist — **PENDING**.

---

## OPEN FOUND ISSUES

- `FI-001` technical TOM guard non-canonical.
- `FI-002` Kastelo likely closed/current activity uncertain.
- `FI-003` Valentino likely closed/current activity uncertain.
- `FI-004` redundant empty check branch.
- `FI-005` Дюнер Lab hours conflict.
- `FI-006` Versus phone conflict.
- `FI-007` central Register TOM/guard row pre-17.09 state.
- `FI-008` Бистро Рибката status conflict.
- `FI-009` Чайка beach closed/open conflict.
- `FI-010` ВИП СИМЕРС dining-category contamination.
- `FI-011` При близнаците cafe/store overlap.
- `FI-012` Китайски ресторант address conflict.
- `FI-013` Shops legacy migration approval is not record-by-record current verification; 37 seed rows require controlled re-verification before `approved` is treated as content truth.

---

## OWNER-APPROVED SUSPICIOUS-ENTITY RULE

- no auto-delete or auto active/closed from weak signals;
- OWNER local check may establish identity/activity status;
- phone/hours/exact address remain independent evidence fields unless OWNER checks that exact field;
- V1 remains machine-readable contract until separate schema approval.

---

## NEXT TASK CONTRACT

1. execute only `INTERIM-T014` — one small official-source Shops verification batch;
2. choose only records where direct operator/site evidence should resolve current identity/location without OWNER travel;
3. no broad rediscovery and no more than one bounded batch;
4. preserve any conflict as conflict; do not guess;
5. no record/data/status write;
6. checkpoint findings immediately;
7. Execution Chat delegation, if any, must satisfy `INTERIM-D002`;
8. central Register is not claimed synchronized until Work resolves `FI-007`;
9. after interruption continue from first incomplete atomic unit only.
