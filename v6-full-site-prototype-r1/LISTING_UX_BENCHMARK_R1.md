# Попитай.Лом — LISTING CREATION UX BENCHMARK R1

Статус: **RESEARCH / NO IMPLEMENTATION PERMISSION**  
Дата: 03.09.2026

## 1. Защо е нужен

Текущата production listing форма е бизнес-функционална, но излага много от вътрешната класификация директно на потребителя. Собственикът на проекта правилно отбеляза, че публикуване с много последователни решения/полета е твърде сложно за човек, който не познава структурата на сайта.

Този benchmark не променя protected Listings логиката. Целта е да намерим по-прост presentation flow върху същите:

- owners;
- quotas;
- listing types;
- categories/subcategories;
- moderation;
- edit behavior;
- media limits;
- Admin/Moderator differences.

## 2. Вътрешни правила на Попитай.Лом, които UX трябва да спазва

`PROJECT_RULES.md`:

- интерфейсът е на ясен естествен български;
- техническите стойности не се показват директно като потребителски текст;
- остава само текст, който помага на следващото действие;
- показват се точни грешки в точния момент;
- данните не се губят при грешка;
- structured fields се валидират според реалния тип;
- backend критичните ограничения не разчитат само на frontend.

Health checkpoint дава вече одобрен UX принцип, който е полезен и като общ design standard:

- кратки, водени форми;
- едно решение на екран;
- само нужните полета;
- контекстът се избира автоматично, когато вече е известен;
- вторичните полета остават вторични;
- нищо не се публикува автоматично при non-Admin flow.

Listings business semantics остават LOCKED по `PROJECT_RULES_PROTECTED_CORE.md`.

## 3. Външни модели

### Facebook Marketplace — content/photo first + assisted classification

Meta (2026) описва новия Marketplace listing flow като още по-автоматизиран: потребителят може да качи снимки, а Meta AI създава draft listing, попълва детайли и предлага цена според сходни местни обяви.

Принципът е важен дори без AI implementation в Попитай.Лом:

> Потребителят започва от нещото, което публикува, а не от вътрешната taxonomy структура.

### eBay — 5 видими content tasks

Официалният Seller Center представя създаването на listing чрез пет основни задачи:

1. заглавие;
2. снимки/видео;
3. специфични детайли;
4. описание;
5. цена.

Category-specific item specifics се показват според това какво се продава, вместо всички възможни полета да са еднакви за всички listings.

### OLX Bulgaria — условни полета по категория

Публичните правила на OLX показват важен принцип:

- price е общо изискване, но не е задължителен за `Работа` и `Услуги`;
- condition се иска само когато е приложимо и има такъв параметър;
- Property има специфично валутно/типово поведение;
- една подходяща category/subcategory е нужна, но не всички възможни attributes са универсални.

Това подкрепя `progressive disclosure`: първо разбираме какво е обявата, после показваме само релевантните полета.

### Bazar.bg — minimal publication mental model

Официалната help страница описва процеса много кратко:

`Добави обява → попълни задължителните полета → Публикувай`.

Условията изискват обявата да е в правилния раздел/подраздел и да има точен title/text, но тази taxonomy нужда не означава, че интерфейсът трябва да изглежда като database configuration screen.

## 4. Общи UX изводи

### 4.1 Не започвай с вътрешна taxonomy

Лош ментален модел:

`Раздел → група → подкатегория → тип → publisher → content`

По-добър ментален модел:

`Какво публикуваш? → основно съдържание → само приложимите уточнения → преглед/submit`

### 4.2 Контекстът от входа трябва да се използва

Ако човек натисне:

- `Майстори → Покриви → Добави обява`, системата вече знае Masters/Pокриви;
- `Работа → Добави`, системата вече знае Work;
- `Имоти → Добави`, системата вече знае Property;
- `Автомобили → Гуми → Добави`, системата вече знае automotive service context.

Не трябва да го караме веднага да избира същото отначало.

Prefill остава видим/editable, но не се превръща в първа пречка.

### 4.3 Category-specific fields, не universal form

- Goods: photos, title, condition if applicable, price, description.
- Services: title/what service, description, area, phone; price may be optional.
- Work: offered/seeking + title/role + description + location/contact; generic product price/free controls are noise.
- Property: offer/rent/seek type + property-specific essentials; generic `Дава` etc. do not belong.
- Vehicles: vehicle listing vs auto service should branch early and then show only relevant fields.

### 4.4 Owner/publisher is secondary

Normal default is personal listing. `Моя одобрена фирма` matters only for users who actually own an approved firm. It should not consume the first visible decision for everyone.

The system can:

- default to Personal;
- show `Публикувай като фирма` only when eligible;
- preserve all protected separate firm quotas/ownership behavior behind the choice.

### 4.5 Auth should not destroy drafting

A user can be asked to sign in when identity is actually needed, but already entered content should survive the auth transition. This matches existing Popitai form-preservation principles.

### 4.6 Validation should guide, not interrogate

Do not render multiple red required errors before the user has reached those fields. A future listing UX should validate progressively and focus the one blocking issue.

## 5. What NOT to copy

- Do not copy eBay’s full enterprise attribute depth; Popitai.Lom is a local lightweight marketplace.
- Do not add AI/category inference as a dependency before the core simple flow works.
- Do not remove protected category/type values simply because they are hidden from the first screen.
- Do not auto-publish non-Admin content.
- Do not merge Firms and Listings.
- Do not turn specialized Health or Shops submissions into generic listings.

## 6. Popitai-specific target mental model

The target should feel like **one short publish task**, not 10 configuration steps.

A reasonable direction for prototype exploration:

### Generic entry

1. `Какво публикуваш?` — one human-level choice only when context is not already known.
2. `Напиши какво предлагаш/търсиш` — title/content first.
3. System suggests/uses context; user only corrects it if needed.
4. Show only applicable details for that kind of listing.
5. Contact/media/optional owner choice.
6. Clear review/submit result.

This is a conceptual flow, **not yet an approved exact screen count**.

### Contextual entry

If context is already known from browse:

`Покриви → Добави` should open directly into a Roof listing draft, not ask `Услуги → Майстори → Покриви` again.

## 7. Acceptance criteria for the next listing-form prototype

Before it can be called acceptable:

- no user-facing DB/technical terms;
- no repeated selection of context already known;
- irrelevant fields remain hidden;
- Work does not look like a product-sale form;
- Property does not look like a generic service form;
- Services do not require a price just because goods do;
- personal/firm owner choice only appears when relevant;
- all protected stored values can still be derived deterministically;
- edit mode preserves existing value precedence;
- quotas/approval/direct-publish/roles unchanged;
- mobile-first interaction is understandable without project knowledge.

## 8. Decision before implementation

Do not implement a new production listing form from this document alone.

Next:

1. complete full-site content/form inventory;
2. make 2–3 low-risk prototype variants of the publication interaction if necessary;
3. compare them as user flows, not backend models;
4. owner reviews one whole flow;
5. only then map the approved presentation back to protected existing values.
