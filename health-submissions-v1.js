(() => {
  "use strict";

  const addForm = document.getElementById("health-service-form");
  const addStatus = document.getElementById("health-add-status");
  const addButton = document.getElementById("health-submit-button");
  const phoneInput = document.getElementById("health-phone");
  const addPanel = document.getElementById("health-pro-panel");

  const signalButton = document.getElementById("health-signal-submit");
  const signalStatus = document.getElementById("health-signal-status");
  const signalPanel = document.getElementById("health-signal-panel");

  const TYPE_MAP = {
    doctor: { subcategory: "lekari", entryType: "doctor", label: "лекар / медицинска практика" },
    dentist: { subcategory: "stomatolozi", entryType: "dentist", label: "стоматолог / дентална практика" },
    vet: { subcategory: "veterinari", entryType: "vet", label: "ветеринар / кабинет" }
  };

  const addFields = {
    name: document.getElementById("health-name"),
    specialty: document.getElementById("health-specialty"),
    phone: phoneInput,
    address: document.getElementById("health-address"),
    description: document.getElementById("health-description")
  };

  const signalFields = {
    entry: document.getElementById("health-signal-entry"),
    current: document.getElementById("health-signal-current"),
    correct: document.getElementById("health-signal-correct"),
    source: document.getElementById("health-signal-source")
  };

  function setStatus(el, message, type = "") {
    if (!el) return;
    el.className = "health-submit-status" + (type ? ` is-${type}` : "");
    el.textContent = message;
  }

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, ch => ({
      "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"
    }[ch]));
  }

  function usefulText(value, minWords = 2) {
    const text = String(value || "").replace(/\s+/g, " ").trim();
    const words = text.match(/[\p{L}\p{N}]+/gu) || [];
    const letters = [...text.toLocaleLowerCase("bg-BG")].filter(ch => /\p{L}/u.test(ch));
    if (words.length < minWords || new Set(letters).size < 4) return false;
    if (words.length === 2 && words[0].toLocaleLowerCase("bg-BG") === words[1].toLocaleLowerCase("bg-BG")) return false;
    return true;
  }

  function sensibleShortText(value, minLetters = 3) {
    const letters = [...String(value || "")].filter(ch => /\p{L}/u.test(ch));
    return letters.length >= minLetters && new Set(letters.map(ch => ch.toLocaleLowerCase("bg-BG"))).size >= Math.min(3, minLetters);
  }

  function validHttpUrl(value) {
    try {
      const url = new URL(String(value || "").trim());
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }

  function phoneDigits(value) {
    return String(value || "").replace(/\D/g, "");
  }

  function phoneValidationMessage(value) {
    const normalized = String(value || "").trim();
    if (!normalized) return "";
    if (/\p{L}/u.test(normalized)) return "Телефонът не може да съдържа букви.";
    if (!/^[+\d\s().-]+$/.test(normalized)) return "Използвай само цифри, интервали, +, тирета или скоби.";
    if ((normalized.match(/\+/g) || []).length > 1 || (normalized.includes("+") && !normalized.startsWith("+"))) return "Знакът + може да бъде само веднъж и в началото.";

    const digits = phoneDigits(normalized);
    if (/^(\d)\1+$/.test(digits)) return "Въведи реален телефонен номер.";
    if (normalized.startsWith("+")) {
      if (!normalized.startsWith("+359")) return "Международният български номер трябва да започва с +359.";
      if (![11, 12].includes(digits.length)) return "След +359 трябва да има 8 или 9 цифри.";
      if (digits.charAt(3) === "0") return "След +359 не се изписва началната нула.";
      return "";
    }
    if (!digits.startsWith("0")) return "Българският номер трябва да започва с 0 или +359.";
    if (![9, 10].includes(digits.length)) return "Телефонът трябва да съдържа общо 9 или 10 цифри.";
    return "";
  }

  function ensureError(field) {
    if (!field?.id) return null;
    const id = `${field.id}-error`;
    let error = document.getElementById(id);
    if (!error) {
      error = document.createElement("p");
      error.id = id;
      error.className = "health-form-note";
      error.setAttribute("aria-live", "polite");
      field.insertAdjacentElement("afterend", error);
    }
    const describedBy = new Set((field.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean));
    describedBy.add(id);
    field.setAttribute("aria-describedby", [...describedBy].join(" "));
    return error;
  }

  function setFieldError(field, message) {
    if (!field) return !message;
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

  function addValidationMessage(key) {
    const field = addFields[key];
    const value = String(field?.value || "").trim();
    if (key === "name") {
      if (!value) return "Попълни име на лекар / практика.";
      if (!sensibleShortText(value, 2)) return "Въведи разбираемо име на лекар или практика.";
    }
    if (key === "specialty") {
      if (!value) return "Попълни специалност или основна услуга.";
      if (!sensibleShortText(value, 3)) return "Въведи разбираема специалност или услуга.";
    }
    if (key === "phone") return phoneValidationMessage(value);
    if (key === "address" && value && !sensibleShortText(value, 3)) return "Въведи разбираем адрес в Лом.";
    if (key === "description" && value && !usefulText(value)) return "Опиши с няколко думи полезната информация за практиката.";
    return "";
  }

  function signalValidationMessage(key) {
    const value = String(signalFields[key]?.value || "").trim();
    if (key === "entry") {
      if (!value) return "Посочи за кой запис е сигналът.";
      if (!sensibleShortText(value, 2)) return "Въведи разбираемо име на лекар или практика.";
    }
    if (key === "current") {
      if (!value) return "Напиши какво е показано сега.";
      if (!usefulText(value)) return "Опиши с няколко думи каква информация е грешна.";
    }
    if (key === "correct") {
      if (!value) return "Напиши какво трябва да бъде.";
      if (!usefulText(value)) return "Опиши с няколко думи правилната информация.";
    }
    if (key === "source") {
      if (!value) return "Добави линк към източник, откъдето информацията може да се провери.";
      if (!validHttpUrl(value)) return "Въведи пълен линк, започващ с http:// или https://.";
    }
    return "";
  }

  function wireValidation(fields, messageFor) {
    Object.entries(fields).forEach(([key, field]) => {
      if (!field) return;
      const validate = () => setFieldError(field, messageFor(key));
      field.addEventListener("blur", () => {
        field.dataset.touched = "true";
        validate();
      });
      field.addEventListener("input", () => {
        if (field.dataset.touched === "true" || field.getAttribute("aria-invalid") === "true") validate();
      });
    });
  }

  function validateGroup(fields, messageFor) {
    let firstInvalid = null;
    Object.entries(fields).forEach(([key, field]) => {
      if (!field) return;
      field.dataset.touched = "true";
      if (!setFieldError(field, messageFor(key)) && !firstInvalid) firstInvalid = field;
    });
    return firstInvalid;
  }

  function resetValidation(fields) {
    Object.values(fields).forEach(field => {
      if (!field) return;
      delete field.dataset.touched;
      field.removeAttribute("aria-invalid");
      const error = document.getElementById(`${field.id}-error`);
      if (error) error.textContent = "";
    });
  }

  function selectedHealthType() {
    return document.querySelector('input[name="health_type"]:checked')?.value || "doctor";
  }

  function hasAddUnsentData() {
    return Object.values(addFields).some(field => String(field?.value || "").trim()) || selectedHealthType() !== "doctor";
  }

  function hasSignalUnsentData() {
    return Object.values(signalFields).some(field => String(field?.value || "").trim());
  }

  function resetAddForm() {
    addForm?.reset();
    resetValidation(addFields);
    const doctor = document.getElementById("health-type-doctor");
    if (doctor) doctor.checked = true;
  }

  function resetSignalFields() {
    Object.values(signalFields).forEach(field => { if (field) field.value = ""; });
    resetValidation(signalFields);
  }

  function closePanel(panel) {
    if (!panel) return;
    panel.hidden = true;
    if ((addPanel?.hidden ?? true) && (signalPanel?.hidden ?? true)) document.body.classList.remove("health-modal-open");
  }

  function showSuccess(panel, statusEl, message, closeLabel) {
    if (!panel || !statusEl) return;
    panel.dataset.completed = "true";
    const card = statusEl.closest(".health-modal-card");
    card?.querySelectorAll("form, .health-form-grid, .health-form-note, .health-form-actions, .health-type-grid").forEach(el => {
      if (!el.contains(statusEl)) el.hidden = true;
    });
    statusEl.hidden = false;
    setStatus(statusEl, message, "success");
    let successButton = card?.querySelector("[data-health-success-close]");
    if (!successButton && card) {
      successButton = document.createElement("button");
      successButton.type = "button";
      successButton.className = "health-form-close";
      successButton.dataset.healthSuccessClose = "1";
      successButton.textContent = closeLabel;
      statusEl.insertAdjacentElement("afterend", successButton);
      successButton.addEventListener("click", () => closePanel(panel));
    }
  }

  function restorePanel(panel) {
    if (!panel) return;
    delete panel.dataset.completed;
    const card = panel.querySelector(".health-modal-card");
    card?.querySelectorAll("form, .health-form-grid, .health-form-note, .health-form-actions, .health-type-grid").forEach(el => { el.hidden = false; });
    card?.querySelector("[data-health-success-close]")?.remove();
  }

  async function waitClient() {
    if (window.PopitaiSupabase) return window.PopitaiSupabase;
    return new Promise((resolve, reject) => {
      let tries = 0;
      const timer = setInterval(() => {
        tries += 1;
        if (window.PopitaiSupabase) {
          clearInterval(timer);
          resolve(window.PopitaiSupabase);
        } else if (tries > 120) {
          clearInterval(timer);
          reject(new Error("Supabase client timeout"));
        }
      }, 50);
    });
  }

  async function getAuthenticatedUser(client, statusEl) {
    const { data, error } = await client.auth.getUser();
    if (error) throw error;
    const user = data?.user || null;
    if (!user) {
      if (statusEl) {
        statusEl.className = "health-submit-status is-error";
        statusEl.innerHTML = 'За да изпратиш, трябва да си влязъл. <a href="vhod.html">Вход</a>';
      }
      return null;
    }
    return user;
  }

  wireValidation(addFields, addValidationMessage);
  wireValidation(signalFields, signalValidationMessage);

  addForm?.addEventListener("submit", async event => {
    event.preventDefault();
    setStatus(addStatus, "");

    const firstInvalid = validateGroup(addFields, addValidationMessage);
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    const name = addFields.name?.value.trim() || "";
    const specialty = addFields.specialty?.value.trim() || "";
    const phone = addFields.phone?.value.trim() || "";
    const address = addFields.address?.value.trim() || "";
    const description = addFields.description?.value.trim() || "";
    const selected = TYPE_MAP[selectedHealthType()] || TYPE_MAP.doctor;

    if (!phone && !address) {
      setFieldError(addFields.phone, "Добави поне телефон или адрес, за да може записът да бъде проверен.");
      addFields.phone?.focus();
      return;
    }

    if (addButton) addButton.disabled = true;
    try {
      const client = await waitClient();
      const user = await getAuthenticatedUser(client, addStatus);
      if (!user) return;

      const payload = {
        category: "zdrave",
        subcategory: selected.subcategory,
        entry_type: selected.entryType,
        submitted_by: user.id,
        status: "pending",
        data: { mode: "add", name, specialty, phone, address, description, submitted_from: "zdrave-i-lekari.html" }
      };

      const { error } = await client.from("info_submissions").insert(payload);
      if (error) throw error;

      resetAddForm();
      showSuccess(addPanel, addStatus, `Изпратено е за одобрение: ${name}. Ще се публикува само след админ преглед.`, "Затвори");
    } catch (error) {
      console.error("Health submission error:", error);
      setStatus(addStatus, "Не успяхме да изпратим записа. Провери дали си влязъл и опитай отново.", "error");
    } finally {
      if (addButton) addButton.disabled = false;
    }
  });

  signalButton?.addEventListener("click", async () => {
    setStatus(signalStatus, "");
    const firstInvalid = validateGroup(signalFields, signalValidationMessage);
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    const entryName = signalFields.entry?.value.trim() || "";
    const currentText = signalFields.current?.value.trim() || "";
    const correctText = signalFields.correct?.value.trim() || "";
    const source = signalFields.source?.value.trim() || "";

    signalButton.disabled = true;
    try {
      const client = await waitClient();
      const user = await getAuthenticatedUser(client, signalStatus);
      if (!user) return;

      let entryId = null;
      let subcategory = "obshto";
      const { data: matches, error: lookupError } = await client
        .from("info_entries")
        .select("id,subcategory,name")
        .eq("category", "zdrave")
        .eq("publication_status", "published")
        .ilike("name", entryName)
        .limit(2);

      if (!lookupError && Array.isArray(matches) && matches.length === 1) {
        entryId = matches[0].id;
        subcategory = matches[0].subcategory || "obshto";
      }

      const description = [
        `Запис: ${entryName}`,
        `Написано сега: ${currentText}`,
        `Трябва да бъде: ${correctText}`,
        `Източник: ${source}`,
        "Подадено от: Категории → Здраве и лекари"
      ].join("\n");

      const { error } = await client.from("info_error_reports").insert({
        entry_id: entryId,
        reported_by: user.id,
        category: "zdrave",
        subcategory,
        description,
        status: "pending"
      });
      if (error) throw error;

      resetSignalFields();
      showSuccess(signalPanel, signalStatus, "Сигналът е изпратен за админ преглед. Публичните данни не са променени.", "Затвори");
    } catch (error) {
      console.error("Health error report error:", error);
      setStatus(signalStatus, "Не успяхме да изпратим сигнала. Провери дали си влязъл и опитай отново.", "error");
    } finally {
      signalButton.disabled = false;
    }
  });

  document.addEventListener("click", event => {
    const target = event.target;
    const addClose = target?.closest?.("[data-health-close-add], #health-close-button") || target === addPanel;
    const signalClose = target?.closest?.("[data-health-close-signal]") || target === signalPanel;
    const panel = addClose ? addPanel : signalClose ? signalPanel : null;
    if (!panel || panel.hidden || panel.dataset.completed === "true") return;
    const dirty = panel === addPanel ? hasAddUnsentData() : hasSignalUnsentData();
    if (!dirty) return;
    if (window.confirm("Има неизпратени данни. Натисни OK, за да затвориш и изчистиш формата, или Отказ, за да останеш.")) {
      if (panel === addPanel) resetAddForm(); else resetSignalFields();
      return;
    }
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);

  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    const panel = addPanel && !addPanel.hidden ? addPanel : signalPanel && !signalPanel.hidden ? signalPanel : null;
    if (!panel || panel.dataset.completed === "true") return;
    const dirty = panel === addPanel ? hasAddUnsentData() : hasSignalUnsentData();
    if (!dirty) return;
    if (window.confirm("Има неизпратени данни. Натисни OK, за да затвориш и изчистиш формата, или Отказ, за да останеш.")) {
      if (panel === addPanel) resetAddForm(); else resetSignalFields();
      return;
    }
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);

  document.querySelectorAll(".health-hero-add, .health-pro-toggle").forEach(button => button.addEventListener("click", () => restorePanel(addPanel)));
  document.querySelectorAll(".health-signal-toggle").forEach(button => button.addEventListener("click", () => restorePanel(signalPanel)));
})();