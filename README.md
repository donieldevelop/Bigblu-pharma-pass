# BIG BLU PHARMA PASS

Plateforme d'accès des travailleurs aux médicaments via un réseau de pharmacies partenaires.
Trois espaces : **Travailleur** (app mobile), **Pharmacie partenaire**, **Administration**.

Documents de référence : cahier des charges fonctionnel + cahier des charges technique (déjà fournis par Guy).

## Stack retenue

- **Frontend mobile (Travailleur)** : à définir (React Native / Flutter recommandé pour Android + iOS en un seul code)
- **Interface Pharmacie & Administration** : Web (Next.js recommandé)
- **Backend / Auth / Base de données / Storage** : Supabase (Postgres + Auth + Storage + Row Level Security)
- **Hébergement web** : Vercel
- **Code source** : GitHub

## Ce qui est prêt (Phase 1 — Fondations)

- `supabase/schema.sql` : schéma complet de la base de données (utilisateurs, rôles, pharmacies,
  abonnements, crédits, transactions, médicaments, indications, reçus, dettes,
  remboursements, paiements, notifications, journaux d'activité) + Row Level Security de base.

## Prochaines étapes

1. **Créer le repo GitHub** (privé). Donald + moi (Claude) y aurons accès pour développer.
2. **Créer le projet Supabase** → exécuter `schema.sql` → activer providers Auth (Email, Google, Apple).
3. **Créer le projet Vercel** et le lier au repo GitHub pour le déploiement automatique des interfaces web
   (Pharmacie + Administration).
4. Une fois ces 3 comptes en place, on peut attaquer la **Phase 2** (comptes travailleurs/pharmacies,
   authentification, profils) — cf. plan de développement en 10 phases du cahier des charges technique.

## Rôles

- **Travailleur** : app mobile, ne voit que ses propres données
- **Pharmacie partenaire** : interface web/tablette, ne voit que les infos nécessaires à la transaction en cours
- **Super admin** : accès complet
- **Admin secondaire** : droits limités par module (travailleurs, pharmacies, finance, recouvrement...)
