'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

export default function ParametresPage() {
  const [telephone, setTelephone] = useState('');
  const [siteWeb, setSiteWeb] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data: s } = await supabase.auth.getSession();
      if (!s.session) return router.push('/login');
      const { data } = await supabase.from('parametres_carte').select('*').eq('id', 1).maybeSingle();
      if (data) {
        setTelephone(data.telephone_service_client || '');
        setSiteWeb(data.site_web || '');
      }
      setLoading(false);
    })();
  }, [router]);

  async function enregistrer(e) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    const { error } = await supabase
      .from('parametres_carte')
      .upsert({ id: 1, telephone_service_client: telephone, site_web: siteWeb, updated_at: new Date().toISOString() });
    setSaving(false);
    setMessage(error ? error.message : 'Enregistré ✓');
  }

  if (loading) return null;

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 22 }}>Paramètres</h1>
        <a href="/dashboard" style={{ fontSize: 14, color: '#1a3a6b' }}>← Tableau de bord</a>
      </div>

      <form onSubmit={enregistrer} style={{ background: 'white', padding: 20, borderRadius: 10, maxWidth: 420, display: 'grid', gap: 14 }}>
        <h3 style={{ margin: 0, fontSize: 15 }}>Coordonnées (verso de la carte)</h3>

        <label style={{ fontSize: 13, color: '#666' }}>
          Téléphone service client
          <input
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            style={{ display: 'block', width: '100%', marginTop: 4, padding: 10, borderRadius: 6, border: '1px solid #ddd' }}
          />
        </label>

        <label style={{ fontSize: 13, color: '#666' }}>
          Site web
          <input
            value={siteWeb}
            onChange={(e) => setSiteWeb(e.target.value)}
            style={{ display: 'block', width: '100%', marginTop: 4, padding: 10, borderRadius: 6, border: '1px solid #ddd' }}
          />
        </label>

        {message && <p style={{ fontSize: 13, color: message.includes('✓') ? '#0e7c3f' : '#c0392b', margin: 0 }}>{message}</p>}

        <button
          type="submit"
          disabled={saving}
          style={{ padding: 10, borderRadius: 6, border: 'none', background: '#1a3a6b', color: 'white', fontWeight: 600, cursor: 'pointer' }}
        >
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>
    </div>
  );
}
