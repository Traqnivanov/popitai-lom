# Попитай.Лом — PUBLIC MARKETPLACE V3 — APPROVED SPEC

Статус: **APPROVED / CANONICAL PUBLIC MARKETPLACE PRESENTATION**  
Дата: 30.08.2026

Този документ е каноничната спецификация за публичното откриване, навигация и presentation flow на **„Обяви и услуги“**. Той заменя само противоречащите му marketplace/„Категории“ presentation решения в `PUBLIC_SITE_INFORMATION_ARCHITECTURE_APPROVED_SPEC.md` и по-старите Stage 4/5 checkpoints.

`PROJECT_RULES_PROTECTED_CORE.md`, `PROJECT_RULES_ADMIN_MODERATOR.md`, RLS/schema, ownership, moderation, quotas, status semantics, Admin/Moderator boundaries и специалният Ivanov priority остават с по-висок приоритет и НЕ се променят от този документ.

---

## 1. ПРОДУКТОВА ЦЕЛ

Потребителят не трябва да избира между два конкуриращи се входа „Категории“ и „Обяви“.

Каноничният публичен вход е един:

**Обяви и услуги** → търсене / главна група → подкатегория → реални обяви + релевантни фирми → един ясен add flow.

`kategorii.html` остава само backward-compatible URL и води към каноничния marketplace. Не се изгражда втори SEO/content tree със същата задача.

---

## 2. ГЛОБАЛНА НАВИГАЦИЯ

### Desktop

`Начало | Обяви и услуги | Фирми | Инфо Лом | Статии | Още ▼ | Профил | + Добави`

`Още` съдържа вторичните входове: `Въпроси`, `Събития`, `За сайта`, `Правила`, `Контакти`.

Няма отделен top-level `Категории`. Няма втори `Вход`, когато вече има постоянен `Профил` в навигацията; нерегистриран потребител стига до authentication през `Профил`.

### Mobile bottom navigation

Точно пет постоянни позиции:

`Начало | Обяви | + | Инфо | Профил`

Няма отделна mobile позиция `Категории`.

---

## 3. ГЛАВЕН MARKETPLACE — `obyavi.html`

`obyavi.html` е единният public marketplace landing.

Задължителни елементи:
- H1: `Обяви и услуги`;
- общо търсене `Какво търсиш?`;
- избор на главна група;
- един основен CTA `Добави обява`;
- приоритетни входове към `Майстори и ремонти`, `Автомобили`, `Други услуги`;
- `Други обяви` като обединяваща четвърта група;
- `Всички категории` като вторично разгъване, а не конкурентна архитектура;
- реалният listings owner остава източник на резултатите;
- старият хоризонтален списък от вътрешни stored categories не се показва като равнопоставена публична архитектура.

Приоритетните категории не се третират визуално като осем еднакви карти.

---

## 4. ЧЕТИРИ ПУБЛИЧНИ ГЛАВНИ ГРУПИ

### A. Майстори и ремонти

Public subcategories:
1. Цялостни ремонти
2. Бани и плочки
3. ВиК
4. Електро
5. Покриви
6. Боядисване
7. Дограма
8. Климатици

Compatibility storage: listing category `Услуги` + exact service subcategory.

### B. Автомобили

Public subcategories:
1. Автомобили за продажба или търсене
2. Авточасти
3. Автосервизи
4. Диагностика
5. Гуми
6. Автомивки
7. Пътна помощ

`Автомобили за продажба или търсене` използва protected stored category `Автомобили и МПС`.

Останалите автомобилни услуги използват protected stored category `Услуги` + exact service subcategory.

### C. Други услуги

Public subcategories:
1. Домашна помощ
2. Красота и грижа
3. Компютърни и технически услуги
4. Фото и видео
5. Професионални услуги
6. Обучение и уроци
7. Грижа
8. Транспорт, преместване и доставки

Compatibility mappings:
- public `Фото и видео` → stored `Фото, видео и събитийни услуги`;
- public `Грижа` → stored `Грижа за деца, възрастни и домашни любимци`;
- всички използват stored category `Услуги`.

### D. Други обяви

Public subcategories:
1. Електроника
2. Дом и градина
3. Дрехи и обувки
4. Деца и бебета
5. Спорт и хоби
6. Животни
7. Работа
8. Имоти
9. Друго

Тези labels се mapping-ват към съществуващите protected listing categories. Не се прави schema migration само заради публичното групиране.

---

## 5. CATEGORY / DEEP VIEWS

Каноничните deep views остават върху съществуващите URL-и:
- `maistori.html` → Майстори и ремонти;
- `avtomobili.html` → Автомобили;
- `rabota.html` → Други услуги.

Всяка такава страница има:
- breadcrumb към `Обяви и услуги`;
- един основен CTA `Добави обява`;
- търсене в конкретната група;
- subcategory cards, които са **navigation**, не набор от два/три competing CTA;
- филтри `Всички | Предлагат | Търсят | Фирми`;
- резултати от реални approved/active listings и релевантни фирми;
- въпросите са secondary/supporting content, не основният marketplace action.

Старите `Предложи услуга` + `Търся изпълнител` бутони под всяка subcategory карта не се показват във V3 presentation. Съществуващите URL/prefill semantics могат да се запазят като compatibility слой.

---

## 6. ADD FLOW — `dobavi-obqva.html`

Public flow:

1. `Предлагам`
2. `Търся`
3. главна група
4. подкатегория
5. детайли на съществуващата protected форма

Главните групи са точно четирите от §4. Вътрешните stored categories не се показват като конкурентни главни стъпки.

### Intent compatibility mapping

| Public intent | Service listing | Vehicle listing |
| --- | --- | --- |
| Предлагам | protected `listing_type = Продава` | protected `listing_type = Продава` |
| Търся | protected `listing_type = Търси` | protected `listing_type = Купува` |

`Работа` и `Имоти` продължават да използват съществуващите си специализирани protected type owners/fields.

`edit=<id>` винаги има приоритет над create prefill. Marketplace presentation няма право да презапише заредена съществуваща обява.

---

## 7. DATA / RENDER OWNERSHIP

Marketplace V3 е presentation/orchestration слой, не нов backend owner.

- `supabase-listings.js` остава protected write/listing owner.
- `category-listings-v1.js` е read-only thematic results owner.
- existing firms/profile owners остават authoritative за фирми.
- `public-category-dictionary-v1.js` остава compatibility source за stored service taxonomy.
- Marketplace V3 може да mapping-ва public labels/URLs към protected values, но не може да променя RLS/schema/status/ownership/quota/moderation semantics.

Thematic listing queries задължително пазят:
- `status = approved`;
- active/non-expired condition;
- protected Ivanov/Admin priority;
- protected boost ordering.

---

## 8. KEEP / COMPLETE / REPLACE

### KEEP
- protected backend, RLS, ownership, approval, limits and status flows;
- Admin/Moderator role boundaries;
- existing listing edit owner and media flow;
- real Supabase listing loading;
- firms and firm profiles;
- Ivanov priority and boost semantics;
- accessibility/focus fixes in the global shell;
- existing public URLs as compatibility entry points.

### COMPLETE
- single `Обяви и услуги` entry;
- exact desktop/mobile navigation;
- unified landing search and four-group mapping;
- category/deep views with one CTA, clean subcategory navigation and filters;
- Offer/Seek → group → subcategory public add flow;
- public↔stored mapping and edit-safe prefill;
- responsive states and mobile priority;
- canonical shell generator + regression CI.

### REPLACE / DO NOT RESTORE
- top-level `Категории` beside `Обяви`;
- eight equal marketplace cards as the primary architecture;
- multiple primary CTA under every subcategory;
- raw stored category `Услуги` as a standalone public top-level explanation;
- a second marketplace tree under `kategorii.html`;
- presentation-layer database writes.

---

## 9. RESPONSIVE / ACCESSIBILITY CONTRACT

- Desktop preserves the canonical nav in §2 without horizontal overflow at supported widths.
- Mobile bottom navigation remains exactly five entries and respects safe-area spacing.
- Marketplace search/filter controls stack cleanly on narrow screens.
- Subcategory cards remain tap targets; nested competing buttons are not required.
- Add modal retains focus trap, Escape close and focus return.
- Hamburger Escape behavior continues to return focus to the menu button.
- `Още` can be closed by outside click and Escape.

---

## 10. BACKWARD COMPATIBILITY

- `kategorii.html` redirects to `obyavi.html` while preserving useful query/hash state.
- Existing `maistori.html`, `avtomobili.html`, `rabota.html`, `obyavi.html`, `dobavi-obqva.html` URLs remain valid.
- Legacy stored values are not mass-migrated merely to match public wording.
- Existing indexed/detail URLs are not duplicated under a second SEO path.
- Old deep links/prefill parameters remain accepted where they can be mapped safely.

---

## 11. ACCEPTANCE GATE

Marketplace V3 is accepted only after:
1. syntax + contract CI success;
2. canonical 41-page shell sync success;
3. contextual recovery compatibility success;
4. branch/source verification of exact navigation and mapping;
5. merge through PR;
6. production GitHub Pages runtime verification of landing, three deep views, add flow and `kategorii.html` compatibility redirect;
7. no regression in protected search/Ivanov priority, auth/edit flow, firms, quotas or moderation.

До production runtime verification статусът е `IMPLEMENTED / PRE-MERGE QA`, а не `PRODUCTION PASS`.
