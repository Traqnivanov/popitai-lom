# Попитай.Лом — V6-B8 LOCAL RELEVANCE / RANKING / PROTECTED PRIORITY CONTRACT

Статус: **B8 COMPLETE — DESIGN CONTRACT / NO PRODUCTION CODE**  
Branch: `v6-product-foundation-draft`  
Дата: 31.08.2026

Този документ заключва V6 ranking/composition contract така, че Search/category/entity discovery да е:
- intent-aware;
- owner-aware;
- deterministic;
- local to Lom context;
- freshness/trust-aware;
- protected Admin/Ivanov/boost-safe;
- recommendation-safe;
- explainable;
- lightweight.

Стъпва върху LOCKED rules + B1–B7 + A1/A2 current evidence.

Production impact: **NONE**.

---

## 1. B8 РЕШЕНИЕ В ЕДНО ИЗРЕЧЕНИЕ

**V6 не използва един global popularity score: първо определя intent и допустимите authoritative owner-и, после всеки owner филтрира само релевантни/public/current кандидати и чак вътре в този допустим set прилага protected/native priority, exact relevance, freshness/locality и bounded community signals.**

---

## 2. CURRENT PROTECTED EVIDENCE

### Listings

Current `category-listings-v1.js`:
1. филтрира `status = approved`;
2. филтрира active/unexpired;
3. филтрира category/service group/subcategory/intent/query;
4. query order: `is_owner_admin desc` → `is_boosted desc` → `created_at desc`;
5. client sort additionally пази Admin owner id first → boosted → recency.

Следователно current protected pattern е:

**eligibility/relevance gate → Admin priority → boost → recency.**

### Firms

Current `supabase-businesses.js`:
- public set = approved businesses;
- search/category filter първо ограничава candidates;
- `sortBusinesses()` поставя protected OWNER_ID first among remaining candidates;
- след това използва requested owner-native sort (name/newest).

Следователно B8 НЕ превръща protected priority в „покажи нерелевантен owner result на всяка заявка“.

---

## 3. HARD ORDERING PRINCIPLE

Ranking е cascade, не една магическа числова формула.

Target order:

1. **public/safety eligibility**;
2. **intent/owner eligibility**;
3. **query/category/topic relevance**;
4. **protected owner-native priority where applicable**;
5. **trust/freshness/availability required by owner**;
6. **locality/context relevance**;
7. **bounded owner-specific secondary signals**;
8. **deterministic tie-break**.

Никоя по-ниска стъпка не може да resurrect-не кандидат, отпаднал на по-висока стъпка.

---

## 4. NO UNIVERSAL GLOBAL SCORE

V6 MVP няма formula от типа:

`0.3 text + 0.2 likes + 0.2 recommendations + 0.3 freshness`.

Причини:
- смесва различни trust класове;
- може да счупи protected ranking;
- popularity може да победи factual safety;
- трудно е за regression/обяснение;
- няма доказан first-party analytics baseline;
- малка local dataset база не изисква search engine complexity.

Cross-owner composition е deterministic group order by intent.

Owner-local order е tuple/cascade.

---

## 5. STAGE 0 — PUBLIC / SAFETY ELIGIBILITY

Преди ranking кандидатът трябва да е публично допустим според owner-а.

### Listings
- approved;
- active/unexpired;
- correct owner visibility.

### Firms
- approved/public version.

### Shops
- approved.

### Events
- approved;
- current/future for upcoming discovery unless archive intent is explicit later.

### Info/Health
- published;
- field/result safe under B3 reliability/freshness rules.

### Q&A
- approved;
- canonical/independent, not duplicate alias loser;
- public-safe.

### Articles
- `ПРОВЕРЕНО ГОТОВО`;
- public/canonical;
- not stale high-risk.

Pending/rejected/hidden/private content never enters public ranking.

---

## 6. STAGE 1 — INTENT / OWNER ELIGIBILITY

B2 intent classes remain authoritative:
- NAVIGATIONAL;
- AUTHORITATIVE_FACT;
- TRANSACTIONAL_LISTING;
- PROVIDER_DISCOVERY;
- SPECIALIZED_DISCOVERY;
- COMMUNITY_OPINION;
- GUIDE_PROCESS;
- MIXED_UNKNOWN.

A result family that does not answer the task is not promoted by popularity/protection alone.

Example:
`ВиК авария телефон Лом`

Primary owner = verified Info/utility fact.

Construction business protection cannot move a provider above the factual emergency/contact result because provider is different task intent.

---

## 7. STAGE 2 — RELEVANCE GATE

Before protected/native ranking, candidate must satisfy a meaningful relevance gate.

Signals can include:
- exact normalized name/title;
- alias;
- B1 category;
- subcategory/leaf;
- specialty/service/type;
- all meaningful query tokens;
- explicit location qualifier;
- owner-specific tags/groups;
- current query intent.

Protected candidate that is outside the relevant owner/category/query candidate set is not force-injected.

---

## 8. PROTECTED PRIORITY ADAPTER — CORE RULE

Protected priority applies **inside a valid relevant candidate set**.

Search/category orchestration must:
- request/include the owner fields needed to preserve protected semantics;
- not normalize them away;
- not recompute them from UI labels;
- not replace them with recommendation/popularity score;
- keep current owner-native ordering precedence where LOCKED.

---

## 9. LISTINGS PROTECTED TUPLE

For relevant eligible Listings where current protected semantics apply:

1. Admin/owner-admin protected priority;
2. protected `is_boosted` semantics;
3. owner-filtered query/category/type relevance already satisfied;
4. recency / owner-native current ordering;
5. stable id tie-break.

### Important

Current source does NOT prove `is_urgent` or `is_highlighted` as ranking keys in the audited category listing order.

Therefore B8 does **not invent** a new urgent/highlight rank boost.

They may remain visual/business flags according to existing owner rules. Ranking effect requires separate explicit evidence/approval.

---

## 10. CONSTRUCTION / IVANOV PROTECTED TUPLE

For real Construction/provider intent:

1. candidate must be relevant to Construction/provider task;
2. protected Ivanov/Admin result retains first protected position according to current/LOCKED semantics;
3. remaining relevant owner results follow owner-native/protected ordering;
4. B6 recommendations may enrich/tie-break only after protected boundary;
5. Q&A/Articles remain secondary groups according to B2.

Examples where protected provider semantics apply:
- `ремонт баня`;
- `бояджия Лом`;
- `шпакловка майстор`;
- `ВиК майстор`.

Examples where they do not override factual owner:
- `ВиК авария телефон`;
- `телефон на водоснабдяване`;
- `къде се плаща водата`.

---

## 11. FIRMS OWNER-LOCAL TUPLE

For relevant approved Firms candidates:

1. exact name match when query names an entity;
2. exact category/service/topic match;
3. protected owner-first semantics where current/LOCKED owner contract applies;
4. all meaningful query tokens / strong description-service relevance;
5. Lom/locality consistency;
6. valid B6 recommendation tier as bounded secondary signal;
7. owner-native requested sort/recency when still tied;
8. stable id.

### Protected entity-name exact match

If user explicitly names another firm, exact entity intent must resolve that firm; protected owner-first cannot hijack an explicit navigational entity query.

Example:
`Фирма ABC Лом телефон`

→ exact ABC entity first if it is the intended public entity.

This preserves user intent without weakening protected category/provider semantics.

---

## 12. NAVIGATIONAL INTENT

For NAVIGATIONAL queries:

1. exact route/entity/page match;
2. exact alias;
3. same owner relevant alternatives;
4. secondary related content.

Protected commercial ordering does not replace exact navigation to a specifically named public entity/page.

---

## 13. AUTHORITATIVE FACT GROUP ORDER

For factual/local utility query:

1. `verified_info`;
2. other verified contextual entity if relevant;
3. Q&A/community only as clearly separate secondary context;
4. ready guide if it explains a process;
5. marketplace/provider only when actually related.

Within `verified_info`, see B3/B8 Info tuple.

---

## 14. PROVIDER DISCOVERY GROUP ORDER

General provider intent:

1. appropriate provider/entity owner;
2. relevant Listings/service offers where B1 composition allows;
3. Q&A recommendations/opinions;
4. ready guides;
5. verified Info secondary factual context if helpful.

Construction uses protected Ivanov/Admin adapter from §10.

Health provider discovery remains specialized Health-first, not generic Firms.

---

## 15. TRANSACTIONAL LISTING GROUP ORDER

For sell/buy/offer/seek/job/property transaction:

1. relevant Listings owner;
2. contextual Firms only when B1 explicitly allows;
3. Q&A;
4. ready guides.

Work/Property remain Listings-owned; richer ranking does not create a second owner.

---

## 16. SPECIALIZED DISCOVERY GROUP ORDER

### Shops
1. Shops;
2. relevant Q&A;
3. ready guides.

### Restaurants
1. Firms/Restaurants;
2. Q&A;
3. ready guides.

### Events
1. Events;
2. relevant Q&A;
3. verified contextual Info when needed.

### Health
1. Health/Info provider records;
2. relevant Q&A/community opinion;
3. ready health guides.

---

## 17. COMMUNITY OPINION GROUP ORDER

For clear recommendation/opinion query:

### Normal topic
1. canonical Q&A;
2. relevant entities;
3. ready guides.

### Health/official/safety-sensitive topic
1. relevant verified Info context;
2. canonical Q&A opinions;
3. related entities/guides.

This does not mean the verified Info answers subjective `кой е най-добър`; it provides safe factual context separately.

---

## 18. GUIDE PROCESS GROUP ORDER

1. B4-ready Article/Guide;
2. authoritative Info backbone;
3. canonical Q&A;
4. related entities.

If guide is stale/not ready, it cannot rank merely because title matches.

---

## 19. MIXED / UNKNOWN GROUP COMPOSITION

Use B2 bounded initial owner set and do not invent one global score.

Target initial composition:
- local routes;
- Info;
- Firms;
- Listings;
- Q&A;
with Shops/Events fallback when query signals justify.

Within each group B8 owner tuple applies.

---

## 20. INFO / HEALTH OWNER-LOCAL ELIGIBILITY

B3 rules are prerequisite.

Published alone is not enough for definitive high-risk ranking.

Candidate fields/results may be:
- safe/fresh;
- due but usable with qualification;
- stale/suppressed for high-risk answer snippet;
- conflict/qualified;
- not eligible for definitive verified answer.

Ranking cannot promote unsafe stale value because of text match.

---

## 21. INFO OWNER-LOCAL TUPLE

For factual Info results:

1. exact entity/field/topic intent match;
2. safe result eligibility under B3;
3. reliability class: `official` before `strong` where equally relevant, then qualified lower classes only if B3 permits;
4. freshness: fresh before due; stale high-risk is suppressed from definitive result;
5. exact category/subcategory/type;
6. local/Lom consistency;
7. stable owner id/name tie-break.

A `secondary` exact record can still be discoverable when no stronger source exists if B3 permits, but presentation must not fake official certainty.

---

## 22. HEALTH PROVIDER TUPLE

For provider discovery such as `кардиолог Лом`:

1. exact specialty/type match;
2. provider/entity name match when specified;
3. published/safe reliability/freshness;
4. Lom/locality match;
5. B6 valid topic-specific recommendation presence/tier;
6. B6 valid global unique recommendation tier;
7. stable deterministic tie-break.

### Hard safety boundary

Recommendation count cannot outrank:
- specialty mismatch;
- nonpublic state;
- unsafe conflict/stale required fact;
- explicit named-provider query.

Community popularity does not equal medical authority.

---

## 23. SHOPS OWNER-LOCAL TUPLE

For approved Shops:

1. exact shop name if named;
2. exact category/tag/group match;
3. all meaningful query tokens;
4. Lom/locality consistency;
5. valid B6 recommendation tier;
6. stable deterministic tie-break.

Current catalog creation order is not interpreted as quality score.

No `най-добър магазин` solely from raw count.

---

## 24. RESTAURANTS OWNER-LOCAL TUPLE

Restaurants use Firms owner.

1. exact restaurant name if named;
2. restaurant/category/type relevance;
3. query/service/food-context match using real owner fields only;
4. protected Firms semantics where applicable;
5. local relevance;
6. valid B6 recommendation tier;
7. stable tie-break.

No invented cuisine/rating facets unless owner data actually supports them later.

---

## 25. EVENTS OWNER-LOCAL TUPLE

For approved current/future Events:

1. query/title/topic match;
2. explicit requested date/time window match;
3. upcoming/current availability;
4. nearest upcoming start time;
5. location/Lom relevance;
6. stable event id.

Past event cannot outrank upcoming event for `какво има този уикенд`.

No B6 durable recommendation count applies to Events in initial V6.

---

## 26. Q&A OWNER-LOCAL ELIGIBILITY

Candidate must be:
- approved;
- canonical/independent;
- public-safe;
- topic/query relevant.

Alias wording can match, but returns canonical card.

Pending/rejected/duplicate loser never ranks independently.

---

## 27. Q&A OWNER-LOCAL TUPLE

For community opinion intent:

1. exact canonical/alias intent match;
2. category/topic match;
3. answered canonical before unanswered when relevance is equal;
4. quality/completeness signal from approved answers, not raw unmoderated count;
5. recency only when topic is time-sensitive;
6. stable canonical id/date tie-break.

### Unanswered exact match

May still appear prominently to prevent duplicate question submission, clearly labeled `Без одобрен отговор`.

### No fake answer quality

Raw answer count alone is not objective quality.

`Избран от автора` / `Полезен` signals can be considered later only under B5/B8 bounded semantics and never become factual verification.

---

## 28. Q&A TIME-SENSITIVITY

For evergreen opinion:
- older answered canonical question may remain valuable.

For time-sensitive topic:
- recent relevant approved answers may outrank old equivalent answers;
- current verified Info context is shown first when factual/safety-critical.

No automatic deletion by age.

---

## 29. ARTICLE OWNER-LOCAL TUPLE

Candidate must first pass B4 readiness.

Then:
1. exact guide/process intent match;
2. title/alias/topic match;
3. B1 category relation;
4. local Lom value where appropriate;
5. fresh/reviewed state for its B4 class;
6. completeness/standalone utility gate already passed;
7. stable canonical id/slug.

Draft/stale high-risk article cannot be boosted by clicks/popularity.

---

## 30. B6 RECOMMENDATION SIGNAL IN B8

Recommendation is a **secondary bounded signal**, never primary relevance/trust authority.

Eligible signal:
- valid positive;
- public source;
- public target;
- non-self;
- unique source author;
- resolved target;
- relation not invalidated.

---

## 31. RECOMMENDATION TIERS — NOT LINEAR RAW SCORE

To avoid early local supply/count domination, B8 target uses conceptual capped tiers rather than unbounded `+N` score.

Example conceptual tiers:
- none;
- some valid community support;
- stronger valid community support.

Exact numeric thresholds are V6-D/F calibration after real data exists.

Hard rule:

**100 recommendations cannot make an irrelevant/stale/wrong-type result beat a correct relevant result.**

---

## 32. TOPIC-SPECIFIC RECOMMENDATION > GLOBAL WHEN RELEVANT

If relation context supports a service/topic:

`Firm X recommended for Боядисване`

that is more relevant to `бояджия` tie-break than generic recommendation for unrelated service.

But no topic-specific relation is inferred from mere category unless B6 source context supports it.

---

## 33. FACEBOOK/SOCIAL SIGNALS DO NOT RANK

B7 external shares, Facebook likes/comments/reactions:
- do not directly change Search rank;
- do not become B6 relation count;
- do not create `popular on Facebook` rank.

Future referral traffic analytics can inform editorial/product decisions only after a separate analytics/ranking approval; it does not silently become score.

---

## 34. NO INVENTED POPULARITY BASELINE

A2 did not prove first-party Popitai popularity/search analytics.

B8 therefore forbids launch-time ranking based on invented:
- `най-търсено`;
- `най-кликано`;
- `популярно`;
- `trending`;
- fake view counts.

Initial ordering is deterministic product/owner logic.

---

## 35. LOCAL RELEVANCE — LOM CONTEXT

Popitai.Lom is implicitly local, but B8 MVP does not create GPS/radius/geocoding dependency.

Use only real owner/public fields:
- city;
- address/location text;
- service area if owner-approved;
- category/topic;
- explicit query location.

---

## 36. LOCATION PRECEDENCE

When query contains explicit location qualifier:
1. exact requested locality/context if product supports that owner result;
2. Lom/local context where query remains Lom-centric;
3. unknown locality;
4. clearly conflicting/outside locality last or excluded depending owner scope.

When query has no location:
- Lom/public local entities are preferred;
- unknown locality does not automatically outrank known Lom entity.

No hidden neighborhood/ethnic/sensitive personalization.

---

## 37. NO PERSONALIZED RANKING IN INITIAL V6

Initial V6 ranking does not depend on:
- user identity;
- browsing history;
- political/religious/health profile;
- inferred socioeconomic status;
- private GPS history;
- contacts/friends;
- Facebook profile/social graph.

This keeps ranking predictable, privacy-light and testable.

Future personalization requires separate explicit contract.

---

## 38. STATUS / AVAILABILITY ALWAYS BEATS OLD POPULARITY

Examples:
- expired Listing is excluded even if previously clicked often;
- hidden Firm is excluded even if recommended;
- ended Event does not rank for upcoming intent;
- stale unsafe Info field is not definitive answer;
- non-ready Article is excluded;
- duplicate Q&A alias resolves canonical.

---

## 39. EXACT ENTITY QUERY

If user explicitly names an entity:

`Д-р Иван Петров`
`Магазин X`
`Фирма Y`

exact intended public entity should rank before generic category popularity/protected promotion, unless query itself is ambiguous and exact identity cannot be resolved.

This is NAVIGATIONAL relevance, not a protected-rule override.

---

## 40. EXACT FACT QUERY

If user asks a specific fact:

`община Лом телефон`
`НОИ Лом адрес`

Info exact owner record/field wins.

A popular related Q&A/Article/Firm cannot outrank it.

---

## 41. EXACT TRANSACTION QUERY

`двустаен под наем`
`работа шофьор`
`продавам кола`

Relevant active Listings first.

Provider/article popularity does not replace transactional result owner.

---

## 42. DETERMINISTIC TIE-BREAK

If all meaningful ranking classes tie, use stable deterministic keys.

Preferred:
1. owner-native stable date/name ordering if explicitly defined;
2. normalized name/title ascending where suitable;
3. stable id ascending as final tie-break.

Never use random shuffle in canonical Search results.

Random editorial discovery carousel, if later desired, is separate presentation feature, not B8 ranking.

---

## 43. QUERY-TIME SORT PARAMS

If user explicitly chooses a supported sort (`Най-нови`, `Име` etc.):
- owner eligibility/protected hard rules stay;
- user sort applies only where owner contract allows;
- protected position cannot be silently removed by generic sort if current owner preserves it.

Example current Firms code preserves protected owner even under name sort.

B9 will define visible sort controls.

---

## 44. OWNER FAILURES DO NOT CAUSE FALSE RANKING

If an owner query fails/times out:
- successful groups remain;
- state = partial/error according to B2;
- do not claim surviving group is `най-релевантен overall` if required owner failed;
- no-result is not shown falsely;
- retry failed owner only where possible.

---

## 45. CROSS-OWNER RESULT LIMITS

Reuse B2:
- strong-intent suggestions: max 2 remote owner families;
- full Phase 1: max 4 concurrent owner queries;
- initial remote candidate target: up to 12/owner;
- initially visible: up to 4/group;
- owner-specific `Покажи още`;
- no infinite scroll by default.

B8 sorting operates only over bounded candidate sets.

---

## 46. SEARCH CACHE / RANK STABILITY

Reuse B2 dynamic cache target:
- in-memory;
- ~90 sec TTL;
- max ~30 query keys.

Cache key includes normalized query + intent/category/filter context.

Do not cache partial/error as authoritative empty ranking.

Freshness-sensitive owner can require shorter/no cache later in V6-D if needed.

---

## 47. RANKING EXPLAINABILITY — INTERNAL

Every selected result should be explainable by a small reason stack, e.g.:
- `exact_name`;
- `exact_specialty`;
- `category_match`;
- `protected_admin_priority`;
- `boosted_owner_native`;
- `fresh_official_info`;
- `local_lom`;
- `valid_recommendation_tier`;
- `upcoming_event`;
- `answered_canonical_question`;
- `ready_guide`.

This reason stack is primarily for QA/debugging; public UI shows only user-meaningful labels.

---

## 48. DO NOT EXPOSE INTERNAL PROTECTED LOGIC AS MISLEADING BADGE

Internal reason `protected_admin_priority` does not automatically mean public label `Най-добър` or `Препоръчан`.

Public badges must have their own truthful semantics.

If `boost` later requires sponsored disclosure under product/legal rules, that is separate approved presentation contract; B8 does not invent or hide commercial meaning.

---

## 49. NO NEW PAY-TO-RANK SYSTEM

B8 preserves existing protected `is_boosted` semantics only.

B8 does not create:
- paid top slots;
- sponsored category auctions;
- pay-per-click rank;
- hidden commercial ranking.

Any new paid ranking requires separate explicit approval and disclosure contract.

---

## 50. HOME SHORTCUTS ≠ SEARCH RANKING

B1 first-screen shortcuts are editorial navigation defaults.

They do not mean:
- Construction results always win every search;
- Health is more popular than Cars;
- shortcut order is measured popularity.

Taxonomy/shortcut presentation and Search result ranking are separate systems.

---

## 51. `ОТКРИЙ В ЛОМ` ≠ GLOBAL RANK BOOST

Shops/Restaurants/Events/Firms placement in `Открий в Лом` is discovery IA.

It does not grant universal Search boost.

Search uses intent relevance.

---

## 52. CATEGORY SHELL RANKING

Within a V6 category page:
- primary owner content remains first according to B1;
- secondary Q&A/Articles/Info modules are contextual sections;
- cross-section order follows task, not raw counts;
- common visual shell does not collapse owner-local ranking.

Health can look structurally like other categories while keeping Health trust/ranking rules.

---

## 53. HEALTH CATEGORY EXAMPLE

Query/category:
`Стоматолози`

Primary:
- published relevant Health dentist records.

Within records:
- exact specialty/name if searched;
- safe reliability/freshness;
- locality;
- valid recommendation tier only as secondary.

Secondary:
- Q&A recommendations;
- ready guide.

No generic Firms/Listing takeover.

---

## 54. CONSTRUCTION CATEGORY EXAMPLE

Query:
`боядисване`

Candidate set:
- relevant protected Construction/Firms/service Listings.

Then:
- protected Ivanov/Admin boundary preserved;
- protected boost/native ordering preserved;
- other relevant results;
- Q&A/ready guides secondary.

Recommendation cannot push another result above protected first slot by itself.

---

## 55. FACTUAL UTILITY EXAMPLE

Query:
`ВиК авария телефон`

1. safe/fresh Info utility record/action;
2. relevant verified context;
3. Q&A if useful;
4. provider results secondary only.

Ivanov/Construction protection does not convert this into provider query.

---

## 56. COMMUNITY HEALTH EXAMPLE

Query:
`кой зъболекар препоръчвате`

Composition:
1. safe Health provider context;
2. canonical Q&A with approved community opinions;
3. provider entities enriched with B6 recommendation metadata;
4. ready guide if relevant.

Public UI clearly separates verified provider facts from opinions.

---

## 57. JOB EXAMPLE

Query:
`работа шофьор`

1. active approved Listings category `Работа` matching job intent/title;
2. protected Listings priority inside relevant set if applicable;
3. Q&A/guide secondary.

`rabota.html` Services compatibility does not steal jobs intent.

---

## 58. PROPERTY EXAMPLE

Query:
`двустаен под наем`

1. active approved Property Listings with correct listing type;
2. protected owner-native order inside relevant set;
3. related Q&A/guide.

No new property owner or generic Firm rank.

---

## 59. EVENT EXAMPLE

Query:
`събития този уикенд`

1. approved events inside requested date window;
2. nearest start time;
3. local relevance;
4. related Q&A/Info context.

Past event excluded from upcoming intent.

---

## 60. GUIDE EXAMPLE

Query:
`как се пенсионира човек`

1. B4-ready canonical guide if ready/fresh;
2. verified НОИ Info local backbone;
3. canonical Q&A;
4. related entities.

If guide remains `РАЗРАБОТВАНО`, it is not promoted as ready result; Info/Q&A can serve instead.

---

## 61. REGRESSION TEST MATRIX — REQUIRED BEFORE IMPLEMENTATION

V6-D/F must encode tests for at least:

| Query | Expected primary | Protected/trust assertion |
|---|---|---|
| `ремонт баня` | Construction/provider | protected Ivanov/Admin preserved inside relevant set |
| `бояджия Лом` | Construction/provider | protected first semantics preserved |
| `ВиК авария телефон` | Info | provider protection must not override factual intent |
| `община Лом телефон` | Info | exact fresh/official fact first |
| `кой зъболекар препоръчвате` | Health context + Q&A | opinions separate from verification |
| `кардиолог Лом` | Health provider | specialty/reliability before recommendation count |
| `работа шофьор` | Listings/Jobs | Services not substituted |
| `двустаен под наем` | Listings/Property | correct property type |
| `магазин техника` | Shops | approved category/tag relevance |
| `ресторант X` | exact Firm/Restaurant | exact named entity before generic protected promotion |
| `събития този уикенд` | Events | upcoming/date-window first |
| `как се пенсионира човек` | ready Guide if ready | draft article excluded; Info fallback |
| exact duplicate Q wording | canonical Q&A | alias not independent result |
| exact named firm | named Firm | navigational exact entity wins |

---

## 62. PROTECTED REGRESSION TESTS

Before any Search/ranking implementation ships:
- current Admin/Ivanov candidate still first for real protected Construction/provider cases;
- current Listings Admin-first remains;
- current Listings boost order remains after Admin;
- current Firms protected owner-first remains where applicable;
- explicit exact named other entity query still navigates to named entity;
- factual Info query does not get hijacked by Construction priority;
- sort/filter controls do not erase protected priority accidentally.

Failure = blocker, not cosmetic issue.

---

## 63. TRUST REGRESSION TESTS

- secondary/conflict/stale Info cannot display as fresh official definitive answer;
- Q&A approval cannot show verified badge;
- recommendation count cannot change Health reliability;
- Article draft cannot enter ready result family;
- hidden target cannot rank through cached recommendation;
- Facebook share/reaction count cannot rank.

---

## 64. DETERMINISM TESTS

Same:
- query;
- public dataset snapshot;
- intent/category/filter context

must produce same order.

No random tie-breaking, clock-dependent jitter except legitimate freshness/time-window changes.

---

## 65. PERFORMANCE TESTS

- no all-owner query explosion;
- max concurrent owner queries per B2;
- bounded candidate rows;
- ranking over small in-memory arrays;
- no N+1 relation fetch per card;
- recommendation aggregate fetched/batched/cached later;
- owner timeout produces partial state, not blocked whole search.

---

## 66. ANALYTICS — FUTURE CALIBRATION, NOT INITIAL AUTHORITY

Future analytics can help discover:
- no-result gaps;
- bad click-through patterns;
- repeated reformulation;
- successful owner groups.

But B8 launch ranking does not automatically learn/reorder from clicks.

Any learned/popularity ranking requires:
- sufficient data;
- bot/abuse filtering;
- privacy review;
- bias/protected-rule review;
- explicit approved contract.

---

## 67. NO MACHINE-LEARNED BLACK BOX IN INITIAL V6

Initial ranking is rules/tuples/cascades.

No black-box model decides:
- protected priority;
- Health authority;
- moderation trust;
- ranking across owners.

AI may later help query understanding only after separate evaluation, but final owner/protected gates remain deterministic.

---

## 68. IMPLEMENTATION ADAPTER CONCEPT — NOT CODE

Target Search layer may conceptually use owner adapters:
- `rankInfoCandidates()`;
- `rankBusinessCandidates()`;
- `rankListingCandidatesProtected()`;
- `rankShopCandidates()`;
- `rankEventCandidates()`;
- `rankQuestionCandidates()`;
- `rankArticleCandidates()`.

Cross-owner composer then orders groups by B2 intent.

This avoids one giant score function.

Exact names/code are V6-D.

---

## 69. PROTECTED PRIORITY SOURCE OF TRUTH

Do not duplicate protected IDs/flags in multiple front-end modules if avoidable.

V6-D should design one protected priority adapter/config owner that:
- reads current protected fields/approved constants;
- is shared by Search/category composition;
- has regression tests;
- cannot silently drift between pages.

Any backend/schema change to achieve this requires protected approval.

---

## 70. OWNER-NATIVE ORDERING SOURCE OF TRUTH

Each owner defines what fields are valid ranking inputs.

Search orchestration cannot infer from arbitrary JSON/private metadata.

Selected fields only, consistent with B2 performance/privacy contract.

---

## 71. NO SEO RANK MANIPULATION VIA ONSITE ORDER

Onsite ranking and Google SEO are related only through useful navigation/content quality.

B8 does not create:
- hidden keyword stuffing;
- fake internal links;
- cloaked result order;
- duplicate SEO pages.

Stable canonical owners from B1–B5 remain.

---

## 72. PUBLIC EXPLAINABILITY

Where useful, UI can show truthful reasons:
- `Проверена информация`;
- `Официален източник`;
- `Предстоящо`;
- `Препоръчан от N души` when B6 valid;
- `Има отговори`;
- `Без одобрен отговор`.

Do not expose confusing internal rank numbers.

---

## 73. NO PRODUCTION IMPLEMENTATION IN B8

B8 changes no:
- Search JS;
- protected IDs/flags;
- Listings/Firms sorting;
- recommendation counters;
- Info reliability/freshness data;
- Q&A ordering;
- Article registry;
- Shops/Events ordering;
- schema/RLS;
- Admin panel;
- paid/boost business model.

Production impact: **NONE**.

---

## 74. B8 EXIT GATE — PASSED

B8 locks that:
1. ranking is cascade/tuples, not one global popularity score;
2. public/safety/intent/relevance gates precede protected priority;
3. protected Admin/Ivanov/boost applies inside relevant candidate set;
4. current Listings Admin → boost → recency semantics are preserved;
5. current Firms protected owner-first is preserved where applicable;
6. exact named navigational entity is not hijacked by unrelated protection;
7. factual Info intent beats provider popularity/protection;
8. Health specialty/reliability/freshness beats recommendation popularity;
9. B6 recommendations are capped secondary tie signal only;
10. Facebook/social signals do not rank;
11. no invented popularity baseline/personalization;
12. Jobs/Property/Services owner boundaries survive;
13. Events use current/upcoming relevance;
14. Q&A aliases resolve canonical and answered state is qualified;
15. Articles must be B4-ready/fresh;
16. deterministic tie-break and explainability are required;
17. protected/trust/performance regression matrices are explicit;
18. no schema/RLS/production code.

**B8 EXIT GATE: PASSED.**

---

## 75. EXACT NEXT TASK

# `STAGE V6-B9 — EXACT INTERACTION / FORMS / BUTTONS / LINKS / STATES CONTRACT`

B9 must lock every main user interaction end-to-end:
- Home search/shortcuts/category cards;
- category `Намери / Добави / Попитай`;
- Search result click/show-more/no-result Ask;
- owner-aware Add routes and prefills;
- Jobs/Property/Services exact listing types;
- Health specialized Add/correction/report flow inside common shell;
- Shops specialized Add;
- Events no fake Add until real owner flow;
- Q&A contextual prefill + duplicate candidate UX;
- Article/Info/entity related actions;
- B6 recommendation target selection/disclosure;
- Facebook share/copy/import actions;
- auth requirements;
- loading/success/error/pending/offline/back behavior;
- mobile/desktop/accessibility;
- one render owner per interaction root;
- exact URL/query parameter contract;
- no schema/RLS/production implementation.

Required artifact:

`PUBLIC_PRODUCT_V6_B9_EXACT_INTERACTION_FORMS_BUTTONS_LINKS_STATES_CONTRACT.md`

Production impact after B8: **NONE**.
