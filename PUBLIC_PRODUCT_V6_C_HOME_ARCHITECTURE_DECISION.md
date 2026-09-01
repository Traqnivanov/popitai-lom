# Попитай.Лом — V6-C HOME ARCHITECTURE DECISION

Статус: **VISUAL DIRECTION / PROTOTYPE ONLY / NO PRODUCTION CODE**  
Branch: `v6-product-foundation-draft`  
Дата: 01.09.2026

Този документ заключва цялостната информационна и визуална архитектура на най-важния екран във V6 — Home. Целта е да няма пачване на отделни блокове без обща логика.

Production impact: **NONE**.

---

## 1. HOME JOB

Home има една основна работа:

**за няколко секунди човек да разбере какво може да намери в Попитай.Лом и да започне правилното действие.**

Home НЕ е презентационна страница, onboarding tutorial или дълъг каталог.

---

## 2. DESIGN PRINCIPLES

1. Search е първата задача и остава най-силният елемент above the fold.
2. Основните категории се виждат веднага след Search, без цял екран обяснение между тях.
3. Mobile вертикалното пространство е скъпо: големи декоративни cards се заменят с по-плътни, сканиращи се структури.
4. Home показва входове, не всички данни от всеки owner.
5. Verified Info, Marketplace/Entities и Community са ясно различими, но визуално принадлежат на една система.
6. Health участва в същия category shell и home hierarchy като останалите категории; specialized owner/trust остава отдолу.
7. Единен SVG icon language; без смесени emoji/system glyphs като финална визия.
8. Copy е професионален, кратък и спокоен; без евтини сравнения, нападки или рекламни клишета.
9. Bottom nav остава стабилен и не конкурира content hierarchy.
10. Prototype controls не трябва да изглеждат като реална продуктова навигация.

---

## 3. FINAL MOBILE ORDER

### A. Compact header
- logo/brand;
- реалната mobile nav остава долу;
- няма втори sticky prototype navigation bar в content flow.

### B. Hero / Search
Above the fold трябва да съдържа:
- eyebrow: `Лом на едно място`;
- H1: `Какво търсиш в Лом?`;
- кратко professional subcopy;
- голям search field + primary `Търси`;
- до 3 compact suggestion chips.

Не се показва голям how-it-works card.

Target copy:
`Намери проверена информация, местни услуги, работа, имоти, фирми и полезни отговори — всичко за Лом на едно място.`

### C. Main categories — immediately after Search
Heading: `Основни категории`.

Initial mobile 2x2:
1. Строителство и ремонти
2. Здраве и лекари
3. Работа
4. Автомобили

Compact CTA:
`Всички категории`.

Cards:
- по-ниски;
- еднаква визуална система;
- еднакви SVG icons;
- title + една кратка secondary линия;
- no oversized decorative whitespace.

### D. Discover Lom
Heading: `Открий в Лом`.

Targets:
- Магазини;
- Заведения;
- Фирми;
- Събития.

Mobile presentation:
- compact 2-column tiles или dense rows;
- no repeated giant `Разгледай` button consuming a line;
- whole card/row is navigational target;
- icon + title + one-line descriptor + chevron.

### E. Verified local information
Heading: `Проверена информация`.

Targets:
- Здраве и лекари;
- Институции;
- Транспорт;
- Комунални.

Presentation:
- compact rows/chips, not four tall cards;
- verified visual language is subtle and consistent;
- source/freshness details live on owner/detail surfaces, not crowded Home.

### F. Community
Heading: `Въпроси и препоръки`.

Show max 2 useful canonical Q&A previews on mobile.
Each row:
- topic label;
- question;
- approved answer count only if real later;
- compact divider.

CTA: `Виж всички въпроси`.

### G. Optional lower utility
Only if it proves useful later:
- one ready guide/resource card;
- launch/trust/help element.

It must not push primary discovery downward.

---

## 4. WHAT IS REMOVED FROM MOBILE HOME

- giant `Първо намираш. Ако не стига — питаш.` card;
- multi-step tutorial above categories;
- large explanatory trust block;
- oversized Discover cards;
- oversized verified Info cards;
- mixed emoji icon styles;
- duplicated headings like eyebrow + another heading saying nearly the same thing;
- repeated `Разгледай` buttons when the whole item can be a target;
- prototype switcher as a sticky product-looking nav.

Trust is communicated by content labeling and verified surfaces, not a full screen tutorial.

---

## 5. DESKTOP ADAPTATION

Same information order, not a different product.

Desktop:
- hero can use wider search and restrained side supporting space;
- main categories may show 6 initial cards;
- Discover and Verified Info can use denser horizontal grids;
- Q&A can sit beside Verified Info only if hierarchy remains clear;
- no giant empty cards or decorative panels for the sake of filling width.

Mobile remains the stricter density baseline.

---

## 6. ICON SYSTEM

Prototype/final target:
- outline SVG set;
- consistent stroke width, optical size and container;
- category accent can change subtly but icon construction does not;
- no platform emoji dependency.

Initial semantic icons:
- Construction: tools/hammer-wrench;
- Health: medical cross/stethoscope;
- Work: briefcase;
- Cars: car;
- Shops: shopping bag/cart outline;
- Restaurants: fork/knife;
- Firms: storefront/building;
- Events: calendar;
- Institutions: landmark/building;
- Transport: bus/train;
- Utilities: bolt/drop/utility;
- Community: message bubbles.

---

## 7. COPY SYSTEM

Approved tone:
- clear;
- professional;
- local;
- confident;
- no hype;
- no condescension;
- no cheap comparison with Facebook or old posts.

Home labels should describe the product, not praise itself.

Prefer:
- `Основни категории`
- `Открий в Лом`
- `Проверена информация`
- `Въпроси и препоръки`

Avoid:
- `Най-полезните входове`
- `Общността помага` as a marketing headline
- `без да ровиш...`
- `хаос`, `стари публикации`, `по-добре от Facebook` type copy.

---

## 8. ABOVE-THE-FOLD TARGET

On a typical ~700px high Android viewport, before/near first scroll the user should be able to see:
1. brand/header;
2. Hero title;
3. search;
4. suggestion chips;
5. start of `Основни категории`.

The user should NOT spend the first full scroll reading how the site works.

---

## 9. DENSITY TARGET

Relative to C prototype v1:
- Hero vertical size: reduce materially;
- category cards: ~25–35% lower on mobile;
- Discover items: ~35–45% lower;
- Verified Info: rows instead of tall cards;
- Community block: max two previews on Home;
- spacing between major sections remains generous enough to distinguish groups, but not full-card padding everywhere.

No hard pixel values are LOCKED until rendered review.

---

## 10. PRODUCT FLOW

Target Home flow:

`Search → Main categories → Discover Lom → Verified Info → Q&A`

This is the canonical V6-C Home hierarchy unless visual testing proves a specific objective issue.

---

## 11. RESEARCH SIGNALS USED

Current leading local/service products reinforce these patterns:
- high-intent Search first;
- immediate popular category/service entry points;
- local business/entity discovery as a clear secondary layer;
- community/recommendation content after the primary find task.

We adapt these interaction principles; we do not copy another site's visual design or text.

---

## 12. C EXIT CHECK FOR HOME

Home is not ready for approval until:
- first viewport feels focused, not overloaded;
- Search is unmistakably primary;
- categories are visible quickly;
- no giant tutorial interrupts discovery;
- all category/discovery icons are consistent SVG;
- mobile scroll density is materially improved;
- copy passes V6 professional tone rule;
- Health feels structurally equal to other categories;
- Info/Q&A remain clearly separate trust/content types;
- prototype controls no longer distort the product review.
