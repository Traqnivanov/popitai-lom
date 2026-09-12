# Попитай.Лом — WORK REVIEW QUEUE

Статус: **ACTIVE IN SANDBOX / WORK REVIEW PENDING**  
Създаден: **12.09.2026**  
Контрол: `POPITAI_LOM_TOM_CONTROL.md`

Този файл е оперативната опашка за всичко съществено, направено без Work. Той НЕ е продуктов Master и НЕ създава сам продуктови решения.

## CURRENT TOM STATE

- `CURRENT TOM`: **TOM-1**
- `WORK STATUS`: **UNAVAILABLE / REVIEW PENDING**
- `OFFICIAL REVIEW PROTOTYPE`: `prototype/stage2-icon-system-approval`
- `OFFICIAL BASE SHA`: `545ba5a22f2c1ad9d6e33c349e70a4d48eb1291a`
- `OFFICIAL REVIEW PROTOTYPE STATUS`: **FROZEN**
- `SANDBOX BRANCH`: `sandbox/work-gap-review`
- `SANDBOX HEAD`: **VERIFY DIRECTLY IN GIT AT SESSION START**
- `CURRENT STAGE`: Stage 2 — Icon system approval
- `CURRENT PRODUCT TASK`: първата icon/discovery група `Майстори, ремонти и дом` е semantic 10/10; deterministic sandbox wiring checkpoint е имплементиран и чака visual/browser QA + OWNER acceptance after QA
- `CURRENT CONTROL TASK`: **TOM1-T003 — first-group deterministic icon wiring checkpoint**
- `LAST TOM DECISION`: `TOM1-D005`
- `OPEN WR IDs`: `WR-001`, `WR-002`, `WR-003`, `WR-004`, `WR-005` — Work review pending
- `OPEN FOUND-ISSUES`: няма отворен FI от first-group renderer; `FI-001` е FIXED IN SANDBOX / WORK REVIEW PENDING
- `BLOCKERS`: реалната visual/browser QA на wiring-а още не е изпълнена; Browser Connector беше недостъпен. Това не позволява да се обяви OWNER ACCEPTED AFTER QA или official/prod wiring.
- `NEXT ALLOWED ACTION`: visual/browser QA на текущия sandbox wiring (desktop + 390 px + broken-image/overflow check). Не се прави production wiring и social wiring не се смесва с този checkpoint.

> Забележка: SANDBOX HEAD не се hardcode-ва като самореферентна „вечна“ стойност в същия state commit. Всеки TOM/Work го сверява директно от Git и сравнява с `OFFICIAL BASE SHA`.

---

## TOM1-D001 — Активиране на TOM sandbox control

- `Дата`: 12.09.2026
- `Тема`: временен строг контрол при недостъпен Work
- `Проблем`: без Work липсва независим постоянен контролен слой; чатови решения могат да се изгубят при лимит или да бъдат интерпретирани различно от следващ агент.
- `Evidence`: съществуващите Master/Register/Progress/PROJECT_RULES документи пазят значителна част от контекста, но преди TOM bootstrap няма отделен Work Review Queue, няма формализиран TOM→Execution contract и read order-ът не включва всички текущи control sources.
- `OWNER verdict`: **APPROVED — ACTIVATE NOW**
- `Избрано решение`: Official Review Prototype остава frozen; временната работа се извършва само в `sandbox/work-gap-review`; TOM-1 контролира Execution Chat; всяко съществено TOM решение се записва с логика; Work по-късно прави независим Git diff review.
- `Логика`: отделният sandbox прави работата обратима и позволява Work да сравни точния delta, без временното TOM изпълнение да променя официалния review prototype или production.
- `Допълнителен контрол`: RED-ZONE detection guard; TOM verification не е final acceptance; нов TOM прави Git-based state recovery; lightweight path е разрешен само за behavior-preserving технически изпълнения без ново продуктово решение.
- `Разрешен scope за bootstrap`: control docs + RED-ZONE detection guard само в sandbox.
- `Забранен scope`: prototype UI/UX, accepted icons, taxonomy, production `main`, Supabase, schema/RLS/RPC, protected business logic.
- `Work review`: **PENDING**

---

## TOM1-D002 — Strict Icon Execution Contract

- `Дата`: 12.09.2026
- `Тема`: постоянен строг договор за създаване на всяка следваща нова икона.
- `Проблем`: visual style и техническите изисквания вече са установени, но ако Execution Chat получава само кратка инструкция или пакет от много икони, има риск от drift в стил, размер, прозрачност, семантика и качество, както и от погрешно self-approval.
- `OWNER verdict`: **APPROVED — RECORD**.
- `Избрано решение`: създаден е task-specific contract `prototype-final-ia/ICON_EXECUTION_CONTRACT.md`; **една Execution задача съдържа точно една нова икона**, а критичните правила се повтарят в самата задача, не се разчита само на линк или памет.
- `Задължителен review/source output`: PNG 1024×1024, истински alpha transparent фон, без плочка/рамка/badge, един доминиращ обект + максимум два поддържащи детайла, приблизително 68–75% заетост, минимум 12–15% safe margin, нищо изрязано.
- `Задължителен visual language`: premium 3D, еднакъв мащаб, 3/4 изометрична перспектива, реалистични материали, чисти форми, мека студийна светлина отгоре вляво и последователен brand treatment според актуалния договор.
- `Забранено`: emoji, cartoon/детска/toy стилистика, лица/усмивки, текст, букви, цифри, марки, лога, водни знаци, измислени етикети, прекомерни детайли и visual clutter.
- `Достоверност`: всеки предмет трябва да е технически и физически правдоподобен и да остава професионално четим при силно намаляване.
- `Pre-show gate`: Execution Chat проверява всяко условие преди показване; TOM проверява резултата; QA PASS не е OWNER acceptance.
- `Approval authority`: **само OWNER може да даде окончателен `ACCEPTED` verdict за нова икона**.
- `Relationship to existing assets`: договорът НЕ отваря повторно вече owner-accepted assets и НЕ променя техния verdict.
- `Relationship to derivatives`: 1024×1024 PNG е source/review output за бъдещите нови assets; точният след-acceptance derivative pipeline е доуточнен и заключен по-късно в `TOM1-D004`.
- `No implicit permission`: договорът не разрешава mass generation, taxonomy промяна, renderer wiring, production replacement, Supabase/backend или redesign на accepted icon.
- `Implementation evidence`: `prototype-final-ia/ICON_EXECUTION_CONTRACT.md` added at commit `f3117135d06a870479aca1380d781313317bf047`.
- `Work review`: **PENDING**.

---

## TOM1-D003 — Brand color language refinement

- `Дата`: 12.09.2026
- `Тема`: точно описание на тъмносиньо-златистия визуален език на icon серията.
- `Проблем`: първата формулировка „тъмносиньо и златисто само като малки акценти“ е прекалено ограничителна и не описва реално вече OWNER-accepted серията, в която двата брандови цвята се повтарят по много логични технически и конструктивни детайли.
- `Evidence`: OWNER изрично посочи, че приетите икони използват синьо и златисто почти навсякъде, където е реалистично — корпусни части, копчета, гайки и други подходящи елементи.
- `OWNER verdict`: **APPROVED — UPDATE RULE**.
- `Избрано решение`: тъмносиньото и златистото са постоянен брандов визуален език на серията, а не единични декоративни акценти. Използват се върху всички конструктивно и материално логични оцветими части; естествени материали не се пребоядисват насила.
- `Тъмносиньо`: основен брандов цвят при реалистично боядисани/полимерни корпусни панели и подходящи конструктивни части.
- `Златисто`: повтарящ се вторичен брандов цвят за логични акцентни панели, бутони/копчета, пръстени, съединения, гайки и малки технически/конструктивни детайли.
- `Естествени материали`: тухла, бетон, работна стомана, дърво, гума, стъкло, почва, растения и други естествени материали запазват реалистичния си цвят, освен ако реалният предмет конструктивно допуска боядисване.
- `Граница`: цветовете никога не трябва да правят предмета физически или професионално неправдоподобен.
- `Current task effect`: `TOM1-T001` запазва одобрената demolition/debris концепция, но жълто-доминиращият къртач се връща за brand-color correction; concept не се redesign-ва.
- `Implementation evidence`: `prototype-final-ia/ICON_EXECUTION_CONTRACT.md` updated at commit `eff9305ba1daf92096c042efd8feddfa34578be8`.
- `Work review`: **PENDING**.

---

## TOM1-D004 — Master → site/social derivative pipeline

- `Дата`: 12.09.2026
- `Тема`: точният технически pipeline след OWNER acceptance на нов icon master.
- `Evidence`: Work proof-ът вече използва отделни 128 px site и 512 px social WebP производни, валидирани при 20–24 px, desktop/card, реален 390 px mobile и 1200×630 social composition. Social Card layer използва отделна 1200×630 композиция, а не просто уголемена site икона.
- `OWNER verdict`: **APPROVED — LOCK THIS MODEL**.
- `Избрано решение`: приетият 1024×1024 PNG с true alpha остава master/review source. След `ACCEPTED` се произвеждат от същия master: 128×128 WebP за site и отделен 512×512 WebP за social. 512 px asset-ът се използва вътре в 1200×630 social/OG композицията.
- `No redraw`: след OWNER acceptance не се прерисува концепцията за site/social; производните са технически derivatives на същия приет master.
- `256 px`: не е част от базовия pipeline и не се създава превантивно. Може да се добави само ако бъде доказана реална browser/performance/quality нужда и има отделно TOM/OWNER разрешение.
- `Boundary`: решението не разрешава prototype wiring, production wiring, renderer промяна, taxonomy промяна или Supabase/backend работа.
- `Implementation evidence`: `prototype-final-ia/ICON_EXECUTION_CONTRACT.md` section 16 added at commit `3201937fcd061f66ac9c6e29b14bccae7bd98b99`.
- `Work review`: **PENDING**.

---

## TOM1-D005 — First-group deterministic icon wiring checkpoint

- `Дата`: 12.09.2026
- `Тема`: deterministic sandbox wiring само за owner-accepted first repair group.
- `OWNER verdict`: **SANDBOX IMPLEMENTATION APPROVED** — OWNER прие плана и даде „Ок действия“ след изричното уточнение `binary assets → registry → QA`.
- `Scope`: първата 10/10 група `Майстори, ремонти и дом`; site 128 px layer само. Social wiring остава отделно.
- `Последователност`: първо двата липсващи accepted binary assets са добавени физически в repo; след това е създаден exact-name registry; чак след това renderer wiring.
- `Registry`: `prototype-final-ia/prototype-icon-registry.js`; exact semantic name → exact accepted site asset. `Майстори и ремонти` alias-ва shared `Цялостни ремонти` asset. Няма AI/free-text guessing и няма positional selection.
- `Fallback`: липса на owner-approved registry mapping → **text only**. Generic emoji не се показва като semantic fallback на service cards.
- `Renderer`: `prototype-service-views.js::serviceGroup()` вече не използва `icons[i % icons.length]`; routes/Add logic са запазени. Add-mode/forms остават text-first и не получават декоративни taxonomy icons.
- `Masters surface`: десетте accepted entries получават exact icon+text; 64 px desktop / 56 px mobile.
- `Static QA`: PASS за 10/10 registry paths existing in repo; PASS за physical presence на `full-renovation.webp` и `demolition-debris.webp`; PASS за removal на positional renderer от service surface; PASS за unchanged `href` construction in compared code; PASS за text-only behavior when mapping липсва; PASS за scoped Git diff.
- `Visual/browser QA`: **PENDING** — не е симулиран PASS. Browser Connector е недостъпен в текущата сесия, затова 390 px/desktop overflow/broken-image visual check остава следващият gate.
- `No overclaim`: static QA/TOM verification не е OWNER acceptance after QA, Work acceptance, official review approval или production approval.
- `Production touched`: **NO**.
- `Supabase/backend touched`: **NO**.
- `Social wiring touched`: **NO**.
- `Work review`: **PENDING**.

---

## WR-001 — TOM control bootstrap

- `Source`: `TOM1-D001`
- `OWNER verdict`: APPROVED
- `Scope`: sandbox control infrastructure/documentation only
- `Official base`: `prototype/stage2-icon-system-approval@545ba5a22f2c1ad9d6e33c349e70a4d48eb1291a`
- `Sandbox`: `sandbox/work-gap-review`
- `Production touched`: **NO**
- `Supabase/backend touched`: **NO**
- `Prototype UI/UX touched`: **NO**
- `Protected business logic touched`: **NO**
- `Changed files verified against base`:
  - `POPITAI_LOM_TOM_CONTROL.md`
  - `POPITAI_LOM_WORK_REVIEW_QUEUE.md`
  - `PROJECT_RULES_00_READ_FIRST.md`
  - `PROJECT_PROGRESS.md`
  - `.github/scripts/check_tom_red_zone.py`
  - `.github/workflows/tom-red-zone-guard.yml`
- `TOM verification`: **TOM VERIFIED** — compare against official base showed only the six control/guard files above; no prototype UI/UX, Supabase/backend or production file appeared in the diff.
- `Read-order verification`: **PASS** — `PROJECT_RULES_00_READ_FIRST.md` now has one explicit order: Master → Decision Register → TOM Control → Work Review Queue → Progress → applicable technical rules.
- `Current-task verification`: **PASS** — Progress and Queue identify Stage 2 Icon system approval and the first current group `Майстори, ремонти и дом`.
- `Frozen-official verification`: **PASS AT BOOTSTRAP DIFF** — sandbox was created from exact official SHA `545ba5a...`; all bootstrap commits are on `sandbox/work-gap-review`.
- `RED-ZONE note`: control/guard files are RED ZONE for normal Execution work; this bootstrap is an explicit OWNER-approved control task.
- `Guard status`: detector + workflow added. This is **DETECTION LAYER ONLY** until required checks/branch rules are separately enabled and verified.
- `Known risk`: repository protection is not upgraded by this bootstrap. Do not describe the guard as a guaranteed merge block.
- `Work verdict`: **PENDING**

---

## WR-002 — Strict Icon Execution Contract

- `Source`: `TOM1-D002`
- `OWNER verdict`: APPROVED
- `Scope`: task-specific icon generation/review control only
- `Contract`: `prototype-final-ia/ICON_EXECUTION_CONTRACT.md`
- `Evidence commit`: `f3117135d06a870479aca1380d781313317bf047`
- `Production touched`: **NO**
- `Supabase/backend touched`: **NO**
- `Existing accepted icons changed`: **NO**
- `Taxonomy changed`: **NO**
- `Rule enforced`: one Execution task = one icon; full critical visual/output rules repeated in each task; only OWNER approves.
- `Known boundary`: 1024×1024 PNG е review/source output; точният derivative pipeline е заключен в `TOM1-D004` / `WR-004`.
- `Work verdict`: **PENDING**

---

## WR-003 — Brand color contract refinement + TOM1-T001 first candidate QA

- `Source`: `TOM1-D003` / `TOM1-T001`
- `OWNER verdict`: APPROVED for rule refinement; първият candidate е superseded от по-късно OWNER-accepted master.
- `Scope`: icon visual-language contract and `Къртене и извозване` correction cycle.
- `Historical first candidate QA`: semantic direction PASS; technical FAIL (1536×1536 RGB/no alpha) + color correction required.
- `Current outcome`: `Къртене и извозване` впоследствие е OWNER ACCEPTED като 1024×1024 PNG RGBA master с accepted 128 site + 512 social derivatives; индивидуалният current status се пази в `ICON_REVIEW_LOG.md`.
- `Contract evidence`: `eff9305ba1daf92096c042efd8feddfa34578be8`.
- `Production touched`: **NO**.
- `Work verdict`: **PENDING**.

---

## WR-004 — Owner-approved icon derivative pipeline

- `Source`: `TOM1-D004`
- `OWNER verdict`: **APPROVED**.
- `Scope`: post-acceptance icon derivative/output contract only.
- `Master`: 1024×1024 PNG with true alpha.
- `Site derivative`: 128×128 optimized WebP.
- `Social derivative`: 512×512 optimized WebP.
- `Social output`: 512 px derivative is an input to the separate 1200×630 social/OG composition; social output is not a scaled site card.
- `No redraw`: derivatives come from the same accepted master.
- `256 px`: not part of the baseline; future evidence + separate approval required.
- `Contract evidence commit`: `3201937fcd061f66ac9c6e29b14bccae7bd98b99`.
- `Production touched`: **NO**.
- `Prototype wiring touched`: **NO** by this decision itself.
- `Supabase/backend touched`: **NO**.
- `Work verdict`: **PENDING**.

---

## WR-005 — First repair-group deterministic site wiring

- `Source`: `TOM1-D005`.
- `OWNER verdict`: **SANDBOX IMPLEMENTATION APPROVED; OWNER ACCEPTANCE AFTER QA PENDING**.
- `Scope`: site icon wiring for accepted first repair group only.
- `Binary dependency evidence`: commit `a1d385e7948ded913b8136e94f191124363b9dad` adds `icon-review-assets/site/full-renovation.webp` and `icon-review-assets/site/demolition-debris.webp` before registry wiring.
- `Registry evidence`: commit `76df87799bc53b51739dd14ceb7e9ca014059851` adds `prototype-icon-registry.js`; `a04b5fe5a8880124ae95486641379a1f16e625d5` loads it before service views.
- `Renderer/styles evidence`: deterministic wiring and compatibility/style passes culminate at sandbox HEAD `b18c7c7777647caafb276ed2670806bca786212e` before this queue record; live HEAD must still be re-fetched.
- `Static dependency QA`: 10/10 first-group registry file names exist physically under `icon-review-assets/site/`; new binary blob SHAs are `3a119a53...` (full renovation) and `bf9fbd61...` (demolition).
- `Renderer QA`: `serviceGroup()` no longer uses `icons[i % icons.length]`; unmapped entries have no semantic image and remain text-only; Add routes keep existing construction.
- `Masters QA`: exact 10 `master-chip` selectors are preserved for regression compatibility; icon+text layout uses 64 px desktop and 56 px mobile.
- `Git scope QA`: compare from pre-wiring `980c9aa398e6b0840640c1053b59476db0ea0b70` to wiring HEAD `b18c7c7777647caafb276ed2670806bca786212e` changes only six files: two site WebP assets, `index.html`, new registry, `prototype-service-views.js`, `prototype-services.css`.
- `Known untouched legacy`: generic emoji array remains in `prototype-core.js`; it was not deleted without a separate usage audit. The approved service renderer no longer consumes it positionally.
- `Visual/browser QA`: **PENDING** — Browser Connector unavailable; no claim of real desktop/390 px rendering PASS yet.
- `Production touched`: **NO**.
- `Supabase/backend touched`: **NO**.
- `Social wiring touched`: **NO**.
- `Work verdict`: **PENDING**.

---

## TOM1-AUDIT-001 — Първа icon/discovery група `Майстори, ремонти и дом`

- `Дата`: 12.09.2026
- `Тип`: READ-ONLY AUDIT / NO PRODUCT CHANGE
- `Scope`: exact state на 10-те owner-approved visible discovery entries и тяхното icon acceptance състояние в момента на първоначалния audit.
- `Доказано приети тогава`: `Бани и плочки`, `ВиК`, `Електро`, `Покриви`, `Шпакловка / гипсокартон / боядисване`, `Дограма и врати`, `Отопление и климатици`, `Монтажи и мебели`.
- `Исторически нерешени тогава`: `Цялостни ремонти` и `Къртене и извозване`; и двете впоследствие са OWNER ACCEPTED и имат точни derivatives по contract.
- `Implementation boundary`: audit-ът сам не разрешава wiring; wiring е разрешен по-късно с `TOM1-D005`.
- `Work review`: PENDING together with sandbox work.

### FI-001 — Generic positional service icons

- `Location`: `prototype-final-ia/prototype-service-views.js` → `serviceGroup()`.
- `Original finding`: generic icon се избираше чрез `icons[i % icons.length]`, а `prototype-core.js` държи общ emoji масив.
- `Risk`: позиционен generic знак може да не съответства на конкретната taxonomy семантика и противоречи на deterministic registry direction.
- `Resolution`: **FIXED IN SANDBOX** по `TOM1-D005` — service renderer използва exact-name registry; при липса на approved mapping показва text only.
- `Legacy note`: общият emoji масив в `prototype-core.js` не е изтрит без usage audit; FI-001 се отнася до positional service renderer, който вече не го използва.
- `Status`: FIXED IN SANDBOX / WORK REVIEW PENDING / VISUAL QA PENDING.

---

## Work review procedure

При връщане Work НЕ приема тази опашка по доверие. Първо:

1. прочита `PROJECT_RULES_00_READ_FIRST.md`;
2. възстановява current state;
3. сверява `OFFICIAL BASE SHA` с реалния sandbox HEAD;
4. отваря реалния Git diff;
5. сравнява changed files с TOM records;
6. проверява RED-ZONE guard резултатите и приложимото QA;
7. дава на всеки WR само `ACCEPTED`, `CORRECTION REQUIRED` или `REOPEN`.

Ако Git показва неописана промяна: `STATE MISMATCH` → няма нов implementation до изясняването ѝ.
