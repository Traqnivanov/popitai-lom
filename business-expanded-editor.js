// Попитай.Лом — редактор за първия пакет на разширения фирмен профил
(() => {
  "use strict";

  const businessId = new URLSearchParams(window.location.search).get("id");
  const client = window.PopitaiSupabase;
  const form = document.querySelector("#expanded-profile-form");
  const state = document.querySelector("#expanded-editor-state");
  const note = document.querySelector("#expanded-editor-note");
  const businessName = document.querySelector("#expanded-editor-business-name");
  const submitButton = document.querySelector("#expanded-editor-submit");

  if (!client || !form || !state || !businessName || !submitButton) return;

  const controls = {
    shortIntro: document.querySelector("#expanded-short-intro"),
    website: document.querySelector("#expanded-website"),
    services: document.querySelector("#expanded-services"),
    serviceArea: document.querySelector("#expanded-service-area"),
    workHours: document.querySelector("#expanded-work-hours"),
    showShortIntro: document.querySelector("#expanded-show-short-intro"),
    showWebsite: document.querySelector("#expanded-show-website"),
    showServices: document.querySelector("#expanded-show-services"),
    showServiceArea: document.querySelector("#expanded-show-service-area"),
    showWorkHours: document.querySelector("#expanded-show-work-hours")
  };

  const errors = {
    shortIntro: document.querySelector("#expanded-short-intro-error"),
    website: document.querySelector("#expanded-website-error"),
    services: document.querySelector("#expanded-services-error"),
    serviceArea: document.querySelector("#expanded-service-area-error"),
    workHours: document.querySelector("#expanded-work-hours-error")
  };

  const sectionRules = [
    { value: controls.shortIntro, toggle: controls.showShortIntro, error: errors.shortIntro, label: "кратко представяне" },
    { value: controls.website, toggle: controls.showWebsite, error: errors.website, label: "адрес на сайта" },
    { value: controls.services, toggle: controls.showServices, error: errors.services, label: "поне една услуга" },
    { value: controls.serviceArea, toggle: controls.showServiceArea, error: errors.serviceArea, label: "район на работа" },
    { value: controls.workHours, toggle: controls.showWorkHours, error: errors.workHours, label: "работно време" }
  ];

  let loadedBusiness = null;
  let currentUserIsStaff = false;

  function setState(message, type = "") {
    state.textContent = message || "";
    state.hidden = !message;
    state.classList.remove("is-error", "is-success");
    if (type) state.classList.add(`is-${type}`);
  }

  function clearErrors() {
    Object.values(errors).forEach((element) => {
      if (element) element.textContent = "";
    });
    Object.values(controls).forEach((element) => element?.removeAttribute("aria-invalid"));
  }

  function websiteIsValid(value) {
    if (!value) return true;
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  }

  function validateSection(rule) {
    if (!rule.value || !rule.toggle || !rule.error) return true;

    const value = rule.value.value.trim();
    let message = "";
    if (rule.toggle.checked && !value) {
      message = `За да публикуваш секцията, въведи ${rule.label}.`;
    } else if (rule.value === controls.website && value && !websiteIsValid(value)) {
      message = "Адресът трябва да започва с http:// или https://.";
    }

    rule.error.textContent = message;
    if (message) rule.value.setAttribute("aria-invalid", "true");
    else rule.value.removeAttribute("aria-invalid");
    return !message;
  }

  function validateForm() {
    return sectionRules.map(validateSection).every(Boolean);
  }

  function servicesFromTextarea() {
    return controls.services.value
      .split(/\r?\n/)
      .map((value) => value.trim())
      .filter(Boolean);
  }

  function setValues(data = {}) {
    controls.shortIntro.value = data.short_intro || "";
    controls.website.value = data.website || "";
    controls.services.value = Array.isArray(data.services) ? data.services.join("\n") : "";
    controls.serviceArea.value = data.service_area || "";
    controls.workHours.value = data.work_hours || "";
    controls.showShortIntro.checked = data.show_short_intro === true;
    controls.showWebsite.checked = data.show_website === true;
    controls.showServices.checked = data.show_services === true;
    controls.showServiceArea.checked = data.show_service_area === true;
    controls.showWorkHours.checked = data.show_work_hours === true;
  }

  function setReadOnly(readOnly) {
    Object.values(controls).forEach((element) => {
      if (element) element.disabled = readOnly;
    });
    submitButton.disabled = readOnly;
  }

  function showModerationState(draft) {
    note.hidden = true;
    note.textContent = "";

    if (currentUserIsStaff) {
      setReadOnly(false);
      if (draft) {
        setState("Има непубликувани промени от предишното изпращане. Натисни „Запази промените“, за да ги публикуваш.");
      } else {
        setState("");
      }
      return;
    }

    if (draft?.status === "pending") {
      setReadOnly(false);
      setState("Промените чакат одобрение. Можеш да ги редактираш и да ги изпратиш отново. Публикуваната версия остава видима.", "success");
      return;
    }

    if (draft?.status === "needs_changes" && draft.moderation_note?.trim()) {
      note.textContent = `Какво трябва да се коригира: ${draft.moderation_note.trim()}`;
      note.hidden = false;
    }

    setReadOnly(false);
    setState("");
  }

  async function loadEditor() {
    if (!businessId) {
      setState("Липсва фирма за редактиране.", "error");
      return;
    }

    const { data: authData, error: authError } = await client.auth.getUser();
    const user = authError ? null : authData?.user || null;
    if (!user) {
      setState("Влез в профила си, за да редактираш фирмата.", "error");
      return;
    }

    const [businessResult, profileResult] = await Promise.all([
      client
        .from("businesses")
        .select("id, owner_id, name, status, is_expanded")
        .eq("id", businessId)
        .eq("owner_id", user.id)
        .maybeSingle(),
      client
        .from("profiles")
        .select("role, is_blocked")
        .eq("id", user.id)
        .maybeSingle()
    ]);

    const business = businessResult.data;
    const businessError = businessResult.error;

    if (businessError || !business) {
      setState("Фирмата не може да се зареди или не е твоя.", "error");
      return;
    }
    if (profileResult.error || !profileResult.data) {
      setState("Правата за редактиране не могат да се проверят.", "error");
      return;
    }
    if (business.is_expanded !== true) {
      setState("Тази фирма няма разширен профил.", "error");
      return;
    }

    currentUserIsStaff = ["admin", "moderator"].includes(profileResult.data.role)
      && profileResult.data.is_blocked !== true;
    loadedBusiness = business;
    businessName.textContent = business.name;
    submitButton.textContent = currentUserIsStaff ? "Запази промените" : "Изпрати за одобрение";

    const fields = "short_intro, website, services, service_area, work_hours, show_short_intro, show_website, show_services, show_service_area, show_work_hours";
    const [draftResult, publishedResult] = await Promise.all([
      client
        .from("business_expanded_profile_drafts")
        .select(`${fields}, status, moderation_note`)
        .eq("business_id", businessId)
        .maybeSingle(),
      client
        .from("business_expanded_profiles")
        .select(fields)
        .eq("business_id", businessId)
        .maybeSingle()
    ]);

    if (draftResult.error || publishedResult.error) {
      setState("Данните на разширения профил не могат да се заредят.", "error");
      return;
    }

    const source = draftResult.data || publishedResult.data || {};
    setValues(source);
    form.hidden = false;
    showModerationState(draftResult.data);
  }

  sectionRules.forEach((rule) => {
    rule.value?.addEventListener("input", () => validateSection(rule));
    rule.toggle?.addEventListener("change", () => validateSection(rule));
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!loadedBusiness) return;

    clearErrors();
    if (!validateForm()) {
      setState("Поправи отбелязаните полета.", "error");
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    submitButton.disabled = true;
    setState(currentUserIsStaff ? "Запазваме промените…" : "Изпращаме промените…");

    const saveFunction = currentUserIsStaff
      ? "save_staff_owned_business_expanded_profile"
      : "save_own_business_expanded_profile_draft";
    const { error } = await client.rpc(saveFunction, {
      p_business_id: loadedBusiness.id,
      p_short_intro: controls.shortIntro.value.trim(),
      p_website: controls.website.value.trim(),
      p_services: servicesFromTextarea(),
      p_service_area: controls.serviceArea.value.trim(),
      p_work_hours: controls.workHours.value.trim(),
      p_show_short_intro: controls.showShortIntro.checked,
      p_show_website: controls.showWebsite.checked,
      p_show_services: controls.showServices.checked,
      p_show_service_area: controls.showServiceArea.checked,
      p_show_gallery: true,
      p_show_work_hours: controls.showWorkHours.checked
    });

    if (error) {
      setState(error.message || "Промените не могат да се изпратят.", "error");
      submitButton.disabled = false;
      return;
    }

    setReadOnly(false);
    note.hidden = true;
    setState(
      currentUserIsStaff
        ? "Промените са запазени и публикувани."
        : "Промените са записани и чакат одобрение. Можеш да ги редактираш отново. Публикуваната версия остава видима.",
      "success"
    );
  });

  loadEditor();
})();
