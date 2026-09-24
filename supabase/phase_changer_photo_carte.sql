-- ============================================================
-- BIGBLU PHARMA PASS — Le travailleur peut changer la photo de SA carte
-- (meme carte, meme matricule : seule la photo change)
-- A executer une fois dans Supabase > SQL Editor
-- ============================================================
create or replace function public.changer_photo_carte(p_carte_id uuid, p_photo_url text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_photo_url is null or p_photo_url = '' then
    raise exception 'Photo manquante';
  end if;
  update public.cartes_travailleur
     set photo_url = p_photo_url
   where id = p_carte_id
     and travailleur_id = auth.uid();
  if not found then
    raise exception 'Carte introuvable ou non autorisée';
  end if;
end;
$$;

grant execute on function public.changer_photo_carte(uuid, text) to authenticated;
