# Попитай.Лом — V6-B1 FINAL IA / TAXONOMY / OWNER CONTRACT

Статус: **B1 COMPLETE — DESIGN CONTRACT / NO PRODUCTION CODE**  
Branch: `v6-product-foundation-draft`  
Дата: 31.08.2026

Този документ заключва V6 public information architecture, тематичната taxonomy и owner composition. Той не променя production, backend owner-и, schema/RLS, роли, квоти, moderation, protected ranking или URL-и. До V6-E approval production остава на Marketplace V3.

При конфликт приоритетът е:

`LOCKED rules → approved production specs → V6 Master Control → този B1 contract → supporting drafts`.

---

## 1. B1 РЕШЕНИЕ В ЕДНО ИЗРЕЧЕНИЕ

Попитай.Лом има **една обща task-oriented taxonomy**, но всеки резултат и всяко добавяне остават при правилния authoritative owner: Listings за временни предложения/търсения, Firms за постоянни профили, Health/Info за проверени факти, Shops за магазини, Events за събития, Q&A за community knowledge и Articles за обяснения.

Няма втори marketplace, duplicate write owner или giant `Услуги` catch-all.

---

## 2. ФИНАЛЕН МЕНТАЛЕН МОДЕЛ

### 2.1 Две независими оси

- **Тема:** Строителство, Здраве, Работа, Автомобили, Имоти, Красота и т.н.
- **Тип съдържание/owner:** фирма, обява, проверен запис, магазин, събитие, въпрос, статия.

Темата определя къде човек търси. Типът определя кой пази, валидира, модерира и публикува записа.

### 2.2 Една задача — един primary owner

| Потребителска задача | Primary authoritative owner |
|---|---|
| Предлагам/търся услуга, работа, имот или вещ | `listings` / protected Listings owner |
| Представям постоянна местна фирма/доставчик | `businesses` / protected Firms owner |
| Търся проверен местен факт, контакт или официално действие | `Info Lom` / специализиран Health owner |
| Предлагам местен магазин | specialized Shops owner |
| Разглеждам одобрено предстоящо събитие | specialized Events owner |
| Търся съвет, опит или препоръка | Questions/Answers owner |
| Търся обяснение на процес | Articles/Guides owner, свързан с authoritative facts |

Един запис може да бъде **показван** в няколко контекста, но се създава и модерира само при своя owner.

---

## 3. GLOBAL PUBLIC IA

### 3.1 Desktop navigation — KEEP

`Начало | Обяви и услуги | Фирми | Инфо Лом | Статии | Още ▼ | Профил | + Добави`

`Още` съдържа `Въпроси`, `Събития`, `За сайта`, `Правила`, `Контакти`.

Няма отделен top-level `Категории` и няма втори `Вход` до `Профил`.

### 3.2 Mobile bottom navigation — KEEP

Точно пет позиции:

`Начало | Обяви | + | Инфо | Профил`

`+` отваря owner-aware Add sheet. `Въпроси` остава достъпно през `Още`, search/category contexts и empty states.

### 3.3 Начална страница — ADAPT PRESENTATION

Target order:

1. един search-first вход `Какво търсиш в Лом?`;
2. ограничени task shortcuts;
3. `Открий в Лом`;
4. `Инфо Лом` — проверена информация и спешни/чести действия;
5. актуални обяви и местни профили, заредени на части;
6. полезни отговорени въпроси;
7. само реално готови статии.

Home не възстановява осем равни category карти и не прави `Задай въпрос` универсален primary CTA.

### 3.4 Един marketplace/discovery landing

`obyavi.html` остава единственият top-level вход `Обяви и услуги` и съдържа:

- search;
- first-screen shortcuts;
- `Всички категории`;
- owner-aware резултати;
- един основен `Добави обява` CTA;
- contextual links към specialized owners;
- `Попитай`, когато готов резултат не стига.

`kategorii.html` остава compatibility вход към `obyavi.html`, не второ дърво.

---

## 4. СТАБИЛНА TAXONOMY VS SHORTCUTS

### 4.1 Stable taxonomy

Това е постоянната public структура и не се пренарежда заради временна популярност:

1. Строителство и ремонти
2. Здраве и лекари
3. Работа
4. Автомобили
5. Имоти
6. Красота
7. Дом и градина
8. Магазини
9. Заведения и храна
10. Електроника
11. Деца и бебета
12. Животни
13. Мода
14. Спорт и хоби
15. Други услуги
16. Други обяви

### 4.2 Initial first-screen shortcuts

До наличието на реален first-party analytics baseline initial editorial default е:

`Строителство и ремонти · Здраве и лекари · Работа · Автомобили · Имоти · Красота`

- desktop може да покаже шестте;
- mobile показва първите четири и ясно `Всички категории`;
- редът може по-късно да се променя по доказани local signals, сезонност и supply;
- промяната на shortcuts не променя taxonomy, URL mapping или owner-и.

Този ред е продуктова начална стойност, не твърдение за измерен трафик. A2 не доказа first-party analytics baseline.

### 4.3 `Открий в Лом`

`Открий в Лом` е отделен discovery block:

`Магазини · Заведения · Събития · Фирми`

Той:

- не е втора taxonomy;
- не създава нов owner;
- не копира записи;
- може да се показва на Home и marketplace landing;
- винаги води към specialized/current owner page.

---

## 5. FINAL CATEGORY / OWNER / ACTION MATRIX

### 5.1 Строителство и ремонти

- **Значение:** намиране/предлагане/търсене на ремонтна услуга.
- **Stable leaves:** Цялостни ремонти; Бани и плочки; ВиК; Електро; Покриви; Боядисване; Дограма; Климатици.
- **Read composition:** protected Masters/Construction presentation + approved service Listings + relevant Firms; Q&A и Articles са secondary.
- **Намери:** `maistori.html` и contextual search/filter.
- **Добави услуга:** `dobavi-obqva.html?category=Услуги&subcategory=<leaf>`; public `Предлагам` mapping-ва към protected `type=Продава`, `Търся` към `type=Търси`.
- **Добави постоянна фирма:** `dobavi-firma.html?category=maistori`.
- **Попитай:** `nov-vapros.html?category=maistori`.
- **Boundary:** label/presentation може да е `Строителство и ремонти`, но protected `maistori.html`, owner, ranking, URLs и business rules не се променят в B1.

### 5.2 Здраве и лекари

- **Значение:** проверен лекар/практика/аптека/болнична/спешна информация.
- **Stable filters:** Лични лекари; Специалисти; Стоматолози; Практики/кабинети; Болнична и спешна помощ; Лаборатории; Аптеки; Ветеринари; Вет. аптеки само когато има published coverage.
- **Primary owner:** verified Health/Info dataset. Community questions са ясно отделени като мнение/опит.
- **Намери:** `zdrave-i-lekari.html`; authoritative detail/context води към `zdrave.html`.
- **Добави:** specialized inline flow в `zdrave-i-lekari.html` → `#health-pro-panel` → `info_submissions`; не `dobavi-obqva.html` и не generic Firms.
- **Попитай:** `nov-vapros.html?category=zdrave`.
- **Boundary:** няма medical marketplace, bookings или непроверено директно публикуване.

### 5.3 Работа

- **Значение:** работодател предлага работа или човек търси работа.
- **Primary owner:** protected Listings category `Работа`.
- **Stable intent filters:** `Предлага работа`; `Търси работа`. Професии се търсят по keyword; не се измисля неподкрепена profession taxonomy.
- **Намери:** `obyavi.html?category=Работа`.
- **Добави:** `dobavi-obqva.html?category=Работа&type=Предлага работа` или `type=Търси работа`.
- **Попитай:** current compatible route `nov-vapros.html?category=rabota`, като B5/B9 трябва да носи jobs context и да не го смесва визуално с service request.
- **Boundary:** `Работа` не означава `Услуги` и не използва нов job backend owner.

### 5.4 Автомобили

- **Значение:** автомобил/част или автомобилна услуга.
- **Stable leaves:** Автомобили за продажба/търсене; Авточасти; Автосервизи; Диагностика; Гуми; Автомивки; Пътна помощ.
- **Read composition:** vehicle Listings + automotive service Listings + relevant Firms; Q&A secondary.
- **Намери:** `avtomobili.html`.
- **Добави автомобил:** `dobavi-obqva.html?category=Автомобили и МПС`.
- **Добави услуга:** `dobavi-obqva.html?category=Услуги&subcategory=<automotive leaf>`.
- **Добави фирма:** `dobavi-firma.html?category=avtomobili`.
- **Попитай:** `nov-vapros.html?category=avtomobili`.

### 5.5 Имоти

- **Значение:** продава, отдава, търси под наем или търси за купуване.
- **Primary owner:** protected Listings category `Имоти` и specialized listing types.
- **Stable intent filters:** `Продава имот`; `Отдава под наем`; `Търси под наем`; `Търси за купуване`.
- **Намери:** `obyavi.html?category=Имоти`.
- **Добави:** `dobavi-obqva.html?category=Имоти&type=<protected property type>`.
- **Попитай:** `nov-vapros.html?category=obyavi` с visible property context; exact richer topic relation е B5/B9, без нов write owner.

### 5.6 Красота

- **Значение:** намиране/предлагане на услуги за лична грижа.
- **Compatibility leaf:** `Услуги → Красота и грижа`.
- **Discovery shortcuts, не нови stored leaves:** Фризьори; Козметика; Маникюр/педикюр; други услуги за лична грижа.
- **Read composition:** service Listings + relevant Firms.
- **Намери:** `obyavi.html?category=Услуги&subcategory=Красота и грижа`.
- **Добави услуга:** същият category/subcategory prefill в `dobavi-obqva.html`.
- **Добави постоянен профил:** current compatible Firms route `dobavi-firma.html?category=rabota`.
- **Попитай:** `nov-vapros.html?category=rabota` с beauty context.
- **Boundary:** beauty е first-class public category, но не получава нов table или непроверени firm facets в B1.

### 5.7 Дом и градина

- **Значение:** вещи, обзавеждане, материали и продукти за дома/градината.
- **Primary owner:** Listings category `Дом и градина`.
- **Context composition:** Shops за местни магазини; Construction за ремонт; Other Services за домашна помощ.
- **Намери:** `obyavi.html?category=Дом и градина`.
- **Добави:** `dobavi-obqva.html?category=Дом и градина`.
- **Попитай:** `nov-vapros.html?category=obyavi` с home context.
- **Boundary:** ремонтна услуга не се записва като вещ в `Дом и градина`; води към Construction. Домашната помощ води към `Други услуги`.

### 5.8 Магазини

- **Значение:** реален местен магазин и какво предлага.
- **Primary owner:** specialized `shops` owner.
- **Current stable owner groups:** Хранителни; Строителни; Техника; Мебели; Дрехи; Дом. Допълнения се правят само през Shops contract.
- **Намери:** `magazini.html`.
- **Добави:** specialized inline `magazini.html` → `#addModal`/`#addForm`; pending review. Не generic Firm/Listing write.
- **Попитай:** `nov-vapros.html?category=magazini`.
- **Context link:** употребяван артикул води към правилната Listings category.

### 5.9 Заведения и храна

- **Значение:** място за храна, кафе или доставка.
- **Stable leaves:** Ресторанти; Кафенета; Пицарии; Сладкарници; Доставка на храна.
- **Primary owner:** approved Firms category `Заведения`; няма отделен restaurant datastore.
- **Намери:** `zavedenia.html`.
- **Добави:** `dobavi-firma.html?category=zavedenia`.
- **Попитай:** `nov-vapros.html?category=zavedenia`.
- **Boundary:** без резервации, поръчки и плащания в B1.

### 5.10 Електроника

- **Значение:** продава/купува/търси електроника.
- **Primary owner:** Listings category `Електроника`.
- **Намери:** `obyavi.html?category=Електроника`.
- **Добави:** `dobavi-obqva.html?category=Електроника`.
- **Попитай:** `nov-vapros.html?category=obyavi` с electronics context.
- **Context links:** ремонт/настройка води към `Други услуги → Компютърни и технически услуги`; местен магазин — към Shops.

### 5.11 Деца и бебета

- **Значение:** вещи и обяви за деца/бебета.
- **Primary owner:** Listings category `Деца и бебета`.
- **Намери:** `obyavi.html?category=Деца и бебета`.
- **Добави:** `dobavi-obqva.html?category=Деца и бебета`.
- **Попитай:** `nov-vapros.html?category=obyavi` с child context.
- **Context links:** грижа води към `Други услуги → Грижа`; проверена здравна или образователна информация води към Health/Info, без копиране.

### 5.12 Животни

- **Значение:** обяви за животни и принадлежности.
- **Primary owner:** Listings category `Животни`.
- **Намери:** `obyavi.html?category=Животни`.
- **Добави:** `dobavi-obqva.html?category=Животни`.
- **Попитай:** `nov-vapros.html?category=obyavi` с animal context.
- **Context links:** ветеринари/вет. аптеки водят към specialized Health; гледане/разходка — към `Други услуги → Грижа`.

### 5.13 Мода

- **Public label:** `Мода`; compatibility stored category: `Дрехи и обувки`.
- **Primary owner:** Listings.
- **Намери:** `obyavi.html?category=Дрехи и обувки`.
- **Добави:** `dobavi-obqva.html?category=Дрехи и обувки`.
- **Попитай:** `nov-vapros.html?category=obyavi` с fashion context.
- **Context link:** местни магазини водят към `Магазини → Дрехи`.

### 5.14 Спорт и хоби

- **Primary owner:** Listings category `Спорт и хоби`.
- **Намери:** `obyavi.html?category=Спорт и хоби`.
- **Добави:** `dobavi-obqva.html?category=Спорт и хоби`.
- **Попитай:** `nov-vapros.html?category=obyavi` с sport/hobby context.
- **Context links:** събития водят към Events; местни магазини към Shops.

### 5.15 Други услуги

- **Значение:** service offer/seek, което не принадлежи на Construction, Cars, Health или first-class Beauty.
- **Bounded leaves:** Домашна помощ; Компютърни и технически услуги; Фото, видео и събитийни услуги; Професионални услуги; Обучение и уроци; Грижа за деца, възрастни и домашни любимци; Транспорт, преместване и доставки.
- **Primary owner:** Listings category `Услуги`; relevant Firms могат да се показват, без duplicate owner.
- **Намери:** `rabota.html` като compatibility deep view за услуги и/или `obyavi.html?category=Услуги`.
- **Добави:** `dobavi-obqva.html?category=Услуги&subcategory=<bounded leaf>`.
- **Добави фирма:** `dobavi-firma.html?category=rabota`.
- **Попитай:** `nov-vapros.html?category=rabota`.
- **Boundary:** `Услуги` не включва Работа, medical entries, shops, restaurants, products, property, vehicles or repair leaves already owned by first-class categories.

### 5.16 Други обяви

- **Значение:** временна обява, която не влиза в останалите approved listing categories.
- **Primary owner:** protected Listings stored category `Друго`.
- **Намери:** `obyavi.html?category=Друго`.
- **Добави:** `dobavi-obqva.html?category=Друго`.
- **Попитай:** `nov-vapros.html?category=obyavi`.
- **Boundary:** не е контейнер, който повтаря всички останали категории.

---

## 6. ТОЧНА РОЛЯ НА НЕ-TAXONOMY SURFACES

### 6.1 Фирми

- top-level entry остава `firmi.html`;
- означава постоянен местен provider/entity profile;
- може да се показва в search/category results като content type;
- не заменя временна обява;
- не приема Shops/Health records като generic Firms само за визуална симетрия;
- `dobavi-firma.html` остава protected create owner.

### 6.2 Инфо Лом

- top-level verified knowledge owner: Здраве, Институции, Транспорт, Образование и култура, Банки и банкомати, Комунални;
- съдържа mutable local facts, official contacts/actions, source и freshness;
- не е marketplace и няма generic `Добави обява`;
- additions/corrections минават през specialized submission/error-report flows;
- exact source/freshness/render contract е отделен B3 stage.

### 6.3 Статии

- top-level `statii.html` остава за evergreen process/explanation;
- няма public Add flow в B1;
- article не копира mutable Info fact, а го цитира/свързва с authoritative owner;
- файл/карта не означава `ПРОВЕРЕНО ГОТОВО`;
- article architecture/readiness е отделен B4 contract.

### 6.4 Q&A

- `Попитай` е contextual action след search/results и secondary action в category/entity context;
- `Още → Въпроси` и `vaprosi.html` остават secondary archive/entry;
- въпросът има собствен URL, но се показва в тематичния контекст;
- Q&A не е main taxonomy и не е заместител на Find/Add;
- canonical/duplicate/alias relations са B5, без destructive auto-merge.

### 6.5 Събития

- `sabitiya.html` остава specialized Events read owner и `Още → Събития` entry;
- Events влиза в `Открий в Лом`, не в stable transactional taxonomy;
- current source има public read + Admin/Moderator review, но не е доказан public submit owner/form;
- **B1 не показва фалшив `Добави събитие` и не route-ва event към generic Listing.** Public event submit се DEFER-ва до exact specialized owner/form/permissions contract.

---

## 7. GLOBAL `+ ДОБАВИ` CONTRACT

Default global sheet остава кратък:

1. `Добави обява` → `dobavi-obqva.html`;
2. `Добави фирма` → `dobavi-firma.html`;
3. `Задай въпрос` → `nov-vapros.html` с валиден context.

Context-only specialized actions:

- Shops page: `Добави магазин` → local specialized `#addModal/#addForm`;
- Health page: `Добави лекар или здравна услуга` → local specialized `#health-pro-panel`;
- Info record: `Предложи корекция/Сигнализирай грешка` → Info owner;
- Events: няма public Add option, докато specialized submit flow не е доказан и договорен;
- Articles: няма public Add option.

Global sheet не изброява механично всеки owner на всяка страница. Specialized action се показва само когато target owner и flow реално съществуват.

`edit=<id>` винаги има приоритет пред create prefill. Query parameters никога не променят permissions/validation/owner.

---

## 8. KEY `НАМЕРИ / ДОБАВИ / ПОПИТАЙ` FLOWS

### 8.1 Search-first

`query → един Search owner → verified/local/entity/listing/Q&A/article results → exact result`.

Ако няма достатъчен резултат:

`Не намери? Попитай Лом → nov-vapros.html → query/category context prefill → existing moderation flow`.

B1 заключва destination semantics. Exact search ranking/query contract е B2.

### 8.2 Category-first

`Всички категории → stable category → owner-aware results → един primary Find action → owner-correct Add → secondary Ask`.

Category cards са navigation. В тях няма по три равни primary CTA.

### 8.3 Add-first

`+ Добави → тип съдържание → correct existing owner → valid prefill → auth/validation → approved/pending според protected rules`.

Няма universal form.

### 8.4 Permanent provider vs temporary offer

- `Добави фирма` = постоянен профил;
- `Добави обява` = временно предложение/търсене/продажба/работа/имот;
- category results могат да покажат и двете, но Add action не ги смесва.

---

## 9. BACKWARD URL / CANONICAL MAPPING

| Current URL | B1 role |
|---|---|
| `obyavi.html` | един canonical marketplace/discovery landing |
| `kategorii.html` | compatibility redirect към `obyavi.html`, preserving useful state |
| `maistori.html` | protected Construction/Masters deep hub; KEEP |
| `avtomobili.html` | Cars deep hub; KEEP/ADAPT |
| `rabota.html` | compatibility deep hub за `Други услуги`; **не** става jobs owner |
| `zdrave-i-lekari.html` | specialized Health discovery/add context |
| `zdrave.html` | authoritative `Инфо Лом → Здраве` context |
| `magazini.html` | specialized Shops owner |
| `zavedenia.html` | Restaurants discovery over Firms owner |
| `sabitiya.html` | specialized Events owner |
| `firmi.html` / `firma.html` | Firms list/detail owner |
| `info.html` + current Info section URLs | verified Info owner |
| `statii.html` / `statia.html` | Articles owner |
| `vaprosi.html` / `vapros.html` | Q&A archive/detail owner |

New first-class categories without current dedicated pages use controlled `obyavi.html?category=<compatibility value>` presentation state in the first V6 slice. B1 не създава 16 duplicate static SEO trees. B2/B4/V6-D могат да предложат crawlable dedicated hubs само при доказан distinct intent/content value и без URL duplication.

Stored values не се mass-migrate-ват заради public labels. Legacy links/prefill остават accepted, когато mapping е безопасен.

---

## 10. KEEP / ADAPT / REPLACE PRESENTATION / DEFER

### KEEP

- V3 desktop/mobile top-level navigation;
- `obyavi.html` като един marketplace entry;
- protected Listings/Firms/Masters/Admin/Moderator rules;
- Health/Info, Shops, Events specialized owners;
- Ivanov/Admin/boost priority;
- backward URLs;
- Bulgarian/mobile/accessibility/render-ownership rules.

### ADAPT

- Home към search-first + shortcuts + `Открий в Лом`;
- marketplace landing към 16 stable categories;
- category pages към owner-aware composition;
- Firms/Info/Articles/Q&A като свързани content types;
- `rabota.html` visible meaning към `Други услуги`, без URL break;
- public labels върху existing stored values.

### REPLACE PRESENTATION

- четирите V3 groups като final stable taxonomy;
- осем равни category cards като основна IA;
- top-level `Категории` до `Обяви`;
- `Услуги` като giant public catch-all;
- `Работа` и `Услуги` като един и същ intent;
- няколко равни primary CTA под всяка subcategory;
- Q&A като default primary action навсякъде;
- generic add flow към Health/Shops/Events.

### DEFER

- public Event submit, докато няма exact specialized flow;
- нови schema/RLS/tables и firm facets;
- dedicated restaurant/medical/property/job backend owner;
- 16 нови static SEO pages без доказана стойност;
- canonical/duplicate/recommendation relations;
- Facebook Bridge, dynamic OG/SEO edge layer, PWA share target;
- heavy AI/vector/search infrastructure;
- bookings, payments, reservations and delivery ordering.

---

## 11. PERFORMANCE / RENDER CONSEQUENCES

- taxonomy и routes са малък local/static dictionary;
- първият render не прави all-owner mega-query;
- category data се зарежда on-demand, с exact fields, limits и pagination/show-more;
- mobile показва ограничени shortcuts, не 16 тежки live panels;
- cross-owner composition не копира данни и не създава graph runtime;
- всеки root има един final renderer owner;
- search има един explicit owner; legacy/new parallel renderer е забранен;
- specialized pages зареждат само собствените си scripts/data;
- няма Facebook SDK/AI API на initial path;
- metadata/share layer, ако бъде одобрен по-късно, стои извън критичния frontend path.

---

## 12. CONFIRMED / DECIDED / RISKS

### Confirmed evidence used

- owner boundaries от A1;
- current search page зарежда legacy `script.js` от A2;
- Jobs и Property вече имат protected Listings semantics;
- Health, Shops, Events и Firms са отделни owners;
- Restaurants са Firms composition;
- current public Event submission flow не е доказан;
- current Q&A category values са по-груби от V6 taxonomy;
- current `rabota.html` е Services presentation;
- production остава Marketplace V3.

### B1 product decisions

- 16-category stable taxonomy;
- initial six shortcuts;
- four-entry `Открий в Лом`;
- exact Jobs vs Services boundary;
- owner-aware Add routing;
- Events Add deferred instead of fake/generic path;
- no new backend owner for visual symmetry.

### Open risks carried forward

1. Search owner/ranking/result composition must be exact before prototype.
2. Current coarse Q&A category values need a later relation/context contract without breaking old questions.
3. `rabota.html` path/visible meaning requires careful compatibility copy and canonical handling.
4. Specialized modal Add actions need a reliable direct-entry/deep-link interaction contract in B9.
5. Info source/freshness/render ownership remains mixed and is not solved by IA alone.
6. New dedicated SEO hubs require evidence and technical design; query-filter state alone is not automatically an SEO page.
7. Moderator own-business edit defect remains a separate protected production incident, not a B1 change.

---

## 13. B1 EXIT GATE

**PASS.**

Every major public entry now has:

- one clear user meaning;
- one authoritative owner or explicit read composition;
- one owner-correct Add destination or an explicit `not available / DEFER` truth;
- a contextual Ask destination;
- a backward URL rule;
- no category/owner ambiguity.

Production impact: **NONE**.

---

## 14. EXACT NEXT TASK

# `STAGE V6-B2 — SEARCH V6 / RESULT COMPOSITION / INTENT ROUTING CONTRACT`

B2 must define:

1. one explicit Search owner replacing legacy/new ambiguity;
2. query normalization, synonyms and category intent mapping for the B1 taxonomy;
3. exact result types and owner queries;
4. verified Info vs community opinion ordering;
5. local relevance while preserving protected Ivanov/Admin/boost semantics;
6. no-result → contextual Ask flow;
7. limits, debounce, cancellation, pagination, cache and failure states;
8. SEO/canonical consequences of filtered category/search states;
9. analytics event contract without inventing a current baseline;
10. no production code.

Required artifact:

`PUBLIC_PRODUCT_V6_B2_SEARCH_INTENT_RESULT_CONTRACT.md`

