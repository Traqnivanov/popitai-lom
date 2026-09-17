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
- `CURRENT PRODUCT TASK`: bounded dining direct/current verification; no automatic import and no production write
- `CURRENT CONTROL TASK`: enforce exact chronology and strict Execution Chat contracts; no vague delegated task is permitted
- `LAST OWNER VERDICT`: **17.09.2026 — process starts now; every Execution Chat task must be uncompromisingly exact, bounded and non-interpretive; no self-invented scope**
- `LAST COMPLETED PRODUCT WORK`: dining direct-verification Batch B appended to `POPITAI_LOM_DINING_DIRECT_VERIFICATION_20260917.md` at `1f6685484fec451b52ea2bd9d2eb8e5c8c6dbc8d`; no machine-readable import
- `OPEN WR IDs`: `WR-20260917-001`, `WR-20260917-002`, `WR-20260917-003`, `WR-20260917-004`
- `OPEN FOUND-ISSUES`: `FI-20260917-001`, `FI-20260917-002`, `FI-20260917-003`, `FI-20260917-004`, `FI-20260917-005`, `FI-20260917-006`, `FI-20260917-007`
- `BLOCKERS`: Work review of interim control remains pending; old TOM technical guard remains non-canonical and is not relied upon. No blocker for bounded read-only/content-inventory work inside the recorded scope.
- `NEXT ALLOWED ACTION`: continue `INTERIM-T004` only with the next small direct-verification batch; prioritize strong 2026 candidates that still lack first-party proof. Do not add records until exact evidence supports an explicit inventory proposal. No production/Supabase/prototype implementation.

> `CURRENT HEAD` is never trusted from memory. Every new Work/TOM/control session verifies Git directly and compares it with `OFFICIAL BASE SHA`.

---

## INTERIM-D001 — Work/TOM continuity mechanism

- `Date`: 17.09.2026
- `Topic`: persistent chronology and recoverable state while Work is unavailable
- `Problem`: the old TOM-1 control mechanism exists only in historical sandbox evidence and the pre-17.09 canonical Register marked the TOM/guard process `OPEN — CONTROL GAP / NOT CANONICAL`; without a new bounded continuity layer, a new TOM or returning Work can lose exact task chronology.
- `Evidence`: review branch was verified at activation base `998dd878a8ddb5076261f8dd4e2dfcb8d4ddec4a`; `POPITAI_LOM_TOM_CONTROL.md` and `POPITAI_LOM_WORK_REVIEW_QUEUE.md` were absent from that review state; old TOM-1 queue is stale and icon-specific.
- `OWNER verdict`: **APPROVED — MINIMAL DOCS-ONLY INTERIM CONTROL / WORK REVIEW PENDING**
- `Decision`: establish a concise root-level control contract and one living queue; do not copy the old TOM-1 current state; do not assume TOM-2 numbering; keep the technical guard inactive/non-canonical; Work later performs independent review.
- `Allowed scope`: control documentation only, exact state recovery metadata, chronology, handoff and Work-review queue.
- `Forbidden scope`: production `main`, Supabase/schema/RLS/RPC/migrations, protected core, Admin/Moderator, prototype implementation, icon work, `.github/workflows/`, guard scripts, branch/rules protection, LOCKED safety HEAD.
- `Work status`: **PENDING**

---

## INTERIM-D002 — Strict Execution Chat task discipline

- `Date`: 17.09.2026
- `Topic`: commands delegated to ordinary/Execution Chat
- `OWNER verdict`: **APPROVED — STRICT / NO FREE INTERPRETATION**
- `Problem`: an ordinary Execution Chat may invent scope, assumptions or implementation details when instructions are vague.
- `Decision`: no vague delegation is permitted. Every Execution Chat task must be written as an exact bounded contract. Execution Chat may execute only what is explicitly allowed and must STOP rather than invent missing authority.

### Mandatory fields in every Execution Chat task

1. `TASK ID`.
2. `ROLE: Execution Chat`.
3. `CONTROL`: current Interim TOM / applicable controller.
4. Exact repo and exact branch/workspace.
5. Exact expected HEAD/base SHA to verify before any action.
6. Exact goal — one bounded result, not a broad objective.
7. Exact authoritative files/evidence to read first.
8. `ALLOWED SCOPE` — explicit files/paths/actions that may be touched.
9. `FORBIDDEN SCOPE` — explicit RED-ZONE/LOCKED areas and any nearby files that must not be touched.
10. Exact ordered execution steps when implementation is authorized.
11. `NO ASSUMPTIONS` rule — no new category, owner, field, route, status, wording, visual choice, schema or architecture may be invented.
12. `STOP CONDITIONS` — SHA mismatch, document conflict, missing source, required scope expansion, RED-ZONE/LOCKED need, unexpected diff, uncertain owner decision.
13. Exact QA/tests required.
14. Exact report format: changed files, commit SHA, tests, findings, blockers, deviations, and confirmation of forbidden areas untouched.
15. Commit rule: no unrelated cleanup, no mixed tasks, no extra files, no second task hidden in the same commit.

### Enforcement rule

- Phrases such as `оправи го`, `направи каквото трябва`, `прецени сам`, `подобри го`, `довърши останалото` are forbidden as standalone authority.
- Execution Chat does not expand a task because it notices another problem. It reports it as a found issue.
- Execution Chat does not edit control files, Master/Register, protected rules, workflow/guards, production or Supabase unless that exact path/action is separately and explicitly authorized.
- If the exact expected SHA does not match, Execution Chat must **STOP AND REPORT**, not rebase, merge, switch branch or continue from a newer state by itself.
- If the task can no longer be completed exactly inside the allowed scope, it must **STOP THE AFFECTED PART AND REPORT**.
- A technically successful result outside scope is a failed control result.

- `Work status`: **PENDING**

---

## INTERIM-T001 — Bootstrap current continuity state

- `Date`: 17.09.2026
- `Goal`: make current state mechanically recoverable before any further product/content task.
- `Base`: `prototype/stage2-icon-system-approval@998dd878a8ddb5076261f8dd4e2dfcb8d4ddec4a`
- `Work branch`: `control/work-review-continuity-20260917`
- `Required changed files`: control contract, Work Review Queue and minimal read-order pointer only.
- `Must NOT change`: Master, product code, prototype, content inventory data, production, Supabase, protected rules, workflows/guards.
- `Verification evidence`: BASE `998dd878...` → verification checkpoint `466b0e632f56c81b05e6b978550c2482c3251fc9` was `ahead_by: 3`, `behind_by: 0`; exactly three files changed: `POPITAI_LOM_TOM_CONTROL.md` added, `POPITAI_LOM_WORK_REVIEW_QUEUE.md` added, `PROJECT_RULES_00_READ_FIRST.md` minimally updated. No production/backend/prototype/guard/protected file changed. Official review branch remained at `998dd878...` during verification and LOCKED safety HEAD was not moved.
- `Promotion evidence`: after OWNER-approved bounded verification, `prototype/stage2-icon-system-approval` was fast-forwarded **without force** to `c1df4d76b72cc2a973d472351be548bb281777fb`; chronology follow-up then advanced the same review branch. Production `main`, Supabase and LOCKED safety branch were not touched.
- `Verification`: **PASS — bounded docs-only diff**
- `Status`: **INTERIM VERIFIED / WORK REVIEW PENDING**

## INTERIM-T002 — Record suspicious-entity local-check workflow

- `Date`: 17.09.2026
- `Goal`: turn the OWNER-approved local verification rule into persistent content-inventory procedure.
- `Allowed file`: `content-inventory/README.md` only.
- `Forbidden`: `schema.v1.json`, `records.v1.json`, validator, product/prototype code, production, Supabase, protected/control rules.
- `Result`: workflow recorded for suspicious hotels, dining venues, shops and other local entities; pre-check entities are not auto-active/auto-closed; OWNER local verification may establish only actual identity/activity status while independent fields remain separately evidenced.
- `Commit`: `7ec17d20d62edd97aec3e49a01a22120008f2b17`.
- `Verification`: file-level bounded change; no schema or production permission created.
- `Status`: **COMPLETED / WORK REVIEW PENDING**

## INTERIM-T003 — Classify existing suspicious records

- `Date`: 17.09.2026
- `Goal`: inspect current machine-readable records and existing dining evidence; update only records that already have sufficient evidence for a suspicious/conflict/non-active classification.
- `Required evidence checked`: current `records.v1.json`, `schema.v1.json`, `validate_inventory.py`, Work 2 dining verification report and current Queue.
- `Finding 1`: `Kastelo` and `Valentino` are not current machine-readable inventory records; Work 2 explicitly says new candidates are not automatically added without direct field evidence and identity resolution.
- `Finding 2`: `Каприз 2025` is already `candidate_unverified` + `research_only`, with `current_active_status` and the relationship with `При Финци` explicitly OPEN.
- `Finding 3`: V1 schema allows evidence/readiness/open-field representation but has no separate final operational-status enum `active/closed/moved/...`; no new enum/field is invented.
- `Validator boundary`: permitted evidence/readiness enums are fixed and `production.write_allowed` must remain false.
- `Result`: **NO MACHINE-READABLE DATA CHANGE REQUIRED OR AUTHORIZED**. No empty/no-op commit was created.
- `Status`: **COMPLETED — NO DATA WRITE / WORK REVIEW PENDING**

## INTERIM-T004 — Continue dining direct verification

- `Date`: 17.09.2026
- `Status`: **IN PROGRESS — BATCH A + B RECORDED**
- `Goal`: continue direct current-activity / official-field verification for unresolved dining candidates and conflict identities.
- `Sources`: official operator/site/social first; Maps/current business evidence as activity/discovery support; reliable secondary/local sources only with explicit classification.
- `Rule`: empty/open is better than assumption; no automatic import/merge.
- `Report`: `POPITAI_LOM_DINING_DIRECT_VERIFICATION_20260917.md`; Batch A initial commit `861247be77981ceb8369cd84aee4143cc30060dc`, Batch B append `1f6685484fec451b52ea2bd9d2eb8e5c8c6dbc8d`.
- `Batch A direct finding`: `Дюнер Lab` has a direct own site (`doner-lab.com`) identifying the Lom business and `ул. Дунавска 22`; official site hours conflict with current Maps hours, so hours are not silently reconciled.
- `Batch A unresolved`: `При Маца`, `Food Station by NARODEN`, `Закусвалня КРИСИ`, `Дунавски вълни`, `ДЮНЕР KING Лом` still lack sufficient direct first-party evidence and remain research/local-check candidates.
- `Batch B`: `Versus`, `Кафе-Сладкарница Фреш`, `Сакура`, `Caffe-Club Арена`, `Механа Боруна` checked.
- `Batch B result`: no clean first-party source found for the five candidates. `Versus` has a concrete secondary phone conflict; `Фреш`, `Сакура`, `Арена`, `Боруна` remain directory/Google-signal research candidates.
- `Machine-readable decision`: no `records.v1.json` change from Batch A or B; exact persistent record proposals wait for sufficient direct evidence/identity closure.
- `Next`: another small direct-verification batch only; do not broaden into hotels/shops before dining checkpoint is coherent.

## INTERIM-T005 — Build cross-category OWNER local-check list

- `Status`: **QUEUED, NOT YET EXECUTED**
- `Goal`: after enough content areas are audited, generate one OWNER-check list across suspicious hotels/accommodation, dining, shops and other local entities.
- `Output`: research/control list grouped by category with reason for suspicion, conflicting evidence, exact item OWNER should check, and current non-public readiness.
- `Boundary`: this is not a production/public directory and does not itself change record status.

---

## WR-20260917-001 — Interim continuity control

- `Decision`: `INTERIM-D001`
- `Task`: `INTERIM-T001`
- `OWNER verdict`: approved as interim docs-only continuity control
- `Evidence`: verified BASE→checkpoint diff contains only the intended docs/control files; official review promotion was fast-forward-only
- `Known risk`: treating the mechanism as Work-accepted or technical-guard-enforced before Work actually reviews it
- `Required Work verdict`: `ACCEPTED` / `CORRECTION REQUIRED` / `REOPEN`
- `Work status`: **PENDING**

## WR-20260917-002 — Suspicious-entity local-check workflow

- `Task`: `INTERIM-T002`
- `OWNER verdict`: approved before implementation
- `Evidence`: `content-inventory/README.md` commit `7ec17d20d62edd97aec3e49a01a22120008f2b17`
- `Boundary`: documentation/workflow only; schema/records/production unchanged by T002
- `Required Work verdict`: `ACCEPTED` / `CORRECTION REQUIRED` / `REOPEN`
- `Work status`: **PENDING**

## WR-20260917-003 — Strict Execution Chat discipline

- `Decision`: `INTERIM-D002`
- `OWNER verdict`: exact, uncompromising commands; Execution Chat has no authority to invent scope
- `Evidence`: mandatory task-contract fields and stop rules recorded in this Queue
- `Required Work verdict`: `ACCEPTED` / `CORRECTION REQUIRED` / `REOPEN`
- `Work status`: **PENDING**

## WR-20260917-004 — T003/T004 bounded content verification

- `Tasks`: `INTERIM-T003`, `INTERIM-T004`
- `Evidence`: current V1 schema/validator + Work 2 dining handoff; direct-verification report through Batch B at `1f6685484fec451b52ea2bd9d2eb8e5c8c6dbc8d`
- `Result so far`: T003 completed with no data write; T004 Batch A+B recorded; `Дюнер Lab` is a strong direct candidate with hours conflict, while the other checked candidates remain research/conflict/local-check entries
- `Boundary`: no automatic inventory import, no prototype/production/Supabase change
- `Required Work verdict`: `ACCEPTED` / `CORRECTION REQUIRED` / `REOPEN`
- `Work status`: **PENDING**

---

## FI-20260917-001 — Technical TOM guard is not canonical

- `Finding`: old `tom-red-zone-guard`/workflow evidence exists only in the historical sandbox path and is not relied upon by the current review branch.
- `Risk`: false sense of automatic RED-ZONE enforcement.
- `Blocking`: **NO for docs-only research continuity; YES for claiming technical enforcement**.
- `Action`: no workflow/guard change in this task; separate OWNER + Work checkpoint if technical enforcement is later desired.

## FI-20260917-002 — Kastelo current activity uncertain / likely closed

- `Finding`: `Kastelo` at the old `Славянска 5` record still appears in online listings, but current real-world activity was not sufficiently proven in the 17.09 recheck; local OWNER signal indicates it may already be closed.
- `Risk`: stale online directory data being treated as active business evidence.
- `Blocking`: **YES for active/public-ready classification; NO for research inventory**.
- `Action`: place in the OWNER local-check/suspicious-entity workflow before final status.

## FI-20260917-003 — Valentino current activity uncertain / likely closed

- `Finding`: `Valentino` retains online traces, but the 17.09 recheck did not establish strong current activity; local OWNER signal indicates it may already be closed.
- `Risk`: stale hours/listing data being treated as proof of an active venue.
- `Blocking`: **YES for active/public-ready classification; NO for research inventory**.
- `Action`: place in the OWNER local-check/suspicious-entity workflow before final status.

## FI-20260917-004 — Redundant empty check branch

- `Finding`: during the initial control setup a redundant branch `control/work-review-continuity-20260917-check` was created accidentally at the original base SHA `998dd878a8ddb5076261f8dd4e2dfcb8d4ddec4a`.
- `Evidence`: the branch was created directly from the base before any control-file commit; it contains no unique implementation or content changes.
- `Risk`: possible future branch-list confusion if seen without context.
- `Blocking`: **NO**.
- `Action`: ignore as non-authoritative evidence branch. The current connector does not expose branch deletion; do not move or use it as current state. Authoritative interim state is recovered from the official review branch + this queue.

## FI-20260917-005 — Дюнер Lab hours conflict

- `Finding`: direct own site publishes `Понеделник–Петък 11:00–18:00; Събота/Неделя затворено`, while current Maps/business evidence shows different weekday hours around `09:30–15:30`.
- `Risk`: silently selecting a secondary value over an official value or treating one source as fresher without proof.
- `Blocking`: **NO for identity/address candidate status; YES for claiming exact current hours without qualification**.
- `Action`: preserve the conflict and verify operational currentness before exact inventory proposal.

## FI-20260917-006 — Versus phone conflict

- `Finding`: 2026 secondary RestaurantGuru variants for `Versus Lom`, `ул. Пристанищна 11`, expose conflicting phones (`+359 88 202 2407` vs `+359 88 819 6886`).
- `Risk`: copying a wrong phone into persistent inventory from a secondary index.
- `Blocking`: **YES for exact phone/public-ready field; NO for research identity**.
- `Action`: direct first-party or OWNER local verification required; no phone selected.

## FI-20260917-007 — Central Register TOM/guard row is pre-17.09 state

- `Finding`: `POPITAI_LOM_DECISION_AND_BACKLOG_REGISTER.md` still contains the older row `TOM/guard process = OPEN — CONTROL GAP / NOT CANONICAL`.
- `Current authority`: OWNER later approved the **docs-only interim continuity mechanism** on 17.09 and it is now explicitly read through `PROJECT_RULES_00_READ_FIRST.md`; Work review is still pending. This does **not** canonicalize or activate the technical guard.
- `Risk`: a reader may conflate the old register row with the later interim docs-control verdict or incorrectly assume the technical guard was activated.
- `Blocking`: **NO for bounded interim docs/research work because READ_FIRST requires the later Queue; YES for claiming the Register itself is fully synchronized**.
- `Action`: do not mechanically rewrite the large canonical Register during interim work solely to patch one process row. Returning Work should review `WR-20260917-001` and then synchronize the Register verdict safely. Until then: interim docs control = OWNER-approved / WORK REVIEW PENDING; technical guard = non-canonical/inactive.

---

## OWNER-APPROVED CONTENT WORKFLOW — suspicious entities

Recorded in `content-inventory/README.md` at `7ec17d20d62edd97aec3e49a01a22120008f2b17`.

- suspicious hotels, dining venues, shops and other local entities are not auto-deleted and not auto-marked active/closed from weak online signals;
- they are collected for local OWNER verification;
- after local verification the operational/identity outcome can be `active`, `closed`, `moved`, `renamed`, `duplicate/same business`, or `unresolved`;
- local OWNER verification of existence/status does not automatically verify phone, hours, exact address or other independent fields;
- machine-readable records continue to obey the current V1 schema until a separate schema decision is audited and approved.

---

## NEXT TASK CONTRACT

`NEXT ALLOWED ACTION` is deliberately narrow:

1. continue `INTERIM-T004` with one additional small dining batch only;
2. seek direct first-party/current evidence before proposing exact persistent records;
3. do not convert 2026 directory presence alone into official fields or active status;
4. do not create a `Дюнер Lab` machine-readable record until an exact record proposal closes duplicate/source-currentness questions;
5. do not execute `INTERIM-T005` until enough categories have been audited to make the OWNER-check list useful;
6. every delegated Execution Chat task must satisfy `INTERIM-D002` in full;
7. do not claim central Register synchronization until Work reviews `WR-20260917-001` and resolves `FI-20260917-007`;
8. append every new task/decision/found issue chronologically here so returning Work can reconstruct the complete chain without asking OWNER to remember it.
