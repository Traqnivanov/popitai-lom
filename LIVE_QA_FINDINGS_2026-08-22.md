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

## ПРЕДИ ВСЯКА РЕДАКЦИЯ
1. `PROJECT_RULES_00_READ_FIRST.md`
2. `PROJECT_RULES_PROTECTED_CORE.md`
3. `PROJECT_RULES.md`
4. `PROJECT_RULES_RENDER_OWNERSHIP.md`
5. `PROJECT_PROGRESS.md`

LOCKED: Фирми/профили, Обяви, Майстори и ремонти, Admin core/critical actions, роли/права/ownership/approval/direct publish/лимити/statuses и protected repair search priority.

# A. АКТИВНИ НАХОДКИ

## QA-001 — Site-wide post-submit UX
Статус: `OPEN`
След успешен submit формата трябва да изчезва/става inactive, да има ясен success + следващо действие и да няма accidental duplicate submit. При error формата остава и данните се пазят. Потвърден проблем поне в `nov-vapros.html` и `signal.html`.

## QA-002 — Site-wide validation UX
Статус: `OPEN`
Specific error до exact field; ясен red/error state; focus first invalid; preserve data; live clear after fix; semantic validation. `dobavi-firma.html` е добър reference model с summary `Провери отбелязаните полета. Данните ти са запазени.`

## QA-003 — `signal.html` e-mail validation
Статус: `OPEN`
При missing e-mail не е достатъчно ясно къде е грешката. Без промяна на signal/admin routing.

## QA-004 — `kontakti.html` valid submit fails
Статус: `OPEN`
Missing e-mail validation пази данните и показва field error; при валидни име/e-mail/message production връща `Не успяхме да изпратим. Опитай отново.` Реален submit/backend/runtime проблем.

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

## QA-013 — Profile няма signal record след signal QA
Статус: `VERIFY`
Да се установи дали signal submit не е създал record, record е в друг flow или profile query/render има gap.

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
Статус: `VERIFY / UX / RENDER OWNERSHIP`
Screenshot + tree: огромен hero `Въпросът не е намерен`, после отделна карта със същото heading + explanation. Source/render ownership classification needed.

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
Статус: `OPEN`
Live tree в `zdrave.html` показва правилни singular actions като `Добави лекар`, `Добави ветеринар`, `Добави ветеринарна аптека`, но също grammatically wrong:
- `Добави аптеки`
- `Добави стоматолози`
- `Добави лаборатории и диагностика`
Проверка на dynamic label generation; корекция само на visible wording, без content/admin flow side effects.

## QA-026 — Search е прекалено exact: липсват синоними, транслитерация и tolerant matching
Статус: `OPEN / SITE-WIDE VERIFY`
Joint live QA в `magazini.html` потвърди, че търсенето работи при директно съвпадение (`бои` → релевантни магазини), но потребителски заявки като `магазин за боя`, `латекс` и латиница/транслитерация (`boi`, `lateks`, `magazin za boq`) не трябва да зависят от exact text match. Нужно е да се провери същият модел във всички site search surfaces.
Желано поведение: case/spacing normalization, кирилица↔латиница/transliteration tolerance, разумни aliases/synonyms/tags и ограничена typo tolerance, без измисляне на съдържание и без нерелевантни резултати. При общото `tarsene.html` всяка бъдеща промяна трябва изрично да запази LOCKED repair/construction/Masters priority и специалния приоритет на Ivanov Remonti; първо read-only root-cause/classification, после отделно решение за implementation.

# B. 100% HTML INVENTORY / COVERAGE

Repo inventory:
`404.html`, `admin.html`, `avtomobili.html`, `banki.html`, `biskvitki.html`, `dobavi-firma.html`, `dobavi-obqva.html`, `firma.html`, `firmi.html`, `index.html`, `info.html`, `institucii.html`, `kategorii.html`, `komunalni.html`, `kontakti.html`, `magazini.html`, `maistori.html`, `nov-vapros.html`, `nova-parola.html`, `obqva.html`, `obrazovanie-kultura.html`, `obyavi.html`, `poveritelnost.html`, `pravila.html`, `profil.html`, `rabota.html`, `razshiren-profil.html`, `registracia.html`, `sabitiya.html`, `signal.html`, `statia.html`, `statii.html`, `tarsene.html`, `transport.html`, `uslovia.html`, `vapros.html`, `vaprosi.html`, `vhod.html`, `za-nas.html`, `zabravena-parola.html`, `zavedenia.html`, `zdrave-i-lekari.html`, `zdrave.html`.

## Public/core
- `index.html` — `PARTIAL PASS`; nav/cards/questions/firms/listings/articles inspected; QA-006/011.
- `info.html` — `PARTIAL PASS`; 6 sections + quick anchor links; session/header timing needs observation.
- `kategorii.html` — structure/routes for exact 8 categories checked.
- `firmi.html` — read-only protected list checked.
- `obyavi.html` — intermittent load; filters/categories/search controls visible; active `TELEVIZOR` loads.
- `vaprosi.html` — pending QA question correctly hidden; filters/empty state checked; QA-009.
- `statii.html` — one real article; QA-011.
- `statia.html` — real article detail sections 1–4 load.
- `tarsene.html` — subcategory searches, default no-q state and forced no-result state checked; QA-019/020/021/022/026.
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
`magazini.html`: всички 6 tabs са joint-tested live: Хранителни/Строителни/Техника/Мебели/Дрехи/Дом зареждат съдържание. Shop search: `бои` намира релевантни записи; forced no-result `zzzztest` показва `Няма резултат.` + `Промени търсенето или филтъра.`. Add-store modal е отворен и category preselect `Строителни` е правилен. Empty submit дава specific errors за име/адрес/описание/източник; optional phone/work-hours/source-note не се маркират; invalid phone `123` дава semantic error on blur; valid `0888123456` clear-ва error; invalid submit пази вече въведените име/телефон. QA-017/026. Success submit не е правен.

## Info Lom deep read-only
- `zdrave.html`: all health sections + anchors + direct phones/official links inspected; add/correction actions visible; QA-025.
- `institucii.html`: final priority content loads; signal action; QA-010; flicker still VERIFY.
- `transport.html`: bus/BDZ/taxi structure + anchor routes inspected; interactive external actions remain manual.
- `obrazovanie-kultura.html`: schools/kindergartens/chitalishta/library/museum/courses; many direct tel/official links visible; no new defect in this pass.
- `banki.html`: ATMs/banks; `Добави банкомат`, signal action and official bank links present; no new defect in this pass.
- `komunalni.html`: couriers/internet-TV/payment/insurance/electricity etc.; add buttons and direct tel/track/coverage links inspected; no new defect in this pass.

Нито един Info section е final 100% PASS преди real click/anchor/modal/mobile test.

## Detail/error pages
- Active listing `TELEVIZOR`: title/category/price/date/address, 4 images, share, signal, contact phone, call + Viber actions visible. Interactive Share/Signal still manual.
- Pending `QA TEST 4`: authenticated owner detail visible; guest/non-owner authorization pending.
- `obqva.html` missing id → QA-024.
- Ivanov Remonti firm detail — protected read-only; contact/about/gallery/call/inquiry visible.
- GUTREDDD firm detail — current authenticated owner can preview returned-for-correction profile; guest/non-owner visibility pending.
- `firma.html` missing id → QA-023.
- `razshiren-profil.html?id=Ivanov`: editor visible in current session; role/access classification pending, no protected action.
- `vapros.html` missing id → QA-018.
- `statia.html` valid detail → structure pass.

## Auth/profile
- `vhod.html` and `registracia.html` still display auth forms while header shows authenticated `Профил` → `VERIFY UX`; real invalid/valid submits manual.
- `zabravena-parola.html`: email + Send link + back login; real send pending because it sends mail.
- `nova-parola.html`: direct page shows New password + Repeat + Save/show-password in current authenticated session; `VERIFY UX/ACCESS`; reset-token and submit behavior pending.
- `profil.html`: QA question/listing statuses checked; signal gap QA-013; password-change form present.

# C. JOINT E2E RECORDS

## QA TEST 1 — Question
`QA TEST 1 — въпрос за изтриване`, category Автомобили.
- submit success, but form stayed active → QA-001
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
QA-003 + QA-001 + QA-013 remain.

## Contacts
Missing-email behavior partial pass; valid submit QA-004.

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
- Shops: success submit/post-submit/duplicate-prevention не е тестван; структурното решение за излишните строителни подфилтри е product/UX decision, не QA PASS/FAIL.
- Info Lom: actual button clicks, modals, anchor scrolling, external CTA actions section by section.
- Auth: login/register/forgot/new-password invalid/valid behavior and post-submit.
- Admin: protected moderation E2E only with user.
- Guest/non-owner checks: Admin URL, pending listing detail, returned firm preview, expanded editor.
- Mobile/device QA: real phone/device viewport for all template types.
- Visual error colors/focus after real invalid submit.

# F. ROOT-CAUSE / FOLLOW-UP QUEUE
Read-only investigation before fixes: QA-004, 006, 009, 010, 013, 015, 016, 018, 019, 021, 022, 023, 024, 025, 026.

След края на QA поправките започват от този файл по status/priority. Нищо не става `CLOSED` без production retest.
