// Попитай.Лом — запазване на общия Admin content shell и активната секция
(() => {
  "use strict";

  const VIEW_KEY = "popitai-admin-active-view-v1";
  const START_CLASS = "admin-shell-starting";
  const STARTUP_MAX_WAIT_MS = 1800;

  function revealStartup() {
    document.documentElement.classList.remove(START_CLASS);
  }

  function restoreCoreShell() {
    const content = document.querySelector(".admin-content");
    if (!content) return;
    if (content.querySelector("#admin-view-title") && content.querySelector("#admin-view-content")) return;

    content.innerHTML = `
      <div class="block-heading"><h2 id="admin-view-title">Администрация</h2></div>
      <p class="admin-panel-message" id="admin-panel-message" hidden></p>
      <div id="admin-view-content" class="stack-list"><article class="empty-card"><p>Зареждане…</p></article></div>`;
  }

  function viewKey(button) {
    if (!button) return "";
    if (button.dataset.adminView) return `admin:${button.dataset.adminView}`;
    if (button.dataset.businessView) return `business:${button.dataset.businessView}`;
    if (button.hasAttribute("data-user-edits-view")) return "user-edits";
    if (button.hasAttribute("data-expanded-businesses-view")) return "expanded";
    if (button.hasAttribute("data-shops-review")) return "shops-review";
    if (button.hasAttribute("data-shops-admin")) return "shops";
    if (button.hasAttribute("data-events-review")) return "events-review";
    if (button.hasAttribute("data-events-admin")) return "events";
    if (button.hasAttribute("data-reports-admin")) return "reports";
    if (button.matches("[data-info-admin],[data-info-moderator-review],[data-info-review-shortcut]")) return "info";
    return "";
  }

  function selectorForView(key) {
    if (!key) return "";
    if (key.startsWith("admin:")) return `[data-admin-view="${CSS.escape(key.slice(6))}"]`;
    if (key.startsWith("business:")) return `[data-business-view="${CSS.escape(key.slice(9))}"]`;
    return {
      "user-edits": "[data-user-edits-view]",
      expanded: "[data-expanded-businesses-view]",
      "shops-review": "[data-shops-review]",
      shops: "[data-shops-admin]",
      "events-review": "[data-events-review]",
      events: "[data-events-admin]",
      reports: "[data-reports-admin]",
      info: "[data-info-moderator-review],[data-info-review-shortcut],[data-info-admin]"
    }[key] || "";
  }

  function saveView(key) {
    if (!key) return;
    try { sessionStorage.setItem(VIEW_KEY, key); } catch (_) {}
  }

  function readView() {
    try { return sessionStorage.getItem(VIEW_KEY) || ""; } catch (_) { return ""; }
  }

  function isLoadingText(root) {
    const text = String(root?.textContent || "");
    return text.includes("Зареждане…") || text.includes("Зареждане на панела…");
  }

  function baseShellReady() {
    return Boolean(
      document.querySelector('.admin-menu [data-admin-view="pending"]') &&
      document.querySelector("#admin-pending-count") &&
      document.querySelector(".admin-content")
    );
  }

  function waitForState(test, timeoutMs = STARTUP_MAX_WAIT_MS) {
    return new Promise(resolve => {
      if (test()) {
        resolve(true);
        return;
      }

      let finished = false;
      const finish = value => {
        if (finished) return;
        finished = true;
        observer.disconnect();
        window.clearTimeout(timeout);
        resolve(value);
      };

      // Еднократен startup observer; изключва се веднага след достигане на състоянието.
      const observer = new MutationObserver(() => {
        if (test()) finish(true);
      });
      observer.observe(document.documentElement, {
        subtree: true,
        childList: true,
        attributes: true,
        characterData: true
      });

      const timeout = window.setTimeout(() => finish(false), timeoutMs);
    });
  }

  async function restoreSavedView() {
    const deadline = performance.now() + STARTUP_MAX_WAIT_MS;
    const remaining = () => Math.max(0, Math.ceil(deadline - performance.now()));
    const waitWithinStartup = test => {
      const left = remaining();
      return left > 0 ? waitForState(test, left) : Promise.resolve(false);
    };

    try {
      const baseReady = await waitWithinStartup(baseShellReady);
      if (!baseReady) return;

      const key = readView();
      const selector = selectorForView(key);

      if (!selector) {
        await waitWithinStartup(() => !isLoadingText(document.querySelector(".admin-content")));
        return;
      }

      const targetFound = await waitWithinStartup(() => Boolean(document.querySelector(`.admin-menu ${selector}`)));
      if (!targetFound) return;

      const button = document.querySelector(`.admin-menu ${selector}`);
      const content = document.querySelector(".admin-content");
      if (!button || !content) return;

      // Ако базовият renderer вече е на същата секция и е приключил, няма втори render.
      if (button.classList.contains("active") && !isLoadingText(content)) return;

      const beforeHtml = content.innerHTML;
      button.click();

      await waitWithinStartup(() => {
        const currentContent = document.querySelector(".admin-content");
        const currentButton = document.querySelector(`.admin-menu ${selector}`);
        if (!currentContent || !currentButton) return false;
        const changed = currentContent.innerHTML !== beforeHtml;
        return currentButton.classList.contains("active") && changed && !isLoadingText(currentContent);
      });
    } finally {
      // Startup никога не държи интерфейса скрит повече от един общ кратък лимит.
      revealStartup();
    }
  }

  window.addEventListener("click", event => {
    const button = event.target?.closest?.(".admin-menu button");
    if (!button) return;

    const key = viewKey(button);
    if (key) saveView(key);

    const isInfoButton = button.matches(
      "[data-info-admin],[data-info-moderator-review],[data-info-review-shortcut]"
    );
    if (isInfoButton) return;

    // Info Lom има собствен legacy render. При излизане от него възстановяваме
    // само общия shell преди следващият модул да поеме своя render root.
    restoreCoreShell();
  }, true);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", restoreSavedView, { once: true });
  } else {
    restoreSavedView();
  }
})();
