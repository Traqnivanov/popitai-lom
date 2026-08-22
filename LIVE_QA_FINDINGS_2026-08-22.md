# Попитай.Лом — LIVE QA FINDINGS — 22.08.2026

КАНОНИЧЕН активен QA списък. Нищо открито не остава само в чата. След QA поправките се работят от този файл.

## РЕЖИМ БЕЗ ЗАГУБА
- Влизат всички assistant-only и joint tests.
- И най-дребният проблем/разлика се пази.
- `VERIFY` = още не е доказан дефект.
- `OPEN` = потвърден дефект.
- `OPEN / LOCKED` / `BLOCKED / LOCKED` = защитен модул; без промяна без одобрение.
- `IDEA / LOCKED` = само идея.
- `FIXED - NEEDS RETEST` = поправено, чака production retest.
- `CLOSED` = само след успешен production retest.
- PASS не означава „страницата се отвори“; важат функции, линкове, състояния, роли и приложимите интеракции.
- Нещо, което browser connector не може да натисне/попълни, остава `MANUAL / PENDING`, не PASS.
- След всяка реално завършена задача статусът се актуализира веднага; не се чака пакет от няколко задачи. На всеки 5 приключени задачи може да има допълнителен checkpoint.

## ПРЕДИ ВСЯКА РЕДАКЦИЯ
1. `PROJECT_RULES_00_READ_FIRST.md`
2. `PROJECT_RULES_PROTECTED_CORE.md`
3. `PROJECT_RULES.md`
4. `PROJECT_RULES_RENDER_OWNERSHIP.md`
5. `PROJECT_PROGRESS.md`

LOCKED: Фирми/профили, Обяви, Майстори и ремонти, Admin core/critical actions, роли/права/ownership/approval/direct publish/лимити/statuses и protected repair search priority.

## ПРИОРИТЕТЕН РЕД ЗА ИЗПЪЛНЕНИЕ
- `P0 / SYSTEM`: load-state, flicker, render ownership, auth-state, intermittent loading — QA-006/029/030.
- `P1 / FORMS`: post-submit, validation, dirty close, реални submit failures — QA-001/002/003/004/013/027.
- `P1 / SEARCH`: relevance, legacy labels, empty state, transliteration/synonyms/types-tags — QA-019/021/022/026/028. Protected search priority остава LOCKED.
- `P2 / CONTENT + ERROR STATES`: QA-011/017/018/020/023/024/025/031.
- `P3 / ACCESSIBILITY + POLISH`: QA-007/009/010/032 и останалите visual/mobile/focus проверки.
- LOCKED находките се одитират read-only и не се поправят без отделно изрично одобрение.

# A. АКТИВНИ НАХОДКИ

## QA-001 — Site-wide post-submit UX
Статус: `OPEN`
След успешен submit формата трябва да изчезва/става inactive, да има ясен success + следващо действие и да няма accidental duplicate submit. При error формата остава и данните се пазят.
Health add/correction/signal е source-fixed на 23.08.2026: при success формата се заменя с ясно status съобщение + `Затвори`, повторен submit е невъзможен, а при error формата остава с данните. `zdrave.html` е cache-bust-нат към новия health script. Health остава `NEEDS RETEST`, докато site-wide QA-001 остава OPEN за останалите форми.
Transport/Education бяха source-confirmed с duplicate risk и остават за проверка/поправка, ако текущите им последни версии още го съдържат.

## QA-002 — Site-wide validation UX
Статус: `OPEN`
Specific error до exact field; ясен red/error state; focus first invalid; preserve data; live clear after fix; semantic validation. `dobavi-firma.html` е добър reference model с summary `Провери отбелязаните полета. Данните ти са запазени.`
Transport signal joint test: `abc` на blur правилно дава `Добави малко повече информация за грешката.`, а след валидна корекция грешката изчезва веднага — този конкретен validation path е PASS.
Health dynamic forms все още разчитат основно на native `required`/maxlength и остават част от QA-002 source audit.

## QA-003 — `signal.html` e-mail validation
Статус: `OPEN`
При missing e-mail не е достатъчно ясно къде е грешката. Без промяна на signal/admin routing.

## QA-004 — `kontakti.html` valid submit fails
Статус: `FIXED - NEEDS RETEST`
Първоначално valid production submit връщаше `Не успяхме да изпратим. Опитай отново.`. Root cause в backend permissions: `contact_messages` имаше RLS insert policy, но ролята `authenticated` нямаше реален `INSERT` grant. Grant-ът е добавен чрез migration и е проверен в `information_schema.role_table_grants`. Frontend validation/post-submit UX също е обновен. Нужен е един реален production submit retest преди `CLOSED`.

## QA-005 — `dobavi-obqva.html` validation summary difference
Статус: `VERIFY / LOCKED`
Specific errors работят за title/category/type/description/phone; optional fields не се маркират. Няма потвърден общ summary като Firm form. Класифициране без mechanical equalization.

## QA-006 — Public Listings intermittent load failure
Статус: `VERIFY / INTERMITTENT / LOCKED`
По-рано `obyavi.html` и home listings даваха load error; по-късно и двете заредиха `TELEVIZOR`. Read-only root-cause за cache/session/query/load-order.

## QA-007 — Visual validation colors/states
Статус: `VERIFY`
Accessibility tree не доказва цвят. Desktop/mobile screenshot QA трябва да потвърди clearly red/error text + field state във всички форми.

## QA-008 — Contact QA text missing initial Q
Статус: `VERIFY`
В един test tree показа `A TEST 3...` вместо `QA TEST 3...`; вероятно ръчно въвеждане. Не bug без повторение.

## QA-009 — `vaprosi.html` stale `image-upload.js`
Статус: `VERIFY`
Uploader е премахнат, но page още зарежда `image-upload.js?v=20260820-0310`. Confirm dependency before removal.

## QA-010 — `institucii.html` ARIA gap
Статус: `VERIFY`
Menu button няма потвърдени `aria-expanded=false`/`aria-controls=main-nav`; modal close няма потвърден descriptive aria-label.

## QA-011 — Home fake/missing article cards
Статус: `OPEN`
`statii.html` има само реалната статия `Как да избереш майстор и да избегнеш неприятни изненади`, но home показва още `Кои документи да поискаш при наемане на услуга` и `Как бързо да намериш работно време и телефон`; CTA водят към общия list, където те не съществуват. Нарушава canonical rule за реален approved material.

## QA-012 — Hidden Admin entry idea
Статус: `IDEA / LOCKED`
Possible 5 taps/hidden trigger само за UX obscurity; НЕ security. Real protection остава auth/role/RLS. Later consider re-auth, audit log, MFA/2FA. No implementation without separate approval.

## QA-013 — Profile няма general signal record след signal QA
Статус: `CLASSIFIED / UX SCOPE`
Backend проверката на 23.08.2026 потвърди, че general `signal.html` записва в таблица `reports` и има 1 recent `site / pending` record — submit-ът е създал record. `profile-info-corrections-v1.js` по дизайн зарежда само `info_submissions` и `info_error_reports`, т.е. секцията е за предложения/сигнали към Инфо Лом, не за general site reports. Това не е загубен signal record.
Остава UX неяснота: динамичното heading `Моите предложения и сигнали` звучи по-общо от реалния scope. Без business промяна може да се уточни на `Моите предложения и сигнали за Инфо Лом`; ако някога се иска general reports да се виждат в профила, това е отделно решение.

## QA-014 — Admin visible English `Highlighted`
Статус: `OPEN / LOCKED`
Visible checkbox label `Highlighted` нарушава Bulgarian UI rule.

## QA-015 — Admin summary `Въпроси 0` при pending question
Статус: `VERIFY / LOCKED`
`QA TEST 1` е в pending queue, summary е `Въпроси 0`. Възможно е metric да означава published questions; source/read-only classification first.

## QA-016 — Direct `admin.html` opens in current session
Статус: `VERIFY / SECURITY / LOCKED`
Не е доказан bug, защото session може да е admin. Нужен доказан guest/non-admin test.

## QA-017 — `magazini.html` grammatically wrong CTA
Статус: `OPEN`
Live проверката потвърди грешни dynamic labels във всички тествани shop tabs, напр. `+ Добави хранителни магазин`, `+ Добави строителни магазин`, `+ Добави техника магазин`, `+ Добави мебели магазин`, `+ Добави дрехи магазин`, `+ Добави дом магазин`. Същият текст се повтаря и в modal heading. Трябва граматически правилно dynamic naming, без промяна на shop flow.

## QA-018 — `vapros.html` без id дублира not-found state
Статус: `OPEN / UX / RENDER OWNERSHIP`
Production retest на 23.08.2026 отново показа едновременно hero `Въпросът не е намерен` и отделна card `Този въпрос не е достъпен`.
Source root cause е потвърден: legacy `script.js::renderQuestionDetail()` все още рендерира question detail/not-found state от localStorage без guard, докато `supabase-content.js` е вторият owner за същия detail flow. Това нарушава single-render-owner правилото. Поправката трябва да е изолирано изключване на legacy question-detail renderer, когато Supabase owner е наличен, без промяна на protected search priority в `script.js`.

## QA-019 — `Автомобили → Автомивки` връща Ivanov Remonti
Статус: `VERIFY / LOCKED SEARCH RELEVANCE`
`tarsene?q=Автомивки` показва `Иванов Ремонти Лом` + `Автомобили`. Проверка защо има match; protected priority не се променя по предположение.

## QA-020 — Много подкатегории са текущи dead-ends
Статус: `VERIFY / CONTENT-COVERAGE / UX`
Всички 6 Services search subcategories и всички 4 Events search subcategories са `Няма намерени резултати`; има празни и в Cars/Restaurants. Не е automatic bug; classify content absence vs useful empty-state need, без invented content.

## QA-021 — Search default state показва legacy public labels
Статус: `OPEN`
`tarsene.html` без `q` показва 10 default results и публично рендерира category headings `Работа и услуги` и `Събития и град`. Canonical public labels са `Услуги` и `Събития`; legacy values трябва да остават само internal compatibility values.

## QA-022 — Search no-results няма директно next action
Статус: `VERIFY / UX`
`tarsene.html?q=zzzzqa-no-result` показва `0 резултата`, heading `Няма намерени резултати` и `Опитай с по-кратка или различна дума.`, но няма direct CTA към категории/въпрос/друга логична стъпка в empty-state card. Класифициране спрямо global text/next-action rule.

## QA-023 — `firma.html` без id дублира not-found state
Статус: `VERIFY / UX / LOCKED / RENDER OWNERSHIP`
Screenshot + tree: hero `Фирмата не е намерена`, после отделна card със същото heading + explanation + `Към фирмите`. Аналогично на QA-018; Firm е LOCKED, само read-only classification.

## QA-024 — `obqva.html` без id има слаб/inconsistent not-found state
Статус: `VERIFY / UX / LOCKED`
Missing-id page няма main error heading/next CTA; в main content има само paragraph `Обявата не е намерена.` след breadcrumb. Сравнение с Question/Firm error states показва различен, много по-слаб fallback. Не се уеднаквява механично; classify first.

## QA-025 — Health Info `Добави ...` labels с plural grammar
Статус: `FIXED - NEEDS RETEST`
Live tree преди fix показваше `Добави аптеки`, `Добави стоматолози`, `Добави лаборатории и диагностика`.
Source fix на 23.08.2026: `info-lom-health-unified.js` вече подава отделни singular add-labels `аптека`, `стоматолог`, `лаборатория`, без промяна на subcategory, entry_type, moderation или DB flow. `zdrave.html` е cache-bust-нат към новата версия. Нужен production retest на трите CTA преди `CLOSED`.

## QA-026 — Search е прекалено exact: липсват синоними, транслитерация и tolerant matching
Статус: `OPEN / SITE-WIDE VERIFY`
Joint live QA в `magazini.html` потвърди, че търсенето работи при директно съвпадение (`бои` → релевантни магазини), но потребителски заявки като `магазин за боя`, `латекс` и латиница/транслитерация (`boi`, `lateks`, `magazin za boq`) не трябва да зависят от exact text match. Нужно е да се провери същият модел във всички site search surfaces.
Joint live QA в `info.html` потвърди различно поведение за `телк` и `telk`: кирилица `телк` връща двата точни ТЕЛК alias резултата, а латиница `telk` връща други записи (`РЗИ Монтана`, `МБАЛ Св. Николай Чудотворец - Лом`). Source read-only проверката на `info-lom-home-search.js` показва exact substring логика (`includes`) без реална transliteration normalization; латинските съвпадения идват случайно от raw `data`/URL текст, не от надежден alias модел.
Желано поведение: case/spacing normalization, кирилица↔латиница/transliteration tolerance, разумни aliases/synonyms/tags и ограничена typo tolerance, без измисляне на съдържание и без нерелевантни резултати. При общото `tarsene.html` всяка бъдеща промяна трябва изрично да запази LOCKED repair/construction/Masters priority и специалния приоритет на Ivanov Remonti; първо read-only root-cause/classification, после отделно решение за implementation.

## QA-027 — Site-wide защита от неволно затваряне на попълнена форма
Статус: `VERIFY / SITE-WIDE UX RULE`
Joint live QA в `magazini.html` потвърди, че при въведени данни `Отказ` затваря modal-а веднага, без предупреждение; при повторно отваряне старите стойности и validation state остават.
Joint live QA в `transport.html` потвърди същото: при валидно въведен текст в signal modal натискане на `X` затваря директно без предупреждение.
Health source fix на 23.08.2026: `X`, backdrop и `Escape` вече проверяват за реално въведени неизпратени данни; празен form се затваря директно, dirty form иска потвърждение, а потвърденото затваряне изчиства modal body. Health е `NEEDS RETEST`; site-wide QA-027 остава активен за останалите modal-и.
Одобрено правило за QA/UX проверка: ако форма/modal има реално въведени, но неизпратени промени, действие `Отказ`, бутонът `X` за затваряне или друго равностойно видимо действие за затваряне не трябва да ги изхвърля без потвърждение. Показва се кратък confirm с ясни действия. Ако формата е празна, се затваря директно. При `Остани` всички данни се пазят; при потвърдено затваряне формата и старият validation state се нулират.
Проверка site-wide: всички потребителски форми и modal-и, включително защитените модули само read-only/с отделно одобрение за промяна. QA правило не дава право да се променя LOCKED flow.

## QA-028 — Типове/тагове трябва да идват от данните, не от твърди автоматични подтабове
Статус: `OPEN / ARCHITECTURE / SITE-WIDE VERIFY`
Потребителят потвърди системния модел: когато запис може да има много конкретни типове (магазин, услуга, заведение и други приложими записи), тези типове не трябва да се измислят като твърди автоматични подтабове в публичната страница. Класификацията трябва да идва от самия запис.
Желан модел: основната категория остава отделна; при добавяне/редакция потребителят избира един или повече подходящи типове чрез чекове, специфични за съответната категория, и има възможност да добави допълнителен тип ръчно, когато липсва подходящ готов избор. Избраните/добавените типове се пазят като структурирани tags/types, показват се като ясни тагове върху картата, участват във филтрирането и търсенето и са връзката към QA-026 за синоними/транслитерация/tolerant matching.
Не се допуска един универсален списък от типове за всички категории. Не се допуска и свободното ръчно въвеждане да създава хаос от дублиращи варианти (`боя`, `бои`, `БОЯ`, `boq` и др.); преди implementation трябва да се проектира normalization/alias модел, който пази смисъла на въведеното, но позволява надеждно търсене и дедупликация.
`magazini.html` е първият потвърден пример: текущите строителни подфилтри са hardcoded UI слой, докато самите shop записи вече имат `tags/groups`. Преди промяна се прави read-only архитектурен одит на data model, формите, renderer-ите, картите, филтрите и search surfaces. Това е голяма системна задача и не се изпълнява като бързо `махни табовете`.
Защитените Фирми/Обяви/Майстори/Admin и protected search priority не се променят като страничен ефект. Ако моделът трябва да се приложи в защитен модул, първо се иска отделно изрично одобрение.

## QA-029 — Info Lom load flicker: static „остаряла информация“ блок се показва преди async съдържанието
Статус: `FIXED - NEEDS RETEST / SITE-WIDE INFO UX / LOAD ORDER`
Потребителят многократно наблюдава при зареждане на много Info Lom страници първо да се вижда текстът `Виждаш грешна или остаряла информация?`, след което реалното съдържание се появява и блокът се измества надолу. Source audit потвърди причината в Info detail шаблоните: dynamic root започва с `Зареждане…`, а статичният `.info-bottom-signal` е веднага след него и се вижда преди async съдържанието.
Source fix: в `info-lom-pages.css` е добавено строго scoped load-state правило, което скрива непосредствения `.info-bottom-signal` само докато `.info-section-wrap` още съдържа `.info-loading`; след финалния render сигналният CTA автоматично става видим. Няма timer, polling, MutationObserver или втори renderer.
Render-ownership audit: Health/Transport/Education имат специализирани roots; Banks/Utilities зареждат generic helper, но generic renderer не таргетира техните specialized public roots; Institutions публикува от hidden staging към един public owner според защитеното render-ownership правило. Няма доказан текущ public double-render в тези roots.
Pending преди `CLOSED`: production first-paint retest на представителни страници, защото browser connector може да вижда страницата след завършване на load-а.

## QA-030 — `info.html` остава с `Вход` при активна сесия
Статус: `CLOSED / P0 AUTH LOAD-STATE`
Root cause: `info.html` зареждаше `script.js`, но не зареждаше Supabase SDK + `supabase-config.js`; затова `script.js` виждаше `window.PopitaiSupabase === null` и не можеше да обнови `.login-link` от статично `Вход` към `Профил`.
Fix: добавени са същите Supabase SDK/config dependencies преди `script.js`, без промяна на auth/roles/RLS/business logic. Production retest в същата активна сесия показа `Профил` на `info.html`.

## QA-031 — `info.html` неестествен intro текст „без лутане“
Статус: `CLOSED / P2 CONTENT`
Потребителят маркира израза `без лутане из дълги списъци` като неподходящ. Одобреният текст е `Намери бързо точния контакт, услуга или място.`. Променено е само видимото copy; production retest потвърди новия текст.
Отделно source audit откри същата нежелана дума на home Categories intro (`без лутане`); това е отделен safe content cleanup, не връща QA-031 в OPEN.

## QA-032 — Info Lom modal close бутон без достъпно име
Статус: `OPEN / P3 ACCESSIBILITY / INFO`
Joint test в Transport показа, че close бутонът се чете само като `×`. Source audit потвърждава същия markup без descriptive `aria-label` в част от Info modal-ите. Health `zdrave.html` вече има `aria-label="Затвори"` и е PASS по този конкретен markup; Education също има descriptive label. Transport/Banks/Utilities/Institutions остават за source + production проверка/корекция.

# B. 100% HTML INVENTORY / COVERAGE

Repo inventory:
`404.html`, `admin.html`, `avtomobili.html`, `banki.html`, `biskvitki.html`, `dobavi-firma.html`, `dobavi-obqva.html`, `firma.html`, `firmi.html`, `index.html`, `info.html`, `institucii.html`, `kategorii.html`, `komunalni.html`, `kontakti.html`, `magazini.html`, `maistori.html`, `nov-vapros.html`, `nova-parola.html`, `obqva.html`, `obrazovanie-kultura.html`, `obyavi.html`, `poveritelnost.html`, `pravila.html`, `profil.html`, `rabota.html`, `razshiren-profil.html`, `registracia.html`, `sabitiya.html`, `signal.html`, `statia.html`, `statii.html`, `tarsene.html`, `transport.html`, `uslovia.html`, `vapros.html`, `vaprosi.html`, `vhod.html`, `za-nas.html`, `zabravena-parola.html`, `zavedenia.html`, `zdrave-i-lekari.html`, `zdrave.html`.

## Public/core
- `index.html` — `PARTIAL PASS`; nav/cards/questions/firms/listings/articles inspected; QA-006/011; source also contains separate `без лутане` copy to clean.
- `info.html` — `PARTIAL PASS`; 6 sections + quick anchor links; search exact/transliteration behavior checked → QA-026; auth header load issue fixed and production retested → QA-030 CLOSED; intro copy retested → QA-031 CLOSED.
- `kategorii.html` — structure/routes for exact 8 categories checked.
- `firmi.html` — read-only protected list checked.
- `obyavi.html` — intermittent load; filters/categories/search controls visible; active `TELEVIZOR` loads.
- `vaprosi.html` — pending QA question correctly hidden; filters/empty state checked; QA-009.
- `statii.html` — one real article; QA-011.
- `statia.html` — real article detail sections 1–4 load.
- `tarsene.html` — subcategory searches, default no-q state and forced no-result state checked; QA-019/020/021/022/026/028.
- `404.html` — custom not-found heading + Back + Home link works structurally.
- `za-nas.html`, `pravila.html`, `poveritelnost.html`, `uslovia.html`, `biskvitki.html` — basic structure read-only checked.

## Category deep routes
### Health category
`zdrave-i-lekari.html`: Личен лекар, Педиатър, Кардиолог, Зъболекар, Физиотерапия, Аптеки; Ask question `?category=zdrave`; Info anchors checked.

### Cars
`avtomobili.html` searches:
- Автосервизи → no results
- Диагностика → no results
- Гуми → `Автомобили`
- Авточасти → no results
- Автомивки → Ivanov Remonti + Автомобили → QA-019
- Пътна помощ → Автомобили

### Restaurants
`zavedenia.html`:
- Ресторанти → Заведения
- Кафенета → Заведения
- Пицарии → Заведения
- Сладкарници → no results
- Доставка на храна → no results

### Services
`rabota.html` public label is `Услуги`, Ask question `?category=rabota`.
Домашни услуги, Красота и грижа, Компютърни услуги, Фото и видео, Счетоводни услуги, Обучение → all no results → QA-020.

### Events
`sabitiya.html`: upcoming-events empty state; Ask question `?category=sabitiya`; Предстоящи/Културни/Спортни/Обществени search routes → all no results → QA-020.

### Masters — LOCKED read-only
`maistori.html`:
- Цялостни ремонти → Ivanov Remonti
- Бани и плочки → Ivanov Remonti
- ВиК → Ivanov Remonti + Майстори
- Електро → Ivanov Remonti + Майстори
- Покриви → Ivanov Remonti + Майстори
- Боядисване → Ivanov Remonti
- Дограма → Ivanov Remonti + Майстори
- Климатици → no results
Protected priority stays visible.

### Shops
`magazini.html`: всички 6 tabs са joint-tested live: Хранителни/Строителни/Техника/Мебели/Дрехи/Дом зареждат съдържание. Shop search: `бои` намира релевантни записи; forced no-result `zzzztest` показва `Няма резултат.` + `Промени търсенето или филтъра.`. Add-store modal е отворен и category preselect `Строителни` е правилен. Empty submit дава specific errors за име/адрес/описание/източник; optional phone/work-hours/source-note не се маркират; invalid phone `123` дава semantic error on blur; valid `0888123456` clear-ва error; invalid submit пази вече въведените име/телефон. `Отказ` затваря веднага при dirty form, а повторното отваряне пази старите стойности/validation state → QA-027. Строителните hardcoded подфилтри са маркирани за архитектурна замяна с data-driven types/tags след одит → QA-028. QA-017/026/027/028. Success submit не е правен.

## Info Lom deep read-only
- `zdrave.html`: all health sections + anchors + direct phones/official links inspected. Health add/correction/signal source е обновен за QA-001/025/027 и cache-bust-нат; чака production retest. Health close button има descriptive `aria-label`.
- `institucii.html`: final priority content loads; signal action; public single-owner staging architecture verified; QA-010/029/032.
- `transport.html`: bus/BDZ/taxi structure + anchor routes inspected; validation blur/live-clear joint PASS; dirty-X fail → QA-027; close accessibility → QA-032; load-state → QA-029.
- `obrazovanie-kultura.html`: schools/kindergartens/chitalishta/library/museum/courses; many direct tel/official links visible; signal form source has good aria close label but QA-001 post-success duplicate risk.
- `banki.html`: ATMs/banks; `Добави банкомат`, signal action and official bank links present; specialized public root + QA-029/032.
- `komunalni.html`: couriers/internet-TV/payment/insurance/electricity etc.; add buttons and direct tel/track/coverage links inspected; specialized public root + QA-029/032.

Нито един Info section е final 100% PASS преди remaining production first-paint/modal/mobile checks.

## Detail/error pages
- Active listing `TELEVIZOR`: title/category/price/date/address, 4 images, share, signal, contact phone, call + Viber actions visible. Interactive Share/Signal still manual.
- Pending `QA TEST 4`: authenticated owner detail visible; guest/non-owner authorization pending.
- `obqva.html` missing id → QA-024.
- Ivanov Remonti firm detail — protected read-only; contact/about/gallery/call/inquiry visible.
- GUTREDDD firm detail — current authenticated owner can preview returned-for-correction profile; guest/non-owner visibility pending.
- `firma.html` missing id → QA-023.
- `razshiren-profil.html?id=Ivanov`: editor visible in current session; role/access classification pending, no protected action.
- `vapros.html` missing id → QA-018 OPEN; source confirms competing legacy + Supabase detail owners.
- `statia.html` valid detail → structure pass.

## Auth/profile
- `vhod.html` and `registracia.html` still display auth forms while header shows authenticated `Профил` → `VERIFY UX`; real invalid/valid submits manual.
- `zabravena-parola.html`: email + Send link + back login; real send pending because it sends mail.
- `nova-parola.html`: direct page shows New password + Repeat + Save/show-password in current authenticated session; `VERIFY UX/ACCESS`; reset-token and submit behavior pending.
- `profil.html`: QA question/listing statuses checked. General signal is stored in `reports`; dynamic `Моите предложения и сигнали` section currently only displays Info Lom `info_submissions/info_error_reports` → QA-013 classified as scope/copy ambiguity. Password-change form present.

# C. JOINT E2E RECORDS

## QA TEST 1 — Question
`QA TEST 1 — въпрос за изтриване`, category Автомобили.
- submit success, but form stayed active in original test → QA-001
- profile → Чака одобрение
- Admin queue → pending
- public `vaprosi.html` → correctly hidden before approval
Remaining: user Admin approval → public list → Cars latest questions → detail → profile status → cleanup.

## QA TEST 4 — Listing — LOCKED
- real record submitted
- profile → pending
- Admin queue → pending
- owner detail visible
- already consumed real personal monthly quota; DO NOT create another QA listing; delete/reject does not restore quota.

## Signal
General signal QA record е потвърден в DB като `reports.target_type=site`, status `pending`; не е загубен. QA-003/QA-001 остават за UX.

## Contacts
Missing-email behavior partial pass; backend permission fix е приложен; valid production retest остава → QA-004.

## Firm validation — LOCKED reference
Empty submit gives specific errors + correct optional behavior + summary; no real submit.

## Listing validation — LOCKED
Empty submit specific errors; QA-005; no additional listing.

# D. ADMIN READ-ONLY — LOCKED
- panel loads
- summary: 2 Users / 5 Pending / 0 Questions / 0 Answers / 2 Firms
- pending queue contains QA TEST 1 + QA TEST 4
- moderation buttons present but not used autonomously
- QA-014/015/016 remain

# E. MANUAL / PENDING, НЕ СЕ СЧИТА ЗА PASS
- Site-wide dirty-form cancel/close behavior: source audit first; manual only where source cannot prove behavior. Health source fix needs production interaction retest. Protected modules only read-only until separately approved.
- Site-wide type/tag architecture: map where hardcoded subcategories/subtabs exist, where structured tags/types already exist, how forms collect them, how cards render them and how search/filter surfaces consume them → QA-028; protected modules remain read-only until separately approved.
- QA-029: production first-paint retest на Info detail pages.
- Shops: success submit/post-submit/duplicate-prevention не е тестван.
- Auth: login/register/forgot/new-password invalid/valid behavior and post-submit.
- Admin: protected moderation E2E only with user.
- Guest/non-owner checks: Admin URL, pending listing detail, returned firm preview, expanded editor.
- Mobile/device QA: real phone/device viewport for all template types.
- Visual error colors/focus after real invalid submit.

# F. ROOT-CAUSE / FOLLOW-UP QUEUE
P0 first: QA-029 first-paint retest; QA-006 read-only because LOCKED.
Then P1 Forms: QA-001/002/003/004/027; QA-013 е classified scope/copy cleanup.
Then P1 Search: QA-019/021/022/026/028, with protected priority untouched.
Then P2/P3, включително QA-011/017/018/025/032.
Read-only investigation before risky/protected fixes remains mandatory.

След края на QA поправките се работи от този файл по priority/status. Нищо не става `CLOSED` без production retest.