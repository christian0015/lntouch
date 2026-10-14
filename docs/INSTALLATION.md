<!-- docs/INSTALLATION.md -->
# LN Touch — mise en place

## 1. Dépendances à ajouter
```bash
npm i zod nodemailer
npm i -D tsx @types/nodemailer
```
(`mongoose`, `cloudinary`, `gsap` sont déjà installés.)

## 2. Scripts `package.json`
```json
"scripts": {
  "seed": "tsx --env-file=.env.local scripts/seed.ts",
  "create-owner": "tsx --env-file=.env.local scripts/create-owner.ts"
}
```
Nécessite Node ≥ 20.6.

## 3. Variables d'environnement
Copiez `.env.example` → `.env.local` et remplissez-le.
Gmail : activez la validation en 2 étapes puis créez un « mot de passe d'application »
(Compte Google → Sécurité → Mots de passe d'application).

## 4. Fichiers à copier / supprimer
- Copiez tout le contenu du zip dans votre projet (même arborescence). Les routes `route.js`, les modèles et les pages **remplacent** les anciens.
- Fusionnez `next.config.example.mjs` dans votre `next.config`.
- `lib/data0.ts` n'est plus utilisé : vous pouvez le supprimer (copie conservée dans `scripts/seed-data.ts`).
- `lib/coiffures.ts`, si inutilisé, peut aussi disparaître.
- `lib/mongoose.js`, `lib/cloudinary.js` et `lib/gsap.js` sont conservés tels quels (non fournis dans le zip).
- `proxy.ts` (Next 16) : supprimez votre ancien `middleware.ts` s’il existe encore, il ne doit rester que `proxy.ts`.

## 5. Premier démarrage
```bash
npm run seed -- --with-availability   # données initiales + créneaux des 60 prochains jours
ADMIN_EMAIL=... ADMIN_PASSWORD=... ADMIN_NAME=... npm run create-owner
npm run dev
```
Connexion : `/admin/login`.

## 6. Sécurité en production
- Derrière Vercel/Nginx : l'IP client vient de `x-real-ip` / `x-forwarded-for`.
- Le limiteur du `middleware` est en mémoire (par instance) : c'est un filet généreux anti-abus.
  Les endpoints sensibles (connexion, mot de passe oublié, réservation, upload, écritures admin)
  utilisent un limiteur **persistant MongoDB** partagé entre instances.
- Le build interroge MongoDB (pages statiques) : `MONGODB_URI` doit être défini au build.

## 7. Rôles
| Rôle | Contenu | Salon/fondatrice | Réservations + créneaux | Équipe |
|---|---|---|---|---|
| Propriétaire | ✔ | ✔ | ✔ | ✔ |
| Gérante | ✔ | ✔ | ✔ | ✘ |
| Éditrice | ✔ | ✘ | ✘ | ✘ |
| Réception | ✘ | ✘ | ✔ | ✘ |
