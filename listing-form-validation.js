// Попитай.Лом — валидация на формата за обяви
(() => {
  "use strict";

  const form = document.querySelector("#listing-form");
  if (!form || form.dataset.listingValidationReady === "true") return;
  form.dataset.listingValidationReady = "true";
  form.noValidate = true;

  const fields = {
    title: document.querySelector("#listing-title"),
    category: document.querySelector("#listing-category"),
    listingType: document.querySelector("#listing-type"),
    description: document.querySelector("#listing-description"),
    phone: document.querySelector("#listing-phone")
  };

  if (!fields.title || !fields.category || !fields.description || !fields.phone) return;

  function injectStyles() {
    if (document.querySelector("#listing-validation-styles")) return;
    const style = document.createElement("style");
    style.id = "listing-validation-styles";
    style.textContent = `
      .listing-field-meta {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        margin-top: 6px;
        color: #667085;
        font-size: 13px;
        line-height: 1.45;
      }
      .listing-field-hint { flex: 1; }
      .listing-field-counter {
        flex: 0 0 auto;
        white-space: nowrap;
        font-variant-numeric: tabular-nums;
        font-weight: 700;
      }
      .listing-field-counter.is-near-limit { color: #9a6700; }
      .listing-field-counter.is-over-limit { color: #b42318; }
      .listing-field-error {
        min-height: 0;
        margin: 6px 0 0;
        color: #b42318;
        font-size: 13px;
        font-weight: 700;
        line-height: 1.4;
      }
      .listing-field-error:empty { display: none; }
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

  function ensureSupport(field, { hint = "", max = 0 } = {}) {
    const baseId = field.id;
    const errorId = `${baseId}-error`;

    let meta = document.querySelector(`#${baseId}-meta`);
    if (!meta && (hint || max)) {
      meta = document.createElement("div");
      meta.id = `${baseId}-meta`;
      meta.className = "listing-field-meta";

      if (hint) {
        const hintEl = document.createElement("span");
        hintEl.className = "listing-field-hint";
        hintEl.textContent = hint;
        meta.appendChild(hintEl);
      }

      if (max) {
        const counter = document.createElement("span");
        counter.id = `${baseId}-counter`;
        counter.className = "listing-field-counter";
        counter.setAttribute("aria-live", "polite");
        meta.appendChild(counter);
      }

      field.insertAdjacentElement("afterend", meta);
    }

    let error = document.querySelector(`#${errorId}`);
    if (!error) {
      error = document.createElement("p");
      error.id = errorId;
      error.className = "listing-field-error";
      error.setAttribute("aria-live", "polite");
      (meta || field).insertAdjacentElement("afterend", error);
    }

    return {
      error,
      counter: max ? document.querySelector(`#${baseId}-counter`) : null,
      max
    };
  }

  injectStyles();

  const support = {
    title: ensureSupport(fields.title, {
      hint: "Минимум 5, максимум 120 знака.",
      max: 120
    }),
    category: ensureSupport(fields.category),
    listingType: fields.listingType ? ensureSupport(fields.listingType) : null,
    description: ensureSupport(fields.description, {
      hint: "Минимум 20 знака — опиши подробно.",
      max: 5000
    }),
    phone: ensureSupport(fields.phone, {
      hint: "Например: 0876 936 184 или +359 876 936 184"
    })
  };

  function textLength(v) { return Array.from(String(v || "")).length; }

  function validateTitle(v) {
    const s = String(v || "").trim();
    if (!s) return "Въведи заглавие на обявата.";
    if (textLength(s) < 5) return "Заглавието трябва да е поне 5 знака.";
    if (textLength(s) > 120) return "Заглавието може да е най-много 120 знака.";
    return "";
  }

  function validateCategory(v) {
    return String(v || "").trim() ? "" : "Избери категория.";
  }

  function validateListingType(v) {
    const cat = document.querySelector("#listing-category")?.value || "";
    if (cat === "Работа" || cat === "Имоти") return "";
    return String(v || "").trim() ? "" : "Избери тип обява.";
  }

  function phoneDigits(v) { return String(v || "").replace(/\D/g, ""); }

  function validatePhone(v) {
    const s = String(v || "").trim();
    if (!s) return "Въведи телефон за връзка.";
    if (/\p{L}/u.test(s)) return "Телефонът не може да съдържа букви.";
    if (!/^[+\d\s().-]+$/.test(s)) return "Използвай само цифри, интервали, + или тирета.";
    if ((s.match(/\+/g) || []).length > 1 || (s.includes("+") && !s.startsWith("+"))) {
      return "Знакът + може да бъде само веднъж и в началото.";
    }
    const d = phoneDigits(s);
    if (/^(\d)\1+$/.test(d)) return "Въведи реален телефонен номер.";
    if (s.startsWith("+")) {
      if (!s.startsWith("+359")) return "Международният номер трябва да започва с +359.";
      if (![11, 12].includes(d.length)) return "След +359 трябва да има 8 или 9 цифри.";
      if (d.charAt(3) === "0") return "След +359 не се изписва началната нула.";
      return "";
    }
    if (!d.startsWith("0")) return "Номерът трябва да започва с 0 или +359.";
    if (![9, 10].includes(d.length)) return "Телефонът трябва да е 9 или 10 цифри.";
    return "";
  }

  function formatPhone(v) {
    const raw = String(v || "").trim();
    const d = phoneDigits(raw);
    if (raw.startsWith("+359")) {
      const n = d.slice(3);
      if (n.length === 9) return `+359 ${n.slice(0,3)} ${n.slice(3,6)} ${n.slice(6)}`;
      return `+359 ${n}`;
    }
    if (d.length === 10 && d.startsWith("08")) return `${d.slice(0,4)} ${d.slice(4,7)} ${d.slice(7)}`;
    if (d.length === 9) return `${d.slice(0,3)} ${d.slice(3,6)} ${d.slice(6)}`;
    return raw;
  }

  function validateDescription(v) {
    const s = String(v || "").trim();
    const len = textLength(s);
    if (!s) return "Въведи описание на обявата.";
    if (len < 20) return `Добави още ${20 - len} знака към описанието.`;
    if (len > 5000) return "Описанието може да е най-много 5000 знака.";
    const words = s.match(/[\p{L}\p{N}]+/gu) || [];
    if (words.length < 3) return "Описанието трябва да съдържа поне 3 думи.";
    return "";
  }

  const validators = {
    title: validateTitle,
    category: validateCategory,
    listingType: validateListingType,
    description: validateDescription,
    phone: validatePhone
  };

  function updateCounter(key) {
    const s = support[key];
    if (!s?.counter || !s.max) return;
    const len = textLength(fields[key]?.value);
    s.counter.textContent = `${len} / ${s.max}`;
    s.counter.classList.toggle("is-near-limit", len >= s.max * 0.9 && len <= s.max);
    s.counter.classList.toggle("is-over-limit", len > s.max);
  }

  function setFieldState(key, message, showSuccess = false) {
    const field = fields[key];
    if (!field) return;
    const s = support[key];
    if (!s) return;
    s.error.textContent = message;
    field.classList.toggle("is-invalid", Boolean(message));
    field.classList.toggle("is-valid", !message && showSuccess && Boolean(String(field.value || "").trim()));
    field.setAttribute("aria-invalid", String(Boolean(message)));
  }

  function validateField(key, { showSuccess = false } = {}) {
    const field = fields[key];
    if (!field) return true;
    const message = validators[key](field.value);
    setFieldState(key, message, showSuccess);
    updateCounter(key);
    return !message;
  }

  function normalizeField(key) {
    if (key === "phone" && !validatePhone(fields.phone.value)) {
      fields.phone.value = formatPhone(fields.phone.value);
    }
    if (key === "description") {
      fields.description.value = String(fields.description.value || "")
        .replace(/\r\n?/g, "\n").replace(/[ \t]+\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n").trim();
    }
  }

  Object.keys(fields).forEach(key => {
    const field = fields[key];
    if (!field) return;
    updateCounter(key);

    field.addEventListener("blur", () => {
      field.dataset.touched = "true";
      normalizeField(key);
      validateField(key, { showSuccess: true });
    });

    const ev = field.tagName === "SELECT" ? "change" : "input";
    field.addEventListener(ev, () => {
      updateCounter(key);
      if (field.dataset.touched === "true" || field.classList.contains("is-invalid")) {
        validateField(key, { showSuccess: true });
      }
    });
  });

  function validateForm() {
    const order = ["title", "category", "listingType", "description", "phone"];
    order.forEach(key => {
      if (fields[key]) {
        fields[key].dataset.touched = "true";
        normalizeField(key);
      }
    });

    const results = order.map(key => validateField(key, { showSuccess: true }));
    const firstInvalidIndex = results.findIndex(v => !v);
    if (firstInvalidIndex === -1) return true;

    const firstInvalid = fields[order[firstInvalidIndex]];
    firstInvalid?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => firstInvalid?.focus({ preventScroll: true }), 250);
    return false;
  }

  document.addEventListener("submit", event => {
    if (event.target !== form) return;
    if (validateForm()) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);

  form.addEventListener("reset", () => {
    window.setTimeout(() => {
      Object.keys(fields).forEach(key => {
        if (!fields[key]) return;
        delete fields[key].dataset.touched;
        fields[key].classList.remove("is-invalid", "is-valid");
        fields[key].setAttribute("aria-invalid", "false");
        if (support[key]) support[key].error.textContent = "";
        updateCounter(key);
      });
    }, 0);
  });
})();
