-- ============================================================
-- BIGBLU PHARMA PASS — Rôle Agent commercial (Bloc B)
-- À exécuter APRÈS phase_agent_commercial_a.sql
-- ============================================================

-- 1. Colonnes : code client lisible (BP250001...) + agent créateur
alter table public.utilisateurs
  add column if not exists code_client text unique,
  add column if not exists cree_par_agent_id uuid references public.utilisateurs(id);

-- 2. Génération du code client (format BP + année 2 chiffres + séquence 4 chiffres)
create sequence if not exists public.code_client_seq start 1;

create or replace function public.generer_code_client()
returns text
language sql
as $$
  select 'BP' || to_char(now(), 'YY') || lpad(nextval('public.code_client_seq')::text, 4, '0');
$$;

-- 3. Trigger de création de compte mis à jour : attribue le code client
--    (pour les travailleurs) et enregistre l'agent créateur s'il y en a un
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role user_role;
begin
  v_role := coalesce((new.raw_user_meta_data->>'role')::user_role, 'travailleur');

  insert into public.utilisateurs (id, role, nom, prenom, email, telephone, statut, email_verifie, code_client, cree_par_agent_id)
  values (
    new.id,
    v_role,
    new.raw_user_meta_data->>'nom',
    new.raw_user_meta_data->>'prenom',
    new.email,
    new.raw_user_meta_data->>'telephone',
    'en_attente',
    false,
    case when v_role = 'travailleur' then public.generer_code_client() else null end,
    nullif(new.raw_user_meta_data->>'cree_par_agent_id', '')::uuid
  );

  if v_role = 'travailleur' then
    insert into public.profils_travailleur (user_id) values (new.id);
    insert into public.credits (travailleur_id, plafond, montant_utilise, montant_du, montant_rembourse)
    values (new.id, 0, 0, 0, 0);
  end if;

  return new;
end;
$$;

-- 4. Droits de lecture de l'agent : uniquement SES clients (ceux qu'il a créés)
create policy "agent_lecture_ses_clients" on public.utilisateurs
  for select using (
    public.get_user_role(auth.uid()) = 'commercial'
    and cree_par_agent_id = auth.uid()
  );

create policy "agent_lecture_credits_clients" on public.credits
  for select using (
    public.get_user_role(auth.uid()) = 'commercial'
    and travailleur_id in (select id from public.utilisateurs where cree_par_agent_id = auth.uid())
  );

create policy "agent_lecture_transactions_clients" on public.transactions
  for select using (
    public.get_user_role(auth.uid()) = 'commercial'
    and travailleur_id in (select id from public.utilisateurs where cree_par_agent_id = auth.uid())
  );

create policy "agent_lecture_medicaments_clients" on public.medicaments
  for select using (
    public.get_user_role(auth.uid()) = 'commercial'
    and transaction_id in (
      select id from public.transactions
      where travailleur_id in (select id from public.utilisateurs where cree_par_agent_id = auth.uid())
    )
  );

create policy "agent_lecture_abonnements_clients" on public.abonnements
  for select using (
    public.get_user_role(auth.uid()) = 'commercial'
    and travailleur_id in (select id from public.utilisateurs where cree_par_agent_id = auth.uid())
  );

-- 5. Rattraper les comptes travailleurs déjà créés avant cette migration
--    (leur donner un code client s'ils n'en ont pas)
update public.utilisateurs
set code_client = public.generer_code_client()
where role = 'travailleur' and code_client is null;
