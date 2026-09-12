# Попитай.Лом — WORK REVIEW QUEUE

Статус: **ACTIVE IN SANDBOX / WORK REVIEW PENDING**  
Създаден: **12.09.2026**  
Контрол: `POPITAI_LOM_TOM_CONTROL.md`

Този файл е оперативната опашка за всичко съществено, направено без Work. Той НЕ е продуктов Master и НЕ създава сам продуктови решения.

## CURRENT TOM STATE

- `CURRENT TOM`: **TOM-1**
- `WORK STATUS`: **UNAVAILABLE / REVIEW PENDING**
- `OFFICIAL REVIEW PROTOTYPE`: `prototype/stage2-icon-system-approval`
- `OFFICIAL BASE SHA`: `545ba5a22f2c1ad9d6e33c349e70a4d48eb1291a`
- `OFFICIAL REVIEW PROTOTYPE STATUS`: **FROZEN**
- `SANDBOX BRANCH`: `sandbox/work-gap-review`
- `SANDBOX HEAD`: **VERIFY DIRECTLY IN GIT AT SESSION START**
- `CURRENT STAGE`: Stage 2 — Icon system approval
- `CURRENT PRODUCT TASK`: завършване на първата icon/discovery група `Майстори, ремонти и дом`
- `CURRENT CONTROL TASK`: **TOM1-AUDIT-001 complete; OWNER verdict required for the two unresolved semantic mappings before implementation**
- `LAST TOM DECISION`: `TOM1-D001`
- `OPEN WR IDs`: `WR-001` — Work review pending
- `OPEN FOUND-ISSUES`: `FI-001` — generic positional emoji renderer remains in `prototype-service-views.js`
- `BLOCKERS`: OWNER verdict is required for `Цялостни ремонти` exact semantic mapping and `Къртене и извозване` semantic concept before any new icon implementation
- `NEXT ALLOWED ACTION`: OWNER review of TOM-1 proposal for the two unresolved entries. No prototype/icon implementation before the applicable OWNER verdict.

> Забележка: SANDBOX HEAD не се hardcode-ва като самореферентна „вечна“ стойност в същия state commit. Всеки TOM/Work го сверява директно от Git и сравнява с `OFFICIAL BASE SHA`.

---

## TOM1-D001 — Активиране на TOM sandbox control

- `Дата`: 12.09.2026
- `Тема`: временен строг контрол при недостъпен Work
- `Проблем`: без Work липсва независим постоянен контролен слой; чатови решения могат да се изгубят при лимит или да бъдат интерпретирани различно от следващ агент.
- `Evidence`: съществуващите Master/Register/Progress/PROJECT_RULES документи пазят значителна част от контекста, но преди TOM bootstrap няма отделен Work Review Queue, няма формализиран TOM→Execution contract и read order-ът не включва всички текущи control sources.
- `OWNER verdict`: **APPROVED — ACTIVATE NOW**
- `Избрано решение`: Official Review Prototype остава frozen; временната работа се извършва само в `sandbox/work-gap-review`; TOM-1 контролира Execution Chat; всяко съществено TOM решение се записва с логика; Work по-късно прави независим Git diff review.
- `Логика`: отделният sandbox прави работата обратима и позволява Work да сравни точния delta, без временното TOM изпълнение да променя официалния review prototype или production.
- `Допълнителен контрол`: RED-ZONE detection guard; TOM verification не е final acceptance; нов TOM прави Git-based state recovery; lightweight path е разрешен само за behavior-preserving технически изпълнения без ново продуктово решение.
- `Разрешен scope за bootstrap`: control docs + RED-ZONE detection guard само в sandbox.
- `Забранен scope`: prototype UI/UX, accepted icons, taxonomy, production `main`, Supabase, schema/RLS/RPC, protected business logic.
- `Work review`: **PENDING**

---

## WR-001 — TOM control bootstrap

- `Source`: `TOM1-D001`
- `OWNER verdict`: APPROVED
- `Scope`: sandbox control infrastructure/documentation only
- `Official base`: `prototype/stage2-icon-system-approval@545ba5a22f2c1ad9d6e33c349e70a4d48eb1291a`
- `Sandbox`: `sandbox/work-gap-review`
- `Production touched`: **NO**
- `Supabase/backend touched`: **NO**
- `Prototype UI/UX touched`: **NO**
- `Protected business logic touched`: **NO**
- `Changed files verified against base`:
  - `POPITAI_LOM_TOM_CONTROL.md`
  - `POPITAI_LOM_WORK_REVIEW_QUEUE.md`
  - `PROJECT_RULES_00_READ_FIRST.md`
  - `PROJECT_PROGRESS.md`
  - `.github/scripts/check_tom_red_zone.py`
  - `.github/workflows/tom-red-zone-guard.yml`
- `TOM verification`: **TOM VERIFIED** — compare against official base showed only the six control/guard files above; no prototype UI/UX, Supabase/backend or production file appeared in the diff.
- `Read-order verification`: **PASS** — `PROJECT_RULES_00_READ_FIRST.md` now has one explicit order: Master → Decision Register → TOM Control → Work Review Queue → Progress → applicable technical rules.
- `Current-task verification`: **PASS** — Progress and Queue identify Stage 2 Icon system approval and the first current group `Майстори, ремонти и дом`.
- `Frozen-official verification`: **PASS AT BOOTSTRAP DIFF** — sandbox was created from exact official SHA `545ba5a...`; all bootstrap commits are on `sandbox/work-gap-review`.
- `RED-ZONE note`: control/guard files are RED ZONE for normal Execution work; this bootstrap is an explicit OWNER-approved control task.
- `Guard status`: detector + workflow added. This is **DETECTION LAYER ONLY** until required checks/branch rules are separately enabled and verified.
- `Known risk`: repository protection is not upgraded by this bootstrap. Do not describe the guard as a guaranteed merge block.
- `Work verdict`: **PENDING**

---

## TOM1-AUDIT-001 — Първа icon/discovery група `Майстори, ремонти и дом`

- `Дата`: 12.09.2026
- `Тип`: READ-ONLY AUDIT / NO PRODUCT CHANGE
- `Scope`: exact current state на 10-те owner-approved visible discovery entries и тяхното icon acceptance състояние.
- `Доказано приети semantic assets`: `Бани и плочки`, `ВиК`, `Електро`, `Покриви`, `Шпакловка / гипсокартон / боядисване`, `Дограма и врати`, `Отопление и климатици`, `Монтажи и мебели`.
- `Неотворени повторно`: горните осем assets остават приети; TOM-1 няма основание да ги redesign-ва.
- `Нерешено 1`: `Цялостни ремонти` е записано в draft registry като `SHARED ICON → hammer`, но exact registry map все още е `EXACT MAP ACCEPTANCE PENDING`; не се счита за нов owner-accepted semantic asset само защото hammer SVG съществува.
- `Нерешено 2`: `Къртене и извозване` е `OPEN`; договорът изисква ясен demolition/debris знак и изрично забранява обикновен cargo truck.
- `Asset evidence`: review asset directory съдържа приетите осем assets от тази група; няма отделен owner-accepted `whole renovation` или `demolition/debris` review asset.
- `Implementation boundary`: няма icon/prototype промяна преди OWNER verdict за двете нерешени точки.
- `Work review`: PENDING together with sandbox work.

### FI-001 — Generic positional service icons remain

- `Location`: `prototype-final-ia/prototype-service-views.js` → `serviceGroup()`.
- `Finding`: generic icon се избира чрез `icons[i % icons.length]`, а `prototype-core.js` още държи общ emoji масив.
- `Risk`: позиционен generic знак може да не съответства на конкретната taxonomy семантика и противоречи на approved deterministic registry direction.
- `Blocking current OWNER decision`: **NO** — не пречи да се решат двете отворени semantic mappings.
- `Blocking later implementation`: **YES** — преди окончателно deterministic icon wiring този renderer трябва да бъде заменен/ограничен чрез одобрения registry contract.
- `RED-ZONE/protected`: NO, но е prototype implementation change и изисква отделен TOM task след приложим OWNER approval.
- `Status`: RECORDED / NOT FIXED.

---

## Work review procedure

При връщане Work НЕ приема тази опашка по доверие. Първо:

1. прочита `PROJECT_RULES_00_READ_FIRST.md`;
2. възстановява current state;
3. сверява `OFFICIAL BASE SHA` с реалния sandbox HEAD;
4. отваря реалния Git diff;
5. сравнява changed files с TOM records;
6. проверява RED-ZONE guard резултатите и приложимото QA;
7. дава на всеки WR само `ACCEPTED`, `CORRECTION REQUIRED` или `REOPEN`.

Ако Git показва неописана промяна: `STATE MISMATCH` → няма нов implementation до изясняването ѝ.
