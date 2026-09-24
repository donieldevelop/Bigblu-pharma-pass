-- ============================================================
-- BIGBLU PHARMA PASS — Liste publique des pharmacies partenaires
-- Permet aux visiteurs non connectés de voir les pharmacies actives
-- ============================================================

create policy "pharmacies_lecture_publique" on public.pharmacies
  for select using (statut = 'active');
