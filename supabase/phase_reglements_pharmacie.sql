-- ============================================================
-- BIG BLU PHARMA PASS — Règlements aux pharmacies
-- Après chaque transaction validée, BIG HOLDING SA doit régler la pharmacie.
-- Ce montant est distinct de la dette du travailleur (déjà géré dans credits/remboursements).
-- ============================================================

create type reglement_status as enum ('en_attente', 'regle');

create table public.reglements_pharmacie (
  id uuid primary key default uuid_generate_v4(),
  transaction_id uuid not null unique references public.transactions(id) on delete cascade,
  pharmacie_id uuid not null references public.pharmacies(id),
  montant numeric(12,2) not null,
  statut reglement_status not null default 'en_attente',
  reference text,
  regle_le timestamptz,
  regle_par uuid references public.utilisateurs(id),
  created_at timestamptz not null default now()
);

create index idx_reglements_pharmacie on public.reglements_pharmacie(pharmacie_id, statut);

alter table public.reglements_pharmacie enable row level security;

create policy "reglements_pharmacie_self" on public.reglements_pharmacie
  for select using (pharmacie_id in (select id from public.pharmacies where user_id = auth.uid()));

create policy "reglements_admin" on public.reglements_pharmacie
  for all using (public.get_user_role(auth.uid()) = 'super_admin');

-- Création automatique de la ligne de règlement dès qu'une transaction passe à "validee"
create or replace function public.creer_reglement_pharmacie()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.statut = 'validee' and (old.statut is distinct from 'validee') then
    insert into public.reglements_pharmacie (transaction_id, pharmacie_id, montant, statut)
    values (new.id, new.pharmacie_id, new.montant_total, 'en_attente')
    on conflict (transaction_id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_transaction_validee_reglement on public.transactions;
create trigger on_transaction_validee_reglement
  after update on public.transactions
  for each row execute procedure public.creer_reglement_pharmacie();

-- Admin : marquer un règlement comme payé
create or replace function public.admin_marquer_regle(p_reglement_id uuid, p_reference text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.get_user_role(auth.uid()) <> 'super_admin' then
    raise exception 'Accès refusé : réservé aux administrateurs';
  end if;

  update public.reglements_pharmacie
  set statut = 'regle', reference = p_reference, regle_le = now(), regle_par = auth.uid()
  where id = p_reglement_id;

  insert into public.journaux_activite (acteur_id, action, objet_type, objet_id)
  values (auth.uid(), 'reglement_pharmacie', 'reglement', p_reglement_id);
end;
$$;

-- Vue pratique pour l'admin : total dû par pharmacie
create or replace view public.vue_reglements_pharmacies as
select
  p.id as pharmacie_id,
  p.nom,
  count(*) filter (where r.statut = 'en_attente') as transactions_en_attente,
  coalesce(sum(r.montant) filter (where r.statut = 'en_attente'), 0) as montant_en_attente,
  coalesce(sum(r.montant) filter (where r.statut = 'regle'), 0) as montant_deja_regle
from public.pharmacies p
left join public.reglements_pharmacie r on r.pharmacie_id = p.id
group by p.id, p.nom;
