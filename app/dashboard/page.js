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
      <p style={{ color: '#999', fontSize: 14, marginTop: 24 }}>
        Modules à venir : Travailleurs, Pharmacies, Abonnements, Crédits, Transactions, Dettes, Remboursements.
      </p>
    </div>
  );
}
