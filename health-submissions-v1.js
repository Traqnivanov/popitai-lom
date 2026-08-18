(() => {
  "use strict";

  const addForm = document.getElementById("health-service-form");
  const addStatus = document.getElementById("health-add-status");
  const addButton = document.getElementById("health-submit-button");

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

  addForm?.addEventListener("submit", async event => {
    event.preventDefault();
    setStatus(addStatus, "");

    const name = document.getElementById("health-name")?.value.trim() || "";
    const specialty = document.getElementById("health-specialty")?.value.trim() || "";
    const phone = document.getElementById("health-phone")?.value.trim() || "";
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

    if (!phone && !address) {
      setStatus(addStatus, "Добави поне телефон или адрес, за да може записът да бъде проверен.", "error");
      document.getElementById("health-phone")?.focus();
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