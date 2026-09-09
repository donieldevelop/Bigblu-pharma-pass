-- ============================================================
-- BIG BLU PHARMA PASS — Phase 2 : Comptes & rôles
-- À exécuter dans Supabase SQL Editor après schema.sql
-- ============================================================

-- 1. Fonction déclenchée à chaque nouvelle inscription (auth.users)
--    Elle crée automatiquement la ligne correspondante dans public.utilisateurs.
--    Le rôle est lu dans les métadonnées passées à l'inscription
--    (ex: supabase.auth.signUp({ options: { data: { role: 'travailleur' } } }))
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.utilisateurs (id, role, nom, prenom, email, telephone, statut, email_verifie)
  values (
    new.id,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'travailleur'),
    new.raw_user_meta_data->>'nom',
    new.raw_user_meta_data->>'prenom',
    new.email,
    new.raw_user_meta_data->>'telephone',
    'en_attente',
    false
  );

  -- Si c'est un travailleur, on lui crée directement une ligne de crédit à zéro
  if coalesce((new.raw_user_meta_data->>'role')::user_role, 'travailleur') = 'travailleur' then
    insert into public.profils_travailleur (user_id) values (new.id);
    insert into public.credits (travailleur_id, plafond, montant_utilise, montant_du, montant_rembourse)
    values (new.id, 0, 0, 0, 0);
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Fonction helper pour connaître le rôle de l'utilisateur connecté
--    (utilisée dans les policies RLS, security definer pour éviter la récursion)
create or replace function public.get_user_role(uid uuid)
returns user_role
language sql
security definer
set search_path = public
as $$
  select role from public.utilisateurs where id = uid;
$$;

-- 3. Policies complémentaires — Pharmacie
create policy "pharmacie_own_row" on public.utilisateurs
  for select using (id = auth.uid());

create policy "pharmacie_read_own_transactions" on public.transactions
  for select using (
    public.get_user_role(auth.uid()) = 'pharmacie'
    and pharmacie_id in (select id from public.pharmacies where user_id = auth.uid())
  );

create policy "pharmacie_insert_transactions" on public.transactions
  for insert with check (
    public.get_user_role(auth.uid()) = 'pharmacie'
    and pharmacie_id in (select id from public.pharmacies where user_id = auth.uid())
  );

-- 4. Policies complémentaires — Super admin (accès complet en lecture)
create policy "admin_read_all_utilisateurs" on public.utilisateurs
  for select using (public.get_user_role(auth.uid()) = 'super_admin');

create policy "admin_read_all_credits" on public.credits
  for select using (public.get_user_role(auth.uid()) = 'super_admin');

create policy "admin_read_all_transactions" on public.transactions
  for select using (public.get_user_role(auth.uid()) = 'super_admin');

create policy "admin_read_all_abonnements" on public.abonnements
  for select using (public.get_user_role(auth.uid()) = 'super_admin');

-- 5. Créer la ligne profil pour le compte admin créé manuellement AVANT ce trigger
--    ⚠️ Remplace l'e-mail ci-dessous par celui du compte admin créé dans Supabase Auth
insert into public.utilisateurs (id, role, email, statut, email_verifie)
select id, 'super_admin', email, 'actif', true
from auth.users
where email = 'TON_EMAIL_ADMIN_ICI'
on conflict (id) do update set role = 'super_admin', statut = 'actif', email_verifie = true;
