(() => {
  "use strict";

  const form = document.getElementById("addForm");
  if (!form) return;
  form.noValidate = true;

  const fields = {
    name: document.getElementById("shopName"),
    category: document.getElementById("shopCategory"),
    address: document.getElementById("shopAddress"),
    offer: document.getElementById("shopOffer"),
    source: document.getElementById("shopSource")
  };

  function usefulText(value, minWords = 2) {
    const text = String(value || "").replace(/\s+/g, " ").trim();
    const words = text.match(/[\p{L}\p{N}]+/gu) || [];
    const letters = [...text.toLocaleLowerCase("bg-BG")].filter(ch => /\p{L}/u.test(ch));
    if (words.length < minWords) return false;
    if (new Set(letters).size < 3) return false;
    if (words.length === 2 && words[0].toLocaleLowerCase("bg-BG") === words[1].toLocaleLowerCase("bg-BG")) return false;
    return true;
  }

  function sensibleName(value) {
    const text = String(value || "").trim();
    const letters = [...text].filter(ch => /\p{L}/u.test(ch));
    return letters.length >= 2 && new Set(letters.map(ch => ch.toLocaleLowerCase("bg-BG"))).size >= 2;
  }

  function sensibleAddress(value) {
    const text = String(value || "").trim();
    if (text.length < 3) return false;
    const letters = [...text].filter(ch => /\p{L}/u.test(ch));
    return letters.length >= 2 && new Set(letters.map(ch => ch.toLocaleLowerCase("bg-BG"))).size >= 2;
  }

  function ensureError(field) {
    if (!field?.id) return null;
    const id = `${field.id}Error`;
    let error = document.getElementById(id);
    if (!error) {
      error = document.createElement("p");
      error.id = id;
      error.className = "help";
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
      error.style.fontWeight = message ? "800" : "";
    }
    if (message) field.setAttribute("aria-invalid", "true");
    else field.removeAttribute("aria-invalid");
    return !message;
  }

  function validateName() {
    const value = String(fields.name?.value || "").trim();
    if (!value) return "Въведи име на магазина.";
    if (value.length < 2) return "Името на магазина трябва да е поне 2 знака.";
    if (value.length > 120) return "Името на магазина може да е най-много 120 знака.";
    if (!sensibleName(value)) return "Въведи разбираемо име на магазина.";
    return "";
  }

  function validateCategory() {
    return fields.category?.value ? "" : "Избери категория на магазина.";
  }

  function validateAddress() {
    const value = String(fields.address?.value || "").trim();
    if (!value) return "Въведи адрес на магазина в Лом.";
    if (value.length < 3) return "Добави по-точен адрес на магазина.";
    if (value.length > 200) return "Адресът може да е най-много 200 знака.";
    if (!sensibleAddress(value)) return "Въведи разбираем адрес на магазина.";
    return "";
  }

  function validateOffer() {
    const value = String(fields.offer?.value || "").trim();
    if (!value) return "Опиши накратко какво предлага магазинът.";
    if (value.length < 3) return "Добави малко повече информация какво предлага магазинът.";
    if (value.length > 500) return "Описанието може да е най-много 500 знака.";
    if (!usefulText(value, 2)) return "Опиши с няколко думи какво реално предлага магазинът.";
    return "";
  }

  function validateSource() {
    return fields.source?.value ? "" : "Избери откъде е информацията за магазина.";
  }

  const validators = [
    [fields.name, validateName],
    [fields.category, validateCategory],
    [fields.address, validateAddress],
    [fields.offer, validateOffer],
    [fields.source, validateSource]
  ];

  validators.forEach(([field, validate]) => {
    if (!field) return;
    const eventName = field.tagName === "SELECT" ? "change" : "input";
    field.addEventListener("blur", () => {
      field.dataset.touched = "true";
      setError(field, validate());
    });
    field.addEventListener(eventName, () => {
      if (field.dataset.touched === "true" || field.getAttribute("aria-invalid") === "true") {
        setError(field, validate());
      }
    });
  });

  function clearValidation() {
    validators.forEach(([field]) => {
      if (!field) return;
      delete field.dataset.touched;
      field.removeAttribute("aria-invalid");
      const error = document.getElementById(`${field.id}Error`);
      if (error) error.textContent = "";
    });
  }

  form.addEventListener("reset", () => requestAnimationFrame(clearValidation));

  form.addEventListener("submit", event => {
    let firstInvalid = null;
    validators.forEach(([field, validate]) => {
      if (!field) return;
      field.dataset.touched = "true";
      if (!setError(field, validate()) && !firstInvalid) firstInvalid = field;
    });

    if (!firstInvalid) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    firstInvalid.focus();
  }, true);
})();
