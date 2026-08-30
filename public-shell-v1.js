(() => {
  "use strict";
  const sheet = document.getElementById("public-add-sheet");
  if (!sheet) return;
  const triggers = Array.from(document.querySelectorAll(".public-add-trigger"));
  const closeButton = sheet.querySelector(".public-add-close");
  const menu = document.getElementById("main-nav");
  const menuButton = document.getElementById("menu-button");
  let returnFocus = null;

  const focusable = () => Array.from(sheet.querySelectorAll('a[href],button:not([disabled]):not([hidden])')).filter(el => !el.hidden && el.offsetParent !== null);
  function closeMenu() {
    if (!menu || !menuButton) return;
    menu.classList.remove("open");
    menuButton.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }
  function setTriggerExpanded(value) { triggers.forEach(el => el.setAttribute("aria-expanded", String(value))); }
  function openSheet(trigger) {
    closeMenu();
    returnFocus = trigger || document.activeElement;
    sheet.hidden = false;
    document.body.classList.add("public-add-open");
    setTriggerExpanded(true);
    requestAnimationFrame(() => (focusable()[0] || closeButton)?.focus());
  }
  function closeSheet() {
    if (sheet.hidden) return;
    sheet.hidden = true;
    document.body.classList.remove("public-add-open");
    setTriggerExpanded(false);
    const target = returnFocus;
    returnFocus = null;
    target?.focus?.();
  }
  triggers.forEach(trigger => trigger.addEventListener("click", () => openSheet(trigger)));
  closeButton?.addEventListener("click", closeSheet);
  sheet.addEventListener("click", event => { if (event.target === sheet) closeSheet(); });
  sheet.addEventListener("keydown", event => {
    if (event.key === "Escape") { event.preventDefault(); closeSheet(); return; }
    if (event.key !== "Tab") return;
    const items = focusable(); if (!items.length) return;
    const first=items[0], last=items[items.length-1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  menu?.querySelectorAll("a[href]").forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menu?.classList.contains("open")) { closeMenu(); menuButton?.focus(); }
  }, { capture: true });

  const shopAction = sheet.querySelector('[data-public-special-action="shop"]');
  const shopOwner = document.getElementById("addBtn");
  if (shopAction && shopOwner) {
    const sync = () => { shopAction.hidden = shopOwner.hidden; };
    sync(); new MutationObserver(sync).observe(shopOwner, {attributes:true, attributeFilter:["hidden"]});
    shopAction.addEventListener("click", () => { closeSheet(); if (!shopOwner.hidden) shopOwner.click(); });
  }
  const healthAction = sheet.querySelector('[data-public-special-action="health"]');
  const healthOwner = document.querySelector(".health-hero-add");
  healthAction?.addEventListener("click", () => { closeSheet(); healthOwner?.click(); });
})();