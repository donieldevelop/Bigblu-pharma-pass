'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

export default function TransactionsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        router.push('/login');
        return;
      }
      const { data } = await supabase
        .from('transactions')
        .select('id, reference, montant_total, statut, created_at, travailleur_id, pharmacie_id, pharmacies(nom), utilisateurs(nom, prenom, email)')
        .order('created_at', { ascending: false });
      setRows(data || []);
      setLoading(false);
    })();
  }, [router]);

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 22 }}>Transactions</h1>
        <a href="/dashboard" style={{ fontSize: 14, color: '#1a3a6b' }}>← Tableau de bord</a>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : rows.length === 0 ? (
        <p style={{ color: '#888' }}>Aucune transaction pour le moment — elles apparaîtront ici dès qu'une pharmacie en créera une.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 8, overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: '#eef1f6', textAlign: 'left' }}>
              <th style={{ padding: 10 }}>Référence</th>
              <th style={{ padding: 10 }}>Travailleur</th>
              <th style={{ padding: 10 }}>Pharmacie</th>
              <th style={{ padding: 10 }}>Montant</th>
              <th style={{ padding: 10 }}>Statut</th>
              <th style={{ padding: 10 }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id} style={{ borderTop: '1px solid #eee' }}>
                <td style={{ padding: 10 }}>{t.reference}</td>
                <td style={{ padding: 10 }}>{t.utilisateurs ? `${t.utilisateurs.prenom || ''} ${t.utilisateurs.nom || ''}`.trim() || t.utilisateurs.email : '—'}</td>
                <td style={{ padding: 10 }}>{t.pharmacies?.nom || '—'}</td>
                <td style={{ padding: 10 }}>{t.montant_total} FCFA</td>
                <td style={{ padding: 10 }}>{t.statut}</td>
                <td style={{ padding: 10 }}>{new Date(t.created_at).toLocaleString('fr-FR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
