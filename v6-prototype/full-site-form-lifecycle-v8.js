(function () {
  'use strict';

  var app = document.getElementById('app');
  if (!app) return;

  var FORM_SELECTOR = 'form[data-v8-form]';
  var baselines = new WeakMap();
  var initialized = new WeakSet();
  var bypass = false;
  var pendingAction = null;
  var forceFailure = false;

  function typeOf(form) {
    return form.getAttribute('data-v8-form') || 'form';
  }

  function role() {
    return (window.PopitaiV6 && window.PopitaiV6.role) || 'user';
  }

  function guardable(form) {
    return !['login', 'forgot', 'reset-password'].includes(typeOf(form));
  }

  function snapshot(form) {
    var parts = [];
    Array.from(form.elements || []).forEach(function (field, index) {
      if (!field || ['submit', 'button', 'reset'].includes(field.type)) return;
      var key = field.name || field.id || ('field-' + index);
      if (field.type === 'checkbox' || field.type === 'radio') {
        parts.push(key + ':' + (field.checked ? '1' : '0'));
      } else if (field.type === 'file') {
        parts.push(key + ':' + (field.files ? field.files.length : 0));
      } else {
        parts.push(key + ':' + String(field.value || ''));
      }
    });
    Array.from(form.querySelectorAll('[data-v8-choice]')).forEach(function (button, index) {
      parts.push('choice-' + index + ':' + (button.classList.contains('active') ? '1' : '0') + ':' + String(button.dataset.v8Choice || ''));
    });
    return parts.join('|');
  }

  function visible(form) {
    return Boolean(form && !form.hidden && form.dataset.completed !== 'true' && form.offsetParent !== null);
  }

  function markBaseline(form) {
    baselines.set(form, snapshot(form));
  }

  function dirty(form) {
    if (!visible(form) || !guardable(form)) return false;
    if (!baselines.has(form)) {
      markBaseline(form);
      return false;
    }
    return snapshot(form) !== baselines.get(form);
  }

  function dirtyForm() {
    return Array.from(document.querySelectorAll(FORM_SELECTOR)).find(dirty) || null;
  }

  function ensureQaButton() {
    var strip = document.querySelector('.prototype-strip');
    if (!strip || strip.querySelector('[data-v8-failure-toggle]')) return;
    var button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('data-v8-failure-toggle', '');
    button.setAttribute('aria-pressed', 'false');
    button.textContent = 'Тест на изпращане: успешно';
    button.className = 'v8-qa-toggle';
    strip.appendChild(button);
  }

  function ensureDiscardDialog() {
    var layer = document.getElementById('v8-unsaved-layer');
    if (layer) return layer;
    layer = document.createElement('div');
    layer.id = 'v8-unsaved-layer';
    layer.className = 'v6-unsaved-layer';
    layer.hidden = true;
    layer.innerHTML = '<section class="v6-unsaved-dialog" role="alertdialog" aria-modal="true" aria-labelledby="v8-unsaved-title" aria-describedby="v8-unsaved-text">' +
      '<span class="v6-unsaved-icon" aria-hidden="true">!</span>' +
      '<h2 id="v8-unsaved-title">Има неизпратени промени</h2>' +
      '<p id="v8-unsaved-text">Ако напуснеш сега, въведените данни ще бъдат загубени.</p>' +
      '<div class="form-actions"><button class="primary" type="button" data-v8-stay>Остани във формата</button>' +
      '<button class="secondary danger" type="button" data-v8-discard>Напусни и изтрий</button></div></section>';
    document.body.appendChild(layer);

    layer.querySelector('[data-v8-stay]').addEventListener('click', function () {
      pendingAction = null;
      layer.hidden = true;
      var form = dirtyForm();
      var field = form && form.querySelector('input:not([type="hidden"]), textarea, select');
      (field || form)?.focus?.();
    });

    layer.querySelector('[data-v8-discard]').addEventListener('click', function () {
      var action = pendingAction;
      pendingAction = null;
      layer.hidden = true;
      bypass = true;
      if (action) action();
      window.setTimeout(function () { bypass = false; }, 0);
    });
    return layer;
  }

  function askDiscard(action) {
    pendingAction = action;
    var layer = ensureDiscardDialog();
    layer.hidden = false;
    layer.querySelector('[data-v8-stay]')?.focus();
  }

  function replay(target) {
    return function () {
      if (target && target.isConnected) target.click();
    };
  }

  function fieldError(field, message) {
    if (!field) return;
    var holder = field.closest('.field, label, .check-row');
    var error = holder && holder.querySelector('[data-field-error]');
    if (error) error.textContent = message || '';
    if (message) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
  }

  function requiredSelectInvalid(select) {
    if (!select.required) return false;
    var option = select.options[select.selectedIndex];
    var text = String(option ? option.textContent : '').trim();
    return !String(select.value || '').trim() || /^избери\b/i.test(text);
  }

  function validate(form) {
    var first = null;
    Array.from(form.querySelectorAll('input, textarea, select')).forEach(function (field) {
      if (field.disabled || field.type === 'hidden' || field.type === 'file') return;
      var message = '';
      if (field.required && field.type === 'checkbox' && !field.checked) message = 'Това поле е задължително.';
      else if (field.required && !String(field.value || '').trim()) message = 'Попълни това поле.';
      else if (field.tagName === 'SELECT' && requiredSelectInvalid(field)) message = 'Избери стойност.';
      else if (field.minLength > 0 && String(field.value || '').trim() && String(field.value || '').trim().length < field.minLength) message = 'Добави поне ' + field.minLength + ' знака.';
      else if (field.type === 'email' && field.value && !field.checkValidity()) message = 'Въведи валиден имейл.';
      fieldError(field, message);
      if (message && !first) first = field;
    });

    var type = typeOf(form);
    if (type === 'register' || type === 'reset-password') {
      var passwords = Array.from(form.querySelectorAll('input[type="password"]'));
      if (passwords.length > 1 && passwords[0].value !== passwords[1].value) {
        fieldError(passwords[1], 'Паролите не съвпадат.');
        if (!first) first = passwords[1];
      }
    }

    return first;
  }

  function statusBox(form) {
    var box = form.querySelector(':scope > .v6-form-status');
    if (!box) {
      box = document.createElement('div');
      box.className = 'v6-form-status';
      box.hidden = true;
      box.setAttribute('role', 'alert');
      box.setAttribute('aria-live', 'assertive');
      form.insertBefore(box, form.firstChild);
    }
    return box;
  }

  function showInvalid(form, first) {
    var box = statusBox(form);
    box.hidden = false;
    box.className = 'v6-form-status is-error';
    box.innerHTML = '<span class="v6-form-status-icon" aria-hidden="true">!</span><div><strong>Провери формата — нищо не е изпратено</strong><p>Поправи отбелязаните полета и опитай отново.</p></div>';
    first?.focus?.();
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function failureCopy(type) {
    var map = {
      listing: ['Обявата не беше изпратена', 'Данните са запазени във формата. Провери връзката и опитай отново.'],
      firm: ['Фирмата не беше изпратена', 'Данните са запазени във формата. Провери връзката и опитай отново.'],
      question: ['Въпросът не беше изпратен', 'Написаното е запазено. Опитай отново.'],
      answer: ['Отговорът не беше изпратен', 'Написаното е запазено. Опитай отново.'],
      shop: ['Предложението не беше изпратено', 'Данните са запазени във формата. Опитай отново.'],
      health: ['Информацията не беше изпратена', 'Данните са запазени във формата. Опитай отново.'],
      correction: ['Корекцията не беше изпратена', 'Написаното е запазено. Опитай отново.'],
      'health-signal': ['Сигналът не беше изпратен', 'Написаното е запазено. Опитай отново.'],
      report: ['Сигналът не беше изпратен', 'Написаното е запазено. Опитай отново.'],
      contact: ['Съобщението не беше изпратено', 'Написаното е запазено. Опитай отново.'],
      register: ['Профилът не беше създаден', 'Провери връзката и опитай отново.'],
      login: ['Входът не беше успешен', 'Провери данните и връзката и опитай отново.'],
      forgot: ['Връзката не беше изпратена', 'Провери връзката и опитай отново.'],
      'reset-password': ['Паролата не беше променена', 'Провери връзката и опитай отново.']
    };
    return map[type] || ['Не успяхме да изпратим', 'Данните са запазени. Опитай отново.'];
  }

  function successCopy(form) {
    var type = typeOf(form);
    var isAdmin = role() === 'admin';
    var edit = form.dataset.edit === '1';
    var map = {
      listing: isAdmin ? (edit ? ['Промените са публикувани', 'Публичната обява е обновена.'] : ['Обявата е публикувана', 'Администраторският поток публикува директно.']) : (edit ? ['Редакцията е изпратена', 'Последната одобрена публична версия остава видима, докато редакцията чака преглед.'] : ['Обявата е изпратена за преглед', 'Ще се появи публично след одобрение.']),
      firm: isAdmin ? (edit ? ['Промените са публикувани', 'Фирменият профил е обновен.'] : ['Фирмата е публикувана', 'Администраторският поток публикува директно.']) : (edit ? ['Редакцията е изпратена', 'Публикуваната версия остава видима, докато редакцията чака преглед.'] : ['Фирмата е изпратена за преглед', 'Профилът ще стане публичен след одобрение.']),
      question: ['Въпросът е изпратен за преглед', 'След одобрение ще бъде публичен.'],
      answer: ['Отговорът е изпратен за преглед', 'Ще се покаже след одобрение.'],
      shop: ['Предложението е изпратено за преглед', 'Магазинът не се публикува директно.'],
      health: ['Информацията е изпратена за проверка', 'Verified Health owner ще я прегледа преди публикация.'],
      correction: ['Корекцията е изпратена', 'Публичният факт не е променен директно.'],
      'health-signal': ['Сигналът е изпратен', 'Ще бъде проверен от администратор.'],
      report: ['Сигналът е изпратен', 'Ще бъде разгледан от администратор.'],
      contact: ['Съобщението е изпратено', 'Благодарим за обратната връзка.'],
      register: ['Профилът е създаден', 'Можеш да продължиш към профила си.'],
      login: ['Входът е успешен', 'Профилът е достъпен.'],
      forgot: ['Ако има такъв профил, изпратихме връзка', 'По съображения за поверителност не потвърждаваме дали имейлът е регистриран.'],
      'reset-password': ['Паролата е променена', 'Можеш да влезеш с новата парола.']
    };
    return map[type] || ['Изпратено успешно', 'Действието е прието.'];
  }

  function nextRoute(type) {
    if (['listing', 'firm', 'question'].includes(type)) return 'profile';
    if (['health', 'correction', 'health-signal'].includes(type)) return 'health';
    if (type === 'shop') return 'shops';
    if (type === 'answer') return 'question-detail';
    if (['login', 'register', 'reset-password'].includes(type)) return 'profile';
    return 'home';
  }

  function showFailure(form) {
    var copy = failureCopy(typeOf(form));
    var box = statusBox(form);
    box.hidden = false;
    box.className = 'v6-form-status is-error';
    box.innerHTML = '<span class="v6-form-status-icon" aria-hidden="true">!</span><div><strong>' + copy[0] + '</strong><p>' + copy[1] + '</p></div>';
    form.querySelector('[type="submit"]')?.removeAttribute('disabled');
    form.dataset.completed = 'false';
    box.setAttribute('tabindex', '-1');
    box.focus({ preventScroll: true });
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function showSuccess(form) {
    var type = typeOf(form);
    var copy = successCopy(form);
    var receipt = document.createElement('section');
    receipt.className = 'v6-submit-receipt';
    receipt.setAttribute('role', 'status');
    receipt.innerHTML = '<span class="v6-submit-receipt-icon" aria-hidden="true">✓</span><div><strong>' + copy[0] + '</strong><p>' + copy[1] + '</p><button class="primary" type="button" data-route="' + nextRoute(type) + '">Продължи</button></div>';
    form.dataset.completed = 'true';
    form.hidden = true;
    markBaseline(form);
    form.insertAdjacentElement('afterend', receipt);
    receipt.setAttribute('tabindex', '-1');
    receipt.focus({ preventScroll: true });
    receipt.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function submit(form) {
    var first = validate(form);
    if (first) {
      showInvalid(form, first);
      return;
    }

    var button = form.querySelector('[type="submit"]');
    if (button) button.disabled = true;
    var box = statusBox(form);
    box.hidden = false;
    box.className = 'v6-form-status is-progress';
    box.innerHTML = '<span class="v6-form-status-icon" aria-hidden="true">…</span><div><strong>Изпращане…</strong><p>Проверяваме данните и връзката със системата.</p></div>';

    window.setTimeout(function () {
      if (forceFailure) showFailure(form);
      else showSuccess(form);
    }, 360);
  }

  function initForm(form) {
    if (initialized.has(form)) return;
    initialized.add(form);
    requestAnimationFrame(function () { markBaseline(form); });
    form.addEventListener('input', function (event) {
      if (event.target && event.target.matches('input, textarea, select')) fieldError(event.target, '');
    });
    form.addEventListener('change', function (event) {
      if (event.target && event.target.matches('input, textarea, select')) fieldError(event.target, '');
    });
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      submit(form);
    }, true);
  }

  function initAll() {
    ensureQaButton();
    Array.from(document.querySelectorAll(FORM_SELECTOR)).forEach(initForm);
  }

  document.addEventListener('click', function (event) {
    var qa = event.target.closest && event.target.closest('[data-v8-failure-toggle]');
    if (qa) {
      event.preventDefault();
      forceFailure = !forceFailure;
      qa.setAttribute('aria-pressed', String(forceFailure));
      qa.textContent = forceFailure ? 'Тест на изпращане: грешка' : 'Тест на изпращане: успешно';
      qa.classList.toggle('is-error', forceFailure);
      return;
    }

    var choice = event.target.closest && event.target.closest('[data-v8-choice]');
    if (choice) {
      event.preventDefault();
      var group = choice.closest('[data-v8-choice-group]');
      group?.querySelectorAll('[data-v8-choice]').forEach(function (button) { button.classList.remove('active'); });
      choice.classList.add('active');
      choice.dispatchEvent(new CustomEvent('v8choice', { bubbles: true, detail: { value: choice.dataset.v8Choice } }));
      return;
    }

    if (bypass) return;
    var target = event.target.closest && event.target.closest('[data-route], [data-close-modal], [data-v8-role], [data-cancel-form]');
    if (!target || target.closest('#v8-unsaved-layer') || target.closest('.v6-submit-receipt')) return;
    var form = dirtyForm();
    if (!form) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    askDiscard(replay(target));
  }, true);

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    var layer = document.getElementById('v8-unsaved-layer');
    if (layer && !layer.hidden) {
      event.preventDefault();
      event.stopImmediatePropagation();
      layer.hidden = true;
      pendingAction = null;
      return;
    }
    if (!bypass && dirtyForm()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      askDiscard(function () {
        document.dispatchEvent(new CustomEvent('v8-force-escape'));
      });
    }
  }, true);

  window.addEventListener('beforeunload', function (event) {
    if (!dirtyForm()) return;
    event.preventDefault();
    event.returnValue = '';
  });

  new MutationObserver(initAll).observe(app, { childList: true, subtree: true });
  initAll();
}());
