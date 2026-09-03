# Попитай.Лом — V6 Full-site Prototype R1

Статус: **ACTIVE WHOLE-SITE PARITY REVIEW / ИЗОЛИРАН ПРОТОТИП / NO PRODUCTION WRITE / NO SUPABASE**

Branch: `v6-full-site-prototype-r1`  
Safety baseline: `bdc333248a56060d6fa03565125a96ee5a52902d`

## Защо съществува

Това е цялостен navigable prototype преди реалната V6 implementation. Целта е собственикът на проекта да прегледа продукта като сайт — съдържание, навигация, бутони, форми, роли, състояния, mobile/desktop и owner boundaries — преди production кодът да бъде променян.

Това не е поредният V18/V19 visual patch. Старият layered `v6-prototype` остава непокътнат и не участва в runtime-а на R1.

Текущият етап е **content/form parity audit**, затова R1 още не се обявява за финално приет whole-site prototype. Когато реалният owner е динамичен и офлайн R1 няма authoritative записи, примерните записи са обозначени изрично като примери вместо да изглеждат като реални текущи данни.

## Изолация / застраховка

- Няма Supabase import.
- Няма production API заявки.
- Няма Firebase/analytics tracker.
- Няма промяна на `main`.
- Няма промяна на `v6-product-foundation-draft`.
- Няма промяна на съществуващ production/public файл.
- Старият layered `v6-prototype` не се променя и не се зарежда.
- Всички submit/moderation действия са симулация в браузъра.
- `localStorage` се използва само за prototype role/state selection и симулирани status записи.

## Консолидиран runtime

R1 е разделен по функция, а не по версии и пачове:

- `index.html` — един public shell и modal roots;
- `prototype.css` — един responsive visual system;
- `prototype-data.js` — representative/mock данни за interaction QA;
- `prototype-info-data.js` — статични реални review данни от current specialized Info surfaces;
- `prototype-core.js` — Home + Marketplace discovery/browse core;
- `prototype-listings.js` — Listings + Health dual-owner listing/form flows;
- `prototype-listing-form.js` — progressive Listing create/edit presentation върху protected semantics;
- `prototype-local.js` — Firms + Shops + Restaurants + Events;
- `prototype-info-community.js` — Info base + Articles + Q&A + Search;
- `prototype-info-parity.js` — specialized Transport/Education/Banks/Utilities/Institutions parity + доказаните Info proposal flows;
- `prototype-profile-admin.js` — Profile/Auth + Reports + Admin/Moderator review simulation;
- `prototype-forms.js` — shared validation + dirty/submitting/success lifecycle;
- `prototype-app.js` — един router/event/modal/navigation owner.

Няма competing renderer за един и същ root, няма MutationObserver patch chain и няма V18/V19 слой.

## Представена продуктова структура

### Обяви и услуги

1. Услуги
2. Автомобили
3. Работа
4. Имоти
5. Купува и продава

### Услуги

- Майстори и ремонти
- Здраве и грижа
- Домашни услуги
- Красота и лична грижа
- Компютърни и технически услуги
- Професионални услуги
- Обучение и уроци
- Транспорт и доставки

Health показва два различни типа съдържание в една публична повърхност:
- проверени специалисти/практики → Health/Info;
- временни offer/seek здравни услуги → Listings.

**Важно:** предложените 11 Health listing service labels са prototype presentation. Те НЕ се приемат за валидни production stored subcategories. Production V1 data-integrity contract остава LOCKED до отделен Health Listing Taxonomy V2 amendment.

## Content parity — текущо представено

### Статии

Публично като готова е показана само реалната текуща статия:
- `Как да избереш майстор и да избегнеш неприятни изненади`.

Предишните две R1 demo идеи вече не изглеждат като публикувани статии.

### Инфо Лом

R1 вече представя реалния обхват на current specialized source-овете:

- Transport: Автогара, ЖП гара, текущо потвърдено такси + официални действия;
- Education: 8 училища, 7 детски градини, 4 читалища, 1 библиотека, 1 музей, 3 школи/курсове;
- Banks: 5 банкови офиса + 15 ATM устройства на 13 адреса от review data;
- Utilities: Water/Power + courier structure + 17 payment locations + internet/TV provider metadata + 4 insurance offices;
- Institutions: доказаните специални current cards + explicit dynamic-data state;
- Health: real public people remain dynamic; R1 не измисля потвърдени лекари, а маркира interaction fixtures като примерни.

Потвърдените specialized Info proposal flows в R1:
- Добави банкомат;
- Добави куриерска точка;
- Добави каса / място за плащане;
- Добави интернет/TV доставчик;
- Добави застрахователен офис.

Всеки от тях симулира pending review и **не пише** към Supabase.

Остават блокирани, докато authority не се изясни:
- Добави такси;
- Добави училище;
- Добави детска градина.

## Form lifecycle target — вече моделиран в R1

Content forms имат:

- inline field errors;
- form-level `Провери формата / Нищо не е изпратено`;
- blur validation + live clear след грешка;
- preserve data при грешка;
- focus/scroll към първото невалидно поле;
- dirty-state защита при вътрешна навигация;
- custom избор `Остани във формата` / `Напусни и изтрий`;
- `Изпращане…` / `Публикуване…` и блокиран submit;
- duplicate-submit guard;
- ясно различени pending vs direct-published success receipts;
- credential forms са изключени от aggressive content dirty guard.

Listing form запазва protected fields/semantics и показва progressive context-specific questions, а не raw backend structure. Admin не получава изкуствен normal-user photo cap в prototype presentation.

## Покритие

Прототипът включва:

- Home;
- Marketplace landing + 5 public entries;
- Services + 8 groups + leaves;
- Health dual-owner surface;
- Automobiles;
- Work;
- Property;
- Buy & Sell;
- listing browse/detail/create/edit simulation;
- dynamic Listing form context при смяна на intent/main/group/leaf;
- Firms hub/detail/create/edit;
- expanded firm presentation, gallery and target Before/After view;
- `Поискай оферта` target form за UX review без production write;
- Shops hub/detail/proposal;
- Restaurants as Firms-owned discovery;
- Events read-only discovery/detail (без fake Add Event);
- Info Lom + 6 primary families + specialized parity views + correction/proposal flows;
- Search composition + loading/partial/empty/error/offline/cancelled states;
- Articles with current real public content only;
- Q&A index/detail/ask/answer + duplicate warning;
- Profile + auth/register/recovery + content statuses;
- Report vs Correction semantics;
- Admin/Moderator role-aware panel simulation;
- protected Moderator/Admin differences;
- global Add routing;
- public/canonical-only share preview + copy-link simulation;
- legal/about/contact surfaces;
- responsive desktop/mobile shell.

## Protected logic represented, not changed

Прототипът отразява, но не променя:

- roles and permissions;
- self-moderation boundaries;
- permanent delete Admin-only rule;
- direct publish rules;
- monthly listing quotas;
- expanded access ownership;
- status/moderation semantics;
- Admin/Ivanov relevance-first protected ordering;
- Listing/Firm/Info/Health/Shop/Event/Q&A boundaries.

## Prototype-only review controls

Bottom-right `Прототип` позволява преглед като:
- Гост;
- Потребител;
- Модератор;
- Администратор.

И състояния:
- заредено;
- зареждане;
- празно;
- грешка;
- офлайн;
- частичен резултат;
- отменена/по-нова заявка.

Тези контроли са само за QA/review и не са proposed production UI.

## Как се преглежда

Entry file: `v6-full-site-prototype-r1/index.html`.

Temporary browser preview:
`https://raw.githack.com/Traqnivanov/popitai-lom/v6-full-site-prototype-r1/v6-full-site-prototype-r1/index.html`

RawGitHack е само временен static preview host. При първо отваряне може да покаже собствен warning screen; избира се `Open the page`. Не се въвеждат реални пароли или лични данни — прототипът не се нуждае от тях.

Препоръчителен whole-site review:
1. Home → всичките 5 Marketplace входа.
2. Услуги → всичките 8 групи, особено Health dual-owner.
3. Listing/Firm/Question/Health/Shop/Info proposal form flows.
4. Firms/Shops/Events/Info/Articles/Q&A/Search/Profile.
5. `Прототип` → Guest/User/Moderator/Admin.
6. `Прототип` → loading/empty/error/offline/partial/cancelled.
7. Desktop + mobile layout/navigation.
8. Проверка дали някой одобрен action/field/content block липсва спрямо основния сайт.

## Нарочно НЕ е имплементирано като production промяна

- Health 11-service stored mapping / `HEALTH LISTING TAXONOMY V2`;
- regulated-health credential/verification model;
- schema/RLS/CHECK/trigger/RPC промени;
- нови роли/права/лимити/statuses;
- public Event submission owner;
- реален `Поискай оферта` delivery/write owner;
- server-rendered canonical/Open Graph share layer;
- production merge/deploy.

## QA ограничения на този чат

Source/dependency проверката е извършена през GitHub. Автоматичният browser interaction test не може да бъде стартиран от този чат, защото свързаният Opera Browser Connector в момента не е разрешен (`Allow AI connection` не е включено). Това **не се маркира като PASS**; interaction/mobile review остава отделна проверка.

## Approval boundary

Одобрението на този прототип означава, че whole-site product flow/presentation може да продължи към bounded technical implementation. То не разрешава мълчаливо schema/RLS/role/limit промени, Health taxonomy V2 storage промени, regulated-health credential логика или production merge.
