# Попитай.Лом — V6-B9 EXACT INTERACTION / FORMS / BUTTONS / LINKS / STATES CONTRACT

Статус: **B9 COMPLETE — DESIGN CONTRACT / NO PRODUCTION CODE**  
Branch: `v6-product-foundation-draft`  
Дата: 01.09.2026

Този документ заключва exact target behavior за основните V6 public interactions.

Той стъпва върху LOCKED rules + B1–B8 и не променя production, schema/RLS, роли, квоти, moderation, protected owner-и, protected ranking или URL compatibility.

Production impact: **NONE**.

---

## 1. B9 РЕШЕНИЕ В ЕДНО ИЗРЕЧЕНИЕ

**Всеки видим V6 CTA има една ясна задача, един authoritative owner, един real destination, bounded visible prefill, deterministic auth/validation/moderation/success/error/back behavior и никога не създава generic обход към specialized/protected owner.**

---

## 2. CURRENT INTERACTION EVIDENCE

### 2.1 Global `+ Добави`

Current `public-shell-v1.js`:
- държи desktop/mobile triggers;
- отваря modal/sheet;
- пази `returnFocus`;
- focus-ва първия usable element;
- trap-ва Tab вътре;
- Escape затваря;
- backdrop затваря;
- връща focus към trigger-а;
- основният ред е Listing → Firm → Question;
- specialized Shop/Health actions се делегират към реалния page owner само ако owner control съществува.

Тази accessibility основа се **KEEP**.

### 2.2 Listings current public prefill

Current `marketplace-v3.js` на `dobavi-obqva.html` реално разбира target public params:
- `main`;
- `subcategory`;
- `intent` = `offer|seek`;
- `edit=<id>` е отделен edit state.

V3 map-ва public selection към protected stored category/subcategory/listing type.

Това е текущ доказан owner-aware prefill и B9 го пази.

### 2.3 Firms current form

`dobavi-firma.html` има реална `company-form` с category, phone, optional city/address/hours, description, logo/gallery и protected Admin expanded sections.

Current audited source не доказва generic URL category prefill owner, затова B9 **не твърди**, че произволен `?category=` вече е current runtime support.

Target V6 може да въведе bounded presentation prefill след V6-D/F mapping, но URL param никога не bypass-ва real business category validation.

### 2.4 Health specialized owner

Current `health-submissions-v1.js`:
- Add Health не пише в Listings/Firms;
- authenticated user е required;
- записва `info_submissions` с `status=pending`;
- doctor/dentist/vet се map-ват към specialized Info subcategory/type;
- phone/address/content имат contextual validation;
- success изрично казва, че ще се публикува само след Admin review;
- correction/signal flow е отделен.

B9 пази този specialized owner.

### 2.5 Shops specialized owner

Current `shops-catalog-v3.js`:
- shop proposal е specialized modal;
- signed-in user required;
- записва `shops` proposal с `status=pending`;
- category/tags/groups остават Shop-owned;
- unsent data има close confirmation;
- success state е explicit.

B9 не го заменя с Firm/Listing create.

### 2.6 Q&A current form

Current `nov-vapros.html` + validation owner:
- title 10–120;
- description минимум 20;
- category required;
- current URL prefill разбира bounded category slugs;
- non-Admin question е pending;
- Admin може да publish-не според existing approved rules;
- answer submit е pending;
- validation пази field focus/errors;
- B5 duplicate/canonical layer още е target design, не current production implementation.

### 2.7 Events

Current `events-public-v1.js`:
- показва approved upcoming/current events;
- няма public create owner;
- empty state води към `nov-vapros.html?category=sabitiya`.

Следователно B9 lock:

**няма `Добави събитие` CTA, докато отделен approved public Event submission owner не бъде проектиран и одобрен.**

---

## 3. UNIVERSAL CTA SEMANTICS

### `Намери`

Навигация/read action към правилния category/search/owner result surface.

Не записва данни.

### `Добави`

Създава content само чрез реалния write owner.

Не означава „generic add anything“.

### `Попитай`

Винаги използва Q&A owner и B5 duplicate/canonical gate.

Не създава Listing/Info/Firm.

### `Сподели`

B7 distribution action към canonical public Popitai URL.

Pending/private/rejected content не получава public share flow.

### `Докладвай`

Сигнал за нарушение/problem към real report owner.

Не е correction на verified Info, освен когато UI ясно казва това.

### `Предложи корекция`

Корекция на factual/owner data към specialized correction owner.

Не е community answer и не променя директно public факт.

---

## 4. CTA HIERARCHY BY SURFACE

### 4.1 Home

Primary:
- search `Какво търсиш в Лом?`.

Secondary:
- category shortcuts;
- `Открий в Лом`;
- contextual owner-aware Add only where useful.

`Задай въпрос` не е universal Home primary CTA.

No-result после може да даде `Попитай Лом` според B2.

### 4.2 Search results

Primary = open best valid result.

Secondary per card:
- open detail/category owner;
- share only if public canonical;
- owner-specific direct contact only if already allowed by owner.

True no-result primary:
- `Попитай Лом`.

Search partial failure **не** показва false no-result CTA.

### 4.3 Category shell

Common visual hierarchy across all 16 categories:
1. `Намери` / search/filter;
2. contextual `Добави` if real owner exists;
3. `Попитай` as secondary community action;
4. related guide/Q&A/entity links.

Health uses same shell pattern visually, but its `Добави` delegates to Health/Info owner.

### 4.4 Detail surfaces

Primary = owner-native main task:
- Firm → call/contact/site if available;
- Listing → listing-native contact/detail action;
- Info/Health → trusted factual action/contact;
- Shop → shop-native contact;
- Q&A → read answers / answer if eligible;
- Article → continue related useful action;
- Event → event info/current action if available.

Secondary:
- `Сподели` if eligible;
- `Докладвай` or `Предложи корекция` according to content type;
- related category/Q&A/guide links.

---

## 5. GLOBAL `+ ДОБАВИ` TARGET CONTRACT

Global sheet remains one compact owner router.

Default options:
1. `Добави обява` → `dobavi-obqva.html`;
2. `Добави фирма` → `dobavi-firma.html`;
3. `Задай въпрос` → `nov-vapros.html`.

Contextual specialized options may appear **only when the current surface has a real owner**:
- Health → delegate to Health proposal owner;
- Shops → delegate to Shop proposal owner.

No generic:
- `Добави лекар` → Firm;
- `Добави магазин` → Firm;
- `Добави събитие` → nonexistent flow.

Sheet requirements:
- role dialog;
- focus trap;
- Escape/backdrop close;
- restore focus;
- no background interaction while open;
- no duplicate nested modal state;
- mobile viewport keeps all primary options reachable without hidden sticky obstruction.

---

## 6. LISTING CREATE CONTRACT

Canonical create route:

`dobavi-obqva.html`

### Supported V6 public params

Current proven and KEEP:
- `main=maistori|avtomobili|uslugi|other`;
- `subcategory=<bounded public mapped value>`;
- `intent=offer|seek`.

Edit:
- `edit=<listing-id>` only.

### Never accepted as trust/permission bypass

URL params cannot set:
- owner/admin status;
- approved/pending;
- boost;
- Admin flags;
- quota exemption;
- publisher ownership;
- protected stored values outside allowed mapping.

### Category examples

Construction service:
`dobavi-obqva.html?main=maistori&subcategory=ВиК&intent=offer`

Seek Construction service:
`...main=maistori&subcategory=ВиК&intent=seek`

Automotive service:
`...main=avtomobili&subcategory=Гуми&intent=offer`

Vehicle buy/sell uses Automotive public flow and maps to existing protected vehicle Listing category/type.

Jobs/Property remain mapped to protected Listing values under `other`/stored mapping until V6-D defines final stable public IDs.

### Auth

Target:
- anonymous can inspect form/prefill;
- submit requires sign-in;
- if sign-in is needed, preserve only safe bounded form context/draft;
- login return mechanism must be implemented/proven before a `return` URL parameter is advertised.

Current production does not prove a canonical login-return parameter, so B9 does not invent one as already supported.

### Success

Admin according to LOCKED rules:
- exact direct-publish behavior remains protected.

Normal user/business publisher:
- explicit `Изпратено за преглед`;
- show quota state when applicable;
- no Facebook share before public approval;
- next actions: profile/status, back to marketplace.

### Error

- field errors preserve entered values;
- quota failure explains exact quota owner;
- owner/business publisher failure explains reason;
- network error permits retry without duplicate create;
- submit disabled while request is in flight.

---

## 7. LISTING EDIT / RESUBMIT CONTRACT

`edit=<id>` is separate state from create.

Rules:
- form locked while owner record loads;
- authorization resolved before editing;
- existing values populate before unlock;
- edit never creates a second listing;
- protected owner/quotas/status rules remain unchanged;
- resubmit correction uses existing protected edit/resubmit owner;
- edit does not consume a new listing quota;
- success text distinguishes `промените са запазени/изпратени за преглед` from `нова обява`.

B9 does not modify the existing protected Listing edit implementation.

---

## 8. FIRM CREATE CONTRACT

Canonical create route:

`dobavi-firma.html`

Owner:
- existing protected Firms owner.

### Target prefill

B1 category context may be passed conceptually from category pages, but current audited Firm form does not prove an active query-param prefill adapter.

Therefore target implementation rule:
- introduce only a bounded V6 presentation param such as `category=<public-v6-category-id>` after V6-D mapping;
- map it visibly to an allowed current business category;
- invalid/unknown param leaves category unselected;
- never write raw URL value directly to protected category field.

Until implemented/proven, links may safely use plain `dobavi-firma.html` rather than fake prefill.

### Auth/status

- signed-in owner required to submit;
- normal firm → existing moderation path;
- Admin direct publish/expanded access remains LOCKED;
- Moderator does not gain Admin privileges.

### Success

Explicitly distinguish:
- published immediately only when existing protected Admin rule permits;
- otherwise submitted for review.

No public share before public approved version exists.

---

## 9. HEALTH CATEGORY / ADD / CORRECTION CONTRACT

Health uses the common V6 category shell but specialized actions.

### `Намери`

Health/Info read owner.

### `Добави лекар/практика`

Delegate to Health specialized panel/owner.

Owner target:
- `info_submissions` controlled flow.

Allowed initial types remain current proven:
- doctor;
- dentist;
- vet.

Any new health type requires actual owner coverage, not just a new button.

### Auth

Submit requires sign-in.

If anonymous:
- clearly state sign-in required;
- retain safe unsent form state in-page when possible;
- do not convert to generic Firm add.

### Success

Exact meaning:
`Изпратено е за одобрение. Ще се публикува само след преглед.`

### Correction

`Предложи корекция` uses Health/Info correction/report owner.

It must capture:
- target record identity;
- current disputed value/context;
- proposed correction;
- source/evidence when required.

It never instantly rewrites public verified data.

### Share

Only B3/B7 eligible public canonical Health surface.

No raw health-search query/private context in social preview or attribution.

---

## 10. SHOPS CONTRACT

### `Намери`

Specialized Shops owner.

### `Добави магазин`

Use existing Shop proposal modal/owner only.

Never generic Firm/Listing fallback.

### Auth

Signed-in required.

### Validation

Owner-native category/phone/tags/groups validation remains authoritative.

### Close/back

If unsent data exists:
- ask before destructive close/reset;
- `Отказ` keeps modal/data;
- confirmed close clears intentionally.

### Success

`Предложението е изпратено за проверка.`

No public share until approved.

---

## 11. EVENTS CONTRACT

Current public owner is read-only discovery for approved upcoming/current events.

### Allowed CTAs

- `Разгледай събития`;
- `Попитай за събитие`;
- share existing event only after B7 canonical/detail eligibility exists.

### Forbidden CTA

**No `Добави събитие`** in V6 initial interaction contract.

If future public Event submission is desired, it requires separate owner/form/moderation contract and V6-D implementation.

---

## 12. Q&A ASK CONTRACT

Canonical create route:

`nov-vapros.html`

### Core fields

- title/query;
- category/topic context;
- description/detail;
- community-rule consent where current UX requires.

### Current proven category prefill

Current validation owner accepts bounded category slugs for existing compatibility categories.

B9 target replaces ad-hoc category-only semantics with bounded logical Ask context while preserving compatibility.

### Target safe context envelope

Conceptually:
- `q` = visible original user question/search text;
- `category` = bounded V6 topic/category id/compat slug;
- `subcategory` = bounded leaf id/value when real;
- `intent` = bounded source intent;
- `source` = bounded source enum such as `search-no-result`, `category`, `health`, `article`, `event`.

Important:
- URL is not hidden truth;
- prefilled values are visible/editable where Q&A rules allow;
- arbitrary unknown params are ignored;
- no raw private/health-sensitive text is persisted to analytics automatically.

Exact public stable IDs/encoding are V6-D implementation detail, but these five semantics are B9-locked.

### Duplicate gate — B5 handoff

Before final create:
1. normalize visible title/query;
2. topic/category context;
3. bounded local duplicate search;
4. show up to 1–3 likely canonical questions;
5. user can open existing match;
6. if continuing, normal moderation flow applies;
7. no destructive auto-merge.

### Auth

Target submit requires signed-in user.

If anonymous, auth handoff must preserve safe draft/context once login-return mechanism is implemented.

### Success

Admin only where current approved rule permits immediate public status.

Normal user:
`Въпросът е изпратен за преглед.`

No Facebook share while pending.

After approval, profile/detail can surface B7 share pack.

---

## 13. ANSWER CONTRACT

Owner:
- existing Answers owner.

Rules:
- question must be public/approved;
- user signed in;
- body validated;
- normal answer → pending moderation;
- success clearly says `чака одобрение`;
- pending answer is not publicly counted/shown as approved answer;
- answer does not become verified Info fact;
- recommendation extraction, if any, follows B6 after approved answer state.

---

## 14. SEARCH NO-RESULT → ASK CONTRACT

True no-result only according to B2.

CTA:
**`Попитай Лом`**

Transfer:
- visible query;
- mapped category;
- optional leaf;
- detected intent;
- `source=search-no-result`.

Before submit:
- user sees the prefilled question;
- B5 duplicate gate runs;
- auth occurs if needed;
- no duplicate raw Search owner record is created.

Partial/error state does not trigger false `няма резултат` wording.

---

## 15. FACEBOOK BRIDGE HANDOFF

B7 share is available only when content is public/canonical.

### After create pending

Show:
- exact moderation state;
- `Виж статуса`/profile link;
- **no public Facebook share CTA**.

### After approval/publication

Eligible detail/profile can show:
- `Сподели`;
- `Копирай линк`;
- Facebook-oriented share action where safe/current platform behavior allows.

All point to canonical Popitai URL.

### External share failure

Does not alter Popitai publication status.

Fallback:
- copy canonical link;
- copy short safe text if provided;
- manual share.

---

## 16. REPORT VS CORRECTION MATRIX

| Content | Problem/abuse | Factual correction |
|---|---|---|
| Q&A | `Докладвай` | new answer/question only if appropriate, not Info correction |
| Listing | `Докладвай` | owner edit/resubmit if owner |
| Firm | `Докладвай` / owner correction flow | protected firm edit/draft owner |
| Health/Info | report if abuse | **`Предложи корекция` specialized Info owner** |
| Shop | report/moderation path | specialized Shop owner/correction if later supported |
| Article | report/content issue | editorial Article owner, never edit Info duplicate |
| Event | report if available | Events owner/admin, no fake public edit |

Labels must reflect the semantic difference.

---

## 17. AUTH STATE CONTRACT

Four public interaction states:

1. anonymous;
2. signed-in normal user;
3. Moderator acting as normal owner on own content;
4. Admin where protected exceptions apply.

Rules:
- hidden button is not security;
- backend remains authority;
- Moderator own content never inherits Admin direct-publish/moderation privileges;
- Admin exceptions stay only where LOCKED rules already allow;
- auth failure returns a specific message, not silent no-op;
- blocked user gets explicit refusal and cannot submit.

### Login return

Target needs one bounded same-origin return mechanism, but current code evidence does not prove a canonical parameter.

V6-D must define and secure it before UI relies on it:
- relative/same-origin only;
- no open redirect;
- preserve only safe action context;
- expired/invalid return falls back to Profile/Home.

---

## 18. UNIVERSAL FORM STATES

Every write flow has:

- `idle`;
- `dirty`;
- `validating`;
- `invalid`;
- `auth_required`;
- `submitting`;
- `success_pending`;
- `success_public` only when owner truly returned public status;
- `error_network`;
- `error_permission`;
- `error_business_rule`;
- `needs_changes` where owner supports moderation correction;
- `cancelled`.

No generic success message may imply publication when state is pending.

---

## 19. DOUBLE-SUBMIT / IDEMPOTENCY UX

At UI level:
- submit disabled immediately during active request;
- repeated tap/click ignored;
- loading label is task-specific;
- button re-enabled only on recoverable failure.

Backend idempotency/exact duplicate-write design belongs to V6-D when needed.

Frontend disabled state alone is not sufficient security/integrity protection.

---

## 20. DATA PRESERVATION / UNSAVED DATA

### Validation/backend error

Keep user input.

### Network error

Keep user input and selected images where feasible.

### Explicit cancel/back

If material unsent data exists:
- warn before destructive reset/close;
- user can stay and continue.

### Browser refresh/navigation

V6-C/D should decide owner-specific draft persistence; B9 does not mandate localStorage of sensitive/raw forms globally.

Health/private/sensitive drafts are not persisted casually.

---

## 21. MOBILE / MODAL / FOCUS CONTRACT

All sheets/modals:
- `role=dialog` + accessible label;
- focus moves inside on open;
- focus trapped while modal;
- Escape closes when safe;
- close returns focus to initiator;
- page background cannot become accidental tab target;
- virtual keyboard does not cover active field/primary submit;
- first validation error is scrolled/focused;
- touch targets are usable;
- no sticky bottom nav over form CTA;
- destructive close warns for dirty forms.

Current global Add sheet behavior is reference baseline.

---

## 22. LINK VS BUTTON CONTRACT

Use `<a>` for navigation to a URL:
- category;
- detail;
- create page;
- profile/status;
- canonical share URL copy source.

Use `<button>` for current-state action:
- open modal/sheet;
- submit;
- retry;
- share Web API action;
- copy;
- close;
- filter toggle where URL navigation is not desired.

No click-only `div` for primary interaction.

---

## 23. EXACT CATEGORY OWNER ACTION MATRIX

### Строителство и ремонти
- Find → Construction/Masters/category discovery.
- Add service → Listing owner with V3 `main=maistori` mapping.
- Add firm → Firm owner, optional target bounded prefill only after implemented mapping.
- Ask → Q&A with Construction context.

### Здраве и лекари
- Find → Health/Info owner.
- Add provider → Health specialized submission.
- Ask → Q&A Health context.
- Correction → Info/Health correction owner.
- Share → eligible canonical Health surface only.

### Работа
- Find → Listings jobs context.
- Add → protected Listings job type mapping.
- Ask → Q&A jobs context.

### Автомобили
- Find → vehicle Listings + automotive services/Firms composition.
- Add vehicle/service → Listings with Automotive mapping.
- Add firm → Firms.
- Ask → Q&A Automotive context.

### Имоти
- Find/Add → protected Listings property types.
- Ask → Q&A Property context.

### Красота / Други услуги
- Find → service Listings + Firms.
- Add service → Listings service mapping.
- Add permanent provider → Firms.
- Ask → Q&A topic context.

### Дом и градина / Електроника / Деца / Животни / Мода / Спорт / Други обяви
- Find/Add → Listings owner for transactional content;
- related Shops/Firms only as read composition where B1 permits;
- Ask → Q&A context.

### Магазини
- Find/Add → Shops specialized owner.
- Ask → Q&A Shops context.

### Заведения и храна
- Find → Firms/Restaurants owner.
- Add permanent venue → Firms owner.
- Ask → Q&A Restaurant context.

No second Restaurants datastore.

---

## 24. DEAD/FALSE FLOW PROHIBITIONS

B9 explicitly forbids:
- CTA whose destination is placeholder/not implemented;
- generic Add used to bypass Health/Shops;
- fake public Event submission;
- share pending/private content as if public;
- edit link that falls into create mode;
- query param that silently changes protected owner/status/role;
- success message that says published when only pending;
- Search no-result while required owner query failed;
- `verified` label on community answer/recommendation;
- automatic Facebook comment/reaction import;
- button visibility as permission enforcement.

---

## 25. V6-C PROTOTYPE REQUIRED STATES

The visual/interaction prototype must show at minimum:

1. Home search-first default;
2. one common category shell;
3. Health in the same category shell with specialized Add;
4. Listing category with `Намери / Добави / Попитай`;
5. global Add sheet;
6. Search success groups;
7. Search true no-result → prefilled Ask;
8. Search partial error;
9. Ask duplicate suggestions before submit;
10. Listing create prefilled flow;
11. pending success without share;
12. approved/public success with share pack;
13. Health proposal modal;
14. Shop proposal modal;
15. dirty-form close warning;
16. validation error/focus state;
17. mobile keyboard/modal/bottom-nav state;
18. Q&A canonical detail with share/report;
19. no Event Add CTA.

Happy-path-only mockup is insufficient.

---

## 26. V6-D TECHNICAL FOLLOW-UPS

B9 intentionally does not implement:
- stable V6 category IDs and exact compatibility mapping storage;
- secure login return parameter;
- B5 duplicate relation schema/index/RLS;
- B6 recommendation relation schema/RLS;
- dynamic OG/share render endpoint;
- field-level Info freshness metadata if justified;
- final event public submission design;
- exact backend idempotency for writes;
- target analytics event storage/privacy implementation.

These require V6-D after V6-C prototype.

---

## 27. B9 EXIT GATE

B9 is **COMPLETE** because:
- every major visible CTA has an owner-aware target;
- Listings current supported prefill is exact;
- unsupported Firm/login prefill is not falsely claimed current;
- Health/Shops remain specialized;
- Events do not receive a fake Add flow;
- Ask context + duplicate handoff are defined;
- auth/validation/moderation/success/error/back/mobile/share states are deterministic;
- protected role/owner/quota semantics remain unchanged;
- next visual prototype states are explicit.

---

## 28. EXACT NEXT STAGE

# `STAGE V6-C — REAL DESKTOP/MOBILE VISUAL + INTERACTION PROTOTYPE`

Required outcome:
- one coherent V6 visual system over B1–B9;
- desktop + mobile screens/states;
- common category shell including Health parity;
- Search/Marketplace/Info/Q&A/Article/Facebook interaction examples;
- no production deployment;
- no schema/RLS changes;
- prototype must expose real states from §25, not only a polished home screenshot.

Production impact remains **NONE** until separately approved implementation gates.