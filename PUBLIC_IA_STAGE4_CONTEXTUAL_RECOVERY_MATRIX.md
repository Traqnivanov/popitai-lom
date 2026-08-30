# PUBLIC IA — Stage 4 contextual-add recovery matrix

Date: 2026-08-30  
Status: **FORENSIC / TRACEABILITY CONTRACT — NO RECOVERY CODE YET**

## 1. Authority and baseline

Canonical authority, in order:

1. `PROJECT_RULES_00_READ_FIRST.md`
2. `PROJECT_RULES_PROTECTED_CORE.md`
3. `PROJECT_RULES_ADMIN_MODERATOR.md`
4. `PROJECT_RULES.md`
5. `PROJECT_RULES_RENDER_OWNERSHIP.md`
6. `PUBLIC_SITE_INFORMATION_ARCHITECTURE_APPROVED_SPEC.md`
7. this recovery matrix
8. later checkpoints

A later checkpoint may record evidence, but may not silently narrow an APPROVED requirement.

Verified current `main` at the start of recovery:

- `c5184a801bb56c91234058460b85826313d1cc44`

Last confirmed Stage 3 baseline:

- `956eaae7fca5175f13ee805610c5d698eaa82e53`

The Stage 3 → current-main compare is 33 commits ahead / 0 behind. The changed set is dominated by the Stage 4 public shell HTML/source and checkpoint documentation. The compare does **not** show post-Stage-3 changes to listing migrations/RLS/schema, `supabase-listings.js`, `category-listings-v1.js`, Admin/Moderator code, or the Stage 1 taxonomy backend enforcement.

## 2. Proven Stage 4 contradiction

The APPROVED specification says Stage 4 includes:

> `контекстно предварително попълване на съществуващи форми`

It also defines the site model as:

> theme → relevant provider/publication → add firm/listing/question through the correct existing form.

But `PUBLIC_IA_STAGE4_PRODUCTION_CHECKPOINT.md` narrowed the Stage 3 hubs to:

- Майстори: only `Намери майстор` + question CTA;
- Автомобили: only `Намери автосервиз или услуга` + question CTA;
- Услуги: only `Намери услуга` + question CTA.

That checkpoint therefore cannot be used as proof that canonical Stage 4 is complete.

**Recovery status:** Stage 4 is INCOMPLETE until the contextual-add matrix below is implemented and production-verified. Stage 5 final sign-off is paused.

## 3. Stage 4 classification

| Stage 4 area | Classification | Recovery decision |
|---|---|---|
| Canonical static header/footer/mobile shell | **ЗАПАЗВАМЕ** | No rollback. 41-page generator/sync remains useful. |
| Global `+ Добави` | **ЗАПАЗВАМЕ + ДОВЪРШВАМЕ** | Keep the general action sheet; contextual pages also need task-specific actions. |
| Five-position mobile navigation | **ЗАПАЗВАМЕ** | No business change required. |
| Health special action | **ЗАПАЗВАМЕ** | Existing verified health submission owner remains authoritative. |
| Shops special action | **ЗАПАЗВАМЕ** | Existing shop owner remains authoritative; no second flow. |
| Search / protected Ivanov priority | **ЗАПАЗВАМЕ** | No recovery change to ranking/search ownership. |
| Stage 3 thematic listing read layer | **ЗАПАЗВАМЕ** | It is the correct read/display destination for approved service listings. |
| Category hero CTA hierarchy | **ДОВЪРШВАМЕ** | `Намери…` stays primary; task-specific add actions must be visible; question stays secondary. |
| Subcategory cards that only search | **ДОВЪРШВАМЕ** | Keep discovery target, add direct contextual create/seek paths without a third taxonomy level. |
| Generic category-page `dobavi-obqva.html` target | **ДОВЪРШВАМЕ** | Contextual paths must carry canonical prefill. |
| Generic category-page `dobavi-firma.html` target | **ДОВЪРШВАМЕ** | Applicable category pages need safe business-category prefill. |
| `Stage 4 — COMPLETED` status in checkpoints/progress | **ВРЪЩАМЕ като статус** | Correct to INCOMPLETE/RECOVERY until production acceptance passes. No broad code rollback. |

## 4. Consolidation of the word/logic “Услуги”

This is an information-architecture consolidation only. It does **not** merge tables, moderation flows, ownership, roles, RLS, statuses or quotas.

| Current place | Current user meaning | Target decision | Future user meaning | Content type / owner | Target form / prefill | Display after approval |
|---|---|---|---|---|---|---|
| `Категории → Майстори и ремонти` | Repair-service discovery | **ОСТАВА** | Thematic entry for repair services | firms + listings + questions | listing: `Услуги + repair subcategory`; firm: `Майстори и ремонти`; question contextual | Firms + All listings + Майстори thematic hub |
| `Категории → Автомобили` | Auto service + vehicle discovery | **ОСТАВА** | Thematic entry with two separate tasks | firms + service listings + vehicle listings + questions | service: `Услуги + auto subcategory`; vehicle: `Автомобили и МПС`; firm: `Автомобили` | All listings + Автомобили hub + Firms |
| `Категории → Услуги` | General non-repair services | **ОСТАВА** | General services outside repairs, automotive and health | firms + listings + questions | listing: `Услуги + general subcategory`; firm internal `Работа и услуги` | All listings + Услуги hub + Firms |
| `Обяви → Услуги` | Publication category | **ОСТАВА** | Single publication location for one-off offer/seek service | listing owner | `dobavi-obqva.html` with canonical `category=Услуги` + subcategory | All listings + relevant thematic hub |
| `Фирми → Услуги` | Permanent provider profile | **ОСТАВА**, not a competing hub | Persistent provider identity | business owner | `dobavi-firma.html`, public label `Услуги`, internal value `Работа и услуги` | Firms + relevant thematic hub |
| `Инфо Лом → Комунални услуги` | Verified official/local reference | **ОСТАВА ОТДЕЛНО** | Water/electricity/cleaning/internet/official contacts | Info Lom owner | Info Lom correction/submission flows only | Info Lom only |
| `Здравна услуга` | Verified medical/practice suggestion | **ОСТАВА СПЕЦИАЛНО** | Verified health dataset, not marketplace | health / `info_submissions` owner | existing health submission flow | Health category + Info Lom Health |

Result: users see three thematic service entrances (Repairs, Automotive, General Services), while one-off service publications still live only in `Обяви → Услуги` and permanent providers still live only in `Фирми`.

## 5. Exact canonical taxonomy used by recovery

The recovery must use the Stage 1 dictionary exactly. It does not create aliases in stored listing taxonomy.

### Repair services — 8

1. Цялостни ремонти
2. Бани и плочки
3. ВиК
4. Електро
5. Покриви
6. Боядисване
7. Дограма
8. Климатици

### Automotive services — 6

9. Автосервизи
10. Диагностика
11. Гуми
12. Авточасти
13. Автомивки
14. Пътна помощ

### General services — 8

15. Домашна помощ
16. Красота и грижа
17. Компютърни и технически услуги
18. Фото, видео и събитийни услуги
19. Професионални услуги
20. Обучение и уроци
21. Грижа за деца, възрастни и домашни любимци
22. Транспорт, преместване и доставки

### Naming conflict held for owner review

The recovery handoff text uses `Боядисване и шпакловка`, while the APPROVED V2 specification, Stage 1 LOCKED taxonomy decision and current canonical dictionary use `Боядисване`.

Recovery uses **`Боядисване`** and does not rename the protected taxonomy without a later explicit owner decision.

## 6. Current → target category matrix

### 6.1 Майстори и ремонти — LOCKED

Current code:

- primary `Намери майстор`;
- secondary `Задай въпрос`;
- eight cards lead only to `tarsene.html?q=...`;
- Stage 3 firms/listings/questions blocks already exist;
- no contextual listing prefill.

Target:

| Subcategory | Discovery | Offer service | Seek contractor | Add firm | Question | Status now |
|---|---|---|---|---|---|---|
| Цялостни ремонти | search exact theme | `dobavi-obqva.html?category=Услуги&subcategory=Цялостни%20ремонти` | same context + seek intent | business category `Майстори и ремонти` | `category=maistori` | **MISSING add/seek/firm prefill** |
| Бани и плочки | search exact theme | `category=Услуги&subcategory=Бани%20и%20плочки` | same context + seek intent | `Майстори и ремонти` | `maistori` | **MISSING** |
| ВиК | search exact theme | `category=Услуги&subcategory=ВиК` | same context + seek intent | `Майстори и ремонти` | `maistori` | **MISSING** |
| Електро | search exact theme | `category=Услуги&subcategory=Електро` | same context + seek intent | `Майстори и ремонти` | `maistori` | **MISSING** |
| Покриви | search exact theme | `category=Услуги&subcategory=Покриви` | same context + seek intent | `Майстори и ремонти` | `maistori` | **MISSING** |
| Боядисване | search exact theme | `category=Услуги&subcategory=Боядисване` | same context + seek intent | `Майстори и ремонти` | `maistori` | **MISSING** |
| Дограма | search exact theme | `category=Услуги&subcategory=Дограма` | same context + seek intent | `Майстори и ремонти` | `maistori` | **MISSING** |
| Климатици | search exact theme | `category=Услуги&subcategory=Климатици` | same context + seek intent | `Майстори и ремонти` | `maistori` | **MISSING** |

Recovery must not alter the internal listing/business approval, quota, ownership, Admin direct-publish, search priority or SEO routing.

### 6.2 Автомобили

Current code:

- primary `Намери автосервиз или услуга`;
- secondary question;
- six service cards search only;
- generic `Към Обяви` card for vehicle sale/buy;
- existing Stage 3 service-listing and vehicle-listing blocks.

Target:

| Task | Target |
|---|---|
| Find auto service | keep exact service discovery |
| Offer auto service | `dobavi-obqva.html?category=Услуги&subcategory=<one of 6 canonical auto values>` |
| Seek auto service/provider | same category/subcategory + seek intent |
| Sell / seek vehicle or part | `dobavi-obqva.html?category=Автомобили%20и%20МПС` (user then uses an allowed existing listing type unless an exact safe intent is supplied) |
| Add permanent provider | `dobavi-firma.html?category=Автомобили` |
| Ask recommendation | `nov-vapros.html?category=avtomobili` secondary |

All six automotive service values currently lack contextual create/seek links: **MISSING**.

### 6.3 Услуги

Current code:

- primary `Намери услуга`;
- secondary question;
- eight general-service cards search only;
- Stage 3 listings block exists;
- business block correctly retains internal compatibility `Работа и услуги`.

Target for each of the eight general service subcategories:

- `Предложи услуга` → existing listing form + `category=Услуги` + exact canonical subcategory;
- `Търся изпълнител` → same context + safe seek intent;
- `Добави фирма` → existing business form + internal `category=Работа и услуги`;
- question remains secondary.

All eight contextual add/seek paths are currently **MISSING**.

### 6.4 Магазини и покупки

Current code already has:

- specialized Supabase-backed shop catalog;
- existing `#addBtn` shop submission owner;
- Stage 4 special action delegates to that owner;
- `Намери магазин`, `Всички обяви`, contextual question.

Target:

- keep specialized owner;
- make the contextual `Добави магазин` action visibly reachable when the existing flow is actually available;
- do not route it through `dobavi-firma.html`;
- do not create a second shop submission owner.

Classification: **ЗАПАЗВАМЕ + small contextual visibility completion**.

### 6.5 Здраве и лекари

Current code already has:

- `Добави лекар или здравна услуга` owner CTA;
- Stage 4 health special action delegating to the same owner;
- contextual question;
- verified health renderer/filters;
- Info Lom health link/error flow.

Classification: **PASS / ЗАПАЗВАМЕ**. No marketplace listing action is added.

### 6.6 Заведения

Current code:

- `Намери заведение`;
- five discovery cards;
- contextual question;
- generic global firm link but no venue-category prefill.

Target:

- keep discovery;
- add visible `Добави заведение` → existing firm form with business category `Заведения` prefilled;
- question remains secondary;
- no booking/orders/payments.

Status: **MISSING contextual business prefill/action**.

### 6.7 Всички обяви

Current code correctly remains the authoritative generic catalog and generic create form.

Target:

- keep generic `Добави обява`;
- contextual pages only prefill the same existing form;
- no second listing create flow.

Classification: **PASS / ЗАПАЗВАМЕ**, with a narrow create-prefill reader added to the existing form surface.

### 6.8 Събития

Current evidence:

- `events-public-v1.js` is read-only approved/upcoming renderer;
- `admin-events.js` moderates rows in `events`;
- current public page has no event submission form/action;
- no public submission owner has yet been proven in the repository audit.

Target rule:

- show `Добави събитие` only if a real public submission/moderation write flow is positively identified;
- do not invent a form or write path as part of contextual recovery.

Status: **HELD / NOT BLOCKING OTHER RECOVERY WORK**.

## 7. Prefill contract — listings

Recovery will use the existing `dobavi-obqva.html` form. It does not create a new form.

### Allowed query parameters

- `category`
- `subcategory`
- optional `type` only when it exactly equals an already-approved type valid for that category
- existing `edit` remains authoritative

### Rules

1. If `edit` exists, create-prefill is ignored entirely.
2. `category` is accepted only if present in `PopitaiCategoryDictionary.listingCategories`.
3. Category is applied first and the existing dependent-field sync is triggered.
4. `subcategory` is applied only when `PopitaiCategoryDictionary.isValidListingSubcategory(category, subcategory)` is true.
5. Non-service categories never receive a non-empty subcategory.
6. Invalid/unknown parameters are ignored, never injected as arbitrary option values.
7. A `type` value is applied only if it is already allowed by the Stage 1 category/type pairing.
8. Prefill does not disable fields: users may choose another **allowed** canonical value.
9. Existing frontend validation and Stage 1 backend integrity validation remain authoritative.
10. No change to ownership, create/edit behavior, RLS, status, quota, media, moderation or Admin direct publish.
11. Refresh/back reproduces the same safe URL-derived initial state.
12. URL prefill never overwrites loaded edit/draft data.

### Intent handling

- `Търся изпълнител` can safely map to existing allowed type `Търси` for `Услуги`.
- The existing generic type set for non-Работа/non-Имоти is `Продава / Купува / Търси / Дава`.
- The canonical specification says `Предложи услуга`, but does not explicitly define which existing stored generic type represents that label. Recovery must **not create a new `listing_type`**. Exact offer-type semantics are held for owner review unless a stronger existing rule is found. Category/subcategory prefill can still be completed safely without changing backend taxonomy.

## 8. Prefill contract — firms

The existing `dobavi-firma.html` form remains authoritative.

Safe create-only prefill:

| Public context | Internal business category |
|---|---|
| Майстори и ремонти | `Майстори и ремонти` |
| Автомобили | `Автомобили` |
| Услуги | `Работа и услуги` |
| Заведения | `Заведения` |

Rules:

- accept only a value that already exists in the dictionary business-category options;
- if `edit` exists, do not apply create prefill;
- never modify submit/approval/direct-publish/business ownership logic;
- Shops and Health do not use this generic prefill flow.

## 9. Desktop/mobile target behavior

For `Майстори`, `Автомобили` and `Услуги`:

- desktop: keep the subcategory card as discovery; provide compact task actions associated with the chosen/exact subcategory (`Предложи…`, `Търся…`) without creating a third taxonomy level;
- mobile: the same actions must be reachable within the category → subcategory model; no hidden third nested menu; touch targets follow existing >=44 px practical target rules;
- `Намери…` remains the primary hero action;
- contextual add actions are visible participation actions;
- `Задай въпрос` remains secondary.

The exact rendering implementation must have one owner and must not overwrite Stage 3 listing/business/question roots.

## 10. External model comparison — what is borrowed and what is not

### Thumbtack

Official reference: `https://www.thumbtack.com/how-it-works`

Observed model: search a concrete project/task, inspect local professional profiles/reviews, then communicate/hire.

Use here:

- **problem solved:** users think in tasks (`ВиК`, `Покриви`), not in database content types;
- **applicable to Lom:** category/subcategory should carry task context into the next action;
- **do not import:** booking, in-platform chat, payments, review infrastructure;
- **mapping:** task/theme entry → existing Firms/Listings; Questions remain optional community advice.

### TaskRabbit

Official references:

- `https://support.taskrabbit.com/hc/en-us/articles/46260422073755-How-Do-I-Hire-a-Tasker`
- `https://www.taskrabbit.com/`

Observed model: choose/search task category first, then choose provider/profile and provide task details.

Use here:

- **problem solved:** prevents a user from re-selecting context from zero;
- **applicable to Lom:** `Майстори → ВиК` should prefill `Услуги → ВиК` when adding/seeking;
- **do not import:** scheduling, pricing marketplace, payments, Tasker onboarding;
- **mapping:** category context → existing listing form/provider profiles.

### Houzz

Official reference: `https://www.houzz.com/`

Observed model: `Find Pros` organizes persistent professional profiles by professional/service theme.

Use here:

- **problem solved:** separates a persistent provider identity from a one-off request/offering;
- **applicable to Lom:** Firms remain permanent profiles while Listings remain temporary offers/searches;
- **do not import:** project-management/design-commerce ecosystem;
- **mapping:** thematic category can show Firms without turning the category into another firm database.

### Nextdoor

Official references:

- `https://business.nextdoor.com/en-us/getting-started/business-page`
- `https://business.nextdoor.com/en-us/small-business/fave-awards`

Observed model: local Business Pages plus neighborhood recommendations/local trust.

Use here:

- **problem solved:** local discovery and recommendation are different but complementary;
- **applicable to Lom:** keep permanent local provider profiles and community questions/recommendations side by side;
- **do not import:** social feed/self-promotion mechanics, awards/ranking, ad system;
- **mapping:** Firms = provider presence; Questions = community advice; neither replaces the other.

### OLX Bulgaria

Official references:

- `https://www.olx.bg/`
- `https://www.olx.bg/uslugi/`

Observed model: one authoritative listings catalog with clear categories including Services, Work and Vehicles, plus one generic `Добави обява` entry.

Use here:

- **problem solved:** prevents duplicated publication databases;
- **applicable to Lom:** all one-off offers/searches live once in `Обяви`; themes only surface matching records;
- **do not import:** OLX monetization, nationwide logistics/delivery, its exact taxonomy, medical-service marketplace;
- **mapping:** `Обяви → Услуги` is the single storage/publication location; Майстори/Автомобили/Услуги are discovery views.

## 11. Protected-core risk map

| Recovery action | Risk | Rule |
|---|---|---|
| Read canonical query params and preselect existing listing options | Low if create-only | Must not alter submit/write logic; edit wins |
| Add contextual links from thematic pages | Low/approved navigation scope | Targets existing protected forms only |
| Add business category create-prefill | Low if create-only | No business submit/approval logic change |
| Rename/restructure stored listing subcategories | **LOCKED — not allowed** | No taxonomy rename without explicit owner decision |
| Add new listing type `Предлага услуга` | **LOCKED — not allowed in recovery** | Would change backend taxonomy/business semantics |
| Change quotas/RLS/status/ownership/moderation | **LOCKED — excluded** | No recovery DB/business change |
| Change Иванов/construction ranking | **LOCKED — excluded** | Must regression-test only |
| Invent public event submission | **Not allowed** | Requires proven existing flow or later decision |

## 12. Minimum recovery implementation scope after this matrix

If no new protected conflict is discovered, the safe recovery code scope is limited to:

1. safe create-prefill reader for existing listing form (prefer canonical dictionary ownership; edit always wins);
2. safe create-prefill reader for existing business form (edit always wins);
3. contextual task actions in `maistori.html`, `avtomobili.html`, `rabota.html`, `zavedenia.html`;
4. direct per-subcategory create/seek URLs for all 22 service values;
5. visible delegation to the existing shop add owner where available;
6. keep Health unchanged;
7. keep Events without fake add action unless a real public event submission owner is proven;
8. extend automated recovery checks so every canonical subcategory maps to an exact safe URL;
9. correct Stage 4/Stage 5 checkpoint status after implementation evidence;
10. restart Stage 5 only after production contextual-add PASS.

No DB migration, no RLS change, no listing/business write-flow rewrite, no Admin/Moderator change.

## 13. Recovery acceptance matrix

Required before Stage 4 can be restored to PASS:

- all 22 service subcategories have a deterministic discovery target;
- all 22 have a deterministic listing create target with `category=Услуги` and exact canonical subcategory;
- all applicable seek-contractor paths preserve the same exact context;
- invalid category/subcategory/type query values are ignored;
- refresh/back preserves valid prefill;
- `edit=<id>` ignores create-prefill and loaded DB/draft values win;
- business prefill is valid for Майстори/Автомобили/Услуги/Заведения and never substitutes Shops/Health;
- Admin direct publish labels/behavior remain unchanged;
- ordinary-user pending flow remains unchanged;
- quotas/media/status/ownership/moderation remain unchanged;
- Stage 3 themed read layers still display approved records from their one source;
- protected `шпакловка` / `работа` / `автомивка` search regression remains correct;
- desktop/mobile task paths are visible and do not introduce a third taxonomy level;
- no fake QA records are created;
- production verification checks real URL/form state, not only source text.

## 14. Forensic conclusion

### We keep

Stage 1 taxonomy/backend integrity, Stage 2 search, Stage 3 read-only listings, Stage 4 canonical shell/navigation, Health/Shops specialized owners, Admin/Moderator boundaries and protected ranking.

### We finish

The missing bridge between thematic context and the correct existing create form, including safe listing/business prefill and visible task-specific actions.

### We revert

Only the **false completion status/acceptance assumption** that shell/navigation PASS meant canonical Stage 4 PASS. A broad code rollback is neither required nor justified by the evidence.

### Held for owner later, without blocking safe work

1. `Боядисване` (canonical) vs `Боядисване и шпакловка` (recovery handoff wording).
2. Exact stored generic `listing_type` to represent the visible action `Предложи услуга`, if the current allowed `Дава` label is not considered semantically sufficient.
3. `Добави събитие` only if/when a real public event submission flow is proven or separately approved.
