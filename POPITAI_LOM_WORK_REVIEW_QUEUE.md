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
- `CURRENT PRODUCT TASK`: fuel/Info Lom OWNER local-check list from already existing inventory evidence; no new discovery
- `CURRENT CONTROL TASK`: short atomic task → durable checkpoint → Queue update → next task
- `LAST OWNER VERDICT`: **17.09.2026 — short atomic tasks with Git checkpoint after each completed bounded unit; after interruption continue from Git, never restart completed work blindly**
- `LAST COMPLETED PRODUCT WORK`: `INTERIM-T010` accommodation OWNER local-check list recorded in `POPITAI_LOM_ACCOMMODATION_OWNER_LOCAL_CHECK_LIST_20260917.md` at commit `6351bf87cfb92692b8121352d1253e0ef53cc8ec`; no status/data write
- `OPEN WR IDs`: `WR-20260917-001` through `WR-20260917-010`
- `OPEN FOUND-ISSUES`: `FI-20260917-001` through `FI-20260917-012`
- `BLOCKERS`: Work review of interim control remains pending; technical TOM guard remains non-canonical/inactive.
- `NEXT ALLOWED ACTION`: execute only `INTERIM-T011` — build a fuel/Info Lom OWNER local-check list from current inventory evidence only. No web discovery, no inventory status/data write, no prototype/production/Supabase/Stage 3.

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

### INTERIM-T001 — Bootstrap continuity
- **COMPLETED / WORK REVIEW PENDING**.
- Docs-only continuity mechanism; no production/Supabase/LOCKED safety change.

### INTERIM-T002 — Suspicious-entity workflow
- **COMPLETED / WORK REVIEW PENDING**.
- Commit `7ec17d20d62edd97aec3e49a01a22120008f2b17`.
- Weak online signals do not auto-set active/closed; OWNER local verification resolves real-world status.

### INTERIM-T003 — Existing suspicious records
- **COMPLETED — NO DATA WRITE**.
- Existing V1 semantics retained; no invented operational-status schema.

### INTERIM-T004 — Dining direct verification
- **COMPLETED — BATCH A–E / DIMINISHING RETURNS**.
- Batch A–D through `07462c5546165e973f192dae735b1730aefd1541`; Batch E `7f9d1c2c45b13cd190565d8301b78f74cd1d1738`.
- Broad dining discovery stopped; direct/conflict/local-check pool established.

### INTERIM-T005 — Cross-category OWNER local-check list
- **QUEUED / FUTURE CONSOLIDATION**.
- Merge category-specific suspicious lists only after those lists are ready.

### INTERIM-T006 — Дюнер Lab exact proposal
- **COMPLETED**.
- Commit `2dbc7cb569d472daa4eb7cba13f89735fb79ee47`.

### INTERIM-T007 — Дюнер Lab proposal audit
- **COMPLETED — PASS**.
- Commit `2ec9de6a4af3dd7fe4caa6340a6a87c5ee93c101`.

### INTERIM-T008 — Дюнер Lab research-only record
- **COMPLETED — VALIDATED BOUNDED DATA WRITE**.
- Commit `e6457056ae20d24855089380a4235bcf1092874d`.
- Exact diff: root date + one `dining-doner-lab` record; 14 records / 0 deterministic validation errors; prototype false; production false.
- LOCKED safety HEAD unchanged.

### INTERIM-T009 — Dining OWNER local-check list
- **COMPLETED — NO STATUS/DATA WRITE**.
- Commit `446169fdf0551ae359d20e355a23f74d37a67eb2`.
- File `POPITAI_LOM_DINING_OWNER_LOCAL_CHECK_LIST_20260917.md`.
- Exact local checks prepared for the concrete dining conflicts/status doubts already found.

### INTERIM-T010 — Accommodation OWNER local-check list
- **COMPLETED — NO STATUS/DATA WRITE**.
- Commit `6351bf87cfb92692b8121352d1253e0ef53cc8ec`.
- File `POPITAI_LOM_ACCOMMODATION_OWNER_LOCAL_CHECK_LIST_20260917.md`.
- Local-check priorities: `Парк хотел Ривър` (address/current hotel operation) and `Хотел/ресторант Дунав` (accommodation activity/address/name). `Хотел Москва` is not local-check priority because existence is OWNER-confirmed and official site already supplies address/phone; remaining NTR mapping is registry work.

### INTERIM-T011 — Fuel/Info Lom OWNER local-check list
- `Date`: 17.09.2026
- **NEXT / NOT STARTED**.
- Use current inventory only.
- Expected subjects: `Кристал В` and `Petrol 3313` only if current evidence gives an exact local-check question; LUKOIL stations should not be local-check tasks if official operator evidence already closes identity/address/hours.
- No new web discovery, no data/status write, no prototype/production/Supabase.

---

## WORK REVIEW ITEMS

- `WR-20260917-001` continuity control — **PENDING**.
- `WR-20260917-002` suspicious-entity workflow — **PENDING**.
- `WR-20260917-003` strict Execution Chat discipline — **PENDING**.
- `WR-20260917-004` dining verification — **PENDING**.
- `WR-20260917-005` atomic task/checkpoint discipline — **PENDING**.
- `WR-20260917-006` Дюнер Lab proposal — **PENDING**.
- `WR-20260917-007` Дюнер Lab proposal audit — **PENDING**.
- `WR-20260917-008` Дюнер Lab bounded inventory record — **PENDING**.
- `WR-20260917-009` dining local-check list — **PENDING**.
- `WR-20260917-010` accommodation local-check list — **PENDING**.

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

---

## OWNER-APPROVED SUSPICIOUS-ENTITY RULE

- no auto-delete or auto active/closed from weak signals;
- OWNER local check may establish identity/activity status;
- phone/hours/exact address remain independent fields unless OWNER checks that exact field;
- V1 remains the machine-readable contract until separate schema approval.

---

## NEXT TASK CONTRACT

1. execute only `INTERIM-T011` — fuel/Info Lom OWNER local-check list from existing evidence;
2. no web discovery;
3. no record/status/data write;
4. checkpoint immediately after creation;
5. update Queue before next category/cross-category T005;
6. Execution Chat delegation, if any, must satisfy `INTERIM-D002`;
7. do not claim central Register synchronized until Work resolves `FI-007`;
8. after interruption continue from first incomplete atomic unit only.
