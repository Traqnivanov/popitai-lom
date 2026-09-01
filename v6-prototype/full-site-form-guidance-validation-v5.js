(function () {
  'use strict';

  var app = document.getElementById('app');
  if (!app) return;

  function ensureStyles() {
    if (document.getElementById('v6-smart-form-style')) return;
    var style = document.createElement('style');
    style.id = 'v6-smart-form-style';
    style.textContent = [
      '.v6-smart-hint{display:block;margin:7px 0 0;color:#667085;font-size:13px;line-height:1.45}',
      '.v6-smart-error{margin:6px 0 0;color:#b42318;font-size:13px;font-weight:800;line-height:1.4}',
      '.v6-smart-error:empty{display:none}',
      '.form-shell input.v6-invalid,.form-shell textarea.v6-invalid,.form-shell select.v6-invalid{border-color:#b42318!important;box-shadow:0 0 0 3px rgba(180,35,24,.12)!important}',
      '.form-shell input.v6-valid,.form-shell textarea.v6-valid,.form-shell select.v6-valid{border-color:#2e7d32}',
      '.v6-field-counter{float:right;font-weight:800;font-variant-numeric:tabular-nums}',
      '.v6-field-counter.is-near{color:#9a6700}',
      '.v6-field-counter.is-over{color:#b42318}'
    ].join('');
    document.head.appendChild(style);
  }

  function escId(value) {
    return String(value || '').replace(/[^a-zA-Z0-9_-]+/g, '-');
  }

  function fieldLabel(field) {
    var wrap = field && field.closest ? field.closest('.field') : null;
    var label = wrap && wrap.querySelector('label');
    return String(label ? label.textContent : '').replace(/\s+/g, ' ').trim();
  }

  function ensureHint(field, key) {
    if (!field) return null;
    var id = 'v6-hint-' + escId(key);
    var hint = document.getElementById(id);
    if (!hint) {
      hint = document.createElement('small');
      hint.id = id;
      hint.className = 'v6-smart-hint';
      field.insertAdjacentElement('afterend', hint);
    }
    var ids = new Set(String(field.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean));
    ids.add(id);
    field.setAttribute('aria-describedby', Array.from(ids).join(' '));
    return hint;
  }

  function ensureError(field, key) {
    if (!field) return null;
    var id = 'v6-error-' + escId(key);
    var error = document.getElementById(id);
    if (!error) {
      error = document.createElement('p');
      error.id = id;
      error.className = 'v6-smart-error';
      error.setAttribute('aria-live', 'polite');
      var hint = field.nextElementSibling && field.nextElementSibling.classList.contains('v6-smart-hint') ? field.nextElementSibling : null;
      (hint || field).insertAdjacentElement('afterend', error);
    }
    var ids = new Set(String(field.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean));
    ids.add(id);
    field.setAttribute('aria-describedby', Array.from(ids).join(' '));
    return error;
  }

  function setState(field, key, message, showSuccess) {
    if (!field) return true;
    var error = ensureError(field, key);
    if (error) error.textContent = message || '';
    field.classList.toggle('v6-invalid', Boolean(message));
    field.classList.toggle('v6-valid', !message && Boolean(showSuccess) && Boolean(String(field.value || '').trim()));
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    return !message;
  }

  function textLength(value) {
    return Array.from(String(value || '')).length;
  }

  function phoneDigits(value) {
    return String(value || '').replace(/\D/g, '');
  }

  function phoneMessage(value, required) {
    var raw = String(value || '').trim();
    if (!raw) return required ? 'Въведи телефон за връзка.' : '';
    if (/\p{L}/u.test(raw)) return 'Телефонът не може да съдържа букви.';
    if (!/^[+\d\s().-]+$/.test(raw)) return 'Използвай само цифри, интервали, +, тирета или скоби.';
    if ((raw.match(/\+/g) || []).length > 1 || (raw.indexOf('+') >= 0 && raw.charAt(0) !== '+')) return 'Знакът + може да бъде само веднъж и в началото.';
    var digits = phoneDigits(raw);
    if (/^(\d)\1+$/.test(digits)) return 'Въведи реален телефонен номер.';
    if (raw.charAt(0) === '+') {
      if (raw.indexOf('+359') !== 0) return 'Българският международен номер трябва да започва с +359.';
      if (digits.length !== 11 && digits.length !== 12) return 'След +359 трябва да има 8 или 9 цифри.';
      if (digits.charAt(3) === '0') return 'След +359 не се изписва началната нула.';
      return '';
    }
    if (digits.charAt(0) !== '0') return 'Номерът трябва да започва с 0 или +359.';
    if (digits.length !== 9 && digits.length !== 10) return 'Телефонът трябва да съдържа 9 или 10 цифри.';
    return '';
  }

  function meaningfulTextMessage(value, min, max, label) {
    var text = String(value || '').trim();
    var len = textLength(text);
    if (!text) return 'Въведи ' + label + '.';
    if (len < min) return 'Добави още ' + (min - len) + ' знака.';
    if (len > max) return 'Полето може да съдържа най-много ' + max + ' знака.';
    var words = text.match(/[\p{L}\p{N}]+/gu) || [];
    if (words.length < 3) return 'Добави по-ясна и полезна информация.';
    return '';
  }

  function titleMessage(value) {
    var text = String(value || '').trim();
    if (!text) return 'Въведи заглавие.';
    if (textLength(text) < 5) return 'Заглавието трябва да е поне 5 знака.';
    if (textLength(text) > 120) return 'Заглавието може да е най-много 120 знака.';
    return '';
  }

  function requiredSelectMessage(field, label) {
    return String(field && field.value || '').trim() ? '' : 'Избери ' + label + '.';
  }

  function listingFields(form) {
    return {
      group: form.querySelector('#v6-listing-group'),
      subcategory: form.querySelector('#v6-listing-subcategory'),
      type: form.querySelector('#v6-listing-type'),
      title: form.querySelector('input[minlength="5"][maxlength="120"]'),
      description: form.querySelector('textarea[minlength="20"]'),
      price: form.querySelector('#v6-price-eur'),
      phone: form.querySelector('input[type="tel"]')
    };
  }

  function activeIntent(form) {
    var active = form.querySelector('[data-v6-intent].active');
    return active && active.getAttribute('data-v6-intent') === 'seek' ? 'seek' : 'offer';
  }

  function listingContext(form) {
    var fields = listingFields(form);
    var group = fields.group ? fields.group.value : '';
    var sub = fields.subcategory ? fields.subcategory.value : '';
    var intent = activeIntent(form);
    var seek = intent === 'seek';

    if (sub === 'Работа') {
      return seek ? {
        title: 'Например: Търся работа като шофьор в Лом',
        hint: 'Опиши опита, уменията, квалификацията, кога можеш да започнеш и важните условия.'
      } : {
        title: 'Например: Търсим продавач-консултант в Лом',
        hint: 'Посочи длъжност, работно време, изисквания, условия и начин за контакт.'
      };
    }

    if (sub === 'Имоти') {
      return seek ? {
        title: 'Например: Търся апартамент под наем в Лом',
        hint: 'Посочи район, размер, бюджет, срок и важните изисквания.'
      } : {
        title: 'Например: Продавам двустаен апартамент в Лом',
        hint: 'Посочи район, квадратура, етаж, състояние, особености и цена.'
      };
    }

    if (group === 'construction') {
      var topic = sub || 'ремонт';
      return seek ? {
        title: 'Например: Търся майстор за ' + topic.toLocaleLowerCase('bg-BG') + ' в Лом',
        hint: 'Опиши какво трябва да се направи, приблизителния обем, района, срока и важните условия.'
      } : {
        title: 'Например: Предлагам ' + topic.toLocaleLowerCase('bg-BG') + ' в Лом',
        hint: 'Опиши какви дейности извършваш, района, срока и важните условия за клиента.'
      };
    }

    if (group === 'cars') {
      if (sub === 'Автомобили за продажба или търсене') {
        return seek ? {
          title: 'Например: Търся автомобил до 6000 евро в Лом',
          hint: 'Посочи марка/тип, бюджет, година или други важни изисквания.'
        } : {
          title: 'Например: Продавам Opel Astra 2012 г.',
          hint: 'Посочи марка, модел, година, двигател, състояние, пробег и важни особености.'
        };
      }
      return seek ? {
        title: 'Например: Търся автосервиз за диагностика в Лом',
        hint: 'Опиши автомобила, проблема и каква услуга търсиш.'
      } : {
        title: 'Например: Предлагам автомобилна диагностика в Лом',
        hint: 'Опиши услугата, за какви автомобили е, района и важните условия.'
      };
    }

    if (group === 'services') {
      return seek ? {
        title: 'Например: Търся помощ за преместване в Лом',
        hint: 'Опиши каква услуга търсиш, къде, кога и важните условия.'
      } : {
        title: 'Например: Предлагам почистване на домове в Лом',
        hint: 'Опиши точно услугата, района, условията и начина за контакт.'
      };
    }

    return seek ? {
      title: 'Например: Търся употребяван телевизор в Лом',
      hint: 'Опиши какво търсиш, важните характеристики, бюджет и район.'
    } : {
      title: 'Например: Продавам телевизор Samsung 55 инча',
      hint: 'Опиши състоянието, модела/размера, цената, района и важните характеристики.'
    };
  }

  function updateListingGuidance(form) {
    var fields = listingFields(form);
    if (!fields.title || !fields.description) return;
    var context = listingContext(form);
    fields.title.placeholder = context.title;
    fields.description.placeholder = context.hint;
    var titleHint = ensureHint(fields.title, 'listing-title');
    var descHint = ensureHint(fields.description, 'listing-description');
    if (titleHint) titleHint.innerHTML = context.title + ' <span class="v6-field-counter" data-v6-counter="title"></span>';
    if (descHint) descHint.innerHTML = context.hint + ' <span class="v6-field-counter" data-v6-counter="description"></span>';
    updateListingCounters(form);
  }

  function updateListingCounters(form) {
    var fields = listingFields(form);
    [['title', fields.title, 120], ['description', fields.description, 5000]].forEach(function (item) {
      var counter = form.querySelector('[data-v6-counter="' + item[0] + '"]');
      if (!counter || !item[1]) return;
      var len = textLength(item[1].value);
      counter.textContent = len + ' / ' + item[2];
      counter.classList.toggle('is-near', len >= item[2] * 0.9 && len <= item[2]);
      counter.classList.toggle('is-over', len > item[2]);
    });
  }

  function listingValidationItems(form) {
    var f = listingFields(form);
    return [
      [f.group, 'listing-group', function () { return requiredSelectMessage(f.group, 'главна група'); }],
      [f.subcategory, 'listing-subcategory', function () { return requiredSelectMessage(f.subcategory, 'подкатегория'); }],
      [f.type, 'listing-type', function () { return requiredSelectMessage(f.type, 'вид на обявата'); }],
      [f.title, 'listing-title', function () { return titleMessage(f.title.value); }],
      [f.description, 'listing-description', function () { return meaningfulTextMessage(f.description.value, 20, 5000, 'описание'); }],
      [f.price, 'listing-price', function () {
        if (!String(f.price.value || '').trim()) return '';
        return Number(f.price.value) < 0 ? 'Цената не може да е отрицателна.' : '';
      }],
      [f.phone, 'listing-phone', function () { return phoneMessage(f.phone.value, true); }]
    ].filter(function (item) { return Boolean(item[0]); });
  }

  function firmFields(form) {
    var inputs = Array.from(form.querySelectorAll('.field input, .field textarea, .field select'));
    var name = inputs.find(function (field) { return field.tagName === 'INPUT' && field.getAttribute('minlength') === '2' && field.getAttribute('maxlength') === '120'; });
    var category = inputs.find(function (field) { return field.tagName === 'SELECT' && field.required; });
    var phone = inputs.find(function (field) { return field.getAttribute('type') === 'tel'; });
    var description = inputs.find(function (field) { return field.tagName === 'TEXTAREA' && field.required && field.getAttribute('minlength') === '20'; });
    var website = inputs.find(function (field) { return field.getAttribute('type') === 'url'; });
    return { name: name, category: category, phone: phone, description: description, website: website };
  }

  function firmContext(category) {
    var value = String(category || '');
    if (value.indexOf('Строителство') >= 0) return {
      name: 'Например: Иванов Ремонти',
      description: 'Опиши основните услуги, района на работа и полезна информация за клиента.'
    };
    if (value.indexOf('Заведения') >= 0) return {
      name: 'Например: Ресторант Дунав',
      description: 'Опиши типа заведение/храна, района, работното време и полезна информация за посетителите.'
    };
    if (value.indexOf('Красота') >= 0) return {
      name: 'Например: Салон Стил',
      description: 'Опиши услугите, за кого са, района и начина за записване или контакт.'
    };
    return {
      name: 'Например: Реалното име на фирмата',
      description: 'Опиши точните услуги, района, условията и полезна информация за клиента.'
    };
  }

  function updateFirmGuidance(form) {
    var f = firmFields(form);
    if (!f.name || !f.description) return;
    var context = firmContext(f.category ? f.category.value : '');
    f.name.placeholder = context.name;
    f.description.placeholder = context.description;
    var nameHint = ensureHint(f.name, 'firm-name');
    var descriptionHint = ensureHint(f.description, 'firm-description');
    if (nameHint) nameHint.innerHTML = 'Напиши реалното име, с което клиентите познават фирмата. <span class="v6-field-counter" data-v6-counter="firm-name"></span>';
    if (descriptionHint) descriptionHint.innerHTML = context.description + ' <span class="v6-field-counter" data-v6-counter="firm-description"></span>';
    if (f.phone) {
      var phoneHint = ensureHint(f.phone, 'firm-phone');
      if (phoneHint) phoneHint.textContent = 'Например: 0888 123 456 или +359 888 123 456';
    }
    updateFirmCounters(form);
  }

  function updateFirmCounters(form) {
    var f = firmFields(form);
    [['firm-name', f.name, 120], ['firm-description', f.description, 5000]].forEach(function (item) {
      var counter = form.querySelector('[data-v6-counter="' + item[0] + '"]');
      if (!counter || !item[1]) return;
      var len = textLength(item[1].value);
      counter.textContent = len + ' / ' + item[2];
      counter.classList.toggle('is-near', len >= item[2] * 0.9 && len <= item[2]);
      counter.classList.toggle('is-over', len > item[2]);
    });
  }

  function firmValidationItems(form) {
    var f = firmFields(form);
    return [
      [f.name, 'firm-name', function () {
        var text = String(f.name.value || '').trim();
        if (!text) return 'Въведи име на фирмата.';
        if (textLength(text) < 2) return 'Името трябва да съдържа поне 2 знака.';
        if (textLength(text) > 120) return 'Името може да съдържа най-много 120 знака.';
        if (!/\p{L}/u.test(text)) return 'Името трябва да съдържа поне една буква.';
        return '';
      }],
      [f.category, 'firm-category', function () { return requiredSelectMessage(f.category, 'категория'); }],
      [f.phone, 'firm-phone', function () { return phoneMessage(f.phone.value, true); }],
      [f.description, 'firm-description', function () { return meaningfulTextMessage(f.description.value, 20, 5000, 'описание'); }],
      [f.website, 'firm-website', function () {
        var value = String(f.website && f.website.value || '').trim();
        if (!value) return '';
        try {
          var url = new URL(value);
          return url.protocol === 'http:' || url.protocol === 'https:' ? '' : 'Въведи валиден адрес на сайт, започващ с http:// или https://.';
        } catch (_) {
          return 'Въведи валиден адрес на сайт, например https://example.com.';
        }
      }]
    ].filter(function (item) { return Boolean(item[0]); });
  }

  function genericValidationItems(form) {
    var items = [];
    Array.from(form.querySelectorAll('input, textarea, select')).forEach(function (field, index) {
      if (field.type === 'hidden' || field.type === 'submit' || field.type === 'button') return;
      var label = fieldLabel(field) || 'полето';
      var key = 'generic-' + index + '-' + label;
      items.push([field, key, function () {
        var value = String(field.value || '').trim();
        if (field.required && !value && field.type !== 'checkbox') return 'Попълни ' + label.toLocaleLowerCase('bg-BG') + '.';
        if (field.type === 'checkbox' && field.required && !field.checked) return 'Потвърди това условие, за да продължиш.';
        if (value && field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Въведи валиден адрес на електронна поща.';
        if (value && field.type === 'tel') return phoneMessage(value, field.required);
        var min = Number(field.getAttribute('minlength') || 0);
        var max = Number(field.getAttribute('maxlength') || 0);
        if (value && min && textLength(value) < min) return 'Добави още ' + (min - textLength(value)) + ' знака.';
        if (value && max && textLength(value) > max) return 'Полето може да съдържа най-много ' + max + ' знака.';
        return '';
      }]);
    });
    return items;
  }

  function validationItems(form) {
    var type = form.getAttribute('data-v6-form');
    if (type === 'listing') return listingValidationItems(form);
    if (type === 'firm') return firmValidationItems(form);
    return genericValidationItems(form);
  }

  function validateOne(item, showSuccess) {
    var field = item[0];
    if (!field || field.disabled) return true;
    return setState(field, item[1], item[2](), showSuccess);
  }

  function validateForm(form) {
    var items = validationItems(form);
    var firstInvalid = null;
    items.forEach(function (item) {
      item[0].dataset.v6Touched = '1';
      if (!validateOne(item, true) && !firstInvalid) firstInvalid = item[0];
    });
    if (!firstInvalid) return true;
    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.setTimeout(function () { try { firstInvalid.focus({ preventScroll: true }); } catch (_) { firstInvalid.focus(); } }, 220);
    return false;
  }

  function wireValidation(form) {
    if (form.dataset.v6SmartValidation === '1') return;
    form.dataset.v6SmartValidation = '1';
    validationItems(form).forEach(function (item) {
      var field = item[0];
      if (!field) return;
      field.addEventListener('blur', function () {
        field.dataset.v6Touched = '1';
        validateOne(item, true);
      });
      var eventName = field.tagName === 'SELECT' || field.type === 'checkbox' ? 'change' : 'input';
      field.addEventListener(eventName, function () {
        if (field.dataset.v6Touched === '1' || field.classList.contains('v6-invalid')) validateOne(item, true);
        if (form.getAttribute('data-v6-form') === 'listing') updateListingCounters(form);
        if (form.getAttribute('data-v6-form') === 'firm') updateFirmCounters(form);
      });
    });
  }

  function updateAdminImageCopy(form) {
    var note = form.parentElement && form.parentElement.querySelector('.v6-role-note strong');
    var isAdmin = note && note.textContent.indexOf('Администратор') >= 0;
    if (!isAdmin) return;
    Array.from(form.querySelectorAll('.v6-upload')).forEach(function (section) {
      var h2 = section.querySelector('h2');
      var p = section.querySelector('p');
      if (!h2 || !p) return;
      if (h2.textContent.trim() === 'Снимки' || h2.textContent.indexOf('Снимки на обекти') >= 0) {
        p.textContent = 'Администраторското съдържание няма лимит за снимки според каноничното backend правило.';
      }
    });
  }

  function enhanceForm(form) {
    if (!form) return;
    var type = form.getAttribute('data-v6-form');
    if (type === 'listing') updateListingGuidance(form);
    if (type === 'firm') updateFirmGuidance(form);
    updateAdminImageCopy(form);
    wireValidation(form);
  }

  function enhanceAll() {
    Array.from(app.querySelectorAll('form')).forEach(enhanceForm);
  }

  document.addEventListener('change', function (event) {
    var form = event.target.closest && event.target.closest('form');
    if (!form) return;
    if (form.getAttribute('data-v6-form') === 'listing' && (event.target.id === 'v6-listing-group' || event.target.id === 'v6-listing-subcategory' || event.target.id === 'v6-listing-type')) {
      window.setTimeout(function () { updateListingGuidance(form); wireValidation(form); }, 0);
    }
    if (form.getAttribute('data-v6-form') === 'firm' && event.target.tagName === 'SELECT') updateFirmGuidance(form);
  }, true);

  document.addEventListener('click', function (event) {
    var intent = event.target.closest && event.target.closest('[data-v6-intent]');
    if (intent) {
      var listingForm = intent.closest('form[data-v6-form="listing"]');
      if (listingForm) window.setTimeout(function () { updateListingGuidance(listingForm); }, 0);
    }

    var submit = event.target.closest && event.target.closest('button[type="submit"],input[type="submit"]');
    if (!submit) return;
    var form = submit.closest('form');
    if (!form || !app.contains(form)) return;
    if (!validateForm(form)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  var observer = new MutationObserver(function () { enhanceAll(); });
  observer.observe(app, { childList: true, subtree: true });

  ensureStyles();
  enhanceAll();
})();
