# Попитай.Лом — централен регистър на решенията и backlog-а

Статус: **КАНОНИЧЕН ИНДЕКС КЪМ CURRENT PRODUCT MASTER / НЕ Е РАЗРЕШЕНИЕ ЗА PRODUCTION ПРОМЕНИ**  
Създаден: **09.09.2026**  
База: `e423a2c3a8d2f70d28060fb4c37ce38bd5369d5e`
Проверена review база преди owner verdict sync: `24590df5d441e7ac3f9712f1eccfe84cfc8bcc4b` на `prototype/stage2-icon-system-approval`

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
- текущият чат е **Work 2 — 10–15.09.2026**.

| Work | Дата | Доказано решение / evidence |
| --- | --- | --- |
| Work 1 | 10.09.2026 | Подготвя пълната начална draft taxonomy/icon карта, конкретните icon proofs и локалния commit `39f442b00885b436339bafee833ecb552eda813d`. |
| Work 2 | 10.09.2026 | Проверява прекъснатото качване и публикува идентичното дърво като remote review commit `e60655186677722f1e319016c9602857e99aebef`; прави пълния icon audit и записва следващия owner contract. |
| Work 2 | 11.09.2026 | Owner приема consolidation доклада: 9 Services families и 45 visible discovery entries вместо 59 отделни видими leaves; старите точни понятия остават aliases/filters/cross-links, без промяна на owner/data/schema. |
| Work 2 | 13.09.2026 | Owner добавя `Пътнически превоз` като отделен четвърти вход в транспортната група за обяви на превозвачи, включително пътувания в чужбина; общо 46 visible entries, без промяна на owner/data/schema и без дублиране на проверената информация в Info Лом. |
| Work 2 | 13.09.2026 | Owner приема цялата visual група `Красота и лична грижа`: един family знак и точни leaf знаци за `Фризьор и бръснар`, `Маникюр и педикюр`, `Козметика и грим` и `Немедицински масаж`; техническата review интеграция не разрешава production wiring. |
| Work 2 | 13.09.2026 | Owner приема цялата visual група `Грижа за хора и животни`: точни leaf знаци за `Детегледачки`, `Грижа за възрастни`, `Помощ в дома`, `Гледане и разхождане на домашни любимци` и `Грижа и подстригване на домашни любимци`; техническата review интеграция не разрешава production wiring. |
| Work 2 | 14.09.2026 | Owner приема цялостния одит и новия строг ред: масовото производство на leaf икони спира като критичен път; приетите assets се пазят; следват migration matrix, отделен security verification gate, един хибриден icon comparison, content-complete Stage 2, финален audit/freeze, owner-by-owner Stage 3, контролиран domain/auth/SEO cutover и soft launch. База на решението: `6d7ce692a9fc01759df21e406bde386c7c3a3859`; няма разрешение за production, Supabase или Stage 3 промяна. |
| Work 2 | 15.09.2026 | Върху exact review base `6e4b75276c64b41ffdc534384064a2a3b60b7685` е изграден docs-only `POPITAI_LOM_PRODUCTION_MIGRATION_MATRIX.md`: 14 production checkpoints, 9/46 Services карта, route/form/owner/lifecycle inventory, Admin-only delete и `Иванов Ремонти` gate, domain/auth/SEO/OG dependencies и rollback/launch recovery. По-късно същия ден owner приема pack-а и отделно разрешава read-only live Supabase audit; резултатът е в следващия Work 2 ред. Няма production/Supabase write/Stage 3 permission. |
| Work 2 | 15.09.2026 | Owner-approved read-only live audit не потвърждава Moderator hard-delete path; emergency STOP не се задейства. Security Advisor hardening points и непотвърдената availability на предпочитания `popitai-lom.bg` са записани в `POPITAI_LOM_LIVE_SECURITY_AND_DOMAIN_AUDIT_20260915.md`. Няма Supabase write, покупка или DNS/Auth промяна. |
| Work 2 | 15.09.2026 | След discrepancy audit owner потвърждава: site/mobile използват само оптимизирани SVG; подробните одобрени 3D assets са само за social/Facebook 1200×630 без собствена одобрена снимка. Двусмисленото правило от 14.09 е заменено; `8faa2f757b3af88ed137a7b49a64be5cf36b326a` е REJECTED review evidence, не owner-approved checkpoint. Пропуснатите външни audit находки са върнати като OPEN, без implementation permission. |
| Work 2 | 15.09.2026 | Owner отхвърля и коригирания SVG checkpoint `cbe64de3096c4094ab1142cf7a811ec4907adea0` като общ и детски. Нито един показан site SVG не е приет. Icon работата се PAUSE-ва и не блокира Stage 2; следва content-complete/reality pass. Одобрените 3D теми се пазят само за бъдещи social карти. |
| Work 2 | 16.09.2026 | Content-reality audit доказва липсващи безопасни owner contracts; owner след това приема точния placement модел: accommodation е Firms-owned и се открива през вторичен `За гости в Лом`; fuel е само в Info Lom/Комунални; НПО е отделен тип `Организация`; landmarks не е directory, а `Лом за един ден` плюс точни Info записи само при полезни променливи факти. Старите препоръки са REPLACED. Няма UI, production или Supabase промяна. |
| Work 2 | 16.09.2026 | Owner уточнява content реда: `Лом за един ден` е FUTURE ARTICLE BACKLOG, не текуща задача; първо се събира по-широка местна база и се одитира съществуващото съдържание за заведения. Бъдещата article програма е поне 10 материала, с отделно одобрение на всеки. `Транспорт`, `Магазини`, `Здраве`, `Институции` и `Образование` не се изграждат повторно. Owner-confirmed като съществуващи са хотел `Москва`, парк хотел `Ривър`, хотел/ресторант `Дунав` и бензиностанция `Кристал В`; точните официални полета остават OPEN. Няма UI/code/Supabase промяна. |
| Work 2 | 16.09.2026 | Owner разрешава `content-inventory/` като единен pre-production control layer. Създадени са V1 schema, 7 начални evidence records и deterministic validator. Статусът е CONTROL CONTRACT / OWNER REVIEW PENDING; няма runtime adapter, production import, Supabase, Stage 3 или промяна на LOCKED safety HEAD. |

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
| Icon review scope | **PARTIALLY ACCEPTED — ICON WORK PAUSED** | Work 1 → Work 2 · 10–15.09.2026 | Review branch съдържа исторически 128 px site WebP и 512 px social WebP варианти. Visual approval на конкретните 3D теми се пази само за social употреба; историческите site WebP варианти не разрешават site wiring. Това не разрешава production, Supabase или Stage 3. | Няма следваща масова серия или нов icon checkpoint. Stage 2 продължава с content-complete/reality. |
| Strict site/social system | **APPROVED TECHNICAL BOUNDARY — SITE VISUAL SYSTEM STILL OPEN** | Work 2 · 15.09.2026 · owner verdict `ок` след дословното правило; corrected comparison `cbe64de…` subsequently rejected | Site/mobile/navigation/family/exact leaf могат да използват само оптимизирани SVG; deep leaves са text-first. Одобрените подробни 3D assets са само за social/Facebook 1200×630, когато няма одобрена собствена снимка. Няма 3D WebP/raster изключение в site категории, списъци, резултати или cards. Показаните SVG кандидати не са одобрени. | Icon работата остава PAUSED; професионалната site visual система е OPEN и не блокира content-complete/reality. |
| Rejected ambiguous comparison | **REJECTED / HISTORY** | Work 2 · 15.09.2026 · evidence `8faa2f757b3af88ed137a7b49a64be5cf36b326a` | Checkpoint-ът показва `roofing.webp` като 64/56 px site/mobile exact leaf. Това е технически добре ограничено, но продуктово избира недопустимо 3D site изключение и не може да бъде acceptance evidence. | Не се одобрява и не се използва за production; коригира се само след docs sync. |
| Corrected SVG comparison | **REJECTED / PAUSED** | Work 2 · 15.09.2026 · owner verdict `те не стават... детски... продължаваме`; evidence `cbe64de3096c4094ab1142cf7a811ec4907adea0` | Строгата техническа site/social граница е спазена, но показаните SVG знаци не достигат изискваната професионална и конкретна визуална тежест. Това не е site approval. | Без нови icon проби сега. Финалната site система остава OPEN; Stage 2 продължава с content-complete/reality. |
| Registry coverage model | **APPROVED DIRECTION — EXACT MAP ACCEPTANCE PENDING** | Work 2 · 10.09.2026 · owner: `направи го` след предложението да не се изработват механично 59 различни картинки | Всяко taxonomy понятие получава изрично решение `OWN ICON`, `SHARED ICON`, `TEXT ONLY` или `FAMILY FALLBACK`. Собствен leaf знак е нужен само когато family знакът би бил неточен; 59 Master leaves не означават 59 задължително различни assets. | Текущата карта се валидира по групи; exact споделянията и всеки собствен знак остават за owner acceptance. |
| Exact semantic choice | **APPROVED — NOT IMPLEMENTED** | Work 1 · 10.09.2026 · owner-confirmed | Собствен leaf знак е задължителен, когато общият family/category знак е неточен или подвеждащ. Един asset се споделя само при еднакъв визуален смисъл. Текстовият label остава видим. | Нерешен или двусмислен знак остава `OPEN`, без произволна комбинация. |
| Media/icon fallback | **APPROVED — NOT IMPLEMENTED** | Work 1 · 10.09.2026 · owner-confirmed | `одобрена реална медия → точна одобрена leaf тема → family/category → Lom fallback`. Изборът идва от контролирани record/taxonomy полета, не от AI гадаене по свободен текст. | Един registry управлява site fallback и social template избора. |
| Controlled performance exception | **APPROVED — NOT IMPLEMENTED / ICONS ONLY** | Work 2 · 10.09.2026 · owner-confirmed | За иконите се допуска умерено по-детайлен или малко по-голям SVG, когато допълнителното качество и разпознаваемост са доказани. Това не разрешава тежки raster assets, embedded изображения, ненужни ефекти или неоптимизирани файлове. | Оптимизация след visual acceptance; сравнение преди/след на desktop, 390 px, 20–24 px и social размер. |
| Small и large variants | **HISTORICAL FIRST-BATCH VERDICT / SITE USE REPLACED 15.09** | Work 2 · 10–15.09.2026 · evidence `e17df39…`, `bdc2c03…` | Първите 128/512 WebP варианти доказват приетия semantic/visual concept. По-късното owner решение отменя 128 px raster файла като site формат; 512 px 3D concept остава social review material. | Site вариантът се проектира като оптимизиран SVG само ако е нужен; social asset остава отделен. |
| Acceptance gate | **ACCEPTED** | Work 1 · 10.09.2026 · owner-confirmed | Нито една неодобрена икона не влиза в приетия комплект. Един двусмислен или визуално слаб знак спира приемането на съответната група. | Owner review по логични групи; после пълен desktop/mobile/accessibility/performance audit. |
| First 8 generated 3D semantic assets | **ACCEPTED AS SOCIAL THEMES / HISTORICAL SITE REVIEW ONLY** | Work 2 · 10–15.09.2026 · owner verdict `приемам`; evidence `e17df39be8cd81872101f89d94f4d917ebc85778`; site-use decision replaced 15.09 | Поотделно са приети тематичните 3D концепции: `Доставки`, `Товарен транспорт`, `Домашна помощ`, `Автомобилна диагностика`, `Борба с вредители`, `Почистване на дом`, `Монтажи и мебели`, `ВиК`. Те се пазят за social карти; историческите desktop/mobile показвания не са site approval. | Без следваща 3D серия сега. Нито един asset не се пренася в site/mobile; icon работата е PAUSED. |
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
| Icon последица | **APPROVED DIRECTION — UPDATED 15.09.2026** | Work 2 · 11–15.09.2026 | Не се правят механично 59 икони. Семействата имат силен SVG знак; deep leaves са text-first; отделен exact site знак е оптимизиран SVG и се добавя само при подвеждащ family fallback и owner approval. Одобрените 3D assets са social-only. |

## 4C. Work 2 system audit и нов ред — OWNER APPROVED · 14.09.2026

| Тема | Статус | Доказано / граница | Строго следващо действие |
| --- | --- | --- | --- |
| Масова icon работа | **PAUSED AS CRITICAL PATH** | Петдневната icon работа създава schedule риск, смесен визуален език и слаба четимост при малки размери. Приетите 3D concepts не се губят и остават social-only. Коригираният `cbe64de…` comparison също е отхвърлен. | Без нов icon checkpoint сега; content-complete/reality продължава, а професионалната site visual система остава OPEN. |
| Permanent delete | **LOCKED / LIVE CONFLICT NOT CONFIRMED** | Work 2 · 15.09.2026 read-only live audit: core RLS е включен; Admin delete/ALL policies използват `is_admin()`/точна Admin role; Moderator има read/update, но не е открит hard-delete policy, Storage или delete-capable RPC bypass. Repo SQL evidence е старо/конфликтно спрямо live. | Emergency STOP не се задейства. Преди launch остава UI/JS + guest/user/Moderator/Admin destructive-action QA. Няма Supabase write authorization. |
| Supabase security hardening | **OPEN — PRE-LAUNCH** | Live Security Advisor: 3 mutable search paths, `listing_monthly_quotas` с RLS без policy, executable `SECURITY DEFINER` least-privilege review и disabled leaked-password protection. Това не е доказан Admin-only delete дефект. | Отделен function-by-function/Auth contract и owner-approved patch; без механичен revoke или Auth промяна. Evidence: `POPITAI_LOM_LIVE_SECURITY_AND_DOMAIN_AUDIT_20260915.md`. |
| `popitai-lom.bg` | **PREFERRED / AVAILABILITY UNVERIFIED** | Условията и публикуваната цена са проверени; Register.BG/NIC availability не е надеждно достъпна от текущата среда. Няма покупка или DNS промяна. | Owner checkout verification и отделен purchase verdict: registrant type, protected/unprotected, registrar, term. |
| `Пътнически превоз` contract | **IMPLEMENTED IN REVIEW PROTOTYPE — TARGETED QA PASSED** | Entry има exact discovery → canonical mapping към `Транспорт, преместване и доставки`; Add запазва `discovery=Пътнически превоз`, а persistence adapter получава съществуващия canonical owner. Regression audit изисква mapping за всичките 46 видими Services входа. Desktop и 390 px targeted QA са преминати на `e092eb38c53efd8ca3ca0582a44a562ae34b764c`. Няма production/data migration промяна. | Включване във финалния общ Stage 2 audit. |
| Protected `Иванов Ремонти` | **LOCKED / PRODUCTION EXISTS / MIGRATION GATE MISSING** | Production има специалния relevance/priority behavior; prototype migration task list не го доказва като отделен gate. | Задължителен migration matrix ред и regression test преди/след всеки засегнат search/results integration. |
| Migration path | **CONTROL PACK ACCEPTED / SECURITY READ COMPLETED** | `POPITAI_LOM_PRODUCTION_MIGRATION_MATRIX.md` е приет като planning source; read-only live audit е записан отделно. Това не е production permission. | Icon checkpoint приключи без acceptance и е PAUSED. Текущият prototype ред е content-complete/reality → финален Stage 2 audit/freeze. Domain purchase и всички writes остават отделни owner actions. |
| TOM/guard process | **OPEN — CONTROL GAP / NOT CANONICAL** | Sandbox TOM control и `tom-red-zone-guard.yml` съществуват, но guard не е в intended base branch, не се задейства при direct review commits и не е част от текущия mandatory read order. Находката е записана, но не е затворена като изпълним gate. | Отделен owner verdict за процеса; ако се приеме, guard се поставя в реалния base path и се доказва с PR test преди да се разчита на него. |
| Domain и SEO | **PLANNED / PRODUCTION CUTOVER BLOCKED** | Repo няма пълен robots/sitemap/canonical/OG coverage. Изборът и резервирането на домейн могат да станат рано; DNS, canonical, redirects, auth и production metadata не се сменят сега. | Domain decision в control pack; технически cutover след готовите production owners, с old/new URL и auth regression. |
| Stage 2 | **ACCEPTANCE PENDING** | Public IA е одобрена; content reality, общият desktop/390 audit и owner visual acceptance остават незавършени. | Content-complete pass → финален audit → owner freeze на exact SHA. |
| Stage 3 | **BLOCKED** | Не се копира prototype наведнъж и не се започва преди Stage 2 freeze. | След freeze: един migration matrix ред / owner / risk scope наведнъж. |
| Launch | **FUTURE GATE** | Няма одобрение за domain/auth/SEO cutover или public launch. | Backup/recovery → role/auth/media/search/URL/OG/accessibility/performance QA → soft launch → owner verdict. |

## 4D. Възстановени външни audit находки — OPEN, без implementation permission

| Находка | Статус | Точно следващо действие |
| --- | --- | --- |
| Icon contrast/structure/collision | **OPEN — MEASURABLE QA GATE** | Преди приемане на който и да е site SVG комплект се автоматизират: contrast `≥3:1`, structure при 24 px `≥60`, collision distance в family `≥32/256`; шестте исторически low-contrast assets и трите близки двойки остават evidence, не site candidates. |
| Пенсионна статия | **OPEN — UNSYNCED CONTENT EVIDENCE** | `statia-pensionirane-lom.html` в `claude/remote-work-retirement-docs-3qlarq` се проверява за актуалност, content owner и текущ Master преди bounded merge proposal; не се слива автоматично. |
| `events/reports is_blocked` | **OPEN — PRE-LAUNCH SECURITY REVIEW** | Проверява се live и repo contract за blocked-user INSERT; евентуална промяна изисква отделен owner-approved backend patch. |
| Твърдо записан Admin UID | **OPEN — CONFIG/RECOVERY REVIEW** | Инвентаризират се допустимите аварийни зависимости и inline срещанията; не се местят механично без protected-owner regression и rollback. |
| Незабавна SEO хигиена | **OPEN — PRIORITY RECONCILIATION** | Отделно се решава дали недовършените public страници трябва да получат `noindex` преди общия domain/SEO cutover; robots/canonical/sitemap не се променят без exact route/status audit. |

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
4. Icon посоката е технически разграничена, но коригираният `cbe64de…` checkpoint е отхвърлен; няма одобрен site SVG и няма нов icon checkpoint сега. Подробните 3D assets остават social-only, а icon работата не блокира Stage 2.
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
- заведения за хранене — content reality/gap/duplicate audit върху съществуващия owner, без нова структура по предположение;
- сдружения и НПО;
- забележителности;
- планираните местни статии и практични ръководства — бъдеща програма от поне 10 материала, не текущо писане.

Това не заключва предварително къде точно стои всяка област в IA и не позволява автоматично създаване на нова главна Home/Info Lom секция. За всяка област се определят:

`authoritative owner → публично място → route → fields → source → last verified → correction/update lifecycle`.

Данните, телефоните, цените, статистиката и статутът на обектите се проверяват непосредствено преди публикуване. Твърдение в предоставен работен файл не е достатъчно доказателство.

Work 2 owner verdict от 16.09.2026 е **APPROVED — NOT IMPLEMENTED** и е описан подробно в `POPITAI_LOM_STAGE2_CONTENT_REALITY_AUDIT_20260916.md`.

`content-inventory/` е приет като контролна форма за този mandatory inventory, но точните V1 записи са **OWNER REVIEW PENDING**. Файловете не са публичен owner, не се зареждат от runtime и не разрешават import. Всеки следващ record се добавя само с canonical owner, field-level evidence, OPEN полета и отделен production gate.

| Област | Прието продуктово място | Какво остава OPEN преди реализация |
| --- | --- | --- |
| Настаняване | Firms owner, exact category `Настаняване`; discovery през `Info Lom → За гости в Лом → Къде да отседнеш` | source/`last_verified`/claim status contract, verified seed inventory и duplicate-safe claim lifecycle |
| Бензиностанции | `Info Lom → Комунални и ежедневни услуги → Бензиностанции`; без Firm duplicate | record inventory, freshness и correction mapping |
| Сдружения и НПО | отделен семантичен тип `Организация`, не фирма и не институция | exact owner/schema/form/moderation lifecycle като production checkpoint |
| Забележителности | без отделен directory; `Лом за един ден` + точни Info records само при полезни променливи факти | 5–7 visit-ready места, official sources и editorial/source inventory |

Това решение не разрешава code, protected route/form/schema промяна или import. Следва record-by-record source checklist, после bounded Stage 2 proposal и отделно implementation approval.

### 8.1 Owner-confirmed evidence и точни OPEN полета · Work 2 · 16.09.2026

| Обект | Потвърдено от owner | Не се твърди още |
| --- | --- | --- |
| Хотел `Москва` | реално съществува | direct NTR name/type/category/registration ID/current status |
| Парк хотел `Ривър` | реално съществува | direct NTR fields и разрешаване на адресния конфликт `Нечаев 1` / `Нечаев 6` |
| Хотел/ресторант `Дунав` | реално съществува; по-старият сигнал `затворен` не е final | дали accommodation услугата е активна, official contact и direct NTR fields |
| Бензиностанция `Кристал В` | реално съществува на ул. `Людовико Миланези` | точен адресен номер и direct identity mapping към `Кристал ойл`/конкретния от двата документирани обекта |

Owner-confirmed evidence е достатъчно да не се отхвърля съществуването. То не превръща непроверени адрес, категория, юридическо име, работно време или статус в официален факт.

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
- migration/production/security/domain/auth/SEO/OG/launch контрол: `POPITAI_LOM_PRODUCTION_MIGRATION_MATRIX.md`;
- Facebook bridge technical/product contract: `PUBLIC_PRODUCT_V6_B7_FACEBOOK_BRIDGE_TECHNICAL_PRODUCT_CONTRACT.md`;
- входни стратегически документи от 07.09.2026: Facebook Hooks Strategy V2 и Content Protection Strategy;
- protected/LOCKED правила: приложимите `PROJECT_RULES*` документи.

Стратегическите документи са източници на идеи и аргументация. Само редовете, изрично класифицирани в този регистър и подкрепени от последното owner решение, управляват следващата работа.
