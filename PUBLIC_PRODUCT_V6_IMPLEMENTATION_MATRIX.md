# Попитай.Лом — V6 IMPLEMENTATION / ACCEPTANCE MATRIX

Статус: **UPDATED DRAFT FOR WHOLE-STRUCTURE APPROVAL / NO IMPLEMENTATION PERMISSION**  
Branch: `v6-product-foundation-draft`  
Актуализирано: 03.09.2026

Тази матрица превежда актуализирания Recovery target до public labels, routes/states, owners, add destinations и stored compatibility values.

Тя **не променя** schema/RLS/roles/status/quotas/ownership и не е разрешение за код.

## 1. GLOBAL SCREEN MATRIX

| Surface | Primary job | Primary action | Read owner/source | Add destination | Забранено |
|---|---|---|---|---|---|
| Home | Започни local task | Search / `Обяви и услуги` | Composition only | Global `+` | 16 равни cards; Ask primary |
| `obyavi.html` | Един marketplace landing | Browse/search 5 public entries | Listings + relevant specialized read owners | `dobavi-obqva.html` | Втори `Категории` tree |
| Services | Browse service families | Group/leaf → results | Listings + Firms + specialized Masters/Health where applicable | Contextual listing Add | Raw stored `Услуги` като UX |
| `avtomobili.html` | Vehicles + auto services | Subcategory → results | Listings + relevant Firms | Vehicle/service listing Add | Mixed stored semantics |
| Work | Jobs discovery | Job result/type filter | Listings category `Работа` | Listing Add with Work context | Generic service owner |
| Property | Property discovery | Property result/type filter | Listings category `Имоти` | Listing Add with Property context | New property schema |
| Trade | General buy/sell discovery | Category → results | Listings | Listing Add with Trade context | Work/Property duplicated here |
| `zdrave-i-lekari.html` | Verified health + health service discovery | Find/open trusted result or temporary listing | Health/Info + Listings composition | Two separate CTAs | Replace page with generic listings |
| `firmi.html` | Permanent profiles | Find/open firm | Firms | `dobavi-firma.html` | Temporary offer stored as firm |
| `info.html` | Verified local info | Find/direct action | Info owners | Owner-specific correction/proposal | Generic marketplace Add |
| `magazini.html` | Shops | Browse/open shop | Shops | Specialized shop flow | Generic firm fallback |
| `zavedenia.html` | Restaurants/venues | Browse/open profile | Firms `Заведения` | Add firm/venue | Second restaurant datastore |
| `sabitiya.html` | Approved events | Browse/open event | Events | none | Fake Add Event |
| Search | Cross-owner discovery | Open best result | Explicit Search composition | Contextual applicable Add | Static/localStorage truth |
| Q&A | Community knowledge | Read/answer/ask | Q&A | Ask/Answer | Drive taxonomy |
| Articles | Guides | Read | Editorial | none | Duplicate mutable facts |

## 2. FIVE PUBLIC MARKETPLACE ENTRIES

Това са **presentation keys**, не DB values.

| Public entry | Presentation key | Browse target | Add context target | Stored owner/value |
|---|---|---|---|---|
| Услуги | `services` | `rabota.html` compatibility surface, visible meaning `Услуги` | `dobavi-obqva.html?main=services` | Listings; usually category `Услуги`; specialized Health/Masters read composition |
| Автомобили | `vehicles` | `avtomobili.html` | `dobavi-obqva.html?main=vehicles` | `Автомобили и МПС` or `Услуги` auto-service values |
| Работа | `work` | `obyavi.html?main=work` target state | `dobavi-obqva.html?main=work` | category `Работа` |
| Имоти | `property` | `obyavi.html?main=property` target state | `dobavi-obqva.html?main=property` | category `Имоти` |
| Купува и продава | `trade` | `obyavi.html?main=trade` target state | `dobavi-obqva.html?main=trade` | 7 existing general listing categories |

Notes:

- `main=*` тук е proposed presentation adapter state; не е DB column/value.
- current production/branch runtime може още да няма тези query adapters; това е R1 target, не твърдение за implemented behavior.
- `kategorii.html` остава compatibility entry към `obyavi.html`.
- `rabota.html` запазва current visible meaning `Услуги`; filename не се използва като основание да върнем `Работа` там.

## 3. `УСЛУГИ` — GROUP ROUTE MATRIX

| Public group | Group key | Browse target | Read composition | Add behavior |
|---|---|---|---|---|
| Майстори и ремонти | `masters` | `maistori.html` | Listings + Firms + protected Masters/Ivanov | Listing Add with exact leaf |
| Здраве и грижа | `health` | `zdrave-i-lekari.html` | Health/Info verified + future Listings health services | **Two distinct flows**, see §5 |
| Домашни услуги | `home` | `rabota.html?group=home` target state | Listings + relevant Firms | Listing Add |
| Красота и лична грижа | `beauty` | `rabota.html?group=beauty` target state | Listings + relevant Firms | Listing Add |
| Компютърни и технически услуги | `tech` | `rabota.html?group=tech` target state | Listings + relevant Firms | Listing Add |
| Професионални услуги | `professional` | `rabota.html?group=professional` target state | Listings + relevant Firms | Listing Add |
| Обучение и уроци | `education` | `rabota.html?group=education` target state | Listings + relevant Firms | Listing Add |
| Транспорт и доставки | `transport` | `rabota.html?group=transport` target state | Listings + relevant Firms | Listing Add |

Group card = browse. It does not submit or open form.

## 4. SERVICES — PUBLIC LABEL ↔ STORED VALUE

### 4.1 Майстори и ремонти — exact existing values

All rows: stored `category=Услуги`.

| Public leaf | Browse target | Add context | Stored subcategory |
|---|---|---|---|
| Цялостни ремонти | `maistori.html?subcategory=Цялостни ремонти` | `main=services&group=masters&subcategory=Цялостни ремонти` | `Цялостни ремонти` |
| Бани и плочки | `maistori.html?subcategory=Бани и плочки` | `main=services&group=masters&subcategory=Бани и плочки` | `Бани и плочки` |
| ВиК | `maistori.html?subcategory=ВиК` | `main=services&group=masters&subcategory=ВиК` | `ВиК` |
| Електро | `maistori.html?subcategory=Електро` | `main=services&group=masters&subcategory=Електро` | `Електро` |
| Покриви | `maistori.html?subcategory=Покриви` | `main=services&group=masters&subcategory=Покриви` | `Покриви` |
| Боядисване | `maistori.html?subcategory=Боядисване` | `main=services&group=masters&subcategory=Боядисване` | `Боядисване` |
| Дограма | `maistori.html?subcategory=Дограма` | `main=services&group=masters&subcategory=Дограма` | `Дограма` |
| Климатици | `maistori.html?subcategory=Климатици` | `main=services&group=masters&subcategory=Климатици` | `Климатици` |

### 4.2 Existing general services redistributed under clearer public groups

All rows: stored `category=Услуги`.

| Public group | Public leaf | Exact stored subcategory |
|---|---|---|
| Домашни услуги | Домашна помощ | `Домашна помощ` |
| Домашни услуги | Грижа за деца, възрастни и домашни любимци | `Грижа за деца, възрастни и домашни любимци` |
| Красота и лична грижа | Красота и лична грижа | `Красота и грижа` |
| Компютърни и технически услуги | Компютърни и технически услуги | `Компютърни и технически услуги` |
| Професионални услуги | Професионални услуги | `Професионални услуги` |
| Професионални услуги | Фото и видео услуги | `Фото, видео и събитийни услуги` |
| Обучение и уроци | Обучение и уроци | `Обучение и уроци` |
| Транспорт и доставки | Транспорт и доставки | `Транспорт, преместване и доставки` |

No DB migration is required for the rows above because they are public grouping/alias changes over existing V1 values.

## 5. HEALTH — DUAL OWNER / TWO CTA CONTRACT

Destination: `zdrave-i-lekari.html`.

Existing branch evidence already has:

- Health verified results;
- tabs/filters/search;
- `health-catalog-v2.js`;
- specialized add form;
- `health-submissions-v1.js`;
- write to `info_submissions`;
- error report flow;
- contextual link to `Инфо Лом → Здраве`.

The target must preserve this.

| User intent | Visible CTA | Destination/owner | Result |
|---|---|---|---|
| Add permanent specialist/practice | `Добави специалист или практика` | Existing Health submission flow / `info_submissions` | Pending Health/Info review |
| Offer temporary health service | `Публикувай или потърси здравна услуга` → `Предлагам` | Listings form with Health context | Normal Listings lifecycle |
| Seek temporary health service | same CTA → `Търся` | Listings form with Health context | Normal Listings lifecycle |
| Correct verified record | `Сигнализирай грешка` / correction | Health/Info error/correction owner | Pending review |
| Ask community | `Задай въпрос` | Q&A | Secondary, not verified fact |

No shared write owner. No auto-copy between `info_entries/info_submissions` and `listings`.

## 6. HEALTH SERVICE PUBLIC TAXONOMY

Proposed public leaves:

| # | Public health service leaf | Public browse state | Stored listing mapping |
|---:|---|---|---|
| 1 | Домашни здравни грижи | Health service filter | **LOCKED V2 pending** |
| 2 | Медицинска сестра и манипулации | Health service filter | **LOCKED V2 pending** |
| 3 | Рехабилитация и кинезитерапия | Health service filter | **LOCKED V2 pending** |
| 4 | Физиотерапия | Health service filter | **LOCKED V2 pending** |
| 5 | Психологическо консултиране | Health service filter | **LOCKED V2 pending** |
| 6 | Логопед и специализирани терапии | Health service filter | **LOCKED V2 pending** |
| 7 | Диетолог и хранителни консултации | Health service filter | **LOCKED V2 pending** |
| 8 | Терапевтичен масаж и възстановяване | Health service filter | **LOCKED V2 pending** |
| 9 | Грижа за възрастни и болни | Health service filter | **LOCKED V2 pending** |
| 10 | Придружаване и помощ при лечение | Health service filter | **LOCKED V2 pending** |
| 11 | Друга здравна услуга | Health service filter | **LOCKED V2 pending** + required concrete-name field |

### Why stored mapping is LOCKED

Current Stage1 contract enforces:

- exactly 11 listing categories;
- category `Услуги` must use one of exactly 22 V1 subcategories;
- arbitrary non-empty service subcategory is rejected by the protected validator/DB integrity contract.

Therefore this Matrix does **not** pretend that the 11 health values are already valid stored values.

Required later decision if the public structure is approved:

`HEALTH LISTING TAXONOMY V2 — LOCKED AMENDMENT`

It must explicitly decide how the 11 health leaves are represented in the existing Listings data contract and how DB validator/CHECK/trigger/RPC/frontend dictionary are versioned. No silent V1 edit.

For regulated health activities, a separate professional-verification/moderation decision is also required before implementation.

## 7. AUTOMOBILES — EXACT MAPPING

| Public leaf | Browse target | Stored category | Stored subcategory |
|---|---|---|---|
| Автомобили за продажба или търсене | `avtomobili.html` vehicle state | `Автомобили и МПС` | empty |
| Авточасти | `avtomobili.html?subcategory=Авточасти` | `Услуги` | `Авточасти` |
| Автосервизи | `avtomobili.html?subcategory=Автосервизи` | `Услуги` | `Автосервизи` |
| Диагностика | `avtomobili.html?subcategory=Диагностика` | `Услуги` | `Диагностика` |
| Гуми | `avtomobili.html?subcategory=Гуми` | `Услуги` | `Гуми` |
| Автомивки | `avtomobili.html?subcategory=Автомивки` | `Услуги` | `Автомивки` |
| Пътна помощ | `avtomobili.html?subcategory=Пътна помощ` | `Услуги` | `Пътна помощ` |

Intent compatibility remains protected:

- vehicle offer → `Продава`;
- vehicle seek → `Купува`;
- auto-service offer → existing service compatibility type;
- auto-service seek → `Търси`.

## 8. WORK — EXACT OWNER/TYPE MAPPING

Public entry: `Работа`.

Stored category: `Работа`.

No new `subcategory` in this Recovery.

| Public filter/intent | Protected `listing_type` |
|---|---|
| Предлагат работа | `Предлага работа` |
| Търсят работа | `Търси работа` |

Browse target: `obyavi.html?main=work` target state.

Add target: `dobavi-obqva.html?main=work`.

The adapter maps presentation state to protected category/type. It does not invent a new DB category.

## 9. PROPERTY — EXACT OWNER/TYPE MAPPING

Public entry: `Имоти`.

Stored category: `Имоти`.

No new `subcategory` in this Recovery.

| Public action/filter | Protected `listing_type` |
|---|---|
| Продава | `Продава имот` |
| Отдава под наем | `Отдава под наем` |
| Търси под наем | `Търси под наем` |
| Търси да купи | `Търси за купуване` |

Browse target: `obyavi.html?main=property` target state.

Add target: `dobavi-obqva.html?main=property`.

## 10. `КУПУВА И ПРОДАВА` — EXACT CATEGORY MAPPING

Presentation group only; no single stored category.

| Public leaf | Stored category | Stored subcategory |
|---|---|---|
| Електроника | `Електроника` | empty |
| Дом и градина | `Дом и градина` | empty |
| Дрехи и обувки | `Дрехи и обувки` | empty |
| Деца и бебета | `Деца и бебета` | empty |
| Спорт и хоби | `Спорт и хоби` | empty |
| Животни | `Животни` | empty |
| Друго | `Друго` | empty |

Browse state: `obyavi.html?main=trade&category=<presentation leaf>` target adapter.

Add context: `dobavi-obqva.html?main=trade&category=<presentation leaf>`.

Work/Property/Vehicles are not duplicated here.

## 11. PUBLIC LABELS VS TECHNICAL VALUES

| Public label | Technical meaning |
|---|---|
| Услуги | presentation entry; many rows still stored as category `Услуги` |
| Здраве и грижа | public service group; specialized Health route + future listing context |
| Красота и лична грижа | alias → stored `Красота и грижа` |
| Фото и видео услуги | alias → stored `Фото, видео и събитийни услуги` |
| Транспорт и доставки | alias → stored `Транспорт, преместване и доставки` |
| Работа | public entry → stored category `Работа` |
| Имоти | public entry → stored category `Имоти` |
| Купува и продава | presentation group over 7 existing categories |
| `services/vehicles/work/property/trade` | proposed presentation state keys, never DB category values |

Technical/internal values are never shown as unexplained UI labels.

## 12. CATEGORY CARD / CTA CONTRACT

| Element | Click target | Carries context | Must not do |
|---|---|---|---|
| Main public entry card | Browse surface/state | main presentation key | Open form |
| Services group card | Group/specialized browse | main + group | Create record |
| Leaf/subcategory card | Filtered results | bounded category/subcategory | Submit/create |
| `Добави обява` landing | Listing form | none | Guess category |
| Contextual `Добави обява` | Listing form | valid bounded context | Set role/status/owner |
| Health specialist CTA | Health submission owner | Health context | Write Listings |
| Health service CTA | Listings form | Health service context | Write Info/Health |
| Ask | Q&A | optional context | Become verified result |

`edit=<id>` supersedes every create prefill.

## 13. ADD FLOW MATRIX

| Public entry | Step after Offer/Seek | Required protected mapping |
|---|---|---|
| Services | service group → leaf | `Услуги` + exact valid subcategory, except specialized Health read owner |
| Vehicles | vehicle vs auto-service leaf | `Автомобили и МПС` or `Услуги` + auto-service subcategory |
| Work | Work | protected Work types |
| Property | Property | protected Property types |
| Trade | goods category | exact existing listing category |

Health service leaf mapping remains blocked by §6 until the separate locked amendment.

Form must preserve:

- owner/publisher choice where already allowed;
- quotas;
- media;
- edit safety;
- title/description/price/phone/location;
- Admin-only options only for Admin;
- normal/Moderator pending;
- Admin direct publish only where protected rules already allow it.

## 14. COMPATIBILITY FROM OLD V3 / RECOVERY

| Old presentation concept/key | New disposition |
|---|---|
| `maistori` main group | `services → masters`; `maistori.html` preserved |
| `avtomobili` | `vehicles`; `avtomobili.html` preserved |
| `uslugi` / `Други услуги` | renamed/reframed as `services`; label `Други услуги` removed |
| `other` / `Други обяви` | split: Work → `work`, Property → `property`, remaining goods → `trade` |
| `Работа` under other | now top-level public entry |
| `Имоти` under other | now top-level public entry |
| `rabota.html` as services compatibility URL | remains Services surface; does not define product label `Работа` |
| `kategorii.html` | compatibility only → marketplace |
| 4-group form presentation | superseded target; future R1 uses 5 public entries |

Old URL/deep-link acceptance should be preserved where it can be mapped safely without duplicate SEO/content trees.

## 15. SPECIALIZED OWNERS

| Context | Read owner | Write owner | Notes |
|---|---|---|---|
| Health verified | Health/Info | `info_submissions` / correction owner | Preserve existing verified surface |
| Health temporary service | Listings | Listings | Not auto-verified |
| Shops | Shops | Shops | No generic fallback |
| Restaurants | Firms | Firms | Category `Заведения` |
| Events | Events | none public | No fake Add |
| Info | Info | owner-specific proposal/correction | Separate from marketplace |
| Masters | Listings/Firms + protected Masters composition | existing protected owners | Ivanov priority preserved |
| Q&A | Q&A | Q&A | Secondary |

## 16. PROTECTED CONFLICT CHECK

| Checked rule/source | Finding | Decision |
|---|---|---|
| Protected Core | Listings/Firms/Masters/Admin behavior locked | **No change** |
| Admin/Moderator | Moderator boundaries/permanent delete/roles locked | **No change** |
| Render ownership | one renderer per root | R1 must consolidate, not layer |
| Stage1 taxonomy V1 | exactly 22 service subcategories enforced | **Conflict with 11 health leaves; separate LOCKED V2 required** |
| Current Health page | specialized verified content + specialized submission owner exists | **Preserve; add Listings as separate composition only** |
| Current `rabota.html` | visible page is Services | Keep as Services compatibility surface |
| Current `obyavi.html` | raw 11 category UI/current filters | R1 presentation adapter target; no DB category rewrite |
| Marketplace V3 | 4 groups / old labels | presentation clauses superseded only after whole approval; protected invariants retained |
| Info Lom | separate verified product | **No restructure** |

## 17. SEARCH ACCEPTANCE

Must distinguish:

- `ВиК майстор` → Masters listings/firms;
- `Автосервиз` → Automotive services;
- `търся работа шофьор` → Work listings;
- `двустаен под наем` → Property listings;
- `зъболекар` → verified Health before community opinion;
- health service query → verified specialists/practices plus temporary Listings with explicit content labels;
- unknown query → true no-result recovery;
- owner failure → partial failure, not false `0 резултата`.

Protected relevance/Ivanov ordering remains.

## 18. DESKTOP / MOBILE PRESENTATION CHECKS

Desktop:

- one marketplace landing;
- five clear public entry cards;
- Services expands to 8 groups;
- results start without giant empty hero;
- no duplicate Add clusters.

Mobile:

- exact five-item bottom nav;
- marketplace landing shows search + five entries + one Add without rendering every leaf at once;
- Services shows priority groups + `Покажи всички` if needed;
- active context remains visible;
- Health verified and temporary result types are distinguishable;
- bottom nav does not cover CTA/results/forms.

## 19. PROTOTYPE CONSOLIDATION CHECKLIST — AFTER APPROVAL ONLY

- [ ] no independent `categories` marketplace tree;
- [ ] landing uses 5 public entries;
- [ ] `Услуги` uses 8 groups;
- [ ] Masters/Autos existing routes preserved;
- [ ] Work/Property are own public entries;
- [ ] Trade excludes Work/Property/Vehicles;
- [ ] category cards browse, not form;
- [ ] Add carries bounded visible context;
- [ ] no fake subcategory from `Всички/Предлага/Търси`;
- [ ] one route/runtime/form lifecycle owner;
- [ ] Health page preserved;
- [ ] Health two CTA flows remain separate owners;
- [ ] no health listing stored-value implementation before locked V2;
- [ ] no new visual layer V18;
- [ ] current Info/Health parity preserved;
- [ ] CI/static checks and then real desktop/mobile review.

## 20. WHOLE-STRUCTURE READY CONDITION

This review package is ready for one whole-structure decision when:

- 5 public entries are accepted/rejected as a set;
- 8 Services groups are accepted/rejected as a set;
- all existing V1 service values have one public home;
- Autos/Work/Property/Trade mappings are explicit;
- Health specialized owner is preserved;
- 11 health public leaves are explicit;
- the Stage1 V1 conflict is visible and **not silently solved**;
- public labels and stored values are separated;
- every CTA has one destination/owner;
- no duplicate record/write owner is introduced;
- no code has been changed.

Whole approval authorizes bounded R1 prototype consolidation only.

Separate LOCKED approval remains required for health listing taxonomy V2 and regulated professional verification/data-contract changes.
