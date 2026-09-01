# Попитай.Лом — V6 NEXT CHAT START

Статус: **START HERE / ZERO-EXPLANATION HANDOFF**  
Branch: `v6-product-foundation-draft`  
Актуализирано: 01.09.2026

Работим по `Traqnivanov/popitai-lom`.

Не прави нов repo/clone и не започвай проекта отначало.

## 1. Прочети първо

1. `PROJECT_RULES_00_READ_FIRST.md`
2. `PROJECT_RULES_PROTECTED_CORE.md`
3. `PROJECT_RULES_ADMIN_MODERATOR.md`
4. `PROJECT_RULES.md`
5. `PROJECT_RULES_RENDER_OWNERSHIP.md`
6. `PROJECT_PROGRESS.md`
7. `PUBLIC_PRODUCT_V6_MASTER_CONTROL.md`
8. completed B1–B9 contracts, особено B3/B4/B7/B8/B9;
9. `PUBLIC_PRODUCT_V6_C_FULL_SITE_INTERFACE_BLUEPRINT.md`;
10. older C/Home documents only where they do not conflict with Full-site Blueprint.

---

## 2. CURRENT TRUTH

Completed:
- V6-0;
- A1/A2;
- B1–B9;
- Full-site C interface blueprint;
- initial isolated full-site prototype source.

Production е **непроменен**.

Canonical navigation:
- Desktop: `Начало | Обяви и услуги | Фирми | Инфо Лом | Статии | Още | Профил | + Добави`
- Mobile: `Начало | Обяви | + | Инфо | Профил`

Stable B1 public taxonomy = 16 categories.

Canonical Info Lom top level = exactly 6 families:
1. Здраве;
2. Институции;
3. Транспорт;
4. Образование и култура;
5. Банки и банкомати;
6. Комунални и ежедневни услуги.

Health remains specialized verified owner even when visually using the common V6 shell.

No fake Event Add.
Pending/private/rejected content has no public Share.
Articles/Guides are a required product/SEO/share layer, but official production feature/search/share requires B4 `ПРОВЕРЕНО ГОТОВО`.

---

## 3. WHY THE C PROCESS CHANGED

Rendered mobile review exposed that Home-only patching had:
- dropped Education/Culture and Banks/ATMs from Info Lom;
- produced a broken narrow/right-side `Открий в Лом` layout;
- previously allowed unrelated prototype destinations.

User explicitly requires a different process:

**First establish the whole site end-to-end with all approved functions/content/forms/buttons/links. Only after the complete product can be reviewed as one system do visual polishing and local improvements.**

Do not revert to piecemeal Home polishing.

---

## 4. CURRENT PROTOTYPE

Primary review prototype:
- `v6-prototype/full-site.html`
- `v6-prototype/full-site.css`
- `v6-prototype/full-site.js`

Older `v6-prototype/index.html` + Home-v2 files are reference/history, not current completeness authority.

Full-site prototype represents:
- Home Search-first flow;
- main categories + all 16 categories;
- full-width Discover Lom;
- all six Info Lom families;
- Marketplace/Listings + listing detail;
- Firms + firm detail;
- Health;
- Shops;
- Restaurants;
- Events;
- Search success/partial/empty/offline/error;
- Articles/Guide detail including pension candidate;
- Q&A index/detail/unanswered;
- Profile/Auth;
- global Add;
- Listing/Firm/Q&A/Health/Shop forms;
- Info correction and generic report;
- owner-aware share/contact semantics.

Static representative data only; no live writes.

---

## 5. EXACT CURRENT TASK

# `V6-C FULL-SITE INTERFACE COMPLETENESS + VISUAL REVIEW GATE`

Do NOT start production code or V6-D.

Review/continue in order:
1. no approved screen/category/action/form is missing;
2. every visible button/link goes to its correct owner/destination;
3. Home hierarchy and first viewport;
4. 16 categories + Marketplace relationship;
5. six-family Info Lom + Health parity/trust;
6. Firms/Listings/Specialized details;
7. forms/auth/pending/error/dirty states;
8. Search/Articles/Q&A/Profile connections;
9. responsive desktop/mobile system;
10. only after completeness passes, polish spacing/cards/typography/buttons per screen.

Do not treat one polished Home block as C completion.

---

## 6. NEXT MAJOR STAGE

Only after full-site C completeness + visual direction is accepted/refined:

# `V6-D — TECHNICAL DESIGN / SCHEMA / RLS / INDEX / MIGRATION / SEO RENDERING / PERFORMANCE`

---

## 7. WORK MODE

- safe review/refinement autonomous where objective;
- no production deployment;
- no schema/RLS changes;
- no protected owner/ranking/role changes;
- preserve existing approved form capabilities;
- do not invent current analytics/statistics or article verification.

Минимално продължение:

`@GitHub Продължи Попитай.Лом по PUBLIC_PRODUCT_V6_NEXT_CHAT_START.md. Работи автономно.`
