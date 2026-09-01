(() => {
  "use strict";

  const screens = [...document.querySelectorAll("[data-screen]")];
  const screenButtons = [...document.querySelectorAll("[data-screen-target]")];
  const desktopNav = [...document.querySelectorAll(".desktop-nav [data-screen-target]")];
  const mobileNav = [...document.querySelectorAll(".mobile-bottom-nav [data-screen-target]")];
  const modals = [...document.querySelectorAll(".modal-layer")];
  let activeScreen = "home";
  let returnFocus = null;

  function setScreen(name, focus = true) {
    const next = screens.find((screen) => screen.dataset.screen === name) || screens[0];
    activeScreen = next?.dataset.screen || "home";
    screens.forEach((screen) => screen.classList.toggle("active", screen === next));
    desktopNav.forEach((button) => button.classList.toggle("active", button.dataset.screenTarget === activeScreen));
    mobileNav.forEach((button) => button.classList.toggle("active", button.dataset.screenTarget === activeScreen));
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

  screenButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.screenTarget;
      closeAllModals(false);
      if (target) setScreen(target);
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

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAllModals();
  });

  setScreen("home", false);
})();