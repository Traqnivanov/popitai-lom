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

При конфликт между документи не се избира правило по предположение — конфликтът се проверява и се отстранява преди промяна.

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

### Каноничен речник / Обяви → Услуги
- Stage 1 речникът е authoritative source за public label/routing/form mappings.
- `Обяви → Услуги` използва контролиран dependent subcategory select с одобрените 22 service стойности.
- Старите/legacy записи не се мигрират на сляпо.
- Backend taxonomy integrity amendment е приложен без промяна на RLS, ownership, квоти, media или moderation semantics.

### Търсене
- `public-search-v1.js` е authoritative owner за общото публично търсене.
- Публичните remote източници са approved фирми, approved въпроси и approved + active обяви с минимални публични полета.
- Няма authoritative `localStorage` fallback.
- Защитената construction/„Иванов Ремонти“ логика остава в `script.js` и не се дублира.
- Production regression след Stage 4: `шпакловка` → точно `Иванов Ремонти Лом`; `работа` → без false-positive Ivanov; `автомивка` → автомобилен контекст без construction/Ivanov injection.

### Тематични обяви
- `category-listings-v1.js` е read-only listings owner за `Майстори и ремонти`, `Автомобили` и `Услуги`.
- Показва само approved + active записи според каноничните Stage 1 service groups.
- Не променя listings write flow, RLS, ownership, status, quota или moderation.

### Магазини
- Активният публичен каталог е `shops-catalog-v3.js` + Supabase.
- Специализираният shop add flow остава единственият owner на магазинните предложения.
- Default категорията е `food` / `Хранителни`; валиден последно избран tab се възстановява от `localStorage`.
- Stage 4 глобалният `Добави` не създава втори shop flow, а делегира към съществуващия owner.

### Здраве
- Съществуващият health dataset/renderer и `Добави лекар или здравна услуга` flow остават собственици.
- Stage 4 не създава втори лекарски каталог или medical marketplace.

### Събития
- Публичният renderer показва одобрени предстоящи събития.
- Admin moderation flow остава непроменен.
- Stage 4 не показва фалшиво `Добави събитие`, когато няма достъпен доказан публичен flow.

### Въпроси
- `questions-public-v1.js` е authoritative owner на общия публичен списък.
- Формата има category-specific help/placeholder, field validation и rules validation.
- Неактивен uploader за въпроси не се показва.

### Инфо Лом / Институции
- Всеки public root има един финален renderer owner.
- За Институции публичният owner е `info-lom-institutions-owner-v1.js`; legacy слоевете работят само в staging root.
- Stage 4 shell не променя Info Lom data/content ownership.

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
4. **Етап 4 — ЗАВЪРШЕН / PRODUCTION RUNTIME PASS** — canonical static public shell, explicit 41-page manifest, deterministic sync/check, global `+ Добави`, five-item mobile nav, hamburger extras и page-specific CTA hierarchy. Final PR #96, merge `2b1015c75276eec5f88090c9f9854b855a3f04d5`. Production checkpoint: `PUBLIC_IA_STAGE4_PRODUCTION_CHECKPOINT.md`, PR #97 / merge `77fb99139292d58727c476918bae21af7f225141`.
5. **Етап 5 — В ПРОЦЕС** — финален desktop/mobile, anonymous/authenticated, forms, focus/modals, loading/empty/error/not-found, runtime/cache/load-order и protected-core regression. Desktop, signed-out и post-Stage4 authenticated render/role correctness са PASS; остава реалният mobile/touch + interactive console pass. Текущите доказателства са записани в `PUBLIC_IA_STAGE5_QA_CHECKPOINT.md`.

## 7. STAGE 4 — ФИНАЛЕН СТАТУС

Stage 4 е merge-нат и production deploy-нат.

Доказано преди/след merge:
- 41/41 public pages имат точно един canonical header/add/footer/mobile shell;
- old script sources/order, form/field IDs и Stage 3 data roots са запазени;
- няма duplicate IDs;
- `admin.html` и `404.html` са извън generator-а;
- оригиналният UTF-8 BOM contract на `index.html` и `profil.html` е запазен;
- generator sync е idempotent;
- GitHub Pages build/deploy и public shell sync са PASS;
- Homepage, Categories, Info, Health, Shops, Events и Stage 3 hubs са production runtime PASS;
- protected search corpus е PASS.

Stage 4 не изисква rollback.

## 8. STAGE 5 — ТЕКУЩ QA СТАТУС

Статус: **В ПРОЦЕС — няма доказан нов дефект; authenticated render/role QA вече е PASS, но финалният mobile interactive PASS остава.**

### Проверено след Stage 4 — PASS

- desktop homepage visual smoke — header/hero/search/CTA без overflow или видимо layout разместване;
- signed-out `nov-vapros.html` — labels, category, description, rules checkbox, `Изпрати за преглед`;
- signed-out `dobavi-obqva.html` — category/type/description/price/phone/до 6 снимки/rules/submit;
- signed-out `dobavi-firma.html` — name/category/phone/address/description/images/submit;
- `signal.html` и `vhod.html` controls/render;
- signed-out `profil.html` — no-session states без password exposure;
- not-found/detail states за listing/question/business;
- production 404;
- public list/empty states за Въпроси, Обяви, Статии;
- zero-search state и recovery actions;
- Admin anonymous gate остава `Нямаш достъп` и Admin е извън public shell;
- menu/add-sheet source ownership и deferred load order;
- responsive CSS contract: 5-column bottom nav, body bottom padding, safe-area, mobile add button geometry, sheet `dvh` constraints, hamburger overlay;
- protected search regression след Stage 4;
- real post-Stage4 authenticated `profil.html` — `Профил`, `Изход`, password section, Admin link и реалните profile content roots се рендерират;
- authenticated `nov-vapros.html` — Admin вижда `Публикувай въпроса`;
- authenticated `dobavi-obqva.html` — Admin-only controls се рендерират и submit е `Публикувай обявата`;
- authenticated `dobavi-firma.html` — submit е `Публикувай фирмата`;
- authenticated `admin.html` — реалният `Административен панел`, review counters и management groups се рендерират, без public-shell takeover.

Не са създавани fake QA записи и не са изпращани production форми.

### Остава за финален Stage 5 PASS

1. **Реален post-Stage4 mobile viewport/touch QA** — bottom navigation, center `Добави`, hamburger, add sheet, safe-area/scroll, representative question/article/detail states, Stage 3 mobile expand и липса на horizontal scroll/overlay collision.
2. **Interactive focus/logout + console check** в оставащия device pass — реален click/Escape/Tab, един logout/login-state transition и browser console/runtime наблюдение.

Тези проверки не се маркират като PASS само от source analysis. Наличният Opera connector може да чете/снима/навигира, но не може да resize-ва mobile viewport, да press-ва controls или да показва console logs.

Authenticated render/access/role correctness след Stage 4 вече е доказан. Самият logout click остава част от финалния интерактивен device pass.

## 9. СРАВНИТЕЛЕН КОНТРОЛ ЗА ПРОПУСКИ

При QA се сравняват сходните раздели, без механично уеднаквяване. Проверяват се:
- специфични CTA/бутони;
- форми и field validation;
- signal/correction/add flows;
- loading/empty/error/not-found states;
- mobile/ARIA/focus поведение;
- moderation/admin routing;
- render ownership и липса на втори renderer.

Разлика е дефект само ако противоречи на реалната потребителска задача или каноничните правила.

## 10. РАБОТЕН РЕЖИМ

- Безопасно и вече решено → изпълнява се без междинно `ОК`.
- Независима следваща задача → продължава се без излишно спиране.
- Защитено, рисково или ново бизнес решение → спира се преди промяната и се иска решение.
- След одобрена промяна се тества преди merge и отново в production.
- Stage 5 не се обявява за завършен, докато оставащият реален mobile/touch + interactive console pass не е доказан.
