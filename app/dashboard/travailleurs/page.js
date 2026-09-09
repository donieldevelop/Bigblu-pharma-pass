'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import QrCodeCanvas from '../../components/QrCodeCanvas';

export default function TravailleursPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const router = useRouter();

  async function load() {
    setLoading(true);
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      router.push('/login');
      return;
    }
    const { data, error } = await supabase
      .from('vue_admin_travailleurs')
      .select('*')
      .order('nom', { ascending: true });
    if (error) setError(error.message);
    setRows(data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function activer(id) {
    setBusyId(id);
    const { error } = await supabase.rpc('admin_activer_travailleur', { p_travailleur_id: id });
    if (error) alert(error.message);
    await load();
    setBusyId(null);
  }

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 22 }}>Travailleurs</h1>
        <a href="/dashboard" style={{ fontSize: 14, color: '#1a3a6b' }}>← Tableau de bord</a>
      </div>

      <p style={{ color: '#888', fontSize: 13, marginBottom: 16 }}>
        Abonnement : 1 500 FCFA/mois — Plafond crédit : 30 000 FCFA/mois. En attendant l'intégration du
        paiement (dernière phase), l'activation se fait manuellement ici.
      </p>

      {error && <p style={{ color: '#c0392b' }}>{error}</p>}
      {loading ? (
        <p>Chargement...</p>
      ) : rows.length === 0 ? (
        <p style={{ color: '#888' }}>Aucun travailleur inscrit pour le moment.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 8, overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: '#eef1f6', textAlign: 'left' }}>
              <th style={{ padding: 10 }}>Nom</th>
              <th style={{ padding: 10 }}>E-mail</th>
              <th style={{ padding: 10 }}>Compte</th>
              <th style={{ padding: 10 }}>Abonnement</th>
              <th style={{ padding: 10 }}>Crédit dispo.</th>
              <th style={{ padding: 10 }}>Dette</th>
              <th style={{ padding: 10 }}>QR Code</th>
              <th style={{ padding: 10 }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} style={{ borderTop: '1px solid #eee' }}>
                <td style={{ padding: 10 }}>{[r.prenom, r.nom].filter(Boolean).join(' ') || '—'}</td>
                <td style={{ padding: 10 }}>{r.email}</td>
                <td style={{ padding: 10 }}>{r.statut_compte}</td>
                <td style={{ padding: 10 }}>{r.statut_abonnement || 'aucun'}</td>
                <td style={{ padding: 10 }}>{r.montant_disponible != null ? `${r.montant_disponible} FCFA` : '—'}</td>
                <td style={{ padding: 10 }}>{r.montant_du != null ? `${r.montant_du} FCFA` : '—'}</td>
                <td style={{ padding: 10 }}>
                  <QrCodeCanvas value={r.id} size={60} />
                </td>
                <td style={{ padding: 10 }}>
                  {r.statut_abonnement !== 'actif' && (
                    <button
                      onClick={() => activer(r.id)}
                      disabled={busyId === r.id}
                      style={{ padding: '6px 12px', borderRadius: 6, border: 'none', background: '#1a3a6b', color: 'white', cursor: 'pointer' }}
                    >
                      {busyId === r.id ? '...' : 'Activer'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
