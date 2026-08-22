(() => {
  "use strict";

  const FORM_SELECTOR = ".health-action-form";
  const FIELD_SELECTOR = "input:not([type='hidden']), textarea, select";
  const messages = {
    name: "Въведи име или обект.",
    details: "Добави телефон, адрес или друга полезна информация.",
    entry_id: "Избери запис.",
    current_problem: "Опиши какво е грешно.",
    proposed_value: "Напиши правилната информация.",
    description: "Опиши какво е грешно."
  };

  function ensureStyles() {
    if (document.getElementById("health-form-validation-v1-style")) return;
    const style = document.createElement("style");
    style.id = "health-form-validation-v1-style";
    style.textContent = `
      .health-action-form [aria-invalid="true"]{border-color:#b42318!important;outline-color:#b42318}
      .health-field-error{margin:5px 0 0;color:#b42318;font-size:.82rem;font-weight:750;line-height:1.35}
    `;
    document.head.appendChild(style);
  }

  function errorElement(field) {
    if (!field?.name) return null;
    const id = `health-${field.name}-error`;
    let error = document.getElementById(id);
    if (!error) {
      error = document.createElement("p");
      error.id = id;
      error.className = "health-field-error";
      error.setAttribute("aria-live", "polite");
      field.insertAdjacentElement("afterend", error);
    }
    const describedBy = new Set((field.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean));
    describedBy.add(id);
    field.setAttribute("aria-describedby", [...describedBy].join(" "));
    return error;
  }

  function validationMessage(field) {
    const value = String(field.value || "").trim();
    if (field.required && !value) return messages[field.name] || "Попълни това поле.";
    if (field.maxLength > 0 && value.length > field.maxLength) {
      return `Полето може да съдържа най-много ${field.maxLength} знака.`;
    }
    return "";
  }

  function validateField(field) {
    const error = errorElement(field);
    const message = validationMessage(field);
    if (error) error.textContent = message;
    field.setAttribute("aria-invalid", String(Boolean(message)));
    return !message;
  }

  document.addEventListener("focusout", event => {
    const field = event.target.closest?.(`${FORM_SELECTOR} ${FIELD_SELECTOR}`);
    if (!field) return;
    field.dataset.touched = "true";
    validateField(field);
  });

  document.addEventListener("input", event => {
    const field = event.target.closest?.(`${FORM_SELECTOR} ${FIELD_SELECTOR}`);
    if (!field) return;
    if (field.dataset.touched === "true" || field.getAttribute("aria-invalid") === "true") validateField(field);
  });

  document.addEventListener("change", event => {
    const field = event.target.closest?.(`${FORM_SELECTOR} select`);
    if (!field) return;
    if (field.dataset.touched === "true" || field.getAttribute("aria-invalid") === "true") validateField(field);
  });

  document.addEventListener("submit", event => {
    const form = event.target.closest?.(FORM_SELECTOR);
    if (!form || form.dataset.completed === "true") return;
    const fields = [...form.querySelectorAll(FIELD_SELECTOR)].filter(field => field.required || field.maxLength > 0);
    fields.forEach(field => { field.dataset.touched = "true"; });
    const firstInvalid = fields.find(field => !validateField(field));
    if (!firstInvalid) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    firstInvalid.focus();
  }, true);

  ensureStyles();
})();