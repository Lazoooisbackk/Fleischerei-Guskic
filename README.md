# Fleischerei Guskic – Website

Eigener Code, ohne Baukasten. Vite, selbst gehostete Schriften (Bebas Neue, Fraunces, Inter), keine Cookies, keine fremden Dienste.
Aufbau (Stand 28.10.2026, Fassung 10): Metzgerpapier als Grund (Körnung `public/noise.png`), Rot als Stempelfarbe, keine KI-Bilder.
Start = der Name in Blockschrift, der beim Scrollen in die linke obere Ecke wandert → Satz + Tafel „Heute am Stand“ → drei Stempel → Schnittplan mit zehn Stücken (das Schwein bleibt stehen, die Stücke ziehen vorbei) → Spanferkel kurz → Zeiten und Anfahrt → Anruf.
Der Stempel-Look kommt von einem SVG-Filter (`#stamp` oben in `index.html`). Das Schwein ist eine eigene SVG-Zeichnung (kein Bild).

## Tafel „Heute am Stand“ (Gerüst, Stand 28.10.)
Daten in `public/stand.json`: `updated` (Zeitpunkt), `items` mit `name`, `price` (Euro pro Kilo, `null` = kein Preis) und `da` (true/false). Die Startseite liest die Datei und zeigt die Liste; durchgestrichen = heute aus. Die zwölf Stücke in der Datei sind nur Platzhalter: **die echte Liste und die Kilopreise kommen vom Betrieb.**
Nächster Schritt: eine geheime Handy-Seite, auf der morgens „da / aus“ und Preise angetippt werden (schreibt dann statt der Datei in einen Speicher auf Vercel).

Live: https://fleischerei-guskic.vercel.app (Repo Lazoooisbackk/Fleischerei-Guskic, Vercel baut bei jedem Commit auf main).

## Was noch fehlt (vom Betrieb)
- **Telefonnummer:** in `src/main.js` bei `PHONE` eintragen, Format `+43…` ohne Leerzeichen. Dann erscheint der Anruf-Knopf von selbst. Auch in `impressum.html` und `datenschutz.html` eintragen.
- **Impressum:** Firmenbuchnummer, UID, vertretungsbefugte Person, E-Mail (gelber Kasten in `impressum.html`); danach die Zeile `<meta name="robots" content="noindex">` dort entfernen.
- **Fotos:** ein Foto pro Stück, alle auf demselben Papier auf der Theke, von oben, gleiches Licht (einmalig). Dazu ein Foto vom Stand. Kommen in die Tafel und neben das Spanferkel. Keine KI-Bilder.
- **Zu bestätigen:** „einziger Stand am Markt mit Schweinefleisch“, „55 Stände“, „seit 2008“, „KG“, und ob das Spanferkel vorher angemeldet werden muss.
- **Aufräumen im Repo:** `public/img/*.webp` (KI-Bilder aus Fassung 9) werden nicht mehr verwendet und können gelöscht werden.
- **Öffnungszeiten** stehen zweimal: in `index.html` (Tabelle) und in `src/main.js` (`HOURS`, für „Jetzt geöffnet“). Beide ändern.

## Arbeiten
```
npm install
npm run dev       # http://localhost:5174
npm run build     # fertige Seite nach dist/
```
`scripts/fix404.mjs` läuft nach dem Build und macht die Pfade in `dist/404.html` absolut (Vercel liefert die 404-Seite unter jeder Adresse aus).
