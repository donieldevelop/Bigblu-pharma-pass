'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

export default function InscriptionTravailleurPage() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role: 'travailleur', nom, prenom, telephone } },
    });
    setLoading(false);
    if (error) return setError(error.message);
    setOk(true);
  }

  if (ok) {
    return (
      <div style={{ padding: 32, maxWidth: 420, margin: '80px auto', textAlign: 'center' }}>
        <h2>Compte créé ✓</h2>
        <p style={{ color: '#5B6B82' }}>
          Ton compte a été créé. L&apos;administration va activer ton abonnement et ton crédit sous peu.
        </p>
        <a href="/travailleur/login" style={{ color: '#12294D', fontWeight: 600 }}>Se connecter →</a>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#EEF2F6' }}>
      <form onSubmit={handleSignup} style={{ background: 'white', padding: 32, borderRadius: 12, width: 340 }}>
        <h1 style={{ fontSize: 20, marginBottom: 20 }}>Créer mon compte</h1>
        <input placeholder="Prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} required style={inputStyle} />
        <input placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} required style={inputStyle} />
        <input placeholder="Numéro de téléphone" value={telephone} onChange={(e) => setTelephone(e.target.value)} required style={inputStyle} />
        <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
        {error && <p style={{ color: '#c0392b', fontSize: 13 }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ width: '100%', padding: 12, borderRadius: 6, border: 'none', background: '#12294D', color: 'white', fontWeight: 600 }}>
          {loading ? '...' : 'Créer mon compte'}
        </button>
        <p style={{ fontSize: 13, textAlign: 'center', marginTop: 16 }}>
          Déjà inscrit ? <a href="/travailleur/login" style={{ color: '#12294D' }}>Se connecter</a>
        </p>
      </form>
    </div>
  );
}

const inputStyle = { width: '100%', padding: 10, marginBottom: 12, borderRadius: 6, border: '1px solid #ddd' };
