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
- `CURRENT CONTROL TASK`: TOM control bootstrap + documentation/guard cross-check
- `LAST TOM DECISION`: `TOM1-D001`
- `OPEN WR IDs`: `WR-001`
- `OPEN FOUND-ISSUES`: none recorded at activation
- `BLOCKERS`: control bootstrap must pass cross-check before new prototype implementation
- `NEXT ALLOWED ACTION`: finish TOM control bootstrap and verify one read order / one current task / frozen official prototype. No product/prototype change before that verification.

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
- `Control changes expected`:
  - `POPITAI_LOM_TOM_CONTROL.md`
  - `POPITAI_LOM_WORK_REVIEW_QUEUE.md`
  - `PROJECT_RULES_00_READ_FIRST.md`
  - `PROJECT_PROGRESS.md`
  - RED-ZONE detection guard under `.github/`
- `TOM verification`: PENDING until bootstrap cross-check is completed
- `RED-ZONE note`: control/guard files are RED ZONE for normal Execution work; this bootstrap is an explicit OWNER-approved control task.
- `Known risk`: GitHub CI is a detection layer unless required-check/branch protection is separately proven active.
- `Work verdict`: **PENDING**

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
