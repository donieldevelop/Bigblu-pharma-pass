-- ============================================================
-- BIG BLU PHARMA PASS — Complément : le travailleur peut marquer
-- ses propres notifications comme lues
-- ============================================================

create policy "notifications_self_update" on public.notifications
  for update using (destinataire_id = auth.uid());
