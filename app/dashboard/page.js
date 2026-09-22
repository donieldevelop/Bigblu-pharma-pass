'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import AdminSidebar from '../components/AdminSidebar';
import BarChartSVG from '../components/BarChartSVG';
import { Users, Building2, Wallet, Receipt } from 'lucide-react';

export default function DashboardPage() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [stats, setStats] = useState(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        router.push('/login');
        return;
      }
      setSession(data.session);
      setChecking(false);
      await chargerStats();
    });
  }, [router]);

  async function chargerStats() {
    const debutMois = new Date();
    debutMois.setDate(1);
    debutMois.setHours(0, 0, 0, 0);

    const [
      { count: travailleursActifs },
      { count: pharmaciesActives },
      { count: abonnementsActifs },
      { data: transactionsMois },
      { data: reglements },
    ] = await Promise.all([
      supabase.from('utilisateurs').select('id', { count: 'exact', head: true }).eq('role', 'travailleur').eq('statut', 'actif'),
      supabase.from('pharmacies').select('id', { count: 'exact', head: true }).eq('statut', 'active'),
      supabase.from('abonnements').select('id', { count: 'exact', head: true }).eq('statut', 'actif'),
      supabase
        .from('transactions')
        .select('id, reference, montant_total, statut, created_at, pharmacie_id, travailleur_id, pharmacies(nom), utilisateurs(nom, prenom)')
        .gte('created_at', debutMois.toISOString())
        .order('created_at', { ascending: false }),
      supabase.from('vue_reglements_pharmacies').select('*'),
    ]);

    const validees = (transactionsMois || []).filter((t) => t.statut === 'validee');
    const volumeMois = validees.reduce((s, t) => s + Number(t.montant_total || 0), 0);

    const jours = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      jours.push(d);
    }
    const chartData = jours.map((jour) => {
      const lendemain = new Date(jour);
      lendemain.setDate(lendemain.getDate() + 1);
      const total = validees
        .filter((t) => {
          const dt = new Date(t.created_at);
          return dt >= jour && dt < lendemain;
        })
        .reduce((s, t) => s + Number(t.montant_total || 0), 0);
      return { label: jour.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }), value: total };
    });

    const parPharmacie = {};
    validees.forEach((t) => {
      const nom = t.pharmacies?.nom || 'Pharmacie';
      parPharmacie[nom] = (parPharmacie[nom] || 0) + Number(t.montant_total || 0);
    });
    const topPharmacies = Object.entries(parPharmacie)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const montantEnAttente = (reglements || []).reduce((s, r) => s + Number(r.montant_en_attente || 0), 0);
    const montantDejaRegle = (reglements || []).reduce((s, r) => s + Number(r.montant_deja_regle || 0), 0);

    setStats({
      travailleursActifs: travailleursActifs || 0,
      pharmaciesActives: pharmaciesActives || 0,
      abonnementsActifs: abonnementsActifs || 0,
      volumeMois,
      nbTransactionsMois: validees.length,
      recentes: (transactionsMois || []).slice(0, 6),
      chartData,
      topPharmacies,
      montantEnAttente,
      montantDejaRegle,
    });
  }

  if (checking || !stats) return null;

  return (
    <div className="wrap">
      <AdminSidebar />

      <main className="contenu">
        <div className="entete">
          <div>
            <h1>Tableau de bord</h1>
            <p>Vue globale de l&apos;activité BIGBLU PHARMA PASS</p>
          </div>
          <span className="connecte">{session?.user?.email}</span>
        </div>

        <div className="grille">
          <div className="stat stat-hero">
            <span className="label">Volume de transactions — ce mois</span>
            <strong className="chiffre">{stats.volumeMois.toLocaleString('fr-FR')} FCFA</strong>
            <span className="sousLigne">{stats.nbTransactionsMois} transactions validées</span>
            <div className="chartWrap"><BarChartSVG data={stats.chartData} color="#D98E3B" height={70} /></div>
          </div>

          <div className="stat">
            <Users size={18} color="#2E7BC4" />
            <strong>{stats.travailleursActifs.toLocaleString('fr-FR')}</strong>
            <span>Travailleurs actifs</span>
          </div>

          <div className="stat">
            <Building2 size={18} color="#6C4FB3" />
            <strong>{stats.pharmaciesActives.toLocaleString('fr-FR')}</strong>
            <span>Pharmacies partenaires</span>
          </div>

          <div className="stat">
            <Receipt size={18} color="#0E7C3F" />
            <strong>{stats.abonnementsActifs.toLocaleString('fr-FR')}</strong>
            <span>Abonnements actifs</span>
          </div>
        </div>

        <div className="reglementCallout">
          <Wallet size={20} color="#12294D" />
          <div>
            <strong>Règlements aux pharmacies</strong>
            <p>
              {stats.montantDejaRegle.toLocaleString('fr-FR')} FCFA déjà versés ·{' '}
              <span className="enAttente">{stats.montantEnAttente.toLocaleString('fr-FR')} FCFA en attente</span>
            </p>
          </div>
          <a href="/dashboard/pharmacies">Voir le détail →</a>
        </div>

        <div className="colonnes">
          <div className="bloc">
            <h2>Dernières transactions</h2>
            {stats.recentes.length === 0 ? (
              <p className="vide">Aucune transaction ce mois.</p>
            ) : (
              <div className="listeTransactions">
                {stats.recentes.map((t) => (
                  <div key={t.id} className="ligneT">
                    <div>
                      <strong>{t.utilisateurs?.prenom} {t.utilisateurs?.nom}</strong>
                      <span>{t.pharmacies?.nom} · {new Date(t.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="droiteT">
                      <span className="montant">{Number(t.montant_total).toLocaleString('fr-FR')} F</span>
                      <span className={'badge badge-' + t.statut}>{t.statut}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bloc">
            <h2>Top 5 pharmacies — ce mois</h2>
            {stats.topPharmacies.length === 0 ? (
              <p className="vide">Pas encore de données.</p>
            ) : (
              <div className="listeTop">
                {stats.topPharmacies.map(([nom, montant], i) => (
                  <div key={nom} className="ligneTop">
                    <span className="rang">{i + 1}</span>
                    <span className="nomP">{nom}</span>
                    <strong>{montant.toLocaleString('fr-FR')} F</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <style jsx>{`
        .wrap { display: flex; min-height: 100vh; background: #EEF2F6; font-family: var(--font-body), sans-serif; }
        .contenu { flex: 1; padding: 32px 36px 60px; max-width: 1100px; }
        .entete { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
        .entete h1 { font-family: var(--font-display), sans-serif; font-size: 24px; color: #0B1B33; margin: 0 0 4px; }
        .entete p { color: #5B6B82; font-size: 13.5px; margin: 0; }
        .connecte { font-size: 12px; color: #8393A8; }

        .grille { display: grid; grid-template-columns: 1.6fr 1fr 1fr 1fr; gap: 14px; margin-bottom: 18px; }
        .stat { background: white; border-radius: 14px; padding: 18px; display: flex; flex-direction: column; gap: 6px; }
        .stat strong { font-family: var(--font-display), sans-serif; font-size: 22px; color: #12294D; }
        .stat span { font-size: 12.5px; color: #8393A8; }
        .stat-hero { background: #0B1B33; color: white; grid-row: span 1; }
        .stat-hero .label { font-size: 12px; color: rgba(255,255,255,0.6); }
        .stat-hero .chiffre { font-family: var(--font-display), sans-serif; font-size: 30px; color: #F0C48A; margin: 2px 0; }
        .stat-hero .sousLigne { font-size: 12px; color: rgba(255,255,255,0.55); margin-bottom: 8px; }
        .chartWrap { margin-top: 6px; }

        .reglementCallout { background: #FBEBD3; border-radius: 14px; padding: 16px 20px; display: flex; align-items: center; gap: 14px; margin-bottom: 24px; }
        .reglementCallout strong { display: block; color: #12294D; font-size: 14px; }
        .reglementCallout p { margin: 2px 0 0; font-size: 13px; color: #5B6B82; }
        .reglementCallout .enAttente { color: #B8324D; font-weight: 600; }
        .reglementCallout div { flex: 1; }
        .reglementCallout a { font-size: 13px; color: #12294D; font-weight: 600; text-decoration: none; white-space: nowrap; }

        .colonnes { display: grid; grid-template-columns: 1.4fr 1fr; gap: 18px; }
        .bloc { background: white; border-radius: 14px; padding: 20px; }
        .bloc h2 { font-family: var(--font-display), sans-serif; font-size: 15px; color: #12294D; margin: 0 0 14px; }
        .vide { color: #8393A8; font-size: 13px; }

        .listeTransactions { display: flex; flex-direction: column; gap: 12px; }
        .ligneT { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #F0F2F5; padding-bottom: 10px; }
        .ligneT:last-child { border-bottom: none; padding-bottom: 0; }
        .ligneT strong { display: block; font-size: 13.5px; color: #12294D; }
        .ligneT span { font-size: 11.5px; color: #8393A8; }
        .droiteT { text-align: right; }
        .montant { display: block; font-size: 13px; color: #12294D; font-weight: 600; }
        .badge { display: inline-block; margin-top: 3px; font-size: 10px; padding: 2px 7px; border-radius: 5px; background: #F0F2F5; color: #5B6B82; text-transform: capitalize; }
        .badge-validee { background: #E4F5EA; color: #0E7C3F; }
        .badge-refusee { background: #FBE7E9; color: #B8324D; }

        .listeTop { display: flex; flex-direction: column; gap: 10px; }
        .ligneTop { display: flex; align-items: center; gap: 10px; font-size: 13px; }
        .rang { width: 20px; height: 20px; border-radius: 50%; background: #EEF2F6; color: #5B6B82; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; }
        .nomP { flex: 1; color: #12294D; }
        .ligneTop strong { color: #12294D; }
      `}</style>
    </div>
  );
}
