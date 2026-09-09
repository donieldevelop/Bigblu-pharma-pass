-- ============================================================
-- BIG BLU PHARMA PASS — Schéma de base de données (Supabase/Postgres)
-- Phase 1 : Fondations
-- Basé sur le Cahier des charges technique complet, sections 24-26
-- ============================================================

-- Extensions utiles
create extension if not exists "uuid-ossp";
create extension if not exists postgis; -- pour la géolocalisation des pharmacies

-- ============================================================
-- 1. RÔLES ET UTILISATEURS
-- ============================================================

create type user_role as enum ('travailleur', 'pharmacie', 'super_admin', 'admin_secondaire');
create type account_status as enum ('actif', 'suspendu', 'desactive', 'en_attente');

-- Table liée à auth.users (Supabase Auth gère l'authentification e-mail/Google/Apple)
create table public.utilisateurs (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null,
  nom text,
  prenom text,
  email text unique not null,
  telephone text, -- obligatoire pour les travailleurs (contrainte applicative + trigger)
  statut account_status not null default 'en_attente',
  email_verifie boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Profil complémentaire spécifique au travailleur
create table public.profils_travailleur (
  user_id uuid primary key references public.utilisateurs(id) on delete cascade,
  photo_url text,
  informations_complementaires jsonb default '{}'::jsonb,
  statut_service text default 'actif',
  derniere_activite timestamptz
);

-- Droits des administrateurs secondaires (granulaires)
create table public.autorisations_admin (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.utilisateurs(id) on delete cascade,
  module text not null, -- ex: 'travailleurs', 'pharmacies', 'recouvrement', 'finance'
  peut_lire boolean default true,
  peut_ecrire boolean default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 2. PHARMACIES PARTENAIRES
-- ============================================================

create type pharmacie_status as enum ('active', 'inactive', 'en_attente');

create table public.pharmacies (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.utilisateurs(id) on delete set null, -- compte de connexion de la pharmacie
  nom text not null,
  adresse text,
  latitude double precision not null,
  longitude double precision not null,
  localisation geography(Point, 4326), -- pour recherche de proximité rapide
  statut pharmacie_status not null default 'en_attente',
  telephone text,
  qr_code_id uuid not null default uuid_generate_v4() unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_pharmacies_localisation on public.pharmacies using gist (localisation);

-- ============================================================
-- 3. ABONNEMENTS
-- ============================================================

create type abonnement_status as enum ('actif', 'en_attente', 'expire', 'suspendu', 'annule');

create table public.abonnements (
  id uuid primary key default uuid_generate_v4(),
  travailleur_id uuid not null references public.utilisateurs(id) on delete cascade,
  formule text not null,
  statut abonnement_status not null default 'en_attente',
  date_debut timestamptz,
  date_expiration timestamptz,
  date_renouvellement timestamptz,
  reference_paiement text,
  created_at timestamptz not null default now()
);

create index idx_abonnements_travailleur on public.abonnements(travailleur_id);

-- ============================================================
-- 4. CRÉDIT MÉDICAMENTEUX
-- ============================================================

create table public.credits (
  id uuid primary key default uuid_generate_v4(),
  travailleur_id uuid not null unique references public.utilisateurs(id) on delete cascade,
  plafond numeric(12,2) not null default 0,
  montant_utilise numeric(12,2) not null default 0,
  montant_du numeric(12,2) not null default 0,
  montant_rembourse numeric(12,2) not null default 0,
  statut text not null default 'actif',
  updated_at timestamptz not null default now()
);

-- Historique des mouvements de crédit (traçabilité obligatoire — section 34)
create table public.mouvements_credit (
  id uuid primary key default uuid_generate_v4(),
  travailleur_id uuid not null references public.utilisateurs(id) on delete cascade,
  type_mouvement text not null, -- 'attribution', 'utilisation', 'remboursement', 'ajustement_plafond'
  montant numeric(12,2) not null,
  ancienne_valeur numeric(12,2),
  nouvelle_valeur numeric(12,2),
  effectue_par uuid references public.utilisateurs(id),
  created_at timestamptz not null default now()
);

-- ============================================================
-- 5. TRANSACTIONS ET MÉDICAMENTS
-- ============================================================

create type transaction_status as enum ('brouillon', 'en_cours', 'en_attente_validation', 'validee', 'refusee', 'annulee', 'corrigee');

create table public.transactions (
  id uuid primary key default uuid_generate_v4(),
  reference text unique not null default ('BBP-' || upper(substr(uuid_generate_v4()::text, 1, 8))),
  travailleur_id uuid not null references public.utilisateurs(id),
  pharmacie_id uuid not null references public.pharmacies(id),
  montant_total numeric(12,2) not null default 0,
  statut transaction_status not null default 'brouillon',
  created_at timestamptz not null default now(),
  validated_at timestamptz
);

create index idx_transactions_travailleur on public.transactions(travailleur_id);
create index idx_transactions_pharmacie on public.transactions(pharmacie_id);
create index idx_transactions_date on public.transactions(created_at);

create table public.medicaments (
  id uuid primary key default uuid_generate_v4(),
  transaction_id uuid not null references public.transactions(id) on delete cascade,
  nom text not null,
  presentation text,
  quantite integer not null default 1,
  prix_unitaire numeric(12,2) not null default 0,
  prix_total numeric(12,2) not null default 0,
  donnees_detectees_ia jsonb, -- ce que l'IA a extrait de la photo (avant correction)
  valide_par_pharmacien boolean default false,
  created_at timestamptz not null default now()
);

create index idx_medicaments_transaction on public.medicaments(transaction_id);

-- ============================================================
-- 6. INDICATIONS (facultatives, par médicament)
-- ============================================================

create table public.indications (
  id uuid primary key default uuid_generate_v4(),
  medicament_id uuid not null unique references public.medicaments(id) on delete cascade,
  moments_prise text[] default '{}', -- ex: {'matin','soir'}
  frequence text,
  duree text,
  mode_administration text,
  note_complementaire text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 7. REÇUS
-- ============================================================

create table public.recus (
  id uuid primary key default uuid_generate_v4(),
  transaction_id uuid not null unique references public.transactions(id) on delete cascade,
  reference text unique not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 8. DETTES ET REMBOURSEMENTS
-- ============================================================

create table public.remboursements (
  id uuid primary key default uuid_generate_v4(),
  travailleur_id uuid not null references public.utilisateurs(id),
  montant numeric(12,2) not null,
  reference text,
  statut text not null default 'enregistre',
  created_at timestamptz not null default now()
);

-- ============================================================
-- 9. PAIEMENTS (module séparé — fournisseur interchangeable)
-- ============================================================

create table public.paiements (
  id uuid primary key default uuid_generate_v4(),
  fournisseur text not null, -- ex: 'orange_money', 'wave', 'mtn_momo' — à définir
  reference_interne text unique not null default uuid_generate_v4()::text,
  reference_externe text,
  travailleur_id uuid references public.utilisateurs(id),
  abonnement_id uuid references public.abonnements(id),
  montant numeric(12,2) not null,
  statut text not null default 'initie', -- 'initie','confirme','echoue','annule'
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(fournisseur, reference_externe) -- anti-doublon (section 22)
);

-- ============================================================
-- 10. NOTIFICATIONS
-- ============================================================

create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  destinataire_id uuid not null references public.utilisateurs(id) on delete cascade,
  type text not null,
  contenu text not null,
  lu boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_notifications_destinataire on public.notifications(destinataire_id, lu);

-- ============================================================
-- 11. JOURNAUX D'ACTIVITÉ (traçabilité — section 34)
-- ============================================================

create table public.journaux_activite (
  id uuid primary key default uuid_generate_v4(),
  acteur_id uuid references public.utilisateurs(id),
  action text not null,
  objet_type text,
  objet_id uuid,
  ancienne_valeur jsonb,
  nouvelle_valeur jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (séparation des accès — section 27)
-- ============================================================

alter table public.utilisateurs enable row level security;
alter table public.credits enable row level security;
alter table public.transactions enable row level security;
alter table public.medicaments enable row level security;
alter table public.indications enable row level security;
alter table public.recus enable row level security;
alter table public.abonnements enable row level security;
alter table public.notifications enable row level security;

-- Un travailleur ne voit que ses propres données
create policy "travailleur_self" on public.utilisateurs
  for select using (auth.uid() = id);

create policy "credit_self" on public.credits
  for select using (auth.uid() = travailleur_id);

create policy "transactions_self" on public.transactions
  for select using (auth.uid() = travailleur_id);

create policy "notifications_self" on public.notifications
  for select using (auth.uid() = destinataire_id);

-- Note : des policies supplémentaires pour les rôles 'pharmacie' et 'super_admin'
-- seront ajoutées en Phase 2 une fois la table utilisateurs peuplée (nécessitent
-- une fonction helper get_user_role(uid) pour éviter la récursion RLS).
