-- ============================================================
-- BIG BLU PHARMA PASS — Inscription pharmacie avec validation admin
-- ============================================================

-- Une pharmacie (compte déjà créé avec role='pharmacie') s'enregistre elle-même.
-- Le statut est TOUJOURS forcé à 'en_attente' ici, quoi que le client envoie —
-- seul l'admin peut faire passer une pharmacie à 'active'.
create or replace function public.pharmacie_inscrire(
  p_nom text,
  p_adresse text,
  p_latitude double precision,
  p_longitude double precision
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if public.get_user_role(auth.uid()) <> 'pharmacie' then
    raise exception 'Accès refusé : réservé aux comptes pharmacie';
  end if;

  if exists (select 1 from public.pharmacies where user_id = auth.uid()) then
    raise exception 'Une fiche pharmacie est déjà liée à ce compte';
  end if;

  insert into public.pharmacies (user_id, nom, adresse, latitude, longitude, statut)
  values (auth.uid(), p_nom, p_adresse, p_latitude, p_longitude, 'en_attente')
  returning id into v_id;

  insert into public.journaux_activite (acteur_id, action, objet_type, objet_id)
  values (auth.uid(), 'demande_inscription_pharmacie', 'pharmacie', v_id);

  return v_id;
end;
$$;

-- Permet à la pharmacie de lire sa propre fiche même si elle n'est pas encore "active"
-- (la policy pharmacies_lecture_authentifiee existante couvre déjà ce cas puisqu'elle
-- autorise tout utilisateur authentifié à lire toutes les pharmacies — rien à ajouter ici).
