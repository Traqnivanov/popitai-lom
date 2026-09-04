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
- Helper файловете могат да връщат данни/HTML функции, но не притежават отделен DOM lifecycle и не рендерират конкурентно в `#app-main`.

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
17. Results layer — задължителен междинен екран `group/subcategory → results → detail/add`, освен когато protected owner реално няма отделен detail route. При Shops резултатът остава catalog card и не се измисля Firm detail.
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
| Shops | Shops | Add Shop | specialized flow not bypassed; no fake Firm detail |
| Restaurants | Firms | Add Firm | no restaurant datastore |
| Private Health | Health/Info | Add Health | no generic medical listing |
| Firms | Firms | Add Firm | persistent profile, not Listing |
| Events | Events | none | no fake public Add Event |
| Articles | Articles/editorial role | none public | no fake public Add Article |
| Publications | separate editorial owner concept | none public | Admin-only authoring concept; no backend yet |
| Questions | Questions | Add Question | community fallback, not verified Info |
| Info Lom | Info | correction/source flows only | verified data separate from community |

### 4.1 Taxonomy / form-owner boundary

Approved public groups are **discovery IA**. They do not automatically become new persisted Listing subcategory values just because the prototype can display them.

- Current persisted Listing categories and existing owner validation remain authoritative until production implementation explicitly maps or extends them.
- `Услуги` keeps the existing Listing subcategory behavior; a service subcategory is required in create mode, matching the current owner form.
- Public group names for Работа, Имоти, Автомобили, Животни and the broad Buy/Sell layer must be implemented through backward-compatible mapping and form-owner validation before any production persistence change.
- Listing `Подкатегория` is visible/enabled in the prototype owner form only where the current owner form has it — `Услуги`.
- Animals public intents are mapped onto current Listing types for prototype flow (`Дава`, `Търси`, `Продава` for goods) instead of inventing new persisted type values. Paid live-animal sales remain prohibited by the approved product rule.
- No new table, owner, form or Admin queue is implied by a public grouping.
- Edit saved values remain stronger than create prefill; create context must not leak into edit options or overwrite saved data.

## 5. Home order

1. Hero/search/publish/ask fallback.
2. Marketplace block — six main tasks plus the three specialized directions inside the same discovery block.
3. Info Lom.
4. New Listings/Services.
5. Current in Lom — Publications + Events.
6. Firms.
7. Articles.
8. Questions.

Specialized directions are visually subordinate/adjacent to the marketplace categories, not a competing standalone Home section before Info Lom.

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

## 10. Prototype QA — current accepted checks and continuing audit

- `node --check` passed for the checked prototype snapshots; subsequent JS changes were additionally exercised through Opera route rendering.
- Automated Chromium route traversal completed with **0 page JavaScript errors** in the prior full route pass.
- **36 primary/QA routes** rendered non-empty content in that pass.
- Desktop render checked in Opera against the current production/public surfaces.
- Mobile render was previously checked at 390px width; current CSS keeps the two-column main category rule and approved five-item bottom navigation.
- Home hero was corrected back to the existing Lom-cover visual language; only the approved task-first content/CTA priority changed.
- Home composition now keeps Shops/Restaurants/Health inside the marketplace discovery block; Info Lom is the next separate Home section.
- Browse journey verified: `Услуги → Майстори, ремонти и дом → Резултати → правилен detail/Add flow`.
- Auto-services are one discovery path into the same Services records, not a duplicate owner.
- Results → Add mapping was corrected for Buy/Sell, Auto Services and Real Estate type context.
- Shops stay on the specialized Shops owner: results render catalog-style cards directly and do not invent a Firm detail route.
- Shop result context is preserved into Add Shop as editable category prefill; verified in Opera with `Хранителни`.
- Restaurant results stay on Firms; `Добави заведение` goes to Add Firm with `category=Заведения`.
- Health results stay on Health/Info; result context is preserved into Add Health as editable Type prefill; verified in Opera with `Стоматолози`.
- Animals public intents map onto real Listing type values instead of creating new owner values; verified in Opera with adoption → `Дава` and the normal Listing type options.
- Add sheet exposes exactly **5** public Add owner actions.
- Event and Publication detail content exposes no public Add/Publish action; Article authoring is also not public.
- Firm and Question category dropdowns were reconciled to the current owner dictionaries.
- Edit priority was verified in Opera: create prefill no longer enters the edit dropdown options or replaces saved values.
- Listing service subcategory validation now matches the current owner form: visible/enabled/required for `Услуги`, hidden for Работа/Имоти/Животни/other Listing categories.
- Prototype submit ignores a second submit after a successful first submit; no real backend success is claimed.
- Form validation error is visible and does not clear entered values.
- `loading`, `empty`, `error` states were re-verified in Opera on the current prototype flow (`Зареждане…`, `Няма резултати`, `Опитай отново`). `edit`, `pending` and `success` states also render.
- Icon choice is **not approved** and is outside this acceptance pass; temporary prototype icons must not be treated as final product truth.

## 11. Not covered / still production-blocked

- Supabase writes;
- schema/RLS/migrations;
- persisted taxonomy expansion/mapping for new public groups beyond currently supported owner values;
- real Publications backend;
- production route/canonical redirects;
- old Marketplace V3 removal from production pipeline;
- real search integration across Shops/Health/Events;
- production deployment or merge to `main`.

Those remain separate implementation tasks after prototype acceptance.
