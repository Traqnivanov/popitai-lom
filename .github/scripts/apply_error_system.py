from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[2]
STYLE = ROOT / "style.css"
SCRIPT = ROOT / "script.js"
WORKFLOW = ROOT / ".github/workflows/apply-error-system.yml"

CSS_MARKER = "/* SITE STATUS AND ERROR SYSTEM — 2026-08-05 */"
JS_MARKER = "// SITE STATUS AND ERROR SYSTEM — 2026-08-05"

CSS_BLOCK = r'''

/* SITE STATUS AND ERROR SYSTEM — 2026-08-05 */
.site-status-banner {
  position: relative;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 10px 52px 10px 18px;
  color: #fff;
  background: #6b4b00;
  border-bottom: 1px solid rgba(255,255,255,.24);
  font-size: 14px;
  line-height: 1.45;
  text-align: center;
}
.site-status-banner strong { color: #ffe6a6; }
.site-status-close {
  position: absolute;
  right: 12px;
  top: 50%;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  transform: translateY(-50%);
  color: #fff;
  background: transparent;
  border: 1px solid rgba(255,255,255,.35);
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
}
.site-toast-region {
  position: fixed;
  z-index: 5000;
  right: 18px;
  bottom: 86px;
  width: min(420px, calc(100vw - 36px));
  display: grid;
  gap: 10px;
}
.site-toast {
  position: relative;
  padding: 14px 46px 14px 16px;
  color: #162238;
  background: #fff;
  border: 1px solid #d7dfeb;
  border-left: 5px solid #b7791f;
  border-radius: 12px;
  box-shadow: 0 16px 38px rgba(6,26,56,.18);
}
.site-toast[data-type="success"] { border-left-color: #2f855a; }
.site-toast[data-type="error"] { border-left-color: #c53030; }
.site-toast[data-type="warning"] { border-left-color: #b7791f; }
.site-toast strong { display: block; margin-bottom: 4px; }
.site-toast button {
  position: absolute;
  top: 10px;
  right: 12px;
  color: #526077;
  background: transparent;
  border: 0;
  cursor: pointer;
  font-size: 20px;
}
.form-message.is-error { color: #a61b1b; }
.form-message.is-success { color: #1f6f46; }
.form-message.is-warning { color: #805b00; }
.field-error {
  margin: 6px 0 0;
  color: #a61b1b;
  font-size: 13px;
  font-weight: 750;
}
.error-page-card {
  max-width: 720px;
  margin: 60px auto;
  padding: 34px;
  text-align: center;
  background: #fff;
  border: 1px solid #d7dfeb;
  border-radius: 20px;
  box-shadow: 0 18px 45px rgba(6,26,56,.10);
}
.error-page-card h1 { color: #061a38; }
.error-page-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 22px;
}
@media (max-width: 640px) {
  .site-status-banner { align-items: flex-start; text-align: left; }
  .site-toast-region { right: 12px; bottom: 76px; width: calc(100vw - 24px); }
}
'''

JS_BLOCK = r'''

// SITE STATUS AND ERROR SYSTEM — 2026-08-05
(() => {
  const MESSAGES = {
    offline: 'Няма връзка с интернет. Провери връзката си и опитай отново.',
    server: 'В момента не успяваме да се свържем със системата. Моля, опитай след малко.',
    generic: 'Извиняваме се — нещо не се получи. Попитай.Лом все още се разработва. Опитай отново след малко.',
    permission: 'Нямаш достъп до тази страница.',
    blocked: 'Този профил е временно ограничен. Свържи се с администратора за повече информация.',
    image: 'Снимката не може да бъде качена. Използвай JPG, PNG или WebP до 10 MB.',
    required: 'Моля, попълни това поле.',
    pending: 'Благодарим! Съдържанието е изпратено за преглед и ще се появи след одобрение от администратор.'
  };

  function ensureToastRegion() {
    let region = document.querySelector('.site-toast-region');
    if (!region) {
      region = document.createElement('div');
      region.className = 'site-toast-region';
      region.setAttribute('aria-live', 'polite');
      region.setAttribute('aria-atomic', 'true');
      document.body.appendChild(region);
    }
    return region;
  }

  function showToast(message, type = 'warning', title = '') {
    const region = ensureToastRegion();
    const toast = document.createElement('div');
    toast.className = 'site-toast';
    toast.dataset.type = type;

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', 'Затвори');
    closeButton.textContent = '×';

    const textWrap = document.createElement('div');
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title;
      textWrap.appendChild(strong);
    }
    const span = document.createElement('span');
    span.textContent = message;
    textWrap.appendChild(span);

    toast.append(closeButton, textWrap);
    closeButton.addEventListener('click', () => toast.remove());
    region.appendChild(toast);
    setTimeout(() => toast.remove(), 7000);
  }

  function setFormMessage(target, message, type = 'warning') {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (!element) return;
    element.textContent = message;
    element.classList.remove('is-error', 'is-success', 'is-warning');
    element.classList.add(`is-${type}`);
  }

  function insertDevelopmentBanner() {
    if (sessionStorage.getItem('popitaiDevBannerClosed') === '1') return;
    if (document.querySelector('.site-status-banner')) return;

    const banner = document.createElement('div');
    banner.className = 'site-status-banner';

    const message = document.createElement('span');
    const strong = document.createElement('strong');
    strong.textContent = 'Попитай.Лом е в процес на разработка. ';
    message.append(
      strong,
      document.createTextNode('Възможно е някои функции временно да не работят. Благодарим за разбирането.')
    );

    const closeButton = document.createElement('button');
    closeButton.className = 'site-status-close';
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', 'Затвори съобщението');
    closeButton.textContent = '×';

    banner.append(message, closeButton);
    document.body.prepend(banner);
    closeButton.addEventListener('click', () => {
      sessionStorage.setItem('popitaiDevBannerClosed', '1');
      banner.remove();
    });
  }

  function improveValidationMessages() {
    document.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('invalid', () => {
        if (field.validity.valueMissing) field.setCustomValidity(MESSAGES.required);
        else if (field.validity.typeMismatch) field.setCustomValidity('Моля, въведи валидни данни.');
        else if (field.validity.tooShort) field.setCustomValidity(`Моля, въведи поне ${field.minLength} знака.`);
        else field.setCustomValidity('Моля, провери това поле.');
      });
      field.addEventListener('input', () => field.setCustomValidity(''));
      field.addEventListener('change', () => field.setCustomValidity(''));
    });
  }

  window.PopitaiUi = { showToast, setFormMessage, messages: MESSAGES };

  window.addEventListener('offline', () => showToast(MESSAGES.offline, 'error', 'Няма интернет'));
  window.addEventListener('online', () => showToast('Връзката с интернет е възстановена.', 'success', 'Отново си онлайн'));
  window.addEventListener('unhandledrejection', () => showToast(MESSAGES.generic, 'error', 'Възникна проблем'));
  window.addEventListener('error', event => {
    if (event.target !== window) showToast(MESSAGES.generic, 'error', 'Възникна проблем');
  }, true);

  document.addEventListener('DOMContentLoaded', () => {
    insertDevelopmentBanner();
    improveValidationMessages();
    if (!navigator.onLine) showToast(MESSAGES.offline, 'error', 'Няма интернет');
  });
})();
'''

REPLACEMENTS = {
    'Въпросът и снимките са публикувани в тестовата версия.': 'Благодарим! Въпросът и снимките са изпратени за преглед и ще се появят след одобрение от администратор.',
    'Фирмата и снимките са записани със статус „Чака преглед“.': 'Благодарим! Фирменият профил и снимките са изпратени за преглед и ще се появят след одобрение от администратор.',
    'Отговорът е добавен към правилния въпрос.': 'Благодарим! Отговорът е изпратен за преглед и ще се появи след одобрение от администратор.',
    'Профилът е създаден в тестовия браузър.': 'Профилът е създаден. Провери електронната си поща за потвърждение, когато системата за имейли бъде активирана.',
    'Формулярът работи в местната тестова версия.': 'Благодарим! Формулярът е приет. Възможно е обработката да се забави, докато сайтът е в процес на разработка.',
    'Публикуването не успя.': 'Не успяхме да изпратим съдържанието. Данните ти не са загубени — опитай отново.',
    'Профилът не можа да бъде записан.': 'Не успяхме да изпратим фирмения профил. Провери данните и опитай отново.'
}

ERROR_404 = '''<!DOCTYPE html>
<html lang="bg">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Страницата не е намерена | Попитай.Лом</title>
  <meta name="description" content="Страницата не е намерена.">
  <link rel="stylesheet" href="style.css">
  <link rel="icon" href="assets/favicon-96.png" type="image/png">
</head>
<body>
  <main class="section-container">
    <section class="error-page-card">
      <span class="section-kicker">Грешка 404</span>
      <h1>Страницата не е намерена</h1>
      <p>Възможно е адресът да е променен или страницата да е премахната. Попитай.Лом все още е в процес на разработка и се извиняваме за неудобството.</p>
      <div class="error-page-actions">
        <button class="secondary-link-button" type="button" onclick="history.back()">Назад</button>
        <a class="primary-link-button" href="index.html">Към началната страница</a>
      </div>
    </section>
  </main>
  <script src="script.js" defer></script>
</body>
</html>
'''


def append_once(path: Path, marker: str, block: str) -> None:
    text = path.read_text(encoding="utf-8")
    if marker not in text:
        path.write_text(text.rstrip() + block + "\n", encoding="utf-8")


def run(*args: str) -> None:
    subprocess.run(args, cwd=ROOT, check=True)


def main() -> None:
    append_once(STYLE, CSS_MARKER, CSS_BLOCK)

    script_text = SCRIPT.read_text(encoding="utf-8")
    for old, new in REPLACEMENTS.items():
        script_text = script_text.replace(old, new)
    if JS_MARKER not in script_text:
        script_text = script_text.rstrip() + JS_BLOCK + "\n"
    SCRIPT.write_text(script_text, encoding="utf-8")

    (ROOT / "404.html").write_text(ERROR_404, encoding="utf-8")
    if WORKFLOW.exists():
        WORKFLOW.unlink()

    run("git", "config", "user.name", "Popitai Lom Deploy")
    run("git", "config", "user.email", "actions@users.noreply.github.com")
    run("git", "add", "-A")
    run("git", "commit", "-m", "Добавяне на съобщения за разработка и ясна обработка на грешки")
    run("git", "push", "origin", "HEAD:main")


if __name__ == "__main__":
    main()
