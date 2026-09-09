-- ============================================================
-- BIG BLU PHARMA PASS — Phase 9 (partie back-end) : Notifications automatiques
-- À exécuter après phase6_7_8.sql
-- ============================================================

-- Notification automatique quand une transaction passe à "validee"
create or replace function public.notifier_transaction_validee()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.statut = 'validee' and (old.statut is distinct from 'validee') then
    insert into public.notifications (destinataire_id, type, contenu)
    values (
      new.travailleur_id,
      'transaction_validee',
      'Votre transaction de ' || new.montant_total || ' FCFA a été validée. Votre reçu est disponible.'
    );
  end if;
  return new;
end;
$$;

drop trigger if exists on_transaction_validee on public.transactions;
create trigger on_transaction_validee
  after update on public.transactions
  for each row execute procedure public.notifier_transaction_validee();

-- Notification automatique à l'expiration prochaine d'un abonnement
-- (à appeler périodiquement — ex. via un Cron Job Supabase quotidien, à programmer
-- dans Database > Cron Jobs une fois le projet en production)
create or replace function public.notifier_abonnements_bientot_expires()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (destinataire_id, type, contenu)
  select travailleur_id, 'abonnement_expiration',
    'Votre abonnement BIG BLU PHARMA PASS expire bientôt, pensez à le renouveler.'
  from public.abonnements
  where statut = 'actif'
    and date_expiration between now() and now() + interval '3 days'
    and not exists (
      select 1 from public.notifications n
      where n.destinataire_id = abonnements.travailleur_id
        and n.type = 'abonnement_expiration'
        and n.created_at > now() - interval '3 days'
    );
end;
$$;
