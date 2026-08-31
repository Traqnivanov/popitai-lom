# Попитай.Лом — V6-B2 SEARCH / INTENT / RESULT COMPOSITION CONTRACT

Статус: **B2 COMPLETE — DESIGN CONTRACT / NO PRODUCTION CODE**  
Branch: `v6-product-foundation-draft`  
Дата: 31.08.2026

Този документ заключва V6 договора за глобално търсене, intent routing, result composition, no-result поведение, URL/SEO последствия и performance/render ownership граници.

Той **не** променя production, schema/RLS, роли, квоти, moderation, protected owners, protected URL-и или protected Ivanov/Admin/boost semantics.

При конфликт приоритетът е:

`LOCKED rules → approved production specs → V6 Master Control → B1 contract → този B2 contract → supporting drafts`.

---

## 1. B2 РЕШЕНИЕ В ЕДНО ИЗРЕЧЕНИЕ

V6 има **един explicit Search owner**, който превежда свободната заявка към B1 intent/taxonomy, изпълнява само bounded public-read заявки към правилните authoritative owner-и, композира резултатите детерминистично и показва contextual `Попитай Лом` само когато готов отговор действително липсва.

Няма:
- legacy + new паралелни search renderer-и;
- universal search write owner/table;
- all-owner mega-query при всяко натискане на клавиш;
- generic bypass на Health, Shops или Events;
- community мнение, представено като проверен факт;
- cross-owner ranking, който отменя protected Ivanov/Admin/boost приоритет;
- indexable SEO дърво от произволни `?q=`/filter комбинации.

---

## 2. ДОКАЗАН CURRENT BASELINE

B2 стъпва върху A1/A2 и допълнителна source проверка на branch `v6-product-foundation-draft`.

Потвърдено:

1. `tarsene.html` зарежда `script.js`, а **не** `public-search-v1.js`.
2. Активният legacy search в `script.js`:
   - използва static/category records;
   - използва localStorage въпроси/фирми;
   - има construction synonym/stem логика;
   - пази explicit Ivanov construction priority;
   - рендерира директно `#search-results`.
3. `public-search-v1.js` е по-нова DB-backed кандидат реализация, която вече има:
   - minimum query length;
   - debounce;
   - AbortController/cancellation;
   - approved businesses/questions/listings reads;
   - partial failure state;
   - grouped result rendering.
4. `public-search-v1.js` **не е current page owner** и не покрива granular `info_entries`, specialized `shops` и `events` като first-class owner резултати.
5. Current listing presentation пази protected ordering по `is_owner_admin`, `is_boosted`, Admin owner и recency. B2 няма право да го обезсмисля чрез нов глобален score.
6. Info Lom има реален published dataset и специализиран owner; global search не трябва да го свежда само до статичен линк към цяла Info страница.
7. Shops и Events имат собствени public-read/moderation owner-и.
8. Popitai-specific first-party analytics baseline не е доказан; B2 не измисля popularity weights.

Извод: `public-search-v1.js` е **полезна техническа основа за адаптация**, но не е договорът и не трябва да се наслагва върху legacy search. V6 implementation по-късно трябва да остави един owner.

---

## 3. ЕДИН SEARCH OWNER

### 3.1 Target ownership

Концептуалният единствен owner е:

**`PopitaiSearchV6`**

Името е architectural boundary, не задължително бъдещо filename/API име.

Той е единственият owner на:
- global search input semantics;
- `q` URL state;
- normalization;
- synonym/alias expansion;
- intent classification;
- B1 taxonomy mapping;
- query plan към authoritative owner-и;
- cancellation/request sequencing;
- short-lived search cache;
- normalized result envelope;
- result composition/group ordering;
- suggestions;
- `#search-results`;
- `#results-count`;
- loading/partial/error/empty states;
- search analytics hooks.

### 3.2 Render ownership hard rule

Когато V6 се имплементира:

- legacy `script.js` search binding **не** рендерира същите search roots;
- `public-search-v1.js` не остава втори renderer, който „поправя“ legacy render-а след него;
- няма MutationObserver/timer/polling `last renderer wins` решение;
- Home suggestions и full results използват един и същ search core, с различни limits/presentation;
- общият shell не прерисува search резултати.

Това е пряко приложение на `PROJECT_RULES_RENDER_OWNERSHIP.md`.

---

## 4. QUERY NORMALIZATION CONTRACT

### 4.1 Вход

- visible user query се пази в оригиналния си вид за UI;
- normalized query се използва само за matching/routing;
- minimum normalized length: **2 знака**;
- maximum accepted search input: **120 знака**;
- submit с по-кратка заявка не прави remote fan-out.

### 4.2 Lightweight normalization

Target normalization:

1. `String(value || "")`;
2. `toLocaleLowerCase("bg")`;
3. trim;
4. `–`, `—`, `_` → интервал;
5. безопасно премахване на punctuation, като цифрите се запазват;
6. collapse на multiple whitespace;
7. tokenization;
8. detection на action/location phrases;
9. curated synonym/alias expansion.

Не правим по подразбиране:
- aggressive spell correction;
- автоматичен превод;
- AI/LLM call;
- vector/semantic external service;
- пълна автоматична transliteration engine.

### 4.3 Bulgarian/local synonym model

Synonyms са **search aliases**, не нова taxonomy и не нови stored values.

Разрешени lightweight групи:
- разговорни/синонимни: `зъболекар ↔ стоматолог`, `кола ↔ автомобил`, `майстор ↔ ремонт` в правилния контекст;
- съкращения: `ВиК`, `МПС`;
- controlled stems за чести български форми;
- малък curated Latin alias set за реално вероятни local inputs: `remont`, `maistor`, `vik`, `stomatolog`, `apteka`, `rabota`, `imot`, `kola`, `magazin`;
- intent phrases: `търся работа`, `предлага работа`, `под наем`, `за купуване`, `продава`, `майстор за`, `телефон на`, `работно време`.

Забранено е synonym dictionary да:
- смеси `Работа` с `Други услуги`;
- превърне `магазин` в generic Firms write/read owner;
- превърне лекар/аптека в generic marketplace;
- създаде fake Event Add route;
- промени B1 taxonomy само защото дума е популярна.

---

## 5. INTENT CLASSES

Всеки валиден query получава един primary intent и по желание secondary signals.

Target primary intents:

1. **NAVIGATIONAL** — търси конкретна секция/category/owner.
2. **AUTHORITATIVE_FACT** — телефон, адрес, работно време, официална процедура, спешна/проверима местна информация.
3. **TRANSACTIONAL_LISTING** — купува/продава/наема/търси вещ, работа или имот.
4. **PROVIDER_DISCOVERY** — търси майстор, фирма или човек/доставчик на услуга.
5. **SPECIALIZED_DISCOVERY** — магазин, здравен обект/професионалист, събитие или друг specialized owner.
6. **COMMUNITY_OPINION** — препоръка, опит, мнение, „кой е добър“.
7. **GUIDE_PROCESS** — „как да“, процес, обяснение.
8. **MIXED_UNKNOWN** — няма достатъчно силен deterministic signal.

При конфликт intent precedence е:

**safety/official factual → specialized owner → transactional → provider → community opinion → guide → mixed**.

Примери:

- `авария ВиК телефон Лом` → `AUTHORITATIVE_FACT`, не construction provider search;
- `търся ВиК майстор` → `PROVIDER_DISCOVERY / Строителство и ремонти`;
- `кой зъболекар препоръчвате` → Health context + community signal; verified Health се показва отделно преди мненията;
- `търся работа шофьор` → `TRANSACTIONAL_LISTING / Работа`;
- `двустаен под наем` → `TRANSACTIONAL_LISTING / Имоти`.

---

## 6. B1 TAXONOMY → SEARCH INTENT MAPPING

| B1 public category | Search mapping | Authoritative read composition |
|---|---|---|
| Строителство и ремонти | ремонти, майстор, ВиК, електро, покрив, боядисване, дограма, климатик | protected Construction presentation + relevant Firms + approved service Listings; Q&A secondary |
| Здраве и лекари | лекар, стоматолог, аптека, болница, лаборатория, ветеринар | verified Health/Info first; Q&A/opinion secondary |
| Работа | работа, вакансия, работодател, търся работа | protected Listings `Работа` + job listing types |
| Автомобили | кола, МПС, части, сервиз, гуми, диагностика, автомивка, пътна помощ | relevant vehicle/service Listings + Firms |
| Имоти | апартамент, къща, имот, наем, купувам/продавам | protected Listings `Имоти` + property listing types |
| Красота | фризьор, козметика, маникюр, грижа | `Услуги → Красота и грижа` Listings + relevant Firms |
| Дом и градина | мебели, обзавеждане, градина, домашни стоки | Listings; Shops contextual когато intent е магазин |
| Магазини | магазин, супермаркет, строителен магазин, техника | specialized Shops owner |
| Заведения и храна | ресторант, кафе, пицария, храна | Firms owner `Заведения`; Q&A secondary |
| Електроника | телефон, компютър, техника като вещ | Listings; Shops contextual при store intent |
| Деца и бебета | детски/бебешки вещи | Listings; Shops contextual |
| Животни | животни/аксесоари | Listings; veterinarian intent → Health/Info; Shops contextual |
| Мода | дрехи, обувки, аксесоари | Listings; Shops contextual |
| Спорт и хоби | спортни/хоби вещи | Listings; Shops contextual |
| Други услуги | само bounded B1 service leaves | service Listings + relevant Firms |
| Други обяви | generic вещ/друго | protected Listings `Друго` compatibility |

Това е search/presentation mapping. Stored category values и protected owners не се преименуват от B2.

---

## 7. EXACT RESULT FAMILIES

V6 global search има точно тези logical result families:

1. **`route`** — synthetic navigation/category shortcut от local dictionary;
2. **`verified_info`** — published Info/Health record;
3. **`business`** — approved Firms record;
4. **`listing`** — approved, active/unexpired Listing;
5. **`shop`** — approved specialized Shop;
6. **`event`** — approved current/future Event;
7. **`question`** — approved Q&A question/community knowledge entry;
8. **`article`** — V6-ready/approved guide/content record.

Не създаваме отделен search type за:
- answer като самостоятелен top-level result;
- `health_business`;
- `restaurant` owner;
- `service` owner;
- `job` owner;
- `property` owner.

Това са presentation/intent разновидности върху реалните authoritative owner-и.

### 7.1 Normalized in-memory result envelope

Search layer може runtime да нормализира резултат към:

`kind · owner · id · title · summary · url · taxonomyId · leafId? · locality? · verified? · freshness? · ownerPriority? · matchClass · ownerCursor?`

Това **не е schema contract** и не разрешава нова универсална search table.

---

## 8. AUTHORITATIVE OWNER QUERY CONTRACTS

Всички remote reads са public-only, selected-field, bounded и intent-routed.

### 8.1 Route/taxonomy records

Owner: local B1 dictionary/config.  
Network: **0**.

Използва stable V6 taxonomy, compatibility mapping и specialized owner destinations.

### 8.2 Info / Health

Owner: `info_entries` / specialized Health presentation.

Target public read полета:

`id, category, subcategory, entry_type, name, data, publication_status, reliability_status, confirmed_at, confirmed_source`

Hard filters:
- `publication_status = published`;
- mapped category/subcategory/entry type или bounded searchable field match.

Не се прави unbounded client download на всички Info записи за всяко global search.
Не се прави arbitrary JSON mega-search.

**B3** заключва точните searchable fields вътре в `data`, freshness/recheck и reliability ordering.

### 8.3 Firms

Owner: protected `businesses`.

Target public read полета минимум:

`id, owner_id, name, category, description, city, created_at`

Hard filter:
- `status = approved`;
- mapped category и/или bounded text token.

Search layer не дублира hardcoded protected identity в няколко места. Exact shared protected-priority adapter се финализира в B8/V6-D, но B2 заключва, че съществуващият Ivanov/Admin priority не може да бъде понижен.

### 8.4 Listings

Owner: protected `listings`.

Target public read полета:

`id, owner_id, title, category, subcategory, listing_type, description, city, is_urgent, is_highlighted, is_boosted, is_owner_admin, created_at, expires_at`

Hard filters:
- `status = approved`;
- `expires_at IS NULL OR expires_at > now`;
- mapped category/subcategory/type;
- bounded text match.

Protected order remains owner-native:

**Admin/Ivanov protected priority → existing boost semantics → mapped relevance → existing urgency/highlight semantics where applicable → recency → stable tie-break**.

B2 не променя значението на boost/highlight/urgent.

### 8.5 Shops

Owner: specialized `shops`.

Target public read полета:

`id, name, category, phone, address, working_hours, offer, tags, groups, created_at`

Hard filter:
- `status = approved`;
- category/tag/group/name/offer/address bounded match.

Не се изтегля целият shop catalog при всяко query.
Ако current owner няма stable per-shop detail URL, V6 search не измисля fake detail route; резултатът води към Shops owner surface/context. Exact deep-link behavior е B9/V6-D.

### 8.6 Events

Owner: specialized `events`.

Target public read полета:

`id, title, description, location, starts_at`

Hard filters:
- `status = approved`;
- `starts_at IS NULL OR starts_at >= now`;
- bounded token match.

Owner-local default order: най-близко upcoming събитие първо.
Няма fake public Add Event flow.

### 8.7 Questions

Owner: `questions` / Q&A.

Target public read полета:

`id, title, category, description, created_at`

Hard filter:
- `status = approved`;
- mapped category + bounded token match.

B2 не предполага canonical/duplicate state, който още не е договорен; това е B5.

### 8.8 Articles / Guides

Първият V6 search contract допуска само local content registry/catalog от записи със status **реално V6-ready/approved**.

Searchable минимум:

`id/slug, title, summary, taxonomyId, url, readiness`

Фактът, че static article файл съществува, не е достатъчен да го включи. Mutable local facts не се копират от Info в article search index.

---

## 9. QUERY PLANNER / NETWORK BUDGET

### 9.1 Suggestions

- debounce: **250 ms**;
- static route/category match може да се покаже веднага;
- remote owner families: максимум **2** при силно разпознат intent;
- maximum visible suggestions: **6**;
- максимум 3 suggestion резултата от един normal owner, освен ако protected priority изисква първия слот;
- всяка нова заявка отменя старата.

### 9.2 Full result search — Phase 1

При explicit submit / results page:

- local route/taxonomy match;
- максимум **4 remote owner queries concurrent**;
- owner-ите се избират по intent, не всички;
- result groups могат да се показват progressive, без global blocking spinner.

### 9.3 Fallback — Phase 2

Secondary owner-и се добавят само ако първата фаза е недостатъчна за intent-а.

`Shops` и `Events` не участват във всяка generic заявка без reason.

За `MIXED_UNKNOWN` initial bounded plan е:

`Info + Firms + Listings + Questions + local routes`

Specialized Shops/Events могат да се проверят във fallback при подходящ lexical signal или недостиг на резултати.

### 9.4 Result limits

Target initial hard limit:
- до **12 candidate rows на remote owner**;
- първоначално видими до **4 cards на group**;
- `Покажи още` първо използва вече fetched candidates;
- ако са изчерпани, зарежда само следващата page/cursor на конкретния owner;
- няма infinite auto-scroll.

---

## 10. DETERMINISTIC RESULT COMPOSITION

B2 забранява един огромен cross-owner floating score.

Използваме две нива:

1. **intent-driven group order**;
2. **owner-local deterministic order**.

### 10.1 AUTHORITATIVE_FACT

Ред:

1. `Проверена информация`;
2. specialized local entity, ако intent-ът го изисква;
3. `Въпроси и мнения`;
4. V6-ready `Статии и ръководства`;
5. marketplace/entity results само ако са реално релевантни.

### 10.2 PROVIDER_DISCOVERY / Construction

Ред:

1. protected Ivanov/Admin result, когато existing protected construction semantics се задействат;
2. `Фирми`;
3. `Обяви`/service offers;
4. `Въпроси и мнения`;
5. ready guides;
6. Info само като secondary factual context.

### 10.3 TRANSACTIONAL_LISTING

Ред:

1. `Обяви`;
2. contextual `Фирми` само когато B1 owner composition го позволява;
3. Q&A;
4. ready guides.

`Работа` и `Имоти` не получават втори write/read owner само за по-богат резултат.

### 10.4 Магазини

`Магазини → Въпроси и мнения → ready guides`.

### 10.5 Заведения

`Фирми / Заведения → Въпроси и мнения → ready guides`.

### 10.6 Събития

`Събития → Въпроси и мнения → релевантна проверена Info информация`, когато тя е factual context за място/институция.

### 10.7 COMMUNITY_OPINION

Ако query е за Health/official/safety-sensitive local topic:

`релевантна проверена информация → Въпроси и мнения → entity/marketplace context → guides`.

Иначе:

`Въпроси и мнения → релевантни entities/listings → guides`.

### 10.8 GUIDE_PROCESS

`ready Article → authoritative Info backbone → Q&A → related entities`.

---

## 11. OWNER-LOCAL RANKING

### 11.1 Normal owner tuple

Когато няма protected special semantics:

1. exact title/name match;
2. exact alias/leaf/category match;
3. all meaningful query tokens present;
4. Lom/locality signal;
5. owner-native freshness/date;
6. stable deterministic tie-break.

### 11.2 Protected marketplace tuple

Search orchestration не пренарежда protected owner резултатите чрез generic score.

За Listings/Construction се пази:

1. existing Admin/Ivanov priority;
2. existing boost semantics;
3. mapped search relevance;
4. existing urgent/highlight semantics, когато owner contract ги използва;
5. recency;
6. stable tie-break.

### 11.3 Protected global override boundary

Ivanov-first behavior се пази за **реален construction/provider intent**, например:

- `шпакловка майстор`;
- `ремонт баня`;
- `бояджия`.

Но не се използва да измести authoritative Info при заявка като:

- `ВиК авария телефон`;
- `телефон на водоснабдяване`.

Така пазим protected business priority, без да повреждаме factual/safety intent.

Exact shared protected ranking implementation и tie semantics се доуточняват в B8/V6-D.

---

## 12. VERIFIED INFO VS COMMUNITY OPINION

Search UI не смесва trust класове визуално.

Target group labels:

- **Проверена информация**
- **Фирми**
- **Обяви**
- **Магазини**
- **Събития**
- **Въпроси и мнения**
- **Статии и ръководства**

Правила:

- Q&A никога не получава verified badge само защото има отговор;
- verified Info не се понижава под community answer при factual Health/official query;
- `confirmed_at`, source и reliability се показват само според B3 contract;
- article не се представя като authoritative source за mutable local факт, ако фактът принадлежи на Info owner;
- search result card винаги показва content type достатъчно ясно.

---

## 13. LOCAL RELEVANCE

Лом е implicit local context на продукта, но B2 не измисля GPS/radius/geocoding система.

Local signal може да използва само реално налични owner полета:
- `city`;
- `address`;
- `location`;
- name/title;
- service/category context.

Local relevance:
- помага да се изместят явно нерелевантни записи;
- не отменя protected Admin/Ivanov/boost semantics;
- не създава етническо, квартално или друго чувствително segmentation ranking правило;
- не изисква Google Maps.

---

## 14. NO-RESULT → CONTEXTUAL `ПОПИТАЙ ЛОМ`

### 14.1 Кога е истински no-result

Empty state се показва само ако едновременно:

1. query е валиден;
2. required Phase 1 owner queries са приключили;
3. необходимият fallback за intent-а е приключил;
4. няма usable резултат;
5. няма unresolved owner failure, който може да е скрил резултат.

Partial failure **не е** no-result.

### 14.2 Primary empty CTA

Target primary CTA:

**`Попитай Лом`**

Copy target:

`Не намерихме готов отговор за „<query>“. Попитай хората в Лом.`

Logical context, който трябва да се пренесе към Ask flow:
- original visible query;
- mapped B1 taxonomy category;
- optional leaf;
- detected intent;
- `source = search-no-result`.

B2 не твърди, че current `nov-vapros.html` приема всички тези параметри. Exact URL/prefill contract е B9.

### 14.3 Secondary empty actions

Може да има:
- `Разгледай <релевантна категория>`;
- owner-aware `Добави`, **само ако има реален B1 flow**.

Hard boundaries:
- Health → specialized submission, не generic listing/firm;
- Shops → specialized shop flow;
- Events → **няма fake Добави събитие**;
- Jobs/Property/Services → protected Listings flow;
- Firms → firm add flow само когато task-ът е постоянен local provider profile.

---

## 15. FAILURE / LOADING / CANCEL STATES

Exact state model:

- `idle` — няма валидна заявка;
- `too_short` — под 2 normalized chars;
- `loading` — required plan се изпълнява;
- `partial` — част от owner-ите са върнали резултати, друг owner е failed/timed out;
- `success` — usable резултати;
- `empty` — истински no-result според §14;
- `offline` — network unavailable;
- `error` — required search не може да даде безопасен резултат;
- `cancelled` — internal stale request state, не user-facing error.

При partial:
- успешните групи остават видими;
- показва се кратко предупреждение;
- не се твърди „няма резултати“;
- retry за failed owner не презарежда всички успешни owner-и.

---

## 16. DEBOUNCE / CANCELLATION / TIMEOUT

- suggestions: **250 ms debounce**;
- explicit form submit: без излишен debounce;
- нов query abort-ва предишните in-flight search requests;
- освен `AbortController`, има monotonically increasing request/sequence guard против stale render;
- owner soft timeout target: около **5 секунди**, без да блокира вече успешните groups;
- timeout се класифицира като partial/error, не като no-result.

Exact implementation timeout може да се измери и коригира във V6-D/F, но не се допуска безкрайно чакане.

---

## 17. CACHE CONTRACT

### Static

- B1 taxonomy/synonym/config dictionary: normal versioned static asset cache.

### Dynamic search

Първа V6 реализация:
- **in-memory cache only**;
- key: normalized query + relevant taxonomy/intent/filter context;
- target TTL: **90 секунди**;
- target maximum: **30 query keys**;
- partial/error result не се записва като authoritative successful no-result;
- no persistent localStorage search-history cache по подразбиране.

Причина: low complexity, нисък privacy риск и лесен rollback.

---

## 18. PAGINATION / `ПОКАЖИ ОЩЕ`

- първо се показват до 4 card-а от group;
- `Покажи още` е explicit action;
- action-ът е owner-specific;
- не рестартира всички query owner-и;
- page/cursor е owner-native;
- next fetch target е до 12 rows;
- няма automatic infinite scroll;
- result count не твърди global total, ако owner query не е count query.

UI може да казва например `Покажи още`, без измислен „още 137“ count.

---

## 19. URL / HISTORY CONTRACT

### 19.1 Global search

Canonical search state остава:

`tarsene.html?q=<encoded query>`

Rules:
- URL се обновява при submit / explicit filter action, не при всеки keystroke;
- Back/Forward възстановява query state и използва cache или безопасно rerun;
- празен `q` не създава indexable content state.

### 19.2 Future allowed filter params

V6-D/E може да формализира bounded params като:

`category=<stable-v6-id>`  
`group=<result-family>`  
`intent=<bounded-value>`  
`page=<bounded-value>`

Stored DB labels не стават автоматично public SEO taxonomy.

---

## 20. SEO / CANONICAL CONTRACT

### Internal search pages

`tarsene.html?q=...` и arbitrary filtered states:
- target: **`noindex,follow`**;
- не влизат в sitemap;
- не стават canonical category pages;
- не генерират хиляди crawlable parameter combinations.

### Filtered category states

`q`, `intent`, `sort`, `page`, temporary filters:
- не създават ново SEO дърво;
- canonical сочи към stable B1 owner/category landing, когато такъв canonical surface съществува;
- иначе към canonical unfiltered owner page според V6-D/E.

### SEO authority

SEO authority остава при:
- stable B1 category/owner hubs;
- approved detail URLs;
- Info authoritative pages/records според B3;
- V6-ready article pages;
- canonical Q&A след B5.

B2 не променя protected detail URLs и не връща `kategorii.html` като второ canonical marketplace дърво.

---

## 21. ANALYTICS CONTRACT — FUTURE, НЕ CURRENT BASELINE

A2 не доказа Popitai-specific first-party analytics source. Следователно тези events са **target contract**, не твърдение, че се събират днес.

Минимални useful events:

- `search_submit`;
- `search_results_view`;
- `search_suggestion_click`;
- `search_result_click`;
- `search_show_more`;
- `search_no_result`;
- `search_partial_failure`;
- `search_ask_click`;
- `search_filter_change`.

Safe payload dimensions:
- detected intent;
- B1 taxonomy id;
- source surface (`home`, `marketplace`, `search-page`);
- result group/type/owner;
- visible result count bucket;
- clicked group/position.

### Privacy rule

Raw free-text query **не се изпраща в analytics по подразбиране**.

Ако по-късно искаме content-gap dataset с raw queries, това изисква отделен contract за privacy, retention, access и чувствителни данни.

Search → Ask prefill може да носи original query към user-controlled question form, защото потребителят съзнателно избира `Попитай`.

---

## 22. MOBILE / PERFORMANCE BUDGET

### 22.1 Runtime

Default:
- vanilla HTML/CSS/JS;
- no framework за search;
- no Elasticsearch/vector DB само за V6-B2;
- no AI API при всяко search;
- no external search SDK;
- no polling.

### 22.2 JS size target

Incremental V6 search-specific JS target:

**≤ 18 KB gzip**.

Ако реалният implementation надхвърли **25 KB gzip**, изисква explicit performance review и доказателство защо по-лек вариант не е достатъчен.

Това е design budget, не измерване на текущ файл.

### 22.3 Network budget

- suggestions: max 2 remote owner families;
- full Phase 1: max 4 concurrent remote owner queries;
- selected fields only;
- initial remote candidate limit 12/owner;
- Phase 2 on demand;
- Show More owner-specific.

### 22.4 Rendering

- text-first result cards;
- image не е required за полезен result;
- optional media е lazy;
- progressive groups;
- no layout shift от късно появяващи се giant cards;
- дълги групи не рендерират стотици DOM nodes наведнъж.

### 22.5 Accessibility/mobile

- `aria-live="polite"` за result status;
- keyboard navigation за suggestions;
- Escape затваря suggestions;
- visible focus;
- touch targets минимум около 44px;
- няма horizontal overflow;
- error/empty state не разчита само на цвят.

---

## 23. SECURITY / DATA VISIBILITY

Search V6 е public read orchestrator, не permission bypass.

Hard rules:
- RLS остава authoritative security boundary;
- frontend все пак филтрира само public/approved/published/current states;
- pending/rejected/needs_changes/draft/expired content не влиза в public results;
- не се select-ват private e-mail, internal moderation notes, secrets или ненужни owner данни;
- няма service-role key/client secret;
- няма write от search owner;
- `Попитай`/`Добави` винаги прехвърля към реалния owner flow.

---

## 24. ACCEPTANCE CASES

B2 contract трябва да даде deterministic поведение минимум за:

### A. `зъболекар в Лом`
- Health/Info verified records first;
- relevant community questions below;
- generic business/listing не заобикаля Health owner.

### B. `кой зъболекар препоръчвате`
- verified Health context clearly separated;
- Q&A/opinions prominent but never labeled verified.

### C. `шпакловка майстор`
- Construction/provider intent;
- existing protected Ivanov/Admin semantics preserved;
- firms/service listings after protected priority;
- no generic Info takeover.

### D. `ВиК авария телефон`
- authoritative Info/utility intent first;
- construction protected promotion не изпреварва аварийния factual answer.

### E. `търся работа шофьор`
- Listings `Работа` + job types;
- `Други услуги` не се смесва.

### F. `двустаен под наем`
- Listings `Имоти` property intent;
- няма нов property owner.

### G. `мебелен магазин`
- specialized Shops first;
- generic business result не bypass-ва Shops owner.

### H. `ресторант`
- Firms `Заведения` owner;
- няма invented restaurant table.

### I. `събития този уикенд`
- approved current/future Events;
- няма fake Add Event CTA.

### J. Непозната заявка без резултати
- bounded fallback;
- чак тогава contextual `Попитай Лом`;
- query/category context се запазва логически.

### K. Един owner fail-ва
- успешните групи остават;
- partial warning;
- не се показва false no-result.

---

## 25. DEFERRED / OWNED BY NEXT STAGES

### B3 — Info Source / Freshness / SEO / Search

B3 трябва да заключи:
- DB vs hardcoded authoritative source;
- exact searchable Info fields;
- reliability semantics;
- freshness/recheck windows;
- stale display/search behavior;
- Info canonical/detail/share/SEO.

### B5 — Q&A canonical memory

B5 определя duplicate/canonical/alias matching и как canonical Q&A се ранква след approved moderation.

### B8 — Local/protected ranking detail

B8 финализира shared protected priority adapter, owner-local tie rules и local relevance без да нарушава вече locked B2 принципа:

**Search orchestration никога не понижава protected Ivanov/Admin/boost semantics.**

### B9 — exact interaction contracts

B9 определя exact Ask/Add URLs, params, prefill, back/error/success states.

### V6-D

V6-D определя exact indexes/RPC/search query implementation, pagination mechanics, cache implementation, timeout implementation и SEO rendering mechanism.

---

## 26. B2 EXIT GATE — COMPLETE

B2 exit gate е изпълнен, защото вече има:

- един explicit Search owner;
- lightweight normalization/synonym contract;
- B1 taxonomy → intent map;
- exact result families;
- authoritative owner query boundaries;
- verified Info vs community separation;
- deterministic group + owner-local ranking;
- protected Ivanov/Admin/boost-safe boundary;
- bounded query planner;
- no-result → contextual Ask contract;
- debounce/cancel/pagination/cache/failure states;
- URL/canonical/SEO policy;
- future analytics contract без измислен baseline;
- mobile/performance/render ownership budget;
- ясни deferrals към B3/B5/B8/B9/V6-D.

Production impact: **NONE**.

Не са променяни:
- production UI;
- schema/RLS;
- roles;
- quotas;
- moderation;
- protected owners;
- protected ranking;
- production URLs;
- Admin/Moderator logic.

---

## 27. EXACT NEXT TASK

# `STAGE V6-B3 — INFO SOURCE / FRESHNESS / SEO / SEARCH CONTRACT`

Required artifact:

**`PUBLIC_PRODUCT_V6_B3_INFO_SOURCE_FRESHNESS_SEO_SEARCH_CONTRACT.md`**

B3 трябва да заключи:
- authoritative source за всяка Info category/subcategory;
- DB vs hardcoded граница;
- ownership на mutable local facts;
- publication/reliability semantics;
- freshness/recheck windows по data type;
- stale state и public/search поведение;
- correction/provenance contract;
- exact searchable fields за global Search V6;
- canonical/detail/SEO/share contract за Info;
- без schema/RLS/production implementation.

B3 не преотваря B1 или B2, освен при доказан blocker.
