# Попитай.Лом — V6-C ОДИТ НА ПРОТОТИПА И СРАВНЕНИЕ С ТЕКУЩИЯ САЙТ

Статус: **ЗАДЪЛЖИТЕЛЕН V6-C PARITY GATE / БЕЗ ПРОМЯНА НА ЖИВИЯ САЙТ**  
Branch: `v6-product-foundation-draft`  
Дата: 01.09.2026

Production impact: **NONE**.

## 1. ЦЕЛ

Този одит проверява две неща в точния ред:

1. дали текущият V6 full-site прототип реално представя това, което документацията твърди;
2. дали при преминаването от текущия production сайт към V6 не са изгубени важни работещи възможности, състояния, бутони, форми, контекст или защитени правила.

Този документ НЕ означава, че текущият production UI трябва да бъде копиран 1:1. V6 може да пренарежда, обединява и подобрява presentation/UX, но не може мълчаливо да губи важна способност или да променя protected business semantics.

При конфликт важи:

**LOCKED rules > approved production specs > V6 Master Control > B1–B9 > V6-C contracts > този audit > prototype implementation.**

---

# 2. РЕЗЮМЕ

## Резултат

**V6-C НЕ Е готов за визуално финализиране.**

Основната IA и защитените Firm/Listing/Admin/Ivanov правила са представени значително по-добре от ранните C прототипи, но source-level audit откри важни parity пропуски и няколко prototype/documentation несъответствия.

Няма причина за връщане назад към стария дизайн. Правилният подход е:

**запазваме V6 архитектурата → връщаме липсващите важни production способности → консолидираме prototype поведението → чак тогава визуален polish.**

---

# 3. КАТЕГОРИИ НА РЕШЕНИЯТА

Всеки production елемент от този одит попада в една от четири групи.

### A. ЗАПАЗИ ТОЧНО СМИСЪЛА

Не може да се променя без изрично одобрение:
- роли и права;
- Admin/Moderator разлика;
- квоти;
- approval/direct publication;
- protected Firm/Listing owners;
- Admin/Ivanov/Construction ranking след relevance;
- нормален owner edit/draft flow;
- expanded access;
- специализираните Health/Info/Shops owners;
- липсата на публично `Добави събитие`.

### B. АДАПТИРАЙ КЪМ V6

Възможността е важна, но текущият layout не е задължителен.

Примери:
- филтри;
- снимки и галерии;
- профилни статуси;
- корекции;
- Health official/freshness presentation;
- Shop tabs/tags;
- Events browsing;
- Search recovery actions.

### C. ЛИПСВА / ТВЪРДЕ ОПРОСТЕНО В ПРОТОТИПА

Трябва да бъде представено преди V6-C acceptance.

### D. НЕ КОПИРАЙ 1:1

Текущото production решение е старо, временно или вече superseded.

---

# 4. ПРОТОТИПЕН ОДИТ — ДОКУМЕНТАЦИЯ СРЕЩУ РЕАЛНО ЗАРЕДЕН КОД

## P0-1 — `full-site-form-lifecycle-audit-v7.js` съществува, но НЕ се зарежда

Документацията/checkpoint твърди, че прототипът има:
- `Тест на изпращане: грешка`;
- по-пълно dirty detection;
- защита при смяна на QA роля;
- запазване на данните при симулирана системна грешка.

Файлът `v6-prototype/full-site-form-lifecycle-audit-v7.js` съдържа тази логика, но текущият `v6-prototype/full-site.html` НЕ го зарежда.

Следствие:
- текущият preview не може реално да покаже обещания failure test;
- checkpoint-ът е по-напред от runtime-а.

**Решение:** не се добавя v7 механично върху v6, защото двата файла имат конкуриращи dirty/close/beforeunload owners. Missing behavior трябва да се консолидира в един prototype lifecycle owner.

## P0-2 — повече от един prototype behavior layer може да прихваща едни и същи действия

Текущият full-site runtime използва:
- V4 role-aware layer;
- runtime v2;
- V3 parity layer;
- V5 guidance/validation;
- V6 lifecycle;
- action guard.

Това е приемливо само като временен C research prototype.

**Не е допустима production архитектура.**

Преди V6-D трябва да е ясно кой е единственият renderer/lifecycle owner на всеки root.

## P0-3 — Search states са записани като налични, но активният runtime не ги представя

Документацията твърди Search states:
- success;
- partial;
- empty;
- offline;
- error.

Активният prototype `search()` показва основно един success пример. `partial` и `offline` не са представени като реални review states.

**Извод:** Search V6 не е завършен за C review.

## P1-1 — dirty detection на V6 не е достатъчно надежден за всички prototype контроли

V6 lifecycle snapshot разчита основно на form controls и при безименни prototype fields може да не различи всички промени надеждно. Отделно `Предлагам / Търся` е button state, а не стандартно form поле.

V7 съдържа по-добра идея — fallback по позиция + choice/intent state — но не е активен.

**Извод:** dirty/leave contract е правилен като спецификация, но текущият preview още не е достатъчно надежден като доказателство.

## P1-2 — QA role switch може да изгуби започната форма

Role switch е само prototype QA контрол и не е production UI. Въпреки това при тест трябва да не унищожава тихо dirty state.

V7 го пази, но не е активен.

---

# 5. ОБЯВИ — PRODUCTION PARITY

## Запази точно смисъла

LOCKED:
- Normal/Moderator pending;
- Admin direct publication;
- 5 лични + отделна фирмена квота според правилата;
- Admin без normal quota;
- normal listing до 6 снимки;
- Admin media backend без лимит;
- Admin protected options;
- Admin-first ordering само след relevance;
- edit не използва нова quota;
- last approved public version остава при pending edit според protected flow.

## Важни production способности, които V6 трябва да запази/адаптира

Текущата форма има:
- publisher: лична / собствена одобрена фирма;
- quota information;
- duplicate-warning зона;
- category + dependent subcategory;
- отделни типове за Работа;
- отделни типове за Имоти;
- описание;
- цена EUR + ориентир BGN;
- договаряне;
- подарява/безплатно;
- телефон;
- град;
- улица по желание;
- правила;
- media uploader;
- Admin-only controls.

### Липсва / underrepresented в V6

1. **Duplicate warning** на listing create не е представен ясно.
2. **Media UX** е сведено до статичен/демо блок.
3. Не е представено достатъчно ясно:
   - preview на снимките;
   - премахване;
   - брой;
   - обработване;
   - грешка на конкретна снимка;
   - caption/описание;
   - drag/drop;
   - първа снимка като главна;
   - current media при edit.
4. Context prefill трябва да пази не само category, а и валидни `subcategory`, `type`, както и `edit` да има приоритет.
5. Marketplace list/filter review трябва да представя не само category cards, а реалния тип filtering/sort behavior достатъчно, за да не бъде загубен при implementation.

## Не копирай 1:1

- стария frontend Admin лимит `20` снимки;
- старите public category labels, когато B1 V6 taxonomy ги supersede-ва;
- английския Admin label `Highlighted`.

---

# 6. СНИМКИ / MEDIA — ОБЩ PARITY GATE

Текущият `image-upload.js` е важна production capability, а не визуален детайл.

Production вече прави:
- JPG/PNG/WebP validation;
- максимален размер;
- client-side обработка;
- resize/optimization variants;
- processing preview;
- per-image error;
- count;
- remove;
- caption/описание;
- drag/drop;
- optimized variants за показване.

### V6 изискване

V6 може да направи uploader-а по-чист визуално, но **не може да го сведе до бутон „Избери снимки“ без представяне на реалния workflow**.

Това важи за:
- обяви;
- фирмено лого;
- фирмена галерия;
- edit/current media;
- Q&A gallery, когато owner flow го позволява.

---

# 7. ФИРМИ — PRODUCTION PARITY

## Запази точно смисъла

- Normal firm pending;
- Admin firm direct publication;
- normal firm starts without expanded access;
- Admin grants/revokes expanded access;
- Admin firm automatic expanded access;
- last approved public version remains while normal edit draft waits;
- protected Ivanov/Construction/Listings relations.

## Важни production способности

Basic firm:
- име;
- категория;
- телефон;
- град;
- адрес;
- работно време;
- описание;
- 1 лого;
- gallery.

Expanded:
- кратко представяне;
- сайт;
- услуги;
- район;
- разширено работно време;
- visibility toggles;
- cover/gallery presentation;
- desktop/mobile contact actions.

### Липсва / underrepresented в V6

1. Real media add/edit workflow.
2. Current-media edit/removal/replacement review.
3. Контекстното `Подай сигнал` за конкретната фирма не е видимо в current V4 firm detail.
4. Expanded profile actions трябва да пазят реалната contact logic, не просто декоративни бутони.

### Важно уточнение за `Преди и след`

Current public expanded-profile code съдържа presentation section `Преди и след`, но текущият loaded data path задава `beforeAfter: []` и няма доказана current owner-edit форма за тази функция.

Следователно V6 може да пази мястото като бъдеща/разширена presentation възможност, но не трябва да твърди, че това е вече завършена production-edit capability.

---

# 8. ПРОФИЛ — ГОЛЯМ PARITY ПРОПУСК

Текущият production Profile е много по-богат от current V6 prototype.

Production показва/зарежда:
- вход / изход;
- Admin panel link, когато е позволено;
- Моите въпроси;
- Моите фирми;
- Моите обяви;
- `Нужна корекция`;
- moderation notes;
- pending/approved/rejected/needs_changes states;
- draft state на фирмена редакция;
- expanded edit link;
- preview;
- Q&A returned corrections + resubmit;
- Info proposals/reports;
- Info statuses;
- Admin request for more info;
- resubmit/dopulnenie flows.

### P0 parity gap

Current V4 profile показва само няколко примерни rows. Това не е достатъчно за full-site completeness.

V6 Profile трябва да представи поне:
- normal pending listing;
- published listing;
- returned listing/edit state, когато реалният owner го има;
- normal firm pending/approved/needs_changes;
- pending firm draft while public version remains;
- expanded firm edit;
- returned Question;
- returned Answer;
- Info proposal pending/approved/rejected/needs correction;
- Info error report + `нужна допълнителна информация`;
- admin moderation note;
- resubmit flow;
- relevant quick actions.

Не е нужно старият Profile layout да се копира.

---

# 9. HEALTH / INFO LOM — ГОЛЯМ PARITY ПРОПУСК

## Health

Current production Health е специализиран verified owner и съдържа значително повече от generic doctor card.

Важни production способности:
- 7 health groups;
- `Последно потвърдено`;
- confirmed source;
- официални справки;
- direct call actions;
- official page links;
- per-group `Добави`;
- per-group `Предложи корекция`;
- separate error signal;
- hospital-specific information;
- важна информация за прием;
- emergency 24/7;
- first visit/admission direction;
- referral/hospitalization information;
- admission phone;
- key departments + all units;
- medical center detail.

### P0 parity gap

V6 Health presentation е твърде обща. Общият V6 visual shell е правилен, но verified content richness и trust/freshness/action semantics не могат да бъдат загубени.

## Други Info families

Production Info има:
- 6 top-level families;
- own search;
- problem/task shortcuts (`Нямам вода`, `Нямам ток`, `Документ от общината`, и др.);
- subnavigation в specific category pages;
- verified facts/actions;
- correction signal.

### V6 изискване

Generic `Проверен местен запис` не е достатъчен като completeness representation.

Трябва да се покаже поне един реалистичен rich template за:
- Institutions;
- Transport;
- Utilities;
- Education/Culture;
- Banks/ATMs;

с:
- task/subcategory navigation;
- relevant contact/action;
- source/freshness;
- correction route.

---

# 10. МАГАЗИНИ — PARITY ПРОПУСК

Production Shops има:
- 6 tabs;
- category-specific heading/copy;
- category-specific Add label;
- search;
- result count;
- construction subcategories;
- tags/groups;
- search by tags;
- contextual proposal form;
- dynamic classification choices;
- custom classification;
- dirty-close;
- hidden editable form after success.

### Current V6 gap

V6 tabs основно сменят active appearance. Не е достатъчно да се счита Shops за complete.

Трябва да се вижда, че tab променя:
- заглавие;
- описание;
- Add context;
- filters/subcategories;
- classification hints/options;
- results/search context.

---

# 11. EVENTS — НЕ ДОБАВЯМЕ PUBLIC ADD, НО НЕ ГУБИМ DISCOVERY

Production Events правилно няма публична форма `Добави събитие`.

Има обаче полезни discovery функции:
- Предстоящи;
- Културни;
- Спортни;
- Обществени;
- search;
- Ask Question с event context;
- последни въпроси;
- recovery към Info за официална/институционална информация.

### Current V6 gap

Generic event result card е твърде опростен.

V6 трябва да запази discovery/task logic, без да създава fake write owner.

---

# 12. SEARCH — PARITY + B2 GAP

Production current search при no-result предлага:
- Разгледай категориите;
- + Добави (Фирма/Обява);
- Задай въпрос.

V6 B2 е по-силен и добавя owner-aware result composition/states.

### P0 requirement

V6 prototype трябва реално да представи:
- idle;
- too short;
- loading;
- partial;
- success;
- empty;
- offline;
- error;
- cancelled, когато е приложимо;
- no-result recovery actions;
- правилния Add/Ask fallback без owner bypass.

Не е достатъчно тези states да са само в B2 документ.

---

# 13. AUTH — PASSWORD UX НЕ ТРЯБВА ДА СЕ ЗАГУБИ

Production Login/Register/New password имат show/hide password controls.

### Current V6 gap

V6 auth forms имат password fields, но password toggle parity не е представена достатъчно.

Трябва да се запази:
- show/hide password;
- confirm password;
- terms/privacy links;
- forgot password;
- privacy-safe forgot success;
- new-password match validation.

---

# 14. Q&A

Production Question detail има:
- title/category;
- author/date;
- description;
- gallery;
- Полезно;
- Сподели;
- Докладвай;
- answers;
- answer form;
- category link;
- all questions;
- new question.

V6 вече представя голяма част от action flow.

### Underrepresented

- author/date context;
- gallery/media;
- returned correction/resubmit е в Profile parity gap;
- B5 duplicate/canonical gate трябва да остане V6 enhancement.

---

# 15. GLOBAL ADD / ACCESSIBILITY

Production public Add sheet вече има:
- focus trap;
- Escape close;
- backdrop close;
- focus return;
- `aria-expanded` sync;
- exact mobile nav;
- specialized bridging for owner-native Health/Shop actions.

### V6 acceptance requirement

Full-site prototype трябва да бъде проверен за същите interaction guarantees.

Само визуално наличен modal не е достатъчен.

---

# 16. CONTEXT PREFILL — ВАЖНА CAPABILITY

Production bounded prefill вече пази:
- category;
- subcategory;
- type;
- firm category mapping;
- edit override;
- validation дали requested value е позволена.

### V6 requirement

V6 contextual `Добави` трябва да пренесе смисъла:

**edit > bounded context prefill > blank create.**

Не се допуска arbitrary URL parameter да задава protected/internal field.

---

# 17. HOME — КАКВО ИМА В PRODUCTION, НО НЕ СЕ КОПИРА АВТОМАТИЧНО

Current Home има dynamic previews за:
- последни активни обяви;
- местни фирми;
- въпроси;
- Info Lom.

V6 Home canonical order е вече отделно одобрен:

**Search → Основни категории → Открий в Лом → 6 Info → Guides → Q&A.**

Следователно production Home preview sections НЕ се връщат механично.

Но capability не трябва да се загуби:
- listings remain discoverable through Marketplace/categories/search;
- firms through Discover/Firms/search;
- Q&A through Home preview + Q&A;
- Info through six families/search.

След C parity може отделно да се прецени дали live preview на Listings/Firms да се върне като вторичен слой. Това е presentation decision, не protected requirement.

---

# 18. НЕ КОПИРАЙ 1:1 ОТ ТЕКУЩИЯ САЙТ

1. Стария public category dictionary като нова V6 IA — B1 V6 има 16 категории.
2. Старото frontend Admin image ограничение `20`.
3. Known Moderator-own-business edit bug.
4. Технически английски labels/status values.
5. Current one-article limitation.
6. Старите inline/styles/layout решения само защото съществуват.
7. Prototype multi-layer renderer architecture като production решение.
8. Fake ratings/verification/badges без real source.
9. Public Add Event — няма owner.

---

# 19. ПРИОРИТЕТЕН GAP LIST ПРЕДИ VISUAL POLISH

## P0 — BLOCKS V6-C ACCEPTANCE

1. Consolidate form lifecycle prototype owner; docs/runtime must agree.
2. Real system-error review state must be testable without duplicate lifecycle owners.
3. Search required states + recovery actions.
4. Profile full status/correction/resubmit ecosystem.
5. Health rich verified/trust/freshness/official/admission representation.
6. Realistic Listing/Firm media workflow representation.

## P1 — MUST COMPLETE BEFORE C ACCEPTANCE

7. Listing duplicate warning.
8. Shop dynamic tab/context/tags/classification.
9. Rich Info family templates/subnavigation/actions/corrections.
10. Events browse/search/question/Info recovery.
11. Auth show/hide password parity.
12. Bounded category/subcategory/type/edit prefill.
13. Add-sheet focus trap/Escape/backdrop/focus-return review.
14. Firm contextual report action.
15. Q&A author/date/gallery representation.

## P2 — REVIEW AFTER FUNCTIONAL COMPLETENESS

16. Whether Home needs secondary live Listings/Firms previews.
17. Density/typography/card polish.
18. Fine-grained desktop/mobile spacing.

---

# 20. CHANGE CONTROL

During fixes from this audit:

Allowed autonomously:
- add missing prototype representation of an already approved capability;
- improve Bulgarian copy;
- fix prototype-only runtime mismatch;
- improve accessibility;
- consolidate prototype lifecycle behavior without changing business semantics;
- restore omitted fields/actions/states.

STOP AND REPORT FIRST if a proposed fix changes:
- role;
- right;
- quota;
- status meaning;
- direct publication;
- moderation;
- owner;
- RLS/schema;
- protected ranking;
- Admin/Moderator boundary;
- Ivanov/Construction relation;
- existing approved URL/SEO ownership in a way not already covered by V6 contracts.

---

# 21. C ACCEPTANCE CONDITION

V6-C may move to systematic visual polish only when:

- P0 = 0 open gaps;
- P1 = 0 unexplained gaps;
- current production important capabilities have either:
  - been represented in V6, or
  - been explicitly classified as intentionally relocated/superseded;
- protected regression gate passes conceptually;
- source/runtime docs match;
- representative mobile/desktop rendered review is completed;
- user has accepted/refined the full-site direction.

Only after that may V6-D begin.

---

## FINAL AUDIT CONCLUSION

Няма нужда да връщаме стария сайт или да копираме старите екрани.

Но current V6 prototype **още не е пълен заместител на важните работещи production способности**.

Най-големите реални рискове от загуба в момента са:

**Profile corrections/statuses → Health/Info richness → media uploader/edit workflow → Search states/recovery → Shop context → bounded prefill/auth/accessibility details.**

Тези точки са задължителен V6-C parity backlog и не могат да бъдат пропуснати при следващия визуален pass.
