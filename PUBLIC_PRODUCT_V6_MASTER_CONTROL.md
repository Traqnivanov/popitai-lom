# Попитай.Лом — V6 MASTER CONTROL / ROADMAP / HANDOFF

Статус: **КАНОНИЧЕН КОНТРОЛЕН ДОКУМЕНТ ЗА V6 DRAFT / NO PRODUCTION CODE**  
Branch: `v6-product-foundation-draft`  
Актуализирано: 01.09.2026

Нов чат започва от LOCKED rules → `PROJECT_PROGRESS.md` → този документ → completed contracts → task-specific evidence.

При конфликт:

**LOCKED rules > approved production specs > V6 Master Control > completed V6 contracts > supporting drafts.**

---

## 1. CURRENT PRODUCT TRUTH

Production остава на approved Marketplace V3 и protected backend/Admin/Moderator rules.

V6 е design/research/prototype track и до този checkpoint **не е променял production UI, schema/RLS, roles, quotas, moderation, protected owners/ranking или URLs**.

V6 target:

**local search + marketplace + Firms/entities + Info Lom + Articles/Guides + canonical Q&A + structured recommendations + Facebook distribution + deterministic local relevance + exact owner-aware interactions + SEO/share + structured local memory.**

---

## 2. REQUIRED READ ORDER

1. `PROJECT_RULES_00_READ_FIRST.md`
2. `PROJECT_RULES_PROTECTED_CORE.md`
3. `PROJECT_RULES_ADMIN_MODERATOR.md`
4. `PROJECT_RULES.md`
5. `PROJECT_RULES_RENDER_OWNERSHIP.md`
6. `PROJECT_PROGRESS.md`
7. `PUBLIC_PRODUCT_V6_MASTER_CONTROL.md`
8. B1 → B9 completed contracts in numeric order;
9. task-specific evidence only.

---

## 3. COMPLETED CONTRACT REGISTRY

- A1 — `PUBLIC_PRODUCT_V6_CURRENT_TARGET_OWNER_MAP.md`
- A2 — `PUBLIC_PRODUCT_V6_A2_EVIDENCE_BASELINE.md`
- B1 — `PUBLIC_PRODUCT_V6_B1_FINAL_IA_TAXONOMY_CONTRACT.md`
- B1 companion — `PUBLIC_PRODUCT_V6_B1_HEALTH_PRESENTATION_PARITY_CLARIFICATION.md`
- B2 — `PUBLIC_PRODUCT_V6_B2_SEARCH_INTENT_RESULT_CONTRACT.md`
- B3 — `PUBLIC_PRODUCT_V6_B3_INFO_SOURCE_FRESHNESS_SEO_SEARCH_CONTRACT.md`
- B4 — `PUBLIC_PRODUCT_V6_B4_ARTICLE_GUIDE_CONTENT_ARCHITECTURE_CONTRACT.md`
- B5 — `PUBLIC_PRODUCT_V6_B5_QA_CANONICAL_DUPLICATE_ALIAS_MODERATION_CONTRACT.md`
- B6 — `PUBLIC_PRODUCT_V6_B6_STRUCTURED_RECOMMENDATION_RELATION_CONTRACT.md`
- B7 — `PUBLIC_PRODUCT_V6_B7_FACEBOOK_BRIDGE_TECHNICAL_PRODUCT_CONTRACT.md`
- B8 — `PUBLIC_PRODUCT_V6_B8_LOCAL_RELEVANCE_RANKING_PROTECTED_PRIORITY_CONTRACT.md`
- B9 — `PUBLIC_PRODUCT_V6_B9_EXACT_INTERACTION_FORMS_BUTTONS_LINKS_STATES_CONTRACT.md`

Supporting strategy remains available but cannot override completed contracts.

---

## 4. STAGE STATUS

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
- **V6-C Real Desktop/Mobile Visual + Interaction Prototype — CURRENT**

Later:
- V6-D schema/RLS/index/migration/SEO rendering/performance design;
- V6-E final canonical approved V6 spec;
- V6-F implementation + CI/regression/live QA.

No V6 production implementation before required gates.

---

## 5. LOCKED WORKING TRUTH AFTER B1–B9

### A. Owner architecture

Firms, Listings, Health/Info, Shops, Events, Q&A and other specialized owners remain authoritative. V6 adds search/relations/presentation, not a universal write owner.

### B. Stable taxonomy

16 main public categories remain locked from B1. Shortcuts are presentation, not taxonomy.

### C. Health parity

Health joins the same V6 visual/category/mobile/search/share/Facebook system as other categories. Current Health UI is not frozen. Verified Health/Info owner/moderation/reliability/freshness remain specialized.

### D. Search

One intent-aware Search owner; bounded owner queries; verified Info vs community separation; no fake no-result on partial failure.

### E. Info

Mutable local facts remain Info-owned with B3 publication/reliability/freshness/provenance semantics.

### F. Articles

Only `ПРОВЕРЕНО ГОТОВО` is normal Search/SEO/feature eligible. Articles explain; they do not become second mutable Info owner.

### G. Q&A

One intent → one canonical knowledge center. Duplicate suggestions precede create; aliases/merge are non-destructive; approval ≠ verification.

### H. Recommendations

Valid approved Q&A relation → stable approved entity. Self/duplicate/invalid signals excluded. Counts are derived and cannot rewrite owner data/protected ranking.

### I. Facebook Bridge

Facebook is distribution only. Public canonical Popitai content shares outward; no arbitrary group automation/scraping/import; no external reactions becoming Popitai trust signals.

### J. Ranking

Cascade:

**public/safety eligibility → intent/owner eligibility → relevance gate → protected/native priority → trust/freshness/locality → bounded secondary signals → deterministic tie-break.**

Protected Admin/Ivanov/boost applies only inside valid relevant candidate sets.

### K. Exact interactions

B9 locks:
- each main CTA has one owner-aware destination;
- global Add is an owner router;
- Listings keep proven `main/subcategory/intent` prefill and separate `edit` state;
- Firm prefill is not claimed current until safe bounded adapter exists;
- Health/Shops keep specialized Add owners;
- Events have no fake public Add;
- Search no-result → Ask carries bounded context and B5 duplicate gate;
- pending content has no public Facebook share;
- auth/validation/moderation/success/error/back/mobile states are explicit;
- button visibility is never security authority.

### L. Performance

No all-owner mega-query, no heavy AI/vector dependency by default, bounded result/candidate sets, progressive rendering, no duplicate render ownership.

---

## 6. PROTECTED DEFECT — SEPARATE

A2 confirmed Moderator own-business edit mismatch. It remains separate protected production scope and is not silently fixed in V6-C.

---

## 7. CURRENT EXACT TASK

# `STAGE V6-C — REAL DESKTOP/MOBILE VISUAL + INTERACTION PROTOTYPE`

C must turn B1–B9 into one inspectable non-production visual/interaction system.

Required:
1. desktop Home;
2. mobile Home;
3. common category shell;
4. Health inside the same shell with specialized Add semantics;
5. marketplace/category search/results example;
6. Search success groups;
7. Search true no-result → Ask;
8. Search partial failure;
9. global Add sheet;
10. Listing prefilled create example;
11. Ask duplicate suggestion state;
12. pending success without share;
13. approved/public state with B7 share pack;
14. Health proposal modal;
15. Shop proposal modal;
16. canonical Q&A detail/share/report;
17. no Event Add CTA;
18. mobile/focus/accessibility states;
19. isolated prototype assets not referenced by production pages.

C exit gate:

**the user can inspect one coherent desktop/mobile V6 experience and understand how Home, categories, Health, Search, Add, Ask and Facebook/share fit together before production implementation.**

---

## 8. EXECUTION PROTOCOL

Safe prototype work is autonomous.

Prototype may use clearly labeled static/mock records but:
- no invented live metrics;
- no production deployment;
- no production page references to prototype files;
- no schema/RLS/owner changes;
- no protected logic rewrite.

At C completion:
- create/update prototype artifact/spec;
- update Master/Progress/Next;
- set `V6-D` as exact next task;
- state production impact.

---

## 9. HANDOFF

**Completed:** V6-0 + A1 + A2 + B1–B9.  
**Current:** V6-C Visual/Interaction Prototype.  
**Production impact:** NONE.