# Попитай.Лом — V6-C ПЪЛЕН ЖИВОТ НА ФОРМИТЕ / CONTEXT / CLOSE / SUBMIT / SUCCESS / ERROR — ЗАКЛЮЧЕН ДОГОВОР

Статус: **ЗАДЪЛЖИТЕЛЕН V6-C ДОГОВОР / FULL-SITE FORM COMPLETENESS GATE / БЕЗ PRODUCTION ПРОМЯНА**  
Дата: 01.09.2026

Този документ допълва:
- `PUBLIC_PRODUCT_V6_C_FORMS_ROLES_VISIBILITY_LOCK.md`;
- `PUBLIC_PRODUCT_V6_C_FORM_GUIDANCE_VALIDATION_LOCK.md`;
- `PUBLIC_PRODUCT_V6_B9_EXACT_INTERACTION_FORMS_BUTTONS_LINKS_STATES_CONTRACT.md`.

Целта е да не остане нито една форма, която е „технически налична“, но няма ясен живот от отварянето до крайния резултат.

Тук се заключва не само **какво поле има**, а целият поток:

**отворена форма → контекст → попълване → dirty state → затваряне/напускане → inline грешки → обща грешка → изпращане → pending/public success → следващо действие.**

Този документ не променя:
- Supabase schema;
- RLS;
- owners;
- роли;
- квоти;
- approval/direct-publish правила;
- protected ranking;
- Admin/Moderator права.

---

# 1. ОСНОВНО ПРАВИЛО

Във V6 няма право да съществува публична форма с неясно поведение след submit или при напускане.

За всяка форма трябва да има отговор на следните въпроси:

1. Откъде се отваря?
2. Като страница, sheet, modal или inline форма ли е?
3. Какъв контекст вече знае от мястото, от което е отворена?
4. Какво се prefill-ва?
5. Какви примери/подсказки се сменят според категорията?
6. Кога започва да се счита за „dirty“?
7. Какво става при `Отказ`, `Назад`, навигация, Escape, backdrop и затваряне на таб?
8. Как се показва конкретна грешка до поле?
9. Има ли видима обща грешка, ако submit не успее?
10. Пази ли се въведеното при грешка?
11. Блокира ли се повторен submit, докато първият се изпраща?
12. Какво вижда човекът след успешно изпращане?
13. Формата остава ли активна след успех?
14. Каква е разликата normal / Moderator / Admin?
15. Какво е следващото логично действие?

Ако някой от тези отговори липсва, формата не се счита за V6-C complete.

---

# 2. ОБЩАТА STATE MACHINE

Всички mutation/content форми използват една концептуална state machine:

1. `PRISTINE`
   - формата е отворена;
   - няма промени от началното/prefill състояние.

2. `DIRTY`
   - човекът е променил поне една потребителска стойност.

3. `VALIDATING`
   - проверка при blur или submit.

4. `INVALID`
   - има конкретна грешка;
   - формата остава отворена;
   - данните не се губят.

5. `SUBMITTING`
   - submit бутонът е временно disabled;
   - има видимо „Изпращане…“;
   - повторен submit не е възможен.

6. `SERVER_ERROR`
   - червен общ status;
   - конкретният backend/network проблем се обяснява човешки;
   - формата остава отворена;
   - всички въведени стойности остават;
   - submit се активира отново, когато повторният опит е безопасен.

7. `SUCCESS_PENDING`
   - за content, който чака Admin review.

8. `SUCCESS_PUBLISHED`
   - за Admin/direct-publish или друг owner flow, който реално публикува директно.

9. `COMPLETED`
   - editable контролите вече не са активна форма;
   - няма риск от двойно изпращане;
   - dirty guard се изключва;
   - показва се receipt/резултат + следващо действие.

---

# 3. КАКВО ЗНАЧИ „ФОРМАТА СЕ ЗАТВАРЯ СЛЕД УСПЕХ“

Не се допуска след успешно изпращане да остане празна активна форма със същия submit бутон и само малък зелен текст някъде около нея.

Каноничният V6 модел е:

- editable частта на формата **се скрива/заменя** след потвърден success;
- на същото място се показва голям, видим success receipt;
- success receipt има:
  - зелен ✓;
  - ясно заглавие;
  - какво точно е станало;
  - дали чака преглед или е публикувано;
  - следващото логично действие.

Важно:
- page/form screen **не изчезва автоматично**, преди човекът да види резултата;
- modal/sheet **не трябва да се затвори мигновено без receipt**;
- при modal editable form body се скрива, receipt остава в modal-а до `Затвори`;
- така едновременно изпълняваме „формата се затваря“ и „човекът вижда ясно, че е изпратено“.

---

# 4. SUCCESS НЕ Е САМО ЦВЯТ

Успешното изпращане винаги има:
- символ ✓;
- текст `Успешно изпращане` или еквивалентен ясен label;
- конкретно заглавие;
- конкретно обяснение.

Примери:

### Normal / Moderator обява
`✓ Обявата е изпратена за преглед`  
`Обявата не е публикувана автоматично. Администратор ще я прегледа.`

### Admin обява
`✓ Обявата е публикувана`  
`Администраторският запис е публикуван директно.`

### Normal / Moderator фирма
`✓ Фирмата е изпратена за преглед`

### Admin фирма
`✓ Фирмата е публикувана`

### Корекция
`✓ Корекцията е изпратена`  
`Публичната информация не е променена автоматично.`

### Сигнал
`✓ Сигналът е изпратен`

### Контакт
`✓ Съобщението е изпратено`

---

# 5. ERROR НЕ Е САМО ЧЕРВЕНА РАМКА

При submit с проблем има два слоя:

## 5.1. Полева грешка
Непосредствено до конкретното поле:
- `Въведи валиден e-mail адрес.`
- `Телефонът трябва да съдържа 9 или 10 цифри.`
- `Добави още 8 знака.`
- `Избери категория.`

## 5.2. Общ видим status в началото на формата
Пример:

`! Провери формата`  
`Нищо не е изпратено. Поправи отбелязаните полета.`

При backend/network грешка:

`! Не успяхме да изпратим`  
`Данните ти са запазени. Провери връзката и опитай отново.`

Общият status:
- не замества inline грешките;
- стои на видимо място;
- има `role/status` или подходящ live-region;
- не разчита само на червен цвят.

---

# 6. DIRTY / CLOSE GUARD

За дълги content/edit форми предупреждението е задължително.

Dirty guard се активира при реална промяна спрямо началното/prefill състояние.

Проверява се при:
- `Отказ`;
- вътрешна навигация;
- header/mobile navigation;
- breadcrumb;
- затваряне на modal/sheet;
- backdrop;
- Escape;
- browser reload / close tab / външно напускане, доколкото browser API позволява.

V6 in-app текст:

`Има неизпратени промени`  
`Ако напуснеш сега, въведените данни ще бъдат загубени.`

Действия:
- `Остани във формата` — primary;
- `Напусни и изтрий` — destructive secondary.

Не се показва предупреждение:
- ако формата не е променяна;
- след успешен submit;
- след изрично discard;
- за обикновена Search форма.

### Authentication exception
Кратките credential форми `Вход`, `Забравена парола`, `Нова парола` не получават агресивен custom dirty guard, защото:
- не са content submission;
- не трябва да насърчаваме пазене/възстановяване на пароли в UI;
- допълнителното предупреждение създава повече friction, отколкото защита.

`Регистрация` остава предмет на normal field validation; при реална многостъпкова регистрация guard може да се активира, ако потокът стане по-дълъг.

---

# 7. SUBMITTING STATE / ДВОЙНО ИЗПРАЩАНЕ

При submit:
- primary submit button се disabled;
- текстът става `Изпращане…`, `Публикуване…` или контекстен еквивалент;
- не може да се изпрати втори идентичен request;
- при server error бутонът се активира отново;
- при success формата става `COMPLETED`, така че втори submit е невъзможен.

---

# 8. КОНТЕКСТЪТ НЕ ПРАВИ 15 РАЗЛИЧНИ ДИЗАЙНА

Общата структура може да е една:
- heading;
- кратко context explanation;
- form status;
- fields;
- hints;
- field errors;
- actions;
- success receipt.

Разликите са в съдържанието:
- примерите;
- зависимите полета;
- owner-specific info;
- pending/public result;
- специалните проверки.

Това е целта:
**един разпознаваем V6 form system + точен контекст там, където е нужен.**

---

# 9. ОДИТ НА ТЕКУЩИЯ PRODUCTION CODE — ЕДНО ПО ЕДНО

## 9.1. Добави обява
Owner: `supabase-listings.js` + `listing-form-validation-v2.js`.

Вече добро:
- inline validation;
- конкретни телефон/текст грешки;
- counters;
- focus към първата грешка;
- submit disabled при request;
- различен normal/Admin submit;
- след success `showSubmissionResult(...)` заменя съдържанието на формата с result state.

Липса:
- няма общ dirty/leave guard;
- success presentation не е унифициран с останалите форми.

V6:
- запазва доброто;
- добавя dirty guard;
- унифицира receipt/status.

## 9.2. Редактирай обява
Същият owner.

Вече добро:
- form lock докато edit record се зареди;
- owner check;
- pending/needs_changes контекст;
- последната public версия се пази по защитените правила;
- success има отделен edit текст.

Липса:
- няма dirty guard при напускане след промени.

V6:
- задължителен guard;
- edit success receipt различава `редакцията е изпратена` и `промените са публикувани`.

## 9.3. Добави фирма
Owner: `supabase-businesses.js` + `business-form-validation.js` + live validation.

Вече добро:
- field validation;
- конкретни грешки;
- sending status;
- normal/Admin branching.

Проблем:
- след success кодът reset-ва формата и показва success message, но editable формата остава активна/видима;
- няма dirty guard.

V6:
- editable формата се скрива/затваря след success;
- success receipt остава видим;
- добавя dirty guard.

## 9.4. Редактирай фирма
Owner: `business-edit.js` + validation.

Вече добро:
- edit-specific loading;
- media state;
- field validation;
- success текст;
- submit button става `Изпратена` и disabled.

Проблем:
- след success цялата editable форма остава на екрана;
- няма dirty guard.

V6:
- editable area се заменя от receipt;
- dirty guard е задължителен.

## 9.5. Разширен фирмен профил
Не е отделен generic owner — част е от Firm/expanded owner flow.

V6:
- използва същия lifecycle като Firm edit;
- промяна на сайт/услуги/район/visibility checkbox-ове също прави формата dirty;
- optional URL получава конкретна грешка само ако е попълнен невалидно;
- access/right semantics не се променят.

## 9.6. Задай въпрос
Owner: `supabase-content.js` + `question-answer-validation.js`.

Вече добро:
- category-specific examples;
- inline errors;
- duplicate/canonical UX layer;
- success message;
- допълнителният UX слой скрива формата след confirmed success и показва success state.

Липса:
- няма общ dirty/leave guard.

V6:
- запазва текущия добър pattern;
- добавя guard;
- success receipt става визуално общ със системата.

## 9.7. Отговори на въпрос
Owner: `supabase-content.js` + `question-answer-validation.js`.

Вече добро:
- inline validation;
- pending owner flow;
- form is hidden after confirmed success от UX слоя.

Липса:
- няма dirty guard при написан дълъг отговор и навигация.

V6:
- guard;
- видим receipt `Отговорът е изпратен за преглед`.

## 9.8. Health — предложи лекар/практика
Owner: `health-submissions-v1.js` + health validation.

Това е един от най-добрите текущи patterns:
- контекстен тип;
- field errors;
- dirty detection;
- confirm при затваряне;
- form reset;
- form controls се скриват след success;
- success остава в modal;
- има explicit close.

V6:
- **запазва тази логика като референтен модел**;
- само унифицира success/error визуалния език;
- добавя browser-level unload guard в общата система, когато е приложимо.

## 9.9. Health — корекция / сигнал
Същият specialized owner family.

Вече добро:
- различен контекст за текущ проблем и правилна информация;
- dirty close guard;
- form hide after success;
- receipt/close pattern.

V6:
- запазва структурата;
- унифицира status/икони/accessibility.

## 9.10. Магазини — предложи магазин
Owner: `shops-catalog-v3.js` + `shops-form-validation-v1.js`.

Вече добро:
- category context;
- dirty close warning;
- form hidden after success;
- отделен success block;
- close action;
- validation.

Нужда:
- success visual language да стане общият green-check receipt;
- error summary да е еднакво видим като при останалите форми.

## 9.11. Инфо Лом — добавяне/корекция
Owner/UX: specialized Info flow + `info-lom-form-ux-v1.js`.

Вече добро:
- meaningful field validation;
- dirty guard;
- close confirmation;
- form hidden after success;
- success close action.

V6:
- запазва този pattern;
- унифицира status/receipt shell.

## 9.12. Подай сигнал
Текуща страница: `signal.html`.

Вече добро:
- inline field validation;
- submit progress;
- server error text;
- form hidden after success;
- отделен success block.

Липса:
- няма dirty/leave guard.

V6:
- добавя guard;
- унифицира red/green status.

## 9.13. Контакти
Текуща страница: `kontakti.html`.

Вече добро:
- inline validation;
- submit status;
- error state;
- form hidden after success;
- success block.

Липса:
- няма dirty/leave guard.

V6:
- добавя guard за написано съобщение;
- success receipt е общият V6 receipt.

## 9.14. Вход
Owner: auth flow + `auth-form-validation.js`.

Вече добро:
- email/password validation;
- конкретни errors.

V6:
- няма content dirty guard;
- при server/auth error видим red status;
- при success се преминава към Profile;
- никога не се показва false green success преди auth owner да потвърди.

## 9.15. Регистрация
Owner: auth flow + `auth-form-validation.js`.

Вече добро:
- име;
- e-mail;
- password length;
- password confirmation;
- consent errors.

V6:
- success state според реалния auth/email-confirmation owner;
- никакво измислено „готово“, ако backend още чака confirmation.

## 9.16. Забравена / нова парола
Owner: auth flow.

V6:
- request success не разкрива дали даден e-mail има профил;
- текстът е безопасен: `Ако адресът е свързан с профил, ще получиш връзка`;
- new-password form проверява съвпадение;
- няма content dirty guard.

---

# 10. FORM OPEN CONTRACT

## Page-based
Обява / Фирма / Въпрос / Сигнал / Контакт / Auth:
- breadcrumb/context запазва откъде е дошъл човекът;
- category/search CTA може да prefill-ва;
- `Отказ` връща към логичния parent;
- ако има dirty data, `Отказ` първо минава през guard.

## Specialized modal/sheet
Health / Shop / Info correction:
- отваря се в конкретния раздел;
- context се наследява от избрания запис/подкатегория;
- focus отива в първото смислено поле;
- Escape/backdrop/close са dirty-aware;
- след success form body се затваря, receipt остава до explicit close.

## Inline
Answer:
- отваря се в конкретния въпрос;
- не губи контекста на въпроса;
- след success editable textarea изчезва, но receipt остава на място.

---

# 11. NORMAL / MODERATOR / ADMIN RESULT CONTRACT

## Normal
Ако owner flow изисква review:
- green success ≠ public;
- текстът изрично казва `изпратено за преглед`.

## Moderator — own content
Същият result като normal owner:
- няма false `публикувано`;
- няма self-approval;
- няма Admin receipt.

## Admin
Само когато LOCKED owner flow действително е direct publish:
- success казва `публикувано`;
- не показва fake pending.

---

# 12. VISIBILITY / POSITION

Form-level status е:
- преди основните полета;
- вътре в същата content column;
- не като малък toast в далечен ъгъл;
- видим на mobile без човек да търси къде е съобщението.

При invalid submit:
- status се показва;
- viewport отива до първото невалидно поле;
- focus отива в полето.

При success:
- receipt се показва на мястото на формата;
- focus се премества към receipt heading/container;
- receipt се scroll-ва видимо.

---

# 13. ACCESSIBILITY

Задължително:
- `aria-invalid` за грешно поле;
- `aria-describedby` към hint/error;
- `aria-live` за form status;
- success/error имат текст и символ, не само цвят;
- custom unsaved dialog е `alertdialog` / modal;
- focus се управлява при error, success и discard dialog.

---

# 14. C PROTOTYPE IMPLEMENTATION

За C се използва изолиран prototype-only lifecycle слой:

- `v6-prototype/full-site-form-lifecycle-v6.js`
- `v6-prototype/full-site-form-lifecycle-v6.css`

Той:
- централизира dirty detection;
- показва custom discard dialog;
- добавя browser `beforeunload` guard;
- централизира field/error summary;
- централизира progress state;
- скрива editable form след success;
- показва green-check receipt;
- различава pending/published result според представената role semantics;
- доизгражда Contact/Forgot/Reset review states в full-site prototype.

Това е **prototype implementation only**.

---

# 15. PRODUCTION IMPLEMENTATION RULE

V6-D/E не трябва да копира layering/MutationObserver patch-ването от прототипа като permanent architecture.

Production целта е един концептуален owner, например:

`PopitaiFormLifecycle`

който да предоставя:
- dirty state;
- leave guard;
- field/status API;
- submit lock;
- success receipt;
- accessibility behavior.

Owner-specific модули остават отговорни за:
- payload;
- Supabase call;
- roles;
- RLS;
- approval;
- status;
- business logic.

Тоест:

**общ lifecycle owner + specialized data owner.**

---

# 16. C ACCEPTANCE MATRIX

Преди потребителят да бъде помолен за визуална оценка трябва да могат да се прегледат минимум:

1. Обява → празен submit → red summary + field errors.
2. Обява → започнато попълване → Отказ → unsaved warning.
3. Обява normal → success pending receipt.
4. Обява Admin → success published receipt.
5. Обява edit → discard warning + edit-specific receipt.
6. Фирма normal → success hides form.
7. Фирма Admin → published receipt.
8. Фирма edit / expanded edit → dirty guard.
9. Въпрос → category-specific example.
10. Въпрос → success hides form.
11. Отговор → success hides textarea/form.
12. Health add → dirty close + success receipt.
13. Health correction → dirty close + success.
14. Health signal → error/success.
15. Shop → dirty close + success.
16. Info correction → dirty close + success.
17. General report → dirty guard + success.
18. Contact → dirty guard + success.
19. Login → invalid credentials/form error presentation.
20. Registration → password/confirm/consent error presentation.
21. Forgot password → safe success copy.
22. New password → matching-password validation.

---

# 17. GATE

Докато тази матрица не е represented и проверима в full-site prototype:

**V6-C не минава към финален visual polish и V6-D не започва.**

След това визуалната оценка може да променя:
- spacing;
- size;
- typography;
- card/form visual density;
- wording.

Но не може мълчаливо да премахне:
- context;
- dirty guard;
- inline errors;
- visible error summary;
- submit lock;
- success receipt;
- correct pending/public role semantics.
