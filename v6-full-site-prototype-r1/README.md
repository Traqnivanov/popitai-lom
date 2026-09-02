# Попитай.Лом — V6 Full-site Prototype R1

Статус: **READY FOR WHOLE-SITE REVIEW / ИЗОЛИРАН ПРОТОТИП / NO PRODUCTION WRITE / NO SUPABASE**

Branch: `v6-full-site-prototype-r1`  
Safety baseline: `bdc333248a56060d6fa03565125a96ee5a52902d`

## Защо съществува

Това е цялостен navigable prototype преди реалната V6 implementation. Целта е собственикът на проекта да прегледа продукта като сайт — съдържание, навигация, бутони, форми, роли, състояния, mobile/desktop и owner boundaries — преди production кодът да бъде променян.

Това не е поредният V18/V19 visual patch. Старият layered `v6-prototype` остава непокътнат и не участва в runtime-а на R1.

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

R1 е разделен по функция/owner, а не по версии и пачове:

- `index.html` — един public shell и modal roots;
- `prototype.css` — един responsive visual system;
- `prototype-data.js` — mock/demo данни;
- `prototype-core.js` — Home + Marketplace discovery/browse core;
- `prototype-listings.js` — Listings + Health dual-owner listing/form flows;
- `prototype-local.js` — Firms + Shops + Restaurants + Events;
- `prototype-info-community.js` — Info Lom + Guides + Q&A + Search;
- `prototype-profile-admin.js` — Profile/Auth + Reports + Admin/Moderator;
- `prototype-forms.js` — shared validation + submit/status simulation;
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

Health показва два различни owners в една публична повърхност:
- проверени специалисти/практики → Health/Info;
- временни offer/seek здравни услуги → Listings.

**Важно:** предложените 11 Health listing service labels са prototype presentation. Те НЕ се приемат за валидни production stored subcategories. Production V1 data-integrity contract остава LOCKED до отделен Health Listing Taxonomy V2 amendment.

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
- Info Lom + 6 primary families + detail + correction;
- Info Health: Болница, Лекари, Аптеки, Стоматолози, Ветеринарни кабинети/ветеринари, Ветеринарни аптеки, Лаборатории;
- Search composition + loading/partial/empty/error/offline/cancelled states;
- Articles/Guides + readiness/share gate;
- Q&A index/detail/ask/answer + duplicate warning;
- Profile + auth/register/recovery + content statuses;
- Report vs Correction semantics;
- Admin/Moderator role-aware panel simulation;
- protected Moderator/Admin differences;
- global Add owner router;
- public/canonical-only share gate + copy-link simulation;
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
- Listing/Firm/Info/Health/Shop/Event/Q&A owner boundaries.

## Prototype-only review controls

Bottom-right `Прототип` позволява преглед като:
- Guest;
- User;
- Moderator;
- Admin.

И състояния:
- loaded;
- loading;
- empty;
- error;
- offline;
- partial;
- cancelled/newer query.

Тези контроли са само за QA/review и не са proposed production UI.

## Как се преглежда

Entry file: `v6-full-site-prototype-r1/index.html`.

Temporary browser preview:
`https://raw.githack.com/Traqnivanov/popitai-lom/v6-full-site-prototype-r1/v6-full-site-prototype-r1/index.html`

RawGitHack е само временен static preview host. При първо отваряне може да покаже собствен warning screen; избира се `Open the page`. Не се въвеждат реални пароли или лични данни — прототипът не се нуждае от тях.

Препоръчителен whole-site review:
1. Home → всичките 5 Marketplace входа.
2. Услуги → всичките 8 групи, особено Health dual-owner.
3. Listing/Firm/Question/Health/Shop form flows.
4. Firms/Shops/Events/Info/Articles/Q&A/Search/Profile.
5. `Прототип` → Guest/User/Moderator/Admin.
6. `Прототип` → loading/empty/error/offline/partial/cancelled.
7. Desktop + mobile layout/navigation.
8. Проверка дали някой одобрен owner/action/field липсва спрямо основния сайт.

## Нарочно НЕ е имплементирано като production промяна

- Health 11-service stored mapping / `HEALTH LISTING TAXONOMY V2`;
- regulated-health credential/verification model;
- schema/RLS/CHECK/trigger/RPC промени;
- нови роли/права/лимити/statuses;
- public Event submission owner;
- реален `Поискай оферта` delivery/write owner;
- server-rendered canonical/Open Graph share layer;
- production merge/deploy.

## Approval boundary

Одобрението на този прототип означава, че whole-site product flow/presentation може да продължи към bounded technical implementation. То не разрешава мълчаливо schema/RLS/role/limit промени, Health taxonomy V2 storage промени, regulated-health credential логика или production merge.
