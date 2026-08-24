(() => {
  "use strict";

  let client = null;
  let currentRole = null;

  async function getClient() {
    if (window.PopitaiSupabase) return window.PopitaiSupabase;
    return new Promise((resolve, reject) => {
      let tries = 0;
      const timer = window.setInterval(() => {
        tries += 1;
        if (window.PopitaiSupabase) {
          window.clearInterval(timer);
          resolve(window.PopitaiSupabase);
        } else if (tries >= 100) {
          window.clearInterval(timer);
          reject(new Error("Supabase client timeout"));
        }
      }, 50);
    });
  }

  function installStyle() {
    if (document.getElementById("admin-role-guard-style")) return;
    const style = document.createElement("style");
    style.id = "admin-role-guard-style";
    style.textContent = `
      body[data-staff-role="moderator"] [data-admin-action="delete"],
      body[data-staff-role="moderator"] [data-business-action="delete"],
      body[data-staff-role="moderator"] [data-event-action="delete"],
      body[data-staff-role="moderator"] [data-expanded-action="grant"],
      body[data-staff-role="moderator"] [data-expanded-action="revoke"],
      body[data-staff-role="moderator"] label:has(.listing-ext-check) {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  function isForbiddenModeratorAction(target) {
    if (currentRole !== "moderator") return false;
    return Boolean(target.closest(
      '[data-admin-action="delete"], [data-business-action="delete"], [data-event-action="delete"], [data-expanded-action="grant"], [data-expanded-action="revoke"]'
    ));
  }

  function showBlockedMessage() {
    const box = document.querySelector("#admin-panel-message, .admin-panel-message");
    if (box) {
      box.textContent = "Това действие е само за Admin.";
      box.hidden = false;
      box.classList.add("error");
      return;
    }
    window.alert("Това действие е само за Admin.");
  }

  async function init() {
    try {
      client = await getClient();
      const { data: authData, error: authError } = await client.auth.getUser();
      if (authError || !authData?.user) return;
      const { data: profile, error: profileError } = await client
        .from("profiles")
        .select("role,is_blocked")
        .eq("id", authData.user.id)
        .maybeSingle();
      if (profileError || !profile || profile.is_blocked === true) return;
      if (!["admin", "moderator"].includes(profile.role)) return;
      currentRole = profile.role;
      document.body.dataset.staffRole = currentRole;
      installStyle();
    } catch (error) {
      console.warn("Admin role guard", error);
    }
  }

  document.addEventListener("click", (event) => {
    if (!isForbiddenModeratorAction(event.target)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    showBlockedMessage();
  }, true);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();