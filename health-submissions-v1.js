(() => {
  "use strict";

  const addForm = document.getElementById("health-service-form");
  const addStatus = document.getElementById("health-add-status");
  const addButton = document.getElementById("health-submit-button");
  const phoneInput = document.getElementById("health-phone");

  const signalButton = document.getElementById("health-signal-submit");
  const signalStatus = document.getElementById("health-signal-status");

  const TYPE_MAP = {
    doctor: { subcategory: "lekari", entryType: "doctor", label: "лекар / медицинска практика" },
    dentist: { subcategory: "stomatolozi", entryType: "dentist", label: "стоматолог / дентална практика" },
    vet: { subcategory: "veterinari", entryType: "vet", label: "ветеринар / кабинет" }
  };

  function setStatus(el, message, type = "") {
    if (!el) return;
    el.className = "health-submit-status" + (type ? ` is-${type}` : "");
    el.innerHTML = message;
  }

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, ch => ({
      "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"
    }[ch]));
  }

  function phoneDigits(value) {
    return String(value || "").replace(/\D/g, "");
  }

  function phoneValidationMessage(value) {
    const normalized = String(value || "").trim();
    if (!normalized) return "";
    if (/\p{L}/u.test(normalized)) return "Телефонът не може да съдържа букви.";
    if (!/^[+\d\s().-]+$/.test(normalized)) return "Използвай само цифри, интервали, +, тирета или скоби.";
    if ((normalized.match(/\+/g) || []).length > 1 || (normalized.includes("+") && !normalized.startsWith("+"))) {
      return "Знакът + може да бъде само веднъж и в началото.";
    }

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

  function ensurePhoneError() {
    if (!phoneInput) return null;
    let error = document.getElementById("health-phone-error");
    if (error) return error;
    error = document.createElement("p");
    error.id = "health-phone-error";
    error.className = "health-form-note";
    error.setAttribute("aria-live", "polite");
    phoneInput.insertAdjacentElement("afterend", error);
    const describedBy = new Set((phoneInput.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean));
    describedBy.add(error.id);
    phoneInput.setAttribute("aria-describedby", [...describedBy].join(" "));
    return error;
  }

  function validatePhone() {
    if (!phoneInput) return true;
    const error = ensurePhoneError();
    const message = phoneValidationMessage(phoneInput.value);
    if (error) {
      error.textContent = message;
      error.style.color = message ? "#b42318" : "";
      error.style.fontWeight = message ? "800" : "";
    }
    phoneInput.setAttribute("aria-invalid", String(Boolean(message)));
    return !message;
  }

  function resetPhoneValidation() {
    if (!phoneInput) return;
    delete phoneInput.dataset.touched;
    phoneInput.removeAttribute("aria-invalid");
    const error = document.getElementById("health-phone-error");
    if (error) error.textContent = "";
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
      setStatus(
        statusEl,
        'За да изпратиш, трябва да си влязъл. <a href="vhod.html">Вход</a>',
        "error"
      );
      return null;
    }

    return user;
  }

  function selectedHealthType() {
    return document.querySelector('input[name="health_type"]:checked')?.value || "doctor";
  }

  phoneInput?.addEventListener("blur", () => {
    phoneInput.dataset.touched = "true";
    validatePhone();
  });
  phoneInput?.addEventListener("input", () => {
    if (phoneInput.dataset.touched === "true" || phoneInput.getAttribute("aria-invalid") === "true") {
      validatePhone();
    }
  });

  addForm?.addEventListener("submit", async event => {
    event.preventDefault();
    setStatus(addStatus, "");

    const name = document.getElementById("health-name")?.value.trim() || "";
    const specialty = document.getElementById("health-specialty")?.value.trim() || "";
    const phone = phoneInput?.value.trim() || "";
    const address = document.getElementById("health-address")?.value.trim() || "";
    const description = document.getElementById("health-description")?.value.trim() || "";
    const selected = TYPE_MAP[selectedHealthType()] || TYPE_MAP.doctor;

    if (!name) {
      setStatus(addStatus, "Попълни име на лекар / практика.", "error");
      document.getElementById("health-name")?.focus();
      return;
    }

    if (!specialty) {
      setStatus(addStatus, "Попълни специалност или основна услуга.", "error");
      document.getElementById("health-specialty")?.focus();
      return;
    }

    if (phone) {
      if (phoneInput) phoneInput.dataset.touched = "true";
      if (!validatePhone()) {
        phoneInput?.focus();
        return;
      }
    }

    if (!phone && !address) {
      setStatus(addStatus, "Добави поне телефон или адрес, за да може записът да бъде проверен.", "error");
      phoneInput?.focus();
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
        data: {
          mode: "add",
          name,
          specialty,
          phone,
          address,
          description,
          submitted_from: "zdrave-i-lekari.html"
        }
      };

      const { error } = await client.from("info_submissions").insert(payload);
      if (error) throw error;

      setStatus(
        addStatus,
        `Изпратено е за одобрение: ${esc(name)}. Ще се публикува само след админ преглед.`,
        "success"
      );

      addForm.reset();
      resetPhoneValidation();
      document.getElementById("health-type-doctor").checked = true;
    } catch (error) {
      console.error("Health submission error:", error);
      setStatus(
        addStatus,
        "Не успяхме да изпратим записа. Провери дали си влязъл и опитай отново.",
        "error"
      );
    } finally {
      if (addButton) addButton.disabled = false;
    }
  });

  signalButton?.addEventListener("click", async () => {
    setStatus(signalStatus, "");

    const entryName = document.getElementById("health-signal-entry")?.value.trim() || "";
    const currentText = document.getElementById("health-signal-current")?.value.trim() || "";
    const correctText = document.getElementById("health-signal-correct")?.value.trim() || "";
    const source = document.getElementById("health-signal-source")?.value.trim() || "";

    if (!entryName) {
      setStatus(signalStatus, "Посочи за кой запис е сигналът.", "error");
      document.getElementById("health-signal-entry")?.focus();
      return;
    }

    if (!currentText) {
      setStatus(signalStatus, "Напиши какво е показано сега.", "error");
      document.getElementById("health-signal-current")?.focus();
      return;
    }

    if (!correctText) {
      setStatus(signalStatus, "Напиши какво трябва да бъде.", "error");
      document.getElementById("health-signal-correct")?.focus();
      return;
    }

    if (!source) {
      setStatus(signalStatus, "Добави източник или линк, откъдето информацията може да се провери.", "error");
      document.getElementById("health-signal-source")?.focus();
      return;
    }

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

      setStatus(
        signalStatus,
        "Сигналът е изпратен за админ преглед. Публичните данни не са променени.",
        "success"
      );

      ["health-signal-entry","health-signal-current","health-signal-correct","health-signal-source"]
        .forEach(id => {
          const field = document.getElementById(id);
          if (field) field.value = "";
        });
    } catch (error) {
      console.error("Health error report error:", error);
      setStatus(
        signalStatus,
        "Не успяхме да изпратим сигнала. Провери дали си влязъл и опитай отново.",
        "error"
      );
    } finally {
      signalButton.disabled = false;
    }
  });
})();