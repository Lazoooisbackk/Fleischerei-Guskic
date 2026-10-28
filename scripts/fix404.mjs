/* Nach dem Build: Pfade in dist/404.html absolut machen (Vercel liefert die 404-Seite unter jeder Adresse aus). */
import fs from 'node:fs';
const p = new URL('../dist/404.html', import.meta.url);
if (fs.existsSync(p)) { fs.writeFileSync(p, fs.readFileSync(p, 'utf8').replace(/(href|src)="\.\//g, '$1="/')); console.log('404.html: Pfade absolut gesetzt'); }
