# Попитай.Лом — Stage 2 prototype runtime

Тази папка е **prototype-only**. Не е production и не записва реални данни.

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

## Regression audit

QA скриптът не се зарежда от `index.html` и не променя DOM:

```bash
node prototype-final-ia/prototype-regression-audit.js
```

Stage 2 остава предмет на independent Work audit и owner acceptance.
