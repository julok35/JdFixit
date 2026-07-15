// Coordonnées privées de JdFixit — NE PAS COMMITER LE VRAI FICHIER.
//
// 1. Copiez ce fichier :   cp contact.config.example.js contact.config.js
// 2. Remplissez vos vraies coordonnées dans contact.config.js
//    (il est dans .gitignore : il ne partira jamais dans le dépôt Git).
//
// Pour un déploiement Vercel connecté à Git, ne mettez rien ici :
// définissez plutôt les variables d'environnement JDFIXIT_WHATSAPP et
// JDFIXIT_EMAIL dans le dashboard Vercel — build-config.mjs générera
// contact.config.js au build. Voir README.md.
window.JDFIXIT_CONTACT = {
  // Numéro WhatsApp au format international, ex : "+33612345678"
  whatsapp: "",
  // Adresse e-mail de contact, ex : "contact@exemple.fr"
  email: "",
};
