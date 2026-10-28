# Fleischerei Guskic – Website

Eigener Code, ohne Baukasten. Vite, selbst gehostete Schriften (Bebas Neue, Fraunces, Inter), keine Cookies, keine fremden Dienste.
Aufbau (Stand 28.10.2026, Fassung „Das Papier“): Metzgerpapier als Grund (Körnung `public/noise.png`), Rot als Stempelfarbe, drei freigestellte Werkstücke (`public/img/`: Packerl, Beil, Schnur).
Start = der Name in Blockschrift, der beim Scrollen in die linke obere Ecke wandert → Satz mit Packerl und Siegel → drei Stempel → Schnittplan: das Schweinderl bleibt stehen, die Stücke ziehen vorbei und leuchten auf → Spanferkel (dunkel, Zeichnung + Bestellschein) → Seit 2008 (Stand-Karte + Schnur) → Zeiten und Anfahrt als Papier-Karten → Anruf.
Der Stempel-Look kommt von einem SVG-Filter (`#stamp` oben in `index.html`), nicht von Bildern.

Live: https://fleischerei-guskic.vercel.app (Repo Lazoooisbackk/Fleischerei-Guskic, Vercel baut bei jedem Commit auf main).

## Was noch fehlt (vom Betrieb)
- **Telefonnummer:** in `src/main.js` bei `PHONE` eintragen, Format `+43…` ohne Leerzeichen. Dann erscheint der Anruf-Knopf von selbst. Auch in `impressum.html` und `datenschutz.html` eintragen.
- **Impressum:** Firmenbuchnummer, UID, vertretungsbefugte Person, E-Mail (gelber Kasten in `impressum.html`); danach die Zeile `<meta name="robots" content="noindex">` dort entfernen.
- **Fotos:** zwei Bildplätze sind vorbereitet: `.plate--spanferkel` (4:3, im dunklen Block, zeigt bis dahin die Zeichnung) und `.plate--markt` (4:5, „Seit 2008“, zeigt bis dahin die Standnummer). Fotos nach `public/img/` legen (JPG, 2000 px breit, unter 400 KB) und im HTML am jeweiligen `<figure class="plate …">` die Klasse `has-img` plus `style="--img:url('/img/datei.jpg')"` setzen; Zeichnung bzw. Stempel verschwinden dann von selbst. Echte Fotos vom Stand, keine KI-Bilder von Fleisch.
- **Werkstücke** (`public/img/paket*.webp`, `beil-*.webp`, `garn*.webp`) sind KI-Studiobilder von Gegenständen (kein Fleisch, kein Stand) und werden nur als Schmuck verwendet.
- **Öffnungszeiten** stehen zweimal: in `index.html` (Tabelle) und in `src/main.js` (`HOURS`, für „Jetzt geöffnet“). Beide ändern.

## Arbeiten
```
npm install
npm run dev       # http://localhost:5174
npm run build     # fertige Seite nach dist/
```
`scripts/fix404.mjs` läuft nach dem Build und macht die Pfade in `dist/404.html` absolut (Vercel liefert die 404-Seite unter jeder Adresse aus).
