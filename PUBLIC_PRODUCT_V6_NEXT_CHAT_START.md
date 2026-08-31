# Попитай.Лом — V6 NEXT CHAT START

Статус: **START HERE / ZERO-EXPLANATION HANDOFF**  
Branch: `v6-product-foundation-draft`  
Актуализирано: 31.08.2026

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
8. `PUBLIC_PRODUCT_V6_B1_FINAL_IA_TAXONOMY_CONTRACT.md`
9. `PUBLIC_PRODUCT_V6_B1_HEALTH_PRESENTATION_PARITY_CLARIFICATION.md`
10. `PUBLIC_PRODUCT_V6_B2_SEARCH_INTENT_RESULT_CONTRACT.md`
11. `PUBLIC_PRODUCT_V6_B3_INFO_SOURCE_FRESHNESS_SEO_SEARCH_CONTRACT.md`
12. `PUBLIC_PRODUCT_V6_B4_ARTICLE_GUIDE_CONTENT_ARCHITECTURE_CONTRACT.md`
13. `PUBLIC_PRODUCT_V6_B5_QA_CANONICAL_DUPLICATE_ALIAS_MODERATION_CONTRACT.md`
14. `PUBLIC_PRODUCT_V6_B6_STRUCTURED_RECOMMENDATION_RELATION_CONTRACT.md`

После чети само task-specific supporting docs/evidence.

При конфликт:

**LOCKED rules > approved production specs > V6 Master Control > completed B-contracts > supporting drafts.**

---

## 2. Текущо състояние

Завършени: V6-0, A1, A2, B1, B2, B3, B4, B5, B6.

Production е **непроменен от V6 planning track**.

Ключово LOCKED:
- common 16-category V6 shell;
- Health uses same visual/category/mobile/search/share/Facebook system, but verified Health/Info owner remains specialized;
- one Search owner;
- Info owns mutable verified local facts;
- Articles explain process/context and only `ПРОВЕРЕНО ГОТОВО` is normally Search/SEO eligible;
- one real Q&A intent → one canonical knowledge center;
- aliases/duplicate Q&A resolve non-destructively to canonical;
- community approval/votes ≠ verified fact;
- recommendation relation initially comes from approved Q&A answer and resolves to stable approved Business/Health provider/Shop target;
- Restaurants use Firms target owner;
- self-recommendation does not count;
- one author contributes max one active positive unit per target;
- recommendation counts are derived from valid relations, not manual protected counters;
- external Facebook reactions/comments are not automatically Popitai recommendations;
- protected Admin/Ivanov/boost ranking remains untouched until B8.

---

## 3. EXACT NEXT TASK

# `STAGE V6-B7 — FACEBOOK BRIDGE TECHNICAL / PRODUCT CONTRACT`

Не прави broad audit и не започвай production code.

Изработи:

`PUBLIC_PRODUCT_V6_B7_FACEBOOK_BRIDGE_TECHNICAL_PRODUCT_CONTRACT.md`

B7 трябва да заключи:
- Popitai → Facebook sharing for supported approved public content types;
- share timing after moderation/publication;
- canonical URL + server-readable OG/share metadata;
- safe share text and mutable-fact boundaries;
- Facebook → Popitai user-assisted own-content prefill without scraping;
- current Meta/group/API/privacy limitations;
- no automatic arbitrary-group posting;
- no automatic external comments/reactions import as Q&A/recommendations;
- Web Share API / clipboard / Facebook fallback hierarchy;
- PWA/share-target optional later, not MVP dependency;
- behavior after external share when source content changes/hides/deletes;
- attribution/UTM without sensitive content leakage;
- Health/sensitive content rules;
- no Facebook SDK dependency by default;
- no schema/RLS/production implementation.

B7 exit gate:

**Facebook is a controlled distribution bridge around canonical Popitai content—not a second owner/scraper/moderation/trust system; every supported share has safe canonical destination/preview/status behavior and lightweight fallback.**

---

## 4. Evidence scope

Use only:
- A2 current share/detail metadata evidence;
- B1 Health clarification;
- B3/B4/B5/B6 share/trust/source boundaries;
- current official Meta docs for platform-specific constraints;
- current Web Share/Clipboard standards where useful.

---

## 5. Работен режим

Safe read/design/research autonomous. No production/schema/RLS/protected ranking changes. At B7 completion update Master/Progress/Next and set exactly one next task.

Минимално съобщение в нов чат:

`@GitHub Продължи Попитай.Лом по PUBLIC_PRODUCT_V6_NEXT_CHAT_START.md. Работи автономно.`