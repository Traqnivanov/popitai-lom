# Попитай.Лом — централен регистър на решенията и backlog-а

Статус: **КАНОНИЧЕН ИНДЕКС КЪМ CURRENT PRODUCT MASTER / НЕ Е РАЗРЕШЕНИЕ ЗА PRODUCTION ПРОМЕНИ**  
Създаден: **09.09.2026**  
База: `e423a2c3a8d2f70d28060fb4c37ce38bd5369d5e`
Текущ Work 2 decision base: `6d7ce692a9fc01759df21e406bde386c7c3a3859` на `prototype/stage2-icon-system-approval`

## 1. Как се използва регистърът

Този файл не заменя `POPITAI_LOM_MASTER_CURRENT.md` и защитените технически договори. Той пази на едно място решенията, текущата им реализация и следващия разрешен checkpoint.

При конфликт важи:

1. последното изрично решение на собственика по конкретната тема;
2. приложимият текущ MASTER и protected/LOCKED contract;
3. провереното реално production състояние;
4. по-старите handoff-и, стратегии и предложения.

Кодът доказва какво е реализирано, но не превръща автоматично предложение в одобрено продуктово решение.

### 1.1 Work provenance — задължително

- всеки Work чат има постоянен пореден номер;
- всяко ново решение или промяна на статус записва `Work номер + дата + owner verdict + evidence/SHA`, когато има такова;
- решение без доказан Work източник не се приписва по памет; отбелязва се като legacy/неуточнен произход до проверка;
- по-нов Work може да замени старо решение само при изрично owner решение; старият запис остава история с `REPLACED`, а не се изтрива;
- текущият чат е **Work 2 — 10–14.09.2026**.

| Work | Дата | Доказано решение / evidence |
| --- | --- | --- |
| Work 1 | 10.09.2026 | Подготвя пълната начална draft taxonomy/icon карта, конкретните icon proofs и локалния commit `39f442b00885b436339bafee833ecb552eda813d`. |
| Work 2 | 10.09.2026 | Проверява прекъснатото качване и публикува идентичното дърво като remote review commit `e60655186677722f1e319016c9602857e99aebef`; прави пълния icon audit и записва следващия owner contract. |
| Work 2 | 11.09.2026 | Owner приема consolidation доклада: 9 Services families и 45 visible discovery entries вместо 59 отделни видими leaves; старите точни понятия остават aliases/filters/cross-links, без промяна на owner/data/schema. |
| Work 2 | 13.09.2026 | Owner добавя `Пътнически превоз` като отделен четвърти вход в транспортната група за обяви на превозвачи, включително пътувания в чужбина; общо 46 visible entries, без промяна на owner/data/schema и без дублиране на проверената информация в Info Лом. |
| Work 2 | 13.09.2026 | Owner приема цялата visual група `Красота и лична грижа`: един family знак и точни leaf знаци за `Фризьор и бръснар`, `Маникюр и педикюр`, `Козметика и грим` и `Немедицински масаж`; техническата review интеграция не разрешава production wiring. |
| Work 2 | 13.09.2026 | Owner приема цялата visual група `Грижа за хора и животни`: точни leaf знаци за `Детегледачки`, `Грижа за възрастни`, `Помощ в дома`, `Гледане и разхождане на домашни любимци` и `Грижа и подстригване на домашни любимци`; техническата review интеграция не разрешава production wiring. |
| Work 2 | 14.09.2026 | Owner приема цялостния одит и новия строг ред: масовото производство на leaf икони спира като критичен път; приетите assets се пазят; следват migration matrix, отделен security verification gate, един хибриден icon comparison, content-complete Stage 2, финален audit/freeze, owner-by-owner Stage 3, контролиран domain/auth/SEO cutover и soft launch. База на решението: `6d7ce692a9fc01759df21e406bde386c7c3a3859`; няма разрешение за production, Supabase или Stage 3 промяна. |

## 2. Допустими статуси

- **APPROVED — NOT IMPLEMENTED** — одобрено продуктово решение, което още не е реализирано;
- **PROTOTYPED — ACCEPTANCE PENDING** — показано е в Stage 2, но не е production и не е финално прието;
- **ACCEPTED** — независимо проверено и прието в посочената граница;
- **OPEN — OWNER DECISION** — необходимо е продуктово решение преди код;
- **PRODUCTION CHECKPOINT** — изисква отделно разрешение за production/backend/schema/RLS;
- **PAUSED AS CRITICAL PATH** — запазва приетото evidence, но забранява продължаване на същата серия преди посочения нов gate;
- **VERIFIED IN REPO / LIVE UNVERIFIED** — доказано е какво позволява versioned кодът, но не се твърди, че реалната база/production конфигурация съвпада без отделна read-only проверка;
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

## 4A. Icon system — owner contract

| Тема | Статус | Work / дата / verdict | Решение / граница | Следващо действие |
| --- | --- | --- | --- | --- |
| Icon review scope | **PARTIALLY ACCEPTED — MASS EXPANSION PAUSED** | Work 1 → Work 2 · 10–14.09.2026 · current review base `6d7ce692a9fc01759df21e406bde386c7c3a3859` | Review branch съдържа 34 site WebP assets на 128×128 и 32 social WebP assets на 512×512; approval е само по конкретните групи и verdict редове по-долу, не site-wide. Това не разрешава production, Supabase или Stage 3 wiring. | Няма следваща масова серия. Прави се само един хибриден comparison checkpoint по приетия Work 2 ред. |
| Hybrid site/social system | **APPROVED DIRECTION — COMPARISON PENDING** | Work 2 · 14.09.2026 · owner verdict `Ок приемам` | 16–24 px navigation/action използва лека единна SVG система; Services families имат силен общ знак; deep leaves са text-first; exact leaf asset се използва само ако family fallback подвежда и е четим в реалния site размер; подробните 3D assets са основно за social 1200×630 и големи тематични карти. Приетите assets се пазят. | Един desktop + 390 px + 16–24 px + 56–64 px + social 1200×630 сравним макет; след него owner verdict. |
| Registry coverage model | **APPROVED DIRECTION — EXACT MAP ACCEPTANCE PENDING** | Work 2 · 10.09.2026 · owner: `направи го` след предложението да не се изработват механично 59 различни картинки | Всяко taxonomy понятие получава изрично решение `OWN ICON`, `SHARED ICON`, `TEXT ONLY` или `FAMILY FALLBACK`. Собствен leaf знак е нужен само когато family знакът би бил неточен; 59 Master leaves не означават 59 задължително различни assets. | Текущата карта се валидира по групи; exact споделянията и всеки собствен знак остават за owner acceptance. |
| Exact semantic choice | **APPROVED — NOT IMPLEMENTED** | Work 1 · 10.09.2026 · owner-confirmed | Собствен leaf знак е задължителен, когато общият family/category знак е неточен или подвеждащ. Един asset се споделя само при еднакъв визуален смисъл. Текстовият label остава видим. | Нерешен или двусмислен знак остава `OPEN`, без произволна комбинация. |
| Media/icon fallback | **APPROVED — NOT IMPLEMENTED** | Work 1 · 10.09.2026 · owner-confirmed | `одобрена реална медия → точна одобрена leaf тема → family/category → Lom fallback`. Изборът идва от контролирани record/taxonomy полета, не от AI гадаене по свободен текст. | Един registry управлява site fallback и social template избора. |
| Controlled performance exception | **APPROVED — NOT IMPLEMENTED / ICONS ONLY** | Work 2 · 10.09.2026 · owner-confirmed | За иконите се допуска умерено по-детайлен или малко по-голям SVG, когато допълнителното качество и разпознаваемост са доказани. Това не разрешава тежки raster assets, embedded изображения, ненужни ефекти или неоптимизирани файлове. | Оптимизация след visual acceptance; сравнение преди/след на desktop, 390 px, 20–24 px и social размер. |
| Small и large variants | **ACCEPTED FOR FIRST 14 REVIEW ASSETS / PRODUCTION FORMAT OPEN** | Work 2 · 10.09.2026 · owner verdicts по групи; evidence `e17df39be8cd81872101f89d94f4d917ebc85778` и `bdc2c037b7114394400b97b956609e3e445226bc` | Owner прие модела с отделен оптимизиран 128 px site файл и 512 px social файл от един и същ source concept за първите 14 assets. Това не са различни визуални езици, не е финален production формат и не разрешава raster wiring в сайта. | Исторически first-batch verdict. Нови серии не наследяват този ред; текущият следващ gate е единствено хибридното сравнение от 14.09.2026. |
| Acceptance gate | **ACCEPTED** | Work 1 · 10.09.2026 · owner-confirmed | Нито една неодобрена икона не влиза в приетия комплект. Един двусмислен или визуално слаб знак спира приемането на съответната група. | Owner review по логични групи; после пълен desktop/mobile/accessibility/performance audit. |
| First 8 generated 3D semantic assets | **ACCEPTED IN ICON REVIEW SCOPE** | Work 2 · 10.09.2026 · owner verdict `приемам`; evidence `e17df39be8cd81872101f89d94f4d917ebc85778` | Поотделно са приети: `Доставки`, `Товарен транспорт`, `Домашна помощ`, `Автомобилна диагностика`, `Борба с вредители`, `Почистване на дом`, `Монтажи и мебели`, `ВиК`, включително показаните desktop, 390 px, 24/48/64 px и social варианти. Това заключва референтната visual direction за следващите групи, но не приема целия icon комплект. | Следващата група се прави по същия visual/semantic gate; нито един нов знак не наследява автоматично approval. |
| Home cleaning replacement | **ACCEPTED IN ICON REVIEW SCOPE** | Work 2 · 10.09.2026 · owner verdict `ok така`; evidence `bdc2c037b7114394400b97b956609e3e445226bc` | `Почистване на дом` вече е кофа + моп + един препарат + микрофибърна кърпа. Приетата по-рано прахосмукачка е заменена, защото е твърде тясна; голямата професионална количка остава семантично подходяща за `Офиси и входове`, не за дома. | Прието в текущия review scope; production wiring остава blocked. |
| Second group — repair essentials | **ACCEPTED IN ICON REVIEW SCOPE** | Work 2 · 10.09.2026 · owner verdicts `да ок са` и `това ми се струва много по-подходящо`; evidence `bdc2c037b7114394400b97b956609e3e445226bc` | Приети са `Бани и плочки`, `Електро` и коригираният `Покриви`: мистрията е отхвърлена като неточна и заменена с отделна червена керемида. Desktop/390 px/24–64 px/social QA е преминат. | Следващата група не наследява автоматично approval. |
| Third group — home systems | **ACCEPTED IN ICON REVIEW SCOPE** | Work 2 · 10.09.2026 · owner verdict `приемам`; evidence `bdc2c037b7114394400b97b956609e3e445226bc` | Приети са `Шпакловка / гипсокартон / боядисване`, `Дограма и врати`, `Отопление и климатици`. Комбинираните знаци покриват целия Master leaf; desktop/390 px/24–64 px/social QA е преминат. | Следващата група не наследява автоматично approval. |
| Transport group | **ACCEPTED IN ICON REVIEW SCOPE** | Work 2 · 13.09.2026 · owner verdicts за товарен транспорт, хамали, доставки и коригирания пътнически превоз; evidence `30e722ad5ab9de755acadf34974cf0ddc9eea3fc` | Четирите отделни смисъла използват точни assets: товарен автомобил, хамали с мебели, доставка и пътнически бус с хора и багаж. Site и social вариантите следват един source concept; desktop/390 px browser QA е преминат. | Следващата група не наследява автоматично approval. |
| Beauty and personal care group | **ACCEPTED IN ICON REVIEW SCOPE** | Work 2 · 13.09.2026 · owner приема общия family знак и четирите exact leaf знака; evidence `0d71a88d25cba3305715dbe63ae46295fd2fbe56` | Family знакът е комбиниран beauty комплект. Exact знаците са отделни за `Фризьор и бръснар`, `Маникюр и педикюр`, `Козметика и грим` и `Немедицински масаж`; site и social вариантите идват от един и същ source concept; desktop/390 px browser QA е преминат. | Следващата група не наследява автоматично approval. |
| Care for people and animals group | **ACCEPTED IN ICON REVIEW SCOPE** | Work 2 · 13.09.2026 · owner verdict `одобрявам`; evidence `44f72b6edd540b87d8ab778f10806d3ac5d7a8f8` | Exact знаците са отделни за `Детегледачки`, `Грижа за възрастни`, `Помощ в дома`, `Гледане и разхождане на домашни любимци` и `Грижа и подстригване на домашни любимци`; site и social вариантите идват от един и същ source concept; source regression е преминат. | Live desktop/390 px review се потвърждава на exact remote review SHA; production wiring остава blocked. |
| Production wiring | **PRODUCTION CHECKPOINT** | Current Master + Work 1/2 · owner boundary | Няма mass replacement, schema/storage промяна или реално social-image generation преди финален icon inventory, Stage 2 acceptance и отделно owner разрешение. | Няма production работа сега. |

## 4B. Services discovery consolidation — owner verdict

| Тема | Статус | Work / дата / verdict | Решение / граница |
| --- | --- | --- | --- |
| Девет Services families | **APPROVED** | Work 2 · 11.09.2026 · owner: `Ок, приемам` | Деветте семейства остават. По-нататъшното им сливане би смесило различни потребителски задачи. |
| Видими discovery entries | **APPROVED — REVIEW PROTOTYPE UPDATE IN PROGRESS** | Work 2 · 11.09.2026: 45 входа; Work 2 · 13.09.2026: owner добавя `Пътнически превоз` | Текущо са 46 видими входа. Точната карта е в Master §5.1.2. Допълнението е само discovery/alias слой, без data migration или нов owner. |
| Exact intent preservation | **LOCKED WITH CONSOLIDATION** | Work 2 · 11.09.2026 | Старите имена не се губят: остават контролирани aliases, filters и cross-links. Един record продължава да има един lifecycle owner. |
| `Други професионални услуги` | **APPROVED AS FALLBACK** | Work 2 · 11.09.2026 | Не е отделна visible card. Остава достъпно през form/search fallback. |
| Data/backend граница | **NO CHANGE / PRODUCTION BLOCKED** | Current Master + Work 2 | Решението не разрешава data migration, Supabase/schema/RLS, owner/form, production route или Stage 3 промяна. |
| Icon последица | **APPROVED DIRECTION — UPDATED 14.09.2026** | Work 2 · 11–14.09.2026 | Не се правят механично 59 икони. Семействата имат силен знак; deep leaves са text-first; exact asset се добавя само когато family fallback би бил подвеждащ и след owner approval. Всички assets, изрично приети в verdict редовете по-горе, остават валидни за съответните exact/filter contexts. Exact-choice екранът не показва измислен общ знак: подвеждащият inherited wrench е премахнат в `38ef8fb…`. |

## 4C. Work 2 system audit и нов ред — OWNER APPROVED · 14.09.2026

| Тема | Статус | Доказано / граница | Строго следващо действие |
| --- | --- | --- | --- |
| Масова icon работа | **PAUSED AS CRITICAL PATH** | Петдневната icon работа създава schedule риск, смесен визуален език и слаба четимост при малки размери. Приетите assets не се губят. | Само хибридният comparison gate от §4A; без нова масова серия. |
| Permanent delete | **LOCKED RISK CONFIRMED IN REPO / LIVE UNVERIFIED** | Repo SQL дава `authenticated` DELETE grants, а permissive `FOR ALL` staff policies използват общ `is_staff()` за Admin и Moderator. Това е несъвместимо с Admin-only LOCKED правилото, ако live базата съвпада с repo. Frontend скриване или допълнителна permissive Admin policy сами по себе си не са достатъчна поправка. | Само след отделно owner разрешение: read-only live grants/RLS/RPC/role audit. При потвърждение — тесен emergency security plan с backup, rollback и четириролев QA; без промяна преди approval. |
| `Пътнически превоз` contract | **PROTOTYPE GAP CONFIRMED** | Entry съществува във visual/service views и audit, но липсва в `prototype-stage2-contracts.js` mapping. Не е production дефект и не разрешава data migration. | Bounded Stage 2 mapping remediation след control pack; source + desktop/390 regression. |
| Protected `Иванов Ремонти` | **LOCKED / PRODUCTION EXISTS / MIGRATION GATE MISSING** | Production има специалния relevance/priority behavior; prototype migration task list не го доказва като отделен gate. | Задължителен migration matrix ред и regression test преди/след всеки засегнат search/results integration. |
| Migration path | **APPROVED REQUIREMENT — NOT YET BUILT** | Master има 14 production checkpoints, но няма една ordered owner/timing/test/rollback matrix. | Един изпълним matrix по Master §12.2 преди Stage 3. |
| TOM/guard process | **OPEN — NOT CANONICAL** | Sandbox TOM control и guard съществуват, но guard не е в intended base branch и не е автоматично активен. Sandbox документът не е част от текущия mandatory read order. | Отделен owner verdict дали процесът се приема; ако да, guard се поставя в реалния base path с тест. Не се приема мълчаливо. |
| Domain и SEO | **PLANNED / PRODUCTION CUTOVER BLOCKED** | Repo няма пълен robots/sitemap/canonical/OG coverage. Изборът и резервирането на домейн могат да станат рано; DNS, canonical, redirects, auth и production metadata не се сменят сега. | Domain decision в control pack; технически cutover след готовите production owners, с old/new URL и auth regression. |
| Stage 2 | **ACCEPTANCE PENDING** | Public IA е одобрена; content reality, общият desktop/390 audit и owner visual acceptance остават незавършени. | Content-complete pass → финален audit → owner freeze на exact SHA. |
| Stage 3 | **BLOCKED** | Не се копира prototype наведнъж и не се започва преди Stage 2 freeze. | След freeze: един migration matrix ред / owner / risk scope наведнъж. |
| Launch | **FUTURE GATE** | Няма одобрение за domain/auth/SEO cutover или public launch. | Backup/recovery → role/auth/media/search/URL/OG/accessibility/performance QA → soft launch → owner verdict. |

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

## 7. Текущ работен ред — заменен с owner verdict от 14.09.2026

1. Stage 2 остава отделен prototype; production, Supabase writes и Stage 3 не се започват без отделно изрично разрешение.
2. Първо се завършва pre-implementation control pack: migration matrix, security evidence boundary, protected priority gate, domain decision и точните dependencies.
3. Read-only live Supabase security audit се прави само след отделно owner разрешение; потвърден LOCKED security дефект спира останалата работа и минава през тесен emergency checkpoint.
4. Icon посоката получава един хибриден comparison checkpoint; масовото leaf производство е спряно и не блокира Stage 2.
5. Следват content-complete/reality pass, финален независим desktop/390 audit и owner freeze на exact Stage 2 SHA.
6. Stage 3 се изпълнява owner-by-owner и matrix-row-by-matrix-row, с exact tests и rollback; не се копира prototype wholesale.
7. Domain/auth/SEO/OG cutover се прави контролирано след готовите production owners; след него има пълен launch gate и soft launch.
8. Обикновеният изпълняващ чат получава една ограничена exact-SHA задача. Work взема продуктовите решения, проверява diff/evidence и дава verdict.
9. Следваща задача не започва преди Work verdict за текущата. Всеки handoff разделя: **доказано**, **source-tested**, **browser-tested**, **непроверено/open**, **rollback**.

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
