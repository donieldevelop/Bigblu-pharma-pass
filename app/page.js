'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="page">
      <header className="header">
        <span className="brand">
          <img src="/logo.png" alt="BIG BLU" className="brandLogo" />
          BIG BLU PHARMA PASS
        </span>
        <span className="brandSub">Un service BIG HOLDING SA</span>
      </header>

      <section className={`hero ${visible ? 'heroVisible' : ''}`}>
        <div className="heroText">
          <h1 className="heroTitle">Le crédit médicament de vos travailleurs, réglé en pharmacie.</h1>
          <p className="heroParagraph">
            Chaque travailleur abonné dispose d&apos;un plafond mensuel qu&apos;il utilise directement
            chez une pharmacie partenaire, identifié par son QR Code personnel.
          </p>
          <p className="heroNote">Réseau de pharmacies partenaires en expansion.</p>
        </div>

        <div
          className={`passCard ${hover ? 'passCardHover' : ''}`}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <div className="passCardTop">
            <span className="passCardLabel">BIGBLU PHARMA PASS</span>
            <div className="passCardChip" />
          </div>
          <div className="passCardCaption">Plafond mensuel</div>
          <div className="passCardAmount">30 000 FCFA</div>
          <div className="passCardFooter">
            <span>Abonnement 1 500 F/mois</span>
            <span>BIG HOLDING SA</span>
          </div>
        </div>
      </section>

      <section className="espaces">
        <div className="espacesGrid">
          <EspaceCard
            titre="Travailleur"
            texte="Ton crédit disponible, ton QR Code, tes reçus et l'historique de tes médicaments, directement depuis ton téléphone."
            accent="#12294D"
            lien="/travailleur/login"
            lienTexte="Accéder à mon espace"
          />
          <EspaceCard
            titre="Pharmacie partenaire"
            texte="Identifie le travailleur, enregistre les médicaments délivrés et valide la transaction en quelques secondes."
            accent="#D98E3B"
            lien="/pharmacie/login"
            lienTexte="Se connecter"
          />
        </div>
      </section>

      <footer className="footer">BIG BLU PHARMA PASS — BIG HOLDING SA</footer>

      <style jsx>{`
        .page {
          background: #eef2f6;
          min-height: 100vh;
          color: #12294d;
          overflow-x: hidden;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          padding: 20px 20px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 0.2px;
        }
        .brandLogo {
          height: 24px;
          width: auto;
        }
        .brandSub {
          font-size: 12px;
          color: #5b6b82;
        }

        .hero {
          max-width: 1100px;
          margin: 0 auto;
          padding: 24px 20px 48px;
          display: flex;
          flex-direction: column;
          gap: 32px;
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .heroVisible {
          opacity: 1;
          transform: translateY(0);
        }
        .heroTitle {
          font-size: 30px;
          line-height: 1.18;
          font-weight: 800;
          margin: 0 0 14px;
        }
        .heroParagraph {
          font-size: 15px;
          color: #3e4c63;
          line-height: 1.6;
          margin: 0 0 10px;
        }
        .heroNote {
          font-size: 13px;
          color: #5b6b82;
          margin: 0;
        }

        .passCard {
          background: linear-gradient(135deg, #12294d 0%, #1f4478 100%);
          border-radius: 16px;
          padding: 22px;
          color: white;
          width: 100%;
          max-width: 340px;
          box-shadow: 0 20px 40px -12px rgba(18, 41, 77, 0.35);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .passCardHover {
          transform: translateY(-4px);
          box-shadow: 0 28px 50px -14px rgba(18, 41, 77, 0.45);
        }
        .passCardTop {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }
        .passCardLabel {
          font-size: 11px;
          letter-spacing: 0.6px;
          opacity: 0.75;
        }
        .passCardChip {
          width: 28px;
          height: 21px;
          border-radius: 4px;
          background: #d98e3b;
          flex-shrink: 0;
        }
        .passCardCaption {
          font-size: 12px;
          opacity: 0.7;
          margin-bottom: 4px;
        }
        .passCardAmount {
          font-size: 26px;
          font-weight: 700;
          margin-bottom: 22px;
        }
        .passCardFooter {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          opacity: 0.75;
          gap: 8px;
        }

        .espaces {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 20px 64px;
        }
        .espacesGrid {
          display: flex;
          flex-direction: column;
          gap: 1px;
          background: #d7dfe8;
        }
        .footer {
          border-top: 1px solid #d7dfe8;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #8393a8;
        }

        /* Tablette et plus */
        @media (min-width: 640px) {
          .header {
            padding: 24px 32px;
          }
          .brand {
            font-size: 15px;
          }
          .brandLogo {
            height: 28px;
          }
          .brandSub {
            font-size: 13px;
          }
          .hero {
            padding: 32px 32px 64px;
          }
          .heroTitle {
            font-size: 38px;
          }
          .heroParagraph {
            font-size: 16px;
            max-width: 480px;
          }
          .espaces {
            padding: 0 32px 80px;
          }
          .footer {
            padding: 24px 32px;
          }
        }

        /* Ordinateur : deux colonnes cote a cote */
        @media (min-width: 900px) {
          .header {
            padding: 24px 48px;
          }
          .hero {
            flex-direction: row;
            align-items: center;
            padding: 40px 48px 72px;
            gap: 56px;
          }
          .heroText {
            flex: 1.1;
          }
          .heroTitle {
            font-size: 44px;
            max-width: 480px;
          }
          .passCard {
            flex: 0.9;
            margin-left: auto;
          }
          .espaces {
            padding: 0 48px 96px;
          }
          .espacesGrid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
          }
          .footer {
            padding: 24px 48px;
          }
        }
      `}</style>
    </div>
  );
}

function EspaceCard({ titre, texte, accent, lien, lienTexte }) {
  return (
    <div className="espaceCard" style={{ borderLeftColor: accent }}>
      <h3 className="espaceTitre">{titre}</h3>
      <p className="espaceTexte">{texte}</p>
      {lien && (
        <a href={lien} className="espaceLien" style={{ color: accent }}>
          {lienTexte} →
        </a>
      )}
      <style jsx>{`
        .espaceCard {
          background: #eef2f6;
          padding: 24px 20px;
          border-left: 3px solid;
        }
        .espaceTitre {
          font-size: 16px;
          margin: 0 0 10px;
        }
        .espaceTexte {
          font-size: 13.5px;
          color: #3e4c63;
          line-height: 1.55;
          margin: 0 0 16px;
        }
        .espaceLien {
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}
