# Попитай.Лом — V6-C FULL-SITE INTERFACE BLUEPRINT

Статус: **AUTHORITATIVE V6-C PRODUCT / INTERFACE COMPLETENESS CONTRACT — PROTOTYPE ONLY**  
Branch: `v6-product-foundation-draft`  
Дата: 01.09.2026

Production impact: **NONE**.

Този документ променя начина на работа във V6-C: **преди визуално шлайфане на отделни блокове трябва да има един цялостен, navigable prototype на публичния продукт, който представлява всички вече одобрени owner-и, екрани, действия, форми и важни състояния.**

Той НЕ променя backend, schema/RLS, роли, квоти, moderation, protected owner-и, protected ranking или production URL-и.

При конфликт:

**LOCKED rules > approved production specs > V6 Master Control > completed B1–B9 contracts > този Full-site Blueprint > Home-only / older C prototype decisions > prototype implementation.**

`PUBLIC_PRODUCT_V6_C_HOME_ARCHITECTURE_DECISION.md` остава валиден само за решения, които не противоречат на този документ.

---

## 1. ОСНОВЕН ПРОЦЕСЕН LOCK

V6-C вече НЕ се одобрява блок по блок.

Редът е:

1. inventory на одобреното;
2. full-site screen map;
3. owner/destination map;
4. complete navigable prototype;
5. completeness review — нищо одобрено не е отпаднало;
6. едва след това visual polish по екрани;
7. едва след приемане на V6-C → V6-D technical design.

Забранено преди §5:
- micro-polish на една карта като заместител на цялостна архитектура;
- премахване на owner/category/action само защото не се побира в текущата mockup версия;
- prototype button към несвързан sample screen;
- нов визуален pattern за всеки блок без общ design system;
- „temporary“ fake CTA, който изглежда като реална функция.

---

## 2. SOURCE OF TRUTH / КАКВО ЗАПАЗВАМЕ

Blueprint-ът стъпва върху:
- LOCKED project/Admin/Moderator/render rules;
- `PUBLIC_MARKETPLACE_V3_APPROVED_SPEC.md`;
- approved public IA, доколкото Marketplace V3/B1–B9 не го supersede-ват;
- B1 stable V6 taxonomy and owner map;
- B2 Search V6;
- B3 Info truth/freshness;
- B4 Articles/Guides;
- B5 Q&A canonical rules;
- B6 recommendations;
- B7 Facebook/share bridge;
- B8 ranking/protected priority;
- B9 interactions/forms/buttons/links/states;
- current production public shell and existing protected/specialized form owners.

**V6 е нов presentation/orchestration layer върху одобрените системи — не нов сайт от нулата и не причина да загубим съществуваща функционалност.**

---

## 3. GLOBAL PRODUCT SHELL — LOCKED

### Desktop

`Начало | Обяви и услуги | Фирми | Инфо Лом | Статии | Още ▼ | Профил | + Добави`

`Още`:
- Въпроси;
- Събития;
- За сайта;
- Правила;
- Контакти.

### Mobile bottom nav

Точно:

`Начало | Обяви | + | Инфо | Профил`

### Global `+ Добави`

Default owner router:
1. Добави обява;
2. Добави фирма;
3. Задай въпрос.

Contextual specialized actions само ако реалният owner съществува:
- Health → Health/Info proposal;
- Shops → Shop proposal.

Няма fake `Добави събитие`.

### Accessibility baseline KEEP
- focus trap;
- Escape/backdrop close;
- focus return;
- no background interaction while modal is open;
- usable mobile safe area;
- visible focus states;
- one rendered owner per root.

---

## 4. COMPLETE PUBLIC SCREEN MAP

V6-C prototype трябва да представя поне следните screen families.

### A. Home
- compact brand/header;
- primary Search;
- priority categories;
- `Всички категории`;
- `Открий в Лом`;
- **all 6 canonical Info Lom entries**;
- useful ready/candidate Guides layer;
- Q&A/recommendation layer;
- footer/secondary navigation.

### B. All Categories
All 16 B1 public categories:
1. Строителство и ремонти
2. Здраве и лекари
3. Работа
4. Автомобили
5. Имоти
6. Красота
7. Дом и градина
8. Магазини
9. Заведения и храна
10. Електроника
11. Деца и бебета
12. Животни
13. Мода
14. Спорт и хоби
15. Други услуги
16. Други обяви

This is taxonomy navigation, not a second stored database.

### C. Common Category Shell
Every category uses the same recognizable product skeleton:
- breadcrumb;
- title + useful description;
- contextual search/filter;
- subcategory navigation where real;
- owner-aware results;
- contextual Add only when real owner exists;
- secondary `Попитай`;
- related guide/Q&A/entity links.

Health is visually equal but remains specialized owner/trust-wise.

### D. Marketplace / Listings
Prototype must include:
- `Обяви и услуги` landing;
- four Marketplace V3 public groups;
- deep category view;
- filter states `Всички | Предлагат | Търсят | Фирми` where applicable;
- listing cards;
- listing detail;
- listing Add form;
- edit/resubmit conceptual state;
- pending/approved/error/empty/loading states.

Marketplace V3 groups remain:
- Майстори и ремонти;
- Автомобили;
- Други услуги;
- Други обяви.

Jobs and Property remain Listings-owned.

### E. Firms
- Firms hub/search/filter;
- firm card;
- firm detail / expanded profile presentation;
- owner-native contact actions;
- add firm form;
- edit/status conceptual state;
- approved/pending/returned states.

Existing expanded profile capabilities are not silently removed by V6 presentation.

### F. Specialized discovery
Separate owner-aware surfaces for:
- Shops;
- Restaurants (Firms-owned presentation);
- Events;
- Health.

No owner collapse:
- Shop proposal is not Firm create;
- Health proposal is not Firm create;
- Event remains read-only in initial V6 unless future owner is separately approved.

### G. Info Lom
Canonical top level contains exactly six primary families:
1. **Здраве**
2. **Институции**
3. **Транспорт**
4. **Образование и култура**
5. **Банки и банкомати**
6. **Комунални и ежедневни услуги**

Home and Info hub must not accidentally drop Education/Culture or Banks/ATMs.

Info prototype also represents:
- category listing;
- verified detail;
- source/last confirmed/freshness language;
- official action/contact where safe;
- `Предложи корекция`;
- stale/conflict/safe qualification state.

### H. Search V6
- input/suggestions;
- success composition by result family;
- loading;
- partial;
- empty/no-result;
- offline;
- error;
- cancelled/newer-query state concept;
- correct result destination for every card.

No-result CTA = `Попитай Лом` only after real search plan is complete.

### I. Articles / Guides
- article index;
- topic grouping;
- article detail;
- owner links back to Info/category/entity where mutable facts live;
- related Q&A/action;
- share location;
- readiness distinction.

Official share only for `ПРОВЕРЕНО ГОТОВО` + canonical public URL.

Prototype candidate examples may be shown as candidates, e.g.:
- Как да се пенсионираш в Лом;
- Как се подменя лична карта в Лом;
- Как да подадеш сигнал до община или институция.

Prototype must not claim a candidate is factually production-ready before B4 gate passes.

### J. Q&A / Community
- questions index;
- canonical question detail;
- approved answers;
- unanswered state;
- Ask flow;
- duplicate/canonical warning concept;
- answer submit/pending state;
- recommendation relation where B6 permits;
- share only for public canonical item.

### K. Profile / Auth
- signed-out profile;
- login/register/recovery route entry;
- signed-in profile summary;
- My questions;
- Needs corrections;
- My firms;
- My listings;
- statuses/actions for edit/resubmit where owner allows;
- Admin link only under existing protected role rule;
- logout.

### L. Report / Correction
- generic report (`Докладвай` / signal);
- Info/Health `Предложи корекция` as separate semantic action;
- never instant public overwrite;
- target identity/context retained.

---

## 5. HOME — STRUCTURAL TARGET BEFORE PIXEL POLISH

Home is first screen but NOT the whole product.

Canonical mobile order for completeness prototype:

`Search → Основни категории → Открий в Лом → Проверена информация (6) → Полезни ръководства → Въпроси и препоръки`

### 5.1 Primary categories
Initial 2×2:
- Строителство и ремонти;
- Здраве и лекари;
- Работа;
- Автомобили.

CTA: `Всички категории` → All Categories screen.

### 5.2 Discover Lom
Exactly four discovery targets:
- Магазини;
- Заведения;
- Фирми;
- Събития.

**Visual rule:** this group must use a full-width coherent grid/row system. It must not render as a narrow right-hand column that leaves an empty left half on mobile. It may have a distinct semantic accent, but card geometry/tap density belongs to the same site design system as the main category cards.

### 5.3 Verified Info Lom
Exactly six compact targets:
- Здраве;
- Институции;
- Транспорт;
- Образование и култура;
- Банки и банкомати;
- Комунални услуги.

Mobile: dense 2×3 grid or equally clear full-width list, subject to rendered review.

### 5.4 Guides
Visible lower Home layer, not optional decoration.

Show only a bounded number of strongest useful cards. Production eligibility remains B4-ready only.

### 5.5 Community
Max 2 useful Q&A previews on mobile, with route to all questions.

---

## 6. FORM SYSTEM — ONE VISUAL LANGUAGE, REAL OWNER RULES

Every form uses the same product-level system:
- clear page title/context;
- visible progress/context where multi-step;
- labels above controls;
- helper text only when useful;
- field-level errors near field;
- preserve entered values on validation/network errors;
- disable duplicate submit while request is in flight;
- explicit success state;
- dirty-form warning when destructive close/back matters;
- mobile keyboard/input types appropriate;
- owner/status language exact.

### 6.1 Listing form — preserve existing capability
Must visibly account for:
- publish as personal/business where owner permits;
- quota information where applicable;
- Offer/Seek public intent;
- public group + dependent subcategory;
- special Job types;
- special Property types;
- title;
- description;
- price;
- negotiable;
- free/give-away;
- phone;
- city/area;
- optional street;
- up to 6 photos;
- rules consent;
- submit/moderation state.

Protected Admin-only extended controls remain protected and are NOT exposed to normal user in V6.

### 6.2 Firm form — preserve existing capability
- name;
- category;
- phone;
- optional city/address/hours;
- description;
- optional logo;
- gallery up to current owner limit;
- moderation result.

Protected expanded sections remain governed by existing rules; V6 presentation does not grant them to new roles.

### 6.3 Q&A form
- question title;
- category/topic;
- description;
- rules consent;
- duplicate/canonical context;
- moderation success.

### 6.4 Health proposal
- real specialized Health/Info types only;
- visible sign-in requirement;
- contextual fields such as name/type/specialty/phone/address;
- submission goes pending;
- no generic Firm fallback.

### 6.5 Shop proposal
- Shop-owned name/category/contact/location/tags as supported;
- dirty close confirmation;
- pending success;
- no generic Firm fallback.

### 6.6 Correction / report
Correction and report are visually related but semantically different.

---

## 7. DETAIL ACTION SYSTEM

Detail screen primary CTA is owner-native.

### Firm
- Обади се;
- Оферта/contact when supported;
- Сайт when supported;
- owner-specific other approved contact actions.

### Listing
- contact/open owner-native action;
- share only when public;
- report.

### Info/Health
- trusted factual action/contact;
- source/confirmation context;
- correction;
- share only when safe/eligible.

### Shop
- shop-native contact/detail;
- proposal/correction only through owner;
- share when public.

### Q&A
- read approved answers;
- answer;
- share public canonical;
- report.

### Article
- related next action;
- authoritative Info links;
- share only when B4/B7 eligible.

### Event
- current event information/action;
- share only if public/canonical;
- no fake add.

---

## 8. BUTTON / LINK DESTINATION MATRIX — HARD RULE

Every visible clickable prototype control must be one of:
1. navigates to the correct screen/owner;
2. opens the correct owner form/modal;
3. demonstrates a named non-live state;
4. clearly disabled with reason.

Never:
- Work → Construction sample;
- Shops discovery → Shop Add modal;
- Events discovery → generic States page;
- Institutions → unrelated Health sample;
- profile button → Ask screen;
- `Виж профила` → toast only when a profile screen exists in prototype.

The prototype is a product-flow test, not a collection of decorative buttons.

---

## 9. CONTENT CONNECTIONS / INTERNAL LINKING

V6 surfaces reinforce each other without duplicate ownership.

Examples:

### Construction category
`Category → relevant Firms + Listings → Firm/Listing detail → related Guide → related Q&A`.

### Health
`Health category → verified providers/facts → Health detail → source/correction → related ready Guide/Q&A`.

### Pension guide
`Guide → process explanation → current NОИ/Institution verified Info owner → related question if useful`.

### Shop
`Shop discovery → Shop detail → related Q&A`.

### Search
`Search result → authoritative owner detail`, never a fake summary owner.

---

## 10. STATE SYSTEM — MUST BE VISIBLE IN C PROTOTYPE

Common:
- loading;
- success;
- empty;
- error;
- offline;
- disabled/ineligible;
- sign-in required.

Write flows:
- editing;
- submitting;
- validation error;
- pending review;
- approved/public;
- needs correction/returned;
- rejected/hidden where user-visible under owner rules;
- dirty unsent form.

Search:
- idle;
- too short;
- loading;
- partial;
- success;
- empty;
- offline;
- error;
- cancelled/newer query.

Share:
- unavailable before approval;
- available after canonical/public eligibility;
- Web Share preferred enhancement;
- copy-link fallback.

---

## 11. ANALYTICS / MEASUREMENT SEMANTICS

V6-C must reserve stable semantic hooks for later implementation, but MUST NOT invent fake current statistics.

At minimum later instrumentation can distinguish:
- home search start/submit;
- suggestion click;
- category open;
- Discover target open;
- Info target open;
- search result open by result family;
- filter change;
- Add sheet open;
- add owner selected;
- form start;
- form validation failure;
- submit attempt/success/failure;
- pending success;
- contact/call/site action;
- share action / copy link fallback;
- Q&A ask/answer action;
- correction/report start/submit;
- guide open;
- profile status/edit/resubmit action.

Rules:
- no sensitive free text in analytics by default;
- no health-sensitive raw query logging by default;
- analytics never changes owner/moderation/ranking truth;
- visible statistics buttons/blocks are shown only where an existing protected owner/permission actually allows them.

---

## 12. VISUAL SYSTEM — GLOBAL BEFORE LOCAL

Before individual pixel polish, prototype must use one coherent system for:
- typography scale;
- page container;
- spacing rhythm;
- card radii/borders/elevation;
- SVG icon family;
- primary/secondary/text/danger buttons;
- tags/status badges;
- search controls;
- filter chips;
- form controls;
- result cards;
- verified Info treatment;
- empty/error/loading states;
- desktop/mobile shell.

Semantic families may use restrained accents, but they must look like one product.

No emoji/system-glyph mixture as final icon language.

---

## 13. MOBILE FIRST-VIEW RULE

A typical Android user opening Home should quickly see:
1. brand/header;
2. what the site does;
3. primary Search;
4. start of primary categories.

No full-screen tutorial before discovery.

Bottom nav cannot cover actionable content; safe-area spacing required.

---

## 14. DESKTOP RULE

Desktop is the same product hierarchy at higher density, not a separate IA.

Use width to:
- show more category shortcuts;
- align related discovery groups;
- place secondary context beside results where helpful;
- preserve readable line lengths.

Do not fill width with giant empty decorative cards.

---

## 15. COMPLETENESS MATRIX — V6-C EXIT GATE

C cannot be accepted until all rows are represented and clickable in the full-site prototype:

| Surface | List/Hub | Detail | Add/Edit | States | Correct owner/destination |
|---|---:|---:|---:|---:|---:|
| Home | ✓ | n/a | global add | ✓ | required |
| All 16 Categories | ✓ | category shell | contextual | ✓ | required |
| Marketplace/Listings | ✓ | ✓ | ✓ | ✓ | required |
| Firms | ✓ | ✓ | ✓ | ✓ | required |
| Shops | ✓ | ✓/representative | proposal | ✓ | required |
| Restaurants | ✓ | representative | Firms owner | ✓ | required |
| Events | ✓ | representative | NO fake add | ✓ | required |
| Health | ✓ | ✓/representative | specialized | ✓ | required |
| Info Lom 6 families | ✓ | representative | correction | ✓ | required |
| Search | ✓ | result destinations | n/a | all B2 states | required |
| Articles/Guides | ✓ | ✓ | editorial only | readiness/share | required |
| Q&A | ✓ | ✓ | ask/answer | canonical/pending | required |
| Profile/Auth | ✓ | n/a | edit/resubmit routes | ✓ | required |
| Report/Correction | entry | target context | ✓ | ✓ | required |

A `✓` in document is not sufficient; prototype must actually contain the reviewable interaction.

---

## 16. V6-C REVIEW ORDER AFTER COMPLETENESS

Only after the matrix passes:
1. Home hierarchy/pixels;
2. Categories + marketplace hierarchy;
3. Info/Health trust presentation;
4. Firms/listing details;
5. Forms;
6. Search states;
7. Article/Q&A details;
8. Profile/auth;
9. desktop adaptation;
10. accessibility/performance visual QA.

This prevents another cycle where a polished block later forces the whole product to be rearranged.

---

## 17. CURRENT KNOWN C CORRECTIONS FROM RENDERED REVIEW

The 01.09.2026 mobile screenshot review proves:

1. Home Info V6 prototype currently shows only 4 targets and dropped two canonical Info Lom families — **must restore Education/Culture and Banks/ATMs**.
2. `Открий в Лом` currently renders as a narrow/right-side vertical column on mobile — **must become a full-width coherent discovery grid/list**.
3. These are not standalone polish tasks; they are symptoms that justify the full-site completeness gate.

---

## 18. NEXT IMPLEMENTATION ACTION — C ONLY

Create/refactor an isolated `v6-prototype` full-site interactive prototype that:
- opens on Home;
- uses the canonical shell;
- includes all screen families in §4;
- restores all six Info Lom entries;
- fixes Discover geometry structurally;
- routes every visible CTA to its correct prototype screen/owner/state;
- represents existing approved forms with their meaningful fields/actions;
- uses static representative data only;
- makes no Supabase/Firebase/production writes;
- is `noindex,nofollow`;
- is not referenced by production.

Do not begin V6-D until this prototype and completeness matrix are reviewed.
