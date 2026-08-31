# Попитай.Лом — V6-B5 Q&A CANONICAL / DUPLICATE / ALIAS / MODERATION CONTRACT

Статус: **B5 COMPLETE — DESIGN CONTRACT / NO PRODUCTION CODE**  
Branch: `v6-product-foundation-draft`  
Дата: 31.08.2026

Този документ заключва target Q&A knowledge architecture за V6: canonical question identity, duplicate prevention, aliases, non-destructive merge, moderation/trust, stale behavior, Search V6, SEO/share/Facebook и contextual `Попитай Лом` semantics.

Стъпва върху:
- LOCKED project/Admin/Moderator rules;
- B1 taxonomy/owner contract + Health presentation clarification;
- B2 Search V6 contract;
- B3 verified Info/trust/freshness contract;
- B4 Article/Guide contract;
- A2 Q&A/moderation/SEO/share evidence;
- `PUBLIC_PRODUCT_V6_WORKING_MODEL.md` canonical-question concept.

При конфликт:

**LOCKED rules > approved production specs > Master Control > B1–B4 > този B5 contract > supporting drafts.**

Production impact: **NONE**.

---

## 1. B5 РЕШЕНИЕ В ЕДНО ИЗРЕЧЕНИЕ

**Един реален community question intent трябва да има един canonical knowledge center; сходните формулировки се насочват/свързват към него без destructive merge, а community answers никога не се представят като verified Info facts.**

---

## 2. CURRENT EVIDENCE

Current source доказва:
- `questions-public-v1.js` чете само `questions.status = approved`;
- public answer counts се изчисляват само от `answers.status = approved`;
- `nov-vapros.html` има title/category/description + community rules consent;
- current submit path: Admin може да създаде approved question, normal user/Moderator owner flow минава pending според current rules;
- current answer submit path записва pending answer;
- current question detail чете approved answers и ги показва chronological;
- current detail static HTML започва с generic `Въпрос | Попитай.Лом` metadata;
- client JS сменя `document.title`, но това не създава server-readable per-question OG/canonical;
- visible `Сподели` button е наличен, но A2 не доказа active handler в audited detail owner;
- A2 DB/RLS evidence потвърди: Moderator може да модерира foreign Q&A, но не собственото си Q&A съдържание;
- current active Admin V2 визуално също скрива self-moderation actions;
- current schema/code evidence не доказва canonical-question/alias/merge owner.

Следователно B5 добавя product contract, не твърди, че canonical layer вече съществува.

---

## 3. Q&A ROLE IN V6

Q&A е **community knowledge layer**, не generic feed и не verified database.

Q&A е правилният owner за:
- препоръки;
- личен опит;
- мнение;
- конкретен местен въпрос;
- community advice;
- practically useful context, който не е official fact.

Q&A не замества:
- Info/Health verified facts;
- Article/Guide process explanations;
- Firm/Listing/Shop/Event owner data.

---

## 4. CANONICAL QUESTION IDENTITY

### 4.1 Canonical center

За един реален question intent има един canonical question record/identity.

Пример:

Canonical:
`Кой зъболекар работи в неделя в Лом?`

Alternate wording:
`Има ли стоматолог в Лом отворен в неделя?`

Target:
- един knowledge center;
- едно място за approved answers;
- един canonical SEO/share destination;
- alternate wording остава полезен alias/search phrase, не втори competing center.

### 4.2 Identity is not title string only

Canonical identity се определя от комбинация:
- normalized meaning;
- B1 category;
- optional subcategory/topic;
- local context;
- important qualifiers: date/time, offer/seek, health specialty, item/service type etc.

Два въпроса с близки думи не са duplicate, ако task intent е различен.

---

## 5. MODERATION STATUS ≠ CANONICAL STATUS

Current question moderation statuses се пазят като отделна ос:
- pending;
- approved;
- needs_changes;
- rejected.

Canonical relationship е отделен concept:
- canonical;
- possible_duplicate;
- alias/duplicate_of;
- independent.

B5 **не претоварва** `status` с duplicate semantics и не налага schema.

Exact storage е V6-D.

---

## 6. PRE-SUBMIT DUPLICATE CHECK

Duplicate prevention се случва **преди final submit**, без да превръща формата в тежка търсачка.

Target flow:

1. потребителят въвежда/получава prefilled question;
2. има category/topic context;
3. при достатъчно текст системата нормализира заявката;
4. проверява bounded set от public approved canonical questions;
5. показва максимум **3** най-силни кандидата;
6. user може:
   - да отвори съществуващия;
   - да продължи, ако случаят е различен;
7. ако strong duplicate signal е игнориран, submission може conceptually да носи `possible_duplicate` review hint;
8. moderation решава canonical/alias без destructive auto-merge.

Няма автоматично блокиране само защото има lexical similarity.

---

## 7. DUPLICATE NORMALIZATION

Reuse B2 lightweight normalization principles:
- Bulgarian lowercase;
- trim/collapse whitespace;
- punctuation normalization;
- dash/underscore normalization;
- curated synonyms/aliases;
- preserve meaningful numbers/time/location qualifiers;
- category/topic context;
- limited stems where safe.

### No heavy default

B5 не изисква:
- external AI call;
- vector DB;
- embeddings service;
- Elasticsearch;
- all-question download per keystroke.

A future stronger semantic layer е допустим само след measured need/performance/privacy review.

---

## 8. DUPLICATE CONFIDENCE CLASSES

Conceptual classes:

### Exact

Normalized title + same topic/qualifiers match strongly.

Action:
- show canonical prominently;
- user can explain why theirs differs before continuing.

### Strong

High token/phrase similarity + same category/topic/task.

Action:
- show candidate first;
- continuing submission receives possible-duplicate moderation hint.

### Possible

Related wording/topic but meaningful uncertainty.

Action:
- suggestion only;
- no blocking.

### Different

No duplicate action.

Exact score thresholds are V6-D/B8 implementation detail.

---

## 9. PERFORMANCE BOUNDARY FOR DUPLICATE CHECK

Target default:
- no remote request on every keystroke;
- debounce only after meaningful title/query threshold;
- same category/topic candidate set first;
- candidate fetch/index bounded;
- target max inspected remote candidates per check: **20**;
- visible suggestions: max **3**;
- cancellation/stale-request guard;
- duplicate check failure does **not** destroy the form.

If duplicate service fails:
- user may still submit normally;
- moderation remains final safety net.

---

## 10. ALIAS / ALTERNATE PHRASING CONTRACT

Useful duplicate phrasing is not wasted.

An alias may preserve:
- original user wording;
- common synonym;
- local colloquial phrase;
- search phrasing;
- spelling variant.

Alias:
- points to one canonical question;
- can help onsite search;
- can help redirect/canonical resolution;
- does not own separate answers;
- does not create a second crawlable canonical page.

Public UI does not need to expose every alias as a separate page.

---

## 11. NON-DESTRUCTIVE MERGE CONTRACT

Duplicate resolution is **non-destructive**.

When two approved questions are judged duplicate:
1. select canonical winner;
2. preserve original duplicate record/text/history internally;
3. link duplicate → canonical;
4. future public navigation resolves to canonical;
5. search registry removes duplicate as independent result;
6. answers are not silently copied/deleted without explicit migration rules;
7. audit/history keeps who made the decision and why;
8. decision should be reversible where technically reasonable.

Permanent deletion is **not** the duplicate strategy.

---

## 12. CANONICAL WINNER CRITERIA

Choose canonical based on product utility, not staff preference.

Consider:
- same real intent confirmed;
- approved/public state;
- clearer neutral title;
- more complete non-sensitive description;
- stronger answer coverage;
- stable category/topic mapping;
- existing links/share/backlink value;
- earlier canonical identity where quality is otherwise equal;
- lower privacy/sensitive-data risk.

Do not choose based on:
- staff author;
- advertiser/business relationship;
- protected commercial ranking;
- personal preference.

---

## 13. ANSWER OWNERSHIP / MODERATION

Public answers must remain approved under the current protected moderation model.

Locked:
- normal answer submission does not directly become public by bypass;
- question author cannot moderation-approve an answer;
- Moderator cannot self-moderate own question/answer;
- Moderator operational moderation applies only where current/approved role policy allows;
- Admin retains Admin-only/system powers;
- permanent delete remains Admin-only where LOCKED rules say so;
- backend permission must match UI permission.

B5 introduces no RLS change.

---

## 14. DUPLICATE/CANONICAL MODERATION PERMISSIONS — TARGET

Canonical linking is a reversible operational moderation action, not permanent delete.

Target rule:
- Moderator may resolve/link **foreign** duplicate Q&A if V6-D backend explicitly grants the same permission safely;
- Moderator may not canonicalize/merge own content using moderator powers;
- Admin may manage canonical relations according to Admin role;
- destructive permanent deletion remains separate Admin-only power;
- any merge/alias action is audited/reversible by relation/history, not hidden frontend-only behavior.

This is a product permission contract; implementation/RLS comes later.

---

## 15. AUTHOR EDIT AFTER APPROVAL

Meaningful edit to:
- title;
- description;
- category/topic;
- core intent

must follow existing owner/edit/moderation protection and can require re-review.

A meaningful edit also triggers duplicate/canonical re-evaluation.

Cosmetic edit does not automatically create a new canonical identity.

Exact current edit path is not changed by B5.

---

## 16. VERIFIED INFO VS COMMUNITY ANSWERS

This boundary is hard.

Example query:
`Кой е телефонът на Спешна помощ / ВиК / НОИ?`

Target:
- verified Info result/card first;
- community Q&A may appear separately as experience/context;
- an answer containing a phone number does not become `verified` by votes or approval alone.

### On canonical question page

If relevant verified Info exists, page may show a distinct block:

`Проверена информация`

separate from:

`Отговори от общността`.

Community answer is not rewritten into Info automatically.

If community content reveals an Info correction, it goes through Info correction/verification flow.

---

## 17. HEALTH Q&A BOUNDARY

Health questions participate in the same common V6 category/Q&A/share/Facebook system.

But:
- verified doctor/pharmacy/hospital facts stay Health/Info-owned;
- Q&A answers are community experience/opinion;
- no answer receives medical-authority badge without real approved expert model;
- no invented doctor/reviewer credentials;
- sensitive personal details should not be amplified in previews/related cards;
- verified Health context may appear above community answers when relevant.

Current Health UI is not frozen; owner/trust boundary is.

---

## 18. `ACCEPTED / BEST / HELPFUL` SEMANTICS

B5 separates three concepts.

### `Избран от автора`

Question author may conceptually mark one **approved** answer as personally most useful.

Meaning:
- useful to asker;
- not official;
- not verified;
- not moderation approval.

### `Полезен`

Community usefulness signal may exist only with abuse-resistant/deduplicated voting design later.

Meaning:
- users found it useful;
- not factual verification.

### `Проверена информация`

Only authoritative Info/Health owner can provide this trust class.

### No fake `best`

Until B8/D defines ranking/voting integrity, do not label an algorithmic answer `Най-добър` as objective truth.

Current visible `Полезно` control does not prove a complete current voting backend; B5 does not pretend it does.

---

## 19. ANSWER ORDERING

Exact ranking is deferred to B8/V6-D.

B5 locks only:
- approved answers only publicly participate;
- author-selected answer, if implemented, is visibly subjective;
- votes cannot override moderation;
- verified Info remains separate;
- no staff/commercial hidden priority in community answers.

Current chronological order can remain until explicit ranking implementation.

---

## 20. OLD / STALE Q&A

Q&A does not expire merely because it is old.

### Evergreen experience

Old recommendation/experience can remain useful if clearly dated.

### Time-sensitive factual question

Examples:
- opening hours;
- current phone;
- current deadline;
- event availability.

Behavior:
- current verified owner is shown first when available;
- old community answers retain their date/context;
- stale answer is not turned into verified snippet;
- recency can be a B8 ranking signal for time-sensitive intent.

### Changed premise

If question premise is no longer current:
- canonical page may show contextual `Информацията може да е променена`;
- link to current Info/guide;
- page is not silently deleted.

Exact stale detection automation is V6-D/B8.

---

## 21. UNANSWERED CANONICAL QUESTIONS

Approved unanswered canonical question can still be useful to:
- prevent duplicate asks;
- collect future answers;
- share to Facebook/community to solicit answers.

Onsite Search may show it with explicit:
`Без одобрен отговор`.

It must **not** be presented as solved.

If a user tries to ask the same unanswered question:
- show existing canonical first;
- allow continuing only if their case is meaningfully different;
- no forced duplicate creation.

---

## 22. SEARCH V6 Q&A ELIGIBILITY

Search result family remains `question`.

Eligible:
- approved;
- canonical/independent, not alias loser;
- public-safe;
- query/topic relevant.

### Answered canonical

Strong community result candidate.

### Unanswered canonical

May appear for exact/strong matching to avoid duplicate and invite participation, clearly labeled unanswered.

### Alias

May match search input but resolves to canonical result, not separate card.

### Pending/rejected/needs_changes

Never public Search results.

---

## 23. INTENT ORDERING WITH Q&A

Reuse B2:

### COMMUNITY_OPINION
Q&A can be primary.

Example:
`Кой зъболекар препоръчвате?`

### AUTHORITATIVE_FACT
Info first; Q&A separate/secondary.

### GUIDE_PROCESS
Article/Guide first; Q&A related.

### PROVIDER_DISCOVERY
Firm/Listing/Health entity first; community recommendations secondary.

### MIXED_UNKNOWN
Question group can participate in bounded composition but does not crowd out stronger authoritative owner.

---

## 24. Q&A SEARCH RESULT CARD CONTRACT

Target card may show:
- title;
- B1 category/topic;
- short safe excerpt;
- answer count;
- `Има отговори` / `Без одобрен отговор`;
- date/recency where useful;
- canonical URL.

Do not show:
- private author data;
- moderation notes;
- rejected/pending answer snippets;
- `verified` badge;
- hidden duplicate state internals.

---

## 25. SEO INDEXABILITY GATE

Public does not automatically mean index-worthy.

### Indexable canonical Q&A target

Default requirements:
- approved canonical question;
- substantive title/description;
- one or more useful approved answers **or** strong linked verified/guide utility that makes the page non-thin;
- public-safe content;
- stable canonical destination;
- no duplicate/cannibalization issue.

### Approved but unanswered

May remain public/shareable but target default is:
`noindex,follow`
until useful answer/utility threshold is met.

This prevents a large thin unanswered SEO tree.

### Alias/duplicate URL

Not independently indexable.

It resolves/canonicalizes/redirects to the canonical question.

---

## 26. CANONICAL URL CONTRACT

Canonical identity is independent of exact URL format.

Current compatibility URL:
`vapros.html?id=<id>`

B5 does not break it.

Target later can use a lightweight server/edge share/SEO route with id/slug, but:
- exactly one canonical URL per question center;
- old/current URL remains compatible via redirect/canonical strategy;
- aliases do not generate separate SEO pages.

Exact route architecture is V6-D.

---

## 27. DYNAMIC SEO / OPEN GRAPH

Current generic HTML metadata is insufficient for strong social/Google preview.

Target canonical Q&A share/SEO layer should expose server-readable:
- real question title;
- safe short description;
- canonical URL;
- category;
- OG/Twitter metadata;
- suitable default/derived image;
- no private author identity.

No heavy framework is required; lightweight edge/server render remains valid later candidate.

---

## 28. SHARE / FACEBOOK BRIDGE

Canonical approved questions are first-class Facebook/share assets.

### Unanswered question

Share goal:
`Помогни с отговор`.

### Answered question

Share goal:
`Виж въпроса и отговорите`.

### Minimum actions

- `Сподели`;
- `Сподели във Facebook` where appropriate;
- `Копирай линк`;
- future compact copy pack.

B7 locks exact mechanics.

No automatic scraping/import from Facebook groups is implied.

---

## 29. SHARE PRIVACY / SENSITIVE CONTENT

Question may contain health, family, financial or other sensitive context.

Even when question is public, social preview should use minimum necessary public text.

Default target:
- title;
- category;
- neutral call to action;
- canonical link.

Description/body excerpt is used only when safe and appropriate.

Never include in share metadata:
- email;
- phone supplied as private context;
- moderation note;
- account identifier;
- unpublished details.

Exact automated safety classification is V6-D; default is conservative.

---

## 30. CONTEXTUAL `ПОПИТАЙ ЛОМ` PREFILL

B2 locked that no-result can lead to contextual Ask only after required search/fallback completes.

B5 locks semantics:
- original query can prefill question title if user sees and can edit it;
- B1 category/topic is suggested from Search/category context;
- suggestion is not silently final if ambiguous;
- no auto-submit;
- duplicate check runs before final submit;
- source/search context is not shown as community text unless user writes it;
- auth/moderation rules still apply.

Exact query parameter names/URLs/button states remain B9.

---

## 31. CATEGORY / TOPIC RELATIONS

Current `questions.category` gives a real category owner field, but V6 needs richer contextual relations without inventing a new question backend owner.

Target conceptual relation may include:
- B1 top category;
- subcategory/leaf/topic;
- related Info record;
- related entity;
- related Article/Guide;
- canonical aliases.

These are relationship-layer concepts for B6/V6-D.

Question itself remains Q&A-owned.

---

## 32. JOBS / SERVICES / HEALTH TOPIC SAFETY

B1 semantics must survive Q&A:
- Job question does not silently become Services question;
- service recommendation does not become job listing;
- health recommendation does not become verified Health fact;
- property question does not become Listing write;
- Construction question does not bypass protected owner/ranking.

Q&A category context affects discovery, not authoritative owner transfer.

---

## 33. Q&A → RELATIONSHIP LAYER

B5 does not create recommendation counts.

If answer recommends a firm/doctor/shop/place:
- textual answer remains Q&A-owned;
- structured recommendation relation, if later created, belongs to B6 contract;
- relation only references target owner;
- no manual counter in protected entity table;
- no automatic entity endorsement solely from text mention.

---

## 34. MODERATION VS FACT CHECKING

Moderation approval means:
- content meets community/publication rules sufficiently to be public.

It does **not** mean:
- every factual statement is verified;
- staff endorses recommendation;
- answer is official;
- business quality is guaranteed.

Public UI must not infer `проверено` from Q&A approval.

---

## 35. REPORT / CORRECTION PATH

Question/answer remains reportable.

If report is about:
- abuse/spam/community rule → Q&A moderation;
- wrong verified Info fact mentioned in thread → Info correction flow for authoritative record;
- duplicate question → canonical/alias review;
- entity profile problem → target owner correction/report flow.

One report type should not silently modify another owner.

Exact form routing is B9/V6-D.

---

## 36. NO DESTRUCTIVE AUTOMATION

Automated duplicate logic may:
- suggest;
- score;
- flag;
- route.

It may not automatically:
- delete question;
- merge answers;
- rewrite user text;
- mark answer verified;
- hard redirect without recorded decision;
- punish user solely for similarity.

Human/reviewable decision remains for strong destructive implications.

---

## 37. PRIVACY CONTRACT

- public Q&A does not expose account email/internal IDs;
- current neutral author presentation `Член на общността` is compatible with privacy-first target;
- duplicate matching operates over allowed public/submit text only;
- no third-party AI receives raw private question drafts by default;
- raw search/question analytics are not stored by implication;
- sensitive descriptions are minimized in social previews.

Exact retention/privacy implementation is later design.

---

## 38. PERFORMANCE CONTRACT

Q&A should stay lightweight:
- no framework requirement;
- no giant all-question payload;
- page-sized public queries;
- bounded answer query per detail;
- duplicate suggestions max 3;
- bounded candidate query/index;
- no per-keystroke remote mega-search;
- related Info/Article/entities load progressively;
- core question/answers remain usable if related-owner call fails.

---

## 39. ACCESSIBILITY / MOBILE CONTRACT

- canonical/duplicate suggestions keyboard accessible;
- clear labels `Съществува подобен въпрос`;
- user can open candidate and return without losing draft where feasible;
- visible status for unanswered/answered;
- share buttons have accessible names;
- moderation/accepted/useful labels do not depend only on color;
- category shell follows common V6 mobile hierarchy, including Health.

Exact UX implementation belongs to B9/C.

---

## 40. FUTURE ANALYTICS SEMANTICS ONLY

No claim that these events exist today.

Possible future events:
- `ask_start`;
- `duplicate_candidates_view`;
- `duplicate_open_existing`;
- `duplicate_continue_new`;
- `question_submit`;
- `question_view`;
- `answer_submit`;
- `answer_view`;
- `question_share`;
- `question_copy_link`;
- `question_report`;
- `question_owner_link_click`.

Do not send sensitive health/free-text body by default.

---

## 41. CONCEPTUAL Q&A ENVELOPE — NOT A SCHEMA

V6 orchestration may conceptually need:
- question id;
- moderation status;
- canonical identity/state;
- canonical target id if alias;
- normalized public search key;
- B1 category/topic relations;
- created/updated timestamps;
- approved answer count;
- answer-state indicator;
- safe share metadata;
- indexability/search eligibility;
- relation targets.

This is not a B5 migration/table definition.

V6-D decides exact storage/index/RLS.

---

## 42. NO PRODUCTION IMPLEMENTATION IN B5

B5 does not change:
- `questions`/`answers` schema;
- RLS;
- current moderation code;
- current URLs;
- current share button;
- category UI;
- Search JS;
- Facebook integration;
- Admin/Moderator permissions;
- current public content.

---

## 43. B5 EXIT GATE — PASSED

B5 is complete because it locks:
1. one real intent → one canonical question center;
2. bounded pre-submit duplicate suggestions;
3. alias/alternate wording without duplicate SEO page;
4. non-destructive auditable merge;
5. moderation status separate from canonical state;
6. protected Moderator self-content boundary;
7. community approval ≠ factual verification;
8. accepted/useful ≠ verified;
9. stale/time-sensitive Q&A behavior;
10. answered vs unanswered Search behavior;
11. SEO indexability gate preventing thin unanswered tree;
12. one canonical SEO/share/Facebook destination;
13. safe contextual Ask prefill semantics;
14. privacy/performance boundaries;
15. no schema/RLS/production implementation.

**B5 EXIT GATE: PASSED.**

---

## 44. EXACT NEXT TASK

# `STAGE V6-B6 — STRUCTURED RECOMMENDATION RELATION CONTRACT`

B6 must lock:
- recommendation relation identity;
- supported source types (primarily approved Q&A answers/other explicitly approved sources);
- supported target entity owner types;
- entity resolution without free-text counter corruption;
- positive recommendation vs mere mention/negative context;
- moderation/approval and self-recommendation boundaries;
- dedupe/one-user-one-signal semantics;
- relation invalidation when source/target becomes nonpublic;
- counts derived from valid relations, not manually stored protected counters;
- Search/category/entity presentation semantics;
- interaction with B8 ranking while preserving Admin/Ivanov/boost protected rules;
- privacy/abuse/performance;
- no schema/RLS/production implementation.

Suggested artifact:

`PUBLIC_PRODUCT_V6_B6_STRUCTURED_RECOMMENDATION_RELATION_CONTRACT.md`

Production impact after B5: **NONE**.
