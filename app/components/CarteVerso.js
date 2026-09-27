'use client';

import { Phone, Globe } from 'lucide-react';

// Verso de la carte BIGBLU PHARMA PASS (universel, identique pour tous).
// Le design (vagues, croix, logo, slogan) est une image fixe :
// /carte-verso-fond.jpg (format carte bancaire 85,6 x 54 mm).
// Par-dessus : les regles d'utilisation (a gauche) et le bandeau
// service client + site web (en bas), modifiables dans Parametres.

export default function CarteVerso({ telephone, siteWeb, largeur = '100%' }) {
  return (
    <div className="carte" style={{ width: largeur }}>
      <div className="regles">
        <div className="titre">Carte personnelle et non transférable</div>
        <ul>
          <li>Strictement personnelle.</li>
          <li>À présenter en pharmacie partenaire.</li>
          <li>En cas de perte, contactez le service client.</li>
          <li>Utilisation soumise aux conditions du service.</li>
        </ul>
      </div>

      <div className="bandeau">
        <div className="bloc">
          <span className="icone"><Phone size={12} /></span>
          <div>
            <small>Service client</small>
            <strong>{telephone || '—'}</strong>
          </div>
        </div>
        <div className="separateur" />
        <div className="bloc">
          <span className="icone"><Globe size={12} /></span>
          <div>
            <small>Site web</small>
            <strong>{siteWeb || '—'}</strong>
          </div>
        </div>
      </div>

      <style jsx>{`
        .carte {
          position: relative;
          container-type: inline-size;
          aspect-ratio: 85.6 / 54;
          background: url('/carte-verso-fond.jpg') center / 100% 100% no-repeat;
          border-radius: 4.2cqw;
          overflow: hidden;
          box-sizing: border-box;
          font-family: Roboto, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .regles {
          position: absolute;
          left: 4.5%; top: 12%; width: 29%;
          color: #0E1E5A;
        }
        .titre {
          font-size: 2.3cqw;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 1.4cqw;
        }
        ul {
          margin: 0;
          padding-left: 2.2cqw;
          font-size: 1.85cqw;
          line-height: 1.35;
          color: #173D7B;
        }
        li { margin-bottom: 0.7cqw; }
        .bandeau {
          position: absolute;
          left: 4%; right: 4%; bottom: 5%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3cqw;
          padding: 1.6cqw 3cqw;
          border-radius: 2.4cqw;
          background: rgba(3, 25, 80, 0.55);
          color: white;
        }
        .bloc { display: flex; align-items: center; gap: 1.4cqw; min-width: 0; }
        .icone {
          width: 4.4cqw; height: 4.4cqw; flex-shrink: 0;
          border-radius: 50%;
          background: white; color: #0868EE;
          display: flex; align-items: center; justify-content: center;
        }
        .icone :global(svg) { width: 2.4cqw; height: 2.4cqw; }
        small { display: block; font-size: 1.6cqw; opacity: 0.85; line-height: 1.2; }
        strong { display: block; font-size: 2.3cqw; font-weight: 800; line-height: 1.2; white-space: nowrap; }
        .separateur { width: 1px; align-self: stretch; background: rgba(255,255,255,0.4); }
      `}</style>
    </div>
  );
}
