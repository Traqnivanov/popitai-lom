// Попитай.Лом — ясни проверки на фирмената форма
(() => {
  "use strict";

  const form = document.querySelector("#company-form");
  if (!form || form.dataset.businessValidationReady === "true") return;
  form.dataset.businessValidationReady = "true";
  form.noValidate = true;

  const fields = {
    name: document.querySelector("#company-name"),
    category: document.querySelector("#company-category"),
    phone: document.querySelector("#company-phone"),
    description: document.querySelector("#company-description")
  };

  if (Object.values(fields).some((field) => !field)) return;

  function injectStyles() {
    if (document.querySelector("#business-validation-styles")) return;
    const style = document.createElement("style");
    style.id = "business-validation-styles";
    style.textContent = `
      .business-field-meta {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        margin-top: 6px;
        color: #667085;
        font-size: 13px;
        line-height: 1.45;
      }
      .business-field-hint { flex: 1; }
      .business-field-counter {
        flex: 0 0 auto;
        white-space: nowrap;
        font-variant-numeric: tabular-nums;
        font-weight: 700;
      }
      .business-field-counter.is-near-limit { color: #9a6700; }
      .business-field-counter.is-over-limit { color: #b42318; }
      .business-field-error {
        min-height: 0;
        margin: 6px 0 0;
        color: #b42318;
        font-size: 13px;
        font-weight: 700;
        line-height: 1.4;
      }
      .business-field-error:empty { display: none; }
      .content-form input.is-invalid,
      .content-form textarea.is-invalid,
      .content-form select.is-invalid {
        border-color: #b42318 !important;
        box-shadow: 0 0 0 3px rgba(180, 35, 24, 0.12) !important;
      }
      .content-form input.is-valid,
      .content-form textarea.is-valid,
      .content-form select.is-valid {
        border-color: #2e7d32;
      }
    `;
    document.head.appendChild(style);
  }

  function ensureSupportText(field, { hint = "", max = 0 } = {}) {
    const baseId = field.id;
    const hintId = `${baseId}-hint`;
    const counterId = `${baseId}-counter`;
    const errorId = `${baseId}-error`;

    let meta = document.querySelector(`#${baseId}-meta`);
    if (!meta && (hint || max)) {
      meta = document.createElement("div");
      meta.id = `${baseId}-meta`;
      meta.className = "business-field-meta";

      if (hint) {
        const hintElement = document.createElement("span");
        hintElement.id = hintId;
        hintElement.className = "business-field-hint";
        hintElement.textContent = hint;
        meta.appendChild(hintElement);
      }

      if (max) {
        const counter = document.createElement("span");
        counter.id = counterId;
        counter.className = "business-field-counter";
        counter.setAttribute("aria-live", "polite");
        meta.appendChild(counter);
      }

      field.insertAdjacentElement("afterend", meta);
    }

    let error = document.querySelector(`#${errorId}`);
    if (!error) {
      error = document.createElement("p");
      error.id = errorId;
      error.className = "business-field-error";
      error.setAttribute("aria-live", "polite");
      (meta || field).insertAdjacentElement("afterend", error);
    }

    const describedBy = [
      hint && document.querySelector(`#${hintId}`) ? hintId : "",
      max && document.querySelector(`#${counterId}`) ? counterId : "",
      errorId
    ].filter(Boolean).join(" ");
    field.setAttribute("aria-describedby", describedBy);

    return {
      error,
      counter: max ? document.querySelector(`#${counterId}`) : null,
      max
    };
  }

  injectStyles();

  fields.name.required = true;
  fields.name.minLength = 2;
  fields.name.maxLength = 120;
  fields.name.autocomplete = "organization";
  fields.name.placeholder = "Например: Автосервиз Иванов";

  fields.category.required = true;

  fields.phone.required = true;
  fields.phone.maxLength = 24;
  fields.phone.inputMode = "tel";
  fields.phone.autocomplete = "tel";
  fields.phone.placeholder = "0888 123 456";

  fields.description.required = true;
  fields.description.minLength = 20;
  fields.description.maxLength = 5000;
  fields.description.placeholder = "Опиши услугите, района и полезна информация за клиентите.";

  const support = {
    name: ensureSupportText(fields.name, {
      hint: "Напиши реалното име, с което клиентите познават фирмата.",
      max: 120
    }),
    category: ensureSupportText(fields.category),
    phone: ensureSupportText(fields.phone, {
      hint: "Например: 0888 123 456 или +359 888 123 456"
    }),
    description: ensureSupportText(fields.description, {
      hint: "Минимум 20 знака. Опиши услугите, района и полезна информация за клиентите.",
      max: 5000
    })
  };

  function textLength(value) {
    return Array.from(String(value || "")).length;
  }

  function normalizeName(value) {
    return String(value || "").trim().replace(/\s+/g, " ");
  }

  function normalizeDescription(value) {
    return String(value || "")
      .replace(/\r\n?/g, "\n")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function validateName(value) {
    const normalized = normalizeName(value);
    const length = textLength(normalized);

    if (!normalized) return "Въведи име на фирмата.";
    if (length < 2) return "Името трябва да съдържа поне 2 знака.";
    if (length > 120) return "Името може да съдържа най-много 120 знака.";
    if (!/\p{L}/u.test(normalized)) return "Името трябва да съдържа поне една буква.";
    if (!/^[\p{L}\p{N}\s.,/&()'’+№-]+$/u.test(normalized)) {
      return "Използвай букви, цифри и обичайни знаци като тире, точка, / или &.";
    }
    if (/([^\s])\1{7,}/iu.test(normalized)) {
      return "Името съдържа прекалено много еднакви знаци поред.";
    }
    return "";
  }

  function validateCategory(value) {
    return String(value || "").trim() ? "" : "Избери категория.";
  }

  function phoneDigits(value) {
    return String(value || "").replace(/\D/g, "");
  }

  function validatePhone(value) {
    const normalized = String(value || "").trim();
    if (!normalized) return "Въведи телефон за връзка.";
    if (/\p{L}/u.test(normalized)) return "Телефонът не може да съдържа букви.";
    if (!/^[+\d\s().-]+$/.test(normalized)) {
      return "Използвай само цифри, интервали, +, тирета или скоби.";
    }
    if ((normalized.match(/\+/g) || []).length > 1 || (normalized.includes("+") && !normalized.startsWith("+"))) {
      return "Знакът + може да бъде само веднъж и в началото.";
    }

    const digits = phoneDigits(normalized);
    if (/^(\d)\1+$/.test(digits)) return "Въведи реален телефонен номер.";

    if (normalized.startsWith("+")) {
      if (!normalized.startsWith("+359")) return "Международният български номер трябва да започва с +359.";
      if (![11, 12].includes(digits.length)) return "След +359 трябва да има 8 или 9 цифри.";
      if (digits.charAt(3) === "0") return "След +359 не се изписва началната нула.";
      return "";
    }

    if (!digits.startsWith("0")) return "Българският номер трябва да започва с 0 или +359.";
    if (![9, 10].includes(digits.length)) return "Телефонът трябва да съдържа общо 9 или 10 цифри.";
    return "";
  }

  function formatPhone(value) {
    const raw = String(value || "").trim();
    const digits = phoneDigits(raw);

    if (raw.startsWith("+359")) {
      const national = digits.slice(3);
      if (national.length === 9) {
        return `+359 ${national.slice(0, 3)} ${national.slice(3, 6)} ${national.slice(6)}`;
      }
      if (national.length === 8 && national.startsWith("2")) {
        return `+359 2 ${national.slice(1, 4)} ${national.slice(4)}`;
      }
      return `+359 ${national.replace(/(.{3})/g, "$1 ").trim()}`;
    }

    if (digits.length === 10 && digits.startsWith("08")) {
      return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
    }
    if (digits.length === 9 && digits.startsWith("02")) {
      return `02 ${digits.slice(2, 5)} ${digits.slice(5)}`;
    }
    if (digits.length === 9) {
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    }
    if (digits.length === 10) {
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    }
    return raw.replace(/\s+/g, " ");
  }

  function validateDescription(value) {
    const normalized = normalizeDescription(value);
    const length = textLength(normalized);
    if (!normalized) return "Въведи описание на фирмата.";
    if (length < 20) return `Добави още ${20 - length} знака към описанието.`;
    if (length > 5000) return "Описанието може да съдържа най-много 5000 знака.";

    const words = normalized.match(/[\p{L}\p{N}]+/gu) || [];
    if (words.length < 3) return "Описанието трябва да съдържа поне 3 думи.";

    const meaningfulCharacters = normalized.match(/[\p{L}\p{N}]/gu) || [];
    if (meaningfulCharacters.length < 10) return "Добави повече полезна информация към описанието.";
    if (/([^\s])\1{5,}/iu.test(normalized)) {
      return "Описанието съдържа прекалено много еднакви знаци поред.";
    }
    return "";
  }

  const validators = {
    name: validateName,
    category: validateCategory,
    phone: validatePhone,
    description: validateDescription
  };

  function updateCounter(key) {
    const config = support[key];
    if (!config?.counter || !config.max) return;
    const length = textLength(fields[key].value);
    config.counter.textContent = `${length} / ${config.max}`;
    config.counter.classList.toggle("is-near-limit", length >= config.max * 0.9 && length <= config.max);
    config.counter.classList.toggle("is-over-limit", length > config.max);
  }

  function setFieldState(key, message, showSuccess = false) {
    const field = fields[key];
    const error = support[key].error;
    const invalid = Boolean(message);

    error.textContent = message;
    field.classList.toggle("is-invalid", invalid);
    field.classList.toggle("is-valid", !invalid && showSuccess && Boolean(String(field.value || "").trim()));
    field.setAttribute("aria-invalid", String(invalid));
  }

  function validateField(key, { showSuccess = false } = {}) {
    const field = fields[key];
    const message = validators[key](field.value);
    setFieldState(key, message, showSuccess);
    updateCounter(key);
    return !message;
  }

  function normalizeField(key) {
    if (key === "name") fields.name.value = normalizeName(fields.name.value);
    if (key === "phone" && !validatePhone(fields.phone.value)) fields.phone.value = formatPhone(fields.phone.value);
    if (key === "description") fields.description.value = normalizeDescription(fields.description.value);
  }

  function resetSummary() {
    const summary = document.querySelector("#company-message");
    if (!summary) return;
    if (summary.classList.contains("is-error")) {
      summary.textContent = "";
      summary.classList.remove("is-error", "is-warning", "is-success");
    }
  }

  Object.keys(fields).forEach((key) => {
    const field = fields[key];
    updateCounter(key);

    field.addEventListener("blur", () => {
      field.dataset.touched = "true";
      normalizeField(key);
      validateField(key, { showSuccess: true });
    });

    const eventName = field.tagName === "SELECT" ? "change" : "input";
    field.addEventListener(eventName, () => {
      updateCounter(key);
      resetSummary();
      if (field.dataset.touched === "true" || field.classList.contains("is-invalid")) {
        validateField(key, { showSuccess: true });
      }
    });
  });

  function validateForm() {
    const order = ["name", "category", "phone", "description"];
    order.forEach((key) => {
      fields[key].dataset.touched = "true";
      normalizeField(key);
    });

    const results = order.map((key) => validateField(key, { showSuccess: true }));
    const firstInvalidIndex = results.findIndex((valid) => !valid);
    if (firstInvalidIndex === -1) return true;

    const firstInvalid = fields[order[firstInvalidIndex]];
    const summary = document.querySelector("#company-message");
    if (summary) {
      summary.textContent = "Провери отбелязаните полета. Данните ти са запазени.";
      summary.classList.remove("is-warning", "is-success");
      summary.classList.add("is-error");
    }

    firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => firstInvalid.focus({ preventScroll: true }), 250);
    return false;
  }

  document.addEventListener("submit", (event) => {
    if (event.target !== form) return;
    if (validateForm()) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);

  form.addEventListener("reset", () => {
    window.setTimeout(() => {
      Object.keys(fields).forEach((key) => {
        delete fields[key].dataset.touched;
        fields[key].classList.remove("is-invalid", "is-valid");
        fields[key].setAttribute("aria-invalid", "false");
        support[key].error.textContent = "";
        updateCounter(key);
      });
    }, 0);
  });
})();
