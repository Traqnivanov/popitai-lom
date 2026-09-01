(() => {
  "use strict";

  function injectPrototypeControls() {
    const header = document.querySelector(".site-header");
    const nav = document.querySelector(".desktop-nav");
    if (nav) {
      nav.innerHTML = `
        <button type="button" class="active" data-screen-target="home">Начало</button>
        <button type="button" data-screen-target="category">Обяви и услуги</button>
        <button type="button" data-prototype-action="firms">Фирми</button>
        <button type="button" data-prototype-action="info">Инфо Лом</button>
        <button type="button" data-prototype-action="articles">Статии</button>
        <button type="button" data-prototype-action="more">Още ▾</button>
        <button type="button" data-prototype-action="profile">Профил</button>`;
    }

    const mobileProfile = document.querySelector('.mobile-bottom-nav button:last-child');
    if (mobileProfile) {
      mobileProfile.removeAttribute("data-screen-target");
      mobileProfile.dataset.prototypeAction = "profile";
    }

    if (header && !document.querySelector(".prototype-switcher")) {
      const switcher = document.createElement("nav");
      switcher.className = "prototype-switcher";
      switcher.setAttribute("aria-label", "Превключване между V6 prototype екрани");
      switcher.innerHTML = `<div><strong>Преглед на прототипа:</strong>
        <button type="button" class="active" data-prototype-screen="home">Home</button>
        <button type="button" data-prototype-screen="category">Категория</button>
        <button type="button" data-prototype-screen="health">Health</button>
        <button type="button" data-prototype-screen="search">Search</button>
        <button type="button" data-prototype-screen="ask">Ask</button>
        <button type="button" data-prototype-screen="states">States</button></div>`;
      header.insertAdjacentElement("afterend", switcher);
    }

    if (!document.getElementById("prototype-extra-style")) {
      const style = document.createElement("style");
      style.id = "prototype-extra-style";
      style.textContent = `
        .prototype-switcher{position:sticky;top:71px;z-index:35;background:#071c38;color:#fff;border-bottom:1px solid rgba(255,255,255,.12);padding:8px 14px}
        .prototype-switcher>div{max-width:1180px;margin:auto;display:flex;align-items:center;gap:6px;overflow:auto;scrollbar-width:none}
        .prototype-switcher strong{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#a9bdd6;white-space:nowrap;margin-right:4px}
        .prototype-switcher button{border:1px solid rgba(255,255,255,.16);background:transparent;color:#dce8f7;border-radius:999px;padding:6px 9px;font-size:12px;font-weight:800;white-space:nowrap}
        .prototype-switcher button.active{background:#fff;color:#071c38}
        .prototype-toast{position:fixed;z-index:150;right:18px;bottom:22px;max-width:360px;background:#071c38;color:#fff;border:1px solid rgba(255,255,255,.16);box-shadow:0 18px 46px rgba(0,0,0,.22);border-radius:14px;padding:13px 15px;font-size:13px;line-height:1.45}
        @media(max-width:720px){.prototype-switcher{top:59px;padding:7px 8px}.prototype-switcher strong{display:none}.prototype-toast{left:12px;right:12px;bottom:82px;max-width:none}.site-header{top:0}}
      `;
      document.head.appendChild(style);
    }

    if (!document.getElementById("prototype-toast")) {
      const toast = document.createElement("div");
      toast.id = "prototype-toast";
      toast.className = "prototype-toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      toast.hidden = true;
      document.body.appendChild(toast);
    }
  }

  injectPrototypeControls();

  const screens = [...document.querySelectorAll("[data-screen]")];
  const modals = [...document.querySelectorAll(".modal-layer")];
  let activeScreen = "home";
  let returnFocus = null;
  let toastTimer = null;

  function showToast(message) {
    const toast = document.getElementById("prototype-toast");
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => { toast.hidden = true; }, 3200);
  }

  function screenButtons() {
    return [...document.querySelectorAll("[data-screen-target]")];
  }

  function desktopNav() {
    return [...document.querySelectorAll(".desktop-nav [data-screen-target]")];
  }

  function mobileNav() {
    return [...document.querySelectorAll(".mobile-bottom-nav [data-screen-target]")];
  }

  function switcherButtons() {
    return [...document.querySelectorAll("[data-prototype-screen]")];
  }

  function setScreen(name, focus = true) {
    const next = screens.find((screen) => screen.dataset.screen === name) || screens[0];
    activeScreen = next?.dataset.screen || "home";
    screens.forEach((screen) => screen.classList.toggle("active", screen === next));
    desktopNav().forEach((button) => button.classList.toggle("active", button.dataset.screenTarget === activeScreen));
    mobileNav().forEach((button) => button.classList.toggle("active", button.dataset.screenTarget === activeScreen));
    switcherButtons().forEach((button) => button.classList.toggle("active", button.dataset.prototypeScreen === activeScreen));
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (focus) {
      requestAnimationFrame(() => {
        const heading = next?.querySelector("h1");
        if (!heading) return;
        heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
      });
    }
  }

  function focusable(root) {
    return [...root.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')]
      .filter((node) => !node.hidden && node.offsetParent !== null);
  }

  function openModal(id, trigger) {
    const modal = document.getElementById(id);
    if (!modal) return;
    closeAllModals(false);
    returnFocus = trigger || document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => (focusable(modal)[0] || modal.querySelector("[role=dialog]"))?.focus?.());
  }

  function closeModal(modal, restore = true) {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    if (!modals.some((item) => !item.hidden)) document.body.style.overflow = "";
    if (restore) {
      const target = returnFocus;
      returnFocus = null;
      target?.focus?.();
    }
  }

  function closeAllModals(restore = true) {
    const open = modals.filter((modal) => !modal.hidden);
    open.forEach((modal, index) => closeModal(modal, restore && index === open.length - 1));
  }

  function wireScreenButtons() {
    screenButtons().forEach((button) => {
      if (button.dataset.prototypeScreenWired === "1") return;
      button.dataset.prototypeScreenWired = "1";
      button.addEventListener("click", () => {
        const target = button.dataset.screenTarget;
        closeAllModals(false);
        if (target) setScreen(target);
      });
    });
    switcherButtons().forEach((button) => button.addEventListener("click", () => setScreen(button.dataset.prototypeScreen)));
  }

  wireScreenButtons();

  document.querySelectorAll("[data-prototype-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const labels = {
        firms: "Prototype: тук се отваря каноничният Firms owner / списък с фирми.",
        info: "Prototype: Инфо Лом остава отделен top-level verified hub; Health е показан като пример за общия category shell.",
        articles: "Prototype: тук се отварят само V6-ready статии и ръководства.",
        more: "Prototype: менюто „Още“ съдържа Въпроси, Събития, За сайта, Правила и Контакти.",
        profile: "Prototype: Профил остава canonical mobile/desktop entry за собствените активности и status-и."
      };
      showToast(labels[button.dataset.prototypeAction] || "Prototype navigation action.");
    });
  });

  document.querySelectorAll("[data-open-add]").forEach((button) => button.addEventListener("click", () => openModal("prototype-add-sheet", button)));
  document.querySelectorAll("[data-open-listing]").forEach((button) => button.addEventListener("click", () => openModal("listing-modal", button)));
  document.querySelectorAll("[data-open-health]").forEach((button) => button.addEventListener("click", () => openModal("health-modal", button)));
  document.querySelectorAll("[data-open-shop]").forEach((button) => button.addEventListener("click", () => openModal("shop-modal", button)));
  document.querySelectorAll("[data-open-dirty]").forEach((button) => button.addEventListener("click", () => openModal("dirty-modal", button)));
  document.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", () => closeModal(button.closest(".modal-layer"))));

  modals.forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal(modal);
    });
    modal.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeModal(modal);
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusable(modal);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  });

  document.querySelectorAll("[data-demo-search]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      closeAllModals(false);
      const input = form.querySelector('input[type="search"]');
      const title = document.getElementById("search-title");
      if (title && input?.value.trim()) title.textContent = `Резултати за „${input.value.trim()}“`;
      setScreen("search");
    });
  });

  document.querySelectorAll("[data-demo-query]").forEach((button) => {
    button.addEventListener("click", () => {
      const title = document.getElementById("search-title");
      if (title) title.textContent = `Резултати за „${button.dataset.demoQuery}“`;
      const searchInput = document.querySelector('[data-screen="search"] input[type="search"]');
      if (searchInput) searchInput.value = button.dataset.demoQuery || "";
      setScreen("search");
    });
  });

  const searchStateButtons = [...document.querySelectorAll("[data-search-state]")];
  const searchPanels = [...document.querySelectorAll("[data-search-panel]")];
  searchStateButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const state = button.dataset.searchState;
      searchStateButtons.forEach((item) => item.classList.toggle("active", item === button));
      searchPanels.forEach((panel) => panel.classList.toggle("active", panel.dataset.searchPanel === state));
    });
  });

  document.querySelectorAll("[data-prefill-ask]").forEach((button) => {
    button.addEventListener("click", () => {
      const question = document.getElementById("ask-question");
      if (question) question.value = "Ремонт на стара печка модел X — кой може да помогне в Лом?";
    });
  });

  const askForm = document.getElementById("ask-form");
  askForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const question = document.getElementById("ask-question");
    const continueCheck = document.getElementById("ask-continue");
    const message = document.getElementById("ask-message");
    if (!question?.value.trim() || question.value.trim().length < 10) {
      message.textContent = "Въпросът трябва да е поне 10 знака.";
      message.style.color = "#b42318";
      question?.focus();
      return;
    }
    if (!continueCheck?.checked) {
      message.textContent = "Провери предложените сходни въпроси или отбележи, че искаш да продължиш с нов въпрос.";
      message.style.color = "#725500";
      continueCheck?.focus();
      return;
    }
    message.textContent = "Prototype: въпросът би бил изпратен за преглед. Facebook share се появява чак след approval.";
    message.style.color = "#157347";
  });

  document.querySelectorAll("[data-demo-pending]").forEach((button) => {
    button.addEventListener("click", () => {
      closeAllModals(false);
      setScreen("states");
      requestAnimationFrame(() => document.querySelector(".state-card.pending")?.scrollIntoView({ behavior: "smooth", block: "center" }));
    });
  });

  document.querySelectorAll(".type-grid").forEach((grid) => {
    grid.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      grid.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
    });
  });

  document.querySelectorAll(".filter-chips").forEach((group) => {
    group.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      group.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
      showToast(`Prototype filter: ${button.textContent.trim()}`);
    });
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button || button.disabled) return;
    if (button.matches('[data-screen-target],[data-prototype-screen],[data-prototype-action],[data-open-add],[data-open-listing],[data-open-health],[data-open-shop],[data-open-dirty],[data-close-modal],[data-demo-query],[data-search-state],[data-prefill-ask],[data-demo-pending],[type="submit"]')) return;
    if (button.closest(".filter-chips,.type-grid")) return;
    showToast(`Prototype action: „${button.textContent.trim()}“. Реалният destination/owner е заключен в B9; този prototype не прави live заявка.`);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAllModals();
  });

  setScreen("home", false);
})();