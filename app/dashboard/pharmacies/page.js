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
  const [emailsLiaison, setEmailsLiaison] = useState({});
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
      .select('id, nom, adresse, latitude, longitude, statut, qr_code_id, user_id')
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

  async function validerPharmacie(id) {
    const { error } = await supabase.from('pharmacies').update({ statut: 'active' }).eq('id', id);
    if (error) return setError(error.message);
    load();
  }

  async function refuserPharmacie(id) {
    if (!confirm('Supprimer définitivement cette demande ?')) return;
    const { error } = await supabase.from('pharmacies').delete().eq('id', id);
    if (error) return setError(error.message);
    load();
  }

  async function lierCompte(pharmacieId) {
    setError('');
    const email = emailsLiaison[pharmacieId];
    if (!email) return;
    const { data: user, error: e1 } = await supabase
      .from('utilisateurs')
      .select('id')
      .eq('email', email)
      .eq('role', 'pharmacie')
      .maybeSingle();
    if (e1 || !user) {
      setError("Aucun compte pharmacie trouvé avec cet e-mail (l'inscription doit être faite d'abord sur /inscription-pharmacie).");
      return;
    }
    const { error: e2 } = await supabase.from('pharmacies').update({ user_id: user.id }).eq('id', pharmacieId);
    if (e2) return setError(e2.message);
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
        <>
          {pharmacies.some((p) => p.statut === 'en_attente') && (
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 15, marginBottom: 10 }}>Demandes en attente de validation</h3>
              <div style={{ display: 'grid', gap: 10 }}>
                {pharmacies.filter((p) => p.statut === 'en_attente').map((p) => (
                  <div key={p.id} style={{ background: '#FFF7EA', border: '1px solid #F0D9A6', borderRadius: 8, padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong>{p.nom}</strong>
                      <p style={{ fontSize: 12, color: '#888', margin: 0 }}>{p.adresse}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => validerPharmacie(p.id)} style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: '#0e7c3f', color: 'white', cursor: 'pointer', fontSize: 13 }}>
                        Valider
                      </button>
                      <button onClick={() => refuserPharmacie(p.id)} style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #c0392b', background: 'white', color: '#c0392b', cursor: 'pointer', fontSize: 13 }}>
                        Refuser
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {pharmacies.filter((p) => p.statut !== 'en_attente').map((p) => (
              <div key={p.id} style={{ background: 'white', padding: 16, borderRadius: 8, textAlign: 'center' }}>
                <strong>{p.nom}</strong>
                <p style={{ fontSize: 12, color: '#888', margin: '4px 0 12px' }}>{p.adresse}</p>
                <QrCodeCanvas value={p.qr_code_id} size={140} />
                <p style={{ fontSize: 11, color: '#aaa', marginTop: 8 }}>{p.statut}</p>
                {p.user_id ? (
                  <p style={{ fontSize: 11, color: '#0e7c3f', marginTop: 4 }}>Compte pharmacien lié ✓</p>
                ) : (
                  <div style={{ marginTop: 8, display: 'flex', gap: 4 }}>
                    <input
                      placeholder="e-mail du pharmacien"
                      value={emailsLiaison[p.id] || ''}
                      onChange={(e) => setEmailsLiaison({ ...emailsLiaison, [p.id]: e.target.value })}
                      style={{ flex: 1, padding: 6, fontSize: 12, borderRadius: 6, border: '1px solid #ddd' }}
                    />
                    <button
                      onClick={() => lierCompte(p.id)}
                      style={{ padding: '6px 10px', fontSize: 12, borderRadius: 6, border: 'none', background: '#1a3a6b', color: 'white', cursor: 'pointer' }}
                    >
                      Lier
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const inputStyle = { flex: 1, padding: 10, borderRadius: 6, border: '1px solid #ddd' };
