'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push('/dashboard');
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <form
        onSubmit={handleLogin}
        style={{
          background: 'white',
          padding: 32,
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          width: 340,
        }}
      >
        <h1 style={{ fontSize: 20, marginBottom: 4 }}>BIG BLU PHARMA PASS</h1>
        <p style={{ color: '#666', marginTop: 0, marginBottom: 24, fontSize: 14 }}>
          Espace Administration
        </p>

        <label style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>E-mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: 10, marginBottom: 16, borderRadius: 6, border: '1px solid #ddd' }}
        />

        <label style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>Mot de passe</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: 10, marginBottom: 16, borderRadius: 6, border: '1px solid #ddd' }}
        />

        {error && <p style={{ color: '#c0392b', fontSize: 13 }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: 12,
            borderRadius: 6,
            border: 'none',
            background: '#1a3a6b',
            color: 'white',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}
