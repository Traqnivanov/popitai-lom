(function () {
  'use strict';

  var app = document.getElementById('app');
  if (!app) return;

  var role = 'normal';
  var current = { route: '', data: {} };
  var handled = new Set(['marketplace', 'category', 'firms', 'firm-detail', 'listing-detail', 'form-listing', 'form-firm', 'profile']);

  var roleLabels = {
    normal: 'Обикновен потребител',
    moderator: 'Модератор',
    admin: 'Администратор'
  };

  var categoryLabels = {
    construction: ['Строителство и ремонти', 'Майстори, ВиК, електро, покриви'],
    work: ['Работа', 'Обяви за работа в Лом'],
    cars: ['Автомобили', 'Коли, сервизи, гуми и части'],
    property: ['Имоти', 'Продажби, наеми и търсене'],
    beauty: ['Красота', 'Фризьори, козметика и грижа'],
    services: ['Други услуги', 'Местни услуги извън основните групи'],
    other: ['Други обяви', 'Стоки и останалите обяви']
  };

  var groupSubs = {
    construction: ['Цялостни ремонти', 'Бани и плочки', 'ВиК', 'Електро', 'Покриви', 'Боядисване', 'Дограма', 'Климатици'],
    cars: ['Автомобили за продажба или търсене', 'Авточасти', 'Автосервизи', 'Диагностика', 'Гуми', 'Автомивки', 'Пътна помощ'],
    services: ['Домашна помощ', 'Красота и грижа', 'Компютърни и технически услуги', 'Фото и видео', 'Професионални услуги', 'Обучение и уроци', 'Грижа', 'Транспорт, преместване и доставки'],
    other: ['Електроника', 'Дом и градина', 'Дрехи и обувки', 'Деца и бебета', 'Спорт и хоби', 'Животни', 'Работа', 'Имоти', 'Друго']
  };

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function button(text, route, attrs) {
    return '<button type="button" data-route="' + route + '" ' + (attrs || '') + '>' + text + '</button>';
  }

  function crumbs(items) {
    var html = '<div class="container breadcrumbs">' + button('Начало', 'home');
    items.forEach(function (item, index) {
      html += '<span>›</span>' + (index === items.length - 1
        ? '<strong>' + esc(item[0]) + '</strong>'
        : button(esc(item[0]), item[1]));
    });
    return html + '</div>';
  }

  function head(kicker, title, description, actions) {
    return '<section class="page-head"><div class="container page-head-row"><div>' +
      '<span class="kicker">' + esc(kicker) + '</span><h1>' + esc(title) + '</h1><p>' + esc(description) + '</p></div>' +
      (actions ? '<div class="page-actions">' + actions + '</div>' : '') +
      '</div></section>';
  }

  function field(label, control, help) {
    return '<div class="field"><label>' + label + '</label>' + control + (help ? '<small>' + help + '</small>' : '') + '</div>';
  }

  function roleNote(text) {
    return '<aside class="v6-role-note"><strong>Проверка като: ' + esc(roleLabels[role]) + '</strong><p>' + text + '</p></aside>';
  }

  function prototypeNote(title, text) {
    return '<aside class="v6-prototype-note"><strong>' + title + '</strong><p>' + text + '</p></aside>';
  }

  function setActive(group) {
    document.querySelectorAll('[data-nav],[data-mobile-nav]').forEach(function (element) {
      element.classList.toggle('active', element.getAttribute('data-nav') === group || element.getAttribute('data-mobile-nav') === group);
    });
  }

  function closeAddSheet() {
    var sheet = document.getElementById('add-sheet');
    if (sheet) sheet.hidden = true;
    document.body.style.overflow = '';
  }

  function finish(html, group) {
    app.innerHTML = html;
    setActive(group);
    closeAddSheet();
    window.scrollTo(0, 0);
    syncRoleButtons();
    if (current.route === 'form-listing') setupListingDynamics();
  }

  function injectRoleReview() {
    var strip = document.querySelector('.prototype-strip');
    if (!strip || strip.querySelector('[data-v6-role-review]')) return;
    var wrap = document.createElement('div');
    wrap.className = 'v6-role-review';
    wrap.setAttribute('data-v6-role-review', '');
    wrap.innerHTML = '<span>Проверка на ролите:</span>' +
      '<button type="button" data-v6-role="normal">Обикновен</button>' +
      '<button type="button" data-v6-role="moderator">Модератор</button>' +
      '<button type="button" data-v6-role="admin">Администратор</button>';
    strip.appendChild(wrap);
    syncRoleButtons();
  }

  function syncRoleButtons() {
    document.querySelectorAll('[data-v6-role]').forEach(function (element) {
      var active = element.getAttribute('data-v6-role') === role;
      element.classList.toggle('active', active);
      element.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function roleRuleText() {
    if (role === 'admin') {
      return 'Собствените фирми и обяви се публикуват директно. Не се използва месечната квота за обяви. Администраторската фирма получава разширен достъп автоматично.';
    }
    if (role === 'moderator') {
      return 'Собственото съдържание на модератора следва същия поток като при обикновен потребител. Няма директно публикуване, няма специални квоти и не може сам да одобрява собственото си съдържание.';
    }
    return 'Новите фирми и обяви се изпращат за преглед. Личните и фирмените обяви използват отделни месечни квоти.';
  }

  function marketplace() {
    var actions = '<button class="primary" data-route="form-listing">+ Добави обява</button>';
    return '<div class="page">' + crumbs([['Обяви и услуги']]) +
      head('Обяви и услуги', 'Обяви и услуги', 'Един вход за услуги, автомобили, работа, имоти и останалите обяви.', actions) +
      '<section class="section"><div class="container">' +
      '<div class="market-grid">' +
        '<button class="market-card" data-route="category" data-category="construction"><span class="number">1</span><strong>Майстори и ремонти</strong><small>Ремонти, ВиК, електро, покриви и други</small></button>' +
        '<button class="market-card" data-route="category" data-category="cars"><span class="number">2</span><strong>Автомобили</strong><small>Коли, части и автомобилни услуги</small></button>' +
        '<button class="market-card" data-route="category" data-category="services"><span class="number">3</span><strong>Други услуги</strong><small>Домашни, професионални и други услуги</small></button>' +
        '<button class="market-card" data-route="category" data-category="other"><span class="number">4</span><strong>Други обяви</strong><small>Работа, имоти, стоки и останалите обяви</small></button>' +
      '</div>' +
      '<div class="result-section-title"><h2>Пример за подреждане при релевантно търсене</h2></div>' +
      '<div class="result-list">' +
        listingRow('Иванов Ремонти — ремонт на баня', 'Публикувана', 'admin') +
        listingRow('Иванов Ремонти — боядисване и шпакловка', 'Публикувана', 'admin') +
        listingRow('Ремонтни услуги — примерна горно позиционирана обява', 'Публикувана', 'boosted') +
        listingRow('Ремонтни услуги — друга одобрена обява', 'Публикувана', 'normal') +
      '</div>' +
      prototypeNote('Само за проверка на правилото', 'Първо се отсяват само релевантните, публикувани и активни обяви. В този релевантен набор администраторските обяви запазват защитения си приоритет. Нерелевантна обява не се вкарва изкуствено.') +
      '</div></section></div>';
  }

  function listingRow(title, state, kind) {
    var attrs = 'data-listing-kind="' + kind + '"';
    return '<article class="result-card"><div class="logo">О</div><div class="body"><span class="badge verified">' + esc(state) + '</span><h3>' + esc(title) + '</h3><p>Лом · примерни данни за прототипа</p></div><div class="actions">' +
      button('Виж обявата', 'listing-detail', attrs) + '</div></article>';
  }

  function category(id) {
    var info = categoryLabels[id] || [id === 'construction' ? 'Строителство и ремонти' : 'Категория', 'Релевантни обяви и фирми'];
    var actions = '<button class="primary" data-route="form-listing" data-prefill-category="' + esc(id) + '">+ Добави обява</button>' +
      '<button class="secondary" data-route="form-question" data-prefill-category="' + esc(id) + '">Задай въпрос</button>';
    var results = '';
    if (id === 'construction') {
      results = '<article class="result-card"><div class="logo">ИР</div><div class="body"><span class="badge verified">Публикувана фирма</span><h3>Иванов Ремонти</h3><p>Релевантен фирмен профил за ремонти.</p></div><div class="actions">' + button('Виж профила', 'firm-detail') + '</div></article>' +
        listingRow('Иванов Ремонти — примерна обява', 'Публикувана', 'admin') +
        listingRow('Друга релевантна ремонтна обява', 'Публикувана', 'normal');
    } else {
      results = listingRow('Примерна релевантна обява', 'Публикувана', 'normal');
    }
    return '<div class="page">' + crumbs([['Обяви и услуги', 'marketplace'], [info[0]]]) +
      head('Категория', info[0], info[1], actions) +
      '<section class="section"><div class="container"><form class="search-box"><input placeholder="Търси в ' + esc(info[0]) + '"><button type="button">Намери</button></form>' +
      '<div class="result-section-title"><h2>Релевантни резултати</h2></div><div class="result-list">' + results + '</div>' +
      (id === 'construction' ? prototypeNote('Защитена логика за Строителство', 'Иванов Ремонти е отпред само при реална задача за майстор/ремонт. При търсене по точно име на друга фирма се отваря конкретната фирма. При официален телефон или справочна задача първо може да бъде Инфо Лом.') : '') +
      '</div></section></div>';
  }

  function firms() {
    return '<div class="page">' + crumbs([['Фирми']]) +
      head('Местни фирми', 'Фирми', 'Постоянни публични профили на местни фирми и доставчици.', '<button class="primary" data-route="form-firm">+ Добави фирма</button>') +
      '<section class="section"><div class="container"><form class="search-box"><input placeholder="Име, категория или услуга"><button type="button">Търси</button></form>' +
      '<div class="result-list" style="margin-top:22px">' +
      '<article class="result-card"><div class="logo">ИР</div><div class="body"><span class="badge verified">Публикувана</span><h3>Иванов Ремонти</h3><p>Цялостни ремонти и довършителни дейности.</p></div><div class="actions">' + button('Виж профила', 'firm-detail') + '</div></article>' +
      '<article class="result-card"><div class="logo">Ф</div><div class="body"><span class="badge verified">Публикувана</span><h3>Примерна друга фирма</h3><p>Примерен релевантен профил.</p></div><div class="actions"><button type="button">Виж профила</button></div></article>' +
      '</div>' + prototypeNote('Само за проверка на подреждането', 'Първо се отсяват само релевантните и публикувани фирми. В подходяща категория защитената фирма запазва позицията си. Ако човек търси друга фирма по точно име, точната фирма е първа.') +
      '</div></section></div>';
  }

  function firmDetail() {
    return '<div class="page">' + crumbs([['Фирми', 'firms'], ['Иванов Ремонти']]) +
      head('Фирмен профил', 'Иванов Ремонти', 'Разширен публичен профил с одобрените секции и действия.') +
      '<section class="section"><div class="container detail-layout"><div>' +
      '<article class="detail-card"><h2>Кратко представяне</h2><p>Професионални ремонтни и довършителни дейности.</p><div class="detail-actions"><button class="primary" type="button">Обади се</button><button class="secondary" type="button">Поискай оферта</button><button class="secondary" type="button">Сайт</button><button class="secondary" type="button">Сподели</button></div></article>' +
      '<article class="detail-card"><h2>Услуги</h2><p>Цялостни ремонти · шпакловка · боядисване · бани и плочки.</p></article>' +
      '<article class="detail-card"><h2>Район на работа</h2><p>Лом и района според публикуваните данни.</p></article>' +
      '<article class="detail-card"><h2>Преди и след</h2><div class="upload-box">Място за одобреното визуално съдържание.</div></article>' +
      '<article class="detail-card"><h2>Галерия</h2><div class="upload-box">Одобрени снимки на обекти и услуги.</div></article>' +
      '<article class="detail-card"><h2>Контакти и работно време</h2><p>Показва се само актуалната публикувана информация.</p></article>' +
      prototypeNote('Защитен профил', 'Новата V6 визия може да пренареди секциите визуално, но не може да премахне разширения профил, контактните действия или връзките към обявите и Строителство.') +
      '</div></div></section></div>';
  }

  function listingDetail(kind) {
    var adminKind = kind === 'admin';
    return '<div class="page">' + crumbs([['Обяви и услуги', 'marketplace'], ['Обява']]) +
      head('Обява', adminKind ? 'Иванов Ремонти — примерна обява' : 'Примерна публична обява', 'Публична страница на активна одобрена обява.') +
      '<section class="section"><div class="container"><article class="detail-card"><span class="badge verified">Публикувана</span><p>Подробно описание на обявата, цена, район и контакт.</p><div class="detail-actions"><button class="primary" type="button">Обади се</button><button class="secondary" type="button">Сподели</button><button class="secondary" type="button">Докладвай</button>' +
      (adminKind ? '<button class="secondary" type="button">Статистики</button>' : '') +
      '</div></article>' +
      (adminKind ? prototypeNote('Администраторска разширена функция', 'Бутонът за статистики е представен без измислени числа. Реалните стойности трябва да идват от реалната аналитична система.') : '') +
      '</div></section></div>';
  }

  function listingForm(data) {
    data = data || {};
    var edit = data.edit === '1' || data.mode === 'edit';
    var isAdmin = role === 'admin';
    var isModerator = role === 'moderator';
    var title = edit ? 'Редактирай обява' : 'Добави обява';
    var submit = isAdmin ? (edit ? 'Запази и публикувай' : 'Публикувай обявата') : (edit ? 'Изпрати редакцията' : 'Изпрати за преглед');
    var roleMessage = isAdmin
      ? 'Публикуването е директно. Не се използва месечната квота за обикновени потребители.'
      : (isModerator
        ? 'Собствената обява на модератора е като нормална потребителска обява: чака преглед и не може да бъде одобрена от самия модератор.'
        : 'Новата обява чака преглед. Личната и фирмената квота са отделни — до 5 нови обяви на месец за всеки разрешен поток.');
    if (edit && !isAdmin) roleMessage += ' Редакцията не използва нова квота. Ако обявата вече е публична, текущата версия остава видима до одобрението на редакцията.';

    var publisher = isAdmin ? '' : field('Публикувай като', '<select id="v6-listing-publisher"><option>Лична обява</option><option>Примерна моя одобрена фирма</option></select>', 'В реалния сайт се показват само твоите одобрени фирми.');
    var adminOptions = isAdmin ? '<section class="v6-admin-options"><h2>Разширени функции за администратора</h2><div class="v6-check-grid">' +
      check('Спешно') + check('Намалено') + check('Горно позициониране') + check('Откроена обява') + check('Статистики') + check('Плаващи контактни бутони') +
      '</div><p>Тези възможности не се показват на обикновен потребител или модератор.</p></section>' : '';

    return '<div class="page">' + crumbs([['Обяви и услуги', 'marketplace'], [title]]) +
      head('Обява', title, 'V6 подрежда по-ясно съществуващата защитена форма, без да променя правата, лимитите и одобрението.') +
      '<section class="section"><div class="narrow">' + roleNote(roleMessage) +
      '<form class="form-shell" data-v6-form="listing" data-v6-edit="' + (edit ? '1' : '0') + '">' +
      '<div class="v6-form-steps"><strong>1. Намерение</strong><strong>2. Група</strong><strong>3. Подкатегория</strong><strong>4. Детайли</strong></div>' +
      '<div class="v6-choice-row"><button type="button" class="active" data-v6-intent="offer">Предлагам</button><button type="button" data-v6-intent="seek">Търся</button></div>' +
      publisher +
      field('Главна група', '<select id="v6-listing-group" required><option value="construction">Майстори и ремонти</option><option value="cars">Автомобили</option><option value="services">Други услуги</option><option value="other">Други обяви</option></select>') +
      field('Подкатегория', '<select id="v6-listing-subcategory" required></select>') +
      field('Вид на обявата', '<select id="v6-listing-type" required></select>', 'За Работа и Имоти видовете се сменят автоматично според избраната подкатегория.') +
      field('Заглавие', '<input required minlength="5" maxlength="120" placeholder="Например: Ремонт и боядисване">') +
      field('Описание', '<textarea required minlength="20" rows="7" placeholder="Опиши обявата подробно..."></textarea>') +
      '<div class="field-grid">' +
        field('Цена в евро', '<input id="v6-price-eur" type="number" min="0" step="0.01" placeholder="0.00"><small id="v6-price-bgn"></small>') +
        field('Телефон', '<input type="tel" required placeholder="0876 123 456">') +
      '</div>' +
      '<div class="v6-check-grid">' + check('Договаряне') + check('Подарява (безплатно)') + '</div>' +
      '<div class="field-grid">' + field('Град / район', '<input placeholder="Лом">') + field('Улица (по желание)', '<input placeholder="ул. Васил Левски 5">') + '</div>' +
      '<section class="v6-upload"><h2>Снимки</h2><p>' + (isAdmin ? 'Администраторът не използва обикновения лимит до 6 снимки. Точната техническа граница се проверява отделно преди production.' : 'До 6 снимки. Първата е главна.') + '</p><button type="button" class="secondary">Избери снимки</button></section>' +
      adminOptions +
      '<label class="check-row"><input type="checkbox" required> Прочетох и приемам правилата на общността.</label>' +
      '<div class="form-actions"><button class="secondary" type="button" data-route="profile">Отказ</button><button class="primary" type="submit">' + submit + '</button></div>' +
      '</form></div></section></div>';
  }

  function check(label) {
    return '<label class="check-row"><input type="checkbox"> ' + esc(label) + '</label>';
  }

  function expandedFields() {
    return '<section class="v6-expanded-fields"><h2>Разширен профил</h2>' +
      field('Кратко представяне', '<textarea rows="4"></textarea>') + check('Покажи краткото представяне') +
      field('Сайт', '<input type="url" placeholder="https://example.com">') + check('Покажи бутона „Сайт“') +
      field('Услуги', '<textarea rows="6" placeholder="По една услуга на ред"></textarea>') + check('Покажи услугите') +
      field('Район на работа', '<textarea rows="3"></textarea>') + check('Покажи района на работа') +
      field('Разширено работно време', '<textarea rows="3"></textarea>') + check('Покажи разширеното работно време') +
      '</section>';
  }

  function firmForm(data) {
    data = data || {};
    var edit = data.edit === '1' || data.mode === 'edit';
    var granted = data.expandedGranted === '1';
    var isAdmin = role === 'admin';
    var isModerator = role === 'moderator';
    var title = edit ? 'Редактирай фирма' : 'Добави фирма';
    var submit = isAdmin ? (edit ? 'Запази и публикувай' : 'Публикувай фирмата') : (edit ? 'Изпрати редакцията' : 'Изпрати за преглед');
    var text = isAdmin
      ? 'Администраторската фирма се публикува директно и получава разширен достъп автоматично.'
      : (isModerator
        ? 'Собствената фирма на модератора е нормална фирма: няма директно публикуване, няма автоматичен разширен достъп и модераторът не може сам да я одобри.'
        : 'Новата фирма чака преглед и започва без разширен достъп.');
    if (edit && !isAdmin) text += ' Публикуваната версия остава видима, докато редакцията чака одобрение.';
    if (granted && !isAdmin) text += ' За този пример разширеният достъп вече е даден от администратор; собственикът не може сам да го включва или изключва.';

    var extended = (isAdmin || (edit && granted)) ? expandedFields() : '';
    return '<div class="page">' + crumbs([['Фирми', 'firms'], [title]]) +
      head('Фирма', title, 'V6 запазва базовия и разширения фирмен поток, като ги подрежда в една по-ясна форма.') +
      '<section class="section"><div class="narrow">' + roleNote(text) +
      '<form class="form-shell" data-v6-form="firm" data-v6-edit="' + (edit ? '1' : '0') + '">' +
      field('Име на фирмата', '<input required minlength="2" maxlength="120">') +
      field('Категория', '<select required><option value="">Избери</option><option>Строителство и ремонти</option><option>Заведения и храна</option><option>Красота</option><option>Други услуги</option></select>') +
      '<div class="field-grid">' + field('Телефон', '<input type="tel" required>') + field('Град (по желание)', '<input placeholder="Лом">') + '</div>' +
      field('Адрес (по желание)', '<input placeholder="ул. Васил Левски 5">') +
      field('Работно време (по желание)', '<input placeholder="Пон–Пет: 8:00–18:00">') +
      field('Описание', '<textarea required minlength="20" rows="7"></textarea>') +
      extended +
      '<section class="v6-upload"><h2>Лого (по желание)</h2><p>1 лого.</p><button type="button" class="secondary">Избери лого</button></section>' +
      '<section class="v6-upload"><h2>Снимки на обекти и услуги</h2><p>' + (isAdmin ? 'Разширеният администраторски профил не се свежда до базовото ограничение от 6 снимки.' : 'До 6 снимки в базовия профил.') + '</p><button type="button" class="secondary">Избери снимки</button></section>' +
      '<div class="form-actions"><button class="secondary" type="button" data-route="profile">Отказ</button><button class="primary" type="submit">' + submit + '</button></div>' +
      '</form></div></section></div>';
  }

  function profile() {
    var content = '';
    if (role === 'admin') {
      content = profileRow('Публикувана', 'Администраторска обява', '<button data-route="form-listing" data-edit="1">Редактирай</button>') +
        profileRow('Публикувана', 'Иванов Ремонти', '<button data-route="form-firm" data-edit="1">Редактирай</button>');
    } else {
      content = profileRow('Чака преглед', role === 'moderator' ? 'Моя обява като модератор' : 'Моя обява', '<button data-route="form-listing" data-edit="1">Редактирай</button>') +
        profileRow('Публикувана', 'Моя фирма', '<button data-route="form-firm" data-edit="1">Редактирай</button>') +
        profileRow('Публикувана · разширен достъп е даден от администратора', 'Моя фирма с разширен достъп', '<button data-route="form-firm" data-edit="1" data-expanded-granted="1">Редактирай</button>');
    }
    return '<div class="page">' + crumbs([['Профил']]) + head('Личен профил', 'Моят профил', 'Тук се виждат собствените фирми, обяви, въпроси и техните състояния.') +
      '<section class="section"><div class="container">' + roleNote(roleRuleText()) + '<div class="profile-stack">' + content + '</div>' +
      (role === 'moderator' ? prototypeNote('Важно за модератора', 'Модераторът може да работи по чуждо съдържание през разрешения административен поток, но не може да одобрява собствената си фирма, обява или чернова.') : '') +
      '</div></section></div>';
  }

  function profileRow(state, title, action) {
    return '<article class="profile-row"><div class="body"><span class="badge">' + esc(state) + '</span><strong>' + esc(title) + '</strong></div>' + action + '</article>';
  }

  function render(routeName, data) {
    current = { route: routeName, data: data || {} };
    if (routeName === 'marketplace') return finish(marketplace(), 'marketplace');
    if (routeName === 'category') return finish(category((data && data.category) || 'construction'), 'marketplace');
    if (routeName === 'firms') return finish(firms(), 'firms');
    if (routeName === 'firm-detail') return finish(firmDetail(), 'firms');
    if (routeName === 'listing-detail') return finish(listingDetail((data && data.listingKind) || 'normal'), 'marketplace');
    if (routeName === 'form-listing') return finish(listingForm(data), 'marketplace');
    if (routeName === 'form-firm') return finish(firmForm(data), 'firms');
    if (routeName === 'profile') return finish(profile(), 'profile');
  }

  function readRouteData(element) {
    return {
      category: element.getAttribute('data-category') || element.getAttribute('data-prefill-category') || '',
      edit: element.getAttribute('data-edit') || '',
      expandedGranted: element.getAttribute('data-expanded-granted') || '',
      listingKind: element.getAttribute('data-listing-kind') || ''
    };
  }

  function updateSubcategories() {
    var group = document.getElementById('v6-listing-group');
    var sub = document.getElementById('v6-listing-subcategory');
    if (!group || !sub) return;
    var values = groupSubs[group.value] || [];
    var previous = sub.value;
    sub.innerHTML = values.map(function (value) { return '<option>' + esc(value) + '</option>'; }).join('');
    if (values.indexOf(previous) >= 0) sub.value = previous;
    updateListingType();
  }

  function updateListingType() {
    var group = document.getElementById('v6-listing-group');
    var sub = document.getElementById('v6-listing-subcategory');
    var type = document.getElementById('v6-listing-type');
    if (!group || !sub || !type) return;
    var intent = document.querySelector('[data-v6-intent].active');
    var intentValue = intent ? intent.getAttribute('data-v6-intent') : 'offer';
    var values;
    if (sub.value === 'Работа') {
      values = ['Предлага работа', 'Търси работа'];
    } else if (sub.value === 'Имоти') {
      values = ['Продава имот', 'Отдава под наем', 'Търси под наем', 'Търси за купуване'];
    } else if (group.value === 'construction' || group.value === 'services') {
      values = intentValue === 'offer' ? ['Предлагам услуга'] : ['Търся услуга'];
    } else if (group.value === 'cars' && sub.value !== 'Автомобили за продажба или търсене') {
      values = intentValue === 'offer' ? ['Предлагам услуга'] : ['Търся услуга'];
    } else {
      values = intentValue === 'offer' ? ['Продавам', 'Подарявам'] : ['Купувам', 'Търся'];
    }
    type.innerHTML = values.map(function (value) { return '<option>' + esc(value) + '</option>'; }).join('');
  }

  function setupListingDynamics() {
    updateSubcategories();
    var price = document.getElementById('v6-price-eur');
    var bgn = document.getElementById('v6-price-bgn');
    if (price && bgn) {
      price.addEventListener('input', function () {
        var value = parseFloat(price.value);
        bgn.textContent = value > 0 ? '≈ ' + (value * 1.95583).toFixed(2).replace('.', ',') + ' лв.' : '';
      });
    }
  }

  function submitPrototype(form) {
    var type = form.getAttribute('data-v6-form');
    var edit = form.getAttribute('data-v6-edit') === '1';
    var title;
    var text;
    if (type === 'listing') {
      if (role === 'admin') {
        title = edit ? 'Промените са публикувани' : 'Обявата е публикувана';
        text = 'Администраторският поток публикува директно.';
      } else {
        title = edit ? 'Редакцията е изпратена' : 'Обявата е изпратена';
        text = edit ? 'Публикуваната версия остава видима до одобряване на редакцията.' : 'Обявата чака преглед и ще стане публична след одобрение.';
      }
    } else {
      if (role === 'admin') {
        title = edit ? 'Промените са публикувани' : 'Фирмата е публикувана';
        text = 'Администраторската фирма е публична и запазва разширения си достъп.';
      } else {
        title = edit ? 'Редакцията е изпратена' : 'Фирмата е изпратена';
        text = edit ? 'Последната одобрена публична версия остава видима до одобряване на редакцията.' : 'Фирмата чака преглед преди публикуване.';
      }
    }
    form.innerHTML = '<section class="state-box success"><h2>' + esc(title) + '</h2><p>' + esc(text) + '</p><div class="form-actions">' + button('Към профила', 'profile', 'class="primary"') + '</div></section>';
  }

  document.addEventListener('click', function (event) {
    var roleButton = event.target.closest('[data-v6-role]');
    if (roleButton) {
      event.preventDefault();
      event.stopImmediatePropagation();
      role = roleButton.getAttribute('data-v6-role') || 'normal';
      syncRoleButtons();
      if (current.route && handled.has(current.route)) render(current.route, current.data);
      return;
    }

    var intentButton = event.target.closest('[data-v6-intent]');
    if (intentButton && app.contains(intentButton)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      document.querySelectorAll('[data-v6-intent]').forEach(function (element) { element.classList.remove('active'); });
      intentButton.classList.add('active');
      updateListingType();
      return;
    }

    var routeButton = event.target.closest('[data-route]');
    if (!routeButton) return;
    var routeName = routeButton.getAttribute('data-route');
    if (!handled.has(routeName)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    render(routeName, readRouteData(routeButton));
  }, true);

  document.addEventListener('change', function (event) {
    if (event.target && (event.target.id === 'v6-listing-group' || event.target.id === 'v6-listing-subcategory')) {
      if (event.target.id === 'v6-listing-group') updateSubcategories();
      else updateListingType();
    }
  }, true);

  document.addEventListener('submit', function (event) {
    var form = event.target.closest('[data-v6-form]');
    if (!form) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    submitPrototype(form);
  }, true);

  injectRoleReview();
})();