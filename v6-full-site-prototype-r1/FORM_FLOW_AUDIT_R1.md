# Попитай.Лом — FORM / FLOW AUDIT R1

Статус: **AUDIT BASELINE / NO PRODUCTION CHANGE / NO FORM REDESIGN PERMISSION**  
Дата: 03.09.2026  
Evidence branch: `v6-product-foundation-draft`  
Audit document branch: `v6-full-site-prototype-r1`

## 1. Цел

Този документ е застрахователният inventory преди следващата версия на full-site prototype-а.

Проверява се не просто дали HTML съдържа `<form>`, а за всяка потребителска задача:

1. къде се намира входът;
2. има ли реална форма или само search/filter;
3. кой е write owner-ът;
4. какъв е реалният резултат след submit;
5. какво казват LOCKED/APPROVED правилата;
6. дали формата е завършена, недовършена, дублирана, липсваща или правилно отсъстваща.

До приключване на този audit не се приема prototype mock форма за продуктова истина.

## 2. Authority

Проверено по:

1. `PROJECT_RULES_00_READ_FIRST.md`
2. `PROJECT_RULES_PROTECTED_CORE.md`
3. `PROJECT_RULES_ADMIN_MODERATOR.md`
4. `PROJECT_RULES.md`
5. `PROJECT_RULES_RENDER_OWNERSHIP.md`
6. `PUBLIC_MARKETPLACE_V3_APPROVED_SPEC.md`
7. `PUBLIC_SITE_INFORMATION_ARCHITECTURE_APPROVED_SPEC.md`
8. `PUBLIC_PRODUCT_V6_CANONICAL_RECOVERY.md` — draft review target, не implementation permission
9. `PUBLIC_PRODUCT_V6_IMPLEMENTATION_MATRIX.md` — draft review target, не implementation permission
10. `PROJECT_PROGRESS.md`
11. `LIVE_QA_FINDINGS_2026-08-22.md` като исторически regression/unfinished-task evidence.
12. Текущите specialized Info owner-и в `v6-product-foundation-draft`, включително `info-lom-utilities-v1.js`, когато са по-конкретното доказателство за реално съществуващ flow.

Критични invariants:

- Firms, Listings, Masters, Admin, роли, ownership, quotas, status/approval/direct-publish са LOCKED.
- Info Lom е verified-information owner.
- Health и Shops имат specialized write owners и не се заобикалят от generic form.
- Moderator own content остава normal-user flow и Moderator не може да се self-moderate.
- Всеки public root има един render owner.
- Visible UI трябва да е ясен естествен български; технически DB термини не се показват като UX.
- Form UX: точна грешка, preserve data, blur/live correction, final validation, focus first invalid, backend critical validation.

## 3. Статуси

- **KEEP 1:1** — логиката е правилна и трябва да се пренесе в content-complete prototype-а.
- **KEEP + RETEST** — source изглежда правилно, но стар QA още иска interaction/mobile retest.
- **UX REDESIGN / LOGIC LOCKED** — business/backend behavior остава; само interaction/presentation ще се проучва и преработва.
- **KNOWN FUTURE FEATURE** — правилата изрично казват, че още не е реализирано.
- **CANDIDATE LOST CAPABILITY** — по-стар approved/current owner има функция, но специализиран по-нов renderer не я показва; иска authority reconciliation преди връщане.
- **CORRECTLY NO FORM** — липсата е правилна.
- **RULE/DOCUMENT CONFLICT** — по-стари и по-нови документи се разминават; не се измисля form.
- **UX DEFECT** — owner/submit е правилен, но видимото действие казва нещо друго.
- **OVERLAP TO RECONCILE** — два public входа обслужват сходна задача; owner-ът може да е правилен, но public UX трябва да има ясна канонична роля.

## 4. Public write-flow matrix

| Flow | Current surface / owner | Audit status | Какво влиза в следващия prototype |
|---|---|---|---|
| Добави/редактирай обява | `dobavi-obqva.html` → Listings / `supabase-listings.js` | **UX REDESIGN / LOGIC LOCKED** | Пазим quotas, roles, ownership, edit, types, 6 images, Admin direct publish. Не приемаме текущата дълга form UX за финална. Преди нов UX — marketplace benchmark. |
| Добави/редактирай фирма | `dobavi-firma.html` + existing business owners | **KEEP + RETEST / LOCKED** | Реалните approved fields/media/approval semantics; без generic replacement. |
| Разширен фирмен редактор | `razshiren-profil.html` / `business-expanded-editor.js` | **KEEP 1:1 / LOCKED** за първия пакет | Intro, website, services, area, hours, visibility + base/media. |
| „Преди и след“ editor | няма завършен owner/editor | **KNOWN FUTURE FEATURE** | Не се преструваме, че е готов. Правилата го посочват като отделна следваща задача. |
| Истинска „Поискай оферта“ форма | няма завършена form owner логика | **KNOWN FUTURE FEATURE** | Не заместваме с fake submit/toast; отделна бъдеща задача. |
| Health specialist/practice proposal | `zdrave-i-lekari.html` + `health-submissions-v1.js` | **KEEP + RETEST** | Specialized Health/Info pending flow; не generic firm/listing. |
| Info Lom Health add/correction/report | `zdrave.html` + `info-lom-health-unified.js` | **KEEP + RETEST** | Approved Info visual logic + specialized pending owners. |
| Health public entry overlap | `zdrave.html` и `zdrave-i-lekari.html` | **OVERLAP TO RECONCILE** | И двата owners се пазят; prototype трябва ясно да показва коя задача къде живее, без две конкуриращи системи. |
| Предложи магазин | `magazini.html` + `shops-catalog-v3.js` | **KEEP + RETEST** | Specialized Shop pending flow, tags/groups, source; не generic firm fallback. |
| Задай въпрос | `nov-vapros.html` + Q&A owner | **KEEP + RETEST** | Title/category/description/consent + moderation semantics. |
| Снимки към въпрос | UI няма uploader | **KNOWN STAGED GAP** | Не се измисля като готово; old QA/source го третира като future stage. |
| Добави отговор | `vapros.html` + Q&A owner | **UX DEFECT** | Backend pending flow се пази; видимият `Публикувай отговор` трябва да отразява реалния review result. |
| Контакт | `kontakti.html` → `contact_messages` | **KEEP + RETEST** | Form + validation + success; стар QA иска един valid interaction retest. |
| Общ сигнал | `signal.html` → `reports` pending | **KEEP + RETEST + COPY CHECK** | Distinct from Info correction. Проверка на wording „администратор“, защото Moderator може да обработва сигнали по LOCKED role rules. |
| Login | `vhod.html` | **KEEP + RETEST** | Existing auth fields/validation. |
| Registration | `registracia.html` | **KEEP + RETEST** | Existing name/email/password/confirm/consent. |
| Forgot password | `zabravena-parola.html` | **KEEP + RETEST** | Existing reset request. |
| New/change password | `nova-parola.html`, `profil.html` | **KEEP + RETEST** | Existing pair validation/profile visibility rules. |
| Add Event | current public page has none | **RULE/DOCUMENT CONFLICT; CURRENT NO FORM** | Latest V6 matrix says `none / fake Add Event forbidden`; older IA mentions event moderation. Не се добавя form, докато authority не се синхронизира. |
| Add Article | няма public form | **CORRECTLY NO FORM** | Articles are editorial; no public Add. |
| Add Restaurant/Venue | contextual route to `dobavi-firma.html` | **KEEP 1:1** | Restaurants remain Firms owner. |
| Masters service offer/seek | contextual route to protected listing form | **KEEP LOGIC / LOCKED** | Не се променя Masters CTA/business flow като страничен ефект от listing UX redesign. |

## 5. Info Lom — add/correction matrix

Approved visual language of Info Lom stays. Audit is only about whether the correct action is present and connected to the correct owner.

| Info section | Expected/current action evidence | Current specialized page | Status |
|---|---|---|---|
| Health | add hospital/doctor/pharmacy/dentist/vet/vet pharmacy/lab + corrections/signals | Health specialized owners have proposal/correction/report flows | **KEEP / OVERLAP RECONCILE** |
| Transport — Bus/BDZ | no Add in generic config | specialized transport has verified content + signal | **CORRECTLY NO ADD FORM** |
| Transport — Taxi | generic `info-lom.js` config contains `Добави такси` | `info-lom-transport-v1.js` has no Add Taxi action and no submission owner | **CANDIDATE LOST CAPABILITY** |
| Education — Schools | generic config contains `Добави училище` | specialized `info-lom-education-v1.js` has no Add action/submission | **CANDIDATE LOST CAPABILITY** |
| Education — Kindergartens | generic config contains `Добави детска градина` | specialized Education owner has no Add action/submission | **CANDIDATE LOST CAPABILITY** |
| Education — community center/library/museum/courses | generic config has no Add button | specialized page has content + signal | **CORRECTLY NO ADD FORM** |
| Banks — ATM | generic config contains `Добави банкомат` | `info-lom-banks-v7.js` explicitly retains `Добави банкомат` → `InfoLom.openSubmission(...)` | **KEEP + RETEST** |
| Banks — offices | generic config has no Add | specialized page only signal | **CORRECTLY NO ADD FORM** |
| Institutions | generic owner has no Add configuration | current page has correction/signal infrastructure only | **CORRECTLY NO ADD FORM** |
| Utilities — courier point | current specialized owner renders `Добави куриерска точка` and calls `InfoLom.openSubmission('komunalni','kurieri','courier_point')` | `info-lom-utilities-v1.js` | **KEEP + RETEST** |
| Utilities — internet/TV provider | current specialized owner renders `Добави доставчик` and calls `InfoLom.openSubmission('komunalni','internet-tv','provider')` | `info-lom-utilities-v1.js` | **KEEP + RETEST** |
| Utilities — payment point | current specialized owner has dedicated `Добави каса / място за плащане` form; authenticated submit → `info_submissions`, `status=pending` | `info-lom-utilities-v1.js` | **KEEP + RETEST** |
| Utilities — insurance office | current specialized owner has dedicated `Добави застрахователен офис` form; authenticated submit → `info_submissions`, `status=pending` | `info-lom-utilities-v1.js` | **KEEP + RETEST** |
| Utilities — Water/Power | verified actions and signal; no public Add entry in specialized owner | `info-lom-utilities-v1.js` | **CORRECTLY NO ADD FORM** |

### Important

`Добави такси`, `Добави училище`, `Добави детска градина` are **not automatically approved for restoration by this audit**. They are evidence of capability present in the generic Info owner and absent after specialized single-owner rewrites. Before implementation we must resolve whether they remain intended public actions. If yes, restore them inside the specialized owner without reintroducing competing renderers.

За разлика от тях, четирите Utility действия по-горе са доказани в **текущия specialized owner** и следователно не са „нови измислени форми“. Prototype може да моделира тези потоци като безопасна симулация на pending `info_submissions`, без Supabase write.

## 6. Search/filter forms — not write flows

Do not count the following as missing/extra publication forms:

- Home search;
- `tarsene.html` search;
- category side-searches;
- listings/firms/shops filters;
- Q&A search;
- Info search/filter controls.

These are discovery UI and have no content write owner.

## 7. Confirmed defects / unfinished work relevant to full-site prototype

### A. Listing publication UX is too complex

The current protected form exposes Category/Subcategory/Type plus conditional Work/Property controls and other details. The backend/business logic is protected, but the public interaction requires separate product research before redesign. The R1 simplified mock is **not accepted as final**.

### B. Answer button overpromises

`vapros.html` says `Публикувай отговор`, while the actual non-Admin answer flow stores the answer for review. Visible action must match the real result.

### C. True Quote Request is not implemented

The rules explicitly say real `Поискай оферта` is a later task. Existing contact/Viber behavior must not be represented in the final prototype as though a complete quote-request owner already exists.

### D. Before/After editing is not implemented

Public expanded profile ordering includes `Преди и след`, but the first editor package does not include its editor. This is a known future feature, not an accidental omission.

### E. Potential Info capability loss after specialized renderer migration

Current evidence:

- lost from Transport specialized UI: `Добави такси`;
- lost from Education specialized UI: `Добави училище`;
- lost from Education specialized UI: `Добави детска градина`;
- Banks proves the intended safe pattern: specialized renderer may keep the approved visual while calling the existing `InfoLom.openSubmission` owner.

### F. Specialized Utilities add flows are real and current

The previous audit line that treated Utilities as having no Add forms was too broad. Current `info-lom-utilities-v1.js` proves four specialized proposal flows: courier point, internet/TV provider, payment point and insurance office. These must be preserved in a content-complete prototype and must not be silently lost in a future renderer rewrite.

### G. Content completeness is separate from form completeness

`statii.html` currently contains one real article. Historical QA records home cards for two additional nonexistent articles as an OPEN defect. A finished-site prototype must therefore use real approved article content and cannot invent fake article cards to make the section look full.

## 8. Existing QA that is still not a PASS

From `LIVE_QA_FINDINGS_2026-08-22.md` current source:

- site-wide post-submit UX: open/partially fixed;
- site-wide validation UX: open/partially fixed;
- Health/Transport/Education/Shops interaction retests remain;
- Contact valid submit remains retest;
- Signal interaction remains verify;
- Auth blur/live/focus interaction remains retest;
- Shops modal interaction remains retest;
- dirty-form close protection remains partly interaction-pending;
- listing validation differences are LOCKED/VERIFY, not a license to unify Firm/Listings forms.

The full-site prototype must model the target behavior, but production fixes are a separate later step and still obey LOCKED boundaries.

## 9. Prototype acceptance consequence

The next content-complete prototype must:

1. preserve already approved visual logic, especially Info Lom and approved category surfaces;
2. include every real approved content item available in the site/repo, not placeholder-only copies;
3. include each real form only where the owner/rules say it belongs;
4. show missing/known-future functions honestly rather than fake them;
5. not create an Event Add form unless the rule conflict is resolved;
6. not invent Health stored listing taxonomy before the separate LOCKED amendment;
7. not change protected quotas/roles/moderation/ownership while simplifying public UX;
8. keep a traceable checklist so every site surface can be compared against this audit before review.

## 10. Next audit steps before whole-site review

- keep the three unresolved candidate-lost Info actions (Taxi, School, Kindergarten) out of runtime until authority is reconciled;
- model the four confirmed Utility proposal flows in the isolated prototype;
- complete Info Lom content parity for Transport, Education, Banks, Utilities and Institutions;
- run prototype lifecycle QA for Guest/User/Moderator/Admin;
- compare the branch again against the safety baseline before review.
