# Попитай.Лом — DOCUMENT AUTHORITY INDEX

Статус: **CANONICAL ROUTING INDEX / READY FOR USER REVIEW**
Branch: `v6-product-foundation-draft`
Актуализирано: 02.09.2026

## 1. ЦЕЛ

Този индекс е единствената карта за четене на root Markdown документите. Нов чат не чете всички файлове и не избира сам кой „изглежда най-нов“.

Статуси:

- `LOCKED` — защитено правило; не се променя странично;
- `CANONICAL` — текущ управляващ документ;
- `TASK-SPECIFIC` — отваря се само за посочената задача;
- `REFERENCE` — evidence/detail source, не разрешение за implementation;
- `SUPERSEDED` — исторически checkpoint, не управлява нова работа;
- `CONFLICT/RECONCILED` — полезни части са извлечени, но противоречащите решения са заменени в Recovery;
- `STATUS/HANDOFF` — кратко текущо състояние, не самостоятелна спецификация.

## 2. MINIMUM READ ORDER ЗА НОВ PUBLIC V6 ЧАТ

1. `PROJECT_RULES_00_READ_FIRST.md`
2. `PROJECT_RULES_PROTECTED_CORE.md`
3. `PROJECT_RULES.md`
4. `PROJECT_RULES_RENDER_OWNERSHIP.md`
5. `PROJECT_RULES_ADMIN_MODERATOR.md` — само при roles/permissions/ownership/moderation/protected flow
6. `PUBLIC_MARKETPLACE_V3_APPROVED_SPEC.md`
7. `PUBLIC_PRODUCT_V6_CANONICAL_RECOVERY.md`
8. `PUBLIC_PRODUCT_V6_IMPLEMENTATION_MATRIX.md`
9. `PROJECT_PROGRESS.md`

След това се отваря само task-specific source от таблиците по-долу.

## 3. CORE RULES И APPROVED SPECS

| Документ | Статус | Роля |
|---|---|---|
| `PROJECT_RULES_00_READ_FIRST.md` | `LOCKED` | Scope, autonomy, stop conditions, approved public marketplace truth |
| `PROJECT_RULES_PROTECTED_CORE.md` | `LOCKED` | Firms/Listings/Masters/Admin/Ivanov/roles/limits/status/ownership protections |
| `PROJECT_RULES_ADMIN_MODERATOR.md` | `LOCKED / TASK-SPECIFIC` | Exact Admin/Moderator boundary; read when relevant |
| `PROJECT_RULES.md` | `LOCKED` | Global engineering/product rules |
| `PROJECT_RULES_RENDER_OWNERSHIP.md` | `LOCKED` | One renderer/lifecycle owner per root |
| `PUBLIC_MARKETPLACE_V3_APPROVED_SPEC.md` | `CANONICAL` | Four-group public marketplace, one landing, Add flow |
| `PUBLIC_SITE_INFORMATION_ARCHITECTURE_APPROVED_SPEC.md` | `TASK-SPECIFIC / PARTIALLY SUPERSEDED` | Keep non-conflicting form/mobile/shell decisions; marketplace presentation is superseded by V3 |
| `ADMIN_PANEL_V2_APPROVED_SPEC.md` | `CANONICAL / ADMIN ONLY` | Read only for Admin panel work |

## 4. RECOVERY CONTROL SET

| Документ | Статус | Роля |
|---|---|---|
| `PUBLIC_PRODUCT_V6_CANONICAL_RECOVERY.md` | `CANONICAL / READY FOR REVIEW` | Unified product structure, conflict resolution, freeze and gates |
| `PUBLIC_PRODUCT_V6_IMPLEMENTATION_MATRIX.md` | `CANONICAL / READY FOR REVIEW` | Exact screen/category/owner/route/form/acceptance mapping |
| `PUBLIC_PRODUCT_V6_DOCUMENT_INDEX.md` | `CANONICAL INDEX` | Read routing and authority |
| `PUBLIC_PRODUCT_V6_MASTER_CONTROL.md` | `STATUS / CURRENT` | Concise current roadmap and freeze |
| `PUBLIC_PRODUCT_V6_NEXT_CHAT_START.md` | `HANDOFF / RECOVERY FREEZE` | Zero-explanation entry for a new chat |
| `PROJECT_PROGRESS.md` | `STATUS / CURRENT` | Current factual checkpoint; older sections are historical evidence |

## 5. V6 FOUNDATION / EVIDENCE / STRATEGY

| Документ | Статус | Retained use |
|---|---|---|
| `PUBLIC_PRODUCT_V6_A2_EVIDENCE_BASELINE.md` | `REFERENCE` | Current-source/Supabase read-only evidence; no browser PASS claim |
| `PUBLIC_PRODUCT_V6_CURRENT_TARGET_OWNER_MAP.md` | `REFERENCE` | Owner/render/search technical evidence |
| `PUBLIC_PRODUCT_V6_WORKING_MODEL.md` | `REFERENCE / PARTIALLY SUPERSEDED` | Product vision, relationships, stages; generic external benchmark replaced by Recovery matrix |
| `PUBLIC_PRODUCT_V6_GUARDRAILS.md` | `TASK-SPECIFIC` | No parallel site, performance, data minimization, no heavy default stack |
| `PUBLIC_PRODUCT_V6_ADOPTION_LAUNCH.md` | `REFERENCE / LATER STAGE` | Adoption/trust/launch strategy; does not drive current UI implementation |
| `PUBLIC_PRODUCT_V6_CONTENT_SEO_STRATEGY.md` | `REFERENCE` | Content acquisition/internal linking strategy |
| `PUBLIC_PRODUCT_V6_INFO_LOM_CORE_STRATEGY.md` | `REFERENCE` | Info positioning/SEO/growth; specialized owner remains governing truth |
| `PUBLIC_PRODUCT_V6_CONTENT_INVENTORY_RULE.md` | `TASK-SPECIFIC` | Article/content readiness statuses |
| `PUBLIC_PRODUCT_V6_COPY_QUALITY_RULE.md` | `LOCKED / TASK-SPECIFIC` | Bulgarian public copy quality gate |
| `PUBLIC_PRODUCT_V6_INTERACTION_FORM_LINK_CONTRACT.md` | `REFERENCE / SUPERSEDED BY B9 + MATRIX` | Generic interaction principles only |

## 6. B1–B9 CONTRACTS

| Документ | Статус | Retained use / reconciliation |
|---|---|---|
| `PUBLIC_PRODUCT_V6_B1_FINAL_IA_TAXONOMY_CONTRACT.md` | `CONFLICT/RECONCILED` | Owner/action relations retained. Its 16-equal-category architecture does not supersede Marketplace V3 four groups. |
| `PUBLIC_PRODUCT_V6_B1_HEALTH_PRESENTATION_PARITY_CLARIFICATION.md` | `TASK-SPECIFIC` | Health belongs in common discovery but keeps specialized owner/presentation/share parity |
| `PUBLIC_PRODUCT_V6_B2_SEARCH_INTENT_RESULT_CONTRACT.md` | `TASK-SPECIFIC / REFERENCE` | One Search owner, intent/result/failure/empty/performance contract |
| `PUBLIC_PRODUCT_V6_B3_INFO_SOURCE_FRESHNESS_SEO_SEARCH_CONTRACT.md` | `TASK-SPECIFIC / REFERENCE` | Info authority, source, freshness, search, canonical/SEO contract |
| `PUBLIC_PRODUCT_V6_B4_ARTICLE_GUIDE_CONTENT_ARCHITECTURE_CONTRACT.md` | `TASK-SPECIFIC / REFERENCE` | Guide readiness, owner/freshness/SEO/share boundary |
| `PUBLIC_PRODUCT_V6_B5_QA_CANONICAL_DUPLICATE_ALIAS_MODERATION_CONTRACT.md` | `TASK-SPECIFIC / REFERENCE` | Q&A canonical/duplicate/moderation/privacy/Ask contract |
| `PUBLIC_PRODUCT_V6_B6_STRUCTURED_RECOMMENDATION_RELATION_CONTRACT.md` | `TASK-SPECIFIC / REFERENCE` | Recommendation relations; no fake rating/ranking |
| `PUBLIC_PRODUCT_V6_B7_FACEBOOK_BRIDGE_TECHNICAL_PRODUCT_CONTRACT.md` | `TASK-SPECIFIC / REFERENCE` | Full Facebook distribution/canonical/share/privacy contract |
| `PUBLIC_PRODUCT_V6_B8_LOCAL_RELEVANCE_RANKING_PROTECTED_PRIORITY_CONTRACT.md` | `TASK-SPECIFIC / PROTECTED` | Relevance and protected priority ordering |
| `PUBLIC_PRODUCT_V6_B9_EXACT_INTERACTION_FORMS_BUTTONS_LINKS_STATES_CONTRACT.md` | `TASK-SPECIFIC / REFERENCE` | CTA destinations, forms, auth, states; common 16-category wording is reconciled by four-group Matrix |

B1–B9 са design contracts. Те не са доказателство, че feature е implemented или browser-QA-нат.

## 7. V6-C / PROTOTYPE DOCUMENTS

| Документ | Статус | Retained use / warning |
|---|---|---|
| `PUBLIC_PRODUCT_V6_C_FULL_SITE_INTERFACE_BLUEPRINT.md` | `CONFLICT/RECONCILED` | Screen/state coverage retained; separate All Categories screen is rejected |
| `PUBLIC_PRODUCT_V6_C_HOME_ARCHITECTURE_DECISION.md` | `REFERENCE / RECONCILED` | Search-first and section density retained; Home order follows Recovery |
| `PUBLIC_PRODUCT_V6_C_VISUAL_INTERACTION_PROTOTYPE.md` | `SUPERSEDED AS CURRENT RUNTIME` | Early prototype intent; not current active V17 truth |
| `PUBLIC_PRODUCT_V6_C_PRODUCTION_PARITY_AUDIT.md` | `REFERENCE / EVIDENCE` | P0/P1 parity findings and do-not-lose production capabilities |
| `PUBLIC_PRODUCT_V6_C_PRODUCTION_PARITY_REMEDIATION_V8.md` | `REFERENCE / SOURCE-LEVEL ONLY` | V8 representation claims; not browser acceptance |
| `PUBLIC_PRODUCT_V6_C_FORMS_ROLES_VISIBILITY_LOCK.md` | `LOCKED / TASK-SPECIFIC` | Listing/Firm fields, roles, quotas, media, public/ordering behavior |
| `PUBLIC_PRODUCT_V6_C_FORM_GUIDANCE_VALIDATION_LOCK.md` | `TASK-SPECIFIC` | Contextual examples, validation and owner-specific hints |
| `PUBLIC_PRODUCT_V6_C_FORM_LIFECYCLE_COMPLETENESS_LOCK.md` | `TASK-SPECIFIC` | Dirty/error/submitting/success lifecycle |
| `PUBLIC_PRODUCT_V6_C_FORM_LIFECYCLE_AUDIT_MATRIX.md` | `TASK-SPECIFIC / ACCEPTANCE` | 21-form lifecycle test coverage |
| `PUBLIC_PRODUCT_V6_C_PROTECTED_ADMIN_IVANOV_REGRESSION_GATE.md` | `LOCKED / TASK-SPECIFIC` | Mandatory protected regression gate |
| `PUBLIC_PRODUCT_V6_C_INFO_LOM_VISUAL_CANON_LOCK.md` | `LOCKED / TASK-SPECIFIC` | Preserve-first Info/Health visual and click-depth baseline |

No C document makes V6-C accepted. Current status remains recovery freeze.

## 8. PRE-V6 PUBLIC IA / MARKETPLACE HISTORY

| Документ | Статус | Retained use |
|---|---|---|
| `PUBLIC_IA_STAGE1_TAXONOMY_DECISION.md` | `LOCKED AMENDMENT / TASK-SPECIFIC` | 11 stored categories, 22 service subcategories, backend validation |
| `PUBLIC_IA_STAGE4_CONTEXTUAL_RECOVERY_OWNER_DECISIONS.md` | `APPROVED / TASK-SPECIFIC` | Exact `Боядисване`; offer prefill does not silently invent type; no fake Event Add |
| `PUBLIC_IA_STAGE4_CONTEXTUAL_RECOVERY_MATRIX.md` | `REFERENCE / SUPERSEDED AS DRIVER` | Historical contextual-add audit evidence |
| `PUBLIC_IA_STAGE4_CONTEXTUAL_RECOVERY_PRODUCTION_CHECKPOINT.md` | `SUPERSEDED / HISTORY` | Old production checkpoint |
| `PUBLIC_IA_STAGE4_PRODUCTION_CHECKPOINT.md` | `SUPERSEDED / HISTORY` | Old stage checkpoint |
| `PUBLIC_IA_STAGE5_QA_CHECKPOINT.md` | `SUPERSEDED / HISTORY` | Old QA checkpoint, not V6 browser evidence |
| `POST_MARKETPLACE_REGRESSION_PLAN.md` | `TASK-SPECIFIC / REFERENCE` | Production marketplace regression scope if implementation reaches that stage |

## 9. ADMIN / QA / INFO HISTORY

| Документ | Статус | Retained use |
|---|---|---|
| `ADMIN_PANEL_V2_HANDOFF_2026-08-24.md` | `SUPERSEDED / HISTORY` | Historical Admin handoff; approved spec/current progress govern |
| `INFO_LOM_HEALTH_CHECKPOINT.md` | `REFERENCE / HISTORY` | Health checkpoint evidence; current Info canon governs presentation |
| `LIVE_QA_FINDINGS_2026-08-22.md` | `SUPERSEDED / HISTORY` | Dated QA findings, not current PASS |

## 10. MASTER ROUTING BY TASK

| Task | Read after minimum set |
|---|---|
| Marketplace IA/prototype | Matrix + Marketplace V3 + Stage1 taxonomy decision |
| Listing/Firm form | C Forms/Roles + Guidance + Lifecycle + Audit Matrix |
| Search | B2 + B8 + applicable B3/B5 |
| Info/Health | B3 + Info visual canon + Health clarification |
| Shops | B1 owner sections + B9 + production parity audit |
| Q&A | B5 + B6 + B9 |
| Facebook/share | B7 + owner-specific B3/B4/B5 |
| Articles/content | B4 + Content Inventory + Copy Quality |
| Admin/Moderator | Admin rule + Admin approved spec + protected regression gate |
| Render/runtime consolidation | Render Ownership rule + parity audit/remediation evidence |

## 11. ARCHIVE/DELETE RULE

Нищо не се изтрива в Recovery.

След user approval може да има отделна documentation cleanup задача, само ако:

1. всяко unique applicable requirement е trace-нато към Canonical/Matrix/task-specific source;
2. историческите commit references остават достъпни;
3. Handoff/Master/Progress не сочат към премахнат файл;
4. cleanup не се смесва с product implementation.
