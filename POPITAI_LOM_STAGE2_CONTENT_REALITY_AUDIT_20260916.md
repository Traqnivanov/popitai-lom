# Попитай.Лом — Stage 2 content reality audit

Статус: **WORK 2 / OWNER VERDICT REQUIRED BEFORE UI OR OWNER CHANGES**  
Дата: **16.09.2026**  
Проверена review база: `e092eb38c53efd8ca3ca0582a44a562ae34b764c`  
LOCKED safety база: `997d97504251f4cbae0693dc0cffa24d1d04da79`

## 1. Граница

Този одит изпълнява следващия разрешен checkpoint от Master и централния регистър: content-complete/reality pass. Той не разрешава production, Supabase write, schema/RLS, Stage 3, route migration или промяна на защитен owner.

Icon работата остава PAUSED. Site/mobile остават text-first без неодобрени SVG или 3D raster assets. Одобрените 3D теми остават само за бъдещи social/Facebook карти.

## 2. Проверено текущо състояние

| Задължителна област | Текущ public route/екран | Доказан owner/lifecycle | Реални данни в Stage 2 | Verdict |
| --- | --- | --- | --- | --- |
| Настаняване / хотели | Няма самостоятелен вход. `#zavedenia` съдържа само заведения. | Няма приет точен category/form contract за места за настаняване. | Няма. | **BLOCKED BY OWNER CONTRACT** |
| Бензиностанции | Няма вход в `#avtomobili`, `#firmi` или Info Лом. | Няма приет exact owner/category contract. | Няма. | **BLOCKED BY OWNER CONTRACT** |
| Сдружения и НПО | Няма public place или route. | Няма owner, category, form или correction lifecycle. | Няма. | **BLOCKED BY OWNER CONTRACT** |
| Забележителности | `#info` има шест семейства; `Образование и култура` има общ Info owner, но няма `Забележителности` discovery contract. | Info Lom може да пази проверени записи, но новата подструктура не е одобрена. | Само отделен музей в legacy production evidence; не е пълен inventory. | **OWNER VERDICT REQUIRED** |
| Местни статии / ръководства | `#statii` и `#detail/article` работят. | Article/editorial; публично четене, Admin-only authoring concept, без public Add. | 2 видими материала; пенсионният съдържа променливи факти и изисква нова пълна проверка. | **PARTIAL / REALITY RECHECK REQUIRED** |

Извод: техническият route shell не е достатъчен за content-complete acceptance. Четири задължителни области нямат безопасно доказан край-до-край owner contract. Добавянето им като произволни cards би създало паралелен owner или би променило защитена Firms/Info структура.

## 3. Препоръчан най-тесен модел

| Област | Препоръчан authoritative owner | Препоръчано публично място | Route без нов главен Home раздел | Минимални публични полета | Source/freshness | Correction/update lifecycle |
| --- | --- | --- | --- | --- | --- | --- |
| Настаняване / хотели | **Firms** | Разширение на тематичния hospitality екран, без нов datastore | запазва се `#zavedenia`, публичното заглавие става `Заведения и настаняване`; exact filter `Настаняване` | име, вид, адрес, телефон, сайт, удобства, approved media | Национален туристически регистър + официален сайт/контакт; проверка непосредствено пред публикуване | съществуващ Firm draft/approval; category mapping изисква owner approval |
| Бензиностанции | **Firms** | Автомобили като отделен business filter | `#avtomobili` → `Бензиностанции`; detail остава Firm | име/марка, точен адрес, работно време само ако е потвърдено, телефон, карта/официален locator | официален locator на оператора; вторичен map source само като RECHECK evidence | съществуващ Firm draft/approval; category/discovery mapping изисква owner approval |
| Сдружения и НПО | **Нов profile class върху контролиран owner — НЕ СЕ РЕШАВА МЪЛЧАЛИВО** | Компактен directory, не marketplace listing | препоръка `#firmi?type=organization`, без нов Home main section | официално име, ЕИК, дейност, адрес, контакти, сайт, статус, source, last verified | Агенция по вписванията/ТРРЮЛНЦ + официален канал на организацията | proposal/correction → moderation → approved public version; owner/schema решение преди Stage 3 |
| Забележителности | **Info Lom** | Подраздел в `Образование и култура`, без седма основна Info карта | `#detail/info?record=info-education&section=landmarks` | име, тип, местоположение, достъпност, работно време/цена само при потвърждение, official link, source, last verified | регистър на туристическите атракции, Община Лом, официален owner | Info correction proposal → Moderator review → approved correction; no permanent delete |
| Статии / ръководства | **Article/editorial** | Съществуващото `#statii` | `#detail/article?record=...` | local-first задача, stable process, свързани Info owners, source block, last reviewed | официални първични източници; променливите местни факти идват от Info owner | Admin-only authoring concept; review/update date; без public Add |

### Защо този модел

- Не създава нов конкурентен Home/Info main section.
- Не превръща хотел, бензиностанция или НПО в generic listing.
- Запазва един lifecycle owner за всеки record.
- Пази променливите факти в проверим owner, вместо да ги дублира в статии.
- Не променя production route или schema в Stage 2.

## 4. Owner decisions, нужни преди код

1. **Hospitality:** разрешава ли се `#zavedenia` да стане публично `Заведения и настаняване`, като route остава същият, а местата за настаняване използват Firms owner с отделен exact filter?
2. **Fuel:** разрешава ли се `Бензиностанции` да е Firms-owned business filter под `#avtomobili`, без Info Lom дублиране?
3. **Organizations:** приема ли се отделим profile class `organization` в бъдещия owner contract, визуално достъпен през Фирми, но без да се преструва на търговска фирма? Това е production/schema checkpoint и Stage 2 може само да го симулира след approval.
4. **Landmarks:** разрешава ли се `Забележителности` като подраздел на съществуващото Info семейство `Образование и култура`, без нова седма Info карта?

Без тези четири решения не се променят Firms categories, form fields, Info структура или публична навигация.

## 5. Проверени source класове

- Община Лом публикува официални местни новини, контакти и административни услуги за туризъм: `https://www.lom.bg/`.
- Национален туристически регистър — категоризирани туристически обекти: `https://ntr.tourism.government.bg/Cat`.
- Регистър на туристическите атракции: `https://rta.tourism.government.bg/`.
- ТРРЮЛНЦ / Агенция по вписванията за юридически лица с нестопанска цел: `https://portal.registryagency.bg/`.

Това са source класове, не завършен record inventory. Нито един адрес, телефон, работно време, цена или активен статус не се публикува, докато конкретният запис не премине пълната pre-code проверка от `PROJECT_RULES.md`.

## 6. Статии — точен reality backlog

| Материал | Текущо | Следващ gate |
| --- | --- | --- |
| Как да избереш майстор | Видим static guide | Добавяне на source/review contract; без измислени препоръки/рейтинги |
| Пенсиониране в Лом | Видим, но съдържа 2026 условия, местен телефон, адрес и приемно време | Пълна официална проверка на всяко променливо твърдение; конфликтът с unsynced Claude evidence се решава преди merge |
| Подмяна на лична карта в Лом | Legacy planned draft | Нов official-source audit; local Info owner за адрес/прием; после bounded prototype proposal |
| Подаване на сигнал до община или институция | Legacy planned draft | Exact institution/channel mapping; без generic или непотвърден target |
| Местен visitor guide | Липсва | След одобрение на accommodation + landmarks contracts; не преди тях |

## 7. Следващ ред след owner verdict

1. Реализира се само одобреният Stage 2 route/owner simulation; без production writes.
2. За всяка област първо се прави record-by-record source checklist, после код.
3. Добавят се честни loading/empty/error/RECHECK states; без fake entries.
4. Source regression за route → owner → detail → correction/add destination.
5. Desktop + 390 px browser QA.
6. Документите се синхронизират с exact review SHA и ясно се разделят source-tested, browser-tested и OPEN.
