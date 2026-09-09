'use client';

import { ArrowLeft, Droplets, Moon, Utensils, Activity, Pill } from 'lucide-react';

const conseils = [
  { Icon: Droplets, titre: 'Hydratez-vous', texte: "Buvez suffisamment d'eau tout au long de la journée, surtout en période de chaleur." },
  { Icon: Moon, titre: 'Dormez suffisamment', texte: 'Un sommeil régulier de 7 à 8 heures aide votre corps à récupérer et à rester en forme.' },
  { Icon: Utensils, titre: 'Mangez équilibré', texte: 'Privilégiez les fruits, légumes et repas variés pour maintenir votre énergie au travail.' },
  { Icon: Activity, titre: 'Bougez régulièrement', texte: "Même de courtes pauses actives dans la journée font une vraie différence sur la durée." },
  { Icon: Pill, titre: 'Respectez vos traitements', texte: 'Suivez les indications de prise données par votre pharmacien, disponibles dans vos reçus.' },
];

export default function ConseilsSantePage() {
  return (
    <div className="screen">
      <a href="/travailleur" className="retour"><ArrowLeft size={18} /> Retour</a>
      <h1 className="titre">Conseils santé</h1>
      <p className="sous">
        Des rappels généraux pour prendre soin de vous. Pour toute question sur un traitement précis,
        adresse-toi à ton pharmacien ou à un médecin.
      </p>

      <div className="liste">
        {conseils.map((c) => (
          <div key={c.titre} className="carte">
            <div className="icone"><c.Icon size={20} /></div>
            <div>
              <strong>{c.titre}</strong>
              <p>{c.texte}</p>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .screen { background: #EEF2F6; min-height: 100vh; padding: 20px; max-width: 480px; margin: 0 auto; }
        .retour { display: inline-flex; align-items: center; gap: 6px; color: #5B6B82; text-decoration: none; font-size: 13px; margin-bottom: 16px; }
        .titre { font-size: 20px; margin: 0 0 6px; color: #12294D; }
        .sous { font-size: 13px; color: #5B6B82; margin: 0 0 18px; line-height: 1.5; }
        .liste { display: flex; flex-direction: column; gap: 10px; }
        .carte { background: white; border-radius: 14px; padding: 16px; display: flex; gap: 14px; align-items: flex-start; }
        .icone { width: 40px; height: 40px; border-radius: 50%; background: #FBEEE1; color: #C0562A; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .carte strong { color: #12294D; font-size: 14px; }
        .carte p { font-size: 12.5px; color: #5B6B82; margin: 4px 0 0; line-height: 1.5; }
      `}</style>
    </div>
  );
}
