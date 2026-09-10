# Попитай.Лом — icon system contract и пълна taxonomy карта — DRAFT FOR OWNER APPROVAL

Статус: `VISUAL MAPPING DRAFT / НЕ Е SITE-WIDE APPROVAL / НЕ Е PRODUCTION`.

Provenance: `Work 2 · 10.09.2026 · base review SHA e60655186677722f1e319016c9602857e99aebef`. Предходният `Work 1` подготвя началния draft и локалния commit `39f442b00885b436339bafee833ecb552eda813d`; `Work 2` възстановява/качва идентичното дърво като `e606551…` и прави текущия audit. Всички `OWN / SHARED / TEXT / FALLBACK / OPEN` класификации по-долу са **Work 2 proposal за owner review**, освен когато редът изрично сочи вече owner-confirmed правило.

## Задължително правило

Изборът е `одобрена реална медия → точна тема/leaf → family/category → общ fallback`. Иконата никога не се избира чрез AI гадаене по свободния текст. Източникът е контролиран `content type + owner + discovery/category/subcategory` contract.

Един asset може да се споделя само от понятия с еднакъв визуален смисъл. Името на SVG е посока за одобрение, не окончателен asset.

## Source of truth и registry статуси

Картата следва `POPITAI_LOM_MASTER_CURRENT.md` и `POPITAI_LOM_DECISION_AND_BACKLOG_REGISTER.md`. Prototype кодът доказва текущо покритие, но не може да замени Master taxonomy. При разминаване не се измисля автоматично mapping.

- `OWN ICON` — понятието изисква собствен тематичен знак;
- `SHARED ICON` — използва одобрен знак на друго понятие само при еднакъв визуален смисъл;
- `TEXT ONLY` — текстът/филтърът е по-ясен без taxonomy икона;
- `FAMILY FALLBACK` — временно използва общия знак до отделно одобрение;
- `OPEN` — символът или границата са нерешени; не се рисува и не се прилага механично.

Всяко понятие трябва да има registry решение, но не всяко понятие трябва да има различен SVG.

## Контролирано performance изключение — само за иконите

Качеството, естетиката и разпознаваемостта са пред минималния възможен file size. Допуска се умерено по-детайлен или малко по-голям оптимизиран SVG, когато опростяването доказано влошава знака. Това не разрешава raster assets, embedded изображения, тежки effects, неоптимизирани paths или зареждане на цяла неизползвана библиотека.

**Work 2 verdict за първите осем assets:** стилово еднаквите `small/site` и `large/social` варианти са приети за тази група след сравнение при 20–24 px, desktop card, 390 px и 1200×630 composition. Решението не приема автоматично следващите групи. Оптимизираните raster производни в текущия proof не разрешават production raster wiring и не определят предварително финалния site delivery формат.

## Work 2 — първи 8 owner-accepted semantic assets

След audit на 30 предоставени generated concepts осемте най-силни assets са поставени в изолиран visual proof: `Доставки`, `Товарен транспорт`, `Домашна помощ`, `Автомобилна диагностика`, `Борба с вредители`, `Почистване на дом`, `Монтажи и мебели`, `ВиК`.

Owner verdict от Work 2 на 10.09.2026 е `приемам` за всичките осем, след desktop и реална 390 px QA на review SHA `e17df39be8cd81872101f89d94f4d917ebc85778`. Това заключва осемте semantic assets и референтната visual direction, но не приема останалата taxonomy, не сменя иконите в сайта и не разрешава production wiring. За proof-а се използват оптимизирани 128 px site и 512 px social WebP производни; оригиналните 1254 px PNG файлове не се добавят в repo-то.

Owner посоката от Work 2 е да не се изработват механично 59 различни картинки. Всички 59 Master leaves остават покрити в registry, но exact asset се създава само когато family знакът би бил неточен; при еднакъв визуален смисъл се използва `SHARED ICON`, а дългите филтри могат да останат `TEXT ONLY`. Exact mapping-ът и всеки визуален asset продължават да изискват отделен owner verdict.

## Повърхностен договор

| Повърхност | Icon правило |
| --- | --- |
| Деветте Home discovery входа | Собствена различима икона + видим текст |
| Деветте Services families | Family икона + видим текст; не се показват всичките leaves наведнъж |
| Популярна / бърза конкретна задача | Exact тематична икона + видим текст само след owner approval |
| Дълъг leaf списък, chip, filter, select или radio | `TEXT ONLY` по подразбиране; икона само ако подобрява доказано сканирането |
| Result / detail с одобрена реална медия | Реалната медия е първа; taxonomy иконата не я замества |
| Result / detail без медия | Exact одобрена тема, после family/category fallback |
| Social 1200×630 без медия | Същият semantic registry, но large/social композиция; не е уголемена site карта |
| Form | Видим bounded prefill и текст; без декоративна икона за всяка опция |
| Navigation / actions | Отделен functional icon слой; taxonomy символ не се използва за действие |

## Общи публични входове и content roles

| Понятие | Registry решение | Визуален знак |
| --- | --- | --- |
| Услуги | `OWN ICON` | wrench |
| Купува и продава | `OWN ICON` | shopping-bag |
| Работа | `OWN ICON` | briefcase |
| Имоти | `OWN ICON` | house / building |
| Автомобили | `OWN ICON` | car |
| Здраве и частни лекари | `OWN ICON` | first-aid-kit / medical-bag |
| Магазини | `OWN ICON` | storefront |
| Заведения | `OWN ICON` | fork-knife |
| Животни | `OWN ICON` | paw-print |
| Майстори и ремонти | `OWN ICON` | hammer |
| Статии | `OWN ICON` | article |
| Публикации | `OWN ICON` | newspaper |
| Събития | `OWN ICON` | calendar-star |
| Въпроси | `OWN ICON` | chat-circle-question |
| Проверена информация | `OWN ICON` | seal-check |

## Услуги — 59 Master discovery leaves

| Family | Discovery leaf от Master | Registry решение | Визуален знак / граница |
| --- | --- | --- | --- |
| Майстори, ремонти и дом | Цялостни ремонти | `SHARED ICON` | hammer — family знакът има същия визуален смисъл |
|  | Бани и плочки | `OWN ICON` | bathtub / tile — един финален знак след 24 px review |
|  | ВиК | `OWN ICON` | pipe |
|  | Електро | `OWN ICON` | lightning |
|  | Покриви | `OWN ICON` | house-line / roof |
|  | Шпакловка / гипсокартон / боядисване | `OWN ICON` | wall-finish / paint-roller; знакът трябва да покрива цялата Master leaf, не само боя |
|  | Дограма и врати | `OWN ICON` | door / window-frame |
|  | Отопление и климатици | `OWN ICON` | thermostat / fan; не само snowflake |
|  | Монтажи и мебели | `OWN ICON` | drill / assembly; armchair самостоятелно е твърде тясно |
|  | Къртене и извозване | `OPEN` | нужен е един ясен demolition/debris знак; обикновен truck е забранен |
| Почистване и поддръжка | Почистване на дом | `OWN ICON` | broom |
|  | Офиси и входове | `SHARED ICON` | broom — същата основна дейност, label-ът уточнява обекта |
|  | Пране на мека мебел / килими | `OWN ICON` | couch-cleaning / vacuum; broom е неточен |
|  | Двор и градина | `OWN ICON` | plant |
|  | Озеленяване | `OWN ICON` | tree / landscape |
|  | Борба с вредители | `OWN ICON` | bug |
|  | Домашна помощ | `OWN ICON` | hand-heart |
| Автомобилни услуги | Автосервиз | `OWN ICON` | car-wrench / car-profile with service cue |
|  | Диагностика | `OWN ICON` | gauge / diagnostic scanner |
|  | Гуми | `OWN ICON` | tire |
|  | Автоелектро / автоклиматици | `OWN ICON` | car-battery / automotive electrical cue |
|  | Автомивка / detailing | `OWN ICON` | car-wash / drop with car cue |
|  | Пътна помощ | `OPEN` | tow-truck / recovery platform; не обикновен cargo truck |
| Транспорт, преместване и доставки | Товарен транспорт | `OWN ICON` | truck |
|  | Хамали | `OWN ICON` | person with box / lifting |
|  | Преместване | `SHARED ICON` | moving boxes / hamali asset — еднакъв процес, различен label |
|  | Доставки | `OWN ICON` | package with motion / delivery |
|  | Транспорт с бус / камион | `SHARED ICON` | truck / van — общ transport asset при ясно видим label |
| Красота и лична грижа | Фризьор / бръснар | `OWN ICON` | scissors / hair-comb |
|  | Маникюр / педикюр | `OWN ICON` | hand / nail |
|  | Козметични услуги | `OWN ICON` | sparkle / cosmetic-care cue |
|  | Грим | `OWN ICON` | palette / makeup-brush |
|  | Немедицински масаж | `OWN ICON` | massage-hands; не medical cross |
| Грижа за хора и животни | Детегледачки | `OWN ICON` | baby / child-care |
|  | Грижа за възрастни | `OWN ICON` | person-heart / elder-care |
|  | Домашни помощници | `SHARED ICON` | hand-heart — същият смисъл като Домашна помощ |
|  | Гледане / разхождане на домашни любимци | `OWN ICON` | dog-leash / paw-heart |
|  | Grooming | `OWN ICON` | paw-sparkle / pet-grooming; обикновени scissors са твърде близо до фризьор |
| Обучение, уроци и спорт | Уроци | `OWN ICON` | chalkboard-teacher |
|  | Езици | `OWN ICON` | translate |
|  | Шофьорски курсове | `OWN ICON` | steering-wheel |
|  | Професионално обучение | `OWN ICON` | certificate |
|  | Компютърни курсове | `OWN ICON` | laptop with learning cue |
|  | Спорт и танци | `OWN ICON` | person-arms-spread / activity |
| Техника, дигитални и професионални услуги | Компютри / лаптопи | `OWN ICON` | laptop |
|  | Телефони / електроника | `OWN ICON` | device-mobile |
|  | IT | `OWN ICON` | code / terminal |
|  | Сайтове | `OWN ICON` | browser |
|  | Дизайн | `OWN ICON` | pen-nib |
|  | Счетоводство | `OWN ICON` | calculator |
|  | Правни услуги | `OWN ICON` | scales |
|  | Преводи | `SHARED ICON` | translate — еднакъв езиков смисъл с Езици |
|  | Други професионални услуги | `FAMILY FALLBACK` | professional-services family; не се измисля generic decorative icon |
| Събития и творчески услуги | Фото | `OWN ICON` | camera |
|  | Видео | `OWN ICON` | video-camera |
|  | DJ / музика | `OWN ICON` | music-notes / headphones |
|  | Декорация | `OWN ICON` | confetti / decoration |
|  | Кетъринг | `OWN ICON` | fork-knife / serving tray |
|  | Организация и помощ за събития | `OWN ICON` | calendar-star / event-plan |

## Други discovery таксономии

### Работа

На direct results страницата направленията са компактни текстови филтри след резултатите и не получават девет конкуриращи се icon cards. Тематичният знак е разрешен за contextual result/social fallback.

| Направление | Site решение | Context/social тема |
| --- | --- | --- |
| Строителство, ремонти и техници | `TEXT ONLY` | hard-hat |
| Производство, склад и общи работници | `TEXT ONLY` | factory |
| Транспорт, шофьори и доставки | `TEXT ONLY` | truck — shared transport meaning |
| Търговия и продажби | `TEXT ONLY` | shopping-bag — shared commerce meaning |
| Заведения, хотели и туризъм | `TEXT ONLY` | fork-knife / hospitality |
| Почистване, домашна помощ и грижи | `TEXT ONLY` | broom / care family according to controlled direction |
| Здраве, красота и социални дейности | `TEXT ONLY` | medical-bag / care family according to controlled direction |
| Офис, администрация, IT и специалисти | `TEXT ONLY` | desktop |
| Друга / сезонна работа | `TEXT ONLY` | briefcase family fallback; sun самостоятелно е OPEN |

### Имоти

Намеренията `Продава / Отдава / Купува / Търси под наем` са `TEXT ONLY` filters. Видът имот може да управлява exact fallback без задължително да превръща всяка form опция в icon card.

| Вид | Registry решение | Тема |
| --- | --- | --- |
| Апартамент | `OWN ICON` | building-apartment |
| Къща / етаж | `OWN ICON` | house |
| Парцел | `OWN ICON` | map-pin-area / plot |
| Земеделска земя | `OWN ICON` | field / plant |
| Гараж / паркомясто | `OWN ICON` | garage |
| Бизнес имот | `OWN ICON` | storefront / office-building |
| Склад / производствен имот | `OWN ICON` | warehouse |
| Друго | `FAMILY FALLBACK` | property family; dots-three не е thematic content знак |

### Автомобили и МПС

| Вход | Registry решение | Тема |
| --- | --- | --- |
| Автомобили и джипове | `OWN ICON` | car |
| Мотоциклети и ATV | `OWN ICON` | motorcycle |
| Бусове и камиони | `OWN ICON` | truck |
| Агро/строителна техника | `OWN ICON` | tractor |
| Ремаркета, каравани и други | `OWN ICON` | trailer / caravan |
| Части, гуми и аксесоари | `OWN ICON` | tire / auto-part |
| Автомобилни услуги | `SHARED ICON` | automotive-service asset от Services, не generic wrench |

### Животни

| Вход | Registry решение | Тема |
| --- | --- | --- |
| Осиновяване / търси дом | `OWN ICON` | house-heart / paw-heart |
| Изгубени | `OWN ICON` | paw-search / search cue |
| Намерени | `OWN ICON` | paw-check / found cue |
| Стоки за животни | `OWN ICON` | pet-bag / paw with product cue |

Филтърът по вид `кучета / котки / птици / селскостопански / други` е `TEXT ONLY` по подразбиране. Една и съща лапа за `Изгубени` и `Намерени` е забранена.

### Купува и продава

| Група | Registry решение | Тема |
| --- | --- | --- |
| Електроника и телефони | `SHARED ICON` | device-mobile — същият product meaning |
| Дом и градина | `OWN ICON` | house-plant / home-garden |
| Дрехи, обувки и аксесоари | `OWN ICON` | t-shirt |
| Деца и бебета | `OWN ICON` | baby / stroller |
| Спорт, хоби и книги | `OPEN` | един доминиращ знак след 24 px review; ball + book комбинация не се приема автоматично |
| Инструменти и оборудване | `OWN ICON` | toolbox / drill |
| Друго | `FAMILY FALLBACK` | shopping-bag family; dots-three не е thematic content знак |

### Магазини

| Група | Registry решение | Тема |
| --- | --- | --- |
| Хранителни | `OWN ICON` | basket / groceries |
| Строителни | `SHARED ICON` | hammer / building-supplies context |
| Техника | `SHARED ICON` | device-mobile / electronics |
| Мебели | `OWN ICON` | armchair |
| Дрехи | `SHARED ICON` | t-shirt |
| Дом | `SHARED ICON` | house / home-goods context |

### Заведения

| Група | Registry решение | Тема |
| --- | --- | --- |
| Ресторанти | `SHARED ICON` | fork-knife — restaurant family meaning |
| Кафенета | `OWN ICON` | coffee |
| Пицарии | `OWN ICON` | pizza |
| Бързо хранене | `OWN ICON` | hamburger / fast-food |
| Сладкарници | `OWN ICON` | cake |
| Доставка / за вкъщи | `OWN ICON` | takeaway-bag / food-delivery |

### Здраве и частни лекари

| Вход | Registry решение | Тема |
| --- | --- | --- |
| Лекари | `SHARED ICON` | medical-bag — Health family meaning |
| Лични лекари | `OWN ICON` | stethoscope / family-doctor cue |
| Специалисти | `SHARED ICON` | stethoscope при видим label; не се измисля лице |
| Стоматолози | `OWN ICON` | tooth |
| Ветеринари | `OPEN` | paw + medical cue; не чиста лапа и не измислено лице |

### Инфо Лом

Шестте Info families са директни главни входове и получават шест различими знака. Отделните verified records не получават произволна икона за всеки ред.

| Family | Registry решение | Тема / граница |
| --- | --- | --- |
| Здраве | `SHARED ICON` | medical-bag — същият health meaning, verified state се показва отделно |
| Институции | `OWN ICON` | municipality / public-building; не bank |
| Транспорт | `OWN ICON` | bus / public-transport |
| Образование и култура | `OWN ICON` | graduation-cap / book-building after review |
| Банки и банкомати | `OWN ICON` | ATM / card-bank cue; не същата колонада като Институции |
| Комунални услуги | `OWN ICON` | utilities family; exact record може да използва ток/вода според контролирано поле |

## Нерешени визуални конфликти преди owner acceptance

- `Услуги` не трябва да прилича на `Работа`; toolbox е отхвърлен за общия вход.
- `Статии` и `Публикации` трябва да останат различими в 24 px.
- `Животни` и `Ветеринари` не могат да използват един и същ знак без здравен отличител.
- `Институции` и `Банки` не могат да останат с напълно еднаква колонада.
- `Пътна помощ` и обикновен товарен транспорт трябва да са различими.
- `Изгубени` и `Намерени` не могат да останат с една и съща чиста лапа.
- `Шпакловка / гипсокартон / боядисване` не може да бъде представено като само боядисване без проверка на целия leaf смисъл.
- `Спорт, хоби и книги` не получава автоматично сложна ball + book комбинация, ако тя не е ясна при 24 px.
- Комбинирани икони се допускат само ако остават ясни при 24 px; иначе се избира един доминиращ знак.

## Външен benchmark — какво се адаптира, без сляпо копиране

- [Taskrabbit Services](https://www.taskrabbit.com/services) използва силни визуални family повърхности, а многобройните конкретни задачи остават текстови links. За Попитай.Лом това означава family икони + текстови deep leaves.
- [Thumbtack](https://www.thumbtack.com/) и [Checkatrade](https://www.checkatrade.com/) водят с търсене и ограничен набор популярни конкретни задачи. За Попитай.Лом exact икони се показват при полезните бързи задачи, не върху всяка taxonomy дума.
- [Fiverr categories](https://www.fiverr.com/categories) и [Houzz professionals](https://www.houzz.com/professionals) организират големи таксономии чрез ясни семейства и текстови списъци. Това е моделът за дълбоките услуги и filters.
- [OLX.bg](https://www.olx.bg/) доказва полезността на различимите top-level визуални входове, но разнородните photorealistic обекти не се копират; Попитай.Лом пази една SVG система.
- [GOV.UK services and information](https://www.gov.uk/browse) показва, че справочната навигация може да остане ясна чрез заглавие и описание. Info Лом получава шест family знака, не икона за всеки verified ред.
- [USWDS icon guidance](https://designsystem.digital.gov/components/icon/) изисква пряка връзка между знак и придружаващ текст, последователно значение и проверка на разпознаваемостта.
- [Atlassian iconography](https://atlassian.design/foundations/iconography/) изисква простота, установена метафора и проверка дали текстът не е по-ясен от нова икона.
- [Material Symbols](https://developers.google.com/fonts/docs/material_symbols) използва optical-size варианти; [Phosphor Core](https://github.com/phosphor-icons/core) предоставя една SVG family система с различни weights. Посоката за review е една family система, с подходящ small и large вариант, а не смесване на библиотеки.

## Текущо доказано покритие на review SHA `e606551…`

- налични са 19 локални duotone SVG файла;
- само 10 реда от Services draft имат директно съвпадащ локален asset;
- визуалният checkpoint показва ограничени примери, не целия registry;
- текущият runtime Services inventory съдържа 57 позиции и не съвпада с 59-те Master leaves; runtime не се променя в този documentation-only pass;
- текущият social registry още съдържа старите връзки `Услуги → briefcase` и `Ремонти → wrench`, а конкретни записи за ВиК, Кетъринг и Почистване подават generic `services` key;
- тези разминавания са доказателство за следваща prototype-only работа, не разрешение за production wiring.

## Задължителен ред след приемане на картата

1. owner review на taxonomy границите и `OWN / SHARED / TEXT / FALLBACK / OPEN` решенията;
2. един визуален base style и общи tokens;
3. първа пълна група `Майстори, ремонти и дом`, включително всички трудни разграничения;
4. 20–24 px, desktop, 390 px и 1200×630 сравнение за всеки semantic asset;
5. owner approval по икона и по група;
6. следваща група едва след verdict за текущата;
7. deterministic prototype registry и full regression audit след приемането на целия комплект;
8. production merge, Supabase и Stage 3 остават отделни checkpoints.
