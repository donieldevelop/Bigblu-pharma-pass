-- ============================================================
-- BIG BLU PHARMA PASS — Phase 4 : QR Code & identification
-- À exécuter dans Supabase SQL Editor après phase3_abonnements_credits.sql
-- ============================================================

-- 1. Sécuriser la table pharmacies (oubliée en Phase 1 : elle n'avait pas de RLS)
alter table public.pharmacies enable row level security;

-- Lecture publique (tout utilisateur connecté peut rechercher une pharmacie à proximité)
create policy "pharmacies_lecture_authentifiee" on public.pharmacies
  for select using (auth.role() = 'authenticated');

-- Seul le super_admin peut créer/modifier une pharmacie
create policy "pharmacies_admin_ecriture" on public.pharmacies
  for all using (public.get_user_role(auth.uid()) = 'super_admin');

-- La pharmacie elle-même peut modifier certaines de ses infos une fois liée à un compte
create policy "pharmacies_self_update" on public.pharmacies
  for update using (user_id = auth.uid());

-- 2. Fonction sécurisée : la pharmacie scanne le QR Code d'un travailleur.
--    Elle reçoit le qr_code_id (ici, l'identifiant interne du travailleur ne doit
--    jamais être transmis en clair — voir note ci-dessous) et retourne uniquement
--    les informations nécessaires à la transaction, pas la totalité du profil.
--    NOTE : cette v1 utilise l'UID du travailleur comme contenu du QR. Une évolution
--    ultérieure pourra le remplacer par un identifiant opaque dédié + rotation.
create or replace function public.identifier_travailleur_pour_transaction(p_travailleur_id uuid)
returns table (
  travailleur_id uuid,
  nom text,
  prenom text,
  statut_compte account_status,
  statut_abonnement abonnement_status,
  credit_disponible numeric
)
language sql
security definer
set search_path = public
as $$
  select
    u.id,
    u.nom,
    u.prenom,
    u.statut,
    a.statut,
    (c.plafond - c.montant_utilise)
  from public.utilisateurs u
  left join lateral (
    select statut from public.abonnements where travailleur_id = u.id order by created_at desc limit 1
  ) a on true
  left join public.credits c on c.travailleur_id = u.id
  where u.id = p_travailleur_id
    and public.get_user_role(auth.uid()) = 'pharmacie'; -- seule une pharmacie peut appeler cette fonction
$$;
