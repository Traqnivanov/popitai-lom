// Попитай.Лом — ненатрапчива проверка в точния момент
(() => {
  "use strict";

  const phone = document.querySelector("#company-phone");
  if (!phone || phone.dataset.liveValidationReady === "true") return;
  phone.dataset.liveValidationReady = "true";

  function getErrorElement() {
    let error = document.querySelector("#company-phone-error");
    if (error) return error;

    error = document.createElement("p");
    error.id = "company-phone-error";
    error.className = "business-field-error";
    error.setAttribute("aria-live", "polite");
    phone.insertAdjacentElement("afterend", error);

    const describedBy = new Set((phone.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean));
    describedBy.add(error.id);
    phone.setAttribute("aria-describedby", Array.from(describedBy).join(" "));
    return error;
  }

  function immediatePhoneError(value) {
    const raw = String(value || "");
    if (!raw) return "";

    if (/\p{L}/u.test(raw)) {
      return "Телефонът не може да съдържа букви.";
    }

    if (!/^[+\d\s().-]*$/.test(raw)) {
      return "Използвай само цифри, интервали, +, тирета или скоби.";
    }

    const plusCount = (raw.match(/\+/g) || []).length;
    if (plusCount > 1 || (raw.includes("+") && !raw.trimStart().startsWith("+"))) {
      return "Знакът + може да бъде само веднъж и в началото.";
    }

    const compact = raw.replace(/[\s().-]/g, "");
    if (compact.startsWith("+")) {
      const typedPrefix = compact.slice(1, 4);
      if (typedPrefix && !"359".startsWith(typedPrefix)) {
        return "Българският международен номер започва с +359.";
      }
    }

    const digitCount = (raw.match(/\d/g) || []).length;
    if (digitCount > 12) {
      return "Телефонният номер е прекалено дълъг.";
    }

    return "";
  }

  function showImmediateError(message) {
    const error = getErrorElement();
    error.textContent = message;
    phone.classList.add("is-invalid");
    phone.classList.remove("is-valid");
    phone.setAttribute("aria-invalid", "true");
    phone.dataset.liveImmediateError = "true";
  }

  function clearImmediateError() {
    if (phone.dataset.liveImmediateError !== "true") return;
    const error = getErrorElement();
    error.textContent = "";
    phone.classList.remove("is-invalid", "is-valid");
    phone.setAttribute("aria-invalid", "false");
    delete phone.dataset.liveImmediateError;
  }

  phone.addEventListener("input", (event) => {
    if (event.isComposing) return;

    queueMicrotask(() => {
      // След излизане от полето основната проверка вече следи пълния формат.
      if (phone.dataset.touched === "true") return;

      const message = immediatePhoneError(phone.value);
      if (message) showImmediateError(message);
      else clearImmediateError();
    });
  }, true);
})();
