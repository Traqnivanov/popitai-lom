# Попитай.Лом — INTERIM TOM / WORK CONTINUITY CONTROL

Статус: **OWNER-APPROVED INTERIM CONTROL / WORK REVIEW PENDING / DOCS-ONLY / NO PRODUCTION PERMISSION**
Дата на активиране: **17.09.2026**

## 1. Цел

Този документ пази непрекъсната, проверима и възстановима хронология, когато основният Work контрол временно не е наличен.

Той НЕ е продуктов Master, НЕ заменя `POPITAI_LOM_MASTER_CURRENT.md`, НЕ отменя `POPITAI_LOM_DECISION_AND_BACKLOG_REGISTER.md` и НЕ дава production, Supabase, schema, RLS/RPC, migration, security, role, ownership или protected-core permission.

Основната цел е следващ Work/TOM/Execution chat да може механично да установи:

- откъде е започнала временната работа;
- какво точно е направено;
- какво е OWNER-approved;
- какво чака Work review;
- какви blockers/found issues остават;
- коя е точната следваща разрешена задача.

## 2. Йерархия

Продуктовата и контролната йерархия е:

**OWNER → Work → Interim TOM → Execution Chat**

- OWNER е най-високият продуктов авторитет.
- Work е основният анализ/review/control слой.
- Interim TOM работи само докато Work е недостъпен и не може да измисля или променя OWNER/Work решения.
- Execution Chat е технически изпълнител в точен разрешен scope и не взема сам продуктови, архитектурни, визуални или LOCKED решения.

При връщане на Work временният TOM state подлежи на независим Work review.

## 3. Източници на истина и read order

Винаги първо се следва `PROJECT_RULES_00_READ_FIRST.md`.

Когато този interim control е активен, след Master и централния Register задължително се четат:

1. `POPITAI_LOM_TOM_CONTROL.md`;
2. `POPITAI_LOM_WORK_REVIEW_QUEUE.md`;
3. `PROJECT_PROGRESS.md`;
4. приложимите protected/technical rules.

Стар TOM/handoff/stage/prototype документ не става текуща истина само защото съдържа `APPROVED`, `LOCKED` или `CURRENT`.

## 4. Граница спрямо стария TOM-1 sandbox

Старият `sandbox/work-gap-review` и историческият TOM-1 protocol са **supporting evidence**, не текущ state.

Към активирането на този документ:

- няма доказан валиден TOM-2 handoff в текущия review branch;
- текущият TOM номер НЕ се предполага;
- старият `tom-red-zone-guard` НЕ се представя като каноничен или доказано действащ merge gate;
- `.github/workflows/`, guard scripts, branch/rules protection и technical enforcement не се променят от този docs-only checkpoint.

Техническо канонизиране на guard-а изисква отделен OWNER-approved task и Work review.

## 5. Един оперативен ledger

`POPITAI_LOM_WORK_REVIEW_QUEUE.md` е единственият living operational ledger за работа, извършена при недостъпен Work.

Той винаги съдържа минимум:

- CONTROL MODE / CURRENT TOM или изрично `UNASSIGNED`;
- OFFICIAL REVIEW BRANCH;
- BASE SHA;
- текущ control/work branch и HEAD verification rule;
- CURRENT PRODUCT TASK;
- CURRENT CONTROL TASK;
- LAST OWNER VERDICT;
- последно завършена задача;
- OPEN WR IDs;
- FOUND-ISSUES;
- BLOCKERS;
- exact `NEXT ALLOWED ACTION`.

Нова съществена задача не започва, ако queue не показва откъде продължава.

## 6. Хронология и task IDs

Докато TOM номерът е непотвърден, временните задачи използват неутрални ID-та:

- `INTERIM-D###` — decision record;
- `INTERIM-T###` — task;
- `WR-YYYYMMDD-###` — Work review item;
- `FI-YYYYMMDD-###` — found issue.

След доказан handoff/Work verdict може да се използва валидна TOM номерация. Съществуващите interim ID-та не се преномерират назад; историята остава непроменена.

Всеки съществен запис съдържа дата, тема, evidence, OWNER verdict, разрешен scope, забранен scope, SHA/commit когато има такъв, verification и Work status.

Допустими Work status стойности:

- `PENDING`;
- `ACCEPTED`;
- `CORRECTION REQUIRED`;
- `REOPEN`.

## 7. Задължителен handoff

При смяна на контролния чат/агент се прави handoff дори когато няма implementation.

Handoff съдържа минимум:

- FROM / TO или `TO: next interim controller` когато номерът не е доказан;
- official review branch + BASE SHA;
- current control/work branch;
- реалния HEAD към момента на handoff;
- CURRENT TASK;
- LAST DECISION / LAST TASK;
- OWNER-approved state;
- commits/changed files, ако има;
- OPEN WR IDs;
- FOUND-ISSUES;
- BLOCKERS;
- exact NEXT ALLOWED ACTION;
- изрично `CONTROL ENDS HERE` за предаващия контролен чат.

## 8. STATE RECOVERY CHECK

Нов Work/TOM/контролен чат не вярва само на handoff текста.

Преди нова съществена работа той сверява:

1. official review branch и BASE SHA;
2. текущ branch HEAD;
3. commit list и changed files от BASE до HEAD;
4. Master/Register/Queue;
5. последните decisions/tasks;
6. FOUND-ISSUES и blockers;
7. LOCKED safety HEAD и protected boundaries.

При несъответствие:

**STATE MISMATCH → STOP NEW IMPLEMENTATION → възстановяване на реалното състояние.**

## 9. Work review при връщане

Work не приема временната работа само по текстов отчет.

Work проверява independently:

- BASE SHA → актуален HEAD;
- реалния Git diff и changed files;
- queue chronology;
- decisions/tasks;
- приложимия OWNER verdict;
- RED-ZONE/LOCKED границите;
- наличното QA/evidence.

Work може да даде за всеки WR item само:

`ACCEPTED` / `CORRECTION REQUIRED` / `REOPEN`.

Докато Work не е дал verdict, записът остава `WORK REVIEW PENDING`.

## 10. RED ZONE / абсолютни забрани

Без отделно изрично OWNER разрешение и приложим контрол не се пипат:

- production `main`;
- Supabase/database/schema/RLS/RPC/migrations;
- roles, ownership, moderation, quotas, permanent delete;
- Admin/Moderator protected contracts;
- protected Firms/Listings/Masters internals;
- production routes/canonical/SEO cutover;
- LOCKED safety HEAD;
- `.github/workflows/`, guard scripts и branch/rules protection;
- контролният механизъм като страничен ефект на продуктова задача.

При нужда от такава промяна: **STOP → OWNER/Work checkpoint**.

## 11. Контрол над самите control files

`POPITAI_LOM_TOM_CONTROL.md` не се редактира при всяка задача. Той се променя само при доказана нужда от промяна на самия control contract и с изричен OWNER verdict.

`POPITAI_LOM_WORK_REVIEW_QUEUE.md` се обновява при всяка съществена временна задача, решение, handoff, blocker, found issue или промяна на `NEXT ALLOWED ACTION`.

Нито един от двата файла не може сам да промени Master, protected contract или production permission.

## 12. Текущ activation verdict

OWNER verdict от **17.09.2026**:

- одобрява се минимален docs-only continuity mechanism;
- целта е Work и всеки следващ TOM да виждат една и съща хронология и exact next action;
- механизмът е **INTERIM / WORK REVIEW PENDING**;
- не се приема автоматично старият TOM-1 current state;
- не се предполага TOM-2 номер;
- не се активира технически guard;
- няма production/Supabase/prototype implementation permission от този документ.
