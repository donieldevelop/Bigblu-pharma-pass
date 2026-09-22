'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabaseClient';
import { ArrowLeft } from 'lucide-react';

export default function FicheClientAgentPage() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [credit, setCredit] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data: s } = await supabase.auth.getSession();
      if (!s.session) return router.push('/agent/login');

      const [{ data: u, error: eu }, { data: c }, { data: t }] = await Promise.all([
        supabase.from('utilisateurs').select('*').eq('id', id).single(),
        supabase.from('credits').select('*').eq('travailleur_id', id).maybeSingle(),
        supabase
          .from('transactions')
          .select('id, reference, montant_total, statut, created_at, medicaments(nom, quantite, prix_total)')
          .eq('travailleur_id', id)
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      if (eu || !u) {
        setError("Fiche introuvable ou accès non autorisé.");
        setLoading(false);
        return;
      }

      setClient(u);
      setCredit(c);
      setTransactions(t || []);
      setLoading(false);
    })();
  }, [id, router]);

  if (loading) return null;

  if (error) {
    return (
      <div className="ecran">
        <a href="/agent" className="retour"><ArrowLeft size={18} /> Retour</a>
        <p className="erreur">{error}</p>
        <style jsx>{`
          .ecran { background: #EEF2F6; min-height: 100vh; padding: 20px; }
          .retour { display: inline-flex; align-items: center; gap: 6px; color: #5B6B82; text-decoration: none; font-size: 13px; margin-bottom: 16px; }
          .erreur { color: #c0392b; }
        `}</style>
      </div>
    );
  }

  const totalConsomme = transactions
    .filter((t) => t.statut === 'validee')
    .reduce((s, t) => s + Number(t.montant_total || 0), 0);

  return (
    <div className="ecran">
      <a href="/agent" className="retour"><ArrowLeft size={18} /> Retour</a>

      <div className="carte">
        <div className="entete">
          <div className="avatar">{(client.prenom || '?').charAt(0).toUpperCase()}</div>
          <div>
            <strong>{client.prenom} {client.nom}</strong>
            <span className="code">{client.code_client || '—'}</span>
          </div>
        </div>
        <div className="infos">
          <div><span>Téléphone</span><strong>{client.telephone || '—'}</strong></div>
          <div><span>E-mail</span><strong>{client.email}</strong></div>
          <div><span>Inscription</span><strong>{new Date(client.created_at).toLocaleDateString('fr-FR')}</strong></div>
          <div><span>Crédit disponible</span><strong>{credit ? (credit.plafond - credit.montant_utilise).toLocaleString('fr-FR') : 0} FCFA</strong></div>
          <div><span>Solde dû</span><strong>{credit ? Number(credit.montant_du).toLocaleString('fr-FR') : 0} FCFA</strong></div>
        </div>
      </div>

      <h2 className="sousTitre">5 dernières consommations</h2>
      <p className="totalLigne">Total sur cette période : <strong>{totalConsomme.toLocaleString('fr-FR')} FCFA</strong></p>

      {transactions.length === 0 ? (
        <p className="info">Aucune consommation enregistrée.</p>
      ) : (
        <div className="liste">
          {transactions.map((t) => (
            <div key={t.id} className="ligneTransaction">
              <div className="hautLigne">
                <span>{new Date(t.created_at).toLocaleDateString('fr-FR')}</span>
                <strong>{Number(t.montant_total).toLocaleString('fr-FR')} FCFA</strong>
              </div>
              <div className="produits">
                {(t.medicaments || []).map((m, i) => (
                  <span key={i}>{m.nom} × {m.quantite}</span>
                ))}
              </div>
              <span className={`statutBadge statut-${t.statut}`}>{t.statut}</span>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .ecran { background: #EEF2F6; min-height: 100vh; padding: 20px; }
        .retour { display: inline-flex; align-items: center; gap: 6px; color: #5B6B82; text-decoration: none; font-size: 13px; margin-bottom: 16px; }
        .carte { max-width: 480px; margin: 0 auto 20px; background: white; border-radius: 16px; padding: 20px; }
        .entete { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        .avatar { width: 48px; height: 48px; border-radius: 50%; background: #12294D; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; }
        .entete strong { display: block; color: #12294D; font-size: 15px; }
        .code { color: #8393A8; font-size: 12px; }
        .infos div { display: flex; justify-content: space-between; padding: 8px 0; border-top: 1px solid #F0F2F5; font-size: 13px; }
        .infos span { color: #8393A8; }
        .infos strong { color: #12294D; }
        .sousTitre { max-width: 480px; margin: 0 auto 6px; font-size: 15px; color: #12294D; }
        .totalLigne { max-width: 480px; margin: 0 auto 12px; font-size: 13px; color: #5B6B82; }
        .info { max-width: 480px; margin: 0 auto; color: #8393A8; font-size: 13px; }
        .liste { max-width: 480px; margin: 0 auto; display: flex; flex-direction: column; gap: 8px; }
        .ligneTransaction { background: white; border-radius: 12px; padding: 14px; }
        .hautLigne { display: flex; justify-content: space-between; color: #12294D; font-size: 13.5px; margin-bottom: 6px; }
        .produits { display: flex; flex-wrap: wrap; gap: 6px; font-size: 12px; color: #5B6B82; margin-bottom: 6px; }
        .statutBadge { display: inline-block; font-size: 10.5px; padding: 3px 8px; border-radius: 6px; background: #F0F2F5; color: #5B6B82; text-transform: capitalize; }
        .statut-validee { background: #E4F5EA; color: #0E7C3F; }
        .statut-refusee { background: #FBE7E9; color: #B8324D; }
      `}</style>
    </div>
  );
}
