(() => {
  "use strict";

  const publicRoot = document.querySelector("[data-info-institutions-root]");
  const stagingRoot = document.querySelector('[data-info-category-root="institucii"][data-institutions-staging]');
  if (!publicRoot || !stagingRoot) return;

  let finished = false;
  let observer = null;
  let timeoutId = null;

  function showError() {
    if (finished) return;
    finished = true;
    observer?.disconnect();
    if (timeoutId) clearTimeout(timeoutId);
    publicRoot.innerHTML = '<article class="info-empty"><strong>Информацията за институциите не може да се зареди.</strong><br>Опитай отново след малко.</article>';
    stagingRoot.remove();
  }

  function isReady() {
    const priority = stagingRoot.querySelector('[data-approved-priority-institutions]');
    if (!priority || priority.dataset.finalTwoApplied !== "true") return false;

    const regional = stagingRoot.querySelector('#institucii-oblastna');
    const emergency = stagingRoot.querySelector('#institucii-speshna');
    const directory = stagingRoot.querySelector('#institucii-other.info-institution-directory');
    if (!regional || !emergency || !directory) return false;

    return true;
  }

  function publish() {
    if (finished || !isReady()) return false;
    finished = true;
    observer?.disconnect();
    if (timeoutId) clearTimeout(timeoutId);

    const fragment = document.createDocumentFragment();
    while (stagingRoot.firstChild) fragment.appendChild(stagingRoot.firstChild);
    publicRoot.replaceChildren(fragment);
    publicRoot.dataset.renderOwner = "info-lom-institutions-owner-v1";
    stagingRoot.remove();

    if (location.hash) {
      requestAnimationFrame(() => {
        document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: "start" });
      });
    }
    return true;
  }

  function start() {
    if (publish()) return;

    observer = new MutationObserver(() => publish());
    observer.observe(stagingRoot, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-final-two-applied", "id"]
    });

    timeoutId = setTimeout(() => {
      if (!publish()) showError();
    }, 30000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
