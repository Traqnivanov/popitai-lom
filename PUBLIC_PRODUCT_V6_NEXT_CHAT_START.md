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
8. completed B1–B9 contracts;
9. `PUBLIC_PRODUCT_V6_COPY_QUALITY_RULE.md`;
10. `PUBLIC_PRODUCT_V6_C_VISUAL_INTERACTION_PROTOTYPE.md`;
11. `PUBLIC_PRODUCT_V6_C_HOME_ARCHITECTURE_DECISION.md`.

---

## 2. Текущо състояние

Completed:
- V6-0;
- A1/A2;
- B1–B9;
- V6-C source-level visual/interaction prototype;
- Home v2 holistic visual candidate.

Prototype files:
- `v6-prototype/index.html`;
- `v6-prototype/prototype.css`;
- `v6-prototype/prototype.js`;
- `v6-prototype/home-v2.css`;
- `v6-prototype/home-v2.js`.

Production е **непроменен**.

Key truths:
- canonical desktop/mobile navigation preserved;
- stable 16-category system preserved;
- Health uses same V6 visual shell but specialized verified owner;
- Search/Info/Q&A/Recommendations/Facebook/Ranking/B9 interactions are represented;
- no fake Event Add;
- pending content has no public share;
- prototype is isolated and not referenced by production pages;
- public copy must be clean, confident and professional; no cheap conversational advertising, degrading metaphors or anti-Facebook phrasing.

## Home v2 — current candidate

Home is treated as the project's highest-priority public screen and is redesigned as one system, not piecemeal.

Canonical mobile hierarchy for current review:

`Search → Основни категории → Открий в Лом → Проверена информация → Въпроси и препоръки`

Home v2 changes:
- removes the giant how-it-works/tutorial card above categories;
- materially shortens the hero;
- makes Search one compact dominant control;
- moves main categories immediately after Search;
- keeps 4 priority mobile categories: Construction, Health, Work, Cars;
- replaces mixed emoji with one outline SVG icon language;
- compresses Discover Lom to compact 2x2 navigation;
- compresses verified Info to compact utility grid;
- keeps max two Q&A previews on mobile;
- removes repeated `Разгледай` visual weight;
- prototype screen switcher is moved into prototype-only banner and must not resemble product navigation.

`PUBLIC_PRODUCT_V6_C_HOME_ARCHITECTURE_DECISION.md` is the authority for Home layout decisions and overrides the older Home subsection of the initial C prototype document where they conflict.

---

## 3. EXACT CURRENT TASK

# `V6-C HOME V2 + VISUAL REVIEW GATE`

Do not start production code.

First review Home v2 as a whole:
- first viewport / search dominance;
- categories appear quickly;
- mobile scroll density;
- unified SVG icon language;
- Discover/Info/Q&A hierarchy;
- copy quality;
- prototype controls no longer distort review.

Then continue rendered prototype review for:
- common category shell;
- Health visual parity;
- Search success/no-result/partial states;
- Add/Ask flows;
- desktop/mobile hierarchy;
- brand/spacing consistency.

After visual direction is accepted/refined, next major stage:

# `V6-D — TECHNICAL DESIGN / SCHEMA / RLS / INDEX / MIGRATION / SEO RENDERING / PERFORMANCE`

---

## 4. Работен режим

- safe review/refinement autonomous where objective;
- visual preference changes can be surfaced for user review;
- no production deployment;
- no schema/RLS changes;
- no protected owner/ranking/role changes.

Минимално продължение:

`@GitHub Продължи Попитай.Лом по PUBLIC_PRODUCT_V6_NEXT_CHAT_START.md. Работи автономно.`
