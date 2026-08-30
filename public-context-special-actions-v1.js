(() => {
  "use strict";

  const shopAction = document.querySelector("[data-context-shop-add]");
  const shopOwner = document.getElementById("addBtn");
  if (!shopAction || !shopOwner) return;

  const sync = () => {
    shopAction.hidden = shopOwner.hidden;
    shopAction.setAttribute("aria-disabled", String(shopOwner.hidden));
  };

  sync();
  new MutationObserver(sync).observe(shopOwner, {
    attributes: true,
    attributeFilter: ["hidden"]
  });

  shopAction.addEventListener("click", () => {
    if (!shopOwner.hidden) shopOwner.click();
  });
})();
