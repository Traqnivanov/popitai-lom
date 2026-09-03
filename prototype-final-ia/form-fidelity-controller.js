(() => {
  'use strict';

  const workGroups = [
    'Строителство, ремонти и техници',
    'Производство, склад и общи работници',
    'Транспорт, шофьори и доставки',
    'Търговия и продажби',
    'Заведения, хотели и туризъм',
    'Почистване, домашна помощ и грижи',
    'Здраве, красота и социални дейности',
    'Офис, администрация, IT и специалисти',
    'Друга / сезонна работа'
  ];

  function parsed() {
    const raw = (location.hash || '#home').slice(1);
    const [path, query=''] = raw.split('?');
    return {path, query:new URLSearchParams(query)};
  }

  function fieldByLabel(form, text) {
    return [...form.querySelectorAll('.field')].find(field => field.querySelector('label')?.textContent?.trim() === text) || null;
  }

  function makeField(label, type='text', placeholder='') {
    const wrap = document.createElement('div');
    wrap.className = 'field fidelity-field';
    const lab = document.createElement('label');
    lab.textContent = label;
    const input = document.createElement(type === 'textarea' ? 'textarea' : 'input');
    if (type !== 'textarea') input.type = type;
    if (type === 'textarea') input.rows = 4;
    if (placeholder) input.placeholder = placeholder;
    wrap.append(lab,input);
    return wrap;
  }

  function makeUpload(title, max, help) {
    const section = document.createElement('section');
    section.className = 'upload-demo fidelity-upload';
    section.innerHTML = `<div><strong>${title}</strong><span data-upload-count>0 / ${max}</span></div><p>${help}</p><label class="btn upload-button">Избери ${max === 1 ? 'файл' : 'снимки'}<input type="file" accept="image/jpeg,image/png,image/webp" ${max > 1 ? 'multiple' : ''} data-fidelity-upload data-max-files="${max}" hidden></label>`;
    return section;
  }

  function insertBeforeTerms(form, node) {
    const terms = form.querySelector('.check-field');
    if (terms) terms.before(node);
    else form.append(node);
  }

  function syncListing(form, query) {
    if (!form.querySelector('[data-fidelity-listing]')) {
      const marker = document.createElement('span');
      marker.hidden = true;
      marker.dataset.fidelityListing = 'true';
      form.prepend(marker);

      const city = fieldByLabel(form,'Град / район');
      const street = makeField('Улица (по желание)','text','Напр. ул. Дунавска 12');
      if (city) city.after(street);

      const price = fieldByLabel(form,'Цена');
      if (price) {
        const options = document.createElement('div');
        options.className = 'form-inline-options';
        options.innerHTML = '<label><input type="checkbox"> Договаряне</label><label><input type="checkbox"> Подарява (безплатно)</label>';
        price.after(options);
      }

      insertBeforeTerms(form, makeUpload('Снимки',6,'Първата снимка е главна. До 6 снимки · JPG, PNG или WebP.'));
    }

    const category = document.getElementById('listing-category');
    const sub = document.getElementById('listing-subcategory');
    const title = form.querySelector('input[type="text"]');
    const currentCategory = category?.value || query.get('category') || '';
    const requestedSub = query.get('subcategory') || '';

    if (currentCategory === 'Работа' && sub) {
      sub.innerHTML = '<option value="">Избери</option>' + workGroups.map(v => `<option value="${v}"${v===requestedSub?' selected':''}>${v}</option>`).join('');
    }

    if (title) {
      const examples = {
        'Животни':'Напр. Котка търси дом в Лом',
        'Работа':'Напр. Търсим шофьор за доставки',
        'Имоти':'Напр. Продавам двустаен апартамент в Лом',
        'Услуги':'Напр. Предлагам ВиК услуги в Лом',
        'Автомобили и МПС':'Напр. Продавам автомобил в Лом'
      };
      title.placeholder = examples[currentCategory] || 'Напр. Продавам запазен велосипед в Лом';
    }
  }

  function syncFirm(form) {
    if (form.querySelector('[data-fidelity-firm]')) return;
    const marker = document.createElement('span');
    marker.hidden = true;
    marker.dataset.fidelityFirm = 'true';
    form.prepend(marker);

    const phone = fieldByLabel(form,'Телефон');
    if (phone) {
      const city = makeField('Град (по желание)','text','Напр. Лом');
      const address = makeField('Адрес (по желание)','text','Напр. ул. Дунавска 12');
      const hours = makeField('Работно време (по желание)','text','Напр. Пон–Пет: 8:00–18:00');
      phone.after(city,address,hours);
    }
    insertBeforeTerms(form, makeUpload('Лого (по желание)',1,'JPG, PNG или WebP · до 10 MB.'));
    insertBeforeTerms(form, makeUpload('Снимки на обекти и услуги',6,'До 6 снимки в основния фирмен профил.'));
  }

  function syncShop(form) {
    if (form.querySelector('[data-fidelity-shop]')) return;
    const marker = document.createElement('span');
    marker.hidden = true;
    marker.dataset.fidelityShop = 'true';
    form.prepend(marker);
    const offer = fieldByLabel(form,'Какво предлага');
    const source = makeField('Източник / откъде знаеш за магазина','textarea','Напр. посетен на място, официална страница или друг проверим източник');
    if (offer) offer.after(source);
  }

  function sync() {
    const {path,query} = parsed();
    if (!path.startsWith('add/')) return;
    const form = document.querySelector('[data-proto-form]');
    if (!form) return;
    const kind = path.split('/')[1];
    if (kind === 'listing') syncListing(form,query);
    if (kind === 'firm') syncFirm(form);
    if (kind === 'shop') syncShop(form);
  }

  document.addEventListener('change', event => {
    if (event.target.matches('[data-fidelity-upload]')) {
      const max = Number(event.target.dataset.maxFiles || 1);
      const count = Math.min(event.target.files?.length || 0,max);
      const label = event.target.closest('.upload-demo')?.querySelector('[data-upload-count]');
      if (label) label.textContent = `${count} / ${max}`;
    }
    if (event.target.id === 'listing-category') queueMicrotask(sync);
  });

  window.addEventListener('hashchange', () => queueMicrotask(sync));
  sync();
})();
