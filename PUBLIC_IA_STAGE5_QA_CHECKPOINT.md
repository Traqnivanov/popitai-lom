# PUBLIC IA — Stage 5 QA Checkpoint

Date: 2026-08-30
Status: **IN PROGRESS — DESKTOP / SIGNED-OUT / AUTHENTICATED RENDER+ROLE / SOURCE-LEVEL PASS; REAL MOBILE INTERACTION + FINAL INTERACTIVE CONSOLE REMAIN**

## Basis

This checkpoint follows `PUBLIC_SITE_INFORMATION_ARCHITECTURE_APPROVED_SPEC.md`, Stage 5 requirements:

- desktop and mobile;
- anonymous and authenticated;
- forms without fake QA records;
- buttons, links, modals, focus, loading, empty, error and not-found states;
- console/runtime/cache/load order;
- regression of Admin/Moderator and protected core.

No code, DB, RLS, role, quota, moderation or protected-core change is part of this checkpoint.

## Production version under QA

Stage 4 shell/navigation is already in production:

- PR #96
- merge commit `2b1015c75276eec5f88090c9f9854b855a3f04d5`
- Stage 4 production checkpoint: `PUBLIC_IA_STAGE4_PRODUCTION_CHECKPOINT.md`
- Stage 4 checkpoint merge: PR #97 / `77fb99139292d58727c476918bae21af7f225141`

GitHub Pages build/deploy and Public shell sync were PASS after Stage 4.

## Stage 5 checks completed

### 1. Desktop public shell / visual smoke — PASS

Live production homepage was checked visually at desktop width:

- logo and header fit without horizontal overflow;
- desktop navigation fits: `Начало`, `Инфо Лом`, `Категории`, `Фирми`, `Обяви`, `Въпроси`, `Статии`;
- `Вход` and global `Добави` remain visible while signed out;
- hero image, heading, search and CTA layout remain intact;
- no visible Stage 4 layout jump or shell overlap.

### 2. Signed-out forms — PASS for non-destructive runtime inspection

No fake production records were submitted.

Verified live:

#### `nov-vapros.html`
- labelled title field;
- category select;
- description field;
- community-rules checkbox;
- `Изпрати за преглед` submit label;
- no fake/inactive question image uploader.

#### `dobavi-obqva.html`
- title;
- category;
- listing type;
- description;
- price;
- phone;
- image uploader with existing `до 6 снимки` behavior;
- community-rules checkbox;
- `Изпрати за преглед` signed-out/non-admin text.

#### `dobavi-firma.html`
- firm name;
- category;
- phone;
- optional address;
- description;
- image upload;
- `Изпрати за преглед`.

#### `signal.html`
- clear `Подай сигнал` state;
- administrator-review explanation;
- form controls and submit are rendered.

#### `vhod.html`
- email field;
- password field;
- show-password control;
- login button;
- forgotten-password link.

### 3. Signed-out profile — PASS

`profil.html` shows the expected no-session state:

- no password controls exposed while signed out;
- clear sign-in states for questions, returned-for-correction content, firms, listings and suggestions/reports;
- existing profile content roots still render;
- Stage 4 shell does not replace profile ownership.

### 4. Detail / not-found states — PASS

Verified live without creating records:

- missing listing → `Обявата не е намерена.`;
- missing question → `Този въпрос не е достъпен` plus recovery links;
- missing firm → `Фирмата не е намерена` plus `Към фирмите`;
- unknown route → production `404.html` with `Страницата не е намерена` / `ГРЕШКА 404`.

No blank detail renderer was observed.

### 5. Public list / empty / zero-result states — PASS

Verified live:

- `vaprosi.html` → valid empty state `Все още няма одобрени въпроси` with applicable next actions;
- `obyavi.html` → real approved listing `TELEVIZOR` still renders;
- `statii.html` → only the real existing article remains;
- search nonsense query → `0 резултата`, `Няма намерени резултати`, `Разгледай категориите`, `+ Добави`, `Задай въпрос`.

### 6. Stage 4 special integrations — PASS

Production runtime already verified during Stage 4 and re-used as Stage 5 regression evidence:

- Health keeps its existing health renderer/tabs and owner add flow;
- Shops keeps its catalog/tabs and existing add owner; Stage 4 special action delegates instead of creating a second owner;
- Events has no fake unavailable add-event action;
- Info Lom keeps its existing renderer ownership;
- Stage 3 hubs keep their existing listings/business/question owners.

Important Shops clarification: `shops-catalog-v3.js` defaults to `food` / `Хранителни` when there is no valid saved category, and restores a valid saved tab from `localStorage` otherwise. A QA browser opening on `Строителни` was a remembered selection, not a default-tab defect.

### 7. Protected search regression — PASS after Stage 4

Live production corpus:

- `шпакловка` → exactly one result: `Иванов Ремонти Лом`;
- `работа` → marketplace `Работа`, without false-positive Ivanov injection;
- `автомивка` → automobile context, without construction/Ivanov injection.

The protected renovation/construction priority remains intact.

### 8. Admin exclusion / anonymous gate — PASS

`admin.html` remains outside the public shell generator. Anonymous live smoke shows:

- `Модераторски панел`;
- `Нямаш достъп`;
- `Страницата е само за администратори и модератори.`

No public Stage 4 `Добави` shell was introduced into the Admin panel.

### 9. Menu / add-sheet source ownership and load order — PASS

`script.js` remains the owner of hamburger open/close and `aria-expanded` state.

`public-shell-v1.js`:

- closes the menu before opening the add sheet;
- stores and restores the exact trigger focus;
- closes the sheet on Escape;
- traps Tab/Shift+Tab inside the open sheet;
- synchronizes trigger `aria-expanded`;
- delegates Shops/Health special actions to their existing owners;
- does not render business/listing/health/shop data.

The Stage 4 script is deferred after the existing page scripts. The 41-page pre-merge regression proved that existing script sources/order were preserved.

### 10. Responsive source audit — PASS, but not a substitute for real device interaction

The existing `style.css` mobile layer already provides:

- fixed 5-column bottom navigation;
- 72 px bar height;
- safe-area bottom padding;
- `body` bottom padding so content is not covered.

Stage 4 adds:

- button styling for the new center `.mobile-add` control;
- 44+ px practical touch geometry (58×58 center add button; 54 px nav controls);
- bottom-sheet safe-area padding;
- constrained `dvh` sheet height;
- hamburger overlay and bottom-nav hiding while menu is open.

The old `.mobile-ask` rule is unused by the new `.mobile-add` markup and does not own the new control.

### 11. Post-Stage4 authenticated render / role-correct production QA — PASS

A real authenticated Admin session was opened in production after Stage 4. No fake form records were submitted.

Verified live:

#### `profil.html`
- public header switches from `Вход` to `Профил`;
- authenticated `Изход` control is rendered;
- `Административен панел` link is visible for the Admin role;
- password section is visible only in the authenticated state;
- real existing firms/listings/profile content render instead of signed-out placeholders.

#### `nov-vapros.html`
- authenticated header remains in `Профил` state;
- existing question form remains available;
- Admin role correctly receives `Публикувай въпроса`, preserving direct-publish semantics.

#### `dobavi-obqva.html`
- authenticated header remains in `Профил` state;
- existing listing fields/uploader remain rendered;
- Admin-only listing controls remain available;
- Admin role correctly receives `Публикувай обявата`, preserving direct-publish semantics.

#### `dobavi-firma.html`
- authenticated header remains in `Профил` state;
- existing firm form and media controls remain rendered;
- Admin role correctly receives `Публикувай фирмата`, preserving direct-publish semantics.

#### `admin.html`
- authenticated session resolves to `Административен панел`, not the anonymous denial state;
- real review counters and management groups render;
- public Stage 4 shell does not take ownership of the Admin UI.

This proves post-Stage4 authenticated rendering, profile visibility, staff-link visibility and role-correct submit labels. The connector cannot press `Изход`, so the logout click transition itself is not claimed as newly re-tested here.

## Checks not yet honestly marked PASS

### A. Real post-Stage4 mobile viewport / touch interaction

Still required on an actual mobile viewport/device:

- five bottom-nav positions are visually correct;
- center `Добави` opens the action sheet;
- hamburger opens/closes and extra links fit;
- selecting a menu link closes the drawer;
- add sheet scroll/height/safe-area behavior;
- Stage 3 mobile priority / `Още` interaction where applicable;
- representative question/article/detail states on mobile;
- no horizontal scroll or overlay collision.

The currently available browser connector cannot resize/emulate a mobile viewport or execute element press actions, so this is not marked PASS from source inspection alone.

### B. Remaining interactive focus/modal/logout + console evidence

Source-level focus behavior is correct, authenticated render/role state is now proven, but the Opera connector exposes read/screenshot/navigation only and cannot press controls or expose browser console logs. Final Stage 5 still requires:

- real click/Escape/Tab on add sheet/menu;
- one real logout/login-state transition during the final device interaction pass;
- console/runtime observation during the remaining mobile interaction flow.

## Current conclusion

No Stage 5 defect requiring code change has been proven in the checks completed so far.

Post-Stage4 authenticated render/access/role correctness is **PASS**.

Stage 5 remains **IN PROGRESS**, with the remaining evidence narrowed to real mobile/touch interaction plus the associated interactive focus/logout/console observation that cannot be truthfully replaced by static source inspection with the currently available connector.
