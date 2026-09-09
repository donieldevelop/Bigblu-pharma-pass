-- ============================================================
-- BIG BLU PHARMA PASS — Phases 6, 7, 8 : indications, géoloc, dettes/remboursements
-- À exécuter après phase5_transactions_ia.sql
-- ============================================================

-- PHASE 6 — Indications
create or replace function public.ajouter_indication(
  p_medicament_id uuid,
  p_moments_prise text[],
  p_frequence text,
  p_duree text,
  p_mode_administration text,
  p_note text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.indications (medicament_id, moments_prise, frequence, duree, mode_administration, note_complementaire)
  values (p_medicament_id, p_moments_prise, p_frequence, p_duree, p_mode_administration, p_note)
  on conflict (medicament_id) do update set
    moments_prise = excluded.moments_prise,
    frequence = excluded.frequence,
    duree = excluded.duree,
    mode_administration = excluded.mode_administration,
    note_complementaire = excluded.note_complementaire
  returning id into v_id;
  return v_id;
end;
$$;

-- PHASE 7 — Géolocalisation : recherche des pharmacies les plus proches
--    Utilise l'extension postgis déjà activée en Phase 1.
create or replace function public.rechercher_pharmacies_proches(p_latitude double precision, p_longitude double precision, p_rayon_km numeric default 10)
returns table (
  id uuid,
  nom text,
  adresse text,
  latitude double precision,
  longitude double precision,
  distance_km numeric
)
language sql
stable
as $$
  select
    p.id, p.nom, p.adresse, p.latitude, p.longitude,
    round((ST_DistanceSphere(
      ST_MakePoint(p.longitude, p.latitude),
      ST_MakePoint(p_longitude, p_latitude)
    ) / 1000)::numeric, 2) as distance_km
  from public.pharmacies p
  where p.statut = 'active'
    and ST_DistanceSphere(
      ST_MakePoint(p.longitude, p.latitude),
      ST_MakePoint(p_longitude, p_latitude)
    ) <= p_rayon_km * 1000
  order by distance_km asc;
$$;

-- PHASE 8 — Dettes, remboursements, recouvrement (côté admin)

-- Enregistrer un remboursement et mettre à jour la dette
create or replace function public.admin_enregistrer_remboursement(p_travailleur_id uuid, p_montant numeric, p_reference text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.get_user_role(auth.uid()) <> 'super_admin' then
    raise exception 'Accès refusé : réservé aux administrateurs';
  end if;

  insert into public.remboursements (travailleur_id, montant, reference, statut)
  values (p_travailleur_id, p_montant, p_reference, 'valide');

  update public.credits
  set montant_du = greatest(montant_du - p_montant, 0),
      montant_rembourse = montant_rembourse + p_montant,
      montant_utilise = greatest(montant_utilise - p_montant, 0), -- libère du crédit disponible
      updated_at = now()
  where travailleur_id = p_travailleur_id;

  insert into public.mouvements_credit (travailleur_id, type_mouvement, montant, effectue_par)
  values (p_travailleur_id, 'remboursement', p_montant, auth.uid());

  insert into public.notifications (destinataire_id, type, contenu)
  values (p_travailleur_id, 'remboursement', 'Un remboursement de ' || p_montant || ' FCFA a été enregistré sur votre compte.');

  insert into public.journaux_activite (acteur_id, action, objet_type, objet_id, nouvelle_valeur)
  values (auth.uid(), 'enregistrement_remboursement', 'travailleur', p_travailleur_id, jsonb_build_object('montant', p_montant));
end;
$$;

-- Vue recouvrement : travailleurs ayant une dette en cours
create or replace view public.vue_recouvrement as
select
  u.id, u.nom, u.prenom, u.email, u.telephone,
  c.montant_du, c.montant_rembourse
from public.utilisateurs u
join public.credits c on c.travailleur_id = u.id
where u.role = 'travailleur' and c.montant_du > 0
order by c.montant_du desc;

-- RLS sur remboursements (RLS non activée en Phase 1, on l'ajoute)
alter table public.remboursements enable row level security;

create policy "remboursements_travailleur" on public.remboursements
  for select using (travailleur_id = auth.uid());

create policy "remboursements_admin" on public.remboursements
  for all using (public.get_user_role(auth.uid()) = 'super_admin');

-- RLS sur journaux_activite (admin seulement)
alter table public.journaux_activite enable row level security;

create policy "journaux_admin" on public.journaux_activite
  for select using (public.get_user_role(auth.uid()) = 'super_admin');
