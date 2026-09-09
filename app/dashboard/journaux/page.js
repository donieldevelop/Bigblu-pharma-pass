'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

export default function JournauxPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return router.push('/login');
      const { data } = await supabase
        .from('journaux_activite')
        .select('id, action, objet_type, objet_id, created_at')
        .order('created_at', { ascending: false })
        .limit(100);
      setRows(data || []);
      setLoading(false);
    })();
  }, [router]);

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 22 }}>Journaux d&apos;activité</h1>
        <a href="/dashboard" style={{ fontSize: 14, color: '#1a3a6b' }}>← Tableau de bord</a>
      </div>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <ul style={{ background: 'white', borderRadius: 8, padding: 16, listStyle: 'none' }}>
          {rows.map((r) => (
            <li key={r.id} style={{ padding: '8px 0', borderBottom: '1px solid #eee', fontSize: 14 }}>
              <strong>{r.action}</strong> — {r.objet_type} ({r.objet_id?.slice(0, 8)}...) —{' '}
              <span style={{ color: '#888' }}>{new Date(r.created_at).toLocaleString('fr-FR')}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
