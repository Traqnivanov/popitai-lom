# Попитай.Лом — разширен dining verification pass

Дата: **16.09.2026**  
Work provenance: **Work 2**  
Проверена база: `ad7d45c709d505aab44ca27bda6a2008fc8d0000`  
Статус: **RESEARCH HANDOFF + BOUNDED CLASSIFICATION / NO IMPORT / NO RUNTIME OR PRODUCTION PERMISSION**

## 1. Verdict

Първоначалните 9 dining обекта не са пълният реален набор. Широкият discovery pass намира 20+ силни текущи/вероятно активни местни кандидата и още приблизително 8–10 research/conflict кандидата.

Oink показва 27 dining резултата за Лом — 19 ресторанта, 5 кафенета и 3 бара — но това е discovery index, а не доказателство за 27 уникални действащи обекта. В него има стари, затворени и вероятно дублирани записи.

Затова правилният ред остава:

`discover → identity/dedupe → current activity → exact fields → source classification → owner proposal`

Забранен е редът:

`catalog result → automatic import`.

## 2. Вече записани — без дублиране

1. Ресторант Дъгата
2. Пицария При Финци
3. Пицария Палма
4. Пица на пещ Тербаяно
5. Каприз 2025
6. Ресторант Бохеми
7. Ресторант Москва
8. Ресторант към парк хотел Ривър
9. Ресторант Дунав

`Бохеми` е owner-confirmed като съществуващ обект. Това не прави автоматично адреса, телефона и часовете официални.

## 3. Класификация за следващия bounded pass

### 3.1 READY само на ниво доказани полета

Тези три записа вече са в `content-inventory/` и могат да бъдат предложени за bounded prototype review само с доказаните полета и след duplicate check срещу реалните Firms records:

| Обект | Доказано | Остава OPEN |
| --- | --- | --- |
| Ресторант Дъгата | active official site, адрес, телефон, работно време, доставка; recent official social signal | canonical production ID, claim, approved media, freshness policy |
| Пицария При Финци | official business page, адрес, телефон, dated operating post от 21.01.2026 | текущи часове, canonical production ID, claim, approved media |
| Пица на пещ Тербаяно | official business post от 19.07.2026, адрес, телефон, доставка | текущи часове, canonical production ID, claim, approved media |

`READY` тук не означава production write или автоматичен public seed.

### 3.2 NEEDS FIELD VERIFICATION

Следните са реални discovery кандидати, но нямат достатъчно direct first-party evidence за public fields. Те не се добавят автоматично като persistent inventory records само по каталожен сигнал:

| Кандидат | Наличен сигнал / известни данни | Точно OPEN |
| --- | --- | --- |
| Гостилница „При Маца“ | Oink + RestaurantGuru + Орли 2026; публикуван адрес `ул. Дунавска 20` | official/direct page, current activity, phone, hours, identity check |
| Дунавски вълни | current signal; публикувани `ул. Дунавска 31`, `0971 21 070`, `08:00–00:00` | direct first-party confirmation; alias check с `Дунавски вълни – При Маца` |
| Food Station by NARODEN | strong 2026 signal; `Пристанищна 26` | direct page/contacts/activity; relation с `Бързо Хранене и Моят Магазин „Народен“` |
| Закусвалня КРИСИ | current/2026 signal; `ул. Людовико Миланези №5` | direct source, exact spelling/name, phone, hours |
| Дюнер Lab | 2026 signal; takeaway/delivery context | direct identity, address, phone, hours, current activity |
| ДЮНЕР KING Лом | current + 2026 signal | direct identity, address, phone, hours, current activity |
| Kastelo | current cafe signal | exact address/identity; relation с `Пицария Кастело` |
| Пицария „Кастело“ | current dining signal | exact address/identity; relation с `Kastelo` |
| Кафе „При близнаците“ | current local index signal | official/direct fields and activity |
| Сладкарска къща „Алф“ | current cafe/sweet-shop signal | official/direct fields and activity |
| Регал | current bar signal | official/direct fields and activity |
| Boutique Bar | current local signal | official/direct fields and activity |
| GO GRILL | current bar & grill signal | official/direct fields and activity |
| Механа Чановете | current Oink + RestaurantGuru signal | exact identity; duplicate/alias check с `Чановете Original` |
| Механа Завалиите | current signal with little public data | direct current activity and all public fields |
| Versus | strong Орли 2026 signal; `ул. Пристанищна 11` | direct page/contacts/hours/activity |
| Кафе-Сладкарница „Фреш“ | Орли 2026; `ул. Дунавска 33` | direct page/contacts/hours/activity |
| Сакура – кафе, сандвичи и салати | Орли 2026 signal | direct page/contacts/address/hours/activity |
| Caffe-Club „Арена“ | Орли 2026 signal | direct page/contacts/address/hours/activity |
| Механа Боруна | Орли 2026 signal | direct page/contacts/address/hours/activity |
| Скарата на Дядо Кольо | Орли 2026 signal | direct page/contacts/address/hours/activity |
| Paloma | current/local cafe/takeaway signal | direct identity and public fields |
| „ВИП Симерс груп“ ООД | current cafe/sweet-shop signal | public brand name vs legal identity, direct fields/activity |
| Бистро „Рибката“ | current Oink + Орли 2026, but older temporary-closed signal | exact current activity and direct fields; preserve history |
| Чайка beach | strong current Oink + Орли 2026, but older temporary-closed signal | exact current activity and direct fields; preserve history |
| Valentino | recent signal; `ул. Дунавска 23`, `+359 97 166 411`, published weekday hours | direct business proof and identity resolution with `Friends` before accepting fields |
| Китайски ресторант | lead at `ул. Дунавска 38`, `0894 451 212`; secondary hours; 2026 directory presence | recent direct first-party activity; hours remain secondary |
| Пицария Палма | existing inventory research record | current address, hours, activity, duplicate check |
| Каприз 2025 | existing inventory research record | current activity and address relationship with `При Финци` |
| Ресторант Бохеми | owner-confirmed existence | official page, exact address, direct phone/hours, duplicate check |

### 3.3 CONFLICT / IDENTITY RESOLUTION

| Група | Текуща граница |
| --- | --- |
| `Friends ↔ Valentino` | един и същ адрес и съвпадащ телефонен контекст; не се създават два active records без доказателство за едновременно съществуване |
| `Дунавски вълни ↔ Дунавски вълни – При Маца` | не се създава втори record без identity proof |
| `Механа Чановете ↔ Чановете Original` | вероятен duplicate/alias; нужни direct identity данни |
| `Food Station by NARODEN ↔ Бързо Хранене и Моят Магазин „Народен“` | да се установи дали са една марка/нова марка, два обекта или dining+shop на един оператор |
| `Kastelo ↔ Pizza Castelo` | не се сливат само по име; има сигнали за различни адреси/обекти |
| `При Лазар 1 ↔ Лазар 3ти ет.` | identity mapping не е затворен |
| `Bar Paradise ↔ Club Paradise` | не се приемат като отделни active records без current proof |
| `Каприз 2025 ↔ При Финци` | близки адреси `Дунавска 34` / `34А`; relation/duplicate check преди public seed |
| Хотел-ресторанти | `Москва`, `Ривър` и `Дунав` не получават втори Firm profile; нужен е един canonical Firms record с accommodation+dining discovery facets — OPEN production checkpoint |

### 3.4 RESEARCH-ONLY

- `Милано` — catalog record: `ул. Любен Каравелов №9`, `0971 6 00 82`, `0898 649 742`; current activity непотвърдена;
- `Розова долина`;
- `Джоя 69 ЕООД`;
- `Арабски закуски – Лом`;
- `При Лазар 1 / Лазар 3ти ет.`;
- `Принцеса` като dining object;
- `Bar Paradise`;
- китайският ресторант до final current-activity check.

### 3.5 INACTIVE / EXCLUDED FROM ACTIVE DINING

| Обект | Причина |
| --- | --- |
| Club Paradise | current index signal `Затворено за постоянно` |
| Сладкарница Делфин | permanent-closed signal |
| Нашенци | `may be permanently closed`; не влиза като active |
| VIGOS Bar & Dinner | catalog contamination: описанието е за Хасково, не за Лом |
| Бира „Пустиняк“ | продукт/марка, не отделно заведение |

Тези статути са research classification, не destructive delete instruction за съществуващ production record.

## 4. Source boundary

- Official site или управлявана official business social page могат да доказват собствените публични полета на обекта.
- Google/Maps, Oink, RestaurantGuru, Орли, Опознай и други каталози са discovery/secondary evidence; не превръщат сами адрес, телефон, часове или active status в official field.
- Owner-confirmed existence е достатъчно обектът да не бъде отписан, но не доказва останалите полета.
- Rating/review score не се копира като рейтинг на Попитай.Лом.
- Менюта, цени, промоции и наличности не се копират като устойчиви inventory факти.
- Празно поле е по-добро от предположение.

## 5. Work verdict и следващ bounded пакет

1. Широкото dining discovery е приключено; не се повтаря отначало.
2. Трите вече officially verified записа остават единствените `verified_for_bounded_prototype` dining records.
3. Новите кандидати се пазят в този research handoff, но не се наливат автоматично в `records.v1.json` без direct field evidence и identity resolution.
4. Следващата проверка е малък пакет по identity риск: `Friends/Valentino`, `Дунавски вълни/При Маца`, `Чановете`, `NARODEN`, `Kastelo`, `Каприз/При Финци`.
5. След identity пакета се проверяват direct official fields на най-силните недублирани кандидати.
6. След това Work предлага точните нови inventory records и отделно owner избира кои доказани records да участват в bounded Stage 2 adapter.
7. Няма runtime adapter, prototype UI промяна, production import, Supabase/schema/RLS/RPC, Stage 3 или промяна на LOCKED safety HEAD.

## 6. Connector interruption note

По време на read-only изследването е създаден dangling/unreferenced Git object `2e444438bccf42cd828f61c540fa8bfc123d02e2`. Той не е закачен към review branch и не е evidence checkpoint. Не се използва и не се merge-ва.
