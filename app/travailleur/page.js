'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import QrCodeCanvas from '../components/QrCodeCanvas';

export default function TravailleurDashboard() {
  const [session, setSession] = useState(null);
  const [profil, setProfil] = useState(null);
  const [credit, setCredit] = useState(null);
  const [abonnement, setAbonnement] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [notifNonLues, setNotifNonLues] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data: s } = await supabase.auth.getSession();
      if (!s.session) return router.push('/travailleur/login');
      setSession(s.session);
      const uid = s.session.user.id;

      const [{ data: u }, { data: c }, { data: a }, { data: t }, { count: n }] = await Promise.all([
        supabase.from('utilisateurs').select('*').eq('id', uid).single(),
        supabase.from('credits').select('*').eq('travailleur_id', uid).maybeSingle(),
        supabase.from('abonnements').select('*').eq('travailleur_id', uid).order('created_at', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('transactions').select('id, reference, montant_total, statut, created_at').eq('travailleur_id', uid).order('created_at', { ascending: false }),
        supabase.from('notifications').select('id', { count: 'exact', head: true }).eq('destinataire_id', uid).eq('lu', false),
      ]);

      setProfil(u);
      setCredit(c);
      setAbonnement(a);
      setTransactions(t || []);
      setNotifNonLues(n || 0);
      setLoading(false);
    })();
  }, [router]);

  async function logout() {
    await supabase.auth.signOut();
    router.push('/travailleur/login');
  }

  if (loading) return null;

  const disponible = credit ? credit.plafond - credit.montant_utilise : 0;

  return (
    <div style={{ background: '#EEF2F6', minHeight: '100vh' }}>
      <div style={{ maxWidth: 440, margin: '0 auto', padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h1 style={{ fontSize: 18, color: '#12294D' }}>Bonjour {profil?.prenom || ''}</h1>
          <button onClick={logout} style={{ border: 'none', background: 'none', color: '#5B6B82', fontSize: 13, cursor: 'pointer' }}>
            Déconnexion
          </button>
        </div>

        {/* Carte crédit */}
        <div
          style={{
            background: 'linear-gradient(135deg, #12294D 0%, #1F4478 100%)',
            borderRadius: 16,
            padding: 24,
            color: 'white',
            marginBottom: 20,
          }}
        >
          <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>Crédit disponible</div>
          <div style={{ fontSize: 30, fontWeight: 700, marginBottom: 16 }}>
            {credit ? `${disponible} FCFA` : '—'}
          </div>
          <div style={{ fontSize: 12, opacity: 0.75 }}>
            Plafond {credit?.plafond ?? 0} FCFA — Abonnement : {abonnement?.statut || 'non activé'}
          </div>
        </div>

        {/* QR Code */}
        <div style={{ background: 'white', borderRadius: 12, padding: 20, textAlign: 'center', marginBottom: 20 }}>
          <p style={{ fontSize: 13, color: '#5B6B82', marginBottom: 12 }}>Mon QR Code — à présenter en pharmacie</p>
          <QrCodeCanvas value={session?.user?.id} size={180} />
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <a
            href="/travailleur/pharmacies"
            style={{
              flex: 1,
              textAlign: 'center',
              padding: 14,
              borderRadius: 12,
              background: 'white',
              textDecoration: 'none',
              color: '#12294D',
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            🔍 Pharmacies proches
          </a>
          <a
            href="/travailleur/notifications"
            style={{
              flex: 1,
              position: 'relative',
              textAlign: 'center',
              padding: 14,
              borderRadius: 12,
              background: 'white',
              textDecoration: 'none',
              color: '#12294D',
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            🔔 Notifications
            {notifNonLues > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: 6,
                  right: 10,
                  background: '#D98E3B',
                  color: 'white',
                  borderRadius: 10,
                  fontSize: 11,
                  padding: '1px 6px',
                }}
              >
                {notifNonLues}
              </span>
            )}
          </a>
        </div>

        {/* Historique */}
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
          <p style={{ fontSize: 13, color: '#5B6B82', marginBottom: 12, fontWeight: 600 }}>Mes transactions</p>
          {transactions.length === 0 ? (
            <p style={{ fontSize: 13, color: '#8393A8' }}>Aucune transaction pour le moment.</p>
          ) : (
            transactions.map((t) => (
              <a
                key={t.id}
                href={`/travailleur/transactions/${t.id}`}
                style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee', fontSize: 13, textDecoration: 'none', color: '#12294D' }}
              >
                <span>{new Date(t.created_at).toLocaleDateString('fr-FR')}</span>
                <span>{t.montant_total} FCFA</span>
                <span style={{ color: t.statut === 'validee' ? '#157347' : '#8393A8' }}>{t.statut}</span>
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
