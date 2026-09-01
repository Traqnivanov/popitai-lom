(function () {
  'use strict';

  const app = document.getElementById('app');
  if (!app) return;

  const FORM_SELECTOR = 'form[data-v8-form]';
  const baselines = new WeakMap();
  const initialized = new WeakSet();
  let bypass = false;
  let pendingAction = null;
  let forceFailure = false;
  let restoringHistory = false;
  let allowNextHistoryMove = false;

  const typeOf = form => form?.getAttribute('data-v8-form') || 'form';
  const role = () => window.PopitaiV6?.role || 'user';
  const guardable = form => !['login', 'forgot', 'reset-password'].includes(typeOf(form));

  function snapshot(form) {
    const parts = [];
    Array.from(form.elements || []).forEach((field, index) => {
      if (!field || ['submit','button','reset'].includes(field.type)) return;
      const key = field.name || field.id || `field-${index}`;
      if (field.type === 'checkbox' || field.type === 'radio') parts.push(`${key}:${field.checked ? '1' : '0'}`);
      else if (field.type === 'file') parts.push(`${key}:${field.files?.length || 0}`);
      else parts.push(`${key}:${String(field.value || '')}`);
    });
    Array.from(form.querySelectorAll('[data-v8-choice]')).forEach((button, index) => {
      parts.push(`choice-${index}:${button.classList.contains('active') ? '1' : '0'}:${button.dataset.v8Choice || ''}`);
    });
    return parts.join('|');
  }

  const visible = form => Boolean(form && !form.hidden && form.dataset.completed !== 'true' && form.offsetParent !== null);
  const markBaseline = form => baselines.set(form, snapshot(form));

  function dirty(form) {
    if (!visible(form) || !guardable(form)) return false;
    if (!baselines.has(form)) {
      markBaseline(form);
      return false;
    }
    return snapshot(form) !== baselines.get(form);
  }

  const dirtyForm = () => Array.from(document.querySelectorAll(FORM_SELECTOR)).find(dirty) || null;

  function ensureQaButton() {
    const strip = document.querySelector('.prototype-strip');
    if (!strip || strip.querySelector('[data-v8-failure-toggle]')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'v8-qa-toggle';
    button.dataset.v8FailureToggle = '';
    button.setAttribute('aria-pressed','false');
    button.textContent = 'Тест на изпращане: успешно';
    strip.appendChild(button);
  }

  function ensureDiscardDialog() {
    let layer = document.getElementById('v8-unsaved-layer');
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

    layer.querySelector('[data-v8-stay]').addEventListener('click', () => {
      pendingAction = null;
      layer.hidden = true;
      const form = dirtyForm();
      (form?.querySelector('input:not([type="hidden"]),textarea,select') || form)?.focus?.();
    });

    layer.querySelector('[data-v8-discard]').addEventListener('click', () => {
      const action = pendingAction;
      pendingAction = null;
      layer.hidden = true;
      bypass = true;
      action?.();
      setTimeout(() => { bypass = false; }, 0);
    });
    return layer;
  }

  function askDiscard(action) {
    pendingAction = action;
    const layer = ensureDiscardDialog();
    layer.hidden = false;
    layer.querySelector('[data-v8-stay]')?.focus();
  }

  function fieldError(field, message) {
    if (!field) return;
    const holder = field.closest('.field,label,.check-row');
    const error = holder?.querySelector('[data-field-error]');
    if (error) error.textContent = message || '';
    if (message) field.setAttribute('aria-invalid','true');
    else field.removeAttribute('aria-invalid');
  }

  function requiredSelectInvalid(select) {
    if (!select.required) return false;
    const option = select.options[select.selectedIndex];
    const text = String(option?.textContent || '').trim();
    return !String(select.value || '').trim() || /^избери\b/i.test(text);
  }

  function validate(form) {
    let first = null;
    Array.from(form.querySelectorAll('input,textarea,select')).forEach(field => {
      if (field.disabled || field.type === 'hidden' || field.type === 'file') return;
      let message = '';
      const consentRequired = field.type === 'checkbox' && ['rules','terms'].includes(field.name);
      if ((field.required || consentRequired) && field.type === 'checkbox' && !field.checked) message = 'Това поле е задължително.';
      else if (field.required && !String(field.value || '').trim()) message = 'Попълни това поле.';
      else if (field.tagName === 'SELECT' && requiredSelectInvalid(field)) message = 'Избери стойност.';
      else if (field.minLength > 0 && String(field.value || '').trim() && String(field.value || '').trim().length < field.minLength) message = `Добави поне ${field.minLength} знака.`;
      else if (field.value && !field.checkValidity()) message = field.type === 'email' ? 'Въведи валиден имейл.' : 'Провери стойността в това поле.';
      fieldError(field,message);
      if (message && !first) first = field;
    });

    if (['register','reset-password'].includes(typeOf(form))) {
      const passwords = Array.from(form.querySelectorAll('input[type="password"],input[data-password-field]'));
      if (passwords.length > 1 && passwords[0].value !== passwords[1].value) {
        fieldError(passwords[1],'Паролите не съвпадат.');
        if (!first) first = passwords[1];
      }
    }
    return first;
  }

  function statusBox(form) {
    let box = form.querySelector(':scope > .v6-form-status');
    if (!box) {
      box = document.createElement('div');
      box.className = 'v6-form-status';
      box.hidden = true;
      box.setAttribute('role','alert');
      box.setAttribute('aria-live','assertive');
      form.insertBefore(box,form.firstChild);
    }
    return box;
  }

  function showInvalid(form, first) {
    const box = statusBox(form);
    box.hidden = false;
    box.className = 'v6-form-status is-error';
    box.innerHTML = '<span class="v6-form-status-icon" aria-hidden="true">!</span><div><strong>Провери формата — нищо не е изпратено</strong><p>Поправи отбелязаните полета и опитай отново.</p></div>';
    first?.focus?.();
    box.scrollIntoView({behavior:'smooth',block:'center'});
  }

  const failureCopy = type => ({
    listing:['Обявата не беше изпратена','Данните са запазени във формата. Провери връзката и опитай отново.'],
    firm:['Фирмата не беше изпратена','Данните са запазени във формата. Провери връзката и опитай отново.'],
    question:['Въпросът не беше изпратен','Написаното е запазено. Опитай отново.'],
    answer:['Отговорът не беше изпратен','Написаното е запазено. Опитай отново.'],
    shop:['Предложението не беше изпратено','Данните са запазени във формата. Опитай отново.'],
    health:['Информацията не беше изпратена','Данните са запазени във формата. Опитай отново.'],
    correction:['Корекцията не беше изпратена','Написаното е запазено. Опитай отново.'],
    'health-signal':['Сигналът не беше изпратен','Написаното е запазено. Опитай отново.'],
    report:['Сигналът не беше изпратен','Написаното е запазено. Опитай отново.'],
    contact:['Съобщението не беше изпратено','Написаното е запазено. Опитай отново.'],
    register:['Профилът не беше създаден','Провери връзката и опитай отново.'],
    login:['Входът не беше успешен','Провери данните и връзката и опитай отново.'],
    forgot:['Връзката не беше изпратена','Провери връзката и опитай отново.'],
    'reset-password':['Паролата не беше променена','Провери връзката и опитай отново.']
  }[type] || ['Не успяхме да изпратим','Данните са запазени. Опитай отново.']);

  function successCopy(form) {
    const type = typeOf(form);
    const admin = role() === 'admin';
    const edit = form.dataset.edit === '1';
    const map = {
      listing: admin ? (edit ? ['Промените са публикувани','Публичната обява е обновена.'] : ['Обявата е публикувана','Администраторският поток публикува директно.']) : (edit ? ['Редакцията е изпратена','Последната одобрена публична версия остава видима, докато редакцията чака преглед.'] : ['Обявата е изпратена за преглед','Ще се появи публично след одобрение.']),
      firm: admin ? (edit ? ['Промените са публикувани','Фирменият профил е обновен.'] : ['Фирмата е публикувана','Администраторският поток публикува директно.']) : (edit ? ['Редакцията е изпратена','Публикуваната версия остава видима, докато редакцията чака преглед.'] : ['Фирмата е изпратена за преглед','Профилът ще стане публичен след одобрение.']),
      question:['Въпросът е изпратен за преглед','След одобрение ще бъде публичен.'],
      answer:['Отговорът е изпратен за преглед','Ще се покаже след одобрение.'],
      shop:['Предложението е изпратено за преглед','Магазинът не се публикува директно.'],
      health:['Информацията е изпратена за проверка','Health/Info owner ще я прегледа преди публикация.'],
      correction:['Корекцията е изпратена','Публичният факт не е променен директно.'],
      'health-signal':['Сигналът е изпратен','Ще бъде проверен от администратор.'],
      report:['Сигналът е изпратен','Ще бъде разгледан от администратор.'],
      contact:['Съобщението е изпратено','Благодарим за обратната връзка.'],
      register:['Профилът е създаден','Можеш да продължиш към профила си.'],
      login:['Входът е успешен','Профилът е достъпен.'],
      forgot:['Ако има такъв профил, изпратихме връзка','По съображения за поверителност не потвърждаваме дали имейлът е регистриран.'],
      'reset-password':['Паролата е променена','Можеш да влезеш с новата парола.']
    };
    return map[type] || ['Изпратено успешно','Действието е прието.'];
  }

  function nextRoute(type) {
    if (['listing','firm','question'].includes(type)) return 'profile';
    if (['health','correction','health-signal'].includes(type)) return 'health';
    if (type === 'shop') return 'shops';
    if (type === 'answer') return 'question-detail';
    if (['login','register','reset-password'].includes(type)) return 'profile';
    return 'home';
  }

  function showFailure(form) {
    const copy = failureCopy(typeOf(form));
    const box = statusBox(form);
    box.hidden = false;
    box.className = 'v6-form-status is-error';
    box.innerHTML = `<span class="v6-form-status-icon" aria-hidden="true">!</span><div><strong>${copy[0]}</strong><p>${copy[1]}</p></div>`;
    form.querySelector('[type="submit"]')?.removeAttribute('disabled');
    form.dataset.completed = 'false';
    box.tabIndex = -1;
    box.focus({preventScroll:true});
    box.scrollIntoView({behavior:'smooth',block:'center'});
  }

  function showSuccess(form) {
    const type = typeOf(form);
    const copy = successCopy(form);
    const receipt = document.createElement('section');
    receipt.className = 'v6-submit-receipt';
    receipt.setAttribute('role','status');
    receipt.innerHTML = `<span class="v6-submit-receipt-icon" aria-hidden="true">✓</span><div><strong>${copy[0]}</strong><p>${copy[1]}</p><button class="primary" type="button" data-route="${nextRoute(type)}">Продължи</button></div>`;
    form.dataset.completed = 'true';
    form.hidden = true;
    markBaseline(form);
    form.insertAdjacentElement('afterend',receipt);
    receipt.tabIndex = -1;
    receipt.focus({preventScroll:true});
    receipt.scrollIntoView({behavior:'smooth',block:'center'});
  }

  function submit(form) {
    const first = validate(form);
    if (first) return showInvalid(form,first);
    const button = form.querySelector('[type="submit"]');
    if (button) button.disabled = true;
    const box = statusBox(form);
    box.hidden = false;
    box.className = 'v6-form-status is-progress';
    box.innerHTML = '<span class="v6-form-status-icon" aria-hidden="true">…</span><div><strong>Изпращане…</strong><p>Проверяваме данните и връзката със системата.</p></div>';
    setTimeout(() => forceFailure ? showFailure(form) : showSuccess(form),360);
  }

  function initForm(form) {
    if (initialized.has(form)) return;
    initialized.add(form);
    requestAnimationFrame(() => markBaseline(form));
    form.addEventListener('input',event => event.target?.matches('input,textarea,select') && fieldError(event.target,''));
    form.addEventListener('change',event => event.target?.matches('input,textarea,select') && fieldError(event.target,''));
    form.addEventListener('submit',event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      submit(form);
    },true);
  }

  function initAll() {
    ensureQaButton();
    Array.from(document.querySelectorAll(FORM_SELECTOR)).forEach(initForm);
  }

  document.addEventListener('click',event => {
    const qa = event.target.closest?.('[data-v8-failure-toggle]');
    if (qa) {
      event.preventDefault();
      forceFailure = !forceFailure;
      qa.setAttribute('aria-pressed',String(forceFailure));
      qa.textContent = forceFailure ? 'Тест на изпращане: грешка' : 'Тест на изпращане: успешно';
      qa.classList.toggle('is-error',forceFailure);
      return;
    }

    const choice = event.target.closest?.('[data-v8-choice]');
    if (choice) {
      event.preventDefault();
      const group = choice.closest('[data-v8-choice-group]');
      group?.querySelectorAll('[data-v8-choice]').forEach(button => button.classList.remove('active'));
      choice.classList.add('active');
      return;
    }

    if (bypass) return;
    const target = event.target.closest?.('[data-route],[data-v8-role],[data-cancel-form]');
    if (!target || target.closest('#v8-unsaved-layer') || target.closest('.v6-submit-receipt')) return;
    const form = dirtyForm();
    if (!form) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    askDiscard(() => target.isConnected && target.click());
  },true);

  document.addEventListener('keydown',event => {
    if (event.key !== 'Escape') return;
    const layer = document.getElementById('v8-unsaved-layer');
    if (layer && !layer.hidden) {
      event.preventDefault();
      event.stopImmediatePropagation();
      layer.hidden = true;
      pendingAction = null;
      return;
    }
    const addSheet = document.getElementById('add-sheet');
    if (addSheet && !addSheet.hidden) return;
    if (!bypass && dirtyForm()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      askDiscard(() => document.dispatchEvent(new CustomEvent('v8-force-escape')));
    }
  },true);

  window.addEventListener('popstate', event => {
    if (allowNextHistoryMove) {
      allowNextHistoryMove = false;
      return;
    }

    if (restoringHistory) {
      event.stopImmediatePropagation();
      restoringHistory = false;
      askDiscard(() => {
        allowNextHistoryMove = true;
        history.back();
      });
      return;
    }

    if (bypass || !dirtyForm()) return;

    event.stopImmediatePropagation();
    restoringHistory = true;
    history.forward();
  });

  window.addEventListener('beforeunload',event => {
    if (!dirtyForm()) return;
    event.preventDefault();
    event.returnValue = '';
  });

  new MutationObserver(initAll).observe(app,{childList:true,subtree:true});
  initAll();
}());
