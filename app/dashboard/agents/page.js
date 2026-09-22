'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

export default function AgentsAdminPage() {
  const [session, setSession] = useState(null);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [envoi, setEnvoi] = useState(false);
  const [error, setError] = useState('');
  const [resultat, setResultat] = useState(null);
  const router = useRouter();

  async function charger() {
    const { data: s } = await supabase.auth.getSession();
    if (!s.session) return router.push('/login');
    setSession(s.session);
    const { data } = await supabase
      .from('utilisateurs')
      .select('id, nom, prenom, email, telephone, statut, created_at')
      .eq('role', 'commercial')
      .order('created_at', { ascending: false });
    setAgents(data || []);
    setLoading(false);
  }

  useEffect(() => { charger(); }, []);

  async function creerAgent(e) {
    e.preventDefault();
    setEnvoi(true);
    setError('');
    try {
      const res = await fetch('/api/admin/creer-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ nom, prenom, telephone, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur inconnue');
      setResultat(data);
      setNom(''); setPrenom(''); setTelephone(''); setEmail('');
      await charger();
    } catch (err) {
      setError(err.message);
    }
    setEnvoi(false);
  }

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 22 }}>Agents commerciaux</h1>
        <a href="/dashboard" style={{ fontSize: 14, color: '#1a3a6b' }}>← Tableau de bord</a>
      </div>

      <button
        onClick={() => { setAfficherFormulaire(!afficherFormulaire); setResultat(null); }}
        style={{ marginBottom: 20, padding: '10px 18px', borderRadius: 8, border: 'none', background: '#1a3a6b', color: 'white', fontWeight: 600, cursor: 'pointer' }}
      >
        {afficherFormulaire ? 'Annuler' : '+ Créer un agent'}
      </button>

      {afficherFormulaire && (
        <form onSubmit={creerAgent} style={{ background: 'white', borderRadius: 10, padding: 20, marginBottom: 20, maxWidth: 420 }}>
          <input placeholder="Prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} required style={inputStyle} />
          <input placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} required style={inputStyle} />
          <input placeholder="Téléphone" value={telephone} onChange={(e) => setTelephone(e.target.value)} required style={inputStyle} />
          <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
          {error && <p style={{ color: '#c0392b', fontSize: 13 }}>{error}</p>}
          <button type="submit" disabled={envoi} style={{ padding: '10px 18px', borderRadius: 8, border: 'none', background: '#0e7c3f', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
            {envoi ? '...' : 'Créer le compte agent'}
          </button>
        </form>
      )}

      {resultat && (
        <div style={{ background: '#E4F5EA', borderRadius: 10, padding: 16, marginBottom: 20, maxWidth: 420, fontSize: 13 }}>
          <strong>Compte créé — communique ces accès à l&apos;agent :</strong>
          <p style={{ margin: '8px 0 0' }}>E-mail : {resultat.email}</p>
          <p style={{ margin: '4px 0 0' }}>Mot de passe : {resultat.mot_de_passe_temporaire}</p>
          <p style={{ margin: '4px 0 0' }}>Connexion : lien /agent/login</p>
        </div>
      )}

      {loading ? (
        <p>Chargement...</p>
      ) : agents.length === 0 ? (
        <p style={{ color: '#888' }}>Aucun agent pour le moment.</p>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {agents.map((a) => (
            <div key={a.id} style={{ background: 'white', borderRadius: 10, padding: 14 }}>
              <strong>{a.prenom} {a.nom}</strong>
              <p style={{ fontSize: 12, color: '#888', margin: '4px 0 0' }}>{a.email} · {a.telephone} · {a.statut}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const inputStyle = { width: '100%', padding: 10, marginBottom: 12, borderRadius: 6, border: '1px solid #ddd' };
