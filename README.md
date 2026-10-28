# Fleischerei Guskic – Website

Eigener Code, ohne Baukasten. Vite, selbst gehostete Schriften (Bebas Neue, Fraunces, Inter), keine Cookies, keine fremden Dienste.
Aufbau nach dem Vorbild Flannery Beef: persönlicher Satz → Schnittplan (statt Shop) → Geschichte → drei Säulen → Spanferkel → Zeiten → Anruf.

Live: https://fleischerei-guskic.vercel.app (Repo Lazoooisbackk/Fleischerei-Guskic, Vercel baut bei jedem Commit auf main).

## Was noch fehlt (vom Betrieb)
- **Telefonnummer:** in `src/main.js` bei `PHONE` eintragen, Format `+43…` ohne Leerzeichen. Dann erscheint der Anruf-Knopf von selbst. Auch in `impressum.html` und `datenschutz.html` eintragen.
- **Impressum:** Firmenbuchnummer, UID, vertretungsbefugte Person, E-Mail (gelber Kasten in `impressum.html`); danach die Zeile `<meta name="robots" content="noindex">` dort entfernen.
- **Fotos:** echte Fotos vom Stand, keine KI-Bilder. Vorgesehen: ein Familienfoto im Start-Bereich (wie bei Flannery Beef) und eines im Abschnitt „Seit 2008“ anstelle der großen Jahreszahl. Fotos nach `public/img/` legen (JPG, 2000 px breit, unter 400 KB), dann in `index.html` einbauen.
- **Öffnungszeiten** stehen zweimal: in `index.html` (Tabelle) und in `src/main.js` (`HOURS`, für „Jetzt geöffnet“). Beide ändern.

## Arbeiten
```
npm install
npm run dev       # http://localhost:5174
npm run build     # fertige Seite nach dist/
```
`scripts/fix404.mjs` läuft nach dem Build und macht die Pfade in `dist/404.html` absolut (Vercel liefert die 404-Seite unter jeder Adresse aus).
