# Попитай.Лом — Content-complete IA prototype

Статус: **ИЗОЛИРАН ПРОТОТИП / STAGE 2 ACCEPTANCE FAIL / ROUND 2 SOURCE QA PASS / BROWSER RECHECK PENDING / OWNER ACCEPTANCE PENDING / STAGE 3 BLOCKED / НЕ Е PRODUCTION / НЕ ЗАПИСВА В SUPABASE**

Канонична база за този prototype pass: `POPITAI_LOM_MASTER_CURRENT.md`, приложимите `PROJECT_RULES_*`, последните изрични решения на собственика и съдържателните правила от `POPITAI_LOM_MASTER_CONTENT_STRATEGY_V3_2026-09-03.md`, консултиран като източник, но **не добавян в този prototype-only diff**.

Stage 2 safety branch: `prototype/content-complete-ia-20260904-stage2-safety`.

Round 2 code checkpoint преди този status commit: `002448bbab2bec4a68e6786198ec973fea1b108a`.

## Критична backend / LOCKED граница

Предишно общо „одобрявам“ не се счита за LOCKED одобрение за нови persisted подкатегории.

Действащият договор за Stage 2 остава:

- persisted контролирана `subcategory` има само при `Обяви → Услуги`;
- `Работа` пази `category=Работа` и съществуващите `Предлага работа` / `Търси работа`; професионалните групи са discovery контекст;
- `Имоти` пази `category=Имоти` и съществуващите специални listing types; видът имот е discovery контекст;
- `Автомобили и МПС` не получава нов persisted taxonomy; автомобилните услуги остават `Услуги` + съществуваща Service подкатегория;
- `Животни` пази `category=Животни`; осиновяване/изгубено/намерено са discovery контекст;
- `Авточасти` остава част от съществуващия Service contract.

### Важно: 58/58 mapping НЕ е end-to-end persistence contract

Прототипът има compatibility mapping за всичките 58 service discovery leaves към съществуващи canonical Service стойности. Това доказва **coverage на adapter mapping-а**, но не доказва, че точният discovery leaf се записва и може да бъде възстановен след submit.

Пример:

`Кетъринг → canonical subcategory: Фото, видео и събитийни услуги`

При действащия backend договор отделното `Кетъринг` не се persist-ва като собствено поле. След submit записът сам по себе си не съдържа достатъчно информация, за да върне надеждно потребителя обратно към exact leaf `Кетъринг`.

Това е **OPEN / LOCKED граница**, не скрито разрешена migration задача. Ако в бъдеще продуктът изисква exact-leaf persistence/reconstruction, трябва отделно LOCKED решение с DB before/after, засегнати записи и форми, migration/RLS/RPC/validation/edit-flow последствия, рискове и rollback.

## Round 2 поправки

1. При ръчна смяна на Listing категорията несъвместимият discovery context се изчиства и техническият adapter се преизчислява по новата категория.
2. Публикациите вече не се описват като задължително кратки. Те са отделен формат с конкретна причина и са толкова дълги, колкото е нужно за задачата; не се превръщат автоматично в пълно ръководство.
3. `Публикация`, `Магазин`, `Health` и `Събитие` имат положителни и отрицателни conditional Share prototype states:
   - `?share=eligible` → Share + social card;
   - `?share=blocked` → няма Share CTA и няма social card, а се показва причината.
4. `normalizeHomeComposition()` е премахнат. Home композицията се изгражда директно от `home()` като един render owner; няма post-render преместване на Home секции.

## Conditional Share contract в прототипа

Share се показва само когато примерът представлява public/share-eligible canonical съдържание с безопасен payload и приложимите status/freshness условия са изпълнени.

- Publication: положителен пример при public canonical публикация; отрицателен при pending/non-public/no stable public URL.
- Shop: положителен при approved/public Shop; отрицателен при non-public/non-approved или липсваща публична canonical повърхност.
- Health: положителен само при public canonical Health surface + trust/freshness + safe preview; отрицателен при неспазено условие.
- Event: положителен за approved/public current Event; отрицателен пример при pending/hidden/no public canonical surface. Приключило събитие не трябва да бъде представяно като „предстоящо“.

Facebook остава distribution layer, не content owner.

## Инфо Лом — live parity

Шестте реални раздела, сверени с production, са:

- Здраве
- Институции
- Транспорт
- Образование и култура
- Банки и банкомати
- Комунални услуги

`Полезни телефони` не е отделен раздел.

## Round 2 QA matrix — 04.09.2026

| Проверка | Статус | Бележка |
|---|---|---|
| Safety boundary | PASS | само safety prototype branch; без production/Supabase/LOCKED промени |
| `normalizeHomeComposition()` | PASS | премахнат от `app.js` |
| Home single render owner | PASS | marketplace + specialized block се връщат директно от `home()` |
| Manual category change clears discovery | PASS — source | `listing-category` change извиква reset на discovery context |
| Manual category change refreshes adapter | PASS — source | adapter чете текущата category/subcategory/listing_type след промяната |
| Publication mandatory-short claim | PASS — source | няма продуктово правило, че Публикацията трябва да е кратка |
| Publication Share eligible / blocked | PASS — source | отделни positive/negative routes |
| Shop Share eligible / blocked | PASS — source | отделни positive/negative routes |
| Health Share eligible / blocked | PASS — source | trust/freshness/safe-preview условие |
| Event Share eligible / blocked | PASS — source | public/current eligibility; blocked state е pending/hidden/no canonical и не смесва ended state с „предстоящо“ |
| 58/58 Service compatibility mapping coverage | PASS | coverage на mapping layer-а; не е persistence proof |
| Exact discovery leaf persisted after submit | **OPEN / FAIL** | не се persist-ва отделно при текущия договор |
| Exact leaf reconstruction from published record | **OPEN / FAIL** | не може надеждно да се гарантира само от canonical subcategory |
| Content Master V3 в prototype diff | PASS — липсва по дизайн | не трябва да се добавя в този prototype-only diff |
| Content Master V3 official repo checkpoint | **OPEN / REQUIRED** | следващ отделен docs-only checkpoint |
| Повторен browser interaction QA за Round 2 | **PENDING** | Opera connector прекъсна при стартирания временен harness; harness е премахнат |
| Повторен desktop/mobile visual QA за Round 2 | **PENDING** | не се обявява за изпълнен без реален browser render |

Предишните успешно изпълнени form validation / dirty-state / mobile 390px тестове не се заличават, но не се използват като доказателство, че новите Round 2 промени са повторно визуално проверени.

## Задължителен следващ docs-only checkpoint

`POPITAI_LOM_MASTER_CONTENT_STRATEGY_V3_2026-09-03.md` трябва да бъде качен официално в repo в отделен **docs-only checkpoint**, защото в момента липсва от текущия commit/branch. Това не се прави вътре в prototype-only remediation diff.

Този docs checkpoint не дава автоматично разрешение за Stage 3, production deploy или LOCKED backend промяна.

## Основни prototype routes

Hash routes се използват само в изолирания прототип:

- `#home`, `#obyavi`, `#uslugi`, `#rabota`, `#imoti`, `#stoki`, `#avtomobili`, `#zhivotni`
- `#magazini`, `#zavedenia`, `#zdrave`, `#firmi`, `#info`, `#aktualno`, `#statii`, `#vaprosi`
- `#detail/listing`, `#detail/firm`, `#detail/shop`, `#detail/health`, `#detail/info`, `#detail/article`, `#detail/publication`, `#detail/event`, `#detail/question`
- conditional Share examples: `#detail/publication?share=eligible|blocked`, `#detail/shop?share=eligible|blocked`, `#detail/health?share=eligible|blocked`, `#detail/event?share=eligible|blocked`
- `#add/listing`, `#add/firm`, `#add/shop`, `#add/health`, `#add/question`

## Production boundary

**Stage 2 остава FAIL. Owner acceptance остава pending. Stage 3 остава BLOCKED.**

Този branch не разрешава merge/deploy към `main`, Supabase/schema/RLS/RPC промени или промяна на protected Firms/Listings/Masters semantics.
