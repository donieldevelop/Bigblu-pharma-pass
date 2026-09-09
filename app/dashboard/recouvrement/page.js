'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

export default function RecouvrementPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [montants, setMontants] = useState({});
  const [error, setError] = useState('');
  const router = useRouter();

  async function load() {
    setLoading(true);
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return router.push('/login');
    const { data, error } = await supabase.from('vue_recouvrement').select('*');
    if (error) setError(error.message);
    setRows(data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function enregistrerRemboursement(id) {
    const montant = parseFloat(montants[id]);
    if (!montant || montant <= 0) return;
    const reference = 'REMB-' + Date.now();
    const { error } = await supabase.rpc('admin_enregistrer_remboursement', {
      p_travailleur_id: id,
      p_montant: montant,
      p_reference: reference,
    });
    if (error) return setError(error.message);
    setMontants({ ...montants, [id]: '' });
    load();
  }

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 22 }}>Dettes & Recouvrement</h1>
        <a href="/dashboard" style={{ fontSize: 14, color: '#1a3a6b' }}>← Tableau de bord</a>
      </div>

      {error && <p style={{ color: '#c0392b' }}>{error}</p>}
      {loading ? (
        <p>Chargement...</p>
      ) : rows.length === 0 ? (
        <p style={{ color: '#888' }}>Aucune dette en cours actuellement.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 8, overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: '#eef1f6', textAlign: 'left' }}>
              <th style={{ padding: 10 }}>Travailleur</th>
              <th style={{ padding: 10 }}>Dette</th>
              <th style={{ padding: 10 }}>Déjà remboursé</th>
              <th style={{ padding: 10 }}>Enregistrer un remboursement</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} style={{ borderTop: '1px solid #eee' }}>
                <td style={{ padding: 10 }}>{[r.prenom, r.nom].filter(Boolean).join(' ') || r.email}</td>
                <td style={{ padding: 10, color: '#c0392b' }}>{r.montant_du} FCFA</td>
                <td style={{ padding: 10 }}>{r.montant_rembourse} FCFA</td>
                <td style={{ padding: 10, display: 'flex', gap: 6 }}>
                  <input
                    type="number"
                    placeholder="Montant"
                    value={montants[r.id] || ''}
                    onChange={(e) => setMontants({ ...montants, [r.id]: e.target.value })}
                    style={{ width: 100, padding: 6, borderRadius: 6, border: '1px solid #ddd' }}
                  />
                  <button
                    onClick={() => enregistrerRemboursement(r.id)}
                    style={{ padding: '6px 12px', borderRadius: 6, border: 'none', background: '#0e7c3f', color: 'white', cursor: 'pointer' }}
                  >
                    Enregistrer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
