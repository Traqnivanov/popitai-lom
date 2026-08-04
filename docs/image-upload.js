(() => {
  "use strict";

  const DB_NAME = "popitaiMediaDB";
  const DB_VERSION = 1;
  const STORE_NAME = "media";
  const DEFAULT_WIDTHS = [480, 960, 1600];
  const DEFAULT_QUALITY = 0.82;
  const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
  const states = new Map();
  const liveObjectUrls = new Set();

  function formatBytes(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
    if (bytes < 1024) return `${Math.round(bytes)} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(bytes >= 10 * 1024 * 1024 ? 1 : 2)} MB`;
  }

  function uid(prefix = "img") {
    if (globalThis.crypto?.randomUUID) return `${prefix}-${crypto.randomUUID()}`;
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: "key" });
          store.createIndex("entityId", "entityId", { unique: false });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Базата за снимки не може да се отвори."));
    });
  }

  async function putRecord(record) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).put(record);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error || new Error("Снимката не може да се запази."));
      };
    });
  }

  async function getRecord(key) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const request = tx.objectStore(STORE_NAME).get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error || new Error("Снимката не може да се прочете."));
      tx.oncomplete = () => db.close();
    });
  }

  async function deleteEntity(entityId) {
    if (!entityId) return;
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const index = store.index("entityId");
      const request = index.openCursor(IDBKeyRange.only(String(entityId)));
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error || new Error("Снимките не могат да се изтрият."));
      };
    });
  }

  function createObjectUrl(blob) {
    const url = URL.createObjectURL(blob);
    liveObjectUrls.add(url);
    return url;
  }

  function revokeObjectUrl(url) {
    if (!url) return;
    URL.revokeObjectURL(url);
    liveObjectUrls.delete(url);
  }

  window.addEventListener("pagehide", () => {
    liveObjectUrls.forEach(url => URL.revokeObjectURL(url));
    liveObjectUrls.clear();
  });

  async function loadImageSource(file) {
    if ("createImageBitmap" in window) {
      try {
        return await createImageBitmap(file, { imageOrientation: "from-image" });
      } catch {
        // Продължава към резервния вариант.
      }
    }

    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => {
        URL.revokeObjectURL(url);
        resolve(image);
      };
      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Снимката не може да се отвори."));
      };
      image.src = url;
    });
  }

  function sourceDimensions(source) {
    return {
      width: source.naturalWidth || source.width,
      height: source.naturalHeight || source.height
    };
  }

  function canvasToBlob(canvas, quality) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (blob) {
          resolve(blob);
          return;
        }
        canvas.toBlob(fallback => {
          if (fallback) resolve(fallback);
          else reject(new Error("Снимката не може да се компресира."));
        }, "image/jpeg", quality);
      }, "image/webp", quality);
    });
  }

  async function resizeSource(source, originalWidth, originalHeight, targetWidth, quality) {
    const width = Math.max(1, Math.min(targetWidth, originalWidth));
    const height = Math.max(1, Math.round(originalHeight * (width / originalWidth)));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) throw new Error("Браузърът не може да обработи снимката.");

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(source, 0, 0, width, height);

    const blob = await canvasToBlob(canvas, quality);
    return {
      blob,
      width,
      height,
      bytes: blob.size,
      mime: blob.type || "image/webp"
    };
  }

  function requestedWidths(root) {
    const values = String(root.dataset.widths || "")
      .split(",")
      .map(value => Number.parseInt(value.trim(), 10))
      .filter(value => Number.isFinite(value) && value > 0);
    return values.length ? values : DEFAULT_WIDTHS;
  }

  function createVariantMap(generated, widths, originalWidth) {
    const widthFor = target => Math.min(target, originalWidth);
    const byWidth = new Map(generated.map(item => [item.width, item]));
    const first = byWidth.get(widthFor(widths[0])) || generated[0];
    const middleTarget = widths[Math.min(1, widths.length - 1)];
    const lastTarget = widths[widths.length - 1];
    const middle = byWidth.get(widthFor(middleTarget)) || generated.at(-1);
    const last = byWidth.get(widthFor(lastTarget)) || generated.at(-1);
    return { thumb: first, medium: middle, large: last };
  }

  function getElements(root) {
    return {
      input: root.querySelector('input[type="file"]'),
      dropzone: root.querySelector("[data-image-dropzone]"),
      preview: root.querySelector("[data-image-preview]"),
      status: root.querySelector("[data-image-status]"),
      count: root.querySelector("[data-image-count]")
    };
  }

  function setStatus(state, message, kind = "") {
    const { status } = state.elements;
    if (!status) return;
    status.textContent = message;
    status.className = `image-upload-status${kind ? ` ${kind}` : ""}`;
  }

  function updateCount(state) {
    const active = state.items.filter(item => !item.removed).length;
    if (state.elements.count) {
      state.elements.count.textContent = `${active} / ${state.maxFiles}`;
    }
  }

  function renderProcessingCard(state, item) {
    const card = document.createElement("article");
    card.className = "image-preview-card is-processing";
    card.dataset.imageId = item.id;
    card.innerHTML = `
      <div class="image-preview-placeholder" aria-hidden="true">
        <span class="image-spinner"></span>
      </div>
      <div class="image-preview-info">
        <strong>${escapeText(item.file.name)}</strong>
        <span>Обработване…</span>
      </div>
      <button class="image-remove-button" type="button" aria-label="Премахни снимката">Премахни</button>
    `;
    card.querySelector(".image-remove-button").addEventListener("click", () => removeItem(state, item.id));
    state.elements.preview?.append(card);
    item.card = card;
  }

  function escapeText(value) {
    return String(value || "").replace(/[&<>"']/g, character => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[character]));
  }

  function renderReadyCard(state, item) {
    if (item.removed || !item.card) return;
    const variants = item.variants;
    const uniqueVariants = [...new Map(
      Object.values(variants).map(variant => [variant.width, variant])
    ).values()];
    const totalOptimized = uniqueVariants.reduce((sum, variant) => sum + variant.bytes, 0);
    const details = uniqueVariants
      .map(variant => `${variant.width}px: ${formatBytes(variant.bytes)}`)
      .join(" · ");

    item.previewUrl = createObjectUrl(variants.thumb.blob);
    item.card.className = "image-preview-card";
    item.card.innerHTML = `
      <img src="${item.previewUrl}" width="${variants.thumb.width}" height="${variants.thumb.height}" alt="">
      <div class="image-preview-info">
        <strong>${escapeText(item.file.name)}</strong>
        <span>${item.originalWidth} × ${item.originalHeight}px · ${formatBytes(item.file.size)} оригинал</span>
        <span>${formatBytes(totalOptimized)} общо за размерите</span>
        <small>${details}</small>
        <small>При показване се зарежда само подходящият размер.</small>
        <label>
          Описание на снимката
          <input type="text" maxlength="120" value="${escapeText(item.caption)}" data-image-caption placeholder="Например: Окачен таван от гипсокартон">
        </label>
      </div>
      <button class="image-remove-button" type="button" aria-label="Премахни снимката">Премахни</button>
    `;
    item.card.querySelector("[data-image-caption]").addEventListener("input", event => {
      item.caption = event.target.value.trim();
    });
    item.card.querySelector(".image-remove-button").addEventListener("click", () => removeItem(state, item.id));
  }

  function renderErrorCard(state, item, message) {
    if (item.removed || !item.card) return;
    item.card.className = "image-preview-card has-error";
    item.card.innerHTML = `
      <div class="image-preview-placeholder" aria-hidden="true">!</div>
      <div class="image-preview-info">
        <strong>${escapeText(item.file.name)}</strong>
        <span>${escapeText(message)}</span>
      </div>
      <button class="image-remove-button" type="button">Премахни</button>
    `;
    item.card.querySelector(".image-remove-button").addEventListener("click", () => removeItem(state, item.id));
  }

  function removeItem(state, id) {
    const item = state.items.find(candidate => candidate.id === id);
    if (!item) return;
    item.removed = true;
    revokeObjectUrl(item.previewUrl);
    item.card?.remove();
    updateCount(state);
    setStatus(state, "Снимката е премахната.");
  }

  async function processItem(state, item) {
    if (item.removed) return;
    try {
      const source = await loadImageSource(item.file);
      const { width: originalWidth, height: originalHeight } = sourceDimensions(source);
      if (!originalWidth || !originalHeight) throw new Error("Невалидни размери на снимката.");

      item.originalWidth = originalWidth;
      item.originalHeight = originalHeight;

      const actualWidths = [...new Set(
        state.widths.map(width => Math.min(width, originalWidth))
      )].sort((a, b) => a - b);

      const generated = [];
      for (const width of actualWidths) {
        if (item.removed) break;
        generated.push(await resizeSource(
          source,
          originalWidth,
          originalHeight,
          width,
          state.quality
        ));
      }

      if (typeof source.close === "function") source.close();
      if (item.removed) return;

      item.variants = createVariantMap(generated, state.widths, originalWidth);
      item.ready = true;
      renderReadyCard(state, item);
      setStatus(state, "Снимките са готови за публикуване.", "is-success");
    } catch (error) {
      item.error = error instanceof Error ? error.message : "Неуспешна обработка.";
      renderErrorCard(state, item, item.error);
      setStatus(state, item.error, "is-error");
    } finally {
      updateCount(state);
    }
  }

  function validateFile(state, file) {
    if (!ALLOWED_TYPES.has(file.type)) {
      return "Позволени са JPG, PNG и WebP.";
    }
    if (file.size > state.maxBytes) {
      return `Файлът е над позволените ${state.maxMb} MB.`;
    }
    return "";
  }

  function addFiles(state, fileList) {
    const files = [...fileList];
    if (!files.length) return;

    const currentCount = state.items.filter(item => !item.removed).length;
    const remaining = Math.max(0, state.maxFiles - currentCount);
    const accepted = files.slice(0, remaining);

    if (files.length > remaining) {
      setStatus(state, `Можеш да добавиш най-много ${state.maxFiles} снимки.`, "is-error");
    }

    accepted.forEach(file => {
      const validationMessage = validateFile(state, file);
      const item = {
        id: uid("upload"),
        file,
        caption: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim(),
        ready: false,
        removed: false,
        error: ""
      };
      state.items.push(item);
      renderProcessingCard(state, item);

      if (validationMessage) {
        item.error = validationMessage;
        renderErrorCard(state, item, validationMessage);
        return;
      }

      state.queue = state.queue.then(() => processItem(state, item));
    });

    updateCount(state);
    if (state.elements.input) state.elements.input.value = "";
  }

  function initUploader(root) {
    if (!root.id || states.has(root.id)) return;
    const elements = getElements(root);
    if (!elements.input) return;

    const maxFiles = Number.parseInt(root.dataset.maxFiles || "6", 10);
    const maxMb = Number.parseFloat(root.dataset.maxMb || "10");
    const quality = Number.parseFloat(root.dataset.quality || String(DEFAULT_QUALITY));
    const state = {
      root,
      elements,
      items: [],
      maxFiles: Number.isFinite(maxFiles) ? maxFiles : 6,
      maxMb: Number.isFinite(maxMb) ? maxMb : 10,
      maxBytes: (Number.isFinite(maxMb) ? maxMb : 10) * 1024 * 1024,
      quality: Number.isFinite(quality) ? Math.min(0.95, Math.max(0.65, quality)) : DEFAULT_QUALITY,
      widths: requestedWidths(root),
      queue: Promise.resolve()
    };
    states.set(root.id, state);

    elements.input.addEventListener("change", () => addFiles(state, elements.input.files || []));

    if (elements.dropzone) {
      ["dragenter", "dragover"].forEach(type => {
        elements.dropzone.addEventListener(type, event => {
          event.preventDefault();
          elements.dropzone.classList.add("is-dragging");
        });
      });
      ["dragleave", "drop"].forEach(type => {
        elements.dropzone.addEventListener(type, event => {
          event.preventDefault();
          elements.dropzone.classList.remove("is-dragging");
        });
      });
      elements.dropzone.addEventListener("drop", event => {
        addFiles(state, event.dataTransfer?.files || []);
      });
    }

    updateCount(state);
  }

  async function commit(rootId, entityType, entityId) {
    const state = states.get(rootId);
    if (!state) return [];
    await state.queue;

    const failed = state.items.filter(item => !item.removed && item.error);
    if (failed.length) throw new Error("Премахни неуспешните снимки преди публикуване.");

    const readyItems = state.items.filter(item => !item.removed && item.ready);
    const result = [];

    for (const item of readyItems) {
      const storedByWidth = new Map();
      const metadataVariants = {};

      for (const [variantName, variant] of Object.entries(item.variants)) {
        let stored = storedByWidth.get(variant.width);
        if (!stored) {
          const extension = variant.mime.includes("webp") ? "webp" : "jpg";
          const key = `media/${entityType}/${entityId}/${item.id}-${variant.width}.${extension}`;
          stored = {
            key,
            width: variant.width,
            height: variant.height,
            bytes: variant.bytes,
            mime: variant.mime
          };
          await putRecord({
            ...stored,
            entityType: String(entityType),
            entityId: String(entityId),
            imageId: item.id,
            blob: variant.blob,
            createdAt: new Date().toISOString()
          });
          storedByWidth.set(variant.width, stored);
        }
        metadataVariants[variantName] = stored;
      }

      result.push({
        id: item.id,
        role: state.root.dataset.role || "gallery",
        originalName: item.file.name,
        originalWidth: item.originalWidth,
        originalHeight: item.originalHeight,
        originalBytes: item.file.size,
        caption: item.caption || "",
        variants: metadataVariants
      });
    }

    return result;
  }

  async function recordToUrl(meta) {
    if (!meta?.key) return null;
    const record = await getRecord(meta.key);
    if (!record?.blob) return null;
    return {
      url: createObjectUrl(record.blob),
      width: record.width || meta.width,
      height: record.height || meta.height,
      bytes: record.bytes || meta.bytes,
      mime: record.mime || meta.mime
    };
  }

  async function renderMediaSlots(root = document) {
    const slots = [...root.querySelectorAll("[data-media-key]:not([data-media-rendered])")];
    await Promise.all(slots.map(async slot => {
      slot.dataset.mediaRendered = "true";
      const record = await getRecord(slot.dataset.mediaKey);
      if (!record?.blob) {
        slot.remove();
        return;
      }
      const url = createObjectUrl(record.blob);
      const image = document.createElement("img");
      image.src = url;
      image.width = record.width || Number(slot.dataset.mediaWidth) || 480;
      image.height = record.height || Number(slot.dataset.mediaHeight) || 360;
      image.loading = slot.dataset.mediaEager === "true" ? "eager" : "lazy";
      image.decoding = "async";
      image.alt = slot.dataset.mediaAlt || "";
      slot.append(image);
    }));
  }

  function ensureLightbox() {
    let lightbox = document.querySelector("#media-lightbox");
    if (lightbox) return lightbox;

    lightbox = document.createElement("div");
    lightbox.id = "media-lightbox";
    lightbox.className = "media-lightbox";
    lightbox.hidden = true;
    lightbox.innerHTML = `
      <button class="media-lightbox-close" type="button" aria-label="Затвори">×</button>
      <figure>
        <img alt="">
        <figcaption></figcaption>
      </figure>
    `;
    document.body.append(lightbox);

    const close = () => {
      lightbox.hidden = true;
      document.body.classList.remove("lightbox-open");
    };
    lightbox.addEventListener("click", event => {
      if (event.target === lightbox || event.target.closest(".media-lightbox-close")) close();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && !lightbox.hidden) close();
    });

    return lightbox;
  }

  function openLightbox(url, alt, caption) {
    const lightbox = ensureLightbox();
    const image = lightbox.querySelector("img");
    const figcaption = lightbox.querySelector("figcaption");
    image.src = url;
    image.alt = alt || "";
    figcaption.textContent = caption || "";
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    lightbox.querySelector(".media-lightbox-close").focus();
  }

  async function renderGallery(container, images, options = {}) {
    if (!container) return;
    if (!Array.isArray(images) || !images.length) {
      container.hidden = true;
      container.innerHTML = "";
      return;
    }

    container.hidden = false;
    container.innerHTML = "";
    const altPrefix = options.altPrefix || "Качена снимка";

    for (const [index, imageMeta] of images.entries()) {
      const [thumb, medium, large] = await Promise.all([
        recordToUrl(imageMeta.variants?.thumb),
        recordToUrl(imageMeta.variants?.medium),
        recordToUrl(imageMeta.variants?.large)
      ]);
      const selected = medium || large || thumb;
      if (!selected) continue;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "media-gallery-item";
      if (index === 0) button.classList.add("is-featured");

      const img = document.createElement("img");
      img.src = selected.url;
      const candidates = [thumb, medium, large]
        .filter(Boolean)
        .filter((item, position, array) => array.findIndex(candidate => candidate.width === item.width) === position)
        .sort((a, b) => a.width - b.width);

      if (candidates.length > 1) {
        img.srcset = candidates.map(candidate => `${candidate.url} ${candidate.width}w`).join(", ");
        img.sizes = index === 0
          ? "(max-width: 760px) 100vw, 720px"
          : "(max-width: 760px) 50vw, 360px";
      }
      img.width = selected.width;
      img.height = selected.height;
      img.loading = index === 0 ? "eager" : "lazy";
      img.fetchPriority = index === 0 ? "high" : "auto";
      img.decoding = "async";
      img.alt = imageMeta.caption || `${altPrefix} ${index + 1}`;

      button.append(img);
      const full = large || medium || thumb;
      button.addEventListener("click", () => openLightbox(
        full.url,
        img.alt,
        imageMeta.caption || ""
      ));
      container.append(button);
    }
  }

  async function renderLogo(container, imageMeta, fallbackText = "Ф") {
    if (!container || !imageMeta) return false;
    const selected = await recordToUrl(
      imageMeta.variants?.medium ||
      imageMeta.variants?.thumb ||
      imageMeta.variants?.large
    );
    if (!selected) return false;

    const image = document.createElement("img");
    image.src = selected.url;
    image.width = selected.width;
    image.height = selected.height;
    image.alt = imageMeta.caption || `Лого на ${fallbackText}`;
    image.decoding = "async";
    container.innerHTML = "";
    container.append(image);
    container.hidden = false;
    return true;
  }

  function initAll() {
    document.querySelectorAll(".image-uploader[id]").forEach(initUploader);
  }

  window.PopitaiImages = {
    commit,
    deleteEntity,
    formatBytes,
    initAll,
    renderGallery,
    renderLogo,
    renderMediaSlots
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll, { once: true });
  } else {
    initAll();
  }
})();
