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

V6 work до този checkpoint **НЕ е променял production UI, schema/RLS, roles, quotas, moderation, protected owners/ranking или URLs**.

---

## 3. ЗАЩИТЕНО ЯДРО — НЕПРОМЕНЕНО

V6 не bypass-ва Firms, Listings, Masters/Construction, Shops, Health/Info, Events, Admin/Moderator, quotas/status/approval/direct-publish, protected Admin/Ivanov/boost priority или RLS/schema/security.

Moderator own-business edit mismatch от A2 остава отделен protected defect candidate.

---

## 4. COMPLETED V6 CONTRACTS

Completed:
- V6-0;
- A1;
- A2;
- B1 + Health companion;
- B2;
- B3;
- B4;
- B5;
- B6;
- B7;
- B8;
- B9.

Latest B9 artifact:
`PUBLIC_PRODUCT_V6_B9_EXACT_INTERACTION_FORMS_BUTTONS_LINKS_STATES_CONTRACT.md`

B9 locks owner-aware CTA destinations, exact Listing prefill, specialized Health/Shops actions, no fake Event Add, Ask duplicate handoff, pending-vs-share behavior and deterministic auth/form/mobile states.

---

## 5. V6-C — VISUAL / INTERACTION PROTOTYPE

Artifact:
`PUBLIC_PRODUCT_V6_C_VISUAL_INTERACTION_PROTOTYPE.md`

Prototype files:
- `v6-prototype/index.html`;
- `v6-prototype/prototype.css`;
- `v6-prototype/prototype.js`.

Status:

**SOURCE PROTOTYPE COMPLETE → VISUAL REVIEW GATE**

Implemented in prototype:
- Home search-first desktop/mobile;
- B1 priority shortcuts + `Открий в Лом`;
- common category shell;
- Health inside the same shell while keeping specialized Health semantics;
- grouped Construction results;
- Search success/no-result/partial states;
- global Add sheet;
- Listing prefill example;
- Ask duplicate suggestions;
- pending vs public/share states;
- Health proposal modal;
- Shop proposal modal;
- Event state with no fake Add CTA;
- responsive <=720 px layout;
- dialog focus/Escape/return-focus behavior;
- separate prototype screen switcher.

C source QA found and fixed one important contradiction:
- initial prototype reused site nav as screen switcher;
- fixed by restoring canonical desktop navigation and moving prototype screen switching into a separate clearly marked bar;
- mobile Profile no longer falsely routes to Ask;
- non-live demo actions now return an explicit prototype status instead of silent dead buttons.

Production impact: **NONE**.

---

## 6. CURRENT EXACT TASK

# `V6-C VISUAL REVIEW GATE`

Before V6-D begins, inspect/refine the rendered prototype direction for:
- Home first impression;
- density/spacing;
- category shell;
- Health parity;
- mobile hierarchy;
- Search states;
- Add/Ask modal interaction;
- overall brand feel.

No production implementation starts at this gate.

If visual direction is accepted/refined, exact next major stage becomes:

# `V6-D — TECHNICAL DESIGN / SCHEMA / RLS / INDEX / MIGRATION / SEO RENDERING / PERFORMANCE`

---

## 7. CURRENT HANDOFF

**Completed:** V6-0, A1, A2, B1–B9; C source prototype.  
**Current:** V6-C visual review gate.  
**Production:** unchanged.  
**Do not do next:** production implementation before C review + V6-D/E.