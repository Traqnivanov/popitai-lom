# Попитай.Лом — V6 GUARDRAILS / NON-NEGOTIABLE GATES

Статус: **DRAFT SUPPORTING SPEC / DESIGN ONLY / NO PRODUCTION CODE**  
Дата: 30.08.2026  
Branch: `v6-product-foundation-draft`

Този документ е задължителен companion към `PUBLIC_PRODUCT_V6_WORKING_MODEL.md`.

V6 няма право да бъде оценяван само по идея или визия. Всяко предложение трябва едновременно да мине през:

1. protected business rules;
2. Admin/Moderator логика;
3. render/data ownership;
4. moderation / traceability;
5. performance / mobile-first gate;
6. backward compatibility;
7. реална продуктова стойност.

При конфликт текущите LOCKED/канонични правила имат предимство. V6 не ги отменя мълчаливо.

---

## 1. ОСНОВЕН ПРИНЦИП

**Надграждаме системата, не строим втори паралелен сайт.**

Новите V6 слоеве — relationship, canonical questions, recommendations, Facebook Bridge, local ranking, freshness и SEO rendering — трябва да използват съществуващите owner-и и да добавят само липсващите връзки.

Не се допуска:

- дублиране на един и същ authoritative запис в няколко backend owner-а;
- нова таблица само защото presentation слой иска по-удобна структура;
- schema migration само заради нов public label;
- нова moderation логика, която заобикаля Admin/Moderator правилата;
- нов runtime framework само заради визуален ефект;
- тежък външен SDK, ако native/browser или малък локален код решава същото.

---

## 2. ADMIN ЛОГИКАТА Е ЧАСТ ОТ ПРОДУКТА, НЕ ПОСЛЕДВАЩА ДОБАВКА

Всяка нова V6 функция се проектира едновременно с нейния Admin/Moderator flow.

За нов тип relation/state още на design етап трябва да е ясно:

- кой го създава;
- кой го вижда преди approval;
- кой може да го одобри;
- кой може да го откаже;
- кой може да го върне за корекция;
- кой може да го скрие;
- кой може да го обедини/canonicalize;
- как се отменя грешно действие;
- как се вижда историята/provenance;
- кое е Admin-only;
- кое може Moderator;
- кое обикновеният потребител може само за собственото си съдържание.

### Задължително за новите V6 идеи

**Canonical / duplicate questions**
- similarity системата само предлага;
- destructive merge не се прави автоматично;
- canonical decision трябва да е traceable и reversible;
- при moderator участие той остава в рамките на разрешената оперативна модерация;
- окончателно изтриване остава Admin-only.

**Structured recommendations**
- recommendation relation не става публичен „брой препоръки“ без валиден approved state;
- трябва да е ясно кой е препоръчал, към какъв entity сочи relation-ът и от кой question/answer произлиза;
- отхвърлена/скрита препоръка не участва в public aggregate;
- няма frontend-only защита.

**Facebook import / bridge**
- собствен текст на потребителя може да бъде prefill-нат;
- чужд Facebook текст не се публикува автоматично като наше съдържание;
- source/provenance трябва да се пази, когато е приложимо;
- moderation status не се прескача само защото източникът е Facebook.

**Freshness / stale knowledge**
- re-confirmation, correction и stale flags трябва да се виждат и управляват през подходящ Admin/Moderator flow;
- verified Info/Health факт не се заменя от community мнение.

---

## 3. LOCKED ADMIN / MODERATOR ГРАНИЦА

V6 наследява текущата канонична граница:

- Admin държи системните и необратимите права;
- Moderator е оперативна moderation роля;
- Moderator не е „почти Admin“;
- permanent/hard delete е Admin-only;
- роли, schema, RLS, migrations, critical limits и системни настройки са Admin-only;
- Moderator не модерира собственото си protected съдържание;
- UI, JavaScript, RPC и RLS трябва да прилагат една и съща permission граница.

Следователно новите V6 moderation действия **трябва да се приобщят към съществуващия Admin панел и role model**, а не да създадат отделен мини-админ с различни правила.

### Admin panel integration target

Когато стигнем до implementation, Admin трябва да може от единна/съгласувана moderation среда да вижда минимум:

- pending questions/answers;
- duplicate/canonical suggestions;
- recommendation relations;
- Facebook-import provenance, когато има такъв flow;
- stale / re-confirmation сигнали;
- corrections/reports;
- точния target entity и owner;
- кой потребител/Moderator е направил действието;
- кога е направено;
- reversible state, когато бизнес логиката го допуска.

Не е задължително всичко да бъде един физически екран. Задължително е permission/state/history логиката да е една и съща и да няма скрити bypass-и.

---

## 4. PERFORMANCE Е HARD PRODUCT REQUIREMENT

V6 трябва да остане бърз на реален телефон и слаб/среден мобилен интернет.

Текущите правила остават задължителни:

- първо се зареждат само нужните текст, навигация и основно съдържание;
- below-fold изображенията са lazy;
- галериите не зареждат всички големи изображения;
- дългите списъци са paginated / „Покажи още“;
- страница зарежда само скриптовете и данните, които използва;
- scripts не блокират initial render;
- DB заявките вземат само необходимите полета/записи;
- статичните файлове са cache/version friendly;
- тежки embeds/външни прозорци се зареждат след действие на потребителя.

---

## 5. V6 PERFORMANCE STRATEGY

### Default = lightweight

По подразбиране:

- vanilla HTML/CSS/JS;
- локален category/synonym dictionary;
- малки SVG icons/sprite;
- server reads само при нужда;
- progressive results;
- indexed relation queries;
- ограничени result sets;
- debounce при search;
- no polling без реална причина;
- no all-owner mega-query при initial page load;
- no AI API call при всяко търсене;
- no Facebook SDK, ако URL/native share върши работата;
- social/SEO render service стои извън критичния frontend path.

### Relationship layer не трябва да стане тежък graph engine

„Knowledge graph“ е продуктов модел, не разрешение за тежка graph инфраструктура.

Първата реализация трябва да използва прост, индексиран relational model с ясни target types/IDs и ограничени заявки.

Не въвеждаме graph database, vector database, Elasticsearch или друг голям runtime само защото звучи подходящо, освен ако реални измервания по-късно докажат, че текущият модел не може да изпълни задачата.

### Duplicate detection

Първо се използват евтини слоеве:

1. normalization;
2. category/subcategory filter;
3. token/synonym matching;
4. limited candidate set;
5. lightweight similarity;
6. човешко потвърждение.

Тежък semantic/AI слой е възможен само ако евтиният модел доказано не стига и стойността оправдава цената/латентността.

---

## 6. „SUPER IDEA“ EXCEPTION GATE

Допуска се функция да добави осезаема тежест **само ако е изключително силна продуктова идея и няма достатъчно добър лек вариант**.

Преди такова решение трябва да са изпълнени всички условия:

1. **Уникална стойност** — функцията решава важен реален проблем, не е декоративен ефект.
2. **Няма лек еквивалент** — доказано е, че по-малък/local/native вариант не дава приемлив резултат.
3. **Не тежи на всички** — когато е възможно, кодът/данните се зареждат lazy, on-demand или само на конкретния flow.
4. **Измерено е** — имаме before/after размер, requests, latency и mobile impact.
5. **Има fallback** — основната функция на сайта работи и при отказ/бавност на допълнителния слой.
6. **Има rollback** — може да бъде изключена без разрушаване на owner data.
7. **Няма permission bypass** — по-тежката услуга не заобикаля moderation/RLS/Admin rules.
8. **Изрично approval** — ако тежестта е съществена, решението не влиза silently само защото прототипът изглежда добре.

Пример за потенциално допустима по-тежка идея:
- semantic duplicate detection, ако след реални данни lightweight matching не е достатъчен и дубликатите доказано вредят на „паметта на Лом“.

Пример за недопустима тежест:
- SPA/framework/icon package само за category cards, animations или меню.

---

## 7. FACEBOOK BRIDGE — PERFORMANCE ПРАВИЛО

Facebook трябва да ни дава reach, не runtime тежест.

Предпочитан ред:

1. native Web Share, когато се поддържа;
2. lightweight Facebook share URL / browser handoff;
3. copy prepared text/link;
4. dynamic Open Graph preview през lightweight server/edge endpoint;
5. външен SDK само ако по-късно има доказана незаменима функция.

Не зареждаме Facebook tracking/social SDK на всяка страница само заради един Share бутон.

---

## 8. SEO НЕ ТРЯБВА ДА НАТЕЖАВА НА UX

SEO layer трябва да работи основно server/static-side:

- canonical URLs;
- metadata;
- structured data;
- sitemap;
- internal linking;
- lightweight share render endpoint.

Не се прави тежък клиентски JS само за да генерира SEO metadata след load.

---

## 9. DATA MINIMIZATION

Нова V6 заявка се допуска само ако решава конкретен visible/product need.

За всяка заявка преди implementation се описва:

- owner/table;
- exact selected fields;
- filters;
- order;
- limit/pagination;
- index need;
- cache opportunity;
- failure state.

Cross-owner landing не трябва при първо зареждане да изтегля всички questions + answers + firms + listings + health + shops + restaurants.

Първо се показва static/navigation shell. Данните се вземат контекстуално и на части.

---

## 10. ACCEPTANCE GATE ЗА ВСЯКА V6 ФУНКЦИЯ

Нова идея влиза в implementation backlog само ако можем ясно да отговорим:

- Какъв проблем решава?
- Кой е authoritative owner?
- Дублира ли вече съществуваща логика?
- Как се вижда от потребителя?
- Как се модерира?
- Какво вижда Admin?
- Какво може/не може Moderator?
- Как се отменя грешка?
- Какви DB заявки добавя?
- Какъв JS/CSS/network weight добавя?
- Може ли да се lazy-load-не?
- Има ли по-лек вариант?
- Как се държи на mobile?
- Как се държи при offline/error?
- Как се пази backward compatibility?
- Как се мери успехът след launch?

Ако тези отговори липсват, идеята остава research/design, не код.

---

## 11. ТЕКУЩА V6 ПОЗИЦИЯ

V6 целта остава амбициозна, но архитектурата трябва да е **лек orchestration/relationship layer**, а не тежък нов монолит.

Съществуващата система остава основата.

Новите идеи се приемат само когато:

**подобряват значително намирането, паметта, доверието, local reach или conversion — и са реализирани с най-лекия надежден технически модел.**

До пълния V6 approval: **NO PRODUCTION CODE CHANGES.**