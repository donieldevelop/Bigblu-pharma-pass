'use client';

import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';

export default function Home() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const avantages = [
    { icone: '/icons/icon-credit.png', titre: 'Un crédit mensuel dédié' },
    { icone: '/icons/icon-securite.png', titre: 'Utilisation simple avec QR Code' },
    { icone: '/icons/icon-pharmacie.png', titre: 'Réseau de pharmacies partenaires' },
    { icone: '/icons/icon-travailleurs.png', titre: 'Pour tous les travailleurs' },
  ];

  return (
    <div className="page">
      <header className="header">
        <img src="/logo.png" alt="BIG BLU HOLDING AFRICA" className="logo" />
        <span className="lang">FR ▾</span>
      </header>

      <section className={`hero ${visible ? 'heroVisible' : ''}`}>
        <div className="heroText">
          <p className="eyebrow">BIG BLU PHARMA PASS</p>
          <h1 className="titre">
            Le crédit <span className="accentBlue">médicament</span> de vos travailleurs, réglé en <span className="accentPurple">pharmacie</span>.
          </h1>
          <p className="paragraphe">
            Une solution simple, sécurisée et accessible pour prendre soin de la santé de ceux
            qui font avancer votre entreprise.
          </p>
        </div>

        <div className="heroVisuel">
          <img src="/pharmacienne.jpg" alt="Pharmacienne partenaire" className="heroPhoto" />
          <div className="bulle">
            <strong>Votre santé, notre priorité</strong>
            <span>Des pharmacies partenaires près de vous.</span>
          </div>
        </div>
      </section>

      <section className="avantages">
        {avantages.map((a, i) => (
          <div key={a.titre} className="avantage">
            <div className={`avantageIcone ${i % 2 === 0 ? 'iconeBleue' : 'iconeViolette'}`}>
              <img src={a.icone} alt="" width={28} height={28} />
            </div>
            <span>{a.titre}</span>
          </div>
        ))}
      </section>

      <section className="boutons">
        <a href="/travailleur/login" className="btnPrimaire">Se connecter <ChevronRight size={18} /></a>
        <a href="/travailleur/inscription" className="btnSecondaire">Créer un compte <ChevronRight size={18} /></a>
      </section>

      <section className="bas">
        <div className="basContenu">
          <div className="passCard">
            <div className="passCardTop">
              <span className="passCardLabel">BIGBLU PHARMA PASS</span>
              <div className="passCardChip" />
            </div>
            <div className="passCardCaption">Plafond mensuel</div>
            <div className="passCardAmount">30 000 FCFA</div>
            <div className="passCardFooter">
              <span>Abonnement : 1 500 F/mois</span>
              <span>BIG HOLDING SA</span>
            </div>
          </div>
          <p className="tagline">Des travailleurs en bonne santé, des entreprises plus fortes.</p>
        </div>
        <p className="proEspace">
          Vous êtes une pharmacie partenaire ? <a href="/pharmacie/login">Accéder à votre espace</a>
        </p>
      </section>

      <style jsx>{`
        .page { background: #EEF2F6; min-height: 100vh; color: #12294D; overflow-x: hidden; }
        .header { display: flex; justify-content: space-between; align-items: center; padding: 20px; }
        .logo { height: 40px; width: auto; }
        .lang { font-size: 13px; font-weight: 600; color: #5B6B82; }

        .hero { position: relative; padding: 12px 16px 28px; display: flex; flex-direction: row; align-items: center; gap: 16px;
          opacity: 0; transform: translateY(14px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .heroVisible { opacity: 1; transform: translateY(0); }
        .heroText { flex: 1.15; min-width: 0; }
        .eyebrow { font-size: 10.5px; letter-spacing: 0.6px; color: #8393A8; margin: 0 0 8px; text-transform: uppercase; }
        .titre { font-size: 22px; line-height: 1.2; font-weight: 800; margin: 0 0 10px; }
        .accentBlue { color: #2E7BC4; }
        .accentPurple { color: #6C4FB3; }
        .paragraphe { font-size: 12.5px; color: #3E4C63; line-height: 1.5; margin: 0; }

        .heroVisuel { flex: 0.85; min-height: 260px; align-self: stretch; border-radius: 18px; overflow: hidden; position: relative;
          background: linear-gradient(135deg, #DCE7F7 0%, #C9D9EF 100%); }
        .heroPhoto { width: 100%; height: 100%; object-fit: cover; object-position: top center; }
        .bulle { position: absolute; bottom: 10px; right: 10px; left: 10px; background: white; border-radius: 12px; padding: 12px 14px;
          box-shadow: 0 8px 20px -6px rgba(18,41,77,0.25); display: flex; flex-direction: column; gap: 3px; }
        .bulle strong { font-size: 12.5px; color: #12294D; }
        .bulle span { font-size: 10.5px; color: #5B6B82; }

        .avantages { padding: 28px 16px 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .avantage { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px; }
        .avantageIcone { width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .iconeBleue { background: #DCE7F7; }
        .iconeViolette { background: #EDE7F9; }
        .avantage span { font-size: 12.5px; color: #3E4C63; font-weight: 600; }

        .boutons { padding: 24px 16px 0; display: flex; flex-direction: column; gap: 10px; }
        .btnPrimaire, .btnSecondaire { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 15px; border-radius: 10px; font-weight: 700; font-size: 14.5px; text-decoration: none; }
        .btnPrimaire { background: #12294D; color: white; }
        .btnSecondaire { background: white; color: #12294D; border: 1px solid #C9D3E0; }

        .bas { margin-top: 32px; background: linear-gradient(180deg, #12294D 0%, #1A3A6B 100%); border-radius: 32px 32px 0 0; padding: 32px 20px 24px; }
        .basContenu { display: flex; flex-direction: column; gap: 20px; }
        .passCard { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: 16px; padding: 20px; color: white; }
        .passCardTop { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 26px; }
        .passCardLabel { font-size: 11px; letter-spacing: 0.5px; opacity: 0.8; }
        .passCardChip { width: 26px; height: 20px; border-radius: 4px; background: #D98E3B; }
        .passCardCaption { font-size: 12px; opacity: 0.7; margin-bottom: 2px; }
        .passCardAmount { font-size: 24px; font-weight: 700; margin-bottom: 16px; }
        .passCardFooter { display: flex; justify-content: space-between; font-size: 11px; opacity: 0.75; gap: 8px; }
        .tagline { color: white; font-size: 16px; font-weight: 600; text-align: center; margin: 0; }
        .proEspace { text-align: center; font-size: 12px; color: rgba(255,255,255,0.6); margin: 24px 0 0; }
        .proEspace a { color: white; font-weight: 600; text-decoration: underline; }

        @media (min-width: 720px) {
          .header { padding: 24px 40px; }
          .hero { padding: 24px 40px 48px; }
          .titre { font-size: 40px; }
          .paragraphe { font-size: 15px; max-width: 480px; }
          .heroVisuel { min-height: 320px; }
          .avantages { grid-template-columns: repeat(4, 1fr); padding: 0 40px; max-width: 1100px; margin: 0 auto; }
          .boutons { flex-direction: row; padding: 0 40px; max-width: 480px; margin: 0 auto; }
          .bas { padding: 56px 40px 36px; }
          .basContenu { flex-direction: row; align-items: center; justify-content: center; gap: 48px; max-width: 1100px; margin: 0 auto; }
          .passCard { width: 320px; flex-shrink: 0; }
          .tagline { text-align: left; max-width: 280px; font-size: 20px; }
        }
      `}</style>
    </div>
  );
}
