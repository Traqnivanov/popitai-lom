// Попитай.Лом — публична конфигурация на Supabase
// Publishable key е предназначен за използване в браузъра.
(() => {
  if (!window.supabase || typeof window.supabase.createClient !== "function") {
    console.error("Supabase библиотеката не е заредена.");
    return;
  }

  window.PopitaiSupabase = window.supabase.createClient(
    "https://dfhukfnuxkynjlxcprbc.supabase.co",
    "sb_publishable_2uHVqf-RKxDxy-IB73b88g_lqxjp58G",
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  );

  function prepareAuthoritativeSearch() {
    const searchIds = [
      "search-form", "main-search", "clear-search", "search-suggestions",
      "results-search-form", "results-search-input", "search-results", "results-count"
    ];
    const entries = searchIds
      .map((id) => ({ id, element: document.getElementById(id) }))
      .filter((entry) => entry.element);

    if (!entries.length) return;

    const guard = {
      entries,
      domReady: false,
      restored: false,
      restore() {
        if (this.restored) return;
        this.entries.forEach(({ id, element }) => {
          element.id = id;
        });
        this.restored = true;
      }
    };

    window.PopitaiSearchStage2Guard = guard;
    entries.forEach(({ id, element }) => {
      element.id = `stage2-guard-${id}`;
    });

    document.addEventListener("DOMContentLoaded", () => {
      guard.domReady = true;
    }, { once: true });

    function initSearchFallback() {
      guard.restore();
      const searchForm = document.getElementById("search-form");
      const searchInput = document.getElementById("main-search");
      searchForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        const query = searchInput?.value.trim() || "";
        if (query) window.location.href = `tarsene.html?q=${encodeURIComponent(query)}`;
      });

      const results = document.getElementById("search-results");
      const count = document.getElementById("results-count");
      if (results) {
        if (count) count.textContent = "Търсенето временно не е достъпно.";
        results.innerHTML = '<article class="empty-card"><h2>Търсенето временно не е достъпно</h2><p>Опитай отново след малко или разгледай категориите.</p></article>';
      }
    }

    const searchScript = document.createElement("script");
    searchScript.src = "public-search-v1.js?v=20260830-stage2";
    searchScript.dataset.popitaiPublicSearch = "true";
    searchScript.onerror = () => {
      if (guard.domReady || document.readyState === "complete") {
        initSearchFallback();
      } else {
        document.addEventListener("DOMContentLoaded", initSearchFallback, { once: true });
      }
    };
    document.body.appendChild(searchScript);
  }

  prepareAuthoritativeSearch();

  function appendScript(src, dataName) {
    if (document.querySelector(`script[data-${dataName}]`)) return;
    const script = document.createElement("script");
    script.src = src;
    script.dataset[dataName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] = "true";
    document.body.appendChild(script);
  }

  window.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector("#info-lom-home-v1")) {
      appendScript("info-home-links.js?v=20260814-0223", "popitai-info-home-links");
    }

    if (document.querySelector(".profile-actions")) {
      appendScript("profile-access.js?v=20260806-0105", "popitai-profile-access");
    }

    if (document.querySelector("#profile-businesses")) {
      appendScript("profile-business-edit-link.js?v=20260806-0505", "popitai-profile-business-edit");
    }

    if (document.querySelector("#company-form")) {
      appendScript("business-form-validation.js?v=20260806-0301", "popitai-business-validation");
      appendScript("business-form-live-validation.js?v=20260806-0318", "popitai-business-live-validation");
      appendScript("business-image-rules.js?v=20260806-0402", "popitai-business-image-rules");

      if (new URLSearchParams(window.location.search).has("edit")) {
        appendScript("business-edit-resubmit-fix.js?v=20260806-0558", "popitai-business-edit-resubmit-fix");
      }
    }

    const hasBusinessPage = document.querySelector("#company-form, #businesses-list, #business-detail-name");
    if (hasBusinessPage) {
      appendScript("supabase-businesses.js?v=20260806-0208", "popitai-businesses");
    }

    const hasAdminPage = document.querySelector("#admin-view-content, .admin-content")
      && document.body?.dataset.skipSupabaseContent === "true";
    if (hasAdminPage) {
      appendScript("admin-businesses.js?v=20260824-2140", "popitai-admin-businesses");
    }

    const detailTitle = document.querySelector("#question-detail-title");
    if (detailTitle) {
      const restoreDatabaseDetail = () => {
        const text = detailTitle.textContent.trim();
        if (text && text !== "Зареждане на въпроса…" && text !== "Въпросът не е намерен") {
          const detailCard = document.querySelector("#question-detail-card");
          const notFound = document.querySelector("#question-not-found");
          const answerArea = document.querySelector("#question-answer-area");
          if (detailCard) detailCard.hidden = false;
          if (notFound) notFound.hidden = true;
          if (answerArea) answerArea.hidden = false;
        }
      };
      new MutationObserver(restoreDatabaseDetail).observe(detailTitle, { childList: true, subtree: true, characterData: true });
      restoreDatabaseDetail();

      appendScript("question-answers-authoritative.js?v=20260806-0038", "popitai-approved-answers");
    }

    if (document.body?.dataset.skipSupabaseContent === "true") return;
    appendScript("supabase-content.js?v=20260806-0016", "popitai-supabase-content");
  }, { once: true });
})();
