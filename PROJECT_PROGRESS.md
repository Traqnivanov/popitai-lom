# Попитай.Лом — CURRENT PROJECT CHECKPOINT

Актуализирано: **16.09.2026**

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
- Pre-implementation control pack: owner accepted; live read-only security/domain evidence е в `POPITAI_LOM_LIVE_SECURITY_AND_DOMAIN_AUDIT_20260915.md`
- Domain: `popitai-lom.bg` е предпочитан; условията са проверени, availability/purchase остават owner checkout action; няма DNS/Auth промяна
- Content placement verdict: owner-approved на 16.09.2026; документационен sync only, без UI/code/Supabase

## Прието до този checkpoint

- public IA и деветте discovery входа;
- `За гости в Лом` е приет като вторичен Info discovery блок: `Къде да отседнеш` → Firms/`Настаняване`, `Лом за един ден` → Article, плюс link към `Транспорт`;
- `Бензиностанции` е Info Lom/Комунални owner без Firm duplicate;
- НПО/сдружения са отделен тип `Организация`; техническият owner/schema lifecycle остава production checkpoint;
- няма отделен landmarks directory или седма Info карта; точни Info records се пазят само за полезни променливи факти;
- `Лом за един ден` е бъдеща article задача, не текущо писане или implementation; планира се серия от поне 10 материала с отделен source/review gate за всеки;
- хотел `Москва`, парк хотел `Ривър`, хотел/ресторант `Дунав` и бензиностанция `Кристал В` са owner-confirmed като съществуващи; непроверените официални полета остават OPEN;
- `content-inventory/` V1 е създаден като единен pre-production control layer с schema, 7 начални field-evidence records и validator; точните записи са owner-review pending, runtime/production writes са забранени;
- съществуващите Info Lom области `Транспорт`, `Магазини`, `Здраве`, `Институции` и `Образование` не се изграждат повторно;
- prototype runtime consolidation и един owner на route/render lifecycle;
- новите Services са offer-only: само `Предлагам услуга`; legacy `Търси` остава read/edit compatibility;
- опростеният директен results UX на `Работа`;
- prototype-only Work compensation logic: optional сума, период при сума и `По договаряне`;
- Work compensation period не се представя като production-persisted.
- `staticPage()` показва описанието само веднъж; duplicate presentation defect е отстранен.
- Favorites detail-only UX, internal real routes и content parity са прототипирани; пълната named-route desktop/390px browser acceptance остава в общия Stage 2 gate.
- public results използват само доказани approved records или честно empty state; synthetic/mock public results са премахнати и canonical results owner е консолидиран.
- Facebook distribution/content-protection решенията и production границите са класифицирани в централния регистър.
- Services discovery taxonomy е owner-consolidated и приложена в review prototype от Work 2: деветте семейства остават, а 59-те понятия се представят чрез 46 видими входа, включително owner-approved `Пътнически превоз`, плюс точни aliases/filters/cross-links. Exact mapping и targeted desktop/390 px QA за `Пътнически превоз` са преминати на `e092eb38c53efd8ca3ca0582a44a562ae34b764c`.
- Icon review branch съдържа исторически 128 px site WebP и 512 px social WebP варианти. След owner correction от Work 2 · 15.09.2026 site/mobile използват само оптимизирани SVG и text-first leaves; подробните одобрени 3D assets са само за social/Facebook 1200×630 без собствена одобрена снимка. Масовата leaf експанзия остава спряна.
- Work 2 read-only live audit не потвърждава Moderator hard-delete path: core RLS е включен, Admin delete policies са Admin-only, а Moderator delete-capable RPC/Storage bypass не е открит. Repo SQL evidence е старо/конфликтно спрямо live. Security Advisor hardening findings остават отделен pre-launch checkpoint; Supabase не е променян.

## Stage status

Отделните Work UX/compensation checkpoints са приети като логика и код.

**Целият Stage 2 остава НЕПРИЕТ.**

Остават owner visual acceptance, content-complete/reality pass и финален desktop/mobile независим audit. Production и Stage 3 остават блокирани.

## Точен следващ ред — owner-approved Work 2 · 14.09.2026

1. **Завършено:** docs-only синхронизация в `6e4b75276c64b41ffdc534384064a2a3b60b7685`;
2. **Завършено и owner accepted:** `POPITAI_LOM_PRODUCTION_MIGRATION_MATRIX.md`;
3. **Завършен read-only gate:** live Moderator hard-delete conflict не е потвърден; evidence и отделните hardening точки са в `POPITAI_LOM_LIVE_SECURITY_AND_DOMAIN_AUDIT_20260915.md`; Supabase не е променян;
4. **Завършено без acceptance / PAUSED:** и `8faa2f7…`, и коригираният `cbe64de…` icon checkpoint са отхвърлени; няма одобрени site SVG и няма нова icon серия;
5. **Текущ checkpoint — Content-complete/reality Stage 2 pass:** `content-inventory/` V1 е валидиран с 13 records; `Ресторант Бохеми` е добавен като owner-confirmed partial record. Dining reality/gap/duplicate audit е завършен: `Ресторант Дъгата`, `Пицария При Финци` и `Пица на пещ Тербаяно` са силни bounded кандидати; `Пицария Палма` и `Каприз 2025` остават research-only, а hotel+restaurant cross-discovery е OPEN production facet gate без duplicate. Следва direct verification на оставащите кандидати и duplicate check; няма runtime adapter, import, schema или production промяна преди отделно approval;
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

Repo evidence не се представя като доказателство за текущото live Supabase състояние. Domain availability/purchase, security writes, production, domain cutover и Stage 3 чакат отделното им owner approval.

Без такъв конфликт безопасните проверки и ограничената текуща задача продължават без междинни отчети.

## Историческа бележка

Предишното съдържание на този файл описваше V6 Recovery и стар четиригрупов marketplace модел. То е заменено и остава достъпно в Git историята. Не управлява нова работа.
