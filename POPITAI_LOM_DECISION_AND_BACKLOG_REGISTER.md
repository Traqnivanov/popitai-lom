# Попитай.Лом — централен регистър на решенията и backlog-а

Статус: **КАНОНИЧЕН ИНДЕКС КЪМ CURRENT PRODUCT MASTER / НЕ Е РАЗРЕШЕНИЕ ЗА PRODUCTION ПРОМЕНИ**  
Създаден: **09.09.2026**  
База: `e423a2c3a8d2f70d28060fb4c37ce38bd5369d5e`

## 1. Как се използва регистърът

Този файл не заменя `POPITAI_LOM_MASTER_CURRENT.md` и защитените технически договори. Той пази на едно място решенията, текущата им реализация и следващия разрешен checkpoint.

При конфликт важи:

1. последното изрично решение на собственика по конкретната тема;
2. приложимият текущ MASTER и protected/LOCKED contract;
3. провереното реално production състояние;
4. по-старите handoff-и, стратегии и предложения.

Кодът доказва какво е реализирано, но не превръща автоматично предложение в одобрено продуктово решение.

## 2. Допустими статуси

- **APPROVED — NOT IMPLEMENTED** — одобрено продуктово решение, което още не е реализирано;
- **PROTOTYPED — ACCEPTANCE PENDING** — показано е в Stage 2, но не е production и не е финално прието;
- **ACCEPTED** — независимо проверено и прието в посочената граница;
- **OPEN — OWNER DECISION** — необходимо е продуктово решение преди код;
- **PRODUCTION CHECKPOINT** — изисква отделно разрешение за production/backend/schema/RLS;
- **IDEA ONLY** — предложение без одобрение за функция;
- **REJECTED / REPLACED** — не управлява бъдеща работа;
- **STALE CLAIM** — исторически факт или дефект, който вече не описва текущото състояние.

## 3. Facebook, Share и Social Cards

| Тема | Статус | Решение / граница | Следващо действие |
| --- | --- | --- | --- |
| Facebook като distribution bridge | **APPROVED — NOT IMPLEMENTED IN PRODUCTION** | Попитай.Лом е първоизточникът и собственикът на съдържанието. Facebook само води хората към него. | Да се пази като production архитектурен договор. |
| Facebook hooks и тон | **APPROVED PRINCIPLE** | Кратко, конкретно, местно и полезно; без евтина реклама, clickbait, фалшиви числа или измислена спешност. Конкретните кампании и текстове не са заключени. | Текстовете се одобряват според реалното съдържание. |
| Deep link | **APPROVED** | Външният линк води към конкретния публичен запис, а не без причина към Home. | Production canonical routes са отделен checkpoint. |
| Guest → auth → return-to-action | **APPROVED CONTRACT / PARTIALLY PROTOTYPED** | Публичното съдържание се вижда без вход. Вход се иска при действие с конкретна причина. След вход човекът се връща към същия запис и започнатото действие. | Production auth/intent реализацията се проверява по owner contracts. |
| Share UX | **PROTOTYPED — ACCEPTANCE PENDING** | Share е действие на допустим public/approved detail. Social Preview е част от Share UX, не отделна система и не доказва Facebook delivery. | Финален Stage 2 desktop/mobile acceptance. |
| Share eligibility | **APPROVED CONTRACT** | Pending/private/rejected/removed съдържание няма публичен Share. Наличието на снимка само по себе си не дава Share право. | Да остане отделно от Favorite eligibility. |
| Social image hierarchy | **APPROVED DIRECTION / PROTOTYPED** | 1) реална одобрена медия; 2) тематичен брандиран шаблон; 3) панорама на Лом като последен fallback. Без измислени лица и assets. | Production generation/storage остава отделно. |
| Production Facebook/Open Graph bridge | **PRODUCTION CHECKPOINT** | Нужни са stable canonical URL и server/crawler-readable `title`, description, `og:*`, site name, status/freshness правила и cache lifecycle. Hash prototype URL не е production решение. | Отделен архитектурен и security review; не се започва от Stage 2. |
| Автоматични 1200×630 изображения | **PRODUCTION CHECKPOINT** | Няма доказана production реализация. Трябва контролирано генериране, съхраняване, обновяване след редакция и cache invalidation; предпочита се static/cached asset, не screenshot при всеки Share. | Отделно owner/Work одобрение за backend/storage. |
| Auto-posting / scraping / import от Facebook | **REJECTED / FORBIDDEN BY CURRENT DIRECTION** | Без скрито auto-posting, произволно публикуване по групи, scraping и внос на реакции/коментари. Бъдещ Meta Page/API вариант изисква ново изрично решение и проверка на разрешенията. | Няма работа сега. |
| Facebook analytics | **PRODUCTION CHECKPOINT** | Може да измерва source, click, auth gate и завършено действие само по приложимите privacy/analytics правила. | Отделен analytics/privacy checkpoint. |

### 3.1 Текущи Stage 2 evidence checkpoints

| Област | Статус | Evidence / граница |
| --- | --- | --- |
| Runtime consolidation | **ACCEPTED IN PROTOTYPE SCOPE** | Един route/render lifecycle и консолидирани owners от `9dde7e2…`; последващите bounded корекции са върху тази база. |
| Работа — direct results UX | **ACCEPTED IN PROTOTYPE SCOPE** | `2fe36cfc6b68afdfe201f44639485595b03e77fd`. |
| Работа — compensation UX | **ACCEPTED IN PROTOTYPE SCOPE / PRODUCTION PERSISTENCE OPEN** | `ba1c00ad64784e261107b902e6f8b8165bba3291`; периодът няма production storage contract. |
| Favorites detail-only | **PROTOTYPED — FINAL BROWSER ACCEPTANCE PENDING** | Real-route/content-integrity корекции до `2e1e3c95666805d75f8e3c99dd549ec664625af4`; production storage/login/RLS остава отделно OPEN. |
| Public results integrity | **PROTOTYPED / TARGETED BROWSER QA REPORTED** | Synthetic public records са премахнати; един canonical results owner показва matched approved records или честно empty state в `e423a2c3a8d2f70d28060fb4c37ce38bd5369d5e`. Общият Stage 2 acceptance остава pending. |
| Целият Stage 2 | **ACCEPTANCE PENDING** | Нужни са content-complete reality pass, пълен desktop/390px audit и owner visual acceptance. |

## 4. Home — последни решения

| Тема | Статус | Решение / граница |
| --- | --- | --- |
| Водещо действие | **APPROVED** | Търсенето остава първо. `Намери → Публикувай → Попитай, ако не намериш`. |
| `Публикувай` и `Попитай` | **PROTOTYPED — FINAL STAGE 2 ACCEPTANCE PENDING** | Две отделни ясно рамкирани, самостоятелно кликаеми повърхности под търсенето. `Публикувай` отваря съществуващите Add owners; `Попитай` отваря Question owner-а. Реализация: `84d57cb0024ae9b82534badb3e852bc2e12c60b7`. Точният copy може да се доизпипа само като presentation промяна. |
| Activity module | **PROTOTYPED — FINAL STAGE 2 ACCEPTANCE PENDING** | `Днес в Лом` при доказана активност → `Тази седмица` при липса на днешна → `Полезно сега` без числа. Максимум три кликаеми показателя; без нули, fake counts или fake activity. Календарът е по `Europe/Sofia`; невалидни, бъдещи, непублични и неодобрени записи не се броят. Реализация: `84d57cb0024ae9b82534badb3e852bc2e12c60b7`. |
| Activity priority | **APPROVED DIRECTION** | Реални обяви/услуги → публикации/статии → събития. Въпросите не се използват като изкуствен водещ показател. |
| Newsletter/сутрешен абонамент | **IDEA ONLY — NOT NOW** | Не се добавя като част от текущия Home pass. |

## 5. Content protection

| Тема | Статус | Решение / граница | Следващо действие |
| --- | --- | --- | --- |
| Основен принцип | **APPROVED** | Публичното съдържание не се представя като „некопируемо“. Целта е Попитай.Лом да е актуалният, проверим и доказуем първоизточник със структура, история и работещи действия. | Да управлява SEO, Info Lom и content lifecycle решенията. |
| Public UX защита | **APPROVED** | Без забрана на copy/right-click, текст като изображение, login стена само срещу копиране, масови водни знаци или тежки anti-bot скриптове. | Няма отделен Stage 2 anti-copy слой. |
| Provenance | **APPROVED DIRECTION / PARTIAL** | Canonical URL, timestamps, source, `Последно потвърдено`, version/history и audit trail за приложимото съдържание. | Exact production coverage се одитира отделно. |
| API и bulk-read защита | **PRODUCTION CHECKPOINT** | Inventory на public endpoints/fields; pagination; разумни page limits; ограничаване на bulk export/ID enumeration; rate limits според реалния трафик; никакви service-role/private keys във frontend. | Security/backend audit преди промяна. |
| Monitoring и реакция | **PRODUCTION CHECKPOINT** | Логове и alert-и за аномално масово четене, evidence collection и процедура за техническа/правна ескалация. Bot challenge само при доказан подозрителен модел. | Отделен monitoring/operations checkpoint. |
| Terms, copyright и legal | **OPEN — LEGAL REVIEW REQUIRED** | Нормалното споделяне на линк/кратък откъс се различава от системно scraping/републикуване. Точните Terms, notices и претенции не се приемат без юридически преглед. | Подготовка на draft, после юрист; не се твърди правна защита като готова. |

## 6. Идеи от стратегиите, които НЕ са одобрени автоматично като функции

Следните примери могат да се разглеждат само в отделен продуктов checkpoint. Документът или mock примерът не са разрешение за реализация:

- анкети и гласуване;
- препоръки с класации и броячи;
- коментари;
- `Следи тема` и известия;
- кандидатстване през вътрешна форма;
- Facebook campaign sequences от типа „ден 1 / ден 2 / резултат“;
- ежедневни/седмични activity числа, ако няма реални доказани данни;
- Web Share Target;
- Meta Page/API интеграция.

За всяка такава идея първо се решават owner, данни, moderation, auth, privacy, empty state и production dependency.

## 7. Текущ работен ред

1. Stage 2 остава отделен safety prototype; production и Stage 3 не се започват без изрично разрешение.
2. Обикновеният изпълняващ чат получава една ограничена exact-SHA задача.
3. Work чатът взема продуктови решения и прави независимия audit/acceptance.
4. Изпълняващият чат поправя сам доказани технически дефекти вътре в разрешения scope; при product/LOCKED конфликт спира.
5. Следваща задача не започва преди Work verdict за текущата.
6. Всеки handoff разделя: **доказано**, **source-tested**, **browser-tested**, **непроверено/open**.

### 7.1 Техническа готовност и съдържание

Основният ред е:

1. първо се довършват и приемат техническата архитектура, маршрутите, owners, формите, validation, moderation връзките и desktop/mobile поведението;
2. след това се довършва и въвежда пълното реално съдържание;
3. съдържание се въвежда по-рано само когато е необходимо, за да се проектира или тества честно конкретен екран, owner, route, empty state, freshness/source contract или content lifecycle;
4. ранното съдържание е проверено реално съдържание — не synthetic/mock запълване, представено като истинско;
5. този ред не разрешава production write или content import без съответния owner/Work checkpoint.

## 8. Задължително съдържание за довършване

Следните области не са предложения за избор. Те са **MANDATORY CONTENT INVENTORY**, което трябва да бъде проверено, структурирано и довършено преди окончателната content-complete готовност:

- настаняване/хотели;
- бензиностанции;
- сдружения и НПО;
- забележителности;
- планираните местни статии и практични ръководства.

Това не заключва предварително къде точно стои всяка област в IA и не позволява автоматично създаване на нова главна Home/Info Lom секция. За всяка област се определят:

`authoritative owner → публично място → route → fields → source → last verified → correction/update lifecycle`.

Данните, телефоните, цените, статистиката и статутът на обектите се проверяват непосредствено преди публикуване. Твърдение в предоставен работен файл не е достатъчно доказателство.

## 9. Отделен неприоритизиран регистър на кандидатите

Следните теми се пазят, за да не бъдат забравени, но **нямат определен приоритет и не са разрешение за код**:

| Кандидат | Текущ статус | Задължителна граница преди решение |
| --- | --- | --- |
| `Родени в Лом` | **OPEN — SEPARATE PRODUCT CHECKPOINT** | Identity/privacy, owner, moderation, cold start и място в IA. |
| `Носи ми–нося` | **IDEA ONLY / HIGH RISK** | Измами, плащане, забранени вещи, отговорност и спорове. |
| Помощ за близки от разстояние | **IDEA ONLY / SEPARATE CHECKPOINT** | Trust, проверка на изпълнители, безопасност и отговорност. |
| Таг за работа с отдалечени собственици | **IDEA ONLY** | Да използва съществуващ owner; без нов datastore и без скрито приоритетно подреждане. |
| Деветте села в community/marketplace | **OPEN — OWNER DECISION** | Реален обем съдържание, location model и избягване на празни категории. |
| Превод на критично Info съдържание | **FUTURE CHECKPOINT** | Първо стабилно българско съдържание и freshness process. |
| Сървърен езиков/abuse филтър | **IDEA ONLY / PRODUCTION REVIEW** | False positives, normalization, privacy, moderation и сигурност; не се публикува просто като client-side списък. |
| Структуриран сигнал за рисково поведение | **IDEA ONLY / MODERATION CHECKPOINT** | Не се изгражда свободна обвинителна форма; изисква legal/moderation review. |
| Admin diff при редакция | **FUTURE ADMIN CHECKPOINT** | Само след проверка на текущите protected Admin/Moderator owners. |
| Community trust levels | **IDEA ONLY — NOT FOR START** | Нови роли, anti-abuse и достатъчна реална общност. |
| Автоматично премахване след брой флагове | **REJECTED FOR CURRENT PRODUCT** | Висок риск от координирана злоупотреба в малък град. |
| Автоматично публикуване на „малки“ редакции | **REJECTED — LOCKED CONFLICT** | Не заобикаля текущия approval flow и запазването на последната одобрена версия. |
| По-видими спешни контакти | **CONTENT/UX CANDIDATE** | Само официално проверени контакти; без произволна нова седма Info карта. |
| Production backup/export plan | **PRODUCTION CHECKPOINT** | Отделен безопасен Supabase recovery review преди реални потребители. |

Приоритет на редовете в тази таблица ще се задава само при планиране от собственика и Work след техническия Stage 2 gate. Поредността им тук не означава важност.

## 10. Задължителни връзки към източниците

- продуктова истина и приоритет: `POPITAI_LOM_MASTER_CURRENT.md`;
- текущ напредък: `PROJECT_PROGRESS.md`;
- Facebook bridge technical/product contract: `PUBLIC_PRODUCT_V6_B7_FACEBOOK_BRIDGE_TECHNICAL_PRODUCT_CONTRACT.md`;
- входни стратегически документи от 07.09.2026: Facebook Hooks Strategy V2 и Content Protection Strategy;
- protected/LOCKED правила: приложимите `PROJECT_RULES*` документи.

Стратегическите документи са източници на идеи и аргументация. Само редовете, изрично класифицирани в този регистър и подкрепени от последното owner решение, управляват следващата работа.
