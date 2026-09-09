# ARCHITECTURE TECHNIQUE — TECHNOLOGIES, PLATEFORMES ET SERVICES UTILISÉS

*(Section destinée à remplacer/compléter la partie architecture technique générale du cahier des charges de BIG BLU PHARMA PASS)*

## 1. Vue d'ensemble de l'architecture

```
Application mobile BIG BLU PHARMA PASS (Travailleur + Pharmacie)
Back-office Administration (web)
            ↓
   Backend central — Supabase Pro
   (base de données, authentification, API, stockage, logique métier)
            ↓
   Services externes intégrés :
   - Gemini API (intelligence artificielle)
   - Firebase Cloud Messaging (notifications push)
   - Google Maps Platform / navigation externe (géolocalisation)
   - Service de paiement local (à sélectionner)
```

## 2. Technologies, plateformes et services retenus

| Service / Plateforme | Rôle précis dans BIG BLU PHARMA PASS | Coût |
|---|---|---|
| **Supabase Pro** | Backend central : base de données PostgreSQL, authentification (e-mail, Google, Apple), stockage des fichiers/images, API auto-générée, règles de sécurité (Row Level Security), fonctions serveur pour la logique métier (calcul de crédit, validation de transaction, etc.) | Payant (abonnement mensuel) |
| **Firebase Cloud Messaging (FCM)** | Envoi des notifications push aux travailleurs, pharmacies et administrateurs (transaction validée, reçu disponible, crédit modifié, dette, remboursement, abonnement) | Gratuit (usage standard) |
| **Gemini API** | Deux usages distincts : (1) analyse des photos de médicaments prises par la pharmacie pour extraire automatiquement noms, présentations, quantités et prix visibles ; (2) assistant IA conversationnel centralisé accessible au travailleur pour l'aide à l'utilisation de la plateforme | Payant (à l'usage) |
| **Google Maps Platform** *(ou redirection vers l'application de navigation du téléphone)* | Affichage de la carte, recherche géographique des pharmacies partenaires, calcul de distance ; l'itinéraire final est délégué à l'application de navigation déjà installée sur le téléphone du travailleur (Google Maps / Apple Plans) pour éviter de développer un moteur de navigation interne | Payant au-delà d'un quota gratuit (si Maps Platform utilisé pour la recherche/carte) |
| **Vercel Pro** | Hébergement et déploiement continu de l'interface web du Back-office Administration (et, le cas échéant, d'une interface web complémentaire pour les pharmacies) | Payant (abonnement mensuel) |
| **Nom de domaine .com** | Adresse officielle de la plateforme et de ses interfaces web | Payant (annuel) |
| **Google Play Console** | Publication et gestion de l'application Android | Payant (frais unique d'inscription développeur) |
| **Apple Developer Program** | Publication et gestion de l'application iOS sur l'App Store | Payant (abonnement annuel) |
| **Service de paiement / agrégateur local** *(fournisseur à choisir)* | Paiement de l'abonnement mensuel du travailleur et opérations financières associées ; module conçu pour permettre le remplacement du fournisseur sans impact sur le reste du système | Payant (commissions par transaction, selon fournisseur — développé en dernière phase du projet) |
| **Authentification Google** | Connexion/inscription des travailleurs via compte Google | Gratuit |
| **Authentification Apple (Sign in with Apple)** | Connexion/inscription des travailleurs via compte Apple ; obligatoire pour la publication sur l'App Store dès lors qu'une autre connexion sociale est proposée | Gratuit |

## 3. Principe de séparation des responsabilités

- **Supabase Pro** reste la source de vérité unique pour toutes les données métier (utilisateurs, pharmacies, abonnements, crédits, transactions, médicaments, indications, reçus, dettes, remboursements, notifications, journaux d'activité).
- Les **services externes** (Gemini, FCM, Maps, paiement) sont intégrés comme des modules indépendants, chacun interchangeable sans remettre en cause l'architecture centrale — conformément à l'exigence d'évolutivité du cahier des charges technique.
- Le **module de paiement** est volontairement isolé et développé en dernière phase du projet, une fois le reste de la plateforme opérationnel.

## 4. Note sur les coûts

Le détail chiffré des coûts (abonnements Supabase Pro et Vercel Pro, tarification Gemini API, frais Google Play/Apple Developer, commissions de l'agrégateur de paiement, nom de domaine) fait l'objet d'un **devis technique séparé**, non inclus dans le présent document.
