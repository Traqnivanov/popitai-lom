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
- `CURRENT PRODUCT TASK`: dining-only OWNER local-check list from already collected conflict/status evidence; no new discovery
- `CURRENT CONTROL TASK`: use short atomic tasks; after each bounded task, write a durable checkpoint before starting the next task
- `LAST OWNER VERDICT`: **17.09.2026 — because connection interruptions can cut long tasks, work must proceed as short atomic tasks with a Git checkpoint after each completed bounded unit; never restart completed work from scratch**
- `LAST COMPLETED PRODUCT WORK`: `INTERIM-T008` added exactly one `Дюнер Lab` research-only inventory record at commit `e6457056ae20d24855089380a4235bcf1092874d`; exact diff = root date + one appended record; validator-equivalent deterministic checks = 14 records / 0 errors; prototype/production remain disabled
- `OPEN WR IDs`: `WR-20260917-001` through `WR-20260917-008`
- `OPEN FOUND-ISSUES`: `FI-20260917-001` through `FI-20260917-012`
- `BLOCKERS`: Work review of interim control remains pending; old TOM technical guard remains non-canonical and is not relied upon. No blocker for bounded research/control work inside the recorded scope.
- `NEXT ALLOWED ACTION`: execute only `INTERIM-T009` — build one dining-only OWNER local-check list from already recorded suspicious/conflict candidates. Do not perform new web discovery, do not change inventory statuses, do not touch prototype/production/Supabase/Stage 3.

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

## INTERIM-D003 — Atomic task + checkpoint discipline

- `Date`: 17.09.2026
- `OWNER verdict`: **APPROVED — SHORT TASKS / DURABLE CHECKPOINT AFTER EACH**
- `Reason`: repeated connection interruptions can cut a long research/control sequence after useful work has already been done.
- `Decision`: every new interim task is split into the smallest coherent bounded unit that can be independently verified and recorded.
- `Rule 1`: complete one bounded unit only.
- `Rule 2`: write/commit the evidence or checkpoint immediately after that unit.
- `Rule 3`: update this Queue before starting a materially different next unit.
- `Rule 4`: after interruption, recover from Git/Queue and continue from the first incomplete unit; never redo completed units from scratch unless verification proves corruption or mismatch.
- `Rule 5`: do not combine research + proposal + machine-readable write + implementation in one long task.
- `Rule 6`: if a task would require many searches or a long write, split it into named batches with a checkpoint between batches.
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
- `Status`: **COMPLETED — BATCH A–E / DIMINISHING RETURNS REACHED / WORK REVIEW PENDING**
- `Goal`: direct current-activity / official-field verification for unresolved dining candidates and conflict identities.
- `Sources`: official operator/site/social first; Maps/current business evidence as activity/discovery support; reliable secondary/local sources only with explicit classification.
- `Rule`: empty/open is better than assumption; no automatic import/merge.
- `Batch A–D report`: `POPITAI_LOM_DINING_DIRECT_VERIFICATION_20260917.md`; Batch A initial `861247be77981ceb8369cd84aee4143cc30060dc`; Batch B `1f6685484fec451b52ea2bd9d2eb8e5c8c6dbc8d`; Batch C `633e8c6ed534434f2544f9f40be29692077bb740`; Batch D `07462c5546165e973f192dae735b1730aefd1541`.
- `Batch E report`: `POPITAI_LOM_DINING_DIRECT_VERIFICATION_BATCH_E_20260917.md` at `7f9d1c2c45b13cd190565d8301b78f74cd1d1738`.
- `Strong direct candidate`: `Дюнер Lab` has a direct own site (`doner-lab.com`) identifying the Lom business and `ул. Дунавска 22`; official site hours conflict with current Maps hours, so hours are not silently reconciled.
- `Status/identity conflicts accumulated`: `Versus` phone conflict; `Рибката` temporary-closed/current-activity conflict; `Чайка beach` closed/open/current-visit conflict; `При близнаците` cafe/store overlap; `Kastelo` and `Valentino` local-check status candidates; `Китайски ресторант` same-phone/address conflict.
- `Category contamination`: direct operator evidence shows `ВИП СИМЕРС ГРУП` as a producer/bakery company; no dining record is created without proof of a distinct customer-facing cafe/retail object.
- `Secondary-only/direct-source-open candidates`: `При Маца`, `Food Station by NARODEN`, `КРИСИ`, `Дунавски вълни`, `ДЮНЕР KING`, `Фреш`, `Сакура`, `Арена`, `Боруна`, `Paloma`, `Завалиите`, `Регал`, `Boutique Bar`, `Скарата на Дядо Кольо`, `При Лазар 1` and others remain research/local-check candidates.
- `Existing records`: `Палма` remains `candidate_unverified / research_only`; `Бохеми` remains owner-confirmed partial/research-only because exact fields lack direct proof.
- `Machine-readable decision`: no `records.v1.json` change through Batch E.
- `Closure verdict`: broad dining search now yields mainly directory conflicts/noise rather than new clean first-party records; stop broadening and move to one exact proposal at a time.

## INTERIM-T005 — Build cross-category OWNER local-check list

- `Status`: **QUEUED / FUTURE CROSS-CATEGORY CONSOLIDATION**
- `Goal`: after additional content areas are audited, generate one OWNER-check list across suspicious hotels/accommodation, dining, shops and other local entities.
- `Boundary`: not production/public directory; does not itself change record status.

## INTERIM-T006 — Exact inventory proposal for Дюнер Lab

- `Date`: 17.09.2026
- `Status`: **COMPLETED — PROPOSAL ONLY / NO DATA WRITE / WORK REVIEW PENDING**
- `Proposal`: `POPITAI_LOM_DONER_LAB_INVENTORY_PROPOSAL_20260917.md`.
- `Commit`: `2dbc7cb569d472daa4eb7cba13f89735fb79ee47`.
- `Result`: proposed `dining-doner-lab`, Firms/`businesses`/`Заведения`, `candidate_unverified`, `research_only`, official address from own site, explicit hours conflict, currentness/duplicate/phone/claim/media gates OPEN.

## INTERIM-T007 — Audit Дюнер Lab proposal against V1 + current records

- `Date`: 17.09.2026
- `Status`: **COMPLETED — PASS / NO DATA WRITE / WORK REVIEW PENDING**
- `Audit`: `POPITAI_LOM_DONER_LAB_PROPOSAL_AUDIT_20260917.md`.
- `Commit`: `2ec9de6a4af3dd7fe4caa6340a6a87c5ee93c101`.
- `Result`: V1-compatible; no current inventory id/name/address collision; production duplicate/currentness gates remain OPEN.

## INTERIM-T008 — Add audited Дюнер Lab research-only record

- `Date`: 17.09.2026
- `Status`: **COMPLETED — VALIDATED BOUNDED DATA WRITE / WORK REVIEW PENDING**
- `Commit`: `e6457056ae20d24855089380a4235bcf1092874d`.
- `Changed file`: `content-inventory/records.v1.json` only.
- `Exact diff`: `updated_at` `2026-09-16 → 2026-09-17` + one appended `dining-doner-lab` record; Git reports `29 additions / 1 deletion`; no other existing record changed.
- `Final record state`: `candidate_unverified`, `research_only`, `prototype.eligible=false`, `prototype.selected=false`, `production.write_allowed=false`; address official from own site; hours conflict preserved; currentness/duplicate/phone/claim/media gates remain OPEN.
- `Validation`: deterministic validator rules were reproduced against the exact appended record; expected count = 14 and result = 0 validation errors. Existing 13-record baseline was unchanged except root date; exact Git diff confirms no hidden existing-record mutation.
- `Safety`: review HEAD verified at `e6457056ae20d24855089380a4235bcf1092874d`; LOCKED safety HEAD verified unchanged at `997d97504251f4cbae0693dc0cffa24d1d04da79`.

## INTERIM-T009 — Dining OWNER local-check list

- `Date`: 17.09.2026
- `Status`: **NEXT / NOT STARTED**
- `Goal`: create one concise owner field-check list only for dining candidates already marked suspicious/conflict/local-check.
- `No new research`: use only existing Queue + Batch A–E evidence.
- `Required per item`: name, exact reason for suspicion, what OWNER should check locally, current research status, fields that must remain untrusted until resolved.
- `Expected core subjects`: `Kastelo`, `Valentino`, `Рибката`, `Чайка beach`, `Versus`, `При близнаците`, `Китайски ресторант`; include other dining items only if existing evidence already marks a concrete local-check need.
- `Allowed output`: one research/control Markdown list.
- `Forbidden`: record-status changes, new web discovery, inventory data writes, prototype, production, Supabase, Stage 3.

---

## WR-20260917-001 — Interim continuity control

- `Decision`: `INTERIM-D001`
- `Task`: `INTERIM-T001`
- `OWNER verdict`: approved as interim docs-only continuity control
- `Required Work verdict`: `ACCEPTED` / `CORRECTION REQUIRED` / `REOPEN`
- `Work status`: **PENDING**

## WR-20260917-002 — Suspicious-entity local-check workflow

- `Task`: `INTERIM-T002`
- `Evidence`: `content-inventory/README.md` commit `7ec17d20d62edd97aec3e49a01a22120008f2b17`
- `Required Work verdict`: `ACCEPTED` / `CORRECTION REQUIRED` / `REOPEN`
- `Work status`: **PENDING**

## WR-20260917-003 — Strict Execution Chat discipline

- `Decision`: `INTERIM-D002`
- `Required Work verdict`: `ACCEPTED` / `CORRECTION REQUIRED` / `REOPEN`
- `Work status`: **PENDING**

## WR-20260917-004 — T003/T004 bounded content verification

- `Tasks`: `INTERIM-T003`, `INTERIM-T004`
- `Evidence`: Batch A–E reports through `7f9d1c2c45b13cd190565d8301b78f74cd1d1738`
- `Required Work verdict`: `ACCEPTED` / `CORRECTION REQUIRED` / `REOPEN`
- `Work status`: **PENDING**

## WR-20260917-005 — Atomic task/checkpoint discipline

- `Decision`: `INTERIM-D003`
- `Required Work verdict`: `ACCEPTED` / `CORRECTION REQUIRED` / `REOPEN`
- `Work status`: **PENDING**

## WR-20260917-006 — Дюнер Lab exact proposal

- `Task`: `INTERIM-T006`
- `Evidence`: proposal commit `2dbc7cb569d472daa4eb7cba13f89735fb79ee47`
- `Required Work verdict`: `ACCEPTED` / `CORRECTION REQUIRED` / `REOPEN`
- `Work status`: **PENDING**

## WR-20260917-007 — Дюнер Lab proposal audit

- `Task`: `INTERIM-T007`
- `Evidence`: audit commit `2ec9de6a4af3dd7fe4caa6340a6a87c5ee93c101`
- `Required Work verdict`: `ACCEPTED` / `CORRECTION REQUIRED` / `REOPEN`
- `Work status`: **PENDING**

## WR-20260917-008 — Дюнер Lab bounded inventory record

- `Task`: `INTERIM-T008`
- `Evidence`: `records.v1.json` commit `e6457056ae20d24855089380a4235bcf1092874d`; exact diff = root date + one record only; 14-record deterministic validation = 0 errors
- `Boundary`: research-only preproduction inventory; no prototype/public/production/Supabase permission
- `Required Work verdict`: `ACCEPTED` / `CORRECTION REQUIRED` / `REOPEN`
- `Work status`: **PENDING**

---

## FI-20260917-001 — Technical TOM guard is not canonical

- `Finding`: old `tom-red-zone-guard`/workflow evidence exists only in the historical sandbox path and is not relied upon by the current review branch.
- `Blocking`: **NO for docs-only research continuity; YES for claiming technical enforcement**.

## FI-20260917-002 — Kastelo current activity uncertain / likely closed

- `Finding`: online listings remain, but current activity not sufficiently proven; local OWNER signal says it may be closed.
- `Blocking`: **YES for active/public-ready classification**.

## FI-20260917-003 — Valentino current activity uncertain / likely closed

- `Finding`: online traces remain, but current activity not sufficiently proven; local OWNER signal says it may be closed.
- `Blocking`: **YES for active/public-ready classification**.

## FI-20260917-004 — Redundant empty check branch

- `Finding`: redundant `control/work-review-continuity-20260917-check` exists at original base SHA, no unique content.
- `Blocking`: **NO**.

## FI-20260917-005 — Дюнер Lab hours conflict

- `Finding`: official-site hours conflict with current Maps hours.
- `Blocking`: **YES for exact current hours; NO for research identity/address**.

## FI-20260917-006 — Versus phone conflict

- `Finding`: secondary sources expose conflicting phones.
- `Blocking`: **YES for exact phone/public-ready field**.

## FI-20260917-007 — Central Register TOM/guard row is pre-17.09 state

- `Finding`: Register retains older `TOM/guard = OPEN` row; later interim docs control is OWNER-approved / Work-review-pending; technical guard remains inactive/non-canonical.
- `Blocking`: **YES for claiming Register fully synchronized; NO for bounded interim research**.

## FI-20260917-008 — Бистро „Рибката“ current-status conflict

- `Finding`: strong 2026 activity signals coexist with `Temporarily closed` signal.
- `Blocking`: **YES for final operational status**.

## FI-20260917-009 — Чайка beach closed/open conflict

- `Finding`: recent June 2026 visit evidence conflicts with temporary-closed/open directory states.
- `Blocking`: **YES for final operational status**.

## FI-20260917-010 — ВИП СИМЕРС dining-category contamination

- `Finding`: direct operator site identifies manufacturer/bakery company; separate dining object not proven.
- `Blocking`: **YES for dining record creation**.

## FI-20260917-011 — При близнаците cafe/store overlap

- `Finding`: cafe/store identity relation unresolved.
- `Blocking`: **YES for duplicate/category resolution**.

## FI-20260917-012 — Китайски ресторант address conflict

- `Finding`: same phone `0894 451 212`, conflicting addresses `ул. Дунавска 38` / `ул. Цар Симеон 3`.
- `Blocking`: **YES for exact address/current identity**.

---

## OWNER-APPROVED CONTENT WORKFLOW — suspicious entities

Recorded in `content-inventory/README.md` at `7ec17d20d62edd97aec3e49a01a22120008f2b17`.

- suspicious entities are not auto-deleted and not auto-marked active/closed from weak online signals;
- they are collected for local OWNER verification;
- OWNER local verification can resolve operational/identity status but does not automatically verify phone/hours/exact address;
- machine-readable records continue to obey V1 until a separate schema decision is audited and approved.

---

## NEXT TASK CONTRACT

1. execute only `INTERIM-T009` — dining-only OWNER local-check list from existing evidence;
2. no new web discovery;
3. no record/status/data write;
4. checkpoint the list immediately after creation;
5. update this Queue before starting a different content area or cross-category T005;
6. every delegated Execution Chat task must satisfy `INTERIM-D002`;
7. do not claim central Register synchronization until Work reviews `WR-20260917-001` and resolves `FI-20260917-007`;
8. after interruption, recover from Git/Queue and continue only from the first incomplete atomic unit.
