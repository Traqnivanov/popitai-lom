// Попитай.Лом — бутон за корекция на върнат фирмен профил
(() => {
  "use strict";

  const container = document.querySelector("#profile-businesses");
  if (!container) return;

  function addEditLinks() {
    container.querySelectorAll('.profile-business-card[data-status="needs_changes"]').forEach((card) => {
      if (card.querySelector("[data-business-edit-link]")) return;

      const previewLink = card.querySelector('.profile-business-actions a[href*="firma.html?id="]');
      const actions = card.querySelector(".profile-business-actions");
      if (!previewLink || !actions) return;

      let businessId = "";
      try {
        businessId = new URL(previewLink.href, window.location.href).searchParams.get("id") || "";
      } catch (_) {
        return;
      }
      if (!businessId) return;

      const editLink = document.createElement("a");
      editLink.className = "profile-business-link";
      editLink.href = `dobavi-firma.html?edit=${encodeURIComponent(businessId)}`;
      editLink.textContent = "Редактирай";
      editLink.dataset.businessEditLink = "true";
      actions.insertBefore(editLink, previewLink);
    });
  }

  addEditLinks();
  new MutationObserver(addEditLinks).observe(container, { childList: true, subtree: true });
})();
