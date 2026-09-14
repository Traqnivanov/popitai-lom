# Попитай.Лом — CURRENT PROJECT CHECKPOINT

Актуализирано: **14.09.2026**

Този файл е кратък оперативен указател. Той **не е втори продуктов Master**.
Текущите решения, заменените правила и точният ред на работа са в:

`POPITAI_LOM_MASTER_CURRENT.md`

След Master задължително се чете:

`POPITAI_LOM_DECISION_AND_BACKLOG_REGISTER.md`

Регистърът пази statuses, evidence граници, задължително съдържание и неприоритизирани идеи. Той не отменя Master или protected/LOCKED contract.

## Exact current state

- Repo: `Traqnivanov/popitai-lom`
- Safety branch: `prototype/content-complete-ia-20260904-stage2-safety`
- LOCKED safety HEAD: `997d97504251f4cbae0693dc0cffa24d1d04da79` — не се мести преди отделно owner approval
- Icon review branch: `prototype/stage2-icon-system-approval`
- База на owner-approved Work 2 реда: `6d7ce692a9fc01759df21e406bde386c7c3a3859`
- Последен функционален Stage 2 checkpoint преди docs-only синхронизацията: `e423a2c3a8d2f70d28060fb4c37ce38bd5369d5e`
- Текущият exact branch HEAD се проверява в Git преди работа; docs-only и bounded follow-up commits не се представят като ново общо Stage 2 acceptance
- Production `main`: не е променян от тази Stage 2 работа
- Supabase/schema/RLS/RPC: не са променяни
- Stage 3: не е започван

## Прието до този checkpoint

- public IA и деветте discovery входа;
- prototype runtime consolidation и един owner на route/render lifecycle;
- новите Services са offer-only: само `Предлагам услуга`; legacy `Търси` остава read/edit compatibility;
- опростеният директен results UX на `Работа`;
- prototype-only Work compensation logic: optional сума, период при сума и `По договаряне`;
- Work compensation period не се представя като production-persisted.
- `staticPage()` показва описанието само веднъж; duplicate presentation defect е отстранен.
- Favorites detail-only UX, internal real routes и content parity са прототипирани; пълната named-route desktop/390px browser acceptance остава в общия Stage 2 gate.
- public results използват само доказани approved records или честно empty state; synthetic/mock public results са премахнати и canonical results owner е консолидиран.
- Facebook distribution/content-protection решенията и production границите са класифицирани в централния регистър.
- Services discovery taxonomy е owner-consolidated и приложена в review prototype от Work 2: деветте семейства остават, а 59-те понятия се представят чрез 46 видими входа, включително owner-approved `Пътнически превоз`, плюс точни aliases/filters/cross-links. Exact `Пътнически превоз` contract mapping остава потвърден prototype gap за bounded remediation.
- Icon review branch съдържа 34 site WebP assets на 128×128 и 32 social WebP assets на 512×512. Approval е само по конкретните приети групи; масовата leaf експанзия е спряна като критичен път. Одобрена е хибридна посока: лека site SVG система + family/text-first discovery + подробни 3D social/large thematic assets.
- Repo audit потвърждава риск от несъответствие между DELETE grants/permissive staff policies и LOCKED Admin-only permanent delete. Реалното live Supabase състояние е непроверено и не се променя без отделно owner разрешение за read-only audit и последващ отделен security checkpoint.

## Stage status

Отделните Work UX/compensation checkpoints са приети като логика и код.

**Целият Stage 2 остава НЕПРИЕТ.**

Остават owner visual acceptance, content-complete/reality pass и финален desktop/mobile независим audit. Production и Stage 3 остават блокирани.

## Точен следващ ред — owner-approved Work 2 · 14.09.2026

1. **Текущ docs-only checkpoint:** синхронизиране на Master, регистър, Progress и `PROJECT_RULES_00_READ_FIRST.md` върху exact review base `6d7ce692a9fc01759df21e406bde386c7c3a3859`;
2. **Pre-implementation control pack, без production writes:** една изпълнима migration matrix по Master §12.2, включително 14-те production checkpoints, 46 Services entries, `Пътнически превоз`, всички owner/form/moderation зависимости, protected `Иванов Ремонти`, Admin-only permanent delete, domain/auth/SEO/OG и rollback;
3. **Отделен security gate:** само след ново owner разрешение — read-only live Supabase grants/RLS/RPC/role audit; при потвърден LOCKED дефект останалата работа спира за тесен emergency patch plan, backup/rollback и четириролев QA;
4. **Един хибриден icon comparison:** desktop, реален 390 px, 16–24 px, 56–64 px и social 1200×630; без масово leaf производство преди owner verdict;
5. **Content-complete/reality Stage 2 pass:** задължителното съдържание и bounded prototype contract/mapping remediation;
6. **Финален Stage 2 audit:** всички journeys, forms, Favorites, Share, actions и states на desktop/390 px, accessibility, performance и protected regressions;
7. **Owner acceptance и freeze на exact Stage 2 SHA;**
8. **Stage 3 само owner-by-owner и matrix-row-by-matrix-row;**
9. **Контролиран domain/auth/SEO/OG cutover;**
10. **Launch gate, soft launch и owner verdict.**

## Stop conditions

Спира се за owner/Work решение само при реален конфликт, който засяга:

- production schema/RLS/RPC;
- роли, ownership, moderation или status lifecycle;
- quotas/media limits;
- protected Firms/Listings/Masters/Admin логика;
- Admin-only permanent delete или друго доказано security противоречие;
- нов write owner/form;
- премахване на одобрена възможност;
- ново продуктово решение, което не е определено в Master-а.

Repo evidence не се представя като доказателство за текущото live Supabase състояние. Security, production, domain cutover и Stage 3 чакат отделното им owner approval.

Без такъв конфликт безопасните проверки и ограничената текуща задача продължават без междинни отчети.

## Историческа бележка

Предишното съдържание на този файл описваше V6 Recovery и стар четиригрупов marketplace модел. То е заменено и остава достъпно в Git историята. Не управлява нова работа.
