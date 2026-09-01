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
    ['Owner: Listings.','Източник: Обяви.'],
    ['Модераторът публикува собственото си съдържание по същия non-Admin поток — без самоодобрение.','Модераторът публикува собственото си съдържание по същия поток като обикновения потребител — без самоодобрение.'],
    ['Admin поток: директна публикация. Protected options остават Admin-only.','Администраторски поток: директна публикация. Защитените опции остават само за администратора.'],
    ['Нормален owner поток: новата обява чака преглед.','Обикновен потребител: новата обява чака преглед.'],
    ['Редакция: последната одобрена публична версия остава видима, докато non-Admin редакцията чака преглед.','Редакция: последната одобрена публична версия остава видима, докато редакцията на неадминистратор чака преглед.'],
    ['Admin-owned listing: backend няма image limit.','За администраторска обява системното правило няма лимит за снимки.'],
    ['До 6 снимки. Първата е главна; при edit се запазва current-media workflow.','До 6 снимки. Първата е главна; при редакция се запазва работата с текущите снимки.'],
    ['Модераторът работи със собствената си фирма като normal owner — без direct publish и без самоодобрение.','Модераторът работи със собствената си фирма като обикновен собственик — без директно публикуване и без самоодобрение.'],
    ['Admin: директно публикуване + автоматичен expanded access.','Администратор: директно публикуване и автоматичен разширен достъп.'],
    ['Разширеният достъп е даден от Admin. Owner не може сам да го включи.','Разширеният достъп е даден от администратора. Собственикът не може сам да го включи.'],
    ['Новата фирма започва без expanded access и чака преглед.','Новата фирма започва без разширен достъп и чака преглед.'],
    ['Admin-owned firm media: backend няма image limit.','За администраторска фирма системното правило няма лимит за снимки.'],
    ['Protected: V6 не премахва expanded access, contact/gallery/Construction/Listings relationships или protected ordering.','Защитено: V6 не премахва разширения достъп, контактите, галерията, връзките със Строителство и Обяви или защитеното подреждане.'],
    ['Еднакъв V6 discovery shell, но specialized verified Health/Info owner.','Еднакъв V6 интерфейс за откриване, но проверената здравна информация остава в специализирания раздел Здраве / Инфо Лом.'],
    ['Verified Health owner ще я прегледа преди публикация.','Информацията ще бъде проверена от Здраве / Инфо Лом преди публикация.'],
    ['Специализиран Shop owner; формата не bypass-ва каталога.','Формата остава в специализирания каталог „Магазини“ и не го заобикаля.'],
    ['Owner-aware резултати и пълни recovery states.','Резултати от правилните раздели и пълни състояния при зареждане, липса на резултат и грешка.'],
    ['Преди create V6 предлага сходни въпроси. Един intent трябва да има един canonical knowledge center.','Преди публикуване V6 предлага сходни въпроси. За една и съща тема се насочва към един основен въпрос, когато такъв вече съществува.'],
    ['Ако вече има каноничен въпрос за същата тема, потребителят се насочва към него вместо да създава ненужен duplicate.','Ако вече има основен въпрос за същата тема, потребителят се насочва към него вместо да създава ненужно повторение.'],
    ['Prototype preview/remove/caption; production owner запазва реалната оптимизация и вариантите.','Прототипът показва преглед, премахване и описание; реалната система запазва оптимизацията и различните размери на снимките.']
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
    wireShopForm();
    enhanceAuth();
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
