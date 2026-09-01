# PUBLIC PRODUCT V6-C — INFO LOM VISUAL CANON LOCK

Status: **LOCKED VISUAL BASELINE / PROTOTYPE + FUTURE V6 IMPLEMENTATION**

## 1. Purpose

The currently approved production presentation of **Инфо Лом** is the visual and structural baseline for V6. Generic V9/V10/V11 visual passes must not redesign Info Lom into a generic card system.

The V6 goal is **preserve first, improve only where the improvement is concrete and does not change the established hierarchy**.

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

## 3. Canonical Info family / Institutions presentation

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

## 4. Allowed visual upgrades

Only bounded upgrades that preserve the approved composition:

- align typography with the shared V6 shell without changing information hierarchy;
- improve line-height and mobile readability;
- make pure-black outlines slightly softer deep navy when this improves polish without weakening separation;
- refine radius, spacing and shadows by small amounts only;
- improve focus-visible states, horizontal overflow behavior, safe-area and bottom-nav clearance;
- improve logo/icon optical sizing without changing contextual identity;
- preserve source/freshness/action semantics.

## 5. Forbidden generic redesign

Do not:

- replace Info priority cards with the generic V11 card language;
- recolor all Info surfaces to match the generic Home palette;
- remove the dark Info hero/search identity;
- flatten sticky tabs into a generic filter row;
- reduce priority cards to a single generic result card;
- move freshness/source to an unclear global location;
- reorder priority institutions for visual reasons;
- remove emergency/direct/official action hierarchy;
- replace specialized Info family visuals with one universal template when the family already has an approved specialized presentation.

## 6. Specialized Info families

The same preserve-first principle applies to Health, Transport, Education, Banks and Utilities.

Utilities additionally preserve their contextual provider/service identity. Water, electricity, payments, couriers and internet providers may keep their verified logo/icon/color identity inside the common Info shell.

For long payment lists, the EasyPay/Payments context uses the established **scroll-context floating label** when the active payment heading has left the viewport. This is contextual navigation, not a decorative badge.

## 7. Implementation rule

Generic V6 visual-system CSS must not override canonical Info-specific components. Info-specific presentation is applied after the generic visual layer and remains the final presentation owner for Info surfaces.

Production data ownership, source/freshness rules, moderation, URLs and protected business logic remain unchanged.
