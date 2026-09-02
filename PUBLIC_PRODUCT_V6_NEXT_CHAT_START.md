# Попитай.Лом — V6 NEXT CHAT START

Статус: **RECOVERY PACKAGE READY FOR USER REVIEW / NO IMPLEMENTATION**
Branch: `v6-product-foundation-draft`
Актуализирано: 02.09.2026

## 1. ТЕКУЩАТА ЗАДАЧА

Текущата работа е:

`REVIEW THE V6 RECOVERY PACKAGE — NO IMPLEMENTATION UNTIL EXPLICIT APPROVAL`

Не започвай V18, нов visual layer, production UI/backend/schema/RLS промяна или merge към `main`.

Production `main` не е променен от V6. Провереният prototype baseline е:

`9add22055dfa663f585a48f094585d5bedced766`

V6-C **не е приет** и browser/rendered QA за този head **не е PASS**.

## 2. ПРОЧЕТИ В ТОЗИ РЕД

1. `PROJECT_RULES_00_READ_FIRST.md`
2. `PROJECT_RULES_PROTECTED_CORE.md`
3. `PROJECT_RULES.md`
4. `PROJECT_RULES_RENDER_OWNERSHIP.md`
5. `PROJECT_RULES_ADMIN_MODERATOR.md` — само ако задачата засяга роли, права, ownership, moderation или protected flow
6. `PUBLIC_MARKETPLACE_V3_APPROVED_SPEC.md`
7. `PUBLIC_PRODUCT_V6_CANONICAL_RECOVERY.md`
8. `PUBLIC_PRODUCT_V6_IMPLEMENTATION_MATRIX.md`
9. `PUBLIC_PRODUCT_V6_DOCUMENT_INDEX.md`
10. `PROJECT_PROGRESS.md`

Не използвай друг V6 документ като самостоятелно разрешение за работа. Отваряй го само ако Document Index го посочва за точната задача.

## 3. НЕПРОМЕНЯЕМА ПРОДУКТОВА ОСНОВА

- водещият продукт е `Обяви и услуги`, не Q&A;
- има един top-level marketplace landing;
- `kategorii.html` е compatibility URL, не второ дърво;
- desktop: `Начало | Обяви и услуги | Фирми | Инфо Лом | Статии | Още | Профил | + Добави`;
- mobile: `Начало | Обяви | + | Инфо | Профил`;
- category/subcategory cards водят към browse/filter резултати;
- deep category view има отделен contextual `Добави обява`;
- Q&A остава видимо, но е secondary/supporting;
- една обява се съхранява веднъж от Listings owner и се показва в приложимите тематични контексти;
- Firms са постоянни профили;
- Health/Info и Shops запазват specialized owners;
- няма fake public `Добави събитие`;
- protected Admin/Moderator/Firms/Listings/Masters/Ivanov логика не се променя.

## 4. ДОКАЗАНИ ОТКЛОНЕНИЯ В ТЕКУЩИЯ PROTOTYPE

- има паралелни `categories` и marketplace category дървета;
- subcategory cards отварят директно form вместо browse/filter;
- 16 public category ids не са напълно mapping-нати към form/listing групите и част могат да паднат към грешната първа опция;
- status/handoff документите са останали зад реално заредените V8–V17 слоеве;
- active JavaScript минава syntax проверка, но старият неизползван `full-site.js` не минава;
- визуални слоеве до V17 са добавяни преди завършено C acceptance и доказан browser QA.

Това са recovery findings, не разрешение да се patch-ва на парче.

## 5. КАКВО СЕ ПРАВИ СЕГА

1. преглеждат се Canonical Recovery и Implementation Matrix като една система;
2. не се връщат superseded 16-category/duplicate-screen решения;
3. ако owner одобри целия пакет, exact next task е bounded prototype consolidation;
4. consolidation не добавя V18, не пипа production и не променя protected logic;
5. след consolidation се прави реален desktop/mobile rendered review.

## 6. STOP УСЛОВИЕ

Спираш потребителя само при действително ново бизнес решение или промяна в роли/права/RLS/schema/ownership/status/approval/direct publish/лимити/media/protected ranking и protected modules.

Не искай междинно „ОК“ за четене, inventory, доказано reconciliation или документационни проверки.
