// Попитай.Лом — запазване на общия Admin content shell и активната секция
(() => {
  "use strict";

  const VIEW_KEY = "popitai-admin-active-view-v1";

  function revealLayout() {
    document.documentElement.classList.remove("admin-restoring-view");
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

  function restoreSavedView() {
    const key = readView();
    const selector = selectorForView(key);
    if (!selector) {
      revealLayout();
      return;
    }

    let attempts = 0;
    const tryRestore = () => {
      attempts += 1;
      const button = document.querySelector(`.admin-menu ${selector}`);
      if (button) {
        button.click();
        window.requestAnimationFrame(() => window.requestAnimationFrame(revealLayout));
        return;
      }
      if (attempts < 40) {
        window.setTimeout(tryRestore, 50);
      } else {
        revealLayout();
      }
    };

    tryRestore();
  }

  window.addEventListener("click", (event) => {
    const button = event.target?.closest?.(".admin-menu button");
    if (!button) return;

    const key = viewKey(button);
    if (key) saveView(key);

    const isInfoButton = button.matches(
      "[data-info-admin],[data-info-moderator-review],[data-info-review-shortcut]"
    );
    if (isInfoButton) return;

    // Info Lom има собствен legacy render, който може да е заменил общия shell.
    // Възстановяваме само shell-а преди следващият модул да рендерира своето съдържание.
    restoreCoreShell();
  }, true);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", restoreSavedView, { once: true });
  } else {
    restoreSavedView();
  }
})();
