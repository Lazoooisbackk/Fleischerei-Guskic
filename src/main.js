import './style.css';

/* Telefon: Nummer hier eintragen, sobald sie da ist (Format +43…). Leer = „Telefonnummer folgt“. */
const PHONE = '';

/* Öffnungszeiten: [von, bis] in Stunden, Sonntag (0) geschlossen */
const HOURS = { 1: [7, 18], 2: [7, 18], 3: [7, 18], 4: [7, 18], 5: [7, 18], 6: [7, 16] };
const DAYS = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
const hh = (h) => `${String(h).padStart(2, '0')}:00`;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Jetzt in Wien */
function viennaNow() {
  const f = new Intl.DateTimeFormat('de-AT', { timeZone: 'Europe/Vienna', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false });
  const parts = Object.fromEntries(f.formatToParts(new Date()).map((p) => [p.type, p.value]));
  const day = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'].findIndex((d) => parts.weekday.startsWith(d));
  return { day, time: Number(parts.hour) % 24 + Number(parts.minute) / 60 };
}
function status() {
  const { day, time } = viennaNow();
  const today = HOURS[day];
  if (today && time >= today[0] && time < today[1]) return { open: true, text: `Jetzt geöffnet · bis ${hh(today[1])}` };
  if (today && time < today[0]) return { open: false, text: `Geschlossen · öffnet heute um ${hh(today[0])}` };
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    if (HOURS[d]) return { open: false, text: `Geschlossen · öffnet ${i === 1 ? 'morgen' : DAYS[d]} um ${hh(HOURS[d][0])}` };
  }
  return { open: false, text: 'Geschlossen' };
}
const statusEls = document.querySelectorAll('[data-status]');
if (statusEls.length) {
  const paint = () => { const s = status(); statusEls.forEach((el) => { el.classList.toggle('is-open', s.open); el.querySelector('[data-status-text]').textContent = s.text; }); };
  paint(); setInterval(paint, 60000);
}
{ const { day } = viennaNow(); document.querySelectorAll('[data-hours] tr').forEach((tr) => tr.classList.toggle('is-today', Number(tr.dataset.day) === day)); }

/* Telefon */
const phoneText = document.querySelector('[data-phone-text]'), phoneLink = document.querySelector('[data-phone-link]');
if (PHONE && phoneText && phoneLink) {
  phoneText.textContent = PHONE.replace(/^\+43(\d{3})(\d{3})(\d{2})(\d{2})$/, '+43 $1 $2 $3 $4');
  phoneLink.href = `tel:${PHONE}`; phoneLink.hidden = false;
}

/* Der Name schrumpft beim Scrollen in die linke obere Ecke und bleibt dort stehen */
const hero = document.querySelector('[data-hero]'), stage = hero && hero.querySelector('.hero__stage'), heroTitle = document.querySelector('[data-hero-title]'), top = document.querySelector('.top');
if (hero && stage && heroTitle && top && !reduce) {
  document.body.classList.add('has-dock');
  let s = 1, dockX = 0, dockY = 0, docked = false;
  const measure = () => {
    const targetH = top.offsetHeight * 0.6;
    s = targetH / heroTitle.offsetHeight;
    dockX = parseFloat(getComputedStyle(stage).paddingLeft) || 18;
    dockY = (top.offsetHeight - targetH) / 2;
  };
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const update = () => {
    const runway = Math.max(360, window.innerHeight * 0.6);   /* Weg, auf dem der Name in die Ecke wandert */
    const p = Math.min(1, Math.max(0, window.scrollY / runway));
    if (p >= 1) {
      if (!docked) { docked = true; document.body.classList.add('is-docked'); heroTitle.classList.add('is-docked'); heroTitle.style.left = `${dockX}px`; heroTitle.style.top = `${dockY}px`; heroTitle.style.transform = `scale(${s})`; }
      return;
    }
    if (docked) { docked = false; document.body.classList.remove('is-docked'); heroTitle.classList.remove('is-docked'); heroTitle.style.left = ''; heroTitle.style.top = ''; }
    const e = ease(p);
    const natLeft = stage.getBoundingClientRect().left + heroTitle.offsetLeft, natTop = stage.getBoundingClientRect().top + heroTitle.offsetTop;
    heroTitle.style.transform = `translate3d(${(dockX - natLeft) * e}px, ${(dockY - natTop) * e}px, 0) scale(${1 + (s - 1) * e})`;
  };
  measure(); update();
  window.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
  window.addEventListener('resize', () => { measure(); if (docked) { docked = false; update(); } else update(); }, { passive: true });
  document.fonts.ready.then(() => { measure(); update(); });
  heroTitle.addEventListener('click', () => { if (docked) window.scrollTo({ top: 0, behavior: 'smooth' }); });
}

/* Menü am Handy */
const burger = document.querySelector('.burger'), nav = document.querySelector('.nav');
if (burger && nav) {
  const set = (open) => { burger.setAttribute('aria-expanded', String(open)); burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen'); document.body.classList.toggle('nav-open', open); };
  burger.addEventListener('click', () => set(burger.getAttribute('aria-expanded') !== 'true'));
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => set(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
}

/* Schnittplan: Stück im Bild und in der Liste gehören zusammen */
const pig = document.querySelector('[data-pig]'), list = document.querySelector('[data-cutlist]');
if (pig && list) {
  const regions = [...pig.querySelectorAll('[data-cut]')], buttons = [...list.querySelectorAll('button[data-cut]')], hint = pig.querySelector('[data-pig-hint]');
  const names = Object.fromEntries(buttons.map((b) => [b.dataset.cut, b.querySelector('.cutlist__name').textContent]));
  let current = null;
  const set = (cut) => {
    current = cut;
    regions.forEach((r) => r.classList.toggle('is-on', r.dataset.cut === cut));
    buttons.forEach((b) => { const on = b.dataset.cut === cut; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', String(on)); });
    if (hint) hint.textContent = cut ? names[cut] : 'Schopf, Karree, Bauch, Schulter, Schlögel';
  };
  regions.forEach((r) => {
    r.addEventListener('pointerenter', () => set(r.dataset.cut));
    r.addEventListener('click', () => { set(r.dataset.cut); buttons.find((b) => b.dataset.cut === r.dataset.cut)?.focus({ preventScroll: true }); });
  });
  pig.addEventListener('pointerleave', () => { if (!document.activeElement?.closest('[data-cutlist]')) set(null); });
  buttons.forEach((b) => {
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('pointerenter', () => set(b.dataset.cut));
    b.addEventListener('focus', () => set(b.dataset.cut));
    b.addEventListener('click', () => set(current === b.dataset.cut && b.matches(':hover') ? b.dataset.cut : b.dataset.cut));
  });
  list.addEventListener('pointerleave', () => { if (!list.contains(document.activeElement)) set(null); });
  list.addEventListener('focusout', (e) => { if (!list.contains(e.relatedTarget)) set(null); });
}

/* Weiches Einblenden beim Scrollen */
if (!reduce && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('.claim > *:not(.blobs):not(.seal), .numbers li, .section__head, .cuts__grid, .media, .steps, .story__text, .twin__card, .section--red > *').forEach((n) => { n.classList.add('reveal'); io.observe(n); });
}

document.querySelectorAll('[data-year]').forEach((y) => { y.textContent = String(new Date().getFullYear()); });
