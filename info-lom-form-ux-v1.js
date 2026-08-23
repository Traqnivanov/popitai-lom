(() => {
  "use strict";

  const MODAL_SELECTOR = "#info-modal";
  const FORM_SELECTOR = "#info-submit-form, #info-error-form";
  const CLOSE_SELECTOR = "[data-modal-close]";
  const MEANINGFUL_TEXT_FIELDS = new Set(["details", "description", "correct_info"]);

  function modal() {
    return document.querySelector(MODAL_SELECTOR);
  }

  function activeForm() {
    return modal()?.querySelector(FORM_SELECTOR) || null;
  }

  function fieldFromEvent(event) {
    const field = event.target;
    if (!field?.matches?.("input, textarea, select")) return null;
    if (!field.closest(FORM_SELECTOR)) return null;
    return field;
  }

  function ensureError(field) {
    if (!field) return null;
    if (!field.id) field.id = `info-field-${Math.random().toString(36).slice(2, 9)}`;
    const id = `${field.id}-error`;
    let error = document.getElementById(id);
    if (!error) {
      error = document.createElement("p");
      error.id = id;
      error.className = "info-form-status error";
      error.setAttribute("aria-live", "polite");
      field.insertAdjacentElement("afterend", error);
    }
    const describedBy = new Set((field.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean));
    describedBy.add(id);
    field.setAttribute("aria-describedby", [...describedBy].join(" "));
    return error;
  }

  function fieldLabel(field) {
    const label = field.closest(".info-field")?.querySelector("label")?.textContent || "Полето";
    return label.replace(/\s*\*\s*$/, "").trim();
  }

  function isStructuredUsefulValue(value) {
    const compact = value.replace(/\s+/g, "");
    const phoneDigits = compact.replace(/[^\d]/g, "");
    const looksLikePhone = phoneDigits.length >= 7 && phoneDigits.length <= 15 && /^[+\d()\s.-]+$/.test(value);
    const looksLikeUrl = /^(https?:\/\/|www\.)\S+$/i.test(value);
    return looksLikePhone || looksLikeUrl;
  }

  function isMeaningfulText(value) {
    if (isStructuredUsefulValue(value)) return true;
    const words = value.split(/\s+/).filter(part => /[\p{L}\p{N}]/u.test(part));
    if (words.length < 2) return false;
    const alphaNumeric = value.match(/[\p{L}\p{N}]/gu) || [];
    return alphaNumeric.length >= 5;
  }

  function validationMessage(field, showRequired = false) {
    const value = String(field.value || "").trim();
    if (field.required && !value && showRequired) return `Попълни „${fieldLabel(field)}“.`;
    if (!value) return "";

    if (MEANINGFUL_TEXT_FIELDS.has(field.name) && !isMeaningfulText(value)) {
      if (field.name === "details") return "Добави поне две ясни думи, телефон или линк с полезна информация.";
      if (field.name === "description") return "Опиши ясно какво е грешно с поне две думи.";
      return "Добави по-ясна информация с поне две думи, телефон или линк.";
    }

    if (field.maxLength > 0 && value.length > field.maxLength) {
      return `Полето може да съдържа най-много ${field.maxLength} знака.`;
    }
    return "";
  }

  function validateField(field, showRequired = false) {
    const message = validationMessage(field, showRequired);
    const error = ensureError(field);
    if (error) error.textContent = message;
    if (message) field.setAttribute("aria-invalid", "true");
    else field.removeAttribute("aria-invalid");
    return !message;
  }

  function formDirty(form) {
    if (!form || form.dataset.completed === "true") return false;
    return [...form.elements].some(field => {
      if (!field.name || field.type === "hidden" || field.disabled) return false;
      if (field.type === "checkbox" || field.type === "radio") return field.checked;
      return String(field.value || "").trim() !== "";
    });
  }

  function resetValidation(form) {
    if (!form) return;
    form.querySelectorAll("[aria-invalid]").forEach(field => field.removeAttribute("aria-invalid"));
    form.querySelectorAll(".info-form-status.error").forEach(error => {
      if (error.closest(FORM_SELECTOR) === form && error !== form.querySelector(":scope > .info-form-status")) error.remove();
    });
  }

  function guardClose(event) {
    const m = modal();
    if (!m || m.hidden) return;

    const clickedClose = event.type === "click" && event.target?.closest?.(CLOSE_SELECTOR);
    const escapeClose = event.type === "keydown" && event.key === "Escape";
    if (!clickedClose && !escapeClose) return;

    const form = activeForm();
    if (!form || !formDirty(form)) return;

    if (!window.confirm("Има неизпратени данни. Натисни OK, за да затвориш и изчистиш формата, или Отказ, за да останеш.")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    form.reset();
    resetValidation(form);
  }

  function armPostSubmit(form) {
    if (!form || form._popitaiInfoSubmitObserver) return;
    const status = form.querySelector(":scope > .info-form-status");
    if (!status) return;

    const observer = new MutationObserver(() => {
      if (status.classList.contains("error")) {
        observer.disconnect();
        form._popitaiInfoSubmitObserver = null;
        return;
      }
      if (!status.classList.contains("ok")) return;

      observer.disconnect();
      form._popitaiInfoSubmitObserver = null;
      form.dataset.completed = "true";
      form.hidden = true;

      const success = document.createElement("div");
      success.className = "info-form-success";
      success.setAttribute("role", "status");
      success.innerHTML = `<p>${status.textContent}</p><button class="info-btn info-btn--primary" type="button" data-info-success-close>Затвори</button>`;
      form.insertAdjacentElement("afterend", success);
      success.querySelector("[data-info-success-close]")?.addEventListener("click", () => {
        const m = modal();
        if (!m) return;
        m.hidden = true;
        document.body.style.overflow = "";
      });
    });

    form._popitaiInfoSubmitObserver = observer;
    observer.observe(status, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ["class"] });
  }

  document.addEventListener("focusout", event => {
    const field = fieldFromEvent(event);
    if (!field) return;
    field.dataset.touched = "true";
    validateField(field, true);
  }, true);

  document.addEventListener("input", event => {
    const field = fieldFromEvent(event);
    if (!field) return;
    if (field.dataset.touched === "true" || field.getAttribute("aria-invalid") === "true") validateField(field, true);
  }, true);

  document.addEventListener("change", event => {
    const field = fieldFromEvent(event);
    if (!field) return;
    if (field.dataset.touched === "true" || field.getAttribute("aria-invalid") === "true") validateField(field, true);
  }, true);

  document.addEventListener("submit", event => {
    const form = event.target?.closest?.(FORM_SELECTOR);
    if (!form) return;

    const fields = [...form.querySelectorAll("input, textarea, select")].filter(field =>
      field.required || MEANINGFUL_TEXT_FIELDS.has(field.name) || field.maxLength > 0
    );
    let firstInvalid = null;
    fields.forEach(field => {
      field.dataset.touched = "true";
      if (!validateField(field, true) && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
      event.preventDefault();
      event.stopImmediatePropagation();
      firstInvalid.focus();
      return;
    }

    armPostSubmit(form);
  }, true);

  document.addEventListener("click", guardClose, true);
  document.addEventListener("keydown", guardClose, true);
})();