# Попитай.Лом — Content Inventory V1

Статус: **WORK 2 CONTROL CONTRACT / OWNER-AUTHORIZED CREATION / OWNER REVIEW PENDING / NO RUNTIME PERMISSION**

Този каталог е единният pre-production опис на конкретни обекти и evidence. Той не е нов datastore, не е публичен UI, не се зарежда автоматично от прототипа и не разрешава запис в production или Supabase.

## Защо съществува

Съдържанието в прототипа, старите JS fixtures, production owner модулите и изследователските доклади не трябва да се превръщат в конкуриращи се каталози. Всеки реален обект получава един inventory запис, който показва:

- кой е каноничният production owner;
- кое поле от какъв източник е доказано;
- кое е само owner-confirmed или secondary signal;
- кои полета са OPEN или конфликтни;
- може ли записът да участва в ограничен prototype review;
- какъв отделен gate е нужен преди production.

## Непроменими граници

1. Един реален обект = един inventory `id`; claim или допълване обновява същия запис.
2. Съществуващ production запис не се копира. Полето `canonical_record_id` сочи към него, когато идентификаторът бъде потвърден.
3. Owner-confirmed existence не доказва адрес, категория, телефон, работно време, лиценз или active status.
4. Динамични цени и наличности не се копират.
5. `production.write_allowed` остава `false`, докато няма отделно owner approval, приложим contract и migration row.
6. Няма автоматичен import. Всеки production batch е owner-by-owner, record-by-record и rollbackable.
7. Съществуващите Info Lom области не се изграждат повторно и не се дублират в статии.
8. Stage 3, production `main`, Supabase/schema/RLS/RPC и LOCKED safety HEAD не се променят от този каталог.

## Канонично ownership mapping

| Entity | Owner | Collection | Category / subcategory |
| --- | --- | --- | --- |
| Заведение | Firms | `businesses` | `Заведения` |
| Настаняване | Firms | `businesses` | `Настаняване` |
| Бензиностанция | Info Lom | `info_entries` | `komunalni` / `benzinostantsii` |
| Организация / НПО | Organizations | production contract OPEN | отделен тип `Организация` |
| Статия | Articles/editorial | production contract OPEN | article-by-article source/review gate |

## Статуси

- `officially_verified` — записът има достатъчно официално evidence за посочените полета; това не означава production approval.
- `owner_confirmed_partial` — собственикът потвърждава съществуването, но официални полета остават OPEN.
- `conflict` — има несъвместими сигнали, които трябва да бъдат разрешени.
- `candidate_unverified` — изследователски кандидат без достатъчно evidence.

`publication_readiness` е отделна ос:

- `verified_for_bounded_prototype` — може да бъде предложен в ограничен Stage 2 adapter след owner review;
- `research_only` — остава само в inventory/research;
- `blocked` — не се показва, докато описаният конфликт/gate не бъде затворен.

## OWNER local-check workflow — подозрителни обекти

OWNER verdict: **APPROVED — 17.09.2026**.

Този workflow важи за хотели/настаняване, заведения, магазини и всеки друг местен обект, при който online evidence е старо, противоречиво, недостатъчно или има надежден местен сигнал, че реалният статус може да е различен.

### Кога обект влиза за местна проверка

Обектът се маркира за OWNER local check, когато има поне един от следните случаи:

- online directory/Maps запис съществува, но няма достатъчно доказана текуща активност;
- официална/управлявана страница е стара или не доказва текущо състояние;
- адрес, телефон, име, ownership или activity signal си противоречат между източници;
- има вероятност за затваряне, преместване, преименуване или duplicate/same-business identity;
- OWNER дава местен сигнал, който противоречи на остарял online listing.

### Как се третира преди проверката

- Не се маркира автоматично `active`.
- Не се маркира автоматично `closed` само по слаб или стар online сигнал.
- Не се изтрива от research history.
- Не се допуска като public-ready/active record, докато конфликтът за статуса е отворен.
- Съществуващите отделни полета се оценяват независимо; доказан телефон не доказва работно време, доказан адрес не доказва active status и т.н.
- Когато текущата V1 schema няма отделно status поле за този workflow, използват се съществуващите `evidence_status`, `publication_readiness`, `open_fields`, field evidence/status и `notes`, без schema промяна по предположение.

### OWNER local verification

След местна проверка OWNER може да потвърди само реално установения operational/identity статус:

- `active`;
- `closed`;
- `moved`;
- `renamed`;
- `duplicate/same business`;
- `unresolved`.

OWNER local verification на existence/status **не доказва автоматично** телефон, работно време, exact address, category, website/social URL, лиценз или други независими полета. Те продължават да изискват приложимото field-level evidence.

### Как се записва резултатът

За всяка местна проверка се пазят минимум:

- дата на проверката;
- какво точно е потвърдено от OWNER;
- кои полета/identity въпроси остават OPEN;
- наличното online evidence и конфликтите му;
- publication readiness след проверката;
- ако е приложимо — връзката към canonical/duplicate record вместо създаване на втори реален обект.

Не се заличава предишната evidence история. При промяна на реалния статус новото потвърждение се добавя като по-нов evidence layer, а старото остава проследимо.

### Списък за OWNER обход/проверка

Всички обекти с този workflow трябва да могат да бъдат изведени като един общ списък за местна проверка, независимо дали са заведения, хотели, магазини или друг тип. Списъкът е контролен/research output, не публичен каталог и не разрешава production write.

## Правилен ред

1. Official-source / owner evidence се вписва поле по поле.
2. При съмнителен current/identity status се прилага OWNER local-check workflow преди public-ready класификация.
3. `validate_inventory.py` трябва да мине без грешка след всяка промяна на machine-readable records.
4. Owner review одобрява точните записи и видими полета.
5. Отделен bounded prototype adapter може да чете само `prototype.selected=true`; самият V1 не включва такъв adapter.
6. Desktop + 390 px QA и content/owner audit.
7. Отделно Stage 3 решение по production owner и migration matrix row.
8. Контролиран import/update на малък batch с rollback; никога масов автоматичен import.

## Файлове

- `schema.v1.json` — машинно четим договор;
- `records.v1.json` — началният record inventory;
- `validate_inventory.py` — deterministic validation без външни зависимости.
