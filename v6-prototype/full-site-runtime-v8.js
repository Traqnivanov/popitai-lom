(function () {
  'use strict';

  const app = document.getElementById('app');
  const addSheet = document.getElementById('add-sheet');
  const menu = document.getElementById('mobile-drawer');
  const menuTrigger = document.getElementById('menu-trigger');
  const toast = document.getElementById('toast');
  if (!app) return;

  const state = {
    role: 'user',
    route: 'home',
    ctx: {},
    shopTab: 'food',
    healthTab: 'bolnica',
    eventTab: 'upcoming',
    searchState: 'success'
  };

  const categories = [
    ['construction', 'Строителство и ремонти', 'Майстори, ВиК, електро, покриви'],
    ['health', 'Здраве и лекари', 'Болница, лекари, аптеки и лаборатории'],
    ['work', 'Работа', 'Работа и позиции в Лом'],
    ['cars', 'Автомобили', 'Коли, сервизи, гуми и части'],
    ['property', 'Имоти', 'Продажба, наем и търсене на имоти'],
    ['beauty', 'Красота', 'Фризьори, козметика и грижа'],
    ['home', 'Дом и градина', 'Мебели, двор, инструменти и дом'],
    ['shops', 'Магазини', 'Местни магазини по вид'],
    ['restaurants', 'Заведения и храна', 'Ресторанти, кафенета и храна'],
    ['electronics', 'Електроника', 'Телефони, компютри и техника'],
    ['kids', 'Деца и бебета', 'Детски стоки и услуги'],
    ['animals', 'Животни', 'Домашни любимци и грижа'],
    ['fashion', 'Мода', 'Дрехи, обувки и аксесоари'],
    ['sport', 'Спорт и хоби', 'Спорт, свободно време и хоби'],
    ['services', 'Други услуги', 'Местни услуги извън основните групи'],
    ['other', 'Други обяви', 'Останалите местни обяви']
  ];

  const infoFamilies = {
    institutions: ['Институции', 'Община, полиция, НОИ и държавни служби'],
    transport: ['Транспорт', 'Автобуси, БДЖ и таксита'],
    education: ['Образование и култура', 'Училища, детски градини и културни места'],
    banks: ['Банки и банкомати', 'Офиси, банкомати и банкови услуги'],
    utilities: ['Комунални и ежедневни услуги', 'Вода, ток, чистота, куриери и интернет']
  };

  const shopMeta = {
    food: { label: 'Хранителни', title: 'Хранителни магазини в Лом', lead: 'Супермаркети и местни хранителни магазини.', add: 'хранителен магазин', tags: ['Супермаркет', 'Месо и колбаси', 'Плодове и зеленчуци'] },
    construction: { label: 'Строителни', title: 'Строителни магазини в Лом', lead: 'Материали, железария, бои, санитария и обзавеждане за ремонт.', add: 'строителен магазин', tags: ['Строителни материали', 'Бои', 'Железария', 'Санитария'] },
    tech: { label: 'Техника', title: 'Магазини за техника в Лом', lead: 'Електроника, телефони и бяла/черна техника.', add: 'магазин за техника', tags: ['Телефони', 'Компютри', 'Бяла техника'] },
    furniture: { label: 'Мебели', title: 'Мебелни магазини в Лом', lead: 'Мебели, обзавеждане и решения за дома.', add: 'мебелен магазин', tags: ['Кухни', 'Мека мебел', 'Спални'] },
    clothes: { label: 'Дрехи', title: 'Магазини за дрехи в Лом', lead: 'Дрехи, обувки и аксесоари.', add: 'магазин за дрехи', tags: ['Дамски', 'Мъжки', 'Обувки'] },
    home: { label: 'Дом', title: 'Магазини за дома в Лом', lead: 'Домашни потреби, подаръци, градина и специализирани стоки.', add: 'магазин за дома', tags: ['Домашни потреби', 'Градина', 'Подаръци'] }
  };

  const healthTabs = [
    ['bolnica', 'Болница'], ['lekari', 'Лекари'], ['apteki', 'Аптеки'], ['stomatolozi', 'Стоматолози'],
    ['veterinari', 'Ветеринари'], ['vet-apteki', 'Вет. аптеки'], ['laboratorii', 'Лаборатории']
  ];

  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));

  function routeButton(label, route, attrs = '') {
    return `<button type="button" ${attrs} data-route="${esc(route)}">${label}</button>`;
  }

  function breadcrumbs(items) {
    return `<nav class="breadcrumbs" aria-label="Навигационна пътека"><button type="button" data-route="home">Начало</button>${items.map((item, index) => ` <span>›</span> ${item[1] ? `<button type="button" data-route="${esc(item[1])}">${esc(item[0])}</button>` : `<span${index === items.length - 1 ? ' aria-current="page"' : ''}>${esc(item[0])}</span>`}`).join('')}</nav>`;
  }

  function head(kicker, title, lead, actions = '') {
    return `<section class="page-hero"><div class="container">${kicker ? `<span class="kicker">${esc(kicker)}</span>` : ''}<h1>${esc(title)}</h1><p>${esc(lead)}</p>${actions ? `<div class="hero-actions">${actions}</div>` : ''}</div></section>`;
  }

  function field(label, control, help = '') {
    return `<div class="field"><label>${esc(label)}${control}</label>${help ? `<small>${help}</small>` : ''}<span data-field-error aria-live="polite"></span></div>`;
  }

  function check(label, name, checked = false) {
    return `<label class="check-row"><input type="checkbox" name="${esc(name)}" ${checked ? 'checked' : ''}> <span>${label}</span><span data-field-error aria-live="polite"></span></label>`;
  }

  function formShell(type, title, lead, body, options = {}) {
    const edit = options.edit ? '1' : '0';
    const submit = options.submit || 'Изпрати за преглед';
    return `<div class="page">${breadcrumbs([[title]])}${head('Форма', title, lead)}<section class="section"><div class="narrow"><form class="form-shell" data-v8-form="${esc(type)}" data-edit="${edit}" novalidate>${body}<div class="form-actions"><button class="secondary" type="button" data-cancel-form data-route="${esc(options.cancel || 'profile')}">Отказ</button><button class="primary" type="submit">${esc(submit)}</button></div></form></div></section></div>`;
  }

  function mediaBlock(id, title, max, note) {
    const limit = max > 0 ? String(max) : 'без backend лимит за Admin';
    return `<section class="v8-media" data-v8-media data-media-max="${max}" id="${esc(id)}"><div class="v8-media-head"><div><strong>${esc(title)}</strong><div class="v8-media-help">${esc(note)}</div></div><strong data-media-count>0 / ${esc(limit)}</strong></div><label class="v8-media-drop" data-media-drop><input type="file" name="${esc(id)}_files" accept="image/jpeg,image/png,image/webp" multiple hidden data-media-input><strong>Избери снимки или ги пусни тук</strong><div class="v8-media-help">JPG, PNG или WebP. Prototype preview/remove/caption; production owner запазва реалната оптимизация и вариантите.</div></label><div class="v8-media-error" data-media-error aria-live="polite"></div><div class="v8-media-grid" data-media-grid></div></section>`;
  }

  function home() {
    const main = categories.slice(0, 4).map((c, index) => `<button class="category-card${index === 0 ? ' featured' : ''}${c[0] === 'health' ? ' health' : ''}" data-route="${c[0] === 'health' ? 'health' : 'category'}" data-category="${c[0]}"><strong>${esc(c[1])}</strong><small>${esc(c[2])}</small></button>`).join('');
    return `<div class="page home-page"><section class="hero"><div class="container hero-grid"><div><span class="kicker">Лом на едно място</span><h1>Какво търсиш в Лом?</h1><p>Намери проверена информация, местни услуги, работа, имоти, фирми и полезни отговори — всичко за Лом на едно място.</p><form class="search-box" data-v8-search><input type="search" name="q" placeholder="Например: ВиК майстор, НОИ, работа, аптека..."><button type="submit">Търси</button></form></div><aside class="hero-side"><strong>Едно търсене, правилният източник</strong><p>Факти, фирми, обяви, въпроси и ръководства остават различни типове съдържание.</p></aside></div></section><section class="section"><div class="container"><div class="section-head"><div><span class="eyebrow">Бърз старт</span><h2>Основни категории</h2></div>${routeButton('Всички категории →','categories','class="text-button"')}</div><div class="category-grid home-priority">${main}</div></div></section><section class="section soft"><div class="container"><div class="section-head"><div><span class="eyebrow">Местни места и профили</span><h2>Открий в Лом</h2></div></div><div class="discover-grid"><button class="discover-card" data-route="shops"><div><strong>Магазини</strong><small>Местни магазини по категории</small></div><span>→</span></button><button class="discover-card" data-route="restaurants"><div><strong>Заведения</strong><small>Заведения и постоянни профили</small></div><span>→</span></button><button class="discover-card" data-route="firms"><div><strong>Фирми</strong><small>Постоянни местни профили</small></div><span>→</span></button><button class="discover-card" data-route="events"><div><strong>Събития</strong><small>Предстоящи одобрени събития</small></div><span>→</span></button></div></div></section><section class="section"><div class="container"><div class="info-panel"><div class="info-panel-head"><div><span class="eyebrow">Инфо Лом</span><h2>Проверена информация</h2></div></div><div class="info-grid"><button class="info-card" data-route="health"><strong>Здраве</strong><small>Болница, лекари, аптеки</small></button><button class="info-card" data-route="info-detail" data-info="institutions"><strong>Институции</strong><small>Община, НОИ, полиция</small></button><button class="info-card" data-route="info-detail" data-info="transport"><strong>Транспорт</strong><small>Автогара, БДЖ, таксита</small></button><button class="info-card" data-route="info-detail" data-info="education"><strong>Образование и култура</strong><small>Училища и културни места</small></button><button class="info-card" data-route="info-detail" data-info="banks"><strong>Банки и банкомати</strong><small>Офиси и банкомати</small></button><button class="info-card" data-route="info-detail" data-info="utilities"><strong>Комунални услуги</strong><small>Вода, ток, куриери, интернет</small></button></div></div></div></section><section class="section soft"><div class="container"><div class="section-head"><div><span class="eyebrow">Стъпка по стъпка</span><h2>Полезни ръководства</h2></div>${routeButton('Всички статии →','articles','class="text-button"')}</div><div class="guide-grid"><button class="guide-card" data-route="article-detail" data-article="pension"><span class="topic">Институции</span><h3>Как да се пенсионираш в Лом</h3><p>Какво да провериш и къде е актуалната информация.</p></button><button class="guide-card" data-route="article-detail" data-article="id-card"><span class="topic">Институции</span><h3>Как се подменя лична карта в Лом</h3><p>Стъпките и официалните източници.</p></button><button class="guide-card" data-route="article-detail" data-article="signal"><span class="topic">Институции</span><h3>Как да подадеш сигнал до община или институция</h3><p>Кога, къде и как да опишеш проблема.</p></button></div></div></section><section class="section"><div class="container"><div class="section-head"><div><span class="eyebrow">Въпроси и препоръки</span><h2>Полезно от хората в Лом</h2></div>${routeButton('Всички въпроси →','questions','class="text-button"')}</div><div class="community-list"><button class="community-row" data-route="question-detail"><div class="body"><span class="badge">Строителство</span><strong>Кой препоръчва добър майстор за баня?</strong><small>4 одобрени отговора</small></div><span>→</span></button><button class="community-row" data-route="question-detail"><div class="body"><span class="badge">Автомобили</span><strong>Къде в Лом правят добра диагностика?</strong><small>3 одобрени отговора</small></div><span>→</span></button></div></div></section></div>`;
  }

  function categoriesPage() {
    return `<div class="page">${breadcrumbs([['Всички категории']])}${head('16 тематични входа','Всички категории','Избери тема. Съдържанието идва от правилния owner и не се дублира.')}<section class="section"><div class="container"><div class="category-grid">${categories.map(c => `<button class="category-card" data-route="${c[0] === 'health' ? 'health' : c[0] === 'shops' ? 'shops' : c[0] === 'restaurants' ? 'restaurants' : 'category'}" data-category="${c[0]}"><strong>${esc(c[1])}</strong><small>${esc(c[2])}</small></button>`).join('')}</div></div></section></div>`;
  }

  function marketplace() {
    const preferred = ['construction','cars','services','other'];
    return `<div class="page">${breadcrumbs([['Обяви и услуги']])}${head('Местният marketplace','Обяви и услуги','Един вход за майстори, услуги, работа, имоти, автомобили и останалите обяви.',routeButton('+ Добави обява','form-listing','class="primary"'))}<section class="section"><div class="container"><form class="search-box" data-v8-search><input name="q" placeholder="Какво търсиш?"><button>Търси</button></form><div class="market-grid" style="margin-top:20px">${preferred.map(id => { const c = categories.find(x => x[0] === id) || categories.at(-1); return `<button class="market-card" data-route="category" data-category="${id}"><strong>${esc(c[1])}</strong><small>${esc(c[2])}</small></button>`; }).join('')}</div><details style="margin-top:16px"><summary><strong>Всички категории</strong></summary><div class="v8-filterbar">${categories.map(c => `<button type="button" data-route="${c[0] === 'health' ? 'health' : c[0] === 'shops' ? 'shops' : c[0] === 'restaurants' ? 'restaurants' : 'category'}" data-category="${c[0]}">${esc(c[1])}</button>`).join('')}</div></details><div class="result-section-title"><h2>Активни обяви и услуги</h2><span class="badge">Публикувани и активни</span></div><div class="result-list"><article class="result-card"><div class="logo">О</div><div class="body"><span class="badge">Предлага</span><h3>Ремонт и боядисване</h3><p>Лом · активна обява</p></div><div class="actions">${routeButton('Виж обявата','listing-detail')}</div></article></div></div></section></div>`;
  }

  function categoryPage(id) {
    const c = categories.find(x => x[0] === id) || categories[0];
    const sub = {
      construction:['Цялостни ремонти','Бани и плочки','ВиК','Електро','Покриви','Боядисване','Дограма','Климатици'],
      cars:['Автомобили','Авточасти','Автосервизи','Диагностика','Гуми','Автомивки','Пътна помощ'],
      work:['Предлага работа','Търси работа'],
      property:['Продажба','Наем','Търси имот'],
      services:['Домашна помощ','Компютърни услуги','Фото и видео','Професионални услуги','Обучение и уроци','Транспорт и доставки']
    }[id] || ['Всички','Предлага','Търси'];
    const firm = id === 'construction' ? `<article class="result-card"><div class="logo">ИР</div><div class="body"><div class="badges"><span class="badge verified">Публикуван профил</span><span class="badge priority">Защитен приоритет след relevance</span></div><h3>Иванов Ремонти</h3><p>Релевантен Firms резултат.</p></div><div class="actions">${routeButton('Виж профила','firm-detail')}</div></article>` : '';
    return `<div class="page">${breadcrumbs([['Обяви и услуги','marketplace'],[c[1]]])}${head('Категория',c[1],c[2],`<button class="primary" type="button" data-route="form-listing" data-prefill-category="${id}">+ Добави обява</button><button class="secondary" type="button" data-route="form-question" data-prefill-category="${id}">Попитай Лом</button>`)}<section class="section"><div class="container"><form class="search-box" data-v8-search><input name="q" placeholder="Търси в ${esc(c[1])}"><button>Намери</button></form><div class="subcategory-grid">${sub.map(s => `<button type="button" data-route="form-listing" data-prefill-category="${id}" data-prefill-subcategory="${esc(s)}">${esc(s)}</button>`).join('')}</div><div class="result-section-title"><h2>Релевантни резултати</h2></div><div class="result-list">${firm}<article class="result-card"><div class="logo">О</div><div class="body"><span class="badge">Публикувана активна обява</span><h3>Примерен активен резултат</h3><p>Owner: Listings.</p></div><div class="actions">${routeButton('Виж обявата','listing-detail')}</div></article></div></div></section></div>`;
  }

  function listingDetail() {
    return `<div class="page">${breadcrumbs([['Обяви и услуги','marketplace'],['Обява']])}${head('Публикувана обява','Ремонт на баня и полагане на плочки','Лом · публикувана активна обява')}<section class="section"><div class="container detail-layout"><div><article class="detail-card"><div class="v8-qa-gallery"><div>Снимка 1</div><div>Снимка 2</div><div>Снимка 3</div></div><h2>Описание</h2><p>Тук се пазят реалните снимки, описание, цена, контакт и owner контекст на обявата.</p><p><strong>Цена:</strong> 1 250 € <small>≈ 2 445 лв.</small></p><div class="detail-actions"><button class="primary" data-action="call">Обади се</button><button class="secondary" data-action="share">Сподели</button><button class="secondary" data-route="report" data-target="listing">Докладвай</button></div></article></div></div></section></div>`;
  }

  function listingForm(ctx = {}) {
    const admin = state.role === 'admin';
    const moderator = state.role === 'moderator';
    const edit = Boolean(ctx.edit);
    const category = ctx.prefillCategory || 'construction';
    const subcategory = ctx.prefillSubcategory || '';
    const submit = admin ? (edit ? 'Запази и публикувай' : 'Публикувай обявата') : (edit ? 'Изпрати редакцията' : 'Изпрати за преглед');
    const quota = admin ? 'Администраторът не използва нормалната месечна квота.' : 'Квота: до 5 лични обяви + отделна квота за всяка собствена одобрена фирма за календарния месец. Редакция не използва нова квота.';
    const body = `<div class="v8-context-note">${moderator ? 'Модераторът публикува собственото си съдържание по същия non-Admin поток — без самоодобрение.' : admin ? 'Admin поток: директна публикация. Protected options остават Admin-only.' : 'Нормален owner поток: новата обява чака преглед.'}</div>${edit ? '<div class="v8-context-note">Редакция: последната одобрена публична версия остава видима, докато non-Admin редакцията чака преглед.</div>' : ''}<div class="v8-context-note">${quota}</div><div class="choice-grid" data-v8-choice-group><button type="button" class="active" data-v8-choice="offer">Предлагам</button><button type="button" data-v8-choice="seek">Търся</button></div>${field('Публикувам като',`<select name="publisher" required><option value="personal">Лично</option><option value="firm">Моя одобрена фирма — Иванов Пример</option></select>`)}<div class="v8-duplicate-warning"><strong>Проверка за сходна обява</strong><span>Преди create V6 проверява за сходно заглавие/контекст и предупреждава, без да блокира валидна нова публикация.</span><button type="button" data-action="duplicate-check">Провери за сходни</button></div><div class="v8-inline-grid">${field('Главна група',`<select name="listing_main" required data-listing-main><option value="construction" ${category==='construction'?'selected':''}>Строителство и ремонти</option><option value="cars" ${category==='cars'?'selected':''}>Автомобили</option><option value="work" ${category==='work'?'selected':''}>Работа</option><option value="property" ${category==='property'?'selected':''}>Имоти</option><option value="services" ${category==='services'?'selected':''}>Други услуги</option><option value="other" ${category==='other'?'selected':''}>Други обяви</option></select>`)}${field('Подкатегория',`<select name="subcategory" required data-listing-subcategory data-prefill="${esc(subcategory)}"></select>`)}</div><div data-listing-special></div>${field('Заглавие',`<input name="title" minlength="5" maxlength="120" required placeholder="Например: Ремонт на баня и полагане на плочки">`,'Напиши конкретно какво предлагаш или търсиш.')}${field('Описание',`<textarea name="description" minlength="20" maxlength="5000" rows="6" required placeholder="Опиши обхвата, състоянието, условията и важните подробности."></textarea>`)}<div class="v8-inline-grid">${field('Цена в евро',`<input name="price_eur" type="number" min="0" step="0.01" placeholder="0.00">`,'При въвеждане production показва ориентир и в лева.')}${field('Телефон',`<input name="phone" type="tel" required placeholder="08...">`)}</div>${check('Цената подлежи на договаряне','negotiable')}${check('Безплатно / подарява','free')}${field('Град',`<input name="city" value="Лом" required>`)}${field('Улица — по желание',`<input name="street" maxlength="160">`)}${mediaBlock('listing-media','Снимки към обявата',admin ? 0 : 6,admin ? 'Admin-owned listing: backend няма image limit.' : 'До 6 снимки. Първата е главна; при edit се запазва current-media workflow.')} ${admin ? `<section class="v8-admin-box"><h3>Администраторски опции</h3>${check('Спешна','urgent')}${check('Намалена цена','reduced')}${check('Позициониране по-напред след relevance','boosted')}${check('Подчертано визуално представяне','highlighted')}${check('Статистика','stats')}${check('Плаващи бутони за контакт','floating_contact')}</section>` : ''}${check('Прочетох и приемам правилата','rules')}`;
    return formShell('listing', edit ? 'Редактирай обява' : 'Добави обява', 'Пълният approved Listing owner flow е представен без промяна на роли, квоти или direct publish.', body, { edit, submit, cancel:'profile' });
  }

  function firms() {
    return `<div class="page">${breadcrumbs([['Фирми']])}${head('Местен бизнес','Фирми','Постоянни публикувани профили. Няма измислени оценки или проверка без реален източник.',routeButton('+ Добави фирма','form-firm','class="primary"'))}<section class="section"><div class="container"><form class="search-box" data-v8-local-filter data-target=".firm-result"><input type="search" placeholder="Търси фирма по име или описание"><button type="submit">Търси</button></form><div class="v8-filterbar"><button type="button" class="active">Всички категории</button><button type="button">Строителство</button><button type="button">Автомобили</button><button type="button">Заведения</button></div><div class="result-list"><article class="result-card firm-result"><div class="logo">ИР</div><div class="body"><span class="badge verified">Публикуван профил</span><h3>Иванов Ремонти</h3><p>Цялостни ремонти и довършителни дейности.</p></div><div class="actions">${routeButton('Виж профила','firm-detail')}<button data-action="call">Обади се</button></div></article></div></div></section></div>`;
  }

  function firmDetail() {
    return `<div class="page">${breadcrumbs([['Фирми','firms'],['Иванов Ремонти']])}${head('Фирмен профил','Иванов Ремонти','Разширен публичен профил с одобрените секции и действия.')}<section class="section"><div class="container detail-layout"><div><article class="detail-card"><h2>Кратко представяне</h2><p>Професионални ремонтни и довършителни дейности.</p><div class="detail-actions"><button class="primary" data-action="call">Обади се</button><button class="secondary" data-action="contact">Поискай оферта</button><button class="secondary" data-action="site">Сайт</button><button class="secondary" data-action="share">Сподели</button><button class="secondary" data-route="report" data-target="business">Подай сигнал</button></div></article><article class="detail-card"><h2>Услуги</h2><p>Цялостни ремонти · шпакловка · боядисване · бани и плочки.</p></article><article class="detail-card"><h2>Район на работа</h2><p>Лом и района според публикуваните данни.</p></article><article class="detail-card"><h2>Галерия</h2><div class="v8-qa-gallery"><div>Cover</div><div>Снимка</div><div>Снимка</div></div></article><article class="detail-card"><h2>Преди и след</h2><p>Presentation място само когато owner data реално го поддържа; не се представя като доказана текуща edit функция.</p></article><article class="detail-card"><h2>Контакти и работно време</h2><p>Телефон · работно време · сайт · бързи mobile действия.</p></article><div class="v8-context-note">Protected: V6 не премахва expanded access, contact/gallery/Construction/Listings relationships или protected ordering.</div></div></div></section></div>`;
  }

  function firmForm(ctx = {}) {
    const admin = state.role === 'admin';
    const moderator = state.role === 'moderator';
    const edit = Boolean(ctx.edit);
    const expanded = admin || Boolean(ctx.expandedGranted);
    const submit = admin ? (edit ? 'Запази и публикувай' : 'Публикувай фирмата') : (edit ? 'Изпрати редакцията' : 'Изпрати за преглед');
    const body = `<div class="v8-context-note">${moderator ? 'Модераторът работи със собствената си фирма като normal owner — без direct publish и без самоодобрение.' : admin ? 'Admin: директно публикуване + автоматичен expanded access.' : expanded ? 'Разширеният достъп е даден от Admin. Owner не може сам да го включи.' : 'Новата фирма започва без expanded access и чака преглед.'}</div>${edit && !admin ? '<div class="v8-context-note">Публикуваната версия остава видима, докато редакцията чака одобрение.</div>' : ''}<div class="v8-inline-grid">${field('Име на фирмата',`<input name="name" required maxlength="120" placeholder="Например: Иванов Ремонти">`)}${field('Категория',`<select name="category" required><option value="">Избери категория</option><option>Строителство и ремонти</option><option>Автомобили</option><option>Заведения и храна</option><option>Красота</option><option>Други услуги</option></select>`)}</div><div class="v8-inline-grid">${field('Телефон',`<input name="phone" type="tel" required>`)}${field('Град',`<input name="city" value="Лом">`)}</div>${field('Адрес',`<input name="address" maxlength="200">`)}${field('Работно време',`<input name="hours" maxlength="160">`)}${field('Описание',`<textarea name="description" required minlength="20" maxlength="3000" rows="6" placeholder="Какво предлага фирмата и за кого е полезна?"></textarea>`)}${mediaBlock('firm-logo','Лого',1,'До 1 лого за основния профил.')}${mediaBlock('firm-gallery','Галерия',admin ? 0 : 6,admin ? 'Admin-owned firm media: backend няма image limit.' : 'До 6 снимки в базовия профил.')} ${expanded ? `<section class="v8-admin-box"><h3>Разширен профил</h3>${field('Кратко представяне',`<textarea name="short_intro" rows="3"></textarea>`)}${check('Покажи краткото представяне','show_short_intro',true)}${field('Сайт',`<input name="website" type="url" placeholder="https://...">`)}${check('Покажи бутона „Сайт“','show_website',true)}${field('Услуги',`<textarea name="services" rows="5" placeholder="По една услуга на ред"></textarea>`)}${check('Покажи услугите','show_services',true)}${field('Район на работа',`<textarea name="service_area" rows="3"></textarea>`)}${check('Покажи района на работа','show_service_area',true)}${field('Разширено работно време',`<textarea name="expanded_hours" rows="3"></textarea>`)}${check('Покажи разширеното работно време','show_work_hours',true)}</section>` : ''}`;
    return formShell('firm', edit ? 'Редактирай фирма' : 'Добави фирма', 'Basic + expanded owner permissions са отделени и не се променят от V6 presentation.', body, { edit, submit, cancel:'profile' });
  }

  function infoHub() {
    return `<div class="page">${breadcrumbs([['Инфо Лом']])}${head('Проверена градска информация','Инфо Лом','Намери бързо точния контакт, услуга или място.')}<section class="section"><div class="container"><form class="search-box" data-v8-search><input name="q" placeholder="Например: ТЕЛК, данъци, Еконт, аптека..."><button>Търси</button></form><div class="category-grid" style="margin-top:18px"><button class="category-card health" data-route="health"><strong>Здраве</strong><small>Болница, лекари, аптеки</small></button>${Object.entries(infoFamilies).map(([id,v]) => `<button class="category-card" data-route="info-detail" data-info="${id}"><strong>${esc(v[0])}</strong><small>${esc(v[1])}</small></button>`).join('')}</div><div class="section-head" style="margin-top:28px"><div><span class="eyebrow">По задача</span><h2>Какво ти трябва?</h2></div></div><div class="v8-task-grid"><button class="v8-task-card" data-route="health" data-health-tab="bolnica"><strong>🏥 Спешна медицинска информация</strong><span>Прием, контакти и болница</span></button><button class="v8-task-card" data-route="info-detail" data-info="institutions"><strong>📄 Документ от общината</strong><span>Община и административни услуги</span></button><button class="v8-task-card" data-route="info-detail" data-info="utilities"><strong>💧 Нямам вода</strong><span>ВиК и аварийни контакти</span></button><button class="v8-task-card" data-route="info-detail" data-info="utilities"><strong>⚡ Нямам ток</strong><span>Електроразпределение и аварии</span></button><button class="v8-task-card" data-route="info-detail" data-info="banks"><strong>🏧 Търся банкомат</strong><span>Банкови офиси и банкомати</span></button></div></div></section></div>`;
  }

  function infoDetail(id) {
    const meta = infoFamilies[id] || infoFamilies.institutions;
    const examples = {
      institutions: { sub:['Община','Полиция','НОИ','Други'], name:'Община Лом', fact:'ул. „Дунавска“ №12 · централа 0971 69 101', action:'Официална страница', source:'Официален източник', fresh:'Последно потвърдено: актуална проверена информация' },
      transport: { sub:['Автобуси','ЖП / БДЖ','Таксита'], name:'Автогара Лом', fact:'Разписания, адрес и контакт за пътуване', action:'Провери разписание', source:'Официален/операторски източник', fresh:'Последно потвърдено според източника' },
      education: { sub:['Училища','Детски градини','Читалища','Култура'], name:'Училище / културен обект', fact:'Адрес, телефон и официална информация', action:'Официална страница', source:'Официален източник', fresh:'Последно потвърдено' },
      banks: { sub:['Банкови офиси','Банкомати'], name:'Банков офис / банкомат', fact:'Местоположение и налична публична информация', action:'Виж официална информация', source:'Банка / официален източник', fresh:'Проверено според наличния източник' },
      utilities: { sub:['ВиК','Ток','Чистота','Интернет и телевизия','Куриери'], name:'Аварии и ежедневни услуги', fact:'Бърз контакт по конкретна задача, без смесване с marketplace', action:'Официален контакт', source:'Доставчик / официален източник', fresh:'Последно потвърдено' }
    };
    const x = examples[id] || examples.institutions;
    return `<div class="page">${breadcrumbs([['Инфо Лом','info'],[meta[0]]])}${head('Проверена информация',meta[0],meta[1],`<button class="secondary" data-route="correction" data-info="${id}">Предложи корекция</button>`)}<section class="section"><div class="container"><div class="v8-subnav">${x.sub.map((s,i)=>`<button type="button" class="${i===0?'active':''}">${esc(s)}</button>`).join('')}</div><article class="v8-rich-card" style="margin-top:16px"><div class="trust"><span>Потвърдено</span><span>${esc(x.source)}</span><span>${esc(x.fresh)}</span></div><h3>${esc(x.name)}</h3><div class="fact">📍 <span>${esc(x.fact)}</span></div><div class="official"><strong>Актуален източник</strong><p>Променливите телефони, адреси и работно време остават при Info owner и се показват със source/freshness.</p></div><div class="actions"><button class="primary" data-action="official">${esc(x.action)}</button><button class="secondary" data-route="correction" data-info="${id}">Предложи корекция</button></div></article></div></section></div>`;
  }

  function health() {
    const tab = state.healthTab;
    let content = '';
    if (tab === 'bolnica') {
      content = `<article class="v8-rich-card"><div class="trust"><span>Потвърдено</span><span>Официален/проверен източник</span><span>Последно потвърдено</span></div><h3>МБАЛ „Св. Николай Чудотворец“</h3><div class="fact">📍 <span>Проверен адрес и контакти от Health/Info owner</span></div><div class="actions"><button class="primary" data-action="call">Централа</button><button data-action="official">Официален сайт</button></div><section class="v8-admission"><div><span class="kicker">ВАЖНО ЗА ПАЦИЕНТИ</span><h3>Прием в болницата</h3></div><div class="v8-admission-grid"><div><strong>Спешни болни</strong><span>Прием денонощно</span></div><div><strong>Първо посещение</strong><span>Приемно-консултативен блок / Регистратура</span></div><div><strong>Хоспитализация</strong><span>Направление/документи според конкретния случай</span></div></div><details><summary><strong>Подробности за приема</strong></summary><p>Официалната информация за прием, НЗОК, телефон и насочване се показва от verified owner.</p></details></section><div class="official"><strong>Ключови отделения</strong><p>Вътрешни болести · Хирургия · Педиатрия</p><details><summary>Виж всички отделения и звена</summary><p>Пълният списък се пази при Health owner.</p></details></div></article>`;
    } else {
      const labels = { lekari:'Лекар / практика', apteki:'Аптека', stomatolozi:'Стоматолог', veterinari:'Ветеринар', 'vet-apteki':'Ветеринарна аптека', laboratorii:'Лаборатория' };
      content = `<article class="v8-rich-card"><div class="trust"><span>Потвърдено</span><span>Последно потвърдено</span><span>Източник</span></div><h3>Примерен ${esc(labels[tab] || 'здравен запис')}</h3><div class="fact">📍 <span>Проверени контактни данни и специализиран контекст.</span></div><div class="official"><strong>Официални справки</strong><p>Където е приложимо: НЗОК / професионален регистър / официална страница.</p></div><div class="actions"><button class="primary" data-action="call">Обади се</button><button data-action="official">Официална справка</button></div></article>`;
    }
    return `<div class="page">${breadcrumbs([['Инфо Лом','info'],['Здраве и лекари']])}${head('Проверена здравна информация','Здраве и лекари','Еднакъв V6 discovery shell, но specialized verified Health/Info owner.',`<button class="primary" data-route="form-health" data-health-tab="${tab}">Добави към този раздел</button><button class="secondary" data-route="health-correction" data-health-tab="${tab}">Предложи корекция</button>`)}<section class="section"><div class="container"><form class="search-box" data-v8-local-filter data-target=".v8-rich-card"><input type="search" placeholder="Лекар, аптека, стоматолог, лаборатория..."><button>Намери</button></form><div class="v8-subnav" style="margin-top:14px">${healthTabs.map(([id,l])=>`<button type="button" data-health-tab="${id}" class="${id===tab?'active':''}">${esc(l)}</button>`).join('')}</div><div style="margin-top:16px">${content}</div><div class="detail-actions" style="margin-top:16px"><button class="secondary" data-route="health-signal" data-health-tab="${tab}">Сигнализирай за грешка</button></div></div></section></div>`;
  }

  function healthForm(ctx = {}) {
    const tab = ctx.healthTab || state.healthTab;
    const label = healthTabs.find(x=>x[0]===tab)?.[1] || 'Здраве';
    const body = `<div class="v8-context-note">Раздел: ${esc(label)}. Изпращането е pending към specialized Health/Info owner; няма generic direct publish.</div>${field('Име / обект',`<input name="name" required maxlength="180">`)}${field('Телефон, адрес или друга полезна информация',`<textarea name="details" required maxlength="1800" rows="6"></textarea>`)}${field('Източник / линк — по желание',`<input name="source" maxlength="500" placeholder="https://... или ясен източник">`)}`;
    return formShell('health','Предложи информация за Здраве','Предложението се проверява преди да стане публично.',body,{submit:'Изпрати за проверка',cancel:'health'});
  }

  function correctionForm(ctx = {}, healthMode = false) {
    const body = `${healthMode ? `<div class="v8-context-note">Корекция за Health раздел: ${esc(ctx.healthTab || state.healthTab)}.</div>` : ''}${field('Запис / обект',`<input name="record" required maxlength="180">`)}${field('Какво е грешно?',`<textarea name="current_problem" required maxlength="1000" rows="4"></textarea>`)}${field('Каква е правилната информация?',`<textarea name="proposed_value" required maxlength="1200" rows="4"></textarea>`)}${field('Източник / линк — по желание',`<input name="source" maxlength="500">`)}`;
    return formShell('correction','Предложи корекция','Публичният факт не се променя директно; корекцията минава през проверка.',body,{submit:'Изпрати корекцията',cancel:healthMode?'health':'info'});
  }

  function healthSignal(ctx = {}) {
    const body = `<div class="v8-context-note">Раздел: ${esc(ctx.healthTab || state.healthTab)}.</div>${field('Запис — по желание',`<input name="record" maxlength="180">`)}${field('Какво е грешно?',`<textarea name="description" required maxlength="1800" rows="5"></textarea>`)}${field('Правилна информация / източник — по желание',`<textarea name="source" maxlength="1800" rows="4"></textarea>`)}`;
    return formShell('health-signal','Сигнализирай за грешка','Сигналът се преглежда от администратор/Info owner.',body,{submit:'Изпрати сигнала',cancel:'health'});
  }

  function shops() {
    const meta = shopMeta[state.shopTab];
    const sub = state.shopTab === 'construction' ? `<div class="v8-filterbar"><button class="active">Всички</button><button>Материали</button><button>Бои</button><button>Железария</button><button>Санитария</button></div>` : '';
    return `<div class="page">${breadcrumbs([['Магазини']])}${head('Открий в Лом','Магазини','Специализиран каталог с category-specific context.',`<button class="primary" data-route="form-shop" data-shop-tab="${state.shopTab}">+ Добави ${esc(meta.add)}</button>`)}<section class="section"><div class="container"><div class="v8-subnav">${Object.entries(shopMeta).map(([id,m])=>`<button type="button" data-shop-tab="${id}" class="${id===state.shopTab?'active':''}">${esc(m.label)}</button>`).join('')}</div><div class="v8-shop-head"><h2>${esc(meta.title)}</h2><p>${esc(meta.lead)}</p></div><form class="search-box" data-v8-local-filter data-target=".shop-result"><input type="search" placeholder="Име, материал, адрес, продукт..."><button>Търси</button></form>${sub}<p class="v8-result-count">1 примерен обект</p><article class="v8-rich-card shop-result"><h3>Примерен ${esc(meta.add)}</h3><div class="fact">📍 <span>Лом · примерен адрес</span></div><div class="v8-shop-tags">${meta.tags.slice(0,3).map(t=>`<span>${esc(t)}</span>`).join('')}</div><div class="actions"><button class="primary" data-action="call">Обади се</button></div></article><div class="v8-context-note" style="margin-top:14px">Смяната на таба променя заглавието, Add контекста, подкатегориите, classification предложенията и search/results контекста.</div></div></section></div>`;
  }

  function shopForm(ctx = {}) {
    const id = ctx.shopTab || state.shopTab;
    const meta = shopMeta[id] || shopMeta.food;
    const body = `<div class="v8-context-note">Категория: ${esc(meta.label)}. Предложението първо се проверява и одобрява.</div>${field('Име на магазина',`<input name="name" required maxlength="120">`)}${field('Категория',`<select name="category" required>${Object.entries(shopMeta).map(([k,m])=>`<option value="${k}" ${k===id?'selected':''}>${esc(m.label)}</option>`).join('')}</select>`)}${field('Телефон',`<input name="phone" maxlength="40">`)}${field('Адрес в Лом',`<input name="address" required maxlength="200">`)}${field('Работно време',`<input name="working_hours" maxlength="120">`)}${field('Какво предлага',`<textarea name="offer" required maxlength="500" rows="5"></textarea>`)}<fieldset class="field"><legend><strong>Какво предлага магазинът — по желание</strong></legend><div class="v8-shop-tags">${meta.tags.map((t,i)=>`<label><input type="checkbox" name="shop_tags" value="${esc(t)}"> ${esc(t)}</label>`).join('')}</div>${field('Друго уточнение',`<input name="custom_tag" maxlength="80" placeholder="Например: местен специализиран продукт">`)}</fieldset>${field('Източник на информацията',`<select name="source_type" required><option value="">Избери</option><option>Собственик/управител</option><option>Служител</option><option>Клиент/посетител</option><option>Публичен източник</option><option>Друго</option></select>`)}${field('Уточнение за източника — по желание',`<textarea name="source_details" maxlength="300" rows="3"></textarea>`)}`;
    return formShell('shop',`Добави ${meta.add}`,'Специализиран Shop owner; формата не bypass-ва каталога.',body,{submit:'Изпрати за преглед',cancel:'shops'});
  }

  function restaurants() {
    return `<div class="page">${breadcrumbs([['Заведения']])}${head('Открий в Лом','Заведения и храна','Постоянните профили се намират през Firms owner; Q&A може да носи препоръки.')}<section class="section"><div class="container"><form class="search-box" data-v8-search><input name="q" placeholder="Ресторант, кафе, доставка..."><button>Търси</button></form><div class="result-list" style="margin-top:16px"><article class="result-card"><div class="logo">З</div><div class="body"><span class="badge verified">Фирмен профил</span><h3>Примерно заведение</h3><p>Постоянният профил остава при Firms owner.</p></div><div class="actions">${routeButton('Виж профила','firm-detail')}</div></article></div></div></section></div>`;
  }

  function events() {
    const tabs = [['upcoming','Предстоящи'],['culture','Културни'],['sport','Спортни'],['community','Обществени']];
    return `<div class="page">${breadcrumbs([['Събития']])}${head('Открий в Лом','Събития','Одобрени събития и местен discovery. Няма публична форма „Добави събитие“.',`<button class="secondary" data-route="form-question" data-prefill-category="events">Задай въпрос за събития</button>`)}<section class="section"><div class="container"><div class="v8-subnav">${tabs.map(([id,l])=>`<button type="button" data-event-tab="${id}" class="${state.eventTab===id?'active':''}">${esc(l)}</button>`).join('')}</div><form class="search-box" style="margin-top:14px" data-v8-local-filter data-target=".event-result"><input type="search" placeholder="Търси събитие..."><button>Търси</button></form><article class="v8-rich-card event-result" style="margin-top:16px"><div class="trust"><span>${esc(tabs.find(x=>x[0]===state.eventTab)?.[1] || 'Предстоящи')}</span><span>Одобрено</span></div><h3>Примерно предстоящо събитие</h3><p>Дата · място · организатор · официален/проверен източник, когато е наличен.</p><div class="actions"><button data-action="share">Сподели</button><button data-route="form-question" data-prefill-category="events">Попитай общността</button></div></article><div class="v8-context-note" style="margin-top:14px">Ако търсенето е за официална институционална информация, recovery води към Инфо Лом, а не към fake Event Add.</div><div class="detail-actions"><button data-route="info">Провери Инфо Лом</button></div></div></section></div>`;
  }

  function searchPage(ctx = {}) {
    const q = ctx.q || 'ВиК майстор';
    const controls = ['idle','too_short','loading','partial','success','empty','offline','error','cancelled'];
    const stateName = state.searchState;
    let content = '';
    if (stateName === 'success') content = `<div class="result-list"><article class="result-card"><div class="logo">Ф</div><div class="body"><span class="badge verified">Фирма</span><h3>Иванов Ремонти</h3><p>Релевантен provider result.</p></div><div class="actions">${routeButton('Отвори','firm-detail')}</div></article><article class="result-card"><div class="logo">О</div><div class="body"><span class="badge">Обява</span><h3>ВиК ремонт — активна обява</h3></div><div class="actions">${routeButton('Отвори','listing-detail')}</div></article></div>`;
    else if (stateName === 'partial') content = `<div class="v8-state-panel warn"><strong>Показваме частични резултати</strong><p>Някои owner-и временно не отговориха. Показаното е само от успешно проверените източници.</p>${routeButton('Опитай отново','search','data-search-state="loading"')}</div>`;
    else if (stateName === 'empty') content = `<div class="v8-state-panel"><strong>Няма намерен резултат</strong><p>Провери търсенето или избери следващо действие.</p><div class="v8-recovery">${routeButton('Разгледай категориите','categories')}${routeButton('+ Добави обява','form-listing')}${routeButton('+ Добави фирма','form-firm')}${routeButton('Задай въпрос','form-question')}</div></div>`;
    else if (stateName === 'offline') content = `<div class="v8-state-panel offline"><strong>Няма връзка</strong><p>Запази търсенето и опитай отново, когато връзката се възстанови.</p><div class="v8-recovery">${routeButton('Опитай отново','search','data-search-state="loading"')}${routeButton('Начало','home')}</div></div>`;
    else if (stateName === 'error') content = `<div class="v8-state-panel error"><strong>Търсенето не можа да завърши</strong><p>Нищо не е променено. Опитай отново.</p><div class="v8-recovery">${routeButton('Опитай отново','search','data-search-state="loading"')}</div></div>`;
    else if (stateName === 'loading') content = `<div class="v8-state-panel"><strong>Търсене…</strong><p>Проверяваме релевантните owner-и.</p></div>`;
    else if (stateName === 'too_short') content = `<div class="v8-state-panel warn"><strong>Напиши поне 2 знака</strong><p>Това намалява шумните и случайни резултати.</p></div>`;
    else if (stateName === 'cancelled') content = `<div class="v8-state-panel"><strong>Търсенето е отменено</strong><p>Можеш да започнеш ново търсене.</p></div>`;
    else content = `<div class="v8-state-panel"><strong>Какво търсиш?</strong><p>Въведи заявка, за да започнем.</p></div>`;
    return `<div class="page">${breadcrumbs([['Търсене']])}${head('Search V6',`Резултати за „${q}“`,'Owner-aware резултати и пълни recovery states.')}<section class="section"><div class="container"><form class="search-box" data-v8-search><input name="q" value="${esc(q)}"><button>Търси</button></form><div class="v8-search-state-controls"><span>QA състояние:</span>${controls.map(s=>`<button type="button" data-search-state="${s}" class="${s===stateName?'active':''}">${s}</button>`).join('')}</div>${content}</div></section></div>`;
  }

  function articles() {
    const guides = [['pension','Как да се пенсионираш в Лом'],['id-card','Как се подменя лична карта в Лом'],['signal','Как да подадеш сигнал до община или институция']];
    return `<div class="page">${breadcrumbs([['Статии']])}${head('Практични материали','Полезни ръководства','Процес и контекст без дублиране на променливи факти.')}<section class="section"><div class="container"><div class="guide-grid">${guides.map(([id,t])=>`<button class="guide-card" data-route="article-detail" data-article="${id}"><span class="topic">Ръководство</span><h3>${esc(t)}</h3><p>Стъпка по стъпка с връзка към актуалния owner.</p></button>`).join('')}</div><div class="v8-context-note" style="margin-top:16px">Само материали със статус B4 „ПРОВЕРЕНО ГОТОВО“ могат да станат официално searchable/shareable production content.</div></div></section></div>`;
  }

  function articleDetail(ctx = {}) {
    const titles = { pension:'Как да се пенсионираш в Лом', 'id-card':'Как се подменя лична карта в Лом', signal:'Как да подадеш сигнал до община или институция' };
    const title = titles[ctx.article] || titles.pension;
    return `<div class="page">${breadcrumbs([['Статии','articles'],[title]])}${head('Ръководство',title,'Ясни стъпки; актуалните факти идват от authoritative owner.')}<section class="section"><div class="container detail-layout"><article class="detail-card"><h2>1. Какво да провериш първо</h2><p>Кои условия и документи са приложими за твоя случай.</p><h2>2. Какво да подготвиш</h2><p>Необходимите данни и документи.</p><h2>3. Къде е актуалната информация</h2><p>Връзка към съответния Info/official owner.</p><div class="detail-actions"><button data-action="share">Сподели каноничния линк</button><button data-route="info">Провери актуалните факти</button></div></article></div></section></div>`;
  }

  function questions() {
    return `<div class="page">${breadcrumbs([['Въпроси']])}${head('Общността','Въпроси и препоръки','Съвет, опит и местни препоръки.',routeButton('Задай въпрос','form-question','class="primary"'))}<section class="section"><div class="container"><div class="community-list"><button class="community-row" data-route="question-detail"><div class="body"><span class="badge">Строителство</span><strong>Кой препоръчва добър майстор за баня?</strong><small>Иван П. · 31.08.2026 · 4 одобрени отговора</small></div><span>→</span></button></div></div></section></div>`;
  }

  function questionDetail() {
    return `<div class="page">${breadcrumbs([['Въпроси','questions'],['Въпрос']])}${head('Общността','Кой препоръчва добър майстор за баня?','Строителство · Иван П. · 31.08.2026')}<section class="section"><div class="container"><article class="detail-card"><p>Търся личен опит и препоръки за майстор, който работи добре с бани и плочки.</p><div class="v8-qa-gallery"><div>Снимка към въпроса</div><div>Снимка към въпроса</div></div><div class="detail-actions"><button data-action="helpful">Полезно</button><button data-action="share">Сподели</button><button data-route="report" data-target="question">Докладвай</button></div></article><article class="detail-card"><h2>Отговори</h2><p><strong>Мария:</strong> Имам добър личен опит с местен майстор.</p></article><div class="narrow" style="margin-top:16px"><form class="form-shell" data-v8-form="answer" novalidate>${field('Твоят отговор',`<textarea name="body" required minlength="3" maxlength="5000" rows="5" placeholder="Сподели личен опит или полезен съвет"></textarea>`)}<button class="primary" type="submit">Публикувай отговор</button></form></div></div></section></div>`;
  }

  function questionForm(ctx = {}) {
    const cat = ctx.prefillCategory || '';
    const body = `<div class="v8-context-note">Преди create V6 предлага сходни въпроси. Един intent трябва да има един canonical knowledge center.</div>${field('Заглавие',`<input name="title" required minlength="10" maxlength="120" value="${esc(ctx.prefillQuery || '')}" placeholder="Например: Кой препоръчва добър майстор за баня?">`)}${field('Категория',`<select name="category" required><option value="">Избери категория</option>${categories.map(c=>`<option value="${c[0]}" ${c[0]===cat?'selected':''}>${esc(c[1])}</option>`).join('')}</select>`)}${field('Описание',`<textarea name="description" required minlength="20" maxlength="5000" rows="6"></textarea>`)}<div class="v8-duplicate-warning"><strong>Сходни въпроси</strong><span>Ако вече има каноничен въпрос за същата тема, потребителят се насочва към него вместо да създава ненужен duplicate.</span><button type="button" data-action="question-duplicate">Провери сходни въпроси</button></div>${mediaBlock('question-media','Снимки към въпроса',6,'Ако owner flow позволява снимки, gallery capability не се губи.')}${check('Прочетох и приемам правилата','rules')}`;
    return formShell('question','Задай въпрос','Въпросът чака преглед преди публикация.',body,{submit:'Изпрати за преглед',cancel:'questions'});
  }

  function profile() {
    const roleNote = state.role === 'admin' ? 'Admin QA: директното публикуване и protected options са отделени от normal owner content.' : state.role === 'moderator' ? 'Moderator QA: собственото съдържание остава normal non-Admin flow.' : 'Обикновен потребител: тук се виждат всички важни statuses, drafts и correction flows.';
    return `<div class="page">${breadcrumbs([['Профил']])}${head('Личен профил','Моят профил','Обяви, фирми, въпроси, корекции и статути.')}<section class="section"><div class="container"><div class="v8-context-note">${esc(roleNote)}</div><section class="v8-profile-section"><h2>Моите обяви</h2><div class="v8-status-grid"><article class="v8-status-card"><div class="meta"><span class="badge pending">Чака преглед</span><span>01.09.2026</span></div><strong>Моя нова обява</strong><div class="actions"><button data-route="form-listing" data-edit="1">Редактирай</button></div></article><article class="v8-status-card"><div class="meta"><span class="badge verified">Публикувана</span></div><strong>Публикувана обява</strong><div class="actions"><button data-route="listing-detail">Преглед</button><button data-route="form-listing" data-edit="1">Редактирай</button></div></article></div></section><section class="v8-profile-section"><h2>Моите фирми</h2><div class="v8-status-grid"><article class="v8-status-card"><div class="meta"><span class="badge pending">Чака преглед</span></div><strong>Нова фирма</strong><p>Профилът чака административен преглед.</p><div class="actions"><button data-route="form-firm" data-edit="1">Редактирай</button></div></article><article class="v8-status-card"><div class="meta"><span class="badge verified">Публикувана</span></div><strong>Моя фирма</strong><div class="draft">Редакцията чака одобрение. Публикуваната версия остава видима.</div><div class="actions"><button data-route="firm-detail">Преглед</button><button data-route="form-firm" data-edit="1">Редактирай</button></div></article><article class="v8-status-card"><div class="meta"><span class="badge verified">Публикувана · разширен достъп</span></div><strong>Фирма с Admin-granted expanded access</strong><div class="actions"><button data-route="form-firm" data-edit="1" data-expanded-granted="1">Редактирай разширения профил</button></div></article><article class="v8-status-card"><div class="meta"><span class="badge error">Нужна корекция</span></div><strong>Фирма, върната за корекция</strong><div class="note error"><strong>Бележка от администратора:</strong> Уточни работното време и адреса.</div><div class="actions"><button data-route="form-firm" data-edit="1">Коригирай</button></div></article></div></section><section class="v8-profile-section"><h2>Въпроси и отговори за корекция</h2><div class="v8-status-card"><div class="meta"><span class="badge error">Нужна корекция</span></div><strong>Въпрос: Кой препоръчва...</strong><div class="note error">Бележка от администратора: добави повече контекст.</div><div class="actions"><button data-route="form-question">Коригирай и изпрати отново</button></div></div><div class="v8-status-card"><div class="meta"><span class="badge error">Нужна корекция</span></div><strong>Отговор към въпрос</strong><div class="actions"><button data-route="question-detail">Отвори въпроса</button></div></div></section><section class="v8-profile-section"><h2>Моите предложения и сигнали за Инфо Лом</h2><div class="v8-status-card"><div class="meta"><span class="badge pending">Чака админ преглед</span></div><strong>Предложение: нов здравен запис</strong><p>Статусът се обновява след преглед.</p></div><div class="v8-status-card"><div class="meta"><span class="badge error">Нужна корекция</span></div><strong>Предложение за Инфо Лом</strong><div class="note error">Причина: посочи по-ясен източник.</div><div class="actions"><button data-route="correction">Коригирай и изпрати отново</button></div></div><div class="v8-status-card"><div class="meta"><span class="badge error">Нужна допълнителна информация</span></div><strong>Сигнал за грешка</strong><div class="note">Администраторът иска: добави линк или по-точно описание.</div><div class="actions"><button data-route="health-signal">Изпрати допълнението</button></div></div></section><section class="v8-profile-section"><h2>Профил и сигурност</h2><div class="detail-actions"><button data-route="auth" data-auth-mode="login">Вход / смяна на профил</button><button data-route="reset-password">Смяна на парола</button></div></section></div></section></div>`;
  }

  function auth(ctx = {}) {
    const mode = ctx.authMode || 'login';
    if (mode === 'register') return registerForm();
    const body = `${field('Имейл',`<input name="email" type="email" required autocomplete="email">`)}${field('Парола',`<div class="v8-password"><input name="password" type="password" required autocomplete="current-password"><button type="button" data-password-toggle>Покажи</button></div>`)}<div class="detail-actions"><button type="button" data-route="forgot">Забравена парола</button><button type="button" data-route="auth" data-auth-mode="register">Регистрация</button></div>`;
    return formShell('login','Вход','Влез в профила си.',body,{submit:'Вход',cancel:'home'});
  }

  function registerForm() {
    const body = `${field('Име',`<input name="name" required minlength="2" maxlength="120">`)}${field('Имейл',`<input name="email" type="email" required autocomplete="email">`)}${field('Парола',`<div class="v8-password"><input name="password" type="password" required minlength="8" autocomplete="new-password"><button type="button" data-password-toggle>Покажи</button></div>`)}${field('Повтори паролата',`<div class="v8-password"><input name="password_confirm" type="password" required minlength="8" autocomplete="new-password"><button type="button" data-password-toggle>Покажи</button></div>`)}${check('Приемам Условията за ползване и Политиката за поверителност','terms')}`;
    return formShell('register','Регистрация','Създай профил в Попитай.Лом.',body,{submit:'Създай профил',cancel:'home'});
  }

  function forgot() {
    const body = `${field('Имейл',`<input name="email" type="email" required autocomplete="email">`)}<div class="v8-context-note">Success copy е privacy-safe: не потвърждаваме дали адресът съществува в системата.</div>`;
    return formShell('forgot','Забравена парола','Ще изпратим инструкции, ако има профил с този адрес.',body,{submit:'Изпрати връзка',cancel:'auth'});
  }

  function resetPassword() {
    const body = `${field('Нова парола',`<div class="v8-password"><input name="password" type="password" required minlength="8" autocomplete="new-password"><button type="button" data-password-toggle>Покажи</button></div>`)}${field('Повтори новата парола',`<div class="v8-password"><input name="password_confirm" type="password" required minlength="8" autocomplete="new-password"><button type="button" data-password-toggle>Покажи</button></div>`)}`;
    return formShell('reset-password','Нова парола','Паролите трябва да съвпадат.',body,{submit:'Промени паролата',cancel:'auth'});
  }

  function report(ctx = {}) {
    const target = ctx.target || 'site';
    const body = `<div class="v8-context-note">Контекстът се носи автоматично: ${esc(target)}. Потребителят не трябва да въвежда технически ID.</div>${field('Име',`<input name="name" required minlength="2" maxlength="120">`)}${field('Електронна поща',`<input name="email" type="email" required maxlength="254">`)}${field('Съобщение',`<textarea name="message" required minlength="10" maxlength="2000" rows="6" placeholder="Опиши обидата, измамата, фалшивото мнение или другия проблем."></textarea>`)}`;
    return formShell('report','Подай сигнал','Сигнал за нарушение или проблем с конкретно съдържание.',body,{submit:'Изпрати',cancel:'home'});
  }

  function contact() {
    const body = `${field('Име',`<input name="name" required minlength="2" maxlength="120">`)}${field('Имейл',`<input name="email" type="email" required>`)}${field('Съобщение',`<textarea name="message" required minlength="10" maxlength="2000" rows="6"></textarea>`)}`;
    return formShell('contact','Контакти','Изпрати съобщение до екипа на Попитай.Лом.',body,{submit:'Изпрати съобщението',cancel:'home'});
  }

  function simple(title, lead) {
    return `<div class="page">${breadcrumbs([[title]])}${head('Попитай.Лом',title,lead)}<section class="section"><div class="narrow"><article class="detail-card"><p>Този вторичен публичен екран е включен във full-site completeness review.</p></article></div></section></div>`;
  }

  function render(route, ctx = {}) {
    switch (route) {
      case 'home': return home();
      case 'categories': return categoriesPage();
      case 'marketplace': return marketplace();
      case 'category': return categoryPage(ctx.category || 'construction');
      case 'listing-detail': return listingDetail();
      case 'form-listing': return listingForm(ctx);
      case 'firms': return firms();
      case 'firm-detail': return firmDetail();
      case 'form-firm': return firmForm(ctx);
      case 'info': return infoHub();
      case 'info-detail': return infoDetail(ctx.info || 'institutions');
      case 'health': return health();
      case 'form-health': return healthForm(ctx);
      case 'health-correction': return correctionForm(ctx, true);
      case 'correction': return correctionForm(ctx, false);
      case 'health-signal': return healthSignal(ctx);
      case 'shops': return shops();
      case 'form-shop': return shopForm(ctx);
      case 'restaurants': return restaurants();
      case 'events': return events();
      case 'search': return searchPage(ctx);
      case 'articles': return articles();
      case 'article-detail': return articleDetail(ctx);
      case 'questions': return questions();
      case 'question-detail': return questionDetail();
      case 'form-question': return questionForm(ctx);
      case 'profile': return profile();
      case 'auth': return auth(ctx);
      case 'forgot': return forgot();
      case 'reset-password': return resetPassword();
      case 'report': return report(ctx);
      case 'contact': return contact();
      case 'about': return simple('За сайта','Какво е Попитай.Лом и какво не е.');
      case 'rules': return simple('Правила','Правила за общността и публикуването.');
      default: return home();
    }
  }

  function collectContext(target) {
    return {
      category: target.dataset.category || target.dataset.prefillCategory || '',
      prefillCategory: target.dataset.prefillCategory || target.dataset.category || '',
      prefillSubcategory: target.dataset.prefillSubcategory || '',
      prefillType: target.dataset.prefillType || '',
      edit: target.dataset.edit === '1',
      expandedGranted: target.dataset.expandedGranted === '1',
      info: target.dataset.info || '',
      article: target.dataset.article || '',
      target: target.dataset.target || '',
      authMode: target.dataset.authMode || '',
      healthTab: target.dataset.healthTab || '',
      shopTab: target.dataset.shopTab || '',
      q: target.dataset.q || ''
    };
  }

  function setActiveNav(route) {
    document.querySelectorAll('[data-nav],[data-mobile-nav]').forEach(node => node.classList.remove('active'));
    const key = route === 'category' || route.startsWith('listing') || route === 'form-listing' ? 'marketplace' : route.startsWith('info') || route.startsWith('health') ? 'info' : route === 'firm-detail' || route === 'form-firm' ? 'firms' : route;
    document.querySelectorAll(`[data-nav="${key}"],[data-mobile-nav="${key}"]`).forEach(node => node.classList.add('active'));
  }

  function navigate(route, ctx = {}, push = true) {
    if (ctx.healthTab) state.healthTab = ctx.healthTab;
    if (ctx.shopTab) state.shopTab = ctx.shopTab;
    state.route = route;
    state.ctx = ctx;
    app.innerHTML = render(route, ctx);
    setActiveNav(route);
    wireCurrent();
    closeMenu();
    closeAdd(false);
    if (push) {
      try { history.pushState({ route, ctx }, '', `#${route}`); } catch (_) {}
    }
    app.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => { toast.hidden = true; }, 2300);
  }

  let addReturnFocus = null;
  function addFocusable() {
    return Array.from(addSheet?.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled])') || []).filter(el => !el.hidden && el.offsetParent !== null);
  }
  function openAdd(trigger) {
    if (!addSheet) return;
    addReturnFocus = trigger || document.activeElement;
    addSheet.hidden = false;
    document.body.classList.add('modal-open');
    requestAnimationFrame(() => (addFocusable()[0] || addSheet.querySelector('[data-close-modal]'))?.focus());
  }
  function closeAdd(returnFocus = true) {
    if (!addSheet || addSheet.hidden) return;
    addSheet.hidden = true;
    document.body.classList.remove('modal-open');
    if (returnFocus) addReturnFocus?.focus?.();
    addReturnFocus = null;
  }
  function closeMenu() {
    if (!menu) return;
    menu.hidden = true;
    menuTrigger?.setAttribute('aria-expanded','false');
  }

  function ensureRoleControls() {
    const strip = document.querySelector('.prototype-strip');
    if (!strip || strip.querySelector('.v8-qa-controls')) return;
    const wrap = document.createElement('div');
    wrap.className = 'v8-qa-controls';
    wrap.innerHTML = '<span>QA роля:</span><button type="button" data-v8-role="user">Обикновен</button><button type="button" data-v8-role="moderator">Модератор</button><button type="button" data-v8-role="admin">Администратор</button>';
    strip.appendChild(wrap);
    updateRoleControls();
  }

  function updateRoleControls() {
    document.querySelectorAll('[data-v8-role]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.v8Role === state.role)));
  }

  function listingSubcategories(main) {
    return {
      construction:['Цялостни ремонти','Бани и плочки','ВиК','Електро','Покриви','Боядисване','Дограма','Климатици'],
      cars:['Автомобили','Авточасти','Автосервизи','Диагностика','Гуми','Автомивки','Пътна помощ'],
      work:['Работа'],
      property:['Имоти'],
      services:['Домашна помощ','Красота и грижа','Компютърни и технически услуги','Фото и видео','Професионални услуги','Обучение и уроци','Грижа','Транспорт и доставки'],
      other:['Електроника','Дом и градина','Дрехи и обувки','Деца и бебета','Спорт и хоби','Животни','Друго']
    }[main] || ['Друго'];
  }

  function wireListingForm() {
    const main = app.querySelector('[data-listing-main]');
    const sub = app.querySelector('[data-listing-subcategory]');
    const special = app.querySelector('[data-listing-special]');
    if (!main || !sub || !special) return;
    const sync = () => {
      const previous = sub.dataset.prefill || sub.value;
      const items = listingSubcategories(main.value);
      sub.innerHTML = '<option value="">Избери подкатегория</option>' + items.map(v => `<option ${v===previous?'selected':''}>${esc(v)}</option>`).join('');
      delete sub.dataset.prefill;
      if (main.value === 'work') special.innerHTML = field('Тип работа','<select name="work_type" required><option value="">Избери</option><option>Предлага работа</option><option>Търси работа</option></select>');
      else if (main.value === 'property') special.innerHTML = field('Тип имот','<select name="property_type" required><option value="">Избери</option><option>Продава</option><option>Дава под наем</option><option>Купува</option><option>Търси под наем</option></select>');
      else special.innerHTML = field('Тип обява','<select name="listing_type" required><option value="">Избери</option><option>Продава</option><option>Купува</option><option>Търси</option><option>Дава</option></select>');
    };
    main.addEventListener('change', sync);
    sync();
  }

  function wireMedia(root) {
    const input = root.querySelector('[data-media-input]');
    const drop = root.querySelector('[data-media-drop]');
    const grid = root.querySelector('[data-media-grid]');
    const count = root.querySelector('[data-media-count]');
    const error = root.querySelector('[data-media-error]');
    const max = Number(root.dataset.mediaMax || 0);
    let items = [];

    function update() {
      count.textContent = `${items.length} / ${max > 0 ? max : 'без backend лимит за Admin'}`;
      grid.innerHTML = '';
      items.forEach((item, index) => {
        const card = document.createElement('article');
        card.className = 'v8-media-card';
        card.innerHTML = `${item.url ? `<img src="${item.url}" alt="">` : '<div style="aspect-ratio:4/3;display:grid;place-items:center">Снимка</div>'}<div class="body">${index===0?'<span class="badge-main">Главна снимка</span>':''}<strong>${esc(item.name)}</strong><small>${esc(item.status)}</small><label>Описание<input type="text" name="media_caption_${index}" maxlength="120" value="${esc(item.caption)}"></label><button type="button" data-media-remove="${index}">Премахни</button></div>`;
        grid.appendChild(card);
      });
    }

    function addFiles(fileList) {
      error.textContent = '';
      const files = Array.from(fileList || []);
      for (const file of files) {
        if (max > 0 && items.length >= max) { error.textContent = `Можеш да добавиш най-много ${max} снимки.`; break; }
        if (!['image/jpeg','image/png','image/webp'].includes(file.type)) { error.textContent = 'Позволени са JPG, PNG и WebP.'; continue; }
        if (file.size > 12 * 1024 * 1024) { error.textContent = 'Файлът е твърде голям за prototype preview.'; continue; }
        let url = '';
        try { url = URL.createObjectURL(file); } catch (_) {}
        items.push({ name:file.name, url, caption:file.name.replace(/\.[^.]+$/,''), status:'Готово за production optimization variants' });
      }
      update();
    }

    input?.addEventListener('change', () => addFiles(input.files));
    drop?.addEventListener('click', event => { if (event.target !== input) input?.click(); });
    ['dragenter','dragover'].forEach(type => drop?.addEventListener(type, event => { event.preventDefault(); drop.classList.add('is-dragging'); }));
    ['dragleave','drop'].forEach(type => drop?.addEventListener(type, event => { event.preventDefault(); drop.classList.remove('is-dragging'); }));
    drop?.addEventListener('drop', event => addFiles(event.dataTransfer?.files));
    grid?.addEventListener('click', event => {
      const remove = event.target.closest('[data-media-remove]');
      if (!remove) return;
      const index = Number(remove.dataset.mediaRemove);
      const item = items[index];
      if (item?.url) try { URL.revokeObjectURL(item.url); } catch (_) {}
      items.splice(index,1);
      update();
    });
    update();
  }

  function wireLocalFilters() {
    app.querySelectorAll('[data-v8-local-filter]').forEach(form => {
      const input = form.querySelector('input[type="search"]');
      const selector = form.dataset.target;
      form.addEventListener('submit', event => event.preventDefault());
      input?.addEventListener('input', () => {
        const q = input.value.toLocaleLowerCase('bg-BG').trim();
        app.querySelectorAll(selector).forEach(node => node.hidden = Boolean(q) && !node.textContent.toLocaleLowerCase('bg-BG').includes(q));
      });
    });
  }

  function wireSearchForms() {
    app.querySelectorAll('[data-v8-search]').forEach(form => form.addEventListener('submit', event => {
      event.preventDefault();
      const q = String(new FormData(form).get('q') || '').trim();
      state.searchState = q.length < 2 ? 'too_short' : 'success';
      navigate('search',{q});
    }));
  }

  function wireCurrent() {
    wireListingForm();
    app.querySelectorAll('[data-v8-media]').forEach(wireMedia);
    wireLocalFilters();
    wireSearchForms();
  }

  document.addEventListener('click', event => {
    const roleButton = event.target.closest('[data-v8-role]');
    if (roleButton) {
      state.role = roleButton.dataset.v8Role;
      updateRoleControls();
      navigate(state.route, state.ctx, false);
      return;
    }

    const route = event.target.closest('[data-route]');
    if (route) {
      event.preventDefault();
      const ctx = collectContext(route);
      navigate(route.dataset.route, ctx);
      return;
    }

    const action = event.target.closest('[data-action]');
    if (action) {
      const messages = {
        call:'Prototype: тук production отваря реалния телефон.', share:'Prototype: споделя се само публичният каноничен URL.', contact:'Prototype: отваря се реалният канал за запитване.', site:'Prototype: отваря се публикуваният сайт.', official:'Prototype: отваря се официалният източник.', helpful:'Prototype: отбелязано като полезно.', 'duplicate-check':'Няма блокиращ duplicate в този QA пример.', 'question-duplicate':'QA: показани са сходни въпроси преди create.'
      };
      showToast(messages[action.dataset.action] || 'Prototype действие.');
      return;
    }

    const open = event.target.closest('[data-open-add]');
    if (open) { openAdd(open); return; }
    const close = event.target.closest('[data-close-modal]');
    if (close) { closeAdd(true); return; }

    const password = event.target.closest('[data-password-toggle]');
    if (password) {
      const input = password.closest('.v8-password')?.querySelector('input');
      if (!input) return;
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      password.textContent = show ? 'Скрий' : 'Покажи';
      return;
    }

    const shop = event.target.closest('[data-shop-tab]');
    if (shop && !shop.dataset.route) {
      state.shopTab = shop.dataset.shopTab;
      navigate('shops',{},false);
      return;
    }

    const health = event.target.closest('[data-health-tab]');
    if (health && !health.dataset.route) {
      state.healthTab = health.dataset.healthTab;
      navigate('health',{},false);
      return;
    }

    const ev = event.target.closest('[data-event-tab]');
    if (ev) {
      state.eventTab = ev.dataset.eventTab;
      navigate('events',{},false);
      return;
    }

    const searchState = event.target.closest('[data-search-state]');
    if (searchState) {
      state.searchState = searchState.dataset.searchState;
      navigate('search',state.ctx,false);
    }
  });

  menuTrigger?.addEventListener('click', () => {
    const next = Boolean(menu?.hidden);
    if (menu) menu.hidden = !next;
    menuTrigger.setAttribute('aria-expanded', String(next));
  });

  addSheet?.addEventListener('click', event => { if (event.target === addSheet) closeAdd(true); });
  addSheet?.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); closeAdd(true); return; }
    if (event.key !== 'Tab') return;
    const items = addFocusable();
    if (!items.length) return;
    const first = items[0], last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  document.addEventListener('v8-force-escape', () => { closeAdd(true); closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (addSheet && !addSheet.hidden) closeAdd(true);
    else if (menu && !menu.hidden) { closeMenu(); menuTrigger?.focus(); }
  });

  window.addEventListener('popstate', event => {
    const route = event.state?.route || 'home';
    const ctx = event.state?.ctx || {};
    state.route = route;
    state.ctx = ctx;
    app.innerHTML = render(route,ctx);
    setActiveNav(route);
    wireCurrent();
  });

  window.PopitaiV6 = {
    get role() { return state.role; },
    navigate,
    state
  };

  ensureRoleControls();
  navigate('home',{},false);
}());
