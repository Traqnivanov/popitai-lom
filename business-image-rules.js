// Попитай.Лом — кратки правила и проверки за фирмени изображения
(() => {
  "use strict";

  const logoRoot = document.querySelector("#company-logo-uploader");
  const galleryRoot = document.querySelector("#company-gallery-uploader");
  if (!logoRoot || !galleryRoot) return;

  const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
  const MAX_BYTES = 10 * 1024 * 1024;
  const MIN_LOGO_SIDE = 200;
  const RECOMMENDED_GALLERY_SIDE = 640;

  function injectStyles() {
    if (document.querySelector("#business-image-rules-styles")) return;
    const style = document.createElement("style");
    style.id = "business-image-rules-styles";
    style.textContent = `
      .business-image-rules-notice {
        margin: 22px 0 8px;
        font-size: 14px;
        line-height: 1.4;
      }
      .business-image-rules-notice a {
        color: #0b5fd7;
        font-weight: 800;
      }
      .business-image-dimension-message {
        margin: 8px 0 0;
        font-size: 13px;
        font-weight: 700;
        line-height: 1.45;
      }
      .business-image-dimension-message.is-warning { color: #8a5a00; }
      .business-image-dimension-message.is-error { color: #b42318; }
      .business-image-dimension-message:empty { display: none; }
    `;
    document.head.appendChild(style);
  }

  function addNotice() {
    if (document.querySelector("#business-image-rules-notice")) return;
    const notice = document.createElement("p");
    notice.id = "business-image-rules-notice";
    notice.className = "business-image-rules-notice";
    notice.innerHTML = '<a href="pravila.html#pravila-za-snimki">Правила за снимките</a>';
    logoRoot.insertAdjacentElement("beforebegin", notice);
  }

  function ensureDimensionMessage(root) {
    let element = root.querySelector("[data-business-image-dimension-message]");
    if (element) return element;
    element = document.createElement("p");
    element.className = "business-image-dimension-message";
    element.dataset.businessImageDimensionMessage = "true";
    element.setAttribute("aria-live", "polite");
    const status = root.querySelector("[data-image-status]");
    (status || root).insertAdjacentElement(status ? "afterend" : "beforeend", element);
    return element;
  }

  function setDimensionMessage(root, text = "", kind = "") {
    const element = ensureDimensionMessage(root);
    element.textContent = text;
    element.className = `business-image-dimension-message${kind ? ` is-${kind}` : ""}`;
  }

  function setUploaderStatus(root, text, kind = "is-error") {
    const status = root.querySelector("[data-image-status]");
    if (!status) return;
    status.textContent = text;
    status.className = `image-upload-status ${kind}`;
  }

  function readDimensions(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => {
        const result = { width: image.naturalWidth, height: image.naturalHeight };
        URL.revokeObjectURL(url);
        resolve(result);
      };
      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Снимката не може да се отвори."));
      };
      image.src = url;
    });
  }

  function shouldInspect(file) {
    return ALLOWED_TYPES.has(file.type) && file.size > 0 && file.size <= MAX_BYTES;
  }

  function continueToUploader(input) {
    input.dataset.businessImageRulesBypass = "true";
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function attachLogoValidation() {
    const input = logoRoot.querySelector('input[type="file"]');
    if (!input) return;

    input.addEventListener("change", async (event) => {
      if (input.dataset.businessImageRulesBypass === "true") {
        delete input.dataset.businessImageRulesBypass;
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();
      setDimensionMessage(logoRoot);

      const file = input.files?.[0];
      if (!file || !shouldInspect(file)) {
        continueToUploader(input);
        return;
      }

      try {
        const { width, height } = await readDimensions(file);
        if (width < MIN_LOGO_SIDE || height < MIN_LOGO_SIDE) {
          input.value = "";
          const message = `Логото е ${width} × ${height} px. Избери изображение поне ${MIN_LOGO_SIDE} × ${MIN_LOGO_SIDE} px.`;
          setUploaderStatus(logoRoot, message);
          setDimensionMessage(logoRoot, message, "error");
          return;
        }
        continueToUploader(input);
      } catch (_) {
        continueToUploader(input);
      }
    }, true);
  }

  function attachGalleryValidation() {
    const input = galleryRoot.querySelector('input[type="file"]');
    if (!input) return;

    input.addEventListener("change", async (event) => {
      if (input.dataset.businessImageRulesBypass === "true") {
        delete input.dataset.businessImageRulesBypass;
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();
      setDimensionMessage(galleryRoot);

      const files = [...(input.files || [])];
      if (!files.length) return;

      const inspectable = files.filter(shouldInspect);
      if (!inspectable.length) {
        continueToUploader(input);
        return;
      }

      const smallFiles = [];
      await Promise.all(inspectable.map(async (file) => {
        try {
          const { width, height } = await readDimensions(file);
          if (Math.max(width, height) < RECOMMENDED_GALLERY_SIDE) {
            smallFiles.push(file.name);
          }
        } catch (_) {
          // Основният модул ще покаже грешката, ако файлът е повреден.
        }
      }));

      if (smallFiles.length) {
        const examples = smallFiles.slice(0, 2).join(", ");
        const more = smallFiles.length > 2 ? ` и още ${smallFiles.length - 2}` : "";
        setDimensionMessage(
          galleryRoot,
          `Снимката ${examples}${more} е малка и може да изглежда неясно. Препоръчваме поне ${RECOMMENDED_GALLERY_SIDE} px по дългата страна. Можеш да продължиш.`,
          "warning"
        );
      }

      continueToUploader(input);
    }, true);
  }

  injectStyles();
  addNotice();
  ensureDimensionMessage(logoRoot);
  ensureDimensionMessage(galleryRoot);
  attachLogoValidation();
  attachGalleryValidation();
})();
