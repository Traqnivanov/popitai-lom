# Попитай.Лом — V6-A2 EVIDENCE / COVERAGE / RUNTIME BASELINE

Статус: **A2 COMPLETE — READ-ONLY EVIDENCE / NO PRODUCTION CODE**  
Branch: `v6-product-foundation-draft`  
Дата: 31.08.2026

Този документ затваря `STAGE V6-A2`. Той отделя:

- какво е доказано от current `main` source;
- какво е доказано от current Supabase policies/schema/data чрез read-only SQL;
- какво е само working V6 идея;
- какво липсва и трябва да стане product contract във V6-B.

Няма production write, migration, RLS, role, quota, moderation или UI промяна.

---

## 1. SEARCH RUNTIME / SOURCE BASELINE

### Доказано от current `main`

`tarsene.html` зарежда:

- `supabase-config.js`;
- `public-category-dictionary-v1.js`;
- `script.js`;
- `public-shell-v1.js`.

Не зарежда `public-search-v1.js`.

Следователно current source-level owner на `tarsene.html` е legacy search path в `script.js`, а не автоматично по-новият DB-backed файл.

В repo съществува отделен `public-search-v1.js`, който вече има по-силен модел и queries към approved `businesses`, `questions`, `listings` + static categories/articles/Info page records, но A2 не откри activation reference към него в `tarsene.html`, `index.html` или `public-shell-v1.js`.

### Runtime qualification

Физически browser runtime test не беше възможен в този stage, защото browser connector не беше свързан. Това не променя HTML source evidence, но означава, че не твърдим browser-execution QA.

### V6 consequence

Search V6 трябва да има **един explicit owner**. Не се допуска legacy + newer renderer да живеят паралелно неясно.

Допълнителен gap: дори `public-search-v1.js` третира Info основно като page-level статични записи, докато `info.html` може да търси granular `info_entries`. V6 Search трябва да даде first-class място на granular verified Info records без giant all-data download.

---

## 2. INFO LOM — CURRENT COVERAGE BASELINE

Read-only query към current Supabase `info_entries` показва:

| category | published | non-published | published conflict | published secondary | missing `confirmed_at` |
|---|---:|---:|---:|---:|---:|
| Банки | 18 | 0 | 0 | 0 | 0 |
| Институции | 22 | 0 | 0 | 0 | 0 |
| Комунални | 13 | 1 | 0 | 3 | 0 |
| Образование | 24 | 0 | 2 | 0 | 0 |
| Транспорт | 3 | 0 | 0 | 0 | 0 |
| Здраве | 72 | 1 | 1 | 6 | 0 |
| **Общо** | **152** | **2** | **3** | **9** | **0** |

Това е силна база: всички 152 published DB records имат `confirmed_at`. Но `confirmed_at` не означава автоматично „още е актуално“.

### Freshness warning

Health има published doctor record с `confirmed_at = 2025-01-01`, докато повечето current records са потвърдени през август 2026. Това доказва, че V6 freshness не може да е просто `има дата`; трябва да има recheck policy според типа данни.

### Current DB subcategory coverage

**Банки**
- банкомати: 13;
- офиси: 5.

**Институции**
- 22 published records в отделни subcategories, включително Община, Полиция, НОИ, Бюро по труда, ДСП, съд, прокуратура, имотен регистър, кадастър, НАП, РЗИ, РЗОК, ОДБХ, пожарна, спешна помощ, ВиК, ток и др.

**Комунални**
- интернет/TV: 4;
- куриери: 9 published + 1 non-published.

**Образование**
- училища: 8;
- детски градини: 7;
- читалища: 4;
- библиотека: 1;
- музей: 1;
- школи/курсове: 3.

**Транспорт**
- автобуси: 1;
- БДЖ: 1;
- таксита: 1.

**Здраве**
- аптеки: 7 published + 1 non-published;
- болница/медицински звена: 22;
- лаборатории: 2;
- лекари: 14;
- стоматолози: 23;
- ветеринари: 4.

Visible Health navigation има и `Вет. аптеки`, но A2 DB aggregation не откри published `vet-apteki` subcategory. Това е coverage item за V6-B/Info inventory — не се приема автоматично за „готово“.

---

## 3. INFO LOM — КРИТИЧНО SOURCE-OF-TRUTH ОТКРИТИЕ

Info Lom има реален authoritative DB model, но **current public rendering не е еднакво DB-owned във всички секции**.

### Health — DB-driven owner

`info-lom-health-unified.js` работи с `info_entries`, показва `confirmed_at`, source и health-specific data. Това е най-близо до V6 target model.

### Institutions — DB base + multi-stage render patches

Generic `info-lom.js` може да render-ва DB entries, но Institutions current page използва staging root + няколко specialized scripts, а `info-lom-institutions-owner-v1.js` наблюдава staging root чрез `MutationObserver` и чак след финални patch markers мести резултата в public root.

Това е **доказан render-ownership technical-debt hotspot**, макар public owner да е маркиран накрая.

### Banks — visible public data hardcoded in renderer

`info-lom-banks-v7.js` съдържа hardcoded arrays за банкови офиси и ATM networks и ги render-ва директно, въпреки че current `info_entries` има 18 bank records.

Следователно има **DB ↔ hardcoded duplicate fact risk**.

### Education — visible public data hardcoded in renderer

`info-lom-education-v1.js` съдържа hardcoded `DATA` arrays за училища, детски градини, читалища, библиотека, музей и курсове, въпреки че current `info_entries` има 24 education records.

Отново има duplicate source risk.

### Transport — visible public data hardcoded in renderer

`info-lom-transport-v1.js` съдържа hardcoded `DATA` за автогара/разписания, ЖП гара и такси, въпреки че current `info_entries` има 3 transport records.

Това е особено важно, защото transport timetable/contact data е freshness-sensitive.

### Utilities — hybrid model

`info-lom-utilities-v1.js`:
- чете `info_entries` за `kurieri` и `internet-tv`;
- чете `info_actions`;
- но water/power/payment points/insurance и част от operational metadata са hardcoded в JS.

Следователно Utilities е **hybrid DB + hardcoded owner**.

### V6 consequence

V6-B не трябва просто да каже „Info е authoritative“. Трябва да има exact **Info Source Contract**:

1. кои mutable local facts задължително живеят в `info_entries`/authoritative owner;
2. кои статични presentation configs могат да останат в code;
3. как hardcoded facts се мигрират/свързват без загуба;
4. как се премахва duplicate fact ownership;
5. как freshness/recheck работи по data type;
6. как single-render-owner се постига без да се разваля одобрената информация.

Това е един от най-важните A2 findings.

---

## 4. INFO LOM SEO / SHARE BASELINE

Current top-level Info pages вече имат добри page-specific `title`/`description` за:

- Institutions;
- Transport;
- Health;
- Education/Culture;
- Banks/ATMs;
- Utilities.

Това е силна SEO основа за page-level intents.

Но current Info architecture е предимно section/page based, не public permanent URL за всеки granular `info_entry`. V6-B трябва да реши къде има реална стойност от crawlable/shareable detail/guide URL и къде section anchor е достатъчен.

Не трябва да се правят 152 thin pages механично.

Current Info pages имат много полезни direct actions/signals, но няма единен share contract (`Сподели / Копирай линк / Facebook`) между всички Info sections. Това остава V6-B interaction/share задача.

---

## 5. ARTICLES / GUIDES READINESS INVENTORY

### Реално current article content

#### `Как да избереш майстор и да избегнеш неприятни изненади`

- има реален `statia.html`;
- има H1, кратък intro и 4 practically useful sections;
- `statii.html` в current site показва този article;
- meta description е много общо `Практична статия за избор на майстор.`;
- няма разработен V6 topic-cluster/internal-link слой към Masters/Firms/Q&A/Info;
- няма evidence/source/freshness model, когато е приложимо.

**A2 status: `ЗА ПРЕРАБОТКА`**, не `ПРОВЕРЕНО ГОТОВО`.

### `Как се пенсионира човек`

Темата е вече разработвана като съдържание според текущия product context, но current `main` няма отделен article файл. Current Info DB има published `institucii/noi` record, което е authoritative local backbone.

**A2 status: `РАЗРАБОТВАНО`**  
Supporting owner: `Инфо Лом → Институции → НОИ`.

V6 target cluster:
`guide за пенсиониране → НОИ verified local record → related Q&A → correction/freshness`.

### Priority guide map from current V6 strategy

Тези теми се пазят като target inventory; не се обявяват за готови:

| Guide | A2 status | likely authoritative/local backbone |
|---|---|---|
| Подмяна на лична карта | `ТРЯБВА ДА ИМА` | Institutions / Police / official source |
| Смяна на адрес | `ТРЯБВА ДА ИМА` | Municipality / Institutions |
| Записване на дете в детска градина/училище | `ТРЯБВА ДА ИМА` | Education + Municipality |
| Покупко-продажба на имот | `ТРЯБВА ДА ИМА` | cadastral/property-registry institutions + Property context |
| Подаване на сигнал към община/институция | `ТРЯБВА ДА ИМА` | Institutions / verified contacts |
| Какво да направиш при спиране на ток/вода | `ТРЯБВА ДА ИМА` | Utilities / official actions |

Следващият content contract ще добави search intent, source owner, internal links, SEO-cannibalization risk и freshness requirements.

---

## 6. DYNAMIC DETAIL SEO / SHARE CURRENT STATE

### Questions

`vapros.html` server/static HTML започва с generic:
- title: `Въпрос | Попитай.Лом`;
- description: `Въпрос и отговори от общността.`

`supabase-content.js` сменя `document.title` след client-side fetch, но това не прави per-question server-readable Open Graph/canonical metadata.

Visible `Сподели` button съществува в `vapros.html`, но active question detail owner (`supabase-content.js`) няма bound handler към `#question-share-button` в audited detail flow. A2 го маркира като **current interaction defect / incomplete feature**, не само future idea.

### Listings

`obqva.html` server/static HTML започва с generic:
- title: `Обява | Попитай.Лом`;
- description: `Детайли на обявата.`

Listing owner вече има client-side share capability, но social crawler metadata остава generic at initial HTML level.

### Firms

`firma.html` server/static HTML започва с generic:
- title: `Фирмен профил | Попитай.Лом`;
- description: generic firm profile description.

Current base firm detail does not expose a unified share CTA in the audited HTML.

### Consequence

V6 dynamic share/SEO layer is **justified by current evidence**, not decorative scope. Candidate remains a lightweight server/edge render endpoint for approved public records, with no heavy runtime added to every page.

Exact architecture belongs to V6-B/V6-D.

---

## 7. MODERATOR / PROTECTED INTERACTION VERIFICATION

This stage used current Supabase policy introspection + current JS; no content writes.

### Q&A self-moderation — backend is correctly restricted

Current DB policies now distinguish:

- Admin: `admin manage questions/answers`;
- Moderator: read all, but **UPDATE only foreign questions/answers** where `author_id IS DISTINCT FROM auth.uid()`;
- own normal content: owner pending/edit rules.

`admin-management.js` also detects Moderator own Question/Answer/Listing and replaces moderation actions with:
`Собствено съдържание — без модераторски действия`.

Therefore the active V2 Admin path is aligned with the LOCKED self-moderation rule for this scope.

The older `supabase-content.js` still contains a generic admin-panel renderer without that same visual exclusion, but current `admin.html` uses `data-skip-supabase-content="true"` and loads `admin-management.js`, not `supabase-content.js` as its operational admin renderer. This is legacy/dead-code cleanup evidence, not current active permission authority.

### Confirmed protected-rule mismatch — Moderator own firm editing

LOCKED rule: Moderator own protected content must use the normal non-Admin owner flow and may not receive Admin direct-publish privileges.

Current implementation conflicts with this in **both UI and backend RPC**:

1. `profile-businesses.js` groups Admin + Moderator as `isStaff`, so normal edit link behavior is suppressed for Moderator.
2. `business-edit.js` explicitly blocks both `admin` and `moderator` with message that “Администраторската фирма” does not use the user edit form.
3. Current Supabase functions `resubmit_own_business` and `save_own_business_edit_draft` both reject `public.is_staff()`, which includes Moderator.

Result: a Moderator-owned firm is not being treated as a normal non-Admin firm for owner-edit flow, contrary to the canonical role rule.

**A2 classification: CONFIRMED PROTECTED-RULE DEFECT.**

This A2 planning stage does **not** modify it because the fix touches protected owner/RPC behavior. It must be handled as a narrow production incident/fix with explicit protected approval, preserving all other business rules.

---

## 8. PWA / SERVICE WORKER CURRENT STATE

Current repository tree/source search found no:

- web app manifest;
- service worker registration;
- share-target manifest configuration.

A2 current-state classification:
**NO CURRENT PWA OWNER FOUND IN THIS REPO.**

Therefore future Web Share Target remains optional/deferred enhancement and cannot be a dependency of Facebook Bridge MVP.

---

## 9. FIRST-PARTY ANALYTICS BASELINE

A2 checked current Popitai repo/source and current Supabase public schema read-only.

Found:
- no Popitai analytics/tracker integration in the repo search;
- no public Supabase table named like analytics/tracking/page_view/search_log/metrics.

There is not enough evidence to claim a current first-party Popitai analytics baseline from this project.

**A2 classification: SOURCE NOT PROVEN / BASELINE UNAVAILABLE.**

Do not substitute unrelated analytics from another project. V6-B can define the events/metrics contract; implementation comes later under performance/privacy rules.

---

## 10. A2 CONFIRMED VS NOT CONFIRMED

### Confirmed

- source-level active search page loads legacy `script.js` path;
- newer DB search file exists but is not referenced by the audited search page;
- Info DB currently contains 152 published confirmed records across six top-level categories;
- Health is DB-driven;
- Banks/Education/Transport visible data is substantially hardcoded despite DB counterparts;
- Utilities is hybrid DB + hardcoded;
- Institutions has multi-stage/staging render ownership debt;
- current Article surface has one actual separate article file and it needs V6 rework;
- dynamic Question/Listing/Firm initial HTML metadata is generic;
- question share button has no handler in audited active question detail owner;
- Q&A Moderator self-moderation is backend-restricted to foreign content in current DB;
- Moderator own-firm edit flow contradicts LOCKED rule in current UI + RPC;
- no PWA owner found;
- no Popitai analytics source/baseline proven.

### Not claimed

- no physical browser/live runtime QA was performed in A2;
- no content record was edited;
- no claim that all 152 Info records are factually current merely because they have confirmation dates;
- no final decision yet on how hardcoded Info facts migrate;
- no final IA/search/Q&A/recommendation/Facebook architecture yet;
- no production feature marked complete.

---

## 11. A2 EXIT GATE

**A2: COMPLETE.**

We now know:

- which source paths are active by current HTML evidence;
- actual current Info DB coverage and freshness signals;
- where Info source-of-truth is duplicated/hybrid;
- actual article readiness baseline;
- current dynamic SEO/share gaps;
- current protected Moderator/Q&A behavior;
- one confirmed Moderator-owned-firm rule defect;
- PWA current state;
- Analytics availability status.

This is sufficient to stop inventory/research from expanding indefinitely and move into **V6-B product contracts**.

---

## 12. EXACT NEXT STAGE

# `STAGE V6-B1 — FINAL IA / TAXONOMY / OWNER CONTRACT`

B1 must turn A1+A2 evidence into one product contract for:

1. top-level navigation and landing architecture;
2. stable main taxonomy;
3. subcategory ownership;
4. taxonomy vs dynamic shortcuts;
5. `Открий в Лом`;
6. exact role of Firms vs Marketplace;
7. Jobs vs Services correction;
8. Property presentation over Listings;
9. Construction/Masters protected presentation;
10. Health/Info/Shops specialized owner routes;
11. Restaurants/Events discovery position;
12. backward URLs/canonical mapping;
13. exact CTA/add route for every top-level category;
14. interaction record for every main route.

B1 is **design/spec only**. No production code.

After B1:
- V6-B2 Search/Info/Content contract;
- V6-B3 Q&A canonical/recommendations relations;
- V6-B4 Facebook/share/freshness/ranking contract;
- then V6-C real visual prototype.
