# Попитай.Лом — REALITY MAP — 03.09.2026

Статус: **EVIDENCE ONLY / НЕ Е ПРОДУКТОВА ИСТИНА / НЕ Е РАЗРЕШЕНИЕ ЗА КОД**

Този файл не конкурира `POPITAI_LOM_MASTER_CURRENT.md` и не въвежда ново продуктово решение. Целта му е единствено да фиксира провереното реално състояние на repo-то, върху което трябва да се построи финалната IA.

При конфликт води `POPITAI_LOM_MASTER_CURRENT.md` и приложимото protected ядро.

## 1. Проверена owner карта

| Потребителски тип | Реален owner / source | Public browse/detail | Add/Edit flow | Текущ moderation lifecycle |
|---|---|---|---|---|
| Обява | `listings` | `obyavi.html` → `obqva.html?id=...` | `dobavi-obqva.html`; edit чрез `?edit=` | non-Admin → pending; Admin direct publish; approved user edit пази последната public версия чрез edit draft |
| Фирма | `businesses` + expanded profile flow | `firmi.html` → `firma.html?id=...` | `dobavi-firma.html`; owner edit/expanded flows | protected existing business moderation |
| Магазин | `shops` | `magazini.html` | specialized modal/form в `magazini.html` | logged user → `pending`; specialized Shops moderation |
| Здраве / частна практика | Health/Info owner чрез `info_submissions` + verified health data | `zdrave-i-lekari.html` + `zdrave.html` | specialized Health add + correction/signal flow | logged user → `pending`; verified Health/Info moderation |
| Въпрос / отговор | `questions` / `answers` | `vaprosi.html` → `vapros.html?id=...` | `nov-vapros.html` + answer flow | normal user pending; Admin approved/direct where already implemented |
| Събитие | `events` | public loader exists in `events-public-v1.js` | няма одобрен public Add owner/form | approved + current/upcoming only |
| Статия | текущо статични public pages/records | `statii.html` → `statia.html` | няма общ editorial owner/form в проверения runtime | текущо не е завършена динамична content система |
| Публикация | **не е намерен реален public owner/route/form** | няма завършена public surface | няма | продуктова роля е одобрена в Master, техническият owner/authoring механизъм остава реална празнина |

## 2. Listings — доказано reusable ядро

`dobavi-obqva.html` е един реален Listings form owner.

Текущите listing categories са:

- Електроника
- Дом и градина
- Дрехи и обувки
- Деца и бебета
- Спорт и хоби
- Автомобили и МПС
- Животни
- Работа
- Имоти
- Услуги
- Друго

Специални типове:

- Работа → `Предлага работа` / `Търси работа`;
- Имоти → `Продава имот` / `Отдава под наем` / `Търси под наем` / `Търси за купуване`;
- останалите → `Продава` / `Купува` / `Търси` / `Дава`.

`public-context-prefill-v1.js` вече поддържа bounded visible prefill чрез:

- `category`;
- `subcategory`;
- `type`.

`edit=` има приоритет и изключва create prefill.

**Следствие за финалната IA:** Работа, Имоти, Стоки, Животни, автомобилни обяви и услугите не трябва да получават нови паралелни forms. Те трябва да водят към същия Listings owner с правилния видим context/prefill.

## 3. Services taxonomy — реалното текущо ядро

`public-category-dictionary-v1.js` има един `Услуги` listing category и следните service subcategories:

### Майстори и ремонти

- Цялостни ремонти
- Бани и плочки
- ВиК
- Електро
- Покриви
- Боядисване
- Дограма
- Климатици

### Автомобилни услуги

- Автосервизи
- Диагностика
- Гуми
- Авточасти
- Автомивки
- Пътна помощ

### Други реални услуги

- Домашна помощ
- Красота и грижа
- Компютърни и технически услуги
- Фото, видео и събитийни услуги
- Професионални услуги
- Обучение и уроци
- Грижа за деца, възрастни и домашни любимци
- Транспорт, преместване и доставки

`maistori.html`, `avtomobili.html` и текущият `rabota.html` вече използват тези subcategories и могат да показват approved Listings по една и съща underlying taxonomy.

**Важно:** текущото име/route `rabota.html` в реалния код всъщност показва **Услуги**, не Работа. Това е route/semantic mismatch, който трябва да се реши в окончателния route mapping, без да се измисля втори owner.

## 4. Firms

`firmi.html` е отделен каталог на постоянни фирмени профили. `dobavi-firma.html` е отделният Add flow.

Текущият public category dictionary позволява firm categories за:

- Майстори и ремонти;
- Здраве и лекари;
- Автомобили;
- Магазини и покупки;
- Заведения;
- Работа и услуги.

Master-ът вече уточнява, че:

- фирмата е постоянен профил;
- обявата е конкретно предложение/търсене;
- marketplace може да показва релевантни firms като резултати;
- това не трябва да създава копие на фирмата като Listing.

## 5. Магазини

`magazini.html` + `shops-catalog-v3.js` са специализиран Shops owner/surface.

Проверени Shop families:

- хранителни;
- строителни;
- техника;
- мебели;
- дрехи;
- дом.

Има собствена add форма, tags/groups, validation и `pending` submission. Generic Listing/Firm flow не трябва да я замества.

Контекстният `Добави магазин` вече може да делегира към реалния Shops owner чрез `public-context-special-actions-v1.js`.

## 6. Здраве

`zdrave-i-lekari.html` е тематичната discovery surface за:

- лекари;
- лични лекари;
- специалисти;
- стоматолози;
- ветеринари.

Има specialized Add flow за doctor/dentist/vet, записван като `info_submissions` със status `pending`, плюс correction/signal flow.

`zdrave.html` остава Info Lom verified health surface.

**Следствие:** marketplace може да има разбираем вход `Здраве и лекари`, но не трябва да създава generic medical Listings owner. Private-practice discovery и Info Lom могат да са два различни user contexts към едно verified Health/Info ядро.

## 7. Заведения

`zavedenia.html` е тематична public surface, но данните са Firms owner (`Заведения`).

Текущите subcategories са:

- Ресторанти
- Кафенета
- Пицарии
- Сладкарници
- Доставка на храна

`Добави заведение` правилно води към `dobavi-firma.html?category=zavedenia`.

## 8. Q&A

`nov-vapros.html` е един Question form с category prefill. `supabase-content.js` управлява `questions`/`answers` и реални answer counts.

Q&A може да се показва контекстно под категории, но не е marketplace write owner и не трябва да доминира `Намери`/`Добави` задачите.

## 9. Събития — доказана интеграционна празнина

`events-public-v1.js` може да чете само `approved` и текущи/предстоящи `events`.

Текущият `sabitiya.html` обаче не е завършена owner-driven events surface: страницата съдържа предимно тематични search shortcuts и Q&A, а провереният public events loader не е свързан като основен renderer.

Няма одобрен public `Добави събитие` flow и такъв не трябва да се измисля.

## 10. Статии и Публикации — доказани технически празнини

### Статии

`statii.html` и public search съдържат почти статичен единичен article record. Одобрената продуктова роля на пълни local-first ръководства още няма завършен общ content lifecycle.

### Публикации

В проверения repo няма отделен реален public owner, route или form за одобрения content type `Публикация`.

Това не отменя продуктовото решение в Master. Означава само, че преди production implementation трябва да се избере реален authoring/owner механизъм, без да се маскира Публикация като Listing, Article, Question или Event.

## 11. Search

`public-search-v1.js` в момента може да групира:

- Категории
- Фирми
- Обяви
- Въпроси
- Статии
- Проверена информация

Remote търсенето реално чете approved Firms, Questions и Listings. Info/Articles са предимно static records. Shops, Health specialized results и Events не са пълноценно интегрирани като remote search result types.

Protected Иванов/релевантност priority се пази.

## 12. Home — реалното текущо състояние, не финален UX

Текущият Home има:

1. hero + search + `+ Добави` + `Разгледай категориите`;
2. Info Lom block;
3. category cards;
4. latest Listings;
5. Questions;
6. Firms;
7. Articles.

Текущите category cards смесват:

- Майстори и ремонти;
- Здраве и лекари;
- Автомобили;
- Магазини и покупки;
- Заведения;
- Услуги;
- Обяви;
- Събития.

Това е реалното текущо presentation състояние, но **не е финалната IA**, защото Master изрично оставя Home/category placement отворено и отхвърля автоматичното приемане на последния prototype/code като продуктова истина.

Текущият hero copy също все още насочва силно към `Питай`, докато Master вече определя водещия ред `Намери → Публикувай → Попитай, ако не намериш`.

## 13. Navigation / shell

`public-shell-v1.js` в момента налага desktop:

`Начало | Обяви и услуги | Фирми | Инфо Лом | Статии | Още | Профил | + Добави`

и mobile:

`Начало | Обяви | + | Инфо | Профил`.

Текущият Add sheet има основно:

- Добави обява;
- Добави фирма;
- Задай въпрос;

а specialized Shop/Health actions се активират само когато реалният owner е наличен на съответната страница.

Това е добра technical delegation основа, но exact final labels/placement и global discoverability на specialized Add flows остават IA задача.

## 14. Historical code that must not regain product authority

Repo-то още съдържа:

- `marketplace-v3.js/css`;
- Marketplace V3 GitHub checks/workflows;
- много V/B/Stage prototype layers;
- V8–V17 prototype assets.

`public-shell-v1.js` дори зарежда `marketplace-v3.js` за част от marketplace routes.

Тези файлове могат да съдържат reusable technical implementation, но след Master reconciliation **не могат да определят автоматично taxonomy, четиригрупов модел или финален UX**.

Преди production implementation старите guards/checks трябва да бъдат прегледани спрямо одобрената нова IA, за да не блокират правилния код или да върнат отхвърлен модел.

## 15. Reality Map conclusion

Техническата основа позволява финалната IA да бъде построена без нова паралелна платформа:

- един Listings owner + bounded prefill;
- един Firms owner;
- specialized Shops owner;
- specialized Health/Info owner;
- Q&A owner;
- Events owner;
- отделно verified Info Lom ядро.

Основната оставаща работа е **public composition и discovery**, не backend преизобретяване.

Реалните implementation gaps, които трябва да бъдат решени след IA approval, са:

1. route/semantic mismatch `rabota.html` = текущо Услуги;
2. завършена owner-driven Events surface;
3. реален lifecycle/authoring model за Статии;
4. реален owner/authoring model за Публикации;
5. search integration за specialized Shops/Health/Events;
6. премахване/адаптиране на старите Marketplace V3 presentation guards след одобрена нова IA;
7. Home copy/order да бъде приведен към `Намери → Публикувай → Попитай`.

Нито една от тези точки сама по себе си не разрешава production code или Supabase промяна.