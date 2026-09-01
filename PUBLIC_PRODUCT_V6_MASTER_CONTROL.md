# Попитай.Лом — V6 MASTER CONTROL / ROADMAP / HANDOFF

Статус: **КАНОНИЧЕН КОНТРОЛЕН ДОКУМЕНТ ЗА V6 DRAFT / NO PRODUCTION CODE**  
Branch: `v6-product-foundation-draft`  
Актуализирано: 01.09.2026

При конфликт:

**LOCKED rules > approved production specs > V6 Master Control > completed V6 contracts > `PUBLIC_PRODUCT_V6_C_FULL_SITE_INTERFACE_BLUEPRINT.md` > older C/Home prototype decisions.**

---

## 1. CURRENT PRODUCT TRUTH

Production остава на approved Marketplace V3 и protected backend/Admin/Moderator rules.

V6 до този checkpoint **не е променял production UI, schema/RLS, roles, quotas, moderation, protected owners/ranking или URLs**.

Completed product contracts:
- A1/A2;
- B1–B9.

Current C authority:
- `PUBLIC_PRODUCT_V6_C_FULL_SITE_INTERFACE_BLUEPRINT.md`.

Current isolated full-site prototype:
- `v6-prototype/full-site.html`;
- `v6-prototype/full-site.css`;
- `v6-prototype/full-site.js`.

Older C/Home prototype files remain reference/history, not the completeness authority.

---

## 2. REQUIRED READ ORDER

1. `PROJECT_RULES_00_READ_FIRST.md`
2. `PROJECT_RULES_PROTECTED_CORE.md`
3. `PROJECT_RULES_ADMIN_MODERATOR.md`
4. `PROJECT_RULES.md`
5. `PROJECT_RULES_RENDER_OWNERSHIP.md`
6. `PROJECT_PROGRESS.md`
7. `PUBLIC_PRODUCT_V6_MASTER_CONTROL.md`
8. completed B1–B9 contracts;
9. `PUBLIC_PRODUCT_V6_C_FULL_SITE_INTERFACE_BLUEPRINT.md`;
10. `PUBLIC_PRODUCT_V6_C_HOME_ARCHITECTURE_DECISION.md` only where not superseded;
11. task-specific evidence only.

---

## 3. STAGE STATUS

- V6-0 — DONE
- A1 — DONE
- A2 — DONE
- B1 — DONE
- B2 — DONE
- B3 — DONE
- B4 — DONE
- B5 — DONE
- B6 — DONE
- B7 — DONE
- B8 — DONE
- B9 — DONE
- older V6-C source/Home candidates — superseded as completeness authority
- **V6-C FULL-SITE INTERFACE COMPLETENESS GATE — CURRENT**
- V6-D — BLOCKED until full-site C completeness + visual direction are accepted/refined
- V6-E — OPEN after D
- V6-F — OPEN after E

---

## 4. LOCKED WORKING TRUTH

### IA / taxonomy
Stable 16-category public taxonomy remains B1 truth.

### Navigation
Desktop: `Начало | Обяви и услуги | Фирми | Инфо Лом | Статии | Още | Профил | + Добави`.
Mobile: `Начало | Обяви | + | Инфо | Профил`.

### Marketplace
Marketplace V3 remains current approved production presentation and protected owner mapping.

### Health
Same V6 visual/category shell, specialized verified Health/Info owner/trust/moderation/freshness.

### Info Lom
Canonical six top-level families remain visible:
1. Здраве;
2. Институции;
3. Транспорт;
4. Образование и култура;
5. Банки и банкомати;
6. Комунални и ежедневни услуги.

Mutable local facts stay Info-owned.

### Search
One intent-aware owner; verified-vs-community separation; no false empty from partial failure.

### Articles
Guides are a real product/SEO/share layer. Only B4 `ПРОВЕРЕНО ГОТОВО` content is production Search/share eligible.

### Q&A
One intent → one canonical question center; duplicate gate precedes create.

### Facebook/share
Distribution only; public canonical eligible content only; pending content has no public share.

### Ranking
Eligibility/relevance precedes protected/native priority. Protected Admin/Ivanov/boost semantics remain intact inside relevant candidate sets.

### Interactions/forms
Each CTA has one owner-aware destination. Existing Listing/Firm/Q&A capabilities remain represented; Health/Shops remain specialized; Events have no fake Add.

---

## 5. WHY C WAS RESET TO FULL-SITE COMPLETENESS

Rendered mobile review on 01.09.2026 exposed a process problem, not just two CSS bugs:
- newer Home prototype dropped two canonical Info Lom families, showing 4 instead of 6;
- `Открий в Лом` rendered as a narrow right-side column, visually disconnected from the category system;
- earlier prototype buttons had also used unrelated sample destinations.

Decision:

**Do not polish individual Home blocks before the whole public product is represented end-to-end.**

C must first prove the complete product shell, owners, destinations, forms and important states; pixel polish follows only after completeness.

---

## 6. CURRENT FULL-SITE PROTOTYPE SCOPE

The new isolated prototype opens on Home and represents:
- Search-first Home;
- priority categories;
- all 16 categories;
- full-width `Открий в Лом` discovery grid;
- all 6 Info Lom families;
- Marketplace V3 landing + category shell + listing detail;
- Firms hub + representative expanded firm detail;
- Health specialized shell;
- Shops, Restaurants and Events;
- Search success/partial/empty/offline/error states;
- Articles index + guide detail including pension candidate;
- Q&A index/detail/unanswered state;
- Profile/Auth;
- global Add router;
- Listing form;
- Firm form;
- Ask form;
- Health proposal;
- Shop proposal;
- Info correction;
- generic report;
- owner-aware Share/contact demo semantics.

Static representative data only. No live writes.

---

## 7. CURRENT EXACT TASK

# `V6-C FULL-SITE INTERFACE COMPLETENESS + VISUAL REVIEW GATE`

Before V6-D:
1. review full product flow, not one Home block;
2. verify no approved screen/category/action/form disappeared;
3. verify every visible CTA has the correct semantic destination/owner;
4. review Home first viewport and full section order;
5. review 16 categories and Marketplace relation;
6. review 6-family Info Lom structure;
7. review Firms/Listing/Health/Shops/Events detail/action logic;
8. review forms and pending/error/dirty/auth states;
9. review Search/Articles/Q&A/Profile connections;
10. then polish visual density, spacing, typography and card/button details.

No production implementation starts at this gate.

---

## 8. NEXT MAJOR STAGE AFTER C

# `V6-D — TECHNICAL DESIGN / SCHEMA / RLS / INDEX / MIGRATION / SEO RENDERING / PERFORMANCE`

D translates the accepted complete interface + B-contracts into exact implementation architecture and migration/rollback plan.

No implementation before D/E gates.

---

## 9. PROTECTED DEFECT — SEPARATE

Moderator own-business edit mismatch from A2 remains separate protected production scope. Do not silently fix it through C/D side work.

---

## 10. HANDOFF

**Completed:** V6-0 + A1/A2 + B1–B9 + full-site C blueprint + isolated full-site prototype source.  
**Current:** V6-C full-site completeness + visual review.  
**Production impact:** NONE.  
**Blocked:** V6-D until C completeness and visual direction are reviewed/refined.
