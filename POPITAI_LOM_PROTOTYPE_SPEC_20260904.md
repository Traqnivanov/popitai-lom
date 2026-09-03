# Попитай.Лом — Content-complete prototype specification — 04.09.2026

Статус: **SUPPORTING SPEC / ПОДЧИНЕН НА `POPITAI_LOM_MASTER_CURRENT.md` / НЕ Е PRODUCTION РАЗРЕШЕНИЕ**
Branch: `prototype/content-complete-ia-20260904`
Prototype root: `prototype-final-ia/`

## 1. Цел

Да се провери одобрената public IA като един цял продукт преди production code. Прототипът трябва да се усеща като реален сайт по navigation, actions, forms и states, но да не пише в Supabase и да не променя protected owners.

## 2. Render ownership

- Единствен prototype renderer owner: `prototype-final-ia/app.js`.
- Няма Marketplace V3, V18, V19 или друг последващ renderer, който да прерисува същия root.
- `index.html` държи shell-а; `app.js` държи routed content; `styles.css` държи prototype styles.

## 3. Основни екрани

1. Home — task-first search, publish secondary, ask fallback.
2. `Обяви и услуги` hub — шест marketplace задачи + три specialized направления.
3. Услуги — search + quick tasks + девет approved service families.
4. Купува и продава — седем broad goods groups.
5. Работа — девет broad work groups.
6. Имоти — transaction first, property type second.
7. Автомобили — vehicles, parts, auto-services without duplicate owner.
8. Животни — adoption/lost/found/goods; no paid live-animal sales.
9. Магазини — Shops owner concept and six existing families.
10. Заведения — Firms owner, restaurant categories.
11. Здраве и лекари — specialized Health owner concept.
12. Инфо Лом — six verified families; no invented official facts.
13. Фирми — persistent profile results and detail.
14. Актуално — Publications + Events as distinct types.
15. Статии — long-form local-first role.
16. Въпроси — community fallback role.
17. Results layer — задължителен междинен екран `group/subcategory → results → detail/add`, без директно прескачане от browse card към несвързан detail.
18. Detail screens — Listing, Firm, Article, Publication, Event, Question, Health, Info.
19. Add screens — Listing, Firm, Shop, Health, Question only.
20. Static destinations — About, Rules, Contacts, Profile so shell links never lead to unrelated placeholders.

## 4. Owner matrix

| Public task | Lifecycle owner | Add target in prototype | Production rule preserved |
|---|---|---|---|
| Services | Listings | Add Listing | one form, bounded category/subcategory/type prefill |
| Buy/Sell | Listings | Add Listing | no separate goods owner |
| Work | Listings | Add Listing | `Предлага работа` / `Търси работа` semantics |
| Real Estate | Listings | Add Listing | existing real-estate transaction semantics |
| Vehicles/Parts | Listings | Add Listing | auto service path is not duplicate records |
| Animals | Listings | Add Listing | no paid live-animal sales at launch |
| Shops | Shops | Add Shop | specialized flow not bypassed |
| Restaurants | Firms | Add Firm | no restaurant datastore |
| Private Health | Health/Info | Add Health | no generic medical listing |
| Firms | Firms | Add Firm | persistent profile, not Listing |
| Events | Events | none | no fake public Add Event |
| Articles | Articles/editorial role | none public | no fake public Add Article |
| Publications | separate editorial owner concept | none public | Admin-only authoring concept; no backend yet |
| Questions | Questions | Add Question | community fallback, not verified Info |
| Info Lom | Info | correction/source flows only | verified data separate from community |

## 5. Home order

1. Hero/search/publish/ask fallback.
2. Marketplace categories.
3. Specialized local directions.
4. Info Lom.
5. New Listings/Services.
6. Current in Lom — Publications + Events.
7. Firms.
8. Articles.
9. Questions.

Prototype may keep specialized directions visually adjacent to marketplace categories as long as owner distinction remains explicit and mobile density stays compact.

## 6. Navigation

Desktop: `Начало | Обяви и услуги | Фирми | Инфо Лом | Актуално | Още | Профил | + Добави`.

Mobile bottom: `Начало | Обяви | + | Инфо | Профил`.

Global Add contains exactly the currently valid public owner actions: Listing, Firm, Shop, Health, Question.

## 7. Required states

- loading;
- empty;
- error/retry;
- normal results;
- detail;
- create form;
- edit form;
- validation error without losing input;
- pending;
- success;
- no-public-add states for Event/Article/Publication.

Prototype QA routes use hash query states only because this branch is isolated and must not alter production routes.

## 8. Content integrity

- Mock records must be visibly labeled `ПРОТОТИПЕН ЗАПИС` or equivalent.
- No invented phone, address, rating, views, likes, answer counts or official status.
- Info prototype describes record structure but does not fabricate current civic facts.
- No content may imply a real person/business is offering something unless sourced from the real owner in a later integration phase.
- User-facing prototype text is Bulgarian; technical owner identifiers may exist only internally in code/route parameters and are mapped to Bulgarian display labels.

## 9. Mobile requirements

- No giant hero or excessive vertical spacer.
- Main tasks immediately visible.
- Same functionality as desktop.
- Five-item bottom nav fixed and usable.
- Core category grids stay two-column at normal phone width, including 390px; one column is reserved only for unusually narrow widths where readability requires it.
- Form fields remain full-width and touch-friendly.

## 10. Prototype QA — final pass after acceptance fixes

- `node --check` passes for `app.js`.
- Automated Chromium route traversal completed with **0 page JavaScript errors**.
- **36 primary/QA routes** rendered non-empty content in the final pass.
- Desktop render checked at 1440px width.
- Mobile render checked at 390px width.
- At 390px the main category grid resolves to **2 columns**, not one long vertical list.
- Mobile bottom navigation is visible and uses the approved five actions.
- Browse journey verified: `Услуги → Майстори, ремонти и дом → Резултати → правилен detail/Add flow`.
- Results screen exposes the correct lifecycle owner as a Bulgarian user-facing label and does not create a duplicate record concept.
- Add path from results carries visible category/subcategory prefill; production rule remains editable bounded prefill and edit-mode saved record has priority.
- Add sheet opens and exposes exactly **5** public Add owner actions.
- Form validation error is visible and does not clear entered values; test value remained present after failed submit.
- `loading`, `empty`, `error`, `edit`, `pending` and `success` states render.
- Automated visible-text scan found none of the disallowed prototype English UI leftovers checked in the final pass (`production`, `owner`, `generic listing`, `Shop flow`, `Health flow`, `Admin-only`, `marketplace`, `lifecycle`, `backend write`, `grooming`, `detailing`).

## 11. Not covered / still production-blocked

- Supabase writes;
- schema/RLS/migrations;
- real Publications backend;
- production route/canonical redirects;
- old Marketplace V3 removal from production pipeline;
- real search integration across Shops/Health/Events;
- production deployment or merge to `main`.

Those remain separate implementation tasks after prototype acceptance.