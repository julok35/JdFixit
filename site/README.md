# JdFixit — site mobile (flux horizontal)

Site une-page mobile-first : 6 écrans à défilement horizontal (hero → croquis → CAO → print → forfaits → contact), sélection de forfait qui pré-remplit la demande, et envoi par **WhatsApp** ou **e-mail**.

Vanilla HTML/CSS/JS — aucun build requis pour le développement.

## Lancer en local

```bash
cd site
cp contact.config.example.js contact.config.js   # puis remplissez vos coordonnées
python3 -m http.server 8000                       # ou n'importe quel serveur statique
# → http://localhost:8000
```

## Coordonnées privées (téléphone / e-mail)

Vos coordonnées ne sont **jamais dans le dépôt Git** :

- **En local** : elles vivent dans `site/contact.config.js`, listé dans `.gitignore`. Copiez `contact.config.example.js` et remplissez :

  ```js
  window.JDFIXIT_CONTACT = {
    whatsapp: "+33612345678",     // format international
    email: "contact@exemple.fr",
  };
  ```

- **Sur Vercel (déploiement connecté à Git)** : le fichier gitignoré n'existe pas dans le clone ; `build-config.mjs` le génère au build à partir des variables d'environnement. Dans le dashboard Vercel → *Settings → Environment Variables*, définissez :

  | Variable | Exemple |
  |---|---|
  | `JDFIXIT_WHATSAPP` | `+33612345678` |
  | `JDFIXIT_EMAIL` | `contact@exemple.fr` |

  Réglez le *Root Directory* du projet Vercel sur `site`. Le `vercel.json` fait le reste.

Si aucune coordonnée n'est configurée, le site fonctionne mais les boutons d'envoi sont désactivés avec un avertissement.

> Nota : les coordonnées finissent forcément dans la page servie aux visiteurs (c'est le but — ils doivent pouvoir vous contacter). Ce mécanisme empêche leur fuite via le **dépôt Git** (historique public, forks, scrapers GitHub), pas via le site lui-même.

## Structure

```
site/
├── index.html                  # la page (6 panneaux)
├── styles.css                  # styles (palette encre/orange Bambu, papier quadrillé)
├── app.js                      # navigation, forfaits, bottom-sheet, envoi WhatsApp/e-mail
├── contact.config.example.js   # modèle à copier (le vrai est gitignoré)
├── build-config.mjs            # génère contact.config.js depuis les env vars (Vercel)
├── vercel.json                 # config déploiement
└── assets/                     # images des 3 étapes
```
