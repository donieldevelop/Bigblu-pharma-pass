-- ============================================================
-- BIG BLU PHARMA PASS — Phase 5 : Transaction & IA (terrain)
-- À exécuter dans Supabase SQL Editor après phase4_qrcode.sql
-- ============================================================

-- 1. Policies manquantes sur medicaments, indications, recus
create policy "medicaments_pharmacie" on public.medicaments
  for all using (
    public.get_user_role(auth.uid()) = 'pharmacie'
    and transaction_id in (
      select t.id from public.transactions t
      join public.pharmacies p on p.id = t.pharmacie_id
      where p.user_id = auth.uid()
    )
  );

create policy "medicaments_travailleur_lecture" on public.medicaments
  for select using (
    transaction_id in (select id from public.transactions where travailleur_id = auth.uid())
  );

create policy "medicaments_admin" on public.medicaments
  for select using (public.get_user_role(auth.uid()) = 'super_admin');

create policy "indications_pharmacie" on public.indications
  for all using (
    public.get_user_role(auth.uid()) = 'pharmacie'
    and medicament_id in (
      select m.id from public.medicaments m
      join public.transactions t on t.id = m.transaction_id
      join public.pharmacies p on p.id = t.pharmacie_id
      where p.user_id = auth.uid()
    )
  );

create policy "indications_travailleur_lecture" on public.indications
  for select using (
    medicament_id in (
      select m.id from public.medicaments m
      join public.transactions t on t.id = m.transaction_id
      where t.travailleur_id = auth.uid()
    )
  );

create policy "recus_travailleur" on public.recus
  for select using (transaction_id in (select id from public.transactions where travailleur_id = auth.uid()));

create policy "recus_pharmacie" on public.recus
  for select using (
    transaction_id in (
      select t.id from public.transactions t
      join public.pharmacies p on p.id = t.pharmacie_id
      where p.user_id = auth.uid()
    )
  );

create policy "recus_admin" on public.recus
  for select using (public.get_user_role(auth.uid()) = 'super_admin');

-- 2. Créer une transaction (appelée par la pharmacie après scan du QR Code travailleur)
create or replace function public.creer_transaction(p_travailleur_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pharmacie_id uuid;
  v_transaction_id uuid;
begin
  if public.get_user_role(auth.uid()) <> 'pharmacie' then
    raise exception 'Accès refusé : réservé aux pharmacies';
  end if;

  select id into v_pharmacie_id from public.pharmacies where user_id = auth.uid();
  if v_pharmacie_id is null then
    raise exception 'Aucune pharmacie liée à ce compte';
  end if;

  insert into public.transactions (travailleur_id, pharmacie_id, statut)
  values (p_travailleur_id, v_pharmacie_id, 'en_cours')
  returning id into v_transaction_id;

  return v_transaction_id;
end;
$$;

-- 3. Ajouter un médicament à une transaction en cours
create or replace function public.ajouter_medicament(
  p_transaction_id uuid,
  p_nom text,
  p_presentation text,
  p_quantite integer,
  p_prix_unitaire numeric,
  p_donnees_ia jsonb default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_medicament_id uuid;
begin
  insert into public.medicaments (transaction_id, nom, presentation, quantite, prix_unitaire, prix_total, donnees_detectees_ia)
  values (p_transaction_id, p_nom, p_presentation, p_quantite, p_prix_unitaire, p_quantite * p_prix_unitaire, p_donnees_ia)
  returning id into v_medicament_id;

  update public.transactions
  set montant_total = (select coalesce(sum(prix_total), 0) from public.medicaments where transaction_id = p_transaction_id)
  where id = p_transaction_id;

  return v_medicament_id;
end;
$$;

-- 4. Valider la transaction : contrôle du crédit + mise à jour atomique
--    (Règle 6 et 8 du cahier des charges technique : contrôle avant validation,
--    mise à jour cohérente sans doublon)
create or replace function public.valider_transaction(p_transaction_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_transaction record;
  v_credit record;
  v_reference text;
begin
  select * into v_transaction from public.transactions where id = p_transaction_id for update;

  if v_transaction is null then
    raise exception 'Transaction introuvable';
  end if;

  if v_transaction.statut = 'validee' then
    raise exception 'Transaction déjà validée'; -- anti-doublon
  end if;

  select * into v_credit from public.credits where travailleur_id = v_transaction.travailleur_id for update;

  if v_credit is null or (v_credit.plafond - v_credit.montant_utilise) < v_transaction.montant_total then
    update public.transactions set statut = 'refusee' where id = p_transaction_id;
    return jsonb_build_object('succes', false, 'raison', 'credit_insuffisant');
  end if;

  -- Mise à jour du crédit et de la dette
  update public.credits
  set montant_utilise = montant_utilise + v_transaction.montant_total,
      montant_du = montant_du + v_transaction.montant_total,
      updated_at = now()
  where travailleur_id = v_transaction.travailleur_id;

  update public.transactions
  set statut = 'validee', validated_at = now()
  where id = p_transaction_id;

  -- Génération du reçu
  v_reference := 'RCU-' || upper(substr(gen_random_uuid()::text, 1, 8));
  insert into public.recus (transaction_id, reference) values (p_transaction_id, v_reference);

  -- Traçabilité
  insert into public.mouvements_credit (travailleur_id, type_mouvement, montant, effectue_par)
  values (v_transaction.travailleur_id, 'utilisation', v_transaction.montant_total, auth.uid());

  insert into public.journaux_activite (acteur_id, action, objet_type, objet_id)
  values (auth.uid(), 'validation_transaction', 'transaction', p_transaction_id);

  return jsonb_build_object('succes', true, 'reference', v_reference);
end;
$$;
