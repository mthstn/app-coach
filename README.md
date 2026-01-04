# APP Planner (PWA) — Next.js + Supabase

Web-app PWA pour gérer tes clients/patients (sans stocker de données médicales) : cycles macro/meso/micro, calendrier, séances running + renfo, calculs charge (sRPE) + monotonie, génération d’email hebdo.

## Prérequis
- Node.js 18+ (ou 20+)
- Un projet Supabase

## Setup Supabase
1. Crée un projet sur Supabase
2. Dans **SQL Editor**, exécute `supabase/schema.sql`
3. Crée ton compte coach via l’écran Auth (Email/Password) dans Supabase (ou depuis l’app une fois lancée).

## Variables d’environnement
Copie `.env.example` en `.env.local` et remplis :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Lancer en local
```bash
npm install
npm run dev
```
Ouvre http://localhost:3000

## Déploiement
- Vercel recommandé. Ajoute les mêmes variables d’env.

## Notes
- Données médicales : **non stockées**. Champs volontairement orientés planification/entraînement.
- RLS : chaque coach voit ses propres données via `owner_id = auth.uid()`.
