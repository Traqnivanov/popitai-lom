(() => {
  "use strict";
  const root = document.getElementById("info-lom-home-v1");
  if (!root) return;
  const targets = ["info.html#zdrave","info.html#institucii","info.html#transport","info.html#obrazovanie","info.html#banki","info.html#komunalni"];
  root.querySelectorAll(".info-lom-item").forEach((item, index) => {
    const target = targets[index];
    if (!target) return;
    const link = document.createElement("a");
    link.href = target;
    link.className = item.className;
    link.innerHTML = item.innerHTML;
    link.setAttribute("aria-label", `${item.querySelector("strong")?.textContent || "Инфо Лом"} — отвори информацията`);
    link.style.textDecoration = "none";
    link.style.color = "inherit";
    item.replaceWith(link);
  });
})();