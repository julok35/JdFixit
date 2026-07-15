# JdFixit

Site vitrine de JdFixit — réparations et petits travaux à domicile.

Site statique (HTML/CSS pur, aucun build nécessaire).

## Déploiement sur Vercel

1. Se connecter sur [vercel.com](https://vercel.com) avec son compte GitHub.
2. Aller sur [vercel.com/new](https://vercel.com/new) et importer le dépôt `julok35/JdFixit`.
3. Framework preset : **Other** (site statique, détecté automatiquement).
4. Cliquer sur **Deploy** — aucune commande de build ni variable d'environnement requise.

Ensuite, chaque push sur `main` déploie automatiquement en production, et chaque
branche/PR obtient une URL de préversion.

## Développement local

Ouvrir `index.html` dans un navigateur, ou lancer un petit serveur :

```bash
python3 -m http.server 8000
```

puis ouvrir <http://localhost:8000>.
