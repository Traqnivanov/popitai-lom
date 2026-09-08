# Попитай.Лом — CURRENT PROJECT CHECKPOINT

Актуализирано: **08.09.2026**

Този файл е кратък оперативен указател. Той **не е втори продуктов Master**.
Текущите решения, заменените правила и точният ред на работа са в:

`POPITAI_LOM_MASTER_CURRENT.md`

## Exact current state

- Repo: `Traqnivanov/popitai-lom`
- Safety branch: `prototype/content-complete-ia-20260904-stage2-safety`
- Consolidated Stage 2 baseline преди ограничените follow-up корекции: `ba1c00ad64784e261107b902e6f8b8165bba3291`
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

## Stage status

Отделните Work UX/compensation checkpoints са приети като логика и код.

**Целият Stage 2 остава НЕПРИЕТ.**

Остават owner visual acceptance, content-complete/reality pass и финален desktop/mobile независим audit. Production и Stage 3 остават блокирани.

## Точен следващ ред

1. Favorites contract checkpoint;
2. icon visual-system checkpoint;
3. content-complete/reality pass;
4. финален Stage 2 audit на всички основни journeys, forms, actions и states на desktop и 390px;
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
