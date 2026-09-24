'use client';

import QrCodeCanvas from './QrCodeCanvas';

// Recto de la carte BIGBLU PHARMA PASS.
// Le design (vagues, logo, slogan, bandeau du bas, badge TRAVAILLEUR) est
// une image fixe : /carte-recto-fond.jpg (format carte bancaire 85,6 x 54 mm).
// Seuls la photo, le nom, le matricule et le QR code sont poses par-dessus.
// Toutes les positions sont en % / cqw pour rester identiques quelle que
// soit la taille d'affichage (ecran du telephone ou impression).

export default function CarteRecto({ photoUrl, nomComplet, matricule, qrValue, largeur = '100%' }) {
  const nom = (nomComplet || '').trim().toUpperCase();
  const mat = (matricule || '').trim();
  // Reduit automatiquement la taille du texte si le nom est long
  // Nom long (plus de 16 caracteres) : passe sur 2 lignes au lieu d'etre coupe
  const nomLong = nom.length > 16;
  const tailleNom = nomLong ? 2.7 : Math.min(4.6, 60 / Math.max(nom.length, 1));
  const tailleMat = Math.min(4.6, 58 / Math.max(mat.length, 1));

  return (
    <div className="carte" style={{ width: largeur }}>
      <div className="photo">
        {photoUrl && <img src={photoUrl} alt="" />}
      </div>

      <div className={nomLong ? 'nom nomLong' : 'nom'} style={{ fontSize: `${tailleNom}cqw` }}>{nom}</div>
      <div className="matricule" style={{ fontSize: `${tailleMat}cqw` }}>{mat}</div>

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
          text-overflow: ellipsis;
          letter-spacing: -0.01em;
        }
        .nom { top: 39.3%; }
        .nomLong {
          white-space: normal;
          line-height: 1.05;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
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
