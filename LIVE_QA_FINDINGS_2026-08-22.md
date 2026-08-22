# Попитай.Лом — LIVE QA FINDINGS — 22.08.2026

КАНОНИЧЕН активен QA списък. Нищо открито не остава само в чата. След QA поправките се работи от този файл.

## РЕЖИМ
- `VERIFY` = още не е доказан дефект.
- `OPEN` = потвърден дефект.
- `BLOCKED / LOCKED` = потвърден, но е в защитена логика и не се променя без изрично одобрение.
- `FIXED - NEEDS RETEST` = source fix е направен, но няма достатъчен production retest.
- `CLOSED` = production retest е успешен.
- Ако connector не може реално да натисне/попълни/наблюдава first paint, остава `MANUAL / PENDING`, не PASS.

## ПРЕДИ ВСЯКА РЕДАКЦИЯ
1. `PROJECT_RULES_00_READ_FIRST.md`
2. `PROJECT_RULES_PROTECTED_CORE.md`
3. `PROJECT_RULES.md`
4. `PROJECT_RULES_RENDER_OWNERSHIP.md`
5. `PROJECT_PROGRESS.md`

LOCKED: Фирми/профили, Обяви, Майстори и ремонти, Admin core/critical actions, роли/права/ownership/approval/direct publish/лимити/statuses и protected repair search priority.

# A. АКТИВНИ НАХОДКИ

## QA-001 — Site-wide post-submit UX
Статус: `OPEN / PARTIALLY FIXED`
Глобално правило: след успешен submit формата изчезва/става inactive, има ясен success + следващо действие и accidental duplicate submit е невъзможен; при error формата остава и данните се пазят.
- Health add/correction/signal, Transport signal, Education signal и Shops add: актуалният source вече има locked success state; interaction retest остава.
- Questions/Answers: активният `question-answer-validation.js` има finite `armPostSubmitState()` — наблюдава само конкретното message поле, при `.is-success` се disconnect-ва, скрива формата и създава success block с next action. При `.is-error` също се disconnect-ва. Допълнителните CSS/HTML success слоеве, добавени по погрешка в `nov-vapros.html` и `vapros.html`, са напълно върнати с commits `7accd2f65f8cb07c425c2e9d2abe9925a7179e31` и `24427964ab1ab62fcec7d012e638c2a102e0f4b6`, за да няма втори owner/дублиране.
Questions/Answers чакат реален successful production submit retest преди да се считат CLOSED по този path.

## QA-002 — Site-wide validation UX
Статус: `OPEN / PARTIALLY FIXED`
Правило: specific error до exact field, видим error state, focus first invalid, preserve data, live clear after fix, semantic validation.
Transport signal blur/live-correction path е joint PASS.
Health dynamic forms бяха source-confirmed като native-required-only. На 23.08.2026 е добавен `health-form-validation-v1.js`: field-specific errors за add/correction/signal, blur/focusout validation, live clear, `aria-invalid`, `aria-describedby`, red field/error state, submit capture + focus first invalid, без измислени min-length правила. `zdrave.html` зарежда слоя с cache version `20260823-0136`. Commits `cc061dca6cac98ee215e79d2607093bf808cbf21` и `1de49ee64292d0b044cc82c6d992ee1c90b3413a`. Нужен interaction retest.
Auth forms вече са изведени в QA-033.

## QA-003 — `signal.html` e-mail validation
Статус: `VERIFY - SOURCE GOOD`
Source има exact messages `Въведи електронна поща.` / `Въведи валиден e-mail адрес.`, adjacent error, `aria-invalid` и focus first invalid. Нужен production interaction retest.

## QA-004 — `kontakti.html` valid submit fails
Статус: `FIXED - NEEDS RETEST`
Root cause: RLS policy имаше insert check, но `authenticated` нямаше реален `INSERT` grant върху `contact_messages`. Grant е добавен и проверен. Frontend validation/post-success също е обновен. Нужен един реален production submit.

## QA-005 — Listing validation summary difference
Статус: `VERIFY / LOCKED`
Specific errors работят; няма потвърден общ summary като Firm form. Само classification без mechanical equalization.

## QA-006 — Public Listings intermittent load failure
Статус: `VERIFY / INTERMITTENT / LOCKED`
По-рано `obyavi.html`/home listings имаха load failure, после `TELEVIZOR` се зареждаше. Exact runtime cause не е възпроизведен.
Source robustness gap: `supabase-listings.js::waitForClient()` polling на 50 ms няма timeout/error fallback; ако Supabase client не стане наличен, loader може да остане завинаги `Зареждане…`. Home listings има сходен wait pattern. Това е resilience риск, не доказателство за първоначалния incident. Без промяна без одобрение.

## QA-007 — Visual validation colors/states
Статус: `VERIFY`
Нужен desktop/mobile screenshot QA; accessibility tree не доказва цвят.

## QA-008 — Contact QA text missing initial Q
Статус: `VERIFY`
Еднократно `A TEST 3...` вместо `QA TEST 3...`; вероятно ръчно въвеждане, не bug без повторение.

## QA-009 — `vaprosi.html` stale image uploader
Статус: `FIXED - NEEDS RETEST`
Current source не зарежда `image-upload.js`; production dependency retest остава.

## QA-010 — `institucii.html` ARIA
Статус: `FIXED - NEEDS RETEST`
Source menu button има `aria-expanded=false` + `aria-controls=main-nav`; modal close има descriptive label. Production modal close tree вече е descriptive. Menu interaction остава.

## QA-011 — Home fake/missing article cards + remaining `без лутане`
Статус: `OPEN`
`statii.html` има само реалната статия `Как да избереш майстор и да избегнеш неприятни изненади` (`statia.html`), а home още показва два несъществуващи article cards. Home Categories intro още съдържа `без лутане`.
Предишен опит за cleanup произведе прекалено голям formatting diff в `index.html`; той беше напълно върнат. Recovery commit `fc4b59fa63242ef014f166caf5f055c374b95d05`; current `index.html` е оригиналният blob `9eca2b4497cbb792e774b015c1cff928025b5243`. Protected embedded Listings логиката не е оставена променена. Следващ fix трябва да е с безопасен exact patch метод.

## QA-012 — Hidden Admin entry idea
Статус: `IDEA / LOCKED`
Само UX obscurity, не security. Без implementation без одобрение.

## QA-013 — Profile general signal gap
Статус: `CLOSED / CLASSIFIED UX SCOPE`
General `signal.html` пише в `reports`; DB потвърди recent `site/pending` record. Profile Info section показва само `info_submissions`/`info_error_reports`. Heading е уточнен на `Моите предложения и сигнали за Инфо Лом` и production е потвърден.

## QA-014 — Admin visible English `Highlighted`
Статус: `OPEN / LOCKED`
Нарушава Bulgarian UI rule.

## QA-015 — Admin `Въпроси 0` при pending question
Статус: `VERIFY / LOCKED`
Възможно metric да означава published questions. Read-only classification first.

## QA-016 — Direct `admin.html` opens in current session
Статус: `VERIFY / SECURITY / LOCKED`
Не е bug без доказан guest/non-admin test.

## QA-017 — Shops CTA grammar
Статус: `FIXED - NEEDS RETEST`
Source map е: `хранителен магазин`, `строителен магазин`, `магазин за техника`, `мебелен магазин`, `магазин за дрехи`, `магазин за дома`. Production е потвърдено `＋ Добави строителен магазин`; останалите 5 чакат strict interaction retest.

## QA-018 — Question detail double owner / duplicated not-found
Статус: `OPEN / UX / RENDER OWNERSHIP`
Production no-id показва hero `Въпросът не е намерен` + card `Този въпрос не е достъпен`.
Root cause: legacy `script.js::renderQuestionDetail()` и `supabase-content.js` са два owners за question detail. Правилният fix е изключване на legacy detail renderer, когато Supabase owner е активен. `script.js` съдържа и LOCKED repair search priority, затова не се редактира на сляпо.

## QA-019 — `Автомобили → Автомивки` връща Ivanov Remonti
Статус: `BLOCKED / LOCKED SEARCH RELEVANCE`
Exact root cause: protected `CONSTRUCTION_SEARCH_STEMS` съдържа `мивк`/`mivk` за repair query `мивка`; `автомивки` също съдържа substring `мивк`, така `isConstructionQuery()` става true и `rankSearchRecords()` принудително prepends `IVANOV_REMONTI`. False positive е в LOCKED priority matching. Fix трябва да запази `мивка` като repair/VиК, но да изключи `автомивка`. Нужен отделен explicit approval.

## QA-020 — Dead-end subcategories
Статус: `CLASSIFIED / CONTENT-COVERAGE / UX`
Services и Events cards реално водят към `tarsene.html?q=...`; route-овете не са счупени. Празните резултати са content gaps и не се попълват с измислени записи. UX решението е QA-022.

## QA-021 — Legacy public search labels
Статус: `CLOSED`
Production показва `Услуги` и `Събития`, internal compatibility values са запазени.

## QA-022 — Search no-results next action
Статус: `CLOSED`
На 23.08.2026 в `tarsene.html` е добавен static next-action block, показван само когато direct `#search-results` child е `.empty-card`, чрез CSS `:has`; search renderer/ranking и LOCKED priority не са променяни. Actions: `Разгледай категориите` и `Задай въпрос`. Commit `12da4c6cdd6e875ad0c64e81de3c321fea796851`.
Production retest: forced no-result `zzzzqa-no-result` показва двата next actions. Positive-control query `здраве` показва резултат `Здраве и лекари` и empty-state action block не се показва. CLOSED.

## QA-023 — `firma.html` no-id duplicate not-found
Статус: `VERIFY / UX / LOCKED / RENDER OWNERSHIP`
Firm е LOCKED; read-only classification.

## QA-024 — `obqva.html` no-id weak fallback
Статус: `VERIFY / UX / LOCKED`
Само `Обявата не е намерена.` без силен main error/next action; classify first.

## QA-025 — Health add labels
Статус: `CLOSED`
Production: `Добави аптека`, `Добави стоматолог`, `Добави лаборатория`.

## QA-026 — Search exactness / transliteration / aliases / typo tolerance
Статус: `OPEN / PARTIALLY FIXED`
Info Lom partial fix: `info-lom-home-search.js` вече normalizes Bulgarian Cyrillic и Latin query/record text към един canonical transliterated form. `телк` и `telk` вече source-level normalize еднакво; `info.html` cache-bust `20260823-0118`. Commits `c699ce20d6f71acb9b252907d74863b321f42e7f`, `e11015bdc04f6116944d6355bf0442910a9aec34`. Нужен production typing retest.
Shops/general search още нямат пълния approved synonyms/transliteration/limited typo model. Global search промени трябва да пазят LOCKED repair priority; QA-019 показва current stem risk.

## QA-027 — Dirty-form close protection
Статус: `VERIFY / SITE-WIDE UX RULE`
Health/Transport/Education/Shops source вече имат dirty guards: empty closes directly; unsent data asks confirmation; confirmed close resets values/validation; success closes separately. Interaction retest pending. LOCKED flows only read-only unless approved.

## QA-028 — Data-driven types/tags architecture
Статус: `FIXED - NEEDS RETEST`
Confirmed DB/source basis:
- `public.shops` има `tags text[]` и `groups text[]`.
- current records: clothes 5 (4 with tags), construction 8 (8 tags, 8 groups), food 12 (12 tags), furniture 3 (3 tags), home 6 (6 tags), tech 4 (4 tags).
- construction groups: `materials` 7, `bath` 3, `metal` 3, `paint` 3.
- public catalog already renders tags, construction subfilter reads groups, and shop search includes tags.
На 23.08.2026 `shops-catalog-v3.js` е обновен така, че Add Shop вече използва data-driven classification без измислен универсален списък: за избраната категория показва multi-select checkbox-и от реално съществуващите одобрени tags за същата категория, има optional custom tag с whitespace normalization/deduplication, а `groups` се извеждат само от вече съществуващите tag→group връзки в одобрените записи. Payload вече изпраща `tags` и `groups`; dirty-state следи и тези полета. Commit `b1d9f079c3e902bce0ed7478bd2e1a1412653f1a`; `magazini.html` cache-bust commit `f49d05eac0f3e035309904c08a6301f21ed6b224` (`shops-catalog-v3.js?v=20260823-0155`).
Production page load след deploy е PASS — каталогът, auth state и CTA се зареждат без runtime-fatal failure. Connector-ът в текущата сесия няма click/fill action, затова modal/classification interaction и submit payload остават за retest. Protected modules не са променяни.

## QA-029 — Info Lom load flicker / old static signal first
Статус: `FIXED - NEEDS RETEST`
Source fix in `info-lom-pages.css`: immediate `.info-bottom-signal` is hidden only while wrapper contains `.info-loading`; appears after final render. No timer/polling/observer. Render-owner audit did not show current double public root on Health/Transport/Education/Banks/Utilities/Institutions. Actual first-paint retest still requires real observation.

## QA-030 — `info.html` auth header stays `Вход`
Статус: `CLOSED`
Supabase SDK/config dependencies added before `script.js`; production same-session retest showed `Профил`.

## QA-031 — `info.html` phrase `без лутане`
Статус: `CLOSED`
Info intro now `Намери бързо точния контакт, услуга или място.` Production confirmed. Separate home occurrence remains QA-011 cleanup.

## QA-032 — Info modal close accessible name
Статус: `CLOSED`
Production accessibility-tree retest on Health, Transport, Education, Banks, Utilities, Institutions: close control is descriptive (`Затвори съобщението`, aria present), not bare `×`.

## QA-033 — Auth forms field-specific validation + unnecessary uploader
Статус: `FIXED - NEEDS RETEST`
Source audit found Login and Forgot Password relied on native browser required/type validation only; Registration had password-pair validation but name/e-mail/consent were not covered by the same field-specific UX. `vhod.html`, `registracia.html`, `zabravena-parola.html` и `nova-parola.html` also loaded `image-upload.js` although none of these pages has an upload UI.
На 23.08.2026 `auth-form-validation.js` was extended without changing auth backend flow: exact adjacent errors for login e-mail/password, registration name/e-mail/password/confirm/consent, forgot-password e-mail and existing new-password/change-password pair rules; blur/touched behavior, live clear after correction, `aria-invalid`, `aria-describedby`, focus first invalid. No new password-strength business rule was invented; login password remains required-only, while create/reset password keeps the existing 8-character rule. Commit `9bf0ee0e31005ae24eb9abc5da8f95d4c721fa8f`.
`vhod.html`, `zabravena-parola.html`, `registracia.html`, `nova-parola.html` now load cache-busted `auth-form-validation.js?v=20260823-0202`; unused `image-upload.js` was removed from all four. Commits: `98176b50d3bd5ac97da30869d7f2973cd3d264e5`, `11d57c69b12449e3d0dadcbc22c6086b88cfdf7a`, `beb35ca7e80db99eb7191f109a329b685fdeefe4`, `c0f099c95f7392ba6908ea6ed3aaedf432144cee`. Production interaction retest remains; no real sign-up/password-reset actions should be triggered unnecessarily.

# B. KEY COVERAGE / E2E

## Public/category coverage
- All 45 HTML pages inventoried and at least structurally inspected.
- `index.html`: PARTIAL PASS; QA-006/011 remain.
- `info.html`: 6 sections + quick links; QA-026 retest remains; QA-030/031 closed.
- `tarsene.html`: QA-021/022 closed; QA-019 locked; QA-020 classified; QA-026 remain.
- `statii.html`: one real article only → source basis for QA-011.
- `vaprosi.html`: pending QA question hidden publicly; QA-009 retest remains.
- Services/Event subcategory routes classified as valid search shortcuts with current content gaps.
- Masters was read-only checked; protected Ivanov priority remains visible.
- Shops six tabs load; source grammar fixed; tags/groups implementation uploaded; modal interaction retest remains.

## Info Lom
- Health: labels CLOSED, modal a11y CLOSED; validation source fixed; post-submit/dirty close interaction retest pending.
- Transport: validation blur/live correction PASS; post-submit/dirty close retest pending; modal a11y CLOSED.
- Education: post-submit/dirty close retest pending; modal a11y CLOSED.
- Institutions/Banks/Utilities: content/render roots inspected; modal a11y CLOSED; first-paint QA-029 pending.

## QA TEST 1 — Question
`QA TEST 1 — въпрос за изтриване`, category Автомобили.
Original submit created pending record; profile/Admin queue confirmed; public correctly hidden before approval. Active source-level post-success owner is `question-answer-validation.js`; redundant CSS/HTML layers were reverted. No new duplicate test record should be created just to retest. Remaining protected moderation E2E requires user/admin action when appropriate.

## QA TEST 4 — Listing — LOCKED
Real listing submitted and pending; owner detail visible. Monthly personal quota already consumed; DO NOT create another QA listing. Delete/reject does not restore quota.

## General Signal
DB confirmed `reports.target_type=site`, status pending. QA-003 interaction remains.

## Contacts
Backend grant fix applied; real valid production retest remains QA-004.

# C. MANUAL / PENDING
- Info search typing retest `телк` vs `telk`.
- Health/Transport/Education/Shops dirty-close and post-success interaction retests.
- Shops classification modal: open Add Shop, switch categories, verify category-specific existing tag choices, multi-select + custom tag, dirty-close behavior; do not create unnecessary moderation data just for UI verification.
- Question/Answer successful submit UI retest without creating unnecessary duplicate records.
- QA-029 actual first paint.
- Contacts valid submit.
- Signal missing/invalid email interaction.
- Auth Login/Register/Forgot/New Password field-level validation and focus behavior; avoid real registration/reset mail unless explicitly needed.
- Shops remaining CTA tab-by-tab strict retest.
- Admin moderation and guest/non-owner protected access checks.
- Real mobile/device viewport and visual error colors/focus.

# D. NEXT SAFE ORDER
1. Continue source-only form/search/UX checks that do not touch LOCKED logic.
2. QA-011 home cleanup only with exact safe edit method; do not repeat broad `index.html` rewrite and do not alter embedded protected Listings behavior.
3. QA-018 may require touching shared `script.js`; do not change it blindly because it carries LOCKED search logic. Prefer an exact owner-safe solution that does not alter protected search behavior, otherwise classify/ask approval before editing shared protected file.
4. QA-019 is blocked until explicit approval for exact `мивк`/`автомивки` protected matching fix.
5. QA-028 implementation is uploaded; remaining work is production modal interaction retest only.
6. QA-033 implementation is uploaded; remaining work is production auth-form interaction retest only.

Нищо не става `CLOSED` без реален production retest.
