'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

export default function CartesAdminPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const router = useRouter();

  async function load() {
    setLoading(true);
    const { data: s } = await supabase.auth.getSession();
    if (!s.session) return router.push('/login');
    const { data, error } = await supabase
      .from('cartes_travailleur')
      .select('id, entreprise, photo_url, matricule, statut, demandee_le, date_expiration, utilisateurs(nom, prenom, email)')
      .order('demandee_le', { ascending: false });
    if (error) setError(error.message);
    setRows(data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function marquerDisponible(id) {
    setBusyId(id);
    const { error } = await supabase.rpc('admin_carte_disponible', { p_carte_id: id });
    if (error) alert(error.message);
    await load();
    setBusyId(null);
  }

  async function marquerRecuperee(id) {
    setBusyId(id);
    const { error } = await supabase.rpc('admin_carte_recuperee', { p_carte_id: id });
    if (error) alert(error.message);
    await load();
    setBusyId(null);
  }

  const libelle = { en_attente: 'En attente', disponible: 'Disponible (à récupérer)', recuperee: 'Récupérée', refusee: 'Refusée' };

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 22 }}>File d&apos;impression des cartes</h1>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <a href="/dashboard/cartes/verso" style={{ fontSize: 14, color: '#1a3a6b' }}>Voir le verso →</a>
          <a href="/dashboard" style={{ fontSize: 14, color: '#1a3a6b' }}>← Tableau de bord</a>
        </div>
      </div>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
        La carte numérique du travailleur est déjà active dès sa demande. Cette page gère uniquement la logistique d&apos;impression et de remise de la carte physique.
      </p>

      {error && <p style={{ color: '#c0392b' }}>{error}</p>}
      {loading ? (
        <p>Chargement...</p>
      ) : rows.length === 0 ? (
        <p style={{ color: '#888' }}>Aucune demande pour le moment.</p>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {rows.map((c) => (
            <div key={c.id} style={{ background: 'white', borderRadius: 10, padding: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
              <img src={c.photo_url} alt="" style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <strong>{c.utilisateurs?.prenom} {c.utilisateurs?.nom}</strong>
                <p style={{ fontSize: 12, color: '#888', margin: '2px 0' }}>{c.entreprise}</p>
                <p style={{ fontSize: 12, color: '#888', margin: 0 }}>
                  {c.matricule ? `Matricule : ${c.matricule}` : 'Matricule : —'} · {libelle[c.statut]}
                  {c.date_expiration ? ` · Expire le ${new Date(c.date_expiration).toLocaleDateString('fr-FR')}` : ''}
                </p>
              </div>
              {c.statut === 'en_attente' && (
                <button onClick={() => marquerDisponible(c.id)} disabled={busyId === c.id}
                  style={{ padding: '8px 14px', borderRadius: 6, border: 'none', background: '#1a3a6b', color: 'white', cursor: 'pointer' }}>
                  {busyId === c.id ? '...' : 'Marquer disponible'}
                </button>
              )}
              {c.statut === 'disponible' && (
                <button onClick={() => marquerRecuperee(c.id)} disabled={busyId === c.id}
                  style={{ padding: '8px 14px', borderRadius: 6, border: 'none', background: '#0e7c3f', color: 'white', cursor: 'pointer' }}>
                  {busyId === c.id ? '...' : 'Marquer récupérée'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
