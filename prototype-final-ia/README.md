# Попитай.Лом — Content-complete IA prototype

Статус: **ИЗОЛИРАН ПРОТОТИП / НЕ Е PRODUCTION / НЕ ЗАПИСВА В SUPABASE**

Каноничен източник: `POPITAI_LOM_MASTER_CURRENT.md` от 04.09.2026.

## Цел

Този прототип проверява одобрената public IA като една система, без да променя production owners, форми, RLS, роли, лимити или routes.

- един prototype renderer owner: `app.js`;
- никакъв Marketplace V3/V18/V19 layer;
- mock данните са означени като прототипни;
- всички Add действия симулират owner flow, но не изпращат реални заявки;
- няма fake ratings, popularity или реални твърдения за фирми/институции;
- платена продажба на живи животни не е налична;
- Event няма public Add;
- Publication authoring е Admin-only concept.

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
- `#detail/listing`, `#detail/firm`, `#detail/article`, `#detail/publication`, `#detail/event`, `#detail/question`
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
