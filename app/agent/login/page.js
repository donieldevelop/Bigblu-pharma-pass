'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

export default function AgentLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      return setError(error.message);
    }
    const { data: u } = await supabase.from('utilisateurs').select('role').eq('id', data.user.id).single();
    if (u?.role !== 'commercial') {
      await supabase.auth.signOut();
      setLoading(false);
      return setError("Ce compte n'est pas un compte agent commercial.");
    }
    router.push('/agent');
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#EEF2F6' }}>
      <form onSubmit={handleLogin} style={{ background: 'white', padding: 32, borderRadius: 12, width: 340 }}>
        <h1 style={{ fontSize: 20, marginBottom: 20, color: '#12294D' }}>Espace Agent</h1>
        <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
        {error && <p style={{ color: '#c0392b', fontSize: 13 }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ width: '100%', padding: 12, borderRadius: 6, border: 'none', background: '#12294D', color: 'white', fontWeight: 600 }}>
          {loading ? '...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}

const inputStyle = { width: '100%', padding: 10, marginBottom: 12, borderRadius: 6, border: '1px solid #ddd' };
