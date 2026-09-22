-- ============================================================
-- BIGBLU PHARMA PASS — Carte numérique immédiate + validité 2 ans
-- + admin "cartes" granulaire
-- ============================================================
-- Principe : la carte NUMÉRIQUE (visible dans l'app) est générée
-- immédiatement dès que le travailleur fournit entreprise + photo.
-- Le champ `statut` (en_attente / disponible / recuperee) ne sert
-- plus qu'à la LOGISTIQUE de remise de la carte PHYSIQUE imprimée.
-- ============================================================

-- 1. Validité de la carte (2 ans)
alter table public.cartes_travailleur
  add column if not exists date_expiration timestamptz;

-- 2. Génération immédiate du matricule + de l'expiration à la création
--    (avant, ça n'arrivait qu'au clic admin "disponible")
create or replace function public.emettre_carte_numerique()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.matricule := coalesce(new.matricule, public.generer_matricule());
  new.date_expiration := coalesce(new.date_expiration, now() + interval '2 years');
  return new;
end;
$$;

drop trigger if exists on_carte_creee on public.cartes_travailleur;
create trigger on_carte_creee
  before insert on public.cartes_travailleur
  for each row execute procedure public.emettre_carte_numerique();

-- 3. Fonction générique : un admin_secondaire a-t-il le droit sur un module ?
--    (le super_admin a toujours tous les droits)
create or replace function public.a_autorisation(p_module text, p_ecriture boolean default false)
returns boolean
language sql
security definer
set search_path = public
as $$
  select
    public.get_user_role(auth.uid()) = 'super_admin'
    or exists (
      select 1 from public.autorisations_admin
      where user_id = auth.uid()
        and module = p_module
        and (not p_ecriture or peut_ecrire = true)
    );
$$;


-- 4. admin_carte_disponible ne doit plus régénérer le matricule
--    (il existe déjà depuis la création) — il ne fait plus que la
--    logistique physique.
create or replace function public.admin_carte_disponible(p_carte_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_matricule text;
begin
  if not public.a_autorisation('cartes', true) then
    raise exception 'Accès refusé : réservé aux administrateurs autorisés sur le module cartes';
  end if;

  update public.cartes_travailleur
  set statut = 'disponible', disponible_le = now(), traitee_par = auth.uid()
  where id = p_carte_id
  returning matricule into v_matricule;

  insert into public.notifications (destinataire_id, type, contenu)
  select travailleur_id, 'carte_disponible', 'Ta carte physique BIGBLU PHARMA PASS est prête ! Récupère-la au bureau.'
  from public.cartes_travailleur where id = p_carte_id;

  insert into public.journaux_activite (acteur_id, action, objet_type, objet_id)
  values (auth.uid(), 'carte_disponible', 'carte', p_carte_id);

  return v_matricule;
end;
$$;

create or replace function public.admin_carte_recuperee(p_carte_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.a_autorisation('cartes', true) then
    raise exception 'Accès refusé : réservé aux administrateurs autorisés sur le module cartes';
  end if;

  update public.cartes_travailleur
  set statut = 'recuperee', recuperee_le = now()
  where id = p_carte_id;

  insert into public.journaux_activite (acteur_id, action, objet_type, objet_id)
  values (auth.uid(), 'carte_recuperee', 'carte', p_carte_id);
end;
$$;

-- 5. La policy de lecture/écriture directe sur cartes_travailleur suit
--    la même règle (super_admin OU admin autorisé sur le module 'cartes')
drop policy if exists "cartes_admin" on public.cartes_travailleur;
create policy "cartes_admin" on public.cartes_travailleur
  for all using (public.a_autorisation('cartes', true));

-- 6. Vue file d'impression : ce que voit l'admin "cartes" au quotidien
create or replace view public.vue_file_impression_cartes as
select
  c.id, c.matricule, c.entreprise, c.photo_url, c.statut,
  c.demandee_le, c.disponible_le, c.recuperee_le, c.date_expiration,
  u.nom, u.prenom, u.email
from public.cartes_travailleur c
join public.utilisateurs u on u.id = c.travailleur_id
order by c.demandee_le desc;
