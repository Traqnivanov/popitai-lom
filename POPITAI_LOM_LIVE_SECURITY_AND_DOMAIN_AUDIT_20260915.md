# Попитай.Лом — live security и domain audit

Дата: **15.09.2026**  
Work: **Work 2**  
Scope: **read-only Supabase catalog audit + public domain conditions check**  
Base review SHA: `4b0a24afb7c7020b7e9922cb607d506d8c7df208`

Този документ е evidence checkpoint към `POPITAI_LOM_PRODUCTION_MIGRATION_MATRIX.md`. Той не разрешава Supabase write, migration, production, DNS, Stage 3 или местене на safety HEAD.

## 1. Изпълнени граници

- Проверен е единственият Supabase проект `popitai-lom` (`ACTIVE_HEALTHY`).
- Изпълнени са само `SELECT` заявки към PostgreSQL catalog/views и read-only Supabase Security Advisor.
- Не са изпълнявани `DELETE`, `UPDATE`, `INSERT`, DDL, migration, transaction test или role impersonation.
- Не са извличани имейли, UUID на профили или друго лично съдържание.
- Не е купуван домейн, не е създавана поръчка и не са променяни DNS/Auth/redirect настройки.

## 2. LOCKED Admin-only permanent delete — live verdict

### 2.1 Доказано live

- RLS е включен за проверените core таблици: `profiles`, `questions`, `answers`, `businesses`, `listings`, `events`, `reports`, `media`, `shops`, Info Lom таблиците и edit/expanded-profile таблиците.
- Live `DELETE`/`ALL` policies за административно управление на `answers`, `businesses`, `events`, `info_actions`, `info_entries`, `listings`, `media`, `questions`, `reports`, `shops` използват `is_admin()` или точна Admin role проверка.
- Moderator policies за core content са `SELECT`/`UPDATE`, не `DELETE`.
- Storage `business-media` дава на Moderator read, а `ALL` е ограничено с `is_admin()`.
- User own-delete пътищата изрично блокират Moderator чрез `NOT is_moderator()` или `is_staff()` guard.
- Откритите `SECURITY DEFINER` функции, които съдържат `DELETE`, са owner/draft/media cleanup flows или Admin-only flow; Moderator е блокиран от окончателното премахване на media при publish.
- Live role inventory съдържа точно 1 Admin, 1 Moderator и 1 User; не са извличани самоличности.

### 2.2 Извод

**`LIVE LOCKED DELETE CONFLICT NOT CONFIRMED`**

Repo файловете съдържат стар/конфликтен SQL evidence, но live базата не съвпада с този рисков модел. Самият table grant `DELETE` към `authenticated` не дава право за bypass: RLS остава приложим и live permissive delete policies не допускат Moderator.

Следователно mandatory emergency `STOP` не се задейства. Няма основание за аварийна Supabase промяна.

Това не заменя бъдещия четириролев destructive-action QA преди launch и не доказва frontend бутоните по всички екрани.

## 3. Отделни security hardening точки — не са emergency patch

Supabase Security Advisor отчете:

| Finding | Live evidence | Текущ verdict |
| --- | --- | --- |
| RLS enabled, no policy | `listing_monthly_quotas` има RLS, но няма policy | `REVIEW BEFORE LAUNCH`; може да е умишлено server-only, трябва owner/RPC contract проверка |
| Mutable function search path | `touch_listing_updated_at`, `set_listing_expiry`, `touch_info_entry_updated_at` | `HARDENING REQUIRED BEFORE LAUNCH`; не доказва текущ exploit |
| Anon-executable `SECURITY DEFINER` | `increment_listing_views`, `is_admin`, `is_moderator`, `is_staff` | `LEAST-PRIVILEGE REVIEW`; role helpers връщат boolean, view counter intent трябва да се потвърди |
| Authenticated-executable `SECURITY DEFINER` | 24 функции | Не се revoke-ват механично: повечето са умишлени RPC owners и имат вътрешни guards; нужен е function-by-function contract QA |
| Leaked password protection disabled | Auth setting | `AUTH HARDENING BEFORE LAUNCH`; отделно owner approval за Auth change |

Нито една от тези точки не разрешава промяна с настоящия read-only scope.

## 4. `popitai-lom.bg` — проверка без покупка

### 4.1 Проверени условия

- `.bg` регистрацията е чрез Register.BG/регистратор и изисква идентификация на регистранта.
- Провереният посредник ICDSoft изисква КЕП и предлага регистрация само за лица/организации с местожителство или законна дейност в България.
- Към проверката публикуваната крайна цена е **32.40 EUR/година без hosting** или **23.76 EUR/година с hosting**.
- Периодът е 1–10 години.
- Защитен домейн изисква основание и документи; незащитен домейн може да бъде оспорен от лице с основание.
- WHOIS privacy не се предлага за `.bg`; за юридическо лице се публикуват повече данни, а за физическо лице — името.
- Самата `.bg` регистрация не включва DNS услуга при проверения посредник.

### 4.2 Наличност

**`UNVERIFIED — OWNER CHECKOUT CONFIRMATION REQUIRED`**

Официалният Register.BG/NIC интерфейс не може да бъде проверен надеждно от текущата среда заради certificate-chain failure. Формата на посредника не върна еднозначен краен резултат в допустимото време. Липсата на публичен сайт или search result не доказва, че домейнът е свободен, резервиран или извън опашка.

Не се прави предположение и не се създава поръчка.

## 5. Точен следващ ред

1. Owner проверява `popitai-lom.bg` в checkout на избран `.bg` регистратор и решава: физическо/юридическо лице, защитен/незащитен домейн, регистратор и срок.
2. Ако owner иска покупка, дава отделно изрично разрешение; покупката, данните на регистранта и КЕП не са част от този Work checkpoint.
3. Историческият следващ ред беше един хибриден icon comparison. Owner correction от Work 2 · 15.09.2026 го замени с checkpoint, в който site/mobile са само оптимизирани SVG, а подробният 3D asset е само за social/Facebook 1200×630 без одобрена собствена снимка. Коригираният `cbe64de…` checkpoint впоследствие е отхвърлен; icon работата е PAUSED и текущият ред е content-complete/reality.
4. Текущо: content-complete/reality pass и bounded prototype mapping remediation, включително `Пътнически превоз`.
5. След това: финален независим desktop + 390 px Stage 2 audit и owner freeze на exact SHA.
6. Supabase hardening findings се превръщат в отделен pre-launch security matrix ред; няма механичен revoke или Auth промяна.

## 6. Stop/rollback

- Няма data mutation за rollback.
- Ако по-късно role QA покаже Moderator hard-delete път, се задейства Master emergency STOP и се подготвя тесен patch с backup/rollback.
- Safety branch, production `main`, Supabase, DNS и Stage 3 остават непроменени.
