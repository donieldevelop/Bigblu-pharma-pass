-- ============================================================
-- BIGBLU PHARMA PASS — Scan croisé : le travailleur scanne le QR
-- de la pharmacie pour se signaler directement (au lieu que la
-- pharmacie scanne toujours en premier).
-- ============================================================

create type presence_status as enum ('en_attente', 'prise_en_charge', 'annulee');

create table public.presences_pharmacie (
  id uuid primary key default uuid_generate_v4(),
  travailleur_id uuid not null references public.utilisateurs(id) on delete cascade,
  pharmacie_id uuid not null references public.pharmacies(id) on delete cascade,
  statut presence_status not null default 'en_attente',
  created_at timestamptz not null default now(),
  prise_en_charge_le timestamptz
);

create index idx_presences_pharmacie on public.presences_pharmacie(pharmacie_id, statut);

alter table public.presences_pharmacie enable row level security;

create policy "presence_travailleur_self" on public.presences_pharmacie
  for select using (travailleur_id = auth.uid());

create policy "presence_pharmacie_lecture" on public.presences_pharmacie
  for select using (pharmacie_id in (select id from public.pharmacies where user_id = auth.uid()));

create policy "presence_pharmacie_maj" on public.presences_pharmacie
  for update using (pharmacie_id in (select id from public.pharmacies where user_id = auth.uid()));

-- Le travailleur se signale à une pharmacie en scannant son QR
create or replace function public.travailleur_signaler_presence(p_pharmacie_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if public.get_user_role(auth.uid()) <> 'travailleur' then
    raise exception 'Accès refusé : réservé aux travailleurs';
  end if;

  insert into public.presences_pharmacie (travailleur_id, pharmacie_id, statut)
  values (auth.uid(), p_pharmacie_id, 'en_attente')
  returning id into v_id;

  return v_id;
end;
$$;

-- La pharmacie prend en charge un travailleur signalé dans sa file
create or replace function public.pharmacie_prendre_en_charge(p_presence_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_travailleur_id uuid;
  v_pharmacie_id uuid;
begin
  select id into v_pharmacie_id from public.pharmacies where user_id = auth.uid();
  if v_pharmacie_id is null then
    raise exception 'Aucune pharmacie liée à ce compte';
  end if;

  update public.presences_pharmacie
  set statut = 'prise_en_charge', prise_en_charge_le = now()
  where id = p_presence_id and pharmacie_id = v_pharmacie_id
  returning travailleur_id into v_travailleur_id;

  if v_travailleur_id is null then
    raise exception 'Signalement introuvable pour cette pharmacie';
  end if;

  return v_travailleur_id;
end;
$$;
