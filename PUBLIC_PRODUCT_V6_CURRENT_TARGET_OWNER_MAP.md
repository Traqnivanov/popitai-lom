# Попитай.Лом — V6 CURRENT → TARGET OWNER / RELATIONSHIP MAP

Статус: **V6-A1 STATIC CODE/RULES AUDIT — DESIGN ONLY / NO PRODUCTION CODE**  
Branch: `v6-product-foundation-draft`  
Дата: 31.08.2026

Този документ е доказаната карта между текущия код и V6 целта. Той не променя production и не разрешава schema/RLS/role промени. Целта е следващите етапи да не гадаят кой файл, owner, таблица, форма или moderation flow държи дадена функция.

## 1. КАК СЕ ЧЕТЕ КАРТАТА

Класификации:

- **KEEP** — owner/логиката остава като основа;
- **ADAPT PRESENTATION** — може да се промени UX/IA/визуализация, без да се сменя authoritative/write owner;
- **NEW RELATION** — V6 може да добави връзка над съществуващи owner-и, без да копира данните им;
- **PROTECTED APPROVAL REQUIRED** — промяната засяга LOCKED business/permission/owner contract и не се прави без финален одобрен spec;
- **DEFER** — идея/подобрение не е необходимо за първия V6 slice;
- **VERIFY RUNTIME** — статичният код не е достатъчен да докаже кое реално се изпълнява live.

Backend impact:

- `NONE` — presentation/read-only;
- `READ` — нов read/query/search слой;
- `NEW RELATION` — нова relation/index структура след отделен technical design;
- `SCHEMA/RLS` — protected backend промяна, забранена преди V6-D + final approval.

## 2. HARD BOUNDARIES

V6 не заменя автоматично:

- `businesses` owner, basic/expanded business rules, media/edit drafts;
- `listings` owner, quotas, media, edit/resubmit, statuses, Admin direct publish, Admin/Ivanov/boost priority;
- Masters/repair protected flows and URLs;
- Admin/Moderator role boundaries;
- Health/Info authoritative ownership;
- Shops specialized owner/moderation;
- existing backward-compatible URLs.

UI visibility никога не е security boundary. Всички protected действия трябва да останат съгласувани между UI, JS, RPC/RLS/database.

## 3. GLOBAL MATRIX

| Модул | CURRENT owner/data | CURRENT interaction/moderation | V6 target | Action | Backend impact |
|---|---|---|---|---|---|
| Global shell/nav | synchronized HTML shell + `public-shell-v1.js`; canonical desktop/mobile nav; global Add sheet | runtime patch на nav/mobile/footer/add sheet; specialized bridge към Shops/Health | един лек canonical shell, същите top-level principles; contextual add/search без втори render owner | **KEEP + ADAPT PRESENTATION** | NONE |
| Home | `index.html` + inline listing/business decoration + `script.js` | стар 8-card category hub, Info block, listings/businesses/articles; има MutationObserver decoration за business cards | V6 landing: search-first + quick Lom priorities + `Открий в Лом` + Info/article/community paths | **ADAPT PRESENTATION**; премахване на runtime patch layering при implementation | NONE/READ |
| Public taxonomy | `public-category-dictionary-v1.js` | current public categories + listing categories + service groups + compatibility mappings | final stable V6 taxonomy отделно от shortcuts | **ADAPT PRESENTATION**, stored values/backcompat пазени | NONE |
| Public search | `script.js` има legacy `renderSearchResults/getAllSearchRecords`; `public-search-v1.js` съдържа DB-backed search implementation | `tarsene.html` директно зарежда `script.js`; активирането на `public-search-v1.js` не е доказано от намерена script reference | един explicit V6 search owner: intent routing + Info first-class + entities/listings/Q&A/articles + canonical match | **VERIFY RUNTIME → ADAPT**; без втори паралелен search renderer | READ |
| Info Lom | `info_entries`, `info_submissions`, `info_error_reports`; public Info pages; `info-lom-*`; `admin-info.js` | verified/reliability/freshness fields; submissions/reports; controlled Admin/Moderator flow | authoritative local knowledge core за search/SEO/articles/Q&A | **KEEP + ADAPT PRESENTATION + NEW RELATION** | READ / NEW RELATION |
| Articles | static `statii.html` + `statia.html`; в момента един реално видим article | няма доказан отделен article DB owner | lightweight evergreen guides, свързани с Info/entity/Q&A; без копиране на mutable facts | **KEEP lightweight model initially + ADAPT CONTENT** | NONE |
| Q&A | `questions`, `answers`; `supabase-content.js`; `questions-public-v1.js`; profile correction flow | non-admin questions pending; answer moderation; profile resubmit; Admin/Moderator review flows | contextual Ask + canonical/duplicate memory + category/entity relations | **KEEP + NEW RELATION**; exact self-moderation/RLS verification преди backend design | NEW RELATION / possible SCHEMA-RLS later |
| Firms | `businesses`, `media`, business media storage, `supabase-businesses.js`, `business-edit.js`, expanded profile owners | protected create/edit/draft/media/access; Admin direct publish/expanded; owner profiles | permanent local entity owner referenced by search/Q&A/recommendations/discovery | **KEEP + ADAPT PRESENTATION + NEW RELATION** | READ / NEW RELATION |
| Listings/Marketplace | `listings`, `media`, edit drafts/RPCs, `supabase-listings.js`, `category-listings-v1.js`, Marketplace V3 | protected quotas/status/edit/media/admin direct publish; protected ranking | unified transactional layer under natural V6 categories | **KEEP protected owner + ADAPT PRESENTATION** | NONE/READ |
| Masters/Construction | `maistori.html` + listing service group + firms/questions; protected repair semantics | multiple contextual CTAs; protected owner/URL/priority logic | public presentation candidate `Строителство и ремонти`, richer search/context, same protected owners | **PROTECTED APPROVAL REQUIRED + ADAPT PRESENTATION only** | NONE unless separately approved |
| Cars | `avtomobili.html`; service listings + vehicle listing category + firms + Q&A | mixed read composition, protected listing writes | one V6 category with clear service vs buy/sell paths | **ADAPT PRESENTATION**, owners stay separate | NONE/READ |
| General services | `rabota.html` currently UI label `Услуги`; service-group listings/firms/Q&A | page name/path historically `rabota.html`, but page content is services | V6 `Други услуги`/specific service categories; `Работа` becomes distinct listing intent/category | **ADAPT PRESENTATION + compatibility** | NONE |
| Jobs | stored listing category `Работа`; special listing types `Предлага работа` / `Търси работа` | no dedicated `rabota` job owner/page; current `rabota.html` is services | visible V6 `Работа` category/deep view backed by existing listing owner | **NEW PRESENTATION over KEEP listing owner** | NONE/READ |
| Property | stored listing category `Имоти`; special sell/rent/seek types | няма доказан dedicated `imoti.html`; lives inside listing owner | visible V6 `Имоти` category/deep view backed by existing listing owner | **NEW PRESENTATION over KEEP listing owner** | NONE/READ |
| Health | `info_entries` health + `health-catalog-v2.js` + `health-submissions-v1.js` + specialized page | verified/reliability display; specialized pending submission + correction/report flow | first-class specialized Health owner integrated into global search/Q&A, never generic listing replacement | **KEEP + ADAPT PRESENTATION + NEW RELATION** | READ / NEW RELATION |
| Shops | specialized `shops` table + `shops-catalog-v3.js` + `admin-shops.js` | authenticated proposals pending; Admin/Moderator review; moderator own items excluded in pending UI | `Открий в Лом`/search/entity relations while keeping specialized catalog | **KEEP + ADAPT PRESENTATION + NEW RELATION** | READ / NEW RELATION |
| Restaurants | currently `zavedenia.html` + `businesses` category `Заведения` + Q&A via `category-hub-v1.js` | add restaurant routes to `dobavi-firma.html?category=zavedenia`; no separate restaurant table proven | discovery/category experience over Firms owner; do not invent second restaurant database without need | **KEEP owner + ADAPT PRESENTATION** | NONE/READ |
| Events | `events` table + `events-public-v1.js` + `admin-events.js` | approved future events public; Admin/Moderator moderation; Admin-only hard delete in JS | `Открий в Лом` + search/share/freshness; public creation model only if separately specified | **KEEP + ADAPT PRESENTATION** | READ |
| Profile | `profil.html`, `supabase-content.js`, `profile-businesses.js`, listing/profile correction modules, `profile-access.js` | questions, corrections, firms, listings, auth/password/admin entry | single “My activity” state model including future Ask/share/recommendation statuses | **KEEP + ADAPT PRESENTATION** | READ |
| Admin/Moderator | `admin-management.js` + specialized modules + `admin-role-guard-v1.js` + RLS/RPC migrations | protected role model; shops/events/info/businesses/listings/Q&A modules | new V6 relation/canonical/freshness states join same operational model; no second admin system | **KEEP + EXTEND ONLY AFTER CONTRACT** | SCHEMA/RLS only if approved |
| SEO/detail rendering | static GitHub Pages HTML; dynamic detail data loaded client-side | `vapros.html`, `obqva.html`, `firma.html` start with generic title/description; home has static OG | strong static hubs + lightweight dynamic share/SEO render layer for approved dynamic details | **ADAPT / NEW EDGE RENDER candidate** | READ/edge |
| Sharing | listing share exists in listing owner; Q detail has visible share button but handler not proven in audited files | mixed/incomplete evidence; static detail OG generic | one share contract + approved-only timing + copy/system/FB fallback + dynamic OG | **VERIFY + ADAPT** | READ/edge |
| PWA/share target | no manifest/service-worker/share-target artifact found in current tree/search | not a current owner | optional later experiment only; never required for bridge MVP | **DEFER** | NONE initially |
| Analytics | no Popitai tracker/analytics integration found by current repo search (`analytics`, `trackerVersion`, `gtag`) | first-party Popitai baseline not proven from repo | explicit lightweight V6 events + content-gap/search-success metrics after source is identified | **VERIFY SOURCE in V6-A2** | READ/new lightweight events later |

## 4. MAJOR CONFIRMED FINDINGS

### 4.1 Силната backend основа трябва да се използва, не да се пренаписва

Firms, Listings, Health, Info, Shops and Events already have distinct data/moderation responsibilities. V6 should connect them through search/relationships and presentation, not collapse them into one universal content table.

### 4.2 `Инфо Лом` вече има реален authoritative model

Current Info code has publication/reliability/confirmation fields and controlled submissions/reports. Това директно подкрепя V6 стратегията за:

- `Последно потвърдено`;
- authoritative source;
- stale/recheck;
- verified fact vs community opinion;
- article → Info relation;
- search priority for factual local intents.

Следователно V6 не трябва да създава втори Info datastore в Articles/Q&A.

### 4.3 Health е специализиран Info owner, не marketplace category със generic write

Health public cards are built from published `info_entries`; reliability influences what address/data is safe to display. New health professional suggestions go to `info_submissions` pending. This boundary stays.

### 4.4 Shops също е специализиран owner

`shops` is not just a `businesses` category. It has its own category/tags/groups, proposal form, pending status and dedicated moderation. Global Add/search may route to it, but should not bypass it with a generic listing/firm write.

### 4.5 Restaurants currently belong to Firms, not a hidden second owner

`Заведения` currently composes approved `businesses` + questions; “Добави заведение” goes to the firm flow. V6 can improve discovery and subcategories without immediately creating a restaurant table.

### 4.6 `Работа` and `Услуги` are currently semantically mixed in presentation

This is one of the clearest V6 IA problems:

- `rabota.html` currently presents **Услуги**;
- real jobs already exist in `listings.category = "Работа"` with dedicated job listing types;
- therefore V6 should not keep using one visible concept for both.

Target principle:

**Работа = jobs intent backed by Listings.**  
**Services = service offer/seek intent backed by existing service listings/firms.**

Path compatibility can remain even if the visible V6 IA changes.

### 4.7 `Имоти` already exists as protected listing semantics, but not as a dedicated public owner

Property sell/rent/seek types already exist in the listing form/owner. A future `Имоти` page should be a presentation/read layer over that owner, not a new property write system.

### 4.8 Home page still contains older parallel IA presentation

The current `index.html` source contains an 8-card “Избери категория” hub and many links through `kategorii.html`, even though the canonical global shell and Marketplace V3 already use `Обяви и услуги` as the top-level marketplace entry.

V6 should replace that **presentation contradiction** in one approved landing design, not patch each card independently.

### 4.9 Home has render-layer technical debt

Home business cards are first rendered by the business owner and then decorated via a `MutationObserver` + delayed admin lookup. Under the render-ownership rules this is a candidate for consolidation: one final renderer should own final card markup. This is not a reason to change production now; it is a V6 implementation constraint.

### 4.10 Public search owner must be resolved before V6 search work

There are two search implementations in the repository:

1. `script.js` — the search page currently loaded by `tarsene.html`, with `rankSearchRecords()` / `getAllSearchRecords()` legacy/static/localStorage path;
2. `public-search-v1.js` — a newer DB-backed implementation that queries approved businesses/questions/listings and combines them with categories/articles/verified Info page records.

During this static audit no script reference activating `public-search-v1.js` was found in `tarsene.html`, `index.html` or `public-shell-v1.js`. Therefore **we must not call the DB-backed file the active production owner until runtime/reference verification proves it**.

V6 target: exactly one explicit search owner. The useful DB-backed implementation should be evaluated as a candidate to adapt; the old path must not remain as a competing renderer.

### 4.11 Current global search still treats Info at page level, not record level

Even the newer `public-search-v1.js` currently provides static verified Info records for whole pages (`Health`, `Institutions`, `Transport`, etc.), while `info.html`’s own search queries `info_entries` granularly.

V6 opportunity: make authoritative `info_entries` first-class global search results without downloading all Info data to every page.

### 4.12 Dynamic detail SEO/share metadata is incomplete by architecture

Confirmed static HTML heads:

- `vapros.html` → generic `Въпрос | Попитай.Лом`;
- `obqva.html` → generic `Обява | Попитай.Лом`;
- `firma.html` → generic `Фирмен профил | Попитай.Лом`.

Client JS can update visible content/title for humans, but social/search crawlers should not depend on that for per-item Open Graph/canonical metadata. This validates the V6 lightweight dynamic preview/render-layer requirement.

### 4.13 Profile is already a cross-owner aggregation surface

Profile shows/loads Questions, returned corrections, Firms and Listings through their respective owners. V6 should evolve this into a coherent activity/status center rather than create separate “my Q&A / my marketplace / my recommendations” profiles.

Potential presentation inconsistency to verify: `profile-businesses.js` currently treats both Admin and Moderator as `isStaff` for whether the normal basic-firm edit link is shown. LOCKED rules say Moderator’s own content follows normal non-admin behavior. This is **not declared a bug until the full protected owner/RLS flow is verified**, but it is a mandatory A2 verification item.

## 5. INTERACTION / FORMS / LINKS FINDINGS

The new `PUBLIC_PRODUCT_V6_INTERACTION_FORM_LINK_CONTRACT.md` is necessary because current code already demonstrates why individual button audits are insufficient.

### Confirmed good foundations

- listing create/edit has explicit mode handling and ownership checks;
- listing non-admin approved edits use edit drafts rather than silently replacing the public version;
- listing success differentiates direct Admin publish from pending review;
- business edit uses `?edit=` and a dedicated edit owner;
- Q&A correction forms preserve returned content and resubmit to pending;
- Health and Shops use specific field validation and pending-review success states;
- shell Add sheet supports specialized routing rather than forcing all content into one generic form.

### Mandatory V6 interaction checks

For every target screen/flow, record:

`ENTRY → PRIMARY CTA → LINK/PREFILL → AUTH → OWNER → FIELDS → VALIDATION → SUBMIT → STATUS → SUCCESS/ERROR → BACK/CANCEL → MOBILE → ACCESSIBILITY → ANALYTICS → PERFORMANCE`.

Specific current inconsistencies to resolve in product/visual contracts, not ad-hoc fixes:

- `tarsene.html` empty-state still links to compatibility `kategorii.html` and generic Add options;
- search page explanatory text says results from questions/firms/categories/articles although current/newer code also includes listings/verified info;
- many category pages show several equal secondary actions; V6 must establish one clear primary task per state;
- current question detail category fallback points to `kategorii.html`, while V6 wants contextual category ownership;
- detail/share states are not yet one consistent system across Q&A, listings, firms, Info and events.

## 6. RENDER OWNERSHIP MAP

### Stable owners to preserve

- Business public list/detail → business owner scripts;
- Listing forms/details → `supabase-listings.js` protected owner;
- Category listing read views → `category-listings-v1.js`;
- Health catalog → `health-catalog-v2.js`;
- Shops catalog/form → `shops-catalog-v3.js` + validation owner;
- Events list → `events-public-v1.js`;
- Admin special surfaces → their dedicated admin modules.

### Known/concrete consolidation candidates

- Home business post-decoration (`MutationObserver` after business renderer);
- Info Banks legacy multi-render chain already documented in `PROJECT_RULES_RENDER_OWNERSHIP.md`;
- search legacy/new implementation ambiguity;
- shell source + runtime patching must remain one intentionally defined shell system, not grow more patch layers.

## 7. ADMIN / MODERATOR INTEGRATION TARGET

V6 does **not** create a second moderation center.

Future states must enter the existing role model:

- canonical/duplicate review;
- structured recommendation review/abuse handling;
- freshness/recheck queues where staff action is required;
- Facebook-import provenance only if user submits content;
- relation hide/reject/restore/history.

Before any database implementation, each action must state:

- can normal user initiate it?;
- can owner edit/resubmit it?;
- can Moderator process foreign content?;
- how is Moderator self-content excluded?;
- what is Admin-only?;
- what does backend/RLS enforce?;
- is the action reversible?;
- is permanent delete involved?

## 8. TARGET RELATIONSHIP LAYER — CONCEPTUAL ONLY

The map supports a relationship layer without merging owners:

`query/topic`
→ `category/subcategory`
→ `Info record / Health record`
→ `Article`
→ `Question canonical/alias`
→ `Answer`
→ `recommended entity`
→ `Business / Shop / Health entity / Restaurant-as-business / other approved entity`
→ `Listing` when transactional
→ `Event` when timely.

No relation schema is approved yet. V6-B/V6-D must define integrity, RLS, moderation, indexes and rollback before code.

## 9. PERFORMANCE MAP

### Keep lightweight

- static/cached category and article structure;
- granular on-demand DB reads;
- no universal payload of all Info/shops/businesses;
- local synonym dictionary before any external AI runtime;
- no Facebook SDK for simple sharing;
- server/edge render only where dynamic metadata materially improves sharing/SEO;
- pagination/show-more instead of giant result sets;
- dedicated owners load only on pages that use them.

### Current hotspots for later budget audit

- large global `style.css` / `script.js`;
- large Info extension modules;
- inline page-specific scripts/styles on home and specialized pages;
- duplicate/patch render layers;
- Supabase CDN loaded on many pages;
- global search must avoid fan-out queries on every keystroke beyond a strict budget.

No optimization is performed in A1; this is inventory only.

## 10. SEO / CONTENT OWNER CONTRACT

V6 target roles remain:

- Category page = thematic hub;
- Info record/page = authoritative mutable local fact;
- Health = specialized authoritative health/entity presentation;
- Business/Shop/entity page = concrete local object;
- Listing = temporary transaction;
- Article = process/explanation;
- Q&A = community experience/answer;
- Event = time-sensitive local occurrence.

One URL/content owner should satisfy one primary intent. Internal links connect owners; they do not duplicate source-of-truth data.

## 11. A1 OPEN VERIFICATION ITEMS — MOVE TO V6-A2, NOT SIDE MISSIONS

These are not reasons to restart A1:

1. **Search runtime activation:** prove live/source activation of `public-search-v1.js` vs legacy `script.js`, then choose one target owner.
2. **Q&A Moderator self-content:** verify actual RLS/RPC + admin queue behavior; do not infer security from UI alone.
3. **Profile Moderator own-business edit:** verify normal-owner capability end-to-end because current profile presentation groups Moderator with Admin as `isStaff`.
4. **Share handlers:** verify Q/Firm/Info share runtime, not just visible buttons; listing share is already implemented in listing owner.
5. **PWA:** current tree/search found no service worker/manifest/share-target artifact; confirm once more before any future PWA design. PWA remains optional/deferred.
6. **Popitai analytics source:** no tracker integration was found in this repository search. Identify whether usable first-party metrics exist outside this repo before claiming an analytics baseline.
7. **Info render ownership:** inventory each Info subsection and explicitly resolve Banks multi-render technical debt in technical design, preserving approved UX/data.

## 12. V6-A1 EXIT DECISION

**Owner-level A1 map: COMPLETE for planning purposes.**

No major public product area is left without a current owner hypothesis supported by code/rules. Remaining uncertainties are runtime/evidence verification and content coverage, therefore they move to A2 rather than keeping the architecture inventory open indefinitely.

No production code, schema, RLS, permissions, roles, quotas, moderation, URLs or protected business behavior were changed during A1.

## 13. EXACT NEXT STAGE

# `STAGE V6-A2 — EVIDENCE / COVERAGE / RUNTIME BASELINE`

Order:

1. resolve active global Search runtime owner;
2. build `Инфо Лом` coverage/freshness/SEO inventory;
3. build Articles/Guides inventory by readiness status;
4. verify dynamic detail SEO/share behavior;
5. verify Q&A/Profile protected interaction uncertainties without writes;
6. identify Popitai first-party analytics source and record baseline if available;
7. close PWA/service-worker current-state question;
8. update Master Control.

After A2, proceed to V6-B product contracts. Do not start V6 production implementation before B/C/D/E gates.