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
  var bypass = false;
  var pendingAction = null;
  var forceFailure = false;

  function formType(form) {
    return form.getAttribute('data-v6-form') ||
      form.getAttribute('data-functional-form') ||
      form.getAttribute('data-demo-form') ||
      form.getAttribute('data-v6-lifecycle-form') ||
      'form';
  }

  function guardable(form) {
    return !['login', 'forgot', 'reset-password'].includes(formType(form));
  }

  function fieldSnapshot(form) {
    var parts = [];
    Array.from(form.elements || []).forEach(function (field, index) {
      if (!field || field.type === 'submit' || field.type === 'button' || field.type === 'reset') return;
      var key = field.name || field.id || ('field-' + index);
      if (field.type === 'checkbox' || field.type === 'radio') {
        parts.push(key + ':' + (field.checked ? '1' : '0'));
      } else if (field.type === 'file') {
        parts.push(key + ':' + (field.files ? field.files.length : 0));
      } else {
        parts.push(key + ':' + String(field.value || ''));
      }
    });

    Array.from(form.querySelectorAll('[data-v6-intent], .choice-grid button')).forEach(function (button, index) {
      parts.push('choice-' + index + ':' + (button.classList.contains('active') ? '1' : '0') + ':' + String(button.getAttribute('data-v6-intent') || button.textContent || '').trim());
    });
    return parts.join('|');
  }

  function visible(form) {
    return Boolean(form && !form.hidden && form.dataset.completed !== 'true' && form.offsetParent !== null);
  }

  function markBaseline(form) {
    baselines.set(form, fieldSnapshot(form));
  }

  function dirty(form) {
    if (!visible(form) || !guardable(form)) return false;
    if (!baselines.has(form)) {
      markBaseline(form);
      return false;
    }
    return fieldSnapshot(form) !== baselines.get(form);
  }

  function dirtyForm() {
    return Array.from(document.querySelectorAll(FORM_SELECTOR)).find(dirty) || null;
  }

  function ensureQaButton() {
    var strip = document.querySelector('.prototype-strip');
    if (!strip || strip.querySelector('[data-v6-submit-failure-toggle]')) return;
    var button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('data-v6-submit-failure-toggle', '');
    button.setAttribute('aria-pressed', 'false');
    button.textContent = 'Тест на изпращане: успешно';
    button.style.cssText = 'margin-left:auto;border:1px solid rgba(255,255,255,.45);background:transparent;color:inherit;border-radius:999px;padding:5px 10px;font:inherit;font-weight:800;cursor:pointer';
    strip.appendChild(button);
  }

  function ensureDiscardDialog() {
    var layer = document.getElementById('v7-unsaved-layer');
    if (layer) return layer;
    layer = document.createElement('div');
    layer.id = 'v7-unsaved-layer';
    layer.className = 'v6-unsaved-layer';
    layer.hidden = true;
    layer.innerHTML =
      '<section class="v6-unsaved-dialog" role="alertdialog" aria-modal="true" aria-labelledby="v7-unsaved-title" aria-describedby="v7-unsaved-text">' +
      '<span class="v6-unsaved-icon" aria-hidden="true">!</span>' +
      '<h2 id="v7-unsaved-title">Има неизпратени промени</h2>' +
      '<p id="v7-unsaved-text">Ако напуснеш сега, въведените данни ще бъдат загубени.</p>' +
      '<div class="form-actions"><button class="primary" type="button" data-v7-stay>Остани във формата</button>' +
      '<button class="secondary danger" type="button" data-v7-discard>Напусни и изтрий</button></div></section>';
    document.body.appendChild(layer);

    layer.querySelector('[data-v7-stay]').addEventListener('click', function () {
      pendingAction = null;
      layer.hidden = true;
      var form = dirtyForm();
      var field = form && form.querySelector('input:not([type="hidden"]), textarea, select');
      (field || form)?.focus?.();
    });

    layer.querySelector('[data-v7-discard]').addEventListener('click', function () {
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
    layer.querySelector('[data-v7-stay]').focus();
  }

  function replay(target) {
    return function () {
      if (target && target.isConnected) target.click();
    };
  }

  function navTarget(event) {
    var target = event.target && event.target.closest ? event.target.closest('[data-route], a[href], [data-functional-auth], [data-functional-action="forgot"], [data-close-modal], .public-add-close, [data-v6-role]') : null;
    if (!target || target.closest('#v7-unsaved-layer') || target.closest('#v6-unsaved-layer')) return null;
    return target;
  }

  function formStatus(form) {
    var box = form.querySelector(':scope > .v6-form-status');
    if (!box) {
      box = document.createElement('div');
      box.className = 'v6-form-status';
      box.setAttribute('role', 'alert');
      box.setAttribute('aria-live', 'assertive');
      form.insertBefore(box, form.firstChild);
    }
    return box;
  }

  function failureText(type) {
    var map = {
      listing: ['Обявата не беше изпратена', 'Данните ти са запазени. Провери връзката и опитай отново.'],
      firm: ['Фирмата не беше изпратена', 'Данните ти са запазени. Провери връзката и опитай отново.'],
      question: ['Въпросът не беше изпратен', 'Написаното е запазено във формата. Опитай отново.'],
      answer: ['Отговорът не беше изпратен', 'Написаното е запазено във формата. Опитай отново.'],
      shop: ['Предложението не беше изпратено', 'Данните са запазени във формата. Опитай отново.'],
      health: ['Информацията не беше изпратена', 'Данните са запазени във формата. Опитай отново.'],
      correction: ['Корекцията не беше изпратена', 'Написаното е запазено във формата. Опитай отново.'],
      'health-signal': ['Сигналът не беше изпратен', 'Написаното е запазено във формата. Опитай отново.'],
      report: ['Сигналът не беше изпратен', 'Написаното е запазено във формата. Опитай отново.'],
      contact: ['Съобщението не беше изпратено', 'Написаното е запазено във формата. Опитай отново.'],
      register: ['Профилът не беше създаден', 'Провери връзката и опитай отново.'],
      login: ['Входът не беше успешен', 'Провери данните и връзката и опитай отново.'],
      forgot: ['Връзката не беше изпратена', 'Провери връзката и опитай отново.'],
      'reset-password': ['Паролата не беше променена', 'Провери връзката и опитай отново.']
    };
    return map[type] || ['Не успяхме да изпратим', 'Данните са запазени. Опитай отново.'];
  }

  function requiredSelectInvalid(select) {
    if (!select.required) return false;
    var option = select.options[select.selectedIndex];
    var text = String(option ? option.textContent : '').trim();
    return !String(select.value || '').trim() || /^избери\b/i.test(text);
  }

  function readyForFailureTest(form) {
    if (!form.checkValidity()) return false;
    if (Array.from(form.querySelectorAll('select[required]')).some(requiredSelectInvalid)) return false;
    var passwords = Array.from(form.querySelectorAll('input[type="password"]'));
    if ((formType(form) === 'register' || formType(form) === 'reset-password') && passwords.length > 1 && passwords[0].value !== passwords[1].value) return false;
    return true;
  }

  function showFailure(form) {
    var copy = failureText(formType(form));
    var box = formStatus(form);
    box.className = 'v6-form-status is-error';
    box.hidden = false;
    box.innerHTML = '<span class="v6-form-status-icon" aria-hidden="true">!</span><div><strong>' + copy[0] + '</strong><p>' + copy[1] + '</p></div>';
    var submit = form.querySelector('[type="submit"]');
    if (submit) submit.disabled = false;
    form.dataset.completed = 'false';
    form.dataset.v6Dirty = 'true';
    box.setAttribute('tabindex', '-1');
    box.focus({ preventScroll: true });
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function initForm(form) {
    if (initialized.has(form)) return;
    initialized.add(form);
    requestAnimationFrame(function () { markBaseline(form); });
  }

  function initAll() {
    ensureQaButton();
    Array.from(document.querySelectorAll(FORM_SELECTOR)).forEach(initForm);
  }

  window.addEventListener('click', function (event) {
    var qa = event.target && event.target.closest ? event.target.closest('[data-v6-submit-failure-toggle]') : null;
    if (qa) {
      event.preventDefault();
      forceFailure = !forceFailure;
      qa.setAttribute('aria-pressed', forceFailure ? 'true' : 'false');
      qa.textContent = forceFailure ? 'Тест на изпращане: грешка' : 'Тест на изпращане: успешно';
      qa.style.background = forceFailure ? 'rgba(180,35,24,.18)' : 'transparent';
      return;
    }

    var submit = event.target && event.target.closest ? event.target.closest('[type="submit"]') : null;
    var submitForm = submit && submit.closest ? submit.closest(FORM_SELECTOR) : null;
    if (submitForm && forceFailure) {
      var form = submitForm;
      if (!readyForFailureTest(form)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      submit.disabled = true;
      var box = formStatus(form);
      box.className = 'v6-form-status is-progress';
      box.hidden = false;
      box.innerHTML = '<span class="v6-form-status-icon" aria-hidden="true">…</span><div><strong>Изпращане…</strong><p>Проверяваме връзката със системата.</p></div>';
      window.setTimeout(function () { showFailure(form); }, 320);
      return;
    }

    var target = navTarget(event);
    if (!target || bypass) return;
    if (target.type === 'submit' || target.closest('.v6-submit-receipt')) return;
    var form = dirtyForm();
    if (!form) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    askDiscard(replay(target));
  }, true);

  window.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      var layer = document.getElementById('v7-unsaved-layer');
      if (layer && !layer.hidden) {
        event.preventDefault();
        event.stopImmediatePropagation();
        layer.hidden = true;
        pendingAction = null;
        return;
      }
    }

    if (event.key === 'Enter' && forceFailure && event.target && event.target.closest) {
      var form = event.target.closest(FORM_SELECTOR);
      if (form && event.target.tagName !== 'TEXTAREA' && readyForFailureTest(form)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        showFailure(form);
      }
    }
  }, true);

  window.addEventListener('beforeunload', function (event) {
    if (!dirtyForm()) return;
    event.preventDefault();
    event.returnValue = '';
  });

  var observer = new MutationObserver(initAll);
  observer.observe(app, { childList: true, subtree: true });
  initAll();
}());
