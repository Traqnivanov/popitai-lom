(() => {
  "use strict";

  const CATEGORY_UX = {
    "Майстори и ремонти": {
      href: "maistori.html",
      publicLabel: "Майстори и ремонти",
      title: "Например: Кой препоръчва добър майстор за ремонт на баня?",
      description: "Опиши каква работа трябва да се извърши и какво точно искаш да разбереш."
    },
    "Здраве и лекари": {
      href: "zdrave-i-lekari.html",
      publicLabel: "Здраве и лекари",
      title: "Например: Кого препоръчвате за очен лекар в Лом?",
      description: "Опиши какъв специалист или здравна услуга търсиш и какво искаш да разбереш."
    },
    "Автомобили": {
      href: "avtomobili.html",
      publicLabel: "Автомобили",
      title: "Например: Кой автосервиз в Лом препоръчвате за ходова част?",
      description: "Опиши автомобила, проблема или услугата, която търсиш, и какво искаш да разбереш."
    },
    "Магазини и покупки": {
      href: "magazini.html",
      publicLabel: "Магазини и покупки",
      title: "Например: Къде в Лом мога да намеря качествени строителни материали?",
      description: "Опиши какво търсиш, за да получиш конкретна местна препоръка."
    },
    "Заведения": {
      href: "zavedenia.html",
      publicLabel: "Заведения",
      title: "Например: Кое заведение в Лом препоръчвате за семейна вечеря?",
      description: "Опиши какъв тип място, храна или услуга търсиш."
    },
    "Работа и услуги": {
      href: "rabota.html",
      publicLabel: "Услуги",
      title: "Например: Кого препоръчвате за почистване на дом в Лом?",
      description: "Опиши услугата, която търсиш, и важните условия за теб."
    },
    "Обяви": {
      href: "obyavi.html",
      publicLabel: "Обяви",
      title: "Например: Някой предлага ли такъв артикул или имот в Лом?",
      description: "Опиши какво търсиш или за коя обява искаш информация."
    },
    "Събития и град": {
      href: "sabitiya.html",
      publicLabel: "Събития",
      title: "Например: Какви събития има в Лом този уикенд?",
      description: "Опиши какъв тип събитие, дата или местна инициатива те интересува."
    }
  };

  const SLUG_TO_CATEGORY = {
    maistori: "Майстори и ремонти",
    zdrave: "Здраве и лекари",
    avtomobili: "Автомобили",
    magazini: "Магазини и покупки",
    zavedenia: "Заведения",
    rabota: "Работа и услуги",
    obyavi: "Обяви",
    sabitiya: "Събития и град"
  };

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

  function ensureConsentError(consent) {
    if (!consent) return null;
    const id = "question-consent-error";
    let error = document.getElementById(id);
    if (!error) {
      error = document.createElement("p");
      error.id = id;
      error.className = "form-message field-error";
      error.setAttribute("aria-live", "polite");
      consent.closest(".check-row")?.insertAdjacentElement("afterend", error);
    }
    consent.setAttribute("aria-describedby", id);
    return error;
  }

  function armPostSubmitState(form, messageId, title, text, href = "", linkLabel = "") {
    const message = document.getElementById(messageId);
    if (!form || !message) return;

    const previous = form._popitaiSubmitObserver;
    if (previous) previous.disconnect();

    const observer = new MutationObserver(() => {
      if (message.classList.contains("is-error")) {
        observer.disconnect();
        form._popitaiSubmitObserver = null;
        return;
      }
      if (!message.classList.contains("is-success")) return;

      observer.disconnect();
      form._popitaiSubmitObserver = null;
      form.hidden = true;

      let success = form.nextElementSibling;
      if (!success || !success.classList.contains("post-submit-success")) {
        success = document.createElement("div");
        success.className = "empty-card post-submit-success";
        success.setAttribute("role", "status");
        form.insertAdjacentElement("afterend", success);
      }
      success.innerHTML = `<h2>${title}</h2><p>${text}</p>${href ? `<a class="primary-link-button" href="${href}">${linkLabel}</a>` : ""}`;
    });

    form._popitaiSubmitObserver = observer;
    observer.observe(message, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ["class"] });
  }

  function setupQuestionCategoryUx(category, title, description) {
    if (!category || !title || !description) return;

    let help = document.getElementById("question-category-help");
    if (!help) {
      help = document.createElement("p");
      help.id = "question-category-help";
      help.className = "form-help";
      help.setAttribute("aria-live", "polite");
      category.insertAdjacentElement("afterend", help);
    }

    const apply = () => {
      const config = CATEGORY_UX[category.value];
      if (!config) {
        title.placeholder = "Например: Кой препоръчва добър електротехник?";
        description.placeholder = "Добави подробности, за да получиш по-точен отговор";
        help.textContent = "Избери категория, за да насочиш въпроса към правилните хора.";
        return;
      }
      title.placeholder = config.title;
      description.placeholder = config.description;
      help.textContent = `Въпросът ще бъде в „${config.publicLabel}“.`;
    };

    const slug = new URLSearchParams(window.location.search).get("category");
    const categoryFromUrl = SLUG_TO_CATEGORY[slug];
    if (categoryFromUrl) category.value = categoryFromUrl;

    category.addEventListener("change", apply);
    apply();
  }

  function setupQuestionForm() {
    const form = document.getElementById("new-question-form");
    if (!form) return;
    form.noValidate = true;

    const title = document.getElementById("question-title");
    const category = document.getElementById("question-category");
    const description = document.getElementById("question-description");
    const consent = form.querySelector('.check-row input[type="checkbox"]');
    const consentError = ensureConsentError(consent);

    setupQuestionCategoryUx(category, title, description);

    const validators = [
      [title, () => textRule(title, 10, 120, "заглавие")],
      [category, () => category?.value ? "" : "Избери категория."],
      [description, () => textRule(description, 20, 5000, "описание")]
    ];

    validators.forEach(([field, validate]) => wireField(field, validate));

    const validateConsent = () => {
      const message = consent?.checked ? "" : "Приеми правилата на общността, за да публикуваш въпроса.";
      if (consentError) consentError.textContent = message;
      if (consent) {
        if (message) consent.setAttribute("aria-invalid", "true");
        else consent.removeAttribute("aria-invalid");
      }
      return !message;
    };

    consent?.addEventListener("change", validateConsent);

    form.addEventListener("submit", event => {
      let firstInvalid = null;
      validators.forEach(([field, validate]) => {
        if (!field) return;
        field.dataset.touched = "true";
        if (!setError(field, validate()) && !firstInvalid) firstInvalid = field;
      });
      const consentOk = validateConsent();
      if (!firstInvalid && !consentOk) firstInvalid = consent;

      if (firstInvalid) {
        event.preventDefault();
        event.stopImmediatePropagation();
        firstInvalid.focus();
        return;
      }

      armPostSubmitState(
        form,
        "new-question-message",
        "Въпросът е изпратен",
        "Въпросът е приет от системата. Ако профилът не е администраторски, той ще се покаже публично след одобрение.",
        "vaprosi.html",
        "Към въпросите"
      );
    }, true);
  }

  function setupQuestionCategoryLink() {
    const link = document.getElementById("question-category-link");
    if (!link) return;

    const apply = () => {
      const raw = String(link.textContent || "").trim();
      const config = CATEGORY_UX[raw];
      if (!config) return false;
      link.href = config.href;
      link.textContent = config.publicLabel;
      return true;
    };

    if (apply()) return;
    const observer = new MutationObserver(() => {
      if (!apply()) return;
      observer.disconnect();
    });
    observer.observe(link, { childList: true, characterData: true, subtree: true });
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
        return;
      }

      armPostSubmitState(
        form,
        "answer-message",
        "Отговорът е изпратен",
        "Отговорът е изпратен и чака одобрение от администратор."
      );
    }, true);
  }

  setupQuestionForm();
  setupQuestionCategoryLink();
  setupAnswerForm();
})();
