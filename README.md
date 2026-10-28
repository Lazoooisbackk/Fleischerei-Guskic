# Fleischerei Guskic – Website

Eigener Code, ohne Baukasten. Vite, selbst gehostete Schriften (Bebas Neue, Fraunces, Inter), keine Cookies, keine fremden Dienste.
Aufbau (Stand 28.10.2026): Start = der Name in Blockschrift, der beim Scrollen in die linke obere Ecke wandert → Satz mit Siegel und drei Glas-Karten → drei Zahlen auf Rot → Schnittplan Schwein (Stück antippen) → Spanferkel (dunkel, Bildplatz) → Seit 2008 (Bildplatz) → Zeiten und Anfahrt als Glas-Karten → Anruf.

Live: https://fleischerei-guskic.vercel.app (Repo Lazoooisbackk/Fleischerei-Guskic, Vercel baut bei jedem Commit auf main).

## Was noch fehlt (vom Betrieb)
- **Telefonnummer:** in `src/main.js` bei `PHONE` eintragen, Format `+43…` ohne Leerzeichen. Dann erscheint der Anruf-Knopf von selbst. Auch in `impressum.html` und `datenschutz.html` eintragen.
- **Impressum:** Firmenbuchnummer, UID, vertretungsbefugte Person, E-Mail (gelber Kasten in `impressum.html`); danach die Zeile `<meta name="robots" content="noindex">` dort entfernen.
- **Fotos:** zwei Bildplätze sind vorbereitet: `.media--spanferkel` (4:3, dunkler Block) und `.media--markt` (4:5, „Seit 2008“). Fotos nach `public/img/` legen (JPG, 2000 px breit, unter 400 KB) und im HTML am jeweiligen `<figure class="media …">` die Klasse `has-img` plus `style="--img:url('/img/datei.jpg')"` setzen. Echte Fotos vom Stand sind besser als KI-Bilder.
- **Öffnungszeiten** stehen zweimal: in `index.html` (Tabelle) und in `src/main.js` (`HOURS`, für „Jetzt geöffnet“). Beide ändern.

## Arbeiten
```
npm install
npm run dev       # http://localhost:5174
npm run build     # fertige Seite nach dist/
```
`scripts/fix404.mjs` läuft nach dem Build und macht die Pfade in `dist/404.html` absolut (Vercel liefert die 404-Seite unter jeder Adresse aus).
