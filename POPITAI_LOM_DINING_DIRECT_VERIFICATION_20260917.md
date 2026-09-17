# Попитай.Лом — bounded dining direct verification — 17.09.2026

Статус: **INTERIM RESEARCH EVIDENCE / WORK REVIEW PENDING / NO IMPORT / NO RUNTIME OR PRODUCTION PERMISSION**

Контрол: `POPITAI_LOM_WORK_REVIEW_QUEUE.md` → `INTERIM-T004`.

## 1. Цел и граница

Този pass продължава след Work 2 identity/dedupe пакета и търси direct/current evidence за силни dining кандидати.

Правила:

- official operator/site/managed business social е предпочитаният source за собствените публични полета;
- Maps/Oink/RestaurantGuru/Орли и други каталози са secondary/current-activity signals, не automatic official fields;
- conflicting hours/address/identity не се „решават“ по предположение;
- празно/Open е по-добро от предположение;
- няма automatic import, merge, production write, Supabase, schema или prototype selection.

Проверено на: **17.09.2026**.

## 2. Дюнер Lab — DIRECT SOURCE FOUND

### Direct evidence

Официален собствен сайт:
`https://www.doner-lab.com/`

Сайтът се представя като `Doner Lab • Лом` и публикува:

- адрес: `Лом, ул. „Дунавска“ 22`;
- работно време: `Понеделник–Петък 11:00–18:00`;
- `Събота и Неделя Затворено`;
- активно меню и локален business presentation.

### Conflict / secondary signal

Current Maps/business signal за `Дюнер Lab` също сочи `ул. Дунавска 22`, но показва различни часове: приблизително `09:30–15:30` в делнични дни.

### Verdict

- identity/address: **strong direct match**;
- current business existence/activity: **strong direct signal**;
- hours: **official-site value exists, но има current secondary conflict**;
- не се приема secondary Maps hours вместо official-site hours;
- преди exact inventory proposal е разумно да се провери дали официалният сайт е operationally maintained/current и дали hours conflict е просто stale Maps data.

Статус за следващия pass: **STRONG DIRECT CANDIDATE / HOURS CONFLICT TO NOTE**.

## 3. Гостилница „При Маца“ — CURRENT SECONDARY, NO DIRECT SOURCE FOUND

Намерени current secondary signals:

- RestaurantGuru, updated 21.03.2026;
- address signal: `ул. Дунавска 20`;
- phone signal: `+359 87 870 5679`;
- hours signal: `08:00–00:00`;
- recent review/activity signals през последната година;
- current Maps/business entity също сочи `ул. Дунавска 20` и същия телефон.

Не е намерен достатъчен first-party official/operator source в този bounded pass.

### Verdict

**KEEP RESEARCH-ONLY / DIRECT SOURCE STILL OPEN.**

Това не затваря по-стария address/alias conflict около `Дунавски вълни – При Маца`.

## 4. Food Station by NARODEN — STRONG 2026 SECONDARY, NO DIRECT SOURCE FOUND

Намерени signals:

- Oink current listing: `Пристанищна 26`, Лом;
- Орли Гастрономи 2026 също показва `Food Station by NARODEN` на `Пристанищна 26`;
- current directory/category presence през 2026.

Не е намерена надеждна direct first-party site/social страница в този bounded pass.

### Verdict

**KEEP RESEARCH-ONLY / DIRECT SOURCE + OPERATOR RELATION STILL OPEN.**

Relation с `Бързо Хранене и Моят Магазин „Народен“` остава отделен identity/operator въпрос; не се сливат.

## 5. Закусвалня КРИСИ — CURRENT SECONDARY, HISTORICAL PRIMARY-LIKE EVIDENCE ONLY

Намерено:

- current Oink 2026 presence/review signal;
- съдебен акт от 2017 доказва историческо съществуване на закусвалня `Криси`, но е твърде стар и не доказва текущ active status през 2026.

Не е намерен direct current business source.

### Verdict

**KEEP RESEARCH-ONLY / CURRENT DIRECT SOURCE OPEN.**

Историческият съдебен документ не се използва като current activity proof.

## 6. Дунавски вълни — DIRECT SOURCE NOT RESOLVED

Current restaurant directories продължават да показват dining entity `Дунавски вълни`, но general web search е силно замърсен от едноименния фестивал във Видин и други несвързани резултати.

В този bounded pass не е намерен надежден direct first-party source, който да затвори identity/current-fields въпроса.

### Verdict

**KEEP IDENTITY/DIRECT-SOURCE OPEN.**

Не се използват festival/Видин резултати като evidence за заведението в Лом.

## 7. ДЮНЕР KING Лом — NO DIRECT SOURCE FOUND IN THIS PASS

В този bounded search не беше намерен достатъчен direct first-party source за exact identity/address/phone/hours/current activity.

### Verdict

**KEEP RESEARCH-ONLY / DIRECT VERIFICATION OPEN.**

## 8. Machine-readable inventory decision

Този pass **не променя `content-inventory/records.v1.json`**.

Причини:

1. `Kastelo` и `Valentino` не са текущи machine-readable records и Work 2 изрично забранява automatic inventory import без direct field evidence/identity resolution.
2. `Каприз 2025` вече е `candidate_unverified` + `research_only` с `current_active_status` и relation с `При Финци` OPEN.
3. V1 schema няма отделен final operational-status enum `active/closed/moved/...`; такъв не се измисля в този pass.
4. За `Дюнер Lab` има силен direct source, но hours conflict трябва да бъде записан коректно при отделно exact record proposal, вместо да се прави прибързан import.

## 9. Следващ bounded пакет

Следващото безопасно действие е:

1. direct verification за още силни кандидати с 2026 signals: `Versus`, `Кафе-Сладкарница Фреш`, `Сакура`, `Caffe-Club Арена`, `Механа Боруна`;
2. отделен exact inventory proposal за `Дюнер Lab` само след source/currentness check и duplicate check;
3. `При Маца`, `Food Station`, `КРИСИ`, `Дунавски вълни`, `ДЮНЕР KING` остават research/local-check candidates, докато direct evidence липсва;
4. няма automatic public seed или production write.
