// Injecte les coordonnées (variables d'environnement Vercel) et la
// navigation commune dans chaque page HTML, puis assemble le site
// final dans dist/.
import { cp, mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';

const FALLBACKS = {
  JDFIXIT_EMAIL: 'contact@jdfixit.example',
  JDFIXIT_WHATSAPP: '06 00 00 00 00',
  JDFIXIT_CITY: 'Votre ville et ses environs',
};

const values = {};
for (const [name, fallback] of Object.entries(FALLBACKS)) {
  const value = process.env[name]?.trim();
  if (!value) {
    console.warn(`⚠ Variable ${name} absente — valeur de remplacement utilisée.`);
  }
  values[name] = value || fallback;
}

// wa.me exige le format international sans "+" : un numéro français
// commençant par 0 devient 33XXXXXXXXX.
const digits = values.JDFIXIT_WHATSAPP.replace(/\D/g, '');
const waNumber = digits.startsWith('0') ? '33' + digits.slice(1) : digits;

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Anti-scraping : les coordonnées sont encodées (chaîne inversée puis
// base64) et décodées uniquement dans le navigateur, au clic.
const enc = (s) => Buffer.from([...s].reverse().join(''), 'utf8').toString('base64');

// Pages du site : chacune contient un placeholder %%JDFIXIT_NAV%% où la
// navigation commune est injectée, avec le lien de la page courante actif.
const PAGES = ['index.html', 'galerie.html', 'materiel.html', 'devis.html', 'tarifs.html'];

const NAV_LINKS = [
  ['index.html', 'Accueil'],
  ['galerie.html', 'Galerie'],
  ['materiel.html', 'Matériel'],
  ['tarifs.html', 'Tarifs'],
  ['devis.html', 'Devis'],
];

const nav = (current) =>
  '<nav class="site-nav mono" aria-label="Navigation principale">' +
  NAV_LINKS.map(([href, label]) =>
    href === current
      ? `<a href="${href}" class="is-active" aria-current="page">${label}</a>`
      : `<a href="${href}">${label}</a>`
  ).join('') +
  '</nav>';

await mkdir('dist', { recursive: true });

for (const page of PAGES) {
  let html = await readFile(page, 'utf8');
  html = html
    .replaceAll('%%JDFIXIT_NAV%%', nav(page))
    .replaceAll('%%JDFIXIT_EMAIL_ENC%%', enc(values.JDFIXIT_EMAIL))
    .replaceAll('%%JDFIXIT_WA_ENC%%', enc(waNumber))
    .replaceAll('%%JDFIXIT_CITY%%', escapeHtml(values.JDFIXIT_CITY));
  await writeFile(`dist/${page}`, html);
}

await copyFile('styles.css', 'dist/styles.css');
await copyFile('favicon.svg', 'dist/favicon.svg');
await cp('assets', 'dist/assets', { recursive: true });

console.log(`✔ Site généré dans dist/ (${PAGES.length} pages)`);
