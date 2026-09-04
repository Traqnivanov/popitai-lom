# Попитай.Лом — Content-complete IA prototype

Статус: **ИЗОЛИРАН ПРОТОТИП / STAGE 2 ACCEPTANCE FAIL / REMEDIATION QA PASS / OWNER VISUAL ACCEPTANCE PENDING / STAGE 3 BLOCKED / НЕ Е PRODUCTION / НЕ ЗАПИСВА В SUPABASE**

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

## Приложени Stage 2 remediation поправки

1. Точният discovery контекст остава видим през discovery → results → add. Примерът `Кетъринг` остава видим като `Кетъринг`, а compatible Service subcategory стои отделно.
2. Работа, Имоти, Автомобили и Животни не се представят с persisted `subcategory`; discovery контекстът се пази отделно в route/state.
3. `Авточасти` е възстановено като текуща Service стойност.
4. Shop tags са category-aware: релевантните са първи, останалите са в `Други предложения`, а custom `Друго` остава налично.
5. Content Actions са data-aware и topic-aware; липсващ канал не получава фалшив CTA.
6. Social Preview е отделна реалистична card композиция с изображение, title, description и доказан production host; QA бележките са извън картата.
7. Формите имат field-level errors, коректни label/for връзки, aria-describedby, aria-invalid, focus към първата грешка, запазване на въведеното при грешка, dirty guard и заменен success state.

## Инфо Лом — live parity

Проверено директно в production. Шестте реални раздела са:

- Здраве
- Институции
- Транспорт
- Образование и култура
- Банки и банкомати
- Комунални услуги

`Полезни телефони` не е отделен раздел.

## Remediation QA — 04.09.2026

| Проверка | Резултат | Доказателство |
|---|---|---|
| Safety boundary | PASS | само isolated prototype branch; production/Supabase/LOCKED не са променяни |
| 58 service discovery leaves | PASS | browser automation: 58/58 имат compatibility mapping |
| Service discovery запазва точния избор | PASS | `Кетъринг` остава видим в results и form; Add URL носи отделно `discovery=Кетъринг` |
| Current Service persistence | PASS | Service form пази canonical compatibility `subcategory`; `Авточасти` остава налично |
| Работа / Имоти / Auto / Животни | PASS | browser automation: всички discovery groups генерират URL без `subcategory`; exact discovery остава отделно |
| Edit priority | PASS | browser automation: запазеният edit record има приоритет пред create prefill |
| Shop tags | PASS | визуално проверени `Хранителни` и `Техника`: релевантни първо, други зад disclosure |
| Content Actions | PASS | Firm без site не показва `Сайт`; Article няма generic `Намери услуга`; Publication без relation няма related CTA |
| Social card desktop | PASS | Opera: отделна card визуализация и отделна QA зона |
| Social card mobile 390px | PASS | реален 390px iframe render: image + source + title + description без хоризонтален overflow |
| Home mobile 390px | PASS | реален 390px render: header/hero/search/CTA и marketplace начало са четими |
| Listing form mobile 390px | PASS | реален 390px render: discovery `Кетъринг` е видим; form layout не прелива |
| Field validation | PASS | real browser automation: invalid submit е отказан, field errors се показват, въведеното остава |
| Accessibility form wiring | PASS | real browser automation: labelsConnected, requiredDescribed, focusFirstError |
| Dirty hash navigation | PASS | real browser automation: отказано напускане запазва текущия hash/form |
| Refresh/close protection | PASS | real browser automation: beforeunload е предотвратен при dirty form |
| Success lifecycle | PASS | success заменя активната форма и повторно submit действие липсва |
| Diff isolation | PASS | compare спрямо `0b149238…`: само файлове в `prototype-final-ia/` |

Временният `mobile-qa.html`, използван за real-browser 390px и interaction automation, е изтрит след тестовете и не присъства в крайния diff.

**Важно: REMEDIATION QA PASS не означава Stage 2 acceptance. Stage 2 остава FAIL до независимата проверка и новото визуално приемане от собственика. Stage 3 остава BLOCKED.**

## Основни prototype routes

Hash routes се използват само в изолирания прототип:

- `#home`, `#obyavi`, `#uslugi`, `#rabota`, `#imoti`, `#stoki`, `#avtomobili`, `#zhivotni`
- `#magazini`, `#zavedenia`, `#zdrave`, `#firmi`, `#info`, `#aktualno`, `#statii`, `#vaprosi`
- `#detail/listing`, `#detail/firm`, `#detail/shop`, `#detail/health`, `#detail/info`, `#detail/article`, `#detail/publication`, `#detail/event`, `#detail/question`
- `#add/listing`, `#add/firm`, `#add/shop`, `#add/health`, `#add/question`

## Production boundary

Този branch не разрешава merge/deploy към `main`, Supabase/schema/RLS/RPC промени или промяна на protected Firms/Listings/Masters semantics.
