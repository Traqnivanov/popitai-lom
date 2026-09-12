# Попитай.Лом — CURRENT PROJECT CHECKPOINT

Актуализирано: **12.09.2026**

Този файл е кратък оперативен указател. Той **не е втори продуктов Master**.

## ACTIVE CONTROL STATE

- `CONTROL MODE`: **TOM-1**
- `WORK STATUS`: **UNAVAILABLE / REVIEW PENDING**
- `OFFICIAL REVIEW PROTOTYPE`: `prototype/stage2-icon-system-approval`
- `OFFICIAL BASE SHA`: `545ba5a22f2c1ad9d6e33c349e70a4d48eb1291a`
- `OFFICIAL REVIEW PROTOTYPE`: **FROZEN**
- `ACTIVE WORKSPACE`: `sandbox/work-gap-review`
- `CURRENT STAGE`: **Stage 2 — Icon system approval**
- `CURRENT PRODUCT TASK`: **завършване на първата група `Майстори, ремонти и дом` по Work-established icon order**
- `CURRENT CONTROL TASK`: **TOM control bootstrap / read-order / RED-ZONE guard verification**
- `NEXT ALLOWED ACTION`: **само след PASS на control bootstrap — audit/proposal за оставащите unresolved icon решения; без промяна на Official Review Prototype/production**

Текущият sandbox HEAD винаги се проверява директно в Git при започване на нов TOM/Work session. Не се приема стойност от стар чат по памет.

## Задължителен read order

Винаги започни от:

`PROJECT_RULES_00_READ_FIRST.md`

Той води последователно през:

1. `POPITAI_LOM_MASTER_CURRENT.md`
2. `POPITAI_LOM_DECISION_AND_BACKLOG_REGISTER.md`
3. `POPITAI_LOM_TOM_CONTROL.md`
4. `POPITAI_LOM_WORK_REVIEW_QUEUE.md`
5. този файл
6. приложимите protected/technical rules.

## Exact project state inherited from Official Review Prototype

- Repo: `Traqnivanov/popitai-lom`
- Production `main`: не е променян от текущата Stage 2/TOM работа
- Supabase/schema/RLS/RPC: не са променяни от текущата Stage 2/TOM работа
- Stage 3: не е започван
- Public IA е owner-approved
- Services са offer-only: `Предлагам услуга`; legacy `Търси` остава read/edit compatibility
- Services taxonomy е owner-consolidated: **9 families / 45 visible discovery entries**, с backward-compatible aliases/filters/cross-links
- implementation `38ef8fb2e48b2e8d538232e64d0e785757f93e96` е source-tested и browser-checked на desktop и реален 390 px viewport
- последният Official Review Prototype HEAD преди TOM sandbox е `545ba5a22f2c1ad9d6e33c349e70a4d48eb1291a`

## Icon checkpoint

Icon work остава Stage 2 review работа, не production.

Вече owner-accepted semantic assets не се отварят отново без конкретна причина/OWNER решение.

Work-established редът е:

1. owner review на taxonomy/registry решенията `OWN / SHARED / TEXT / FALLBACK / OPEN`;
2. един base visual style/tokens;
3. първо се завършва цялата група `Майстори, ремонти и дом`;
4. assets се валидират в приложимите small/desktop/390px/social contexts;
5. OWNER approval по icon/group;
6. следваща група едва след verdict за текущата;
7. deterministic registry + regression audit след целия комплект;
8. production/Supabase/Stage 3 остават отделни checkpoints.

Текущата група съдържа 10 visible entries:

- Цялостни ремонти
- Бани и плочки
- ВиК
- Електро
- Покриви
- Шпакловка / гипсокартон / боядисване
- Дограма и врати
- Отопление и климатици
- Монтажи и мебели
- Къртене и извозване

Приетите assets не се сменят по естетическа преценка на TOM/Execution Chat.

## Stage status

**Целият Stage 2 остава НЕПРИЕТ.**

Остават owner visual acceptance, content-complete/reality pass и финален desktop/mobile независим audit. Това TOM sandbox не променя.

## TOM sandbox rules

- Official Review Prototype е frozen.
- Нов implementation без Work се прави само в `sandbox/work-gap-review`.
- TOM контролира задачите; Execution Chat не взима продуктови решения.
- Съществените решения се записват с логиката им.
- Behavior-preserving локални технически fixes могат да използват lightweight path само в разрешения scope.
- RED-ZONE/LOCKED, scope expansion, нов UX/visual/product choice или destructive action → STOP и report към TOM.
- Всичко съществено без Work остава `WORK REVIEW PENDING`.

## Production / protected boundary

Не са разрешени като част от TOM sandbox работата:

- merge/deploy към production `main`;
- Supabase/schema/RLS/RPC/policy/migration промени;
- roles/ownership/moderation/quota/direct-publish промени;
- protected Firms/Listings/Masters/Admin business logic промени;
- production route/canonical migration;
- промяна на accepted product/visual direction без OWNER verdict.

## Work return procedure

Когато Work се върне:

1. започва от `PROJECT_RULES_00_READ_FIRST.md`;
2. чете TOM Control + Work Review Queue;
3. сверява `OFFICIAL BASE SHA` с реалния sandbox HEAD;
4. отваря реалния Git diff;
5. проверява changed files, TOM decisions/tasks, RED-ZONE резултати и QA evidence;
6. дава `ACCEPTED`, `CORRECTION REQUIRED` или `REOPEN` за pending WR records;
7. чак след това определя интеграция към Official Review Prototype или следваща работа.

## Историческа бележка

По-стари Progress/V6/Recovery/Stage указания остават Git history/supporting evidence и не управляват текущата работа, ако противоречат на текущия Master/Decision Register/TOM control.
