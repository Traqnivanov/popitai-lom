# PUBLIC IA — Stage 4 Production Checkpoint

Date: 2026-08-30
Status: **COMPLETED / MERGED / PRODUCTION RUNTIME PASS**

## Scope

Stage 4 implements the approved shared public shell and navigation without changing protected business logic:

- canonical static public header/footer/mobile navigation source;
- explicit 41-page public manifest;
- deterministic sync/check workflow;
- global `+ Добави` action sheet;
- five-item mobile bottom navigation;
- hamburger extra links;
- page-specific CTA hierarchy;
- preserved Info Lom, Health and Shops variants;
- `admin.html` and `404.html` excluded from the generator.

No DB/RLS/roles/ownership/quotas/moderation/listing write-flow/search-ranking change is part of Stage 4.

## Git / deployment

- audited branch: `public-ia-stage4-shell-navigation`
- draft audit PR: #95 (closed only because the connector could not convert Draft → Ready)
- final PR: #96
- final merge commit: `2b1015c75276eec5f88090c9f9854b855a3f04d5`
- GitHub Pages build: PASS
- GitHub Pages deploy: PASS
- Public shell sync on `main`: PASS

## Pre-merge regression

The final branch was checked before merge:

- 41/41 public pages contained exactly one canonical header, add layer, footer and mobile shell;
- existing script sources and their order were preserved;
- existing inline JS was preserved outside the approved shell migration;
- existing stylesheet dependencies were preserved;
- form and field IDs were preserved;
- Stage 3 data roots were preserved;
- no duplicate IDs were introduced;
- `admin.html` and `404.html` remained byte-identical;
- `index.html` and `profil.html` original UTF-8 BOM state was restored and then enforced deterministically;
- sync is idempotent: second run produces no HTML drift.

The workflow now watches both canonical shell sources and public HTML pushes, so future shell drift is automatically synchronized/checked.

## Production runtime QA

### Homepage
PASS.

Verified in production:

- canonical desktop navigation is visible;
- `Начало`, `Инфо Лом`, `Категории`, `Фирми`, `Обяви`, `Въпроси`, `Статии` are present;
- global `Добави` is a real dialog trigger;
- hero CTA is `+ Добави`;
- existing homepage content still renders, including real listing/business blocks.

### Categories
PASS.

Verified:

- canonical shell;
- `+ Добави`;
- `Въпроси и препоръки`;
- `Всички обяви` wording and route.

### Info Lom
PASS.

Verified:

- canonical shell added;
- existing Info Lom content/renderer remains available;
- no replacement of Info Lom data ownership.

### Health
PASS.

Verified:

- existing Health renderer remains active;
- tabs such as `Лични лекари`, `Стоматолози`, `Ветеринари` remain available;
- original `Добави лекар или здравна услуга` owner CTA remains;
- Stage 4 adds only the global add trigger and contextual `Задай въпрос` → `nov-vapros.html?category=zdrave`.

### Shops
PASS for Stage 4 integration.

Verified:

- existing shop catalog renderer and tabs remain active;
- Stage 4 adds `Намери магазин`, `Всички обяви`, contextual `Задай въпрос`;
- no second shop submission owner was created;
- global shell special action delegates to the existing Shops owner flow.

Important clarification: seeing `Строителни` active during QA was **not a default-tab defect**. `shops-catalog-v3.js` defaults to `food` / `Хранителни` when no saved valid category exists and restores a valid previously selected tab from `localStorage` otherwise. The QA browser had a remembered `construction` selection.

### Events
PASS.

Verified:

- `Разгледай предстоящите` works as the approved local anchor route;
- contextual `Задай въпрос` uses `category=sabitiya`;
- no fake/nonexistent `Добави събитие` flow was introduced;
- existing event content remains rendered by the existing owner.

### Stage 3 hubs
PASS.

Verified in production:

- `Майстори и ремонти` retains its subcategories/business/listings ownership and adds only `Намери майстор` + contextual question CTA;
- `Автомобили` retains its subcategories/business/listings ownership and adds only `Намери автосервиз или услуга` + contextual question CTA;
- `Услуги` retains its canonical Stage 1 subcategories/business/listings ownership and adds only `Намери услуга` + contextual question CTA.

## Protected search regression

PASS after Stage 4 production deployment:

- `шпакловка` → exactly one result, `Иванов Ремонти Лом`;
- `работа` → marketplace `Работа`, no false-positive Ivanov injection;
- `автомивка` → automobile context, no construction/Ivanov injection.

Therefore the protected renovation/construction search priority remains intact.

## Stage 4 conclusion

Stage 4 is complete and does not require rollback.

The next approved stage is **Stage 5 — final public QA / production verification** covering desktop/mobile, anonymous/authenticated states, forms, focus/modals, loading/empty/error states, runtime/cache/load-order and final protected-core regression.
