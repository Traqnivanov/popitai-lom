# Попитай.Лом — V6 NEXT CHAT START

Статус: **START HERE / ZERO-EXPLANATION HANDOFF**  
Branch: `v6-product-foundation-draft`  
Актуализирано: 31.08.2026

Този файл позволява нов чат да продължи без потребителят да обяснява отново проекта, историята, текущия stage или следващата задача.

## Ако четеш това в нов чат

Работим по:

`Traqnivanov/popitai-lom`

Не прави нов repo/clone и не започвай проекта отначало.

### 1. Прочети първо

1. `PROJECT_RULES_00_READ_FIRST.md`
2. `PROJECT_RULES_PROTECTED_CORE.md`
3. `PROJECT_RULES_ADMIN_MODERATOR.md`
4. `PROJECT_RULES.md`
5. `PROJECT_RULES_RENDER_OWNERSHIP.md`
6. `PROJECT_PROGRESS.md`
7. `PUBLIC_PRODUCT_V6_MASTER_CONTROL.md`
8. `PUBLIC_PRODUCT_V6_B1_FINAL_IA_TAXONOMY_CONTRACT.md`

После прочети само supporting V6 документите, които са нужни за текущата задача.

### 2. Текущо състояние

Завършени:
- `V6-0 — CONTROL / CONTINUITY`;
- `V6-A1 — CURRENT → TARGET OWNER / RELATIONSHIP MAP`;
- `V6-A2 — EVIDENCE / COVERAGE / RUNTIME BASELINE`;
- `V6-B1 — FINAL IA / TAXONOMY / OWNER CONTRACT`.

Основни artifacts:
- `PUBLIC_PRODUCT_V6_CURRENT_TARGET_OWNER_MAP.md`;
- `PUBLIC_PRODUCT_V6_A2_EVIDENCE_BASELINE.md`;
- `PUBLIC_PRODUCT_V6_B1_FINAL_IA_TAXONOMY_CONTRACT.md`.

Production е **непроменен от V6 planning track** и остава на approved Marketplace V3 + LOCKED backend/Admin/Moderator/owner rules.

B1 е заключил stable 16-category taxonomy, shortcuts vs taxonomy, `Открий в Лом`, owner-aware Add routes, Jobs vs Services, specialized owner boundaries, backward URLs и Find/Add/Ask semantics.

### 3. EXACT NEXT TASK

# `STAGE V6-B2 — SEARCH V6 / RESULT COMPOSITION / INTENT ROUTING CONTRACT`

Не прави нов broad audit. Не преотваряй B1 без доказан blocker. Не започвай production code.

Изработи:

`PUBLIC_PRODUCT_V6_B2_SEARCH_INTENT_RESULT_CONTRACT.md`

B2 трябва да заключи:
- един explicit Search owner вместо current legacy/new ambiguity;
- normalization, Bulgarian/local synonyms и B1 taxonomy intent mapping;
- exact result types и authoritative owner queries;
- verified Info vs community opinion ordering;
- local relevance, без да нарушава protected Ivanov/Admin/boost priority;
- no-result → contextual `Попитай Лом`;
- query limits, debounce, cancellation, pagination/show-more, cache и failure states;
- URL/canonical/SEO последствия на filtered states;
- полезни analytics events без измислен current baseline;
- mobile/performance/render-ownership budget.

No schema/RLS/production implementation.

### 4. Работен режим

- безопасните read-only/design стъпки изпълняваш автономно;
- не искай от потребителя стария контекст;
- не преотваряй V3/A1/A2/B1 без доказана причина;
- нови идеи записвай, без да разбиваш текущия stage;
- protected/risky production промяна не прави без подходящо approval;
- V6 production code не започва преди B/C/D/E gates.

### 5. След B2

Преди да приключиш stage-а:

1. update `PUBLIC_PRODUCT_V6_MASTER_CONTROL.md`;
2. update `PROJECT_PROGRESS.md`;
3. запиши B2 status/evidence/risks;
4. задай един exact next task;
5. запиши production impact;
6. актуализирай този `PUBLIC_PRODUCT_V6_NEXT_CHAT_START.md`.

## Минимално съобщение от потребителя в нов чат

Достатъчно е:

**`@GitHub Продължи Попитай.Лом по PUBLIC_PRODUCT_V6_NEXT_CHAT_START.md. Работи автономно.`**

Не изисквай друго обяснение, ако repo и документите са достъпни.
