# Попитай.Лом — Admin / Moderator Panel v2 — HANDOFF 24.08.2026

## 0. Прочети първо

Преди всяка редакция задължително прочети в този ред:
1. PROJECT_RULES_00_READ_FIRST.md
2. PROJECT_RULES_PROTECTED_CORE.md
3. PROJECT_RULES_ADMIN_MODERATOR.md
4. PROJECT_RULES.md
5. PROJECT_RULES_RENDER_OWNERSHIP.md
6. ADMIN_PANEL_V2_APPROVED_SPEC.md
7. PROJECT_PROGRESS.md
8. този handoff

При конфликт: STOP и доклад.

## 1. Откъде започнахме

Admin/Moderator панелът имаше:
- плосък списък с много постоянно видими бутони;
- неудобен long-scroll;
- отделни модули с различни render roots;
- Info Lom можеше да презаписва целия .admin-content;
- празни панели при навигация;
- refresh/restore проблеми;
- flicker/бавен startup;
- Moderator UI на места показваше действия или броячи, които не съответстват на ролята;
- self-moderation проблеми;
- липса на силен first-screen triage.

След role audit бяха заключени Admin/Moderator границите в PROJECT_RULES_ADMIN_MODERATOR.md и backend-ът беше затегнат.

## 2. Одобреният нов UX

Пълният одобрен модел е в ADMIN_PANEL_V2_APPROVED_SPEC.md.

Ключово:
- Dashboard при ново отваряне;
- първо видимо какво чака действие;
- top bar с persistent actionable indicator;
- sticky/collapsible sidebar;
- 4 top-level области: Начало / За преглед / Съдържание / Управление;
- само активната група разгъната;
- mobile drawer + bottom nav;
- role-aware help;
- един общ render shell;
- refresh пази текущата секция; ново отваряне → Dashboard;
- UX redesign НЕ променя права/ownership/status/RLS/flows.

## 3. Реални production данни, използвани при Moderator QA

Последният потвърден Moderator actionable total беше 2:
- Магазини: 1
- Инфо Лом: 1

Moderator-owned pending съдържание не трябва да влиза в този total.

## 4. Вече приложено във v2

### admin.html
- body class admin-panel-v2
- compact Admin topbar
- „Към сайта“
- „Профил“
- persistent topbar task button
- mobile overlay
- bottom nav: Начало / Преглед / Съдържание / Меню
- admin-panel-v2.css

### admin-panel-v2.css
- desktop app shell
- sticky sidebar
- responsive mobile drawer
- bottom mobile nav
- task indicator styles
- dashboard task rows
- collapsed sidebar presentation
- public footer/mobile public nav скрити в workspace

### admin-management.js
- Dashboard view
- role-aware title
- grouped menu
- task dashboard
- sidebar collapse state
- mobile menu controls
- persistent topbar task indicator hook
- activeView external guard
- core 60s refresh не трябва да заменя external module view
- направени са няколко DOM collection fixes ($ vs $$), но трябва да се re-audit преди PASS

### admin-ux-integration-v1.js
- role-correct actionable counts
- dispatch event popitai:admin-actionable-counts
- role-aware contextual help
- Moderator counts exclude own content

### admin-shell-ownership-v1.js
- shared shell helper window.PopitaiAdminShell
- restore logic
- session-based active-view restore on reload
- normal new open should prefer Dashboard
- bounded startup wait

### Модулни renderers
Info Lom, Shops, Events, Reports вече са пренасочени да render-ват в shared admin root вместо да презаписват целия .admin-content.

## 5. Важни вече фиксирани role/ownership дефекти

- Moderator own pending question/listings/report не се броят като actionable.
- Moderator core pending queue изключва own q/listings.
- Moderator own business в hidden state не трябва да има „Публикувай отново“.
- Moderator няма hard delete.
- Moderator няма expanded grant/revoke.
- Moderator не може да модерира собствено съдържание.
- Info Lom Moderator review брои само чужди actionable records.
- duplicate Info Lom review button беше премахнат.
- generic public error toast не трябва да се показва върху Admin v2 workspace.

## 6. Backend / Supabase — НЕ ПИПАЙ без причина

Ролевите ограничения вече са наложени в Supabase:
- Admin-only hard delete/system rights;
- Moderator foreign-content operational update;
- Moderator own-content restrictions;
- expanded access Admin-only;
- Info Lom scope;
- storage business-media restrictions.

НЕ прави нови migrations за UX задача, освен ако реален backend blocker не бъде доказан.

## 7. Текущ статус: НЕ Е ГОТОВО

Не маркирай Admin Panel v2 като final/PASS.

Остава задължително:
- пълен functional QA на desktop Moderator;
- пълен functional QA на desktop Admin;
- mobile Moderator;
- mobile Admin;
- всички групи да се разгъват/свиват коректно;
- collapsed sidebar да има ясен начин за връщане;
- topbar task indicator да работи навсякъде;
- direct dashboard buttons да водят до правилната queue;
- refresh във всяка важна external module section;
- new-open → Dashboard;
- long-scroll sticky QA;
- no blank render;
- Info Lom / Shops / Events / Reports / Businesses interoperability;
- published/hidden firms;
- listings;
- user edits;
- expanded profiles;
- users;
- role-aware help;
- empty/loading/error states;
- mobile drawer;
- bottom nav active state;
- touch behavior;
- no public-site UI clutter in workspace.

## 8. Известен технически риск, който трябва да се провери първо

admin-management.js претърпя няколко тесни поправки на:
- $(".admin-menu-group").forEach → $$(".admin-menu-group").forEach
- $(".admin-menu button").forEach → $$(".admin-menu button").forEach

Преди нова редакция:
1. fetch current file;
2. syntax check;
3. search за останали querySelector/single-element .forEach грешки;
4. production QA на group toggle и view click.

Не приемай, че последният cache-bust е live, без direct production verification.

## 9. Правило за работа

Потребителят НЕ иска да бъде спиран за всяко „ОК“.

Безопасните UX/render/stability fixes:
- изпълнявай;
- тествай;
- продължавай.

Включи потребителя само при:
- LOCKED решение;
- реална промяна на rights/ownership/approval/business logic;
- избор между значими UX варианти;
- нужда от user-only действие;
- blocker, който не е безопасно да решиш сам.

## 10. Текущ audit checkpoint — 24.08.2026 вечер

Source/backend re-audit е изпълнен и текущият `main` включва:
- Moderator hard-delete UI/JS fix;
- business module restore + startup-order guard;
- persistent observer cleanup;
- Info Lom Moderator direct-edit boundary + narrow moderation RPCs;
- Admin/Moderator/public RLS role-boundary corrections;
- Moderator foreign-content field guard за core content, media, shops, events;
- Moderator review-queue field guard за reports / Info Lom submissions / Info Lom error reports;
- group-toggle ARIA state;
- mobile drawer aria-controls / label / Escape focus restore;
- topbar Dashboard refresh-restore persistence;
- cache-bust на променените Admin v2 scripts.

Backend transaction QA потвърждава:
- Moderator hard delete е блокиран;
- Moderator не може да управлява роли;
- Moderator не може да дава expanded access;
- Moderator не може да блокира Admin;
- разрешено moderation update минава;
- промяна на защитено чуждо съдържание се блокира;
- anon role helpers връщат false;
- anon вижда одобрено публично съдържание, не вижда non-approved и няма INSERT/UPDATE/DELETE table grants.

Production Moderator Dashboard е пасивно потвърден с 2 actionable задачи: Магазини 1 + Инфо Лом 1.

## 11. Следваща правилна стъпка

Не започвай нов redesign.

Остава само реалният interaction QA:
1. desktop Moderator — всички групи, direct links, modules, refresh, actions;
2. desktop Admin — същият пълен flow;
3. mobile Moderator;
4. mobile Admin;
5. long-scroll/sticky/loading/empty/error/no-blank checks;
6. update QA findings;
7. чак тогава final PASS.

Текущият browser connector няма click/press API. Passive accessibility-tree проверката не е достатъчна за final PASS. Ако няма друг интерактивен browser tool, това е user-only QA blocker и потребителят трябва да бъде включен само за този конкретен interactive step.

## 12. Не се прави

## 11. Не се прави

- не се връща старият flat menu;
- не се местят всички 15+ бутона в top navigation;
- не се прави втори competing renderer;
- не се добавя polling/observer като архитектурен заместител;
- не се измислят нови права;
- не се уеднаквяват модулни flows механично;
- не се създават fake QA records само за тест;
- не се пише „готово“, ако mobile/desktop role QA не е реално минал.
