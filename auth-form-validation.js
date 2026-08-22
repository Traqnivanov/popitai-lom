(() => {
  "use strict";

  const MIN_PASSWORD_LENGTH = 8;
  const configs = [
    { form: "#register-form", password: "#register-password", confirm: "#register-password-confirm" },
    { form: "#new-password-form", password: "#reset-password", confirm: "#reset-password-confirm" },
    { form: "#change-password-form", password: "#new-password", confirm: "#new-password-confirm" }
  ];

  function ensureError(input, suffix) {
    if (!input) return null;
    const id = `${input.id}-${suffix}`;
    let error = document.getElementById(id);
    if (!error) {
      error = document.createElement("p");
      error.id = id;
      error.className = "form-message auth-field-error";
      error.setAttribute("aria-live", "polite");
      const wrap = input.closest(".password-wrap");
      (wrap || input).insertAdjacentElement("afterend", error);
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

  function setup(config) {
    const form = document.querySelector(config.form);
    const password = document.querySelector(config.password);
    const confirm = document.querySelector(config.confirm);
    if (!form || !password || !confirm) return;

    const passwordError = ensureError(password, "error");
    const confirmError = ensureError(confirm, "error");
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

  configs.forEach(setup);
})();
