'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import QrCodeCanvas from '../../components/QrCodeCanvas';

export default function PharmaciesPage() {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nom, setNom] = useState('');
  const [adresse, setAdresse] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function load() {
    setLoading(true);
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      router.push('/login');
      return;
    }
    const { data, error } = await supabase
      .from('pharmacies')
      .select('id, nom, adresse, latitude, longitude, statut, qr_code_id')
      .order('nom', { ascending: true });
    if (error) setError(error.message);
    setPharmacies(data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function creerPharmacie(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const { error } = await supabase.from('pharmacies').insert({
      nom,
      adresse,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      statut: 'active',
    });
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    setNom('');
    setAdresse('');
    setLatitude('');
    setLongitude('');
    load();
  }

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 22 }}>Pharmacies partenaires</h1>
        <a href="/dashboard" style={{ fontSize: 14, color: '#1a3a6b' }}>← Tableau de bord</a>
      </div>

      <form
        onSubmit={creerPharmacie}
        style={{ background: 'white', padding: 20, borderRadius: 8, marginBottom: 24, display: 'grid', gap: 10, maxWidth: 480 }}
      >
        <h3 style={{ margin: 0, fontSize: 16 }}>Ajouter une pharmacie</h3>
        <input placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} required style={inputStyle} />
        <input placeholder="Adresse" value={adresse} onChange={(e) => setAdresse(e.target.value)} style={inputStyle} />
        <div style={{ display: 'flex', gap: 8 }}>
          <input placeholder="Latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} required style={inputStyle} />
          <input placeholder="Longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} required style={inputStyle} />
        </div>
        {error && <p style={{ color: '#c0392b', fontSize: 13, margin: 0 }}>{error}</p>}
        <button
          type="submit"
          disabled={saving}
          style={{ padding: 10, borderRadius: 6, border: 'none', background: '#1a3a6b', color: 'white', cursor: 'pointer' }}
        >
          {saving ? 'Ajout...' : 'Ajouter'}
        </button>
      </form>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {pharmacies.map((p) => (
            <div key={p.id} style={{ background: 'white', padding: 16, borderRadius: 8, textAlign: 'center' }}>
              <strong>{p.nom}</strong>
              <p style={{ fontSize: 12, color: '#888', margin: '4px 0 12px' }}>{p.adresse}</p>
              <QrCodeCanvas value={p.qr_code_id} size={140} />
              <p style={{ fontSize: 11, color: '#aaa', marginTop: 8 }}>{p.statut}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const inputStyle = { flex: 1, padding: 10, borderRadius: 6, border: '1px solid #ddd' };
