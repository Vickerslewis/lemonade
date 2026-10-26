declare global {
  interface Window {
    __PIN_HASH: string | null;
  }
}

const root = document.documentElement;

async function sha256(text: string) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function setupGate() {
  const form = document.getElementById('gate-form') as HTMLFormElement | null;
  const input = document.getElementById('gate-pin') as HTMLInputElement | null;
  const error = document.getElementById('gate-error');
  if (!form || !input || !error) return;
  if (root.classList.contains('locked')) input.focus();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!crypto?.subtle) {
      error.textContent = 'This browser can’t check the PIN on an insecure connection. Open the https:// address.';
      return;
    }
    const hash = await sha256('lemonade:' + input.value.trim());
    if (hash === window.__PIN_HASH) {
      try {
        localStorage.setItem('lemonade-pin', hash);
      } catch {}
      root.classList.remove('locked');
      error.textContent = '';
    } else {
      error.textContent = 'That PIN isn’t right.';
      input.select();
    }
  });
}

function setupTheme() {
  const button = document.getElementById('theme-toggle');
  button?.addEventListener('click', () => {
    const current = root.dataset.theme ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try {
      localStorage.setItem('lemonade-theme', next);
    } catch {}
    window.dispatchEvent(new Event('themechange'));
  });
}

// Elements with data-days-since="YYYY-MM-DD" show live day counts, so a stale build never lies.
function updateDayCounts() {
  const today = new Date();
  const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  document.querySelectorAll<HTMLElement>('[data-days-since]').forEach((el) => {
    const since = Date.parse(el.dataset.daysSince + 'T00:00:00Z');
    el.textContent = String(Math.max(0, Math.round((todayUtc - since) / 86_400_000)));
  });
}

function updateAges() {
  const now = new Date();
  document.querySelectorAll<HTMLElement>('[data-age-from]').forEach((el) => {
    const [y, m, d] = el.dataset.ageFrom!.split('-').map(Number);
    const beforeBirthday = now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d);
    el.textContent = String(now.getFullYear() - y - (beforeBirthday ? 1 : 0));
  });
}

function setupNav() {
  const nav = document.querySelector<HTMLElement>('.site-nav');
  if (!nav) return;
  const current = nav.querySelector<HTMLElement>('[aria-current="page"]');
  if (current) nav.scrollLeft = current.offsetLeft - (nav.clientWidth - current.offsetWidth) / 2;
  const mark = () => {
    const start = nav.scrollLeft > 4;
    const end = nav.scrollLeft + nav.clientWidth < nav.scrollWidth - 4;
    nav.dataset.more = start && end ? 'both' : end ? 'end' : start ? 'start' : '';
  };
  nav.addEventListener('scroll', mark, { passive: true });
  window.addEventListener('resize', mark);
  mark();
}

setupGate();
setupTheme();
setupNav();
updateDayCounts();
updateAges();

export {};
