'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function PharmacieDashboard() {
  const [session, setSession] = useState(null);
  const [travailleurId, setTravailleurId] = useState('');
  const [infoTravailleur, setInfoTravailleur] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const [medicaments, setMedicaments] = useState([]);
  const [dernierMedicamentId, setDernierMedicamentId] = useState(null);
  const [moments, setMoments] = useState([]);
  const [nom, setNom] = useState('');
  const [quantite, setQuantite] = useState(1);
  const [prix, setPrix] = useState('');
  const [resultatValidation, setResultatValidation] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push('/pharmacie/login');
      else setSession(data.session);
    });
  }, [router]);

  async function identifier() {
    setError('');
    setResultatValidation(null);
    const { data, error } = await supabase.rpc('identifier_travailleur_pour_transaction', {
      p_travailleur_id: travailleurId,
    });
    if (error) return setError(error.message);
    if (!data || data.length === 0) return setError('Travailleur introuvable ou non identifiable.');
    setInfoTravailleur(data[0]);
  }

  async function creerTransaction() {
    setError('');
    const { data, error } = await supabase.rpc('creer_transaction', { p_travailleur_id: travailleurId });
    if (error) return setError(error.message);
    setTransactionId(data);
    setMedicaments([]);
  }

  async function ajouterMedicament() {
    setError('');
    const { data, error } = await supabase.rpc('ajouter_medicament', {
      p_transaction_id: transactionId,
      p_nom: nom,
      p_presentation: null,
      p_quantite: parseInt(quantite, 10),
      p_prix_unitaire: parseFloat(prix),
    });
    if (error) return setError(error.message);
    setMedicaments([...medicaments, { nom, quantite, prix }]);
    setDernierMedicamentId(data);
    setMoments([]);
    setNom('');
    setQuantite(1);
    setPrix('');
  }

  function toggleMoment(m) {
    setMoments((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  }

  async function enregistrerIndication() {
    if (!dernierMedicamentId || moments.length === 0) return;
    const { error } = await supabase.rpc('ajouter_indication', {
      p_medicament_id: dernierMedicamentId,
      p_moments_prise: moments,
      p_frequence: null,
      p_duree: null,
      p_mode_administration: null,
      p_note: null,
    });
    if (error) return setError(error.message);
    setDernierMedicamentId(null);
    setMoments([]);
  }

  async function valider() {
    setError('');
    const { data, error } = await supabase.rpc('valider_transaction', { p_transaction_id: transactionId });
    if (error) return setError(error.message);
    setResultatValidation(data);
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push('/pharmacie/login');
  }

  if (!session) return null;

  return (
    <div style={{ padding: 32, maxWidth: 560, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: 20 }}>Espace Pharmacie</h1>
        <button onClick={logout} style={{ border: 'none', background: 'none', color: '#1a3a6b', cursor: 'pointer' }}>Déconnexion</button>
      </div>

      {error && <p style={{ color: '#c0392b' }}>{error}</p>}

      {!transactionId && (
        <div style={{ background: 'white', padding: 20, borderRadius: 8, marginTop: 16 }}>
          <h3 style={{ marginTop: 0 }}>1. Identifier le travailleur</h3>
          <p style={{ fontSize: 12, color: '#888' }}>
            Colle ici l&apos;identifiant lu depuis le QR Code (en attendant le vrai scanner mobile).
          </p>
          <input
            placeholder="UID du travailleur"
            value={travailleurId}
            onChange={(e) => setTravailleurId(e.target.value)}
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ddd', marginBottom: 8 }}
          />
          <button onClick={identifier} style={btnStyle}>Identifier</button>

          {infoTravailleur && (
            <div style={{ marginTop: 12, fontSize: 14 }}>
              <p><strong>{infoTravailleur.prenom} {infoTravailleur.nom}</strong></p>
              <p>Compte : {infoTravailleur.statut_compte} — Abonnement : {infoTravailleur.statut_abonnement || 'aucun'}</p>
              <p>Crédit disponible : {infoTravailleur.credit_disponible} FCFA</p>
              <button onClick={creerTransaction} style={btnStyle}>Démarrer une transaction</button>
            </div>
          )}
        </div>
      )}

      {transactionId && !resultatValidation && (
        <div style={{ background: 'white', padding: 20, borderRadius: 8, marginTop: 16 }}>
          <h3 style={{ marginTop: 0 }}>2. Ajouter les médicaments</h3>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} style={{ flex: 2, padding: 8, borderRadius: 6, border: '1px solid #ddd' }} />
            <input type="number" placeholder="Qté" value={quantite} onChange={(e) => setQuantite(e.target.value)} style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ddd' }} />
            <input type="number" placeholder="Prix unit." value={prix} onChange={(e) => setPrix(e.target.value)} style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ddd' }} />
          </div>
          <button onClick={ajouterMedicament} style={btnStyle}>Ajouter</button>

          <ul>
            {medicaments.map((m, i) => (
              <li key={i}>{m.nom} — {m.quantite} × {m.prix} FCFA</li>
            ))}
          </ul>

          {dernierMedicamentId && (
            <div style={{ background: '#f5f6f8', padding: 12, borderRadius: 6, marginBottom: 12 }}>
              <p style={{ fontSize: 13, margin: '0 0 8px' }}>Indications (facultatif) pour le dernier médicament ajouté :</p>
              {['matin', 'midi', 'soir'].map((m) => (
                <label key={m} style={{ marginRight: 12, fontSize: 13 }}>
                  <input type="checkbox" checked={moments.includes(m)} onChange={() => toggleMoment(m)} /> {m}
                </label>
              ))}
              <button onClick={enregistrerIndication} style={{ ...btnStyle, marginLeft: 12, padding: '4px 10px', fontSize: 12 }}>
                Enregistrer
              </button>
            </div>
          )}

          {medicaments.length > 0 && (
            <button onClick={valider} style={{ ...btnStyle, background: '#0e7c3f', marginTop: 12 }}>
              Valider la transaction
            </button>
          )}
        </div>
      )}

      {resultatValidation && (
        <div style={{ background: 'white', padding: 20, borderRadius: 8, marginTop: 16 }}>
          {resultatValidation.succes ? (
            <>
              <h3 style={{ color: '#0e7c3f' }}>Transaction validée ✓</h3>
              <p>Reçu : {resultatValidation.reference}</p>
            </>
          ) : (
            <h3 style={{ color: '#c0392b' }}>Refusée : {resultatValidation.raison}</h3>
          )}
          <button
            onClick={() => {
              setTransactionId(null);
              setInfoTravailleur(null);
              setTravailleurId('');
              setResultatValidation(null);
            }}
            style={btnStyle}
          >
            Nouvelle transaction
          </button>
        </div>
      )}
    </div>
  );
}

const btnStyle = { padding: '10px 16px', borderRadius: 6, border: 'none', background: '#1a3a6b', color: 'white', cursor: 'pointer' };
