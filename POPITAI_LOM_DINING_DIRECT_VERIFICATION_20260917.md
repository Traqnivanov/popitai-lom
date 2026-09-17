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

## 8. Machine-readable inventory decision after Batch A

Batch A **не променя `content-inventory/records.v1.json`**.

Причини:

1. `Kastelo` и `Valentino` не са текущи machine-readable records и Work 2 изрично забранява automatic inventory import без direct field evidence/identity resolution.
2. `Каприз 2025` вече е `candidate_unverified` + `research_only` с `current_active_status` и relation с `При Финци` OPEN.
3. V1 schema няма отделен final operational-status enum `active/closed/moved/...`; такъв не се измисля в този pass.
4. За `Дюнер Lab` има силен direct source, но hours conflict трябва да бъде записан коректно при отделно exact record proposal, вместо да се прави прибързан import.

## 9. Batch B — Versus / Фреш / Сакура / Арена / Боруна

### 9.1 Versus Lom — SECONDARY CURRENT SIGNAL + PHONE CONFLICT

Намерени secondary/current signals:

- RestaurantGuru показва `Versus Lom` на `ул. Пристанищна 11`;
- 2026 update/activity presence;
- публикувани часове `09:00–17:00`;
- historical Facebook-rating/review data.

Проблем:

- различни езикови/индексни версии на RestaurantGuru показват **различни телефони** за същия обект (`+359 88 202 2407` срещу `+359 88 819 6886`).
- видимите Facebook reviews в индекса са на 8–9 години и не са direct current business evidence.

### Verdict

**CONFLICT / RESEARCH-ONLY / DIRECT SOURCE REQUIRED.**

Не се избира телефон по каталог и не се приема current activity само защото directory page е updated през 2026.

### 9.2 Кафе-Сладкарница „Фреш“ — 2026 SECONDARY ONLY

Намерено:

- Орли 2026 profile;
- address signal: `ул. Дунавска 33`;
- описан cafe/pastry/fresh-bar context.

Не е намерен direct first-party source в този bounded pass.

### Verdict

**RESEARCH-ONLY / DIRECT SOURCE OPEN.**

### 9.3 Сакура — 2026 DIRECTORY SIGNAL ONLY

Орли Гастрономи 2026 показва `Сакура - кафе, сандвичи и салати` като local dining candidate.

Не е намерен надежден direct first-party source за exact address/phone/hours/current activity в този pass. Search results с едноименно `Sakura` извън Лом са изключени като contamination.

### Verdict

**RESEARCH-ONLY / IDENTITY + DIRECT SOURCE OPEN.**

### 9.4 Caffe-Club „Арена“ — 2026 DIRECTORY SIGNAL ONLY

Орли Гастрономи 2026 показва `Caffe - Club "Арена"` като local candidate.

Не е намерен direct first-party source за exact address/phone/hours/current activity в този pass.

### Verdict

**RESEARCH-ONLY / DIRECT SOURCE OPEN.**

### 9.5 Механа Боруна — CURRENT GOOGLE SIGNAL, NO DIRECT SOURCE

Намерено:

- Google/Travel local-nearby evidence показва `Механа Боруна` като ресторант в Лом с current listing/review signal.

Search е силно замърсен от резултати за квартал `Боруна`, свлачища, инфраструктура и други несвързани entities. Не е намерен direct first-party business source.

### Verdict

**RESEARCH-ONLY / EXACT IDENTITY + DIRECT SOURCE OPEN.**

## 10. Machine-readable inventory decision after Batch B

Batch B също **не променя `content-inventory/records.v1.json`**.

Причина: нито един от петте кандидата не получи достатъчно clean first-party evidence за exact persistent record proposal; при `Versus` има и конкретен phone conflict.

## 11. Batch C — GO GRILL / Paloma / ВИП СИМЕРС / Рибката / Чайка beach

### 11.1 GO GRILL — DIRECT BRAND/OPERATOR, LOCAL BRANCH STILL SECONDARY

Намерено direct evidence от официалния оператор:

- `gogrill.bg` е активният официален сайт на GO GRILL;
- сайтът доказва самата марка/оператор, националната мрежа и наличието на собствен раздел `Заведения`;
- официалният сайт е текущ и съдържа 2026 activity content.

За конкретния обект в Лом current Maps/Oink signal сочи:

- `Пристанищен Комплекс, ул. Георги Димитров 41а`;
- телефон `089 558 2093`;
- local business listing като `GO GRILL`.

Границата е важна: dynamic official venue locator не даде статично извличаемо `Лом`/точен адрес в този pass, затова local branch address/phone не се повишават автоматично до `official` само защото са свързани с официалния brand site.

### Verdict

**DIRECT BRAND CONFIRMED / LOCAL BRANCH RESEARCH-ONLY UNTIL OPERATOR-LEVEL LOCATION PROOF.**

Не се прави automatic inventory record от secondary branch fields.

### 11.2 Paloma — MAPS-ONLY LOCAL SIGNAL

Current Maps/business entity показва `Paloma` като coffee shop на `ул. Добруджа 23`, Лом.

Не беше намерен надежден direct first-party site/social/operator source за този exact Lom object в bounded pass-а.

### Verdict

**RESEARCH-ONLY / DIRECT SOURCE OPEN.**

Нулевият/слаб review footprint не се използва нито като доказателство за active, нито за closed status.

### 11.3 „ВИП СИМЕРС ГРУП“ — DINING CATEGORY CONTAMINATION RISK

Намерено direct evidence от `vipsimersgroup.bg`:

- `ВИП-СИМЕРС ГРУП ООД` в Лом се представя като производител на захарни изделия и хлебозавод;
- официалният адрес е `ул. Белоградчишко шосе 21`;
- официалният сайт описва производство/дистрибуция на хлебни и захарни изделия, а не конкретно заведение/кафе за посетители.

### Verdict

**DO NOT TREAT THE COMPANY ITSELF AS A DINING VENUE FROM CURRENT EVIDENCE.**

Текущият dining/cafe сигнал се маркира като **category contamination / identity unresolved**. Ако съществува отделен техен retail/cafe object, той трябва да бъде доказан като отделна физическа business identity, а не да се създава dining record за юридическото/производственото дружество по каталог.

### 11.4 Бистро „Рибката“ — STRONG 2026 SECONDARY ACTIVITY + TEMPORARY-CLOSED CONFLICT

Current 2026 secondary evidence:

- Oink показва `Бистро "Рибката"` в Лом, `ул. Радецки 14`, с голям current Google review footprint;
- Орли Гастрономи има 2026 profile/scanning signal за същия адрес;
- RestaurantGuru обаче показва `Temporarily closed` при 2026 update.

Не е намерен first-party source, който да реши конфликта.

### Verdict

**SUSPICIOUS / OWNER LOCAL CHECK REQUIRED / NO ACTIVE OR CLOSED FINAL VERDICT.**

Не се приема нито `active`, нито `closed` от secondary sources. Обектът влиза в локалния OWNER-check list с exact въпрос: `работи ли реално в момента на Радецки 14 и под същото име?`.

### 11.5 Чайка beach — RECENT 2026 ACTIVITY SIGNAL + CONFLICTING CLOSED/OPEN DIRECTORY STATES

Намерени secondary signals:

- Oink има current profile и конкретен потребителски отзив от **юни 2026**, описващ реално посещение и обслужване;
- current directory/Google-derived pages продължават да показват restaurant activity/review footprint;
- RestaurantGuru има по-стар 2026 `Temporarily closed` signal, докато по-нова индексна версия показва текущо отворено състояние/актуализиран profile.

Не е намерен clean first-party business source в този pass.

### Verdict

**STRONG RECENT SECONDARY ACTIVITY, BUT STATUS CONFLICT REMAINS / OWNER LOCAL CHECK.**

Не се финализира `active` само по каталожни/review signals, но юни 2026 visit signal е достатъчен старият `temporary closed` marker да не се приема като current truth без местна проверка.

## 12. Machine-readable inventory decision after Batch C

Batch C **не променя `content-inventory/records.v1.json`**.

Причини:

1. GO GRILL има direct brand/operator proof, но конкретният Lom branch още няма извлечено operator-level location proof;
2. Paloma остава Maps-only;
3. `ВИП СИМЕРС ГРУП` има direct доказателство за производствена identity, което по-скоро разкрива dining-category contamination, а не dining record;
4. `Рибката` и `Чайка beach` имат конфликтни current-status signals и трябва да минат през OWNER local check;
5. никой secondary conflict не се превръща механично в persistent active/closed state.

## 13. Batch D — Завалиите / При близнаците / Алф / Регал / Boutique Bar

### 13.1 Механа Завалиите — CURRENT MAPS/OINK ONLY

Current local business evidence показва `Механа Завалиите` на `ул. Дунавска 25`, Лом, с телефонен и hours signal.

Не е намерен clean first-party site/social/operator source за exact business identity и current fields.

### Verdict

**RESEARCH-ONLY / DIRECT SOURCE OPEN.**

Maps/Oink presence не се повишава до official fields без first-party proof.

### 13.2 Кафе „При близнаците“ — CAFE + SHOP OVERLAP / IDENTITY OPEN

Oink/Орли 2026 показват `Кафе "При близнаците"` като кафене в Лом, а описанието изрично споменава и магазин.

Current Maps/business result за близка identity `Близнаците в Калето` е категоризиран като store. Това може да е един и същ mixed-use object, свързан object или отделна naming variation.

Не е намерен direct first-party source, който да реши relation-а.

### Verdict

**IDENTITY/CATEGORY OVERLAP — RESEARCH-ONLY / OWNER LOCAL CHECK USEFUL.**

Не се създават два записа и не се избира категория по предположение.

### 13.3 Сладкарска къща „Алф“ — CURRENT BUSINESS + LEGAL IDENTITY, RETAIL OBJECT STILL NOT FIRST-PARTY VERIFIED

Намерено:

- current Oink/Maps signal за `Сладкарска къща "Алф"` в Лом;
- фирмена/registry-derived identity `СЛАДКАРСКА КЪЩА АЛФ` с ЕИК `203692100`, актуализирана през 2026 в business-registry mirrors;
- исторически локален institution/community signal от МИГ-Лом за участие на `Сладкарска къща Алф` през 2023;
- business activity на legal entity включва производство/търговия със сладкарски изделия и експлоатация на заведения.

Граница:

- legal-company existence/activity не доказва автоматично exact current retail address, phone, hours или че конкретният customer-facing object е действащ днес;
- не е намерен current managed first-party site/social page за exact retail object.

### Verdict

**STRONG IDENTITY SUPPORT / RETAIL OBJECT RESEARCH-ONLY UNTIL DIRECT OR OWNER LOCAL VERIFICATION.**

### 13.4 Регал — CURRENT SECONDARY ONLY

Oink/Cybo-type current signals показват `Регал` като бар в Лом с substantial review footprint и phone/address signals.

Не е намерен direct first-party site/social/operator source в bounded pass-а.

### Verdict

**RESEARCH-ONLY / DIRECT SOURCE OPEN.**

Не се приема current status или exact fields само по directory presence.

### 13.5 Boutique Bar — CURRENT MAPS/OINK + SOCIAL LINK SIGNAL, NO VERIFIED FIRST-PARTY PAGE

Current Maps/Oink показват `Boutique Bar` в Лом с телефон и hours signal; Oink индексира и Facebook social link.

Search не даде надеждно извлечена managed first-party страница за exact Lom object; едноименни чужди `Boutique Bar` резултати са изключени като contamination.

### Verdict

**RESEARCH-ONLY / DIRECT SOCIAL PAGE STILL NEEDS VERIFICATION.**

Наличието на social-link label в secondary directory не е достатъчно само по себе си да се приеме страницата или полетата за official.

## 14. Machine-readable inventory decision after Batch D

Batch D **не променя `content-inventory/records.v1.json`**.

Причини:

1. няма clean first-party current field package за нито един от петте;
2. `При близнаците` има category/identity overlap, който не трябва да се решава по име;
3. `Алф` има по-силна legal identity support, но exact customer-facing retail object остава отделен verification въпрос;
4. `Регал`, `Boutique Bar`, `Завалиите` остават secondary-only;
5. няма automatic import, merge или active classification.

## 15. Следващ bounded пакет

Следващото безопасно действие е:

1. продължаване на `INTERIM-T004` с още един малък dining пакет, ако remaining high-signal candidates оправдават direct check;
2. ако следващите кандидати са само слаб directory noise, спира се broadening и се преминава към exact inventory proposal за единствения силен direct candidate (`Дюнер Lab`) след source-currentness + duplicate check;
3. local-check accumulation вече включва `Рибката`, `Чайка beach`, `Versus`, `Kastelo`, `Valentino`, `При близнаците` и други identity/status conflicts;
4. `ВИП СИМЕРС ГРУП` не се третира като dining venue без доказан отделен retail/cafe object;
5. няма automatic import, public seed, prototype selection или production write.
