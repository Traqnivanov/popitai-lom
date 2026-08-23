// Попитай.Лом — запазване на общия Admin content shell при смяна на секции
(() => {
  "use strict";

  function restoreCoreShell() {
    const content = document.querySelector(".admin-content");
    if (!content) return;
    if (content.querySelector("#admin-view-title") && content.querySelector("#admin-view-content")) return;

    content.innerHTML = `
      <div class="block-heading"><h2 id="admin-view-title">Администрация</h2></div>
      <p class="admin-panel-message" id="admin-panel-message" hidden></p>
      <div id="admin-view-content" class="stack-list"><article class="empty-card"><p>Зареждане…</p></article></div>`;
  }

  window.addEventListener("click", (event) => {
    const button = event.target?.closest?.(".admin-menu button");
    if (!button) return;

    const isInfoButton = button.matches(
      "[data-info-admin],[data-info-moderator-review],[data-info-review-shortcut]"
    );
    if (isInfoButton) return;

    // Info Lom има собствен legacy render, който може да е заменил общия shell.
    // Възстановяваме само shell-а преди следващият модул да рендерира своето съдържание.
    restoreCoreShell();
  }, true);
})();
