// Попитай.Лом — защити срещу дублажи в разширения фирмен профил
(() => {
  "use strict";

  const businessId = new URLSearchParams(location.search).get("id");
  if (!businessId) return;

  function normalizePhone(href) {
    const raw = String(href || "").replace(/^tel:/i, "");
    const digits = raw.replace(/\D+/g, "");
    if (!digits) return "";
    if (digits.startsWith("359")) return digits;
    if (digits.startsWith("0")) return `359${digits.slice(1)}`;
    return digits;
  }

  function applyGuards() {
    if (!document.body.classList.contains("has-expanded-business-profile")) return;

    const baseActions = document.querySelector("#business-action-buttons");
    if (baseActions) {
      baseActions.hidden = true;
      baseActions.setAttribute("aria-hidden", "true");
    }

    const realLogo = document.querySelector("#business-detail-logo-image");
    const fallbackLogo = document.querySelector("#business-detail-logo");
    if (realLogo && fallbackLogo && !realLogo.hidden && realLogo.querySelector("img")) {
      fallbackLogo.hidden = true;
      fallbackLogo.setAttribute("aria-hidden", "true");
    }

    const expandedHours = document.querySelector("[data-expanded-work-hours]");
    const baseHours = document.querySelector("#business-detail-hours-row");
    if (expandedHours && baseHours) {
      baseHours.hidden = true;
      baseHours.setAttribute("aria-hidden", "true");
    }

    const phoneHref = document.querySelector("#business-detail-phone")?.getAttribute("href") || "";
    const number = normalizePhone(phoneHref);
    const inquiry = document.querySelector("#expanded-business-actions .expanded-action-secondary");
    if (inquiry && number) inquiry.setAttribute("href", `viber://chat?number=${number}`);
  }

  document.addEventListener("DOMContentLoaded", applyGuards, { once: true });
  window.addEventListener("load", applyGuards, { once: true });
  [0, 100, 250, 500, 900, 1400, 2200, 3200].forEach((ms) => window.setTimeout(applyGuards, ms));
})();
