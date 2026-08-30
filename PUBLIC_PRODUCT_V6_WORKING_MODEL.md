# Попитай.Лом — V6 PRODUCT FOUNDATION / WORKING MODEL

Статус: **DRAFT / DESIGN ONLY / NO PRODUCTION CODE**  
Дата: 30.08.2026  
Branch: `v6-product-foundation-draft`

Този документ е работната основа за следващата продуктова версия на Попитай.Лом. Целта му е да събере на едно място вече изграденото, новите продуктови идеи, външните доказани модели и безопасния път до реален код.

Документът **не отменя автоматично** текущите approved правила и спецификации. Докато V6 не бъде изцяло разработен, визуализиран, проверен и изрично одобрен, production продължава да се ръководи от текущите approved документи и protected rules.

---

## 1. КРАЙНА ПРОДУКТОВА ИДЕЯ

Попитай.Лом не трябва да бъде просто локален сайт с обяви, категории и отделна страница „Въпроси“.

Целта е да стане:

**местна търсачка + marketplace + справочник + структурирана памет на общността.**

Работният модел е:

- **Facebook = разпространение и първоначална аудитория**;
- **Попитай.Лом = структура, постоянен архив и връзки между знанието**;
- **Google = откриване от нови хора чрез качествени постоянни страници**;
- **нашите потребители = постепенно собствена аудитория и собствено знание**.

Основният цикъл:

`Търси → намери структурирана информация → ако не стига, Попитай → сподели към Facebook → хората идват и отговарят → отговорът остава при нас → следващият човек вече намира готовото знание.`

---

## 2. КАКВО НЕ ИЗХВЪРЛЯМЕ

V6 е **надграждане и оформяне на голямата съществуваща основа**, не рестарт.

### Запазваме като основа

- единния public вход `Обяви и услуги`;
- одобрената global desktop/mobile навигация;
- `Фирми` и фирмените профили;
- `Обяви` и съществуващия protected listing owner;
- `Майстори`/ремонтната protected логика и URL compatibility;
- `Здраве и лекари` като специализиран, развит owner;
- `Магазини`, `Заведения`, `Събития`, `Инфо Лом` и специализираните им owner-и;
- съществуващите `Въпроси` и `Отговори` + moderation flow;
- current public search като реална основа — то вече търси в Supabase за фирми, въпроси и обяви, плюс статични категории и проверена информация;
- protected Admin/Moderator, quotas, status, RLS, Ivanov/Admin priority и boost semantics;
- backward-compatible URLs;
- performance и accessibility правилата.

### Какво V6 преработва на presentation/relationship ниво

- старата идея за четири изкуствени marketplace групи не е финална продуктова архитектура;
- main taxonomy трябва да стане по-естествена и конкретна;
- „Въпроси“ престава да бъде самотен отделен продукт и става **cross-cutting knowledge layer**;
- Facebook става официален **distribution bridge**, а не конкурент, който се опитваме да копираме;
- категориите, въпросите, отговорите, фирмите, лекарите, магазините, заведенията и обявите започват да се свързват през отделен relationship layer, без да се смесват backend owner-ите.

---

## 3. V6 TAXONOMY: СТАБИЛНА СТРУКТУРА + БЪРЗИ ВХОДОВЕ

Важен принцип:

**Taxonomy ≠ priority shortcuts.**

### Стабилна taxonomy

`Всички категории` съдържа пълната, постоянна структура. Работни главни категории:

- Строителство и ремонти
- Здраве и лекари
- Работа
- Автомобили
- Имоти
- Красота
- Дом и градина
- Магазини
- Заведения и храна
- Електроника
- Деца и бебета
- Животни
- Мода
- Спорт и хоби
- Други услуги
- Други обяви

Имената и точният ред подлежат на V6 visual/SEO refinement преди approval.

### Quick shortcuts

Първият екран не показва цялата taxonomy. Показва ограничен брой най-полезни локални входове, определени по:

- местно търсене;
- реални въпроси и публикации;
- site analytics;
- сезонност;
- urgency;
- frequency;
- достатъчно supply.

Тези shortcuts могат да се пренареждат без да се променят URLs, SEO структурата или backend taxonomy.

### „Открий в Лом“

Местата/обектите не трябва да се смесват изкуствено с service-demand ranking.

Отделен discover layer може да показва:

`Магазини · Заведения · Събития · Фирми`

Така са видими още на първия екран, без да претрупват основните task-oriented shortcuts.

---

## 4. „ПОПИТАЙ“ Е ДЕЙСТВИЕ, НЕ САМО СТРАНИЦА

V6 не разчита човек да отваря `Въпроси` и да рови дали има нещо ново.

### Основен flow

Потребителят пише например:

`зъболекар в неделя в Лом`

Системата първо показва:

1. проверена информация;
2. релевантни local profiles/обекти;
3. вече отговорени canonical въпроси;
4. едва след това: **„Не намери отговор? Попитай Лом.“**

При `Попитай`:

- оригиналната заявка вече е попълнена;
- системата предлага категория/подкатегория;
- потребителят не минава през дълга форма, ако не е необходимо;
- moderation rules остават запазени.

### Къде живее въпросът

Всеки въпрос има собствен постоянен URL, но едновременно се показва в правилния тематичен контекст.

Пример:

`Здраве и лекари → Стоматолози → свързани въпроси`  
`Строителство и ремонти → Покриви → свързани въпроси`

Отделната страница `Въпроси` остава като архив/secondary entry, но не е главният механизъм за откриване.

---

## 5. ПОПИТАЙ.ЛОМ КАТО „ПАМЕТ НА ЛОМ“

Целта не е да съхраняваме безкраен feed. Целта е да натрупваме **концентрирано знание**.

### Canonical question

Една тема има един основен canonical въпрос.

Пример:

Canonical:
`Кой зъболекар работи в неделя в Лом?`

Подобна заявка:
`Има ли стоматолог в Лом отворен в неделя?`

не трябва автоматично да създава втори независим център с отделни отговори.

### Duplicate protection

Преди публикуване:

1. normalize text;
2. category/subcategory context;
3. локално similarity търсене;
4. показване на 1–3 възможни съществуващи въпроса;
5. потребителят може да отвори съществуващия или да продължи;
6. при по-силен duplicate сигнал — moderation review;
7. merge/canonical decision не се прави разрушително автоматично.

### Не изтриваме полезните формулировки

Различните формулировки могат да останат като aliases/redirects към canonical знанието. Това помага за:

- естествено търсене;
- локални разговорни изрази;
- SEO откриване;
- избягване на 20 тънки duplicate страници.

---

## 6. RELATIONSHIP LAYER — КЛЮЧЪТ КЪМ V6

Protected backend owner-ите остават отделни. V6 добавя **relationship/search layer над тях**.

Той трябва да може да знае:

- този въпрос е за тази категория/подкатегория;
- този въпрос е canonical за тези aliases;
- този отговор препоръчва конкретен обект;
- този обект може да бъде фирма, health profile, магазин, заведение или друг позволен entity type;
- този въпрос има връзка с проверена информация;
- този резултат е от Лом;
- кога е последно потвърдено/актуализирано знанието;
- кои записи са related, без да ги копираме физически в няколко owner-а.

### Не правим крехки броячи

Не е желателно просто да добавим `recommendation_count` във `businesses` и да го увеличаваме ръчно.

По-здрав модел:

`recommendation relation → target entity`

Броят се изчислява само от валидни approved relations. Така recommendation системата не замърсява protected Firms owner.

---

## 7. FACEBOOK BRIDGE — FACEBOOK ДА РАБОТИ ЗА НАС

### Основен принцип

Не се опитваме да заменим Facebook аудиторията в първия ден.

Използваме я като **distribution layer**, докато Попитай.Лом натрупва собствена памет и собствен трафик.

### V1 — Popitai → Facebook

След одобрено публикуване на:

- въпрос;
- обява;
- работа;
- имот;
- събитие;
- фирмен/местен профил, когато е подходящо;

показваме compact share pack:

- `Сподели във Facebook`
- `Сподели`
- `Копирай текст`

Ние подготвяме заглавие, кратък текст и постоянен линк. Потребителят сам избира Facebook група/дестинация.

### Важно ограничение

V6 **не се базира** на автоматично scraping/import на чужди Facebook групи и не обещава автоматично публикуване в произволни групи. Facebook group data/API достъпът е ограничен и частните групи изискват особено внимание.

### V2 — dynamic share preview

Постоянните detail URLs в сегашния static frontend имат generic server HTML title/description, а истинското съдържание се зарежда с JS.

За качествен Facebook/Google/social preview е нужен отделен lightweight share/render layer, който връща server-readable:

- real title;
- real description;
- canonical URL;
- Open Graph/Twitter metadata;
- подходящо изображение.

Това може да бъде Worker/Edge Function без да натежава на основния сайт.

### V3 — Facebook → Popitai без повторно писане

В `+ Добави`:

**„Вече го публикува във Facebook?“**

Потребителят може да:

- постави собствен текст;
- по желание постави линк към собствената публикация;
- системата предлага category/subcategory/type/location;
- потребителят потвърждава преди запис.

Не копираме автоматично чуждо съдържание.

### V4 — mobile share target experiment

По-късно може да се проучи PWA/Web Share Target:

`Facebook → Share → Попитай.Лом`

Това е optional enhancement, не основа на продукта, защото browser/platform support не е универсален.

---

## 8. КАК FACEBOOK ОТГОВОРИТЕ СЕ ВРЪЩАТ ПРИ НАС

Не разчитаме на автоматично прочитане на Facebook comments.

Основната цел е Facebook публикацията да води към постоянния Popitai URL, където се отговаря структурирано.

Ако полезен отговор остане само във Facebook:

- авторът може да бъде насочен лесно да го добави и при нас;
- собственикът на въпроса може да предложи пренасяне;
- moderator може да предложи/провери съдържание;
- чужд коментар не се копира и представя като наш без ясен permission/provenance flow.

---

## 9. STRUCTURED RECOMMENDATIONS

Отговорът не трябва да е само свободен текст.

Пример:

`Препоръчайте добър фризьор.`

Отговарящият може:

- `Препоръчай обект` → избира съществуващ local profile;
- по желание добавя текстов опит;
- ако обектът липсва, остава text answer или се предлага отделен submit flow.

Така с времето получаваме:

`Салон X — препоръчан от N местни потребители`

но само от approved, traceable recommendations.

Това е отделен backend stage и не се реализира без explicit approval, защото докосва cross-owner relationships.

---

## 10. SEARCH V6

Current search вече има real Supabase read layer за:

- businesses;
- questions;
- listings;

и static/verified records.

V6 трябва да го развие от keyword search към intent-aware local search, без тежък runtime.

Примери:

- `зъболекар в неделя`
- `работа като шофьор`
- `майстор за климатик`
- `апартамент под наем`
- `гуми`
- `фризьор в събота`

Работен lightweight модел:

- normalize;
- synonym/local dictionary;
- category intent;
- entity matching;
- canonical question matching;
- verified info;
- local ranking;
- graceful fallback.

Не е необходимо AI API да се вика при всяко търсене.

---

## 11. „ЛОМ ПЪРВО“ — ОТДЕЛЕН RANKING CONTRACT

Съществуващите listings и businesses вече имат `city` данни, така че базовото local/non-local разграничение е технически възможно без GPS.

Но локалният приоритет **не трябва да наруши protected ordering**.

Преди код трябва да се заключи точният contract, например:

`protected Ivanov/Admin priority → protected boost → local relevance → remaining sort`

или друг изрично одобрен ред.

Не се прави silently.

---

## 12. SEO / GOOGLE KNOWLEDGE ACQUISITION

Въпросите имат реален SEO потенциал само ако страниците са качествени, уникални и crawlable.

За canonical Q&A detail pages:

- real server-readable title/description;
- canonical URL;
- clean internal links;
- sitemap;
- structured data само когато страницата действително отговаря на Google изискванията;
- noindex/redirect за неподходящи duplicate aliases, когато е нужно;
- stale/invalid information management;
- отделяне на user opinions от verified facts.

Google официално поддържа `QAPage` за страница с **един въпрос и потребителски отговори** и `DiscussionForumPosting` за forum-style discussions. Markup не се поставя механично на неподходящи страници.

---

## 13. FRESHNESS / TRUST

Не всяко старо community знание остава вярно завинаги.

V6 трябва да различава:

- **verified information** — собствен owner, дата/източник/последно потвърдено;
- **community recommendation** — мнение/опит, не официален факт;
- **time-sensitive answer** — например „работи в неделя“;
- **evergreen answer** — например постоянна услуга/процедура.

Time-sensitive знание може да има:

- `Последно потвърдено`;
- `Това още актуално ли е?`;
- автоматичен stale flag след подходящ период;
- re-confirmation вместо silent assumption.

---

## 14. МОДЕРАЦИЯ И БЕЗОПАСНОСТ

Всички нови V6 relationships трябва да следват съществуващите moderation и role rules.

Не допускаме:

- автоматично публикуване на чуждо Facebook съдържание;
- автоматично твърдение, че човек/фирма е „препоръчан“, без валиден approved relation;
- health информация да се превърне в непроверена generic обява;
- duplicate merger без traceability;
- presentation layer да прави нерегламентирани database writes;
- ethnic segmentation/targeting.

---

## 15. ДОКАЗАНИ ВЪНШНИ МОДЕЛИ — КАКВО ВЗИМАМЕ, НЕ КАКВО КОПИРАМЕ

### Front Porch Forum

Полезно за:

- local community posting;
- единна search surface за forum postings + business directory + calendar;
- archive/search на стари local posts.

Източник: https://help.frontporchforum.com/how-do-i-search-fpf

**Вземаме:** идеята за локална търсачка, която обединява различни content owners.

### Nextdoor

Полезно за:

- local recommendations;
- recommendations, свързани с Business Pages;
- reputation, която остава при обекта.

Източници:
- https://business.nextdoor.com/en-us/blog/small-business-guide-to-getting-nextdoor-recommendations
- https://business.nextdoor.com/en-gb/small-business/resources/blog/how-businesses-can-get-more-recommendations-on-nextdoor

**Вземаме:** structured recommendation → real local entity.

### Stack Overflow

Полезно за:

- canonical question;
- duplicate linking;
- концентрация на добрите отговори вместо разпиляване.

**Вземаме:** canonical/alias philosophy, но с по-мек local UX и moderation.

### Discourse / Make

Полезно за:

- Facebook community → durable searchable knowledge hub;
- собствено контролирано знание вместо зависимост от social feed.

Източници:
- https://blog.discourse.org/2026/02/make-building-a-community-powered-knowledge-hub-with-discourse/
- https://blog.discourse.org/2017/03/moving-from-facebook-groups-to-discourse/

**Вземаме:** Facebook като audience source, Popitai като permanent knowledge home. Не правим пълна миграция; държим bridge.

### Google Search Central

Полезно за:

- `QAPage` structured data;
- `DiscussionForumPosting`;
- canonical/crawlable Q&A pages.

Източници:
- https://developers.google.com/search/docs/appearance/structured-data/qapage
- https://developers.google.com/search/docs/appearance/structured-data/discussion-forum

**Вземаме:** техническата форма за SEO, само когато реалното съдържание отговаря на изискванията.

### Facebook

Полезно за:

- огромна local reach;
- моментно разпространение;
- естествени recommendation/search intents.

**Не вземаме:** endless feed, зависимост от algorithmic history, uncontrolled duplicate posts.

### OLX / TaskRabbit / Thumbtack / Fresha / Yelp

Полезни за:

- category scan patterns;
- search-first discovery;
- task-oriented service intents;
- специализирани verticals като beauty/health/services;
- contextual Q&A и local business discovery.

**Не копираме labels/order/design директно.** Адаптираме само доказани interaction patterns към Лом и текущите protected owners.

---

## 16. ПЪТ ДО КОД — НЕ ПРЕСКАЧАМЕ ЕТАПИ

### Stage V6-A — Inventory / Owner map

Преди нов код:

- current owner map за listings, firms, health, shops, restaurants, questions, events, search;
- current schema/fields;
- current URLs;
- protected boundaries;
- current analytics/search signals;
- кое може да бъде presentation-only и кое изисква backend relation.

Резултат: `CURRENT → TARGET` matrix.

### Stage V6-B — Product model

Заключваме:

- stable taxonomy;
- quick shortcuts;
- `Открий в Лом`;
- Ask flow;
- canonical/duplicate logic;
- relationship model;
- Facebook bridge;
- local ranking contract;
- freshness model.

Никакъв production code.

### Stage V6-C — Real visual prototypes

Задължителни states:

- desktop marketplace landing;
- mobile landing;
- open `Всички категории`;
- search autocomplete/results;
- `Не намери? Попитай Лом`;
- duplicate warning state;
- canonical question page;
- Facebook share state;
- `Строителство и ремонти`;
- improved `Здраве и лекари`;
- `Красота`;
- `Открий в Лом`;
- local-first results state.

### Stage V6-D — Technical design / migration plan

За всяка нова backend идея:

- exact tables/relations/fields;
- RLS;
- moderation;
- rollback;
- backward compatibility;
- performance;
- SEO rendering;
- no protected owner regression.

### Stage V6-E — Approval gate

Преди implementation се одобряват:

1. product model;
2. visual prototype;
3. relationship/data model;
4. protected-impact matrix;
5. rollout order.

### Stage V6-F — Incremental implementation

Не се прави giant rewrite.

Възможен ред:

1. taxonomy/presentation + search UX;
2. Ask-from-search + contextual question placement;
3. duplicate/canonical read flow;
4. Facebook Bridge V1;
5. dynamic social/SEO rendering;
6. relationship/recommendation layer;
7. freshness/re-confirmation;
8. optional PWA share-target/import experiments.

Всеки stage минава CI + regression + mobile/desktop QA + production verification преди следващия.

---

## 17. КАК ЩЕ РАЗБЕРЕМ, ЧЕ V6 Е УСПЕШЕН

Не само „изглежда модерно“.

След launch следим:

- search → useful result rate;
- search → Ask conversion;
- duplicate avoided rate;
- unanswered question rate;
- median time до първи отговор;
- Facebook share usage;
- Facebook referral traffic;
- question → recommendation relation usage;
- Google organic entrances към Q&A;
- stale-information corrections;
- mobile completion rates;
- category discovery without backtracking;
- performance/CLS/LCP/JS weight.

Shortcuts и UI могат да се оптимизират по тези сигнали, без да се променя стабилната taxonomy.

---

## 18. ТЕКУЩО РЕШЕНИЕ

V6 се разработва като **надграждащ relationship/search/distribution layer върху съществуващите owner-и**, а не като нов монолитен backend и не като изхвърляне на текущата работа.

Следващата безопасна задача е:

**пълен CURRENT → TARGET owner/relationship map + V6 information architecture + duplicate/canonical model**, след което се прави V6 visual prototype.

До approval: **NO production code changes.**
