-- ============================================================
-- BIGBLU PHARMA PASS — Commissions agents commerciaux
-- Plan validé : commercial 800 FCFA/carte + 10% (200 FCFA) par
-- abonnement ; responsable commercial 200 FCFA/carte + 5% (100
-- FCFA) par abonnement, sur les ventes de ses agents supervisés.
-- ============================================================

-- 1. Lien hiérarchique : un agent peut être supervisé par un
--    responsable commercial (vide par défaut, à assigner ensuite)
alter table public.utilisateurs
  add column if not exists superviseur_id uuid references public.utilisateurs(id);

-- 2. Table des commissions
create type commission_type as enum ('carte', 'abonnement');
create type commission_role as enum ('commercial', 'responsable_commercial');

create table public.commissions (
  id uuid primary key default uuid_generate_v4(),
  beneficiaire_id uuid not null references public.utilisateurs(id),
  travailleur_id uuid not null references public.utilisateurs(id),
  type commission_type not null,
  role_beneficiaire commission_role not null,
  montant numeric not null,
  created_at timestamptz not null default now()
);

create index idx_commissions_beneficiaire on public.commissions(beneficiaire_id);

alter table public.commissions enable row level security;

create policy "commission_self" on public.commissions
  for select using (beneficiaire_id = auth.uid());

create policy "commission_admin" on public.commissions
  for all using (public.get_user_role(auth.uid()) = 'super_admin');

-- 3. Commission à chaque carte vendue (adhésion à 5 000 FCFA)
create or replace function public.calculer_commission_carte()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_agent_id uuid;
  v_superviseur_id uuid;
begin
  select cree_par_agent_id into v_agent_id from public.utilisateurs where id = new.travailleur_id;

  if v_agent_id is not null then
    insert into public.commissions (beneficiaire_id, travailleur_id, type, role_beneficiaire, montant)
    values (v_agent_id, new.travailleur_id, 'carte', 'commercial', 800);

    select superviseur_id into v_superviseur_id from public.utilisateurs where id = v_agent_id;
    if v_superviseur_id is not null then
      insert into public.commissions (beneficiaire_id, travailleur_id, type, role_beneficiaire, montant)
      values (v_superviseur_id, new.travailleur_id, 'carte', 'responsable_commercial', 200);
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists on_carte_creee_commission on public.cartes_travailleur;
create trigger on_carte_creee_commission
  after insert on public.cartes_travailleur
  for each row execute procedure public.calculer_commission_carte();

-- 4. Commission à chaque abonnement activé/réabonnement (2 000 FCFA)
create or replace function public.calculer_commission_abonnement()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_agent_id uuid;
  v_superviseur_id uuid;
begin
  if new.statut <> 'actif' then
    return new;
  end if;

  select cree_par_agent_id into v_agent_id from public.utilisateurs where id = new.travailleur_id;

  if v_agent_id is not null then
    insert into public.commissions (beneficiaire_id, travailleur_id, type, role_beneficiaire, montant)
    values (v_agent_id, new.travailleur_id, 'abonnement', 'commercial', 200);

    select superviseur_id into v_superviseur_id from public.utilisateurs where id = v_agent_id;
    if v_superviseur_id is not null then
      insert into public.commissions (beneficiaire_id, travailleur_id, type, role_beneficiaire, montant)
      values (v_superviseur_id, new.travailleur_id, 'abonnement', 'responsable_commercial', 100);
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists on_abonnement_actif_commission on public.abonnements;
create trigger on_abonnement_actif_commission
  after insert on public.abonnements
  for each row execute procedure public.calculer_commission_abonnement();

-- 5. Vue récapitulative par agent (pour son propre tableau de bord)
create or replace view public.vue_commissions_agent as
select
  beneficiaire_id,
  role_beneficiaire,
  count(*) filter (where type = 'carte') as nb_cartes,
  count(*) filter (where type = 'abonnement') as nb_abonnements,
  sum(montant) as total_commissions
from public.commissions
group by beneficiaire_id, role_beneficiaire;

-- 6. Vue admin : abonnés actifs par agent (référence pour le fixe mensuel,
--    dont les modalités restent déterminées manuellement par la Direction
--    Générale, comme prévu dans le plan commercial)
create or replace view public.vue_abonnes_actifs_par_agent as
select
  u.cree_par_agent_id as agent_id,
  count(*) as abonnes_actifs
from public.utilisateurs u
join public.abonnements a on a.travailleur_id = u.id and a.statut = 'actif'
where u.role = 'travailleur' and u.cree_par_agent_id is not null
group by u.cree_par_agent_id;
