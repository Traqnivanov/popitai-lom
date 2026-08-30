# Попитай.Лом — ТЕКУЩ CHECKPOINT

Този файл съдържа само актуалното състояние и оставащите задачи. Приключени, отменени и остарели задачи не се пазят тук, за да не подвеждат бъдеща работа.

## 1. ЗАДЪЛЖИТЕЛНИ ПРАВИЛА ПРЕДИ ПРОМЯНА

Преди всяка редакция се четат в този ред:
1. `PROJECT_RULES_00_READ_FIRST.md`
2. `PROJECT_RULES_PROTECTED_CORE.md`
3. `PROJECT_RULES_ADMIN_MODERATOR.md`
4. `PROJECT_RULES.md`
5. `PROJECT_RULES_RENDER_OWNERSHIP.md`
6. `PUBLIC_SITE_INFORMATION_ARCHITECTURE_APPROVED_SPEC.md`, когато се работи по публичния сайт
7. `ADMIN_PANEL_V2_APPROVED_SPEC.md`, когато се работи по Admin/Moderator панела
8. конкретните модулни правила, ако има такива.

При конфликт между документи не се избира правило по предположение — конфликтът се проверява и се отстранява преди промяна.

## 2. ЗАЩИТЕНО ЯДРО

LOCKED без отделно изрично одобрение:
- Фирми и фирмени профили;
- Обяви;
- „Майстори и ремонти“;
- основната администраторска логика и критичните admin actions;
- роли, права, ownership, approval/direct publish, лимити и статуси в защитените модули;
- специалният search priority за ремонти/строителство/майстори и Иванов Ремонти.

Одобрена промяна се изпълнява до качване. Ако по време на работа се появи дори косвен риск за защитената логика, спира се преди рисковата промяна и се докладва.

## 3. АКТУАЛНА АРХИТЕКТУРА

### Категории
Публичните 8 карти са:
1. Майстори и ремонти — LOCKED
2. Здраве и лекари
3. Автомобили
4. Магазини и покупки
5. Заведения
6. Услуги
7. Обяви — LOCKED
8. Събития

Публично се използват `Услуги` и `Събития`. Когато съществуваща логика/DB все още използва legacy стойности `Работа и услуги` / `Събития и град`, те се пазят само като вътрешни compatibility стойности и не се мигрират на сляпо.

### Фирми
В „Добави фирма“ публичният етикет е `Услуги`, но техническата стойност остава `Работа и услуги` за compatibility. Нелогичните фирмени категории `Обяви` и `Събития и град` не се предлагат при нов фирмен профил.

### Магазини
- Публичният каталог използва Supabase като активен източник. Мигрирани са 37 магазина, включително `tags` и `groups`; строителните подфилтри се пазят. Старият `shops-catalog-v2.js` е само rollback файл и не е активният публичен каталог.
- Формата „Добави магазин“ има отделен validation слой `shops-form-validation-v1.js` за задължителните полета: име, категория, адрес, какво предлага и източник.
- Валидацията е по поле: blur, live correction след грешка, `aria-invalid`, съобщение до полето и фокус към първата грешка при submit.
- Телефонът запазва отделната semantic validation в `shops-catalog-v3.js`.
- „Уточнение за източника“ остава незадължително; не е измисляно ново бизнес изискване.

### Събития
- Moderation flow в Admin за таблицата `events` остава непроменен.
- Публичната категория има отделен renderer `events-public-v1.js`, който показва само одобрени предстоящи събития и има loading/error/empty state.
- Публичният event renderer не променя Admin логика.

### Въпроси
- Общата страница `vaprosi.html` използва отделен Supabase renderer `questions-public-v1.js`; старият `localStorage` renderer в `script.js` не е собственик на публичния списък.
- „Майстори и ремонти“ → „Последни въпроси“ използва `category-hub-v1.js` и одобрени Supabase въпроси; `script.js` не рендерира този блок.
- Формата „Задай въпрос“ има category-specific placeholder/help текст за осемте категории, специфична field validation, собствена проверка на приемането на правилата и фокус към първата грешка.
- Детайлният въпрос води към правилната публична категория; `Здраве и лекари` води към `zdrave-i-lekari.html`, а public labels за `Услуги` / `Събития` не се бъркат с internal compatibility стойностите.
- Неактивният uploader за снимки е премахнат от публичната форма. Снимки към въпрос са бъдеща отделна функционалност и не се показва фалшив/неработещ UI.
- `script.js` не е редактиран при тези корекции; search priority и Иванов Ремонти са запазени.

### Институции
- Публичният root е `[data-info-institutions-root]` и има един собственик: `info-lom-institutions-owner-v1.js`.
- Съществуващите legacy/canonical/approved/final/enhancement слоеве рендерират само в скрит staging root `[data-institutions-staging]`; те не рисуват директно публичната секция.
- Публичният owner публикува финалния вече одобрен DOM наведнъж само след наличие на priority stack, финалните карти за Областна администрация и Спешна медицинска помощ и финалния `#institucii-other` enhancement marker.
- След публикуване staging root се премахва, а MutationObserver се изключва. Няма постоянен polling/observer върху публичната секция.
- Не са променяни съдържание, телефони, CTA, официални линкове, signal flow или Admin логика.

### Търсене
- `public-search-v1.js` е authoritative owner за общото публично търсене в `tarsene.html` и за homepage suggestions при актуално зареден Stage 2 search layer.
- Реалните remote източници са само approved фирми, approved въпроси и approved + active обяви с ограничени заявки и минимални публични полета. Няма profiles, телефони или Admin/moderation полета в search payload-а.
- Резултатите се групират по тип: Категории, Фирми, Обяви, Въпроси, Статии и Проверена информация. Authoritative owner няма `localStorage` fallback.
- Има debounce/cancel, loading/error/empty states и zero-results действия `Разгледай категориите`, `+ Добави` с избор фирма/обява и отделно `Задай въпрос`.
- Защитената логика в `script.js` за ремонтни/строителни търсения и Иванов Ремонти остава отделна и непроменена. Stage 2 използва съществуващия `rankSearchRecords()` detector; не дублира construction stems.
- Production regression: `шпакловка` → точно един „Иванов Ремонти Лом“; `автомивка` → автомобилни резултати без Иванов priority; `работа` → без false-positive Иванов; реална approved обява и Verified Info резултат се намират; no-results state е проверен.

### Статии
В списъка остава само реално наличната статия. Не се създават заглавия, карти или съдържание без реален одобрен източник.

## 4. АКТУАЛНИ ЛИМИТИ ЗА ОБЯВИ

Каноничното правило е:
- до 5 нови лични обяви на обикновен потребител за календарен месец;
- до 5 нови фирмени обяви на одобрена фирма за календарен месец;
- личната и фирмената квота са отделни;
- редакция на съществуваща обява не използва нова квота;
- подадена нова обява използва квота дори ако по-късно бъде отхвърлена или изтрита;
- неизползваната квота не се прехвърля;
- администраторските профили нямат тези лимити.

Ако бъде открит документ с по-старо правило за `1` фирмена обява месечно, той е остарял и не трябва да се използва.

## 5. РЕЗУЛТАТ ОТ TECHNICAL / UX AUDIT

Изчистени са:

1. **Събития — публичен event flow** — отделен публичен renderer за одобрени предстоящи `events`.
2. **Банки и банкомати — TEMP multi-render** — публичното банково съдържание използва отделен root `[data-info-banks-root]` и един renderer `info-lom-banks-v7.js`.
3. **Образование и култура — signal routing** — сигналът използва каноничната категория `obrazovanie`.
4. **Въпроси — category routing/UX** — правилни category links, category-specific насоки, checkbox validation и Supabase публични списъци.
5. **„Майстори и ремонти“ — въпроси** — публичният блок използва Supabase без промяна на search priority, Иванов Ремонти, фирми, обяви, роли, лимити или Admin.
6. **Магазини — field-specific validation** — задължителните полета следват глобалните правила за форми, а телефонът запазва semantic validation.
7. **Институции — публичен render ownership** — публичната секция има един owner; старите слоеве работят само в скрит staging root и готовият финален DOM се публикува еднократно без промяна на одобрения UX/съдържание.

Към този checkpoint няма друг известен доказан source-code блокер от текущия technical/UX audit преди production browser/device QA.

## 6. ЗАДЪЛЖИТЕЛЕН СРАВНИТЕЛЕН КОНТРОЛ ЗА ПРОПУСКИ

При функционален/UX одит не се гледа само дали всеки раздел работи самостоятелно. Прави се и сравнителен контрол между сходни раздели, категории, инфо блокове и потоци.

Проверява се дали един раздел има полезен елемент, действие или защита, която липсва в друг сходен раздел, например:
- специфичен CTA или бутон;
- въпрос или въпросен поток;
- форма или конкретно поле;
- frontend/backend validation;
- сигнал / корекция / добавяне;
- празно състояние и следващо действие;
- loading/error state;
- mobile/ARIA поведение;
- moderation/admin routing;
- действие, което е специфично за реалната задача на потребителя.

Разликата **не означава автоматично дефект** и не означава, че всички раздели трябва да бъдат еднакви. За всяка разлика се решава отделно:
- правилна специфична разлика;
- неприложимо за този раздел;
- реален пропуск, който трябва да се поправи.

Забранено е механично уеднаквяване на различни категории само защото една има повече бутони, полета или действия от друга. Целта е да се намират истински пропуски спрямо потребителската задача и правилата на проекта.

## 7. ADMIN / MODERATOR PANEL V2 — PASS

Одобреният UX модел е записан в `ADMIN_PANEL_V2_APPROVED_SPEC.md`, а implementation handoff — в `ADMIN_PANEL_V2_HANDOFF_2026-08-24.md`.

Статус: **ЗАВЪРШЕН / REAL INTERACTION QA PASS**.

Реално са проверени и са PASS:
- Admin desktop;
- Moderator desktop;
- Admin mobile;
- Moderator mobile;
- menu groups, collapse/expand, refresh restore и long-scroll/sticky behavior;
- Dashboard direct links, mobile drawer и bottom navigation;
- секциите Info Lom / Shops / Events / Reports / Businesses / Listings / User edits / Expanded profiles / Users;
- липса на blank render и role-correct UI;
- Moderator self-moderation protection;
- Admin-only permanent delete;
- Admin-only role и expanded-access management;
- backend enforcement на същите граници.

Последната backend корекция е PR #68, merge commit `0ef403878d9d0511d09dc12721e41e47d5459d58`. Директните Moderator status updates за Info Lom са ограничени до разрешените review състояния; approved/resolved остават през защитените RPC потоци.

Admin/Moderator Panel v2 не се започва отново без конкретен нов доказан проблем.

## 8. PUBLIC IA/UX — APPROVED / СЛЕДВАЩА РАБОТА

Каноничната публична структура е одобрена и записана в `PUBLIC_SITE_INFORMATION_ARCHITECTURE_APPROVED_SPEC.md`. Не се правят отделни импровизирани UX решения извън нея.

Текущият ред и статус е:

1. **Етап 1 — ЗАВЪРШЕН / PRODUCTION** — каноничен речник за category/label/routing/form mappings; зависим structured subcategory select за `Обяви → Услуги`; безопасно legacy edit поведение. Одобреният narrow backend integrity amendment добавя taxonomy validation без промяна на RLS, роли, ownership, quotas, media или moderation.
2. **Етап 2 — ЗАВЪРШЕН / PRODUCTION QA PASS** — authoritative Supabase-backed public search за approved фирми, въпроси и active approved обяви; grouped results; без legacy `localStorage` ownership; loading/error/empty; запазен защитен приоритет за ремонти/строителство/майстори и „Иванов Ремонти“. Production corpus и cache/load-order корекциите са проверени.
3. **СЛЕДВАЩ: Етап 3 — Обяви в тематичните категории** — read-only approved listings layer; един запис се показва в общия каталог и релевантната тема; без промяна на ownership, status, quota, approval или moderation. Преди код се прави read-only mapping/ownership audit на всяка засегната тематична страница.
4. **Етап 4 — Общи layout фрагменти и навигация** — параметризиран static source/build-sync за public header/footer/mobile nav; Admin остава извън generator; „+ Добави“, новата mobile навигация и видим вход към „Въпроси и препоръки“; запазени page-specific CTA targets.
5. **Етап 5 — QA и production** — desktop/mobile, anonymous/authenticated, форми, търсене, focus/modals, loading/empty/error, console/runtime/cache/load order и regression на цялото защитено ядро.

Всеки етап се изпълнява в отделен branch/PR, проверява се преди merge и се проверява отново в production. Безопасното и вече одобрено продължава без междинно „ОК“. Спира се само при ново LOCKED решение, доказан риск или user-only действие.

## 9. PUBLIC PRODUCTION QA — ТЕКУЩ СТАТУС

На 25.08.2026 е извършен реален desktop production QA на публичния сайт и signed-out състоянията.

Проверено:
- основните публични страници, category hubs, Info Lom разделите, магазини, събития, търсене и graceful not-found състояния;
- вътрешните `href/src` референции във всички 43 HTML файла — няма доказан счупен вътрешен адрес;
- публичните въпроси: loading → empty state, филтри и търсене;
- формите за въпрос, фирма, обява, вход, регистрация, сигнал и забравена парола — labels/ARIA, status региони и submit controls;
- signed-out profile state — няма password form/heading и очакваната липса на сесия не се показва като грешка;
- Info Lom signal modal — правилно signed-out съдържание, focus към close button и връщане към trigger;
- „Институции“ — еднократен public render owner, 22 priority карти и работеща anchor навигация;
- shop tabs и refresh restore;
- homepage articles — остава само реалната статия;
- deployment/cache re-check на приложените корекции.
- authenticated user login/logout/login-state QA с реална сесия — вход, профил, празни състояния, password section, достъп до формите и изход са PASS.

Поправени доказани публични проблеми:
- PR #69 — Institutions render timeout;
- PR #70 — placeholder article cards и modal focus tracking;
- PR #71 — signed-out profile state;
- PR #72 — question not-found heading;
- PR #73 — password section visibility;
- PR #74 — точният Info Lom modal focus target;
- PR #75 — премахнати три остарели еднократни Actions workflows, включително legacy workflow с риск за защитената moderation логика.
- PR #77 — role-correct submit labels: обикновен потребител вижда „Изпрати за преглед“, а Admin запазва direct-publish текста;
- PR #78 — премахнато двойното зареждане на `supabase-content.js` във формата за нов въпрос.
- PR #80 — публичните одобрени обяви отново се зареждат за anonymous посетители. Премахната е само дублиращата legacy Admin SELECT policy, която четеше директно `profiles` и връщаше `401`; Admin достъпът остава през защитения `is_admin()` policy, без промяна на роли, ownership, статуси, лимити или moderation flow.

Не са създавани fake QA записи и не са изпращани публични форми.

На 29.08.2026 е прегледан реален public mobile device запис. Проверени са homepage, mobile menu и bottom navigation, категории/търсене, фирми, основни Info Lom раздели, обяви, вход/регистрация и category hub. Няма доказан blank render или критично mobile layout разместване. Записът откри production грешката при „Обяви“, потвърдена чрез mobile API/Postgres logs и поправена с PR #80.

Остава:
- кратък mobile production re-check на „Обяви“ след PR #80;
- целеви mobile interaction QA на непоказаните в записа въпроси, статии, detail/modal states;
- финален console/runtime контрол за тези оставащи mobile потоци.

Тези оставащи проверки не са маркирани като PASS предварително. При открит проблем се поправя само доказаният дефект; LOCKED логика не се променя без отделно решение.

## 10. РАБОТЕН РЕЖИМ

- Безопасно и вече решено → изпълнява се без междинно „ОК“.
- Независима следваща задача → продължава се без излишно спиране.
- Защитено, рисково или ново бизнес решение → спира се преди промяната и се иска решение.
- След одобрена промяна се докладва след качване, освен ако възникне реален риск или проблем.
