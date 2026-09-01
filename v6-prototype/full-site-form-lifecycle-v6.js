(function () {
  'use strict';

  var app = document.getElementById('app');
  if (!app) return;

  var FORM_SELECTOR = [
    'form.form-shell[data-v6-form]',
    'form.form-shell[data-functional-form]',
    'form.form-shell[data-demo-form]',
    'form.form-shell[data-v6-lifecycle-form]'
  ].join(',');

  var baselines = new WeakMap();
  var initialized = new WeakSet();
  var bypassNavigation = false;
  var discardAction = null;

  function formType(form) {
    return form.getAttribute('data-v6-form') ||
      form.getAttribute('data-functional-form') ||
      form.getAttribute('data-demo-form') ||
      form.getAttribute('data-v6-lifecycle-form') ||
      'form';
  }

  function activeRole() {
    var active = document.querySelector('[data-v6-role].active, [data-v6-role][aria-pressed="true"]');
    return active ? active.getAttribute('data-v6-role') || 'normal' : 'normal';
  }

  function visible(form) {
    return Boolean(form && !form.hidden && form.offsetParent !== null && form.dataset.completed !== 'true');
  }

  function shouldGuard(form) {
    var type = formType(form);
    return !['login', 'forgot', 'reset-password'].includes(type);
  }

  function serialize(form) {
    return Array.from(form.elements || []).map(function (field) {
      if (!field || !field.name && !field.id) return '';
      if (field.type === 'button' || field.type === 'submit' || field.type === 'reset') return '';
      var key = field.name || field.id || field.type;
      if (field.type === 'checkbox' || field.type === 'radio') return key + ':' + (field.checked ? '1' : '0');
      if (field.type === 'file') return key + ':' + (field.files ? field.files.length : 0);
      return key + ':' + String(field.value || '');
    }).join('|');
  }

  function markBaseline(form) {
    baselines.set(form, serialize(form));
    form.dataset.v6Dirty = 'false';
  }

  function isDirty(form) {
    if (!visible(form) || !shouldGuard(form)) return false;
    var baseline = baselines.get(form);
    if (baseline == null) {
      markBaseline(form);
      return false;
    }
    var dirty = serialize(form) !== baseline;
    form.dataset.v6Dirty = dirty ? 'true' : 'false';
    return dirty;
  }

  function activeDirtyForm() {
    return Array.from(document.querySelectorAll(FORM_SELECTOR)).find(isDirty) || null;
  }

  function statusBox(form) {
    var box = form.querySelector(':scope > .v6-form-status');
    if (!box) {
      box = document.createElement('div');
      box.className = 'v6-form-status';
      box.setAttribute('role', 'status');
      box.setAttribute('aria-live', 'polite');
      box.hidden = true;
      form.insertBefore(box, form.firstChild);
    }
    return box;
  }

  function setStatus(form, kind, title, text) {
    var box = statusBox(form);
    box.className = 'v6-form-status is-' + kind;
    box.hidden = false;
    var symbol = kind === 'error' ? '!' : kind === 'progress' ? '…' : '✓';
    box.innerHTML =
      '<span class="v6-form-status-icon" aria-hidden="true">' + symbol + '</span>' +
      '<div><strong>' + escapeHtml(title) + '</strong>' +
      (text ? '<p>' + escapeHtml(text) + '</p>' : '') + '</div>';
  }

  function clearStatus(form) {
    var box = form.querySelector(':scope > .v6-form-status');
    if (!box) return;
    box.hidden = true;
    box.innerHTML = '';
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function fieldLabel(field) {
    var wrap = field.closest('.field');
    var label = wrap ? wrap.querySelector('label, legend') : null;
    if (!label && field.id) label = document.querySelector('label[for="' + CSS.escape(field.id) + '"]');
    return String(label ? label.textContent : 'полето').replace(/\s*\*\s*$/, '').replace(/\s+/g, ' ').trim();
  }

  function fieldError(field) {
    var wrap = field.closest('.field') || field.parentElement;
    var existing = wrap && wrap.querySelector('.v6-smart-error, .v6-lifecycle-field-error');
    if (existing) return existing;
    var error = document.createElement('p');
    error.className = 'v6-lifecycle-field-error';
    error.setAttribute('aria-live', 'polite');
    if (!field.id) field.id = 'v6-field-' + Math.random().toString(36).slice(2, 9);
    error.id = field.id + '-lifecycle-error';
    field.insertAdjacentElement('afterend', error);
    var ids = new Set(String(field.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean));
    ids.add(error.id);
    field.setAttribute('aria-describedby', Array.from(ids).join(' '));
    return error;
  }

  function textLength(value) {
    return Array.from(String(value || '')).length;
  }

  function phoneMessage(value, required) {
    var raw = String(value || '').trim();
    if (!raw) return required ? 'Въведи телефон за връзка.' : '';
    if (/\p{L}/u.test(raw)) return 'Телефонът не може да съдържа букви.';
    if (!/^[+\d\s().-]+$/.test(raw)) return 'Използвай само цифри, интервали, +, тирета или скоби.';
    if ((raw.match(/\+/g) || []).length > 1 || (raw.indexOf('+') >= 0 && raw.charAt(0) !== '+')) {
      return 'Знакът + може да бъде само веднъж и в началото.';
    }
    var digits = raw.replace(/\D/g, '');
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

  function meaningful(value, minWords) {
    var text = String(value || '').replace(/\s+/g, ' ').trim();
    var words = text.match(/[\p{L}\p{N}]+/gu) || [];
    return words.length >= (minWords || 2);
  }

  function looksPlaceholderSelect(field) {
    if (field.tagName !== 'SELECT') return false;
    var value = String(field.value || '').trim();
    var text = String(field.options[field.selectedIndex] ? field.options[field.selectedIndex].textContent : '').trim();
    return !value || /^избери\b/i.test(text);
  }

  function validationMessage(form, field) {
    if (!field || field.disabled || field.type === 'hidden' || field.type === 'button' || field.type === 'submit') return '';

    var type = formType(form);
    var label = fieldLabel(field);
    var value = String(field.value || '').trim();

    if (field.type === 'checkbox' && field.required && !field.checked) {
      return 'Потвърди това условие, за да продължиш.';
    }
    if (field.type === 'radio' && field.required) {
      var group = form.querySelectorAll('input[type="radio"][name="' + CSS.escape(field.name) + '"]');
      if (!Array.from(group).some(function (item) { return item.checked; })) return 'Избери една от възможностите.';
    }
    if (field.tagName === 'SELECT' && field.required && looksPlaceholderSelect(field)) {
      return 'Избери ' + label.toLocaleLowerCase('bg-BG') + '.';
    }
    if (field.required && !value) {
      return 'Попълни „' + label + '“.';
    }
    if (!value && !field.required) return '';

    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Въведи валиден e-mail адрес.';
    }
    if (field.type === 'url') {
      try {
        var url = new URL(value);
        if (url.protocol !== 'http:' && url.protocol !== 'https:') return 'Линкът трябва да започва с http:// или https://.';
      } catch (_) {
        return 'Въведи валиден пълен линк.';
      }
    }
    if (field.type === 'tel') {
      var phoneError = phoneMessage(value, field.required);
      if (phoneError) return phoneError;
    }
    if (field.type === 'number') {
      var n = Number(value);
      if (!Number.isFinite(n)) return 'Въведи валидно число.';
      if (field.min !== '' && n < Number(field.min)) return 'Стойността не може да е по-малка от ' + field.min + '.';
      if (field.max !== '' && n > Number(field.max)) return 'Стойността не може да е по-голяма от ' + field.max + '.';
    }

    var min = Number(field.getAttribute('minlength') || 0);
    var max = Number(field.getAttribute('maxlength') || 0);
    if (min && textLength(value) < min) return 'Добави още ' + (min - textLength(value)) + ' знака.';
    if (max && textLength(value) > max) return 'Полето може да съдържа най-много ' + max + ' знака.';

    if (field.tagName === 'TEXTAREA' && value && ['question', 'answer', 'report', 'correction', 'health', 'health-signal', 'shop', 'contact', 'listing', 'firm'].includes(type)) {
      if (!meaningful(value, type === 'answer' ? 1 : 2)) return 'Добави по-ясна и полезна информация.';
    }

    if (type === 'register' || type === 'reset-password') {
      var passwords = Array.from(form.querySelectorAll('input[type="password"]'));
      if (passwords.length > 1 && field === passwords[1] && field.value !== passwords[0].value) {
        return 'Паролите не съвпадат.';
      }
    }

    return '';
  }

  function setFieldState(form, field, message, showSuccess) {
    var error = fieldError(field);
    error.textContent = message || '';
    field.classList.toggle('v6-invalid', Boolean(message));
    field.classList.toggle('v6-valid', !message && Boolean(showSuccess) && Boolean(String(field.value || '').trim()));
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    return !message;
  }

  function fieldsForValidation(form) {
    return Array.from(form.querySelectorAll('input, textarea, select')).filter(function (field) {
      return field.type !== 'hidden' && field.type !== 'button' && field.type !== 'submit' && !field.disabled;
    });
  }

  function validateForm(form, showSuccess) {
    var firstInvalid = null;
    fieldsForValidation(form).forEach(function (field) {
      field.dataset.v6Touched = 'true';
      var message = validationMessage(form, field);
      if (!setFieldState(form, field, message, showSuccess) && !firstInvalid) firstInvalid = field;
    });
    return { ok: !firstInvalid, firstInvalid: firstInvalid };
  }

  function hint(field, text) {
    if (!field || !text) return;
    var wrap = field.closest('.field') || field.parentElement;
    if (wrap && wrap.querySelector('.v6-smart-hint, .v6-lifecycle-hint')) return;
    var el = document.createElement('small');
    el.className = 'v6-lifecycle-hint';
    el.textContent = text;
    field.insertAdjacentElement('afterend', el);
  }

  function addContextHints(form) {
    var type = formType(form);
    var fields = fieldsForValidation(form);

    if (type === 'question') {
      var title = fields.find(function (f) { return f.tagName === 'INPUT' && (f.getAttribute('minlength') === '10' || /заглав/i.test(fieldLabel(f))); });
      var description = fields.find(function (f) { return f.tagName === 'TEXTAREA'; });
      var category = fields.find(function (f) { return f.tagName === 'SELECT'; });
      var applyQuestion = function () {
        var label = String(category && category.options[category.selectedIndex] ? category.options[category.selectedIndex].textContent : '');
        var map = {
          'Строителство и ремонти': ['Например: Кой препоръчва добър майстор за баня в Лом?', 'Опиши каква работа трябва да се извърши и какво точно искаш да разбереш.'],
          'Автомобили': ['Например: Кой автосервиз в Лом препоръчвате за диагностика?', 'Опиши автомобила, проблема или услугата, за която търсиш мнение.'],
          'Здраве и лекари': ['Например: Кого препоръчвате за очен лекар в Лом?', 'Опиши какъв специалист или здравна услуга търсиш и какво искаш да разбереш.']
        };
        var item = map[label] || ['Например: Къде в Лом мога да намеря това?', 'Добави конкретни подробности, за да получиш полезен отговор.'];
        if (title) title.placeholder = item[0];
        if (description) description.placeholder = item[1];
      };
      if (category) category.addEventListener('change', applyQuestion);
      applyQuestion();
    }

    if (type === 'health') {
      var h1 = document.querySelector('#app h1');
      var kind = String(h1 ? h1.textContent : 'запис').replace(/^Добави\s+/i, '').trim();
      var nameField = fields.find(function (f) { return f.tagName === 'INPUT'; });
      var detailField = fields.find(function (f) { return f.tagName === 'TEXTAREA'; });
      if (nameField) nameField.placeholder = 'Например: име на ' + kind;
      if (detailField) detailField.placeholder = 'Добави телефон, адрес, специалност или друга проверима информация.';
    }

    if (type === 'correction') {
      var areas = fields.filter(function (f) { return f.tagName === 'TEXTAREA'; });
      if (areas[0]) areas[0].placeholder = 'Напиши конкретно кое е грешно в показаната информация.';
      if (areas[1]) areas[1].placeholder = 'Напиши точната информация, която трябва да бъде показана.';
    }

    if (type === 'health-signal' || type === 'report') {
      var area = fields.find(function (f) { return f.tagName === 'TEXTAREA'; });
      if (area) hint(area, 'Опиши конкретно какъв е проблемът, за да може администраторът да го провери.');
    }

    if (type === 'shop') {
      var shopArea = fields.find(function (f) { return f.tagName === 'TEXTAREA'; });
      if (shopArea) hint(shopArea, 'Посочи какво реално предлага магазинът и полезна информация за посетителите.');
    }

    if (type === 'contact') {
      var contactArea = fields.find(function (f) { return f.tagName === 'TEXTAREA'; });
      if (contactArea) hint(contactArea, 'Опиши накратко въпроса или предложението си.');
    }
  }

  function initForm(form) {
    if (initialized.has(form)) return;
    initialized.add(form);
    // Custom V6 validation owns the message/focus lifecycle in the prototype.
    // Disable browser bubbles so every form gets the same visible red summary.
    form.noValidate = true;
    statusBox(form);
    addContextHints(form);

    fieldsForValidation(form).forEach(function (field) {
      var liveEvent = field.tagName === 'SELECT' || field.type === 'checkbox' || field.type === 'radio' ? 'change' : 'input';
      field.addEventListener(liveEvent, function () {
        if (field.dataset.v6Touched === 'true' || field.getAttribute('aria-invalid') === 'true') {
          setFieldState(form, field, validationMessage(form, field), true);
        }
        if (form.querySelector(':scope > .v6-form-status.is-error')) {
          var result = validateForm(form, false);
          if (result.ok) clearStatus(form);
        }
        form.dataset.v6Dirty = isDirty(form) ? 'true' : 'false';
      });
    });

    requestAnimationFrame(function () { markBaseline(form); });
  }

  function successConfig(form) {
    var type = formType(form);
    var role = activeRole();
    var edit = form.getAttribute('data-v6-edit') === '1';
    var result = {
      title: 'Изпратено успешно',
      text: 'Информацията е приета.',
      route: 'home',
      action: 'Към началото'
    };

    if (type === 'listing') {
      if (role === 'admin') {
        result.title = edit ? 'Промените са публикувани' : 'Обявата е публикувана';
        result.text = 'Администраторският запис е публикуван директно.';
      } else {
        result.title = edit ? 'Редакцията е изпратена' : 'Обявата е изпратена за преглед';
        result.text = edit
          ? 'Публикуваната версия остава видима, докато редакцията чака одобрение.'
          : 'Обявата не е публикувана автоматично. Администратор ще я прегледа.';
      }
      result.route = 'profile';
      result.action = 'Към профила';
    } else if (type === 'firm') {
      if (role === 'admin') {
        result.title = edit ? 'Промените са публикувани' : 'Фирмата е публикувана';
        result.text = 'Администраторският фирмен профил е публикуван директно.';
      } else {
        result.title = edit ? 'Редакцията е изпратена' : 'Фирмата е изпратена за преглед';
        result.text = edit
          ? 'Последната одобрена версия остава публична, докато редакцията чака одобрение.'
          : 'Фирмата не е публикувана автоматично. Администратор ще я прегледа.';
      }
      result.route = 'profile';
      result.action = 'Към профила';
    } else if (type === 'question') {
      result.title = role === 'admin' ? 'Въпросът е публикуван' : 'Въпросът е изпратен за преглед';
      result.text = role === 'admin'
        ? 'Въпросът е публикуван директно.'
        : 'Въпросът ще стане публичен след одобрение.';
      result.route = 'questions';
      result.action = 'Към въпросите';
    } else if (type === 'answer') {
      result.title = 'Отговорът е изпратен за преглед';
      result.text = 'Отговорът ще се покаже след одобрение.';
      result.route = 'question-detail';
      result.action = 'Към въпроса';
    } else if (type === 'shop') {
      result.title = 'Предложението за магазин е изпратено';
      result.text = 'Магазинът ще се появи само след проверка и одобрение.';
      result.route = 'shops';
      result.action = 'Към магазините';
    } else if (type === 'health') {
      result.title = 'Информацията е изпратена за проверка';
      result.text = 'Записът няма да се публикува автоматично. Администратор ще го провери.';
      result.route = 'health';
      result.action = 'Към Здраве';
    } else if (type === 'correction') {
      result.title = 'Корекцията е изпратена';
      result.text = 'Публичната информация не е променена автоматично. Предложението ще бъде проверено.';
      result.route = 'health';
      result.action = 'Назад';
    } else if (type === 'health-signal' || type === 'report') {
      result.title = 'Сигналът е изпратен';
      result.text = 'Сигналът е получен и ще бъде прегледан от администратор.';
      result.route = type === 'health-signal' ? 'health' : 'home';
      result.action = type === 'health-signal' ? 'Към Здраве' : 'Към началото';
    } else if (type === 'contact') {
      result.title = 'Съобщението е изпратено';
      result.text = 'Благодарим. Съобщението е получено.';
      result.route = 'home';
      result.action = 'Към началото';
    } else if (type === 'login') {
      result.title = 'Входът е успешен';
      result.text = 'В реалния сайт след успешен вход се отваря профилът.';
      result.route = 'profile';
      result.action = 'Към профила';
    } else if (type === 'register') {
      result.title = 'Профилът е създаден';
      result.text = 'Следват правилата за потвърждение на профила от реалната система за вход.';
      result.route = 'profile';
      result.action = 'Към профила';
    } else if (type === 'forgot') {
      result.title = 'Провери електронната си поща';
      result.text = 'Ако адресът е валиден за профил, ще получиш връзка за задаване на нова парола.';
      result.route = 'auth';
      result.action = 'Назад към вход';
      result.nextReset = true;
    } else if (type === 'reset-password') {
      result.title = 'Паролата е променена';
      result.text = 'Можеш да продължиш към профила си.';
      result.route = 'profile';
      result.action = 'Към профила';
    }

    return result;
  }

  function completeForm(form) {
    form.dataset.completed = 'true';
    form.dataset.v6Dirty = 'false';
    baselines.set(form, serialize(form));
    var config = successConfig(form);
    var receipt = document.createElement('section');
    receipt.className = 'v6-submit-receipt';
    receipt.setAttribute('role', 'status');
    receipt.setAttribute('aria-live', 'polite');
    receipt.setAttribute('tabindex', '-1');
    receipt.innerHTML =
      '<span class="v6-submit-check" aria-hidden="true">✓</span>' +
      '<div class="v6-submit-copy"><span class="v6-submit-label">Успешно изпращане</span>' +
      '<h2>' + escapeHtml(config.title) + '</h2><p>' + escapeHtml(config.text) + '</p>' +
      '<div class="form-actions"><button class="primary" type="button" data-route="' + escapeHtml(config.route) + '">' + escapeHtml(config.action) + '</button>' +
      (config.nextReset ? '<button class="secondary" type="button" data-v6-show-reset>Преглед на следващата стъпка</button>' : '') +
      '</div></div>';

    clearStatus(form);
    form.hidden = true;
    form.insertAdjacentElement('afterend', receipt);
    receipt.focus({ preventScroll: true });
    receipt.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function submitForm(form) {
    var result = validateForm(form, true);
    if (!result.ok) {
      setStatus(form, 'error', 'Провери формата', 'Нищо не е изпратено. Поправи отбелязаните полета.');
      result.firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      window.setTimeout(function () { result.firstInvalid.focus({ preventScroll: true }); }, 180);
      return;
    }

    setStatus(form, 'progress', 'Изпращане…', 'Не затваряй страницата, докато формата се обработва.');
    var submit = form.querySelector('[type="submit"]');
    if (submit) submit.disabled = true;
    window.setTimeout(function () {
      completeForm(form);
    }, 320);
  }

  function ensureDiscardDialog() {
    var layer = document.getElementById('v6-unsaved-layer');
    if (layer) return layer;
    layer = document.createElement('div');
    layer.id = 'v6-unsaved-layer';
    layer.className = 'v6-unsaved-layer';
    layer.hidden = true;
    layer.innerHTML =
      '<section class="v6-unsaved-dialog" role="alertdialog" aria-modal="true" aria-labelledby="v6-unsaved-title" aria-describedby="v6-unsaved-text">' +
      '<span class="v6-unsaved-icon" aria-hidden="true">!</span>' +
      '<h2 id="v6-unsaved-title">Има неизпратени промени</h2>' +
      '<p id="v6-unsaved-text">Ако напуснеш сега, въведените данни ще бъдат загубени.</p>' +
      '<div class="form-actions"><button class="primary" type="button" data-v6-stay>Остани във формата</button>' +
      '<button class="secondary danger" type="button" data-v6-discard>Напусни и изтрий</button></div></section>';
    document.body.appendChild(layer);

    layer.querySelector('[data-v6-stay]').addEventListener('click', function () {
      discardAction = null;
      layer.hidden = true;
      var dirty = activeDirtyForm();
      var first = dirty && fieldsForValidation(dirty)[0];
      (first || dirty)?.focus?.();
    });

    layer.querySelector('[data-v6-discard]').addEventListener('click', function () {
      var action = discardAction;
      discardAction = null;
      layer.hidden = true;
      bypassNavigation = true;
      if (action) action();
      window.setTimeout(function () { bypassNavigation = false; }, 0);
    });

    return layer;
  }

  function askDiscard(action) {
    var layer = ensureDiscardDialog();
    discardAction = action;
    layer.hidden = false;
    layer.querySelector('[data-v6-stay]').focus();
  }

  function navLikeTarget(event) {
    var target = event.target && event.target.closest ? event.target.closest('[data-route], a[href], [data-functional-auth], [data-functional-action="forgot"], [data-close-modal], .public-add-close') : null;
    if (!target) return null;
    if (target.closest('#v6-unsaved-layer')) return null;
    if (target.matches('[data-functional-action]') && target.getAttribute('data-functional-action') !== 'forgot') return null;
    return target;
  }

  function replayTarget(target) {
    return function () {
      if (target && target.isConnected) target.click();
    };
  }

  function injectContactForm() {
    var h1 = app.querySelector('.page-head h1, h1');
    if (!h1 || String(h1.textContent).trim() !== 'Контакти') return;
    if (app.querySelector('[data-v6-lifecycle-form="contact"]')) return;
    var card = app.querySelector('.detail-card');
    if (!card) return;
    card.innerHTML =
      '<form class="form-shell" data-v6-lifecycle-form="contact">' +
      '<div class="field"><label>Име</label><input name="contact_name" autocomplete="name" required minlength="2" maxlength="120"></div>' +
      '<div class="field"><label>Електронна поща</label><input name="contact_email" type="email" autocomplete="email" required maxlength="254"></div>' +
      '<div class="field"><label>Съобщение</label><textarea name="contact_message" rows="7" required minlength="10" maxlength="5000"></textarea></div>' +
      '<button class="primary" type="submit">Изпрати</button></form>';
  }

  function showForgotForm() {
    var box = document.getElementById('functional-auth-body');
    if (!box) return;
    document.querySelectorAll('[data-functional-auth]').forEach(function (tab) { tab.classList.remove('active'); });
    box.innerHTML =
      '<form class="form-shell" data-v6-lifecycle-form="forgot">' +
      '<div class="field"><label>Електронна поща</label><input type="email" autocomplete="email" required></div>' +
      '<p class="owner-note">Ще изпратим връзка за задаване на нова парола, ако адресът е свързан с профил.</p>' +
      '<div class="form-actions"><button class="primary" type="submit">Изпрати връзка</button>' +
      '<button class="secondary" type="button" data-v6-auth-back>Назад към вход</button></div></form>';
    initAll();
  }

  function showResetForm() {
    var box = document.getElementById('functional-auth-body');
    if (!box) return;
    box.innerHTML =
      '<form class="form-shell" data-v6-lifecycle-form="reset-password">' +
      '<div class="field"><label>Нова парола</label><input type="password" autocomplete="new-password" required minlength="8"></div>' +
      '<div class="field"><label>Повтори новата парола</label><input type="password" autocomplete="new-password" required minlength="8"></div>' +
      '<button class="primary" type="submit">Запази новата парола</button></form>';
    initAll();
  }

  function initAll() {
    injectContactForm();
    Array.from(document.querySelectorAll(FORM_SELECTOR)).forEach(initForm);
  }

  // Capture blur before older prototype validators. Defer visual errors until
  // after the pointer click completes so inserting an error cannot move the
  // next control between pointer-down and pointer-up.
  window.addEventListener('blur', function (event) {
    var field = event.target;
    if (!field || !field.closest) return;
    var form = field.closest(FORM_SELECTOR);
    if (!form || field.type === 'hidden' || field.type === 'button' || field.type === 'submit') return;
    event.stopImmediatePropagation();
    window.setTimeout(function () {
      if (!field.isConnected || form.dataset.completed === 'true') return;
      field.dataset.v6Touched = 'true';
      setFieldState(form, field, validationMessage(form, field), true);
    }, 0);
  }, true);

  window.addEventListener('submit', function (event) {
    var form = event.target && event.target.closest ? event.target.closest(FORM_SELECTOR) : null;
    if (!form) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    submitForm(form);
  }, true);

  window.addEventListener('click', function (event) {
    var showReset = event.target && event.target.closest ? event.target.closest('[data-v6-show-reset]') : null;
    if (showReset) {
      event.preventDefault();
      event.stopImmediatePropagation();
      showResetForm();
      return;
    }

    var authBack = event.target && event.target.closest ? event.target.closest('[data-v6-auth-back]') : null;
    if (authBack) {
      event.preventDefault();
      event.stopImmediatePropagation();
      var loginTab = document.querySelector('[data-functional-auth="login"]');
      if (loginTab) {
        bypassNavigation = true;
        loginTab.click();
        bypassNavigation = false;
      }
      return;
    }

    var forgot = event.target && event.target.closest ? event.target.closest('[data-functional-action="forgot"]') : null;
    if (forgot) {
      var dirtyBeforeForgot = activeDirtyForm();
      if (dirtyBeforeForgot && !bypassNavigation) {
        event.preventDefault();
        event.stopImmediatePropagation();
        askDiscard(function () { showForgotForm(); });
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      showForgotForm();
      return;
    }

    var target = navLikeTarget(event);
    if (!target || bypassNavigation) return;

    var dirty = activeDirtyForm();
    if (!dirty) return;
    if (target.closest('.v6-submit-receipt')) return;
    if (target.type === 'submit') return;

    event.preventDefault();
    event.stopImmediatePropagation();
    askDiscard(replayTarget(target));
  }, true);

  window.addEventListener('keydown', function (event) {
    var layer = document.getElementById('v6-unsaved-layer');
    if (event.key === 'Escape' && layer && !layer.hidden) {
      event.preventDefault();
      event.stopImmediatePropagation();
      discardAction = null;
      layer.hidden = true;
      return;
    }

    if (event.key !== 'Escape') return;
    var dirty = activeDirtyForm();
    if (!dirty) return;
    var visibleModal = dirty.closest('[role="dialog"], .modal-layer, .public-add-layer');
    if (!visibleModal) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    askDiscard(function () {
      var close = visibleModal.querySelector('[data-close-modal], .public-add-close');
      if (close) close.click();
      else visibleModal.hidden = true;
    });
  }, true);

  window.addEventListener('beforeunload', function (event) {
    if (!activeDirtyForm()) return;
    event.preventDefault();
    event.returnValue = '';
  });

  var observer = new MutationObserver(function () {
    initAll();
  });
  observer.observe(app, { childList: true, subtree: true });

  ensureDiscardDialog();
  initAll();
}());
