(() => {
  "use strict";

  function ensureError(field) {
    if (!field?.id) return null;
    const id = `${field.id}-error`;
    let error = document.getElementById(id);
    if (!error) {
      error = document.createElement("p");
      error.id = id;
      error.className = "form-message field-error";
      error.setAttribute("aria-live", "polite");
      field.insertAdjacentElement("afterend", error);
    }
    const ids = new Set((field.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean));
    ids.add(id);
    field.setAttribute("aria-describedby", [...ids].join(" "));
    return error;
  }

  function setError(field, message) {
    const error = ensureError(field);
    if (error) {
      error.textContent = message || "";
      error.style.color = message ? "#b42318" : "";
      error.style.fontWeight = message ? "700" : "";
    }
    if (message) field.setAttribute("aria-invalid", "true");
    else field.removeAttribute("aria-invalid");
    return !message;
  }

  function textRule(field, min, max, label, required = true) {
    const value = String(field?.value || "").trim();
    if (!value) return required ? `Попълни ${label}.` : "";
    if (value.length < min) return `${label[0].toUpperCase()}${label.slice(1)} трябва да е поне ${min} знака.`;
    if (value.length > max) return `${label[0].toUpperCase()}${label.slice(1)} може да е най-много ${max} знака.`;
    return "";
  }

  function wireField(field, validate) {
    if (!field) return;
    field.addEventListener("blur", () => {
      field.dataset.touched = "true";
      setError(field, validate());
    });
    const liveEvent = field.tagName === "SELECT" ? "change" : "input";
    field.addEventListener(liveEvent, () => {
      if (field.dataset.touched === "true" || field.getAttribute("aria-invalid") === "true") {
        setError(field, validate());
      }
    });
  }

  function setupQuestionForm() {
    const form = document.getElementById("new-question-form");
    if (!form) return;
    const title = document.getElementById("question-title");
    const category = document.getElementById("question-category");
    const description = document.getElementById("question-description");

    const validators = [
      [title, () => textRule(title, 10, 120, "заглавие")],
      [category, () => category?.value ? "" : "Избери категория."],
      [description, () => textRule(description, 20, 5000, "описание")]
    ];

    validators.forEach(([field, validate]) => wireField(field, validate));

    form.addEventListener("submit", event => {
      let firstInvalid = null;
      validators.forEach(([field, validate]) => {
        if (!field) return;
        field.dataset.touched = "true";
        if (!setError(field, validate()) && !firstInvalid) firstInvalid = field;
      });
      if (firstInvalid) {
        event.preventDefault();
        event.stopImmediatePropagation();
        firstInvalid.focus();
      }
    }, true);
  }

  function setupAnswerForm() {
    const form = document.getElementById("answer-form");
    const answer = document.getElementById("answer-text");
    if (!form || !answer) return;

    const validate = () => textRule(answer, 3, 5000, "отговор");
    wireField(answer, validate);

    form.addEventListener("submit", event => {
      answer.dataset.touched = "true";
      if (!setError(answer, validate())) {
        event.preventDefault();
        event.stopImmediatePropagation();
        answer.focus();
      }
    }, true);
  }

  setupQuestionForm();
  setupAnswerForm();
})();
