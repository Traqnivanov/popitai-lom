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
- Съществуващите Info Lom области `Транспорт`, `Магазини`, `Здраве`, `Институции` и `Образование` не са нови missing sections и не се изграждат повторно; работи се само по конкретни доказани gaps/corrections.
- Следващият missing-content pass е за заведенията за хранене: existing inventory, gaps, duplicate ownership и source reality.

## 3. Owner-approved placement model

| Област | Authoritative owner | Публично откриване | Забранено дублиране | Оставащ gate |
| --- | --- | --- | --- | --- |
| Настаняване | **Firms**, exact category `Настаняване` | вторичен блок `Info Lom → За гости в Лом → Къде да отседнеш` → canonical Firms results | отделен Info datastore или втори hotel record | source/freshness/claim contract + verified seed inventory |
| Бензиностанции | **Info Lom → Комунални и ежедневни услуги → Бензиностанции** | Info detail/subsection | паралелен Firm profile | exact records, official source, freshness/correction mapping |
| Сдружения и НПО | отделен семантичен тип **`Организация`** | контролиран public profile след contract | представяне като фирма или институция | production owner/schema/form/moderation verdict |
| Забележителности | **Article/editorial** за маршрута; **Info Lom** само за полезни променливи факти | `Лом за един ден` + съществуващо `Образование и култура` | отделен directory или седма основна Info карта | 5–7 visit-ready места + official-source inventory |
| Статии / ръководства | **Article/editorial** | съществуващ Articles surface | независимо остаряващо копие на Info контакти | source block, review date и article-by-article recheck |

## 4. Точен договор за `За гости в Лом`

Това е одобреният бъдещ договор за компактен вторичен discovery блок след шестте основни Info семейства, не ново седмо семейство. Той не разрешава placeholder, link или article implementation преди отделната content готовност. Когато бъде реализиран след approval, съдържа точно:

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
- `Лом за един ден` е FUTURE ARTICLE BACKLOG. Когато по-късно бъде подготвен след по-широката местна база, материалът трябва да подбере 5–7 действително visit-ready места и логичен маршрут; сега не се пише или имплементира.
- Отделен Info record има само място с полезни променливи факти: работно време, телефон, вход, достъп или official page.
- Променливите факти се поддържат в Info owner; Article ги показва чрез този договор и не ги копира като независима истина.

### 6.1 Owner-confirmed локални обекти · evidence boundary

- хотел `Москва` — съществува;
- парк хотел `Ривър` — съществува;
- хотел/ресторант `Дунав` — съществува; старият secondary сигнал за окончателно затваряне е отхвърлен като final факт;
- бензиностанция `Кристал В` — съществува на ул. `Людовико Миланези`.

Това затваря само въпроса за реалното съществуване. NTR полетата на хотелите, активното accommodation предлагане на `Дунав`, адресният конфликт на `Ривър`, точният номер и identity mapping на `Кристал В` остават OPEN.

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
| Лом за един ден | **FUTURE ARTICLE BACKLOG / NOT CURRENT TASK** | по-широка проверена местна база → включване в програма от поне 10 статии → 5–7 visit-ready места, logical route, source inventory и отделно owner approval |

## 9.1 Dining audit checkpoint · Work 2 · 16.09.2026

Тесният dining content reality/gap/duplicate audit е записан в `POPITAI_LOM_DINING_CONTENT_REALITY_AUDIT_20260916.md`. Той добавя 5 research/control records в `content-inventory/` (общо 12), без да ги избира за публично показване. `Ресторант Дъгата`, `Пицария При Финци` и `Пица на пещ Тербаяно` са силни official-source кандидати; `Пицария Палма` и `Каприз 2025` остават research-only. Комбинираните hotel+restaurant профили остават един canonical Firms record и изискват отделен production facet contract; не се създава duplicate.

## 10. Следващ разрешен ред

1. **Завършено като control layer / owner review pending:** `content-inventory/` V1 договор, schema, 7 начални evidence records и deterministic validation; без runtime/UI/Supabase.
2. Owner review на точните видими полета и evidence граници в началните записи; само одобрените могат по-късно да станат `prototype.selected=true`.
3. Content reality/gap/duplicate audit на заведенията за хранене върху съществуващия Firms owner; новите доказани записи се водят в същия inventory договор.
4. Продължаване на record-by-record official-source checklist за настаняване, бензиностанции и организации; owner-confirmed existence се пази отделно от официалните полета.
5. Exact data/owner/freshness/claim mapping.
6. Bounded Stage 2 adapter proposal без production writes и без втори datastore.
7. Отделно owner approval за implementation.
8. Desktop + 390 px browser QA.
9. Финален Stage 2 content/route/owner audit и freeze.

Article drafting, включително `Лом за един ден`, не е част от текущия pass. Бъдещата програма е поне 10 материала и изисква отделен source/review checkpoint за всеки.

Документационният verdict не променя UI, production, Supabase, Stage 3 или LOCKED safety HEAD.
