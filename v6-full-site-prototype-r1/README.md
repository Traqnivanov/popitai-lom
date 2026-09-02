# Попитай.Лом — V6 Full-site Prototype R1

Статус: **ИЗОЛИРАН ПРОТОТИП / NO PRODUCTION WRITE / NO SUPABASE**

Branch: `v6-full-site-prototype-r1`
Baseline: `bdc333248a56060d6fa03565125a96ee5a52902d`

## Защо съществува

Това е цялостен navigable prototype преди реалната V6 implementation. Целта е собственикът на проекта да прегледа продукта като сайт — съдържание, навигация, бутони, форми, роли, състояния, mobile/desktop и owner boundaries — преди production кодът да бъде променян.

## Изолация

- Няма Supabase import.
- Няма production API заявки.
- Няма Firebase/analytics tracker.
- Няма промяна на `main`.
- Няма промяна на `v6-product-foundation-draft`.
- Старият layered `v6-prototype` не се променя и не се зарежда.
- Всички submit действия са симулация в браузъра.
- `localStorage` се използва само за prototype role/state selection.

## Един runtime

Прототипът е умишлено консолидиран:

- `index.html` — един public shell и modal roots;
- `prototype.css` — един responsive visual system;
- `prototype-data.js` — mock/demo данни;
- `prototype-core.js`, `prototype-marketplace.js`, `prototype-content.js`, `prototype-app.js` — четири ясни source modules, които заедно образуват **един route/form/state runtime owner**; това са функционални модули, не version/patch слоеве.

Няма V18/V19 patch files и няма competing renderers.

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
- Firms hub/detail/create/edit;
- expanded firm presentation, gallery and target Before/After view;
- Shops hub/detail/proposal;
- Restaurants as Firms-owned discovery;
- Events read-only discovery/detail (без fake Add Event);
- Info Lom + 6 primary families + detail + correction;
- Search composition + loading/partial/empty/error/offline/cancelled states;
- Articles/Guides + readiness/share gate;
- Q&A index/detail/ask/answer + duplicate warning;
- Profile + auth/register/recovery + content statuses;
- Report vs Correction semantics;
- Admin/Moderator role-aware panel simulation;
- protected Moderator/Admin differences;
- global Add owner router;
- Facebook/share bridge (native share / copy link / user-controlled Facebook share);
- legal/about/contact surfaces;
- responsive desktop/mobile shell.

## Protected logic represented, not changed

The prototype mirrors, but does not alter:

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

Bottom-right `Прототип` button allows switching:
- Guest;
- User;
- Moderator;
- Admin;

and states:
- loaded;
- loading;
- empty;
- error;
- offline;
- partial;
- cancelled/newer query.

These controls are not proposed as production UI.

## Not an implementation permission

Approval of this prototype means the product flow/presentation can move forward to bounded technical design/implementation. It does not silently authorize schema/RLS/role/limit changes, Health taxonomy V2 storage changes, regulated-health credential logic, or production merge.
