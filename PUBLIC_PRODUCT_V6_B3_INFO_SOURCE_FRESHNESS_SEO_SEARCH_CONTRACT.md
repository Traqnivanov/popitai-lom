# Попитай.Лом — V6-B3 INFO SOURCE / FRESHNESS / SEO / SEARCH CONTRACT

Статус: **B3 COMPLETE — DESIGN CONTRACT / NO PRODUCTION CODE**  
Branch: `v6-product-foundation-draft`  
Дата: 31.08.2026

Този документ заключва authoritative source, freshness, reliability, correction/provenance, Search V6 и SEO/share договора за `Инфо Лом`.

Той **не** променя production, schema/RLS, роли, Admin/Moderator права, текущите Info записи, public renderer-и или production URL-и.

При конфликт приоритетът е:

`LOCKED rules → approved production specs → V6 Master Control → B1 → B2 → този B3 contract → supporting drafts`.

---

## 1. B3 РЕШЕНИЕ В ЕДНО ИЗРЕЧЕНИЕ

Всеки изменяем местен факт в `Инфо Лом` има **един authoritative data owner — публикувания Info dataset**, докато JavaScript/HTML държат само presentation/config; public visibility, trust, freshness, correction, Search V6 и SEO използват една и съща source/provenance истина и никога не представят stale/community/hardcoded стойност като прясно проверен факт.

---

## 2. ЗАЩО B3 Е НЕОБХОДИМ

A2 и B3 source inspection доказват едновременно две истини:

1. `Инфо Лом` вече има реален structured owner:
   - `info_entries`;
   - `publication_status`;
   - `reliability_status`;
   - `confirmed_at`;
   - `confirmed_source`;
   - `confirmation_note`;
   - `info_entry_history`;
   - controlled submissions/error reports;
   - Admin/Moderator review flows.
2. Current public source-of-truth е смесен:
   - Health е основно DB-driven;
   - generic Info renderer също чете published `info_entries`;
   - Banks държи реални офиси/ATM адреси/телефони/работно време в JS;
   - Transport държи автогара/БДЖ/такси/разписания и контакти в JS;
   - Education държи училища/детски градини/читалища/контакти в JS;
   - Utilities е hybrid;
   - Institutions има исторически layered renderer debt.

Това означава, че добрият specialized UX може да остане, но **mutable local data не може да има едновременно DB и hardcoded production истина**.

---

## 3. AUTHORITATIVE OWNER CONTRACT

### 3.1 Един owner за mutable Info facts

Target authoritative owner за изменяемите местни факти е:

**`info_entries` + контролираният Info moderation/provenance flow.**

Това не означава един универсален renderer. Различните Info страници могат да имат specialized presentation owner-и, но всички четат една и съща authoritative data истина.

### 3.2 `info_actions`

`info_actions` остава подходящ owner за контролирани публични action links, когато действието е част от Info flow, например:
- официална услуга;
- външна официална справка;
- публичен формуляр;
- полезен директен target.

Mutable phone/address/hours не се местят в action label само за да се избегне `info_entries`.

### 3.3 Какво може да е hardcoded

Разрешено в HTML/JS/CSS presentation/config:
- section labels;
- icon mapping;
- generic explanatory copy;
- card layout;
- category/subcategory order;
- field labels;
- empty/error copy;
- static accessibility text;
- stable route mapping;
- generic CTA labels;
- non-factual UI rules.

### 3.4 Какво НЕ може да е authoritative hardcoded data

Следните стойности са mutable local facts и target owner е `info_entries`/approved Info source, не JS constant:
- телефон;
- адрес;
- e-mail;
- работно време;
- приемно време;
- директор/служебно лице;
- текуща специалност/услуга;
- НЗОК/друга operational availability;
- 24/7 status;
- ATM deposit capability;
- hospital intake instruction;
- текущо разписание/час на тръгване;
- текущ route/service availability;
- operational note;
- current official URL, когато е част от конкретния запис;
- текущо име/статус на обект;
- временни/сезонни условия.

Ако същата стойност е в DB и JS, **DB/Info owner е target truth**; hardcoded copy е migration debt, не втори валиден owner.

---

## 4. CATEGORY / SUBCATEGORY SOURCE MATRIX

### 4.1 Здраве

Authoritative owner:
- `info_entries.category = zdrave`;
- specialized Health submission/correction flow;
- published Health records.

Subcategories:
- болница/лечебни заведения;
- лекари;
- аптеки;
- стоматолози;
- ветеринари;
- ветеринарни аптеки;
- лаборатории/диагностика.

Target rule:
- specialized Health renderer може да derivе doctor/dentist/vet cards;
- reliability може да скрива unsafe address/field;
- generic Firms/Listings не стават health truth owner;
- community Q&A остава opinion/experience layer.

### 4.2 Институции

Authoritative owner:
- published `info_entries.category = institucii`;
- `info_actions` за контролирани official actions/links.

Mutable facts:
- адрес;
- централа/телефони;
- e-mail;
- приемно време;
- служебни лица;
- административни услуги;
- official links.

Presentation groups като `Община`, `Полиция`, `Държавни`, `Социални`, `Спешни` могат да са config, но записите и контактите не са hardcoded truth.

### 4.3 Транспорт

Authoritative owner:
- published `info_entries.category = transport`;
- official external timetable/live links чрез entry fields или controlled `info_actions`.

Subcategories:
- автобуси/автогара;
- ЖП/БДЖ;
- таксита.

Mutable facts:
- адрес на гара/автогара;
- телефони;
- каса/работно време;
- текущи линии/часове;
- taxi phone;
- operational route notes.

#### Разписания

Предпочитан target:
1. official live/timetable source е primary current truth;
2. Popitai може да показва verified local snapshot само ако има ясна `confirmed_at`/source provenance;
3. snapshot винаги показва, че разписанието може да се промени;
4. stale snapshot не се представя като текущо разписание;
5. hardcoded departure times не са authoritative owner.

### 4.4 Образование и култура

Authoritative owner:
- published `info_entries.category = obrazovanie`.

Subcategories:
- училища;
- детски градини;
- читалища;
- библиотека;
- музей;
- школи/курсове.

Mutable facts:
- директор;
- телефон;
- e-mail;
- адрес;
- работно време;
- текущи дейности/обучение;
- official URL.

Исторически факти могат да бъдат по-нисковолатилни, но когато се показват като verified local content, пак трябва да имат provenance, а не да съществуват само в renderer JS.

### 4.5 Банки и банкомати

Authoritative owner:
- published `info_entries.category = banki`.

Subcategories:
- банкови офиси;
- банкомати.

Mutable facts:
- адрес;
- телефон;
- работно време;
- 24/7;
- внасяне/депозитна функция;
- наличие/брой устройства, ако се твърди публично;
- official network URL;
- operational note.

Specialized Bank renderer може да запази филтри, tabs, визуална тема и card UX, но не държи arrays с authoritative offices/ATMs.

### 4.6 Комунални и ежедневни услуги

Authoritative owner:
- published `info_entries.category = komunalni`;
- `info_actions` за official self-service/live actions.

Subcategories могат да включват:
- ВиК;
- електроенергия;
- чистота/отпадъци;
- интернет/TV;
- куриери;
- други approved local utility groups.

Разрешено hardcoded:
- generic card `Вода и ВиК`, `Електроенергия`, `Чистота`;
- icon/description на типа услуга.

Забранено hardcoded authoritative:
- аварийни телефони;
- office contacts;
- outage status;
- current service hours;
- operational instructions, които могат да се променят.

---

## 5. PUBLICATION SEMANTICS

Current status vocabulary:
- `published`;
- `review`;
- `hidden`.

Target meaning:

### `published`
Записът е разрешен за public read. Това **не означава автоматично**, че всяко негово поле е current/high-confidence.

### `review`
Не е нормален public search/result record. Изисква екипна проверка преди публично factual използване.

### `hidden`
Не се показва публично и не участва в Search V6 public results.

### Hard rule

`publication_status` управлява **visibility**, а `reliability_status` управлява **trust/presentation/ranking**.

Двете не се сливат в един флаг.

---

## 6. RELIABILITY SEMANTICS

Current vocabulary:
- `official`;
- `strong`;
- `secondary`;
- `conflict`;
- `unverified`.

### `official`
- потвърдено от official/primary source;
- eligible за най-силен verified presentation;
- не отменя freshness проверката.

### `strong`
- достатъчно надеждно потвърдено от силен/съгласуван source set;
- eligible за verified presentation;
- не отменя freshness проверката.

### `secondary`
- има полезен secondary source, но липсва достатъчно силно primary confirmation;
- може да бъде публично само ако е полезно и ясно маркирано;
- не получава `Официално`/силен verified claim;
- не трябва да е top factual answer пред fresh official/strong record.

### `conflict`
- източниците се разминават;
- conflicting field не се представя като сигурен факт;
- record identity може да остане публична, ако е полезна;
- Search V6 не използва спорната стойност като answer snippet;
- public UI показва ясно разминаването/нуждата от проверка.

### `unverified`
- липсва надеждно потвърждение;
- target default: не е first-class factual Search V6 answer;
- не получава verified presentation;
- нов unverified content не трябва да се публикува автоматично.

---

## 7. RELIABILITY ≠ FRESHNESS

Запис може да е:
- `official`, но стар;
- `strong`, но стар;
- `secondary`, но току-що проверен secondary source;
- `conflict`, независимо от датата.

Следователно Search/UI винаги разглеждат две оси:

**trust class + freshness class.**

`official` не означава „актуално завинаги“.

---

## 8. FRESHNESS MODEL

### 8.1 Freshness е field-risk model

Различните факти остаряват с различна скорост. Един общ 90-дневен срок за всичко е забранен.

B3 заключва следните максимални recheck windows:

| Class | Тип факт | Max recheck window |
|---|---|---:|
| F1 — Live/volatile | разписания, временни часове, outage/temporary availability, текуща operational промяна | 7 дни |
| F2 — Operational | телефони, работно/приемно време, emergency/intake instructions, 24/7/ATM capability | 30 дни |
| F3 — Organizational | e-mail, директор/служебно лице, услуги, специалност, official URL, организационни контакти | 90 дни |
| F4 — Stable directory | име на обект, постоянен адрес, parent organization, тип/категория | 180 дни |
| F5 — Historical/stable context | основан през, исторически/описателен факт без operational consequence | 365 дни |

Това са **maximum default windows**, не обещание, че фактът е вярно валиден до последния ден.

При известна промяна recheck се прави веднага.

### 8.2 Critical source override

Ако official source изрично показва `valid until`, сезонен режим, временен график или дата на промяна, тази дата има предимство пред default window.

### 8.3 Mixed entry rule

Current model има entry-level `confirmed_at`, не доказан field-level timestamp за всеки JSON key.

До V6-D technical design:
- freshness на entry се изчислява по **най-волатилния публично използван mutable field**;
- не се приема, че стар operational phone е fresh само защото статичният адрес е потвърден някога;
- ако по-късно е нужен field-level confirmation model, schema/index/RLS решението е V6-D задача.

---

## 9. FRESH / DUE / STALE DERIVED STATES

Не се изисква нова DB колона в B3. Състоянието може концептуално да се derive-ва от `confirmed_at` + applicable freshness class.

### `fresh`
`age <= maxWindow`

Поведение:
- normal public display;
- normal eligible Search V6 ranking според reliability/intent;
- `Последно потвърдено` остава видимо където е полезно.

### `due`
`maxWindow < age <= 2 × maxWindow`

Поведение:
- записът не се изтрива;
- показва се `Нужда от повторна проверка`/еквивалентен trust cue;
- operational exact fields могат да бъдат visually de-emphasized;
- Search V6 demote-ва спрямо fresh equivalent;
- official link остава preferred next action, когато съществува.

### `stale`
`age > 2 × maxWindow`

Поведение:
- record identity може да остане discoverable, ако е полезна;
- exact volatile/operational field не се представя като текущ verified answer;
- Search V6 не използва stale critical field като featured factual snippet;
- при health/emergency/transport operational intent stale стойността може да бъде suppressed и заменена с official-source action;
- public record показва ясно, че данните чакат повторна проверка.

### No silent auto-delete

Freshness сама по себе си не hard-delete-ва и не променя publication status автоматично.

Permanent delete остава Admin-only според LOCKED rules.

---

## 10. SPECIAL HIGH-RISK BEHAVIOR

### Emergency / hospital / health operational facts

За:
- спешен телефон;
- прием;
- operational hospital instruction;
- current doctor availability;
- health contact with safety consequence;

stale/conflict value не се показва като сигурен direct answer.

### Transport schedules

Stale local copied timetable:
- не се представя като `Актуално разписание`;
- official timetable/live source е primary action;
- old snapshot може да остане само с ясно stale warning, ако има реална потребителска стойност.

### Utilities outages

Current outage/status не се превръща в evergreen Info field. Това е live/volatile state и изисква official/live source или изрично time-bounded record.

---

## 11. `confirmed_at` CONTRACT

### 11.1 Какво означава

`confirmed_at` означава:

**моментът, в който публичната factual стойност е реално проверена срещу посочения source/evidence.**

### 11.2 Какво НЕ означава

Не означава:
- последен CSS/UI edit;
- последно отваряне в Admin;
- промяна на label;
- пренареждане на секция;
- всяка техническа редакция;
- автоматично `updated_at`.

### 11.3 Current implementation risk

Current Admin entry edit path обновява `confirmed_at` при save на entry edit.

B3 заключва target semantics:

**cosmetic/structural edit не може мълчаливо да refresh-не factual freshness.**

Точният технически начин за разделяне на edit/reconfirmation се решава във V6-D. B3 не прави production промяна.

---

## 12. SOURCE / PROVENANCE CONTRACT

За public factual confirmation трябва да могат да се възстановят минимум:
- кой entry е променен;
- кое field е променено;
- old value;
- new value;
- кой е извършил промяната;
- кога;
- reason;
- source/evidence.

Current `info_entry_history` е правилната посока и се запазва.

### Source quality

`confirmed_source` не трябва да е декоративен текст `Проверено`.

Той трябва да сочи/описва реалния evidence source достатъчно ясно за екипна проверка.

### Multiple-source conflict

Когато източниците се разминават:
- не се избира произволно по-удобната стойност;
- reliability става `conflict`, ако несигурността е material;
- спорното поле не се представя като verified;
- history/provenance пази причината.

---

## 13. CORRECTION FLOW

### User proposal

Нов факт/корекция:
- влиза през specialized Info/Health proposal/error flow;
- не се публикува автоматично;
- не заобикаля owner-а чрез generic listing/firm form.

### Admin/Moderator

Запазват LOCKED границата:
- Moderator може да обработва разрешени Info предложения/сигнали;
- Moderator не прави permanent delete;
- system/schema/RLS остава Admin-only;
- self-moderation restrictions остават;
- actions трябва да са traceable.

### Apply correction

При factual correction:
1. target entry се идентифицира;
2. field се идентифицира;
3. old/new value се виждат;
4. source е задължителен за factual update;
5. history се записва;
6. confirmed freshness се refresh-ва само ако evidence реално потвърждава applicable public fact.

---

## 14. SEARCH V6 — INFO RESULT FAMILY

B2 вече заключва result family:

`verified_info`

B3 уточнява нейния source contract.

### Eligibility

Global Search V6 може да връща Info entry само ако:
- `publication_status = published`;
- public visibility rules са изпълнени;
- не се използва admin/private/history content;
- reliability/freshness presentation е коректна.

### Primary ranking classes

За factual/local utility intent:
1. fresh `official`;
2. fresh `strong`;
3. due `official/strong` с warning;
4. `secondary`, когато няма по-силен answer и е ясно маркиран;
5. `conflict`/stale identity only, без спорния field като answer;
6. community content е отделна group/family, не fallback masquerading като verified Info.

Този ред е trust contract, не popularity score.

---

## 15. EXACT SEARCHABLE INFO FIELDS

Search V6 не прави recursive full-text върху целия JSON `data` и не индексира admin/provenance noise.

### Tier A — primary searchable
- `name`;
- public category label;
- public subcategory label;
- public entry type label;
- aliases/normalized public name, ако има approved mapping;
- `data.specialty`;
- `data.practice_name`;
- `data.services`;
- `data.activities` / `data.activity`;
- `data.parent_organization`;
- safe public `data.address` / `data.location`.

### Tier B — exact/supporting match
- safe public phone digits;
- public e-mail;
- official/public URL host/name;
- work/reception semantic tokens (`работно време`, `прием`, `телефон`, `адрес`) чрез Search synonym/intent mapping, а не чрез индексиране на arbitrary notes.

### Tier C — display-only / not general search index
- `confirmed_source`;
- `confirmation_note`;
- `audit_note`;
- internal notes;
- history;
- old conflicting values;
- submitter/reviewer IDs;
- moderation notes;
- private/provenance metadata.

### Unsafe-field rule

Ако reliability logic определя адрес/phone/field като unsafe/conflicting, то не се използва като searchable snippet само защото physical value съществува в JSON.

---

## 16. SEARCH RESULT DISPLAY CONTRACT

Info result card/snippet показва само достатъчно:
- type label;
- name;
- най-релевантния safe factual field;
- `Последно потвърдено` или freshness cue, когато е material;
- trust label, когато различава official/secondary/conflict;
- canonical target.

Не показва целия Info запис в search result.

### Example — factual

Query: `община лом телефон`

Target result:
- `Община Лом`;
- safe current phone;
- `Последно потвърдено`;
- official/strong trust cue;
- link към canonical Info context.

### Example — conflict

Query: `лекар X адрес`

Ако address е conflict:
- record може да се намери;
- exact conflicting address не се показва като сигурен;
- card казва, че адресът е за повторна проверка;
- user отива към canonical record/context.

---

## 17. BOUNDED INFO SEARCH QUERY

B2 network budget остава валиден.

Info owner query трябва да:
- филтрира `publication_status = published`;
- query-ва само релевантна category/subcategory, когато intent е силен;
- select-ва само нужните public fields;
- има strict result limit;
- не изтегля всички 152+ entries на Home/search keystroke;
- не изтегля history/submissions/admin fields;
- поддържа cancellation/stale request guard чрез Search V6 owner.

Точният SQL/index/RPC shape е V6-D.

---

## 18. INFO PUBLIC PAGE RENDER OWNERSHIP

### Keep specialized UX

B3 **не изисква** всички Info страници да изглеждат еднакво или да използват един renderer.

Разрешено:
- Health renderer;
- Banks renderer;
- Transport renderer;
- Education renderer;
- Institutions renderer;
- Utilities renderer.

### Hard rule

Всеки DOM root има един render owner, а renderer-ът **чете authoritative data**, вместо да притежава второ mutable dataset copy.

### Migration principle

При бъдеща implementation migration:
1. първо доказваме DB coverage на всички visible hardcoded facts;
2. missing facts минават през controlled Info verification/import;
3. renderer се прехвърля към DB-driven data;
4. hardcoded dataset се премахва;
5. визуалното поведение се regression-тества;
6. няма момент, в който два renderer-а се състезават за root-а.

---

## 19. CANONICAL INFO SEO SURFACES

### 19.1 Stable indexable owners

Target canonical Info surfaces остават stable useful pages, включително текущите owner pages:
- `info.html` — Info Lom hub;
- `zdrave.html` / specialized Health entry context;
- `institucii.html`;
- `transport.html`;
- `obrazovanie-kultura.html`;
- `banki.html`;
- `komunalni.html`.

B3 не преименува production URL-и.

### 19.2 Anchors/subsections

`#section` anchors:
- са navigation state;
- не са отделен SEO document;
- canonical е category/detail owner page.

### 19.3 Filters/search params

Info filter/search parameter states:
- не създават автоматично indexable SEO pages;
- следват B2 noindex/search-state principle;
- не създават duplicate keyword trees.

---

## 20. INFO ENTRY DETAIL PAGE ELIGIBILITY

B3 **не задължава** всеки `info_entry` да получи собствен indexable HTML page.

Dedicated detail surface е допустима само ако entry има реална standalone utility:
- уникален local entity/fact owner;
- достатъчно verified content;
- stable identity/permalink;
- clear user task;
- share value;
- не е thin duplicate на category card.

Ако тези условия не са изпълнени:
- canonical owner остава category page + stable section/entry anchor;
- не се създава thin detail page само за SEO.

Точният dynamic detail routing/render mechanism е V6-D/V6-E задача.

---

## 21. SEO CONTENT TRUTH

### Page title/description

SEO copy може да обобщава category purpose, но не трябва да кодира mutable facts като:
- `отворено до 17:00`;
- exact current phone;
- exact current timetable;
- `15 банкомата`;
ако тези стойности не идват от authoritative current data path.

### Structured data

Когато по-късно се добави structured data:
- само published public-safe fields;
- freshness/reliability rules важат;
- stale/conflict field не се маркира като reliable current fact;
- schema type трябва да отговаря на реалния entity type.

### Sitemap

В sitemap влизат stable canonical surfaces, не search/filter states и не автоматично всеки DB row.

---

## 22. SHARE CONTRACT

Info share target трябва да води към canonical public surface, не към ephemeral search state.

Share pack може да съдържа:
- реално име на entity/topic;
- кратък verified-safe description;
- canonical URL;
- optional current field само ако е safe/fresh;
- lightweight OG preview.

### Stale/conflict share

Не се генерира share copy от stale/conflicting operational field като че ли е current.

### Runtime

Не се зарежда Facebook SDK на Info страниците само за share.

Следва V6 lightweight share strategy.

---

## 23. ARTICLES / Q&A BOUNDARY

### Articles

Статията обяснява процеса.

Mutable local fact остава в Info owner и статията:
- линква към него;
- не копира phone/hours/address в собствена evergreen hardcoded версия, освен ако има механизъм за synchronized source ownership, който B3 не въвежда.

### Q&A

Q&A е community experience/opinion.

Ако въпросът е factual и Info има usable answer:
- verified Info се показва първо;
- Q&A е secondary community context;
- отговор в Q&A не overwritе Info record.

---

## 24. FAILURE STATES

### DB/Info owner unavailable

Page/search:
- не fallback-ва към stale hardcoded mirror като „истината“;
- показва controlled unavailable state;
- official external action може да остане, ако е статично безопасен target;
- Search V6 маркира partial failure, не false no-result.

### Renderer error

Не се показват outdated constants само защото DB render е паднал.

### Missing coverage

Ако няма approved Info record:
- показва се честно `Няма публикувана потвърдена информация`;
- може да има proposal/correction action;
- не се създава fake generic record.

---

## 25. PERFORMANCE CONTRACT

Info V6 следва lightweight-by-default:
- page-specific reads;
- exact selected fields;
- bounded limits;
- no all-Info payload on every page;
- no duplicate DB + JS fact payload;
- static presentation assets cacheable;
- below-fold content progressive, когато е нужно;
- Search V6 queries only relevant owner subsets;
- no AI/vector/search SaaS dependency for Info lookup by default.

Премахването на hardcoded duplicate datasets трябва в крайна сметка да **намалява**, не да увеличава payload duplication.

---

## 26. ACCESSIBILITY / MOBILE TRUST

На mobile най-важното е:
1. име;
2. relevant factual answer;
3. direct action;
4. freshness/trust cue;
5. source/detail link;
6. correction action.

Не се скриват critical stale/conflict warnings само за да е по-компактна картата.

`Последно потвърдено` не трябва да бъде дребен декоративен текст, когато freshness е material за решението.

---

## 27. ANALYTICS CONTRACT — INFO

A2 не доказа current first-party baseline. B3 не твърди, че тези събития вече се събират.

Future minimal useful events:
- `info_result_impression`;
- `info_result_open`;
- `info_call_click`;
- `info_official_source_click`;
- `info_correction_start`;
- `info_correction_submit`;
- `info_stale_warning_seen`;
- `info_search_no_usable_fresh_result`.

Не се изпращат:
- private moderation notes;
- raw phone/e-mail като analytics payload, ако не е необходимо;
- user-entered correction text;
- sensitive health query content без отделен privacy review.

Exact analytics provider/schema е по-късна technical задача.

---

## 28. CURRENT DEFECTS / DEBT VS B3 PRODUCT DECISIONS

### Current source debt — proven
- Banks hardcoded mutable facts;
- Transport hardcoded mutable facts;
- Education hardcoded mutable facts;
- Utilities hybrid;
- Institutions has historical renderer layering debt.

Това са implementation/debt facts, не причина B3 да редактира production.

### Current freshness semantic risk — proven from code
Current Admin generic entry edit refresh-ва `confirmed_at` при save.

B3 target semantics казват, че factual reconfirmation трябва да е evidence-based.

Точният production fix не се прави в B3.

### Protected Moderator own-business defect
Остава отделен A2 incident candidate и няма връзка с B3 Info design scope.

---

## 29. WHAT B3 DOES NOT DECIDE

B3 не решава:
- exact DB migration;
- field-level confirmation schema;
- exact SQL indexes;
- generated search column;
- RPC implementation;
- edge/server rendering technology;
- final per-entry URL pattern;
- sitemap generator implementation;
- automatic freshness jobs/cron;
- notification cadence към Admin/Moderator;
- final visual design.

Това са V6-D/V6-C/V6-E dependencies.

---

## 30. IMPLEMENTATION ACCEPTANCE GATE FOR LATER

B3 се счита правилно реализиран само ако по-късно могат да се докажат едновременно:

1. няма mutable Info fact с два competing authoritative owners;
2. Health/Institutions/Transport/Education/Banks/Utilities четат правилния Info source;
3. single-render-owner rule е запазен;
4. `published` е visibility, reliability е trust;
5. stale official не се представя като fresh;
6. conflict field не се показва като сигурен answer;
7. Search V6 не излага hidden/review/private data;
8. Search V6 не индексира arbitrary JSON/admin/history noise;
9. `confirmed_at` се refresh-ва само при реално reconfirmation evidence;
10. corrections са traceable;
11. category/detail canonical няма duplicate parameter tree;
12. no hardcoded stale fallback при owner failure;
13. mobile показва trust/freshness warning;
14. performance остава bounded;
15. protected Admin/Moderator rules не са променени.

---

## 31. CONFIRMED VS TARGET

### Confirmed current evidence
- structured Info owner вече съществува;
- publication/reliability/source/confirmation/history model вече съществува;
- controlled Info submissions/reports/admin flow съществува;
- Health вече е DB-driven в ключовия discovery catalog;
- Banks/Transport/Education имат specialized single renderers, но hardcoded mutable datasets;
- current Admin generic entry edit refresh-ва `confirmed_at`;
- A2 database evidence: 152 published Info records, всички с `confirmed_at` към audit момента.

### Target contract, not current implementation
- all mutable Info facts owned by authoritative Info dataset;
- field-risk freshness windows;
- derived due/stale behavior;
- exact Search V6 safe field whitelist;
- category/detail canonical/share eligibility;
- no hardcoded authoritative fallback;
- reconfirmation semantics separated from generic edit.

---

## 32. B3 EXIT GATE — PASS

B3 exit gate:

**всеки mutable Info факт има един authoritative source, explicit publication/reliability/freshness semantics, deterministic stale/search behavior и canonical SEO owner без hardcoded/DB ambiguity.**

PASS, защото договорът вече заключва:
- owner matrix;
- hardcoded boundary;
- trust semantics;
- freshness classes/windows;
- stale behavior;
- correction/provenance;
- Search V6 field/eligibility contract;
- canonical/detail/SEO/share rules;
- performance/render-ownership constraints;
- deferred technical questions без production implementation.

Production impact: **NONE**.

---

## 33. EXACT NEXT TASK

# `STAGE V6-B4 — ARTICLE / GUIDE CONTENT ARCHITECTURE CONTRACT`

B4 трябва да стъпи върху B1/B2/B3 и да заключи:
- exact role на Articles vs Info vs Q&A;
- article readiness/quality gate;
- evergreen vs mutable local facts;
- topic/guide architecture;
- author/source/freshness/update semantics;
- internal linking към Info/entities/Q&A;
- Search V6 article eligibility;
- canonical/SEO/share structure;
- duplicate/thin-content prevention;
- initial content inventory priorities без измислен analytics baseline;
- no production implementation.

Required artifact:

`PUBLIC_PRODUCT_V6_B4_ARTICLE_GUIDE_CONTENT_ARCHITECTURE_CONTRACT.md`

След B4 се актуализират Master Control, `PROJECT_PROGRESS.md` и `PUBLIC_PRODUCT_V6_NEXT_CHAT_START.md`.