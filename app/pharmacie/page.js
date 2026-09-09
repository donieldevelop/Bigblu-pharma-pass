'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import QrScanner from '../components/QrScanner';

export default function PharmacieDashboard() {
  const [session, setSession] = useState(null);
  const [pharmacie, setPharmacie] = useState(null);
  const [chargementPharmacie, setChargementPharmacie] = useState(true);
  const [formNom, setFormNom] = useState('');
  const [formAdresse, setFormAdresse] = useState('');
  const [formLat, setFormLat] = useState('');
  const [formLng, setFormLng] = useState('');
  const [inscriptionEnCours, setInscriptionEnCours] = useState(false);
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
  const [photoEnAnalyse, setPhotoEnAnalyse] = useState(false);
  const [suggestionsIA, setSuggestionsIA] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) return router.push('/pharmacie/login');
      setSession(data.session);
      const { data: p } = await supabase.from('pharmacies').select('*').eq('user_id', data.session.user.id).maybeSingle();
      setPharmacie(p);
      setChargementPharmacie(false);
    });
  }, [router]);

  function utiliserPosition() {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormLat(pos.coords.latitude.toString());
        setFormLng(pos.coords.longitude.toString());
      },
      () => setError('Impossible de récupérer ta position, saisis-la manuellement.')
    );
  }

  async function inscrirePharmacie(e) {
    e.preventDefault();
    setInscriptionEnCours(true);
    setError('');
    const { error } = await supabase.rpc('pharmacie_inscrire', {
      p_nom: formNom,
      p_adresse: formAdresse,
      p_latitude: parseFloat(formLat),
      p_longitude: parseFloat(formLng),
    });
    setInscriptionEnCours(false);
    if (error) return setError(error.message);
    const { data: p } = await supabase.from('pharmacies').select('*').eq('user_id', session.user.id).maybeSingle();
    setPharmacie(p);
  }

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

  async function analyserPhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoEnAnalyse(true);
    setError('');
    setSuggestionsIA([]);

    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    try {
      const res = await fetch('/api/analyser-medicament', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_base64: base64 }),
      });
      const data = await res.json();
      if (data.erreur) {
        setError(data.erreur);
      } else {
        setSuggestionsIA(data.medicaments || []);
      }
    } catch (err) {
      setError("Erreur d'analyse : " + err.message);
    }
    setPhotoEnAnalyse(false);
  }

  function utiliserSuggestion(s) {
    setNom(s.nom || '');
    setQuantite(s.quantite || 1);
    setPrix(s.prix_unitaire || '');
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

  if (!session || chargementPharmacie) return null;

  if (!pharmacie) {
    return (
      <div style={{ padding: 32, maxWidth: 420, margin: '0 auto' }}>
        <h1 style={{ fontSize: 20 }}>Inscrire ma pharmacie</h1>
        <p style={{ fontSize: 13, color: '#888' }}>
          Renseigne les informations de ta pharmacie. Un administrateur devra valider ta fiche
          avant que tu puisses effectuer des transactions.
        </p>
        <form onSubmit={inscrirePharmacie} style={{ display: 'grid', gap: 10, marginTop: 16 }}>
          <input placeholder="Nom de la pharmacie" value={formNom} onChange={(e) => setFormNom(e.target.value)} required style={{ padding: 10, borderRadius: 6, border: '1px solid #ddd' }} />
          <input placeholder="Adresse" value={formAdresse} onChange={(e) => setFormAdresse(e.target.value)} required style={{ padding: 10, borderRadius: 6, border: '1px solid #ddd' }} />
          <button type="button" onClick={utiliserPosition} style={{ padding: 10, borderRadius: 6, border: '1px dashed #999', background: 'white', cursor: 'pointer', fontSize: 13 }}>
            📍 Utiliser ma position actuelle
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <input placeholder="Latitude" value={formLat} onChange={(e) => setFormLat(e.target.value)} required style={{ flex: 1, padding: 10, borderRadius: 6, border: '1px solid #ddd' }} />
            <input placeholder="Longitude" value={formLng} onChange={(e) => setFormLng(e.target.value)} required style={{ flex: 1, padding: 10, borderRadius: 6, border: '1px solid #ddd' }} />
          </div>
          {error && <p style={{ color: '#c0392b', fontSize: 13 }}>{error}</p>}
          <button type="submit" disabled={inscriptionEnCours} style={btnStyle}>
            {inscriptionEnCours ? 'Envoi...' : 'Soumettre pour validation'}
          </button>
        </form>
      </div>
    );
  }

  if (pharmacie.statut !== 'active') {
    return (
      <div style={{ padding: 32, maxWidth: 420, margin: '80px auto', textAlign: 'center' }}>
        <h2>Fiche en attente de validation</h2>
        <p style={{ color: '#888' }}>
          La fiche de <strong>{pharmacie.nom}</strong> a été soumise et attend la validation de
          l&apos;administration. Reviens un peu plus tard.
        </p>
      </div>
    );
  }

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
            Scanne le QR Code du travailleur avec la caméra, ou colle son identifiant manuellement.
          </p>
          <div style={{ marginBottom: 12 }}>
            <QrScanner onResult={(valeur) => setTravailleurId(valeur)} />
          </div>
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

          <label style={{ display: 'inline-block', marginBottom: 12, padding: '8px 14px', borderRadius: 6, border: '1px dashed #999', fontSize: 13, cursor: 'pointer' }}>
            📷 Prendre une photo (lecture automatique)
            <input type="file" accept="image/*" capture="environment" onChange={analyserPhoto} style={{ display: 'none' }} />
          </label>

          {photoEnAnalyse && <p style={{ fontSize: 13, color: '#888' }}>Analyse de la photo en cours...</p>}

          {suggestionsIA.length > 0 && (
            <div style={{ background: '#f5f6f8', padding: 10, borderRadius: 6, marginBottom: 12 }}>
              <p style={{ fontSize: 12, margin: '0 0 8px' }}>Détecté par l&apos;IA (vérifie avant d&apos;ajouter) :</p>
              {suggestionsIA.map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, padding: '4px 0' }}>
                  <span>{s.nom || '?'} — {s.quantite ?? '?'} × {s.prix_unitaire ?? '?'} FCFA</span>
                  <button onClick={() => utiliserSuggestion(s)} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6, border: 'none', background: '#1a3a6b', color: 'white', cursor: 'pointer' }}>
                    Utiliser
                  </button>
                </div>
              ))}
            </div>
          )}

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
