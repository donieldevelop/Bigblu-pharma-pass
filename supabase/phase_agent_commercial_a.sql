-- ============================================================
-- BIGBLU PHARMA PASS — Rôle Agent commercial (Bloc A)
-- À EXÉCUTER SEUL, PUIS VALIDER, AVANT le bloc B (phase_agent_commercial_b.sql)
-- Raison technique : Postgres n'autorise pas d'utiliser une nouvelle
-- valeur d'enum dans la même transaction où elle est ajoutée.
-- ============================================================

alter type user_role add value if not exists 'commercial';
