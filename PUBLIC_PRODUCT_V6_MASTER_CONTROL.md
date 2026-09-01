# Попитай.Лом — V6 MASTER CONTROL / ROADMAP / HANDOFF

Статус: **КАНОНИЧЕН КОНТРОЛЕН ДОКУМЕНТ ЗА V6 DRAFT / NO PRODUCTION CODE**  
Branch: `v6-product-foundation-draft`  
Актуализирано: 01.09.2026

При конфликт:

**LOCKED rules > approved production specs > V6 Master Control > completed V6 contracts > supporting drafts.**

---

## 1. CURRENT PRODUCT TRUTH

Production остава на approved Marketplace V3 и protected backend/Admin/Moderator rules.

V6 до този checkpoint **не е променял production UI, schema/RLS, roles, quotas, moderation, protected owners/ranking или URLs**.

Completed product contracts:
- A1/A2;
- B1–B9.

Current prototype artifact:
- `PUBLIC_PRODUCT_V6_C_VISUAL_INTERACTION_PROTOTYPE.md`.

Prototype files:
- `v6-prototype/index.html`;
- `v6-prototype/prototype.css`;
- `v6-prototype/prototype.js`.

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
9. `PUBLIC_PRODUCT_V6_C_VISUAL_INTERACTION_PROTOTYPE.md`;
10. task-specific evidence only.

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
- **V6-C source prototype — COMPLETE**
- **V6-C visual review gate — CURRENT**
- V6-D — BLOCKED until C visual direction is accepted/refined
- V6-E — OPEN after D
- V6-F — OPEN after E

---

## 4. LOCKED WORKING TRUTH

### IA / taxonomy

Stable 16-category public taxonomy remains B1 truth. Canonical desktop/mobile navigation remains unchanged until final approved V6 spec.

### Health

Health uses the same V6 visual/category/mobile/search/share/Facebook shell, but verified Health/Info owner/trust/moderation/freshness remain specialized.

### Search

One intent-aware owner, bounded queries, verified-vs-community separation, true no-result distinct from partial failure.

### Info

Mutable local facts stay Info-owned.

### Articles

Only V6-ready content is Search/SEO eligible.

### Q&A

One intent → one canonical knowledge center; duplicate suggestions precede create.

### Recommendations

Approved structured relations only; self/duplicates excluded; counts derived; no trust/ranking override.

### Facebook

Distribution only; public canonical content only; no arbitrary group scraping/import.

### Ranking

Eligibility/relevance precedes protected/native priority. Admin/Ivanov/boost applies only in valid relevant candidate sets.

### Interactions

Each CTA has one owner-aware target. Listings use proven V3 prefill; Health/Shops remain specialized; Events have no fake public Add; pending content has no public share.

---

## 5. V6-C PROTOTYPE TRUTH

The isolated prototype now shows:
- search-first Home;
- B1 shortcuts;
- `Открий в Лом`;
- common Construction category shell;
- Health in the same shell with verified semantics;
- grouped Search success;
- true no-result → Ask;
- partial failure;
- global Add sheet;
- Listing public prefill example;
- Ask duplicate gate;
- pending vs public/share;
- Health specialized proposal;
- Shop specialized proposal;
- Event state without Add CTA;
- responsive mobile layout.

C source QA found one contradiction in the first draft: site desktop nav had been reused as a prototype screen switcher. It was corrected by restoring canonical site navigation and moving prototype controls to a separate clearly labeled bar.

Prototype files are not referenced from production pages.

---

## 6. CURRENT EXACT TASK

# `V6-C VISUAL REVIEW GATE`

Before V6-D:
- inspect Home first impression;
- inspect category hierarchy/density;
- inspect Health parity;
- inspect desktop/mobile direction;
- inspect Search/Add/Ask states;
- refine visual/copy details if needed.

This is a visual approval/refinement gate, not a production deployment step.

---

## 7. NEXT MAJOR STAGE AFTER C REVIEW

# `V6-D — TECHNICAL DESIGN / SCHEMA / RLS / INDEX / MIGRATION / SEO RENDERING / PERFORMANCE`

D will translate approved B-contracts + C visual direction into exact implementation architecture and migration/rollback plan.

No implementation before D/E gates.

---

## 8. PROTECTED DEFECT — SEPARATE

Moderator own-business edit mismatch from A2 remains separate protected production scope. Do not silently fix it through C/D side work.

---

## 9. HANDOFF

**Completed:** V6-0 + A1/A2 + B1–B9 + C source prototype.  
**Current:** V6-C visual review gate.  
**Production impact:** NONE.  
**Blocked:** V6-D until C visual direction is reviewed/refined.