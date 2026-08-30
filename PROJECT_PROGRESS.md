# Попитай.Лом — ТЕКУЩ CHECKPOINT

Актуализирано: 31.08.2026

## 1. ПРАВИЛА ПРЕДИ РАБОТА

Ред на четене:
1. `PROJECT_RULES_00_READ_FIRST.md`
2. `PROJECT_RULES_PROTECTED_CORE.md`
3. `PROJECT_RULES_ADMIN_MODERATOR.md`
4. `PROJECT_RULES.md`
5. `PROJECT_RULES_RENDER_OWNERSHIP.md`
6. `PUBLIC_MARKETPLACE_V3_APPROVED_SPEC.md` за marketplace/public navigation
7. `PUBLIC_SITE_INFORMATION_ARCHITECTURE_APPROVED_SPEC.md` за останалата public IA, доколкото не противоречи на Marketplace V3
8. `ADMIN_PANEL_V2_APPROVED_SPEC.md` за Admin/Moderator панела.

Marketplace V3 е каноничният public marketplace presentation source за production. LOCKED backend/roles/ownership/moderation/quota/status правила остават с по-висок приоритет.

**За V6 design track след горния ред задължително се чете `PUBLIC_PRODUCT_V6_MASTER_CONTROL.md`.** Supporting V6 документи се четат според exact task.

## 2. ЗАЩИТЕНО ЯДРО — НЕПРОМЕНЕНО

Marketplace V3 и V6 design track не заменят и не променят firm owner, protected listings write/edit/media owner, RLS/schema/ownership/approval/status/quota semantics, Admin/Moderator boundaries, protected construction search / `Иванов Ремонти` priority, boost/admin priority ordering или специализираните Shops/Health/Info owners без отделно изрично approval.

## 3. MARKETPLACE V3 — PRODUCTION

Статус: **PRODUCTION PASS**.

Основната реализация е merge-ната в `main` чрез **PR #106 — Unify public marketplace as Обяви и услуги**, merge commit `57997443b0539596425a5f8e375c56153d079f6d`.

Search-layout hotfix е merge-нат чрез **PR #107 — Fix Marketplace V3 search form layout**, final production commit `6155921d6c76caaab3639bac6b2fb62c79d8bd4e`.

Canonical shell за production:

Desktop:
`Начало | Обяви и услуги | Фирми | Инфо Лом | Статии | Още ▼ | Профил | + Добави`

Mobile:
`Начало | Обяви | + | Инфо | Профил`

`kategorii.html` е backward-compatible redirect към `obyavi.html`, не втори marketplace hub.

Current production V3 groups остават действащи, докато няма финален approved V6 spec. V6 може да ги supersede-не само след B/C/D/E gates.

## 4. PRODUCTION IMPLEMENTATION / REGRESSION — НЕПРОМЕНЕНО

`marketplace-v3.js` е presentation/orchestration + compatibility mapping; `marketplace-v3.css` е responsive V3 visual layer; `public-shell-v1.js` пази runtime shell/accessibility; `public-shell-template-v1.json` + sync script са canonical shell; `category-listings-v1.js` е read-only thematic owner; `supabase-listings.js` остава protected write owner.

Production QA за V3 е минал по записания scope без test writes. Protected schema/RLS/roles/ownership/moderation/quota/Admin/Moderator логика не е променяна от V6 planning track.

## 5. ЛИМИТИ — НЕПРОМЕНЕНИ

До 5 нови лични и до 5 нови фирмени обяви на одобрена фирма за календарен месец; квотите са отделни; edit не използва нова квота; подадена нова обява използва квота независимо от последващо отхвърляне/изтриване; неизползвана квота не се прехвърля; admin профилите нямат тези лимити.

## 6. ADMIN / MODERATOR — НЕПРОМЕНЕНО PRODUCTION

Admin/Moderator Panel V2 остава текущият approved operational model. Role boundaries, self-moderation protection, Admin-only permanent delete и Admin-only role/access management не са променяни.

V6 нови canonical/relation/freshness states по-късно трябва да се приобщят към този model, не да създават втори admin system.

## 7. V6 DESIGN TRACK

Branch: `v6-product-foundation-draft`  
Production impact от този planning track: **NONE**.

Създадени planning/control документи:
- `PUBLIC_PRODUCT_V6_WORKING_MODEL.md`;
- `PUBLIC_PRODUCT_V6_GUARDRAILS.md`;
- `PUBLIC_PRODUCT_V6_CONTENT_SEO_STRATEGY.md`;
- `PUBLIC_PRODUCT_V6_CONTENT_INVENTORY_RULE.md`;
- `PUBLIC_PRODUCT_V6_INFO_LOM_CORE_STRATEGY.md`;
- `PUBLIC_PRODUCT_V6_ADOPTION_LAUNCH.md`;
- `PUBLIC_PRODUCT_V6_INTERACTION_FORM_LINK_CONTRACT.md`;
- `PUBLIC_PRODUCT_V6_CURRENT_TARGET_OWNER_MAP.md`;
- **`PUBLIC_PRODUCT_V6_MASTER_CONTROL.md` — current canonical roadmap/handoff/exact-task source.**

V6 direction: запазваме protected owner-ите и добавяме по-добър search/relationship/content/distribution layer над тях. `Инфо Лом` е authoritative knowledge/SEO/trust pillar; Q&A е contextual community memory; Facebook е distribution; Articles не дублират authoritative data; performance е lightweight-by-default; forms/buttons/links се проверяват като пълен user flow.

## 8. V6 STAGE STATUS

### `V6-0 — CONTROL / CONTINUITY`
**DONE.**

### `V6-A1 — CURRENT → TARGET OWNER / RELATIONSHIP MAP`
**DONE FOR STATIC PLANNING EVIDENCE.**

Основен artifact:
`PUBLIC_PRODUCT_V6_CURRENT_TARGET_OWNER_MAP.md`

A1 установи и записа owner/data/moderation/search/admin/interaction/SEO/performance ролите за shell/home, taxonomy, search, Info, Articles, Q&A, Firms, Listings, Masters, Cars, Services/Jobs, Property, Health, Shops, Restaurants, Events, Profile, Admin, dynamic detail/share/PWA/Analytics current evidence.

Ключови A1 findings:
- backend owner architecture е силна и не трябва да се заменя с monolithic model;
- `Работа` и `Услуги` в текущата presentation са смесени: `rabota.html` е Services, а Jobs вече е protected Listing category;
- `Имоти` вече има Listing semantics, но не dedicated write owner/page;
- Restaurants в момента използват Firms owner;
- Info/Health/Shops са специализирани owners и не се bypass-ват;
- Home source още съдържа стара parallel category presentation и runtime decoration layering;
- има legacy search в `script.js` и по-нов `public-search-v1.js`, но static audit не доказа, че по-новият файл е активиран live — това се проверява в A2;
- dynamic detail pages за Question/Listing/Firm стартират с generic static metadata, което подкрепя нуждата от lightweight server-readable share/SEO layer;
- current interaction ambiguities са записани за A2, без ad-hoc production fixes.

## 9. EXACT NEXT TASK

# `STAGE V6-A2 — EVIDENCE / COVERAGE / RUNTIME BASELINE`

Следващият чат не започва production code и не преотваря A1.

Редът е:
1. prove active global Search runtime owner;
2. Info Lom coverage/freshness/SEO inventory;
3. Article/Guide inventory по readiness rule;
4. current dynamic detail SEO/share verification;
5. read-only verification на Q&A Moderator self-content и Moderator own-business edit uncertainty;
6. current PWA/service-worker/manifest verification;
7. identify real Popitai analytics source and baseline, ако съществува;
8. create `PUBLIC_PRODUCT_V6_A2_EVIDENCE_BASELINE.md`;
9. update Master Control + this checkpoint.

След A2 → **V6-B PRODUCT CONTRACTS**: final taxonomy/IA, Search, Info/Content, Q&A canonical, recommendations, Facebook Bridge, ranking/freshness, exact interaction contracts.

## 10. РАБОТЕН РЕЖИМ / HANDOFF

Безопасните read-only/design стъпки се изпълняват автономно. При protected/risky/new business decision се спира преди промяната. Не се казва „готово“, ако stage exit criteria не са изпълнени; production feature не е готов преди live verification.

Нов чат:
- чете rules → progress → Master Control;
- работи по exact next task;
- не пита „какво правехме?“ ако е записано;
- не започва стар одит наново;
- не използва production bug като повод да нулира V6 roadmap.

**Текущ checkpoint:** V6-A1 complete; V6-A2 is next.  
**Production:** untouched by this V6 planning work.
