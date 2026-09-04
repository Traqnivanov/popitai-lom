# Попитай.Лом — Content-complete IA prototype

Статус: **ИЗОЛИРАН ПРОТОТИП / STAGE 2 ACCEPTANCE FAIL / REMEDIATION IN PROGRESS / STAGE 3 BLOCKED / НЕ Е PRODUCTION / НЕ ЗАПИСВА В SUPABASE**

Каноничен източник: `POPITAI_LOM_MASTER_CURRENT.md` от 04.09.2026, приложимите `PROJECT_RULES_*` и последните изрични решения на собственика.

Stage 2 safety branch: `prototype/content-complete-ia-20260904-stage2-safety`.

## Критична корекция на договора — 04.09.2026

Предишно общо „одобрявам“ не се счита за LOCKED одобрение за нови persisted подкатегории. Такова конкретно одобрение не е давано.

Действащият backend contract за Stage 2 е:

- persisted контролирана `subcategory` има само при `Обяви → Услуги`;
- `Работа` пази `category=Работа` и само съществуващите `Предлага работа` / `Търси работа`; професионалните групи са discovery контекст;
- `Имоти` пази `category=Имоти` и съществуващите специални listing types; видът имот е discovery контекст;
- `Автомобили и МПС` не получава нов persisted taxonomy; автомобилните услуги остават `Услуги` + съществуваща service подкатегория;
- `Животни` пази `category=Животни`; осиновяване/изгубено/намерено са discovery контекст;
- `Авточасти` остава част от съществуващия Service contract и не се мигрира или преименува едностранно.

Всяко бъдещо отклонение от тези правила е отделно LOCKED решение и изисква предварително описание на DB/RPC/RLS/validation/edit-flow последствията, риска и rollback-а.

## Цел

Този прототип проверява public IA и формните journeys като една система, без да променя production owners, форми, schema, RLS, роли, moderation, ownership, лимити или routes.

- една route/render pipeline;
- mock данните са означени като прототипни;
- Add действията симулират owner flow, но не изпращат реални заявки;
- няма public Add за Event/Article/Publication;
- Stage 3 не започва преди нов independent acceptance и визуално приемане от собственика.

## Текущ Stage 2 remediation scope

Задължително се поправят и проверяват:

1. точният discovery контекст остава видим през discovery → results → add/edit;
2. current-backend persistence adapter не представя discovery групи като persisted subcategory извън `Услуги`;
3. `Авточасти` остава backward-compatible Service стойност;
4. Shop tags са category-aware: релевантни първо, останалите под `Други предложения`;
5. Content Actions зависят от действително наличните канали/данни и темата;
6. Social Preview е отделна реалистична карта с изображение, заглавие, описание и source/domain, а QA бележките са извън картата;
7. формите имат field-level validation, label/for, aria-describedby, aria-invalid, focus към първата грешка, запазване на данните при validation error, dirty guard при всяко напускане и неактивна форма след success.

## Инфо Лом — live parity

Проверено директно в production. Шестте реални раздела са:

- Здраве
- Институции
- Транспорт
- Образование и култура
- Банки и банкомати
- Комунални услуги

`Полезни телефони` не е отделен раздел.

## Acceptance QA, който трябва да се повтори

- contract/data-flow QA;
- всички discovery → results → add/edit journeys;
- form validation и dirty-state QA;
- Content Actions и Social Preview QA;
- desktop visual QA;
- mobile visual QA;
- diff isolation: само `prototype-final-ia/`.

**Stage 2 остава FAIL до независимата проверка и новото визуално приемане. Stage 3 остава BLOCKED.**

## Основни prototype routes

Hash routes се използват само в изолирания прототип:

- `#home`, `#obyavi`, `#uslugi`, `#rabota`, `#imoti`, `#stoki`, `#avtomobili`, `#zhivotni`
- `#magazini`, `#zavedenia`, `#zdrave`, `#firmi`, `#info`, `#aktualno`, `#statii`, `#vaprosi`
- `#detail/listing`, `#detail/firm`, `#detail/shop`, `#detail/health`, `#detail/info`, `#detail/article`, `#detail/publication`, `#detail/event`, `#detail/question`
- `#add/listing`, `#add/firm`, `#add/shop`, `#add/health`, `#add/question`

## Production boundary

Този branch не разрешава merge/deploy към `main`, Supabase/schema/RLS/RPC промени или промяна на protected Firms/Listings/Masters semantics.
