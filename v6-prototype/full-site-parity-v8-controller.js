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
    const section = document.createElement('section');
    section.className = 'v8-media';
    section.dataset.v8CurrentMedia = '';
    section.innerHTML = `<div class="v8-media-head"><div><strong>${esc(label)}</strong><div class="v8-media-help">Текущата публикувана снимка остава, докато собственикът изрично не я премахне или замени.</div></div></div><article class="v8-media-card"><div style="aspect-ratio:4/3;display:grid;place-items:center;background:#eef2f7">Текуща снимка</div><div class="body"><span class="badge-main">Публикувана</span><strong>existing-image.webp</strong><small data-current-media-status>Запазва се</small><div class="form-actions"><button type="button" data-current-media-remove>Премахни при запис</button><button type="button" data-current-media-replace>Замени</button></div></div></article>`;
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
    const select = form.querySelector('select[name="category"]');
    select?.addEventListener('change',() => renderShopClassification(form));
  }

  function syncAddAria() {
    if (!addSheet) return;
    document.querySelectorAll('[data-open-add]').forEach(trigger => trigger.setAttribute('aria-expanded',String(!addSheet.hidden)));
  }

  function enhanceAuthLegalLinks() {
    const form = app.querySelector('form[data-v8-form="register"]');
    if (!form || form.querySelector('[data-v8-legal-links]')) return;
    const consent = form.querySelector('input[name="terms"]')?.closest('.check-row');
    if (!consent) return;
    const links = document.createElement('div');
    links.dataset.v8LegalLinks = '';
    links.className = 'detail-actions';
    links.innerHTML = '<button type="button" data-route="rules">Условия за ползване</button><button type="button" data-route="privacy">Поверителност</button>';
    consent.insertAdjacentElement('afterend',links);
  }

  function init() {
    applyListingTypePrefill();
    ensureCurrentMedia();
    wireShopForm();
    enhanceAuthLegalLinks();
    syncAddAria();
  }

  document.addEventListener('click',event => {
    const remove = event.target.closest?.('[data-current-media-remove]');
    if (remove) {
      const card = remove.closest('.v8-media-card');
      const status = card?.querySelector('[data-current-media-status]');
      if (status) status.textContent = 'Ще бъде премахната при успешен запис';
      card?.classList.toggle('is-marked-remove');
      remove.textContent = card?.classList.contains('is-marked-remove') ? 'Отмени премахването' : 'Премахни при запис';
      return;
    }

    const replace = event.target.closest?.('[data-current-media-replace]');
    if (replace) {
      const current = replace.closest('[data-v8-current-media]');
      const uploader = current?.nextElementSibling;
      uploader?.querySelector('[data-media-input]')?.click();
      return;
    }

    const searchRetry = event.target.closest?.('[data-search-state][data-route="search"]');
    if (searchRetry && window.PopitaiV6?.state) window.PopitaiV6.state.searchState = searchRetry.dataset.searchState;
  },true);

  if (addSheet) new MutationObserver(syncAddAria).observe(addSheet,{attributes:true,attributeFilter:['hidden']});
  new MutationObserver(init).observe(app,{childList:true,subtree:true});
  init();
}());
