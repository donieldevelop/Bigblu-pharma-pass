'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import PharmacieBottomNav from '../../components/PharmacieBottomNav';
import { ArrowLeft } from 'lucide-react';

export default function TransactionsPharmaciePage() {
  const [transactions, setTransactions] = useState(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data: s } = await supabase.auth.getSession();
      if (!s.session) return router.push('/pharmacie/login');
      const { data: p } = await supabase.from('pharmacies').select('id').eq('user_id', s.session.user.id).maybeSingle();
      if (!p) return setTransactions([]);
      const { data: t } = await supabase
        .from('transactions')
        .select('id, reference, montant_total, statut, created_at, utilisateurs(nom, prenom)')
        .eq('pharmacie_id', p.id)
        .order('created_at', { ascending: false })
        .limit(50);
      setTransactions(t || []);
    })();
  }, [router]);

  if (!transactions) return null;

  return (
    <div className="ecran">
      <div className="contenu">
        <a href="/pharmacie" className="retour"><ArrowLeft size={18} /> Accueil</a>
        <h1>Transactions</h1>

        {transactions.length === 0 ? (
          <p className="vide">Aucune transaction pour le moment.</p>
        ) : (
          <div className="liste">
            {transactions.map((t) => (
              <div key={t.id} className="ligne">
                <div>
                  <strong>{t.utilisateurs?.prenom} {t.utilisateurs?.nom}</strong>
                  <span>{t.reference} · {new Date(t.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="droite">
                  <span className="montant">{Number(t.montant_total).toLocaleString('fr-FR')} F</span>
                  <span className={'badge badge-' + t.statut}>{t.statut}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <PharmacieBottomNav actif="transactions" />

      <style jsx>{`
        .ecran { background: #EEF2F6; min-height: 100vh; font-family: var(--font-body), sans-serif; }
        .contenu { max-width: 480px; margin: 0 auto; padding: 20px 20px 100px; }
        .retour { display: inline-flex; align-items: center; gap: 6px; color: #5B6B82; text-decoration: none; font-size: 13px; margin-bottom: 10px; }
        h1 { font-family: var(--font-display), sans-serif; font-size: 20px; color: #0B1B33; margin: 0 0 16px; }
        .vide { color: #8393A8; font-size: 13px; }
        .liste { display: flex; flex-direction: column; gap: 10px; }
        .ligne { background: white; border-radius: 12px; padding: 14px; display: flex; justify-content: space-between; align-items: center; }
        .ligne strong { display: block; color: #12294D; font-size: 13.5px; }
        .ligne span { font-size: 11.5px; color: #8393A8; }
        .droite { text-align: right; }
        .montant { display: block; font-size: 13px; color: #12294D; font-weight: 600; }
        .badge { display: inline-block; margin-top: 3px; font-size: 10px; padding: 2px 7px; border-radius: 5px; background: #F0F2F5; color: #5B6B82; text-transform: capitalize; }
        .badge-validee { background: #E4F5EA; color: #0E7C3F; }
        .badge-refusee { background: #FBE7E9; color: #B8324D; }
      `}</style>
    </div>
  );
}
