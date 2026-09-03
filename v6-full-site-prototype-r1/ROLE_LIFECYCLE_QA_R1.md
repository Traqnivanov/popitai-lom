# Попитай.Лом — ROLE / LIFECYCLE QA R1

Статус: **STATIC PASS WITH INTERACTION BLOCKER / NO PRODUCTION CHANGE**  
Дата: 03.09.2026  
Branch: `v6-full-site-prototype-r1`  
Static evidence head at audit start: `ceee9cd0c6bd55df44785bb4df63d9716b60fe7a`

## 1. Какво проверява този документ

Това е отделна проверка на ролите и жизнения цикъл на съдържанието в изолирания full-site prototype.

Проверява се:

- какво вижда Гост;
- какво вижда обикновен Потребител;
- какво вижда Модератор;
- какво вижда Администратор;
- кой може да отвори Create/Edit flow;
- какво става след submit;
- дали own-content и foreign-content границите са видими и защитени и на route ниво;
- дали pending/approved/needs_changes/rejected се представят различно;
- дали mock запис може погрешно да изглежда като реален публичен запис;
- дали share/edit/admin действия се показват само когато са допустими.

Тази проверка не променя реални роли, RLS, schema, permissions или moderation правила.

## 2. Общ lifecycle — статична проверка

| Сценарий | Статус | R1 поведение |
|---|---|---|
| Невалидна форма | **PASS — static** | Показва общо `Провери формата`, inline грешки и фокусира първото невалидно поле. |
| Поправяне след blur/input | **PASS — static** | Полетата се преоценяват след blur и при следваща промяна. |
| Submit in progress | **PASS — static** | Submit бутонът се блокира и показва `Изпращане…` / `Публикуване…`. |
| Double submit | **PASS — static** | `data-submitting` блокира повторен submit. |
| Offline/error | **PASS — static** | Формата остава попълнена и показва отделна грешка вместо фалшив success. |
| Dirty form → вътрешна навигация | **PASS — static** | Има собствен диалог `Има неизпратени промени`; не се разчита само на browser confirm. |
| Dirty form → затваряне/refresh | **PASS — static** | Има `beforeunload` защита. |
| Login/Register/Recover dirty guard | **PASS — static** | Тези auth форми са изрично изключени от dirty guard. |
| Guest submit на защитена форма | **PASS — static** | Попълненото се snapshot-ва, route-ът отива към вход, след login се възстановява. |
| Success receipt | **PASS — static** | След submit има отделен success screen и фокус към receipt-а. |
| Interaction / mobile / real browser | **BLOCKED** | Opera Browser Connector не е свързан; няма право да се маркира interaction PASS. |

## 3. Гост

| Повърхност | Очакване | R1 |
|---|---|---|
| Browse Home/Marketplace/Firms/Info/Articles/Q&A | Публично | **PASS — static** |
| Create Listing/Firm/Question/Health/Shop/Info proposal | Може да попълни, но submit изисква вход | **PASS — static** |
| Draft след вход | Да се възстанови | **PASS — static** |
| Profile private content | Да не се показва | **PASS — static** — вижда Login/Register. |
| Admin/Moderator panel | Да е забранен | **PASS — static** — показва `Нямаш достъп`. |
| Edit чужда listing | Да не може | **PASS — static** — `?edit=` е блокиран, не само бутонът. |
| Edit чужда firm | Да не може | **PASS — static** — `?edit=` е блокиран, не само бутонът. |

## 4. Обикновен потребител

| Сценарий | Очакване | R1 |
|---|---|---|
| Нова лична обява | До защитената месечна квота, pending | **PASS — static representation** |
| Редакция на собствена обява | Без нова квота, pending review | **PASS — static representation** |
| Редакция на чужда обява | Забранена | **PASS — static** |
| Нова фирма | Pending review | **PASS — static representation** |
| Редакция на собствена фирма | Pending review; последната approved версия остава публична | **PASS — static representation** |
| Редакция на чужда фирма | Забранена | **PASS — static** |
| Publish as firm | Само при собствена approved фирма | **PASS — static** — `Моя одобрена фирма` не се предлага без такъв контекст. |
| Admin-only listing extras | Скрито | **PASS — static** |
| Expanded firm access controls | Скрито | **PASS — static** |
| Health specialist/practice proposal | Pending specialized review | **PASS — static representation** |
| Temporary health service listing | Listing flow, не verified specialist | **PASS — static representation** |
| Shop proposal | Pending specialized review | **PASS — static representation** |
| Info proposal | Pending specialized review | **PASS — static representation** |
| Question | Pending review | **PASS — static representation** |
| Answer | Pending review | **PASS — static representation** |
| Correction | Не променя факта директно | **PASS — static representation** |
| Report | Не изтрива автоматично | **PASS — static representation** |

## 5. Модератор

Каноничната граница е: Модераторът може да обработва разрешено чуждо съдържание, но собственото му съдържание остава normal-user lifecycle.

| Сценарий | Очакване | R1 |
|---|---|---|
| Own listing create/edit | Същото като User → pending | **PASS — static representation** |
| Own firm create/edit | Същото като User → pending | **PASS — static representation** |
| Admin direct publish | Не | **PASS — static** |
| Admin listing extras | Не | **PASS — static** |
| Permanent delete | Не | **PASS — static** — бутонът се рендерира само при Admin. |
| Role management | Не | **PASS — static** |
| Expanded access grant/revoke | Не | **PASS — static** |
| Moderation panel | Да, за разрешените задачи | **PASS — static representation** |
| Self-moderation | Забранена | **PASS BY CURRENT FIXTURE / NEEDS INTERACTION + DYNAMIC RETEST** — текущата queue fixture съдържа чужди записи; role copy и правилото са правилни, но искаме отделен dynamic self-owned test case преди final acceptance. |

## 6. Администратор

| Сценарий | Очакване | R1 |
|---|---|---|
| Listing monthly normal-user quota | Не се прилага | **PASS — static representation** |
| Listing direct publish | Да, според защитеното правило | **PASS — static representation** |
| Firm direct publish | Да, според защитеното правило | **PASS — static representation** |
| Admin listing extras | Видими | **PASS — static** |
| Protected Admin/Ivanov edit example | Разрешен само на обозначения protected fixture | **PASS — static** |
| Permanent delete action | Видимо само за Admin | **PASS — static**; реалното destructive действие е нарочно изключено в prototype. |
| Role management | Видимо само за Admin | **PASS — static** |
| Expanded access management | Видимо само за Admin | **PASS — static** |
| Health/Shop/Info specialized proposals | Не се превръщат автоматично в generic direct-publish flows | **PASS — static representation** |

## 7. Ownership / renderer findings

### FIXED — duplicate Listing form renderer

По време на този audit беше открит стар `renderListingForm()` в `prototype-listings.js`, докато реалният R1 renderer вече е `prototype-listing-form.js`.

Това беше премахнато. След корекцията:

- `prototype-listings.js` държи Health browse/detail/proposal, Listing detail и shared field helpers;
- `prototype-listing-form.js` е единственият Listing form renderer;
- няма load-order override като част от нормалния Listing form lifecycle.

### FIXED — Listing edit authorization

Преди audit-а чужда примерна listing можеше да отвори `listing-form?edit=...` при ръчно зададен route.

След корекцията:

- edit бутонът се показва само при разрешен owner context;
- самият edit route също отказва достъп;
- hiding на бутона не се използва като единствена защита в prototype модела.

### FIXED — Firm edit authorization

Същият клас проблем беше открит при Firm detail/form и е коригиран по същия двустранен модел.

### FIXED — mock share trust boundary

Примерните Health/Firm/Shop/Event записи вече не се представят като готови canonical public записи за споделяне.

## 8. Script dependency check

Текущият `index.html` зарежда form lifecycle слоя преди `prototype-info-parity.js`:

1. core/data/render helpers;
2. profile/local/community surfaces;
3. `prototype-forms.js`;
4. `prototype-info-parity.js`;
5. `prototype-app.js`.

Това е правилният dependency order за Info proposal submit override-а.

## 9. Какво НЕ е PASS

Следните точки остават честно отворени:

1. **Real browser interaction test** — BLOCKED, защото Opera Browser Connector не е свързан.
2. **Mobile interaction test** — BLOCKED по същата причина.
3. **Keyboard/focus trap interaction** — source изглежда правилно, но не се маркира interaction PASS без браузър.
4. **Moderator self-owned queue dynamic fixture** — нуждае се от отделен self-owned test case, а не само от чуждите текущи fixtures.
5. **Production behavior** — изобщо не се тества от R1; prototype approval не е production approval.

## 10. Safety

Последният сравнен diff към safety baseline `bdc333248a56060d6fa03565125a96ee5a52902d` показва:

- branch е само ahead, не е behind;
- всички променени файлове са под `v6-full-site-prototype-r1/`;
- няма промяна в production/public files;
- няма schema/RLS/CHECK/trigger/RPC промени;
- няма промяна на реални роли, permissions, quotas или moderation backend;
- няма промяна на `main`.

## 11. Следващ acceptance gate

Преди whole-site prototype да се нарече финално прегледан:

1. dynamic Moderator self-moderation fixture;
2. реален browser smoke test;
3. mobile navigation/form interaction test;
4. final visible-copy scan;
5. final safety diff.

До тогава статусът остава **STATICALLY CONSOLIDATED / INTERACTION NOT YET PASSED**.
