// Injecte les coordonnées (variables d'environnement Vercel), la
// navigation commune et la pagination mobile dans chaque page HTML,
// puis assemble le site final dans dist/.
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

// Pages du site : chacune contient les placeholders %%JDFIXIT_NAV%%,
// %%JDFIXIT_PAGER_TOP%% et %%JDFIXIT_PAGER_BOTTOM%%.
const PAGES = ['index.html', 'galerie.html', 'materiel.html', 'devis.html', 'tarifs.html'];

const NAV_LINKS = [
  ['index.html', 'Accueil'],
  ['galerie.html', 'Galerie'],
  ['materiel.html', 'Matériel'],
  ['tarifs.html', 'Tarifs'],
  ['devis.html', 'Devis'],
];

// L'accueil affiche déjà le gros logo dans le hero : le header n'en
// remet pas un deuxième. Sur les pages intérieures le logo du header
// porte le même view-transition-name que le logo hero — le navigateur
// anime la « migration » du logo entre la page et le header.
const header = (current) =>
  '<header class="site-header">' +
    (current === 'index.html' ? '' :
      '<a class="logo logo-nav" href="index.html" aria-label="JdFixit — retour à l’accueil">' +
        '<span class="logo-base">JdFixit</span>' +
        '<span class="logo-top" aria-hidden="true">JdFixit</span>' +
      '</a>') +
    '<nav class="site-nav mono" aria-label="Navigation principale">' +
    NAV_LINKS.map(([href, label]) =>
      href === current
        ? `<a href="${href}" class="is-active" aria-current="page">${label}</a>`
        : `<a href="${href}">${label}</a>`
    ).join('') +
    '</nav>' +
    `<a class="cta-devis hand${current === 'devis.html' ? ' is-current' : ''}" href="devis.html">Faire une demande&nbsp;!</a>` +
  '</header>';

// Pagination mobile commune : compteur + barre de progression au-dessus
// de la piste, flèches flottantes + script en fin de body. Le nombre de
// panneaux est compté dans le DOM — aucune constante par page.
const pagerTop =
  '<header class="m-header">' +
    '<div class="m-header-row"><span class="m-counter mono" id="panel-counter">01 / 01</span></div>' +
    '<div class="m-progress"><div class="m-progress-fill" id="panel-progress"></div></div>' +
  '</header>';

const pagerBottom =
  '<button class="nav-arrow nav-prev is-hidden" id="nav-prev" type="button" aria-label="Écran précédent">‹</button>' +
  '<button class="nav-arrow nav-next" id="nav-next" type="button" aria-label="Écran suivant">' +
    '<span class="disc" aria-hidden="true">›</span>' +
    '<span class="lbl mono" aria-hidden="true">GLISSER</span>' +
  '</button>' +
  '<script>' +
  '(function () {' +
    'var track = document.querySelector(".track");' +
    'if (!track) return;' +
    'var COUNT = track.querySelectorAll(".panel").length;' +
    'var counter = document.getElementById("panel-counter");' +
    'var fill = document.getElementById("panel-progress");' +
    'var prev = document.getElementById("nav-prev");' +
    'var next = document.getElementById("nav-next");' +
    'function pad(n) { return ("0" + n).slice(-2); }' +
    'function index() {' +
      'return Math.min(COUNT - 1, Math.max(0, Math.round(track.scrollLeft / track.clientWidth)));' +
    '}' +
    'function sync() {' +
      'var i = index();' +
      'counter.textContent = pad(i + 1) + " / " + pad(COUNT);' +
      'fill.style.width = ((i + 1) / COUNT * 100) + "%";' +
      'prev.classList.toggle("is-hidden", i === 0);' +
      'next.classList.toggle("is-hidden", i === COUNT - 1);' +
    '}' +
    'function go(delta) {' +
      'track.scrollTo({ left: (index() + delta) * track.clientWidth, behavior: "smooth" });' +
    '}' +
    'track.addEventListener("scroll", sync, { passive: true });' +
    'window.addEventListener("resize", sync);' +
    'prev.addEventListener("click", function () { go(-1); });' +
    'next.addEventListener("click", function () { go(1); });' +
    'sync();' +
  '})();' +
  '</script>';

await mkdir('dist', { recursive: true });

for (const page of PAGES) {
  let html = await readFile(page, 'utf8');
  html = html
    .replaceAll('%%JDFIXIT_NAV%%', header(page))
    .replaceAll('%%JDFIXIT_PAGER_TOP%%', pagerTop)
    .replaceAll('%%JDFIXIT_PAGER_BOTTOM%%', pagerBottom)
    .replaceAll('%%JDFIXIT_EMAIL_ENC%%', enc(values.JDFIXIT_EMAIL))
    .replaceAll('%%JDFIXIT_WA_ENC%%', enc(waNumber))
    .replaceAll('%%JDFIXIT_CITY%%', escapeHtml(values.JDFIXIT_CITY));
  await writeFile(`dist/${page}`, html);
}

await copyFile('styles.css', 'dist/styles.css');
await copyFile('favicon.svg', 'dist/favicon.svg');
await cp('assets', 'dist/assets', { recursive: true });

console.log(`✔ Site généré dans dist/ (${PAGES.length} pages)`);
