// Попитай.Лом — телефонна валидация за добавяне/редакция на фирма
(() => {
  "use strict";

  const form = document.querySelector("#company-form");
  const phone = document.querySelector("#company-phone");
  if (!form || !phone || form.dataset.businessPhoneValidationReady === "true") return;
  form.dataset.businessPhoneValidationReady = "true";
  form.noValidate = true;

  const errorId = "company-phone-error";
  let error = document.getElementById(errorId);
  if (!error) {
    error = document.createElement("p");
    error.id = errorId;
    error.className = "listing-field-error";
    error.setAttribute("aria-live", "polite");
    phone.insertAdjacentElement("afterend", error);
  }
  phone.setAttribute("aria-describedby", errorId);
  phone.setAttribute("autocomplete", "tel");
  phone.setAttribute("inputmode", "tel");
  phone.setAttribute("maxlength", "20");

  if (!document.getElementById("business-phone-validation-styles")) {
    const style = document.createElement("style");
    style.id = "business-phone-validation-styles";
    style.textContent = `
      #company-phone-error{margin:6px 0 0;color:#b42318;font-size:13px;font-weight:700;line-height:1.4}
      #company-phone-error:empty{display:none}
      #company-phone.is-invalid{border-color:#b42318!important;box-shadow:0 0 0 3px rgba(180,35,24,.12)!important}
      #company-phone.is-valid{border-color:#2e7d32}
    `;
    document.head.appendChild(style);
  }

  function digits(value) {
    return String(value || "").replace(/\D/g, "");
  }

  function validatePhone(value) {
    const text = String(value || "").trim();
    if (!text) return "Въведи телефон за връзка.";
    if (/\p{L}/u.test(text)) return "Телефонът не може да съдържа букви.";
    if (!/^[+\d\s().+-]+$/.test(text)) return "Използвай само цифри, интервали, + или тирета.";
    const number = digits(text);
    if (/^(\d)\1+$/.test(number)) return "Въведи реален телефонен номер.";
    if (text.startsWith("+")) {
      if (!text.startsWith("+359")) return "Международният номер трябва да започва с +359.";
      if (![11, 12].includes(number.length)) return "След +359 трябва да има 8 или 9 цифри.";
      return "";
    }
    if (!number.startsWith("0")) return "Номерът трябва да започва с 0 или +359.";
    if (![9, 10].includes(number.length)) return "Телефонът трябва да е 9 или 10 цифри.";
    return "";
  }

  function formatPhone(value) {
    const raw = String(value || "").trim();
    const number = digits(raw);
    if (raw.startsWith("+359")) {
      const local = number.slice(3);
      if (local.length === 9) return `+359 ${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
      return `+359 ${local}`;
    }
    if (number.length === 10 && number.startsWith("08")) return `${number.slice(0, 4)} ${number.slice(4, 7)} ${number.slice(7)}`;
    if (number.length === 9) return `${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`;
    return raw;
  }

  function update(showSuccess = false) {
    const message = validatePhone(phone.value);
    error.textContent = message;
    phone.classList.toggle("is-invalid", Boolean(message));
    phone.classList.toggle("is-valid", !message && showSuccess && Boolean(phone.value.trim()));
    phone.setAttribute("aria-invalid", String(Boolean(message)));
    return !message;
  }

  phone.addEventListener("blur", () => {
    phone.dataset.touched = "true";
    if (update(true)) phone.value = formatPhone(phone.value);
  });

  phone.addEventListener("input", () => {
    if (phone.dataset.touched === "true" || phone.getAttribute("aria-invalid") === "true") update(false);
  });

  form.addEventListener("submit", (event) => {
    phone.dataset.touched = "true";
    if (update(false)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    phone.focus();
    phone.scrollIntoView({ behavior: "smooth", block: "center" });
  }, true);
})();
