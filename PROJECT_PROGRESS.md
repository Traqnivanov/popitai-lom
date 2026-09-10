# Попитай.Лом — CURRENT PROJECT CHECKPOINT

Актуализирано: **09.09.2026**

Този файл е кратък оперативен указател. Той **не е втори продуктов Master**.
Текущите решения, заменените правила и точният ред на работа са в:

`POPITAI_LOM_MASTER_CURRENT.md`

След Master задължително се чете:

`POPITAI_LOM_DECISION_AND_BACKLOG_REGISTER.md`

Регистърът пази statuses, evidence граници, задължително съдържание и неприоритизирани идеи. Той не отменя Master или protected/LOCKED contract.

## Exact current state

- Repo: `Traqnivanov/popitai-lom`
- Safety branch: `prototype/content-complete-ia-20260904-stage2-safety`
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

## Stage status

Отделните Work UX/compensation checkpoints са приети като логика и код.

**Целият Stage 2 остава НЕПРИЕТ.**

Остават owner visual acceptance, content-complete/reality pass и финален desktop/mobile независим audit. Production и Stage 3 остават блокирани.

## Точен следващ ред

1. **Завършено като prototype:** Home action/activity contract на `84d57cb0024ae9b82534badb3e852bc2e12c60b7` — отделни `Публикувай`/`Попитай` повърхности и честен `Днес → Тази седмица → Полезно сега` fallback; финалното приемане остава в общия Stage 2 gate;
2. **В процес / owner acceptance pending:** icon visual-system checkpoint — Work 2 изолира осем generated 3D кандидата върху base review SHA `ab726578dad4706e86f141a1ccb473beda5c4b90` за desktop, 390 px, 24/48/64 px и social comparison; това не е site-wide approval и не е production wiring;
3. content-complete/reality pass със задължителното съдържание от централния регистър;
4. финален Stage 2 audit на всички основни journeys, forms, Favorites, Share, actions и states на desktop и 390px;
5. owner visual acceptance и freeze на exact SHA;
6. едва след това — отделни production architecture checkpoints от §12.1 на Master-а.

## Stop conditions

Спира се за owner/Work решение само при реален конфликт, който засяга:

- production schema/RLS/RPC;
- роли, ownership, moderation или status lifecycle;
- quotas/media limits;
- protected Firms/Listings/Masters/Admin логика;
- нов write owner/form;
- премахване на одобрена възможност;
- ново продуктово решение, което не е определено в Master-а.

Без такъв конфликт безопасните проверки и ограничената текуща задача продължават без междинни отчети.

## Историческа бележка

Предишното съдържание на този файл описваше V6 Recovery и стар четиригрупов marketplace модел. То е заменено и остава достъпно в Git историята. Не управлява нова работа.
