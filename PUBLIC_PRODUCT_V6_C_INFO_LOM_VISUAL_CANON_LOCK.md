# PUBLIC PRODUCT V6-C — INFO LOM VISUAL CANON LOCK

Status: **LOCKED VISUAL + INTERACTION BASELINE / PROTOTYPE + FUTURE V6 IMPLEMENTATION**

## 1. Purpose

The currently approved production presentation of **Инфо Лом** is the visual, structural **and interaction-depth** baseline for V6. Generic V9/V10/V11 visual passes must not redesign Info Lom into a generic card system or add extra navigation steps.

The V6 goal is **preserve first, improve only where the improvement is concrete and does not change the established hierarchy, task path or number of actions needed to reach important information**.

## 2. Canonical Info Lom hub

Preserve:

- normal Popitai.Lom public shell/header;
- distinctive dark-navy Info Lom search/hero area;
- direct Info search as the primary object;
- six 2×3 mobile entry cards with contextual icon tile and right arrow:
  1. Здраве
  2. Институции
  3. Транспорт
  4. Образование и култура
  5. Банки и банкомати
  6. Комунални услуги / Комунални и ежедневни услуги;
- white rounded task panel **„Какво ти трябва?“** immediately below the six entries;
- task shortcuts, including:
  - Спешна медицинска информация
  - Документ от общината
  - Нямам вода
  - Нямам ток
  - Търся банкомат;
- canonical mobile bottom navigation: Начало / Обяви / + / Инфо / Профил.

## 3. Interaction-depth / click-path lock

The current Info Lom task-path logic is part of the approved product, not an incidental UI detail.

Preserve the shortest existing path to high-value information. Do not introduce intermediary landing pages, confirmation steps, generic category screens or modal detours only for visual consistency.

Canonical principles:

- a user entering **Инфо** must reach the six main families immediately;
- task shortcuts such as **Нямам вода**, **Нямам ток**, **Спешна медицинска информация**, **Документ от общината** and **Търся банкомат** remain direct shortcuts to the relevant specialized context;
- a family card opens the relevant family directly, not a second generic chooser;
- within specialized families, sticky/horizontal tabs switch context without forcing a return to the family hub;
- direct phone actions stay direct `tel:` actions where currently applicable;
- official-source actions open the verified official destination directly where currently applicable;
- expandable detail rows reveal secondary information in-place instead of navigating to unnecessary extra screens;
- `← Всички раздели` provides one clear recovery path back to the Info hub;
- emergency information must never be made harder to reach for visual or architectural reasons;
- the V6 implementation must preserve or reduce the current number of actions required to reach a given approved fact/action. It must not increase it without a concrete usability/safety reason and explicit review.

Examples of intended behavior:

- **Инфо → Нямам вода → ВиК context/contact** must remain a short direct path;
- **Инфо → Нямам ток → electricity interruption/contact** must remain a short direct path;
- **Инфо → Здраве → Болница → Прием / Централа / Регистратура / ТЕЛК** stays directly visible within the Health flow;
- **Инфо → Институции → Община / Полиция / НОИ** remains one family entry plus one contextual tab/action, not several nested levels;
- important source/freshness information stays on the same card/screen as the fact it qualifies.

Any future design proposal that adds clicks/taps to these paths must be treated as a functional regression unless it clearly improves safety, accuracy or task completion.

## 4. Canonical Info family / Institutions presentation

Preserve:

- visible `← Всички раздели` recovery;
- sticky/horizontally safe pill navigation;
- Institutions tabs and priority order, including `Община / Полиция / НОИ / Други`;
- active pill = blue outline / light blue fill / strong blue text;
- large priority cards with strong visual separation;
- card top structure:
  - contextual icon tile;
  - short kicker/context label;
  - entity/service title;
  - concise explanatory lead;
- facts block for address / working hours / phone or other essential fact;
- actions as full-width high-confidence rows;
- semantic action hierarchy:
  - emergency danger/red only where genuinely urgent (for example 112);
  - direct phone/contact action;
  - secondary direct action;
  - strong blue official external action;
  - visible right-side labels such as `Спешно`, `Директно`, `Отвори сайт ↗` where applicable;
- expandable/detail rows for task guidance and secondary services;
- freshness/source line at the bottom of the card, e.g. `Последно потвърдено: … · source`;
- approved priority entities and ordering must not be changed by generic visual work.

## 5. Health-specific interaction/presentation lock

Health keeps its existing specialized presentation and short task paths.

Preserve:

- health tabs: Болница / Лекари / Аптеки / Стоматолози / Ветеринари / Вет. аптеки / Лаборатории;
- direct switch between those tabs without returning through generic Info layers;
- hospital as a priority specialized section, not a generic Info record;
- hospital main actions such as Централа / Регистратура / ТЕЛК / Официален сайт remain directly accessible;
- **Прием в болницата** remains an embedded priority block with urgent admission, first-visit and hospitalization guidance;
- admission phone remains directly callable where confirmed;
- **Ключови отделения** remain immediately visible, with the remaining units expandable in place;
- other medical centers remain distinct verified entity cards beneath the hospital section;
- official NHIF/professional-registry lookups remain visible where relevant;
- source/freshness is attached to the relevant health entity, not separated into another screen.

The approved Health flow must not be replaced by the generic V6 `v8-rich-card` presentation.

## 6. Allowed visual upgrades

Only bounded upgrades that preserve the approved composition and task paths:

- align typography with the shared V6 shell without changing information hierarchy;
- improve line-height and mobile readability;
- make pure-black outlines slightly softer deep navy when this improves polish without weakening separation;
- refine radius, spacing and shadows by small amounts only;
- improve focus-visible states, horizontal overflow behavior, safe-area and bottom-nav clearance;
- improve logo/icon optical sizing without changing contextual identity;
- preserve source/freshness/action semantics;
- improve an existing direct path only if it requires the same or fewer actions.

## 7. Forbidden generic redesign

Do not:

- replace Info priority cards with the generic V11 card language;
- recolor all Info surfaces to match the generic Home palette;
- remove the dark Info hero/search identity;
- flatten sticky tabs into a generic filter row;
- reduce priority cards to a single generic result card;
- move freshness/source to an unclear global location;
- reorder priority institutions for visual reasons;
- remove emergency/direct/official action hierarchy;
- replace specialized Info family visuals with one universal template when the family already has an approved specialized presentation;
- add extra click/tap layers between a user and an already-direct approved task;
- hide critical contact/action information behind a new generic details screen;
- turn direct task shortcuts into category-navigation detours.

## 8. Specialized Info families

The same preserve-first principle applies to Health, Transport, Education, Banks and Utilities.

Utilities additionally preserve their contextual provider/service identity. Water, electricity, payments, couriers and internet providers may keep their verified logo/icon/color identity inside the common Info shell.

For long payment lists, the EasyPay/Payments context uses the established **scroll-context floating label** when the active payment heading has left the viewport. This is contextual navigation, not a decorative badge.

## 9. Implementation rule

Generic V6 visual-system CSS must not override canonical Info-specific components. Info-specific presentation is applied after the generic visual layer and remains the final presentation owner for Info surfaces.

Production data ownership, source/freshness rules, moderation, URLs, task-routing semantics and protected business logic remain unchanged.

Before Info Lom / Health is considered migrated to V6, perform a parity check of:

1. visual hierarchy;
2. priority ordering;
3. direct action semantics;
4. task shortcuts;
5. number of clicks/taps to high-value information;
6. source/freshness placement;
7. sticky tabs and back/recovery behavior;
8. emergency-path accessibility.
