(() => {
  "use strict";
  const root = document.getElementById("info-lom-home-v1");
  if (!root) return;

  // INFO LOM — direct entry to all six approved main sections.
  // No intermediate info.html -> same section again.
  const targets = [
    "zdrave.html",
    "institucii.html",
    "transport.html",
    "obrazovanie-kultura.html",
    "banki.html",
    "komunalni.html"
  ];

  root.querySelectorAll(".info-lom-item").forEach((item, index) => {
    const target = targets[index];
    if (!target) return;

    const link = document.createElement("a");
    link.href = target;
    link.className = item.className;
    link.innerHTML = item.innerHTML;
    link.setAttribute(
      "aria-label",
      `${item.querySelector("strong")?.textContent || "Инфо Лом"} — отвори раздела`
    );
    link.style.textDecoration = "none";
    link.style.color = "inherit";
    item.replaceWith(link);
  });
})();
