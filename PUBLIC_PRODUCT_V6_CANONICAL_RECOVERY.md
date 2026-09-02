# Попитай.Лом — V6 CANONICAL RECOVERY

Статус: **UPDATED DRAFT FOR WHOLE-STRUCTURE APPROVAL / NO CODE / NO PRODUCTION CHANGE**  
Branch: `v6-product-foundation-draft`  
Recovery baseline before this revision: `d703ea9deddff54273c4d8427c72025204cff19b`  
Актуализирано: 03.09.2026

## 1. ЦЕЛ И FREEZE

Този документ е актуализираният Recovery target след последното продуктово решение на собственика. Той не започва проекта отначало и не отменя работещата production основа.

До изрично цялостно одобрение на структурата:

- **няма код**;
- не се започва V18 или нов visual layer;
- не се променя `main`;
- не се merge-ва V6 към production;
- не се променят роли, права, RLS, schema, ownership, status/approval flow, лимити, media или Admin/Moderator логика;
- не се променя protected ranking на „Иванов Ремонти“;
- не се изтрива и не се презаписва работещо Health/Info/Firms/Listings съдържание;
- текущият V17 prototype не е продуктова истина и не е acceptance baseline.

Този документ и `PUBLIC_PRODUCT_V6_IMPLEMENTATION_MATRIX.md` са **review package**, не разрешение за implementation.

## 2. AUTHORITY И КАК СЕ ТРЕТИРА СТАРАТА 4-GROUP АРХИТЕКТУРА

LOCKED правилата остават с най-висок приоритет:

1. `PROJECT_RULES_00_READ_FIRST.md`;
2. `PROJECT_RULES_PROTECTED_CORE.md`;
3. `PROJECT_RULES_ADMIN_MODERATOR.md`;
4. `PROJECT_RULES.md`;
5. `PROJECT_RULES_RENDER_OWNERSHIP.md`.

След последното решение на собственика, публичната 4-group структура от `PUBLIC_MARKETPLACE_V3_APPROVED_SPEC.md` и предишната Recovery версия **не е разрешение за нов код**. За текущия review се предлага следната по-ясна публична структура с 5 входа.

Докато собственикът не одобри целия пакет, старите 4-group документи се третират само като compatibility/evidence source за:

- един top-level вход `Обяви и услуги`;
- един listings owner;
- отделен Add flow;
- category card = browse/navigation;
- backward compatibility;
- protected owners, ranking и edit safety.

След цялостно одобрение трябва да има отделен documentation sync на `READ_FIRST`/Marketplace V3/Progress/Index **преди код**, така че да няма две конкуриращи се канонични презентационни истини.

## 3. КАНОНИЧЕН ПРОДУКТОВ МОДЕЛ

Основният публичен вход остава:

**Обяви и услуги**

В него човек вижда пет ясни публични входа:

1. **Услуги**
2. **Автомобили**
3. **Работа**
4. **Имоти**
5. **Купува и продава**

Публичните имена `Други услуги` и `Други обяви` отпадат.

Основният модел е:

`Обяви и услуги → публичен вход → категория/подкатегория → реални резултати`

и отделно:

`Добави обява → контекст → protected listing form`

Въпросите са secondary/supporting, не водещо действие.

## 4. GLOBAL NAVIGATION — НЕ СЕ ПРОМЕНЯ

Desktop:

`Начало | Обяви и услуги | Фирми | Инфо Лом | Статии | Още ▼ | Профил | + Добави`

Mobile:

`Начало | Обяви | + | Инфо | Профил`

Няма top-level `Категории`. `kategorii.html` остава compatibility вход към marketplace, не второ дърво.

## 5. `ОБЯВИ И УСЛУГИ` LANDING

Canonical landing: `obyavi.html`.

Above the fold:

1. breadcrumb;
2. H1 `Обяви и услуги`;
3. search `Какво търсиш?`;
4. един CTA `Добави обява`;
5. пет public cards:
   - Услуги;
   - Автомобили;
   - Работа;
   - Имоти;
   - Купува и продава.

Под тях:

- релевантни approved/active резултати;
- content-type label `Обява` / `Фирма` / специализиран verified result, когато owner-ът е различен;
- filters/sort само когато са приложими;
- secondary Q&A/Guides след реалните резултати или при true no-result.

Няма raw DB category списък като главна IA.

## 6. `УСЛУГИ` — PUBLIC GROUPING

`Услуги` е публичен discovery вход. Техническата listing category `Услуги` остава compatibility/storage стойност и не се показва като обяснение за backend-а.

В `Услуги` има осем ясни групи:

1. **Майстори и ремонти**
2. **Здраве и грижа**
3. **Домашни услуги**
4. **Красота и лична грижа**
5. **Компютърни и технически услуги**
6. **Професионални услуги**
7. **Обучение и уроци**
8. **Транспорт и доставки**

### 6.1 Майстори и ремонти — protected

Route: `maistori.html`.

Подкатегории:

- Цялостни ремонти
- Бани и плочки
- ВиК
- Електро
- Покриви
- Боядисване
- Дограма
- Климатици

Read composition:

- approved active Listings;
- relevant approved Firms;
- protected Masters/Construction presentation;
- protected Ivanov/Admin/boost priority **след relevance**.

Не се променя protected owner, ranking, write flow или SEO/detail логика.

### 6.2 Здраве и грижа — specialized + listings composition

Public entry label в `Услуги`: **Здраве и грижа**.

Destination: съществуващата `zdrave-i-lekari.html`.

Самата страница запазва съществуващия specialized Health/Info content:

- реални лекари и практики;
- лични лекари;
- специалисти;
- стоматолози;
- ветеринари;
- търсене и филтри;
- адреси, телефони и практики;
- status/source/freshness presentation;
- `Обади се`, `Подробности`;
- specialized add/correction/signal flows.

Страницата **не се превръща в generic listings page**.

На същата public surface трябва ясно да има два вида съдържание:

1. **Проверени специалисти и практики** — Health/Info owner;
2. **Временни частни обяви за предлагане или търсене на здравна услуга** — Listings owner.

Двата write потока са отделни:

- `Добави специалист или практика` → existing Health submission owner (`info_submissions` flow);
- `Публикувай или потърси здравна услуга` → `dobavi-obqva.html` с public context `Услуги → Здраве и грижа`.

Един запис не се копира между Health/Info и Listings.

### 6.3 Домашни услуги

Public leaves, без нов datastore:

- `Домашна помощ` → existing stored service value `Домашна помощ`;
- `Грижа за деца, възрастни и домашни любимци` → existing stored service value със същото име.

Тази втора leaf е **обща/немедицинска грижа**. Медицинска или възстановителна грижа се намира през `Здраве и грижа`.

### 6.4 Красота и лична грижа

Public label: `Красота и лична грижа`.

Compatibility stored service value:

`Красота и грижа`.

### 6.5 Компютърни и технически услуги

Public/stored value:

`Компютърни и технически услуги`.

### 6.6 Професионални услуги

Public leaves:

- `Професионални услуги` → stored `Професионални услуги`;
- `Фото и видео услуги` → stored `Фото, видео и събитийни услуги`.

### 6.7 Обучение и уроци

Public/stored value:

`Обучение и уроци`.

### 6.8 Транспорт и доставки

Public label:

`Транспорт и доставки`.

Compatibility stored value:

`Транспорт, преместване и доставки`.

## 7. `ЗДРАВЕ И ГРИЖА` — CONTROLLED HEALTH SERVICE TAXONOMY

За временните Listings health services се предлага следната контролирана public taxonomy:

1. Домашни здравни грижи
2. Медицинска сестра и манипулации
3. Рехабилитация и кинезитерапия
4. Физиотерапия
5. Психологическо консултиране
6. Логопед и специализирани терапии
7. Диетолог и хранителни консултации
8. Терапевтичен масаж и възстановяване
9. Грижа за възрастни и болни
10. Придружаване и помощ при лечение
11. Друга здравна услуга

При `Друга здравна услуга`:

- има задължително поле за конкретно наименование;
- свободният текст не става нова category/subcategory стойност;
- остава под `Здраве и грижа → Друга здравна услуга`;
- минава през moderation;
- често повтаряща се услуга може по-късно да бъде предложена за official taxonomy amendment от Admin.

### ВАЖЕН LOCKED DATA-CONTRACT КОНФЛИКТ

Текущият `PUBLIC_IA_STAGE1_TAXONOMY_DECISION.md` и `public-category-dictionary-v1.js` разрешават точно 22 service subcategories. Новите 11 health listing values **не са в текущия protected validator/dictionary**.

Следователно:

- public health taxonomy може да бъде одобрена като продуктова структура;
- **не може да се кодира като listing stored values** без отделен LOCKED taxonomy/data-integrity amendment;
- не се променя тихо CHECK/trigger/RPC/dictionary;
- не се измисля ново поле/schema само за да се заобиколи V1 validator.

Това е реален stop condition преди implementation на health Listings taxonomy.

### Регулирани медицински дейности

За дейности, при които професионална квалификация/специалност/източник е съществена, трябва отделно LOCKED решение за verification/moderation contract.

До такова решение:

- не се показва непроверена listing обява като `потвърден специалист`;
- не се създават нови права, credential полета или автоматично одобрение;
- Health/Info verified dataset остава единственият verified specialist owner.

## 8. `АВТОМОБИЛИ`

Route: `avtomobili.html`.

Public subcategories:

1. Автомобили за продажба или търсене
2. Авточасти
3. Автосервизи
4. Диагностика
5. Гуми
6. Автомивки
7. Пътна помощ

Storage compatibility:

- vehicle listing → category `Автомобили и МПС`;
- automotive services → category `Услуги` + exact existing service subcategory.

Няма втори automotive datastore.

## 9. `РАБОТА`

Public entry: **Работа**.

Canonical target state: marketplace filtered view за stored category `Работа`.

Не се измисля нов profession taxonomy в този Recovery.

Protected listing types остават:

- `Предлага работа`
- `Търси работа`

Public filters могат да бъдат:

- Всички
- Предлагат работа
- Търсят работа

`Работа` вече не е leaf под `Други обяви`.

## 10. `ИМОТИ`

Public entry: **Имоти**.

Canonical target state: marketplace filtered view за stored category `Имоти`.

Не се измисля нов property subtype/category schema.

Protected listing types остават:

- `Продава имот`
- `Отдава под наем`
- `Търси под наем`
- `Търси за купуване`

`Имоти` вече не е leaf под `Други обяви`.

## 11. `КУПУВА И ПРОДАВА`

Public entry: **Купува и продава**.

Под него остават general goods/listing categories:

1. Електроника
2. Дом и градина
3. Дрехи и обувки
4. Деца и бебета
5. Спорт и хоби
6. Животни
7. Друго

Те mapping-ват към съществуващите exact protected listing categories.

Автомобили, Работа и Имоти не се дублират тук, защото вече имат собствен ясен public вход.

## 12. BROWSE И ADD СА РАЗЛИЧНИ ДЕЙСТВИЯ

Основно правило:

- category/group/subcategory card → browse/filter results;
- отделен `Добави обява` → form;
- contextual Add може да носи валиден selected context;
- prefill е видим и editable;
- `edit=<id>` винаги има приоритет над create params;
- presentation layer не задава owner/status/role/direct-publish.

Няма по два `Предложи` / `Търся` primary бутона под всяка category card.

## 13. ADD FLOW

Global `+ Добави` запазва:

1. `Добави обява`;
2. `Добави фирма`;
3. `Задай въпрос`.

Specialized actions остават в собствения context.

### Listing create target

Public order:

1. `Предлагам` / `Търся`;
2. една от 5 public main entries;
3. category/subcategory/owner-specific type;
4. existing protected listing details.

Mappings:

- Services: existing service listing compatibility types;
- Vehicles: vehicle vs auto-service semantics се различават и се пазят;
- Work: `Предлага работа` / `Търси работа`;
- Property: existing 4 protected property types;
- Trade: existing standard listing types.

Health specialized add е отделен от Health listing add.

## 14. OWNER BOUNDARIES

| Content | Authoritative owner | Public composition rule |
|---|---|---|
| Temporary listing | Listings / `supabase-listings.js` | Stored once; може да се показва в релевантни contexts |
| Permanent firm profile | Firms | Не се копира в Listings |
| Masters/Construction | Protected Masters + Listings/Firms composition | Ivanov/protected rules preserved |
| Verified Health specialist/practice | Health/Info (`info_entries`, Health render/submission owners) | Не се превръща в generic listing |
| Temporary health service offer/seek | Listings | Separate content type, never auto-verified |
| Shops | Shops owner | Не се route-ва към generic Firm/Listing |
| Restaurants | Firms category `Заведения` | Няма втори restaurant datastore |
| Events | Events | Няма fake public Add |
| Q&A | Questions/Answers | Secondary community layer |
| Guides | Editorial | Не дублира mutable verified facts |

## 15. SEARCH И RESULT LABELS

Cross-owner search трябва ясно да показва какъв е резултатът:

- Обява
- Фирма
- Проверен специалист/практика
- Магазин
- Инфо
- Събитие
- Въпрос/отговор
- Ръководство

Health verified result има приоритет пред community opinion при търсене на конкретен лекар/стоматолог/специалист.

Непроверена health listing не получава verified badge по presentation logic.

## 16. `ИНФО ЛОМ` НЕ СЕ ПРЕСТРУКТУРИРА

`Инфо Лом` остава отделен verified information продукт.

В тази задача не се променят:

- шестте Info families;
- `Инфо Лом → Здраве`;
- source/freshness/correction flow;
- Admin/Moderator Info права;
- specialized owners.

Връзката `zdrave-i-lekari.html → Инфо Лом → Здраве` остава полезна contextual връзка, не дублиран owner.

## 17. PUBLIC LABELS ≠ STORED VALUES

Публичният език е за хората. Stored values са compatibility/data contract.

Примери:

- public `Красота и лична грижа` → stored `Красота и грижа`;
- public `Фото и видео услуги` → stored `Фото, видео и събитийни услуги`;
- public `Транспорт и доставки` → stored `Транспорт, преместване и доставки`;
- public `Купува и продава` → няма една DB category; това е presentation group над 7 existing categories;
- public `Здраве и грижа` → specialized Health route + бъдещ Listings context; не е една съществуваща stored listing subcategory.

Никакъв public rename не мигрира DB стойности автоматично.

## 18. V17 PROTOTYPE — НЕ Е ACCEPTED

Потвърдените отклонения остават вход за бъдеща consolidation, не за piecemeal patch:

1. отделни/дублирани category/marketplace presentation layers;
2. category cards, които могат да отварят form вместо browse;
3. incomplete/unsafe mapping;
4. форма, построена по остарялата 4/6-group логика;
5. fake filter values, които могат да попаднат като subcategory;
6. натрупани render/CSS layers;
7. липса на доказан rendered acceptance за current recovery target.

След одобрение R1 трябва да консолидира към **5-entry presentation**, а не към старата four-group Recovery.

## 19. RECOVERY STAGES

### R0 — Documentation recovery — текущо

- актуализиран Recovery;
- актуализирана Implementation Matrix;
- exact public/stored/owner map;
- protected conflict check;
- whole-structure review.

### R1 — Prototype consolidation — само след whole approval

- без V18/new layer;
- един marketplace landing;
- 5 public entries;
- category cards browse;
- Add отделно;
- current Health/Info parity preserved;
- old compatibility routes accepted without duplicate tree;
- no DB/schema/RLS changes.

**R1 не включва health taxonomy DB amendment**, докато няма отделно LOCKED решение.

### R2 — Rendered desktop/mobile review

Home, landing, Services, Autos, Work, Property, Trade, representative leaves, Health dual-content composition, Add flow, Search and empty states.

### R3 — Technical design

- exact production owner/file map;
- route adapter;
- query budgets;
- compatibility redirects;
- separate health taxonomy/verification locked decision if approved as product requirement.

### R4 — Incremental production implementation

Само през approved slices, PR, CI, merge и production runtime QA.

## 20. WHOLE-STRUCTURE APPROVAL GATE

За цялостно одобрение собственикът трябва да приеме като пакет:

- един top-level `Обяви и услуги`;
- петте public entries;
- осемте groups под `Услуги`;
- full Masters/Autos/Trade mappings;
- Work/Property като отделни public entries;
- Health dual-owner presentation;
- 11-item public health service taxonomy;
- browse ≠ Add;
- public labels ≠ stored values;
- no duplicate owner/data;
- Q&A secondary;
- Info Lom separate;
- protected core unchanged.

Това whole approval разрешава **само bounded prototype consolidation** по R1.

То **не** е автоматично разрешение за:

- DB taxonomy V2;
- CHECK/trigger/RPC/schema/RLS промяна;
- regulated-health credential/verification model;
- нов write owner;
- production merge.

За тях остава отделен LOCKED decision.

## 21. STOP CONDITIONS

Спира се само при реално ново/LOCKED решение за:

- roles/rights/RLS/schema;
- ownership/status/approval/direct publish;
- quotas/media;
- protected Firms/Listings/Masters/Admin/Ivanov behavior;
- health listing taxonomy DB amendment;
- regulated professional verification;
- new write owner/form;
- irreversible removal of approved capability.

Остарял prototype или стар 4-group presentation не е основание да се връща продуктът назад.
