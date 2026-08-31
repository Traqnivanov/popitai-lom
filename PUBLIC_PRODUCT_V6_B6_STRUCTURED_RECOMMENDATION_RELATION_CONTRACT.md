# Попитай.Лом — V6-B6 STRUCTURED RECOMMENDATION RELATION CONTRACT

Статус: **B6 COMPLETE — DESIGN CONTRACT / NO PRODUCTION CODE**  
Branch: `v6-product-foundation-draft`  
Дата: 31.08.2026

Този документ заключва product contract за structured recommendation relation във V6.

Целта е community препоръките да могат да се свързват с реални Firms/Health/Shops/other approved entities, без:
- free-text counter corruption;
- duplicate trust inflation;
- self-recommendation abuse;
- втори entity owner;
- hidden commercial ranking;
- bypass на protected Admin/Ivanov/boost semantics.

Стъпва върху B1–B5, A1 owner map и LOCKED rules.

Production impact: **NONE**.

---

## 1. B6 РЕШЕНИЕ В ЕДНО ИЗРЕЧЕНИЕ

**Recommendation е traceable relation между approved community source и stable approved entity target; само valid positive non-self unique relations участват в derived trust counts, а relation layer никога не променя authoritative entity data или protected ranking самостоятелно.**

---

## 2. CURRENT EVIDENCE

Current owner map доказва stable authoritative entities:
- Firms → `businesses.id`, with `owner_id`, approved public status;
- Restaurants → same `businesses` owner, category `Заведения`;
- Health/verified profiles → `info_entries.id`, published/reliability-aware;
- Shops → `shops.id`, approved specialized owner;
- Q&A answers → stable `answers.id`, linked to `question_id` and authored/moderated content;
- Listings and Events are separate temporary/specialized owners.

Current code does **not** prove a structured recommendation relation owner.

Therefore B6 defines a NEW RELATION concept only; no schema/RLS change now.

---

## 3. WHAT COUNTS AS A RECOMMENDATION

A structured recommendation means:

`approved community source explicitly expresses positive recommendation toward a resolved entity target`.

Examples:
- `Препоръчвам фирма X за боядисване.`
- `Аз съм доволен от д-р Y.`
- `Магазин Z има добър избор за...` when clearly positive recommendation context.

Not automatically recommendation:
- mere mention;
- neutral information;
- question text;
- complaint;
- negative experience;
- quoted recommendation from someone else;
- article/editorial link;
- entity appearing in search results;
- phone/address mention.

---

## 4. INITIAL SOURCE OWNER — APPROVED Q&A ANSWERS

For initial V6 relation semantics, primary community source is:

**approved Q&A answer**.

Why:
- answer has author identity;
- answer has question context;
- answer is moderated;
- answer has stable id;
- B5 canonical model gives one knowledge center;
- source can be invalidated if moderation changes.

B6 does not count question title/body itself as recommendation by default.

---

## 5. FUTURE SOURCE TYPES

Later sources may be allowed only through explicit contract, for example:
- dedicated review/recommendation interaction;
- approved structured community feedback.

Not automatically included:
- Article editorial text;
- Info records;
- admin copy;
- Facebook comments imported externally;
- raw search queries;
- Listings descriptions.

Editorial content may link to entity but does not inflate community recommendation count.

---

## 6. INITIAL TARGET OWNER TYPES

### 6.1 `business`

Target:
`businesses.id`

Includes:
- firms;
- service providers;
- restaurants currently owned by Firms;
- protected Construction-related business profiles where applicable.

Public validity requires target is current approved/public according to Firms owner.

### 6.2 `health_info`

Target:
`info_entries.id`

Allowed only for provider-like/public Health entities such as:
- doctor;
- dentist;
- vet;
- medical center/practice;
- other approved provider-like health types explicitly mapped.

A recommendation signal is community opinion; it **does not modify Health reliability**.

### 6.3 `shop`

Target:
`shops.id`

Public validity requires specialized Shops owner says approved/public.

### 6.4 Restaurants

No separate target type is needed initially.

Restaurant target = `business` with restaurant/Firms category mapping.

---

## 7. TARGETS EXCLUDED FROM DURABLE RECOMMENDATION COUNTS INITIALLY

### Listings

Temporary listing/offer is not a durable provider identity.

No durable recommendation count attaches to `listing` in B6.

### Events

Event is time-bound and separate from durable organizer/place reputation.

No durable event recommendation count in B6.

### Info institution/utility facts

Municipality/NOI/utility contact is authoritative Info, not community recommendation target by default.

### Articles/Q&A questions

They may receive helpful/share signals, but not entity recommendation relation.

Future expansion requires explicit contract.

---

## 8. CONCEPTUAL RELATION IDENTITY — NOT A SCHEMA

A recommendation relation conceptually needs:
- relation id;
- source_type;
- source_id;
- source_author_id;
- question/canonical context;
- target_type;
- target_id;
- polarity;
- resolution state;
- moderation/confirmation state;
- self/conflict marker;
- created/updated/audit timestamps;
- validity state/reason.

This is conceptual only.

V6-D decides storage/schema/index/RLS.

---

## 9. POLARITY CONTRACT

Every resolved relation has explicit semantic polarity.

### Positive

`recommend`

Eligible for recommendation count if all validity rules pass.

### Neutral

`mention`

Can support contextual entity linking but does not count.

### Negative

`negative_experience`

Does not count as recommendation.

Potential future complaint/reputation handling is separate; B6 does not create negative score.

### Unknown

`unresolved_intent`

Never counts.

No automatic `positive` assumption from entity name mention.

---

## 10. ENTITY RESOLUTION — HARD RULE

A recommendation relation must point to a **real stable target id**.

Preferred future UX:
- answer author types entity name;
- UI suggests approved eligible entities;
- user selects correct target;
- selection records structured target reference.

If no target exists:
- answer text can still be submitted;
- no fake entity is silently created;
- no recommendation count is incremented;
- relation remains absent/unresolved until proper entity owner record exists and moderation/resolution is allowed.

---

## 11. FREE-TEXT EXTRACTION IS NOT AUTHORITY

Automatic parser may later suggest:
`Възможно е да препоръчваш X — свържи ли го?`

But automatic text extraction alone may not create a countable recommendation unless:
- author confirms target/polarity; or
- moderator safely resolves the relation under approved rules.

No naive keyword `препоръчвам` + string match writes entity counters.

---

## 12. SOURCE PUBLICATION REQUIREMENT

Relation can be active/countable only if source answer is:
- approved;
- public;
- not invalidated/removed;
- attached to a valid public/canonical Q&A context or safely preserved source context.

Pending/rejected/needs_changes answer relation is not countable.

If approved answer later becomes nonpublic:
- relation becomes invalid/inactive;
- derived counts update accordingly.

---

## 13. TARGET PUBLICATION REQUIREMENT

Relation can be active/countable only if target is public under its authoritative owner.

Examples:
- business: `approved`/public;
- shop: `approved`/public;
- Health Info: `published` provider-like record.

If target becomes hidden/rejected/nonpublic:
- relation is preserved historically if needed;
- active count excludes it;
- public entity chip/link is suppressed or safe state shown.

No relation can republish a hidden entity.

---

## 14. HEALTH TRUST BOUNDARY

Health recommendation has two independent axes:

1. **Verified profile/fact trust** from Health/Info owner;
2. **Community recommendation signal** from valid Q&A relations.

UI must not merge them into one badge.

Allowed:
- `Проверена информация`;
- separately `Препоръчан от 4 души`.

Forbidden:
- `4 препоръки → проверен лекар`;
- community count changing `reliability_status`;
- health recommendation implying medical efficacy/outcome guarantee.

---

## 15. SELF-RECOMMENDATION / CONFLICT OF INTEREST

If source author owns/controls target entity where owner mapping is known:
- relation can be preserved as disclosed/self relation if product later wants transparency;
- **it is excluded from community recommendation count**;
- it does not affect B8 reputation/ranking signal;
- it is never labeled as independent community recommendation.

Example:
Business owner answering `Препоръчвам моята фирма X`.

The answer may be allowed if community rules allow disclosure, but trust count does not increase.

---

## 16. STAFF RECOMMENDATION

Admin/Moderator role does not create authority advantage.

A staff-authored community answer:
- is not automatically `official`;
- is not weighted extra because of role;
- follows conflict/self rules;
- does not become protected recommendation.

Staff may moderate content according to role but moderation is separate from recommendation opinion.

---

## 17. ONE USER → ONE COUNTABLE SIGNAL PER TARGET

Core anti-inflation rule:

For public trust count, the same source author can contribute at most **one active positive recommendation unit per target**.

If same user recommends same target in 5 approved answers:
- all source relations may remain traceable;
- derived `unique recommenders` count increases by **1**, not 5.

This protects against repeated-answer inflation.

---

## 18. ONE ANSWER → ONE RELATION PER TARGET/POLARITY

Same answer mentioning target repeatedly does not create multiple units.

Conceptual dedupe key:
`source answer + target + polarity`.

Exact database constraint is V6-D.

---

## 19. MULTIPLE DIFFERENT TARGETS IN ONE ANSWER

Allowed if explicitly expressed.

Example:
`За боя препоръчвам X, а за ВиК — Y.`

Two structured relations may exist:
- answer → X positive;
- answer → Y positive.

Each must be separately resolved.

---

## 20. POSITIVE + NEGATIVE MIXED CONTEXT

If answer contains mixed sentiment:
`X свърши добре боята, но не бих го препоръчал за плочки.`

Do not blindly create global positive recommendation.

Target relation may need:
- topic/service context;
- neutral/mixed polarity;
- no count until clear semantic mapping.

B6 default is conservative: ambiguity does not count.

---

## 21. TOPIC-SCOPED RECOMMENDATION

Recommendation may conceptually carry topic context from question/subcategory.

Example:
- Business X recommended for `Боядисване`;
- not automatically endorsed for every service in profile.

Target count can have:
- global unique recommenders;
- topic-specific valid relations.

Exact aggregation/UI belongs to B8/B9/V6-D.

---

## 22. CANONICAL Q&A MERGE INTERACTION

If B5 merges duplicate question → canonical:
- answer sources remain traceable;
- recommendation relations remain attached to source answer ids;
- unique-user target dedupe prevents duplicate count inflation across merged threads;
- alias question itself does not create extra recommendation signal.

---

## 23. SOURCE EDIT INTERACTION

If answer is meaningfully edited and returns to moderation/pending under protected flow:
- its relation is temporarily not countable while source is nonpublic/pending;
- after reapproval relation intent may need revalidation;
- old positive relation cannot remain active if edited text no longer recommends target.

Exact trigger implementation is V6-D.

---

## 24. TARGET MERGE / DUPLICATE ENTITY INTERACTION

If later duplicate Firms/Shops/entities are merged:
- relations should map to canonical target through explicit entity-resolution migration;
- old target id history is retained;
- user count is deduped after remap;
- no double count from target merge.

B6 does not define entity merge system itself.

---

## 25. INVALIDATION REASONS

Conceptual invalid states include:
- source_not_public;
- source_rejected;
- target_not_public;
- target_deleted/merged;
- self_recommendation;
- duplicate_same_user;
- polarity_not_positive;
- unresolved_target;
- relation_rejected;
- abuse/spam;
- source_text_changed.

Invalid relation can remain audit-visible but contributes zero to public recommendation counts.

---

## 26. DERIVED COUNT — HARD RULE

Protected entity tables must not become manual recommendation-counter truth.

Public count is derived from **valid unique positive relations**.

Conceptual:

`recommendation_count = count(unique source_author_id per target among active valid positive non-self relations)`

This is rebuildable from source relations.

---

## 27. CACHE / MATERIALIZED COUNT IS ALLOWED ONLY AS DERIVED DATA

For performance, V6-D may choose:
- cached aggregate;
- materialized view;
- edge cache;
- denormalized derived field.

But:
- relation rows remain source of truth;
- aggregate must be rebuildable;
- no manual `+1/-1` protected business logic without relation validation;
- invalidation must eventually update cache consistently.

---

## 28. DISPLAY LABEL SEMANTICS

Allowed labels:
- `Препоръчан от 1 човек`;
- `Препоръчан от 4 души`;
- `4 души го препоръчват`.

Avoid:
- `Най-добър`;
- `№1`;
- star rating inferred from count;
- `Проверен` solely from recommendations;
- `100% препоръчван` without real denominator/methodology.

---

## 29. NO STAR RATING FROM B6

Recommendation relation is not a 1–5 star review system.

B6 does not create:
- average rating;
- stars;
- score out of 10;
- quality guarantee.

A future rating system requires separate abuse/statistical contract.

---

## 30. ENTITY CARD PRESENTATION

Recommendation signal is secondary metadata.

Possible later presentation:
- entity name/profile info from authoritative owner;
- separate community signal `Препоръчан от N души`;
- link `Виж препоръките` to source Q&A context.

Recommendation relation never becomes card render owner for entity name/phone/address/hours.

---

## 31. Q&A ANSWER PRESENTATION

If author explicitly linked target:
- answer may show small entity chip/card;
- chip uses authoritative owner data;
- relation label can say `Препоръчва` only for clear positive relation;
- neutral mention uses neutral link.

If target becomes nonpublic, answer text remains but entity chip/action is safely suppressed.

---

## 32. SEARCH V6 PRESENTATION

B6 does not add a new `recommendation` result family.

Recommendation signal may enrich existing entity result families:
- business;
- verified_info provider profile;
- shop.

It may also help contextual Q&A related links.

Search result remains owned by target owner.

---

## 33. B8 RANKING BOUNDARY — HARD

B6 recommendation signal is **not allowed to directly redefine protected ranking**.

B8 will decide if/how valid recommendation relations affect relevance.

Locked now:
- protected Admin/Ivanov/boost priority survives;
- recommendation count cannot demote protected first positions where locked;
- recommendation count cannot override intent relevance;
- factual Health/Info search still prioritizes authoritative intent correctly;
- commercial staff relation cannot game ranking.

---

## 34. CONSTRUCTION / IVANOV PROTECTION

For Construction/provider intent:
- Ivanov/Admin protected priority remains according to protected rules;
- recommendation metadata can be shown as secondary social proof;
- B6 count does not reorder protected priority;
- no duplicate relation can be used to push another entity ahead by itself.

B8 later defines allowed secondary ordering after protected boundary.

---

## 35. HEALTH SEARCH/RANKING PROTECTION

For query:
`кардиолог Лом`

Verified Health entity relevance/freshness remains primary owner logic.

Community recommendation may enrich result, but:
- cannot make stale/conflict unsafe fact definitive;
- cannot transform community popularity into medical authority;
- cannot replace specialty/location match.

---

## 36. MODERATION OF RELATION

### Explicit author-selected relation

If author selects target and positive intent in controlled UI:
- relation can conceptually inherit source answer moderation;
- becomes active only after answer approved and all validity checks pass.

### Inferred relation from text

Requires confirmation/review before countable.

### Moderator/Admin

Relation moderation must follow protected role boundaries:
- Moderator handles foreign content/relations only if backend permits;
- no Moderator self-moderation;
- Admin system powers remain Admin-only;
- relation moderation cannot edit target owner data.

---

## 37. AUTHOR CONTROL

Before answer submit, user should be able to:
- see selected entity;
- remove/change relation;
- know whether it is marked `Препоръчвам` vs neutral mention.

No hidden relation extraction that affects public reputation without visible/reviewable basis.

Exact UX is B9/C.

---

## 38. ENTITY OWNER CANNOT DELETE NEGATIVE/NEUTRAL COMMUNITY CONTEXT

Owning a business/target does not grant moderation power over Q&A relation/source.

Target owner can:
- report abuse/inaccuracy through allowed flow.

Target owner cannot:
- delete criticism;
- convert negative mention to positive;
- remove valid recommendation source because they dislike wording;
- directly edit relation counts.

Moderation remains independent.

---

## 39. ABUSE / SOCKPUPPET BOUNDARY

One-user-one-target dedupe blocks basic repetition, but not multiple fake accounts.

B6 target protections:
- authenticated source required for countable recommendation;
- normal Q&A moderation;
- rate/abuse signals may be added later;
- staff can invalidate proven spam relations;
- no device fingerprinting or invasive surveillance by default;
- no public exposure of anti-abuse internals.

Exact abuse scoring is V6-D/F.

---

## 40. ACCOUNT BLOCK / HISTORICAL CONTENT

Account block alone does not automatically erase every historical approved relation by implication.

Validity follows source moderation state and explicit abuse invalidation policy.

If account is blocked for recommendation manipulation:
- staff can invalidate affected relations through auditable moderation.

No silent global trust rewrite without reason/history.

---

## 41. PRIVACY CONTRACT

Public recommendation aggregation may expose:
- aggregate unique count;
- public Q&A source links where allowed.

It must not expose:
- source author account id;
- email;
- private profile data;
- internal abuse score;
- moderation notes;
- hidden duplicate/account linkage.

Current Q&A neutral author presentation is compatible with privacy-first target.

---

## 42. FACEBOOK / SHARE INTERACTION

Facebook Bridge may distribute:
- canonical Q&A question;
- entity profile;
- answer/thread context.

But Facebook reactions/comments are **not automatically imported as Popitai structured recommendations**.

A valid recommendation count requires Popitai-approved source relation under B6.

This avoids untraceable external counter manipulation.

---

## 43. ARTICLE / EDITORIAL INTERACTION

Article may link to entity but does not count as community recommendation.

If article says `как да избереш майстор`, it is editorial guidance, not endorsement count.

Sponsored/editorial placements, if ever introduced, require separate disclosure contract and never inflate B6 community counts.

---

## 44. INFO / VERIFIED FACT INTERACTION

Info record can show community recommendation metadata for provider-like target, but:
- Info trust remains reliability/freshness based;
- B6 count is visually separate;
- Info correction does not rewrite Q&A recommendation source;
- Q&A relation does not rewrite Info data.

---

## 45. RECOMMENDATION DETAIL / SOURCE TRANSPARENCY

If UI offers `Виж препоръките`:
- show approved canonical Q&A contexts/safe answer excerpts;
- dedupe repeated same-user sources;
- preserve dates;
- do not expose hidden/rejected relations;
- make clear these are community opinions.

Exact page/modal design is B9/C.

---

## 46. NO `MOST RECOMMENDED` WITHOUT B8/METHODOLOGY

B6 only defines valid relation and derived count.

It does not authorize:
- `Най-препоръчвани в Лом`;
- Top ranking;
- badges based only on raw count;
- category reorder.

These require B8 methodology including recency, sample size, relevance and protected priorities.

---

## 47. PERFORMANCE CONTRACT

Target relation reads are bounded:
- entity card may receive small aggregate count query/cache;
- Q&A answer may resolve only explicitly linked target ids;
- no scan of all answer text on every page;
- no live all-relations download;
- no N+1 owner fetch explosion;
- aggregates/cache may be used if rebuildable;
- related source list paginated/bounded.

---

## 48. SEARCH/ENTITY CACHE INVALIDATION

If source/target/moderation validity changes:
- derived aggregate must eventually reflect new valid set;
- UI must not trust stale manual counter forever;
- exact invalidation mechanism is V6-D.

Consistency target is correct derived truth over immediate unsafe speed.

---

## 49. ANALYTICS — FUTURE SEMANTICS ONLY

Possible privacy-safe future events:
- `recommendation_link_start`;
- `recommendation_target_select`;
- `recommendation_submit`;
- `recommendation_view_sources`;
- `entity_recommendation_click`.

Do not send answer body/free-text/sensitive health content by default.

No current analytics baseline is claimed.

---

## 50. ACCESSIBILITY / MOBILE

- entity picker keyboard accessible;
- polarity choice explicit text, not color-only;
- relation chip has accessible name;
- community recommendation label distinct from verified badge;
- mobile cards do not become crowded with reputation metadata;
- source list uses readable dates/context.

Exact UI is B9/C.

---

## 51. IMPLEMENTATION / SCHEMA DEFERRED

B6 does not choose:
- relation table name;
- indexes;
- triggers;
- RLS policies;
- aggregate view/materialization;
- migration SQL;
- UI component code.

V6-D will design implementation after B7–B9 and prototype decisions.

---

## 52. NO PRODUCTION IMPLEMENTATION IN B6

B6 changes no:
- businesses;
- info_entries;
- shops;
- answers/questions;
- listings/events;
- RLS/schema;
- protected ranking;
- counters;
- public cards;
- Admin panel;
- Facebook integration.

Production impact: **NONE**.

---

## 53. B6 EXIT GATE — PASSED

B6 locks that:
1. recommendation has traceable approved source + stable target id;
2. initial source is approved Q&A answer;
3. initial durable targets are Firms/businesses, provider-like Health Info, Shops; Restaurants use Firms;
4. Listings/Events are excluded from durable counts initially;
5. polarity is explicit; mere mention/negative/ambiguous does not count;
6. free-text extraction alone cannot alter reputation;
7. source and target must both be public;
8. self-recommendation is excluded from community count;
9. one user contributes max one active positive unit per target;
10. counts derive from valid unique relations, never manual protected counter truth;
11. Health recommendation stays separate from verification;
12. Q&A merge/edit/invalidation cannot inflate stale counts;
13. relation does not create new Search result owner;
14. B8 protected ranking boundary is preserved;
15. Facebook/external reactions do not automatically become recommendations;
16. privacy/performance/abuse boundaries are explicit;
17. no schema/RLS/production code.

**B6 EXIT GATE: PASSED.**

---

## 54. EXACT NEXT TASK

# `STAGE V6-B7 — FACEBOOK BRIDGE TECHNICAL / PRODUCT CONTRACT`

B7 must lock:
- Popitai → Facebook share flow for Q&A/entities/listings/jobs/property/events/guides/Health where appropriate;
- approval/publication timing before share;
- canonical URLs and server-readable share preview contract;
- safe share text generation and mutable-fact boundaries;
- Facebook → Popitai user-assisted import/prefill for own content without scraping;
- permissions/privacy/group limitations;
- no automatic posting to arbitrary groups;
- no automatic external comments/reactions import as Q&A/recommendations;
- mobile Web Share API / clipboard / Facebook fallback hierarchy;
- PWA/share-target as optional later experiment, not dependency;
- moderation/status/update/delete behavior after content was shared;
- UTM/source attribution without leaking sensitive content;
- performance/no Facebook SDK dependency by default;
- Health/sensitive content safety;
- no schema/RLS/production implementation.

Suggested artifact:

`PUBLIC_PRODUCT_V6_B7_FACEBOOK_BRIDGE_TECHNICAL_PRODUCT_CONTRACT.md`

Production impact after B6: **NONE**.
