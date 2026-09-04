# Попитай.Лом — Content-complete IA prototype

Статус: **ИЗОЛИРАН ПРОТОТИП / STAGE 2 ACCEPTANCE FAIL / SOCIAL CARD COMPOSER QA PASS / PRODUCTION FACEBOOK-OG DELIVERY OPEN / OWNER ACCEPTANCE PENDING / STAGE 3 BLOCKED / НЕ Е PRODUCTION / НЕ ЗАПИСВА В SUPABASE**

Stage 2 safety branch: `prototype/content-complete-ia-20260904-stage2-safety`.

Канонична база за този prototype pass: `POPITAI_LOM_MASTER_CURRENT.md`, приложимите `PROJECT_RULES_*`, последните изрични решения на собственика и съдържателните правила от `POPITAI_LOM_MASTER_CONTENT_STRATEGY_V3_2026-09-03.md`, консултиран като източник, но **не добавян в този prototype-only diff**.

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

Прототипът има compatibility mapping за всички service discovery leaves към съществуващи canonical Service стойности. Това доказва **coverage на adapter mapping-а**, но не доказва, че точният discovery leaf се записва и може да бъде възстановен след submit.

Пример:

`Кетъринг → canonical subcategory: Фото, видео и събитийни услуги`

При действащия backend договор отделното `Кетъринг` не се persist-ва като собствено поле. След submit записът сам по себе си не съдържа достатъчно информация, за да върне надеждно потребителя обратно към exact leaf `Кетъринг`.

Това е **OPEN / FAIL / LOCKED граница**. Ако в бъдеще продуктът изисква exact-leaf persistence/reconstruction, трябва отделно LOCKED решение с DB before/after, засегнати записи и форми, migration/RLS/RPC/validation/edit-flow последствия, рискове и rollback.

## Round 2 remediation — запазени решения

- при ръчна смяна на Listing категорията несъвместимият discovery context се изчиства и техническият adapter се преизчислява;
- Публикациите не се описват като задължително кратки;
- Publication / Shop / Health / Event имат условни eligible/blocked Share prototype states;
- `normalizeHomeComposition()` е премахнат; Home се изгражда директно от един render owner;
- Info Lom следва live шестте раздела: Здраве, Институции, Транспорт, Образование и култура, Банки и банкомати, Комунални услуги.

## Social Card Composer — текущ Stage 2 prototype contract

Social Preview вече се демонстрира чрез един **Social Card Composer**, който работи с контролирани данни на конкретното съдържание, а не гадае тема от свободен текст.

Composer input моделът съдържа:

- content type;
- конкретно заглавие;
- основна категория;
- точен discovery/subcategory контекст, когато съществува;
- контролирана визуална тема;
- наличие на реална одобрена медия;
- местоположение;
- public/approved/share-eligible status.

Това е prototype visual contract, не production schema.

### Пет общи композиции

1. **Обява** — услуги, стоки, работа, имоти, автомобили и животни.
2. **Профил** — фирма, магазин, заведение и лекар.
3. **Редакционно съдържание** — Статия и Публикация с различни етикети и продуктови роли.
4. **Събитие**.
5. **Обществена информация** — Въпрос и Info Lom с различен trust статус.

Не се създава отделна ръчна картинка за всяка категория.

Категорията/discovery контекстът могат да променят контролирано:

- SVG пиктограмата;
- визуалния мотив;
- акцентния цвят;
- малкия етикет;
- конкретното заглавие.

## Професионална иконна посока в Social Card Composer

Social Card Composer **не използва emoji**. В него се използва една SVG line-icon посока:

- тъмносин контур;
- еднаква дебелина на линията;
- еднакви пропорции;
- ограничен акцентен цвят;
- максимум два смислови символа в композиция; текущите примери използват по един.

Това е **prototype visual direction**, не окончателно одобрение на всеки asset.

Общата подмяна на emoji/икони в останалия сайт е **отделен visual-system checkpoint след Stage 2**. Тази задача не прави масова подмяна.

## Image hierarchy

Composer следва този ред:

1. **реална одобрена снимка / лого / корица / афиш** на конкретното съдържание;
2. при липса — **тематичен брандиран 1200×630 шаблон** според content type + category/discovery;
3. **панорама на Лом** само като последен общ fallback.

Не се използват измислени лица, stock снимки, фалшива реална медия или pending/неодобрени изображения.

При `media=real` Stage 2 показва неутрален **slot за реалната одобрена медия**, вместо да измисля asset. Production би трябвало да постави реалната approved media версия.

Във всички composer варианти присъства дискретно `Попитай.Лом`.

## Видим текст вътре в 1200×630 изображението

В самото изображение има:

- малък етикет за вида;
- голямо конкретно заглавие или контролиран fallback;
- тематична SVG пиктограма/мотив;
- малко `Попитай.Лом`.

Заглавието е ограничено до максимум две четими линии.

В изображението не се поставят телефон, работно време, цена, дълго описание, URL или инструкции.

## Заглавие и fallback

Заглавието не се измисля от генератора. Prototype примерите използват контролирани данни, които симулират правилния source contract:

- Статия/Публикация → редакционно заглавие;
- Обява/услуга → заглавие на обявата;
- Фирма/магазин/заведение → име на профила;
- Лекар → публично допустимо име/роля + специалност;
- Info Lom → официално име на записа;
- Събитие → име на събитието;
- Въпрос → самият въпрос.

Ако няма подходящо заглавие, Composer използва контролиран fallback от category/discovery контекста, например `Почистване → Почистване в Лом`.

Не се поддържа огромен ръчен списък със заглавия за всички бъдещи публикации.

## Facebook текст, og:image и metadata са различни слоеве

Prototype демонстрацията разделя четири различни неща:

1. **Примерен Facebook текст — незадължителен.** Той е пример какво човекът може да напише над link preview; Попитай.Лом не го контролира автоматично.
2. **`og:image` — 1200×630 asset.**
3. **Metadata блок:** domain/site, title и description — отделно от самото изображение.
4. **QA обяснения:** отделен disclosure извън изображението и metadata блока.

Официалното заглавие може да се повтори в `og:image` и metadata; teaser/Facebook текстът има различна роля и не повтаря metadata description механично.

## Задължителни prototype примери

### Един и същ Listing composition, различен контекст

- ВиК — `#detail/listing?share=eligible&demo=vik`
- Кетъринг — `#detail/listing?share=eligible&demo=catering`
- Работа — `#detail/listing?share=eligible&demo=work`
- Имоти — `#detail/listing?share=eligible&demo=property`
- Автомобили — `#detail/listing?share=eligible&demo=auto`

Тези пет примера използват един и същ Listing composition, но сменят контролирано тема, SVG, accent, label и заглавие.

### Допълнителни примери

- лекар без снимка — `#detail/health?share=eligible&media=none`
- фирма с място за реално лого/снимка — `#detail/firm?share=eligible&media=real`
- магазин — `#detail/shop?share=eligible&media=none`
- Статия без корица — **Как да се пенсираш в Лом** — `#detail/article?share=eligible&demo=pension&media=none`
- Публикация с real-media slot — `#detail/publication?share=eligible&media=real`
- Публикация без медия — `#detail/publication?share=eligible&media=none`
- Събитие с approved-poster slot — `#detail/event?share=eligible&media=real`
- Събитие без афиш — `#detail/event?share=eligible&media=none`
- Въпрос — `#detail/question?share=eligible`
- Info Lom / Община Лом — `#detail/info?share=eligible&demo=municipality`
- общ Lom fallback — `#detail/info?share=eligible&demo=municipality&image=lom`

## Social Card Composer QA — текущ резултат

Временен same-origin browser harness беше използван само за QA и след теста е изтрит.

QA не използва старото `27/27` като доказателство за category coverage. Вместо това са проверени **16 различни prototype случая**, включително пет различни listing категории/заглавия, real-media slots, template fallback-и и Lom panorama fallback.

| QA критерий | Статус | Доказателство |
|---|---|---|
| Composition/layout coverage | **PASS** | 5/5 общи композиции са реално рендерирани |
| Content-type coverage | **PASS** | 9 content types са покрити |
| Category-aware Listing coverage | **PASS** | ВиК, Кетъринг, Работа, Имоти, Автомобили имат 5 различни theme/accent/title/SVG комбинации |
| Title-source coverage | **PASS** | конкретните примерни titles идват от контролирания scenario data contract |
| Title fallback coverage | **PASS** | празно title + discovery `Почистване` → `Почистване в Лом` |
| Professional SVG consistency | **PASS** | една SVG line-icon система; еднакъв stroke width |
| Emoji в Social Card Composer | **PASS — няма** | browser QA не намира emoji в composer DOM |
| Real-media / template / Lom hierarchy | **PASS** | real slots без fake URL, template states и реалният Lom panorama fallback са проверени |
| Mobile 390px | **PASS** | 16 случая без horizontal overflow |
| Заглавие максимум 2 линии | **PASS** | всички 16 рендера са ≤2.15 изчислени линии |
| Hardcoded несъответстваща категория | **PASS** | expected title + expected label + expected composition съвпадат за всеки тест |
| Измислени assets | **PASS — няма** | Composer не поставя fake `<img>` content asset; real mode е placeholder slot |
| `og:image` / metadata / QA separation | **PASS** | трите слоя са различни DOM зони |
| Facebook текстът е отделен | **PASS** | маркиран е като незадължителен и неконтролиран от сайта; teaser ≠ metadata description |
| Branding | **PASS** | `Попитай.Лом` е вътре във всеки composer image state |

## Production архитектурна посока — само посока, не implementation approval

След като конкретна версия на съдържанието стане **approved / public / share-eligible**, бъдещата production система трябва автоматично да създаде и запази 1200×630 social card от одобрените данни.

При одобрена редакция трябва да се създаде нова social-card версия. Pending, hidden или non-public съдържание не трябва да получава публична share карта.

Това засега е само prototype contract.

**Не е избрана и не е разрешена** конкретна production реализация чрез:

- Supabase Edge Function;
- Worker;
- Storage промени;
- нови schema полета;
- backend generation;
- production Open Graph delivery.

Stage 2 **не доказва**, че Facebook crawler получава правилните данни. JavaScript визуализацията е само UX/prototype доказателство.

## Оставащи OPEN граници

- **Exact service leaf persistence/reconstruction:** OPEN / FAIL / LOCKED.
- **Production Facebook/Open Graph crawlable delivery:** OPEN.
- **Content Master V3 official repo checkpoint:** OPEN / REQUIRED docs-only checkpoint.
- **Обща подмяна на emoji/иконите в целия интерфейс:** отделен visual-system checkpoint след Stage 2.
- **Stage 3:** BLOCKED.

## Задължителен следващ docs-only checkpoint

`POPITAI_LOM_MASTER_CONTENT_STRATEGY_V3_2026-09-03.md` трябва да бъде качен официално в repo в отделен **docs-only checkpoint**. Това не се прави вътре в prototype-only diff и не отключва Stage 3.

## Production boundary

**Stage 2 остава FAIL. Owner acceptance остава pending. Stage 3 остава BLOCKED. Social Preview production integration остава OPEN.**

Този branch не разрешава merge/deploy към `main`, Supabase/schema/RLS/RPC промени, taxonomy промени или промяна на protected Firms/Listings/Masters semantics.
