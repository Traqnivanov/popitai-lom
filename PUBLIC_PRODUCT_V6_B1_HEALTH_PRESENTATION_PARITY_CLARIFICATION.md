# Попитай.Лом — V6-B1 HEALTH CATEGORY PRESENTATION CLARIFICATION

Статус: **LOCKED CLARIFICATION / NO PRODUCTION CODE**  
Branch: `v6-product-foundation-draft`  
Дата: 31.08.2026

Този companion не променя B1 owner логиката. Той записва изрично потребителското уточнение за `Здраве и лекари`, за да не бъде изгубено при следващите V6 stages.

## Заключено правило

`Здраве и лекари` е една от 16-те основни public категории и **трябва визуално, навигационно и като общ interaction pattern да следва същия V6 category shell като останалите категории**.

Това означава еднаква обща логика за:
- вход от Home / `Всички категории`;
- category header / breadcrumb / back behavior;
- ясни subcategory/filter chips;
- `Намери` като primary discovery действие;
- contextual `Добави` и `Попитай` там, където owner правилата ги позволяват;
- cards/results spacing, states, mobile hierarchy и accessibility;
- връщане към общия marketplace/category контекст;
- Search V6 integration.

## Какво НЕ се уеднаквява

Визуалната/структурна parity **не означава** общ backend owner.

`Здраве и лекари` запазва:
- specialized verified Health/Info owner;
- existing approved health data/submission/moderation model;
- reliability/freshness rules;
- separation between verified facts and community opinion;
- no generic Listings/Firms bypass за медицински/health записи;
- no unverified direct publish;
- no medical marketplace/bookings introduced by implication.

## Existing Health structure to preserve

B1 вече е записал:
- Лични лекари;
- Специалисти;
- Стоматолози;
- Практики/кабинети;
- Болнична и спешна помощ;
- Лаборатории;
- Аптеки;
- Ветеринари;
- Вет. аптеки само при реално published coverage.

Тази структура не се изтрива заради общия V6 category redesign. Тя се **вгражда в общия визуален category system**.

## Target rule in one line

**Еднакъв category UX shell; правилният specialized Health owner остава отдолу.**

Production impact: **NONE**.