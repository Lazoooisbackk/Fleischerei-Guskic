# Fleischerei Guskic: neue Website auf GitHub und Vercel

Eigener Code (Vite), kein Webflow. 20 Dateien in diesem Ordner (ohne diese Anleitung).

## 1. Neues Repo auf GitHub (Safari, Konto Lazoooisbackk)
1. https://github.com/new öffnen.
2. Repository name: `fleischerei-guskic`. Public. Nichts anhaken. „Create repository“.
3. Auf der leeren Repo-Seite: „uploading an existing file“ anklicken (oder Add file → Upload files).
4. Im Finder diesen Ordner öffnen, alle Einträge markieren (Cmd+A, die Datei `.gitignore` ist unsichtbar, das ist egal) und ins Browserfenster ziehen.
5. Nachricht: `Fleischerei Guskic: erste Version` → „Commit changes“.

## 2. Vercel (Safari, Konto lazar1)
1. https://vercel.com/new öffnen.
2. Bei „Import Git Repository“ das Repo `fleischerei-guskic` wählen → „Import“.
3. Framework Preset: Vite (wird erkannt). Nichts ändern. „Deploy“.
4. Nach etwa einer Minute steht die Adresse da, z. B. `fleischerei-guskic.vercel.app`. Mir die Adresse schicken, ich prüfe live.

## Noch offen (vom Papa)
- Telefonnummer des Stands (kommt in `src/main.js` bei `PHONE` und ins Impressum).
- Impressum: Firmenbuchnummer, UID, vertretungsbefugte Person, E-Mail.
- Echte Fotos vom Stand (die Seite kommt ohne Fotos aus, mit Fotos wird sie stärker; keine KI-Bilder von Fleisch).
