'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { LogOut, UserPlus, Users } from 'lucide-react';
import FormulaireNouveauClient from './FormulaireNouveauClient';

export default function AgentAccueilPage() {
  const [session, setSession] = useState(null);
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data: s } = await supabase.auth.getSession();
      if (!s.session) return router.push('/agent/login');
      const { data: u } = await supabase.from('utilisateurs').select('role').eq('id', s.session.user.id).single();
      if (u?.role !== 'commercial') return router.push('/agent/login');
      setSession(s.session);
      await chargerClients();
    })();
  }, [router]);

  async function chargerClients() {
    setLoadingClients(true);
    const { data } = await supabase
      .from('utilisateurs')
      .select('id, code_client, nom, prenom, telephone, created_at')
      .eq('role', 'travailleur')
      .order('created_at', { ascending: false });
    setClients(data || []);
    setLoadingClients(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push('/agent/login');
  }

  if (!session) return null;

  return (
    <div className="ecran">
      <div className="entete">
        <h1>Espace Agent</h1>
        <button onClick={logout} className="btnDeconnexion"><LogOut size={16} /> Déconnexion</button>
      </div>

      <div className="actions">
        <button onClick={() => setAfficherFormulaire(true)} className="btnPrincipal">
          <UserPlus size={18} /> Créer un nouveau client
        </button>
      </div>

      {afficherFormulaire && (
        <FormulaireNouveauClient
          session={session}
          onCree={() => { setAfficherFormulaire(false); chargerClients(); }}
          onFermer={() => setAfficherFormulaire(false)}
        />
      )}

      <div className="listeSection">
        <h2><Users size={16} /> Mes clients ({clients.length})</h2>
        {loadingClients ? (
          <p className="info">Chargement...</p>
        ) : clients.length === 0 ? (
          <p className="info">Aucun client créé pour l&apos;instant.</p>
        ) : (
          <div className="liste">
            {clients.map((c) => (
              <a key={c.id} href={'/agent/clients/' + c.id} className="ligneClient">
                <div>
                  <strong>{c.prenom} {c.nom}</strong>
                  <span className="souligne">{c.code_client || '—'} · {c.telephone}</span>
                </div>
                <span className="date">{new Date(c.created_at).toLocaleDateString('fr-FR')}</span>
              </a>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .ecran { background: #EEF2F6; min-height: 100vh; padding: 20px; }
        .entete { max-width: 480px; margin: 0 auto 20px; display: flex; justify-content: space-between; align-items: center; }
        .entete h1 { font-size: 20px; color: #12294D; margin: 0; }
        .btnDeconnexion { display: flex; align-items: center; gap: 6px; background: none; border: none; color: #B8324D; font-size: 13px; cursor: pointer; }
        .actions { max-width: 480px; margin: 0 auto 20px; }
        .btnPrincipal { width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; background: #12294D; color: white; border: none; padding: 14px; border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer; }
        .listeSection { max-width: 480px; margin: 0 auto; }
        .listeSection h2 { display: flex; align-items: center; gap: 6px; font-size: 14px; color: #12294D; margin-bottom: 10px; }
        .info { color: #8393A8; font-size: 13px; }
        .liste { display: flex; flex-direction: column; gap: 8px; }
        .ligneClient { display: flex; justify-content: space-between; align-items: center; background: white; border-radius: 12px; padding: 14px; text-decoration: none; }
        .ligneClient strong { display: block; color: #12294D; font-size: 14px; }
        .souligne { display: block; color: #8393A8; font-size: 12px; margin-top: 2px; }
        .date { color: #8393A8; font-size: 11.5px; }
      `}</style>
    </div>
  );
}
