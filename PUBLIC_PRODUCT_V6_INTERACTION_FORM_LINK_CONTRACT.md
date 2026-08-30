# Попитай.Лом — V6 INTERACTION / FORMS / BUTTONS / LINKS CONTRACT

Статус: **DRAFT DESIGN GATE / NO PRODUCTION CODE**  
Branch: `v6-product-foundation-draft`  
Актуализирано: 31.08.2026

Този документ пази една от най-често повтаряните грешки в предишни етапи: отделни екрани да изглеждат добре, но бутон, линк, форма, edit/create flow, validation, success/error state или mobile поведение да не е съгласувано с останалата система.

Той **не заменя** правилата в `PROJECT_RULES.md`. Надгражда ги с единен V6 interaction contract.

---

## 1. ОСНОВЕН ПРИНЦИП

V6 не се приема за добре проектиран само защото taxonomy, search или визуалният екран изглеждат правилно.

Всеки важен екран трябва да е проверен като **завършен user flow**:

`откъде идва човекът → какво вижда → какво натиска → какво се попълва → какво се валидира → кой owner записва → какъв status следва → какво вижда при успех/грешка → къде отива после`.

Няма „само бутон“ и няма „само форма“. Всеки интерактивен елемент има цел, owner и крайно поведение.

---

## 2. ЗАПАЗВАМЕ СЕГАШНАТА ДОБРА ОСНОВА

Съществуващите правила остават валидни:

- интерфейсът е на ясен естествен български;
- текстът помага за следващото действие;
- грешката се показва конкретно и до правилното поле;
- въведеното не се губи при грешка;
- след поправка грешката изчезва веднага;
- при submit се валидират всички приложими полета;
- фокусът се насочва към първата реална грешка;
- структурирани полета се валидират според реалния тип;
- критичната валидация не остава само във frontend;
- mobile-first;
- не се товарят ненужни scripts/data.

V6 добавя обща дисциплина за **бутоните, линковете, state-овете и връзката между различните форми/owner-и**.

---

## 3. BUTTON CONTRACT

### 3.1 Един бутон = едно ясно действие

Надписът трябва да описва резултата:

- `Публикувай обявата`;
- `Изпрати за одобрение`;
- `Запази промените`;
- `Задай въпроса`;
- `Сподели`;
- `Копирай линк`.

Избягват се неясни CTA като `Продължи`, `ОК`, `Готово`, когато следващото действие не е очевидно от контекста.

### 3.2 Ясна йерархия

На един екран трябва да е очевидно кое е:

- основно действие;
- вторично действие;
- cancel/back;
- destructive действие.

Не се показват няколко визуално равни основни CTA за различни цели без причина.

### 3.3 State-ове

Всеки submit/action бутон, където е приложимо, има определени:

- default;
- hover/focus;
- disabled;
- loading/submitting;
- success transition;
- error recovery.

При submit се предотвратява double-submit и многократно създаване на един и същ запис.

### 3.4 Protected actions

Видимостта на Admin/Moderator/owner бутон **не е security boundary**. Backend/RLS/RPC трябва независимо да откаже непозволено действие.

---

## 4. LINK CONTRACT

### 4.1 Link vs button

- навигация към URL = реален link;
- действие върху текущото състояние = button;
- не се правят кликаеми `div` елементи без нужда;
- keyboard/accessibility поведението трябва да е естествено.

### 4.2 Няма dead links

Всеки public link преди release се проверява:

- destination съществува;
- правилният owner/екран се отваря;
- query params/prefill се запазват;
- edit URL не се превръща в create flow;
- backward-compatible URLs не се чупят;
- няма линк към placeholder, който изглежда като готова функция.

### 4.3 Context preservation

Когато човек идва от search/category/question/article, следващият flow пази полезния контекст, когато е безопасно:

- search query;
- category/subcategory;
- intent `Предлагам/Търся`;
- related topic;
- source page за нормално връщане.

Не караме човека да въвежда повторно нещо, което вече знаем надеждно.

---

## 5. FORM CONTRACT

### 5.1 Минимална форма за конкретната задача

Формата показва само полетата, които са нужни за текущия flow.

Допълнителните полета се показват чрез progressive disclosure или след правилен избор, а не като giant universal form.

### 5.2 Create и Edit са различни states

За всяка форма изрично се проверява:

- create;
- edit;
- resubmit след корекция;
- owner/admin direct publish, ако е разрешено;
- pending moderation;
- rejected/returned state;
- blocked/unauthorized state.

Edit flow никога не трябва тихо да създава нов запис.

### 5.3 Prefill

Prefill е помощ, не скрита истина.

- стойността се вижда от потребителя;
- може да бъде коригирана, ако business rules го позволяват;
- protected field не става editable само защото е подаден в URL;
- query params не заобикалят validation/permissions.

### 5.4 Validation

За всяко поле се определя:

- кога се валидира;
- exact allowed value;
- local error text;
- backend equivalent;
- normalize/trim behavior;
- optional vs required според конкретния flow.

Не се използва една generic validation функция, ако реалните бизнес правила са различни.

### 5.5 Данните не се губят

При:

- frontend validation error;
- backend reject;
- временна network грешка;
- moderation correction flow

потребителят не трябва без нужда да въвежда всичко отначало.

### 5.6 Success не е само „успешно“

След submit се казва ясно какво реално се е случило:

- публикувано веднага;
- изпратено за одобрение;
- запазено като draft;
- редакцията чака review;
- въпросът ще може да се сподели след approval.

След това има конкретно следващо действие.

---

## 6. STANDARD SCREEN / FLOW RECORD

За всеки важен V6 екран в CURRENT→TARGET/prototype inventory се записва минимум:

- **ENTRY:** откъде се отваря;
- **USER GOAL:** какво иска да постигне човекът;
- **PRIMARY CTA:** един основен next action;
- **SECONDARY ACTIONS:** само полезните;
- **LINK TARGETS:** exact destinations;
- **AUTH:** anonymous / signed-in / owner / moderator / admin;
- **OWNER:** кой JS/data/backend owner държи действието;
- **FIELDS:** само приложимите;
- **PREFILL:** какъв контекст се носи;
- **VALIDATION:** frontend + backend;
- **SUBMIT:** какво реално се извиква/записва;
- **STATUS:** approved/pending/draft/rejected/etc.;
- **SUCCESS:** какво вижда човекът;
- **ERROR:** как се възстановява;
- **BACK/CANCEL:** къде се връща без загуба;
- **MOBILE:** keyboard, sticky CTA, scroll/focus;
- **ACCESSIBILITY:** label/focus/status announcement;
- **ANALYTICS:** само полезните interaction events;
- **PERFORMANCE:** какво се зарежда и кога.

Екран без този flow record не се счита за финално специфициран.

---

## 7. CROSS-FLOW CONSISTENCY

Едно и също действие трябва да има еднаква логика навсякъде.

Примери:

- `Добави обява` от home/category/search трябва да стига до същия protected create owner, само с различен валиден prefill;
- `Задай въпрос` от search/Health/Construction трябва да използва един и същ question owner/moderation flow;
- `Редактирай` от profile и detail page трябва да води към един и същ edit contract;
- `Сподели` трябва да има еднакви fallback правила;
- `Докладвай`, `Предложи корекция`, `Изпрати за одобрение` не трябва да сменят semantics между секциите.

Визуалната адаптация по owner е допустима; бизнес значението не се променя случайно.

---

## 8. EMPTY / LOADING / ERROR / PENDING STATES

За всеки dynamic screen се проектират, не се оставят за накрая:

- loading;
- no results;
- no content yet;
- partial data;
- network error;
- unauthorized;
- pending moderation;
- rejected/needs correction;
- removed/expired;
- stale information, когато е приложимо.

Empty state трябва да предлага правилното следващо действие, не да е празна карта.

---

## 9. MOBILE INTERACTION GATE

Форма/flow не е проверен само защото responsive CSS съществува.

Реално се проверява на mobile viewport:

- полетата и клавиатурата;
- input type/autocomplete;
- scroll към грешка;
- sticky CTA да не закрива съдържание;
- modals/sheets;
- dropdown/select;
- touch target;
- back navigation;
- upload/photo flow;
- submit/loading;
- success/error;
- browser back/refresh, когато е релевантно.

---

## 10. UX COPY GATE

Преди код/approval за всеки важен flow се проверяват:

- title;
- field labels;
- helper text;
- CTA text;
- validation messages;
- moderation status text;
- confirmation text;
- empty/error state;
- destructive confirmation.

Текстът трябва да е кратък, естествен и специфичен за задачата.

---

## 11. INTERACTION QA MATRIX ПРЕДИ PRODUCTION

За всеки implementation slice задължително се тества минимум:

1. всички нови/променени links;
2. всички CTA buttons;
3. create flow;
4. edit flow;
5. invalid form;
6. valid form;
7. double-submit protection;
8. backend refusal/permission path;
9. pending/moderation state;
10. success state;
11. empty/error state;
12. desktop;
13. real mobile viewport;
14. keyboard/focus;
15. protected regression;
16. back/refresh/context preservation, където е приложимо.

Не се приема „бутонът се вижда“ за QA на бутона.

---

## 12. ВРЪЗКА С V6 STAGES

### V6-A — Inventory

При CURRENT→TARGET за всеки owner се записват и текущите forms/buttons/links/entry points и известните contradictions.

### V6-B — Product contracts

Заключват се semantics, permissions, state transitions и destinations.

### V6-C — Visual/interaction prototype

Прототипът задължително показва важните states, а не само happy-path screenshots.

### V6-D — Technical design

Frontend behavior се съпоставя с backend/RLS/RPC/schema owner-а.

### V6-F — Implementation

Всеки slice минава interaction QA matrix.

---

## 13. DEFINITION OF DONE — INTERACTION

Един flow е `ПРОВЕРЕНО ГОТОВ` само ако:

- човекът разбира какво да направи;
- основният CTA води до правилния резултат;
- няма dead/грешен link;
- create/edit не се смесват;
- validation е точна frontend + backend;
- input не се губи при поправима грешка;
- permissions/moderation са правилни;
- success/pending/error са ясни;
- mobile е реално проверен;
- accessibility/focus са проверени;
- няма double-submit/duplicate side effect;
- performance impact е приемлив;
- analytics не събира излишни данни;
- protected owner logic е непроменена, освен ако има отделно одобрена промяна.

**Визуално готов екран ≠ готов user flow.**