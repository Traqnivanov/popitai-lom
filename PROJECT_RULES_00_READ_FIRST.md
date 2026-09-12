# Попитай.Лом — ПРОЧЕТИ ПРЕДИ ВСЯКА РЕДАКЦИЯ

Статус: **ЕДИНСТВЕНА ВХОДНА ТОЧКА ЗА WORK / TOM / EXECUTION CHAT**  
Актуализирано за TOM sandbox control: **12.09.2026**

Този файл е кратката входна карта към текущата продуктова истина, временния TOM контрол и защитените технически правила.

## 0. Абсолютно стартово правило

Не започвай от стар handoff, prototype, V/B/Stage документ, произволен README или от паметта на предишен чат.

**Всеки нов Work, TOM или Execution Chat започва от този файл.**

Не карай OWNER да възстановява проекта от паметта си.

## 1. Единствен задължителен ред за четене

Преди нова работа се четат текущите източници в този ред:

1. `POPITAI_LOM_MASTER_CURRENT.md` — текущата продуктова истина: кое е ОДОБРЕНО, ЗАПАЗЕНО/LOCKED, ОТВОРЕНО, ОТХВЪРЛЕНО и ИСТОРИЯ.
2. `POPITAI_LOM_DECISION_AND_BACKLOG_REGISTER.md` — статус, evidence, provenance и история на решенията; не отменя Master.
3. `POPITAI_LOM_TOM_CONTROL.md` — действащият временен контролен договор, когато Work не е наличен.
4. `POPITAI_LOM_WORK_REVIEW_QUEUE.md` — current TOM state и всичко съществено, направено без Work, което чака независим Work review.
5. `PROJECT_PROGRESS.md` — кратък текущ checkpoint, активен branch/control mode и точната следваща позволена стъпка; не е втори Master.
6. `PROJECT_RULES_PROTECTED_CORE.md` — защитеното business/backend ядро.
7. `PROJECT_RULES.md` — глобалните технически правила.
8. `PROJECT_RULES_ADMIN_MODERATOR.md` — задължително когато задачата засяга Admin/Moderator, moderation, roles, permissions, RLS/RPC или related UI/actions.
9. `PROJECT_RULES_RENDER_OWNERSHIP.md` — задължително когато задачата засяга render/UI/JS ownership.
10. Task-specific договор се чете само когато задачата реално засяга съответния owner/module.

Нито `PROJECT_PROGRESS.md`, нито Review Queue, нито TOM могат сами да отменят Master, доказано OWNER решение или приложим LOCKED contract.

## 2. Как се определя кое решение е финално

За конкретна тема важи:

1. последното доказано изрично решение на OWNER;
2. текущият `POPITAI_LOM_MASTER_CURRENT.md`;
3. приложимият Decision Record и LOCKED технически договор;
4. провереното реално production/Git поведение, когато документите не дават достатъчен отговор;
5. Review Queue и Progress описват контрол/състояние, но не създават сами продуктова истина.

Никога не важи правилото „най-новият документ печели“.

Надпис `APPROVED`, `LOCKED`, `AUTHORITATIVE`, `CURRENT` или подобен в стар файл не може да надделее над по-късно изрично OWNER отхвърляне или заместване.

Предложение, експериментален prototype, draft или вече написан код не става автоматично одобрено продуктово решение.

Липсата на повторно споменаване не е отмяна.

При истински конфликт между две изрично одобрени решения без доказано по-късно заместване: `OPEN — OWNER DECISION`. Не се имплементира по предположение.

## 3. TOM control mode при недостъпен Work

Когато `POPITAI_LOM_WORK_REVIEW_QUEUE.md` показва активен TOM:

- Official Review Prototype е frozen;
- всяка нова разрешена prototype работа се прави само в записания sandbox branch;
- TOM е Interim Control Authority;
- Execution Chat изпълнява само точен TOM task и не взима сам продуктови/визуални решения;
- всяко съществено решение се записва с логиката му;
- работата без Work остава `WORK REVIEW = PENDING` до независим Work diff review;
- production `main`, Supabase и protected backend/core не се пипат без отделен изричен checkpoint.

При TOM limit се преминава TOM-1 → TOM-2 → TOM-3 чрез записан handoff + задължителен Git-based State Recovery Check. Нов TOM не вярва само на handoff текста.

## 4. Execution Chat — постоянна граница

Execution Chat е технически изпълнител, не продуктов ръководител.

Всяка задача към него трябва да напомня минимум:

- ролята му;
- текущия TOM;
- exact sandbox workspace;
- goal и OWNER-approved contract;
- allowed/forbidden scope;
- RED-ZONE/LOCKED граници;
- кога може да поправя локален технически bug;
- кога задължително спира и докладва;
- required QA/report.

Очевиден behavior-preserving технически defect вътре в разрешения scope може да бъде поправен и докладван. При LOCKED/RED-ZONE, нов UX/visual/product choice, scope expansion, destructive action или реален конфликт: **STOP → REPORT TO TOM → NO CHANGE**.

## 5. Исторически документи — не управляват нова работа

Всички V1–V17, B1–B9, Stage, Recovery, Prototype, Handoff, dated QA и по-стари public-IA/marketplace спецификации са:

> **ИСТОРИЯ / SUPPORTING EVIDENCE — НЕ ИЗПОЛЗВАЙ КАТО ТЕКУЩА ПРОДУКТОВА ИСТИНА**

Те:

- не се четат по подразбиране;
- не участват автоматично в задължителния read order;
- не могат самостоятелно да отменят `POPITAI_LOM_MASTER_CURRENT.md`;
- могат да се използват за конкретен технически detail/evidence при нужда;
- при риск от остаряване се сверяват с текущия Master/Register и реалния код/production.

Старият четиригрупов marketplace модел и prototype-и, които го използват, са история и не управляват новата IA.

## 6. Защитено ядро

Без отделно изрично одобрение не се променят като страничен ефект:

- Admin/Moderator границата;
- роли, права, RLS, ownership и status flows;
- permanent delete и role/access management;
- Moderator self-moderation защитата;
- approval/correction/reject/direct-publish логиката;
- квоти, media limits и backend enforcement;
- фирмени и разширени фирмени профили;
- Listings owner и съществуващата логика за обявите;
- Health/Info, Shops и Event owners;
- съществуващите проверени форми и moderation потоци;
- protected relevance/Иванов Ремонти приоритетът;
- render ownership правилата.

Protected Core пази underlying business/backend/SEO поведение. Той не връща отменена стара public discovery IA, когато има доказано по-късно OWNER-approved replacement. Ако границата е неясна: STOP и TOM/OWNER review.

## 7. Текуща продуктова граница

- Public discovery/marketplace IA е ОДОБРЕНА и е описана в Master.
- Деветте Home discovery входа са `Услуги`, `Купува и продава`, `Работа`, `Имоти`, `Автомобили`, `Здраве и частни лекари`, `Магазини`, `Заведения`, `Животни`.
- Новите Services са offer-only: само `Предлагам услуга`; legacy `Търси` остава backward-compatible read/edit.
- Services taxonomy е owner-consolidated до 9 families / 45 visible discovery entries; exact aliases/filters/cross-links пазят точните intents.
- Info Lom остава отделна verified справочна система, не marketplace.
- Stage 2 като цяло остава неприет; production и Stage 3 са блокирани до отделни checkpoints.
- Точният current task и sandbox/control state се четат от `POPITAI_LOM_WORK_REVIEW_QUEUE.md` и `PROJECT_PROGRESS.md`.

## 8. Текущо разрешение за работа

По принцип са разрешени read-only audit, документационна консолидация, inventory/benchmark/UX проверка, изолиран prototype work в разрешения sandbox и приложим desktop/mobile/accessibility QA.

Не са разрешени без отделно изрично решение:

- merge/deploy към production `main`;
- Supabase/schema/RLS/policy/migration промени;
- нов production owner/form/backend;
- промяна на Admin/Moderator, quotas, ownership, direct-publish или approval semantics;
- промяна на protected Firms/Listings/Masters internals като страничен ефект;
- production route/canonical migration;
- нов конкуриращ renderer вместо ясен owner.

## 9. RED-ZONE control files

Следните файлове/области не се редактират като страничен ефект на обикновена Execution задача:

- този файл;
- Master;
- Decision Register;
- TOM Control;
- Work Review Queue;
- Progress;
- protected/security rules;
- `.github/workflows/*`;
- guard scripts/configs.

Промяната им е самостоятелна контролна задача с приложимото одобрение.

## 10. Основно правило за следващ Work/TOM/Chat

Първо възстанови state. После действай.

Ако Work се е върнал и Review Queue съдържа `PENDING` записи, Work първо прави независим review на реалния `Official BASE SHA → Sandbox HEAD` diff. Не започва нова продуктова линия преди да класифицира pending queue-а.

Ако TOM е активен, следвай TOM Control Protocol и текущия state. Ако си Execution Chat, не разширявай сам scope-а.

OWNER не трябва да възстановява проекта вместо агента.
