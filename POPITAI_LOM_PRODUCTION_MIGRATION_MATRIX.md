# Попитай.Лом — pre-implementation migration control pack

Статус: **КАНОНИЧЕН КОНТРОЛЕН ДОКУМЕНТ / БЕЗ РАЗРЕШЕНИЕ ЗА PRODUCTION, SUPABASE ИЛИ STAGE 3 ПРОМЕНИ**

Work: **Work 2 · 15.09.2026**

Exact review base: `6e4b75276c64b41ffdc534384064a2a3b60b7685`

Safety HEAD: `997d97504251f4cbae0693dc0cffa24d1d04da79` — **LOCKED; не се мести**

Production `main` при одита: `76cb377c063371b5f1221a98b47e3dd2e16bd385`

Управляващи източници: `POPITAI_LOM_MASTER_CURRENT.md` §12–§15 и приложимите `PROJECT_RULES*`.

## 1. Цел и доказателствена граница

Това е единната изпълнима migration matrix, изискана от Master §12.2. Тя:

- свързва public task, route, data owner, форма, таблица/RPC, role/RLS, moderation, SEO/OG, действие, тест и rollback;
- подрежда 14-те production checkpoints по dependency и риск;
- включва 9-те Services families и всичките 46 owner-approved видими входа;
- пази отделни gate-ове за Admin-only permanent delete, `Иванов Ремонти`, Add/Edit flows, domain/auth/SEO/OG, Favorites, Articles, Publications, Events, social images и launch recovery;
- не променя код, данни, DNS, Supabase, safety branch или production.

### 1.1 Статуси за evidence

| Статус | Точно значение |
| --- | --- |
| `PROVEN IN REPO` | Доказано от versioned source на exact base; не доказва live конфигурацията. |
| `PROTOTYPE ONLY` | Съществува само в Stage 2 review scope. |
| `LIVE UNVERIFIED` | Изисква отделно owner разрешение за read-only live проверка. |
| `OWNER DECISION` | Нужен е изричен избор; няма подразбиране. |
| `PRODUCTION APPROVAL` | Нужен е отделен exact-scope approval преди write/merge/deploy. |
| `BLOCKED` | Не се изпълнява, докато предходният gate не е затворен. |
| `STOP` | Прекратява останалата migration работа до решение/поправка. |

### 1.2 Стоп условия

Работата спира незабавно при:

1. разминаване между текущия branch SHA и одобрения base;
2. потвърден live конфликт с Admin-only permanent delete;
3. промяна на роли, ownership, moderation, status lifecycle, quotas, media limits или direct-publish без отделно approval;
4. засягане на Firms/Listings/Masters/Admin protected semantics или `Иванов Ремонти` без exact protected approval;
5. нов datastore, write owner, публична форма или destructive data migration без отделно решение;
6. невъзможен backup/rollback или непълен guest/user/moderator/admin тест;
7. production migration преди owner freeze на exact Stage 2 SHA.

## 2. Доказана текуща production карта

| Област | Доказано текущо състояние | Target / migration verdict |
| --- | --- | --- |
| Public shell | HTML shell + `public-shell-v1.js`; runtime patching | Един shell owner; не се добавя нов patch layer. |
| Search | `tarsene.html` зарежда `script.js`; activation на `public-search-v1.js` не е доказана | Преди migration се избира един search owner и се премахва конкуренцията behavior-preserving. |
| Listings | `listings` + `media`; `supabase-listings.js`; edit-draft RPCs са извиквани от source | Запазен authoritative owner за Обяви, Услуги, Работа, Имоти, Автомобили и Животни. |
| Firms | `businesses` + `media` + expanded profile/draft owners | Запазен protected owner; Заведения са Firms discovery, не нов datastore. |
| Masters | `maistori.html` + Firms/Listings/Q&A composition | Protected route/semantics; presentation се адаптира около owner-а. |
| Shops | `shops`; `shops-catalog-v3.js`; `admin-shops.js` | Запазен specialized owner. Live schema/RLS: `LIVE UNVERIFIED`. |
| Health | `info_entries` + `info_submissions`; specialized Health scripts | Запазен specialized Info/Health owner; доказани add types: doctor/dentist/vet. |
| Info Lom | `info_entries`, `info_submissions`, `info_error_reports`, history/actions в JS | Authoritative local facts; не се копират в Listings/Articles. Live schema/RLS: `LIVE UNVERIFIED`. |
| Events | `events`; public and admin scripts | Public approved/upcoming read; няма одобрен public Add при launch. |
| Q&A | `questions`, `answers`; public/profile/admin flows | Запазен community owner; не се представя като verified Info. |
| Articles | Static `statii.html` / `statia.html`; няма доказан DB authoring owner | Admin editorial lifecycle е production checkpoint. |
| Publications | Няма доказан production owner/table/route | Нов отделен editorial owner само след schema/API/RLS approval. |
| Favorites | Само prototype session behavior | Production storage/login/RLS contract е отделен gate. |
| SEO/OG | Canonical има само в 5 HTML файла; OG е само на Home; няма `robots.txt`, sitemap или `CNAME` | Пълен cutover gate след готови owners; dynamic detail metadata трябва да е crawler-readable. |

Целевите `uslugi.html`, `imoti.html`, `stoki.html`, `zhivotni.html` и `aktualno.html` липсват в одитирания production tree. `rabota.html` съществува, но текущо представя `Услуги`. Това е migration inventory, не разрешение за route промяна.

## 3. Ordered production migration matrix — 14 checkpoints

`Approval` означава approval за конкретния ред, не за останалата таблица.

| ID / public task | Canonical route | Current production owner | Form / Add / Edit owner | Table / RPC | RLS / role boundary | Moderation / status | SEO / canonical / OG | Exact migration action | Test evidence required | Rollback | Work verdict | Approval | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P01 Services exact leaf | `uslugi.html` → listing detail | Listings + discovery dictionary; target route missing | `dobavi-obqva.html`; bounded editable prefill; offer-only `Дава` | `listings`; listing edit/media RPCs | Guest public approved read; user/mod own create remains normal; Admin exceptions preserved | pending → approved/rejected/needs_changes; approved edit keeps last public version | New hub canonical; detail OG only for public record | Define backward-compatible visible-entry ↔ stored subcategory alias map; persist/reconstruct exact leaf without rewriting legacy rows | 46-row source test; create/edit/resubmit; legacy `Търси`; desktop/390; no owner duplication | Disable new map/route; restore old dictionary and links; no row rewrite | Required first discovery data contract after shell | Per-row production approval | `BLOCKED BY STAGE 2 FREEZE` |
| P02 Work compensation | `rabota.html` | Listings category `Работа` | Existing Listing form | `listings`; exact new storage contract `OPEN` | Same Listing RLS/quotas; no frontend-only field | Same Listing lifecycle | Jobs canonical, natural metadata, no thin filter canonicals | Specify optional amount + required period when amount exists + `По договаряне`; migration/default for old records | field validation, DB rejection, add/edit/moderation, old record rendering, mobile | Feature flag/remove new fields; preserve old values; reversible schema migration | Needs technical design; not bundled with route migration | Schema/RLS approval | `BLOCKED` |
| P03 Routes / redirects | Home + Master §5A route map | Mixed static routes; five targets missing; `rabota.html` semantic mismatch | No new write owner | None unless edge/redirect config | Public read only; auth return URLs must survive | N/A | Old/new URL map, canonical, robots, sitemap, structured data | Add target routes one bounded group at a time; keep compatibility for `kategorii.html`; verify every inbound link | crawl/link graph; old URL; query/hash; auth return; 404; desktop/390 | Revert route group and redirect config; keep old URLs serving | Must follow shell/search owner decision | Route-group approval | `BLOCKED` |
| P04 Share / OG / social image delivery | Every eligible public detail | Existing content owners; static client-rendered details | No public authoring change | Owner tables + future cached asset/storage contract `OPEN` | Only public/approved/share-eligible records; no private/moderation data | Hidden/rejected/removed/expired gets honest unavailable state | Server/edge-readable title, description, canonical, `og:*`; stable 1200×630 | Build one content-type adapter and cached social image lifecycle; hierarchy: approved media → exact approved theme → family → Lom fallback | crawler fetch without JS; cache refresh after edit/status; unavailable; Web Share/FB/copy; privacy | Disable dynamic adapter; serve safe generic fallback; purge generated cache | Separate architecture/security gate | Storage/edge approval | `BLOCKED` |
| P05 Events public surface | `aktualno.html` + event detail decision | `events`; `events-public-v1.js` / `admin-events.js` | No public Add at launch | `events` | approved/current public; staff moderation; hard delete Admin-only | pending/approved/rejected/needs_changes; upcoming vs ended | Event structured data only from real dates/status; ended not upcoming | Compose Events in `Актуално`; keep owner; do not invent Add | upcoming/window/ended/hidden; mod own-content exclusion; desktop/390 | Remove discovery composition; existing event owner remains | Read surface allowed only after Stage 2 freeze | Route/read approval | `BLOCKED` |
| P06 Articles lifecycle | `statii.html` / stable article detail | Static files; no DB owner proven | Admin-only editorial authoring at launch | `NONE / OPEN` | Admin authoring; public only ready canonical content | draft/review/ready/stale/unavailable contract required | Article canonical + structured data + reviewed/freshness | Choose lightweight owner and editorial lifecycle; migrate existing article without duplicate URL | draft excluded; ready published; update/review; stale high-risk; share/canonical | Static current article remains restorable; export before migration | Separate technical design | Owner + production approval | `BLOCKED` |
| P07 Publications owner | `aktualno.html` + stable publication detail | None proven | Admin-only editorial authoring at launch | New table/API/RLS `OPEN` | Admin-only create/edit; public approved only | Separate lifecycle from Article/Event | Thin/social-only may be noindex; canonical only when useful | Design owner/schema/API/RLS; never store as Article teaser by default | role matrix; publish/unpublish; links; OG; no fake metrics | Drop feature/read path only after export; no cross-owner deletion | New owner; highest approval threshold | Explicit product + schema/RLS approval | `BLOCKED` |
| P08 Global search integration | `tarsene.html` | Active legacy `script.js`; DB-backed candidate not proven active | Ask fallback → existing Q owner | Read adapters for owners; no universal table | Public/approved/current only; selected fields; max bounded queries | Partial owner failure is not empty result | Search states noindex; links point to canonical owners | Select one renderer; integrate Shops, Health and Events without copying owners; apply B8 cascade | 14 B8 queries; Ivanov relevance; exact other firm; Info safety; partial/error; performance | Switch back to active legacy owner; preserve old route | Must follow protected adapter design | Search-owner approval | `BLOCKED` |
| P09 Favorites | Profile + eligible detail | Prototype session-only | Detail `Запази`; login return-to-action | New relation/storage/RLS `OPEN` | Owner can read/write own favorites only; removed target safe | active/unavailable/removed; idempotent add/remove | Favorites/profile `noindex`; no leakage in OG | Define allowed types, stable identity, storage and unavailable behavior | guest gate; login return; add/remove; cross-user denial; deleted target; mobile | Disable controls; retain/export relation rows until decision | Separate owner/security checkpoint | Schema/RLS approval | `BLOCKED` |
| P10 Renderer consolidation | All migrated roots | Legacy V3/V/B/Stage layers and known parallel owners | No form change | None | No permission change | No lifecycle change | No URL/meta change as side effect | For each root name one renderer; disable replaced renderer; no MutationObserver/timer as permanent owner | no flash/double DOM/duplicate requests; functional parity; desktop/390 | Restore prior script manifest per root | Required before each visual integration | Per-root approval | `BLOCKED` |
| P11 Form-owner E2E | Every public Add/Edit row in §5 | Existing specialized owners | See §5 | See §5 | UI + JS + RPC/RLS same boundary | Exact owner lifecycle; Moderator never self-approves | Forms `noindex`; success links to canonical/profile | Close one form row at a time including error/retry/dirty/success/recovery | guest/user/mod/admin; double submit; network error; last approved version | Restore prior form/controller; no submitted record deletion as rollback | Mandatory before owner integration | Per-form approval | `BLOCKED` |
| P12 SEO per discovery page | Every Master §5A public route | Static HTML + owner detail pages | None | Read only / edge candidate | Metadata only from public safe fields | unavailable metadata follows status | Exact title/description/canonical/robots/sitemap/schema/OG | SEO audit and implementation only after route/owner is stable | crawler + browser; duplicate alias; old URL; noindex filters; schema validator | Revert metadata/redirect group; keep old canonical reachable | Follows P03/P04/P08 | SEO cutover approval | `BLOCKED` |
| P13 Content protection | Public API/read surfaces | Direct Supabase client reads in multiple owners | None | Existing tables; pagination/rate limit/edge design `OPEN` | Least fields; no service-role secrets; RLS mandatory | Public states only; audit/monitoring | Canonical/provenance/freshness; no anti-copy tricks | Inventory endpoints/fields; add bounded reads, monitoring and legal-reviewed Terms | pagination/limits; enumeration; cache; privacy; accessibility | Disable new limiter safely; retain logs/evidence; restore known read path | Security + legal checkpoint | Explicit security/legal approval | `BLOCKED` |
| P14 Wider Health submission | `zdrave-i-lekari.html` | Specialized Health supports doctor/dentist/vet | `health-submissions-v1.js` | `info_submissions` + staff RPCs in source | Login required; public data stays verified; role boundary live-unverified | pending → staff review; correction does not auto-replace fact | Only verified public records index/share | Do nothing unless owner approves exact additional type; extend existing owner, never generic Listing shortcut | each type; source/reliability; mod own item; corrections; mobile | Remove new type from form/read adapters; keep submitted evidence safely | Not needed for launch unless separately chosen | Product + backend approval | `DEFERRED / OPEN` |

## 4. Services migration submatrix — 9 families / 46 visible entries

Общ contract за всеки ред:

- current owner: `listings`, `category = Услуги`; provider context may read Firms without copying records;
- Add/Edit owner: `dobavi-obqva.html` / `supabase-listings.js`; new public publishing is offer-only `listing_type = Дава`;
- backend: current source uses `listings.subcategory`; reliable exact leaf persistence/reconstruction remains a production checkpoint;
- security/lifecycle: Listing RLS/quotas/Admin direct-publish/normal pending/approved-edit-draft rules remain unchanged and live behavior is `LIVE UNVERIFIED`;
- SEO: family hub canonical; filter/alias states do not become competing canonicals;
- test: exact browse → result → add prefill → edit/resubmit → reconstruct, plus legacy alias and desktop/390;
- rollback: remove the new mapping/route adapter, restore the previous dictionary, never rewrite/delete legacy rows;
- approval/status: Work 2 taxonomy is approved; production implementation remains `BLOCKED BY STAGE 2 FREEZE` and requires P01 approval.

| # | Family | Visible entry | Compatibility / exact action | Current evidence verdict |
| --- | --- | --- | --- | --- |
| 1 | Майстори, ремонти и дом | Цялостни ремонти | Exact visible entry; preserve Masters/protected cross-link | Prototype map proven |
| 2 | Майстори, ремонти и дом | Бани и плочки | Exact visible entry | Prototype map proven |
| 3 | Майстори, ремонти и дом | ВиК | Exact visible entry; factual emergency intent stays Info-first | Prototype map proven |
| 4 | Майстори, ремонти и дом | Електро | Exact visible entry | Prototype map proven |
| 5 | Майстори, ремонти и дом | Покриви | Exact visible entry | Prototype map proven |
| 6 | Майстори, ремонти и дом | Шпакловка / гипсокартон / боядисване | Preserve component terms as aliases/filters | Prototype map proven |
| 7 | Майстори, ремонти и дом | Дограма и врати | Exact visible entry | Prototype map proven |
| 8 | Майстори, ремонти и дом | Отопление и климатици | Exact visible entry | Prototype map proven |
| 9 | Майстори, ремонти и дом | Монтажи и мебели | Exact visible entry | Prototype map proven |
| 10 | Майстори, ремонти и дом | Къртене и извозване | Exact visible entry | Prototype map proven |
| 11 | Почистване и поддръжка | Почистване | `Почистване на дом`, `Офиси и входове` → filters | Prototype map proven |
| 12 | Почистване и поддръжка | Пране на мека мебел и килими | Exact visible entry | Prototype map proven |
| 13 | Почистване и поддръжка | Двор, градина и озеленяване | `Двор и градина`, `Озеленяване` → filters | Prototype map proven |
| 14 | Почистване и поддръжка | Борба с вредители | Exact visible entry | Prototype map proven |
| 15 | Автомобилни услуги | Автосервиз | Normalize legacy plural `Автосервизи` as alias | Prototype map proven |
| 16 | Автомобилни услуги | Диагностика | Exact visible entry | Prototype map proven |
| 17 | Автомобилни услуги | Гуми | Exact visible entry | Prototype map proven |
| 18 | Автомобилни услуги | Автоелектро и автоклиматици | Preserve both component intents | Prototype map proven |
| 19 | Автомобилни услуги | Автомивка и детайлинг | Preserve legacy `Автомивки` alias | Prototype map proven |
| 20 | Автомобилни услуги | Пътна помощ | Exact visible entry | Prototype map proven |
| 21 | Транспорт, преместване и доставки | Товарен транспорт | `Транспорт с бус/камион`, `Бус и камион` → aliases | Prototype map proven |
| 22 | Транспорт, преместване и доставки | Хамали и преместване | `Хамали`, `Преместване` → aliases | Prototype map proven |
| 23 | Транспорт, преместване и доставки | Доставки | Exact visible entry | Prototype map proven |
| 24 | Транспорт, преместване и доставки | Пътнически превоз | Add explicit Stage 2 contract mapping before reality pass; keep separate from Info schedules/contacts | **Prototype gap confirmed** |
| 25 | Красота и лична грижа | Фризьор и бръснар | Preserve both component intents | Prototype map proven |
| 26 | Красота и лична грижа | Маникюр и педикюр | Preserve both component intents | Prototype map proven |
| 27 | Красота и лична грижа | Козметика и грим | `Козметични услуги`, `Грим` → filters/aliases | Prototype map proven |
| 28 | Красота и лична грижа | Немедицински масаж | Must not imply medical treatment | Prototype map proven |
| 29 | Грижа за хора и животни | Детегледачки | Exact visible entry | Prototype map proven |
| 30 | Грижа за хора и животни | Грижа за възрастни | Exact visible entry | Prototype map proven |
| 31 | Грижа за хора и животни | Помощ в дома | `Домашна помощ`, `Домашни помощници` → aliases; cross-link from cleaning | Prototype map proven |
| 32 | Грижа за хора и животни | Гледане и разхождане на домашни любимци | Preserve both component intents | Prototype map proven |
| 33 | Грижа за хора и животни | Грижа и подстригване на домашни любимци | Preserve both component intents | Prototype map proven |
| 34 | Обучение, уроци и спорт | Уроци и курсове | `Уроци`, `Езици`, `Професионално обучение`, `Компютърни курсове` → filters | Prototype map proven |
| 35 | Обучение, уроци и спорт | Шофьорски курсове | Exact visible entry | Prototype map proven |
| 36 | Обучение, уроци и спорт | Спорт и танци | Preserve both component intents | Prototype map proven |
| 37 | Техника, дигитални и професионални услуги | Ремонт на техника | `Компютри/лаптопи`, `Телефони/електроника` → filters | Prototype map proven |
| 38 | Техника, дигитални и професионални услуги | ИТ, сайтове и дизайн | `IT`, `Сайтове`, `Дизайн` → filters/aliases | Prototype map proven |
| 39 | Техника, дигитални и професионални услуги | Счетоводство | Exact visible entry | Prototype map proven |
| 40 | Техника, дигитални и професионални услуги | Правни услуги | Exact visible entry; no verified/legal authority badge | Prototype map proven |
| 41 | Техника, дигитални и професионални услуги | Преводи | Exact visible entry | Prototype map proven |
| 42 | Събития и творчески услуги | Фото и видео | `Фото`, `Видео` → filters | Prototype map proven |
| 43 | Събития и творчески услуги | DJ и музика | Preserve both component intents | Prototype map proven |
| 44 | Събития и творчески услуги | Декорация | Exact visible entry | Prototype map proven |
| 45 | Събития и творчески услуги | Кетъринг | Exact visible entry | Prototype map proven |
| 46 | Събития и творчески услуги | Организация на събития | Exact visible entry; service owner, not Event record owner | Prototype map proven |

`Други професионални услуги` остава form/search fallback, не 47-а visible card. `Авточасти` не е Service: sale → Listing/Automotive; shop → Shop/Firm; installation/repair → Automotive service.

## 5. Public route and Add/Edit owner matrix

### 5.1 Discovery/read routes

| Public task | Target canonical | Current owner / route state | Write owner | Migration test / rollback | Verdict |
| --- | --- | --- | --- | --- | --- |
| Home | `index.html` | Exists; mixed static + runtime owners | Global Add routes only | All links/owners, real content/empty states; restore prior shell manifest | Adapt after Stage 2 freeze |
| Обяви и услуги umbrella | `obyavi.html` | Exists; Listings | Listing form | owner/list/detail/add; restore existing umbrella | Keep owner |
| Услуги | `uslugi.html` | Missing; currently `rabota.html` presents Services | Listing form, offer-only | 46 map + old links; remove new route adapter | P01/P03 |
| Майстори и ремонти | `maistori.html` | Exists; protected composition | Existing Listing/Firm/Q&A owners | protected regression matrix; restore exact route | LOCKED |
| Работа | `rabota.html` | Exists but semantically Services | Listing form, category `Работа` | jobs types + old URL compatibility; revert route group | P02/P03 |
| Имоти | `imoti.html` | Missing; Listing semantics exist | Listing form, category `Имоти` | sell/rent/seek types; remove new read route | P03 |
| Автомобили | `avtomobili.html` | Exists; mixed Listing/Firm/Q&A read | Listing/Firm existing owners | owner separation + links; restore prior page | P03 |
| Купува и продава | `stoki.html` | Missing; Listings owner exists | Listing form | listing taxonomy and old category links; remove route | P03 |
| Животни | `zhivotni.html` | Missing; Listings context | Listing form | category/type/empty; remove route | P03 |
| Магазини | `magazini.html` | Exists; specialized Shops | Shops specialized proposal form | add/moderate/public; restore existing page/controller | Keep owner |
| Заведения | `zavedenia.html` | Exists; Firms category | Firm form | no restaurant datastore; restore existing discovery page | Keep Firms owner |
| Здраве и частни лекари | `zdrave-i-lekari.html` | Exists; Health/Info | Specialized Health form | doctor/dentist/vet; restore existing scripts | Keep owner |
| Фирми | `firmi.html` | Exists; protected Firms | Firm form/edit owners | normal/Admin/mod ownership; restore existing render owner | LOCKED |
| Инфо Лом | `info.html` + specialized pages | Exists; Info owners | Info/Health corrections/submissions | freshness/source/actions; restore exact section owner | Keep authoritative owner |
| Актуално | `aktualno.html` | Missing | No public Add; future Admin publication authoring | Publication/Event separation; remove new composer | P05/P07 |
| Статии | `statii.html` / article detail | Static exists | Future Admin editorial | ready/draft/canonical; retain static fallback | P06 |
| Въпроси | `vaprosi.html` / `vapros.html` | Exists; Q&A | Question/answer owner | public/pending/corrections; restore existing scripts | Keep owner |
| Compatibility categories | `kategorii.html` | Exists; competing legacy IA | Existing owners only | canonical/redirect and every inbound link; restore old serving path | Compatibility only |

### 5.2 Exact public forms and lifecycle gates

| Form / action | Route/controller | Authoritative owner | Table / RPC evidence | Auth and role boundary | Lifecycle / success | Migration requirement | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Add Listing | `dobavi-obqva.html` / `supabase-listings.js` | Listings | `listings`, `media`, listing media/quota RPCs | Login; normal + Moderator-own pending; Admin direct publish and exceptions | normal pending; Admin approved | Preserve quotas, exact prefill, double-submit/error/recovery | `PROVEN IN REPO / LIVE UNVERIFIED` |
| Edit pending/returned Listing | same `?edit=` owner | Listings | `resubmit_own_listing`, media RPCs | Owner only; Admin protected path | pending/resubmitted | Verify RLS and status checks live | `PROVEN IN REPO / LIVE UNVERIFIED` |
| Edit approved Listing | same owner | Listings + edit draft | `save_own_listing_edit_draft`, `user_content_edit_drafts` | Non-Admin draft; Admin direct | Last approved version remains public | Full draft approve/return test | `PROVEN IN REPO / LIVE UNVERIFIED` |
| Add Firm | `dobavi-firma.html` / business owners | Firms | `businesses`, `media` | Login; normal + Moderator-own pending; Admin direct | pending or Admin approved | Preserve protected fields/access/media | `PROVEN IN REPO / LIVE UNVERIFIED` |
| Edit Firm | `dobavi-firma.html?edit=` / `business-edit.js` | Firms | `resubmit_own_business`; edit draft owner | Exact owner; Moderator no Admin privilege | pending/draft or Admin direct | Last approved version + completed success state | `PROVEN IN REPO / LIVE UNVERIFIED` |
| Expanded Firm profile | expanded editor/profile owners | Protected Firms | expanded profile/draft tables + publish/return/save RPCs | `is_expanded`; only Admin grants access | draft/approved/returned; Admin exception | Separate protected parity test | `LOCKED / LIVE UNVERIFIED` |
| Add Question | `nov-vapros.html` / `supabase-content.js` | Questions | `questions` | Login; normal/Moderator-own pending; Admin behavior verified per exact flow | pending; contextual category retained | duplicate/canonical and recovery checks | `PROVEN IN REPO / LIVE UNVERIFIED` |
| Add Answer | `vapros.html` / `supabase-content.js` | Answers | `answers` | Login; tied to exact public question | pending; returns to question | Own-content moderation exclusion | `PROVEN IN REPO / LIVE UNVERIFIED` |
| Q&A correction | profile correction controller | Q&A | update pending/needs_changes in source | Owner only | needs_changes → pending | Preserve note/data; backend role test | `PROVEN IN REPO / LIVE UNVERIFIED` |
| Propose Shop | `magazini.html` / `shops-catalog-v3.js` | Shops | `shops` | Login; pending | pending → staff decision | Keep specialized fields/form, no Firm shortcut | `PROVEN IN JS / LIVE SCHEMA UNVERIFIED` |
| Health add | `zdrave-i-lekari.html` / `health-submissions-v1.js` | Health/Info | `info_submissions`; staff RPCs in source | Login; doctor/dentist/vet | pending; verified public record only after review | No generic Health listing flow | `PROVEN IN JS / LIVE SCHEMA UNVERIFIED` |
| Health correction/error | specialized Health controller | Health/Info | `info_submissions` / `info_error_reports` | Login per current flow; staff review | Does not auto-replace public fact | Source/reliability/history test | `PROVEN IN JS / LIVE SCHEMA UNVERIFIED` |
| Info correction/error | `info-lom-form-ux-v1.js` + Info owners | Info Lom | Info submission/report tables and RPCs | Controlled public/auth flow; staff moderation | pending; traceable correction | Exact record/action/freshness preserved | `PROVEN IN JS / LIVE SCHEMA UNVERIFIED` |
| General report | `signal.html` / validation + reports owner | Reports | `reports` | Exact target context; authenticated insert in repo SQL | pending → staff action | Add dirty guard; preserve target | `PROVEN IN REPO / LIVE UNVERIFIED` |
| Contact | `kontakti.html` / contact owner | Contact messages | `contact_messages` in JS | Public form contract to verify; Admin safe read | submitted / handled contract to verify | Privacy + spam + delete boundary test | `PROVEN IN JS / LIVE SCHEMA UNVERIFIED` |
| Event authoring | no approved public route | Events | `events` table exists | No public Add at launch | Existing records moderated | Do not expose a form | `NO PUBLIC ADD` |
| Article authoring | none proven | Articles | none proven | Admin-only target | lifecycle open | Design before implementation | `BLOCKED` |
| Publication authoring | none | Publications | none | Admin-only target | lifecycle open | New-owner approval required | `BLOCKED` |
| Favorite add/remove | prototype only | Favorites | none proven | Login + own relation target | active/unavailable | Design before implementation | `BLOCKED` |
| Login / register / reset | `vhod.html`, `registracia.html`, password routes | Supabase Auth | Auth APIs; redirect config external | Exact allowed redirects; privacy-safe errors | return to started action | Domain cutover test before DNS switch | `PROVEN IN UI / LIVE CONFIG UNVERIFIED` |

## 6. Protected security gates

### 6.1 Admin-only permanent delete — mandatory STOP gate

Repo evidence:

- `supabase/003-admin-delete-rights.sql` grants `DELETE` on core tables to `authenticated` and states Admin/Moderator;
- `supabase/schema.sql` defines `is_staff()` as `moderator OR admin` and permissive `FOR ALL` staff policies on the same tables;
- several Admin modules issue direct `.delete()` calls;
- this is incompatible with LOCKED Admin-only permanent delete **if the live database matches the repo**;
- adding another permissive Admin DELETE policy is not a fix, because applicable permissive policies combine with OR.

Required sequence:

1. obtain separate owner permission for read-only live grants/RLS/RPC/role audit;
2. record exact live definitions without writes;
3. if conflict is confirmed: mark `STOP`, export/backup, design a narrow patch that separates reversible staff moderation from Admin-only delete, including storage deletion;
4. obtain separate patch approval;
5. test guest/user/Moderator/Admin at UI, JS, RPC/grant and RLS levels;
6. deploy only the narrow security patch with rollback SQL and post-deploy verification.

Live audit checkpoint (Work 2 · 15.09.2026):

- owner разреши read-only проверка; изпълнени са само catalog `SELECT` и Security Advisor reads;
- live RLS е включен за проверените core таблици;
- административните `DELETE`/`ALL` policies са ограничени с `is_admin()`/точна Admin role проверка;
- Moderator има read/update moderation policies, но не е открит hard-delete policy, Storage path или delete-capable RPC bypass;
- user own-delete/media-cleanup flows не са Moderator moderation права и изрично блокират Moderator/Staff според owner контекста;
- repo SQL evidence е по-старо/конфликтно спрямо live и не управлява само по себе си production state.

Current status: **`LIVE LOCKED DELETE CONFLICT NOT CONFIRMED / EMERGENCY STOP NOT TRIGGERED / NO WRITE AUTHORIZATION`**.

Отделни pre-launch hardening findings са записани в `POPITAI_LOM_LIVE_SECURITY_AND_DOMAIN_AUDIT_20260915.md`: mutable function search paths, executable `SECURITY DEFINER` least-privilege review, `listing_monthly_quotas` RLS-without-policy contract и disabled leaked-password protection. Те не се поправят механично и изискват отделен owner-approved security checkpoint.

### 6.2 Protected `Иванов Ремонти` / relevance

Required order is:

`public eligibility → intent/owner fit → relevance → protected priority → owner-native order → secondary signals`.

Every migration that touches Search, Firms, Listings, Services or Masters must prove:

- relevant Construction/provider queries preserve protected first position;
- exact query for another named firm is not hijacked;
- official/safety fact query such as `ВиК авария телефон` stays Info-first;
- unrelated queries do not inject `Иванов Ремонти`;
- Listings preserve Admin → boosted → recency inside the relevant set;
- Firms preserve protected owner-first inside the relevant set;
- Firm ↔ Listings links, expanded profile and ownership remain intact.

Rollback is the exact prior owner adapter/renderer and route set. Protected data are never duplicated, rewritten or deleted as rollback.

## 7. Domain / Auth / SEO / OG cutover gate

### 7.1 Domain decision now; cutover later

Work recommendation: reserve one stable final public domain early, with `popitai-lom.bg` as preferred brand-readable candidate **only after the owner verifies availability, price, registrant requirements and approves the purchase**. A domain must not be called reserved until registrar confirmation exists.

Current required owner action: **choose/confirm the final domain and registrar budget**. DNS is not changed now.

### 7.2 Cutover checklist

Before DNS/production switch, one exact environment sheet must contain:

- old GitHub Pages origin and final `https` origin;
- apex/`www` policy and redirect direction;
- GitHub Pages custom-domain/DNS records and HTTPS state;
- every old → new route redirect;
- canonical, robots, sitemap and structured-data URLs;
- crawler-readable OG URLs and stable public image URLs;
- Supabase Auth `Site URL` and minimal exact allowed redirect URLs;
- confirmation, password-reset and magic-link templates;
- return-to-action for Listing, Firm, Question/Answer, Favorite and correction flows;
- cache invalidation and Facebook re-scrape procedure;
- rollback DNS/config values and TTL plan.

Custom Supabase API domain is optional and not a launch dependency.

## 8. Stage / launch dependency order

1. This control pack is reviewed and accepted as the planning source.
2. Separate read-only live Supabase security audit — completed 15.09.2026; delete conflict not confirmed, emergency `STOP` not triggered.
3. One hybrid icon comparison; no mass leaf series.
4. Stage 2 content-complete/reality pass, including bounded `Пътнически превоз` contract mapping remediation.
5. Independent full desktop/390/accessibility/performance/protected audit.
6. Owner visual acceptance and freeze of exact Stage 2 SHA.
7. Stage 3 one matrix row / one owner / one risk scope at a time.
8. Domain/Auth/SEO/OG controlled cutover.
9. Backup/restore proof, four-role matrix, media/search/URL/unavailable/OG QA.
10. Limited soft launch, monitoring, then owner launch verdict.

## 9. Launch recovery matrix

| Failure | Required proof before launch | Recovery / rollback |
| --- | --- | --- |
| Owner/admin access loss | One Admin; GitHub/Supabase/email 2FA and recovery codes; exact UID inventory | Follow protected owner recovery procedure; never create public elevation path |
| Wrong role capability | Four-role test at UI/API/RLS | Revert narrow policy/RPC deployment; invalidate sessions if required |
| Data corruption/migration error | Timestamped export + restore rehearsal + row counts/checksums | Restore verified snapshot; replay only audited writes |
| `Иванов Ремонти` ownership/ranking loss | Exact owner IDs, relationships and regression queries | Restore prior adapter/config and affected rows from backup |
| Broken old URLs/auth links | Old/new route and redirect manifest | Restore previous DNS/redirect/auth URL configuration |
| Bad OG/private leakage | Crawler fetch fixtures for each status | Disable dynamic adapter, purge cache, serve generic safe fallback |
| Media failure | Storage object/DB relation inventory | Restore DB relation/object version; generic approved fallback |
| Search partial outage | Per-owner timeout/error fixtures | Disable failing adapter; honest partial state; no false empty result |

## 10. Exit criteria for this pack

The control pack is complete as a planning artifact when:

- all 14 checkpoints are present with owner, action, test, rollback, approval and status;
- all 46 Services entries are accounted for exactly once;
- every current/future public Add/Edit owner is classified;
- broad live behavior remains unverified outside the separately completed delete/security catalog scope;
- permanent delete and protected relevance are explicit gates;
- route, domain, auth, SEO, OG and recovery dependencies are ordered;
- no line is interpreted as production permission.

The next executable task after the completed read-only security gate is **not Stage 3**. It is the single hybrid icon comparison from Master §12 step 4; domain purchase and every Supabase/DNS write remain separately blocked.
