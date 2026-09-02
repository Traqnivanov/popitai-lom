(function () {
  'use strict';

  const app = document.getElementById('app');
  const addSheet = document.getElementById('add-sheet');
  if (!app) return;

  const initialized = new WeakSet();
  const shopTags = {
    food:['Супермаркет','Месо и колбаси','Плодове и зеленчуци'],
    construction:['Строителни материали','Бои','Железария','Санитария'],
    tech:['Телефони','Компютри','Бяла техника'],
    furniture:['Кухни','Мека мебел','Спални'],
    clothes:['Дамски','Мъжки','Обувки'],
    home:['Домашни потреби','Градина','Подаръци']
  };

  const copyReplacements = new Map([
    ['Избери тема. Съдържанието идва от правилния owner и не се дублира.','Избери тема. Съдържанието идва от правилния раздел и не се дублира.'],
    ['Местният marketplace','Местни обяви и услуги'],
    ['Owner: Listings.','Източник: Обяви.'],
    ['Защитен приоритет след relevance','Защитен приоритет след релевантност'],
    ['Релевантен Firms резултат.','Релевантен фирмен профил.'],
    ['Тук се пазят реалните снимки, описание, цена, контакт и owner контекст на обявата.','Тук се пазят реалните снимки, описанието, цената, контактът и контекстът на обявата.'],
    ['Модераторът публикува собственото си съдържание по същия non-Admin поток — без самоодобрение.','Модераторът публикува собственото си съдържание по същия поток като обикновения потребител — без самоодобрение.'],
    ['Admin поток: директна публикация. Protected options остават Admin-only.','Администраторски поток: директна публикация. Защитените опции остават само за администратора.'],
    ['Нормален owner поток: новата обява чака преглед.','Обикновен потребител: новата обява чака преглед.'],
    ['Редакция: последната одобрена публична версия остава видима, докато non-Admin редакцията чака преглед.','Редакция: последната одобрена публична версия остава видима, докато редакцията на неадминистратор чака преглед.'],
    ['Преди create V6 проверява за сходно заглавие/контекст и предупреждава, без да блокира валидна нова публикация.','Преди публикуване V6 проверява за сходно заглавие и контекст и предупреждава, без да блокира валидна нова обява.'],
    ['При въвеждане production показва ориентир и в лева.','При въвеждане се показва ориентир и в лева.'],
    ['Admin-owned listing: backend няма image limit.','За администраторска обява системното правило няма лимит за снимки.'],
    ['До 6 снимки. Първата е главна; при edit се запазва current-media workflow.','До 6 снимки. Първата е главна; при редакция се запазва работата с текущите снимки.'],
    ['Пълният approved Listing owner flow е представен без промяна на роли, квоти или direct publish.','Пълният одобрен поток за обявите е представен без промяна на роли, квоти или директно публикуване.'],
    ['Модераторът работи със собствената си фирма като normal owner — без direct publish и без самоодобрение.','Модераторът работи със собствената си фирма като обикновен собственик — без директно публикуване и без самоодобрение.'],
    ['Admin: директно публикуване + автоматичен expanded access.','Администратор: директно публикуване и автоматичен разширен достъп.'],
    ['Разширеният достъп е даден от Admin. Owner не може сам да го включи.','Разширеният достъп е даден от администратора. Собственикът не може сам да го включи.'],
    ['Новата фирма започва без expanded access и чака преглед.','Новата фирма започва без разширен достъп и чака преглед.'],
    ['Admin-owned firm media: backend няма image limit.','За администраторска фирма системното правило няма лимит за снимки.'],
    ['Basic + expanded owner permissions са отделени и не се променят от V6 presentation.','Основният и разширеният фирмен профил са отделени и правата им не се променят от новата визия.'],
    ['Presentation място само когато owner data реално го поддържа; не се представя като доказана текуща edit функция.','Тази секция се показва само когато реалните фирмени данни я поддържат; не се представя като готова функция за редакция, ако такава няма.'],
    ['Protected: V6 не премахва expanded access, contact/gallery/Construction/Listings relationships или protected ordering.','Защитено: V6 не премахва разширения достъп, контактите, галерията, връзките със Строителство и Обяви или защитеното подреждане.'],
    ['Променливите телефони, адреси и работно време остават при Info owner и се показват със source/freshness.','Променливите телефони, адреси и работно време остават в Инфо Лом и се показват с източник и дата на потвърждение.'],
    ['Проверен адрес и контакти от Health/Info owner','Проверен адрес и контакти от Здраве / Инфо Лом'],
    ['Официалната информация за прием, НЗОК, телефон и насочване се показва от verified owner.','Официалната информация за прием, НЗОК, телефон и насочване се показва от проверения здравен източник.'],
    ['Пълният списък се пази при Health owner.','Пълният списък се пази в раздел Здраве.'],
    ['Еднакъв V6 discovery shell, но specialized verified Health/Info owner.','Еднакъв V6 интерфейс за откриване, но проверената здравна информация остава в специализирания раздел Здраве / Инфо Лом.'],
    ['Изпращането е pending към specialized Health/Info owner; няма generic direct publish.','Предложението чака проверка в Здраве / Инфо Лом; няма общо директно публикуване.'],
    ['Сигналът се преглежда от администратор/Info owner.','Сигналът се преглежда от администратор и отговорния раздел на Инфо Лом.'],
    ['Специализиран Shop owner; формата не bypass-ва каталога.','Формата остава в специализирания каталог „Магазини“ и не го заобикаля.'],
    ['Постоянните профили се намират през Firms owner; Q&A може да носи препоръки.','Постоянните профили се намират през „Фирми“, а въпросите могат да съдържат препоръки от общността.'],
    ['Постоянният профил остава при Firms owner.','Постоянният профил остава в раздел „Фирми“.'],
    ['Одобрени събития и местен discovery. Няма публична форма „Добави събитие“.','Одобрени събития и лесно местно откриване. Няма публична форма „Добави събитие“.'],
    ['Ако търсенето е за официална институционална информация, recovery води към Инфо Лом, а не към fake Event Add.','Ако търсенето е за официална институционална информация, следващата стъпка води към Инфо Лом, а не към несъществуваща форма за добавяне на събитие.'],
    ['Релевантен provider result.','Релевантен фирмен резултат.'],
    ['Някои owner-и временно не отговориха. Показаното е само от успешно проверените източници.','Някои раздели временно не отговориха. Показаното е само от успешно проверените източници.'],
    ['Проверяваме релевантните owner-и.','Проверяваме релевантните раздели.'],
    ['Owner-aware резултати и пълни recovery states.','Резултати от правилните раздели и пълни състояния при зареждане, липса на резултат и грешка.'],
    ['Стъпка по стъпка с връзка към актуалния owner.','Стъпка по стъпка с връзка към актуалния източник.'],
    ['Само материали със статус B4 „ПРОВЕРЕНО ГОТОВО“ могат да станат официално searchable/shareable production content.','Само материали със статус „ПРОВЕРЕНО ГОТОВО“ могат да влизат в официалното търсене и споделяне.'],
    ['Ясни стъпки; актуалните факти идват от authoritative owner.','Ясни стъпки; актуалните факти идват от проверения официален източник.'],
    ['Връзка към съответния Info/official owner.','Връзка към съответния раздел на Инфо Лом или официален източник.'],
    ['Преди create V6 предлага сходни въпроси. Един intent трябва да има един canonical knowledge center.','Преди публикуване V6 предлага сходни въпроси. За една и съща тема се насочва към един основен въпрос, когато такъв вече съществува.'],
    ['Ако вече има каноничен въпрос за същата тема, потребителят се насочва към него вместо да създава ненужен duplicate.','Ако вече има основен въпрос за същата тема, потребителят се насочва към него вместо да създава ненужно повторение.'],
    ['Ако owner flow позволява снимки, gallery capability не се губи.','Когато формата позволява снимки, възможността за галерия се запазва.'],
    ['Admin QA: директното публикуване и protected options са отделени от normal owner content.','QA — Администратор: директното публикуване и защитените опции са отделени от съдържанието на обикновен потребител.'],
    ['Moderator QA: собственото съдържание остава normal non-Admin flow.','QA — Модератор: собственото съдържание остава по обикновения неадминистраторски поток.'],
    ['Обикновен потребител: тук се виждат всички важни statuses, drafts и correction flows.','Обикновен потребител: тук се виждат важните статуси, чакащите редакции и корекциите.'],
    ['Фирма с Admin-granted expanded access','Фирма с разширен достъп, даден от администратора'],
    ['Prototype preview/remove/caption; production owner запазва реалната оптимизация и вариантите.','Прототипът показва преглед, премахване и описание; реалната система запазва оптимизацията и различните размери на снимките.'],
    ['без backend лимит за Admin','без системен лимит за администратора'],
    ['Готово за production optimization variants','Готово за оптимизация в реалната система']
  ]);

  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));

  function applyListingTypePrefill() {
    const form = app.querySelector('form[data-v8-form="listing"]');
    if (!form) return;
    const requested = String(window.PopitaiV6?.state?.ctx?.prefillType || '').trim();
    if (!requested) return;
    const select = form.querySelector('[data-listing-special] select');
    if (!select) return;
    const option = Array.from(select.options).find(item => item.value === requested || item.textContent.trim() === requested);
    if (!option) return;
    select.value = option.value;
    select.dispatchEvent(new Event('change',{bubbles:true}));
  }

  function currentMediaSection(root, label) {
    if (!root || root.previousElementSibling?.matches('[data-v8-current-media]')) return;
    const key = `${root.id || 'media'}_current_action`;
    const section = document.createElement('section');
    section.className = 'v8-media';
    section.dataset.v8CurrentMedia = '';
    section.innerHTML = `<input type="hidden" name="${esc(key)}" value="" data-current-media-action><div class="v8-media-head"><div><strong>${esc(label)}</strong><div class="v8-media-help">Текущата публикувана снимка остава, докато собственикът изрично не я премахне или замени.</div></div></div><article class="v8-media-card"><div style="aspect-ratio:4/3;display:grid;place-items:center;background:#eef2f7">Текуща снимка</div><div class="body"><span class="badge-main">Публикувана</span><strong>existing-image.webp</strong><small data-current-media-status>Запазва се</small><div class="form-actions"><button type="button" data-current-media-remove>Премахни при запис</button><button type="button" data-current-media-replace>Замени</button></div></div></article>`;
    root.insertAdjacentElement('beforebegin',section);
  }

  function ensureCurrentMedia() {
    const listing = app.querySelector('form[data-v8-form="listing"][data-edit="1"]');
    if (listing) currentMediaSection(listing.querySelector('#listing-media'),'Текущи снимки към обявата');
    const firm = app.querySelector('form[data-v8-form="firm"][data-edit="1"]');
    if (firm) {
      currentMediaSection(firm.querySelector('#firm-logo'),'Текущо лого');
      currentMediaSection(firm.querySelector('#firm-gallery'),'Текуща галерия');
    }
  }

  function ensureListingCorrectionCard() {
    const page = app.querySelector('.page');
    if (!page || page.dataset.v8ListingCorrectionAdded === 'true') return;
    const heading = Array.from(page.querySelectorAll('.v8-profile-section > h2')).find(node => node.textContent.trim() === 'Моите обяви');
    const grid = heading?.nextElementSibling;
    if (!grid?.classList.contains('v8-status-grid')) return;
    page.dataset.v8ListingCorrectionAdded = 'true';
    const card = document.createElement('article');
    card.className = 'v8-status-card';
    card.innerHTML = '<div class="meta"><span class="badge error">Нужна корекция</span></div><strong>Обява, върната за корекция</strong><div class="note error"><strong>Бележка от администратора:</strong> Уточни описанието и снимките.</div><div class="actions"><button type="button" data-route="form-listing" data-edit="1">Коригирай и изпрати отново</button></div>';
    grid.appendChild(card);
  }

  function shopClassificationField(form) {
    return Array.from(form.querySelectorAll('fieldset.field')).find(fieldset => fieldset.querySelector('legend')?.textContent.includes('Какво предлага магазинът')) || null;
  }

  function renderShopClassification(form) {
    const select = form.querySelector('select[name="category"]');
    const fieldset = shopClassificationField(form);
    if (!select || !fieldset) return;
    const values = shopTags[select.value] || [];
    const oldCustom = form.querySelector('input[name="custom_tag"]')?.value || '';
    fieldset.innerHTML = `<legend><strong>Какво предлага магазинът — по желание</strong></legend><p class="v8-media-help">Избери едно или повече подходящи уточнения за избраната категория.</p><div class="v8-shop-tags">${values.map(tag => `<label><input type="checkbox" name="shop_tags" value="${esc(tag)}"> ${esc(tag)}</label>`).join('')}</div><div class="field"><label>Друго уточнение<input name="custom_tag" maxlength="80" value="${esc(oldCustom)}" placeholder="Например: местен специализиран продукт"></label><span data-field-error aria-live="polite"></span></div>`;
  }

  function wireShopForm() {
    const form = app.querySelector('form[data-v8-form="shop"]');
    if (!form || initialized.has(form)) return;
    initialized.add(form);
    form.querySelector('select[name="category"]')?.addEventListener('change',() => renderShopClassification(form));
  }

  function syncAddAria() {
    if (!addSheet) return;
    document.querySelectorAll('[data-open-add]').forEach(trigger => trigger.setAttribute('aria-expanded',String(!addSheet.hidden)));
  }

  function enhanceAuth() {
    app.querySelectorAll('input[name="password"],input[name="password_confirm"]').forEach(input => input.dataset.passwordField = 'true');
    const form = app.querySelector('form[data-v8-form="register"]');
    if (!form || form.querySelector('[data-v8-legal-links]')) return;
    const consent = form.querySelector('input[name="terms"]')?.closest('.check-row');
    if (!consent) return;
    const links = document.createElement('div');
    links.dataset.v8LegalLinks = '';
    links.className = 'detail-actions';
    links.innerHTML = '<a class="secondary" href="../uslovia.html" target="_blank" rel="noopener">Условия за ползване</a><a class="secondary" href="../poveritelnost.html" target="_blank" rel="noopener">Поверителност</a>';
    consent.insertAdjacentElement('afterend',links);
  }

  function enhanceHome() {
    const home = app.querySelector('.home-page');
    if (!home || home.dataset.v16HomeEnhanced === 'true') return;
    home.dataset.v16HomeEnhanced = 'true';

    const search = home.querySelector('.hero .search-box');
    if (search && !home.querySelector('[data-v16-home-shortcuts]')) {
      const shortcuts = document.createElement('nav');
      shortcuts.dataset.v16HomeShortcuts = '';
      shortcuts.className = 'home-v16-shortcuts';
      shortcuts.setAttribute('aria-label','Бърз достъп');
      shortcuts.innerHTML = '<span>Бърз достъп:</span><button type="button" data-route="marketplace">Обяви и услуги</button><button type="button" data-route="firms">Фирми</button><button type="button" data-route="info">Инфо Лом</button>';
      search.insertAdjacentElement('afterend',shortcuts);
    }

    const sections = home.querySelectorAll(':scope > .section');
    const categoriesSection = sections[0];
    const discoverSection = sections[1];
    const guidesSection = sections[3];
    const communitySection = sections[4];

    const categoriesHead = categoriesSection?.querySelector('.section-head > div');
    if (categoriesHead && !categoriesHead.querySelector('.home-v16-section-lead')) {
      const lead = document.createElement('p');
      lead.className = 'home-v16-section-lead';
      lead.textContent = 'Бързи входове към най-търсените теми. Обявите, услугите, работата и автомобилите са част от общия раздел „Обяви и услуги“.';
      categoriesHead.appendChild(lead);
    }

    const discoverEyebrow = discoverSection?.querySelector('.section-head .eyebrow');
    if (discoverEyebrow) discoverEyebrow.textContent = 'МЕСТНО В ЛОМ';
    const discoverHead = discoverSection?.querySelector('.section-head > div');
    if (discoverHead && !discoverHead.querySelector('.home-v16-section-lead')) {
      const lead = document.createElement('p');
      lead.className = 'home-v16-section-lead';
      lead.textContent = 'Магазини, заведения, фирми и предстоящи събития на едно място.';
      discoverHead.appendChild(lead);
    }

    const guidesLink = guidesSection?.querySelector('.section-head .text-button');
    if (guidesLink) guidesLink.textContent = 'Всички ръководства →';

    const communityEyebrow = communitySection?.querySelector('.section-head .eyebrow');
    if (communityEyebrow) communityEyebrow.textContent = 'ОБЩНОСТТА';
    const communityTitle = communitySection?.querySelector('.section-head h2');
    if (communityTitle) communityTitle.textContent = 'Въпроси и препоръки';
    const communityHead = communitySection?.querySelector('.section-head > div');
    if (communityHead && !communityHead.querySelector('.home-v16-section-lead')) {
      const lead = document.createElement('p');
      lead.className = 'home-v16-section-lead';
      lead.textContent = 'Попитай, виж личен опит и местни препоръки от хората в Лом.';
      communityHead.appendChild(lead);
    }
  }

  function cleanTechnicalCopy() {
    const walker = document.createTreeWalker(app,NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      let text = node.nodeValue;
      copyReplacements.forEach((replacement,source) => {
        if (text.includes(source)) text = text.replaceAll(source,replacement);
      });
      if (text !== node.nodeValue) node.nodeValue = text;
    });
  }

  function init() {
    applyListingTypePrefill();
    ensureCurrentMedia();
    ensureListingCorrectionCard();
    wireShopForm();
    enhanceAuth();
    enhanceHome();
    cleanTechnicalCopy();
    syncAddAria();
  }

  document.addEventListener('click',event => {
    const remove = event.target.closest?.('[data-current-media-remove]');
    if (remove) {
      const section = remove.closest('[data-v8-current-media]');
      const card = remove.closest('.v8-media-card');
      const status = card?.querySelector('[data-current-media-status]');
      const action = section?.querySelector('[data-current-media-action]');
      card?.classList.toggle('is-marked-remove');
      const marked = Boolean(card?.classList.contains('is-marked-remove'));
      if (status) status.textContent = marked ? 'Ще бъде премахната при успешен запис' : 'Запазва се';
      if (action) {
        action.value = marked ? 'remove' : '';
        action.dispatchEvent(new Event('change',{bubbles:true}));
      }
      remove.textContent = marked ? 'Отмени премахването' : 'Премахни при запис';
      return;
    }

    const replace = event.target.closest?.('[data-current-media-replace]');
    if (replace) {
      const current = replace.closest('[data-v8-current-media]');
      const action = current?.querySelector('[data-current-media-action]');
      if (action) {
        action.value = 'replace';
        action.dispatchEvent(new Event('change',{bubbles:true}));
      }
      current?.nextElementSibling?.querySelector('[data-media-input]')?.click();
      return;
    }

    const searchRetry = event.target.closest?.('[data-search-state][data-route="search"]');
    if (searchRetry && window.PopitaiV6?.state) window.PopitaiV6.state.searchState = searchRetry.dataset.searchState;
  },true);

  if (addSheet) new MutationObserver(syncAddAria).observe(addSheet,{attributes:true,attributeFilter:['hidden']});
  new MutationObserver(init).observe(app,{childList:true,subtree:true});
  init();
}());
