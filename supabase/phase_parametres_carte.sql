-- ============================================================
-- BIGBLU PHARMA PASS — Paramètres modifiables par l'admin
-- Coordonnées affichées sur le verso de la carte (et ailleurs à
-- l'avenir), éditables sans repasser par le code.
-- ============================================================

create table public.parametres_carte (
  id int primary key default 1,
  telephone_service_client text not null default '',
  site_web text not null default '',
  updated_at timestamptz not null default now(),
  check (id = 1)
);

insert into public.parametres_carte (id, telephone_service_client, site_web)
values (1, '', '')
on conflict (id) do nothing;

alter table public.parametres_carte enable row level security;

create policy "parametres_carte_admin" on public.parametres_carte
  for all using (public.get_user_role(auth.uid()) = 'super_admin');
