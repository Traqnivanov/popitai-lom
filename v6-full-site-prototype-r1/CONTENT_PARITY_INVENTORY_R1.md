# Попитай.Лом — CONTENT PARITY INVENTORY R1

Статус: **AUDIT / PROTOTYPE-ONLY / NO PRODUCTION CHANGE**  
Дата: 03.09.2026  
Evidence source: `v6-product-foundation-draft`  
Runtime branch: `v6-full-site-prototype-r1`

## 1. Цел

Този inventory проверява дали full-site prototype R1 представя реалния обхват на сайта, без да заменя истинско съдържание с няколко демонстрационни карти и без да представя mock данни като реални текущи записи.

Правилото е от `PUBLIC_PRODUCT_V6_CONTENT_INVENTORY_RULE.md`: наличен файл или стара дискусия не означава `ПРОВЕРЕНО ГОТОВО`. За всяка повърхност се пазят owner, реален content scope, prototype status и следващото безопасно действие.

## 2. Статуси за parity

- **PARITY OK** — R1 представя правилно реалната функция и достатъчен content scope.
- **TOO THIN** — owner/разделът е правилен, но R1 е свил реалното съдържание прекалено много.
- **REPRESENTATIVE MOCK** — примерни данни са допустими само за interaction/ranking QA и не трябва да изглеждат като реални текущи записи.
- **REAL SOURCE AVAILABLE** — в repo има реални current/approved source данни, които могат да захранят review prototype-а.
- **DYNAMIC OWNER** — публичната истина идва от Supabase/owner; офлайн прототипът не трябва да измисля реални записи.
- **FUTURE / NOT PUBLIC** — идея или бъдеща функция; не се показва като текущо публикувано съдържание.
- **FORBIDDEN FAKE** — не трябва да се измисля функция/съдържание само за да изглежда разделът пълен.

## 3. Global surfaces

| Surface | Real owner/source | R1 status | Решение |
|---|---|---|---|
| Home | composition of public owners | **TOO THIN / MIXED MOCK** | Home трябва да показва реалния тип съдържание, но само реалната публикувана статия; mock listings/firms/questions се маркират като prototype review data. |
| Обяви и услуги | Listings + specialized read composition | **REPRESENTATIVE MOCK** | Mock records са допустими за 5-entry IA, filters, ranking и forms QA; не се твърди, че са live listings. |
| Фирми | Firms owner | **REPRESENTATIVE MOCK** | Иванов protected example може да остане за ranking/profile QA; останалите измислени фирми не се представят като реални local firms. |
| Магазини | Shops owner | **REPRESENTATIVE MOCK / REAL DYNAMIC OWNER** | R1 тества tabs/search/add flow, но mock shop names не са current catalog truth. |
| Заведения | Firms category `Заведения` | **REPRESENTATIVE MOCK** | Не се създава втори restaurant datastore. |
| Събития | Events owner | **REPRESENTATIVE MOCK / NO PUBLIC ADD** | Не се показват измислени събития като текущи реални събития. Няма fake Add Event. |
| Въпроси | Q&A owner | **REPRESENTATIVE MOCK** | Mock въпроси са за ask/answer/search QA; не са live community history. |
| Статии | Editorial files | **R1 INCORRECT** | Реално публикуваната страница има 1 статия; двата допълнителни R1 article cards не трябва да изглеждат публикувани. |
| Инфо Лом | specialized Info owners | **TOO THIN** | Тук representative generic cards не са достатъчни, защото repo има значително реално проверено съдържание. |

## 4. Статии — exact current parity

Реалният `statii.html` съдържа една статия:

**„Как да избереш майстор и да избегнеш неприятни изненади“**

`statia.html` съдържа:

1. `Опиши точно работата` — какво трябва да се направи, материали и срок;
2. `Поискай подробна оферта` — труд и материали отделно, какво не е включено;
3. `Провери реални препоръки` — мнения от хора, които действително са използвали услугата;
4. `Не плащай всичко предварително` — плащане на разумни етапи срещу завършена работа.

R1 в момента има още две cards:
- `Как да подадеш сигнал до община или институция`;
- `Как да публикуваш добра обява`.

Те са **future/content candidates**, не доказано публикувани статии. Не трябва да участват в public Articles list/Home като равностойни текущи статии, докато не минат content QA по inventory правилото.

## 5. Health / Здраве

### Real owner

`health-catalog-v2.js` не съдържа статичен истински списък на специалистите. Той чете `info_entries` за published:
- doctor;
- dentist;
- vet;
- hospital_department;
- medical_center.

Показва Лекари / Лични лекари / Специалисти / Стоматолози / Ветеринари и извежда reliability/status/address/phone само според данните и правилата за безопасност.

### R1 consequence

Трите R1 записа `Д-р Мария Иванова`, `Дентална практика Дунав`, `Ветеринарен кабинет Лом` са **mock**, не authoritative Health data. Те не трябва да носят copy, което може да се прочете като реално потвърждение. Офлайн прототипът трябва да ги маркира като `Примерен запис за преглед на интерфейса` или да използва explicit empty/dynamic-owner state.

Health dual-owner contract остава:
- verified specialist/practice → Health/Info;
- temporary offer/seek service → Listings;
- няма auto-copy;
- health listing mock не е `потвърден специалист`.

## 6. Транспорт — REAL SOURCE AVAILABLE

`info-lom-transport-v1.js` съдържа реално структурирано съдържание, значително повече от една generic R1 карта.

### Автогара Лом
- адрес: `ул. „Хан Аспарух“ №5, Лом`;
- потвърждение: официална публикация на Юнион Ивкони от 07.04.2026;
- информация за пътуване: `0889 490 000`;
- централен телефон: `02 989 0000`;
- e-mail: `support.bg@union-ivkoni.com`;
- показани линии Лом ↔ София и предупреждение за повторна проверка преди пътуване.

### ЖП гара Лом
- адрес: `ул. „Пристанищна“ №43, Лом` в текущия specialized owner;
- телефон: `0887 398 610`;
- работно време: `04:00–21:15`;
- официални действия към разписание и live движение на БДЖ.

### Такси
- `Експрес такси – Лом`;
- `0897 200 838`;
- `Лом и района`;
- owner copy казва, че не публикува непроверени таксита от каталози.

### R1 status

**TOO THIN**. Транспортът трябва да има поне трите реални подповърхности и основните действия, вместо една generic информация.

Отделно остава form audit blocker: legacy generic owner има `Добави такси`, specialized Transport owner няма. Не се възстановява без authority reconciliation.

## 7. Образование и култура — REAL SOURCE AVAILABLE

`info-lom-education-v1.js` е single renderer и съдържа:

- 8 училища;
- 7 детски градини;
- 4 читалища;
- 1 библиотека;
- 1 музей;
- 3 школи/курсове.

Тоест минимум **24 структурирани записа** в този owner.

Примери от source-а:
- Първо ОУ „Никола Първанов“;
- Второ ОУ „Константин Фотинов“;
- IV ОУ „Христо Ботев“;
- СУ „Отец Паисий“;
- СУ „Димитър Маринов“;
- ПГ „Найден Геров“;
- ПГ по производствени технологии;
- ПГХЗ „Дмитрий Иванович Менделеев“;
- ДГ №1 „Снежанка“ … ДГ №14 „Пчелица“;
- НЧ „Постоянство-1856“;
- Исторически музей – Лом;
- Ломска читалищна библиотека;
- Училища ЕВРОПА – Лом.

Source-ът пази и RECHECK бележки и не показва непотвърдено като сигурен факт.

### R1 status

**TOO THIN / REAL SOURCE AVAILABLE**. Една generic education card не представлява реалния обхват.

Form blocker остава отделен: legacy config има `Добави училище` / `Добави детска градина`, specialized renderer няма. Не се връща автоматично.

## 8. Банки и банкомати — REAL SOURCE AVAILABLE

`info-lom-banks-v7.js` съдържа:

### Банкови офиси
5 офиса:
- УниКредит Булбанк;
- Банка ДСК;
- Пощенска банка;
- ЦКБ;
- ОББ.

### Банкомати
Структурирани мрежи за:
- ОББ;
- УниКредит Булбанк;
- Банка ДСК;
- Пощенска банка;
- Интернешънъл Асет Банк;
- ЦКБ.

Renderer-ът показва 15 устройства на 13 адреса за 6 банки и маркира 24/7 / внасяне само когато е потвърдено.

### Add action
`Добави банкомат` е запазено в specialized renderer и използва съществуващия Info submission owner.

### R1 status

**TOO THIN / REAL SOURCE AVAILABLE**. Банки трябва да има отделни изгледи `Банкомати` и `Банкови офиси`, а Add ATM остава валиден specialized action.

## 9. Комунални и ежедневни услуги — REAL/DYNAMIC HYBRID

`info-lom-utilities-v1.js` е single owner и R1 в момента представя твърде малко от него.

Реалният owner включва:

1. **Вода и ВиК**
   - аварии 24/7: `0700 20 272 · опция 1`;
   - самоотчет за Лом по Viber: `0889 129 789`;
   - официални действия към ВиК Монтана.

2. **Електроенергия**
   - Център Лом: `ул. „Христо Ботев“ №13`;
   - работно време: `Пон.–Пет. 08:30–17:00`;
   - линия: `0700 10 010`;
   - actions към прекъсвания/контакти.

3. **Куриери** — dynamic `info_entries`
   - Еконт;
   - Спиди;
   - BOX NOW;
   - Sameday;
   - office/locker distinctions + actions.

4. **Плащания и каси**
   - 13 EasyPay точки в source-а;
   - 2 Български пощи;
   - 2 банкови каси;
   - specialized `Добави каса / място за плащане` pending submission.

5. **Интернет и телевизия** — dynamic provider entries + owner metadata
   - NetSurf;
   - A1;
   - Vivacom;
   - Yettel;
   - coverage/store/contact actions.

6. **Застраховки**
   - 4 локални office records в owner-а;
   - specialized `Добави застрахователен офис` pending submission.

### R1 status

**TOO THIN**. `Вода/Ток` alone не е content parity. Prototype review трябва да покаже цялата структура, но dynamic provider/courier records не трябва да се измислят като live data.

## 10. Институции

Текущият owner е composition/staging + one final owner. Част от данните са dynamic `info_entries`.

Потвърдени в source-а специални карти:
- Областна администрация Монтана;
- Филиал за спешна медицинска помощ – Лом;
- при спешност `112`;
- official-source/freshness presentation.

R1 generic institution record е **TOO THIN**. Финалният prototype трябва да представи structure + real owner behavior, без да измисля липсващи dynamic records.

## 11. Mock data policy за R1

За offline interaction QA са допустими mock:
- listing;
- firm;
- shop;
- event;
- question/answer;
- health provider, само ако е ясно обозначен като пример.

Но публично изглеждащата карта **не трябва да твърди**, че примерният local name/phone/status е реален current record.

Затова R1 review data трябва да използва едно от:
- малък prototype-only badge `Пример за интерфейса`;
- obvious neutral demo naming;
- empty/dynamic owner state;
- real repo source, когато такъв е наличен и безопасен.

## 12. Form lifecycle parity — confirmed R1 gaps

Спрямо `PUBLIC_PRODUCT_V6_C_FORMS_ROLES_VISIBILITY_LOCK.md`, `PUBLIC_PRODUCT_V6_C_FORM_GUIDANCE_VALIDATION_LOCK.md` и `PUBLIC_PRODUCT_V6_C_FORM_LIFECYCLE_COMPLETENESS_LOCK.md` текущият R1 има следните gaps:

1. `navigate()` използва browser `window.confirm` вместо договорения custom dirty dialog с:
   - `Има неизпратени промени`;
   - `Остани във формата`;
   - `Напусни и изтрий`.
2. modal backdrop/Escape close няма form-specific dirty lifecycle.
3. `validateForm()` има inline errors, но няма видим form-level summary `Провери формата / Нищо не е изпратено`.
4. submit няма реален `SUBMITTING` state:
   - бутонът не се заключва;
   - няма `Изпращане… / Публикуване…`;
   - duplicate submit protection не се вижда като lifecycle.
5. `bindFormUX()` маркира dirty и credential forms; Login/Forgot/New password трябва да са изключени от aggressive content dirty guard.
6. listing photo preview винаги `slice(0,6)`, включително Admin; това противоречи на prototype contract-а да не налага normal user limit на Admin.
7. success screen заменя page съдържанието и е ясно, което е по-добро от активна празна form, но трябва да бъде унифицирано към explicit ✓ receipt / pending vs published semantics и focus management.

Тези са **prototype runtime fixes**, не production промени.

## 13. Приоритет за следващия runtime pass

1. поправи form lifecycle gaps без промяна на business semantics;
2. Articles → само реалната текуща статия като public content;
3. замени technical public labels (`Firms owner`, `Shops owner`, `Events owner`, `Health / Info`, `Q&A owner`, `Search V6`) с естествен български или ги премахни;
4. Info Lom → Transport/Education/Banks/Utilities content structure към реалния owner scope;
5. dynamic owners → explicit representative/empty state вместо fake-real records;
6. after changes compare branch against safety baseline and verify that only `v6-full-site-prototype-r1/**` changed.

Production impact: **NONE**.
