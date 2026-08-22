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
Source audit на актуалните версии към 23.08.2026: Health add/correction/signal, Transport signal, Education signal и Shops add вече имат заключен success state — формата се скрива/заменя със success и повторен submit не е възможен. Health е cache-bust-нат и частично production-потвърден; Transport/Education/Shops са source-confirmed и чакат само interaction retest. General Questions все още е source-confirmed gap: `supabase-content.js::initQuestionForm()` след успешен insert прави `form.reset()`, показва success текст, но отново enable-ва submit бутона и оставя формата активна. Site-wide QA-001 остава OPEN.

## QA-002 — Site-wide validation UX
Статус: `OPEN`
Specific error до exact field; ясен red/error state; focus first invalid; preserve data; live clear after fix; semantic validation. `dobavi-firma.html` е добър reference model с summary `Провери отбелязаните полета. Данните ти са запазени.`
Transport signal joint test: `abc` на blur правилно дава `Добави малко повече информация за грешката.`, а след валидна корекция грешката изчезва веднага — този конкретен validation path е PASS.
Health dynamic forms все още разчитат основно на native `required`/maxlength и остават част от QA-002 source audit.

## QA-003 — `signal.html` e-mail validation
Статус: `VERIFY - SOURCE NOW GOOD`
Актуалният source вече има field-specific e-mail validation: при празно поле `Въведи електронна поща.`, при невалиден адрес `Въведи валиден e-mail адрес.`, съобщението е непосредствено до полето, `aria-invalid` се обновява и при submit фокусът отива към първото невалидно поле. Няма промяна на signal/admin routing. Нужен е production interaction retest преди `CLOSED`.

## QA-004 — `kontakti.html` valid submit fails
Статус: `FIXED - NEEDS RETEST`
Първоначално valid production submit връщаше `Не успяхме да изпратим. Опитай отново.`. Root cause в backend permissions: `contact_messages` имаше RLS insert policy, но ролята `authenticated` нямаше реален `INSERT` grant. Grant-ът е добавен чрез migration и е проверен в `information_schema.role_table_grants`. Frontend validation/post-submit UX също е обновен. Нужен е един реален production submit retest преди `CLOSED`.

## QA-005 — `dobavi-obqva.html` validation summary difference
Статус: `VERIFY / LOCKED`
Specific errors работят за title/category/type/description/phone; optional fields не се маркират. Няма потвърден общ summary като Firm form. Класифициране без mechanical equalization.

## QA-006 — Public Listings intermittent load failure
Статус: `VERIFY / INTERMITTENT / LOCKED`
По-рано `obyavi.html` и home listings даваха load error; по-късно и двете заредиха `TELEVIZOR`. Exact първоначален runtime failure не е възпроизведен надеждно.
Source audit откри реален robustness gap в LOCKED listing loader: `supabase-listings.js::waitForClient()` проверява на всеки 50 ms без timeout/error fallback. Ако SDK/config клиентът не стане наличен, loader-ът може да остане завинаги в `Зареждане…` вместо да премине към контролирано error state. Home listings има аналогичен wait pattern. Това не доказва, че точно то е причинило предишната intermittent грешка, но е отделен source-confirmed resilience риск в защитен модул. Без промяна без одобрение.

## QA-007 — Visual validation colors/states
Статус: `VERIFY`
Accessibility tree не доказва цвят. Desktop/mobile screenshot QA трябва да потвърди clearly red/error text + field state във всички форми.

## QA-008 — Contact QA text missing initial Q
Статус: `VERIFY`
В един test tree показа `A TEST 3...` вместо `QA TEST 3...`; вероятно ръчно въвеждане. Не bug без повторение.

## QA-009 — `vaprosi.html` stale `image-upload.js`
Статус: `FIXED - NEEDS RETEST`
Актуалният source на `vaprosi.html` вече НЕ зарежда `image-upload.js`; страницата зарежда Supabase config, `questions-public-v1.js` и global `script.js`. Нужен production HTML/dependency retest преди `CLOSED`.

## QA-010 — `institucii.html` ARIA gap
Статус: `FIXED - NEEDS RETEST`
Актуалният source има `aria-expanded="false"` и `aria-controls="main-nav"` на menu button, а modal close има descriptive `aria-label`. Production accessibility tree на 23.08.2026 потвърди, че modal close вече се обявява като `Затвори съобщението`, не като голо `×`. Финален menu interaction retest остава преди `CLOSED`.

## QA-011 — Home fake/missing article cards
Статус: `OPEN`
`statii.html` има само реалната статия `Как да избереш майстор и да избегнеш неприятни изненади`, но home показва още `Кои документи да поискаш при наемане на услуга` и `Как бързо да намериш работно време и телефон`; CTA водят към общия list, където те не съществуват. Нарушава canonical rule за реален approved material. Source проверката потвърди, че реалната статия има detail URL `statia.html`; safe home cleanup предстои. При предишен опит беше засечен прекалено голям formatting diff в `index.html` и той беше върнат, така че protected embedded Listings логика не остана променена.

## QA-012 — Hidden Admin entry idea
Статус: `IDEA / LOCKED`
Possible 5 taps/hidden trigger само за UX obscurity; НЕ security. Real protection остава auth/role/RLS. Later consider re-auth, audit log, MFA/2FA. No implementation without separate approval.

## QA-013 — Profile няма general signal record след signal QA
Статус: `CLOSED / CLASSIFIED UX SCOPE`
Backend проверката потвърди, че general `signal.html` записва в `reports` и има recent `site / pending` record — submit-ът не е загубен. `profile-info-corrections-v1.js` по дизайн показва само Info Lom `info_submissions` и `info_error_reports`.
UX scope copy е уточнен безопасно на `Моите предложения и сигнали за Инфо Лом`, cache-bust-нат в `profil.html` и production retest потвърди новото heading. General reports не са добавяни в profile flow; това би било отделно решение.

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
Статус: `FIXED - NEEDS RETEST`
Актуалният source използва explicit `addLabels` map: `хранителен магазин`, `строителен магазин`, `магазин за техника`, `мебелен магазин`, `магазин за дрехи`, `магазин за дома`, еднакво за CTA и modal heading. Production retest на текущо активния `Строителни` показа `＋ Добави строителен магазин`. Останалите 5 deterministic states са source-confirmed; финален tab-by-tab interaction retest остава преди `CLOSED`.

## QA-018 — `vapros.html` без id дублира not-found state
Статус: `OPEN / UX / RENDER OWNERSHIP`
Production retest на 23.08.2026 отново показа едновременно hero `Въпросът не е намерен` и отделна card `Този въпрос не е достъпен`.
Source root cause е потвърден: legacy `script.js::renderQuestionDetail()` все още рендерира question detail/not-found state от localStorage без guard, докато `supabase-content.js` е вторият owner за същия detail flow. Това нарушава single-render-owner правилото. Поправката трябва да е изолирано изключване на legacy question-detail renderer, когато Supabase owner е наличен, без промяна на protected search priority в `script.js`. Тъй като `script.js` съдържа LOCKED repair search priority, промяна в него се третира като рискова и не се прави на сляпо.

## QA-019 — `Автомобили → Автомивки` връща Ivanov Remonti
Статус: `BLOCKED / LOCKED SEARCH RELEVANCE`
Live: `tarsene?q=Автомивки` показва `Иванов Ремонти Лом` + `Автомобили`.
Точният source root cause е установен. Protected `CONSTRUCTION_SEARCH_STEMS` съдържа stem `мивк` за заявки като `мивка`. Нормализираното `автомивки` също съдържа substring `мивк`, затова `isConstructionQuery('Автомивки')` връща true и `rankSearchRecords()` принудително добавя `IVANOV_REMONTI` отпред, въпреки че заявката е за автомивка. Това е false positive в защитената repair/construction priority логика, не реално текстово съвпадение на фирмата.
Корекцията трябва да стесни matching-а така, че `мивка` да остава repair/VиК сигнал, но `автомивка` да не активира construction priority. Понеже тази логика е изрично LOCKED, не се променя без отделно одобрение.

## QA-020 — Много подкатегории са текущи dead-ends
Статус: `CLASSIFIED / CONTENT-COVERAGE / UX`
Source audit потвърди, че Services и Events cards умишлено водят към `tarsene.html?q=...`; routing-ът е реален и не е счупен. Празните резултати идват от липса на текущо индексирано съдържание за тези конкретни заявки, а не от счупен линк/renderer. Следователно това не е automatic technical bug и не се попълва с измислени записи.
Остава UX връзката с QA-022: когато реално няма съдържание, empty state трябва да даде полезна следваща стъпка, вместо потребителят да стига до задънена улица.

## QA-021 — Search default state показва legacy public labels
Статус: `CLOSED`
`search-public-labels.js` заменя само public label/description за internal compatibility стойностите `Работа и услуги` → `Услуги` и `Събития и град` → `Събития`. Production retest на `tarsene.html` без `q` на 23.08.2026 показа `Услуги` и `Събития` и не показа старите публични headings. Internal compatibility стойностите и protected search priority не са променяни.

## QA-022 — Search no-results няма директно next action
Статус: `VERIFY / UX`
`tarsene.html?q=zzzzqa-no-result` показва `0 резултата`, heading `Няма намерени резултати` и `Опитай с по-кратка или различна дума.`, но няма direct CTA към категории/въпрос/друга логична стъпка в empty-state card. Класифициране спрямо global text/next-action rule. QA-020 вече е classified content gap, което засилва нуждата от полезен no-results next action без измисляне на съдържание.

## QA-023 — `firma.html` без id дублира not-found state
Статус: `VERIFY / UX / LOCKED / RENDER OWNERSHIP`
Screenshot + tree: hero `Фирмата не е намерена`, после отделна card със същото heading + explanation + `Към фирмите`. Аналогично на QA-018; Firm е LOCKED, само read-only classification.

## QA-024 — `obqva.html` без id има слаб/inconsistent not-found state
Статус: `VERIFY / UX / LOCKED`
Missing-id page няма main error heading/next CTA; в main content има само paragraph `Обявата не е намерена.` след breadcrumb. Сравнение с Question/Firm error states показва различен, много по-слаб fallback. Не се уеднаквява механично; classify first.

## QA-025 — Health Info `Добави ...` labels с plural grammar
Статус: `CLOSED`
Source fix: `info-lom-health-unified.js` подава singular add-labels `аптека`, `стоматолог`, `лаборатория`, без промяна на subcategory, entry_type, moderation или DB flow; `zdrave.html` е cache-bust-нат.
Production retest на 23.08.2026 показа точно `＋ Добави аптека`, `＋ Добави стоматолог`, `＋ Добави лаборатория`.

## QA-026 — Search е прекалено exact: липсват синоними, транслитерация и tolerant matching
Статус: `OPEN / SITE-WIDE VERIFY`
Joint live QA в `magazini.html` потвърди, че търсенето работи при директно съвпадение (`бои` → релевантни магазини), но потребителски заявки като `магазин за боя`, `латекс` и латиница/транслитерация (`boi`, `lateks`, `magazin za boq`) не трябва да зависят от exact text match. Нужно е да се провери същият модел във всички site search surfaces.
Info Lom partial fix на 23.08.2026: `info-lom-home-search.js` вече нормализира и кирилица, и латиница към един canonical transliterated search text. Така alias `ТЕЛК` и query `telk` вече се сравняват по една и съща нормализирана стойност, вместо латинските резултати да идват случайно от raw JSON/URL текст. `info.html` е cache-bust-нат към новата версия. Това е source-fixed, но чака production interaction retest с поне `телк`/`telk` преди Info surface да се счита за PASS.
Site-wide QA-026 остава OPEN: Shops и общото `tarsene.html` още нямат пълния approved model за synonyms/transliteration/typo tolerance. При общото `tarsene.html` всяка бъдеща промяна трябва изрично да запази LOCKED repair/construction/Masters priority и специалния приоритет на Ivanov Remonti; QA-019 показва защо промяна на stem matching не се прави без отделно одобрение.

## QA-027 — Site-wide защита от неволно затваряне на попълнена форма
Статус: `VERIFY / SITE-WIDE UX RULE`
Първоначалните joint tests потвърдиха dirty-close fail в Shops и Transport.
Актуалният source към 23.08.2026 вече има dirty-state guard в Health, Transport, Education и Shops: празна форма се затваря директно; при реално въведени неизпратени данни се иска confirm; при потвърдено затваряне формата/validation state се нулират; success state се изчиства отделно. Transport допълнително обработва `Escape` през същия `closeModal()` path; Health също. Тези surfaces са `FIXED - NEEDS INTERACTION RETEST`, докато site-wide QA-027 остава активен за останалите modal-и.
Одобрено правило: ако форма/modal има реално въведени, но неизпратени промени, Cancel/X/равностойно close действие не трябва да ги изхвърля без потвърждение. При `Остани` всички данни се пазят; при потвърдено затваряне формата и старият validation state се нулират. LOCKED flows се променят само с отделно одобрение.

## QA-028 — Типове/тагове трябва да идват от данните, не от твърди автоматични подтабове
Статус: `OPEN / ARCHITECTURE / SITE-WIDE VERIFY`
Потребителят потвърди системния модел: когато запис може да има много конкретни типове (магазин, услуга, заведение и други приложими записи), тези типове не трябва да се измислят като твърди автоматични подтабове в публичната страница. Класификацията трябва да идва от самия запис.
Read-only data/source audit на Shops потвърждава архитектурната разлика:
- `public.shops` вече има структурирани `tags text[]` и `groups text[]`;
- 37+ текущи shop записи са до голяма степен обогатени с tags; construction записите имат и groups (`materials`, `bath`, `metal`, `paint`);
- публичният renderer показва `tags`, construction subfilter използва `groups`, а shop text search включва `tags`;
- текущата `Добави магазин` форма / `shops-catalog-v3.js` insert payload НЕ събира и НЕ изпраща `tags` или `groups`.
Следователно data model вече поддържа класификация, но submission flow не може да я създава последователно. Това е реалният архитектурен gap зад QA-028, не просто визуален проблем с табовете.
Желан модел: основната категория остава отделна; при добавяне/редакция потребителят избира един или повече подходящи типове чрез чекове, специфични за съответната категория, и има възможност да добави допълнителен тип ръчно, когато липсва подходящ готов избор. Избраните/добавените типове се пазят като структурирани tags/types, показват се като ясни тагове върху картата, участват във филтрирането и търсенето и са връзката към QA-026.
Не се допуска един универсален списък от типове за всички категории. Не се допуска и свободното ръчно въвеждане да създава хаос от дублиращи варианти (`боя`, `бои`, `БОЯ`, `boq` и др.); преди implementation трябва да се проектира normalization/alias модел, който пази смисъла на въведеното, но позволява надеждно търсене и дедупликация.
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
Статус: `CLOSED / P3 ACCESSIBILITY / INFO`
Source audit потвърди descriptive close labels за шестте Info detail templates. Production accessibility-tree retest на 23.08.2026 е направен последователно на `zdrave.html`, `transport.html`, `obrazovanie-kultura.html`, `banki.html`, `komunalni.html` и `institucii.html`; на всяка страница close control се обявява с descriptive accessible name (`Затвори съобщението`) и `hasAriaAttribute=true`, вместо като голо `×`. Това конкретно finding е CLOSED. Dirty-close behavior остава отделно QA-027.

# B. 100% HTML INVENTORY / COVERAGE

Repo inventory:
`404.html`, `admin.html`, `avtomobili.html`, `banki.html`, `biskvitki.html`, `dobavi-firma.html`, `dobavi-obqva.html`, `firma.html`, `firmi.html`, `index.html`, `info.html`, `institucii.html`, `kategorii.html`, `komunalni.html`, `kontakti.html`, `magazini.html`, `maistori.html`, `nov-vapros.html`, `nova-parola.html`, `obqva.html`, `obrazovanie-kultura.html`, `obyavi.html`, `poveritelnost.html`, `pravila.html`, `profil.html`, `rabota.html`, `razshiren-profil.html`, `registracia.html`, `sabitiya.html`, `signal.html`, `statia.html`, `statii.html`, `tarsene.html`, `transport.html`, `uslovia.html`, `vapros.html`, `vaprosi.html`, `vhod.html`, `za-nas.html`, `zabravena-parola.html`, `zavedenia.html`, `zdrave-i-lekari.html`, `zdrave.html`.

## Public/core
- `index.html` — `PARTIAL PASS`; nav/cards/questions/firms/listings/articles inspected; QA-006/011; source also contains separate `без лутане` copy to clean. Previous large-diff attempt was fully recovered before continuing.
- `info.html` — `PARTIAL PASS`; 6 sections + quick anchor links; auth header QA-030 CLOSED; intro copy QA-031 CLOSED; transliteration normalization source-fixed and cache-bust-нат → QA-026 production interaction retest pending.
- `kategorii.html` — structure/routes for exact 8 categories checked.
- `firmi.html` — read-only protected list checked.
- `obyavi.html` — intermittent load; filters/categories/search controls visible; active `TELEVIZOR` loads. Locked loader resilience gap documented in QA-006.
- `vaprosi.html` — pending QA question correctly hidden; filters/empty state checked; source no longer loads image uploader → QA-009 fixed pending production dependency retest.
- `statii.html` — one real article linking to `statia.html`; QA-011 home cleanup remains.
- `statia.html` — real article detail sections 1–4 load.
- `tarsene.html` — public labels production retested → QA-021 CLOSED; QA-019 root cause found/LOCKED; QA-020 classified content gap; QA-022/026/028 remain.
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
- Автомивки → Ivanov Remonti + Автомобили → QA-019 exact false-positive root cause found: `мивк` stem inside `автомивки`
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
Шестте subcategory cards са реални search shortcuts към `tarsene.html?q=...`; празният резултат е content gap, не счупен route → QA-020 CLASSIFIED.

### Events
`sabitiya.html`: upcoming-events empty state; Ask question `?category=sabitiya`; четирите subcategory cards са реални search shortcuts към `tarsene.html?q=...`; празният резултат е content gap, не счупен route → QA-020 CLASSIFIED.

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
`magazini.html`: всички 6 tabs са joint-tested live за съдържание. Актуалният source има правилните шест add labels и production current state показа `＋ Добави строителен магазин` → QA-017 fixed pending final tab-by-tab retest. Dirty close и post-success source са поправени, но interaction retest остава QA-001/027. Search exact-match/transliteration остава QA-026. Data audit показва, че tags/groups съществуват и се използват публично, но add form не ги събира → QA-028.

## Info Lom deep read-only
- `zdrave.html`: health sections + anchors + direct phones/official links inspected; add-labels production retested → QA-025 CLOSED; modal close production accessibility PASS → QA-032 CLOSED; post-success/dirty-close interaction retest pending.
- `institucii.html`: final priority content loads; public single-owner staging architecture verified; modal close production accessibility PASS → QA-032 CLOSED; menu source fixed → QA-010 pending final interaction retest; QA-029 remains.
- `transport.html`: validation blur/live-clear joint PASS; current source has success lock + dirty guard + descriptive close label + menu ARIA + Escape close through same guard; modal close production accessibility PASS → QA-032 CLOSED; QA-001/027 interaction retest pending; QA-029 remains.
- `obrazovanie-kultura.html`: current source has success lock + dirty guard + descriptive close label; production accessibility PASS → QA-032 CLOSED; QA-001/027 interaction retest pending.
- `banki.html`: specialized public root; modal close production accessibility PASS → QA-032 CLOSED; QA-029 remains.
- `komunalni.html`: specialized public root; modal close production accessibility PASS → QA-032 CLOSED; QA-029 remains.

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
- `profil.html`: general signal storage/scope classified; heading now explicitly `Моите предложения и сигнали за Инфо Лом` and production retested → QA-013 CLOSED. Password-change form present.

# C. JOINT E2E RECORDS

## QA TEST 1 — Question
`QA TEST 1 — въпрос за изтриване`, category Автомобили.
- submit success in original test; current source still leaves form active after success → QA-001 OPEN
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
General signal QA record е потвърден в DB като `reports.target_type=site`, status `pending`; не е загубен. Current source e-mail validation е field-specific → QA-003 production retest pending.

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
- Info Lom transliteration production interaction retest: `телк` и `telk` след новия normalization layer.
- Dirty-form/post-success interaction retests for Health/Transport/Education/Shops; source fixes are present.
- QA-029 production first-paint observation on representative Info detail pages.
- Contacts valid production submit after backend grant fix.
- Signal missing/invalid e-mail production interaction retest.
- Shops remaining five category CTA live retest; source map is correct.
- Auth: login/register/forgot/new-password invalid/valid behavior and post-submit.
- Admin: protected moderation E2E only with user.
- Guest/non-owner checks: Admin URL, pending listing detail, returned firm preview, expanded editor.
- Mobile/device QA: real phone/device viewport for all template types.
- Visual error colors/focus after real invalid submit.

# F. ROOT-CAUSE / FOLLOW-UP QUEUE
P0 first: QA-029 first-paint retest; QA-006 source resilience risk е classified/LOCKED.
Then P1 Forms: QA-001/002/003/004/027.
Then P1 Search: QA-019 BLOCKED/LOCKED, QA-022, QA-026, QA-028; QA-021 CLOSED.
Then P2/P3: QA-011/017/018/020/025; QA-020 classified content gap, QA-025 CLOSED, QA-017 pending retest, QA-032 CLOSED.
Read-only investigation before risky/protected fixes remains mandatory.

След края на QA поправките се работи от този файл по priority/status. Нищо не става `CLOSED` без production retest.