// Injecte les coordonnées (variables d'environnement Vercel) dans le HTML
// et assemble le site final dans dist/.
import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';

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

let html = await readFile('index.html', 'utf8');
html = html
  .replaceAll('%%JDFIXIT_EMAIL%%', escapeHtml(values.JDFIXIT_EMAIL))
  .replaceAll('%%JDFIXIT_WHATSAPP%%', escapeHtml(values.JDFIXIT_WHATSAPP))
  .replaceAll('%%JDFIXIT_WHATSAPP_LINK%%', `https://wa.me/${waNumber}`)
  .replaceAll('%%JDFIXIT_CITY%%', escapeHtml(values.JDFIXIT_CITY));

await mkdir('dist', { recursive: true });
await writeFile('dist/index.html', html);
await copyFile('styles.css', 'dist/styles.css');
await copyFile('favicon.svg', 'dist/favicon.svg');

console.log('✔ Site généré dans dist/');
