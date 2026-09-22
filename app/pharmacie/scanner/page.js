'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import QrScanner from '../../components/QrScanner';
import PharmacieBottomNav from '../../components/PharmacieBottomNav';
import { ArrowLeft } from 'lucide-react';

export default function ScannerPharmaciePage() {
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
  const [photoEnAnalyse, setPhotoEnAnalyse] = useState(false);
  const [suggestionsIA, setSuggestionsIA] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) return router.push('/pharmacie/login');
      setSession(data.session);
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

  function nouvelleOperation() {
    setTransactionId(null);
    setInfoTravailleur(null);
    setTravailleurId('');
    setResultatValidation(null);
  }

  if (!session) return null;

  return (
    <div className="ecran">
      <div className="contenu">
        <a href="/pharmacie" className="retour"><ArrowLeft size={18} /> Accueil</a>
        <h1>Nouvelle opération</h1>

        {error && <p className="erreur">{error}</p>}

        {!transactionId && (
          <div className="carte">
            <h3>1. Identifier le travailleur</h3>
            <p className="aide">Scanne le QR Code du travailleur, ou colle son identifiant manuellement.</p>
            <div className="scannerWrap"><QrScanner onResult={(valeur) => setTravailleurId(valeur)} /></div>
            <input
              placeholder="UID du travailleur"
              value={travailleurId}
              onChange={(e) => setTravailleurId(e.target.value)}
              className="input"
            />
            <button onClick={identifier} className="btnPrincipal">Identifier</button>

            {infoTravailleur && (
              <div className="infoTravailleur">
                <p className="nomTravailleur">{infoTravailleur.prenom} {infoTravailleur.nom}</p>
                <p className="detailTravailleur">Compte : {infoTravailleur.statut_compte} — Abonnement : {infoTravailleur.statut_abonnement || 'aucun'}</p>
                <p className="detailTravailleur">Crédit disponible : {infoTravailleur.credit_disponible} FCFA</p>
                <button onClick={creerTransaction} className="btnPrincipal">Démarrer une transaction</button>
              </div>
            )}
          </div>
        )}

        {transactionId && !resultatValidation && (
          <div className="carte">
            <h3>2. Ajouter les médicaments</h3>

            <label className="btnPhoto">
              📷 Prendre une photo (lecture automatique)
              <input type="file" accept="image/*" capture="environment" onChange={analyserPhoto} style={{ display: 'none' }} />
            </label>

            {photoEnAnalyse && <p className="aide">Analyse de la photo en cours...</p>}

            {suggestionsIA.length > 0 && (
              <div className="suggestions">
                <p className="aide">Détecté par l&apos;IA (vérifie avant d&apos;ajouter) :</p>
                {suggestionsIA.map((s, i) => (
                  <div key={i} className="ligneSuggestion">
                    <span>{s.nom || '?'} — {s.quantite ?? '?'} × {s.prix_unitaire ?? '?'} FCFA</span>
                    <button onClick={() => utiliserSuggestion(s)} className="btnMini">Utiliser</button>
                  </div>
                ))}
              </div>
            )}

            <div className="ligneChamps">
              <input placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} className="input flex2" />
              <input type="number" placeholder="Qté" value={quantite} onChange={(e) => setQuantite(e.target.value)} className="input flex1" />
              <input type="number" placeholder="Prix unit." value={prix} onChange={(e) => setPrix(e.target.value)} className="input flex1" />
            </div>
            <button onClick={ajouterMedicament} className="btnPrincipal">Ajouter</button>

            {medicaments.length > 0 && (
              <ul className="listeMeds">
                {medicaments.map((m, i) => (
                  <li key={i}>{m.nom} — {m.quantite} × {m.prix} FCFA</li>
                ))}
              </ul>
            )}

            {dernierMedicamentId && (
              <div className="indications">
                <p className="aide">Indications (facultatif) pour le dernier médicament ajouté :</p>
                {['matin', 'midi', 'soir'].map((m) => (
                  <label key={m} className="checkMoment">
                    <input type="checkbox" checked={moments.includes(m)} onChange={() => toggleMoment(m)} /> {m}
                  </label>
                ))}
                <button onClick={enregistrerIndication} className="btnMini">Enregistrer</button>
              </div>
            )}

            {medicaments.length > 0 && (
              <button onClick={valider} className="btnValider">Valider la transaction</button>
            )}
          </div>
        )}

        {resultatValidation && (
          <div className="carte">
            {resultatValidation.succes ? (
              <>
                <h3 className="titreSucces">Transaction validée ✓</h3>
                <p>Reçu : {resultatValidation.reference}</p>
              </>
            ) : (
              <h3 className="titreErreur">Refusée : {resultatValidation.raison}</h3>
            )}
            <button onClick={nouvelleOperation} className="btnPrincipal">Nouvelle opération</button>
          </div>
        )}
      </div>

      <PharmacieBottomNav actif="scanner" />

      <style jsx>{`
        .ecran { background: #EEF2F6; min-height: 100vh; font-family: var(--font-body), sans-serif; }
        .contenu { max-width: 480px; margin: 0 auto; padding: 20px 20px 100px; }
        .retour { display: inline-flex; align-items: center; gap: 6px; color: #5B6B82; text-decoration: none; font-size: 13px; margin-bottom: 10px; }
        h1 { font-family: var(--font-display), sans-serif; font-size: 20px; color: #0B1B33; margin: 0 0 16px; }
        .erreur { color: #B8324D; font-size: 13px; background: #FBE7E9; padding: 10px; border-radius: 8px; }
        .carte { background: white; padding: 20px; border-radius: 14px; margin-top: 14px; }
        .carte h3 { margin-top: 0; font-size: 15px; color: #12294D; }
        .aide { font-size: 12px; color: #8393A8; }
        .scannerWrap { margin-bottom: 12px; }
        .input { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #E4E9F0; margin-bottom: 8px; font-size: 13px; box-sizing: border-box; }
        .btnPrincipal { padding: 10px 16px; border-radius: 8px; border: none; background: #12294D; color: white; cursor: pointer; font-weight: 600; font-size: 13.5px; }
        .infoTravailleur { margin-top: 12px; font-size: 14px; }
        .nomTravailleur { font-weight: 700; color: #12294D; margin: 0 0 4px; }
        .detailTravailleur { font-size: 12.5px; color: #5B6B82; margin: 2px 0; }
        .btnPhoto { display: inline-block; margin-bottom: 12px; padding: 8px 14px; border-radius: 8px; border: 1px dashed #8393A8; font-size: 13px; cursor: pointer; color: #12294D; }
        .suggestions { background: #F5F9FD; padding: 10px; border-radius: 8px; margin-bottom: 12px; }
        .ligneSuggestion { display: flex; justify-content: space-between; align-items: center; font-size: 13px; padding: 4px 0; }
        .btnMini { font-size: 12px; padding: 5px 10px; border-radius: 7px; border: none; background: #12294D; color: white; cursor: pointer; }
        .ligneChamps { display: flex; gap: 8px; margin-bottom: 8px; }
        .flex2 { flex: 2; }
        .flex1 { flex: 1; }
        .listeMeds { font-size: 13px; color: #12294D; padding-left: 18px; }
        .indications { background: #F5F9FD; padding: 12px; border-radius: 8px; margin: 12px 0; }
        .checkMoment { margin-right: 12px; font-size: 13px; }
        .btnValider { width: 100%; margin-top: 12px; padding: 12px; border-radius: 8px; border: none; background: #0E7C3F; color: white; font-weight: 600; cursor: pointer; }
        .titreSucces { color: #0E7C3F; }
        .titreErreur { color: #B8324D; }
      `}</style>
    </div>
  );
}
