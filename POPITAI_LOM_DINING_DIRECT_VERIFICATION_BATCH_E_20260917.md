# Попитай.Лом — dining direct verification — Batch E — 17.09.2026

Статус: **INTERIM RESEARCH EVIDENCE / WORK REVIEW PENDING / NO IMPORT / NO RUNTIME OR PRODUCTION PERMISSION**

Контрол: `POPITAI_LOM_WORK_REVIEW_QUEUE.md` → `INTERIM-T004`.
Предходен consolidated report: `POPITAI_LOM_DINING_DIRECT_VERIFICATION_20260917.md` (Batch A–D).

## 1. Цел и граница

Това е последният high-signal dining пакет преди спиране на broad directory-driven verification. Проверени са само:

- `Пицария Палма`;
- `Ресторант Бохеми`;
- `Китайски ресторант`;
- `Скарата на Дядо Кольо`;
- `При Лазар 1`.

Правилата остават непроменени: first-party source е предпочитан; Maps/Oink/Орли/други каталози са secondary evidence; конфликт не се решава по предположение; няма automatic import/merge, schema, prototype, production или Supabase промяна.

## 2. Пицария Палма — CURRENT SECONDARY + EXISTING BUSINESS-PAGE LEAD, DIRECT CURRENT PROOF STILL OPEN

Съществуващият inventory research record вече пази business-page lead и телефонен signal, но current address/hours/activity са OPEN.

В Batch E current secondary evidence показва:

- 2026 Орли profile;
- Oink/Google-derived current listing;
- address signal `ул. Хан Крум 2`;
- phone/name continuity около `Pizza Palma / Пицария Палма`.

Не беше извлечен достатъчен current managed first-party post/page content, който да затвори exact current activity + address + hours като official fields.

### Verdict

**KEEP EXISTING INVENTORY RECORD `candidate_unverified / research_only`.**

Не се заменя existing OPEN state с directory values. `current_active_status`, exact current address/hours и duplicate/current identity остават за direct/OWNER verification.

## 3. Ресторант Бохеми — OWNER-CONFIRMED EXISTENCE + CURRENT MAPS SIGNAL, DIRECT FIELDS STILL OPEN

OWNER вече е потвърдил, че `Ресторант Бохеми` съществува.

Current Maps/business evidence показва local entity `Бохеми Лом` на `ул. Славянска 22` с телефон `0971 60 606` и current hours signal.

General web search е силно замърсен от едноименни ресторанти `Бохеми` в други градове. Не беше намерен чист current first-party Lom source, който да докаже exact address/phone/hours като official fields.

### Verdict

**KEEP OWNER-CONFIRMED PARTIAL / RESEARCH-ONLY.**

OWNER confirmation доказва existence, не exact address/phone/hours. Current Maps fields остават secondary до direct proof.

## 4. Китайски ресторант — SAME PHONE / CONFLICTING ADDRESSES

Намерени secondary records за Lom показват един и същ телефон:

`0894 451 212`

но различни адреси:

- `ул. Дунавска 38`;
- `ул. Цар Симеон 3`.

Единият secondary record публикува и hours signal, но няма first-party source, който да установи кой адрес е текущ, дали е имало преместване или дали каталогът е stale.

### Verdict

**SUSPICIOUS / ADDRESS-CONFLICT / OWNER LOCAL CHECK REQUIRED.**

Не се избира адрес по рейтинг, crawl date или каталог. Exact OWNER въпрос: `къде реално работи сега китайският ресторант с телефон 0894 451 212 — Дунавска 38, Цар Симеон 3, друг адрес или вече не работи?`

Няма machine-readable record от този pass.

## 5. Скарата на Дядо Кольо — CURRENT MAPS SIGNAL, NO FIRST-PARTY SOURCE

Current Maps/business evidence показва `Скарата на Дядо Кольо` като barbecue restaurant в центъра на Лом с current hours/review footprint.

Не беше намерен managed first-party site/social/operator source за exact identity, address, phone и hours.

### Verdict

**RESEARCH-ONLY / DIRECT SOURCE OPEN.**

Current Maps presence е полезен activity signal, но не се превръща автоматично в official persistent fields.

## 6. При Лазар 1 — STRONG CURRENT SECONDARY, NO DIRECT SOURCE

Current Maps + Oink показват `При Лазар 1` като ресторант в Лом с висок current review footprint; Oink изрично маркира business profile като `Непотвърден`.

Не беше намерен надежден managed first-party source за exact address, phone, hours или relation с `Лазар 3ти ет.`.

### Verdict

**RESEARCH-ONLY / IDENTITY RELATION + DIRECT SOURCE OPEN.**

Не се създават отделни persistent records за `При Лазар 1` / `Лазар 3ти ет.` преди identity mapping.

## 7. Machine-readable inventory decision after Batch E

Batch E **не променя `content-inventory/records.v1.json`**.

Причини:

1. `Палма` и `Бохеми` вече са представени с правилно ограничени research/owner-confirmed records и няма достатъчно evidence да се повишат;
2. `Китайски ресторант` има конкретен address conflict;
3. `Скарата на Дядо Кольо` и `При Лазар 1` остават secondary-only;
4. няма clean new first-party candidate в Batch E;
5. broad directory search вече дава основно conflict/secondary noise, а не нови direct records.

## 8. T004 closure verdict

`INTERIM-T004` се счита за **COMPLETED — BOUNDED DINING DIRECT VERIFICATION REACHED DIMINISHING RETURNS / WORK REVIEW PENDING**.

Резултатът от Batch A–E е достатъчен за следващата контролирана стъпка:

- един силен direct candidate: `Дюнер Lab`, с запазен hours conflict;
- множество research-only/direct-source-open candidates;
- отделен OWNER local-check pool за status/identity/address conflicts;
- category contamination cases, които не трябва да се превръщат в dining records;
- няма automatic inventory import.

## 9. Следващо допустимо действие

Широкото dining търсене **спира тук**.

Следващият bounded task трябва да бъде **exact inventory proposal за `Дюнер Lab`**, без директен write в `records.v1.json` преди proposal audit. Proposal-ът трябва да определи точно:

- canonical owner mapping;
- кои полета са official;
- как се записва hours conflict без измисляне;
- source IDs + checked date;
- open fields;
- prototype eligibility/readiness;
- production gate;
- duplicate/currentness checks, които остават OPEN.

Няма production/Supabase/prototype implementation permission.