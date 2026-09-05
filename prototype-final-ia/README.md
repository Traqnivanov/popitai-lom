# Попитай.Лом — Stage 2 remediation

Статус: **REMEDIATION IMPLEMENTED / TECHNICAL QA REPORTED / OWNER ACCEPTANCE PENDING / НЕ Е PRODUCTION**

Branch: `prototype/content-complete-ia-20260904-stage2-safety`

Remediation base: `b5d748fac93a70bd57adf22159a30defe5c3de50`

Isolation owner checkpoint: `0b1492386b68b7f918685828c9fdd64079f24677`

Този pass поправя потвърдените Stage 2 safety prototype дефекти. Не променя production файлове, Supabase, schema, migrations, RLS, RPC, роли, ownership, moderation, лимити, LOCKED договори или основната IA. Stage 3 не е започнат.

## 1. Ownership след remediation

- `prototype-social-card-composer.js` е единственият Social Card renderer.
- `prototype-remediation.css` е единственият Social Card CSS owner.
- Старите Social Preview renderer/CSS функции и runtime overwrite през `window.socialPreview` са премахнати.
- `PopitaiStage2Contracts.contextualAddUrl()` е единственият owner за contextual Add URL.
- Discovery дървото остава UX слой; backend compatibility mapping-ът остава отделен contract слой.
- `58/58` е само coverage на реалните Stage 2 service discovery leaves. `Авточасти` е legacy/canonical helper в mapping object-а и не се брои като 59-и discovery leaf.

## 2. Data-driven Social Card

Mock content record-ите са отделени в `prototype-records.js`. Composer-ът не избира сам demo сценарий и не чете route/query параметри за content selection.

Валидираният Social input съдържа:

`contentType`, `title`, `description`, `category`, `discovery`, `visualTheme`, `icon`, `accent`, `mediaAvailable`, `mediaType`, `canonicalUrl`, `location`, `shareEligible`, `facebookText`, `composition`.

Detail heading и Social title се получават от един и същ record. При празно title fallback-ът се изчислява от контекста; реалният route пример е `Почистване → Почистване в Лом`.

Image selection е production-like и не може да бъде подменен от URL параметър:

1. `mediaAvailable=true` → approved media slot;
2. иначе, ако има `visualTheme` → тематичен template;
3. иначе → Lom fallback.

`shareEligible=false` връща нито Share action, нито Social Card. QA simulation бутоните са отделен disclosure control и само обясняват как би изглеждало друго ниво; не променят действителния selection алгоритъм и не създават медия.

Facebook teaser текстът остава отделен човешки текст над линка. `canonicalUrl`, домейнът и metadata се подават от record-а, а не са hardcoded в renderer-а.

## 3. Context path

Резултатите носят контролиран record/context до detail, Social Card и Add:

`source category → results → detail record → social title/category → contextual Add URL/form`.

Покритите критични примери са ВиК, Кетъринг, Работа, Имоти, Автомобили, Животни, Магазин, Health, Статия, Публикация, Събитие и шестте Info Lom раздела.

При service leaf exact leaf остава видим discovery context. Compatibility adapter отделно показва какво може да се запише в текущия production договор. При service family се пази поне family context. Не се заявява, че exact leaf persistence/reconstruction е решен.

## 4. Forms

Prototype forms имат действителни проверки за:

- required, minlength, maxlength;
- number/min/max/step;
- български телефон;
- checkbox consent и select;
- focus към първата грешка;
- `label/for`, `aria-describedby`, `aria-invalid`;
- file count, размер до 10 MB на файл, JPG/PNG/WebP MIME и zero-byte файл;
- upload грешка до upload секцията и focus към нея;
- запазване на останалите въведени стойности;
- dirty state при избор и премахване на файл;
- `Подарява` / `Договаряне` / числова цена без противоречиви състояния;
- Health: поне телефон или адрес, със синхронно изчистване на двете cross-field грешки;
- success lifecycle и блокиране на повторен submit;
- dirty protection при hash/link navigation и `beforeunload` за refresh/close.

## 5. Add modal accessibility

Modal-ът:

- запомня точния opener;
- фокусира първия подходящ контрол;
- има Tab/Shift+Tab focus trap;
- се затваря с Escape и backdrop;
- връща focus към същия opener;
- поставя background областите в `inert` + `aria-hidden` докато е отворен;
- заключва и възстановява body scroll;
- не заобикаля общата dirty navigation protection при hash линкове.

## 6. Инфо Лом

Има шест различими prototype records/routes и не е добавян раздел „Полезни телефони“:

1. Здраве — `info-health`;
2. Институции — `info-institutions`;
3. Транспорт — `info-transport`;
4. Образование и култура — `info-education`;
5. Банки и банкомати — `info-banks`;
6. Комунални услуги — `info-utilities`.

Production Info Lom данните не са променяни.

## 7. Health production-contract граница

Read-only проверката на действащия production owner потвърди три submission типа: лекар/медицинска практика (`doctor`), стоматолог/дентална практика (`dentist`) и ветеринар/кабинет (`vet`). Няма отделен backend тип за обща „здравна услуга“ и няма безопасен контролиран „Друго“.

Затова prototype CTA е коригиран на **„Добави лекар / практика“**. Конкретна услуга се описва в съществуващото поле „Специалност / основна услуга“ и описанието. Няма schema/RLS/RPC промяна.

## 8. Visual checkpoint — OWNER APPROVAL PENDING

`#visual-icons` показва само осемте критични понятия с реални локални **Phosphor Icons — Duotone** SVG файлове:

Услуги, Ремонти, Животни, Автомобили, Здраве, Комунални услуги, Статии, Публикации.

SVG geometry идва от официалния Phosphor пакет; зададен е тъмносин основен цвят `#0b2f56`. Показани са увеличен размер и реален малък card размер. Файловете са MIT лицензирани; лицензът е запазен в `icons/LICENSE-PHOSPHOR.txt`.

Това е ограничен checkpoint. Няма масова icon подмяна и тези икони не се обявяват за визуално одобрена финална система преди owner approval.

## 9. Technical QA evidence matrix

### A. Ownership — PASS

- един Social Card renderer;
- един Social Card CSS owner;
- един contextual Add URL owner;
- няма `window.socialPreview` overwrite или legacy Social renderer/CSS selectors.

### B. End-to-end prototype paths — PASS за prototype route/context; persistence boundary остава OPEN

Проверени са контролирани records/routes за: ВиК, Кетъринг, Работа, Имоти, Автомобили, Животни, Магазин, Health, Статия, Публикация, Събитие и шестте Info Lom раздела.

### C. Share/media states — PASS за prototype selection

- eligible + approved media;
- eligible + template;
- eligible + Lom fallback;
- blocked;
- route/query параметър не може да създаде несъществуваща approved media.

### D. Forms — PASS за prototype validation

Проверени са required/field validation, file count/size/MIME/empty file, conflicting price states, Health cross-field state, dirty protection, success lifecycle и repeat-submit blocking.

### E. Accessibility — PASS за remediation DOM/keyboard contract

Headless Chromium DOM/keyboard QA върху inlined remediation bundle потвърди initial focus, focus trap, Escape, backdrop, exact focus return, inert background, body-scroll restore, field-error focus и 390 px changed-layer без horizontal overflow. Базовият `styles.css` не е променян от този remediation pass.

### F. Isolation — трябва да се потвърди от final Git compare след commit

Final compare трябва да показва само `prototype-final-ia/`. Временните локални QA harness файлове не са част от commit-а.

## 10. QA метод

Доказателствата не се основават на брой тестове. Използвани са:

- `node --check` за всички променени JS модули;
- VM contract/render assertions върху реалните prototype helpers/records/routes;
- static ownership/legacy-symbol scan;
- headless Chromium DOM/keyboard assertions върху действителните променени HTML/JS/CSS файлове.

## 11. Критични prototype routes

Отвори `prototype-final-ia/index.html` от този branch и добави съответния hash:

- ВиК: `#results?context=Услуги&group=ВиК&detail=listing&owner=Listings`
- Кетъринг: `#results?context=Услуги&group=Кетъринг&detail=listing&owner=Listings`
- Работа: `#results?context=Работа&group=Строителство%2C%20ремонти%20и%20техници&detail=listing&owner=Listings&type=Предлага%20работа`
- Имоти: `#results?context=Имоти&group=Апартамент&detail=listing&owner=Listings&type=Продава%20имот`
- Автомобили: `#results?context=Автомобили&group=Автомобили%20и%20джипове&detail=listing&owner=Listings`
- Животни: `#results?context=Животни&group=Осиновяване%20%2F%20търси%20дом&detail=listing&owner=Listings`
- Магазин: `#results?context=Магазини&group=Хранителни&detail=firm&owner=Shops`
- Health: `#results?context=Здраве%20и%20лекари&group=Специалисти&detail=health&owner=Health%2FInfo`
- Статия: `#detail/article?record=article-guide`
- Публикация: `#detail/publication?record=publication-update`
- Събитие: `#detail/event?record=event-local`
- Почистване title fallback: `#detail/listing?record=listing-cleaning`
- blocked Share: `#detail/publication?record=publication-blocked`
- approved-media selection: `#detail/firm?record=firm-repairs`
- template selection: `#detail/listing?record=listing-vik`
- Lom fallback: `#detail/info?record=info-utilities`
- Info Здраве: `#detail/info?record=info-health`
- Info Институции: `#detail/info?record=info-institutions`
- Info Транспорт: `#detail/info?record=info-transport`
- Info Образование и култура: `#detail/info?record=info-education`
- Info Банки и банкомати: `#detail/info?record=info-banks`
- Info Комунални услуги: `#detail/info?record=info-utilities`
- Icon checkpoint: `#visual-icons`

## 12. OPEN / FAIL / LOCKED — не са обявени за решени

- exact service leaf persistence/reconstruction;
- production Facebook/Open Graph crawlable delivery;
- реално генериране и съхраняване на 1200×630 изображения;
- избор на Edge Function / Worker / Storage / backend architecture;
- production taxonomy migration;
- Content Master V3 official docs-only checkpoint;
- обща смяна на иконите в production;
- Stage 3.

Owner acceptance остава pending. Този README не превръща Stage 2 в приет или production-ready.
