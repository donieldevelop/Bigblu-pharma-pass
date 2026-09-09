'use client';

import { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import QrScanner from '../../components/QrScanner';
import { ArrowLeft, MapPin } from 'lucide-react';

export default function ScannerPage() {
  const [pharmacie, setPharmacie] = useState(null);
  const [erreur, setErreur] = useState('');
  const [scanFait, setScanFait] = useState(false);

  async function surResultat(valeur) {
    setScanFait(true);
    setErreur('');
    const { data, error } = await supabase
      .from('pharmacies')
      .select('nom, adresse, statut')
      .eq('qr_code_id', valeur)
      .maybeSingle();
    if (error || !data) {
      setErreur("QR Code non reconnu. Ce n'est peut-être pas un QR Code de pharmacie partenaire.");
      return;
    }
    setPharmacie(data);
  }

  return (
    <div className="screen">
      <a href="/travailleur" className="retour"><ArrowLeft size={18} /> Retour</a>
      <h1 className="titre">Scanner une pharmacie</h1>
      <p className="sous">Scanne le QR Code affiché par la pharmacie partenaire.</p>

      {!scanFait && (
        <div className="scannerWrap">
          <QrScanner onResult={surResultat} />
        </div>
      )}

      {erreur && <p className="erreur">{erreur}</p>}

      {pharmacie && (
        <div className="resultat">
          <MapPin size={22} color="#12294D" />
          <div>
            <strong>{pharmacie.nom}</strong>
            <p>{pharmacie.adresse}</p>
          </div>
          <a href="/travailleur/qrcode" className="bouton">Afficher mon QR Code pour payer</a>
        </div>
      )}

      <style jsx>{`
        .screen { background: #EEF2F6; min-height: 100vh; padding: 20px; max-width: 480px; margin: 0 auto; }
        .retour { display: inline-flex; align-items: center; gap: 6px; color: #5B6B82; text-decoration: none; font-size: 13px; margin-bottom: 16px; }
        .titre { font-size: 20px; margin: 0 0 4px; color: #12294D; }
        .sous { font-size: 13px; color: #5B6B82; margin: 0 0 16px; }
        .scannerWrap { background: white; border-radius: 14px; padding: 16px; }
        .erreur { color: #c0392b; font-size: 13px; margin-top: 12px; }
        .resultat { background: white; border-radius: 14px; padding: 20px; margin-top: 16px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .resultat strong { color: #12294D; }
        .resultat p { font-size: 13px; color: #5B6B82; margin: 0; }
        .bouton { margin-top: 12px; background: #12294D; color: white; padding: 10px 18px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 600; }
      `}</style>
    </div>
  );
}
