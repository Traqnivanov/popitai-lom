(() => {
  "use strict";

  const original = window.markContactRead;
  if (typeof original !== "function") return;

  window.markContactRead = async (id, btn) => {
    const client = window.PopitaiSupabase;
    const message = document.querySelector("#admin-panel-message, .admin-panel-message");

    if (!client) {
      if (message) {
        message.textContent = "Няма връзка със системата. Опитай отново.";
        message.hidden = false;
        message.classList.add("error");
      }
      return;
    }

    const { error } = await client
      .from("contact_messages")
      .update({ is_read: true })
      .eq("id", id);

    if (error) {
      if (message) {
        const raw = String(error.message || "").toLowerCase();
        message.textContent = raw.includes("failed to fetch") || raw.includes("network")
          ? "Няма връзка със системата. Провери интернет връзката."
          : raw.includes("permission denied") || raw.includes("row-level security")
            ? "Съобщението не може да се отбележи като прочетено поради липсващо право."
            : "Съобщението не може да се отбележи като прочетено.";
        message.hidden = false;
        message.classList.add("error");
      }
      return;
    }

    if (message) {
      message.textContent = "";
      message.hidden = true;
      message.classList.remove("error");
    }
    const article = btn?.closest?.("article");
    if (article) article.style.borderLeftColor = "#d7deea";
    btn?.remove?.();
  };
})();
