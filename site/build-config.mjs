// Génère contact.config.js à partir des variables d'environnement
// JDFIXIT_WHATSAPP / JDFIXIT_EMAIL (déploiement Vercel connecté à Git,
// où le fichier gitignoré n'existe pas). En local, si contact.config.js
// existe déjà, il est conservé tel quel.
import { existsSync, writeFileSync } from "node:fs";

const target = new URL("./contact.config.js", import.meta.url);
const whatsapp = process.env.JDFIXIT_WHATSAPP ?? "";
const email = process.env.JDFIXIT_EMAIL ?? "";

if (!whatsapp && !email && existsSync(target)) {
  console.log("build-config: contact.config.js existant conservé (pas de variables d'environnement).");
} else {
  writeFileSync(
    target,
    `// Généré par build-config.mjs — ne pas éditer, ne pas commiter.
window.JDFIXIT_CONTACT = {
  whatsapp: ${JSON.stringify(whatsapp)},
  email: ${JSON.stringify(email)},
};
`
  );
  console.log(
    `build-config: contact.config.js généré (whatsapp: ${whatsapp ? "défini" : "vide"}, email: ${email ? "défini" : "vide"}).`
  );
}
