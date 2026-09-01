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
10. `PUBLIC_PRODUCT_V6_C_FULL_SITE_INTERFACE_BLUEPRINT.md`

При конфликт: **LOCKED rules > approved production specs > V6 Master Control > completed V6 contracts > Full-site C Blueprint > older C/Home drafts.**

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
- A1/A2;
- B1–B9.

B9 remains authority for exact CTA/form/owner/state semantics.

---

## 5. V6-C — PROCESS CORRECTION + FULL-SITE BLUEPRINT

New authority:
`PUBLIC_PRODUCT_V6_C_FULL_SITE_INTERFACE_BLUEPRINT.md`

Reason for reset:
- rendered Home review showed only 4 Info Lom entries although authoritative current Info owner has 6;
- `Открий в Лом` rendered as a narrow right-side column on mobile;
- this confirmed that piecemeal Home patching could silently drop approved content/functions.

New rule:

**First complete the whole public product in one navigable prototype; only after completeness passes, polish individual blocks/screens.**

Canonical Info Lom six families:
1. Здраве;
2. Институции;
3. Транспорт;
4. Образование и култура;
5. Банки и банкомати;
6. Комунални и ежедневни услуги.

---

## 6. CURRENT FULL-SITE PROTOTYPE

New isolated prototype files:
- `v6-prototype/full-site.html`;
- `v6-prototype/full-site.css`;
- `v6-prototype/full-site.js`.

The older `v6-prototype/index.html` / Home-v2 layer remains reference/history and is no longer the completeness authority.

Current full-site prototype includes representative review flows for:
- Home;
- all 16 categories;
- Marketplace/Listings;
- listing detail;
- Firms + firm detail;
- Health;
- Shops;
- Restaurants;
- Events;
- all six Info Lom families;
- Search success/partial/empty/offline/error;
- Articles/Guides + detail;
- Q&A + detail/unanswered;
- Profile/Auth;
- global Add;
- Listing/Firm/Q&A/Health/Shop forms;
- correction/report flows;
- owner-aware share/contact semantics.

Static prototype only; no production writes.

---

## 7. CURRENT EXACT TASK

# `V6-C FULL-SITE INTERFACE COMPLETENESS + VISUAL REVIEW GATE`

Do NOT begin V6-D yet.

Review in this order:
1. whole product coverage — no approved public capability silently lost;
2. every visible CTA → correct owner/destination;
3. Home: Search → priority categories → Discover → 6 Info → Guides → Q&A;
4. 16 categories + Marketplace relationship;
5. Info/Health structure/trust;
6. Listing/Firm/Specialized detail actions;
7. forms, auth, pending/error/dirty states;
8. Search/Articles/Q&A/Profile connections;
9. desktop/mobile responsive hierarchy;
10. only then pixel-level visual polish.

Production impact: **NONE**.

---

## 8. NEXT MAJOR STAGE

After C completeness + visual direction is accepted/refined:

# `V6-D — TECHNICAL DESIGN / SCHEMA / RLS / INDEX / MIGRATION / SEO RENDERING / PERFORMANCE`

No production implementation before D/E gates.

---

## 9. CURRENT HANDOFF

**Completed:** V6-0, A1/A2, B1–B9, Full-site C Blueprint and initial full-site prototype source.  
**Current:** V6-C full-site completeness + visual review.  
**Production:** unchanged.
