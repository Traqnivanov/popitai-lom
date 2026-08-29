# Попитай.Лом — Етап 1 — taxonomy и структурирана подкатегория

Статус: **APPROVED LOCKED AMENDMENT**  
Дата: **30.08.2026**

Този документ е конкретното одобрено решение за Етап 1 и тесният LOCKED amendment, необходим за да няма frontend-only защита, която може да бъде заобиколена през Data API или SECURITY DEFINER edit RPC.

Той допълва `PUBLIC_SITE_INFORMATION_ARCHITECTURE_APPROVED_SPEC.md` и **не отменя** защитите в `PROJECT_RULES_PROTECTED_CORE.md` и `PROJECT_RULES_ADMIN_MODERATOR.md`.

## 1. Непроменяеми граници

Етап 1 **не променя**:
- RLS семантиката, ролите, ownership, moderation status flow или approval/direct-publish правата;
- месечните квоти за обяви;
- лимитите и moderation логиката за снимки;
- Admin/Moderator границите и permanent delete;
- schema/facets на „Фирми“;
- construction/„Иванов Ремонти“ search priority;
- несвързани Info Lom, Shops, Events или Health потоци.

Промяната в backend е само data-integrity защита за вече съществуващите полета `category`, `subcategory` и `listing_type` и тесни проверки в съществуващите listing edit RPC. Не се добавя нов бизнес flow.

## 2. Основни категории на Обяви

Запазват се точно съществуващите 11 стойности:

1. Електроника
2. Дом и градина
3. Дрехи и обувки
4. Деца и бебета
5. Спорт и хоби
6. Автомобили и МПС
7. Животни
8. Работа
9. Имоти
10. Услуги
11. Друго

Етап 1 **не измисля нови подкатегории** за Електроника, Дом и градина, Дрехи и обувки, Деца и бебета, Спорт и хоби, Автомобили и МПС, Животни, Работа, Имоти или Друго.

Контролирана `subcategory` в Етап 1 се използва за `Обяви → Услуги`, защото това е bridge-ът към тематичните категории.

## 3. Канонични `Услуги` подкатегории

### Майстори и ремонти — 8
1. Цялостни ремонти
2. Бани и плочки
3. ВиК
4. Електро
5. Покриви
6. Боядисване
7. Дограма
8. Климатици

### Автомобилни услуги — 6
9. Автосервизи
10. Диагностика
11. Гуми
12. Авточасти
13. Автомивки
14. Пътна помощ

### Общи услуги — 8
15. Домашна помощ
16. Красота и грижа
17. Компютърни и технически услуги
18. Фото, видео и събитийни услуги
19. Професионални услуги
20. Обучение и уроци
21. Грижа за деца, възрастни и домашни любимци
22. Транспорт, преместване и доставки

Не се записват сливания като `Автосервиз и диагностика` или `Гуми и авто помощ`. Не се записват неприети aliases в `listings.subcategory`.

## 4. Live preflight, потвърден преди код

При проверката:
- `public.listings` има 6 реда;
- всички 6 са с празна `subcategory`;
- има approved, pending и needs_changes записи;
- няма реален запис с non-empty legacy free-text `subcategory`;
- няма listing edit draft в `public.user_content_edit_drafts`.

Това се проверява отново **веднага преди DB migration**. Ако се е появила непозната non-empty legacy стойност, migration-ът спира.

## 5. Потвърдени backend gaps

### `subcategory`
- текущата форма използва свободен `<input>`;
- INSERT policy проверява само дължина;
- `resubmit_own_listing` приема произволна стойност;
- `save_own_listing_edit_draft` приема произволна стойност;
- `publish_user_content_edit_draft` копира payload-а към `listings`;
- няма taxonomy CHECK.

### `category`
Двата listing edit RPC проверяват само, че категорията не е празна, а не че е една от 11-те разрешени стойности.

### `listing_type`
Direct INSERT RLS пази category/type pairing, но edit RPC проверяват само non-empty `listing_type`.

Одобрените pairing правила остават същите:
- `Работа` → `Предлага работа` / `Търси работа`;
- `Имоти` → `Продава имот` / `Отдава под наем` / `Търси под наем` / `Търси за купуване`;
- останалите категории → `Продава` / `Купува` / `Търси` / `Дава`.

## 6. DB integrity contract

### 6.1 Versioned pure validator

Добавя се една versioned pure функция, напр. `listing_taxonomy_v1_is_valid(category, subcategory, listing_type)`.

Изисквания:
- не е `SECURITY DEFINER`;
- не чете auth/profile/table данни;
- deterministic/pure;
- V1 семантиката не се подменя тихо; бъдеща taxonomy промяна използва нов version/migration.

Тя валидира:
1. category е една от 11-те стойности;
2. listing_type е валиден за category;
3. при `Услуги` non-empty `subcategory` е точно една от 22-те стойности;
4. при category различна от `Услуги` `subcategory` е празна;
5. произволен non-empty free text е невалиден.

### 6.2 CHECK constraint

CHECK пази row integrity, но остава legacy-safe:
- отказва invalid category;
- отказва invalid category/listing_type pairing;
- отказва непозната non-empty subcategory;
- позволява съществуващото legacy състояние `subcategory=''`, за да не чупи view count/status/moderation update-и.

CHECK **не е единственият механизъм**, който изисква подкатегория за нова `Услуги` обява.

### 6.3 BEFORE INSERT / taxonomy-change trigger

На INSERT:
- full validation;
- `Услуги` изисква една от 22-те подкатегории;
- останалите категории изискват празна subcategory.

На UPDATE:
- ако `category`, `subcategory` и `listing_type` са непроменени, legacy редът може да получава други update-и;
- ако някое от тези три полета се променя, новата комбинация трябва да е напълно валидна.

Не се използва grandfathering по UUID или `created_at`. `CHECK NOT VALID` сам по себе си не е legacy решение.

## 7. RPC contract

### `resubmit_own_listing`
- сравнява OLD срещу NEW taxonomy;
- unchanged legacy taxonomy може да се запази;
- при taxonomy change се изисква V1 validation;
- invalid category/type/subcategory връща ясна `22023` грешка.

### `save_own_listing_edit_draft`
- същата OLD/NEW проверка;
- unchanged legacy taxonomy може да се запази;
- changed taxonomy трябва да е canonical;
- arbitrary taxonomy не влиза в draft payload.

### `publish_user_content_edit_draft`
Не се променя business flow. Listing draft-овете не могат да се записват директно от authenticated role; publish остава защитен и от table CHECK + trigger.

## 8. Други потвърдени write paths

Новата защита не трябва да чупи:
- `increment_listing_views(uuid)`;
- Admin/Moderator status updates;
- `publish_user_content_edit_draft(uuid)`;
- listing media RPC;
- monthly quota trigger;
- expiry trigger;
- moderator foreign-update guard;
- `updated_at` trigger;
- media status sync.

Няма view/index, който зависи от `subcategory`.

## 9. Единен frontend речник

Един каноничен public dictionary **замества**, а не допълва:
- `PUBLIC_CATEGORY_LABELS` в `category-hub-v1.js`;
- category/label/routing отговорностите в `CATEGORY_META`;
- category редовете в `STATIC_SEARCH_RECORDS`;
- дублираните category избори във формите;
- public label ↔ internal compatibility mappings.

Иконите и `CONSTRUCTION_SEARCH_STEMS` остават отделни.

Compatibility стойността е **по content type**, не една обща стойност.

Пример `Услуги`:
- listing value: `Услуги`;
- business value: `Работа и услуги`;
- question value: `Работа и услуги`.

## 10. Listing form

Свободният `#listing-subcategory` става dependent `<select>`.

### Нова обява
- category `Услуги` → selector active + required + точно 22 стойности;
- друга category → subcategory hidden/disabled + записва се празна стойност;
- няма измислена `Други услуги` стойност в Етап 1.

### Edit
- зарежда old taxonomy безопасно;
- legacy/empty taxonomy се запазва, ако taxonomy полетата не се променят;
- title/description/price/phone/images edit не принуждава migration;
- при промяна на category/subcategory/listing_type се изисква V1 contract.

Validation се интегрира в съществуващия `listing-form-validation.js`: field error, `aria-invalid`, focus на първата грешка. Не се добавя втори конкуриращ validation owner.

## 11. Тематично mapping правило

`Обяви → Услуги → subcategory` е bridge към:
- `Майстори и ремонти` → 8 repair values;
- `Автомобили` → 6 auto-service values;
- `Услуги` → 8 general-service values.

Health използва verified health dataset, Shops използва специализирания shop flow, Events използва event flow. Заведения не получава измислена listing taxonomy в този етап.

Approved V2 имената са canonical. Например:
- `Домашна помощ`, не `Домашни услуги`;
- `Компютърни и технически услуги`, не само `Компютърни услуги`;
- `Фото, видео и събитийни услуги`, не само `Фото и видео`.

Автомобилните шест стойности остават отделни.

## 12. Deployment order

1. final read-only production preflight;
2. frontend dictionary/form се deploy-ва първо;
3. production frontend verification без fake production записи;
4. DB hardening migration;
5. read-only DB postflight;
6. browser/device regression QA.

DB enforcement **не се deploy-ва първо** срещу стария free-text frontend.

## 13. Rollback order

При rollback след DB hardening:
1. DB enforcement се връща първо;
2. после frontend, ако е необходимо.

Rollback възстановява exact pre-migration RPC definitions, а не приблизителни версии.

## 14. Acceptance / regression matrix

Задължително се проверява:
- new `Услуги` + valid subcategory → PASS;
- new `Услуги` + blank/arbitrary → FAIL;
- non-`Услуги` + blank → PASS;
- non-`Услуги` + non-empty subcategory → FAIL;
- invalid category → FAIL;
- invalid category/listing_type pairing → FAIL;
- direct API bypass → същите резултати;
- legacy view_count/status/unrelated edit → PASS;
- legacy taxonomy change valid → PASS;
- legacy taxonomy change invalid → FAIL;
- approved listing draft unrelated edit → PASS;
- valid taxonomy draft/publish → PASS;
- invalid taxonomy draft → FAIL;
- Admin direct publish остава direct;
- Moderator права/self-moderation остават непроменени;
- monthly quota, media limits, business association и protected ranking остават непроменени;
- няма console/load-order regression.

## 15. Изрично разрешеното LOCKED изключение

Оригиналният Stage 1 в `PUBLIC_SITE_INFORMATION_ARCHITECTURE_APPROVED_SPEC.md` казва „без schema/RPC промени“. След read-only техническия одит беше доказано, че frontend-only taxonomy може да бъде заобиколена през директния Data API и съществуващите SECURITY DEFINER edit RPC.

С това решение собственикът одобрява **само следното тясно изключение**:
- pure taxonomy validator;
- legacy-safe CHECK върху съществуващите listing taxonomy полета;
- BEFORE INSERT / taxonomy-change trigger;
- taxonomy validation вътре в съществуващите `resubmit_own_listing` и `save_own_listing_edit_draft` RPC;
- без промяна на signatures, роли, grants, ownership, status, quota, media или moderation логика.

Всичко извън този списък остава LOCKED и не е разрешено от този документ.
