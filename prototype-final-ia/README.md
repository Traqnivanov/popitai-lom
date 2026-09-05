# Попитай.Лом — Stage 2 safety prototype

Статус: **REMEDIATION IMPLEMENTED / TECHNICAL QA REPORTED / OWNER ACCEPTANCE PENDING / НЕ Е PRODUCTION**

Branch: `prototype/content-complete-ia-20260904-stage2-safety`

Работата е изолирана в `prototype-final-ia/`. Не са променяни production, Supabase, schema, migrations, RLS, RPC, роли, moderation, лимити или LOCKED договори. Stage 3 не е започван.

## Истина за audit статуса

Independent code re-audit беше потвърден като PASS за remediation commit:

`dd69958f10d3d72df16d7b6d70f33017d7a62a24`

Този PASS покрива деветте remediation точки от independent audit. Логиката им не трябва да се променя без нов изричен scope.

След `dd69958…` има допълнителни prototype-only промени по presentation, QA fixes и content truth. Те са проверявани чрез staging/browser QA, но **не трябва да се описват като нов independent re-audit PASS**, докато няма отделна независима проверка на текущия HEAD.

## Запазени remediation решения

1. **Shops 6/6** — шестте Shop категории (`Хранителни`, `Строителни`, `Техника`, `Мебели`, `Дрехи`, `Дом`) resolve-ват като Shop съдържание с owner `Shops` и правилните Shop actions.
2. **Авточасти** — остава legacy/backward-compatible mapping за четене, но не е активна стойност за нова Service обява.
3. **Майстори и ремонти** — `#maistori` е отделен силен prototype entry с осемте съществуващи подраздела и разделени Firms / Listings / Q&A роли.
4. **Home order** — полезното съдържание и Q&A са разделени по предназначение; въпросите остават fallback, а не водещ вход.
5. **Social Card icon** — тематичните икони идват само от controlled local registry.
6. **Approved media brand** — approved-media композицията има отделена brand лента `Попитай.Лом`.
7. **Info vs Q&A trust** — Q&A е community съдържание; Info Lom е verified-information.
8. **Service family Add** — family-level Add е choose-first; конкретен leaf се избира преди Listing формата.
9. **QA evidence naming** — външен runner/staging run не се нарича attached GitHub check, ако check/status не е attached към самия SHA.

## Presentation cleanup

Нормалният потребителски изглед не трябва да показва вътрешни термини като `protected`, `owner`, `canonical`, `discovery`, `persist`, `OPEN/LOCKED`, `production contract` или QA обяснения.

Техническите бележки са отделени в default-closed QA панели и се показват само при QA режим.

`#maistori`, Service family chooser, Social Card preview и detail изгледите използват нормален потребителски език. Иконите и „Любими“ не са променяни по предположение.

## Task 7 — audit/presentation fixes

Поправени са само в прототипа:

- X бутонът на `+ Добави` modal използва правилния `data-close-add` contract;
- правописната грешка „пубикация“ → „публикация“;
- title/strip presentation шумът е скрит от normal view;
- prototype form validation е изравнена с вече проверените live field правила, без промяна на production формите;
- потребителските съобщения за Share/contact/edit не показват вътрешна prototype терминология.

## Content truth pass

Няма потвърдена реална Публикация или предстоящо Събитие за текущия prototype view. Затова `#aktualno` показва честно empty state вместо измислени live записи.

Добавен е предоставеният source материал:

**„Пенсиониране в Лом — къде се обслужвате и какво трябва да знаете“**

Prototype route:

`#detail/article?record=article-pension`

Той остава **Статия → Пенсии → Ръководство**, а не Публикация. Detail изгледът включва НОИ Лом, кога се налага Монтана, пенсионните условия, документи, важния срок, източника и article actions.

## Service Add contract

За family-level Add:

`service family → choose-first family route → concrete service leaf → Listing form`

Нито едно от деветте service семейства не се представя като persisted/canonical leaf.

Exact service leaf persistence/reconstruction след реален submit остава **OPEN / LOCKED**.

## Social Card semantic contract

Петте общи visual compositions остават:

- marketplace
- profile
- editorial
- event
- community

Semantic ролите остават отделни, включително:

- Q&A → `community`
- Info Lom → `verified-information`
- Shops → `specialized`

## QA evidence

За текущия prototype са правени browser/staging проверки по exact commit URLs. Това е **technical/staging/browser QA**, не attached GitHub check и не нов independent acceptance.

При докладване винаги се различават:

- **attached GitHub check** — само ако GitHub API показва check/status на конкретния SHA;
- **external/staging QA** — runner или staging branch върху същите blobs/diff;
- **browser QA** — реално отваряне на exact-SHA preview;
- **independent re-audit** — отделна независима проверка.

## OPEN / LOCKED / pending

Остават OPEN и не са имплементирани по предположение:

- exact service leaf persistence/reconstruction;
- production Facebook/Open Graph crawlable delivery;
- реално генериране/съхраняване на social изображения;
- избор на Edge Function / Worker / Storage / backend architecture за social images;
- production taxonomy migration;
- по-широк public flow за **„здравна услуга“** извън текущите doctor/dentist/vet owners;
- production-wide icon replacement;
- Stage 3.

Отделни pending checkpoints:

- **Икони** — owner visual approval pending; без mass replacement.
- **Любими** — `APPROVED REQUIREMENT / COVERAGE, STORAGE AND LOGIN CONTRACT NOT YET AUDITED`; без имплементация по предположение.

## Финален статус

Stage 2 не се обявява автоматично за приет.

Допустимият статус остава:

`REMEDIATION IMPLEMENTED / TECHNICAL QA REPORTED / OWNER ACCEPTANCE PENDING / НЕ Е PRODUCTION`
