# Попитай.Лом — V6 IMPLEMENTATION / ACCEPTANCE MATRIX

Статус: **READY FOR USER REVIEW / NO IMPLEMENTATION PERMISSION**
Branch: `v6-product-foundation-draft`
Актуализирано: 02.09.2026

Тази матрица превежда каноничната продуктова структура до точни routes, owners, mappings, CTA и acceptance проверки. Тя не променя schema/RLS/roles/status/quotas или production code.

## 1. GLOBAL SCREEN MATRIX

| Surface | Primary job | Primary action | Secondary actions | Owner/read source | Забранено |
|---|---|---|---|---|---|
| Home | Започни търсене или marketplace задача | Search / `Обяви и услуги` | Discover, Info, Guides, Q&A | Composition only | 16 равни cards; Ask като primary |
| `obyavi.html` | Един marketplace landing | Browse/search + `Добави обява` | Filters, secondary Ask | Listings + relevant Firms | Втори `Категории` tree |
| `maistori.html` | Ремонти и майстори | Browse exact leaf/results | Add listing, Firms, Ask | Listings + Firms + protected Masters | Add buttons под всяка card |
| `avtomobili.html` | Автомобили и auto services | Browse exact leaf/results | Add listing, Firms, Ask | Listings + Firms | Смесване vehicle/service stored mapping |
| `rabota.html` | Други услуги | Browse exact leaf/results | Add listing, Firms, Ask | Listings + Firms | Представяне като Jobs owner |
| `obyavi.html?main=other` | Останалите обяви | Browse stored listing category | Add listing | Listings | Raw `Услуги` като leaf |
| `firmi.html` | Постоянни профили | Find/open firm | Add firm | Firms | Да замени temporary listing |
| `info.html` | Проверена local information | Search/task shortcut | Correction/report | Info owners | Generic marketplace Add |
| Health | Проверена здравна информация | Find/direct trusted action | Specialized add/correction, Ask | Health/Info | Generic Firm/Listing add |
| `magazini.html` | Местни магазини | Browse Shop owner | Specialized Add shop | Shops | Generic Firm fallback |
| `zavedenia.html` | Заведения | Browse/open permanent profile | Add firm/venue, Ask | Firms category `Заведения` | Втори restaurant owner |
| `sabitiya.html` | Approved events discovery | Browse/open event | Ask; share eligible event | Events | Fake public Add Event |
| Search | Един cross-owner search | Open best result | Recover/filter/Add/Ask | Explicit Search owner | localStorage/static-only truth |
| Q&A | Community memory | Read/answer/ask | Share/report | Questions/Answers | Да води taxonomy |
| Articles | Process guidance | Read guide | Owner links/share | Editorial registry | Mutable facts като duplicate truth |
| Profile | Status/own content | Resume/edit/view | Share when public | Cross-owner aggregation | Permission logic само във frontend |

## 2. MARKETPLACE GROUP ROUTES

| Public group | Key | Browse route | Add prefill | Stored owner |
|---|---|---|---|---|
| Майстори и ремонти | `maistori` | `maistori.html` | `dobavi-obqva.html?main=maistori` | Listings + read composition with Firms/Masters |
| Автомобили | `avtomobili` | `avtomobili.html` | `dobavi-obqva.html?main=avtomobili` | Listings + relevant Firms |
| Други услуги | `uslugi` | `rabota.html` | `dobavi-obqva.html?main=uslugi` | Listings + relevant Firms |
| Други обяви | `other` | `obyavi.html?main=other` | `dobavi-obqva.html?main=other` | Listings |

Правила:

- тези четири keys вече са production V3 compatibility values;
- формата не добавя отделни main values `work` или `property`;
- unknown main/subcategory не default-ва към първата опция;
- invalid context остава unselected и показва ясна validation грешка;
- `edit=<id>` supersede-ва всички create params.

## 3. МАЙСТОРИ И РЕМОНТИ — EXACT MAPPING

Всички rows използват stored `category=Услуги` и exact stored `subcategory`.

| Public leaf | Browse | Add prefill | Stored subcategory |
|---|---|---|---|
| Цялостни ремонти | `maistori.html?subcategory=Цялостни ремонти` | `?main=maistori&subcategory=Цялостни ремонти` | `Цялостни ремонти` |
| Бани и плочки | `maistori.html?subcategory=Бани и плочки` | `?main=maistori&subcategory=Бани и плочки` | `Бани и плочки` |
| ВиК | `maistori.html?subcategory=ВиК` | `?main=maistori&subcategory=ВиК` | `ВиК` |
| Електро | `maistori.html?subcategory=Електро` | `?main=maistori&subcategory=Електро` | `Електро` |
| Покриви | `maistori.html?subcategory=Покриви` | `?main=maistori&subcategory=Покриви` | `Покриви` |
| Боядисване | `maistori.html?subcategory=Боядисване` | `?main=maistori&subcategory=Боядисване` | `Боядисване` |
| Дограма | `maistori.html?subcategory=Дограма` | `?main=maistori&subcategory=Дограма` | `Дограма` |
| Климатици | `maistori.html?subcategory=Климатици` | `?main=maistori&subcategory=Климатици` | `Климатици` |

`?` в Add prefill означава suffix към `dobavi-obqva.html`.
Route builder-ът URL-encode-ва стойностите; таблиците ги показват четимо, за да могат да се сверяват с protected dictionary.

## 4. АВТОМОБИЛИ — EXACT MAPPING

| Public leaf | Browse route state | Stored category | Stored subcategory |
|---|---|---|---|
| Автомобили за продажба или търсене | `avtomobili.html?subcategory=Автомобили за продажба или търсене` | `Автомобили и МПС` | empty |
| Авточасти | `avtomobili.html?subcategory=Авточасти` | `Услуги` | `Авточасти` |
| Автосервизи | `avtomobili.html?subcategory=Автосервизи` | `Услуги` | `Автосервизи` |
| Диагностика | `avtomobili.html?subcategory=Диагностика` | `Услуги` | `Диагностика` |
| Гуми | `avtomobili.html?subcategory=Гуми` | `Услуги` | `Гуми` |
| Автомивки | `avtomobili.html?subcategory=Автомивки` | `Услуги` | `Автомивки` |
| Пътна помощ | `avtomobili.html?subcategory=Пътна помощ` | `Услуги` | `Пътна помощ` |

Add prefill е `dobavi-obqva.html?main=avtomobili&subcategory=<public leaf>`.

Protected intent mapping:

- vehicle `offer` → `Продава`;
- vehicle `seek` → `Купува`;
- automotive service `offer` → `Продава` compatibility;
- automotive service `seek` → `Търси`.

## 5. ДРУГИ УСЛУГИ — EXACT MAPPING

Всички rows използват stored `category=Услуги`.

| Public label | Browse state | Add prefill | Exact stored subcategory |
|---|---|---|---|
| Домашна помощ | `rabota.html?subcategory=Домашна помощ` | `?main=uslugi&subcategory=Домашна помощ` | `Домашна помощ` |
| Красота и грижа | `rabota.html?subcategory=Красота и грижа` | `?main=uslugi&subcategory=Красота и грижа` | `Красота и грижа` |
| Компютърни и технически услуги | `rabota.html?subcategory=Компютърни и технически услуги` | `?main=uslugi&subcategory=Компютърни и технически услуги` | `Компютърни и технически услуги` |
| Фото и видео | `rabota.html?subcategory=Фото, видео и събитийни услуги` | `?main=uslugi&subcategory=Фото, видео и събитийни услуги` | `Фото, видео и събитийни услуги` |
| Професионални услуги | `rabota.html?subcategory=Професионални услуги` | `?main=uslugi&subcategory=Професионални услуги` | `Професионални услуги` |
| Обучение и уроци | `rabota.html?subcategory=Обучение и уроци` | `?main=uslugi&subcategory=Обучение и уроци` | `Обучение и уроци` |
| Грижа | `rabota.html?subcategory=Грижа за деца, възрастни и домашни любимци` | `?main=uslugi&subcategory=Грижа за деца, възрастни и домашни любимци` | `Грижа за деца, възрастни и домашни любимци` |
| Транспорт, преместване и доставки | `rabota.html?subcategory=Транспорт, преместване и доставки` | `?main=uslugi&subcategory=Транспорт, преместване и доставки` | `Транспорт, преместване и доставки` |

Public alias се показва по-кратко, но URL adapter и form select записват exact protected value.

## 6. ДРУГИ ОБЯВИ — EXACT MAPPING

Тези leaves използват exact protected listing category и празна service subcategory.

| Public leaf | Browse state | Stored category | Specialized type |
|---|---|---|---|
| Електроника | `obyavi.html?main=other&subcategory=Електроника` | `Електроника` | normal listing type |
| Дом и градина | `obyavi.html?main=other&subcategory=Дом и градина` | `Дом и градина` | normal listing type |
| Дрехи и обувки | `obyavi.html?main=other&subcategory=Дрехи и обувки` | `Дрехи и обувки` | normal listing type |
| Деца и бебета | `obyavi.html?main=other&subcategory=Деца и бебета` | `Деца и бебета` | normal listing type |
| Спорт и хоби | `obyavi.html?main=other&subcategory=Спорт и хоби` | `Спорт и хоби` | normal listing type |
| Животни | `obyavi.html?main=other&subcategory=Животни` | `Животни` | normal listing type |
| Работа | `obyavi.html?main=other&subcategory=Работа` | `Работа` | `Предлага работа` / `Търси работа` |
| Имоти | `obyavi.html?main=other&subcategory=Имоти` | `Имоти` | `Продава имот` / `Отдава под наем` / `Търси под наем` / `Търси за купуване` |
| Друго | `obyavi.html?main=other&subcategory=Друго` | `Друго` | normal listing type |

Add prefill е `dobavi-obqva.html?main=other&subcategory=<exact stored category>`.

## 7. DISPOSITION НА 16-ТЕ V6 THEMATIC CONCEPTS

Това е compatibility/cross-link map, не втора public taxonomy.

| B1 concept | Final place | Public behavior |
|---|---|---|
| Строителство и ремонти | Marketplace group `maistori` | Group/deep browse |
| Здраве и лекари | Specialized Info/Health | Direct specialized surface |
| Работа | `other → Работа` | Listing category with protected types |
| Автомобили | Marketplace group `avtomobili` | Group/deep browse |
| Имоти | `other → Имоти` | Listing category with protected types |
| Красота | `uslugi → Красота и грижа` | Service leaf |
| Дом и градина | `other → Дом и градина` | Listing leaf; contextual links to Shops/Construction |
| Магазини | Specialized Shops | Direct specialized surface |
| Заведения и храна | Firms category `Заведения` | Direct Restaurants/Firms surface |
| Електроника | `other → Електроника` | Listing leaf |
| Деца и бебета | `other → Деца и бебета` | Listing leaf; contextual Info/Health links |
| Животни | `other → Животни` | Listing leaf; Vet Health/Griжа cross-links |
| Мода | `other → Дрехи и обувки` | Public alias/cross-link |
| Спорт и хоби | `other → Спорт и хоби` | Listing leaf |
| Други услуги | Marketplace group `uslugi` | Group/deep browse |
| Други обяви | Marketplace group `other` | Group browse |

Acceptance: никой от тези concepts не създава нов write owner или duplicate record.

## 8. CATEGORY CARD / CTA CONTRACT

| Element | Click target | Carries context | Must not do |
|---|---|---|---|
| Main group card | Group browse page/state | main group | Open Add form |
| Subcategory card/chip | Filtered browse results | main + subcategory | Submit/create or pass fake leaf |
| `Добави обява` on landing | Listing form | none | Guess category |
| `Добави обява` in group | Listing form | main; current valid subcategory if selected | Set role/status |
| `Предлагат/Търсят` filter | Current result surface | intent filter | Become Add CTA |
| `Фирми` filter | Relevant Firms results | current theme | Write to Firms |
| `Попитай` | Ask form | bounded visible context | Become primary marketplace action |

No leaf named `Всички`, `Предлагат` or `Търсят` is ever passed as `subcategory`.

## 9. RESULT COMPOSITION

| Group | Listing results | Firm results | Special protected behavior |
|---|---|---|---|
| Майстори | Approved active `Услуги` matching 8 leaves | Relevant approved Firms | Construction/Ivanov priority only after eligibility/relevance |
| Автомобили | Vehicle category or matching 6 service leaves | Relevant automotive Firms | Owner-native protected ordering |
| Други услуги | Approved active `Услуги` matching 8 leaves | Relevant service Firms | No giant generic keyword fallback as authority |
| Други обяви | Exact stored category | Only contextual links when useful | Work/Property specialized types preserved |

Result card minimum:

- content type `Обява` or `Фирма`;
- title/name;
- relevant category/subcategory;
- location/status-safe summary;
- owner-native contact/detail CTA;
- no fake rating/recommendation/verification.

## 10. FORM FIELD / ROLE COVERAGE

### Listing must preserve

- personal vs own approved firm publisher where allowed;
- normal/firm quota context;
- public intent + four groups + bounded subcategory;
- Work/Property specialized types;
- title, description, EUR price + BGN orientation;
- negotiable/free;
- phone, city/area, optional street;
- current media preview/remove/count/errors/optimization/edit behavior;
- terms;
- Admin-only protected options only for Admin.

### Firm must preserve

- name/category/phone;
- optional city/address/hours;
- description;
- 1 logo + normal gallery up to protected limit;
- expanded fields only when protected access exists;
- normal edit draft + last approved public version;
- Admin direct publication and access management only where locked.

### Role matrix

| Capability | Anonymous | Normal | Moderator own content | Admin |
|---|---:|---:|---:|---:|
| Browse public approved | Yes | Yes | Yes | Yes |
| Inspect create form | Yes | Yes | Yes | Yes |
| Submit own content | Login required | Yes | Yes, normal owner flow | Yes |
| Direct publish listing/firm | No | No | No | Existing protected flow only |
| Self-moderate | No | No | No | Admin flow |
| Expanded access self-enable | No | No | No | Manage through protected flow |
| Permanent delete | No | No | No | Existing Admin-only flow |

## 11. FORM LIFECYCLE MATRIX

Every applicable content form must pass:

`open → context → dirty → validate → submit lock → error/retry or success receipt → next action`

| Form family | Context owner | Pending/public truth | Dirty guard | Success replacement |
|---|---|---|---|---|
| Listing create/edit | Listings | Normal/Moderator pending; Admin protected direct | Required | Required |
| Firm create/edit/expanded | Firms | Normal/Moderator pending; Admin protected direct | Required | Required |
| Question/Answer | Q&A | Existing moderation truth | Required for written content | Required |
| Health add/correction/signal | Health/Info | Pending/review | Already reference pattern; preserve | Required |
| Shop proposal | Shops | Pending/review | Preserve | Required |
| Info correction | Info | Pending/review | Preserve | Required |
| Report/Contact | Current owners | Submitted, not published | Required for material message | Required |
| Login/Forgot/Reset | Auth | Auth owner truth | No aggressive content guard | Clear result, no privacy leak |
| Registration | Auth | Actual confirmation state | Validation-first | Clear completed state |

System/network error after valid input must retain all safe entered data and re-enable retry without duplicate write.

## 12. SPECIALIZED ACTION MATRIX

| Context | Find | Add | Correction/report | Ask |
|---|---|---|---|---|
| Health | Health/Info | specialized `info_submissions` flow | specialized Info error/correction | secondary Health-context Q&A |
| Shops | Shops | specialized Shop modal/form | Shop owner/report path | secondary Shop-context Q&A |
| Restaurants | Firms | `Добави фирма/заведение` through Firms | Firm report/edit owner | secondary |
| Events | Events read | **none** | Events/Admin report path if available | allowed |
| Info | Info | owner-specific proposal only where real | correction/error report | secondary |
| Articles | Editorial read | none | editorial issue/report | related Q&A only |

## 13. SEARCH ACCEPTANCE

Must test at least:

| Query | Expected leading family |
|---|---|
| `ВиК майстор` | relevant Masters listings/firms |
| `Автосервиз` | Automotive service listings/firms |
| `търся работа шофьор` | Jobs listings |
| `двустаен под наем` | Property listings |
| `зъболекар` | verified Health before community opinion |
| `НОИ телефон` | Info/Institution authoritative result |
| `кой майстор препоръчвате` | relevant entities + Q&A/community context |
| unknown query | true no-result recovery, not false result |
| one owner failure | partial failure state, not `0 резултата` |

One Search owner; no parallel legacy/new renderers.

## 14. FACEBOOK BRIDGE ACCEPTANCE

| State | Share available | Expected behavior |
|---|---:|---|
| Pending/rejected/private | No | Exact status; no public-share promise |
| Public canonical | Yes | Native/Facebook/copy fallback to canonical URL |
| Expired listing | No promotional share | Honest unavailable/expired destination |
| Canonical Q&A alias | Canonical winner only | Alias resolves; no duplicate share asset |
| Stale high-risk Info | Restricted | Owner/freshness-safe presentation |
| Facebook→Popitai | User-assisted only | Own text paste, visible suggestions, normal moderation |

Forbidden: scraping, arbitrary group automation, external comment/reaction import, hidden credentials/cookies, SDK loaded globally without need.

## 15. DESKTOP / MOBILE PRESENTATION CHECKS

### Desktop

- canonical header fits supported widths;
- landing shows 4 group cards without competing equal CTAs;
- results are visible without oversized empty hero;
- full leaf expansion is grouped, scannable and keyboard reachable;
- no brittle content order based solely on `nth-of-type`.

### Mobile

- exact five-item bottom nav;
- search + 4 groups + Add are understandable in first task path;
- initial screen does not render all leaves;
- group page shows 4–5 priority leaves + `Покажи всички`;
- active leaf and filters are horizontally/vertically safe;
- bottom nav does not cover result/form CTA;
- modal focus, Escape/back, keyboard and safe-area behavior pass.

## 16. PROTOTYPE CONSOLIDATION CHECKLIST

Before any visual polish:

- [ ] remove/disable separate `categories` route as independent screen;
- [ ] route all category shortcuts to marketplace/group/specialized owners;
- [ ] change subcategory click from `form-listing` to browse/filter;
- [ ] listing form exposes exactly four public main groups;
- [ ] Work/Property move under `other` with protected type fields;
- [ ] every public category has explicit mapping; no default to Construction;
- [ ] `Всички/Предлагат/Търсят` never become subcategory;
- [ ] one active route/runtime owner;
- [ ] one active form lifecycle owner;
- [ ] consolidate visual layers instead of adding V18;
- [ ] preserve Info/Health visual canon and click depth;
- [ ] active scripts pass syntax;
- [ ] every referenced asset exists;
- [ ] CI includes `v6-prototype/`;
- [ ] browser desktop/mobile review is recorded honestly.

## 17. PROTECTED REGRESSION CHECKLIST

- [ ] Listings quotas unchanged;
- [ ] normal media limits unchanged;
- [ ] Admin media rule not silently redefined as `20`;
- [ ] normal/Moderator content stays pending;
- [ ] Moderator cannot self-moderate;
- [ ] Admin direct publish preserved only where approved;
- [ ] last approved version remains public during normal edit review;
- [ ] Firms expanded access remains Admin-managed;
- [ ] Health/Shops specialized owners preserved;
- [ ] Events has no fake public Add;
- [ ] Ivanov/Admin/boost priority applies only after relevance;
- [ ] search does not lose protected ordering;
- [ ] edit context never falls into create;
- [ ] no new schema/RLS/write owner as presentation side effect.

## 18. DOCUMENT-TO-TEST TRACEABILITY

| Requirement family | Governing source | Test artifact |
|---|---|---|
| Four-group marketplace | Marketplace V3 + Canonical Recovery | route/category/form contract test |
| Protected roles/owners | PROJECT_RULES + C protected/form locks | role regression matrix |
| Form lifecycle | C lifecycle lock + audit matrix | manual + automated form state tests |
| Search | B2/B8 applicable contracts | intent/result/failure cases |
| Info/Health | B3 + Info visual canon | click-depth/source/freshness parity |
| Q&A | B5/B6 applicable contracts | duplicate/moderation/share cases |
| Facebook | B7 | share eligibility/fallback/privacy cases |
| Articles | B4 + inventory/copy rules | readiness/content QA |
| Render ownership | PROJECT_RULES_RENDER_OWNERSHIP | owner/static checks |

## 19. READY CONDITION

Тази матрица е complete за recovery review, когато:

- всички rows са синхронизирани с Canonical Recovery;
- Document Index класифицира всеки V6 документ;
- Master/Progress/Handoff сочат към същата exact task;
- няма placeholder route, fake Add или unmapped category;
- docs checks минават;
- user е получил ясна схема преди code approval.
