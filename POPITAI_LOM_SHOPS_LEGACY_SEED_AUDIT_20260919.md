# Попитай.Лом — Магазини legacy seed audit — 19.09.2026

Статус: **INTERIM READ-ONLY CONTENT AUDIT / WORK REVIEW PENDING / NO DATA OR PRODUCTION WRITE**

Контрол: `POPITAI_LOM_WORK_REVIEW_QUEUE.md` → `INTERIM-T012`.

## 1. Обхват

Този audit проверява само вече съществуващото съдържание за `Магазини` в repo-то.

Проверени evidence файлове:

- `magazini.html`;
- `shops-catalog-v3.js`;
- `shops-catalog-v2.js`;
- `admin-shops.js`;
- `supabase/migrations/20260821224500_seed_static_shops_stage1.sql`;
- `supabase/migrations/20260821201249_shops_stage2_preserve_tags_and_groups.sql`;
- текущите Stage 2 content/control документи.

Не е правен city-wide web discovery. Не е четена/променяна production Supabase data. Няма runtime/prototype/category/schema промяна.

## 2. Основен системен факт

Старият V2 каталог съдържа **37 static shop records**:

- 12 хранителни;
- 8 строителни;
- 4 техника;
- 3 мебели;
- 4 дрехи;
- 6 дом/специализирани.

Migration `20260821224500_seed_static_shops_stage1.sql` ги копира в `public.shops` като:

- `source_type = 'public'`;
- `source_details = 'Мигрирано от shops-catalog-v2.js — етап 1'`;
- `status = 'approved'`;
- reviewed by Admin.

Това е migration/seed provenance, **не record-by-record current verification**.

Текущият `shops-catalog-v3.js` вече не рендерира `staticShops`; той чете от Supabase само редове с `status='approved'`.

Следователно, ако seed migration е приложена и редовете не са били по-късно коригирани/скрити, тези legacy записи са технически eligible за публично показване. Този audit **не твърди**, че production DB в момента съдържа точно 37 активни реда, защото Supabase не е четен.

## 3. Контролен риск

**FI-SHOPS-LEGACY-SEED — HIGH CONTENT-QUALITY RISK**

`approved` при legacy seed записите не трябва да се интерпретира като:

- current active business;
- проверен адрес;
- проверен телефон;
- проверено работно време;
- доказана canonical identity.

В legacy model липсва record-level `checked_at` / direct source URL / field-level evidence contract като този в `content-inventory/`.

До отделна verification стъпка всички 37 legacy seed rows трябва да се разглеждат като **legacy approved seed / currentness not established by this migration**.

## 4. Вътрешни identity / duplicate / location рискове

Следните групи са конкретни repo-level candidates за проверка. Те **не се сливат и не се затварят автоматично**.

### 4.1 Multi-location brands — не са duplicate само по име

- `МОЯТ МАГАЗИН` — 2 адреса;
- `Строймаркет Орбита` — 2 адреса;
- `Мебелна къща Мура` — 2 адреса;
- `Вирея / Близнаците` — 3 адреса/варианта.

Тези записи трябва да се пазят отделно по физически обект, докато не се докаже друго.

### 4.2 Alias / composite-name candidates

Имената комбинират brand, legal/operator или описателен alias и изискват canonical mapping преди чист public identity:

- `Вирея 1 / Близнаците`;
- `Вирея 3 / Близнаците`;
- `Вирея 4 / Близнаците`;
- `Colors / Колорс Георгиеви`;
- `Дартон / Магазин за бани`;
- `ОТП ФОРУМ ЛОМ / ФОРУМ АУТЛЕТ`;
- `Джиесемите / П енд М Трейдинг`;
- `Борислав Борисов – ББ`.

Не се избира едната част на името като canonical по предположение.

### 4.3 Vague/generic identities or locations

Нуждаят се от местна/direct identity проверка преди да се приемат като clean business record:

- `STOP&SHOP` — адресът е само `Център, Лом`;
- `Агро Център` — адресът е само `Младеново, Лом`;
- `Фуражи и храни за любимци` — generic descriptive name без доказана canonical business identity.

### 4.4 Address-sharing candidate

- `TechnoArena Лом` — `ул. Хан Аспарух 6`;
- `Мебелна къща Мура – Хан Аспарух` — `ул. Хан Аспарух 6`.

Това **не е доказан duplicate**. Може да са два отделни обекта/помещения или исторически/stale записи. Нужен е direct/local check преди заключение.

### 4.5 Similar-name relation that must stay OPEN

- `МОЯТ МАГАЗИН` (2 locations);
- `Моят Магазин „Народен“`.

Сходното име не доказва еднакъв operator/brand. `Народен` остава отделна identity, докато няма доказателство.

## 5. Dynamic-field risk

Legacy seed-ът съдържа телефони и работно време за част от записите, но migration provenance не доказва currentness на тези динамични полета.

Особено при national/regional chains или магазини с публикувани часове, exact phone/hours не трябва да се приемат за current само защото са в seed-а.

Това важи например за:

- `T MARKET Лом`;
- `Lidl Лом`;
- `TechnoArena Лом`;
- `ОТП ФОРУМ ЛОМ / ФОРУМ АУТЛЕТ`;
- `Pepco Лом`;
- `FLAIR Lom`;
- и всички други seed rows с phone/hours.

Няма verdict `closed` или `active` от този repo-only audit.

## 6. Какво НЕ се прави

- не се delete-ва legacy seed;
- не се сменя `approved` в Supabase;
- не се редактират адреси/телефони/часове;
- не се merge-ват multi-location records;
- не се добавят нови магазини;
- не се променя taxonomy/UI/prototype;
- не се чете production DB в този task.

## 7. T012 verdict

`INTERIM-T012` е **COMPLETED — REPO-ONLY AUDIT**.

Основният резултат е, че shop каталогът има отделен content-reality debt: 37 legacy seed records са били operationally approved от migration, но не носят record-by-record verification provenance.

Следващата безопасна атомарна стъпка е отделен **T013 — Shops OWNER local-check shortlist**, изграден само от горните concrete identity/location/currentness risks. Той не трябва да включва всички 37 автоматично и не трябва да променя data/status.
