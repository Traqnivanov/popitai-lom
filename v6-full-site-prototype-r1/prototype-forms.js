"use strict";

const PROTO_DRAFT_KEY = "popitai_v6_r1_pending_draft";
const NO_DIRTY_GUARD_FORMS = new Set(["home-search", "search", "login", "register", "recover", "reset-password", "change-password"]);
let pendingDiscardRoute = null;

function validatePhone(value) {
  const text = String(value || "").trim();
  if (!text) return "Въведи телефон.";
  if (/\p{L}/u.test(text)) return "Телефонът не може да съдържа букви.";
  if (!/^[+\d\s().-]+$/.test(text)) return "Използвай само цифри, интервали, +, тирета или скоби.";
  const digits = text.replace(/\D/g, "");
  if (text.startsWith("+")) {
    if (!text.startsWith("+359")) return "Българският международен номер трябва да започва с +359.";
    if (![11, 12].includes(digits.length)) return "След +359 трябва да има 8 или 9 цифри.";
  } else {
    if (!digits.startsWith("0")) return "Номерът трябва да започва с 0 или +359.";
    if (![9, 10].includes(digits.length)) return "Телефонът трябва да съдържа общо 9 или 10 цифри.";
  }
  return "";
}

function ensureFieldError(form, el) {
  if (!form || !el?.name) return null;
  let error = form.querySelector(`[data-error-for="${CSS.escape(el.name)}"]`);
  if (!error) {
    error = document.createElement("small");
    error.className = "field-error";
    error.dataset.errorFor = el.name;
    const box = el.closest(".field") || el.closest("fieldset") || el.parentElement;
    box?.appendChild(error);
  }
  if (!error.id) error.id = `proto-error-${Math.random().toString(36).slice(2, 9)}`;
  const described = new Set(String(el.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean));
  described.add(error.id);
  el.setAttribute("aria-describedby", [...described].join(" "));
  return error;
}

function setFieldError(el, message) {
  const form = el.form;
  const box = el.closest(".field") || el.closest("fieldset");
  if (box) box.classList.toggle("invalid", Boolean(message));
  const error = ensureFieldError(form, el);
  if (error) error.textContent = message || "";
  if (message) el.setAttribute("aria-invalid", "true");
  else el.removeAttribute("aria-invalid");
}

function validateControl(el) {
  if (!el?.name || el.type === "hidden" || el.disabled) return true;
  let message = "";
  const value = ["checkbox", "radio"].includes(el.type) ? "" : String(el.value || "").trim();

  if (el.required) {
    if (el.type === "checkbox" && !el.checked) message = "Това потвърждение е задължително.";
    else if (el.type === "radio" && !el.form.querySelector(`[name="${CSS.escape(el.name)}"]:checked`)) message = "Избери една от опциите.";
    else if (!["checkbox", "radio"].includes(el.type) && !value) message = "Полето е задължително.";
  }

  if (!message && value && el.minLength > 0 && value.length < el.minLength) message = `Въведи поне ${el.minLength} знака.`;
  if (!message && value && el.maxLength > 0 && value.length > el.maxLength) message = `Максимум ${el.maxLength} знака.`;
  if (!message && el.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) message = "Въведи валиден имейл адрес.";
  if (!message && el.type === "url" && value) {
    try { new URL(value); } catch { message = "Въведи валиден адрес на сайт, например https://example.com."; }
  }
  if (!message && el.type === "tel" && value) message = validatePhone(value);
  if (!message && el.type === "number" && value) {
    const number = Number(value);
    const min = el.min === "" ? null : Number(el.min);
    if (!Number.isFinite(number)) message = "Въведи валидно число.";
    else if (min !== null && number < min) message = `Стойността не може да е под ${min}.`;
  }

  setFieldError(el, message);
  return !message;
}

function formStatus(form) {
  let status = form.querySelector("[data-form-status]");
  if (!status) {
    status = document.createElement("div");
    status.dataset.formStatus = "true";
    status.className = "notice notice-danger form-status-summary";
    status.setAttribute("role", "alert");
    status.setAttribute("aria-live", "assertive");
    status.hidden = true;
    form.prepend(status);
  }
  return status;
}

function clearFormStatus(form) {
  const status = form.querySelector("[data-form-status]");
  if (!status) return;
  status.hidden = true;
  status.innerHTML = "";
}

function showFormStatus(form, title, text, kind = "danger") {
  const status = formStatus(form);
  status.className = `notice notice-${kind} form-status-summary`;
  status.innerHTML = `<strong>${esc(title)}</strong>${esc(text)}`;
  status.hidden = false;
  return status;
}

function validateForm(form) {
  clearFormStatus(form);
  const controls = [...form.elements].filter(el => el.name && !el.disabled);
  let firstInvalid = null;
  controls.forEach(el => {
    if (!validateControl(el) && !firstInvalid) firstInvalid = el;
  });

  if (form.dataset.form === "register") {
    const password = form.elements.password;
    const confirm = form.elements.confirm_password;
    if (password && confirm && password.value !== confirm.value) {
      setFieldError(confirm, "Паролите не съвпадат.");
      firstInvalid = firstInvalid || confirm;
    }
  }

  if (firstInvalid) {
    showFormStatus(form, "Провери формата", "Нищо не е изпратено. Поправи отбелязаните полета.");
    firstInvalid.focus();
    firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
    return false;
  }
  return true;
}

function guardEnabled(form) {
  return Boolean(form?.dataset.form && !NO_DIRTY_GUARD_FORMS.has(form.dataset.form));
}

function setSubmitting(form, active) {
  const button = form.querySelector('button[type="submit"], input[type="submit"]');
  if (!button) return;
  if (active) {
    if (!button.dataset.originalLabel) button.dataset.originalLabel = button.textContent || button.value || "Изпрати";
    button.disabled = true;
    if (button.tagName === "INPUT") button.value = isAdmin() && ["listing", "firm"].includes(form.dataset.form) ? "Публикуване…" : "Изпращане…";
    else button.textContent = isAdmin() && ["listing", "firm"].includes(form.dataset.form) ? "Публикуване…" : "Изпращане…";
    form.setAttribute("aria-busy", "true");
    form.dataset.submitting = "true";
  } else {
    const label = button.dataset.originalLabel || "Изпрати";
    button.disabled = false;
    if (button.tagName === "INPUT") button.value = label;
    else button.textContent = label;
    form.removeAttribute("aria-busy");
    form.dataset.submitting = "false";
  }
}

function snapshotForm(form, formType) {
  const values = [];
  [...form.elements].forEach(el => {
    if (!el.name || el.disabled || el.type === "file" || el.type === "password" || el.type === "submit" || el.type === "button") return;
    if (el.type === "radio" || el.type === "checkbox") values.push({ name: el.name, type: el.type, value: el.value, checked: el.checked });
    else values.push({ name: el.name, type: el.type, value: el.value });
  });
  const draft = { formType, route: routeInfo().raw, values };
  try { sessionStorage.setItem(PROTO_DRAFT_KEY, JSON.stringify(draft)); } catch {}
  return draft;
}

function readPendingDraft() {
  try { return JSON.parse(sessionStorage.getItem(PROTO_DRAFT_KEY) || "null"); } catch { return null; }
}
function clearPendingDraft() { try { sessionStorage.removeItem(PROTO_DRAFT_KEY); } catch {} }

function applyDraftValue(form, row) {
  const matches = [...form.querySelectorAll(`[name="${CSS.escape(row.name)}"]`)];
  if (!matches.length) return false;
  if (row.type === "radio" || row.type === "checkbox") matches.filter(el => el.value === row.value).forEach(el => { el.checked = Boolean(row.checked); });
  else matches[0].value = row.value;
  return true;
}

function restorePendingDraft() {
  const draft = readPendingDraft();
  if (!draft || draft.route !== routeInfo().raw) return false;
  const form = document.querySelector(`form[data-form="${CSS.escape(draft.formType)}"]`);
  if (!form) return false;

  const firstKind = draft.values.find(x => x.name === "simple_kind" && x.checked);
  if (firstKind) {
    applyDraftValue(form, firstKind);
    form.querySelector(`[name="simple_kind"][value="${CSS.escape(firstKind.value)}"]`)?.dispatchEvent(new Event("change", { bubbles: true }));
  }

  const stagedNames = ["simple_group", "simple_leaf", "simple_action"];
  stagedNames.forEach(name => {
    const rows = draft.values.filter(x => x.name === name);
    rows.forEach(row => {
      if (applyDraftValue(form, row)) form.querySelector(`[name="${CSS.escape(name)}"]`)?.dispatchEvent(new Event("change", { bubbles: true }));
    });
  });

  draft.values.filter(x => !["simple_kind", ...stagedNames].includes(x.name)).forEach(row => applyDraftValue(form, row));
  if (guardEnabled(form)) state.dirty = true;
  toast("Входът е успешен. Попълненото е възстановено.");
  return true;
}

function bindFormUX() {
  document.querySelectorAll(".proto-form").forEach(form => {
    formStatus(form);
    if (!form.dataset.bound) {
      form.dataset.bound = "1";
      form.addEventListener("input", event => {
        const target = event.target;
        if (!target.matches("input,select,textarea")) return;
        if (guardEnabled(form)) state.dirty = true;
        if (target.dataset.touched) validateControl(target);
      });
      form.addEventListener("change", event => {
        if (guardEnabled(form) && event.target.matches("input,select,textarea")) state.dirty = true;
      });
      form.addEventListener("focusout", event => {
        const target = event.target;
        if (target.matches("input,select,textarea") && target.name) {
          target.dataset.touched = "1";
          validateControl(target);
        }
      });
    }
  });

  const photos = document.getElementById("listing-photos");
  if (photos && !photos.dataset.bound) {
    photos.dataset.bound = "1";
    photos.addEventListener("change", () => {
      const allFiles = [...photos.files];
      const visibleFiles = isAdmin() ? allFiles : allFiles.slice(0, 6);
      const preview = document.getElementById("listing-photo-preview");
      if (preview) preview.innerHTML = visibleFiles.map(file => `<span>${esc(file.name.slice(0, 10))}${file.name.length > 10 ? "…" : ""}</span>`).join("");
      if (!isAdmin() && allFiles.length > 6) toast("За обикновена или фирмена обява се показват максимум 6 снимки.");
    });
  }
}

function bindDuplicateCheck() {
  const input = document.querySelector('[data-form="question"] [name="title"]');
  const warning = document.getElementById("duplicate-warning");
  const copy = document.getElementById("duplicate-copy");
  const open = document.getElementById("open-duplicate");
  if (!input || !warning) return;
  const check = () => {
    const words = input.value.toLocaleLowerCase("bg-BG").split(/\s+/).filter(x => x.length > 4);
    const hit = D.questions.find(q => words.filter(word => q.title.toLocaleLowerCase("bg-BG").includes(word)).length >= 2);
    warning.hidden = !hit;
    if (hit) {
      copy.textContent = ` Подобен въпрос: „${hit.title}“`;
      open.dataset.route = `question/${hit.id}`;
    }
  };
  input.addEventListener("blur", check);
  check();
}

function requireSignIn(formType, form) {
  if (signedIn()) return true;
  snapshotForm(form, formType);
  state.dirty = false;
  toast("За изпращане е нужен вход. Попълненото ще бъде възстановено след вход.");
  navigate(`auth/login?source=${encodeURIComponent(formType)}`, { force: true });
  return false;
}

function successScreen(title, text, nextRoute = "home", nextLabel = "Към началото", shareNote = false) {
  state.dirty = false;
  main.innerHTML = pageIntro("Успешно изпращане", title, text) + `<section class="section"><div class="shell form-wrap"><div class="form-card"><div class="notice notice-ok" id="prototype-success-receipt" role="status" tabindex="-1"><strong>✓ ${esc(title)}</strong>${esc(text)}</div>${shareNote ? `<div class="notice notice-info mt-12"><strong>Споделяне след одобрение</strong>Публичният линк става достъпен само след като съдържанието бъде одобрено и публикувано.</div>` : ""}<div class="form-actions mt-16"><button class="button button-primary" data-route="${esc(nextRoute)}">${esc(nextLabel)}</button><button class="button button-soft" data-route="profile">Виж профила / статуса</button></div></div></div></section>`;
  const receipt = document.getElementById("prototype-success-receipt");
  receipt?.focus({ preventScroll: true });
  receipt?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function serverError(form) {
  showFormStatus(form, "Не успяхме да изпратим", "Данните са запазени. Провери връзката и опитай отново.");
  setSubmitting(form, false);
  if (guardEnabled(form)) state.dirty = true;
}

async function submitForm(form) {
  if (form.dataset.submitting === "true") return;
  if (!validateForm(form)) return;

  const type = form.dataset.form;
  const fd = new FormData(form);

  if (["listing", "firm", "health-proposal", "shop-proposal", "question", "answer", "correction", "report", "offer-request"].includes(type) && !requireSignIn(type, form)) return;

  if (type === "home-search" || type === "search") {
    state.dirty = false;
    navigate(`search?q=${encodeURIComponent(fd.get("q") || "")}`, { force: true });
    return;
  }

  setSubmitting(form, true);
  clearFormStatus(form);
  await new Promise(resolve => setTimeout(resolve, 260));

  if (state.dataState === "offline" || state.dataState === "error") {
    serverError(form);
    return;
  }

  state.dirty = false;

  if (type === "login") {
    state.role = "user";
    saveState();
    const draft = readPendingDraft();
    if (draft?.route) { navigate(draft.route, { force: true }); return; }
    successScreen("Входът е успешен", "За този преглед си влязъл като обикновен потребител.", "profile", "Към профила");
    refreshRoleUI();
    return;
  }

  if (type === "register") {
    state.role = "user";
    saveState();
    const draft = readPendingDraft();
    if (draft?.route) { navigate(draft.route, { force: true }); return; }
    successScreen("Профилът е създаден", "За този преглед регистрацията е симулирана успешно.", "profile", "Към профила");
    refreshRoleUI();
    return;
  }

  if (type === "recover") {
    successScreen("Провери електронната си поща", "Ако адресът е свързан с профил, ще получиш връзка за възстановяване.", "auth/login", "Към вход");
    return;
  }

  const draft = readPendingDraft();
  if (draft?.formType === type) clearPendingDraft();

  if (type === "listing") {
    const edit = Boolean(form.dataset.editId);
    state.submissions.push({ kind: "listing", status: isAdmin() ? "approved" : "pending", time: Date.now() });
    saveState();
    if (isAdmin()) successScreen(edit ? "Промените са публикувани" : "Обявата е публикувана", "Администраторската публикация е показана като публикувана директно според защитеното правило.", "marketplace", "Към обявите");
    else successScreen(edit ? "Редакцията е изпратена за преглед" : "Обявата е изпратена за преглед", edit ? "Последната одобрена версия остава публична, докато редакцията чака решение." : "Обявата не е публикувана автоматично. Тя чака преглед.", "marketplace", "Към обявите", true);
    return;
  }

  if (type === "firm") {
    const edit = Boolean(form.dataset.editId);
    state.submissions.push({ kind: "firm", status: isAdmin() ? "approved" : "pending", time: Date.now() });
    saveState();
    if (isAdmin()) successScreen(edit ? "Промените по фирмата са публикувани" : "Фирмата е публикувана", "Администраторската промяна се публикува директно според защитените правила.", "firms", "Към фирмите");
    else successScreen(edit ? "Редакцията на фирмата е изпратена за преглед" : "Фирмата е изпратена за преглед", edit ? "Последната одобрена версия остава публична до одобряване на редакцията." : "Фирмата не става публична преди одобрение.", "firms", "Към фирмите", true);
    return;
  }

  if (type === "health-proposal") { successScreen("Предложението е изпратено за преглед", "Специалистът или практиката няма да се покажат като потвърдени преди специализираната здравна проверка.", "marketplace/services?group=health", "Към Здраве и грижа", true); return; }
  if (type === "shop-proposal") { successScreen("Предложението за магазин е изпратено за проверка", "Магазинът няма да се показва публично преди одобрение.", "shops", "Към магазините", true); return; }
  if (type === "question") { successScreen("Въпросът е изпратен за преглед", "След одобрение въпросът може да получи публична страница.", "questions", "Към въпросите", true); return; }
  if (type === "answer") { successScreen("Отговорът е изпратен за преглед", "Отговорът ще се появи публично само след одобрение.", `question/${form.dataset.questionId}`, "Към въпроса"); return; }
  if (type === "correction") { successScreen("Корекцията е изпратена", "Публичният запис не е променен директно. Предложението чака проверка.", "info", "Към Инфо Лом"); return; }
  if (type === "report") { successScreen("Сигналът е изпратен", "Съдържанието не се изтрива автоматично. Сигналът влиза за преглед.", "home", "Към началото"); return; }
  if (type === "offer-request") { successScreen("Запитването е подготвено", "Това е преглед на бъдещата истинска форма „Поискай оферта“; няма реално изпращане.", "firms", "Към фирмите"); return; }
  if (type === "contact") { successScreen("Съобщението е изпратено", "В този прототип съобщението не се изпраща към реалния сайт.", "home", "Към началото"); return; }

  setSubmitting(form, false);
}

function showDiscardDialog(route) {
  pendingDiscardRoute = route;
  if (typeof confirmContent === "undefined" || typeof openModal !== "function" || !confirmLayer) {
    if (window.confirm("Има неизпратени промени. Ако напуснеш сега, въведените данни ще бъдат загубени.")) {
      state.dirty = false;
      navigate(route, { force: true });
    }
    return;
  }
  confirmContent.innerHTML = `<div class="notice notice-warn"><strong>Има неизпратени промени</strong>Ако напуснеш сега, въведените данни ще бъдат загубени.</div><div class="form-actions mt-16"><button class="button button-primary" type="button" data-proto-discard="stay">Остани във формата</button><button class="button button-danger" type="button" data-proto-discard="leave">Напусни и изтрий</button></div>`;
  openModal(confirmLayer, document.activeElement);
}

document.addEventListener("click", event => {
  const discard = event.target.closest("[data-proto-discard]");
  if (discard) {
    event.preventDefault();
    event.stopImmediatePropagation();
    const action = discard.dataset.protoDiscard;
    if (action === "stay") {
      pendingDiscardRoute = null;
      closeAllModals();
      return;
    }
    const route = pendingDiscardRoute;
    pendingDiscardRoute = null;
    state.dirty = false;
    closeAllModals({ restoreFocus: false });
    if (route) navigate(route, { force: true });
    return;
  }

  const routeEl = event.target.closest("[data-route]");
  if (!routeEl || !state.dirty) return;
  const activeForm = document.querySelector("form.proto-form");
  if (!activeForm || !guardEnabled(activeForm)) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  showDiscardDialog(routeEl.dataset.route);
}, true);

window.addEventListener("hashchange", () => setTimeout(restorePendingDraft, 0));
