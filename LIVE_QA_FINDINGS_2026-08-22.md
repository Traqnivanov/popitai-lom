# Попитай.Лом — LIVE QA FINDINGS — 22.08.2026

Това е КАНОНИЧНИЯТ активен QA списък за текущия production browser/device одит. Не се разчита само на паметта на чата. След приключване на обхода поправките се работят от този списък.

## ПРАВИЛО БЕЗ ЗАГУБА НА ИНФОРМАЦИЯ

- Всеки открит проблем, дори най-малък, се записва тук.
- Влизат И самостоятелните тестове на асистента, И съвместните тестове с потребителя.
- Подозрение/разлика без доказан дефект = `VERIFY`.
- Потвърден дефект = `OPEN`.
- Потвърден проблем в защитен модул = `OPEN / LOCKED` или `BLOCKED / LOCKED`.
- Идея за защитен модул = `IDEA / LOCKED`; не е одобрена промяна.
- След кодова поправка = `FIXED - NEEDS RETEST`.
- Само след production retest = `CLOSED`.
- Нищо не се премахва без ясна следа как е затворено.
- „PASS“ не означава само, че страницата се е отворила. Пълен PASS се дава след приложимите функции, линкове, състояния и роли.
- Ако дадена проверка изисква реално натискане/писане, а browser connector не може да го направи, тя остава изрично `MANUAL / PENDING`, а не се приема за минала.
- Преди смяна на контекст/приключен тестов блок новите находки се checkpoint-ват в GitHub.

## ЗАДЪЛЖИТЕЛНА ГРАНИЦА ПРЕДИ РЕДАКЦИЯ

Преди всяка бъдеща редакция се четат в този ред:
1. `PROJECT_RULES_00_READ_FIRST.md`
2. `PROJECT_RULES_PROTECTED_CORE.md`
3. `PROJECT_RULES.md`
4. `PROJECT_RULES_RENDER_OWNERSHIP.md`
5. `PROJECT_PROGRESS.md`

QA не дава автоматично право за промяна на LOCKED логика. Фирми, Обяви, Майстори и ремонти, Admin core, роли, права, ownership, approval/direct publish, лимити, статуси и защитеният search priority не се променят без отделно изрично одобрение.

# A. АКТИВНИ QA НАХОДКИ

## QA-001 — Системно post-submit UX правило
Статус: `OPEN`

Одобрено като общ стандарт за всички submit форми:
- след успешен submit формата изчезва или става неактивна;
- показва се ясно success състояние;
- има логично следващо действие според потока;
- няма възможност за неволен дублиран submit;
- при грешка формата остава и въведените данни се пазят.

Потвърдено като проблем поне при `nov-vapros.html` и `signal.html`: след успешно изпращане формата остава видима/активна.

## QA-002 — Общ validation UX стандарт
Статус: `OPEN`

При невалиден submit:
- конкретна грешка до конкретното поле;
- ясно визуално error състояние, включително червен текст/рамка или еквивалент;
- фокус/видима позиция към първата грешка;
- останалите данни се пазят;
- при корекция грешката изчезва своевременно;
- structured fields се валидират семантично.

`dobavi-firma.html` е референтният работещ модел: specific errors за име/категория/телефон/описание, optional полетата не се маркират, общо съобщение `Провери отбелязаните полета. Данните ти са запазени.`

## QA-003 — `signal.html` — неясна field-specific validation
Статус: `OPEN`

При липсващ e-mail потребителят не получава достатъчно ясно указание до/за конкретното поле. Да се поправя само validation UX, без странична промяна на signal/admin routing.

## QA-004 — `kontakti.html` — valid submit failure
Статус: `OPEN`

- Празен e-mail правилно показва `Въведи електронна поща.` и пази останалите данни.
- При валидно попълнени име, e-mail и съобщение production връща `Не успяхме да изпратим. Опитай отново.`
- Това е реален backend/runtime/submit проблем, не само визуален UX.

## QA-005 — `dobavi-obqva.html` — validation разлика
Статус: `VERIFY / LOCKED`

Празният submit дава specific errors за заглавие, категория, тип, описание и телефон; optional полетата не се маркират погрешно. Не е потвърден общ summary message като при фирмите. Да се класифицира като intended difference / not applicable / real UX gap. Обяви е LOCKED.

## QA-006 — Публични Обяви — intermittent load failure
Статус: `VERIFY / INTERMITTENT / LOCKED`

По-рано `obyavi.html` и home listings блокът показваха грешка при зареждане. По-късно същия ден и двете заредиха активната обява `TELEVIZOR`. Следователно не е постоянен fail; да се разследва read-only за cache/session/query/load-order причина. Без protected edit.

## QA-007 — Визуален validation контрол
Статус: `VERIFY`

Accessibility tree не доказва цвета. При desktop/mobile визуален QA трябва да се потвърди червен/ясен error state на всички форми.

## QA-008 — Contact QA текст с липсваща начална буква
Статус: `VERIFY`

В един тест accessibility tree показа `A TEST 3 ...` вместо очакваното `QA TEST 3 ...`. Вероятно ръчно въвеждане; да не се приема за bug без повторение.

## QA-009 — `vaprosi.html` зарежда стар `image-upload.js`
Статус: `VERIFY`

Формата за въпрос вече няма uploader, но `vaprosi.html` все още зарежда `image-upload.js?v=20260820-0310`. Да се потвърди като stale asset и да се махне само ако няма зависимост.

## QA-010 — `institucii.html` — ARIA разлики
Статус: `VERIFY`

Спрямо по-новия banking markup:
- menu button няма потвърдени `aria-expanded="false"` / `aria-controls="main-nav"`;
- modal close няма потвърден ясно описателен `aria-label`.

## QA-011 — Home „Полезни статии“ не съответства на реалното съдържание
Статус: `OPEN`

Потвърдено live:
- `statii.html` съдържа само реалната статия `Как да избереш майстор и да избегнеш неприятни изненади`;
- home показва 3 карти;
- допълнителните са `Кои документи да поискаш при наемане на услуга` и `Как бързо да намериш работно време и телефон`;
- всички CTA водят към `statii.html`, където тези две статии не съществуват.

Това противоречи на `PROJECT_PROGRESS.md`: без измислени заглавия/карти без одобрен реален материал.

## QA-012 — Идея: скрит UX вход към Admin
Статус: `IDEA / LOCKED`

Идея за развитие след QA:
- без публично видим Admin link;
- възможен скрит trigger, например 5 натискания върху неочевиден елемент;
- това е само obscurity, НЕ security защита;
- реалната защита остава auth/role/RLS;
- да се обмислят re-auth за критични действия, audit log и MFA/2FA.

Няма реализация без отделно одобрение.

## QA-013 — Profile не показва signal record след signal QA
Статус: `VERIFY`

`Моите предложения и сигнали` показва, че няма записи след signal теста. Да се установи дали submit не е създал запис, записът е в друг поток, или profile query/render има gap.

## QA-014 — Admin видим английски label `Highlighted`
Статус: `OPEN / LOCKED`

В pending listing card се виждат `Спешно`, `Намалено`, `Горно позициониране`, `Highlighted`, `Статистики`, `Плаващи бутони`. `Highlighted` нарушава глобалното правило за български UI. Не се променя без Admin approval.

## QA-015 — Admin summary `Въпроси 0` при pending въпрос
Статус: `VERIFY / LOCKED`

Admin summary показва `Въпроси 0`, а `QA TEST 1` е реално в `Чакащи`. Възможно е метриката да значи публикувани въпроси, затова първо source/read-only класификация.

## QA-016 — `admin.html` директно се отваря в текущата session
Статус: `VERIFY / SECURITY / LOCKED`

Текущата browser session вижда целия Admin панел при директен URL. Това не доказва пробив, защото session може да е admin. Нужен е отделен тест с доказано guest/non-admin state.

## QA-017 — `magazini.html` — граматически грешен CTA
Статус: `OPEN`

Live screenshot и accessibility tree потвърждават видим бутон:
`+ Добави хранителни магазин`

Текстът е граматически неправилен. Трябва да се провери динамичното именуване и да се коригира без промяна на shop business flow.

## QA-018 — `vapros.html` без валиден id — дублирано not-found състояние
Статус: `VERIFY / UX / RENDER OWNERSHIP`

При директно `vapros.html` без id:
- големият hero показва `Въпросът не е намерен`;
- по-надолу има отделна карта със същото заглавие `Въпросът не е намерен` и обяснение;
- accessibility tree също съдържа две отделни not-found headings/blocks.

Screenshot потвърждава визуалното повторение. Да се провери source/render ownership и да се класифицира дали е умишлено или реално двойно error state.

## QA-019 — `Автомобили → Автомивки` връща `Иванов Ремонти Лом`
Статус: `VERIFY / LOCKED SEARCH RELEVANCE`

`avtomobili.html` → `Автомивки` води към `tarsene.html?q=Автомивки`. Live резултатите включват `Иванов Ремонти Лом` и `Автомобили`. Да се провери защо ремонтната фирма съвпада с тази заявка. Защитеният search priority не се променя по предположение.

## QA-020 — Множество подкатегории водят към празно търсене
Статус: `VERIFY / CONTENT-COVERAGE / UX`

Това не е автоматично технически дефект, но е реална текуща потребителска ситуация:
- всички 6 подкатегории на `Услуги` в текущия live тест водят до `Няма намерени резултати`;
- всички 4 search подкатегории на `Събития` водят до `Няма намерени резултати`;
- отделни Автомобили/Заведения подкатегории също са празни.

Да се класифицира като нормална липса на съдържание, UX dead-end или нужда от по-полезно empty-state действие; не се измисля съдържание.

# B. 100% COVERAGE ИНВЕНТАР — PRODUCTION

Репо inventory за HTML страниците е извлечен от recursive GitHub tree. Пълният списък за обход е:
`404.html`, `admin.html`, `avtomobili.html`, `banki.html`, `biskvitki.html`, `dobavi-firma.html`, `dobavi-obqva.html`, `firma.html`, `firmi.html`, `index.html`, `info.html`, `institucii.html`, `kategorii.html`, `komunalni.html`, `kontakti.html`, `magazini.html`, `maistori.html`, `nov-vapros.html`, `nova-parola.html`, `obqva.html`, `obrazovanie-kultura.html`, `obyavi.html`, `poveritelnost.html`, `pravila.html`, `profil.html`, `rabota.html`, `razshiren-profil.html`, `registracia.html`, `sabitiya.html`, `signal.html`, `statia.html`, `statii.html`, `tarsene.html`, `transport.html`, `uslovia.html`, `vapros.html`, `vaprosi.html`, `vhod.html`, `za-nas.html`, `zabravena-parola.html`, `zavedenia.html`, `zdrave-i-lekari.html`, `zdrave.html`.

## Основни публични страници

- `index.html` — `PARTIAL PASS + QA-006 + QA-011`; nav/cards/questions/firms/listings/articles inspected.
- `info.html` — `PASS STRUCTURE / VERIFY SESSION`; 6 main cards + quick links to specific anchors inspected.
- `kategorii.html` — `PASS STRUCTURE`; exactly 8 public categories and routes inspected.
- `firmi.html` — `PASS READ-ONLY / LOCKED`; public list loads, Ivanov Remonti visible, add-firm action exists.
- `obyavi.html` — `VERIFY INTERMITTENT / LOCKED`; one run failed, later run loaded `TELEVIZOR`.
- `vaprosi.html` — `PASS PUBLIC PENDING-FILTER`; pending QA question is not public; filters/empty state inspected; QA-009 remains.
- `statii.html` — `PASS LIST / QA-011`; exactly 1 real article.
- `statia.html` — `PASS STRUCTURE`; real article loads with sections 1–4 and nav/footer.
- `za-nas.html`, `pravila.html`, `poveritelnost.html`, `uslovia.html`, `biskvitki.html` — `PASS BASIC STRUCTURE`; full interactive/legal content review still manual if needed.
- nonexistent route -> custom `404.html` — `PASS BASIC`: `Страницата не е намерена`, `Назад`, `Към началната страница`.

## Категории и подкатегории — deep route QA

### `zdrave-i-lekari.html`
Статус: `PASS STRUCTURE`

Проверени cards/sections: Личен лекар, Педиатър, Кардиолог, Зъболекар, Физиотерапия, Аптеки; Ask question `?category=zdrave`; links към Info Health anchors; category firms/questions states.

### `avtomobili.html`
Статус: `PARTIAL PASS + QA-019`

Проверени search подкатегории:
- Автосервизи → no results;
- Диагностика → no results;
- Гуми → result `Автомобили`;
- Авточасти → no results;
- Автомивки → `Иванов Ремонти Лом` + `Автомобили` → QA-019;
- Пътна помощ → `Автомобили`.

Липсата на резултат не се приема автоматично за дефект.

### `zavedenia.html`
Статус: `PASS ROUTES / CONTENT GAPS`

- Ресторанти → result `Заведения`;
- Кафенета → result `Заведения`;
- Пицарии → result `Заведения`;
- Сладкарници → no results;
- Доставка на храна → no results.

### `rabota.html` / публичен label `Услуги`
Статус: `PASS ROUTES / QA-020`

Ask question route `?category=rabota` е наличен. Проверени:
- Домашни услуги → no results;
- Красота и грижа → no results;
- Компютърни услуги → no results;
- Фото и видео → no results;
- Професионални услуги (`Счетоводни услуги`) → no results;
- Обучение и уроци (`Обучение`) → no results.

### `sabitiya.html`
Статус: `PASS ROUTES / QA-020`

Upcoming events valid empty state; Ask question `?category=sabitiya`; Info Lom CTA. Search subcategories:
- Предстоящи събития → no results;
- Културни събития → no results;
- Спортни събития → no results;
- Обществени събития → no results.

### `maistori.html` — LOCKED
Статус: `READ-ONLY PASS / PROTECTED SEARCH`

Проверени:
- Цялостни ремонти → Иванов Ремонти Лом;
- Бани и плочки → Иванов Ремонти Лом;
- ВиК → Иванов Ремонти Лом + Майстори и ремонти;
- Електро → Иванов Ремонти Лом + Майстори и ремонти;
- Покриви → Иванов Ремонти Лом + Майстори и ремонти;
- Боядисване → Иванов Ремонти Лом;
- Дограма → Иванов Ремонти Лом + Майстори и ремонти;
- Климатици → no results.

Защитеният priority остава видим при съвпадащите repair заявки.

### `magazini.html`
Статус: `PARTIAL — MANUAL TABS PENDING + QA-017`

Потвърдени tabs: Хранителни, Строителни, Техника, Мебели, Дрехи, Дом. Хранителни зарежда реални обекти. CTA има QA-017. Connector няма click action, затова 5-те останали tabs и add-shop open/submit flow остават `MANUAL / PENDING`; НЕ се маркират като PASS.

## Инфо Лом

- `zdrave.html` — sections: болница, лекари, аптеки, стоматолози, ветеринари/вет. аптеки, лаборатории; signal action наличен. `PARTIAL PASS`; button/modal/anchor manual interactions остават.
- `institucii.html` — final content loads, включително Областна администрация Монтана и Филиал за спешна медицинска помощ – Лом. `PARTIAL PASS`; initial flicker и QA-010 остават.
- `transport.html` — автогара, ЖП/БДЖ, таксита, anchors. `PARTIAL PASS`; реални external CTA/manual navigation още се проверяват.
- `obrazovanie-kultura.html` — училища, детски градини, читалища, библиотека, музей, курсове, anchors. `PARTIAL PASS`.
- `banki.html` — банкомати и банкови офиси/brands се зареждат. `PARTIAL PASS`.
- `komunalni.html` — ВиК, куриери, интернет/TV, платежни точки, застраховане и utility sections. `PARTIAL PASS`.

Нито един Info Lom раздел не се счита 100% final PASS преди manual CTA/anchor/modal/mobile проверката.

## Detail страници / error states

- `obqva.html?id=<QA TEST 4>` — current authenticated owner вижда pending detail, контактен телефон/call links/back/add-listing. `PASS OWNER READ-ONLY / LOCKED`; guest/non-owner visibility още не е тествана.
- `firma.html?id=<Иванов Ремонти>` — protected read-only: title/contact/about/short intro/gallery, call/inquiry CTA. Gallery accessibility shows images 2–15, consistent with first image possibly used as cover; не се приема за defect без source check.
- `razshiren-profil.html?id=<Иванов Ремонти>` — edit form се отваря в текущата session. Не се счита security bug без доказана role/session; protected read-only only.
- `vapros.html` без id — QA-018.
- `statia.html` — valid article detail PASS structure.
- custom 404 — PASS basic.

## Auth / profile pages

- `vhod.html` — form exists even while header shows `Профил`; `VERIFY UX`, actual validation/manual submit pending.
- `registracia.html` — form exists while authenticated; `VERIFY UX`, actual registration validation/manual submit pending.
- `zabravena-parola.html` — email + `Изпрати линк` + back-to-login link. `PASS STRUCTURE / MANUAL SUBMIT PENDING` because submit sends real reset mail.
- `nova-parola.html` — direct page shows New password + Repeat password + Save + show-password controls while current session is authenticated. `VERIFY UX/ACCESS`; actual reset-token and invalid/valid submit flow pending.
- `profil.html` — QA question and QA listing statuses inspected; password change form exists; signal/profile gap QA-013.

# C. СЪВМЕСТНИ END-TO-END ТЕСТОВЕ

## QA TEST 1 — Въпрос
`QA TEST 1 — въпрос за изтриване`, category `Автомобили`.

Потвърдено:
- submit success message;
- form остава active → QA-001;
- profile → `Чака одобрение`;
- Admin queue → присъства и чака одобрение;
- public `vaprosi.html` → не се показва преди approval, което е правилно.

Остава: потребителят натиска Admin approval → public `vaprosi.html` → `avtomobili.html` latest questions → detail page → profile status → cleanup.

## QA TEST 4 — Обява — LOCKED
`QA TEST 4 — обява за изтриване`.

Потвърдено:
- реално подадена;
- profile → `Чака одобрение`;
- Admin queue → присъства;
- authenticated owner detail page се отваря.

ВАЖНО: записът вече е използвал реална месечна personal quota. Не се създава втори QA listing. Изтриване/отказ не възстановява quota.

## Signal
Потвърдено съвместно:
- неясна e-mail validation → QA-003;
- след success form остава → QA-001;
- profile не показва record → QA-013.

## Contacts
Потвърдено:
- missing email field-specific error + preserved data;
- valid submit failure → QA-004.

## Firm form — LOCKED reference
Empty submit дава correct field-specific validation + summary, без да маркира optional fields. Няма real submit.

## Listing form — LOCKED
Empty submit дава specific validation. Разликата в summary е QA-005. Няма нов QA listing.

# D. ADMIN READ-ONLY QA — LOCKED

Потвърдено без critical actions:
- panel loads;
- summary: 2 Потребители, 5 Чакащи, 0 Въпроси, 0 Отговори, 2 Фирми;
- sections: Чакащи, Потребителски редакции, Разширени профили, Публикувани въпроси/отговори, Обяви, Скрити/отказани, Магазини, Събития, Инфо Лом, Потребители, Съобщения, фирмени секции;
- QA TEST 1 и QA TEST 4 са в pending queue;
- moderation actions са налични, но не са натискани самостоятелно;
- QA-014, QA-015, QA-016 остават.

# E. ТЕКУЩИ QA РИСКОВЕ / НЕПРИКЛЮЧЕНИ РЪЧНИ ТЕСТОВЕ

- Не натискай/създавай нова Обява за QA — оставащата quota е реална и QA TEST 4 вече я е използвал.
- Protected Admin moderation actions се правят само съвместно с потребителя.
- Shop tabs/add-store interaction изисква потребителски click.
- Auth validation/submit (login/register/forgot/new password) изисква реално interaction.
- Mobile/device QA изисква реална mobile viewport/device mode настройка.
- Info Lom buttons/modals/external CTA/anchor behavior трябва да се минат интерактивно, не само по accessibility tree.
- Guest/non-owner visibility за pending protected records трябва да се тества в доказано guest/non-owner session.

# F. СЛЕДВАЩИ QA ДЕЙСТВИЯ

1. Довършване на останалите HTML inventory pages и error/access states.
2. Дълбок интерактивен обход на Shops tabs и add-store flow с потребителя.
3. Дълбок Info Lom CTA/anchor/modal тест, секция по секция.
4. Auth forms: invalid/valid field behavior и post-submit states.
5. Protected Admin moderation E2E за QA TEST 1 и QA TEST 4 с потребителя.
6. Guest/non-owner authorization checks за Admin, pending listing detail, expanded business editor и protected routes.
7. Mobile/device QA на всички основни template types.
8. Read-only root-cause investigation: QA-004, QA-006, QA-009, QA-010, QA-013, QA-015, QA-016, QA-018, QA-019.
9. След края на QA поправките се започват от този файл по status/priority; след всяка поправка production retest преди `CLOSED`.
