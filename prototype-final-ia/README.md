# Попитай.Лом — Content-complete IA prototype

Статус: **ИЗОЛИРАН ПРОТОТИП / STAGE 2 TECHNICAL QA COMPLETE / OWNER VISUAL ACCEPTANCE PENDING / НЕ Е PRODUCTION / НЕ ЗАПИСВА В SUPABASE**

Каноничен източник: `POPITAI_LOM_MASTER_CURRENT.md` от 04.09.2026.

Одобрен Stage 1 contract: Form Matrix + Content Actions Matrix + Social Preview Matrix и техническите mapping/contracts, одобрени от собственика на 04.09.2026.

Stage 2 safety branch: `prototype/content-complete-ia-20260904-stage2-safety`.

Последен технически QA code checkpoint преди този README запис: `eed96e8cb3379b3d0b72b6baac00a65ee363dba4`.

## Цел

Този прототип проверява одобрената public IA като една система, без да променя production owners, форми, RLS, роли, лимити или routes.

- една route/render pipeline; `app.js` оркестрира прототипа, а Stage 2 модулите подават договори, форми, content views и interactions без паралелен production renderer;
- никакъв Marketplace V3/V18/V19 layer;
- mock данните са означени като прототипни;
- всички Add действия симулират съществуващия owner flow, но не изпращат реални заявки;
- няма fake ratings, popularity или реални твърдения за фирми/институции;
- платена продажба на живи животни не е налична;
- Event няма public Add;
- Publication authoring е Admin-only concept.

## Stage 2 — приложени договори

- пълният discovery services → canonical production service mapping;
- category-specific `subcategory` за Работа, Имоти, Автомобили и Животни;
- `Авточасти` не е нова Service стойност; Parts са в Автомобили;
- Животни налага правилния type според подкатегорията;
- Shop: `Кратко описание на магазина` + controlled tags + `Друго`;
- Health discovery `Лични лекари` / `Специалисти` се адаптира към реалния owner type `Лекар`, без нов Health owner type;
- Firm edit parity показва град, адрес и работно време;
- contextual Listing и Question подсказки;
- Content Actions са различни според content type; няма универсална еднаква action лента;
- един Share вход с Facebook / Copy / native share като вторични опции;
- Shop / Health / Event имат prototype read-only detail surfaces;
- Social Preview е само prototype state и не е production rendering contract;
- `Любими` и Q&A voting не се симулират като реални функции без backend owner.

## Stage 2 QA boundary

Проверени върху exact Stage 2 code checkpoint `eed96e8…`:

- service mapping journey, включително discovery услуга, която преди губеше контекст;
- Работа / Имоти / Автомобили / Животни form contracts;
- защита при Животни срещу несъвместим type prefill;
- Shop controlled tags и разделяне на описание от класификация;
- Health owner mapping и visible specialty prefill за `Лични лекари`;
- Firm edit parity;
- contextual Question примери;
- Content Actions за Listing, Firm, Shop, Health, Info, Question, Article, Publication и Event;
- Social Preview visible copy без вътрешни `owner`, `Pending`, `Q&A`, `fallback`, `edit draft` или подобни QA термини;
- post-render content corrections са премахнати: interaction helper-ът остава само за реални form/share/dirty-state interactions;
- responsive `styles.css` не е променян спрямо одобрения checkpoint, така че Stage 2 не добавя нов mobile layout layer.

Opera потвърди критичните Stage 2 flows на exact checkpoint преди Browser Connector да прекъсне. Локален Playwright download не беше възможен заради мрежовото ограничение на sandbox-а; това не се представя като извършен тест.

**Stage 2 не е production approval.** Следва owner visual acceptance на прототипа. Едва след такова приемане може да се отвори следващият production implementation етап.

## Основни prototype routes

Hash routes се използват само вътре в изолирания прототип:

- `#home`
- `#obyavi`
- `#uslugi`
- `#rabota`
- `#imoti`
- `#stoki`
- `#avtomobili`
- `#zhivotni`
- `#magazini`
- `#zavedenia`
- `#zdrave`
- `#firmi`
- `#info`
- `#aktualno`
- `#statii`
- `#vaprosi`
- `#detail/listing`, `#detail/firm`, `#detail/shop`, `#detail/health`, `#detail/info`, `#detail/article`, `#detail/publication`, `#detail/event`, `#detail/question`
- `#add/listing`, `#add/firm`, `#add/shop`, `#add/health`, `#add/question`

QA states могат да се отворят с hash query, например:

- `#obyavi?state=loading`
- `#obyavi?state=empty`
- `#obyavi?state=error`
- `#add/listing?state=edit`
- `#add/listing?state=pending`
- `#add/listing?state=success`

## Production boundary

Този prototype branch не разрешава merge/deploy към `main`, Supabase/schema/RLS промени или промяна на protected Firms/Listings/Masters semantics.
