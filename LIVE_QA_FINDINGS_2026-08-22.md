# Попитай.Лом — LIVE QA FINDINGS — 22.08.2026

Каноничен активен QA списък. След всяка реално завършена задача статусът се записва веднага.

## Режим
- `VERIFY` — още не е доказан дефект.
- `OPEN` — потвърден дефект.
- `BLOCKED / LOCKED` — доказан, но засяга защитена логика.
- `FIXED - NEEDS RETEST` — source fix е качен, но няма достатъчен production retest.
- `CLOSED` — production retest е успешен.
- Когато наличният browser connector не може реално да кликне/пише/наблюдава first paint, остава `MANUAL / PENDING`, не PASS.

## Преди всяка редакция
1. `PROJECT_RULES_00_READ_FIRST.md`
2. `PROJECT_RULES_PROTECTED_CORE.md`
3. `PROJECT_RULES.md`
4. `PROJECT_RULES_RENDER_OWNERSHIP.md`
5. `PROJECT_PROGRESS.md`

LOCKED: Фирми/профили, Обяви, Майстори и ремонти, Admin core/critical actions, роли/права/ownership/approval/direct publish/лимити/statuses и protected repair search priority.

# P0 / P1 — активни системни проблеми

## QA-001 — Site-wide post-submit UX
Статус: `OPEN / PARTIALLY FIXED`
Глобално правило: success → form hidden/inactive + clear success + next action + duplicate prevention; error → form/data stay.
- Health, Transport, Education, Shops: source fix наличен; interaction retest остава.
- Questions/Answers: `question-answer-validation.js::armPostSubmitState()` е finite owner за success state; излишните CSS/HTML success слоеве в `nov-vapros.html` и `vapros.html` са напълно върнати (`7accd2f...`, `24427964...`).
- Generic Info forms (`info-lom.js`) бяха доказано слаби: success само disable-ва submit и оставя формата активна. На 23.08 е добавен `info-lom-form-ux-v1.js`, който при `.ok` спира finite observer-а, скрива формата и показва success + `Затвори`. Качен е на `banki.html` (`ae8a3047...`), `komunalni.html` (`c84ce029...`) и `institucii.html` (`d1f6adac...`). Interaction retest остава.

## QA-002 — Site-wide field validation UX
Статус: `OPEN / PARTIALLY FIXED`
Правило: exact field error, visible state, blur, live clear, final submit, preserve data, focus first invalid.
- Transport: blur/live-correction path PASS.
- Health: `health-form-validation-v1.js` source fix + cache version; interaction retest.
- Auth forms: QA-033.
- Generic Info forms (`info-lom.js`) бяха native-required-only. `info-lom-form-ux-v1.js` вече добавя delegated field-specific required errors, `aria-invalid`, `aria-describedby`, blur/live clear и focus first invalid на Banki + Komunalni + Institutions. Не са измисляни нови min-length правила. Interaction retest остава.

## QA-003 — `signal.html` e-mail validation
Статус: `VERIFY - SOURCE GOOD`
Exact adjacent messages, `aria-invalid`, focus first invalid са налични. Production interaction pending.

## QA-004 — `kontakti.html` valid submit failure
Статус: `FIXED - NEEDS RETEST`
Root cause: `authenticated` нямаше реален INSERT grant върху `contact_messages`, въпреки RLS insert policy. Grant е добавен и проверен; frontend validation/post-success е поправен. Backend rollback test на authenticated INSERT мина успешно и не остави тестов ред. Нужен един реален valid production submit.

## QA-005 — Listing validation summary difference
Статус: `VERIFY / LOCKED`
Specific errors работят; няма доказан функционален дефект. Не се уеднаквява механично с Firm form.

## QA-006 — Public Listings intermittent load failure
Статус: `VERIFY / INTERMITTENT / LOCKED`
По-рано load failure, после `TELEVIZOR` се зарежда. Source resilience gap: `supabase-listings.js::waitForClient()` polls 50 ms без timeout/fallback. Това не доказва първоначалния incident. Без промяна без approval.

## QA-007 — Visual validation colors/states
Статус: `VERIFY`
Изисква реален desktop/mobile visual QA.

## QA-008 — Contact QA text missing initial Q
Статус: `VERIFY`
Еднократно `A TEST 3...`; вероятно ръчно въвеждане, не bug без повторение.

## QA-009 — `vaprosi.html` stale image uploader
Статус: `CLOSED`
Current source не зарежда `image-upload.js`. Production retest на 23.08 през Opera PASS: публичната страница „Въпроси“ няма upload/image control и показва canonical Supabase empty state при 0 approved questions.

## QA-010 — `institucii.html` ARIA
Статус: `FIXED - NEEDS RETEST`
Menu button има `aria-expanded` + `aria-controls`; modal close е descriptive. Menu interaction pending.

## QA-011 — Home fake article cards + `без лутане`
Статус: `OPEN`
`statii.html` има само една реална статия, а home още съдържа още две несъществуващи cards и фразата `без лутане` в Categories intro. Предишен broad `index.html` rewrite е напълно върнат; current trusted blob остава `9eca2b4497cbb792e774b015c1cff928025b5243`. `index.html` съдържа embedded LOCKED Listings logic, затова следващият fix трябва да е exact byte-safe patch, не full reformat.

## QA-012 — Hidden Admin entry idea
Статус: `IDEA / LOCKED`
Obscurity, не security. Без implementation без approval.

## QA-013 — Profile general signal gap
Статус: `CLOSED / CLASSIFIED UX SCOPE`
General signal е в `reports`; profile section е уточнен като `Моите предложения и сигнали за Инфо Лом` и production е потвърден.

## QA-014 — Admin visible English `Highlighted`
Статус: `OPEN / LOCKED`
Нарушава Bulgarian UI rule.

## QA-015 — Admin `Въпроси 0` при pending question
Статус: `VERIFY / LOCKED`
Може да е metric за published questions. Read-only classification first.

## QA-016 — Direct `admin.html` opens in current session
Статус: `VERIFY / SECURITY / LOCKED`
Не е bug без guest/non-admin role test.

## QA-017 — Shops CTA grammar
Статус: `FIXED - NEEDS RETEST`
Source labels: хранителен магазин / строителен магазин / магазин за техника / мебелен магазин / магазин за дрехи / магазин за дома. Production construction CTA е потвърден; останалите tab interactions pending.

## QA-018 — Question detail double render owner
Статус: `CLOSED`
След explicit approval legacy `script.js::renderQuestionDetail()` е изключен, когато Supabase detail owner е активен. Production no-id retest откри два последователни gaps: първо Supabase owner връщаше без fallback при липсващо `id`, после се показваха едновременно hero not-found и not-found card. И двата source проблема са коригирани в `supabase-content.js`: missing/invalid id вече се обработва от същия Supabase owner, hero/detail/answer area се скриват и остава единствено canonical `#question-not-found`. Финалният source commit е `bb59acd...`; `vapros.html` е cache-bust-нат към `supabase-content.js?v=20260823-1912` с commit `e70d3d8d...`. Production retest на 23.08 през Opera PASS: и при невалиден `id`, и без `id` се показва само един canonical not-found state. Valid-id public positive-control остава недостъпен, защото Supabase има 0 approved questions; не се създава фалшив тестов въпрос само за QA.

## QA-019 — `Автомобили → Автомивки` връща Ivanov Remonti
Статус: `CLOSED`
След explicit approval protected priority logic беше коригирана минимално: `isConstructionQuery()` премахва само цели `автомивк...` / `avtomivk...` tokens преди проверката на съществуващите construction stems. Production retest на 23.08: `автомивки` връща само `Автомобили` и не показва Иванов Ремонти; positive control `мивка` продължава да връща `Иванов Ремонти Лом`. Защитеният repair priority е запазен извън carwash false-positive-а.

## QA-020 — Dead-end subcategories
Статус: `CLASSIFIED / CONTENT-COVERAGE / UX`
Routes са валидни search shortcuts; празното е content gap, не broken route. Не се измисля съдържание. UX решението е QA-022.

## QA-021 — Legacy public search labels
Статус: `CLOSED`
Production показва `Услуги` и `Събития`; internal compatibility values са запазени.

## QA-022 — Search no-results next action
Статус: `CLOSED`
No-result има `Разгледай категориите` + `Задай въпрос`; positive-control query не ги показва. Protected ranking не е променян.

## QA-023 — `firma.html` no-id duplicate not-found
Статус: `VERIFY / UX / LOCKED / RENDER OWNERSHIP`
Firm е LOCKED; read-only only.

## QA-024 — `obqva.html` weak no-id fallback
Статус: `VERIFY / UX / LOCKED`
Read-only only.

## QA-025 — Health add labels
Статус: `CLOSED`
Production: `Добави аптека`, `Добави стоматолог`, `Добави лаборатория`.

## QA-026 — Search exactness / transliteration / aliases / typo tolerance
Статус: `OPEN / PARTIALLY FIXED`
Info Lom source normalizes Cyrillic/Latin to common canonical form; `телк` и `telk` normalize еднакво. Production typing retest pending. General search още няма full aliases/translit/limited typo model; protected priority трябва да се пази.

## QA-027 — Dirty-form close protection
Статус: `VERIFY / PARTIALLY FIXED`
Health/Transport/Education/Shops source имат dirty guards; interaction pending.
Generic Info Banki + Komunalni + Institutions вече зареждат `info-lom-form-ux-v1.js`: capture guard intercepts X/backdrop/Escape only при unsent data, asks confirmation, confirmed close resets form/validation, empty form falls through to original close owner. Interaction retest остава.

## QA-028 — Data-driven Shops types/tags
Статус: `FIXED - NEEDS RETEST`
DB има `tags[]`/`groups[]`; public catalog already renders/searches tags and construction groups. `shops-catalog-v3.js` Add Shop вече показва category-specific existing tag choices + optional custom tag, dedupes, derives groups only from real approved tag→group relations и изпраща tags/groups. Production page-load PASS; modal interaction pending.

## QA-029 — Info Lom initial load flicker
Статус: `FIXED - NEEDS RETEST`
`info-bottom-signal` се скрива само докато wrapper има `.info-loading`; няма timeout/polling/observer fix. Actual first-paint observation pending.

## QA-030 — `info.html` auth header `Вход`
Статус: `CLOSED`
Supabase auth dependencies added; same-session production показва `Профил`.

## QA-031 — Info phrase `без лутане`
Статус: `CLOSED`
`info.html`: `Намери бързо точния контакт, услуга или място.` Production confirmed. Отделното home occurrence е QA-011.

## QA-032 — Info modal close accessible name
Статус: `CLOSED`
Production tree на Health/Transport/Education/Banks/Utilities/Institutions показва descriptive close control, не bare `×`.

## QA-033 — Auth form validation + unused uploader
Статус: `FIXED - NEEDS RETEST`
`auth-form-validation.js` покрива Login e-mail/password, Registration name/e-mail/password/confirm/consent, Forgot e-mail, New/Change password pair. Blur/live clear/ARIA/focus first invalid; не е измислена нова password-strength политика. `vhod.html`, `registracia.html`, `zabravena-parola.html`, `nova-parola.html` зареждат `auth-form-validation.js?v=20260823-0202`. На 23.08 и `profil.html` е синхронизиран към същата cache версия за смяната на парола, а неизползваният `image-upload.js` е махнат и от профила. Промяната не засяга Firm/Listings renderers или protected profile business logic. Production interaction pending.

# B. E2E / coverage checkpoints
- Всички 45 HTML страници са inventoried и поне structural/source inspected.
- `index.html`: PARTIAL — QA-006/011.
- `info.html`: QA-026 retest; QA-030/031 closed.
- `tarsene.html`: QA-019/021/022 closed; QA-026 open.
- `statii.html`: една реална статия → basis QA-011.
- `vaprosi.html`: QA-009 CLOSED след production retest през Opera; pending QA question правилно не е public.
- `vapros.html`: QA-018 CLOSED след production no-id/invalid-id retest през Opera; valid-id public positive-control няма при 0 approved questions.
- `profil.html`: auth validation cache synced; unused image uploader removed; protected Firm/Listings scripts untouched.
- Shops: 6 tabs load; grammar/source fixed; tags/groups uploaded; modal interaction pending.
- Masters: protected priority preserved except explicitly approved QA-019 false-positive exclusion for carwash terms; production positive control `мивка` PASS.
- QA TEST 4 Listing: pending real listing exists; DO NOT create another because monthly quota is consumed.
- General Signal: DB confirmed pending `reports` record.
- Contacts: backend grant + authenticated rollback test PASS; valid production submit pending.

# C. MANUAL / PENDING
- Info search `телк` vs `telk` typing.
- Health/Transport/Education/Shops dirty-close + post-success interactions.
- Banki/Komunalni/Institutions generic Info modal validation, dirty close and post-success after helper wiring.
- Shops classification modal multi-select/custom tag; avoid unnecessary moderation insert.
- Question/Answer successful-submit UI without duplicate QA data.
- QA-029 actual first paint.
- Contacts valid submit.
- Signal invalid e-mail interaction.
- Auth form validation/focus; avoid real registration/reset mail unless needed.
- Real mobile/device visual QA.
- Admin/guest/non-owner protected checks when appropriate.

# D. NEXT SAFE ORDER
1. Continue non-LOCKED source audit/fixes.
2. QA-011 only via exact patch method; never broad rewrite of `index.html`.
3. Continue remaining production/browser checks through Opera.

Нищо не става `CLOSED` без реален production retest.