# Попитай.Лом — V6 MASTER CONTROL / ROADMAP / HANDOFF

Статус: **КАНОНИЧЕН КОНТРОЛЕН ДОКУМЕНТ ЗА V6 DRAFT / NO PRODUCTION CODE**  
Branch: `v6-product-foundation-draft`  
Актуализирано: 31.08.2026

Нов чат започва от LOCKED rules → `PROJECT_PROGRESS.md` → този документ → completed B-contracts → task-specific evidence.

При конфликт:

**LOCKED rules > approved production specs > V6 Master Control > completed V6 contracts > supporting drafts.**

---

## 1. CURRENT PRODUCT TRUTH

Production остава на approved Marketplace V3 и protected backend/Admin/Moderator rules.

V6 е design/research/prototype track и до този checkpoint **не е променял production UI, schema/RLS, roles, quotas, moderation, protected owners/ranking или URLs**.

V6 target:

**local search + marketplace + Firms/entities + Info Lom + Articles/Guides + canonical Q&A + structured recommendations + Facebook distribution + SEO/share + structured local memory.**

---

## 2. REQUIRED READ ORDER

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
15. task-specific evidence.

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

Supporting strategy:
- `PUBLIC_PRODUCT_V6_WORKING_MODEL.md`
- `PUBLIC_PRODUCT_V6_GUARDRAILS.md`
- `PUBLIC_PRODUCT_V6_CONTENT_SEO_STRATEGY.md`
- `PUBLIC_PRODUCT_V6_CONTENT_INVENTORY_RULE.md`
- `PUBLIC_PRODUCT_V6_INFO_LOM_CORE_STRATEGY.md`
- `PUBLIC_PRODUCT_V6_ADOPTION_LAUNCH.md`
- `PUBLIC_PRODUCT_V6_INTERACTION_FORM_LINK_CONTRACT.md`

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
- **B7 Facebook Bridge — CURRENT**
- B8 Local relevance ranking — OPEN
- B9 Exact interaction/forms/buttons/links/states — OPEN

Later:
- V6-C visual/interaction prototype;
- V6-D schema/RLS/index/migration/SEO rendering/performance design;
- V6-E final canonical approved V6 spec;
- V6-F implementation + CI/regression/live QA.

No V6 production code before required gates.

---

## 5. LOCKED WORKING TRUTH

### A. Owner architecture

Firms, Listings, Health/Info, Shops, Events, Q&A and other specialized owners remain authoritative. V6 adds search/relations/presentation, not a universal write owner.

### B. Stable 16-category taxonomy

1. Строителство и ремонти
2. Здраве и лекари
3. Работа
4. Автомобили
5. Имоти
6. Красота
7. Дом и градина
8. Магазини
9. Заведения и храна
10. Електроника
11. Деца и бебета
12. Животни
13. Мода
14. Спорт и хоби
15. Други услуги
16. Други обяви

### C. Health common shell / specialized truth

Health joins the same V6 category/mobile/search/share/Facebook system as other categories. Current Health UI is not frozen. Verified Health/Info owner/moderation/trust/freshness remain specialized. Facebook never becomes second Health truth owner.

### D. Search V6

One explicit Search owner. Result families: route, verified_info, business, listing, shop, event, question, article. Bounded relevant-owner queries only.

### E. Info truth

Mutable local facts belong to controlled Info owner. Publication/reliability/freshness/stale/provenance semantics from B3 are locked.

### F. Articles

Article/Guide explains process/choice/context. Only `ПРОВЕРЕНО ГОТОВО` is normal Search/SEO/feature eligible. One guide intent → one canonical guide. Article/share preview cannot become duplicate mutable Info truth.

### G. Canonical Q&A

One real question intent → one canonical knowledge center. Aliases resolve to canonical. Merge is non-destructive/auditable. Moderation approval ≠ verified fact.

Approved unanswered canonical question may be public/shareable onsite but is default `noindex,follow` until useful answer/utility threshold.

### H. Q&A trust labels

`Избран от автора`, community `Полезен`, and `Проверена информация` are separate concepts. No fake best/verified answer.

### I. Structured recommendation relation

Initial source = approved Q&A answer.

Initial durable targets:
- approved Businesses/Firms; Restaurants are Firms;
- provider-like published Health Info;
- approved Shops.

Listings/Events are excluded from durable entity recommendation counts initially.

### J. Recommendation validity

Countable relation requires:
- stable resolved target id;
- approved public source;
- public target;
- explicit positive polarity;
- non-self source;
- valid moderation/relation state.

Mere mention/negative/ambiguous text does not count.

### K. Recommendation anti-inflation

Same source author contributes max one active positive unit per target. Same answer/target cannot duplicate. Free-text extraction alone cannot change reputation.

Counts are derived from valid unique relations, never manual protected entity counter truth. Cached/materialized aggregates are allowed only if rebuildable.

### L. Health recommendations

Community recommendation is separate from verified Health trust and cannot alter `reliability_status` or imply medical efficacy.

### M. Protected ranking survives

Recommendation counts/signals cannot directly reorder protected Admin/Ivanov/boost semantics. B8 decides allowed relevance use after protected boundary.

### N. Facebook reactions are not Popitai recommendations

External Facebook comments/reactions/likes do not automatically become Q&A answers or B6 recommendation relations.

### O. No invented analytics baseline

Do not claim popularity/top/ranking from unavailable first-party Popitai metrics.

### P. Performance remains hard gate

No heavy framework/AI/vector/external SDK dependency by default; bounded requests and graceful failure.

---

## 6. PROTECTED DEFECT — SEPARATE

A2 confirmed Moderator own-business edit mismatch. It remains separate protected production defect scope and is not silently fixed during B7.

---

## 7. CURRENT EXACT TASK

# `STAGE V6-B7 — FACEBOOK BRIDGE TECHNICAL / PRODUCT CONTRACT`

B7 must define:
1. Popitai → Facebook share flows by content type;
2. share availability timing after moderation/publication;
3. canonical URL + server-readable Open Graph/share metadata contract;
4. safe share text and mutable-fact boundary;
5. user-assisted Facebook → Popitai own-content prefill without scraping;
6. current Meta/platform/group limitations and privacy constraints;
7. no automatic arbitrary-group posting;
8. no automatic external comments/reactions import as Q&A/recommendations;
9. Web Share API / clipboard / Facebook fallback hierarchy;
10. optional PWA/share-target later, not MVP dependency;
11. behavior after content is edited/hidden/deleted after external sharing;
12. attribution/UTM without leaking sensitive content;
13. Health/sensitive-content safety;
14. no Facebook SDK dependency by default;
15. no schema/RLS/production implementation.

Required artifact:

`PUBLIC_PRODUCT_V6_B7_FACEBOOK_BRIDGE_TECHNICAL_PRODUCT_CONTRACT.md`

B7 exit gate:

**Facebook is controlled distribution around canonical Popitai content—not a second owner/scraper/moderation/trust system; every supported share has safe canonical destination, preview, status lifecycle and lightweight fallback.**

---

## 8. EVIDENCE SCOPE FOR B7

Use:
- current Popitai sharing/detail metadata evidence from A2;
- B1 Health parity clarification;
- B3/B4/B5/B6 truth/source/share boundaries;
- current official Meta documentation where platform behavior matters;
- Web Share API/clipboard browser standards where relevant.

No broad unrelated audit.

---

## 9. EXECUTION PROTOCOL

Safe read/design/research autonomous. No production writes. At stage completion update B7 artifact, Master, Progress, Next; set one next task; state production impact.

---

## 10. HANDOFF

**Completed:** V6-0 + A1 + A2 + B1–B6.  
**Current:** V6-B7 Facebook Bridge.  
**Required artifact:** `PUBLIC_PRODUCT_V6_B7_FACEBOOK_BRIDGE_TECHNICAL_PRODUCT_CONTRACT.md`.  
**Production impact:** NONE.