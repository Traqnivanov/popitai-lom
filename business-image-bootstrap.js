// Попитай.Лом — зареждане на снимките според ролята на потребителя
(() => {
  "use strict";

  const galleryRoot = document.querySelector("#company-gallery-uploader");
  const submitButton = document.querySelector("#company-form .form-submit");
  if (!galleryRoot) return;

  function loadUploader() {
    return new Promise((resolve, reject) => {
      if (window.PopitaiImages) {
        window.PopitaiImages.initAll?.();
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "image-upload.js?v=20260806-0430";
      script.onload = resolve;
      script.onerror = () => reject(new Error("Модулът за снимки не може да се зареди."));
      document.head.appendChild(script);
    });
  }

  async function isCurrentUserAdmin() {
    const client = window.PopitaiSupabase;
    if (!client) return false;

    const { data: authData, error: authError } = await client.auth.getUser();
    const user = authError ? null : authData?.user || null;
    if (!user) return false;

    const { data: profile, error: profileError } = await client
      .from("profiles")
      .select("role, is_blocked")
      .eq("id", user.id)
      .maybeSingle();

    return !profileError && profile?.role === "admin" && !profile.is_blocked;
  }

  async function init() {
    if (submitButton) submitButton.disabled = true;

    try {
      if (await isCurrentUserAdmin()) {
        galleryRoot.dataset.maxFiles = String(Number.MAX_SAFE_INTEGER);
        galleryRoot.dataset.adminUnlimited = "true";
        const count = galleryRoot.querySelector("[data-image-count]");
        if (count) count.hidden = true;
      }

      await loadUploader();
    } catch (error) {
      console.error(error);
      const status = galleryRoot.querySelector("[data-image-status]");
      if (status) {
        status.textContent = "Снимките не могат да се заредят. Обнови страницата.";
        status.className = "image-upload-status is-error";
      }
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  }

  init();
})();
