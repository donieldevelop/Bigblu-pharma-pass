-- ============================================================
-- BIGBLU PHARMA PASS — Demande de carte physique
-- Indépendant de l'abonnement/crédit : concerne l'impression et la
-- récupération de la carte physique par le travailleur.
-- ============================================================

create type carte_status as enum ('en_attente', 'disponible', 'recuperee', 'refusee');

create table public.cartes_travailleur (
  id uuid primary key default uuid_generate_v4(),
  travailleur_id uuid not null references public.utilisateurs(id) on delete cascade,
  entreprise text not null,
  photo_url text not null,
  matricule text unique,
  statut carte_status not null default 'en_attente',
  demandee_le timestamptz not null default now(),
  disponible_le timestamptz,
  recuperee_le timestamptz,
  traitee_par uuid references public.utilisateurs(id)
);

create index idx_cartes_travailleur on public.cartes_travailleur(travailleur_id);

alter table public.cartes_travailleur enable row level security;

create policy "cartes_self" on public.cartes_travailleur
  for select using (travailleur_id = auth.uid());

create policy "cartes_self_insert" on public.cartes_travailleur
  for insert with check (travailleur_id = auth.uid());

create policy "cartes_admin" on public.cartes_travailleur
  for all using (public.get_user_role(auth.uid()) = 'super_admin');

-- Séquence pour générer les matricules BBHA-2026-00001, BBHA-2026-00002, ...
create sequence if not exists public.matricule_seq start 1;

create or replace function public.generer_matricule()
returns text
language sql
as $$
  select 'BBHA-' || extract(year from now())::text || '-' || lpad(nextval('public.matricule_seq')::text, 5, '0');
$$;

-- Admin : marquer une carte comme disponible (prête à récupérer au bureau)
create or replace function public.admin_carte_disponible(p_carte_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_matricule text;
begin
  if public.get_user_role(auth.uid()) <> 'super_admin' then
    raise exception 'Accès refusé : réservé aux administrateurs';
  end if;

  v_matricule := public.generer_matricule();

  update public.cartes_travailleur
  set statut = 'disponible', matricule = v_matricule, disponible_le = now(), traitee_par = auth.uid()
  where id = p_carte_id;

  insert into public.notifications (destinataire_id, type, contenu)
  select travailleur_id, 'carte_disponible', 'Ta carte BIGBLU PHARMA PASS est prête ! Récupère-la au bureau.'
  from public.cartes_travailleur where id = p_carte_id;

  insert into public.journaux_activite (acteur_id, action, objet_type, objet_id)
  values (auth.uid(), 'carte_disponible', 'carte', p_carte_id);

  return v_matricule;
end;
$$;

-- Admin : marquer une carte comme récupérée par le travailleur
create or replace function public.admin_carte_recuperee(p_carte_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.get_user_role(auth.uid()) <> 'super_admin' then
    raise exception 'Accès refusé : réservé aux administrateurs';
  end if;

  update public.cartes_travailleur
  set statut = 'recuperee', recuperee_le = now()
  where id = p_carte_id;

  insert into public.journaux_activite (acteur_id, action, objet_type, objet_id)
  values (auth.uid(), 'carte_recuperee', 'carte', p_carte_id);
end;
$$;

-- Bucket de stockage pour les photos de carte
insert into storage.buckets (id, name, public)
values ('photos-cartes', 'photos-cartes', true)
on conflict (id) do nothing;

-- Un travailleur peut uploader sa propre photo (dossier nommé par son UID)
create policy "photos_cartes_upload_self" on storage.objects
  for insert with check (
    bucket_id = 'photos-cartes' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "photos_cartes_lecture_publique" on storage.objects
  for select using (bucket_id = 'photos-cartes');
