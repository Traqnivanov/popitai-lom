# Попитай.Лом — LIVE BROWSER QA R1

Статус: **VISUAL PARITY FAIL / CONTENT PARTIAL PASS / NO PRODUCTION CHANGE**
Дата: 03.09.2026
Branch: `v6-full-site-prototype-r1`

## 1. Как е тествано

Opera Browser Connector вече е свързан. RawGitHack branch preview първоначално показа стар кеш, затова browser QA се фиксира към exact commit URL, а не към плаващ branch URL.

Тестван exact commit при началото на browser QA: `309c231d475d10cacb9eaf7bea9da62df246233d`.

## 2. Критична находка — визуалната посока на R1 е грешна

Основният сайт вече има одобрена визуална логика. R1 не трябва да я заменя с нов дизайн.

Live comparison потвърди:

- Home в production използва одобрения Попитай.Лом shell, лого, тъмносиньо/златисто, Дунав hero, основно търсене и съществуващите CTA.
- R1 Home е нова blue-card интерпретация и не е визуално parity.
- Production Marketplace/Категории има одобрен hero/search/add/category модел.
- R1 Marketplace е нова интерпретация и липсва същата hero/search логика.
- Production `transport.html` има собствен специализиран Info Lom дизайн: тъмен Info hero, quick tabs/cards, специализирани секции Автобус/ЖП/Такси и текущия shell.
- R1 Transport съдържа правилните данни, но ги показва в generic cards. Това нарушава визуалния LOCK.

**Решение за R1:** прототипът се коригира към одобрения основен сайт. Production не се променя по R1.

## 3. Listing form — реален browser finding

### FAIL — contextual entry повтаря вече известен избор

Route `#/listing-form?main=work` правилно preselect-ва Работа, но все още показва целия първи избор:

- Услуга
- Автомобили
- Работа
- Имот
- Стока

Това е излишна стъпка, защото контекстът вече е известен.

Target:

- contextual create входът показва кратко `Публикуваш в: Работа · Промени`;
- потребителят започва директно от релевантния следващ избор;
- ако натисне `Промени`, тогава се разкрива общият избор;
- маха се визуалната номерация `1 / 2 / 3`, защото създава усещане за дълъг wizard.

## 4. SPA navigation — реален interaction bug

### FAIL — нов route запазва старата scroll позиция

При преминаване от дълга Info страница към `#/marketplace`, browser-ът остана в долната scroll позиция и Marketplace се отвори при footer-а.

Target:

- нов top-level route → scroll/focus към началото на основното съдържание;
- anchor/deep-link route може изрично да запази/зададе друга позиция.

## 5. Статии

### PASS — брой публикувани статии

R1 exact commit показва само една публикувана статия.

### PASS — content source parity

Сверено с реалните `statii.html` и `statia.html`:

- `Как да избереш майстор и да избегнеш неприятни изненади` е единствената текуща статия;
- реалната статия съдържа lead + 4 точки;
- R1 съдържа същите 4 смислови точки.

### TO POLISH — presentation parity

R1 трябва да запази lead-а и визуалната article structure от основния сайт, а не само списък със същите точки.

## 6. Transport content parity

### PASS — source values

Live R1 е сверено с `info-lom-transport-v1.js`.

Потвърдено:

- Автогара Лом: `ул. „Хан Аспарух“ №5`;
- ЖП гара Лом: `ул. „Пристанищна“ №43`;
- ЖП телефон: `0887 398 610`;
- работно време: `04:00–21:15`;
- Експрес такси – Лом: `0897 200 838`.

Тоест Transport проблемът е visual parity, не data parity.

## 7. Preview cache warning

Плаващият RawGitHack branch URL показа стар R1 кеш с:

- 3 статии;
- стари технически UI текстове.

Exact commit URL показа актуалния код.

За acceptance QA трябва да се използва exact commit preview или друг cache-safe preview, не плаващият RawGitHack branch URL.

## 8. Следващ pass

1. Заключеният shell/визуален език се привежда към основния сайт.
2. Home parity.
3. Marketplace/Категории parity.
4. Info Lom specialized visual parity — първо Transport, после останалите specialized owners.
5. Listing contextual shortcut + без номериран wizard.
6. Route scroll/focus reset.
7. Article presentation parity.
8. Нов exact-commit browser QA.

До този pass R1 **не е визуално готов за whole-site approval**.