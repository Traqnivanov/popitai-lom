# Попитай.Лом — ТЕКУЩ CHECKPOINT

Този файл съдържа само актуалното състояние и оставащите задачи. Приключени, отменени и остарели задачи не се пазят тук, за да не подвеждат бъдеща работа.

## 1. ЗАДЪЛЖИТЕЛНИ ПРАВИЛА ПРЕДИ ПРОМЯНА

Преди всяка редакция се четат в този ред:
1. `PROJECT_RULES_00_READ_FIRST.md`
2. `PROJECT_RULES_PROTECTED_CORE.md`
3. `PROJECT_RULES_ADMIN_MODERATOR.md`
4. `PROJECT_RULES.md`
5. `PROJECT_RULES_RENDER_OWNERSHIP.md`
6. `PUBLIC_SITE_INFORMATION_ARCHITECTURE_APPROVED_SPEC.md`, когато се работи по публичния сайт
7. `ADMIN_PANEL_V2_APPROVED_SPEC.md`, когато се работи по Admin/Moderator панела
8. конкретните модулни правила, ако има такива.

При конфликт между документи не се избира правило по предположение — конфликтът се проверява и се отстранява преди промяна. По-късен checkpoint няма право мълчаливо да стеснява APPROVED спецификацията.

## 2. ЗАЩИТЕНО ЯДРО

LOCKED без отделно изрично одобрение:
- Фирми и фирмени профили;
- Обяви;
- „Майстори и ремонти“;
- основната администраторска логика и критичните admin actions;
- роли, права, ownership, approval/direct publish, лимити и статуси в защитените модули;
- специалният search priority за ремонти/строителство/майстори и Иванов Ремонти.

Одобрена промяна се изпълнява до качване. Ако по време на работа се появи дори косвен риск за защитената логика, спира се преди рисковата промяна и се докладва.

## 3. АКТУАЛНА ПУБЛИЧНА АРХИТЕКТУРА

### Категории
Публичните 8 карти са:
1. Майстори и ремонти — LOCKED
2. Здраве и лекари
3. Автомобили
4. Магазини и покупки
5. Заведения
6. Услуги
7. Всички обяви — LOCKED каталог
8. Събития

Публично се използват `Услуги` и `Събития`. Legacy стойностите `Работа и услуги` / `Събития и град` се пазят само като вътрешни compatibility стойности там, където още са нужни.

### Консолидация на „Услуги“
- `Майстори и ремонти`, `Автомобили` и `Услуги` са тематични входове за откриване и contextual действия.
- `Обяви → Услуги` е единственият публикационен тип за еднократно предлагане/търсене на услуга.
- `Фирми → Услуги` е постоянен профил на доставчик, не конкурентен marketplace hub.
- `Инфо Лом → Комунални услуги` остава отделен проверен справочник.
- здравната услуга остава специален health flow без medical marketplace.

### Каноничен речник / Обяви → Услуги
- Stage 1 речникът е authoritative source за public label/routing/form mappings.
- `Обяви → Услуги` използва контролиран dependent subcategory select с одобрените 22 service стойности.
- Каноничната ремонтна стойност остава `Боядисване`; не се въвежда stored alias `Боядисване и шпакловка`.
- Старите/legacy записи не се мигрират на сляпо.
- Backend taxonomy integrity amendment е приложен без промяна на RLS, ownership, квоти, media или moderation semantics.

### Contextual add — RECOVERED
- Майстори: всичките 8 repair subcategories имат discovery + `Предложи услуга` + `Търся изпълнител`; listing form се prefill-ва с `Услуги + exact subcategory`; firm flow prefill-ва `Майстори и ремонти`.
- Автомобили: 6 auto-service subcategories имат contextual offer/seek; автомобилна публикация prefill-ва `Автомобили и МПС`; фирма prefill-ва `Автомобили`.
- Услуги: 8 general-service subcategories имат contextual offer/seek; firm flow използва public `Услуги` / internal `Работа и услуги`.
- `Предложи услуга` НЕ prefill-ва listing type; потребителят избира от съществуващите разрешени типове.
- `Търся изпълнител` / `Търся услуга` може да prefill-не съществуващото `Търси`.
- Заведения използват съществуващата фирмена форма с `Заведения` prefill.
- Shops делегира към съществуващия специализиран shop add owner; Health остава при health owner; Events няма fake `Добави събитие` без доказан public submission owner.
- `edit=<id>` има приоритет и create-prefill никога не презаписва loaded listing/business data.

### Търсене
- `public-search-v1.js` е authoritative owner за общото публично търсене.
- Публичните remote източници са approved фирми, approved въпроси и approved + active обяви с минимални публични полета.
- Няма authoritative `localStorage` fallback.
- Защитената construction/„Иванов Ремонти“ логика остава в `script.js` и не се дублира.
- Production regression след contextual recovery: `шпакловка` → `Иванов Ремонти Лом`; `работа` → без false-positive Ivanov; `автомивка` → автомобилен контекст без construction/Ivanov injection.

### Тематични обяви
- `category-listings-v1.js` е read-only listings owner за `Майстори и ремонти`, `Автомобили` и `Услуги`.
- Показва само approved + active записи според каноничните Stage 1 service groups.
- Не променя listings write flow, RLS, ownership, status, quota или moderation.

### Магазини
- Активният публичен каталог е `shops-catalog-v3.js` + Supabase.
- Специализираният shop add flow остава единственият owner на магазинните предложения.
- Default категорията е `food` / `Хранителни`; валиден последно избран tab се възстановява от `localStorage`.
- Contextual `Добави магазин` делегира към съществуващия owner и не създава втори shop flow.

### Здраве
- Съществуващият health dataset/renderer и `Добави лекар или здравна услуга` flow остават собственици.
- Не се създава втори лекарски каталог или medical marketplace.

### Събития
- Публичният renderer показва одобрени предстоящи събития.
- Admin moderation flow остава непроменен.
- Не се показва `Добави събитие`, когато няма доказан публичен submission flow.

### Въпроси
- `questions-public-v1.js` е authoritative owner на общия публичен списък.
- Формата има category-specific help/placeholder, field validation и rules validation.
- Неактивен uploader за въпроси не се показва.

### Инфо Лом / Институции
- Всеки public root има един финален renderer owner.
- За Институции публичният owner е `info-lom-institutions-owner-v1.js`; legacy слоевете работят само в staging root.
- Public shell/contextual recovery не променя Info Lom data/content ownership.

## 4. АКТУАЛНИ ЛИМИТИ ЗА ОБЯВИ

Каноничното правило остава:
- до 5 нови лични обяви на обикновен потребител за календарен месец;
- до 5 нови фирмени обяви на одобрена фирма за календарен месец;
- личната и фирмената квота са отделни;
- редакция на съществуваща обява не използва нова квота;
- подадена нова обява използва квота дори ако по-късно бъде отхвърлена или изтрита;
- неизползваната квота не се прехвърля;
- администраторските профили нямат тези лимити.

По-старо правило за `1` фирмена обява месечно е остаряло и не се използва.

## 5. ADMIN / MODERATOR PANEL V2

Статус: **ЗАВЪРШЕН / REAL INTERACTION QA PASS**.

Одобреният UX модел е в `ADMIN_PANEL_V2_APPROVED_SPEC.md`, implementation handoff — в `ADMIN_PANEL_V2_HANDOFF_2026-08-24.md`.

Проверени са Admin/Moderator desktop/mobile, menu/drawer/bottom navigation, основните management секции и role boundaries. Moderator self-moderation protection, Admin-only permanent delete и Admin-only role/access management са backend enforced.

Admin/Moderator Panel v2 не се започва отново без конкретен нов доказан проблем.

## 6. PUBLIC IA/UX — ЕТАПИ

Каноничната структура е в `PUBLIC_SITE_INFORMATION_ARCHITECTURE_APPROVED_SPEC.md`.

1. **Етап 1 — ЗАВЪРШЕН / PRODUCTION** — каноничен речник, structured `Обяви → Услуги` subcategory, legacy-safe edit поведение и narrow backend integrity validation.
2. **Етап 2 — ЗАВЪРШЕН / PRODUCTION QA PASS** — authoritative Supabase-backed public search с grouped results, loading/error/empty и запазен protected construction/Ivanov priority.
3. **Етап 3 — ЗАВЪРШЕН / PRODUCTION RUNTIME PASS** — read-only thematic listings за `Майстори`, `Автомобили`, `Услуги`; PR #93, merge `956eaae7fca5175f13ee805610c5d698eaa82e53`.
4. **Етап 4 — RECOVERED / PRODUCTION CONTEXTUAL-ADD PASS** — canonical shell/navigation + задължителната contextual-add връзка `theme/subcategory → existing form → safe prefill`. Recovery PR #100, merge `b0594a42c937280cdc8ca1585819230a8db27b33`. Production evidence: `PUBLIC_IA_STAGE4_CONTEXTUAL_RECOVERY_PRODUCTION_CHECKPOINT.md`.
5. **Етап 5 — RESTART REQUIRED** — старият Stage 5 QA е изпълнен върху функционално непълен Stage 4 и не е финален acceptance. Полезните му проверки остават reference evidence, но Stage 5 се изпълнява отново върху recovered production baseline.

## 7. STAGE 4 — ФИНАЛЕН RECOVERY СТАТУС

Статус: **ЗАВЪРШЕН СЛЕД RECOVERY / PRODUCTION CONTEXTUAL-ADD PASS**.

Shell/navigation частта от стария Stage 4 остава валидна, но старият checkpoint сам по себе си не е достатъчен за canonical Stage 4 acceptance.

След recovery е доказано:
- 41-page canonical shell остава синхронизиран и без protected-page takeover;
- всичките 22 service subcategories имат deterministic discovery + contextual create/seek targets;
- `Майстори → ВиК → Предложи услуга` runtime дава `Услуги / ВиК / тип непопълнен`;
- `Майстори → ВиК → Търся изпълнител` runtime дава `Услуги / ВиК / Търси`;
- representative auto/general service runtime prefills са точни;
- vehicle listing prefill е `Автомобили и МПС`;
- фирмените prefills за Майстори/Автомобили/Услуги/Заведения са точни;
- невалидни URL params се игнорират;
- `edit` има приоритет: реалната `TELEVIZOR` обява запази `Електроника / Продава` въпреки конфликтни create-prefill params;
- generic firm prefill не заобикаля Health;
- Shops и Health специализираните owners са запазени;
- Events няма fake submission action;
- protected `шпакловка / работа / автомивка` regression е PASS;
- не са създавани fake QA записи и не е изпращана production форма;
- contextual recovery workflow и GitHub Pages build/deploy са SUCCESS за merge commit `b0594a42c937280cdc8ca1585819230a8db27b33`.

Owner решенията са записани в `PUBLIC_IA_STAGE4_CONTEXTUAL_RECOVERY_OWNER_DECISIONS.md`.

## 8. STAGE 5 — ТЕКУЩ СТАТУС

Статус: **RESTART REQUIRED ОТ RECOVERED PRODUCTION BASELINE**.

`PUBLIC_IA_STAGE5_QA_CHECKPOINT.md` съдържа полезни pre-recovery evidence за desktop, signed-out/authenticated render/role, forms, error states и protected core, но не може да бъде използван като финален Stage 5 PASS след функционалната Stage 4 recovery промяна.

### Вече доказано след recovery
- contextual service/vehicle/business form prefills работят в production;
- invalid params и edit-priority protections работят;
- Shops/Health/Events ownership boundaries са запазени;
- protected search corpus е PASS;
- няма DB/RLS/schema/quota/status/moderation/Admin/Moderator промяна.

### Задължително за новия Stage 5
1. desktop + mobile върху recovered UI;
2. anonymous + authenticated;
3. real touch/click/focus/Escape/Tab на global и contextual actions;
4. representative contextual flow от самата категория до формата и обратно;
5. forms, loading/empty/error/not-found и detail states;
6. responsive/horizontal-scroll/overlay/safe-area checks;
7. runtime/console/cache/load-order;
8. protected-core regression;
9. без fake production records.

Stage 5 не се обявява за завършен само по source analysis или по стария pre-recovery checkpoint.

## 9. СРАВНИТЕЛЕН КОНТРОЛ ЗА ПРОПУСКИ

При QA се сравняват сходните раздели, без механично уеднаквяване. Проверяват се:
- специфични CTA/бутони;
- форми и field validation;
- signal/correction/add flows;
- loading/empty/error/not-found states;
- mobile/ARIA/focus поведение;
- moderation/admin routing;
- render ownership и липса на втори renderer;
- contextual action → exact target/prefill → display destination.

Разлика е дефект само ако противоречи на реалната потребителска задача или каноничните правила.

## 10. РАБОТЕН РЕЖИМ

- Безопасно и вече решено → изпълнява се без междинно `ОК`.
- Независима следваща задача → продължава се без излишно спиране.
- Защитено, рисково или ново бизнес решение → спира се преди промяната и се иска решение.
- След одобрена промяна се тества преди merge и отново в production.
- APPROVED спецификацията има приоритет пред по-късен checkpoint, който я стеснява.
- Stage 5 започва от recovered production baseline и не се маркира PASS без реалните required device/session/runtime проверки.
