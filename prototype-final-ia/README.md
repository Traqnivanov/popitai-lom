# Попитай.Лом — Stage 2 safety prototype

Статус: **REMEDIATION IMPLEMENTED / TECHNICAL QA REPORTED / OWNER ACCEPTANCE PENDING / НЕ Е PRODUCTION**

Branch: `prototype/content-complete-ia-20260904-stage2-safety`

Работата е изолирана в `prototype-final-ia/`. Не са променяни production, Supabase, schema, migrations, RLS, RPC, роли, moderation, лимити или LOCKED договори. Stage 3 не е започван.

## Истина за audit статуса

Independent code re-audit беше потвърден като PASS за remediation commit:

`dd69958f10d3d72df16d7b6d70f33017d7a62a24`

Този PASS покрива деветте remediation точки от independent audit. След него има допълнителни prototype-only fixes и content-truth corrections. Те **не се описват като нов independent re-audit PASS**, докато няма отделна независима проверка на текущия HEAD.

Няма attached GitHub workflow/check/status за текущия Stage 2 HEAD. `prototype-regression-audit.js` е текущата кодова evidence/guard матрица, но не се нарича изпълнен GitHub check само защото съществува в repo-то.

## Запазени remediation решения

1. **Shops 6/6** — шестте Shop категории (`Хранителни`, `Строителни`, `Техника`, `Мебели`, `Дрехи`, `Дом`) resolve-ват като Shop съдържание с owner `Shops` и правилните Shop actions.
2. **Авточасти** — остава legacy/backward-compatible mapping за четене, но не е активна стойност за нова Service обява.
3. **Майстори и ремонти** — `#maistori` е отделен силен prototype entry; текущият Stage 2 flow използва точно деветте одобрени ремонтни подкатегории.
4. **Home order** — полезното съдържание и Q&A са разделени по предназначение; въпросите остават fallback, а не водещ вход.
5. **Social Card icon** — тематичните икони идват само от controlled local registry.
6. **Approved media brand** — approved-media композицията има отделена brand лента `Попитай.Лом`.
7. **Info vs Q&A trust** — Q&A е community съдържание; Info Lom е verified-information.
8. **Service family Add** — family-level Add е choose-first; конкретен leaf се избира преди Listing формата.
9. **QA evidence naming** — външен runner/staging run не се нарича attached GitHub check, ако check/status не е attached към самия SHA.

## Последни Stage 2 corrections

След базовия remediation pass са затворени следните доказани prototype дефекти, без production/backend промени:

- Service taxonomy presentation използва един нормализиран owner: 9 structured families + отделен fallback `Друга услуга`;
- `Майстори и ремонти` choose-first използва точно 9-те одобрени ремонтни подкатегории и не връща старите `Монтажи и мебели` / `Къртене и извозване`;
- `Друга услуга` и `Друга ремонтна услуга` минават през controlled `other=1` flow;
- Results няма собствен special-case Add URL builder; contextual Add URL идва от `PopitaiStage2Contracts.contextualAddUrl()`;
- Favorites покрива обяви/услуги, фирми, магазини, заведения, Health, събития, публикации, статии и Info Lom; Questions не са auto-favorite;
- Favorites detail refresh е idempotent и не създава MutationObserver refresh loop;
- logged-out Favorites prompt се чисти при navigation, login/logout и успешна favorite промяна;
- Home mobile renderer е изрично маркиран за 4 основни карти + Auto/Health shortcuts, без скриване на описанията;
- latent fake Publication/Event съдържанието е премахнато от `approved` content слоя, а не само скрито от по-късен override;
- пенсионната статия не съдържа примерни глобални действия `Полезно`, `Коментирай`, `Има промяна?`; остава одобреното Share действие, а Favorites идва от отделния prototype layer;
- коментарите са записани като одобрено бъдещо продуктово изискване, но реализацията им остава OPEN до отделен contract checkpoint.

## Presentation cleanup

Нормалният потребителски изглед не трябва да показва вътрешни термини като `protected`, `owner`, `canonical`, `discovery`, `persist`, `OPEN/LOCKED`, `production contract` или QA обяснения.

Техническите бележки са отделени в default-closed QA панели и се показват само при QA режим.

`#maistori`, Service family chooser, Social Card preview и detail изгледите използват нормален потребителски език.

Emoji и общата визуална icon система не са финализирани в този етап.

## Home / IA truth

Заключеният ред остава:

1. `Обяви и услуги`
2. `Последни обяви и услуги`
3. `Инфо Лом`
4. `Местни фирми` + `Актуално в Лом` само когато има потвърдено current съдържание
5. `Полезни статии`
6. `Не намери отговор? Попитай`

Mobile приоритетът е:

- първите 4 marketplace карти в 2×2;
- Автомобили и Здраве като видими shortcuts;
- Магазини, Заведения и Животни под `Всички категории`;
- името, краткото описание и стрелката не се скриват.

## Task 7 — audit/presentation fixes

Поправени са само в прототипа:

- X бутонът на `+ Добави` modal използва правилния `data-close-add` contract;
- правописната грешка „пубикация“ → „публикация“;
- title/strip presentation шумът е скрит от normal view;
- prototype form validation е изравнена с вече проверените live field правила, без промяна на production формите;
- upload проверките валидират count, max size, MIME и empty/invalid файл;
- price state пази `Подарява` / `Договаряне` / numeric price от противоречив submit;
- Health пази правилото „поне телефон или адрес“;
- first-error focus, dirty state, `beforeunload`, success focus и repeat-submit block са в prototype interaction owner-а;
- `+ Добави` modal има opener memory, initial focus, focus trap, Escape, backdrop close, background inert, body scroll restore и focus return.

## Content truth pass

Няма потвърдена реална Публикация или предстоящо Събитие за текущия prototype view. Затова `#aktualno` показва честно empty state вместо измислени live записи.

`PopitaiApprovedContent.publications` и `events` са празни. Neutral Publication/Event records могат да съществуват само като ясно технически QA records за route/social-card evidence и не се представят като публично одобрено съдържание.

Добавен е предоставеният source материал:

**„Пенсиониране в Лом — къде се обслужвате и какво трябва да знаете“**

Prototype route:

`#detail/article?record=article-pension`

Той остава **Статия → Пенсии → Ръководство**, а не Публикация. Detail изгледът включва НОИ Лом, кога се налага Монтана, пенсионните условия, документи, важния срок и източника. В текущия Stage 2 detail е оставено само вече одобреното Share действие; „Любими“ се добавя от отделния prototype Favorites слой.

## Коментари — продуктово изискване

**APPROVED REQUIREMENT / IMPLEMENTATION OPEN:** коментари трябва да има по принцип при съдържание, за което общностна дискусия е подходяща, включително статии и публикации.

Това изискване **не е отхвърлено**. То умишлено не се представя като работеща система в текущия Stage 2 prototype, защото реалната реализация трябва първо да има изрично одобрен contract за:

- кой може да коментира и дали е нужен вход;
- moderation / approval / hide / delete / report;
- ownership и права за редакция/изтриване;
- статуси и видимост;
- връзка `content_type + content_id + user_id` или друг окончателно одобрен модел;
- известия и follow логика, ако изобщо бъдат включени;
- backend, RLS и anti-abuse правила.

Докато този contract не бъде одобрен, не се добавя фалшива comments форма и не се променят production moderation/backend правилата. Реализацията остава отделен бъдещ checkpoint.

## Service Add contract

За family-level Add:

`service family → choose-first family route → concrete service leaf → Listing form`

Persisted type mapping остава:

- `Предлагам услуга` → `Дава`
- `Търся изпълнител` → `Търси`

`Друга услуга` не се представя като нов structured leaf: избира се най-близка family група и задължително се попълва `Каква услуга?`.

Exact service leaf persistence/reconstruction след реален submit остава **OPEN / LOCKED**. `58/58` означава mapping coverage, не end-to-end persistence.

## Info Lom / Health

Инфо Лом има шест различими prototype routes/records:

- Здраве
- Институции
- Транспорт
- Образование и култура
- Банки и банкомати
- Комунални услуги

Не се добавя `Полезни телефони`.

Health публичният Add CTA не обещава обща „здравна услуга“. Текущият read-only production owner contract е ограничен до:

- Лекар
- Стоматолог
- Ветеринар

По-широк generic health-service flow остава OPEN/LOCKED.

## Social Card semantic contract

Петте общи visual compositions остават:

- marketplace
- profile
- editorial
- event
- community

Semantic ролите остават отделни, включително:

- Q&A → `community`
- Info Lom → `verified-information`
- Shops → `specialized`

Share/media evidence различава:

- approved-media state;
- themed template;
- Lom fallback;
- blocked sharing.

Query параметър не може да превърне record без одобрена media в record с „реална“ approved media.

Production Facebook/Open Graph delivery и реално image generation/storage остават OPEN.

## Favorites contract truth

Текущият Favorites е **prototype-only UI/session behavior**:

- състоянието е само в in-memory `Map`;
- няма `localStorage`, `sessionStorage` или Supabase write;
- logged-out човек получава вход към профила;
- Saved се групира по content type;
- запис може да се премахне;
- Questions не са automatic favorite.

Реалният storage/login/RLS contract остава отделен approval checkpoint. Prototype UI не се представя като production persistence.

## QA evidence

`prototype-regression-audit.js` съдържа evidence guards за:

- Ownership — Social Card renderer/CSS/contextual Add owner и load order;
- end-to-end prototype paths — ВиК, Кетъринг, Работа, Имоти, Автомобили, Животни, Магазин, Health, Article, Publication, Event + шестте Info Lom routes;
- Share/media states — approved, template, Lom fallback, blocked и hostile query;
- Forms — field validation, uploads, price conflicts, Health cross-field, dirty protection, success lifecycle, repeat-submit block;
- Accessibility — `+ Добави` modal contract и 390px static layout guards;
- Isolation — diff срещу owner checkpoint `0b1492386b68b7f918685828c9fdd64079f24677`.

Важно разграничение:

- **attached GitHub check** — само ако GitHub API показва check/status на конкретния SHA;
- **external/staging QA** — runner или staging branch върху същите blobs/diff;
- **browser QA** — реално отваряне и взаимодействие с exact-SHA preview;
- **independent re-audit** — отделна независима проверка.

За последния runtime checkpoint преди този handoff (`4b9a3330e4b69470e5d7a10169be2ae16f9af65e`) GitHub API не показва attached workflow/check/status. В текущата среда headless Chromium няма DNS достъп до GitHub/raw.githack, затова **не е изпълнен нов exact-SHA interactive Chromium run на последния HEAD**. По-ранните browser/staging проверки не се прехвърлят автоматично като PASS към по-нов SHA.

## Isolation

Последният compare срещу owner checkpoint:

`0b1492386b68b7f918685828c9fdd64079f24677`

показва `ahead`, `0 behind` и всички changed files само под:

`prototype-final-ia/`

Няма production/Supabase/schema/RLS/RPC/LOCKED файл в diff-а.

## OPEN / LOCKED / pending

Остават OPEN и не са имплементирани по предположение:

- comments system contract и реална comments реализация;
- exact service leaf persistence/reconstruction;
- production Facebook/Open Graph crawlable delivery;
- реално генериране/съхраняване на social изображения;
- избор на Edge Function / Worker / Storage / backend architecture за social images;
- production taxonomy migration;
- по-широк public flow за **„здравна услуга“** извън текущите doctor/dentist/vet owners;
- production-wide icon replacement;
- real Favorites storage/login/RLS contract;
- нов exact-SHA interactive browser acceptance за текущия HEAD;
- Stage 3.

Отделни pending checkpoints:

- **Икони** — owner visual approval pending; без mass replacement.
- **Любими** — UI/coverage е prototype-only; persistence остава отделен approval checkpoint.
- **Коментари** — requirement е одобрено, implementation contract не е.

## Финален статус

Stage 2 не се обявява автоматично за приет.

Допустимият статус остава:

`REMEDIATION IMPLEMENTED / TECHNICAL QA REPORTED / OWNER ACCEPTANCE PENDING / НЕ Е PRODUCTION`
