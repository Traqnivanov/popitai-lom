(() => {
  "use strict";

  const MIN_PASSWORD_LENGTH = 8;
  const passwordConfigs = [
    { form: "#register-form", password: "#register-password", confirm: "#register-password-confirm" },
    { form: "#new-password-form", password: "#reset-password", confirm: "#reset-password-confirm" },
    { form: "#change-password-form", password: "#new-password", confirm: "#new-password-confirm" }
  ];

  function ensureError(input, suffix = "error") {
    if (!input?.id) return null;
    const id = `${input.id}-${suffix}`;
    let error = document.getElementById(id);
    if (!error) {
      error = document.createElement("p");
      error.id = id;
      error.className = "form-message auth-field-error";
      error.setAttribute("aria-live", "polite");
      const wrap = input.closest(".password-wrap");
      const checkRow = input.closest(".check-row");
      (wrap || checkRow || input).insertAdjacentElement("afterend", error);
    }

    const ids = new Set((input.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean));
    ids.add(id);
    input.setAttribute("aria-describedby", [...ids].join(" "));
    return error;
  }

  function setFieldError(input, error, message) {
    if (error) {
      error.textContent = message;
      error.style.color = message ? "#b42318" : "";
      error.style.fontWeight = message ? "700" : "";
    }
    if (message) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
    return !message;
  }

  function wireField(input, validate) {
    if (!input) return;
    const eventName = input.type === "checkbox" || input.tagName === "SELECT" ? "change" : "input";
    input.addEventListener("blur", () => {
      input.dataset.touched = "true";
      validate(false);
    });
    input.addEventListener(eventName, () => {
      if (input.dataset.touched === "true" || input.getAttribute("aria-invalid") === "true") validate(false);
    });
  }

  function setupEmail(formSelector, inputSelector) {
    const form = document.querySelector(formSelector);
    const input = document.querySelector(inputSelector);
    if (!form || !input) return;
    const error = ensureError(input);

    const validate = (showRequired = false) => {
      const value = String(input.value || "").trim();
      let message = "";
      if (!value && showRequired) message = "Въведи електронна поща.";
      else if (value && input.validity.typeMismatch) message = "Въведи валиден e-mail адрес.";
      return setFieldError(input, error, message);
    };

    wireField(input, validate);
    form.addEventListener("submit", event => {
      input.dataset.touched = "true";
      if (validate(true)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      input.focus();
    }, true);
  }

  function setupRequiredText(formSelector, inputSelector, requiredMessage, minLength = 0, minMessage = "") {
    const form = document.querySelector(formSelector);
    const input = document.querySelector(inputSelector);
    if (!form || !input) return;
    const error = ensureError(input);

    const validate = (showRequired = false) => {
      const value = String(input.value || "").trim();
      let message = "";
      if (!value && showRequired) message = requiredMessage;
      else if (value && minLength && value.length < minLength) message = minMessage;
      return setFieldError(input, error, message);
    };

    wireField(input, validate);
    form.addEventListener("submit", event => {
      input.dataset.touched = "true";
      if (validate(true)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      input.focus();
    }, true);
  }

  function setupConsent(formSelector) {
    const form = document.querySelector(formSelector);
    const consent = form?.querySelector('.check-row input[type="checkbox"]');
    if (!form || !consent) return;
    if (!consent.id) consent.id = "register-consent";
    const error = ensureError(consent);

    const validate = () => setFieldError(
      consent,
      error,
      consent.checked ? "" : "Приеми условията и политиката за поверителност, за да създадеш профил."
    );

    consent.addEventListener("change", () => {
      if (consent.dataset.touched === "true" || consent.getAttribute("aria-invalid") === "true") validate();
    });
    form.addEventListener("submit", event => {
      consent.dataset.touched = "true";
      if (validate()) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      consent.focus();
    }, true);
  }

  function setupPasswordPair(config) {
    const form = document.querySelector(config.form);
    const password = document.querySelector(config.password);
    const confirm = document.querySelector(config.confirm);
    if (!form || !password || !confirm) return;

    const passwordError = ensureError(password);
    const confirmError = ensureError(confirm);
    let pendingInvalidFocus = null;

    function validatePassword(showRequired = false) {
      const value = password.value;
      let message = "";
      if (!value && showRequired) message = "Въведи парола.";
      else if (value && value.length < MIN_PASSWORD_LENGTH) {
        message = `Паролата трябва да съдържа поне ${MIN_PASSWORD_LENGTH} знака.`;
      }
      return setFieldError(password, passwordError, message);
    }

    function validateConfirm(showRequired = false) {
      const value = confirm.value;
      let message = "";
      if (!value && showRequired) message = "Повтори паролата.";
      else if (value && value !== password.value) message = "Паролите не съвпадат.";
      return setFieldError(confirm, confirmError, message);
    }

    password.addEventListener("blur", () => {
      if (!password.value) return;
      password.dataset.touched = "true";
      validatePassword(false);
      if (confirm.value) validateConfirm(false);
    });

    confirm.addEventListener("blur", () => {
      if (!confirm.value) return;
      confirm.dataset.touched = "true";
      validateConfirm(false);
    });

    password.addEventListener("input", () => {
      if (password.dataset.touched === "true" || password.getAttribute("aria-invalid") === "true") {
        validatePassword(false);
      }
      if (confirm.dataset.touched === "true" || confirm.getAttribute("aria-invalid") === "true") {
        validateConfirm(false);
      }
    });

    confirm.addEventListener("input", () => {
      if (confirm.dataset.touched === "true" || confirm.getAttribute("aria-invalid") === "true") {
        validateConfirm(false);
      }
    });

    [password, confirm].forEach(input => input.addEventListener("invalid", event => {
      event.preventDefault();
      input.dataset.touched = "true";
      if (input === password) validatePassword(true);
      else validateConfirm(true);
      if (!pendingInvalidFocus) {
        pendingInvalidFocus = input;
        requestAnimationFrame(() => {
          pendingInvalidFocus?.focus();
          pendingInvalidFocus = null;
        });
      }
    }));

    form.addEventListener("submit", event => {
      password.dataset.touched = "true";
      confirm.dataset.touched = "true";
      const passwordOk = validatePassword(true);
      const confirmOk = validateConfirm(true);
      if (passwordOk && confirmOk) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      (passwordOk ? confirm : password).focus();
    }, true);
  }

  setupEmail("#login-form", "#login-email");
  setupRequiredText("#login-form", "#login-password", "Въведи парола.");

  setupRequiredText(
    "#register-form",
    "#register-name",
    "Въведи име.",
    2,
    "Името трябва да съдържа поне 2 знака."
  );
  setupEmail("#register-form", "#register-email");
  setupConsent("#register-form");

  setupEmail("#forgot-password-form", "#forgot-email");

  passwordConfigs.forEach(setupPasswordPair);
})();
