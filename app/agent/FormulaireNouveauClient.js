'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function FormulaireNouveauClient({ session, onCree, onFermer }) {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [entreprise, setEntreprise] = useState('');
  const [envoi, setEnvoi] = useState(false);
  const [error, setError] = useState('');
  const [resultat, setResultat] = useState(null);
  const [copie, setCopie] = useState(false);

  async function soumettre(e) {
    e.preventDefault();
    setEnvoi(true);
    setError('');
    try {
      const res = await fetch('/api/agent/creer-client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + session.access_token,
        },
        body: JSON.stringify({ nom, prenom, telephone, email, entreprise }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur inconnue');
      setResultat(data);
    } catch (err) {
      setError(err.message);
    }
    setEnvoi(false);
  }

  function copierAcces() {
    const texte = 'BIGBLU PHARMA PASS\n'
      + 'Code client : ' + resultat.code_client + '\n'
      + 'E-mail : ' + resultat.email + '\n'
      + 'Mot de passe : ' + resultat.mot_de_passe_temporaire + '\n'
      + 'Connexion : a changer des la premiere connexion, dans "Mon profil".';
    navigator.clipboard.writeText(texte);
    setCopie(true);
    setTimeout(() => setCopie(false), 2000);
  }

  if (resultat) {
    return (
      <div className="fond">
        <div className="boite">
          <Check size={36} color="#0E7C3F" />
          <h3>Client créé</h3>
          <p className="souscription">Communique ces accès au client (SMS, WhatsApp, papier...). Il pourra changer son mot de passe dans son profil.</p>
          <div className="acces">
            <div><span>Code client</span><strong>{resultat.code_client}</strong></div>
            <div><span>E-mail</span><strong>{resultat.email}</strong></div>
            <div><span>Mot de passe</span><strong>{resultat.mot_de_passe_temporaire}</strong></div>
          </div>
          <button onClick={copierAcces} className="btnCopier"><Copy size={14} /> {copie ? 'Copié !' : 'Copier les accès'}</button>
          <button onClick={onCree} className="btnFermer">Terminer</button>
        </div>
        <style jsx>{`
          .fond { position: fixed; inset: 0; background: rgba(18,41,77,0.5); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 20px; }
          .boite { background: white; border-radius: 16px; padding: 28px; max-width: 360px; width: 100%; text-align: center; }
          .boite h3 { color: #12294D; margin: 10px 0 6px; }
          .souscription { color: #5B6B82; font-size: 12.5px; line-height: 1.5; margin: 0 0 16px; }
          .acces { text-align: left; background: #F5F9FD; border-radius: 10px; padding: 12px 14px; margin-bottom: 16px; }
          .acces div { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #12294D; }
          .acces span { color: #8393A8; }
          .btnCopier { width: 100%; display: flex; align-items: center; justify-content: center; gap: 6px; background: white; border: 1px solid #12294D; color: #12294D; padding: 10px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; margin-bottom: 10px; }
          .btnFermer { width: 100%; background: #12294D; color: white; border: none; padding: 12px; border-radius: 10px; font-weight: 600; font-size: 14px; cursor: pointer; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="fond">
      <form onSubmit={soumettre} className="boite">
        <h3>Nouveau client</h3>
        <input placeholder="Prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} required style={inputStyle} />
        <input placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} required style={inputStyle} />
        <input placeholder="Téléphone" value={telephone} onChange={(e) => setTelephone(e.target.value)} required style={inputStyle} />
        <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
        <input placeholder="Entreprise (optionnel)" value={entreprise} onChange={(e) => setEntreprise(e.target.value)} style={inputStyle} />
        {error && <p style={{ color: '#c0392b', fontSize: 13 }}>{error}</p>}
        <div className="boutons">
          <button type="button" onClick={onFermer} className="btnAnnuler">Annuler</button>
          <button type="submit" disabled={envoi} className="btnValider">{envoi ? '...' : 'Créer'}</button>
        </div>
      </form>
      <style jsx>{`
        .fond { position: fixed; inset: 0; background: rgba(18,41,77,0.5); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 20px; }
        .boite { background: white; border-radius: 16px; padding: 24px; max-width: 340px; width: 100%; }
        .boite h3 { color: #12294D; margin: 0 0 16px; }
        .boutons { display: flex; gap: 10px; margin-top: 6px; }
        .btnAnnuler { flex: 1; background: #F0F2F5; border: none; padding: 12px; border-radius: 10px; font-weight: 600; font-size: 13px; cursor: pointer; }
        .btnValider { flex: 1; background: #12294D; color: white; border: none; padding: 12px; border-radius: 10px; font-weight: 600; font-size: 13px; cursor: pointer; }
      `}</style>
    </div>
  );
}

const inputStyle = { width: '100%', padding: 10, marginBottom: 12, borderRadius: 6, border: '1px solid #ddd', fontSize: 14 };
