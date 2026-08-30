(() => {
  "use strict";

  // Compatibility shim only. Public category labels, descriptions and routes
  // are owned by public-category-dictionary-v1.js.
  if (!window.PopitaiCategoryDictionary) return;

  if (typeof renderSearchResults === "function") {
    const query = new URLSearchParams(window.location.search).get("q") || "";
    renderSearchResults(query);
  }
})();
