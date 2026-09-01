# Попитай.Лом — V6-C VISUAL / INTERACTION PROTOTYPE

Статус: **SOURCE PROTOTYPE COMPLETE / VISUAL REVIEW GATE / NO PRODUCTION DEPLOYMENT**  
Branch: `v6-product-foundation-draft`  
Дата: 01.09.2026

Prototype files:
- `v6-prototype/index.html`
- `v6-prototype/prototype.css`
- `v6-prototype/prototype.js`

Тези файлове са изолирани. Production pages не ги зареждат и няма production deployment.

---

## 1. ЦЕЛ

C превежда B1–B9 от договори в една реална визуална/interaction система, преди да започне technical implementation design.

Prototype-ът не е screenshot-only mockup. Има interactive screen switching, Search states, Add sheet, specialized modals, Ask duplicate gate и responsive mobile layout.

---

## 2. GLOBAL VISUAL MODEL

### Brand direction

Използва съществуващата Popitai direction:
- тъмносин основен brand слой;
- бяло/светли content surfaces;
- син primary action;
- златист accent за важни discovery/action елементи;
- зелено за verified/Health trust слой;
- ясни neutral borders/backgrounds;
- големи readable mobile targets.

Не е копиран конкретен външен сайт.

### Locked navigation preserved

Site header в prototype пази canonical desktop IA:

`Начало | Обяви и услуги | Фирми | Инфо Лом | Статии | Още | Профил | + Добави`

Prototype screen switcher е отделен ясно маркиран control и не се представя като production navigation.

Mobile bottom navigation пази:

`Начало | Обяви | + | Инфо | Профил`

---

## 3. HOME PROTOTYPE

Order:
1. search-first hero `Какво търсиш в Лом?`;
2. compact explanation `Първо намираш. Ако не стига — питаш.`;
3. priority shortcuts;
4. `Открий в Лом`;
5. verified Info block;
6. community/Q&A block.

Initial shortcuts:
- Строителство и ремонти;
- Здраве и лекари;
- Работа;
- Автомобили;
- Имоти;
- Красота.

Mobile hides desktop-extra shortcuts and keeps clear `Всички категории` path.

No invented popularity count is shown.

---

## 4. COMMON CATEGORY SHELL

Construction prototype demonstrates common shell:
- breadcrumb;
- category title/context;
- one search field;
- subcategory chips;
- `Добави обява`;
- `Попитай Лом`;
- owner-grouped results;
- contextual guide;
- no giant generic `Услуги` wall.

Results keep type distinction:
- Firms;
- Listings;
- Q&A/guides secondary.

Protected example is shown only in relevant Construction/provider context.

---

## 5. HEALTH PARITY — CRITICAL USER CLARIFICATION

Health uses **the same category shell**:
- same breadcrumb hierarchy;
- same title/action layout;
- same search placement;
- same filter chips;
- same result-card rhythm;
- same mobile behavior;
- same Share/Facebook system later.

But content semantics remain specialized:
- group label `Проверена информация`;
- verified/freshness presentation;
- separate `Въпроси и мнения`;
- `Предложи лекар/практика` opens Health specialized prototype modal;
- `Предложи корекция` remains factual correction, not community post;
- no generic Firm/Listing bypass.

Current old Health UI is not visually frozen.

---

## 6. SEARCH STATES

Prototype contains three explicit states:

### Success

Owner-separated groups:
- Firms;
- Listings;
- Q&A;
- verified Info example where applicable.

Protected priority is shown only after relevance gate.

### True no-result

Shows:
`Попитай Лом`

and transfers visible question context to Ask prototype.

### Partial failure

Shows successful owner groups and an explicit partial warning.

Does not falsely say `Няма резултат`.

---

## 7. ASK / DUPLICATE STATE

Ask prototype includes:
- visible prefilled question;
- category/leaf;
- description;
- 1–2 possible canonical matches;
- explicit `Не е същото — продължи` choice;
- validation/status message;
- pending moderation explanation.

This visualizes B5/B9 instead of creating duplicate questions silently.

---

## 8. GLOBAL ADD SHEET

Main options:
1. Добави обява;
2. Добави фирма;
3. Задай въпрос.

Specialized actions are contextual:
- Health modal;
- Shop modal.

No `Добави събитие` option.

Prototype Add layer has modal focus logic/Escape/backdrop/return-focus behavior modeled after current good shell behavior.

---

## 9. LISTING PREFILL PROTOTYPE

Prototype modal demonstrates public context:
- `Предлагам`;
- `Строителство и ремонти`;
- `ВиК`.

This corresponds conceptually to current proven V3:
`main=maistori` + `subcategory=ВиК` + `intent=offer`.

It does not expose protected DB/status fields.

---

## 10. HEALTH / SHOP SPECIALIZED MODALS

Health prototype fields:
- doctor/dentist/vet type;
- name;
- specialty;
- phone/address;
- explicit submit for approval.

Shop prototype:
- name;
- shop category;
- phone/address;
- explicit submit for verification.

Both visually join the same V6 system without losing owner separation.

---

## 11. PENDING VS PUBLIC / SHARE

Prototype states show the distinction:

### Pending

`Изпратено за преглед`

No Facebook share CTA.

### Public/approved

Canonical URL exists, then:
- `Сподели`;
- `Копирай линк`;
- Facebook-oriented action.

No external share action changes owner publication status.

---

## 12. EVENTS

Prototype explicitly shows:

**Няма fake `Добави събитие`.**

Available action while no public Event owner exists:
`Попитай за събитие`.

---

## 13. MOBILE

At <=720 px:
- desktop nav hides;
- canonical 5-item bottom nav appears;
- Home search stacks;
- category actions become compact two-column controls;
- horizontal filters remain touch-scrollable;
- result actions wrap below content;
- forms become one-column;
- sheets/modals become bottom-sheet style;
- prototype switcher remains separately marked;
- fixed bottom nav spacing is reserved.

---

## 14. ACCESSIBILITY / INTERACTION SOURCE CHECK

Prototype source includes:
- skip-independent semantic H1 structure per screen;
- labels for searches/forms;
- dialog roles;
- focus trapping in prototype modals;
- Escape close;
- return focus;
- focus-visible outline;
- live status/toast messaging;
- no click-only div as primary CTA;
- responsive touch layout.

A later real browser/mobile QA is still required before production implementation.

---

## 15. PROTOTYPE-SPECIFIC QA FIX FOUND AND CLOSED

Initial prototype draft incorrectly reused site desktop nav as the prototype screen switcher.

This was rejected during C source QA because B1 locks the global navigation.

Fix:
- canonical site nav restored in the visible header;
- prototype screen switcher moved to a separate explicit `Преглед на прототипа` bar;
- mobile `Профил` no longer routes falsely to Ask;
- non-implemented demo actions now return an explicit prototype status/toast instead of silent dead clicks.

This is exactly why C precedes production code.

---

## 16. CURRENT C STATUS

### Completed

- coherent source-level visual system;
- interactive desktop/mobile prototype files;
- B1–B9 main states represented;
- Health parity represented correctly;
- Add/Search/Ask/share/pending states represented;
- prototype isolated from production;
- source-level navigation contradiction found and corrected.

### Still required for final C approval

- human visual inspection of actual rendered prototype;
- real desktop viewport check;
- real phone viewport check;
- confirm density/order/copy feels right;
- confirm Home first impression and category shell direction before V6-D technical implementation design.

Therefore C is at:

**SOURCE PROTOTYPE COMPLETE → VISUAL REVIEW GATE.**

It is not yet a production-approved visual spec.

---

## 17. PRODUCTION IMPACT

**NONE.**

No production HTML/CSS/JS page references `v6-prototype/`.
No schema/RLS/role/quota/moderation/protected ranking change.
No deployment.

---

## 18. NEXT AFTER VISUAL REVIEW

If C visual direction is approved/refined, next stage is:

# `V6-D — TECHNICAL DESIGN / SCHEMA / RLS / INDEX / MIGRATION / SEO RENDERING / PERFORMANCE`

No V6 production implementation begins before D + E gates.