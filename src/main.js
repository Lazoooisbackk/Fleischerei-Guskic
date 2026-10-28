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
const statusEl = document.querySelector('[data-status]');
if (statusEl) {
  const paint = () => { const s = status(); statusEl.classList.toggle('is-open', s.open); statusEl.querySelector('[data-status-text]').textContent = s.text; };
  paint(); setInterval(paint, 60000);
  const { day } = viennaNow();
  document.querySelectorAll('[data-hours] tr').forEach((tr) => tr.classList.toggle('is-today', Number(tr.dataset.day) === day));
}

/* Telefon */
const phoneText = document.querySelector('[data-phone-text]'), phoneLink = document.querySelector('[data-phone-link]');
if (PHONE && phoneText && phoneLink) {
  phoneText.textContent = PHONE.replace(/^\+43(\d{3})(\d{3})(\d{2})(\d{2})$/, '+43 $1 $2 $3 $4');
  phoneLink.href = `tel:${PHONE}`; phoneLink.hidden = false;
}

/* Kopfzeile: über dem roten Start hell, sonst dunkel */
const top = document.querySelector('.top'), hero = document.querySelector('.hero');
if (top && hero && 'IntersectionObserver' in window) {
  new IntersectionObserver(([e]) => top.classList.toggle('is-red', e.isIntersecting), { rootMargin: '-56px 0px 0px 0px', threshold: 0 }).observe(hero);
}

/* Menü am Handy */
const burger = document.querySelector('.burger'), nav = document.querySelector('.nav');
if (burger && nav) {
  const set = (open) => { burger.setAttribute('aria-expanded', String(open)); burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen'); document.body.classList.toggle('nav-open', open); };
  burger.addEventListener('click', () => set(burger.getAttribute('aria-expanded') !== 'true'));
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => set(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
}

/* Siegel-Leiste: Inhalt verdoppeln, damit die Schleife nahtlos ist */
const seals = document.querySelector('[data-seals]');
if (seals && !reduce) seals.innerHTML += seals.innerHTML;

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
  document.querySelectorAll('.section__head, .pig, .cutlist > li, .story__text, .story__mark, .pillars__list > li, .steps > li, .split > div, .section--red > *').forEach((n) => { n.classList.add('reveal'); io.observe(n); });
}

document.querySelectorAll('[data-year]').forEach((y) => { y.textContent = String(new Date().getFullYear()); });
