# Попитай.Лом — Admin / Moderator Panel v2 — ОДОБРЕНА UX СПЕЦИФИКАЦИЯ

Статус: ОДОБРЕНО UX РЕШЕНИЕ
Дата: 24.08.2026

Този файл НЕ заменя и НЕ отменя PROJECT_RULES*. При конфликт важат каноничните правила:
PROJECT_RULES_00_READ_FIRST.md → PROJECT_RULES_PROTECTED_CORE.md → PROJECT_RULES_ADMIN_MODERATOR.md → PROJECT_RULES.md → PROJECT_RULES_RENDER_OWNERSHIP.md.

## 1. Основна цел

Admin/Moderator панелът е отделна работна среда, а не обикновена публична страница. Той трябва първо да показва какво реално чака действие, без потребителят да отваря отделни раздели или да скролва.

## 2. Първи екран / Dashboard

При нормално ново отваряне на панела първият екран е Dashboard.

Най-горе видимо и без скрол:
- общ брой реални задачи за преглед;
- само ненулевите категории с чакаща работа;
- пример: Фирми 1, Обяви 2, Магазини 1, Инфо Лом 2, Сигнали 1;
- всяка категория води директно към съответната опашка;
- при 0 задачи се показва ясно „Няма задачи за преглед“.

Броячите са role-correct:
- Moderator не брои собствено съдържание, което няма право да модерира;
- Admin вижда реално достъпните за Admin задачи.

В top bar има постоянен индикатор за чакаща работа:
- червен/силно видим само когато N > 0;
- показва общия брой;
- достъпен е от всяка секция.

## 3. Desktop shell

Одобрен модел:
- тънък top bar;
- бутон „Към сайта“;
- профил/роля;
- sticky/collapsible sidebar;
- голяма чиста работна зона;
- публичният голям header/footer не стоят като основна навигация вътре в работния панел.

Top-level навигация:
1. Начало
2. За преглед
3. Съдържание
4. Управление

Само активната група е разгъната.

Sidebar:
- остава видим при scroll;
- има собствен вътрешен scroll при нужда;
- може да се свива;
- при свито състояние винаги има ясен видим контрол за повторно разгъване; не се допуска интерфейс от безсмислени точки/икони без подсказка.

## 4. Групи

### За преглед
Съдържа съществуващите operational queues, напр.:
- Чакащи
- Потребителски редакции
- Разширени профили
- Магазини
- Събития
- Сигнали
- Инфо Лом
- Фирми

### Съдържание
Съдържа съществуващите published/managed views, напр.:
- Публикувани въпроси
- Публикувани отговори
- Обяви
- Скрити/отказани
- Магазини
- Събития
- Инфо Лом
- Публикувани фирми
- Скрити фирми

### Управление
Role-aware:
- Moderator вижда само позволените management функции;
- Admin вижда същата обща структура + Admin-only функции, когато такива съществуват.

## 5. Работна зона

Всеки екран има еднаква основна структура:
- ясно заглавие;
- статус/брой;
- при нужда local search/filter;
- съдържание.

Никога не се оставя празен бял екран.

Задължителни състояния:
- Loading
- Empty
- Error
- Loaded

## 6. Помощ

Contextual help:
- отваря се при нужда, не заема постоянно голямо място;
- role-aware;
- Moderator не вижда инструкции за действия, които няма право да извършва;
- Admin вижда Admin-only обяснения само когато са релевантни.

## 7. Mobile — одобрено решение

Mobile НЕ е просто свит desktop.

Основен модел:
- compact top bar;
- видим брой чакащи задачи;
- drawer menu;
- bottom navigation с максимум 4 основни точки:
  - Начало
  - Преглед
  - Съдържание
  - Меню
- full-width content;
- touch targets около 44–48 px;
- компактни вертикални cards;
- вторичните действия могат да са в „Още“, bottom sheet или подобен контекстен UI;
- detail review може да използва sticky bottom actions, когато това е полезно;
- при връщане към списък се пази позицията, когато е технически приложимо;
- drawer/help/filter се затварят преди navigation back;
- няма празен бял екран.

Първият mobile екран също показва веднага ненулевите задачи за преглед без нужда от scroll или отваряне на отделен раздел.

## 8. Tablet

Междинен responsive режим:
- collapsed sidebar или drawer според ширината;
- не се допуска претрупан desktop layout върху малък екран.

## 9. Render ownership — ЗАДЪЛЖИТЕЛНО

Admin v2 трябва да спазва PROJECT_RULES_RENDER_OWNERSHIP.md:
- един общ shell owner;
- един content root;
- конкретният module renderer рисува само в своя root;
- един модул няма право да унищожава root-а на друг;
- не се добавя постоянен polling/MutationObserver като заместител на ясна собственост;
- navigation/refresh не трябва да водят до празен render, flicker или презапис от друг renderer.

## 10. Refresh / open behavior

Одобрена логика:
- refresh на текущата страница → остава в текущата секция;
- нормално ново отваряне → Dashboard;
- не се показва грешна секция преди restore;
- не се допуска дълго скрит интерфейс;
- не се допуска core refresh да презаписва active external module view.

## 11. Критично: НЕ се променя бизнес логиката

Admin Panel v2 е UX/navigation/presentation redesign.

Без ново изрично LOCKED одобрение НЕ се променят:
- Admin/Moderator права;
- ownership;
- self-moderation;
- approval/reject/return flows;
- hard delete границата;
- direct publish;
- expanded access;
- лимити/квоти;
- статуси;
- Supabase RLS/schema/security;
- фирмени правила;
- обяви;
- Info Lom moderation semantics.

## 12. Модераторски принципи, които UI трябва да пази

Каноничният източник е PROJECT_RULES_ADMIN_MODERATOR.md.

UI трябва да отразява, но не да преизобретява:
- Moderator модерира чуждо съдържание, не собствено;
- permanent delete е Admin-only;
- expanded access grant/revoke е Admin-only;
- ролево управление е Admin-only;
- Moderator не получава Admin direct-publish/limit exemptions;
- reversible actions остават според съществуващия модулен flow.

## 13. Критерии „готово“

Admin/Moderator Panel v2 НЕ е готов само защото изглежда добре.

Преди PASS трябва да са проверени:
- Admin desktop;
- Moderator desktop;
- Admin mobile;
- Moderator mobile;
- Dashboard actionable counts;
- всички review секции;
- всички content секции;
- management;
- refresh във всяка важна секция;
- navigation между различни render owners;
- long-scroll/sticky behavior;
- collapsed/expanded sidebar;
- empty/loading/error/loaded states;
- role-aware help;
- self-moderation;
- hard-delete visibility;
- expanded access visibility;
- Info Lom;
- магазини;
- събития;
- сигнали;
- фирми;
- обяви;
- потребителски редакции;
- разширени профили.

Не се пише „финално“ или PASS без реална production проверка.
