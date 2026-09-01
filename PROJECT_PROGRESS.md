# Попитай.Лом — ТЕКУЩ CHECKPOINT

Актуализирано: 01.09.2026

## 1. ПРАВИЛА ПРЕДИ РАБОТА

Ред на четене:
1. `PROJECT_RULES_00_READ_FIRST.md`
2. `PROJECT_RULES_PROTECTED_CORE.md`
3. `PROJECT_RULES_ADMIN_MODERATOR.md`
4. `PROJECT_RULES.md`
5. `PROJECT_RULES_RENDER_OWNERSHIP.md`
6. `PUBLIC_MARKETPLACE_V3_APPROVED_SPEC.md`
7. `PUBLIC_SITE_INFORMATION_ARCHITECTURE_APPROVED_SPEC.md`
8. `ADMIN_PANEL_V2_APPROVED_SPEC.md`
9. `PUBLIC_PRODUCT_V6_MASTER_CONTROL.md`

При конфликт: **LOCKED rules > approved production specs > V6 Master Control > completed V6 contracts > supporting drafts.**

---

## 2. PRODUCTION — НЕПРОМЕНЕН ОТ V6 TRACK

Marketplace V3 остава current approved production model.

Desktop:
`Начало | Обяви и услуги | Фирми | Инфо Лом | Статии | Още ▼ | Профил | + Добави`

Mobile:
`Начало | Обяви | + | Инфо | Профил`

V6 planning до този checkpoint **НЕ е променял production UI, schema/RLS, roles, quotas, moderation, protected owners/ranking или URLs**.

---

## 3. ЗАЩИТЕНО ЯДРО — НЕПРОМЕНЕНО

V6 не bypass-ва Firms, Listings, Masters/Construction, Shops, Health/Info, Events, Admin/Moderator, quotas/status/approval/direct-publish, protected Admin/Ivanov/boost priority или RLS/schema/security.

Moderator own-business edit mismatch от A2 остава отделен protected defect candidate.

---

## 4. V6 DESIGN TRACK

Branch: `v6-product-foundation-draft`  
Production impact: **NONE**.

Completed artifacts:
- A1 `PUBLIC_PRODUCT_V6_CURRENT_TARGET_OWNER_MAP.md`;
- A2 `PUBLIC_PRODUCT_V6_A2_EVIDENCE_BASELINE.md`;
- B1 `PUBLIC_PRODUCT_V6_B1_FINAL_IA_TAXONOMY_CONTRACT.md`;
- B1 companion `PUBLIC_PRODUCT_V6_B1_HEALTH_PRESENTATION_PARITY_CLARIFICATION.md`;
- B2 `PUBLIC_PRODUCT_V6_B2_SEARCH_INTENT_RESULT_CONTRACT.md`;
- B3 `PUBLIC_PRODUCT_V6_B3_INFO_SOURCE_FRESHNESS_SEO_SEARCH_CONTRACT.md`;
- B4 `PUBLIC_PRODUCT_V6_B4_ARTICLE_GUIDE_CONTENT_ARCHITECTURE_CONTRACT.md`;
- B5 `PUBLIC_PRODUCT_V6_B5_QA_CANONICAL_DUPLICATE_ALIAS_MODERATION_CONTRACT.md`;
- B6 `PUBLIC_PRODUCT_V6_B6_STRUCTURED_RECOMMENDATION_RELATION_CONTRACT.md`;
- B7 `PUBLIC_PRODUCT_V6_B7_FACEBOOK_BRIDGE_TECHNICAL_PRODUCT_CONTRACT.md`;
- B8 `PUBLIC_PRODUCT_V6_B8_LOCAL_RELEVANCE_RANKING_PROTECTED_PRIORITY_CONTRACT.md`;
- B9 `PUBLIC_PRODUCT_V6_B9_EXACT_INTERACTION_FORMS_BUTTONS_LINKS_STATES_CONTRACT.md`.

---

## 5. STAGE STATUS

V6-0 / A1 / A2 / B1 / B2 / B3 / B4 / B5 / B6 / B7 / B8 / B9: **DONE**.

### B9 key lock

- every main CTA has one owner-aware destination;
- global Add remains compact owner router;
- Listings use proven V3 `main/subcategory/intent` prefill and separate `edit` state;
- Firm category prefill is not falsely claimed current until a bounded mapping adapter exists;
- Health and Shops keep specialized Add owners;
- Events have no fake public Add;
- Search no-result → Ask carries bounded context and runs B5 duplicate gate;
- pending content does not receive public Facebook share;
- auth/validation/pending/success/error/back/mobile states are explicit;
- Health common visual shell does not change Health truth owner;
- no protected owner/quota/role/schema/RLS change.

Production impact: **NONE**.

### V6-C — REAL DESKTOP/MOBILE VISUAL + INTERACTION PROTOTYPE
**CURRENT STAGE**

---

## 6. EXACT NEXT TASK

# `STAGE V6-C — REAL DESKTOP/MOBILE VISUAL + INTERACTION PROTOTYPE`

C must turn B1–B9 into a coherent non-production prototype.

Required:
- common V6 visual system using existing Popitai brand direction;
- real Home desktop + mobile;
- common category shell;
- Health rendered inside the same shell while preserving specialized action semantics;
- marketplace/category search/results/add states;
- Search success/no-result/partial states;
- global Add sheet;
- Ask duplicate suggestion state;
- pending success vs approved/share state;
- Health proposal and Shop proposal examples;
- canonical Q&A detail/share/report state;
- no Event Add CTA;
- desktop/mobile accessibility/focus hierarchy;
- no production deployment;
- no schema/RLS changes.

Prototype artifacts should be isolated from production, clearly marked V6 prototype, and must not be referenced by production pages.

C exit gate:

**the user can inspect one coherent desktop/mobile V6 experience and understand exactly how Home, categories, Health, Search, Add, Ask and Facebook/share fit together before any production implementation starts.**

---

## 7. CURRENT HANDOFF

**Completed:** V6-0, A1, A2, B1–B9.  
**Current:** V6-C.  
**Production:** unchanged by V6 planning.  
**Do not do next:** production implementation before C review + V6-D/E gates.