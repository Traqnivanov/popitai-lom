# Попитай.Лом — V6-B7 FACEBOOK BRIDGE TECHNICAL / PRODUCT CONTRACT

Статус: **B7 COMPLETE — DESIGN CONTRACT / NO PRODUCTION CODE**  
Branch: `v6-product-foundation-draft`  
Дата: 31.08.2026

Този документ заключва V6 Facebook Bridge като controlled distribution layer около canonical Попитай.Лом content.

Стъпва върху:
- LOCKED project/Admin/Moderator rules;
- B1 taxonomy + Health presentation clarification;
- B2 Search V6;
- B3 Info truth/freshness/SEO/share;
- B4 Article/Guide readiness/share;
- B5 canonical Q&A/share/privacy;
- B6 structured recommendation relation;
- A2 current dynamic SEO/share evidence;
- `PUBLIC_PRODUCT_V6_ADOPTION_LAUNCH.md`;
- current browser standards evidence for Web Share / Clipboard;
- current Meta/Facebook Groups platform evidence as verified at B7 design time.

При конфликт:

**LOCKED rules > approved production specs > V6 Master Control > B1–B6 > този B7 contract > supporting drafts.**

Production impact: **NONE**.

---

## 1. B7 РЕШЕНИЕ В ЕДНО ИЗРЕЧЕНИЕ

**Facebook е reach/distribution bridge: content първо има canonical approved home в Попитай.Лом, после потребителят доброволно го споделя; Facebook не става data owner, scraper, moderation system, recommendation source или duplicate archive.**

---

## 2. PRODUCT GOAL

Основният adoption loop е:

`Публикувай/намери в Попитай → content става canonical и public → Сподели към Facebook → хората влизат през canonical URL → отговори/relations остават в Попитай → следващият човек намира готовото знание.`

Целта не е:
- да заменим Facebook;
- да копираме Facebook feed;
- да автоматизираме arbitrary group posting;
- да scrape-ваме чужди групи;
- да импортваме чужди comments/reactions като наши данни.

Целта е:

**Facebook да носи reach към трайното, структурирано съдържание в Попитай.Лом.**

---

## 3. CURRENT EVIDENCE / WHY B7 IS NEEDED

A2 доказва:
- current Listing owner има share capability;
- current Question detail има visible `Сподели`, но active handler не беше доказан;
- `vapros.html`, `obqva.html`, `firma.html` започват със generic server/static metadata;
- client-side title update alone не е надежден social crawler/Open Graph contract;
- current repo няма доказан PWA manifest/service-worker/share-target owner.

Следователно V6 share layer е реална architectural need, не decorative feature.

---

## 4. EXTERNAL PLATFORM EVIDENCE SNAPSHOT — 31.08.2026

### 4.1 Web Share API

Current MDN evidence:
- `navigator.share()` остава **limited availability**, не universal baseline;
- изисква HTTPS/secure context;
- трябва да бъде извикано след transient user activation, напр. button click;
- available share targets зависят от device/OS/browser;
- `navigator.canShare()` може да валидира payload, но също не е universal;
- Web Share може да бъде blocked от `web-share` Permissions Policy.

B7 consequence:

**Web Share е preferred enhancement, не единствен share path.**

### 4.2 Clipboard

Current MDN evidence:
- `navigator.clipboard.writeText()` е widely available, но изисква HTTPS и може да бъде отказано;
- Clipboard read има по-различни browser/security restrictions.

B7 consequence:

**`Копирай линк/текст` е safe fallback с error handling; Facebook→Popitai не трябва да зависи от automatic clipboard read.**

### 4.3 Facebook Groups API

Current 2026 evidence remains consistent with Meta Graph API v19 deprecation:
- Groups API / `publish_to_groups` / `groups_access_member_info` were removed in April 2024;
- current third-party platform documentation still treats direct Facebook Group posting/read access as unavailable/no direct replacement for the old Groups integration.

B7 does **not** depend on automatic Facebook Groups API access.

Even if Meta changes APIs later, B7 MVP remains valid because user-controlled share/manual destination is the safer architecture.

---

## 5. HARD FACEBOOK BOUNDARY

V6 MVP must NOT promise:
- automatic posting to arbitrary Facebook Groups;
- listing the user’s Facebook Groups through Popitai;
- scraping group posts/comments/members;
- reading private group content;
- importing reactions/comments as Q&A answers;
- importing reactions as B6 recommendations;
- auto-posting as the user without a current supported Meta permission model;
- background Facebook automation hidden from the user.

If a later official Meta API safely supports a narrower case, it requires a new verified implementation review and does not silently expand B7.

---

## 6. FACEBOOK IS NOT A CONTENT OWNER

Canonical source remains the Popitai owner:
- Q&A → questions/answers canonical model;
- Firm/Restaurant → Businesses/Firms owner;
- Shop → Shops owner;
- Health/Info → specialized Health/Info owner;
- Listing/Job/Property → Listings owner;
- Event → Events owner;
- Article/Guide → approved editorial owner/registry;
- Info utility → Info owner.

Facebook post is distribution copy around a canonical link.

If Facebook copy differs from current Popitai content, Popitai canonical owner remains truth.

---

## 7. SHARE ELIGIBILITY — GLOBAL RULE

A public share action is enabled only when the source owner says content is publicly resolvable.

Required:
- approved/published/public state;
- canonical or stable compatibility URL exists;
- content is not hidden/rejected/pending;
- share payload is public-safe;
- content-type-specific freshness/status rules pass.

### Pending content

After user submits pending content:

Do NOT say:
`Сподели публичната публикация във Facebook`

because no public canonical destination exists yet.

Allowed success message:
`Изпратено е за преглед. След одобрение ще можеш да го споделиш.`

Exact notification after approval is B9/F implementation.

### Admin direct-public content

If protected owner legitimately publishes immediately and public read succeeds, share may become available immediately after successful write.

---

## 8. SUPPORTED POPITAI → FACEBOOK CONTENT TYPES

### 8.1 Canonical Q&A

Supported when question is approved/public canonical/independent.

Unanswered template intent:
`Помогни с отговор`.

Answered template intent:
`Виж въпроса и отговорите`.

Alias/duplicate loser shares resolve to canonical question.

### 8.2 Firms / Restaurants

Supported when Business target is approved/public.

Restaurant remains Firms-owned; no separate Facebook owner.

### 8.3 Shops

Supported when Shop is approved/public.

### 8.4 Health / provider-like Info

Supported when canonical Health surface is public and B3 trust/freshness permits safe preview.

Health share never implies medical outcome guarantee.

### 8.5 Listings

Supported only while listing is public under Listings owner.

Includes:
- ordinary listings;
- Jobs;
- Property;
- service offers/seeks.

Expired/hidden listing cannot keep generating active promotional share CTA.

### 8.6 Events

Supported for approved public Events.

Event preview must use owner current date/location/status and cannot call an ended event `предстоящо`.

### 8.7 Articles / Guides

Supported only when B4 readiness = `ПРОВЕРЕНО ГОТОВО`.

Draft/`ЗА ПРЕРАБОТКА` article is not official V6 share asset.

### 8.8 Info Lom utility pages/details

Supported only when page/detail is B3 canonical/share-eligible and preview is safe/fresh.

---

## 9. CONTENT TYPES NOT AUTOMATIC SHARE ASSETS

Do not create official share pack for:
- pending/rejected/needs_changes content;
- private profile/activity state;
- Admin/Moderator queue;
- arbitrary Search URL/query state;
- hidden Info record;
- stale high-risk fact snapshot;
- Q&A alias as independent page;
- raw recommendation relation;
- moderation note/report;
- unverified submission draft.

---

## 10. SHARE PAYLOAD PRINCIPLE

Every share pack is based on:
- canonical URL;
- safe title;
- safe short summary;
- optional safe image/preview;
- content-type CTA wording.

The social text is a **teaser**, not a copy of the source database.

---

## 11. CANONICAL URL — HARD RULE

Share always points to one stable Popitai destination.

Never use as Facebook canonical destination:
- `tarsene.html?q=...`;
- temporary filter state;
- pending preview;
- Admin route;
- internal moderation URL;
- duplicate Q&A alias as separate target;
- tracking-only redirect with no stable canonical resolution.

UTM/referral parameters may wrap the visit while canonical metadata still points to clean canonical URL.

---

## 12. SERVER-READABLE OPEN GRAPH CONTRACT

Dynamic social preview must not depend on client-only JavaScript.

Target B7 requirements for later V6-D implementation:
- real `<title>`;
- real public description;
- `link rel=canonical`;
- `og:title`;
- `og:description`;
- `og:url`;
- `og:type` where appropriate;
- `og:image` with stable accessible image endpoint;
- Twitter/social equivalent only if useful;
- public status check before rendering metadata.

This can be delivered by a lightweight server/edge render layer.

No full framework is required.

---

## 13. CURRENT STATIC DETAIL COMPATIBILITY

Current compatibility URLs remain usable until V6-D decides exact server/edge route.

Examples conceptually:
- current question `vapros.html?id=...`;
- current business `firma.html?id=...`;
- current listing `obqva.html?id=...`.

B7 does not break these routes.

Later share/SEO layer may:
- serve a shareable edge URL that canonicalizes to stable detail;
- or server-render metadata for the existing stable path.

Exactly one canonical destination per content item remains required.

---

## 14. FACEBOOK PREVIEW IS CONTROLLED BY CANONICAL PAGE METADATA

Do not rely on Facebook share URL query parameters to define title/description/image.

B7 target assumes preview comes from canonical page/server metadata.

Therefore:
- build correct OG metadata first;
- do not attempt to pass mutable title/phone/image through custom Facebook query parameters;
- share action mainly passes canonical URL.

Exact Meta share-dialog/sharer endpoint must be reverified against current official docs immediately before production implementation.

---

## 15. SAFE SHARE TEXT — GLOBAL RULES

Share text must:
- be short;
- accurately describe current content;
- avoid fake urgency;
- avoid fake `verified`/`official` wording;
- avoid exposing private data;
- avoid copying mutable local fact snapshots unless safe by owner/freshness contract;
- include canonical Popitai link;
- not claim popularity without real data.

---

## 16. MUTABLE FACT BOUNDARY IN SOCIAL COPY

### Wrong

`НОИ Лом: телефон X, работи до 17:30.`

if phone/hours are mutable Info-owned and Facebook may cache old preview.

### Better

`Как се пенсионира човек — стъпки и актуален местен контакт в Инфо Лом.`

### Health

Prefer:
`Проверена страница за д-р X / специалност Y в Попитай.Лом.`

Only if B3 reliability/freshness supports `Проверена` semantics.

Do not put changing schedule/contact into stable Facebook preview by default.

---

## 17. Q&A SHARE PACK

### Approved unanswered canonical

Title:
question title.

CTA concept:
`Можеш ли да помогнеш с отговор?`

Preview:
- title;
- category;
- neutral safe summary if appropriate;
- canonical link.

No `решено`, no fake answer count.

### Answered canonical

CTA concept:
`Виж мненията и отговорите.`

Do not say:
`Проверен отговор`, unless separate verified Info block is actually the source of that verified claim.

### Sensitive Q&A

Use minimum preview text; body excerpt can be omitted.

---

## 18. BUSINESS / RESTAURANT SHARE PACK

Safe default:
- entity name;
- public category;
- neutral local descriptor;
- canonical link.

Optional:
- public safe logo/cover.

Do not include:
- fake rating;
- `най-добър`;
- recommendation count unless B6 aggregate is valid and B8/B9 explicitly approve presentation;
- protected ranking language.

---

## 19. SHOP SHARE PACK

Safe default:
- shop name;
- category/type;
- short owner-approved/public offer description;
- canonical link/surface.

Do not copy every phone/hours field into stable social summary by default.

---

## 20. LISTING / JOB / PROPERTY SHARE PACK

Use current public listing owner fields.

Safe default:
- listing title;
- listing type/category;
- location if public and useful;
- short summary;
- canonical URL.

Do not put user private contact/account details in OG metadata.

### Jobs

Clearly say job intent:
- `Предлага работа`;
- `Търси работа`.

Do not confuse with Services.

### Property

Clearly preserve protected property type.

### Expiry

After listing expiration:
- page shows honest expired/unavailable state;
- promotional share CTA disabled;
- old Facebook link resolves safely, not to unrelated active listing.

---

## 21. EVENT SHARE PACK

Safe default:
- event title;
- current event date/time if public owner says current;
- location;
- canonical URL.

When event has passed:
- no `предстоящо` label;
- share CTA can be disabled or use archive wording if archive remains valuable;
- old link remains honest about event being over.

---

## 22. ARTICLE / GUIDE SHARE PACK

Only B4 `ПРОВЕРЕНО ГОТОВО`.

Share summary describes process value, not mutable current facts.

Example:
`Как да избереш майстор — практичен checklist преди ремонт.`

If guide links to Info, social preview says `актуалният местен контакт е в Инфо Лом`, rather than copying it.

---

## 23. INFO / HEALTH SHARE PACK

### Info

Use entity/utility name + what the page helps with.

### Health

Safe preview may include:
- public provider name;
- specialty/type;
- Popitai verified-info context if current B3 status allows.

Do not include:
- user health query;
- diagnosis;
- sensitive patient story;
- private appointment details;
- stale opening/contact detail by default;
- community recommendation as medical authority.

---

## 24. SHARE ACTION HIERARCHY

Target hierarchy:

### 1. Native `Сподели`

If `navigator.share` is available and payload is shareable:
- call only from direct user action;
- share title/text/url;
- let OS/user choose destination.

This can include Facebook/Messenger when installed/available, but Popitai does not control the target list.

### 2. Explicit `Сподели във Facebook`

Open a current supported Facebook share flow around canonical URL.

No heavy Facebook SDK required by default.

Exact production endpoint is verified against current Meta docs during V6-D/F.

### 3. `Копирай линк`

Use Clipboard `writeText()` if available/allowed.

### 4. `Копирай текст`

Optional content-type-specific safe share pack.

### 5. Manual fallback

If clipboard/share API fails:
- show selectable URL/text;
- explain `Копирай ръчно`;
- never leave button silently dead.

---

## 25. NO AUTO-OPEN SHARE WITHOUT USER ACTION

Share dialogs must not open:
- automatically after page load;
- automatically after moderation approval in background;
- from timer;
- from hidden redirect.

User chooses `Сподели`.

This also aligns with Web Share transient activation requirements.

---

## 26. NO FACEBOOK SDK BY DEFAULT

B7 MVP does not require loading Facebook JavaScript SDK on every page.

Reasons:
- performance;
- privacy/cookie surface;
- failure dependency;
- simple share does not require full social session integration.

If future feature genuinely requires SDK:
- separate privacy/performance review;
- consent impact review;
- current Meta docs verification.

---

## 27. FACEBOOK GROUP DESTINATION BEHAVIOR

Popitai does not pick arbitrary group programmatically.

User-controlled paths:
- native OS share target;
- Facebook’s own share interface if it offers a destination;
- copy link/text and paste manually in a group.

The user remains in control of:
- group selection;
- final post text;
- visibility;
- publication confirmation.

---

## 28. NO GROUP SCRAPING

B7 explicitly forbids MVP architecture that:
- logs into Facebook with user cookies to scrape Groups;
- headless-browses private groups;
- copies posts/comments/member data;
- works around removed official APIs;
- stores group feeds in Popitai.

This is not required to achieve the adoption loop.

---

## 29. FACEBOOK → POPITAI: USER-ASSISTED OWN-CONTENT FLOW

Target V6 feature:

`Вече го публикува във Facebook?`

User can:
1. paste/type **their own** post text;
2. optionally paste their own Facebook post URL as reference;
3. Popitai suggests category/subcategory/type/location;
4. user reviews/edits;
5. normal owner form validation/moderation applies;
6. user submits to Popitai.

No automatic Facebook fetch is required.

---

## 30. OWN-CONTENT / RIGHTS BOUNDARY

User-assisted Facebook import is for content the user has rights to submit.

UI should make clear:
- `Постави свой текст`;
- optional source link is a reference;
- do not paste private data or content you do not have permission to republish.

Popitai does not infer copyright permission from a Facebook URL.

---

## 31. FACEBOOK URL IS REFERENCE, NOT OWNER

If user supplies Facebook URL:
- it may be stored later as optional provenance/reference only if privacy/product contract allows;
- it does not replace Popitai canonical URL;
- Popitai does not depend on it remaining available;
- no automatic external comments/reactions are imported;
- no external post becomes canonical truth.

Exact storage is V6-D decision.

---

## 32. NO AUTOMATIC CLIPBOARD READ DEPENDENCY

User can manually paste Facebook text.

Popitai may later offer a user-triggered Paste convenience if browser supports it, but:
- must not require automatic `readText()`;
- must handle permission denial;
- manual input always works.

---

## 33. MEDIA FROM FACEBOOK

B7 MVP does not download/rehost Facebook images/video automatically.

If user wants media in Popitai:
- re-upload through correct Popitai owner/media flow;
- same image validation/moderation/copyright rules apply.

Future supported own-media transfer would require explicit API/right/performance contract.

---

## 34. EXTERNAL COMMENTS / REACTIONS

Facebook comments, likes and reactions are not Popitai Q&A/recommendation data.

Why:
- no guaranteed stable source identity under Popitai rules;
- no Popitai moderation state;
- no B5 canonical relation;
- no B6 resolved target relation;
- different privacy/context expectations.

Therefore:
- no automatic answer import;
- no automatic recommendation count;
- no automatic `Полезен` signal.

A user may manually write their own answer in Popitai under normal rules.

---

## 35. FACEBOOK PAGE VS GROUP

B7 does not need a blanket promise to auto-publish to either.

If future official API permits posting to a Popitai-controlled Facebook Page:
- it is a separate controlled channel integration;
- requires current permission/security review;
- does not imply Groups support;
- does not change canonical ownership.

MVP works without any automated Page/Group posting API.

---

## 36. CONTENT LIFECYCLE AFTER EXTERNAL SHARE

Facebook copies/previews can persist even after Popitai content changes.

Therefore canonical destination must handle lifecycle safely.

### Edited

Old shared link opens current approved version.

Share preview cache may be stale externally; this is why B7 avoids mutable critical facts in social summary.

### Hidden / rejected / removed

Old shared link opens safe unavailable state:
`Това съдържание вече не е публично.`

No private/rejected content leaks.

### Canonical Q&A merge

Old duplicate link resolves to canonical winner.

### Business/Shop hidden

Old link must not resurrect old phone/address from a hardcoded fallback.

### Info stale

Canonical page uses B3 stale behavior; social cached text does not override it.

---

## 37. PERMANENT DELETE / 404 / 410

Exact HTTP status behavior is V6-D.

B7 product rule:
- deleted/nonpublic URL does not redirect to unrelated entity;
- old external link gets honest safe state;
- canonical/private data is not exposed.

---

## 38. UTM / ATTRIBUTION CONTRACT

Facebook distribution should be measurable without leaking content.

Allowed conceptual attribution:
- `utm_source=facebook`;
- `utm_medium=social`;
- fixed campaign/channel identifier;
- content type key if non-sensitive.

Do NOT put in UTM/referrer helper params:
- raw search query;
- question body;
- health condition;
- email/phone;
- user/account id;
- moderation id;
- private category detail.

Canonical metadata remains clean canonical URL.

---

## 39. SHARE ANALYTICS — FUTURE SEMANTICS ONLY

No claim these exist today.

Possible future events:
- `share_open`;
- `share_native`;
- `share_facebook`;
- `copy_link`;
- `copy_share_text`;
- `facebook_import_start`;
- `facebook_import_submit`;
- `facebook_reference_added`.

Safe event dimensions:
- content_type;
- public category key;
- share method;
- success/failure class.

Do not send raw sensitive content.

---

## 40. SHARE SUCCESS SEMANTICS

`navigator.share()` resolving means content was passed to a share target according to browser semantics; it does not guarantee Facebook engagement.

Opening Facebook share interface means:
- share flow opened;
- not necessarily posted.

Analytics must not falsely label dialog open as `facebook_post_published`.

Without supported confirmation API, final external post state is unknown.

---

## 41. FAILURE STATES

Share UI must distinguish:
- share unsupported;
- permission blocked;
- user canceled;
- clipboard denied;
- canonical URL unavailable;
- content no longer public.

Fallback chain remains available where safe.

Do not show technical exception dumps to users.

---

## 42. OFFLINE BEHAVIOR

If offline:
- native share of URL may still be technically available on some devices, but Popitai cannot promise target behavior;
- copy link can still be offered when URL known;
- Facebook opening requires network;
- user receives clear `Няма интернет връзка` for network-dependent path.

No service worker dependency is assumed.

---

## 43. PWA / WEB SHARE TARGET

A2 found no current PWA owner.

Therefore Web Share Target is **optional later experiment**, not B7 MVP dependency.

Future experiment could allow:
`Share from another app → Popitai Add prefill`

Only after:
- manifest/service-worker design;
- installability QA;
- privacy/media handling;
- browser support review;
- B9/V6-D approval.

---

## 44. HEALTH / SENSITIVE CONTENT SAFETY

Health is fully included in the common V6 share/Facebook system, per user clarification.

But share pack must be conservative.

### Health entity

Can share public provider/profile page.

### Health Q&A

Share minimum title/category/link; body excerpt only if safe.

### Health guide

Can share when B4 ready; mutable clinical/local contact facts remain Info-owned.

### Never

- expose private symptom description from a draft;
- generate sensational diagnosis teaser;
- treat recommendation count as medical efficacy;
- publish stale phone/hours as permanent social truth;
- auto-post health content without user action.

---

## 45. CHILDREN / FAMILY / OTHER SENSITIVE TOPICS

The same conservative preview principle applies to:
- children;
- family situations;
- finances;
- employment disputes;
- personal property/security details.

Public page may contain more detail than the safe social preview.

Share metadata uses minimum necessary public context.

---

## 46. SHARE IMAGE CONTRACT

Target OG image can be:
- owner-approved public entity image/logo;
- article hero image;
- event public image;
- neutral Popitai branded fallback.

Do not use:
- private upload before moderation;
- sensitive Q&A attachment as automatic OG image;
- arbitrary external Facebook image;
- image whose owner/status is no longer public.

Fallback branded image must not imply verification/recommendation beyond actual status.

---

## 47. IMAGE PERFORMANCE

OG/social image generation must not add heavy runtime to normal page load.

Preferred:
- static optimized image;
- cached edge-generated image if later justified;
- no browser screenshot generation on every share click.

---

## 48. SHARE UI AFTER SUCCESSFUL POPITAI PUBLICATION

Target post-publication success block:

`Готово. Публикацията е видима в Попитай.Лом.`

Then:
- `Сподели`;
- `Facebook`;
- `Копирай линк`.

For pending:

`Изпратено за преглед.`

No public share CTA yet.

This preserves moderation truth.

---

## 49. PROFILE / MY ACTIVITY INTEGRATION

Later Profile can expose share action for user-owned content only when current owner says public.

Useful for:
- approved listing;
- approved question;
- approved business/profile;
- other share-eligible owner content.

Profile does not need to duplicate content to Facebook automatically.

---

## 50. RE-SHARE AFTER EDIT

If content was edited and returned pending under owner rules:
- share CTA is suspended until reapproved if public owner no longer exposes the edited state;
- previous external link shows last valid public/current safe state according to owner lifecycle;
- new draft text is never leaked through share preview.

---

## 51. FACEBOOK BRIDGE DOES NOT CHANGE QUOTAS

Sharing content:
- does not consume another Listing quota;
- does not create duplicate listing;
- does not create a second question;
- does not create second Shop/Firm/Health record.

Facebook→Popitai own-content import creates one normal Popitai submission and follows existing quota/owner rules where applicable.

---

## 52. FACEBOOK BRIDGE DOES NOT BYPASS MODERATION

A Facebook post URL or existing external publication is not proof that content should be approved.

Imported/pasted own text follows:
- auth;
- validation;
- owner status;
- moderation;
- quotas;
- protected rules.

`Публикувано във Facebook` is not an approval badge.

---

## 53. FACEBOOK BRIDGE DOES NOT BYPASS OWNER TYPES

If user pastes Facebook text:
- job → Listings Job flow;
- property → Listings Property flow;
- service → Listings/service flow;
- permanent firm → Firms flow;
- Shop → Shops specialized flow;
- Health provider correction/add → specialized Health/Info flow;
- Question → Q&A;
- Event → only real Event submit flow if/when separately approved.

No generic universal Facebook-import table.

---

## 54. AUTO-CLASSIFICATION IS SUGGESTION ONLY

Facebook→Popitai prefill may suggest:
- B1 category;
- subcategory;
- listing type;
- title;
- location.

User sees and confirms.

No hidden auto-submit.

No AI dependency is required for MVP; lightweight deterministic rules/Search taxonomy can start.

---

## 55. SECURITY BOUNDARY

Do not request Facebook credentials/passwords inside Popitai.

Do not store Facebook session cookies.

Do not use browser automation to act as user in Facebook Groups.

If future OAuth is justified for a supported feature:
- official Meta OAuth only;
- minimal scopes;
- explicit consent;
- token storage/security review;
- revocation path;
- separate V6-D approval.

MVP needs none of this for simple sharing.

---

## 56. CONSENT / TRACKING BOUNDARY

A plain outbound share link does not justify loading Facebook tracking SDK/pixel.

Any future Meta Pixel/ads integration is separate analytics/privacy scope.

Facebook Bridge MVP must not silently expand cookie/tracking surface.

---

## 57. ACCESSIBILITY

- real buttons/links;
- accessible names: `Сподели`, `Сподели във Facebook`, `Копирай линк`;
- status message after copy/share failure;
- keyboard accessible;
- no color-only state;
- focus returns sensibly after modal/share sheet;
- manual fallback URL is selectable.

---

## 58. MOBILE UX

Mobile is first-class:
- native `navigator.share` is preferred where supported;
- share sheet is compact;
- no three-step modal before system share;
- copy fallback always reachable;
- Facebook app/browser destination is chosen by user/system;
- no assumption user has Facebook app installed.

---

## 59. DESKTOP UX

Desktop where native Web Share may be unavailable:
- explicit Facebook link/action;
- copy link;
- copy text;
- optional QR only if later proven useful, not B7 requirement.

---

## 60. RENDER OWNERSHIP

Share UI has one owner/component per public detail/page shell.

Do not layer:
- old Listing share renderer;
- new global share renderer;
- MutationObserver patch
on the same root.

During implementation, existing share paths are consolidated into one explicit share module with owner-provided payload adapters.

Exact code architecture is V6-D/F.

---

## 61. OWNER-PROVIDED SHARE ADAPTER

Conceptually each content owner supplies safe public fields:
- canonical id/url;
- public status;
- safe title;
- safe summary;
- safe image;
- content type;
- freshness/expiry state where applicable.

Global share layer composes UI.

It does not query arbitrary private owner fields itself.

---

## 62. NO ALL-OWNER SHARE QUERY

Share action on one detail page reads only that item/owner context.

No need to load:
- all Businesses;
- all Info;
- all Q&A;
- all Listings
just to share one URL.

---

## 63. PERFORMANCE BUDGET

B7 target:
- vanilla JS;
- share module small and lazy/event-driven;
- no Facebook SDK default;
- no network call until Facebook action is clicked, except canonical owner data already needed for page;
- no social API polling;
- no crawler-specific heavy frontend bundle;
- OG generation server/edge/cache later.

---

## 64. CURRENT META ENDPOINT VERIFICATION GATE

Because Meta APIs/dialogs can change, exact Facebook share URL/dialog configuration is **not permanently hardcoded by this design document**.

V6-D/F must verify immediately before implementation:
- current official Meta sharing documentation;
- allowed share endpoint/parameters;
- current app-id requirement if any for selected method;
- current privacy/platform policies.

B7 product behavior does not depend on unsupported custom parameters.

---

## 65. FACEBOOK GROUPS RE-VERIFICATION GATE

Before any future automatic group integration is proposed:
- verify current official Meta APIs;
- prove supported permission/endpoint;
- prove group-admin/user consent model;
- security/privacy review;
- separate product approval.

Absent that proof:

**manual/user-selected sharing remains the only supported B7 group model.**

---

## 66. EXTERNAL PLATFORM FAILURE PRINCIPLE

If Facebook changes/breaks share endpoint:
- Popitai canonical page remains intact;
- native Share can still work where available;
- Copy link remains fallback;
- product does not lose the content itself.

This is a key reason Facebook is distribution, not owner.

---

## 67. NO FACEBOOK-ONLY CONTENT

Popitai should not create a state where:
- important Q&A answer exists only in Facebook comments;
- recommendation count depends on Facebook likes;
- listing details exist only in Facebook post;
- Health correction exists only in Facebook thread.

The product encourages users to return useful knowledge into the proper Popitai owner flow.

---

## 68. ADOPTION MESSAGE

The user-facing promise remains simple:

**`Публикувай веднъж в Попитай.Лом → сподели към Facebook.`**

Not:
`Свържи Facebook и ние ще управляваме групите ти.`

This is more realistic, safer and aligned with platform constraints.

---

## 69. NO PRODUCTION IMPLEMENTATION IN B7

B7 changes no:
- Facebook integration code;
- current share buttons;
- static/dynamic OG metadata;
- Worker/Edge route;
- schema/RLS;
- owners/statuses/moderation;
- quotas;
- ranking;
- Health data;
- Q&A canonical relation;
- recommendation relation;
- analytics/tracker;
- PWA/service worker.

Production impact: **NONE**.

---

## 70. B7 EXIT GATE — PASSED

B7 locks that:
1. Facebook is distribution only;
2. only public/approved canonical content is share-eligible;
3. pending content does not get fake public share CTA;
4. supported content types and lifecycle are explicit;
5. one stable canonical Popitai URL drives every share;
6. server-readable OG is required later for dynamic details;
7. mutable Info facts are not duplicated into stale social truth;
8. native Web Share is enhancement, not universal dependency;
9. Clipboard/manual fallback exists;
10. no Facebook SDK is required by default;
11. no automatic arbitrary-group posting/scraping is part of MVP;
12. Facebook→Popitai is user-assisted own-content paste/prefill, not scraping;
13. external comments/reactions do not become Q&A/recommendations;
14. social lifecycle safely handles edit/hide/expiry/merge;
15. UTM/analytics do not leak sensitive content;
16. Health/sensitive share preview is conservative;
17. PWA/share-target is optional later;
18. owner/moderation/quota/security boundaries remain;
19. Meta-specific endpoints are reverified immediately before implementation;
20. no schema/RLS/production code.

**B7 EXIT GATE: PASSED.**

---

## 71. EXACT NEXT TASK

# `STAGE V6-B8 — LOCAL RELEVANCE / RANKING / PROTECTED PRIORITY CONTRACT`

B8 must lock:
- intent relevance before popularity;
- exact owner-local vs cross-owner composition rules;
- protected Admin/Ivanov/boost priority adapter;
- location/Lom relevance;
- freshness/availability/status signals;
- B6 recommendation signal usage without trust inflation;
- Q&A answer/recency/usefulness boundaries;
- Article readiness/freshness influence;
- Health verified/reliability/freshness ranking;
- Shops/Events/Firms/Listings owner-local ordering;
- deterministic tie-breaking;
- no pay-to-rank implication unless separately approved/disclosed;
- no invented analytics popularity baseline;
- performance/query limits;
- explainability/test matrix;
- no schema/RLS/production implementation.

Required artifact:

`PUBLIC_PRODUCT_V6_B8_LOCAL_RELEVANCE_RANKING_PROTECTED_PRIORITY_CONTRACT.md`

Production impact after B7: **NONE**.
