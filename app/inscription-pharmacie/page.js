'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function InscriptionPharmaciePage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nom, setNom] = useState('');
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role: 'pharmacie', nom } },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setOk(true);
  }

  if (ok) {
    return (
      <div style={{ padding: 32, maxWidth: 480, margin: '0 auto' }}>
        <h2>Compte créé</h2>
        <p>
          Connecte-toi maintenant pour renseigner les informations de ta pharmacie — un
          administrateur devra ensuite valider ta fiche avant que tu puisses effectuer des transactions.
        </p>
        <a href="/pharmacie/login">Aller à la connexion pharmacie →</a>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleSignup} style={{ background: 'white', padding: 32, borderRadius: 12, width: 340 }}>
        <h1 style={{ fontSize: 20 }}>Inscription Pharmacie</h1>
        <input placeholder="Nom de la pharmacie" value={nom} onChange={(e) => setNom(e.target.value)} required style={inputStyle} />
        <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
        {error && <p style={{ color: '#c0392b', fontSize: 13 }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ width: '100%', padding: 12, borderRadius: 6, border: 'none', background: '#1a3a6b', color: 'white', fontWeight: 600 }}>
          {loading ? '...' : "S'inscrire"}
        </button>
      </form>
    </div>
  );
}

const inputStyle = { width: '100%', padding: 10, marginBottom: 12, borderRadius: 6, border: '1px solid #ddd' };
