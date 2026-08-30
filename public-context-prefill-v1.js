(() => {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  if (params.has("edit")) return;

  const dictionary = window.PopitaiCategoryDictionary;
  if (!dictionary) return;

  const optionExists = (select, value) => Boolean(select) && Array.from(select.options).some((option) => option.value === value);

  function applyListingPrefill() {
    const form = document.querySelector("#listing-form");
    const category = document.querySelector("#listing-category");
    if (!form || !category) return;

    const requestedCategory = String(params.get("category") || "").trim();
    if (!dictionary.listingCategories.includes(requestedCategory) || !optionExists(category, requestedCategory)) return;

    category.value = requestedCategory;
    category.dispatchEvent(new Event("change", { bubbles: true }));

    const requestedSubcategory = String(params.get("subcategory") || "").trim();
    const subcategory = document.querySelector("#listing-subcategory");
    if (
      requestedSubcategory &&
      dictionary.isValidListingSubcategory(requestedCategory, requestedSubcategory) &&
      optionExists(subcategory, requestedSubcategory)
    ) {
      subcategory.value = requestedSubcategory;
      subcategory.dispatchEvent(new Event("change", { bubbles: true }));
    }

    const requestedType = String(params.get("type") || "").trim();
    if (!requestedType) return;

    const typeField = requestedCategory === "Работа"
      ? document.querySelector("#listing-type-rabota-select")
      : requestedCategory === "Имоти"
        ? document.querySelector("#listing-type-imoti-select")
        : document.querySelector("#listing-type");

    if (!optionExists(typeField, requestedType)) return;
    typeField.value = requestedType;
    typeField.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function applyBusinessPrefill() {
    const form = document.querySelector("#company-form");
    const category = document.querySelector("#company-category");
    if (!form || !category) return;

    const publicCategoryId = String(params.get("category") || "").trim();
    if (!publicCategoryId) return;

    const item = dictionary.publicCategories.find((entry) => entry.id === publicCategoryId);
    const businessValue = String(item?.values?.business || "").trim();
    if (!businessValue || !optionExists(category, businessValue)) return;

    category.value = businessValue;
    category.dispatchEvent(new Event("change", { bubbles: true }));
  }

  applyListingPrefill();
  applyBusinessPrefill();
})();
