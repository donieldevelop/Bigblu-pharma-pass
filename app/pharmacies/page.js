'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { MapPin, ArrowLeft, Search } from 'lucide-react';

export default function PharmaciesPubliquesPage() {
  const [pharmacies, setPharmacies] = useState(null);
  const [recherche, setRecherche] = useState('');

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('pharmacies')
        .select('id, nom, adresse, latitude, longitude')
        .eq('statut', 'active')
        .order('nom', { ascending: true });
      setPharmacies(data || []);
    })();
  }, []);

  function itineraire(p) {
    const url = 'https://www.google.com/maps/dir/?api=1&destination=' + p.latitude + ',' + p.longitude;
    window.open(url, '_blank');
  }

  const filtrees = (pharmacies || []).filter((p) => {
    const q = recherche.toLowerCase();
    return p.nom.toLowerCase().includes(q) || (p.adresse || '').toLowerCase().includes(q);
  });

  return (
    <div className="ecran">
      <div className="contenu">
        <div className="entete">
          <a href="/" className="retour"><ArrowLeft size={18} /> Accueil</a>
          <img src="/logo.png" alt="BIGBLU" className="logo" />
        </div>

        <h1>Nos pharmacies partenaires</h1>
        <p className="sousTitre">
          {pharmacies ? pharmacies.length + ' pharmacie(s) partenaire(s) dans le réseau BIGBLU PHARMA PASS.' : 'Chargement...'}
        </p>

        <div className="recherche">
          <Search size={16} color="#8393A8" />
          <input
            placeholder="Rechercher par nom ou quartier..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
        </div>

        {pharmacies === null ? (
          <p className="vide">Chargement des pharmacies...</p>
        ) : filtrees.length === 0 ? (
          <p className="vide">Aucune pharmacie ne correspond à ta recherche.</p>
        ) : (
          <div className="liste">
            {filtrees.map((p) => (
              <div key={p.id} className="carte">
                <div className="icone"><MapPin size={18} color="#2E7BC4" /></div>
                <div className="infos">
                  <strong>{p.nom}</strong>
                  <span>{p.adresse}</span>
                </div>
                {p.latitude && p.longitude && (
                  <button onClick={() => itineraire(p)} className="btnItineraire">Itinéraire</button>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="cta">
          <p>Envie de profiter de ton crédit médicament dans ces pharmacies ?</p>
          <a href="/travailleur/inscription" className="btnInscription">Créer mon compte</a>
        </div>
      </div>

      <style jsx>{`
        .ecran { background: #EEF2F6; min-height: 100vh; font-family: var(--font-body), sans-serif; }
        .contenu { max-width: 560px; margin: 0 auto; padding: 20px 20px 60px; }
        .entete { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .retour { display: inline-flex; align-items: center; gap: 6px; color: #5B6B82; text-decoration: none; font-size: 13px; }
        .logo { height: 34px; }
        h1 { font-family: var(--font-display), sans-serif; font-size: 22px; color: #0B1B33; margin: 0 0 4px; }
        .sousTitre { color: #5B6B82; font-size: 13px; margin: 0 0 20px; }
        .recherche { display: flex; align-items: center; gap: 8px; background: white; border-radius: 12px; padding: 12px 14px; margin-bottom: 18px; }
        .recherche input { border: none; outline: none; font-size: 13.5px; flex: 1; background: transparent; }
        .vide { color: #8393A8; font-size: 13px; text-align: center; padding: 30px 0; }
        .liste { display: flex; flex-direction: column; gap: 10px; }
        .carte { background: white; border-radius: 14px; padding: 14px; display: flex; align-items: center; gap: 12px; }
        .icone { width: 38px; height: 38px; border-radius: 50%; background: #DCE7F7; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .infos { flex: 1; min-width: 0; }
        .infos strong { display: block; color: #12294D; font-size: 14.5px; }
        .infos span { display: block; color: #8393A8; font-size: 12px; margin-top: 2px; }
        .btnItineraire { flex-shrink: 0; background: #12294D; color: white; border: none; padding: 8px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; }
        .cta { margin-top: 32px; background: linear-gradient(120deg, #12294D, #4c1d95); border-radius: 16px; padding: 22px; text-align: center; }
        .cta p { color: white; font-size: 14px; margin: 0 0 14px; }
        .btnInscription { display: inline-block; background: white; color: #12294D; padding: 12px 22px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 13.5px; }
      `}</style>
    </div>
  );
}
