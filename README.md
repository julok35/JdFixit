# JdFixit

Site vitrine de JdFixit — réparations et petits travaux à domicile.

Site statique (HTML/CSS) avec un mini-build (`build.mjs`) qui injecte les
coordonnées de contact depuis les variables d'environnement au moment du
déploiement — les coordonnées ne sont donc pas stockées dans le dépôt.

## Variables d'environnement (Vercel)

| Variable | Contenu |
|---|---|
| `JDFIXIT_EMAIL` | Adresse email de contact |
| `JDFIXIT_WHATSAPP` | Numéro WhatsApp (format `06 XX XX XX XX` accepté, converti automatiquement en lien `wa.me`) |
| `JDFIXIT_CITY` | Zone d'intervention affichée |

Si une variable est absente, le build utilise une valeur de remplacement
générique et affiche un avertissement dans les logs.

## Déploiement sur Vercel

1. Se connecter sur [vercel.com](https://vercel.com) avec son compte GitHub.
2. Aller sur [vercel.com/new](https://vercel.com/new) et importer le dépôt `julok35/JdFixit`.
3. Définir les variables d'environnement ci-dessus (Production et Preview).
4. Cliquer sur **Deploy** — `vercel.json` configure déjà la commande de build
   (`node build.mjs`) et le dossier de sortie (`dist`).

Ensuite, chaque push sur `main` déploie automatiquement en production, et chaque
branche/PR obtient une URL de préversion.

## Développement local

```bash
JDFIXIT_EMAIL="moi@example.com" JDFIXIT_WHATSAPP="06 12 34 56 78" \
JDFIXIT_CITY="Rennes et ses environs" node build.mjs
python3 -m http.server 8000 --directory dist
```

puis ouvrir <http://localhost:8000>.
