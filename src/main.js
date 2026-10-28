import './style.css';

/* Telefon: Nummer hier eintragen, sobald sie da ist (Format +43…). Leer = „Telefonnummer folgt“. */
const PHONE = '';

/* Öffnungszeiten: [von, bis] in Stunden, Sonntag (0) geschlossen */
const HOURS = { 1: [7, 18], 2: [7, 18], 3: [7, 18], 4: [7, 18], 5: [7, 18], 6: [7, 16] };
const DAYS = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
const hh = (h) => `${String(h).padStart(2, '0')}:00`;

/* Jetzt in Wien */
function viennaNow() {
  const f = new Intl.DateTimeFormat('de-AT', { timeZone: 'Europe/Vienna', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false });
  const parts = Object.fromEntries(f.formatToParts(new Date()).map((p) => [p.type, p.value]));
  const day = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'].findIndex((d) => parts.weekday.startsWith(d));
  return { day, time: Number(parts.hour) + Number(parts.minute) / 60 };
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

const el = document.querySelector('[data-status]');
if (el) {
  const paint = () => { const s = status(); el.classList.toggle('is-open', s.open); el.querySelector('[data-status-text]').textContent = s.text; };
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

/* Menü am Handy */
const burger = document.querySelector('.burger'), nav = document.querySelector('.nav');
if (burger && nav) {
  const set = (open) => { burger.setAttribute('aria-expanded', String(open)); burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen'); document.body.classList.toggle('nav-open', open); };
  burger.addEventListener('click', () => set(burger.getAttribute('aria-expanded') !== 'true'));
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => set(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
}

/* Weiches Einblenden beim Scrollen (ohne Bewegung, wenn das System es so will) */
if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('.section, .grid > li, .steps > li').forEach((n) => { n.classList.add('reveal'); io.observe(n); });
}

document.querySelectorAll('[data-year]').forEach((y) => { y.textContent = String(new Date().getFullYear()); });
