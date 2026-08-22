(() => {
  "use strict";

  const MODAL_SELECTOR = "#info-modal";
  const FORM_SELECTOR = "#info-submit-form, #info-error-form";
  const CLOSE_SELECTOR = "[data-modal-close]";
  const REQUIRED_SELECTOR = `${FORM_SELECTOR} [required]`;

  function modal() {
    return document.querySelector(MODAL_SELECTOR);
  }

  function activeForm() {
    return modal()?.querySelector(FORM_SELECTOR) || null;
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

  function validateField(field, showRequired = false) {
    if (!field?.matches("[required]")) return true;
    const value = String(field.value || "").trim();
    const message = !value && showRequired ? `Попълни „${fieldLabel(field)}“.` : "";
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
    const field = event.target?.closest?.(REQUIRED_SELECTOR);
    if (!field) return;
    field.dataset.touched = "true";
    validateField(field, true);
  }, true);

  document.addEventListener("input", event => {
    const field = event.target?.closest?.(REQUIRED_SELECTOR);
    if (!field) return;
    if (field.dataset.touched === "true" || field.getAttribute("aria-invalid") === "true") validateField(field, true);
  }, true);

  document.addEventListener("change", event => {
    const field = event.target?.closest?.(REQUIRED_SELECTOR);
    if (!field) return;
    if (field.dataset.touched === "true" || field.getAttribute("aria-invalid") === "true") validateField(field, true);
  }, true);

  document.addEventListener("submit", event => {
    const form = event.target?.closest?.(FORM_SELECTOR);
    if (!form) return;

    const required = [...form.querySelectorAll("[required]")];
    let firstInvalid = null;
    required.forEach(field => {
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
