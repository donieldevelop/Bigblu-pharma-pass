-- ============================================================
-- BIGBLU PHARMA PASS — Publication et disponibilité des pharmacies
-- Un compte pharmacie "actif" peut fonctionner en interne sans être
-- visible publiquement. Deux interrupteurs distincts, gérés par l'admin :
--   - publie      : apparaît (ou non) dans la liste publique
--   - disponible  : temporairement indisponible sans être dépubliée
-- ============================================================

alter table public.pharmacies
  add column if not exists publie boolean not null default false,
  add column if not exists disponible boolean not null default true;

-- Remplace la policy publique : il faut désormais être actif, publié ET disponible
drop policy if exists "pharmacies_lecture_publique" on public.pharmacies;
create policy "pharmacies_lecture_publique" on public.pharmacies
  for select using (statut = 'active' and publie = true and disponible = true);
