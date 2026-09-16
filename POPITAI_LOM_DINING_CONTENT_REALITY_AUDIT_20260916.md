# Попитай.Лом — Dining content reality / gap / duplicate audit

Дата: **16.09.2026**  
Work provenance: **Work 2**  
Статус: **READ-ONLY AUDIT + RESEARCH INVENTORY / OWNER DECISION OPEN / NO RUNTIME OR PRODUCTION PERMISSION**

## 1. Изпълнителен verdict

`Заведения` вече има правилен публичен route и правилен production owner **Firms / `businesses` / category `Заведения`**, но няма завършен, доказан content inventory в Stage 2. Публичният `zavedenia.html` зарежда одобрени Firms records динамично, докато review prototype няма одобрен ресторантски detail record.

Не трябва да се създава втори каталог. Новите доказани заведения се описват в `content-inventory/`, а production остава при Firms.

## 2. Проверена текуща архитектура

- `zavedenia.html` предлага `Ресторанти`, `Кафенета`, `Пицарии`, `Сладкарници` и `Доставка на храна` като discovery входове.
- Реалните карти се зареждат от `businesses` с exact category `Заведения`.
- `dobavi-firma.html` и `public-category-dictionary-v1.js` използват един business category value.
- `prototype-final-ia/prototype-content-views.js` очаква Firms record с social category `Заведения`, но в одобрения prototype data snapshot няма такъв запис.
- Няма право да се копира запис от Firms в Info Lom или в отделен restaurant datastore.

## 3. Доказан gap: комбинирани хотел-ресторанти

Хотел `Москва`, парк хотел `Ривър` и хотел/ресторант `Дунав` могат да имат едновременно accommodation и dining discovery. Текущият `businesses.category` е единичен text value, а бъдещото `Настаняване` е отделна exact category.

Следователно два отделни профила за един и същ обект биха нарушили duplicate-safe contract. Правилната посока е **един canonical Firms record с повече от една discovery facet**, но exact production field/schema/form/search contract е **OPEN PRODUCTION CHECKPOINT**. Този audit не избира между tags, relation table или друг механизъм и не променя schema.

## 4. Начален dining inventory

### Силни кандидати

| Обект | Evidence | Статус |
| --- | --- | --- |
| Ресторант Дъгата | активен официален сайт, online ordering, адрес, телефон, работно време; recent official Facebook signal | `officially_verified` за посочените полета; eligible за bounded prototype review, но не е selected |
| Пицария При Финци | official business page с адрес/телефон и dated operating post за 21.01.2026 | `officially_verified` за посочените полета; hours остават OPEN; eligible, not selected |
| Пица на пещ Тербаяно | official business post от 19.07.2026 с Lom адрес, телефон и delivery signal | `officially_verified` за посочените полета; hours остават OPEN; eligible, not selected |

### Research-only кандидати

| Обект | Наличен сигнал | OPEN преди показване |
| --- | --- | --- |
| Пицария Палма | official Facebook page и телефонен сигнал | current address/hours/activity, duplicate check |
| Каприз 2025 | official social page с адрес/телефон/часове | current activity и relationship с близкия адрес на При Финци |

### Owner-confirmed existence

| Обект | Сигурен факт | OPEN official fields |
| --- | --- | --- |
| Ресторант Бохеми | Local owner потвърждава, че обектът съществува и трябва да присъства в inventory | official page, exact address, direct phone/hours confirmation, duplicate check |

Старите directory сигнали за `Валентино`, `Дунавски вълни`, `Friends`, `Милано` и други не са достатъчни за public seed без direct current signal. Те остават кандидати за следващ verification pass, не се представят като активни. `Бохеми` е изваден от тази обща група, защото existence е изрично потвърден от местния owner, но контактните му полета още не са official.

## 5. Source boundary

Официалният сайт или управляваната от бизнеса official social page могат да доказват собствени контактни полета. Google Maps, каталози, review платформи и local signals са discovery/evidence помощници, но сами не превръщат адрес, работно време или active status в official факт.

Менюта, цени, промоции и наличности са динамични и не се копират в inventory. Показва се direct official channel.

## 6. Следващ точен ред

1. Direct current verification на Пицария Палма, Каприз 2025 и official fields на Бохеми.
2. Read-only duplicate check срещу съществуващите `businesses` records преди какъвто и да е seed proposal.
3. Отделен owner verdict за трите eligible dining records: `Ресторант Дъгата`, `Пицария При Финци`, `Пица на пещ Тербаяно`.
4. Production checkpoint за един canonical Firms record с accommodation+dining discovery facets.
5. Едва след това bounded adapter proposal, desktop + 390 px QA и отделно implementation approval.

Няма промяна на prototype runtime, production, Supabase, schema/RLS/RPC, Stage 3 или LOCKED safety HEAD.
