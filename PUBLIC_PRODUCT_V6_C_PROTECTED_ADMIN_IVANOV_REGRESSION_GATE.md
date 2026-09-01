# Попитай.Лом — V6-C PROTECTED ADMIN / IVANOV REGRESSION GATE

Статус: **LOCKED MANDATORY COMPANION TO V6-C FULL-SITE BLUEPRINT**  
Branch: `v6-product-foundation-draft`  
Дата: 01.09.2026

Production impact: **NONE**.

Този gate е задължителна част от `PUBLIC_PRODUCT_V6_C_FULL_SITE_INTERFACE_BLUEPRINT.md`.

**V6-C не може да бъде приет за завършен, а V6-D/E не могат да бъдат приети за безопасна реализация, ако protected Admin / Firms / Listings / Construction / Ivanov логиката не е представена и regression-проверена.**

При конфликт:

**PROJECT_RULES_PROTECTED_CORE.md > PROJECT_RULES_ADMIN_MODERATOR.md > B8 protected ranking contract > този gate > prototype/visual decisions.**

---

## 1. ОСНОВНО LOCKED ПРАВИЛО

V6 е нов presentation/orchestration layer. Той може да обнови:
- визуалния shell;
- картите;
- detail layout-а;
- формите като UX/presentation;
- навигацията в рамките на вече одобрената IA;
- search presentation;
- mobile/desktop interaction patterns.

Но V6 **НЕ МОЖЕ** като страничен ефект да превърне Admin фирма, Admin обява, protected Construction/Ivanov резултат или expanded firm profile в обикновен стандартен запис.

Запазваме правата, owner semantics, direct-publish exceptions, quotas/exceptions, edit/approval flow, protected ranking и връзките между protected modules.

---

## 2. ADMIN FIRM — MUST PRESERVE

При реалната V6 интеграция трябва да останат LOCKED:
- Admin firm ownership semantics;
- активна Admin фирма получава approved expanded access според съществуващото правило;
- Admin firm / approved Admin expanded-profile промени могат да publish-ват директно според LOCKED правилата;
- Admin има protected management/edit capabilities, които normal user и Moderator не получават;
- expanded profile capabilities не се премахват само защото V6 използва нов detail layout;
- logo/gallery/cover/contact/CTA/expanded sections остават налични според реалния owner record;
- protected relationships към Listings / Construction / SEO routes не се прекъсват.

V6 prototype може да покаже representative Admin firm state, но не може да измисля нови Admin права.

---

## 3. NORMAL FIRM — MUST REMAIN DIFFERENT

Обикновена фирма не наследява Admin exception-ите.

Запазват се:
- ownership checks;
- allowed owner edit fields;
- approval/pending/returned flow там, където е приложим;
- last approved public version, когато редакция чака проверка;
- current firm/listing quotas;
- current image limits;
- expanded access само ако е предоставен по съществуващото protected правило.

**Visual parity ≠ permission parity.**

---

## 4. ADMIN LISTINGS — MUST PRESERVE

При Listings V6 трябва да пази:
- Admin-created listing direct-publish behavior;
- Admin listing/image quota exception;
- Admin owner priority в owner-native ordering след relevance gate;
- Admin edit/management capabilities според LOCKED core;
- валидните връзки към Firm / Construction / category context.

Normal user/normal firm Listings не получават тези exception-и.

---

## 5. NORMAL USER / NORMAL FIRM LISTINGS — MUST PRESERVE

Запазват се approved production rules, включително:
- personal monthly quota;
- separate firm monthly quota;
- ordinary firm image limit;
- moderation/pending requirements;
- edit/resubmit/status behavior;
- owner/author checks.

V6 UX може да показва quota/state по-ясно, но не го променя без отделно одобрение.

---

## 6. CONSTRUCTION / IVANOV PROTECTED PRIORITY — B8 LOCK

Ranking target остава:

`eligibility → intent/owner fit → relevance → protected priority → owner-native ordering → secondary signals`

За релевантна Construction/provider задача:
1. резултатът първо трябва реално да е релевантен;
2. protected Ivanov/Admin result запазва protected позицията си според LOCKED/B8 semantics;
3. останалите релевантни Firms/Listings следват owner-native ordering;
4. recommendation/community сигнали не могат да изместят protected boundary;
5. Q&A/Articles остават secondary според Search V6 composition.

Примерни protected provider intents:
- `ремонт баня`;
- `бояджия Лом`;
- `шпакловка майстор`;
- `ВиК майстор`.

---

## 7. КОГА PROTECTED PRIORITY НЕ ТРЯБВА ДА ПРЕВЗЕМА РЕЗУЛТАТА

Protected priority не е глобален override.

Трябва да останат верни:
- `ВиК авария телефон` → verified authoritative Info може да е пред provider results;
- exact navigational query за друга конкретна фирма → exact фирмата трябва да може да бъде първият правилен резултат;
- unrelated category/query → Ivanov/Admin не се вкарва изкуствено;
- safety/official factual intent → B2/B3 authoritative precedence остава.

Това пази protected логиката силна, но релевантна.

---

## 8. PROTOTYPE REPRESENTATION REQUIREMENT — V6-C

Преди V6-C да се приеме, full-site prototype/review трябва концептуално да покаже поне:

### A. Normal firm state
- стандартен approved firm profile;
- standard owner actions;
- normal edit/moderation semantics.

### B. Admin / protected expanded firm state
- expanded profile presentation;
- protected/public Admin semantics са отбелязани в review documentation, без технически жаргон в user-facing UI;
- V6 layout не губи expanded sections/actions.

### C. Normal listing state
- pending/approved/edit-resubmit lifecycle;
- normal limits/moderation semantics.

### D. Admin listing state
- direct-publication exception represented in QA state matrix;
- protected owner ordering preserved conceptually.

### E. Construction/Ivanov result example
- relevant Ivanov protected Firm/Listing appears at protected position only after relevance gate.

Потребителят не трябва да вижда вътрешни labels като `admin priority`, `protected owner`, `authoritative owner` като продуктова терминология. Gate-ът проверява поведението, не налага технически copy в UI.

---

## 9. D/E IMPLEMENTATION REGRESSION MATRIX — MANDATORY

Преди реална V6 integration/merge трябва да има целеви проверки поне за:

| Scenario | Expected |
|---|---|
| Admin creates firm | запазва Admin/expanded/direct-publish semantics |
| Normal user creates firm | normal moderation/ownership flow |
| Admin edits protected/expanded firm | allowed protected flow, без downgrade |
| Normal owner edits firm | only allowed fields; approval semantics preserved |
| Moderator-owned firm/content | follows locked non-Admin owner flow |
| Admin creates listing | direct publish + Admin exceptions |
| Normal personal listing | normal quota + moderation |
| Normal firm listing | separate firm quota + image limit + moderation |
| Construction provider query | relevance first, then protected Ivanov/Admin priority |
| Exact query for another firm | exact relevant entity not hijacked |
| Official/safety Info query | verified Info precedence preserved |
| Search mixed results | protected rules act inside correct owner/result family |
| Firm ↔ Listings relationship | links/data ownership preserved |
| Construction routes | protected route/SEO relationships preserved |

Failure in any protected row blocks production rollout until resolved or explicitly re-approved by the user.

---

## 10. NO SILENT REFACTOR

During V6-D/E it is forbidden to:
- replace Admin logic with generic role checks for convenience;
- normalize Admin and Moderator into one staff behavior;
- remove direct-publish exceptions as a side effect of a new form/controller;
- reset quotas/image limits while changing form UI;
- copy protected ranking into a new Search engine with different semantics;
- remove expanded firm data because a new V6 card/detail template does not yet render it;
- merge Construction into generic Services in a way that loses protected behavior;
- create parallel owner records for Ivanov, Firms or Listings.

If implementation requires changing any of these LOCKED semantics, stop and request explicit approval before the change.

---

## 11. EXIT RULE

This gate remains **OPEN** through V6-C and V6-D.

It closes only when:
1. V6-C full-site prototype represents the protected flows sufficiently for UX review;
2. V6-D technical design maps each protected behavior to its implementation owner;
3. V6-E implementation/regression proves no protected behavior was lost;
4. user-approved changes, if any, are recorded explicitly.

Until then, `Admin / Ivanov / Construction protected parity` remains a mandatory outstanding checkpoint.

Production impact of this document: **NONE**.
