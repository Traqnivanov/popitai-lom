# Попитай.Лом — Stage 2 content reality audit

Статус: **WORK 2 / OWNER PLACEMENT VERDICT APPROVED / IMPLEMENTATION STILL BLOCKED**  
Дата: **16.09.2026**  
Проверена review база преди verdict sync: `24590df5d441e7ac3f9712f1eccfe84cfc8bcc4b`  
LOCKED safety база: `997d97504251f4cbae0693dc0cffa24d1d04da79`

## 1. Граница

Този одит е content-complete/reality checkpoint. Той не разрешава production, Supabase write, schema/RLS, Stage 3, route migration, автоматичен import или промяна на защитен owner.

Icon работата остава PAUSED. Site/mobile остават text-first без неодобрени site икони; одобрените подробни 3D теми са само бъдещ social/Facebook материал.

## 2. Доказано текущо състояние

- Info Lom има шест основни семейства: здраве, институции, транспорт, образование, банки и комунални услуги.
- Info Lom вече съдържа практични директории като банки/банкомати, куриери, интернет/TV, платежни и застрахователни офиси, ВиК и електро.
- Firms има текущи основни категории Майстори, Здраве, Автомобили, Магазини, Заведения и Услуги.
- Articles има работещ editorial surface, но променливите местни контакти не трябва да се поддържат като независимо копие в статии.
- Настаняване, бензиностанции, организации/НПО и visitor-ready местата не са завършени като проверен record inventory.

## 3. Owner-approved placement model

| Област | Authoritative owner | Публично откриване | Забранено дублиране | Оставащ gate |
| --- | --- | --- | --- | --- |
| Настаняване | **Firms**, exact category `Настаняване` | вторичен блок `Info Lom → За гости в Лом → Къде да отседнеш` → canonical Firms results | отделен Info datastore или втори hotel record | source/freshness/claim contract + verified seed inventory |
| Бензиностанции | **Info Lom → Комунални и ежедневни услуги → Бензиностанции** | Info detail/subsection | паралелен Firm profile | exact records, official source, freshness/correction mapping |
| Сдружения и НПО | отделен семантичен тип **`Организация`** | контролиран public profile след contract | представяне като фирма или институция | production owner/schema/form/moderation verdict |
| Забележителности | **Article/editorial** за маршрута; **Info Lom** само за полезни променливи факти | `Лом за един ден` + съществуващо `Образование и култура` | отделен directory или седма основна Info карта | 5–7 visit-ready места + official-source inventory |
| Статии / ръководства | **Article/editorial** | съществуващ Articles surface | независимо остаряващо копие на Info контакти | source block, review date и article-by-article recheck |

## 4. Точен договор за `За гости в Лом`

Това е компактен вторичен discovery блок след шестте основни Info семейства, не ново седмо семейство. Съдържа точно:

1. `Къде да отседнеш` → canonical Firms profiles с категория `Настаняване`;
2. `Лом за един ден` → editorial Article;
3. връзка към съществуващия `Транспорт`.

## 5. Настаняване — seed и claim lifecycle

Началният каталог не остава празен. Work/Admin може да подготви verified unclaimed profiles само при съвпадение на Националния туристически регистър и официален сайт, официална страница или директен официален контакт на обекта.

Публичният label е: **`Проверено по публични данни · непотвърдено от собственика`**.

Минимални полета: име, вид, официално потвърдена категория, адрес, телефон, официален сайт/страница, удобства само от официален source, source, `last_verified`, claim status и approved media.

Собственикът claim-ва и допълва същия запис; не се създава duplicate. Не се копират динамични цени или наличности; показва се официалният директен booking канал. Production полетата и lifecycle-ът изискват отделно approval.

## 6. Забележителности и editorial граница

- Не се прави пълен каталог само защото официален списък съществува.
- Съществуващи полезни entities, например Исторически музей, остават в `Образование и култура`.
- `Лом за един ден` съдържа 5–7 действително visit-ready места и логичен маршрут.
- Отделен Info record има само място с полезни променливи факти: работно време, телефон, вход, достъп или official page.
- Променливите факти се поддържат в Info owner; Article ги показва чрез този договор и не ги копира като независима истина.

## 7. Проверени source класове

- Община Лом: `https://www.lom.bg/`
- Национален туристически регистър: `https://ntr.tourism.government.bg/Cat`
- Регистър на туристическите атракции: `https://rta.tourism.government.bg/`
- ТРРЮЛНЦ / Агенция по вписванията: `https://portal.registryagency.bg/`
- официален сайт/страница/контакт на конкретния обект

Това са source класове, не завършен record inventory. Адрес, телефон, работно време, цена, категория или активен статус не се публикуват без record-by-record проверка по `PROJECT_RULES.md`.

## 8. REPLACED decisions

Следните по-ранни предложения са **REPLACED / HISTORY ONLY** и не се изпълняват:

- общ hospitality екран чрез преименуване на маршрута за заведения;
- fuel като Firms-owned автомобилен filter;
- organization като Firms-like route;
- отделен landmarks directory/subsection като нова discovery структура.

## 9. Статии — reality backlog

| Материал | Текущо | Следващ gate |
| --- | --- | --- |
| Как да избереш майстор | видим static guide | source/review contract |
| Пенсиониране в Лом | съдържа променливи условия и местни контакти | пълна официална повторна проверка |
| Подмяна на лична карта в Лом | legacy planned draft | official-source audit + Info owner за местните факти |
| Подаване на сигнал | legacy planned draft | exact institution/channel mapping |
| Лом за един ден | owner-approved concept | 5–7 visit-ready места, logical route и source inventory |

## 10. Следващ разрешен ред

1. Record-by-record official-source checklist.
2. Exact data/owner/freshness/claim mapping.
3. Bounded Stage 2 prototype proposal без production writes.
4. Отделно owner approval за implementation.
5. Desktop + 390 px browser QA.
6. Финален Stage 2 content/route/owner audit и freeze.

Документационният verdict не променя UI, production, Supabase, Stage 3 или LOCKED safety HEAD.
