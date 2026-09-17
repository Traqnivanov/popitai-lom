# Попитай.Лом — WORK REVIEW QUEUE

Статус: **OWNER-APPROVED INTERIM CONTROL / WORK REVIEW PENDING / NO PRODUCTION PERMISSION**
Активирано: **17.09.2026**
Контролен договор: `POPITAI_LOM_TOM_CONTROL.md`

Този файл е living operational ledger за съществената работа, извършена при недостъпен Work. Той НЕ е продуктов Master и НЕ създава сам продуктови решения.

## CURRENT CONTROL STATE

- `CONTROL MODE`: **INTERIM TOM / WORK UNAVAILABLE**
- `CURRENT TOM`: **UNASSIGNED — няма доказан валиден TOM-2 handoff в текущия review branch**
- `OWNER`: active
- `WORK STATUS`: **UNAVAILABLE / REVIEW PENDING**
- `OFFICIAL REVIEW BRANCH`: `prototype/stage2-icon-system-approval`
- `OFFICIAL BASE SHA`: `998dd878a8ddb5076261f8dd4e2dfcb8d4ddec4a`
- `LOCKED SAFETY HEAD`: `997d97504251f4cbae0693dc0cffa24d1d04da79` — **DO NOT MOVE**
- `INTERIM CONTROL BRANCH`: `control/work-review-continuity-20260917`
- `CURRENT HEAD`: **VERIFY DIRECTLY IN GIT AT SESSION START**
- `CURRENT STAGE`: Stage 2 — content-complete/reality pass
- `CURRENT PRODUCT TASK`: bounded dining identity/dedupe + current-activity verification; no automatic import and no production write
- `CURRENT CONTROL TASK`: establish one recoverable Work/TOM chronology before continuing product research
- `LAST OWNER VERDICT`: **17.09.2026 — approve minimal docs-only continuity mechanism; Work review pending; no technical guard activation**
- `LAST COMPLETED PRODUCT WORK`: six dining conflict pairs reviewed read-only; `Kastelo` and `Valentino` additionally rechecked for current activity and remain unsuitable for `active` status without stronger current evidence
- `OPEN WR IDs`: `WR-20260917-001`
- `OPEN FOUND-ISSUES`: `FI-20260917-001`, `FI-20260917-002`, `FI-20260917-003`
- `BLOCKERS`: Work review of the interim control mechanism; old TOM guard remains non-canonical and is not relied upon
- `NEXT ALLOWED ACTION`: after this control checkpoint is verified, resume the bounded dining/content-reality pass; record the owner-approved local-check workflow for suspicious entities and then continue direct official-field verification. No production/Supabase/prototype implementation.

> `CURRENT HEAD` is never trusted from memory. Every new Work/TOM/control session verifies Git directly and compares it with `OFFICIAL BASE SHA`.

---

## INTERIM-D001 — Work/TOM continuity mechanism

- `Date`: 17.09.2026
- `Topic`: persistent chronology and recoverable state while Work is unavailable
- `Problem`: the old TOM-1 control mechanism exists only in historical sandbox evidence and the current canonical Register marks the TOM/guard process `OPEN — CONTROL GAP / NOT CANONICAL`; without a new bounded continuity layer, a new TOM or returning Work can lose exact task chronology.
- `Evidence`: current review branch verified at `998dd878a8ddb5076261f8dd4e2dfcb8d4ddec4a`; `POPITAI_LOM_TOM_CONTROL.md` and `POPITAI_LOM_WORK_REVIEW_QUEUE.md` were absent from that review state; old TOM-1 queue is stale and icon-specific.
- `OWNER verdict`: **APPROVED — MINIMAL DOCS-ONLY INTERIM CONTROL / WORK REVIEW PENDING**
- `Decision`: establish a concise root-level control contract and one living queue; do not copy the old TOM-1 current state; do not assume TOM-2 numbering; keep the technical guard inactive/non-canonical; Work later performs independent review.
- `Allowed scope`: control documentation only, exact state recovery metadata, chronology, handoff and Work-review queue.
- `Forbidden scope`: production `main`, Supabase/schema/RLS/RPC/migrations, protected core, Admin/Moderator, prototype implementation, icon work, `.github/workflows/`, guard scripts, branch/rules protection, LOCKED safety HEAD.
- `Work status`: **PENDING**

---

## INTERIM-T001 — Bootstrap current continuity state

- `Date`: 17.09.2026
- `Goal`: make current state mechanically recoverable before any further product/content task.
- `Base`: `prototype/stage2-icon-system-approval@998dd878a8ddb5076261f8dd4e2dfcb8d4ddec4a`
- `Work branch`: `control/work-review-continuity-20260917`
- `Required changed files`: control contract, Work Review Queue and minimal read-order pointer only.
- `Must NOT change`: Master, product code, prototype, content inventory data, production, Supabase, protected rules, workflows/guards.
- `Verification required`: compare exact BASE → HEAD; inspect changed files; confirm no RED-ZONE paths; confirm review branch and LOCKED safety HEAD were not moved before final owner-approved promotion decision.
- `Status`: **IN PROGRESS / WORK REVIEW PENDING**

---

## WR-20260917-001 — Interim continuity control

- `Decision`: `INTERIM-D001`
- `Task`: `INTERIM-T001`
- `OWNER verdict`: approved as interim docs-only continuity control
- `Expected evidence`: exact Git diff from base `998dd878...`, changed-files list, no production/backend/protected changes
- `Known risk`: treating the mechanism as Work-accepted or technical-guard-enforced before Work actually reviews it
- `Required Work verdict`: `ACCEPTED` / `CORRECTION REQUIRED` / `REOPEN`
- `Work status`: **PENDING**

---

## FI-20260917-001 — Technical TOM guard is not canonical

- `Finding`: old `tom-red-zone-guard`/workflow evidence exists only in the historical sandbox path and is not relied upon by the current review branch.
- `Risk`: false sense of automatic RED-ZONE enforcement.
- `Blocking`: **NO for docs-only research continuity; YES for claiming technical enforcement**.
- `Action`: no workflow/guard change in this task; separate OWNER + Work checkpoint if technical enforcement is later desired.

## FI-20260917-002 — Kastelo current activity uncertain / likely closed

- `Finding`: `Kastelo` at the old `Славянска 5` record still appears in online listings, but current real-world activity was not sufficiently proven in the 17.09 recheck; local owner signal indicates it may already be closed.
- `Risk`: stale online directory data being treated as active business evidence.
- `Blocking`: **YES for active/public-ready classification; NO for research inventory**.
- `Action`: place in the owner local-check/suspicious-entity workflow before final status.

## FI-20260917-003 — Valentino current activity uncertain / likely closed

- `Finding`: `Valentino` retains online traces, but the 17.09 recheck did not establish strong current activity; local owner signal indicates it may already be closed.
- `Risk`: stale hours/listing data being treated as proof of an active venue.
- `Blocking`: **YES for active/public-ready classification; NO for research inventory**.
- `Action`: place in the owner local-check/suspicious-entity workflow before final status.

---

## PENDING OWNER-APPROVED CONTENT WORKFLOW — suspicious entities

OWNER decision from 17.09.2026:

- suspicious hotels, dining venues, shops and other local entities are not auto-deleted and not auto-marked active/closed from weak online signals;
- they are collected for local OWNER verification;
- after local verification the entity can be classified as `active`, `closed`, `moved`, `renamed`, `duplicate/same business`, or `unresolved`;
- local OWNER verification of existence/status does not automatically verify phone, hours, exact address or other independent fields;
- this workflow still needs to be recorded in the appropriate `content-inventory/` control documentation as a separate bounded content task after the continuity checkpoint is verified.

---

## NEXT TASK CONTRACT

`NEXT ALLOWED ACTION` is deliberately narrow:

1. verify `INTERIM-T001` diff and changed files;
2. if clean, record the suspicious-entity local-check workflow in `content-inventory/README.md` without changing production/schema;
3. record concrete suspicious records only with evidence and non-active readiness until owner verification;
4. continue dining direct-official-field verification from the existing identity/dedupe pass;
5. keep every new task/decision/issue appended chronologically here so returning Work can reconstruct the full chain without asking OWNER to remember it.
