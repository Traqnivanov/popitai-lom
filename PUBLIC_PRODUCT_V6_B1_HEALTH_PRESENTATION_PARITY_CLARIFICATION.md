# Попитай.Лом — V6-B1 HEALTH CATEGORY PRESENTATION CLARIFICATION

Статус: **LOCKED CLARIFICATION / NO PRODUCTION CODE**  
Branch: `v6-product-foundation-draft`  
Дата: 31.08.2026

Този companion не променя B1 owner логиката. Той записва изрично потребителското уточнение за `Здраве и лекари`, за да не бъде изгубено при следващите V6 stages.

## Заключено правило

`Здраве и лекари` е една от 16-те основни public категории и **трябва визуално, навигационно и като общ interaction pattern да следва същия V6 category shell като останалите категории**.

Това означава обща V6 логика за:
- вход от Home / `Всички категории`;
- category header / breadcrumb / back behavior;
- ясни subcategory/filter controls;
- `Намери` като primary discovery действие;
- contextual `Добави` и `Попитай` там, където owner правилата ги позволяват;
- cards/results spacing, states, mobile hierarchy и accessibility;
- връщане към общия category/discovery контекст;
- Search V6 integration;
- share/distribution/Facebook Bridge integration по общия V6 план.

## Какво НЕ се уеднаквява

Общата визуална/структурна система **не означава** общ backend owner.

`Здраве и лекари` запазва:
- specialized verified Health/Info owner;
- approved health data/submission/moderation semantics;
- reliability/freshness rules;
- separation between verified facts and community opinion;
- no generic Listings/Firms bypass за медицински/health записи;
- no unverified direct publish;
- no medical marketplace/bookings introduced by implication.

## Current Health structure is INPUT, not frozen V6 UI

Current/B1 health coverage включва:
- Лични лекари;
- Специалисти;
- Стоматолози;
- Практики/кабинети;
- Болнична и спешна помощ;
- Лаборатории;
- Аптеки;
- Ветеринари;
- Вет. аптеки само при реално published coverage.

Това **не заключва сегашната визуална структура едно към едно**.

V6 може да прегрупира, преименува presentation labels, промени layout-а, navigation hierarchy и category shell, ако:
- не губи реалното health coverage;
- не смесва verified Health с generic marketplace content;
- не променя authoritative owner/moderation/trust правилата;
- всяка нова presentation група има ясен mapping към реалните owner records.

Тоест пазим **смисъла, данните и owner правилата**, не стария екран като неприкосновен дизайн.

## Facebook / share / distribution parity

`Здраве и лекари` участва в общия V6 growth/distribution модел, а не стои извън него.

Health може да има:
- shareable canonical category/detail/guide surfaces;
- `Сподели` / `Копирай линк`;
- качествен Open Graph preview;
- Facebook/Messenger distribution към canonical Попитай.Лом URL;
- contextual Q&A/guide links;
- future Facebook Bridge participation по B7.

Но Facebook/distribution layer:
- **не става owner на health факти**;
- не копира mutable phone/address/hours като отделна truth база;
- не превръща community opinion във verified medical fact;
- винаги връща към canonical Попитай.Лом owner surface.

Exact Facebook Bridge mechanics остават за `V6-B7`; това уточнение заключва, че Health е включен в общия модел.

## Target rule in one line

**Еднакъв V6 category/discovery/share shell; Health може да бъде визуално преструктуриран, но verified owner/trust/moderation остава специализиран отдолу.**

Production impact: **NONE**.