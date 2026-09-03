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

  const propertyKinds = ['Апартамент','Къща / етаж','Парцел','Земеделска земя','Гараж / паркомясто','Бизнес имот','Склад / производствен имот','Друго'];
  const autoKinds = ['Автомобили и джипове','Мотоциклети и ATV','Бусове и камиони','Агро/строителна техника','Ремаркета, каравани и други','Части, гуми и аксесоари'];
  const serviceSubcategories = new Set(['Цялостни ремонти','Бани и плочки','ВиК','Електро','Покриви','Боядисване','Дограма','Климатици','Автосервизи','Диагностика','Гуми','Автомивки','Пътна помощ','Домашна помощ','Красота и грижа','Компютърни и технически услуги','Фото, видео и събитийни услуги','Професионални услуги','Обучение и уроци','Грижа за деца, възрастни и домашни любимци','Транспорт, преместване и доставки']);

  const goodsMap = {
    'Електроника и телефони': ['Електроника','Електроника и телефони'],
    'Дом и градина': ['Дом и градина',''],
    'Дрехи, обувки и аксесоари': ['Дрехи и обувки','Дрехи, обувки и аксесоари'],
    'Деца и бебета': ['Деца и бебета',''],
    'Спорт, хоби и книги': ['Спорт и хоби','Спорт, хоби и книги'],
    'Инструменти и оборудване': ['Дом и градина','Инструменти и оборудване'],
    'Друго': ['Друго','']
  };

  let propertyType = 'Продава имот';

  function parsed() {
    const raw = (location.hash || '#home').slice(1);
    const [path, query=''] = raw.split('?');
    return {path, query:new URLSearchParams(query)};
  }

  function addUrl(category, subcategory='', type='') {
    const q = new URLSearchParams();
    if (category) q.set('category', category);
    if (subcategory) q.set('subcategory', subcategory);
    if (type) q.set('type', type);
    return `#add/listing${q.size ? `?${q}` : ''}`;
  }

  function rewriteResults() {
    const {path,query} = parsed();
    if (path !== 'results') return;
    const context = query.get('context') || '';
    const group = query.get('group') || '';
    const type = query.get('type') || '';
    const primary = [...document.querySelectorAll('.page-tools a')].find(a => /Публикувай в тази категория/.test(a.textContent || ''));
    if (!primary) return;

    if (context === 'Услуги') {
      primary.href = addUrl('Услуги', serviceSubcategories.has(group) ? group : '');
      return;
    }
    if (context === 'Работа') {
      primary.href = addUrl('Работа', group, type || 'Предлага работа');
      return;
    }
    if (context === 'Имоти') {
      primary.href = addUrl('Имоти', group, type || 'Продава имот');
      return;
    }
    if (context === 'Купува и продава') {
      const [category,sub] = goodsMap[group] || ['Друго',group];
      primary.href = addUrl(category, sub);
      return;
    }
    if (context === 'Автомобили') {
      if (group === 'Автомобилни услуги') {
        primary.href = addUrl('Услуги');
      } else if (serviceSubcategories.has(group)) {
        primary.href = addUrl('Услуги', group);
      } else {
        primary.href = addUrl('Автомобили и МПС', autoKinds.includes(group) ? group : '');
      }
      return;
    }
    if (context === 'Животни') {
      primary.href = addUrl('Животни', group);
      return;
    }
    if (context === 'Заведения') {
      primary.href = '#add/firm?category=Заведения';
    }
  }

  function rewritePropertyPage() {
    const {path} = parsed();
    if (path !== 'imoti') return;
    document.querySelectorAll('.family-card').forEach(card => {
      const title = card.querySelector('h3')?.textContent?.trim();
      if (!propertyKinds.includes(title)) return;
      const q = new URLSearchParams({context:'Имоти',group:title,detail:'listing',owner:'Listings',type:propertyType});
      card.href = `#results?${q}`;
    });
    const add = [...document.querySelectorAll('.page-tools a')].find(a => /Добави имот/.test(a.textContent || ''));
    if (add) add.href = addUrl('Имоти','',propertyType);
  }

  function rewriteAutoPage() {
    const {path} = parsed();
    if (path !== 'avtomobili') return;
    document.querySelectorAll('.family-card').forEach(card => {
      const title = card.querySelector('h3')?.textContent?.trim();
      if (title !== 'Автомобилни услуги') return;
      const q = new URLSearchParams({context:'Услуги',group:'Автомобилни услуги',detail:'listing',owner:'Listings'});
      card.href = `#results?${q}`;
    });
  }

  function setOptions(select, values, selected='') {
    if (!select) return;
    const first = '<option value="">Избери</option>';
    select.innerHTML = first + values.map(v => `<option value="${v.replaceAll('&','&amp;').replaceAll('"','&quot;')}"${v===selected?' selected':''}>${v}</option>`).join('');
  }

  function syncListingForm() {
    const {path,query} = parsed();
    if (path !== 'add/listing') return;
    const category = query.get('category') || '';
    const subcategory = query.get('subcategory') || '';
    const type = query.get('type') || '';
    const sub = document.getElementById('listing-subcategory');
    const typeSelect = document.getElementById('listing-type');
    const title = document.querySelector('[data-proto-form] input[type="text"]');

    if (category === 'Работа') setOptions(sub, workGroups, subcategory);
    else if (category === 'Имоти') setOptions(sub, propertyKinds, subcategory);
    else if (category === 'Автомобили и МПС') setOptions(sub, autoKinds, subcategory);
    else if (subcategory && sub && ![...sub.options].some(o => o.value === subcategory)) setOptions(sub, [subcategory,'Друго'], subcategory);

    if (typeSelect && type) typeSelect.value = type;
    if (title) {
      const examples = {
        'Животни':'Напр. Котка търси дом в Лом',
        'Работа':'Напр. Търсим шофьор за доставки',
        'Имоти':'Напр. Продавам двустаен апартамент в Лом',
        'Услуги':'Напр. Предлагам ВиК услуги в Лом',
        'Автомобили и МПС':'Напр. Продавам автомобил в Лом'
      };
      title.placeholder = examples[category] || 'Напр. Продавам запазен велосипед в Лом';
    }
  }

  function sync() {
    rewriteResults();
    rewritePropertyPage();
    rewriteAutoPage();
    syncListingForm();
  }

  document.addEventListener('click', event => {
    const tab = event.target.closest('[data-demo-tab]');
    if (!tab || parsed().path !== 'imoti') return;
    const map = {
      'Продава':'Продава имот',
      'Отдава под наем':'Отдава под наем',
      'Купува':'Търси за купуване',
      'Търси под наем':'Търси под наем'
    };
    propertyType = map[tab.textContent.trim()] || propertyType;
    queueMicrotask(rewritePropertyPage);
  });

  window.addEventListener('hashchange', () => queueMicrotask(sync));
  sync();
})();
