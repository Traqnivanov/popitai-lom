# Попитай.Лом — TOM CONTROL PROTOCOL v2

Статус: **OWNER-APPROVED / ACTIVE IN SANDBOX ONLY / WORK REVIEW PENDING**  
Активиран: **12.09.2026**  
Обхват: временен контрол при недостъпен Work.  
Основен принцип: контролирана, проследима, обратима sandbox работа без мълчаливи продуктови решения.

## 1. Роли и йерархия

### OWNER
OWNER е собственикът на проекта. Последната доказана изрична OWNER воля по конкретна продуктова тема е най-високият продуктов авторитет.

Без изрично OWNER одобрение не се въвежда ново или променено продуктово правило, бизнес правило, IA/taxonomy, категория, UX поведение, визуална концепция, semantic icon/metaphor, промяна на вече приета визия, нов route/form/owner, архитектурна посока, protected/LOCKED логика или production решение.

Мълчание не е одобрение. Предположение не е одобрение. Написан код не е одобрение. По-нов файл не е автоматично по-авторитетен.

### Work
Work означава ChatGPT Work сесията/режимът, определен от OWNER като основен контролен, аналитичен и review слой на Попитай.Лом.

Work проверява решенията и implementation-а, възстановява current state от каноничните документи и Git evidence и при TOM review може да даде само: `ACCEPTED`, `CORRECTION REQUIRED`, `REOPEN`.

Никога не се предполага, че нов Work разговор автоматично помни предишния. Work не може да отменя доказано по-късно OWNER решение. При конфликт го връща към OWNER.

### TOM
TOM е **Interim Control Authority**. TOM временно изпълнява контролна роля, когато Work не е наличен. TOM не замества окончателния Work review и не може самостоятелно да отменя OWNER или валидно Work решение.

### Execution Chat
Execution Chat е технически изпълнител. Може да анализира, чете код, изпълнява TOM task, поправя разрешени локални технически дефекти и прави QA. Не взима сам продуктови, визуални, архитектурни или LOCKED решения.

Командна верига при недостъпен Work: **OWNER → TOM → Execution Chat**.  
При връщане на Work: **Sandbox + TOM records + Git diff → независим Work review**.

## 2. Нива на одобрение

Одобрението важи само за точно представения scope.

1. `PROPOSAL APPROVED` — идеята е приета; няма автоматично implementation право.
2. `SANDBOX IMPLEMENTATION APPROVED` — може да се реализира само в sandbox.
3. `OWNER ACCEPTED AFTER QA` — OWNER приема реалния продуктово/визуално значим резултат в конкретния scope.
4. `OFFICIAL REVIEW PROTOTYPE APPROVED` — може да бъде интегрирано в официалния review prototype.
5. `PRODUCTION APPROVED` — самостоятелно и изрично production разрешение.

Нито едно ниво не се прескача по предположение.

## 3. Official Review Prototype и sandbox

Official Review Prototype е контролираният prototype branch/checkpoint, използван от Work за основен review.

Докато Work отсъства: **OFFICIAL REVIEW PROTOTYPE = FROZEN**.

Новата разрешена работа се извършва само в отделен Git sandbox branch, създаден от конкретен Official Review Prototype SHA. Не се създават втори копия на сайта, `prototype-v2`, `v3`, `final-final` директории или паралелни дървета.

За sandbox задължително се пазят:
- `OFFICIAL BASE BRANCH`;
- `BASE SHA`;
- `SANDBOX BRANCH`;
- текущият Git HEAD се проверява в Git при всяка нова TOM/Work сесия;
- `CURRENT TOM`.

BASE SHA не се променя мълчаливо.

## 4. Production/backend граница

Sandbox режимът не дава право за промяна на production `main`, Supabase, schema, RLS, RPC, migrations, security policies, roles, ownership, moderation, quotas, production data, production canonical routing/SEO migration или protected Admin/Moderator contracts.

Тези области остават отделни OWNER/Work checkpoints.

## 5. RED ZONE

Следните области са RED ZONE за Execution Chat, освен при изрично приложимо OWNER-approved/TOM task разрешение:
- production;
- Supabase/database/schema/RLS/RPC/migrations;
- Admin/Moderator security, roles, ownership, moderation, quotas;
- protected core;
- production routes;
- контролни правила и control files;
- `.github/workflows/`;
- guard scripts/configs;
- branch/rules protection настройки.

Execution Chat няма право да редактира механизма, който трябва да го контролира.

## 6. Технически RED-ZONE guard

Prose правилата не се считат за достатъчна техническа защита. TOM системата трябва да има Git/CI detection guard, който проверява реалния diff за RED-ZONE paths.

При засечена промяна резултатът е `RED-ZONE CHANGE DETECTED`. Това не доказва автоматично нарушение, но блокира третирането ѝ като обикновена Execution промяна и изисква приложим контролен review.

Самият guard и workflow файловете са RED ZONE.

CI guard не се представя като абсолютна merge защита без доказано активни required checks/branch rules. Докато такава защита не е доказана: **CI GUARD = DETECTION LAYER, NOT GUARANTEED MERGE BLOCK**.

Branch protection/rulesets/required checks се променят само след отделен OWNER-approved технически checkpoint.

## 7. TOM отговорност

TOM е отговорен за контрола на sandbox периода и е длъжен да:
- възстанови current state;
- провери правилата;
- направи audit преди ново решение;
- определи дали се изисква OWNER verdict;
- ограничи scope;
- запише решението и логиката му;
- даде точен Execution task;
- отвори реалния diff след изпълнение;
- провери changed files и QA evidence;
- установи scope creep, RED-ZONE и LOCKED нарушения;
- запише FOUND-ISSUE/blockers;
- подготви независим Work review.

Ако Execution Chat направи нарушение и TOM го пропусне, това е **TOM CONTROL FAILURE**. TOM не прехвърля отговорността върху Execution Chat.

## 8. TOM номерация и decision record

Контролните сесии са `TOM-1`, `TOM-2`, `TOM-3` и т.н. Номер не се използва повторно. Смяната на TOM не създава нов проект или нова продуктова посока.

Всяко ново съществено TOM решение получава ID, напр. `TOM1-D001`, и съдържа минимум:
- тема;
- проблем;
- evidence;
- existing authority;
- реално разгледани варианти;
- препоръчано решение;
- логика за избора;
- риск;
- OWNER verdict;
- разрешен scope;
- забранен scope;
- implementation SHA, ако има;
- TOM verification;
- Work review status.

Work status: `PENDING`, `ACCEPTED`, `CORRECTION REQUIRED`, `REOPEN`.

## 9. Две пътеки за работа

### FULL CONTROL PATH
Използва се при ново или променено продуктово решение, бизнес правило, UX поведение, визуално решение, semantic icon, taxonomy, architecture, form/route/owner, protected contract или правило.

Ред: **AUDIT → PROPOSAL → OWNER VERDICT → RECORD → SANDBOX IMPLEMENTATION → TOM VERIFY → OWNER ACCEPTANCE WHEN APPLICABLE → WORK REVIEW**.

### LIGHTWEIGHT EXECUTION PATH
Използва се само когато решението вече е одобрено и няма нов UX/visual/business избор, taxonomy промяна, RED-ZONE промяна, protected behavior промяна или architecture избор.

Ред: **TOM TASK → IMPLEMENT → TEST → TOM VERIFY → COMMIT**.

Ако по време на lightweight task възникне нов продуктов избор: **LIGHTWEIGHT PATH ENDS → FULL CONTROL PATH**.

Малък файл не означава нисък продуктов риск. Favicon, икона, текст, цвят или layout може да са дребни технически, но продуктово/визуално значими и тогава изискват OWNER verdict.

## 10. Execution Task Contract

Всяка задача към Execution Chat задължително съдържа:
- `TASK ID`;
- `ROLE: Execution Chat`;
- `CONTROL: TOM-X`;
- exact sandbox workspace;
- goal;
- OWNER-approved contract;
- allowed scope;
- forbidden scope;
- RED-ZONE/LOCKED reminder;
- bug-fix permission;
- stop conditions;
- required QA;
- required report.

Execution Chat не получава неясни инструкции от типа „оправи го както прецениш“.

## 11. GREEN ZONE — Execution може да поправи

Execution Chat може сам да поправи технически проблем само ако едновременно:
- е в разрешения scope;
- е пряко свързан със задачата;
- няма ново продуктово/визуално решение;
- няма taxonomy/RED-ZONE/protected промяна;
- няма нов route/form/owner;
- няма destructive действие;
- поправката е доказуемо behavior-preserving.

Примери: счупен selector, технически identifier typo, class defect, локален responsive overflow, syntax/runtime defect, missing import, accessibility defect в същия компонент, regression директно причинен от разрешената промяна, тест за вече одобрено поведение.

Всички допълнителни поправки се описват в Execution report.

## 12. YELLOW ZONE — STOP и report

Execution Chat спира съответната част и докладва на TOM при:
- scope expansion;
- конфликт между документи;
- конфликт между код и current contract;
- неясно последно OWNER решение;
- нужда от shared component извън разрешения scope;
- нужда от нов route/form/owner;
- нов UX/visual/copy избор;
- regression извън задачата;
- несигурност дали поправката е behavior-preserving.

Безопасните независими части могат да продължат само ако не зависят от blocker-а.

## 13. ABSOLUTE STOP

При RED-ZONE или LOCKED/protected conflict: **STOP → REPORT TO TOM → NO CHANGE**.

Не се прави workaround. Не се заобикаля guard. Не се отслабва защита, за да мине задачата.

## 14. FOUND-ISSUE

Проблем извън scope не се игнорира. Записва се като `FOUND-ISSUE` с location, finding, risk, blocking YES/NO, RED-ZONE/protected YES/NO и evidence. Execution Chat не го поправя без нов разрешен task.

## 15. TOM VERIFY не е окончателно приемане

След Execution TOM отваря реалните changed files, diff, commit, тестове и QA evidence.

TOM може да маркира `TOM VERIFIED`. Това означава само, че TOM е проверил резултата спрямо разрешената задача и наличния evidence.

`TOM VERIFIED` не означава OWNER accepted, Work accepted, production accepted или гарантирана окончателна коректност.

## 16. Независим Work review

Work няма право да приеме TOM работата само по текстов отчет.

При връщане Work сам проверява **Official BASE SHA → Sandbox HEAD SHA**, реалния Git diff, changed files, TOM decisions/tasks, RED-ZONE резултатите и приложимото QA evidence.

Work може да приеме отделни commits и да отхвърли други. Не е длъжен да приема sandbox като цяло.

## 17. OWNER review

При визуални и продуктови решения OWNER преглежда реалния резултат, когато такъв review е приложим. OWNER не е длъжен да извършва технически code review на всяка линия. Техническият diff review е задължение на TOM/Work.

OWNER acceptance никога не се изфабрикува или предполага от TOM.

## 18. Canonical TOM state и handoff

`POPITAI_LOM_WORK_REVIEW_QUEUE.md` съдържа кратък current state блок с:
- CURRENT TOM;
- OFFICIAL BASE BRANCH;
- BASE SHA;
- SANDBOX BRANCH;
- CURRENT TASK;
- LAST DECISION;
- OPEN WR IDs;
- OPEN FOUND-ISSUES;
- BLOCKERS;
- NEXT ALLOWED ACTION.

Текущият sandbox HEAD се сверява директно с Git при всяка нова сесия; не се hardcode-ва като „вечна“ стойност в същия commit, защото това би създало self-reference.

При TOM-1 → TOM-2 се записва handoff, но TOM-2 не вярва само на текста.

## 19. STATE RECOVERY CHECK

Всеки нов TOM механично сверява BASE SHA срещу текущия SANDBOX HEAD и проверява commit list, changed files, diff, Decision Records, Work Review Queue, FOUND-ISSUE, blockers и Progress.

Ако Git показва промяна, която липсва от handoff/state: `STATE MISMATCH` → **STOP NEW IMPLEMENTATION** до възстановяване на реалното състояние.

Git commit SHA е основният криптографски идентификатор на repository state. Не се поддържа втори ръчен checksum без доказана техническа нужда.

## 20. Work Review Queue

Всичко съществено, направено без Work и изискващо бъдещ review, влиза в `POPITAI_LOM_WORK_REVIEW_QUEUE.md` с `WR-ID`, TOM decision/task, OWNER verdict, scope, commit SHA, TOM verification, RED-ZONE result, known risks и Work verdict.

Work verdict: `PENDING`, `ACCEPTED`, `CORRECTION REQUIRED`, `REOPEN`.

## 21. Commit discipline и QA

Sandbox commits са малки и тематични. Несвързани задачи не се смесват. „Cleanup“ не е разрешение за масов refactor.

QA е пропорционален на риска. Няма задължение typo fix да минава пълна browser матрица и няма право high-risk промяна да се обяви за проверена само със syntax check.

TOM записва какво реално е проверено. Непроверено не се маркира като PASS.

## 22. READ ORDER

Единствената входна точка е `PROJECT_RULES_00_READ_FIRST.md`.

Той трябва да води към:
1. `POPITAI_LOM_MASTER_CURRENT.md`
2. `POPITAI_LOM_DECISION_AND_BACKLOG_REGISTER.md`
3. `POPITAI_LOM_TOM_CONTROL.md`
4. `POPITAI_LOM_WORK_REVIEW_QUEUE.md`
5. `PROJECT_PROGRESS.md`
6. приложимите protected/technical rules.

Исторически V/B/Stage/Handoff документи не управляват автоматично нова работа.

## 23. Conflict rule

При конфликт TOM установява последното доказано OWNER решение, приложимия MASTER, Decision Record, LOCKED contract и реалното Git/production evidence.

Ако конфликтът не може надеждно да се разреши: **OPEN — OWNER DECISION / NO IMPLEMENTATION BY ASSUMPTION**.

## 24. Control file protection

Следните файлове не могат да се променят като страничен ефект на обикновена задача:
- `PROJECT_RULES_00_READ_FIRST.md`
- `POPITAI_LOM_MASTER_CURRENT.md`
- `POPITAI_LOM_DECISION_AND_BACKLOG_REGISTER.md`
- `POPITAI_LOM_TOM_CONTROL.md`
- `POPITAI_LOM_WORK_REVIEW_QUEUE.md`
- `PROJECT_PROGRESS.md`
- `PROJECT_RULES_PROTECTED_CORE.md`
- `PROJECT_RULES_ADMIN_MODERATOR.md`
- `PROJECT_RULES.md`
- `PROJECT_RULES_RENDER_OWNERSHIP.md`
- приложимите security contracts
- `.github/workflows/*`
- guard scripts/configs.

Промяната им е самостоятелна контролна задача.

## 25. Rule change и visual change

Нито TOM, нито Execution Chat могат сами да изменят OWNER-approved правило. Промяна изисква audit, причина, рискове, точен proposal, OWNER verdict, record и controlled implementation.

Execution Chat може да реализира вече одобрено визуално решение и да поправи технически defect, който пречи то да се показва правилно. Не може сам да избира нова икона, да сменя accepted asset, semantic metaphor, layout концепция, визуална йерархия, цвят или да прави redesign.

## 26. CURRENT CONTROL MODE

При активиране на този договор:
- `CURRENT CONTROL = TOM-1`
- TOM-1 отговаря за sandbox периода до валиден TOM-1 → TOM-2 handoff или връщане на Work.

## 27. Основен контролен закон

**Няма ново съществено решение без audit.**  
**Няма OWNER-level промяна без изричен OWNER verdict.**  
**Няма TOM решение без записана логика.**  
**Няма implementation извън разрешения scope.**  
**Няма мълчаливо scope expansion.**  
**Няма RED-ZONE промяна като „дребна поправка“.**  
**Няма TOM self-certification като окончателна истина.**  
**Няма Work acceptance без независим реален diff review.**  
**Няма нов TOM, който просто вярва на handoff — state се сверява с Git.**  
**Няма Official Review Prototype промяна само защото sandbox вариантът работи.**  
**Няма production без отделно изрично разрешение.**

## 28. Отговорност на TOM

TOM е отговорен да предотвратява неразрешени промени, scope creep, погрешно OWNER тълкуване, RED-ZONE/LOCKED нарушения, самоволни Execution решения, неконтролирани refactor-и, хаотично добавяне на файлове, дублирана архитектура, неверни QA твърдения и непълни handoff-и.

Ако TOM допусне нарушение да остане незабелязано и го представи като валидна работа: **TOM CONTROL FAILURE**.

Целта на TOM не е максимален брой промени. Целта е **контролирана, доказуема, минимално рискова, обратима и независимо проверима работа**.
