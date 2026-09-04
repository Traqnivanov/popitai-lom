# Попитай.Лом — Content-complete IA prototype

Статус: **ИЗОЛИРАН ПРОТОТИП / STAGE 2 ACCEPTANCE FAIL / SOCIAL IMAGE HIERARCHY QA PASS / SOCIAL PREVIEW PRODUCTION INTEGRATION OPEN / OWNER ACCEPTANCE PENDING / STAGE 3 BLOCKED / НЕ Е PRODUCTION / НЕ ЗАПИСВА В SUPABASE**

Канонична база за този prototype pass: `POPITAI_LOM_MASTER_CURRENT.md`, приложимите `PROJECT_RULES_*`, последните изрични решения на собственика и съдържателните правила от `POPITAI_LOM_MASTER_CONTENT_STRATEGY_V3_2026-09-03.md`, консултиран като източник, но **не добавян в този prototype-only diff**.

Stage 2 safety branch: `prototype/content-complete-ia-20260904-stage2-safety`.

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
2. Публикациите не се описват като задължително кратки. Те са отделен формат с конкретна причина и са толкова дълги, колкото е нужно за задачата.
3. `Публикация`, `Магазин`, `Health` и `Събитие` имат положителни и отрицателни conditional Share prototype states.
4. `normalizeHomeComposition()` е премахнат. Home се изгражда директно от `home()` като един render owner.

## Conditional Share contract в прототипа

Share се показва само когато примерът представлява public/share-eligible canonical съдържание с безопасен payload и приложимите status/freshness условия са изпълнени.

- Publication: положителен пример при public canonical публикация; отрицателен при pending/non-public/no stable public URL.
- Shop: положителен при approved/public Shop; отрицателен при non-public/non-approved или липсваща публична canonical повърхност.
- Health: положителен само при public canonical Health surface + trust/freshness + safe preview.
- Event: положителен за approved/public current Event; отрицателен при pending/hidden/no public canonical surface.

Facebook остава distribution layer, не content owner.

## Social Preview image hierarchy — Stage 2 UX правило

Social Preview **не е окончателно готов production contract**. В прототипа е демонстрирана една обща image hierarchy за shareable content:

1. **Реална одобрена медия на конкретното съдържание** — снимка, лого, корица или афиш според owner-а.
2. **Тематичен брандиран шаблон** — използва се само при липса на подходяща реална одобрена медия; следва content type и категорията и съдържа дискретно `Попитай.Лом`.
3. **Панорама на Лом** — последен общ fallback, когато няма реална медия и тематичният шаблон не е подходящ.

Прототипът не използва измислени лица и не въвежда подвеждащи stock снимки. При `image=real` се показва неутрална демонстрация „тук идва реалната одобрена медия“, а не фалшив content asset.

Демонстрирани са 9 конкретни типа, което покрива изисканите примери:

- Обява — `#detail/listing?share=eligible&image=template`
- Фирма — `#detail/firm?share=eligible&image=template`
- Магазин — `#detail/shop?share=eligible&image=template`
- Лекар / Health — `#detail/health?share=eligible&image=template`
- Събитие — `#detail/event?share=eligible&image=template`
- Статия — `#detail/article?share=eligible&image=template`
- Публикация — `#detail/publication?share=eligible&image=template`
- Въпрос — `#detail/question?share=eligible&image=template`
- Info Lom — `#detail/info?share=eligible&image=template`

За всеки от тях `image=real|template|lom` демонстрира трите нива.

### Какво е отделено визуално

Прототипът вече не рисува title/description/domain като част от самото изображение:

- **`og:image`** е отделен блок с пропорция **1200 × 630**;
- **domain + title + description** са отделен metadata блок под изображението, който симулира как social surface може да ги визуализира;
- **QA обясненията** са отделен disclosure блок и не са част нито от `og:image`, нито от social metadata картата.

Старият общ `.social-card` модел е премахнат от тази демонстрация.

### Production граница — OPEN

Този Stage 2 прототип доказва **UX и визуалното правило**, но **не доказва production Facebook/Open Graph интеграцията**.

За production остава отделна техническа проверка/реализация:

- как всеки реален public/canonical URL връща crawlable `og:title`, `og:description`, `og:image`, `og:url` и site name още към crawler-а;
- как dynamic Listings/Firms/Shops/Health/Events/Q&A/Publication data се подава без зависимост от client-side JavaScript след зареждане;
- как approved/public lifecycle, edit/hide/expiry и image eligibility влияят на crawler-visible metadata;
- как избраният GitHub Pages + Supabase share-rendering подход ще работи и ще се валидира реално.

**JavaScript визуализацията в този прототип не е доказателство, че Facebook crawler ще получи metadata.** Не се избира share-rendering архитектура в Stage 2.

## Social image hierarchy QA — 04.09.2026

Временен same-origin browser harness беше използван само за QA и след теста е изтрит. Реален Opera render беше изпълнен при 390 px за всички комбинации:

`9 content types × 3 image levels = 27 states`.

| Проверка | Статус | Доказателство |
|---|---|---|
| 27/27 hierarchy states | **PASS** | `listing`, `firm`, `shop`, `health`, `event`, `article`, `publication`, `question`, `info` × `real/template/lom` |
| 1200×630 composition ratio | **PASS** | 27/27 rendered states са в `1200/630` aspect ratio |
| `og:image` отделен от metadata | **PASS** | 27/27 image blocks не съдържат metadata блока |
| metadata отделен от QA | **PASS** | domain/title/description и QA са различни DOM зони |
| Theme template branding | **PASS** | 9/9 тематични шаблона съдържат дискретно `Попитай.Лом` |
| Real-media level | **PASS** | неутрална демонстрация; не е измислена снимка или лице |
| Stock/fake image protection | **PASS** | 27/27 няма измислен `<img>` content asset |
| Lom panorama fallback | **PASS** | използва наличния `assets/lom-cover-share-1200x630.webp` само при `image=lom` |
| Production crawler warning | **PASS** | 27/27 QA примера казват, че JS симулация не доказва crawlable OG |
| Mobile 390px harness | **PASS** | всички 27 състояния проверени в 390px frame |
| Стар `.social-card` | **PASS — absent** | новият модел е `og-image-frame` + отделен `facebook-preview-meta` |
| Desktop listing template | **PASS — Opera visual** | видима отделна 1200×630 template визуализация + metadata под нея |
| Desktop Health template | **PASS — Opera visual** | тематичен Health шаблон без лице/stock + дискретен бранд |
| Desktop Info Lom panorama | **PASS — Opera visual** | реалният Lom panorama се показва като стъпка 3 / общ fallback |
| Production Facebook/Open Graph integration | **OPEN / NOT PROVEN** | изисква отделна crawler-visible production проверка/архитектура |

## Инфо Лом — live parity

Шестте реални раздела, сверени с production, са:

- Здраве
- Институции
- Транспорт
- Образование и култура
- Банки и банкомати
- Комунални услуги

`Полезни телефони` не е отделен раздел.

## Stage 2 QA matrix — текущ статус

| Проверка | Статус | Бележка |
|---|---|---|
| Safety boundary | PASS | само safety prototype branch; без production/Supabase/LOCKED промени |
| `normalizeHomeComposition()` | PASS | премахнат от `app.js` |
| Home single render owner | PASS | marketplace + specialized block се връщат директно от `home()` |
| Manual category change clears discovery | PASS — source | `listing-category` change reset-ва discovery context |
| Manual category change refreshes adapter | PASS — source | adapter чете текущата category/subcategory/listing_type |
| Publication mandatory-short claim | PASS | няма правило, че Публикацията трябва да е кратка |
| Conditional Share states | PASS — Opera/source | Publication/Shop/Health/Event имат eligible и blocked примери |
| Social image hierarchy UX | **PASS — Opera/browser QA** | 27/27 states + desktop spot checks |
| Social Preview production crawler integration | **OPEN** | prototype JS не доказва crawler-visible OG metadata |
| 58/58 Service compatibility mapping coverage | PASS | coverage на mapping layer-а; не е persistence proof |
| Exact discovery leaf persisted after submit | **OPEN / FAIL** | не се persist-ва отделно при текущия договор |
| Exact leaf reconstruction from published record | **OPEN / FAIL** | не може надеждно да се гарантира само от canonical subcategory |
| Content Master V3 в prototype diff | PASS — липсва по дизайн | не трябва да се добавя в този prototype-only diff |
| Content Master V3 official repo checkpoint | **OPEN / REQUIRED** | следващ отделен docs-only checkpoint |

## Задължителен следващ docs-only checkpoint

`POPITAI_LOM_MASTER_CONTENT_STRATEGY_V3_2026-09-03.md` трябва да бъде качен официално в repo в отделен **docs-only checkpoint**. Това не се прави вътре в prototype-only remediation diff и не отключва Stage 3.

## Основни prototype routes

Hash routes се използват само в изолирания прототип:

- `#home`, `#obyavi`, `#uslugi`, `#rabota`, `#imoti`, `#stoki`, `#avtomobili`, `#zhivotni`
- `#magazini`, `#zavedenia`, `#zdrave`, `#firmi`, `#info`, `#aktualno`, `#statii`, `#vaprosi`
- `#detail/listing`, `#detail/firm`, `#detail/shop`, `#detail/health`, `#detail/info`, `#detail/article`, `#detail/publication`, `#detail/event`, `#detail/question`
- conditional Share examples: `?share=eligible|blocked`
- image hierarchy examples on share-eligible details: `?share=eligible&image=real|template|lom`
- `#add/listing`, `#add/firm`, `#add/shop`, `#add/health`, `#add/question`

## Production boundary

**Stage 2 остава FAIL. Owner acceptance остава pending. Stage 3 остава BLOCKED. Social Preview production integration остава OPEN.**

Този branch не разрешава merge/deploy към `main`, Supabase/schema/RLS/RPC промени, taxonomy промени или промяна на protected Firms/Listings/Masters semantics.
