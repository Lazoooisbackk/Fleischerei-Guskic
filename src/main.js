import './style.css';

/* Telefon: Nummer hier eintragen, sobald sie da ist (Format +43…). Leer = „Telefonnummer folgt“. */
const PHONE = '';

/* Öffnungszeiten: [von, bis] in Stunden, Sonntag (0) geschlossen */
const HOURS = { 1: [7, 18], 2: [7, 18], 3: [7, 18], 4: [7, 18], 5: [7, 18], 6: [7, 16] };
const DAYS = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
const hh = (h) => `${String(h).padStart(2, '0')}:00`;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const narrow = matchMedia('(max-width: 860px)');

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

/* Höhe der Kopfzeile als CSS-Variable (das Schweinderl bleibt darunter stehen) */
const top = document.querySelector('.top');
const setTopH = () => { if (top) document.documentElement.style.setProperty('--top-h', `${top.offsetHeight}px`); };
setTopH();
window.addEventListener('resize', setTopH, { passive: true });

/* Der Name schrumpft beim Scrollen in die linke obere Ecke und bleibt dort stehen */
const hero = document.querySelector('[data-hero]'), stage = hero && hero.querySelector('.hero__stage'), heroTitle = document.querySelector('[data-hero-title]');
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

/* Schnittplan: das Schweinderl bleibt stehen, das Stück in der Mitte des Fensters leuchtet auf.
   Maus/Finger/Tastatur auf einer Fläche zeigt sie sofort; Klick oder Enter scrollt zum Text. */
const pig = document.querySelector('[data-pig]'), list = document.querySelector('[data-cutlist]');
if (pig && list) {
  const regions = [...pig.querySelectorAll('[data-cut]')], items = [...list.querySelectorAll('li[data-cut]')];
  const hint = pig.querySelector('[data-pig-hint]'), no = pig.querySelector('[data-pig-no]');
  const info = Object.fromEntries(items.map((li) => [li.dataset.cut, { name: li.querySelector('.cutlist__name').textContent, no: li.querySelector('.cutlist__no').textContent }]));
  let byScroll = items[0].dataset.cut, hover = null;
  const paint = () => {
    const cut = hover || byScroll;
    regions.forEach((r) => r.classList.toggle('is-on', r.dataset.cut === cut));
    items.forEach((li) => li.classList.toggle('is-on', li.dataset.cut === cut));
    if (hint && info[cut]) { hint.textContent = info[cut].name; no.textContent = info[cut].no; }
  };
  const onScroll = () => {
    /* Am Handy steht das Schweinderl oben: die Ziellinie liegt dann unter ihm, sonst in der Fenstermitte */
    const line = narrow.matches ? (pig.getBoundingClientRect().bottom + window.innerHeight) / 2 : window.innerHeight * 0.5;
    let best = byScroll, bestD = Infinity;
    items.forEach((li) => { const r = li.getBoundingClientRect(); const d = Math.abs(r.top + r.height / 2 - line); if (d < bestD) { bestD = d; best = li.dataset.cut; } });
    if (best !== byScroll) { byScroll = best; paint(); }
  };
  const goTo = (cut) => { const li = items.find((l) => l.dataset.cut === cut); if (!li) return; hover = null; byScroll = cut; paint(); li.scrollIntoView({ block: narrow.matches ? 'end' : 'center', behavior: reduce ? 'auto' : 'smooth' }); };
  regions.forEach((r) => {
    r.addEventListener('pointerenter', () => { hover = r.dataset.cut; paint(); });
    r.addEventListener('focus', () => { hover = r.dataset.cut; paint(); });
    r.addEventListener('blur', () => { hover = null; paint(); });
    r.addEventListener('click', () => goTo(r.dataset.cut));
    r.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goTo(r.dataset.cut); } });
  });
  pig.addEventListener('pointerleave', () => { hover = null; paint(); });
  paint(); onScroll();
  window.addEventListener('scroll', () => requestAnimationFrame(onScroll), { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
}

/* Werkstücke gehen beim Scrollen ein wenig langsamer mit (Tiefe) */
const floats = [...document.querySelectorAll('[data-float]')];
if (floats.length && !reduce) {
  const move = () => {
    const mid = window.innerHeight / 2;
    floats.forEach((el) => { const r = el.getBoundingClientRect(); if (r.bottom < -200 || r.top > window.innerHeight + 200) return; el.style.transform = `translate3d(0, ${((r.top + r.height / 2 - mid) * Number(el.dataset.float)).toFixed(1)}px, 0)`; });
  };
  move();
  window.addEventListener('scroll', () => requestAnimationFrame(move), { passive: true });
  window.addEventListener('resize', move, { passive: true });
}

/* Weiches Einblenden beim Scrollen; die Stempel werden „aufgedrückt“ */
if (!reduce && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('.claim__text > *, .section__head > *, .plate, .slip, .story__text, .twin__card, .section--red > *').forEach((n) => { n.classList.add('reveal'); io.observe(n); });
  document.querySelectorAll('.stamp').forEach((n) => { n.classList.add('reveal--stamp'); io.observe(n); });
}

document.querySelectorAll('[data-year]').forEach((y) => { y.textContent = String(new Date().getFullYear()); });
