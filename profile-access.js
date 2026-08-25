// Попитай.Лом — ясно управление на бутоните в личния профил
(() => {
  const client = window.PopitaiSupabase;
  if (!client) return;

  const actions = document.querySelector(".profile-actions");
  if (!actions) return;

  const loginButton = actions.querySelector('a[href="vhod.html"]');
  const logoutButton = document.querySelector("#logout-button");
  let adminButton = document.querySelector("#profile-admin-button");
  const passwordHeading = document.querySelector("#profile-password-heading");
  const passwordForm = document.querySelector("#change-password-form");

  if (!adminButton) {
    adminButton = document.createElement("a");
    adminButton.id = "profile-admin-button";
    adminButton.className = "primary-link-button";
    adminButton.href = "admin.html";
    adminButton.textContent = "Административен панел";
    actions.insertBefore(adminButton, logoutButton || null);
  }

  function show(element, visible) {
    if (!element) return;
    element.hidden = !visible;
    element.style.setProperty("display", visible ? "inline-flex" : "none", "important");
  }

  async function refreshProfileActions() {
    const { data, error } = await client.auth.getUser();
    const user = error ? null : data?.user || null;

    show(loginButton, !user);
    show(logoutButton, Boolean(user));
    show(adminButton, false);
    if (passwordHeading) passwordHeading.hidden = !user;
    if (passwordForm) passwordForm.hidden = !user;

    if (!user) return;

    const { data: profile } = await client
      .from("profiles")
      .select("role, is_blocked")
      .eq("id", user.id)
      .maybeSingle();

    const isStaff = profile && ["admin", "moderator"].includes(profile.role) && !profile.is_blocked;
    show(adminButton, Boolean(isStaff));
  }

  refreshProfileActions();
  window.setTimeout(refreshProfileActions, 500);
  window.setTimeout(refreshProfileActions, 1500);
  client.auth.onAuthStateChange(() => refreshProfileActions());
})();
