'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function DashboardPage() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push('/login');
      } else {
        setSession(data.session);
      }
      setChecking(false);
    });
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  if (checking) return null;

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22 }}>Tableau de bord — BIG BLU PHARMA PASS</h1>
        <button onClick={handleLogout} style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #ccc', background: 'white', cursor: 'pointer' }}>
          Déconnexion
        </button>
      </div>
      <p style={{ color: '#666' }}>
        Connecté en tant que <strong>{session?.user?.email}</strong>
      </p>
      <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
        <a
          href="/dashboard/travailleurs"
          style={{
            display: 'inline-block',
            padding: '12px 20px',
            borderRadius: 8,
            background: 'white',
            border: '1px solid #ddd',
            textDecoration: 'none',
            color: '#1a3a6b',
            fontWeight: 600,
          }}
        >
          Travailleurs, abonnements & crédits →
        </a>
        <a
          href="/dashboard/pharmacies"
          style={{
            display: 'inline-block',
            padding: '12px 20px',
            borderRadius: 8,
            background: 'white',
            border: '1px solid #ddd',
            textDecoration: 'none',
            color: '#1a3a6b',
            fontWeight: 600,
          }}
        >
          Pharmacies partenaires →
        </a>
        <a
          href="/dashboard/transactions"
          style={{
            display: 'inline-block',
            padding: '12px 20px',
            borderRadius: 8,
            background: 'white',
            border: '1px solid #ddd',
            textDecoration: 'none',
            color: '#1a3a6b',
            fontWeight: 600,
          }}
        >
          Transactions →
        </a>
        <a
          href="/dashboard/recouvrement"
          style={{
            display: 'inline-block',
            padding: '12px 20px',
            borderRadius: 8,
            background: 'white',
            border: '1px solid #ddd',
            textDecoration: 'none',
            color: '#1a3a6b',
            fontWeight: 600,
          }}
        >
          Dettes & Recouvrement →
        </a>
        <a
          href="/dashboard/journaux"
          style={{
            display: 'inline-block',
            padding: '12px 20px',
            borderRadius: 8,
            background: 'white',
            border: '1px solid #ddd',
            textDecoration: 'none',
            color: '#1a3a6b',
            fontWeight: 600,
          }}
        >
          Journaux d&apos;activité →
        </a>
        <a
          href="/dashboard/notifications"
          style={{
            display: 'inline-block',
            padding: '12px 20px',
            borderRadius: 8,
            background: 'white',
            border: '1px solid #ddd',
            textDecoration: 'none',
            color: '#1a3a6b',
            fontWeight: 600,
          }}
        >
          Notifications →
        </a>
      </div>
    </div>
  );
}
