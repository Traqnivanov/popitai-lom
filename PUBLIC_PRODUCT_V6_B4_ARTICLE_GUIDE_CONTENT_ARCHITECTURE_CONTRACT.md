# Попитай.Лом — V6-B4 ARTICLE / GUIDE CONTENT ARCHITECTURE CONTRACT

Статус: **B4 COMPLETE — DESIGN CONTRACT / NO PRODUCTION CODE**  
Branch: `v6-product-foundation-draft`  
Дата: 31.08.2026

Този документ заключва ролята, readiness, source/freshness, Search V6, SEO, internal linking и share архитектурата за `Статии / Ръководства` във V6.

Той стъпва върху:
- LOCKED project rules;
- `PUBLIC_PRODUCT_V6_B1_FINAL_IA_TAXONOMY_CONTRACT.md`;
- `PUBLIC_PRODUCT_V6_B1_HEALTH_PRESENTATION_PARITY_CLARIFICATION.md`;
- `PUBLIC_PRODUCT_V6_B2_SEARCH_INTENT_RESULT_CONTRACT.md`;
- `PUBLIC_PRODUCT_V6_B3_INFO_SOURCE_FRESHNESS_SEO_SEARCH_CONTRACT.md`;
- `PUBLIC_PRODUCT_V6_CONTENT_INVENTORY_RULE.md`;
- `PUBLIC_PRODUCT_V6_CONTENT_SEO_STRATEGY.md`;
- `PUBLIC_PRODUCT_V6_INFO_LOM_CORE_STRATEGY.md`;
- A2 evidence.

При конфликт:

**LOCKED rules → approved production specs → V6 Master Control → B1/B2/B3 → този B4 contract → supporting drafts.**

Production impact: **NONE**.

---

## 1. B4 РЕШЕНИЕ В ЕДНО ИЗРЕЧЕНИЕ

**Article/Guide обяснява задача, процес, избор или контекст; не става втори owner на mutable local facts, не замества verified Info, не замества Q&A и влиза в Search/SEO само след доказан readiness gate.**

---

## 2. CURRENT EVIDENCE / ЗАЩО B4 Е НУЖЕН

Current source доказва:
- `statii.html` показва една реална article card;
- `statia.html` съдържа реална, но кратка статия `Как да избереш майстор и да избегнеш неприятни изненади`;
- current article има H1 и полезна основа, но общ meta description, без развит topic cluster, owner relations, source/freshness layer и V6 internal linking;
- A2 status за нея е `ЗА ПРЕРАБОТКА`, не `ПРОВЕРЕНО ГОТОВО`;
- `Как се пенсионира човек` е `РАЗРАБОТВАНО`, с `Инфо Лом → Институции → НОИ` като authoritative local backbone;
- current content inventory rule изрично казва `има файл` ≠ `проверено готово`;
- B3 вече забранява Article да стане втори owner на mutable Info facts.

Следователно V6 не може просто да индексира всички HTML файлове като готови articles.

---

## 3. EXACT ROLE: ARTICLE VS INFO VS Q&A VS ENTITY

### 3.1 Article / Guide

Article/Guide отговаря основно на:
- `Как да...`;
- `Какво трябва...`;
- `Как да избера...`;
- `Какви са стъпките...`;
- `Какво да проверя преди...`;
- `Какво да направя при...`;
- `Как да се подготвя за...`.

Той държи:
- обяснение;
- последователност;
- checklist;
- критерии за избор;
- контекст;
- общи рискове и важни уточнения;
- връзки към правилните authoritative owners.

### 3.2 Info Lom / Health

Info държи:
- текущ телефон;
- текущ адрес;
- работно/приемно време;
- текуща институция/служба;
- verified local contact;
- текущ official URL/action;
- freshness/reliability/provenance.

Article **не копира тези mutable факти като собствена истина**.

### 3.3 Q&A

Q&A държи:
- community experience;
- мнение;
- препоръка;
- конкретен реален въпрос;
- отговори на хората;
- contextual memory.

Article не представя community мнение като verified факт.

### 3.4 Firms / Listings / Shops / Events / other entities

Техните owners държат собствените записи.

Article може да обясни как да избереш фирма/майстор/услуга, но:
- не копира профилите в article body като собствен dataset;
- не създава скрита класация;
- не bypass-ва owner ranking/moderation;
- не превръща временно listing съдържание в evergreen факт.

---

## 4. ARTICLE TYPES — TARGET V6

V6 допуска ограничен набор полезни editorial types.

### A. Evergreen practical guide

Пример:
`Как да избереш майстор и да избегнеш неприятни изненади`.

Фокус:
- критерии;
- подготовка;
- checklist;
- типични грешки.

### B. Local process guide

Пример:
`Как се пенсионира човек и къде се подава в Лом`.

Фокус:
- процесът е в guide-а;
- местният контакт/прием е от Info owner-а;
- official source links са ясни.

### C. Decision / comparison guide

Пример:
`Как да избереш автосервиз`.

Допуска се само когато:
- има реални критерии;
- няма измислено `най-добрите`;
- конкретни entities идват от правилния owner/discovery layer.

### D. Seasonal / deadline guide

Пример:
- записване за детска градина;
- сезонна подготовка;
- гуми;
- отоплителен сезон.

Тези guides имат по-строг freshness/expiry behavior.

### E. Local utility explainer

Допустим само когато има стойност над самата Info справка.

Ако потребителят има нужда само от телефон/адрес/работно време, правилният owner е Info, не article.

---

## 5. КАКВО НЕ Е ARTICLE

Не създаваме article, когато страницата е всъщност:
- една Info карта с разтеглен текст;
- списък на Firms, който трябва да е discovery page;
- списък на Listings;
- един community въпрос;
- event detail;
- shop catalog;
- keyword landing без реална стойност;
- автоматично генерирана комбинация `услуга + Лом`;
- копие на друг guide с различен title;
- `Top 10` без методология и доказани сигнали.

---

## 6. ONE INTENT → ONE CANONICAL GUIDE

За един основен guide intent има един canonical editorial owner.

Пример:
- `как се пенсионира човек`;
- `документи за пенсиониране`;
- `как се подава пенсия`.

Не се създават три thin articles само за различни keywords.

Допустими са:
- synonyms;
- aliases;
- internal anchor sections;
- search synonyms;
- redirect/canonical mapping.

Exact alias storage е V6-D/B5/B6 implementation concern, не B4 schema решение.

---

## 7. ARTICLE READINESS STATE CONTRACT

B4 приема canonical inventory statuses:

- `ТРЯБВА ДА ИМА`;
- `РАЗРАБОТВАНО`;
- `ИМА ОСНОВА В INFO/OWNER`;
- `ИМА ФАЙЛ / НЕПРОВЕРЕНО`;
- `ПРОВЕРЕНО ГОТОВО`;
- `ЗА ПРЕРАБОТКА`;
- `НЕ Е НУЖНО`.

### Search/SEO publication rule

Само **`ПРОВЕРЕНО ГОТОВО`** може по подразбиране да бъде:
- V6 Search `article` result;
- featured на Home;
- featured в category context;
- включено в article sitemap/SEO discovery;
- разпространявано като официален V6 editorial share asset.

Файлът сам по себе си не дава eligibility.

---

## 8. `ПРОВЕРЕНО ГОТОВО` — HARD QUALITY GATE

Article получава този статус само ако са проверени всички приложими точки.

### 8.1 User value

Трябва да решава реална задача, не само да съдържа думи за Google.

### 8.2 Complete answer

Трябва да има достатъчно съдържание за обещанието на title/H1.

### 8.3 Source truth

Фактическите твърдения имат надеждна основа.

### 8.4 Mutable owner boundary

Mutable local facts сочат към authoritative owner, вместо да живеят независимо в article copy.

### 8.5 Local value

Когато темата е local, има реален Lom layer чрез Info/entity/context links.

### 8.6 Safety / high-stakes

Health/legal/financial/administrative guides:
- не измислят expert authority;
- не дават неподкрепени категорични твърдения;
- ясно разграничават общо обяснение от official/professional decision;
- при high-risk current facts водят към official/verified owner/source.

### 8.7 SEO

Проверени:
- unique title;
- H1;
- description;
- canonical;
- crawlability decision;
- breadcrumbs;
- no cannibalization.

### 8.8 Internal links

Има само полезни related links към правилните owners.

### 8.9 Mobile/accessibility

Article е четим, headings са логични, links/actions са usable.

### 8.10 Performance

Няма ненужен framework, heavy embed, autoplay media или third-party SDK.

### 8.11 Freshness

Има review class и реално `last reviewed/updated` значение, когато е необходимо.

### 8.12 Share

Canonical URL и preview не обещават нещо различно от самото съдържание.

Ако една критична точка липсва → article не е `ПРОВЕРЕНО ГОТОВО`.

---

## 9. SOURCE / EVIDENCE CONTRACT

### 9.1 Source priority

За factual/process claims:
1. official primary source;
2. authoritative institutional source;
3. strong specialist/reference source;
4. secondary source само при ясно qualification и когато primary не е наличен.

### 9.2 Не измисляме sources

Няма placeholder source, fake citation или `по данни от...` без реална проверка.

### 9.3 Source list vs local owner

External official source доказва процеса.

Info Lom/Health owner държи local current facts.

Пример:
`Пенсиониране`:
- НОИ official guidance = process source;
- Info Lom НОИ Лом = local contact/action owner.

---

## 10. AUTHOR / EDITORIAL OWNERSHIP

Article трябва да има честен editorial owner.

Допустимо:
- `Попитай.Лом — редакционен екип`, ако реално е редакционно поддържано от проекта;
- реален named author, ако има разрешение и attribution е вярно.

Забранено:
- измислен лекар/юрист/експерт;
- фиктивна редакция;
- invented credentials;
- `медицински прегледано` без реален reviewer.

Public byline и вътрешен moderation/editorial audit могат да бъдат различни concepts; exact storage е V6-D.

---

## 11. MUTABLE FACT BOUNDARY — HARD RULE

Article body може да каже:

`В Лом виж актуалния контакт и прием на НОИ в Инфо Лом.`

Article body **не трябва** ръчно да копира същия телефон/работно време като втора независима истина.

### Допустим target presentation

Article може да показва small live/derived Info card, ако:
- source owner остава `info_entries`;
- data се render-ва от authoritative owner;
- card показва freshness/trust semantics;
- article не записва собствен duplicate snapshot като truth.

Exact implementation е V6-D.

### Owner failure

Ако authoritative owner не може да се зареди:
- article остава четим като guide;
- mutable fact card не се заменя с stale hardcoded fallback;
- показва се безопасен link/neutral state към official source, когато е наличен.

---

## 12. ARTICLE FRESHNESS CLASSES

Article freshness е отделна от Info field freshness.

### `E365 — evergreen editorial`

Тип:
- общи критерии;
- checklist;
- стабилен educational content.

Target max editorial review: **365 дни**.

### `P180 — stable process`

Тип:
- процес с умерена вероятност за промяна.

Target max review: **180 дни**.

### `P90 — administrative / regulatory process`

Тип:
- документи;
- институционални процедури;
- административни стъпки.

Target max review: **90 дни**.

### `S30 — seasonal / deadline-sensitive`

Тип:
- прием;
- срокове;
- сезонни условия.

Target review: **преди сезона/кампанията и максимум 30 дни в активния период**.

### `V7 — volatile / urgent`

Ако основната стойност се променя в рамките на дни, по подразбиране това **не трябва да е evergreen article owner**.

Текущият volatile факт живее в Info/Event/official owner. Guide може да обясни как да действа човекът, но не държи live стойността.

---

## 13. ARTICLE FRESH / DUE / STALE BEHAVIOR

### Fresh

- Search eligible, ако readiness е `ПРОВЕРЕНО ГОТОВО`;
- normal SEO/share;
- може да бъде featured.

### Due

- article може да остане public при low-risk evergreen content;
- не се маркира фалшиво като `актуализиран`, ако няма реален review;
- влиза в editorial review queue conceptually.

### Stale

За high-risk/admin/seasonal article:
- не се feature-ва;
- не се предлага като definitive Search V6 answer;
- share pack не използва potentially stale claim;
- може временно да бъде excluded от article search registry до review;
- canonical URL не се hard-delete-ва автоматично.

За low-risk evergreen:
- може да остане public с честен review state;
- priority/search eligibility може да бъде намалена до review.

Exact automation/storage е V6-D.

---

## 14. `UPDATED` НЕ Е `REVIEWED`

Target semantics:

- `published_at` = първо public publication;
- `updated_at` = content е редактиран;
- `reviewed_at` = editorial/factual review е реално извършен;
- `sources_checked_at` = приложимите factual sources са проверени.

Тези concepts не трябва да се смесват.

Cosmetic edit не нулира freshness clock.

B4 не налага schema; exact fields са V6-D decision.

---

## 15. ARTICLE PAGE INFORMATION ARCHITECTURE

Target guide page има ясна, lightweight структура.

### Above fold

- breadcrumb;
- category/topic label;
- H1;
- concise promise/summary;
- честен update/review indicator, когато е полезен;
- lightweight share action.

### Body

- кратък отговор/overview;
- стъпки или ясни sections;
- checklist/важни уточнения;
- official/source context;
- local owner cards/links, когато са релевантни.

### End / contextual next actions

В зависимост от intent:
- `Провери в Инфо Лом`;
- `Намери ...` в правилната категория;
- relevant Firms/Profiles;
- related canonical Q&A;
- `Не намери отговор? Попитай Лом`.

Няма generic wall от 20 `related links`.

---

## 16. CATEGORY INTEGRATION

Articles не са отделен остров.

Всеки ready article има B1 category/topic context.

Пример:
- `Как да избереш майстор` → `Строителство и ремонти`;
- `Покупко-продажба на имот` → `Имоти`;
- `Записване на дете` → `Деца и бебета` / Education context;
- health guide → `Здраве и лекари`.

Article card може да се показва contextual в category view като secondary knowledge content.

Не измества primary owner results.

---

## 17. HEALTH CATEGORY / GUIDE PARITY

Потребителското уточнение от B1 companion е LOCKED:

`Здраве и лекари` участва в същия общ V6 category/discovery/share system като останалите категории.

Следователно health guides:
- могат да използват същия Article/Guide shell;
- могат да се показват contextual в Health category;
- могат да участват в Search V6;
- могат да имат share/Facebook distribution;
- могат да бъдат визуално преструктурирани по общия V6 план.

Но:
- verified health data остава Health/Info-owned;
- article не става medical data owner;
- community opinion остава отделно;
- няма unverified medical direct publish;
- no invented expert/medical endorsement.

---

## 18. INTERNAL LINKING CONTRACT

### Article → Info

Когато има local authoritative fact, guide сочи към Info owner.

### Article → Category / entity

Когато следващото действие е `Намери`, води към B1 category/owner.

### Article → Q&A

Показват се само тематично related canonical questions.

### Q&A → Article

Canonical Q&A може да сочи към guide, ако guide дава по-пълно process explanation.

### Info → Article

Info detail/category може да сочи към guide, когато човекът има нужда не само от контакт, а и от обяснение.

### No circular spam

Internal links са task-oriented, не SEO ornament.

Exact relationship storage е B6/V6-D concern.

---

## 19. SEARCH V6 ARTICLE ELIGIBILITY

B2 `article` result family остава.

Article може да бъде Search V6 candidate само ако:
- status = `ПРОВЕРЕНО ГОТОВО`;
- public/canonical;
- не е expired/stale high-risk;
- query matches title/summary/topic/curated aliases;
- content owner не е superseded от по-точен owner за текущия intent.

### Intent ordering

#### `GUIDE_PROCESS`
Article може да бъде primary result group.

Пример:
`как се сменя адрес` → guide first, linked Info second.

#### `AUTHORITATIVE_FACT`
Verified Info е first.

Пример:
`община Лом телефон` → Info first, article само ако помага за процеса.

#### `COMMUNITY_OPINION`
Q&A е first, article secondary.

#### `PROVIDER_DISCOVERY`
Firms/Listings/owner results са first, article secondary.

Article никога не получава `verified_info` badge.

---

## 20. SEARCHABLE ARTICLE FIELDS — CONCEPTUAL WHITELIST

Search layer може да използва само public editorial metadata/content excerpts, например:
- title;
- short summary;
- category/topic;
- curated aliases;
- approved headings/keywords derived from real content;
- canonical URL.

Не използва:
- internal notes;
- draft text;
- rejected content;
- private author/editor notes;
- unpublished source research;
- arbitrary hidden metadata.

Exact storage/indexing е V6-D.

---

## 21. SEO CONTRACT

### 21.1 Canonical

Всеки ready guide има един stable canonical URL.

### 21.2 Title / H1

Unique и съответстващи на реалния intent.

### 21.3 Description

Описва реалната полза, не generic `Полезна статия...`.

### 21.4 No query/filter SEO tree

Search params, filters и aliases не създават нови crawlable articles.

### 21.5 Sitemap

Само public `ПРОВЕРЕНО ГОТОВО` canonical guides.

### 21.6 Thin prevention

Страница без достатъчна standalone стойност не получава canonical SEO article само за keyword.

### 21.7 Structured data

Използва се само подходящ schema type и само за реалното съдържание.

Не се добавя fake rating/review/author expertise.

---

## 22. SEO CANNIBALIZATION RULES

### Guide vs Info

- `НОИ Лом телефон` → Info canonical intent;
- `как се пенсионира човек` → Guide canonical intent.

### Guide vs category

- `майстори Лом` → Construction/category/discovery owner;
- `как да избера майстор` → Guide.

### Guide vs Q&A

- generic reusable process → Guide;
- конкретен community experience question → Q&A.

### Guide vs entity

- entity name/contact → entity/Info/Firm;
- selection/process → Guide.

Не се прави втори article само защото keyword tool показва близка формулировка.

---

## 23. SHARE / FACEBOOK CONTRACT

Ready guides участват в общия V6 share/distribution layer.

Минимално:
- `Сподели`;
- `Копирай линк`;
- Facebook share action, когато е подходящо;
- canonical URL;
- server-readable OG title/description/image target в later V6-D implementation.

### Share text

Share summary:
- не съдържа stale mutable fact, ако той се управлява от Info;
- не подвежда с sensational claim;
- не обещава `официално`, ако article е editorial guide;
- връща към canonical Popitai URL.

### Facebook Bridge

B7 ще заключи exact mechanics.

B4 заключва, че Articles/Guides са first-class share assets в същия distribution ecosystem като Health/categories/Q&A/entities.

---

## 24. NO DUPLICATE MUTABLE FACT IN SOCIAL PREVIEW

Пример:

Неправилно OG description:
`НОИ Лом работи до 17:30, телефон X...`
ако тези стойности са mutable Info-owned.

Правилно:
`Стъпки и документи за пенсиониране + актуален местен контакт в Инфо Лом.`

Така Facebook cached preview не става stale second database.

---

## 25. INITIAL CONTENT INVENTORY PRIORITIES

Няма доказан first-party analytics baseline, следователно редът е editorial/utility default, не claim за popularity.

### Priority A — already evidenced

1. `Как да избереш майстор и да избегнеш неприятни изненади`
   - current: `ЗА ПРЕРАБОТКА`;
   - target owner context: Construction + Firms/Listings/Q&A;
   - action: expand to V6 quality gate, not auto-publish as ready.

2. `Как се пенсионира човек`
   - current: `РАЗРАБОТВАНО`;
   - backbone: official НОИ + Info Lom НОИ record;
   - target: local process guide.

### Priority B — required utility guides

3. `Подмяна на лична карта`
   - status: `ТРЯБВА ДА ИМА`;
   - backbone: official Police/Institutions.

4. `Смяна на адрес`
   - status: `ТРЯБВА ДА ИМА`;
   - backbone: Municipality/Institutions.

5. `Записване на дете в детска градина/училище`
   - status: `ТРЯБВА ДА ИМА`;
   - backbone: Education + Municipality.

6. `Покупко-продажба на имот`
   - status: `ТРЯБВА ДА ИМА`;
   - backbone: cadastral/property-registry institutions + Property category.

7. `Как се подава сигнал към община/институция`
   - status: `ТРЯБВА ДА ИМА`;
   - backbone: Institutions.

8. `Какво да направиш при спиране на ток/вода`
   - status: `ТРЯБВА ДА ИМА`;
   - backbone: Utilities/official actions;
   - volatile current outage facts не живеят в guide.

### Expansion rule

Следващите topics се определят по:
- real Search V6 no-result/search-gap signals, когато analytics съществува;
- repeated canonical Q&A themes;
- Info coverage gaps;
- seasonal needs;
- real local supply;
- editorial utility.

Не се измисля `най-търсено`, преди да има данни.

---

## 26. TOP / LIST / COMPARISON CONTENT

Допустими formats:
- `Полезни места за...`;
- `Как да избереш...`;
- `Какво да сравниш...`;
- `Възможности в Лом за...`.

Недопустимо без evidence:
- `Най-добрите...`;
- `Топ 10...` като скрита реклама;
- ranking по лична редакционна симпатия;
- fake recommendation counts.

Future rankings трябва да стъпват на B6/B8 approved relation/ranking contract.

---

## 27. ARTICLE → COMMERCIAL OWNER BOUNDARY

Article не може да бъде прикрит sponsor placement.

Ако по-късно има sponsored editorial placement:
- трябва да е ясно обозначено;
- не влияе на protected organic owner ranking;
- има отделен approval/business contract.

B4 не въвежда sponsored articles.

---

## 28. EDITORIAL CORRECTION CONTRACT

Ако article има factual грешка:
- корекцията се прави в article owner/editorial source;
- ако грешният факт е Info-owned, корекцията се подава към Info flow;
- не се поправя само article copy и да се оставя authoritative owner грешен;
- significant correction може да обнови `updated_at`, а factual re-review — `reviewed_at`/source-check semantics.

Exact moderation/history implementation е V6-D.

---

## 29. ARTICLE RETIRE / MERGE CONTRACT

Article не се изтрива без причина, ако има canonical value/backlinks.

При duplicate/outdated guide:
- избира се canonical winner;
- полезното unique content се merge-ва editorially;
- old URL target е redirect/canonical strategy;
- search registry изключва loser-а;
- няма два active canonical guides за същия intent.

Exact redirect implementation е V6-D.

---

## 30. PERFORMANCE CONTRACT

Articles трябва да са най-леките content surfaces.

Default:
- semantic HTML;
- existing lightweight public shell;
- no article framework;
- no heavy search SDK;
- no Facebook SDK само за share;
- images optimized/lazy below fold;
- no autoplay video;
- external embeds only when clearly justified;
- related content loaded bounded/lazy;
- no all-owner data payload.

Article page трябва да е usable дори ако secondary related-owner requests fail.

---

## 31. ACCESSIBILITY / MOBILE CONTRACT

- readable line length;
- logical H1 → H2 → H3;
- real links/buttons;
- keyboard accessible share/actions;
- skip-link/public shell preserved;
- tap targets usable;
- no horizontal scroll;
- important content не е скрит само в hover;
- source/update labels четими и не разчитат само на цвят.

---

## 32. ANALYTICS — FUTURE SEMANTICS ONLY

B4 не твърди, че current Popitai analytics събира article events.

Future useful events могат да включват:
- `article_view`;
- `article_source_click`;
- `article_owner_link_click`;
- `article_related_question_click`;
- `article_ask_click`;
- `article_share`;
- `article_copy_link`;
- `article_complete` с privacy-safe threshold semantics.

Не изпращаме article reader free text или sensitive health query content като analytics payload по подразбиране.

Exact analytics implementation/privacy е later V6-D/F.

---

## 33. B4 CONCEPTUAL ARTICLE ENVELOPE — NOT A SCHEMA

За V6 orchestration е полезно conceptually article да има:
- stable id;
- canonical slug/url;
- title;
- summary;
- B1 category/topic;
- readiness/publication state;
- editorial owner/byline;
- published date;
- meaningful updated/reviewed semantics;
- freshness class;
- source references;
- curated aliases;
- relation targets към Info/entity/Q&A;
- Search eligibility;
- share metadata.

Това **не е B4 schema migration**.

V6-D решава дали/как тези concepts живеят в static registry, DB, build metadata или hybrid content pipeline.

---

## 34. STORAGE / CMS DECISION — DEFERRED

B4 не избира CMS и не създава нов table.

Current static article може да бъде миграционна основа.

Target requirements са:
- един canonical editorial owner;
- един readiness registry;
- safe metadata за Search/SEO/share;
- revision/freshness truth;
- lightweight delivery.

Implementation choice се прави във V6-D след product contracts.

---

## 35. NO PRODUCTION IMPLEMENTATION IN B4

B4 **не променя**:
- `statii.html`;
- `statia.html`;
- current production routes;
- Supabase schema/RLS;
- Admin/Moderator permissions;
- Search JS;
- Info records;
- protected ranking;
- Facebook integration;
- current health UI.

Всичко тук е design contract.

---

## 36. B4 EXIT GATE — PASSED

B4 е complete, когато е заключено, че:

1. Article има exact role срещу Info/Q&A/entities;
2. `има файл` не означава ready;
3. само `ПРОВЕРЕНО ГОТОВО` е Search/SEO/feature eligible;
4. mutable local facts остават при authoritative owner;
5. author/source/review/freshness semantics са честни;
6. canonical SEO intent не се дублира;
7. internal linking е task-oriented;
8. health guides са част от общия V6 shell/share model, без да губят specialized owner;
9. Facebook/share preview не става stale second truth owner;
10. initial inventory има explicit statuses, без invented analytics claims;
11. storage/schema implementation е отложено за V6-D.

**B4 exit gate: PASSED.**

---

## 37. EXACT NEXT TASK

# `STAGE V6-B5 — Q&A CANONICAL / DUPLICATE / ALIAS / MODERATION CONTRACT`

Следващият stage трябва да заключи:
- canonical question identity;
- duplicate detection flow;
- aliases/alternate phrasings;
- merge/redirect/non-destructive history;
- topic/category relations;
- verified Info vs community answer boundary;
- accepted/best answer semantics без fake authority;
- moderation/self-content boundaries;
- stale/old Q&A behavior;
- Search V6 Q&A eligibility;
- canonical Q&A SEO/share/Facebook behavior;
- contextual `Попитай Лом` prefill semantics;
- no schema/RLS/production implementation.

Suggested artifact:

`PUBLIC_PRODUCT_V6_B5_QA_CANONICAL_DUPLICATE_ALIAS_MODERATION_CONTRACT.md`

Production impact after B4: **NONE**.
