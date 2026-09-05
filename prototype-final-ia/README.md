# Попитай.Лом — Independent re-audit remediation

Статус: **REMEDIATION COMMITTED / INDEPENDENT RE-AUDIT PENDING / OWNER ACCEPTANCE PENDING / НЕ Е PRODUCTION**

Branch: `prototype/content-complete-ia-20260904-stage2-safety`

Base на този remediation: `73c2738167cb670378673b9385e2a45925e50e9c`.

Работата е изолирана в `prototype-final-ia/`. Не са променяни production, Supabase, schema, migrations, RLS, RPC, роли, moderation, LOCKED договори или Master документи. Stage 3 не е започван.

## Корекции след independent audit

1. **Shops 6/6** — всички шест Shop категории (`Хранителни`, `Строителни`, `Техника`, `Мебели`, `Дрехи`, `Дом`) resolve-ват като `contentType=shop`, owner `Shops`, visual composition `profile`, semantic role `specialized` и Shop actions (телефон, корекция, Share).
2. **Авточасти** — остава legacy/backward-compatible mapping за четене, но е премахнато от активните стойности за нова Service обява. Не се прави масово пренаписване.
3. **Майстори и ремонти** — `#maistori` е отделен силен prototype entry. Той представя съществуващия protected модул с неговите осем подраздела и разделените Firms / Listings / Q&A owners, без да заменя production логиката.
4. **Home** — след „Полезни статии“ има „Въпроси от общността“, в съответствие с Current Master order.
5. **Social Card icon** — `icon` вече се използва само чрез контролиран registry към осемте локални Phosphor SVG assets. Record данни не могат да подават произволен HTML/SVG.
6. **Approved media brand** — approved-media композицията има отделена долна brand лента `Попитай.Лом`, която не покрива media областта.
7. **Info vs Q&A trust** — Q&A е `contentRole=community`; Info Lom е `contentRole=verified-information`. Могат да използват една обща визуална рамка, но semantic/trust статусът е различен.
8. **Service family Add** — деветте family CTA не подават family името като canonical leaf. Те водят до choose-first режим на същото family route; едва след избор на конкретна услуга се отваря Listing формата с bounded concrete prefill.
9. **QA report accuracy** — commit `73c2738…` няма attached GitHub commit statuses/check runs/workflow runs. Предишните проверки върху него трябва да се наричат **local/external QA**, не „GitHub Actions PASS“.

## Protected „Майстори и ремонти“

Prototype route: `#maistori`.

Faithful protected подраздели от съществуващия модул:

- Цялостни ремонти
- Бани и плочки
- ВиК
- Електро
- Покриви
- Боядисване
- Дограма
- Климатици

Prototype route-ът показва отделно и трите съществуващи слоя: местни фирми, активни предложения/търсения и последни въпроси. Това не променя техните production owners.

## Service Add contract

`Авточасти` остава в `serviceCanonicalMap` единствено за backward-compatible/legacy reading. `activeServiceCanonical` и новият Service select не го предлагат.

За family-level Add важи:

`service family → choose-first family route → конкретна service leaf → Listing form`.

Нито едно от деветте service семейства не се представя като persisted/canonical leaf.

Exact service leaf persistence/reconstruction след реален submit остава **OPEN / LOCKED**.

## Social Card semantic contract

Петте общи visual compositions се запазват:

- marketplace
- profile
- editorial
- event
- community

Отделно има semantic `contentRole`:

- Q&A → `community`
- Info Lom → `verified-information`
- Shops → `specialized`

Това позволява обща visual рамка без смесване на trust статуса.

## Regression check

Комитнатият `prototype-regression-audit.js` проверява:

- 6/6 Shop категории → `contentType=shop`, `owner=Shops`, `composition=profile`, `contentRole=specialized` и правилни actions;
- `Авточасти` не е в active/new Service select values, но legacy mapping-ът остава;
- `#maistori` съществува и е откриваем от Home/Services;
- Home има „Въпроси от общността“ след „Полезни статии“;
- тематичният Social Card съдържа реална SVG икона от controlled registry;
- approved media съдържа brand лента `Попитай.Лом`;
- Info и Q&A имат различни content roles;
- всички 9 service-family Add пътища са choose-first и не отварят обща Listing форма като family leaf.

## QA evidence naming

За `73c2738167cb670378673b9385e2a45925e50e9c` GitHub API връща:

- commit statuses: **0**
- commit workflow runs: **0**

Затова никаква проверка на този SHA не се описва като attached GitHub check.

Следващите проверки за този remediation се докладват като:

- **local QA**, когато са изпълнени в локален/container runtime;
- **external exact-SHA QA**, когато отделен runner checkout-ва SHA, но check-ът не е attached към самия commit.

Това не е independent acceptance.

## OPEN / LOCKED / pending

Остават OPEN и не са имплементирани тук:

- exact service leaf persistence/reconstruction;
- production Facebook/Open Graph crawlable delivery;
- реално генериране/съхраняване на social изображения;
- production taxonomy migration;
- по-широк public flow за **„здравна услуга“** — сегашните doctor/dentist/vet owners не са основание изискването да бъде обявено за окончателно отхвърлено;
- production-wide icon replacement;
- Stage 3.

Ново одобрено изискване, **без имплементация по предположение**:

`Любими — APPROVED REQUIREMENT / COVERAGE, STORAGE AND LOGIN CONTRACT NOT YET AUDITED`

То остава за Work handoff и отделен audit на coverage, storage и login contract.

Owner acceptance и independent re-audit остават pending.
