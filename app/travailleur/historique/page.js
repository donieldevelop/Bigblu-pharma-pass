'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import BottomNav from '../../components/BottomNav';
import { ArrowLeft, ChevronRight, Plus } from 'lucide-react';

export default function HistoriquePage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data: s } = await supabase.auth.getSession();
      if (!s.session) return router.push('/travailleur/login');
      const { data: t } = await supabase
        .from('transactions')
        .select('id, montant_total, statut, created_at, pharmacies(nom)')
        .eq('travailleur_id', s.session.user.id)
        .order('created_at', { ascending: false });
      setTransactions(t || []);
      setLoading(false);
    })();
  }, [router]);

  return (
    <div className="screen">
      <div className="content">
        <a href="/travailleur" className="retour"><ArrowLeft size={18} /> Retour</a>
        <h1 className="titre">Mes achats</h1>

        {loading ? (
          <p>Chargement...</p>
        ) : transactions.length === 0 ? (
          <p className="vide">Aucune transaction pour le moment.</p>
        ) : (
          <div className="transList">
            {transactions.map((t) => (
              <a key={t.id} href={`/travailleur/transactions/${t.id}`} className="transItem">
                <div className={`transIcon ${t.statut === 'validee' ? 'transIconOk' : 'transIconAttente'}`}>
                  <Plus size={16} />
                </div>
                <div className="transInfo">
                  <strong>Achat médicaments</strong>
                  <span>{t.pharmacies?.nom || '—'} · {new Date(t.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
                <span className="transMontant">- {t.montant_total} FCFA</span>
                <ChevronRight size={16} color="#B9C4D3" />
              </a>
            ))}
          </div>
        )}
      </div>
      <BottomNav actif="achats" />

      <style jsx>{`
        .screen { background: #EEF2F6; min-height: 100vh; }
        .content { max-width: 480px; margin: 0 auto; padding: 20px 20px 100px; }
        .retour { display: inline-flex; align-items: center; gap: 6px; color: #5B6B82; text-decoration: none; font-size: 13px; margin-bottom: 16px; }
        .titre { font-size: 20px; margin: 0 0 16px; color: #12294D; }
        .vide { color: #8393A8; font-size: 13px; }
        .transList { background: white; border-radius: 14px; overflow: hidden; }
        .transItem { display: flex; align-items: center; gap: 10px; padding: 14px; text-decoration: none; color: #12294D; border-bottom: 1px solid #F0F2F5; }
        .transItem:last-child { border-bottom: none; }
        .transIcon { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0; }
        .transIconOk { background: #0E7C3F; }
        .transIconAttente { background: #8393A8; }
        .transInfo { flex: 1; display: flex; flex-direction: column; font-size: 13px; }
        .transInfo span { font-size: 11px; color: #8393A8; }
        .transMontant { font-size: 13px; font-weight: 700; color: #B8324D; }
      `}</style>
    </div>
  );
}
