(() => {
  "use strict";

  let client = null;
  let currentProfile = null;
  let countTimer = 0;

  const HELP = {
    pending: {
      title: "Какво управляваш тук",
      text: "Тук са новите въпроси, отговори и обяви, които чакат решение. „Одобри“ публикува. „Върни за корекция“ изпраща бележка към автора, който може да поправи и изпрати отново. „Откажи“ не публикува съдържанието. „Изтрий“ го премахва окончателно."
    },
    questions: {
      title: "Публикувани въпроси",
      text: "„Скрий“ премахва въпроса от публичния сайт, без да го изтрива окончателно. „Изтрий окончателно“ премахва записа."
    },
    answers: {
      title: "Публикувани отговори",
      text: "„Скрий“ премахва отговора от публичния сайт, без да го изтрива окончателно. „Изтрий окончателно“ премахва записа."
    },
    listings: {
      title: "Публикувани обяви",
      text: "Тук управляваш вече публикувани обяви. „Скрий“ спира публичното показване. Допълнителните отметки не променят собствеността или одобрението на обявата."
    },
    hidden: {
      title: "Скрити и отказани",
      text: "„Публикувай отново“ връща съдържанието на публичния сайт. „Изтрий окончателно“ премахва записа и не е действие за временно скриване."
    },
    users: {
      title: "Потребители",
      text: "Назначаването за модератор дава права за модерация, но не прави потребителя администратор. Блокирането ограничава действията на профила; разблокирането възстановява достъпа според ролята му."
    },
    contacts: {
      title: "Съобщения",
      text: "Това е входяща поща, не moderation queue. „Маркирай като прочетено“ променя само състоянието прочетено/непрочетено."
    },
    "shops-pending": {
      title: "Чакащи магазини",
      text: "„Одобри“ публикува предложението за магазин. „Откажи“ не го публикува и записва причината. Тук няма действие „Върни за корекция“, защото няма отделен потребителски correction flow."
    },
    "shops-all": {
      title: "Магазини",
      text: "Тук управляваш всички предложения. „Скрий“ премахва одобрен магазин от публичния каталог, а отказан магазин може да бъде одобрен по-късно."
    },
    "events-pending": {
      title: "Чакащи събития",
      text: "„Одобри“ публикува събитието. „Откажи“ не го публикува. „Изтрий“ премахва записа окончателно."
    },
    "events-all": {
      title: "Събития",
      text: "Тук управляваш всички записи за събития. Публикувано събитие може да бъде скрито, а изтриването е окончателно."
    },
    reports: {
      title: "Общи сигнали",
      text: "„Маркирай като обработен“ означава, че сигналът е прегледан и приключен. „Отхвърли“ го приключва като неоснователен/неприет. Този поток е отделен от сигналите за грешка в „Инфо Лом“."
    },
    info: {
      title: "Инфо Лом",
      text: "„Прегледай и обработи“ отваря панела за проверка и евентуална промяна по свързан запис. „Поискай още информация“ връща конкретно искане към профила на подателя. „Отхвърли“ приключва сигнала без прилагане на промяна."
    },
    "user-edits": {
      title: "Потребителски редакции",
      text: "„Одобри редакцията“ публикува подадената промяна. „Върни за корекция“ изпраща бележка към собственика; последната одобрена публична версия се запазва до ново одобрение."
    },
    expanded: {
      title: "Разширени фирмени профили",
      text: "„Дай/Отнеми разширен профил“ управлява достъпа до разширените секции и не изтрива запазените разширени данни. „Одобри редакцията“ публикува чакаща чернова; „Върни за корекция“ изпраща бележка към собственика."
    },
    "businesses-pending": {
      title: "Чакащи фирми",
      text: "„Одобри“ публикува фирмата. „Върни за корекция“ изпраща бележка към собственика за редакция и повторно подаване. „Откажи“ не публикува фирмата."
    },
    "businesses-approved": {
      title: "Публикувани фирми",
      text: "„Скрий“ премахва фирмата от публичното показване, без да е окончателно изтриване. „Изтрий окончателно“ премахва записа."
    },
    "businesses-hidden": {
      title: "Скрити фирми",
      text: "„Публикувай отново“ връща фирмата публично. „Изтрий окончателно“ премахва записа. Върнатите за корекция и отказаните фирми запазват различния си статус."
    }
  };

  async function getClient() {
    if (window.PopitaiSupabase) return window.PopitaiSupabase;
    return new Promise((resolve, reject) => {
      let tries = 0;
      const timer = window.setInterval(() => {
        tries += 1;
        if (window.PopitaiSupabase) {
          window.clearInterval(timer);
          resolve(window.PopitaiSupabase);
        } else if (tries >= 120) {
          window.clearInterval(timer);
          reject(new Error("Supabase client timeout"));
        }
      }, 50);
    });
  }

  async function loadStaffProfile() {
    client = client || await getClient();
    const { data: authData, error: authError } = await client.auth.getUser();
    const user = authError ? null : authData?.user;
    if (!user) return false;
    const { data: profile, error } = await client.from("profiles")
      .select("role,is_blocked")
      .eq("id", user.id)
      .maybeSingle();
    if (error || !profile || profile.is_blocked === true) return false;
    if (!["admin", "moderator"].includes(profile.role)) return false;
    currentProfile = profile;
    return true;
  }

  async function waitForShell() {
    for (let i = 0; i < 60; i += 1) {
      const menu = document.querySelector(".admin-menu");
      const content = document.querySelector(".admin-content");
      const pending = document.querySelector("#admin-pending-count");
      if (menu && content && pending) return true;
      await new Promise(resolve => window.setTimeout(resolve, 50));
    }
    return false;
  }

  function activeContextKey() {
    const active = document.querySelector(".admin-menu button.active");
    if (!active) return "";
    if (active.dataset.adminView) return active.dataset.adminView;
    if (active.hasAttribute("data-shops-review")) return "shops-pending";
    if (active.hasAttribute("data-shops-admin")) return "shops-all";
    if (active.hasAttribute("data-events-review")) return "events-pending";
    if (active.hasAttribute("data-events-admin")) return "events-all";
    if (active.hasAttribute("data-reports-admin")) return "reports";
    if (active.hasAttribute("data-info-admin")) return "info";
    if (active.hasAttribute("data-user-edits-view")) return "user-edits";
    if (active.hasAttribute("data-expanded-businesses-view")) return "expanded";
    if (active.dataset.businessView) return active.dataset.businessView;
    return "";
  }

  function ensureStyle() {
    if (document.getElementById("admin-ux-integration-style")) return;
    const style = document.createElement("style");
    style.id = "admin-ux-integration-style";
    style.textContent = `
      .admin-context-help{margin:0 0 14px;border:1px solid #d7deea;border-radius:12px;background:#f8fafc;padding:10px 12px}
      .admin-context-help summary{cursor:pointer;font-weight:800;color:#24324a}
      .admin-context-help p{margin:8px 0 0;color:#52627a;line-height:1.5}
    `;
    document.head.appendChild(style);
  }

  function localizeVisibleLabels() {
    document.querySelectorAll('input[data-ext="is_highlighted"]').forEach(input => {
      const label = input.closest("label");
      if (!label) return;
      Array.from(label.childNodes).forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.nodeValue?.includes("Highlighted")) {
          node.nodeValue = node.nodeValue.replace(/Highlighted/g, "Откроена");
        }
      });
    });

    const content = document.querySelector(".admin-content");
    if (content) {
      const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        if (node.nodeValue?.includes("Highlighted")) {
          node.nodeValue = node.nodeValue.replace(/Highlighted/g, "Откроена");
        }
      }
    }

    document.querySelectorAll("[data-report-review]").forEach(button => {
      if (button.textContent.trim() === "Обработи") button.textContent = "Прегледай и обработи";
    });
  }

  function renderContextHelp() {
    document.querySelectorAll("[data-admin-context-help]").forEach(node => node.remove());
    const help = HELP[activeContextKey()];
    const content = document.querySelector(".admin-content");
    const heading = content?.querySelector(".block-heading");
    if (!help || !content || !heading) return;

    const box = document.createElement("details");
    box.className = "admin-context-help";
    box.dataset.adminContextHelp = "1";
    const summary = document.createElement("summary");
    summary.textContent = `Как работи — ${help.title}`;
    const paragraph = document.createElement("p");
    paragraph.textContent = help.text;
    box.append(summary, paragraph);
    heading.after(box);
  }

  function syncPresentation() {
    ensureStyle();
    localizeVisibleLabels();
    renderContextHelp();
  }

  async function refreshActionableCount() {
    if (!client || !currentProfile) return;
    const sources = [
      ["questions", "id"],
      ["answers", "id"],
      ["businesses", "id"],
      ["listings", "id"],
      ["user_content_edit_drafts", "id"],
      ["business_expanded_profile_drafts", "business_id"],
      ["shops", "id"],
      ["events", "id"],
      ["reports", "id"]
    ];
    if (currentProfile.role === "admin") {
      sources.push(["info_submissions", "id"], ["info_error_reports", "id"]);
    }

    const results = await Promise.all(sources.map(([table, key]) =>
      client.from(table).select(key, { count:"exact", head:true }).eq("status", "pending")
    ));
    const failed = results.map((result, index) => result.error ? sources[index][0] : "").filter(Boolean);
    if (failed.length) {
      console.warn("Оперативният брояч не можа да провери:", failed.join(", "));
      return;
    }

    const total = results.reduce((sum, result) => sum + (result.count || 0), 0);
    const stat = document.querySelector("#admin-pending-count");
    const badge = document.querySelector("#admin-menu-badge");
    if (stat) stat.textContent = String(total);
    if (badge) {
      badge.textContent = String(total);
      badge.hidden = total === 0;
    }

    const panelName = currentProfile.role === "admin" ? "Административен" : "Модераторски";
    document.title = total > 0
      ? `(${total}) ${panelName} панел | Попитай.Лом`
      : `${panelName} панел | Попитай.Лом`;
  }

  function schedulePresentation() {
    window.setTimeout(syncPresentation, 60);
    window.setTimeout(syncPresentation, 450);
  }

  function scheduleCountRefresh() {
    window.clearTimeout(countTimer);
    countTimer = window.setTimeout(refreshActionableCount, 950);
  }

  function isModerationAction(target) {
    return Boolean(target?.closest?.([
      "[data-admin-action]",
      "[data-business-action]",
      "[data-shop-action]",
      "[data-event-action]",
      "[data-report-action]",
      "[data-user-edit-action]",
      "[data-expanded-action]",
      "[data-sub-return]",
      "[data-sub-reject]",
      "[data-approve-add]",
      "[data-apply-correction]",
      "[data-report-return]",
      "[data-report-reject]",
      "[data-resolve-report]"
    ].join(",")));
  }

  async function init() {
    try {
      if (!(await loadStaffProfile())) return;
      if (!(await waitForShell())) return;
      syncPresentation();
      window.setTimeout(syncPresentation, 900);
      await refreshActionableCount();

      document.addEventListener("click", event => {
        if (event.target?.closest?.(".admin-menu button") || event.target?.closest?.(".admin-content button")) {
          schedulePresentation();
        }
        if (isModerationAction(event.target)) scheduleCountRefresh();
      }, true);
    } catch (error) {
      console.warn("Admin UX integration", error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once:true });
  } else {
    init();
  }
})();
