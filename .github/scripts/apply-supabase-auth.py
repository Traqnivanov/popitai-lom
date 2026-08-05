from pathlib import Path
import re

SUPABASE_URL = "https://dfhukfnuxkynjlxcprbc.supabase.co"
SUPABASE_KEY = "sb_publishable_2uHVqf-RKxDxy-IB73b88g_lqxjp58G"
VERSION = "20260805-2312"

config = f'''// Попитай.Лом — публична конфигурация на Supabase\n// Publishable key е предназначен за използване в браузъра.\n(() => {{\n  if (!window.supabase || typeof window.supabase.createClient !== "function") {{\n    console.error("Supabase библиотеката не е заредена.");\n    return;\n  }}\n\n  window.PopitaiSupabase = window.supabase.createClient(\n    "{SUPABASE_URL}",\n    "{SUPABASE_KEY}",\n    {{\n      auth: {{\n        persistSession: true,\n        autoRefreshToken: true,\n        detectSessionInUrl: true\n      }}\n    }}\n  );\n}})();\n'''
Path("supabase-config.js").write_text(config, encoding="utf-8")

auth_block = r'''// Реална регистрация и вход чрез Supabase
const supabaseClient = window.PopitaiSupabase || null;
let currentUser = null;

try {
  // Премахване на старите тестови профили, в които паролите се пазеха локално.
  localStorage.removeItem("popitaiUsers");
  localStorage.removeItem("popitaiCurrentUser");
} catch (_) {}

function setAuthMessage(selector, message, type = "warning") {
  const element = qs(selector);
  if (!element) return;
  if (window.PopitaiUi?.setFormMessage) {
    window.PopitaiUi.setFormMessage(element, message, type);
    return;
  }
  element.textContent = message;
  element.classList.remove("is-error", "is-success", "is-warning");
  element.classList.add(`is-${type}`);
}

function authErrorMessage(error, action = "login") {
  const message = String(error?.message || "").toLocaleLowerCase("en");
  const code = String(error?.code || "").toLocaleLowerCase("en");

  if (!navigator.onLine || message.includes("failed to fetch") || message.includes("network")) {
    return "Няма връзка със системата. Провери интернет връзката си и опитай отново.";
  }
  if (message.includes("invalid login credentials")) {
    return "Електронната поща или паролата не са правилни.";
  }
  if (message.includes("email not confirmed")) {
    return "Потвърди електронната си поща чрез съобщението, което ти изпратихме.";
  }
  if (message.includes("user already registered") || code.includes("user_already_exists")) {
    return "Вече има профил с тази електронна поща. Опитай да влезеш.";
  }
  if (message.includes("password") && (message.includes("least") || message.includes("weak"))) {
    return "Паролата трябва да съдържа поне 6 знака.";
  }
  if (message.includes("rate limit") || code.includes("rate_limit")) {
    return "Направени са твърде много опити. Изчакай малко и опитай отново.";
  }
  if (message.includes("invalid email")) {
    return "Въведи валиден адрес на електронна поща.";
  }

  return action === "register"
    ? "Не успяхме да създадем профила. Провери данните и опитай отново."
    : "Не успяхме да те впишем. Опитай отново след малко.";
}

function getDisplayName(user) {
  const metadataName = String(user?.user_metadata?.display_name || "").trim();
  if (metadataName) return metadataName;
  return String(user?.email || "Потребител").split("@")[0] || "Потребител";
}

function updateAuthUi(user) {
  currentUser = user
    ? { id: user.id, name: getDisplayName(user), email: user.email || "" }
    : null;
  window.PopitaiAuthUser = user || null;

  qsa(".login-link").forEach(link => {
    link.href = user ? "profil.html" : "vhod.html";
    link.textContent = user ? "Профил" : "Вход";
  });

  const profileName = qs("#profile-name");
  const profileEmail = qs("#profile-email");
  const profileAvatar = qs("#profile-avatar");
  const profileLoginButton = document.querySelector('.profile-actions a[href="vhod.html"]');
  const logoutButton = qs("#logout-button");

  if (profileName && profileEmail && profileAvatar) {
    if (user) {
      const name = getDisplayName(user);
      profileName.textContent = name;
      profileEmail.textContent = user.email || "";
      profileAvatar.textContent = name.charAt(0).toUpperCase();
      if (profileLoginButton) profileLoginButton.hidden = true;
      if (logoutButton) logoutButton.hidden = false;
    } else {
      profileName.textContent = "Посетител";
      profileEmail.textContent = "Не си влязъл в профила си.";
      profileAvatar.textContent = "П";
      if (profileLoginButton) profileLoginButton.hidden = false;
      if (logoutButton) logoutButton.hidden = true;
    }
  }

  const profileQuestionsContainer = qs("#profile-questions");
  if (profileQuestionsContainer) {
    const ownQuestions = currentUser
      ? getQuestions().filter(item => item.author === currentUser.name)
      : [];
    renderQuestionContainer(profileQuestionsContainer, ownQuestions, false);
  }
}

async function loadAuthUser() {
  if (!supabaseClient) {
    updateAuthUi(null);
    if (qs("#profile-email")) {
      qs("#profile-email").textContent = "Връзката с профилната система временно не е налична.";
    }
    return null;
  }

  const { data, error } = await supabaseClient.auth.getUser();
  if (error) {
    updateAuthUi(null);
    return null;
  }

  updateAuthUi(data.user || null);
  return data.user || null;
}

const registerForm = qs("#register-form");
if (registerForm) {
  registerForm.addEventListener("submit", async event => {
    event.preventDefault();
    const submitButton = registerForm.querySelector('[type="submit"]');

    if (!supabaseClient) {
      setAuthMessage("#register-message", "Регистрацията временно не е достъпна. Опитай отново след малко.", "error");
      return;
    }

    const displayName = qs("#register-name").value.trim();
    const email = qs("#register-email").value.trim().toLowerCase();
    const password = qs("#register-password").value;

    submitButton.disabled = true;
    setAuthMessage("#register-message", "Създаваме профила…", "warning");

    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
        emailRedirectTo: new URL("profil.html", window.location.href).href
      }
    });

    if (error) {
      setAuthMessage("#register-message", authErrorMessage(error, "register"), "error");
      submitButton.disabled = false;
      return;
    }

    registerForm.reset();
    if (data.session) {
      setAuthMessage("#register-message", "Профилът е създаден успешно. Пренасочваме те към профила…", "success");
      setTimeout(() => { window.location.href = "profil.html"; }, 800);
      return;
    }

    setAuthMessage(
      "#register-message",
      "Регистрацията е успешна. Изпратихме ти имейл — отвори го и потвърди профила си.",
      "success"
    );
    submitButton.disabled = false;
  });
}

const loginForm = qs("#login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async event => {
    event.preventDefault();
    const submitButton = loginForm.querySelector('[type="submit"]');

    if (!supabaseClient) {
      setAuthMessage("#login-message", "Входът временно не е достъпен. Опитай отново след малко.", "error");
      return;
    }

    const email = qs("#login-email").value.trim().toLowerCase();
    const password = qs("#login-password").value;

    submitButton.disabled = true;
    setAuthMessage("#login-message", "Проверяваме данните…", "warning");

    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthMessage("#login-message", authErrorMessage(error, "login"), "error");
      submitButton.disabled = false;
      return;
    }

    updateAuthUi(data.user || null);
    setAuthMessage("#login-message", "Успешен вход. Пренасочваме те към профила…", "success");
    setTimeout(() => { window.location.href = "profil.html"; }, 600);
  });
}

const logoutButton = qs("#logout-button");
if (logoutButton) {
  logoutButton.addEventListener("click", async () => {
    logoutButton.disabled = true;
    if (supabaseClient) await supabaseClient.auth.signOut();
    updateAuthUi(null);
    window.location.href = "index.html";
  });
}

if (supabaseClient) {
  supabaseClient.auth.onAuthStateChange((_event, session) => {
    updateAuthUi(session?.user || null);
  });
}

loadAuthUser();'''

script_path = Path("script.js")
source = script_path.read_text(encoding="utf-8")
source, count = re.subn(
    r"// Регистрация и вход – само местен тест.*?// Публикуване на въпрос",
    auth_block + "\n\n// Публикуване на въпрос",
    source,
    count=1,
    flags=re.S,
)
if count != 1:
    raise SystemExit("Не беше намерен старият блок за регистрация и вход.")
source = source.replace(
    'getStored("popitaiCurrentUser", { name: "Гост" })',
    '(currentUser || { name: "Гост" })'
)
script_path.write_text(source, encoding="utf-8")

cdn_tag = '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2" defer></script>'
config_tag = f'<script src="supabase-config.js?v={VERSION}" defer></script>'
script_tag = f'<script src="script.js?v={VERSION}" defer></script>'

for html_path in Path(".").glob("*.html"):
    text = html_path.read_text(encoding="utf-8")
    text = re.sub(
        r'<script src="script\.js(?:\?v=[^"]+)?" defer></script>',
        script_tag,
        text,
    )
    if "supabase-config.js" not in text and script_tag in text:
        text = text.replace(script_tag, f"{cdn_tag}\n  {config_tag}\n  {script_tag}", 1)
    html_path.write_text(text, encoding="utf-8")

registration = Path("registracia.html")
text = registration.read_text(encoding="utf-8")
text = text.replace('id="register-name" required minlength="2"', 'id="register-name" autocomplete="name" required minlength="2"')
text = text.replace('id="register-email" type="email" required', 'id="register-email" type="email" autocomplete="email" required')
text = text.replace('id="register-password" type="password" required minlength="6"', 'id="register-password" type="password" autocomplete="new-password" required minlength="6"')
registration.write_text(text, encoding="utf-8")

login = Path("vhod.html")
text = login.read_text(encoding="utf-8")
text = text.replace('id="login-email" type="email" required', 'id="login-email" type="email" autocomplete="email" required')
text = text.replace('id="login-password" type="password" required minlength="6"', 'id="login-password" type="password" autocomplete="current-password" required minlength="6"')
login.write_text(text, encoding="utf-8")

migration = r'''-- Попитай.Лом — допълнителна защита и минимални права за Data API
-- Изпълнете файла еднократно в Supabase SQL Editor след schema.sql.

begin;

grant usage on schema public to anon, authenticated;
grant usage on type public.moderation_status, public.app_role to anon, authenticated;

-- Публичните посетители могат да четат само редовете, разрешени от RLS.
grant select on public.questions, public.answers, public.businesses,
  public.listings, public.events, public.media to anon;

-- Влезлите потребители получават само необходимите права; RLS остава задължителен.
grant select on public.profiles, public.questions, public.answers,
  public.businesses, public.listings, public.events, public.reports,
  public.media to authenticated;

grant insert, update on public.questions, public.answers, public.businesses to authenticated;
grant insert on public.listings, public.events, public.reports, public.media to authenticated;

-- Потребителят може да променя само показваното си име, не роля или блокиране.
revoke update on public.profiles from authenticated;
grant update (display_name) on public.profiles to authenticated;

create or replace function public.protect_profile_security_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null
     and auth.uid() = old.id
     and not public.is_staff() then
    new.role := old.role;
    new.is_blocked := old.is_blocked;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists protect_profile_security_fields on public.profiles;
create trigger protect_profile_security_fields
before update on public.profiles
for each row execute procedure public.protect_profile_security_fields();

revoke all on function public.handle_new_user() from public, anon, authenticated;
grant execute on function public.is_staff() to anon, authenticated;

commit;
'''
Path("supabase/002-security-and-api-grants.sql").write_text(migration, encoding="utf-8")

workflow = Path(".github/workflows/apply-supabase-auth.yml")
helper = Path(".github/scripts/apply-supabase-auth.py")
if workflow.exists():
    workflow.unlink()
if helper.exists():
    helper.unlink()
