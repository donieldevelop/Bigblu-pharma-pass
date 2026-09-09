'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

export default function NotificationsTravailleurPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data: s } = await supabase.auth.getSession();
      if (!s.session) return router.push('/travailleur/login');
      const uid = s.session.user.id;

      const { data } = await supabase
        .from('notifications')
        .select('id, type, contenu, lu, created_at')
        .eq('destinataire_id', uid)
        .order('created_at', { ascending: false });

      setRows(data || []);
      setLoading(false);

      const nonLues = (data || []).filter((n) => !n.lu).map((n) => n.id);
      if (nonLues.length > 0) {
        await supabase.from('notifications').update({ lu: true }).in('id', nonLues);
      }
    })();
  }, [router]);

  return (
    <div style={{ background: '#EEF2F6', minHeight: '100vh' }}>
      <div style={{ maxWidth: 440, margin: '0 auto', padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h1 style={{ fontSize: 18, color: '#12294D' }}>Notifications</h1>
          <a href="/travailleur" style={{ fontSize: 13, color: '#5B6B82' }}>← Retour</a>
        </div>

        {loading ? (
          <p>Chargement...</p>
        ) : rows.length === 0 ? (
          <p style={{ color: '#8393A8' }}>Aucune notification pour le moment.</p>
        ) : (
          rows.map((n) => (
            <div
              key={n.id}
              style={{
                background: 'white',
                borderRadius: 12,
                padding: 16,
                marginBottom: 10,
                borderLeft: n.lu ? '3px solid transparent' : '3px solid #D98E3B',
              }}
            >
              <p style={{ margin: 0, fontSize: 14 }}>{n.contenu}</p>
              <p style={{ margin: '6px 0 0', fontSize: 12, color: '#8393A8' }}>
                {new Date(n.created_at).toLocaleString('fr-FR')}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
