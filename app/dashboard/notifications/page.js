'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

export default function NotificationsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return router.push('/login');
      const { data } = await supabase
        .from('notifications')
        .select('id, type, contenu, lu, created_at, destinataire_id')
        .order('created_at', { ascending: false })
        .limit(100);
      setRows(data || []);
      setLoading(false);
    })();
  }, [router]);

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 22 }}>Notifications</h1>
        <a href="/dashboard" style={{ fontSize: 14, color: '#1a3a6b' }}>← Tableau de bord</a>
      </div>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
        Ces notifications sont générées automatiquement (transaction validée, remboursement, etc.).
        L&apos;envoi push réel (Firebase Cloud Messaging) sera branché une fois l&apos;app mobile en place.
      </p>
      {loading ? (
        <p>Chargement...</p>
      ) : rows.length === 0 ? (
        <p style={{ color: '#888' }}>Aucune notification pour le moment.</p>
      ) : (
        <ul style={{ background: 'white', borderRadius: 8, padding: 16, listStyle: 'none' }}>
          {rows.map((n) => (
            <li key={n.id} style={{ padding: '8px 0', borderBottom: '1px solid #eee', fontSize: 14 }}>
              <strong>{n.type}</strong> — {n.contenu}{' '}
              <span style={{ color: '#aaa', fontSize: 12 }}>({new Date(n.created_at).toLocaleString('fr-FR')})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
