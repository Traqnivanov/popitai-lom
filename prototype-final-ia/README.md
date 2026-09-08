# Попитай.Лом — Stage 2 prototype runtime

Тази папка е **prototype-only**. Не е production и не записва реални данни.

Последен приет runtime baseline: `ba1c00ad64784e261107b902e6f8b8165bba3291`. По-късен docs-only commit върху safety branch-а не променя този runtime baseline.

## Runtime ownership

- `app.js` — единствен route/render lifecycle и hash owner.
- `prototype-home.js` — единствен Home + public marketplace hub owner.
- `prototype-stage2-contracts.js` — public discovery → owner/contextual Add mapping. Новите услуги са offer-only (`Дава`).
- `prototype-service-views.js` — услуги, service families, Майстори и service-group render-и.
- `prototype-marketplace-views.js` — Работа, Имоти, Стоки, Автомобили, Животни, Магазини, Заведения и Health discovery views.
- `prototype-forms.js` — един Listing form с contextual prefill + отделни Firm, Shop, Health и Question form owners.
- `prototype-validators.js` — authoritative persisted validators по owner (`listing`, `firm`, `shop`, `health`, `question`).
- `prototype-interactions.js` — един delegated interactions owner: modal/focus, dirty guard, submit lifecycle, share UX, uploads и Favorites prototype lifecycle.
- `prototype-content-data.js` — един content/data layer за публичното prototype съдържание.
- `prototype-content-views.js` — Info Lom, Firms, Current, Articles, Questions, Results и Detail render-и.
- `prototype-records.js` — prototype record fixtures и owner metadata.
- `prototype-social-card-composer.js` — единствен Social Card renderer.

CSS е разделен по semantic ownership и се зарежда само веднъж: components, Home, services, results/forms, detail/share и Favorites.

## Offer-only / backward compatibility

Нов service create route никога не генерира `type=Търси`; единственият публикуващ service CTA е „Предлагам услуга“. Стар persisted service record с `listing_type=Търси` остава четим и при edit може да запази legacy стойността. Legacy compatibility не създава нов публичен „Търся изпълнител“ поток.

## Work UX / compensation

`Работа` отваря директно търсене, трите type филтъра и резултати/empty state. Професионалните направления са компактни филтри след резултатите и поле в единната Listing форма, не девет големи входни карти.

Prototype формата показва optional предлагано/желано възнаграждение и период `на час / на ден / на месец / за задача`, с `По договаряне`. Production `listings` няма поле за периода; той не се записва в description или compatibility adapter и изисква отделно production approval.

## Известен малък presentation defect

`staticPage()` повтаря описанието от `pageHead()` още веднъж в content card. Това е отделен ограничен cleanup и не е taxonomy/owner проблем.

## Regression audit

QA скриптът не се зарежда от `index.html` и не променя DOM:

```bash
node prototype-final-ia/prototype-regression-audit.js
```

Отделните Work UX и compensation checkpoints са приети като логика и код. Целият Stage 2 остава неприет до content-complete audit и owner visual acceptance.
