# Попитай.Лом — V6-C PRODUCTION PARITY REMEDIATION V8

Статус: **SOURCE/PROTOTYPE REMEDIATION COMPLETE — RENDERED REVIEW PENDING**  
Branch: `v6-product-foundation-draft`  
Дата: 01.09.2026

Production impact: **NONE**.

Този документ е по-новият status companion към `PUBLIC_PRODUCT_V6_C_PRODUCTION_PARITY_AUDIT.md`.

Първоначалният parity audit НЕ се пренаписва: той остава доказателство какво беше намерено. Тук се записва какво е коригирано след него.

При конфликт за текущия remediation status важи:

**LOCKED rules > approved production specs > V6 contracts > original parity audit findings > този remediation status > prototype details.**

---

## 1. РЕЗУЛТАТ В ЕДНО ИЗРЕЧЕНИЕ

P0/P1 пропуските от source-level audit вече имат V8 prototype representation или изрично запазена production capability; **остава rendered mobile/desktop + user review преди V6-C acceptance.**

Това НЕ означава, че V6-C е завършен и НЕ разрешава V6-D.

---

## 2. НОВА V8 PROTOTYPE АРХИТЕКТУРА

`v6-prototype/full-site.html` вече НЕ зарежда старите конкуриращи V3/V4/V5/V6 JavaScript renderer/lifecycle слоеве.

Активният JavaScript е:

1. `full-site-form-lifecycle-v8.js` — един prototype lifecycle owner за формите;
2. `full-site-runtime-v8.js` — един основен renderer/router за `#app`;
3. `full-site-parity-v8-controller.js` — bounded controller за вече изобразени V8 контроли, без втори app renderer.

Активен допълнителен CSS:
- `full-site-parity-v8.css`;
- старите CSS основи се използват само за styling, не като JS owner.

Static Home fallback остава в HTML, за да няма blank page при runtime failure.

Permanent production target остава `PROJECT_RULES_RENDER_OWNERSHIP.md`: prototype controller logic не се копира механично в production; D/E трябва да консолидира copy/control ownership в реалните module owners.

---

# 3. P0 REMEDIATION STATUS

## P0-1 Lifecycle docs/runtime mismatch — CLOSED AT SOURCE LEVEL

Преди:
- v7 failure/dirty layer съществуваше, но не беше зареден;
- v6 + евентуален v7 щяха да имат конкуриращи lifecycle owners.

Сега:
- V8 е единственият зареден lifecycle JS;
- няма v6/v7 lifecycle layering;
- QA failure toggle е в самия V8 lifecycle owner.

## P0-2 System-error state — REPRESENTED

V8 има QA-only `Тест на изпращане: успешно/грешка`.

При симулирана грешка:
- показва progress;
- показва видим червен contextual error;
- не губи въведените данни;
- re-enable-ва submit за retry;
- не показва false green success.

## P0-3 Search required states — REPRESENTED

V8 Search показва QA states:
- idle;
- too_short;
- loading;
- partial;
- success;
- empty;
- offline;
- error;
- cancelled.

Empty recovery представя:
- Разгледай категориите;
- Добави обява;
- Добави фирма;
- Задай въпрос.

Partial/offline/error имат retry/recovery.

## P0-4 Profile ecosystem — REPRESENTED

V8 Profile вече представя:
- pending listing;
- published listing;
- returned listing / needs correction + Admin note;
- pending firm;
- published firm with pending edit draft while public version remains;
- Admin-granted expanded access;
- returned firm + Admin note;
- returned Question;
- returned Answer;
- Info proposal pending;
- Info proposal needs correction;
- Info signal needs additional information;
- resubmit/correction actions;
- profile/security actions.

Това е prototype state coverage, не production data integration.

## P0-5 Health/Info richness — REPRESENTED

Health:
- all 7 groups;
- source/freshness/trust presentation;
- official references/actions;
- per-group Add/Correction;
- separate error signal;
- hospital admission block;
- emergency 24/7;
- first visit;
- hospitalization/referral context;
- key departments + all units affordance.

Other Info families:
- all 5 non-Health families + Health = exact 6 top-level families;
- own subnavigation examples;
- source/freshness;
- relevant action;
- correction route;
- task shortcuts: emergency, municipal document, no water, no electricity, ATM.

## P0-6 Listing/Firm media workflow — REPRESENTED

V8 prototype media now includes:
- real local file picker;
- JPG/PNG/WebP filtering;
- count;
- normal user max count;
- Admin no-backend-limit representation;
- drag/drop;
- local preview;
- first image marked as main;
- caption field;
- remove;
- per-file error;
- current published media on edit;
- mark current media for removal;
- cancel removal;
- replace through new uploader.

Production capability explicitly preserved:
- real `image-upload.js` client optimization/resizing/variants are not removed from the future implementation contract.

---

# 4. P1 REMEDIATION STATUS

## Listing duplicate warning — REPRESENTED

Create form has visible similarity/duplicate-check state before publication.

## Shops dynamic context — REPRESENTED

Six tabs:
- Хранителни;
- Строителни;
- Техника;
- Мебели;
- Дрехи;
- Дом.

Tab changes:
- heading;
- description;
- Add label/context;
- construction subfilters;
- tags/results context.

Changing category inside Shop form also changes classification suggestions.

## Rich Info family templates — REPRESENTED

Institutions/Transport/Education/Banks/Utilities have representative:
- subnav;
- trust/source/freshness;
- task-specific action;
- correction.

## Events discovery — REPRESENTED

- Предстоящи;
- Културни;
- Спортни;
- Обществени;
- search;
- Ask Question;
- Info Lom recovery;
- explicitly no public Add Event.

## Auth password parity — REPRESENTED

Login/Register/New Password have show/hide controls.
Register:
- name;
- email;
- password;
- confirm password;
- terms/privacy consent;
- actual relative links to production legal pages.

Forgot password success remains privacy-safe.

## Bounded prefill — REPRESENTED

Prototype context carries bounded:
- category;
- subcategory;
- type;
- edit;
- expanded-granted state only through explicit prototype owner state.

Edit remains distinct from create.

## Global Add accessibility — REPRESENTED

- focus enters sheet;
- Tab focus trap;
- Escape;
- backdrop close;
- focus return;
- `aria-expanded` sync;
- exact 3 global actions only;
- Health/Shops stay contextual;
- no Event Add.

## Firm contextual report — REPRESENTED

Firm detail includes contextual `Подай сигнал`.

## Q&A author/date/gallery — REPRESENTED

Question list/detail include:
- category;
- author/date;
- gallery review representation;
- Helpful;
- Share;
- Report;
- answers;
- answer form;
- duplicate/canonical create gate.

---

# 5. FORM LIFECYCLE V8

For applicable mutation forms:

**open context → hints/fields → validation → dirty → in-app leave → browser Back → browser unload → submit → system error/retry → success/completed.**

V8 represents:
- stable dirty snapshot by controls + Offer/Seek choice;
- route/cancel/role-switch dirty guard;
- browser Back dirty guard via one lifecycle owner;
- `beforeunload` fallback;
- first invalid focus;
- field-level errors;
- visible red `Провери формата — нищо не е изпратено` summary;
- entered data preserved on validation/system errors;
- submit lock/progress;
- QA system failure with retry;
- green success receipt replacing editable form;
- role-aware success:
  - Normal/Moderator = pending/review;
  - Admin = published;
- edit-specific success wording;
- Login/Forgot/New-password intentionally avoid aggressive dirty persistence.

---

# 6. PROTECTED SEMANTICS — STILL INTACT

No remediation change alters:
- roles;
- quotas;
- moderation;
- direct publication rules;
- RLS/schema;
- protected owners;
- Admin/Moderator boundary;
- Admin media canonical backend rule;
- Admin/Ivanov/Construction protected priority after relevance;
- Firm ↔ Listing ↔ Construction/Ivanov relations;
- Health/Info/Shops specialized ownership.

Known Moderator-own-business production mismatch remains separate and is not silently fixed here.

---

# 7. PUBLIC COPY CLEANUP

V8 parity controller removes known prototype-facing technical wording such as:
- owner;
- non-Admin;
- Admin-only;
- backend;
- recovery/fake Event Add;
- provider result;
- canonical/duplicate wording where user-facing Bulgarian is clearer.

This is still C prototype cleanup. Production should keep final copy in the real renderer rather than a post-render copy patch.

---

# 8. SOURCE QA STATUS

Confirmed at source/integration level:
- `full-site.html` loads only V8 JS runtime/lifecycle/controller;
- old V3/V4/V5/V6 JavaScript layers are not loaded;
- all 16 V6 categories are represented;
- exact six Info families are represented;
- all 7 Health groups are represented;
- Search required state list exists;
- no public Event Add route exists;
- protected Normal/Moderator/Admin wording/flows remain distinct;
- media and current-media edit states are represented;
- Profile correction/status ecosystem is represented.

Automated rendered-browser QA was attempted through Opera Browser Connector but failed because the browser connector is not currently connected.

Therefore this document **does not claim rendered visual verification**.

---

# 9. REMAINING C GATE

Source parity remediation is substantially complete.

Remaining before V6-C acceptance:

1. open the exact commit-specific preview;
2. rendered mobile review of representative screens;
3. rendered desktop review;
4. verify no interaction regression in the browser;
5. user full-site review/feedback;
6. only then systematic visual polish;
7. after visual/completeness acceptance, explicit V6-C acceptance;
8. only then V6-D.

Representative rendered review must include at minimum:
- Home;
- all categories / Marketplace;
- Listing normal + Admin;
- Firm normal + Admin/expanded;
- Profile;
- Health hospital + another Health group;
- one other Info family;
- Shops tabs + Shop form;
- Search success/empty/offline/error;
- Question detail + Ask/Answer;
- Registration;
- dirty-close warning;
- browser Back warning;
- normal pending success;
- Admin published success;
- simulated system error retaining data;
- global Add focus/Escape/backdrop/focus return.

---

## FINAL STATUS

**P0/P1 source representation: remediated in V8 prototype.**  
**Rendered/browser verification: pending.**  
**Visual polish: not started as final pass.**  
**V6-C acceptance: pending user/rendered review.**  
**V6-D: forbidden until C acceptance.**  
**Production: unchanged.**
