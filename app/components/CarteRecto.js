'use client';

import { useEffect, useRef } from 'react';
import QrCodeCanvas from './QrCodeCanvas';

// Ajuste la taille du texte pour qu'il tienne EN ENTIER dans sa zone,
// en mesurant le rendu reel (la police varie selon le telephone).
// 1) une ligne, de 4.6cqw jusqu'a 3.0cqw ; 2) sinon deux lignes, de 2.9cqw jusqu'a 1.8cqw.
function ajusterTexte(el, deuxLignesPermises) {
  if (!el) return;
  el.classList.remove('deuxLignes');
  let taille = 4.6;
  el.style.fontSize = taille + 'cqw';
  while (el.scrollWidth > el.clientWidth + 1 && taille > 3.0) {
    taille -= 0.1;
    el.style.fontSize = taille.toFixed(1) + 'cqw';
  }
  if (el.scrollWidth <= el.clientWidth + 1 || !deuxLignesPermises) return;
  el.classList.add('deuxLignes');
  taille = 2.9;
  el.style.fontSize = taille + 'cqw';
  while (el.scrollHeight > el.clientHeight + 1 && taille > 1.8) {
    taille -= 0.1;
    el.style.fontSize = taille.toFixed(1) + 'cqw';
  }
}

// Recto de la carte BIGBLU PHARMA PASS.
// Le design (vagues, logo, slogan, bandeau du bas, badge TRAVAILLEUR) est
// une image fixe : /carte-recto-fond.jpg (format carte bancaire 85,6 x 54 mm).
// Seuls la photo, le nom, le matricule et le QR code sont poses par-dessus.
// Toutes les positions sont en % / cqw pour rester identiques quelle que
// soit la taille d'affichage (ecran du telephone ou impression).

export default function CarteRecto({ photoUrl, nomComplet, matricule, qrValue, largeur = '100%' }) {
  const nom = (nomComplet || '').trim().toUpperCase();
  const mat = (matricule || '').trim();
  const nomRef = useRef(null);
  const matRef = useRef(null);

  useEffect(() => {
    const ajuster = () => {
      ajusterTexte(nomRef.current, true);
      ajusterTexte(matRef.current, false);
    };
    ajuster();
    // Re-mesure quand les polices sont chargees et si la carte change de taille
    if (document.fonts?.ready) document.fonts.ready.then(ajuster);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(ajuster) : null;
    if (ro && nomRef.current) ro.observe(nomRef.current.parentElement);
    return () => ro && ro.disconnect();
  }, [nom, mat]);

  return (
    <div className="carte" style={{ width: largeur }}>
      <div className="photo">
        {photoUrl && <img src={photoUrl} alt="" />}
      </div>

      <div ref={nomRef} className="nom">{nom}</div>
      <div ref={matRef} className="matricule">{mat}</div>

      <div className="qr">
        {qrValue && <QrCodeCanvas value={qrValue} size={320} />}
      </div>

      <style jsx>{`
        .carte {
          position: relative;
          container-type: inline-size;
          aspect-ratio: 85.6 / 54;
          background: url('/carte-recto-fond.jpg') center / 100% 100% no-repeat;
          border-radius: 4.2cqw;
          overflow: hidden;
          box-sizing: border-box;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .photo {
          position: absolute;
          left: 3.95%; top: 29.8%; width: 23%; height: 48%;
          border-radius: 1.6cqw;
          overflow: hidden;
        }
        /* Fond uni du cadre derriere une photo detouree (fond transparent) */
        .photo:has(img) { background: #C8DBF4; }
        .photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .nom, .matricule {
          position: absolute;
          left: 29.7%; width: 36%;
          transform: translateY(-50%);
          font-family: Roboto, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
          font-weight: 800;
          color: #0E1E5A;
          line-height: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: clip;
          letter-spacing: -0.01em;
        }
        .nom { top: 39.3%; }
        .nom.deuxLignes {
          white-space: normal;
          line-height: 1.05;
          height: 2.2em;
          display: flex;
          align-items: center;
          text-overflow: clip;
          top: 39.6%;
        }
        .matricule { top: 56.1%; }
        .qr {
          position: absolute;
          left: 70.4%; top: 34%; width: 21.1%; height: 35.3%;
          display: flex; align-items: center; justify-content: center;
        }
        .qr :global(canvas) {
          width: 100% !important;
          height: 100% !important;
          object-fit: contain;
          image-rendering: pixelated;
        }
      `}</style>
    </div>
  );
}
