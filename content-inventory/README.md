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

## Правилен ред

1. Official-source / owner evidence се вписва поле по поле.
2. `validate_inventory.py` трябва да мине без грешка.
3. Owner review одобрява точните записи и видими полета.
4. Отделен bounded prototype adapter може да чете само `prototype.selected=true`; самият V1 не включва такъв adapter.
5. Desktop + 390 px QA и content/owner audit.
6. Отделно Stage 3 решение по production owner и migration matrix row.
7. Контролиран import/update на малък batch с rollback; никога масов автоматичен import.

## Файлове

- `schema.v1.json` — машинно четим договор;
- `records.v1.json` — началният record inventory;
- `validate_inventory.py` — deterministic validation без външни зависимости.

