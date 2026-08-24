(() => {
  "use strict";

  let client = null;
  let currentProfile = null;
  let countTimer = 0;

  const INFO_LABELS = {
    "byuro-truda":"Бюро по труда",
    "dsp":"Дирекция „Социално подпомагане“",
    "imoten-registur":"Имотен регистър",
    "kadastur":"Кадастър",
    "kzp":"Комисия за защита на потребителите",
    "nap":"НАП",
    "noi":"НОИ",
    "oblastna":"Областна администрация",
    "odbh":"Областна дирекция по безопасност на храните",
    "osz":"Общинска служба по земеделие",
    "poshta":"Поща",
    "prokuratura":"Прокуратура",
    "riosv":"РИОСВ",
    "rzi":"РЗИ",
    "rzok":"РЗОК",
    "sud":"Съд"
  };

  const HELP = {
    dashboard: {
      title: "Начало",
      text: "Тук виждаш само реалните задачи, които текущата роля може да обработи. Натисни „Прегледай“, за да отвориш съответната опашка."
    },
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
      text: "Това е входяща поща, не е списък за модерация. „Маркирай като прочетено“ променя само състоянието прочетено/непрочетено."
    },
    "shops-pending": {
      title: "Чакащи магазини",
      text: "„Одобри“ публикува предложението за магазин. „Откажи“ не го публикува и записва причината. Тук няма действие „Върни за корекция“, защото няма отделен потребителски поток за корекция."
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
      text: "„Маркирай като обработен“ означава, че сигналът е прегледан и приключен. „Отхвърли“ го приключва като неприет. Този поток е отделен от сигналите за грешка в „Инфо Лом“."
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
      text: "Тук се обработват чакащи редакции на разширени фирмени профили. „Одобри редакцията“ публикува чакащата чернова, а „Върни за корекция“ изпраща бележка към собственика."
    },
    "expanded-access": {
      title: "Достъп до разширен профил",
      text: "Този Admin-only раздел управлява дали фирмата има право да използва разширените секции. Даване или отнемане на достъп не изтрива вече запазените разширени данни."
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
    currentProfile = { ...profile, id: user.id };
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
    const currentTitle = document.querySelector("#admin-view-title")?.textContent?.trim() || "";
    if (currentTitle === "Какво има за преглед" || currentTitle === "Начало") return "dashboard";
    const active = document.querySelector(".admin-menu button.active");
    if (!active) return "";
    if (active.dataset.adminView) return active.dataset.adminView;
    if (active.hasAttribute("data-shops-review")) return "shops-pending";
    if (active.hasAttribute("data-shops-admin")) return "shops-all";
    if (active.hasAttribute("data-events-review")) return "events-pending";
    if (active.hasAttribute("data-events-admin")) return "events-all";
    if (active.hasAttribute("data-reports-admin")) return "reports";
    if (active.hasAttribute("data-info-admin") || active.hasAttribute("data-info-moderator-review") || active.hasAttribute("data-info-review-shortcut")) return "info";
    if (active.hasAttribute("data-user-edits-view")) return "user-edits";
    if (active.hasAttribute("data-expanded-businesses-view")) return "expanded";
    if (active.hasAttribute("data-expanded-access-view")) return "expanded-access";
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

  function ensureOperationalStatLabel() {
    const stat = document.querySelector("#admin-pending-count");
    const label = stat?.closest("article")?.querySelector("span");
    if (label) label.textContent = "Задачи за преглед";
  }

  function organizeBusinessButtons() {
    const review = document.querySelector('.admin-menu [data-admin-menu-group-items="review"]');
    const content = document.querySelector('.admin-menu [data-admin-menu-group-items="content"]');
    if (!review || !content) return;
    const pending = document.querySelector('.admin-menu [data-business-view="businesses-pending"]');
    const approved = document.querySelector('.admin-menu [data-business-view="businesses-approved"]');
    const hidden = document.querySelector('.admin-menu [data-business-view="businesses-hidden"]');
    if (pending && pending.parentElement !== review) review.appendChild(pending);
    if (approved && approved.parentElement !== content) content.appendChild(approved);
    if (hidden && hidden.parentElement !== content) content.appendChild(hidden);
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
        let value = node.nodeValue || "";
        if (value.includes("Highlighted")) value = value.replace(/Highlighted/g, "Откроена");
        const trimmed = value.trim();
        if (Object.prototype.hasOwnProperty.call(INFO_LABELS, trimmed)) {
          value = value.replace(trimmed, INFO_LABELS[trimmed]);
        }
        if (value.includes("·")) value = value.replace(/\s*·\s*·\s*/g, " · ");
        node.nodeValue = value;
      }
    }

    document.querySelectorAll("[data-report-review]").forEach(button => {
      if (button.textContent.trim() === "Обработи") button.textContent = "Прегледай и обработи";
    });
  }

  function roleAwareHelp(key) {
    const base = HELP[key];
    if (!base) return null;
    if (currentProfile?.role !== "moderator") return base;

    const moderatorText = {
      pending: "Тук са чуждите нови въпроси, отговори и обяви, които чакат решение. Moderator може да одобри, върне за корекция или откаже според съществуващия поток. Собственото съдържание не се модерира от същия Moderator.",
      questions: "Moderator може да скрива чужд публикуван въпрос, когато потокът го позволява. Окончателното изтриване е само за Admin.",
      answers: "Moderator може да скрива чужд публикуван отговор, когато потокът го позволява. Окончателното изтриване е само за Admin.",
      hidden: "Moderator може да възстановява чуждо съдържание според потока. Окончателното изтриване е само за Admin.",
      users: "Moderator може да блокира и разблокира обикновени потребители. Не може да управлява Admin, друг Moderator или системни роли.",
      "events-pending": "Moderator може да одобри или откаже чуждо чакащо събитие. Собственото съдържание не се модерира от същия Moderator. Окончателното изтриване е само за Admin.",
      "events-all": "Moderator може да управлява чужди събития чрез разрешените обратими действия. Окончателното изтриване е само за Admin.",
      expanded: "Moderator може да обработва чужда чакаща редакция на разширен профил, когато потокът го позволява. Даване и отнемане на разширен достъп е само за Admin.",
      "businesses-pending": "Moderator може да одобри, върне за корекция или откаже чужда чакаща фирма. Собствената фирма не се модерира от същия Moderator.",
      "businesses-approved": "Moderator може да скрие чужда публикувана фирма. Окончателното изтриване и управлението на разширен достъп са само за Admin.",
      "businesses-hidden": "Moderator може да възстанови чужда скрита фирма, когато потокът го позволява. Собствената фирма няма модераторски действия. Окончателното изтриване е само за Admin."
    }[key];

    return moderatorText ? { ...base, text: moderatorText } : base;
  }

  function renderContextHelp() {
    document.querySelectorAll("[data-admin-context-help]").forEach(node => node.remove());
    const key = activeContextKey();
    const help = roleAwareHelp(key);
    const content = document.querySelector(".admin-content");
    const heading = content?.querySelector(".block-heading");
    if (!help || !content || !heading) return;

    const box = document.createElement("details");
    box.className = "admin-context-help";
    box.dataset.adminContextHelp = "1";
    const summary = document.createElement("summary");
    summary.textContent = "? Помощ";
    const title = document.createElement("strong");
    title.textContent = help.title;
    const paragraph = document.createElement("p");
    paragraph.textContent = help.text;
    box.append(summary, title, paragraph);
    heading.after(box);
  }

  function syncPresentation() {
    ensureStyle();
    ensureOperationalStatLabel();
    organizeBusinessButtons();
    localizeVisibleLabels();
    renderContextHelp();
  }

  async function countAdminPending() {
    const sources = [
      ["questions", "id"],
      ["answers", "id"],
      ["businesses", "id"],
      ["listings", "id"],
      ["user_content_edit_drafts", "id"],
      ["business_expanded_profile_drafts", "business_id"],
      ["shops", "id"],
      ["events", "id"],
      ["reports", "id"],
      ["info_submissions", "id"],
      ["info_error_reports", "id"]
    ];
    const results = await Promise.all(sources.map(([table, key]) =>
      client.from(table).select(key, { count:"exact", head:true }).eq("status", "pending")
    ));
    const failed = results.map((result, index) => result.error ? sources[index][0] : "").filter(Boolean);
    if (failed.length) throw new Error(`Оперативният брояч не можа да провери: ${failed.join(", ")}`);

    const counts = {};
    sources.forEach(([table], index) => { counts[table] = results[index].count || 0; });
    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
    return { total, counts };
  }

  async function countModeratorPending() {
    const userId = currentProfile?.id;
    if (!userId) return { total:0, counts:{} };

    const businessesResult = await client.from("businesses").select("id,owner_id,is_expanded");
    if (businessesResult.error) throw businessesResult.error;
    const businessRows = businessesResult.data || [];
    const ownedBusinessIds = new Set(businessRows.filter(row => row.owner_id === userId).map(row => row.id));
    const reviewableExpandedBusinessIds = new Set(
      businessRows
        .filter(row => row.owner_id !== userId && row.is_expanded === true)
        .map(row => row.id)
    );

    const sources = [
      ["questions", "author_id"],
      ["answers", "author_id"],
      ["businesses", "owner_id"],
      ["listings", "owner_id,author_id"],
      ["user_content_edit_drafts", "owner_id"],
      ["business_expanded_profile_drafts", "business_id"],
      ["shops", "submitted_by"],
      ["events", "author_id"],
      ["reports", "reporter_id"],
      ["info_submissions", "submitted_by"],
      ["info_error_reports", "reported_by"]
    ];

    const results = await Promise.all(sources.map(([table, fields]) =>
      client.from(table).select(fields).eq("status", "pending")
    ));
    const failed = results.map((result, index) => result.error ? sources[index][0] : "").filter(Boolean);
    if (failed.length) throw new Error(`Оперативният брояч не можа да провери: ${failed.join(", ")}`);

    const counts = {};
    results.forEach((result, index) => {
      const table = sources[index][0];
      const foreign = (result.data || []).filter(row => {
        if (table === "listings") return row.owner_id !== userId && row.author_id !== userId;
        if (table === "business_expanded_profile_drafts") return reviewableExpandedBusinessIds.has(row.business_id);
        const ownerField = {
          questions:"author_id",
          answers:"author_id",
          businesses:"owner_id",
          user_content_edit_drafts:"owner_id",
          shops:"submitted_by",
          events:"author_id",
          reports:"reporter_id",
          info_submissions:"submitted_by",
          info_error_reports:"reported_by"
        }[table];
        return !ownerField || row[ownerField] !== userId;
      });
      counts[table] = foreign.length;
    });

    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
    return { total, counts };
  }
  async function refreshActionableCount() {
    if (!client || !currentProfile) return;
    try {
      const detail = currentProfile.role === "moderator"
        ? await countModeratorPending()
        : await countAdminPending();
      const total = Number(detail?.total || 0);
      const stat = document.querySelector("#admin-pending-count");
      if (stat) stat.textContent = String(total);
      ensureOperationalStatLabel();

      const panelName = currentProfile.role === "admin" ? "Административен" : "Модераторски";
      document.title = total > 0
        ? `(${total}) ${panelName} панел | Попитай.Лом`
        : `${panelName} панел | Попитай.Лом`;

      window.dispatchEvent(new CustomEvent("popitai:admin-actionable-counts", {
        detail: {
          total,
          counts: detail?.counts || {},
          role: currentProfile.role
        }
      }));
    } catch (error) {
      console.warn("Оперативният брояч не можа да се обнови:", error);
    }
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
