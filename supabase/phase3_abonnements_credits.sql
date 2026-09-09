-- ============================================================
-- BIG BLU PHARMA PASS — Phase 3 : Abonnement & crédit
-- À exécuter dans Supabase SQL Editor après phase2_roles.sql
-- ============================================================

-- 1. Le travailleur doit pouvoir voir son propre abonnement (policy manquante en Phase 2)
create policy "abonnement_self" on public.abonnements
  for select using (travailleur_id = auth.uid());

-- 2. Droits d'écriture pour le super_admin (Phase 2 ne donnait que la lecture)
create policy "admin_write_utilisateurs" on public.utilisateurs
  for update using (public.get_user_role(auth.uid()) = 'super_admin');

create policy "admin_write_credits" on public.credits
  for all using (public.get_user_role(auth.uid()) = 'super_admin');

create policy "admin_write_abonnements" on public.abonnements
  for all using (public.get_user_role(auth.uid()) = 'super_admin');

-- 3. Fonction métier : activer l'abonnement d'un travailleur et lui attribuer le crédit
--    Conditions officielles (Plan officiel BIG HOLDING SA) :
--    - abonnement : 1 500 FCFA / mois
--    - plafond de crédit : 30 000 FCFA / mois
--    Cette fonction est appelée par l'admin tant que le paiement automatique
--    n'est pas branché (Phase 10). Elle simule une souscription payée manuellement.
create or replace function public.admin_activer_travailleur(p_travailleur_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Seul un super_admin peut appeler cette fonction
  if public.get_user_role(auth.uid()) <> 'super_admin' then
    raise exception 'Accès refusé : réservé aux administrateurs';
  end if;

  -- Créer ou renouveler l'abonnement (formule standard, 30 jours)
  insert into public.abonnements (travailleur_id, formule, statut, date_debut, date_expiration)
  values (p_travailleur_id, 'standard', 'actif', now(), now() + interval '30 days')
  on conflict do nothing;

  update public.abonnements
  set statut = 'actif', date_debut = now(), date_expiration = now() + interval '30 days'
  where travailleur_id = p_travailleur_id
    and id = (select id from public.abonnements where travailleur_id = p_travailleur_id order by created_at desc limit 1);

  -- Attribuer le plafond de crédit officiel
  update public.credits
  set plafond = 30000, updated_at = now()
  where travailleur_id = p_travailleur_id;

  -- Activer le compte utilisateur
  update public.utilisateurs
  set statut = 'actif'
  where id = p_travailleur_id;

  -- Traçabilité
  insert into public.mouvements_credit (travailleur_id, type_mouvement, montant, nouvelle_valeur, effectue_par)
  values (p_travailleur_id, 'attribution', 30000, 30000, auth.uid());

  insert into public.journaux_activite (acteur_id, action, objet_type, objet_id)
  values (auth.uid(), 'activation_abonnement_credit', 'travailleur', p_travailleur_id);
end;
$$;

-- 4. Vue pratique pour le tableau de bord admin : liste des travailleurs
--    avec leur statut d'abonnement et de crédit en un seul select
create or replace view public.vue_admin_travailleurs as
select
  u.id,
  u.nom,
  u.prenom,
  u.email,
  u.telephone,
  u.statut as statut_compte,
  a.statut as statut_abonnement,
  a.date_expiration,
  c.plafond,
  c.montant_utilise,
  (c.plafond - c.montant_utilise) as montant_disponible,
  c.montant_du,
  c.montant_rembourse
from public.utilisateurs u
left join lateral (
  select * from public.abonnements ab where ab.travailleur_id = u.id order by created_at desc limit 1
) a on true
left join public.credits c on c.travailleur_id = u.id
where u.role = 'travailleur';

-- La vue hérite des policies RLS de ses tables sources ; seul un super_admin
-- pourra donc récupérer des lignes autres que la sienne.
