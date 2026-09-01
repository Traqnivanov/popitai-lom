# Попитай.Лом — V6-C HOME ARCHITECTURE DECISION

Статус: **VISUAL DIRECTION / PROTOTYPE ONLY / NO PRODUCTION CODE**  
Branch: `v6-product-foundation-draft`  
Актуализирано: 01.09.2026

Този документ заключва цялостната информационна и визуална архитектура на най-важния екран във V6 — Home. Целта е да няма пачване на отделни блокове без обща логика.

Production impact: **NONE**.

---

## 1. HOME JOB

Home има една основна работа:

**за няколко секунди човек да разбере какво може да намери в Попитай.Лом и да започне правилното действие.**

Home НЕ е презентационна страница, onboarding tutorial или дълъг каталог.

В същото време Home трябва да показва, че Попитай.Лом има не само обяви/фирми, а и собствен полезен knowledge layer — проверена информация, практични ръководства и community Q&A.

---

## 2. DESIGN PRINCIPLES

1. Search е първата задача и остава най-силният елемент above the fold.
2. Основните категории се виждат веднага след Search, без цял екран обяснение между тях.
3. Mobile вертикалното пространство е скъпо: големи декоративни cards се заменят с по-плътни, сканиращи се структури.
4. Home показва входове, не всички данни от всеки owner.
5. Verified Info, Marketplace/Entities, Articles/Guides и Community са ясно различими, но визуално принадлежат на една система.
6. Health участва в същия category shell и Home hierarchy като останалите категории; specialized owner/trust остава отдолу.
7. Единен SVG icon language; без смесени emoji/system glyphs като финална визия.
8. Copy е професионален, кратък и спокоен; без евтини сравнения, нападки или рекламни клишета.
9. Bottom nav остава стабилен и не конкурира content hierarchy.
10. Prototype controls не трябва да изглеждат като реална продуктова навигация.
11. **Всеки Home target отваря точно своя content context.** Няма placeholder routing, при което `Работа` отваря `Строителство`, `Магазини` отваря Add форма или `Събития` отваря generic state screen.
12. Articles/Guides са key acquisition/share layer, а не optional decoration.

---

## 3. CANONICAL MOBILE ORDER

### A. Compact header
- logo/brand;
- реалната mobile nav остава долу;
- няма втори product-looking prototype navigation bar в content flow.

### B. Hero / Search
Above the fold:
- eyebrow: `Лом на едно място`;
- H1: `Какво търсиш в Лом?`;
- кратко professional subcopy;
- голям search field + primary `Търси`;
- до 3 compact suggestion chips.

Target copy:
`Намери проверена информация, местни услуги, работа, имоти, фирми и полезни отговори — всичко за Лом на едно място.`

Не се показва giant how-it-works card.

### C. Main categories — immediately after Search
Heading: `Основни категории`.

Initial mobile 2x2:
1. Строителство и ремонти
2. Здраве и лекари
3. Работа
4. Автомобили

Compact CTA: `Всички категории`.

`Всички категории` отваря реалната 16-category V6 система, не произволна примерна категория.

### D. Discover Lom
Heading: `Открий в Лом`.

Targets:
- Магазини;
- Заведения;
- Фирми;
- Събития.

Всеки target отваря своя owner-aware discovery context:
- Shops → Shops;
- Restaurants → Firms/restaurant presentation owner;
- Firms → Firms;
- Events → Events.

Няма fake public `Добави събитие`.

### E. Verified local information
Heading: `Проверена информация`.

Targets:
- Здраве и лекари;
- Институции;
- Транспорт;
- Комунални.

Home показва кратък вход. Mutable addresses/phones/hours/status не се копират в Home. Те остават при verified Info owner.

### F. Useful Guides / Articles — REQUIRED
Heading: `Полезни ръководства`.

Това е **основен Home layer**, не optional footer content.

Цели:
- полезност и direct habit;
- Google/SEO acquisition;
- Facebook/social sharing;
- вътрешна връзка между process question → authoritative local owner → Q&A/next action.

Initial prototype candidates:
- `Как да се пенсионираш в Лом`;
- `Как се подменя лична карта в Лом`;
- `Как да подадеш сигнал до община или институция`.

Card presentation:
- topic label;
- ясна article title;
- една кратка линия какво ще научиш;
- whole card is target;
- no fake popularity count.

Click opens a real article/guide detail prototype containing:
- intro;
- structured steps/sections;
- explanation of what to prepare/do/check;
- current authoritative owner/source relationship;
- local Info handoff for mutable contacts/hours;
- related next actions;
- Share / Copy Link position.

### CRITICAL B4 publication gate

Prototype may use candidate article titles to validate layout and flow.

**Production Home/Search/SEO/share may feature only `ПРОВЕРЕНО ГОТОВО`.**

`Как се пенсионира човек` currently remains `РАЗРАБОТВАНО`; prototype presence does not reclassify it as ready.

Article explains process. It does NOT become a second mutable-fact owner.

Example:
- pension guide explains steps/documents/process;
- НОИ/official source owns current pension rules;
- Info Lom owns current local contact/address/hours where applicable.

### G. Community
Heading: `Въпроси и препоръки`.

Show max 2 useful canonical Q&A previews on mobile.

CTA `Виж всички въпроси` opens Q&A context/list; it does **not** jump directly to a new-question form. From Q&A the user can choose `Задай въпрос`.

---

## 4. CANONICAL HOME FLOW

`Search → Main categories → Discover Lom → Verified Info → Useful Guides → Q&A`

Why Guides before Q&A:
- authoritative/curated utility is presented before community opinion;
- guides are a key SEO/share acquisition surface;
- Q&A remains available but does not visually replace verified/process knowledge.

---

## 5. EXACT DESTINATION CONTRACT

A Home card is not considered visually reviewed if its click destination is unrelated.

Required mapping examples:
- `Строителство и ремонти` → Construction category context;
- `Здраве и лекари` → Health common V6 shell + verified owner;
- `Работа` → Jobs/Listings context;
- `Автомобили` → Cars/services/listings context;
- `Имоти` → Property/Listings context;
- `Красота` → Beauty provider/listing context;
- `Магазини` → Shops discovery;
- `Заведения` → restaurant/Firms discovery;
- `Фирми` → Firms discovery;
- `Събития` → Events discovery;
- `Институции` → verified Institutions Info;
- `Транспорт` → verified Transport Info;
- `Комунални` → verified Utilities Info;
- guide title → corresponding guide detail;
- `Виж всички въпроси` → Q&A list/context.

Prototype data may be static, but **semantic destination must be correct**.

---

## 6. WHAT IS REMOVED FROM MOBILE HOME

- giant how-it-works/tutorial card;
- large explanatory trust block;
- oversized Discover cards;
- oversized verified Info cards;
- mixed emoji icon styles;
- duplicated headings that say the same thing;
- repeated `Разгледай` buttons when whole item is navigational;
- prototype switcher presented as product navigation;
- generic placeholder destinations for unrelated sections.

Trust is communicated through verified labeling, source ownership and correct content boundaries.

---

## 7. DESKTOP ADAPTATION

Same information order, not a different product.

Desktop:
- wider but restrained Search;
- 6 initial category cards possible;
- Discover/Verified use denser grids;
- Guides may show 3 cards in one row;
- Community follows Guides or sits in a balanced lower layout only if hierarchy remains unambiguous;
- no giant filler panels.

Mobile remains the strict density baseline.

---

## 8. ICON SYSTEM

Target:
- outline SVG set;
- consistent stroke width, optical size and container;
- subtle category accents allowed;
- no platform emoji dependency.

---

## 9. COPY SYSTEM

Approved tone:
- clear;
- professional;
- local;
- confident;
- no hype;
- no condescension;
- no cheap comparison with Facebook or old posts.

Prefer:
- `Основни категории`
- `Открий в Лом`
- `Проверена информация`
- `Полезни ръководства`
- `Въпроси и препоръки`

Avoid:
- `Най-полезните входове`
- `без да ровиш...`
- `хаос`
- `по-добре от Facebook`
- cheap promotional phrasing.

---

## 10. ABOVE-THE-FOLD TARGET

On a typical ~700px high Android viewport, before/near first scroll:
1. brand/header;
2. Hero title;
3. search;
4. suggestion chips;
5. start of `Основни категории`.

The user should not spend the first scroll reading how the site works.

---

## 11. DENSITY TARGET

Relative to C prototype v1:
- Hero materially shorter;
- category cards ~25–35% lower on mobile;
- Discover ~35–45% denser;
- Verified Info uses compact rows;
- Guides use compact title-led cards;
- Community max 2 previews;
- clear group spacing without full-screen cards.

No hard pixel values are locked until rendered review.

---

## 12. RENDER / INTERACTION RULE

The C prototype must also respect the product rules enough to be reviewable:
- one renderer owns each rendered root;
- dynamic prototype destination uses one dedicated renderer/root;
- no two screens render active at once;
- links/actions have correct semantic destination;
- prototype-only content is explicitly distinguishable from production truth.

---

## 13. C EXIT CHECK FOR HOME

Home is not ready for approval until:
- first viewport is focused;
- Search is unmistakably primary;
- categories appear quickly;
- no tutorial interrupts discovery;
- SVG language is consistent;
- mobile density is materially improved;
- copy passes V6 tone rule;
- Health is structurally equal while owner remains specialized;
- Info / Guides / Q&A remain distinct content types;
- Guides are visibly discoverable lower on Home;
- article click opens a meaningful full guide layout;
- every major Home card opens the correct semantic context;
- prototype controls do not distort product review.
