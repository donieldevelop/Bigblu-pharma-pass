'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabaseClient';

export default function DetailTransactionPage() {
  const { id } = useParams();
  const router = useRouter();
  const [transaction, setTransaction] = useState(null);
  const [medicaments, setMedicaments] = useState([]);
  const [recu, setRecu] = useState(null);
  const [pharmacie, setPharmacie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: s } = await supabase.auth.getSession();
      if (!s.session) return router.push('/travailleur/login');

      const { data: t } = await supabase.from('transactions').select('*').eq('id', id).single();
      setTransaction(t);

      if (t?.pharmacie_id) {
        const { data: p } = await supabase.from('pharmacies').select('nom, adresse').eq('id', t.pharmacie_id).single();
        setPharmacie(p);
      }

      const { data: m } = await supabase
        .from('medicaments')
        .select('id, nom, presentation, quantite, prix_total, indications(moments_prise, frequence, duree, note_complementaire)')
        .eq('transaction_id', id);
      setMedicaments(m || []);

      const { data: r } = await supabase.from('recus').select('reference, created_at').eq('transaction_id', id).maybeSingle();
      setRecu(r);

      setLoading(false);
    })();
  }, [id, router]);

  if (loading) return null;
  if (!transaction) return <p style={{ padding: 24 }}>Transaction introuvable.</p>;

  return (
    <div style={{ background: '#EEF2F6', minHeight: '100vh' }}>
      <div style={{ maxWidth: 440, margin: '0 auto', padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h1 style={{ fontSize: 18, color: '#12294D' }}>Détail</h1>
          <a href="/travailleur" style={{ fontSize: 13, color: '#5B6B82' }}>← Retour</a>
        </div>

        <div style={{ background: 'white', borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <p style={{ fontSize: 13, color: '#8393A8', margin: 0 }}>{pharmacie?.nom}</p>
          <p style={{ fontSize: 12, color: '#8393A8', margin: '2px 0 12px' }}>{pharmacie?.adresse}</p>
          <p style={{ fontSize: 24, fontWeight: 700, color: '#12294D', margin: 0 }}>{transaction.montant_total} FCFA</p>
          <p style={{ fontSize: 12, color: '#157347', margin: '4px 0 0' }}>{transaction.statut}</p>
          {recu && (
            <p style={{ fontSize: 12, color: '#8393A8', marginTop: 8 }}>
              Reçu {recu.reference} — {new Date(recu.created_at).toLocaleString('fr-FR')}
            </p>
          )}
        </div>

        <p style={{ fontSize: 13, fontWeight: 600, color: '#12294D', marginBottom: 8 }}>Médicaments</p>
        {medicaments.map((m) => (
          <div key={m.id} style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong style={{ fontSize: 14 }}>{m.nom}</strong>
              <span style={{ fontSize: 13, color: '#5B6B82' }}>{m.prix_total} FCFA</span>
            </div>
            {m.presentation && <p style={{ fontSize: 12, color: '#8393A8', margin: '2px 0' }}>{m.presentation} — Qté {m.quantite}</p>}

            {m.indications && (
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #eee', fontSize: 12, color: '#3E4C63' }}>
                {m.indications.moments_prise?.length > 0 && (
                  <p style={{ margin: '2px 0' }}>Prise : {m.indications.moments_prise.join(', ')}</p>
                )}
                {m.indications.frequence && <p style={{ margin: '2px 0' }}>Fréquence : {m.indications.frequence}</p>}
                {m.indications.duree && <p style={{ margin: '2px 0' }}>Durée : {m.indications.duree}</p>}
                {m.indications.note_complementaire && <p style={{ margin: '2px 0' }}>Note : {m.indications.note_complementaire}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
