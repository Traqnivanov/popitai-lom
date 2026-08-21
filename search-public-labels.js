(() => {
  "use strict";

  if (typeof STATIC_SEARCH_RECORDS === "undefined" || !Array.isArray(STATIC_SEARCH_RECORDS)) return;

  const publicLabels = {
    "Работа и услуги": {
      title: "Услуги",
      desc: "Услуги, предлагани от местни хора и фирми."
    },
    "Събития и град": {
      title: "Събития",
      desc: "Предстоящи и актуални събития в Лом."
    }
  };

  STATIC_SEARCH_RECORDS.forEach(record => {
    const replacement = publicLabels[record.title];
    if (!replacement) return;
    record.title = replacement.title;
    record.desc = replacement.desc;
  });
})();
